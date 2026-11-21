// 편한길 올팍 - 엘리베이터 실시간 중계 (Cloudflare Worker)
// 서울교통공사 교통약자이용정보 API(공공데이터포털)를 불러와 올림픽공원 주변 역만 돌려줍니다.
// 비밀값 DATA_GO_KR_KEY 에 공공데이터포털 '일반 인증키(Encoding)'를 넣어 주세요.
const STATIONS = /올림픽공원|몽촌토성|한성백제|둔촌오륜/;
let memo = null; // 같은 인스턴스 안에서 2분간 재사용 (하루 호출 한도 10,000건 보호)

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    const headers = {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'max-age=120'};
    if (url.pathname !== '/elevators') return new Response('{"error":"not found"}', {status: 404, headers});
    if (memo && Date.now() - memo.t < 120000) return new Response(memo.body, {headers});
    try {
      const items = [];
      for (let p = 1; p <= 2; p++) {
        const r = await fetch(`https://apis.data.go.kr/B553766/wksn/getWksnElvtr?serviceKey=${env.DATA_GO_KR_KEY}&pageNo=${p}&numOfRows=1000&dataType=JSON`);
        const j = await r.json();
        const it = j?.response?.body?.items?.item || [];
        items.push(...it.filter(x => STATIONS.test(x.stnNm)).map(x => ({
          line: x.lineNm, station: x.stnNm, no: x.mngNo, exit: x.vcntEntrcNo, loc: x.dtlPstn,
          floors: `${x.bgngFlr}-${x.endFlr}`, status: x.oprtngSitu || '?'
        })));
        if (it.length < 1000) break;
      }
      const at = new Date(Date.now() + 9 * 3600000).toISOString().slice(0, 16).replace('T', ' ');
      const body = JSON.stringify({at, items});
      memo = {t: Date.now(), body};
      return new Response(body, {headers});
    } catch (e) {
      if (memo) return new Response(memo.body, {headers});
      return new Response('{"error":"upstream"}', {status: 502, headers});
    }
  }
};
