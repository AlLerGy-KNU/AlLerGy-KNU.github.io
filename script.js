document.addEventListener("DOMContentLoaded", async function () {
    // data.js에서 데이터 불러와서 HTML에 넣기
    const descriptionBox = document.querySelector(".allergy-box-context");
    const activity_box_title2 = document.querySelector(".activity-box-title2");
    const activity_box_context = document.querySelector(".activity-box-context");
    const footerInfoBox = document.querySelectorAll(".footer-box-context")[0];

    if (typeof info !== 'undefined') {
        if (descriptionBox) descriptionBox.innerText = info.description;
        if (activity_box_title2) activity_box_title2.innerText = info["activity-box-title2"];
        if (activity_box_context) activity_box_context.innerText = info["activity-box-context"];
        if (footerInfoBox) footerInfoBox.innerText = `지도교수 : ${info.professor}<br>회장 : ${info.leader}<br>featuring : ${info.featuring}<br>email : ${info.email}`;
    }

    // 유저 데이터 불러오기 및 생성
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
                document.getElementById('member-box-professor-statusMessage').innerText = memberPage.leader.statusMessage;
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
    
                // 세자리마다 콤마 붙이기
                const formattedCount = Number(solvedCount).toLocaleString();
                textDiv.textContent = `${formattedCount}문제 해결`;
    
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