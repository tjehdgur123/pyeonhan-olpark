// 편한길 올팍 - Cloudflare Worker
// 1) 서울교통공사 교통약자이용정보 중계 (비밀값 DATA_GO_KR_KEY: 공공데이터포털 '일반 인증키(Encoding)')
//    /elevators  엘리베이터 가동, 올림픽공원 주변 역 (2분 재사용)
//    /elevators/all  엘리베이터 가동, 서울교통공사 전체 역 (10분 재사용, 최대 10쪽)
//    /helpers    교통약자 도우미 운영 현황 (6시간 재사용)
//    /lifts      휠체어리프트 (6시간)
//    /safeplfm   안전발판 보유 현황 (6시간)
//    /tt?st=역명&day=01|02|03  국토교통부(TAGO) 지하철 역별 시간표, 밤 9시~새벽 막차만 (12시간 재사용)
//    /park       실시간 주차 대수 + 지난 8일 기록(10분마다, 크론 트리거 필요: */10 * * * *)
//    /bus?op=pos&x=&y=&r=   정류소 찾기(서울시 정류소정보) · /bus?op=low&st=  저상버스 도착(서울시 버스도착정보)
// 2) 현장 제보 (KV 바인딩 REPORTS 필요)
//    GET  /reports            최근 30일 제보 목록
//    POST /reports            {kind, lat, lng, text?} 제보 남기기 (IP당 하루 5건)
//    POST /reports/:id/ok     "저도 봤어요"
//    POST /reports/:id/flag   "지금은 아니에요/부적절해요" (3건 이상이고 확인보다 많으면 숨김)
//    DELETE /reports/:id      운영자 삭제 (비밀값 ADMIN_TOKEN 을 X-Admin 헤더로; 비밀값이 없으면 꺼짐)
// 개인정보: 이름·연락처를 받지 않고, 글에서 전화번호·이메일·링크를 지우며, IP는 저장하지 않아요(하루짜리 해시만 요청 제한에 사용).
const STATIONS = /올림픽공원|몽촌토성|한성백제|둔촌오륜/;
const OPS = {
  elevators: ['getWksnElvtr', 120000],
  helpers: ['getWksnHelper', 21600000],
  lifts: ['getWksnWhcllift', 21600000],
  safeplfm: ['getWksnSafePlfm', 21600000]
};
const KINDS = ['step', 'slope', 'blocked', 'elevator', 'toilet', 'good'];
const BOX = {s: 37.505, n: 37.530, w: 127.100, e: 127.145};  // 올림픽공원과 주변 역
const DAY = 86400000, KEEP = 30 * DAY;
const memo = {};

