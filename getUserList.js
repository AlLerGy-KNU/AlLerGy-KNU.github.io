const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

async function getRanklist() {
    const url = "https://www.acmicpc.net/group/ranklist/22125";
    
    // 1. 헤더 설정 (Python의 headers와 동일)
    const headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    };

    try {
        // 2. HTTP GET 요청 전송
        const response = await axios.get(url, { headers });

        if (response.status === 200) {
            const $ = cheerio.load(response.data);
            
            // 3. 유저 ID 추출
            const userIds = [];
            $('#ranklist tbody tr td:nth-child(2) a').each((index, element) => {
                userIds.push($(element).text().trim());
            });

            fs.writeFileSync('data.json', JSON.stringify({
                const: userIds.length,
                users: userIds,
                lastUpdate: new Date().toISOString()
            }, null, 2));
        }
    } catch (error) {
        console.error("오류 발생:", error.message);
    }
}

// 함수 실행
getRanklist();