// 편한길 올팍 - Cloudflare Worker
// 1) 서울교통공사 교통약자이용정보 중계 (비밀값 DATA_GO_KR_KEY: 공공데이터포털 '일반 인증키(Encoding)')
//    /elevators  엘리베이터 가동 (2분 재사용)
//    /helpers    교통약자 도우미 운영 현황 (6시간 재사용)
//    /lifts      휠체어리프트 (6시간)
//    /safeplfm   안전발판 보유 현황 (6시간)
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
    r.voters = r.voters || [];
    if (r.voters.includes(who) || r.by === who) return json({item: pub(r), same: true});
    r.voters.push(who); r[parts[2]]++;
    await store(env, list);
    return json({item: pub(r)});
  }
  return json({error: 'not found'}, 404);
}

export default {
  async fetch(req, env) {
    if (req.method === 'OPTIONS') return new Response(null, {status: 204, headers: H});
    const parts = new URL(req.url).pathname.split('/').filter(Boolean);
    if (parts[0] === 'reports') {
      try { return await reports(req, env, parts); } catch (e) { return json({error: 'server'}, 500); }
    }
    const name = parts[0] || '';
    const headers = {...H, 'Cache-Control': 'max-age=120'};
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
