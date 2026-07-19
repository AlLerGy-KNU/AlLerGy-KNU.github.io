const info = {
    'professor': '강원대학교 융합보안학과 교수 이동재',
    'leader': '강원대학교 컴퓨터공학과 배준영',
    'featuring': '강원대학교 컴퓨터공학과 교수 이다영',
    'email': 'chunbaekim74@gmail.com', // 동아리 회장 이메일
    'description': 'Algorithm Lever\'s Gym은 알고리즘을 사랑하는 사람들의 동아리로, 알고리즘 스터디, 코딩 대회 준비 등을 중심으로 운영되고 있어요.<br>가입을 위해서는 초보자 실력자 구분 없이<br>알고리즘을 통해 문제를 해결하고,<br>새로운 가능성을 탐구하고 싶어하면 충분하답니다.',
    'activity-box-title2': '매주 알고리즘 스터디 진행',
    'activity-box-context': '백준을 통해 알고리즘 문제 풀이<br>멘토멘티 활동 진행<br>매주 코드메이트 개최(상품 증정)<br>정기 모임활동 때마다 식사 제공'
};

const memberPage = {
    'professor': {
        'id': 'dd2dd2', // 지도교수님 백준 id
        'statusMessage': 'AlLerGy 화이팅!' // 지도교수님 상태메시지
    },
    
    'leader': {
        'id': 'chunbae74', // 동아리 회장 백준 id
        'statusMessage': '안뇽~' // 동아리 회장 상태메시지
    },
};

// type: award(수상) | paper(논문) | contest(대회) | event(활동)
const history = [
    {
        year: "2024",
        leader: "1대 회장 김이든",
        contents: [
            { type: "event", text: "AlLerGy 동아리 창설" },
            { type: "event", text: "정기모임 시작" }
        ]
    },
    {
        year: "2025",
        contents: [
            { type: "event", text: "동아리 홈페이지 자체 제작" },
            { type: "paper", text: "정보보호학회 \“Model Context Protocol(MCP) 기술 동향과 보안 취약점 분석\" Accepted" },
            { type: "paper", text: "정보보호학회 \“중소기업 환경에 적합한 비용 효율적 제로트러스트 보안 모델 개발 및 적용 방안\" Accepted" },
            { type: "paper", text: "정보보호학회 \“MCP-A2A 기반 에이전트 협업형 보안 자동화 프레임워크\” Accepted" },
            { type: "paper", text: "정보처리학회 \“효율적인 질의 처리를 위한 BitNet-MCP 하이브리드 시스템\” Accepted" },
            { type: "paper", text: "정보처리학회 \“비정형 음성 데이터의 자동 가명 처리를 위한 웹서비스 구현\” Accepted" },
            { type: "award", text: "카카오 테크캠퍼스 최우수상 수상" },
            { type: "contest", text: "Hack The Code 2025 상위 60위 (1,400팀 참가)" },
            { type: "event", text: "삼성 SW-AI 부트캠프 SSAFY 합격" },
            { type: "award", text: "악성 URL 분류 경진대회 3등" },
            { type: "contest", text: "ACPC 본선 진출" },
            { type: "award", text: "충남대학교 알고리즘 대회 은상" },
            { type: "award", text: "Agentic Workflow 해커톤 최우수상 수상" },
            { type: "contest", text: "ICPC 본선 진출" },
            { type: "award", text: "SW 개발보안 경진대회 대상, 우수상 수상" },
            { type: "award", text: "AI 부트캠프 최우수상 수상" },
            { type: "award", text: "25 강원권 대학생 AI학습법 및 대학생활 노하우 공모전 장려상 수상" },
            { type: "award", text: "전국 GoogleCloud 기반 AI 융합 경진대회 대상 수상" }
        ]
    },
    {
        year: "2026",
        leader: "2대 회장 배준영",
        contents: [
            { type: "award", text: "강원권 정보보안 동아리 네트워킹 데이 1등, 3등 수상 (참여인원 12명)" },
            { type: "event", text: "강원대X한림대 보안동아리 연합: 화이트햇 / BoB 내방 교육 참여" },
            { type: "paper", text: "정보보호학회 \"양자컴퓨팅 성능 평가 방법론: Planted QUBO 벤치마크 분석\" Accepted" },
            { type: "award", text: "정보보호학회 \"대규모 최적화 문제 해결을 위한 그래프 분할 기반 양자 어닐링 접근법\" 우수논문상 수상" },
            { type: "event", text: "\"바이브코딩 시대에서 주니어 개발자로 살아남는 방법\" 특강 진행 (강사: 옥강호)" }
        ]
    }
];