const H = {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-Admin', 'Content-Type': 'application/json; charset=utf-8'};
const json = (o, status = 200, extra = {}) => new Response(JSON.stringify(o), {status, headers: {...H, ...extra}});

function clean(t) {
  return String(t || '').replace(/[\u0000-\u001f<>]/g, ' ')
    .replace(/https?:\/\/\S+|www\.\S+/gi, '')
    .replace(/[\w.+-]+@[\w-]+\.[\w.]+/g, '')
    .replace(/(\+?\d[\d\s-]{7,}\d)/g, '')
    .replace(/\s+/g, ' ').trim().slice(0, 80);
}
async function hash(s) {
  const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
  return [...new Uint8Array(b)].slice(0, 8).map(x => x.toString(16).padStart(2, '0')).join('');
}
async function load(env) {
  if (memo.rep && Date.now() - memo.rep.t < 20000) return memo.rep.list;
  const list = (await env.REPORTS.get('reports', 'json')) || [];
  memo.rep = {t: Date.now(), list};
  return list;
}
async function store(env, list) {
  const now = Date.now();
  list = list.filter(r => now - r.at < KEEP).slice(-300);
  await env.REPORTS.put('reports', JSON.stringify(list));
  memo.rep = {t: now, list};
  return list;
}
const visible = r => !(r.flag >= 3 && r.flag > r.ok);
const pub = r => ({id: r.id, kind: r.kind, ll: r.ll, text: r.text, at: r.at, ok: r.ok, flag: r.flag});

async function reports(req, env, parts) {
  if (!env.REPORTS) return json({error: 'reports off'}, 503);
  const now = Date.now();
  if (req.method === 'GET' && parts.length === 1) {
    const list = (await load(env)).filter(r => now - r.at < KEEP && visible(r)).map(pub);
    return json({items: list}, 200, {'Cache-Control': 'max-age=30'});
  }
  if (req.method === 'DELETE' && parts.length === 2) {
    if (!env.ADMIN_TOKEN || req.headers.get('X-Admin') !== env.ADMIN_TOKEN) return json({error: 'forbidden'}, 403);
    const list = await load(env);
    await store(env, list.filter(r => r.id !== parts[1]));
    return json({ok: true});
  }
  if (req.method !== 'POST') return json({error: 'method'}, 405);
  // 요청 제한: IP+날짜 해시, 하루 5건(제보) / 30건(확인·신고)
  const ip = req.headers.get('CF-Connecting-IP') || '0';
  const day = new Date(now + 9 * 3600000).toISOString().slice(0, 10);
  const who = await hash(ip + '|' + day);
  const rk = 'rl:' + (parts.length === 1 ? 'n:' : 'v:') + who;
  const used = +(await env.REPORTS.get(rk) || 0);
  if (used >= (parts.length === 1 ? 5 : 30)) return json({error: 'too many'}, 429);
  await env.REPORTS.put(rk, String(used + 1), {expirationTtl: DAY / 1000});

  if (parts.length === 1) {
    let b; try { b = await req.json(); } catch (e) { return json({error: 'bad json'}, 400); }
    const lat = +b.lat, lng = +b.lng;
    if (!KINDS.includes(b.kind) || !(lat > BOX.s && lat < BOX.n && lng > BOX.w && lng < BOX.e)) return json({error: 'bad input'}, 400);
    const r = {id: (await hash(who + now + Math.random())).slice(0, 10), kind: b.kind, ll: [+lat.toFixed(5), +lng.toFixed(5)],
      text: clean(b.text), at: now, ok: 0, flag: 0, by: who};
    const list = await load(env);
    // 같은 사람이 같은 곳(20m 안)에 같은 종류를 또 올리면 무시
    if (list.some(x => x.by === who && x.kind === r.kind && Math.abs(x.ll[0] - r.ll[0]) < 0.0002 && Math.abs(x.ll[1] - r.ll[1]) < 0.00025)) return json({item: null, dup: true});
    list.push(r);
    await store(env, list);
    return json({item: pub(r)}, 201);
  }
  if (parts.length === 3 && (parts[2] === 'ok' || parts[2] === 'flag')) {
    const list = await load(env), r = list.find(x => x.id === parts[1]);
    if (!r) return json({error: 'not found'}, 404);
    if (r.by === who) return json({item: pub(r), same: true, mine: null});
    // 같은 버튼을 다시 누르면 취소, 다른 버튼을 누르면 바꾸기 (예전 voters 기록은 누른 쪽으로 간주)
    const k = parts[2]; r.votes = r.votes || {};
    const prev = r.votes[who] || ((r.voters || []).includes(who) ? k : null);
    r.voters = (r.voters || []).filter(x => x !== who);
    let mine;
    if (prev === k) { delete r.votes[who]; r[k] = Math.max(0, r[k] - 1); mine = null; }
    else { if (prev) r[prev] = Math.max(0, r[prev] - 1); r.votes[who] = k; r[k]++; mine = k; }
    await store(env, list);
    return json({item: pub(r), mine});
  }
  return json({error: 'not found'}, 404);
}

// 막차 계산용 역 시간표: 역 이름으로 찾은 모든 노선의 상·하행 시간표 중 밤 9시 이후 열차만
const TAGO = 'https://apis.data.go.kr/1613000/SubwayInfo/';
const arr = x => x == null ? [] : Array.isArray(x) ? x : [x];
async function tago(env, op, q) {
  const r = await fetch(`${TAGO}${op}?serviceKey=${env.DATA_GO_KR_KEY}&_type=json&pageNo=1&numOfRows=999&${q}`);
  const t = await r.text();
  try { return JSON.parse(t); } catch (e) { throw new Error(t.slice(0, 200)); }
}
async function timetable(url, env) {
  const st = (url.searchParams.get('st') || '').replace(/역$/, '').trim().slice(0, 20), day = /^0[123]$/.test(url.searchParams.get('day')) ? url.searchParams.get('day') : '01';
  if (!st) return json({error: 'st'}, 400);
  const raw = url.searchParams.get('raw') === '1', key = 'tt' + st + day, m = memo[key];
  if (!raw && m && Date.now() - m.t < 43200000) return new Response(m.body, {headers: {...H, 'Cache-Control': 'max-age=21600'}});
  try {
    const s = await tago(env, 'GetKwrdFndSubwaySttnList', 'subwayStationName=' + encodeURIComponent(st));
    if (raw) return json({search: s});
    const found = arr(s?.response?.body?.items?.item).filter(x => String(x.subwayStationName).split('(')[0].replace(/역$/, '') === st);
    const lines = [];
    for (const x of found.slice(0, 6)) {
      const dirs = {};
      for (const ud of ['U', 'D']) {
        const j = await tago(env, 'GetSubwaySttnAcctoSchdulList', `subwayStationId=${x.subwayStationId}&dailyTypeCode=${day}&upDownTypeCode=${ud}`);
        dirs[ud] = arr(j?.response?.body?.items?.item).map(y => [String(y.depTime || y.arrTime || ''), String(y.arrTime || ''), y.endSubwayStationNm || ''])
          .filter(y => { const h = +y[0].padStart(6, '0').slice(0, 2); return h >= 21 || h < 4; });
      }
      lines.push({route: x.subwayRouteName, id: x.subwayStationId, dirs});
    }
    const body = JSON.stringify({st, day, lines});
    if (lines.length) memo[key] = {t: Date.now(), body};
    return new Response(body, {headers: {...H, 'Cache-Control': 'max-age=21600'}});
  } catch (e) {
    return json({error: 'upstream', detail: String(e.message || e).split(env.DATA_GO_KR_KEY || '@@').join('***').slice(0, 200)}, 502);
  }
}

// 주차: 한국체육산업개발 실시간 주차현황(기관 공개 키)을 10분마다 KV에 쌓아 추세·지난주 비교에 써요
const PARK_API = 'https://www.ksponco.or.kr/online/main/parkingorsApi.do?apiKey=PARKING21803504';
let parkMemo = null;
const PH = {...H, 'Cache-Control': 'max-age=60'};
async function parkNow() { const j = await (await fetch(PARK_API)).json(); const v = +(j && j[0] && j[0].parking_sum); if (!(v >= 0)) throw new Error('bad'); return v; }
async function parkCron(env) {
  try { const v = await parkNow(), t = Date.now(), h = (await env.REPORTS.get('park:hist', 'json')) || []; h.push([t, v]); await env.REPORTS.put('park:hist', JSON.stringify(h.filter(x => t - x[0] < 8 * DAY))); } catch (e) {}
}
async function park(env) {
  if (parkMemo && Date.now() - parkMemo.t < 60000) return new Response(parkMemo.b, {headers: PH});
  let hist = []; try { hist = (await env.REPORTS.get('park:hist', 'json')) || []; } catch (e) {}
  let now = null; try { now = [Date.now(), await parkNow()]; } catch (e) {}
  const b = JSON.stringify({cap: 2200, label: '동2문·남2문·북2문', now, hist}); parkMemo = {t: Date.now(), b};
  return new Response(b, {headers: PH});
}
// 저상버스: 서울시 버스도착정보(교통약자용)·정류소정보
const busMemo = {};
async function bus(url, env) {
  const op = url.searchParams.get('op'), k = env.DATA_GO_KR_KEY, num = n => (url.searchParams.get(n) || '').replace(/[^0-9]/g, '').slice(0, 12);
  let api, ttl;
  if (op === 'low') { if (!num('st')) return json({error: 'st'}, 400); api = `http://ws.bus.go.kr/api/rest/arrive/getLowArrInfoByStId?resultType=json&serviceKey=${k}&stId=${num('st')}`; ttl = 30000; }
  else if (op === 'pos') { const x = +url.searchParams.get('x'), y = +url.searchParams.get('y'), r = Math.min(800, +url.searchParams.get('r') || 400); if (!(x > 126 && x < 128 && y > 37 && y < 38)) return json({error: 'xy'}, 400); api = `http://ws.bus.go.kr/api/rest/stationinfo/getStationByPos?resultType=json&serviceKey=${k}&tmX=${x}&tmY=${y}&radius=${r}`; ttl = DAY; }
  else if (op === 'route') { if (!num('st')) return json({error: 'st'}, 400); api = `http://ws.bus.go.kr/api/rest/stationinfo/getRouteByStation?resultType=json&serviceKey=${k}&arsId=${num('st')}`; ttl = DAY; }
  else return json({error: 'op'}, 400);
  const key = op + url.search, m = busMemo[key];
  if (m && Date.now() - m.t < ttl) return new Response(m.b, {headers: PH});
  try {
    const t = await (await fetch(api)).text(); let j; try { j = JSON.parse(t); } catch (e) { throw new Error(t.slice(0, 200)); }
    const hd = j.msgHeader || {}, ok = String(hd.headerCd) === '0' || String(hd.headerCd) === '4';
    const b = JSON.stringify({ok, msg: hd.headerMsg || '', items: arr(j.msgBody && j.msgBody.itemList)});
    if (ok) busMemo[key] = {t: Date.now(), b};
    return new Response(b, {headers: PH});
  } catch (e) { return json({error: 'upstream', detail: String(e.message || e).split(k || '@@').join('***').slice(0, 200)}, 502); }
}

const worker = {
  async fetch(req, env) {
    if (req.method === 'OPTIONS') return new Response(null, {status: 204, headers: H});
    const parts = new URL(req.url).pathname.split('/').filter(Boolean);
    if (parts[0] === 'reports') {
      try { return await reports(req, env, parts); } catch (e) { return json({error: 'server'}, 500); }
    }
    if (parts[0] === 'tt') return timetable(new URL(req.url), env);
    if (parts[0] === 'park') return park(env);
    if (parts[0] === 'bus') return bus(new URL(req.url), env);
    const name = parts[0] || '';
    const headers = {...H, 'Cache-Control': 'max-age=120'};
    const op = OPS[name];
    if (!op) return new Response('{"error":"not found"}', {status: 404, headers});
    const all = parts[1] === 'all', mk = name + (all ? 'all' : '');
    const m = memo[mk];
    if (m && Date.now() - m.t < op[1] * (all ? 5 : 1)) return new Response(m.body, {headers});
    try {
      const rows = [];
      for (let p = 1; p <= (all ? 10 : 3); p++) {
        const r = await fetch(`https://apis.data.go.kr/B553766/wksn/${op[0]}?serviceKey=${env.DATA_GO_KR_KEY}&pageNo=${p}&numOfRows=1000&dataType=JSON`);
        const j = await r.json();
        let it = j?.response?.body?.items?.item || [];
        if (!Array.isArray(it)) it = [it];
        rows.push(...it.filter(x => all || STATIONS.test(x.stnNm || '')));
        if (it.length < 1000) break;
      }
      const items = name === 'elevators' ? rows.map(x => ({
        line: x.lineNm, station: x.stnNm, no: x.mngNo, exit: x.vcntEntrcNo, loc: x.dtlPstn,
        floors: `${x.bgngFlr}-${x.endFlr}`, status: x.oprtngSitu || '?'
      })) : rows;
      const at = new Date(Date.now() + 9 * 3600000).toISOString().slice(0, 16).replace('T', ' ');
      const body = JSON.stringify({at, items});
      if (items.length) memo[mk] = {t: Date.now(), body};
      return new Response(body, {headers});
    } catch (e) {
      if (m) return new Response(m.body, {headers});
      return new Response('{"error":"upstream"}', {status: 502, headers});
    }
  }
};
worker.scheduled = (ev, env, ctx) => { ctx.waitUntil(parkCron(env)); };
export default worker;
