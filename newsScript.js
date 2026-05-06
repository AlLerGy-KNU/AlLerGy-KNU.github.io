let logData = null;
let currentPage = 1;
const itemsPerPage = 10;
const ranks = ["unranked","b5","b4","b3","b2","b1","s5","s4","s3","s2","s1","g5","g4","g3","g2","g1","p5","p4","p3","p2","p1","d5","d4","d3","d2","d1","r5","r4","r3","r2","r1","master"];

async function init() {
    try {
        const response = await fetch('./news.json');
        if (!response.ok) throw new Error(`[newsScript.js] 데이터를 불러오지 못했습니다. 상태: ${response.status}`);
        logData = await response.json();
        renderLogs(currentPage);
        setupEventListeners();
    } catch (error) {
        console.error("초기화 중 오류 발생:", error);
        document.getElementById('log-container').innerHTML =
            `<p class="log-error">데이터를 불러오는 중 오류가 발생했습니다.</p>`;
    }
}

function renderLogs(page) {
    const container = document.getElementById('log-container');
    container.innerHTML = '';

    if (!logData || !logData.log || logData.log.length === 0) {
        container.innerHTML = `
            <div class="log-empty">
                <p>앗, 아직 아무 변경사항도 없어요...</p>
            </div>`;
        updateUI(true);
        return;
    }

    const start = (page - 1) * itemsPerPage;
    const pagedData = logData.log.slice(start, start + itemsPerPage);

    pagedData.forEach(item => {
        const dateStr = new Date(item.date)
            .toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })
            .replace(/\.$/, '');

        const profileUrl = `https://solved.ac/profile/${item.userId}`;
        const card = document.createElement('div');
        card.className = 'log-item';

        let contentHtml = '';
        if (item.type === 'tier') {
            const pre = `<img src="./img/rank/${ranks[item.preTier]}.svg" alt="${ranks[item.preTier]}" class="tier-icon" onerror="this.style.display='none'">`;
            const now = `<img src="./img/rank/${ranks[item.nowTier]}.svg" alt="${ranks[item.nowTier]}" class="tier-icon" onerror="this.style.display='none'">`;
            contentHtml = `티어 상승! (${pre} → ${now})`;
        } else if (item.type === 'solved') {
            contentHtml = `${item.solvedCount} 문제 해결!`;
        } else if (item.type === 'notice') {
            contentHtml = item.text;
        }

        card.innerHTML = `
            <h2 class="log-item-title">
                <a href="${profileUrl}" target="_blank" rel="noopener noreferrer" class="log-user-link">@${item.userId}</a>
                <span class="log-item-content">님,&nbsp;${contentHtml}</span>
            </h2>
            <time class="log-item-date">${dateStr}</time>`;

        container.appendChild(card);
    });

    updateUI(false);
}

function updateUI(isEmpty) {
    const paginationNav = document.querySelector('.news-pagination');
    const lastUpdateEl  = document.getElementById('last-update');

    if (isEmpty) {
        if (paginationNav) paginationNav.style.display = 'none';
        lastUpdateEl.innerText = 'No updates found';
        return;
    }

    if (paginationNav) paginationNav.style.display = 'flex';
    const totalPages = Math.ceil(logData.log.length / itemsPerPage) || 1;
    document.getElementById('page-info').innerText = `${currentPage} / ${totalPages}`;
    document.getElementById('prev-btn').disabled = currentPage === 1;
    document.getElementById('next-btn').disabled = currentPage === totalPages;

    const lastDate = new Date(logData.lastUpdate).toLocaleDateString();
    lastUpdateEl.innerHTML =
        `Last updated: ${lastDate}<br><span style="font-size:11px;opacity:.7">※ 백준이 서비스 종료함에 따라 더 이상의 업데이트는 진행되지 않습니다.</span>`;
}

function setupEventListeners() {
    document.getElementById('prev-btn').onclick = () => {
        if (currentPage > 1) { currentPage--; renderLogs(currentPage); window.scrollTo({ top: 0, behavior: 'smooth' }); }
    };
    document.getElementById('next-btn').onclick = () => {
        const totalPages = Math.ceil(logData.log.length / itemsPerPage);
        if (currentPage < totalPages) { currentPage++; renderLogs(currentPage); window.scrollTo({ top: 0, behavior: 'smooth' }); }
    };
}

init();
