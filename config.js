// 운영 설정
window.CONFIG = {
  // 한국체육산업개발 실시간 주차현황 API (기관이 공개한 키, 브라우저에서 바로 호출 가능)
  PARKING_API: "https://www.ksponco.or.kr/online/main/parkingorsApi.do?apiKey=PARKING21803504",
  // 엘리베이터 실시간 프록시(Cloudflare Worker) 주소. 공공데이터포털 인증키는 Worker 비밀값으로만 보관.
  // 비어 있으면 data.js의 스냅샷으로 동작합니다.
  LIVE_API: "https://pyeonhan-elevator.sdh120350.workers.dev"
};
