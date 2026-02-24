const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const url = {
    'group': 'https://www.acmicpc.net/group/ranklist/22125',
    'profile': 'https://solved.ac/api/v3/user/show?handle='
};
const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
};
const ranks = ["unranked", "b5", "b4", "b3", "b2", "b1", "s5", "s4", "s3", "s2", "s1", "g5", "g4", "g3", "g2", "g1", "p5", "p4", "p3", "p2", "p1", "d5", "d4", "d3", "d2", "d1", "r5", "r4", "r3", "r2", "r1", "master"];

async function getUserList() {
    try {
        const response = await axios.get(url['group'], { headers });

        if (response.status === 200) {
            const $ = cheerio.load(response.data);
            const rows = $('#ranklist tbody tr').toArray();
            
            // 1. 각 행에 대해 비동기 작업을 수행하는 Promise 배열을 생성합니다.
            const promises = rows.map(async (element) => {
                const tds = $(element).find('td');
                const userId = $(tds[1]).text().trim();

                if (userId) {
                    // getRank(비동기 함수)를 여기서 호출하지만 기다리지 않고 Promise만 반환합니다.
                    const userInfo = await getUserInfo(userId);
                    return {
                        userId: userId,
                        data: {
                            rank: ranks[userInfo['tier']],
                            solvedCount: userInfo['solvedCount']
                        }
                    };
                }
                return null;
            });

            // 2. Promise.all을 사용해 모든 요청이 병렬로 실행되도록 하고 전체가 끝날 때까지 기다립니다.
            const results = await Promise.all(promises);

            // 3. 배열로 받은 결과를 다시 객체(userIds) 형태로 변환합니다.
            const userIds = {};
            results.forEach(res => {
                if (res) {
                    userIds[res.userId] = res.data;
                }
            });

            fs.writeFileSync('userList.json', JSON.stringify({
                userCount: userIds.length,
                users: userIds,
                lastUpdate: new Date().toISOString()
            }, null, 2));
        }
    } catch (error) {
        console.error("[getUserList] 오류 발생:", error.message);
    }
}

async function getUserInfo(userId) {
    try {
        // HTTP GET 요청 전송
        const response = await axios.get(url['profile'] + userId);
        const data = response.data;
        return data;
    } catch (error) {
        console.error("[getRank] 오류 발생:", error.message);
    }
}

// 함수 실행
getUserList();