// script.js
document.addEventListener("DOMContentLoaded", async function () {
    // 1. data.js에서 데이터 불러와서 HTML에 넣기
    const descriptionBox = document.querySelector(".allergy-box-context");
    const footerInfoBox = document.querySelectorAll(".footer-box-context")[0]; // 푸터의 첫 번째 context 상자

    if (typeof clubInfo !== 'undefined') {
        if (descriptionBox) descriptionBox.innerHTML = clubInfo.description;
        if (footerInfoBox) footerInfoBox.innerHTML = clubInfo.footerContact;
    }

    // 2. 유저 데이터 불러오기 및 생성
    const container = document.querySelector(".auto-js");
    const rankClassMap = {
        "u": "member-rank-u",
        "p": "member-rank-p",
        "g": "member-rank-g",
        "s": "member-rank-s",
        "b": "member-rank-b",
        "d": "member-rank-d",
        "r": "member-rank-r",
        "m": "member-rank-m"
    };

    try {
        const response = await fetch('./userList.json');
        if (!response.ok) throw new Error("데이터를 불러오지 못했습니다.");
        
        const jsonData = await response.json();
        const users = jsonData.users;

        Object.entries(users).forEach(([solvedId, info]) => {
            const { rank, solvedCount } = info;

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
            
            // 앞서 질문하신 세 자리 콤마 적용!
            const formattedCount = Number(solvedCount).toLocaleString();
            textDiv.textContent = `${formattedCount}문제 해결`;

            contextDiv.appendChild(idDiv);
            contextDiv.appendChild(textDiv);
            memberDiv.appendChild(contextDiv);

            if (container) container.appendChild(memberDiv);
        });

    } catch (error) {
        console.error("Error:", error);
        if (container) container.innerHTML = `<p style="color:white;">데이터를 로드하는 중 오류가 발생했습니다.</p>`;
    }
});

// 3. 스크롤 시 헤더 보이기 기능
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (header) {
        if (window.scrollY > window.innerHeight - 50) {
            header.classList.add('show');
        } else {
            header.classList.remove('show');
        }
    }
});