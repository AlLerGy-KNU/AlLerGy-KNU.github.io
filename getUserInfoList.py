# solved.ac 멤버 정보 갱신 스크립트 (getUserInfoList.js의 파이썬 이식판)
# - 순차 요청 + 딜레이로 solved.ac rate limit / IP 차단 회피
# - 요청이 하나라도 최종 실패하면 파일을 쓰지 않고 exit 1 (데이터 원자성 보장)
# GitHub Actions에서 매일 실행됨: .github/workflows/update-solved.yml

import json
import sys
import time
from datetime import datetime, timezone
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

PROFILE_URL = "https://solved.ac/api/v3/user/show?handle="

PATH = {
    "userIdList": "./userIdList.json",
    "userInfoList": "./userInfoList.json",
    "news": "./news.json",
}

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "application/json",
    "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
}

REQUEST_DELAY_SEC = 1.0   # 요청 간격 (버스트 방지)
MAX_RETRIES = 3           # 요청 실패 시 재시도 횟수
RETRY_BACKOFF_SEC = 10    # 재시도 대기 (회차마다 2배)


def js_date_string(dt=None):
    """JS의 new Date().toString()과 같은 형식 — 프론트의 new Date(str) 파싱과 호환"""
    dt = dt or datetime.now(timezone.utc)
    return dt.strftime("%a %b %d %Y %H:%M:%S GMT+0000 (Coordinated Universal Time)")


def get_user_info(user_id):
    """유저 1명 조회. 404는 solved.ac 미가입으로 처리, 그 외 실패는 재시도 후 예외."""
    for attempt in range(MAX_RETRIES):
        try:
            req = Request(PROFILE_URL + user_id, headers=HEADERS)
            with urlopen(req, timeout=15) as res:
                return json.load(res)
        except HTTPError as e:
            if e.code == 404:
                return {"handle": user_id, "tier": 0, "solvedCount": None}
            print(f"[getUserInfo] {user_id}: HTTP {e.code} (시도 {attempt + 1}/{MAX_RETRIES})")
        except URLError as e:
            print(f"[getUserInfo] {user_id}: {e.reason} (시도 {attempt + 1}/{MAX_RETRIES})")
        time.sleep(RETRY_BACKOFF_SEC * (2 ** attempt))
    raise RuntimeError(f"{user_id} 조회 실패 — 파일을 갱신하지 않고 종료합니다.")


def main():
    with open(PATH["userIdList"], encoding="utf-8") as f:
        user_id_list = json.load(f)["userIdList"]

    try:
        with open(PATH["userInfoList"], encoding="utf-8") as f:
            pre_user_info_list = json.load(f)
    except FileNotFoundError:
        pre_user_info_list = None

    try:
        with open(PATH["news"], encoding="utf-8") as f:
            news = json.load(f)
    except FileNotFoundError:
        news = {"log": [], "lastUpdate": ""}

    today = js_date_string()
    users = {}
    new_logs = []

    for user_id in user_id_list:
        if not user_id:
            continue
        info = get_user_info(user_id)
        time.sleep(REQUEST_DELAY_SEC)

        users[user_id] = {"rank": info["tier"], "solvedCount": info["solvedCount"]}

        # 티어 변동 및 n백번째 문제풀이 히스토리 (기존 JS 로직과 동일)
        pre = (pre_user_info_list or {}).get("users", {}).get(user_id)
        if pre is None:
            continue

        pre_tier = int(pre["rank"])
        now_tier = int(info["tier"])
        if pre_tier != now_tier:
            new_logs.append({
                "type": "tier", "date": today, "userId": user_id,
                "preTier": pre_tier, "nowTier": now_tier,
            })

        if info["solvedCount"] is not None and pre["solvedCount"] is not None:
            pre_solved = int(pre["solvedCount"])
            now_solved = int(info["solvedCount"])
            if pre_solved < 100 and now_solved < 100:
                if pre_solved // 10 != now_solved // 10:
                    new_logs.append({
                        "type": "solved", "date": today, "userId": user_id,
                        "solvedCount": now_solved // 10 * 10,
                    })
            elif pre_solved // 100 != now_solved // 100:
                new_logs.append({
                    "type": "solved", "date": today, "userId": user_id,
                    "solvedCount": now_solved // 100 * 100,
                })

    sorted_users = dict(sorted(
        users.items(),
        key=lambda kv: kv[1]["solvedCount"] if kv[1]["solvedCount"] is not None else -1,
        reverse=True,
    ))

    with open(PATH["userInfoList"], "w", encoding="utf-8") as f:
        json.dump({
            "userCount": len(sorted_users),
            "users": sorted_users,
            "lastUpdate": today,
        }, f, ensure_ascii=False, indent=2)

    news["log"] = new_logs + news["log"]
    news["lastUpdate"] = today
    with open(PATH["news"], "w", encoding="utf-8") as f:
        json.dump(news, f, ensure_ascii=False, indent=4)

    print(f"완료: 멤버 {len(sorted_users)}명 갱신, 새 히스토리 {len(new_logs)}건")


if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print(f"[getUserInfoList] 오류 발생: {e}", file=sys.stderr)
        sys.exit(1)
