// 편한길 올팍 - 서울교통공사 교통약자이용정보 중계 (Cloudflare Worker)
// 비밀값 DATA_GO_KR_KEY 에 공공데이터포털 '일반 인증키(Encoding)'를 넣어 주세요.
// /elevators  엘리베이터 가동 (2분 재사용)
// /helpers    교통약자 도우미 운영 현황 (6시간 재사용)
// /lifts      휠체어리프트 (6시간)
// /safeplfm   안전발판 보유 현황 (6시간)
const STATIONS = /올림픽공원|몽촌토성|한성백제|둔촌오륜/;
const OPS = {
  elevators: ['getWksnElvtr', 120000],
  helpers: ['getWksnHelper', 21600000],
  lifts: ['getWksnWhcllift', 21600000],
  safeplfm: ['getWksnSafePlfm', 21600000]
};
const memo = {};

export default {
  async fetch(req, env) {
    const name = new URL(req.url).pathname.slice(1);
    const headers = {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'max-age=120'};
    const op = OPS[name];
    if (!op) return new Response('{"error":"not found"}', {status: 404, headers});
    const m = memo[name];
    if (m && Date.now() - m.t < op[1]) return new Response(m.body, {headers});
    try {
      const rows = [];
      for (let p = 1; p <= 3; p++) {
        const r = await fetch(`https://apis.data.go.kr/B553766/wksn/${op[0]}?serviceKey=${env.DATA_GO_KR_KEY}&pageNo=${p}&numOfRows=1000&dataType=JSON`);
        const j = await r.json();
        let it = j?.response?.body?.items?.item || [];
        if (!Array.isArray(it)) it = [it];
        rows.push(...it.filter(x => STATIONS.test(x.stnNm || '')));
        if (it.length < 1000) break;
      }
      const items = name === 'elevators' ? rows.map(x => ({
        line: x.lineNm, station: x.stnNm, no: x.mngNo, exit: x.vcntEntrcNo, loc: x.dtlPstn,
        floors: `${x.bgngFlr}-${x.endFlr}`, status: x.oprtngSitu || '?'
      })) : rows;
      const at = new Date(Date.now() + 9 * 3600000).toISOString().slice(0, 16).replace('T', ' ');
      const body = JSON.stringify({at, items});
      if (items.length) memo[name] = {t: Date.now(), body};
      return new Response(body, {headers});
    } catch (e) {
      if (m) return new Response(m.body, {headers});
      return new Response('{"error":"upstream"}', {status: 502, headers});
    }
  }
};
