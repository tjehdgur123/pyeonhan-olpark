// Cloudflare Worker: 서울교통공사 교통약자이용정보(엘리베이터) 프록시
// 비밀값 DATA_GO_KR_KEY (공공데이터포털 일반 인증키, Encoding) 를 wrangler secret 으로 등록
const STATIONS = /올림픽공원|몽촌토성|한성백제|둔촌오륜/;
export default {
  async fetch(req, env, ctx) {
    const url = new URL(req.url);
    const cors = {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json; charset=utf-8'};
    if (url.pathname !== '/elevators') return new Response('{"error":"not found"}', {status: 404, headers: cors});
    const cache = caches.default, key = new Request(url.origin + '/elevators');
    const hit = await cache.match(key); if (hit) return hit;
    const items = [];
    for (let p = 1; p <= 2; p++) {
      const r = await fetch(`https://apis.data.go.kr/B553766/wksn/getWksnElvtr?serviceKey=${env.DATA_GO_KR_KEY}&pageNo=${p}&numOfRows=1000&dataType=JSON`);
      const j = await r.json(); const it = j?.response?.body?.items?.item || [];
      items.push(...it.filter(x => STATIONS.test(x.stnNm)).map(x => ({line: x.lineNm, station: x.stnNm, no: x.mngNo, exit: x.vcntEntrcNo, loc: x.dtlPstn, floors: `${x.bgngFlr}-${x.endFlr}`, status: x.oprtngSitu || '?'})));
      if (it.length < 1000) break;
    }
    const res = new Response(JSON.stringify({at: new Date().toISOString(), items}), {headers: {...cors, 'Cache-Control': 'max-age=120'}});
    ctx.waitUntil(cache.put(key, res.clone()));
    return res;
  }
};
