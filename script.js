document.addEventListener("DOMContentLoaded", async function () {
    // data.js에서 데이터 불러와서 HTML에 넣기
    const descriptionBox = document.querySelector(".allergy-box-context");
    const activity_box_title2 = document.querySelector(".activity-box-title2");
    const activity_box_context = document.querySelector(".activity-box-context");
    const footerInfoBox = document.querySelectorAll(".footer-box-context")[0];
    const contactBtnLink = document.getElementById("contact-btn-link");
    const socialEmailLink = document.getElementById("social-email-link");

    if (typeof info !== 'undefined') {
        if (descriptionBox) descriptionBox.innerHTML = info.description;
        if (activity_box_title2) activity_box_title2.innerHTML = info["activity-box-title2"];
        if (activity_box_context) activity_box_context.innerHTML = info["activity-box-context"];
        if (footerInfoBox) footerInfoBox.innerHTML = `지도교수 : ${info.professor}<br>회장 : ${info.leader}<br>featuring : ${info.featuring}<br><br>email : ${info.email}`;
        if (contactBtnLink) contactBtnLink.href = `mailto:${info.email}`;
        if (socialEmailLink) socialEmailLink.href = `mailto:${info.email}`;
    }

    // Activity 사진 슬라이더
    const sliderTrack = document.getElementById("activity-slider-track");
    if (sliderTrack && typeof activityImages !== 'undefined' && activityImages.length > 0) {
        const slider = document.getElementById("activity-slider");
        const dotsBox = document.getElementById("activity-dots");
        const AUTO_INTERVAL = 4000;
        let current = 0;
        let autoTimer = null;

        sliderTrack.innerHTML = activityImages.map((src, i) =>
            `<img src="${src}" alt="활동 사진 ${i + 1}" loading="lazy">`
        ).join('');
        dotsBox.innerHTML = activityImages.map((_, i) =>
            `<button class="activity-slider-dot" type="button" aria-label="${i + 1}번 사진으로 이동"></button>`
        ).join('');
        const dots = [...dotsBox.children];

        const goTo = (i) => {
            current = (i + activityImages.length) % activityImages.length;
            sliderTrack.style.transform = `translateX(-${current * 100}%)`;
            dots.forEach((dot, idx) => dot.classList.toggle("active", idx === current));
        };

        const startAuto = () => {
            clearInterval(autoTimer);
            autoTimer = setInterval(() => goTo(current + 1), AUTO_INTERVAL);
        };

        // 수동 조작 시 자동 재생 타이머를 처음부터 다시 시작
        const manualGo = (i) => { goTo(i); startAuto(); };

        document.getElementById("activity-prev").addEventListener("click", () => manualGo(current - 1));
        document.getElementById("activity-next").addEventListener("click", () => manualGo(current + 1));
        dots.forEach((dot, i) => dot.addEventListener("click", () => manualGo(i)));

        // 마우스를 올리는 동안 자동 재생 일시정지
        slider.addEventListener("mouseenter", () => clearInterval(autoTimer));
        slider.addEventListener("mouseleave", startAuto);

        // 모바일 스와이프
        let touchStartX = null;
        slider.addEventListener("touchstart", (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
        slider.addEventListener("touchend", (e) => {
            if (touchStartX === null) return;
            const deltaX = e.changedTouches[0].clientX - touchStartX;
            if (Math.abs(deltaX) > 40) manualGo(deltaX < 0 ? current + 1 : current - 1);
            touchStartX = null;
        }, { passive: true });

        goTo(0);
        startAuto();
    }

    // 유저 데이터 불러오기 및 생성
    const container = document.querySelector(".auto-js");
    const rankClassMap = {
        "u": "member-rank-u",
        "b": "member-rank-b",
        "s": "member-rank-s",
        "g": "member-rank-g",
        "p": "member-rank-p",
        "d": "member-rank-d",
        "r": "member-rank-r",
        "m": "member-rank-m"
    };

    try {
        const response = await fetch('./userInfoList.json');
        if (!response.ok) throw new Error("[script.js] userInfoList.json 데이터를 불러오지 못했습니다.");
        
        const jsonData = await response.json();
        const users = jsonData.users;
        const ranks = ["unranked", "b5", "b4", "b3", "b2", "b1", "s5", "s4", "s3", "s2", "s1", "g5", "g4", "g3", "g2", "g1", "p5", "p4", "p3", "p2", "p1", "d5", "d4", "d3", "d2", "d1", "r5", "r4", "r3", "r2", "r1", "master"];

        // 전체 멤버 수 표기
        const memberTitle = document.getElementById("memberTitle");
        if (memberTitle) memberTitle.innerHTML = `멤버 (${Object.keys(users).length}명)`;


        // 티어 높은 순 정렬 (동률이면 푼 문제 수 순)
        const sortedUsers = Object.entries(users).sort(([, a], [, b]) =>
            (b.rank - a.rank) || ((b.solvedCount ?? 0) - (a.solvedCount ?? 0))
        );

        sortedUsers.forEach(([solvedId, info]) => {
            let { rank, solvedCount } = info;
            rank = ranks[rank];

            // 지도교수 id
            if (solvedId == memberPage.professor.id) {
                document.getElementById('member-box-professor-rank-box').className = `members-container ${rankClassMap[rank.charAt(0)] || ""}`;
                document.getElementById('member-box-professor-rank-img').src = `./img/rank/${rank}.svg`;
                document.getElementById('member-box-professor-id').innerText = solvedId;
                document.getElementById('member-box-professor-statusMessage').innerText = memberPage.professor.statusMessage;
            } 
            // 동아리 회장 id
            else if (solvedId == memberPage.leader.id) {
                document.getElementById('member-box-leader-rank-box').className = `members-container ${rankClassMap[rank.charAt(0)] || ""}`;
                document.getElementById('member-box-leader-rank-img').src = `./img/rank/${rank}.svg`;
                document.getElementById('member-box-leader-id').innerText = solvedId;
                document.getElementById('member-box-leader-statusMessage').innerText = memberPage.leader.statusMessage;
            } 
            // 일반 부원
            else {
                const memberDiv = document.createElement("div");
                memberDiv.classList.add("members-container");
    
                if (!!rank) {
                    const rankKey = rank.charAt(0);
                    const rankClass = rankClassMap[rankKey] || "";
                    
                    if (rankClass) memberDiv.classList.add(rankClass);
    
                    const img = document.createElement("img");
                    img.src = `./img/rank/${rank}.svg`;
                    img.alt = `rank ${rank}`;
                    memberDiv.appendChild(img);
                }
    
                const contextDiv = document.createElement("div");
                contextDiv.classList.add("members-container-context");
    
                const idDiv = document.createElement("div");
                idDiv.classList.add("members-container-context-id");
                idDiv.textContent = solvedId;
    
                const textDiv = document.createElement("div");
                textDiv.classList.add("members-container-context-text");
    
                // 푼 문제 수 출력
                // solved.ac 미가입 계정 예외처리
                if (solvedCount == null) {
                    textDiv.textContent = "Solved.ac 미가입";
                } else {
                    // 세 자리수마다 콤마 찍어주기
                    const formattedCount = Number(solvedCount).toLocaleString();
                    textDiv.textContent = `${formattedCount}문제 해결`;
                }
    
                contextDiv.appendChild(idDiv);
                contextDiv.appendChild(textDiv);
                memberDiv.appendChild(contextDiv);
    
                if (container) container.appendChild(memberDiv);
            }
        });

    } catch (error) {
        console.error("Error:", error);
        if (container) container.innerHTML = `<p style="color:white;">데이터를 로드하는 중 오류가 발생했습니다.</p>`;
    }

    // 모바일 멤버 접기/펼치기 (CSS 미디어쿼리에서 모바일일 때만 적용됨)
    const membersToggle = document.getElementById("members-toggle");
    if (membersToggle && container) {
        const VISIBLE_COUNT = 12;
        const hiddenCount = container.querySelectorAll(".members-container").length - VISIBLE_COUNT;
        if (hiddenCount > 0) {
            container.classList.add("collapsed");
            membersToggle.textContent = `멤버 전체 보기 (+${hiddenCount}명)`;
            membersToggle.addEventListener("click", () => {
                const collapsed = container.classList.toggle("collapsed");
                membersToggle.textContent = collapsed ? `멤버 전체 보기 (+${hiddenCount}명)` : "접기";
                // 접을 때 화면이 페이지 아래에 남지 않도록 멤버 목록 위치로 복귀
                if (collapsed) document.getElementById("memberTitle")?.scrollIntoView({ block: "start" });
            });
        } else {
            membersToggle.style.display = "none";
        }
    }

    // 활동내역 로드
    const historyContainer = document.getElementById("history-container");
    if (!historyContainer || typeof history === 'undefined') return;

    const historyTypeMap = {
        award:   { label: "수상", class: "chip-award" },
        paper:   { label: "논문", class: "chip-paper" },
        contest: { label: "대회", class: "chip-contest" },
        event:   { label: "활동", class: "chip-event" }
    };

    historyContainer.innerHTML = history.map(item => `
        <div class="history-box-right-text-box">
            <div class="history-box-right-text-box-title">
                ${item.year}
                ${item.leader ? `<span class="history-leader-tag">${item.leader}</span>` : ''}
            </div>
            <div class="history-box-right-text-box-text">
                ${item.contents.map(content => {
                    const type = historyTypeMap[content.type] || historyTypeMap.event;
                    return `<div class="history-item">
                        <span class="history-chip ${type.class}">${type.label}</span>
                        <span class="history-item-text">${content.text}</span>
                    </div>`;
                }).join('')}
            </div>
        </div>
    `).join('');

    // 요약 숫자 (논문 n편 · 수상 n회)
    const statsBox = document.getElementById("history-stats");
    if (statsBox) {
        const allContents = history.flatMap(item => item.contents);
        const paperCount = allContents.filter(c => c.type === "paper").length;
        const awardCount = allContents.filter(c => c.type === "award").length;
        const firstYear = history[0]?.year;
        statsBox.innerHTML = `
            <div class="history-stat"><span class="history-stat-num">${paperCount}</span><span class="history-stat-label">논문</span></div>
            <div class="history-stat"><span class="history-stat-num">${awardCount}</span><span class="history-stat-label">수상</span></div>
            <div class="history-stat"><span class="history-stat-num">${firstYear}</span><span class="history-stat-label">Since</span></div>
        `;
    }
});

// 스크롤 시 nav에 그림자 추가
window.addEventListener('scroll', () => {
    const nav = document.getElementById('top-nav');
    if (!nav) return;
    nav.classList.toggle('scrolled', window.scrollY > 10);
});