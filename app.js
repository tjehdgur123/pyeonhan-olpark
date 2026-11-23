{
const D = window.DATA, C = window.CONFIG || {};
const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const I = {
  warn: '<svg class="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 3 2 20h20L12 3zM12 10v4M12 17h.01"/></svg>',
  ok: '<svg class="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/></svg>',
  info: '<svg class="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg>',
  cal: '<svg class="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>',
  pin: '<svg class="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21s7-6 7-11a7 7 0 0 0-14 0c0 5 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>',
  wheel: '<svg class="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="4" r="1.6" fill="currentColor"/><path d="M11 7v6h5l2.5 5"/><path d="M8.6 10a6 6 0 1 0 7.9 8.2"/></svg>',
  stroller: '<svg class="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 5h2l2 9h10l2-6H7.4"/><circle cx="9" cy="19" r="1.6"/><circle cx="17" cy="19" r="1.6"/></svg>',
  slow: '<svg class="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="4" r="1.6" fill="currentColor"/><path d="M10 8l-2 6 3 2v5M10 8l3 4 3 1M18 11v10"/></svg>',
  train: '<svg class="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="5" y="3" width="14" height="13" rx="3"/><path d="M5 11h14M8 20l-2 2M16 20l2 2M9 16v.01M15 16v.01"/></svg>',
  car: '<svg class="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 16V11l2-5h10l2 5v5M3 16h18v3H3zM7 19v2M17 19v2M5 11h14"/></svg>',
  share: '<svg class="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4"/></svg>',
  swap: '<svg class="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M7 4v16M7 4 4 7M7 4l3 3M17 20V4M17 20l-3-3M17 20l3-3"/></svg>',
  spk: '<svg class="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9v6h4l5 4V5L8 9H4zM16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/></svg>',
  stop: '<svg class="i" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>',
  phone: '<svg class="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/></svg>'
};

// ---------- 글자 크기 (보통 16px · 크게 20px · 아주 크게 24px) ----------
let fsLevel = 0;
function setFs(n) { fsLevel = +n || 0; const r = document.documentElement; r.classList.remove('fs1', 'fs2'); if (fsLevel) r.classList.add('fs' + fsLevel); const b = document.getElementById('bigBtn'); if (b) { const n = ['보통', '크게', '아주 크게'][fsLevel]; b.textContent = '글자 크기 ' + n; } }
// ---------- 상태 ----------
const MODES = [{id:'wheel', label:'휠체어', speed:55, icon:I.wheel}, {id:'stroller', label:'유아차', speed:60, icon:I.stroller}, {id:'slow', label:'걷기 힘듦', speed:40, icon:I.slow}];
const WAYS = [{id:'subway', label:'지하철', icon:I.train}, {id:'car', label:'자동차', icon:I.car}];
const st = {show:null, venue:null, mode:'wheel', way:'subway', tab:'route', layers:{toilet:true, center:true, store:false, path:true}};
const live = {parking:null, elev:null, ramp:null};
try { const s = JSON.parse(localStorage.getItem('pyeonhan') || '{}'); if (s.mode) st.mode = s.mode; if (s.way) st.way = s.way; if (s.fs) setFs(s.fs); else if (s.big) setFs(1); } catch(e) {}
// 공유 링크: ?v=공연장&t=시작시각&n=공연명&m=이동방법&w=교통수단
const Q = new URLSearchParams(location.search), linkShow = (() => {
  const v = Q.get('v'), t = Q.get('t'); if (!v) return null;
  if (['wheel','stroller','slow'].includes(Q.get('m'))) st.mode = Q.get('m');
  if (['subway','car'].includes(Q.get('w'))) st.way = Q.get('w');
  if (!D.venues.some(x => x.id === v)) return null;
  st.venue = v; const at = t ? new Date(t) : null;
  return at && !isNaN(at) ? {title:(Q.get('n') || '').slice(0, 80), venue:v, at} : null;
})();
let linkOn = !!linkShow;
const dropLink = () => { if (location.search) { linkOn = false; history.replaceState(null, '', location.pathname + location.hash); } };
const save = () => { try { localStorage.setItem('pyeonhan', JSON.stringify({mode:st.mode, way:st.way, fs:fsLevel})); } catch(e) {} };

// ---------- 색 대비: 노선색 위 글자는 대비 4.5 이상인 색으로 ----------
const lum = hex => { const c = hex.replace('#','').match(/../g).map(x => { const v = parseInt(x, 16) / 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }); return 0.2126*c[0] + 0.7152*c[1] + 0.0722*c[2]; };
const onColor = hex => (1.05 / (lum(hex) + 0.05)) >= 4.5 ? '#fff' : '#111';
// 노선색 배지: 흰 글자와 4.5:1이 안 되면 노선색을 조금 어둡게
const pillBg = hex => { let h = hex; for (let k = 0; k < 10 && 1.05 / (lum(h) + 0.05) < 4.6; k++) h = '#' + h.replace('#','').match(/../g).map(x => Math.round(parseInt(x, 16) * 0.92).toString(16).padStart(2, '0')).join(''); return h; };
const pill = S => `<span class="pill" style="background:${pillBg(S.color)};color:#fff">${S.line}</span>`;
// ---------- 계산 ----------
const rad = d => d * Math.PI / 180;
const dist = (a, b) => { const dl = rad(b[0]-a[0]), dn = rad(b[1]-a[1]); const h = Math.sin(dl/2)**2 + Math.cos(rad(a[0]))*Math.cos(rad(b[0]))*Math.sin(dn/2)**2; return 2*6371000*Math.asin(Math.sqrt(h)); };
const mode = () => MODES.find(m => m.id === st.mode);
const venue = () => D.venues.find(v => v.id === st.venue);
const vll = v => [v.lat, v.lng];
const mins = m => Math.max(1, Math.round(m / mode().speed));
const hm = d => d.toTimeString().slice(0,5);
const addMin = (d, m) => new Date(d.getTime() + m*60000);
const DOW = '일월화수목금토';
const fmtDate = d => `${d.getMonth()+1}/${d.getDate()}(${DOW[d.getDay()]})`;
// 경로: 미리 계산한 계단 없는 보행 경로(D.routes)가 있으면 쓰고, 없으면 직선×1.3 추정
function path(fromId, ll, v) {
  const r = (D.routes || {})[fromId + '>' + v.id];
  if (r) return {m:r.m, pts:r.pts, real:true, steps:r.steps};
  return {m:dist(ll, vll(v)) * 1.3, pts:[ll, vll(v)], real:false};
}
const exitsFor = v => D.stations.flatMap(s => s.ev.map(e => ({s, e, id:s.id + '-' + e.no, ll:e.ll}))).map(x => ({...x, p:path(x.id, x.ll, v)})).sort((a,b) => a.p.m - b.p.m);
const centerFor = v => D.centers.map((c, i) => ({...c, id:'center-' + i, p:path('center-' + i, [c.lat,c.lng], v)})).sort((a,b) => a.p.m - b.p.m)[0];
const toiletsNear = v => D.fac.filter(f => f.k === '화장실').map(f => ({...f, m:dist(f.ll, vll(v))})).sort((a,b) => a.m - b.m).slice(0, 2);


// ---------- 음성 안내 (브라우저 내장 Web Speech API, 서버·비용 없음) ----------
const SPEECH = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
const sp = {on:false, pane:null, idx:-1, queue:[], rate:1};
try { sp.rate = +(localStorage.getItem('pyeonhanRate') || 1); } catch(e) {}
const koVoice = () => (speechSynthesis.getVoices() || []).filter(v => /^ko/i.test(v.lang)).sort((a,b) => (b.localService - a.localService))[0];
function speakable(el) {
  const c = el.cloneNode(true);
  c.querySelectorAll('.say, .dot, svg, .speak').forEach(x => x.remove());
  c.querySelectorAll('.exit').forEach(x => x.textContent = x.textContent + '번');
  c.querySelectorAll('h3').forEach(x => x.textContent = x.textContent.trim() + '. ');
  c.querySelectorAll('dt').forEach(x => x.textContent = x.textContent.trim() + ': ');
  c.querySelectorAll('dd, p, .note').forEach(x => x.append('. '));
  let t = c.innerText.replace(/번번/g, '번');
  return t
    .replace(/\b0(\d{1,2})-(\d{3,4})-(\d{4})(~\d)?/g, (m, a, b, c2) => ['0' + a, b, c2].map(g => g.split('').join(' ')).join(', '))
    .replace(/\b(1[56]\d{2})-(\d{4})\b/g, (m, a, b) => [a, b].map(g => g.split('').join(' ')).join(', '))
    .replace(/(\d{1,2}):(\d{2})\s*~\s*(\d{1,2}):(\d{2})/g, (m, a, b, c2, d) => `${+a}시${+b ? ' ' + +b + '분' : ''}부터 ${+c2}시${+d ? ' ' + +d + '분' : ''}까지`)
    .replace(/(\d{1,2}):(\d{2})/g, (m, a, b) => `${+a}시${+b ? ' ' + +b + '분' : ''}`)
    .replace(/\bB(\d)\b/g, '지하 $1층').replace(/\b(\d)F\b/g, '지상 $1층')
    .replace(/(\d)-(\d) 칸/g, '$1 다시 $2번 칸').replace(/(\d)-(\d)/g, '$1 다시 $2')
    .replace(/(\d)m\b/g, '$1미터').replace(/↔/g, '에서 ').replace(/[·•|]/g, ', ').replace(/\.\s*\./g, '.').replace(/\s+/g, ' ').replace(/\s+([.,])/g, '$1').trim();
}
function speakBar(pane) {
  if (!SPEECH) return '';
  const on = sp.on && sp.pane === pane;
  return `<div class="speak" role="group" aria-label="음성 안내"><button class="sayall ${on ? 'on' : ''}" data-sayall="${pane}" aria-pressed="${on}">${on ? I.stop + ' 그만 듣기' : I.spk + (pane === 'route' ? ' 가는 길 소리로 듣기' : ' 공연 후 안내 듣기')}</button><button class="rate" data-rate>말하기 속도: ${sp.rate < 1 ? '천천히' : '보통'}</button></div>`;
}
function stopSpeak() { if (!SPEECH) return; sp.on = false; sp.idx = -1; sp.queue = []; speechSynthesis.cancel(); markSpeaking(); refreshBars(); }
function refreshBars() { document.querySelectorAll('.speak').forEach(b => { const p = b.querySelector('[data-sayall]').dataset.sayall; b.outerHTML = speakBar(p); }); }
function markSpeaking() {
  document.querySelectorAll('.step.speaking').forEach(s => s.classList.remove('speaking'));
  if (!sp.on || sp.idx < 0) return;
  const s = document.querySelectorAll(`#pane-${sp.pane} .step`)[sp.idx];
  if (s) s.classList.add('speaking');
}
function sayList(pane, items, startIdx) {
  if (!SPEECH) return;
  speechSynthesis.cancel();
  sp.on = true; sp.pane = pane; sp.queue = items; refreshBars();
  const next = i => {
    if (!sp.on || i >= sp.queue.length) { stopSpeak(); return; }
    const it = sp.queue[i];
    sp.idx = it.step; markSpeaking();
    const el = document.querySelectorAll(`#pane-${pane} .step`)[it.step];
    if (el) el.scrollIntoView({block:'nearest', behavior:'smooth'});
    const u = new SpeechSynthesisUtterance(it.text);
    u.lang = 'ko-KR'; u.rate = sp.rate; const v = koVoice(); if (v) u.voice = v;
    u.onend = () => { if (sp.on) next(i + 1); };
    u.onerror = () => stopSpeak();
    speechSynthesis.speak(u);
  };
  next(startIdx || 0);
}
function sayPane(pane) {
  const root = $('#pane-' + pane), steps = [...root.querySelectorAll('.step')];
  const v = venue(), s = curShow(), T = timesFor();
  let intro = pane === 'route'
    ? `${s ? s.title + ', ' : ''}${v.name}까지 ${mode().label}로 가는 길을 안내할게요.${T.arrive ? ` ${hm(T.arrive)}까지 ${st.way === 'subway' ? '역에' : '주차장에'} 도착하면 좋아요.` : ''}`
    : (T.end ? `공연은 ${hm(T.end)}쯤 끝나요. 혼잡을 피하려면 ${hm(T.leave)} 이후에 나서세요. 공연이 끝나고 20분에서 40분 사이가 가장 붐비고, 70분 뒤에 절반으로 줄어요.` : '공연이 끝나면 1시간 넘게 붐벼요.');
  const items = [{step:-1, text:speakable({cloneNode:() => { const d = document.createElement('div'); d.textContent = intro; return d; }})}];
  steps.forEach((el, i) => items.push({step:i, text:`${i + 1}단계. ` + speakable(el)}));
  sayList(pane, items, 0);
}
if (SPEECH) { speechSynthesis.getVoices(); speechSynthesis.onvoiceschanged = () => {}; }


// ---------- 말로 하는 길 안내 (경로 꺾임·거리·주변 표지를 문장으로) ----------
const toXY = ll => [(ll[1] - 127.12) * 88300, (ll[0] - 37.518) * 111000]; // 동(x)·북(y) 미터
const bearing = (a, b) => { const p = toXY(a), q = toXY(b); return (Math.atan2(q[0]-p[0], q[1]-p[1]) * 180 / Math.PI + 360) % 360; };
const COMPASS = ['북쪽','북동쪽','동쪽','남동쪽','남쪽','남서쪽','서쪽','북서쪽'];
const compass = b => COMPASS[Math.round(b / 45) % 8];
const josa = w => { const h = w.replace(/\([^)]*\)\s*$/, '').match(/[가-힣](?=[^가-힣]*$)/); return h && (h[0].charCodeAt(0) - 0xac00) % 28 === 0 ? '가' : '이'; };
const r10 = m => Math.max(10, Math.round(m / 10) * 10);
function directions(pts, v, fromLabel) {
  // 1) 구간 나누기: 30도 넘게 꺾이는 곳에서 새 구간
  const legs = [];
  for (let i = 1; i < pts.length; i++) {
    const m = dist(pts[i-1], pts[i]); if (m < 1) continue;
    const b = bearing(pts[i-1], pts[i]), L = legs[legs.length - 1];
    if (L) { let d = ((b - L.b + 540) % 360) - 180; if (Math.abs(d) < 40 || m < 15) { L.m += m; L.end = pts[i]; L.pts.push(pts[i]); continue; } }
    legs.push({b, m, start:pts[i-1], end:pts[i], pts:[pts[i-1], pts[i]]});
  }
  // 아주 짧은 구간은 앞 구간에 합치기
  for (let i = legs.length - 1; i > 0; i--) if (legs[i].m < 30) { legs[i-1].m += legs[i].m; legs[i-1].end = legs[i].end; legs.splice(i, 1); }
  for (let i = legs.length - 1; i > 0; i--) { const d = ((legs[i].b - legs[i-1].b + 540) % 360) - 180; if (Math.abs(d) < 40) { legs[i-1].m += legs[i].m; legs[i-1].end = legs[i].end; legs[i-1].pts.push(...legs[i].pts); legs.splice(i, 1); } }
  // 2) 길 주변 표지
  const pois = [
    ...D.fac.filter(f => f.k === '화장실').map(f => ({name:'화장실', ll:f.ll, pr:2})),
    ...D.centers.map(c => ({name:c.name + '(휠체어 대여)', ll:[c.lat, c.lng], pr:0})),
    ...D.landmarks.map(l => ({name:l.name, ll:[l.lat, l.lng], pr:0})),
    ...D.venues.filter(x => x.id !== v.id).map(x => ({name:x.name, ll:vll(x), pr:1}))
  ];
  const used = new Set();
  const side = (leg, ll) => { const a = toXY(leg.start), b = toXY(leg.end), p = toXY(ll); return ((b[0]-a[0])*(p[1]-a[1]) - (b[1]-a[1])*(p[0]-a[0])) > 0 ? '왼쪽' : '오른쪽'; };
  const near = leg => { let best = null; for (const p of pois) { if (used.has(p.name)) continue; let d = 1e9; const P0 = toXY(p.ll); for (let k = 1; k < leg.pts.length; k++) { const A = toXY(leg.pts[k-1]), B2 = toXY(leg.pts[k]), dx = B2[0]-A[0], dy = B2[1]-A[1], L2 = dx*dx + dy*dy || 1; const t = Math.max(0, Math.min(1, ((P0[0]-A[0])*dx + (P0[1]-A[1])*dy) / L2)); d = Math.min(d, Math.hypot(A[0] + t*dx - P0[0], A[1] + t*dy - P0[1])); } if (d < 60 && (!best || p.pr < best.pr || (p.pr === best.pr && d < best.d))) best = {...p, d}; } if (best) used.add(best.name); return best; };
  // 3) 문장
  const out = [];
  legs.forEach((L, i) => {
    let s;
    if (i === 0) s = `${fromLabel}에서 나와 ${compass(L.b)}으로 약 ${r10(L.m)}미터 가세요.`;
    else {
      const d = ((L.b - legs[i-1].b + 540) % 360) - 180;
      const turn = Math.abs(d) > 135 ? '뒤로 돌아' : (d > 0 ? '오른쪽으로 꺾어' : '왼쪽으로 꺾어');
      s = `${turn} ${compass(L.b)}으로 약 ${r10(L.m)}미터 가세요.`;
    }
    const p = near(L); if (p) s += ` ${side(L, p.ll)}에 ${p.name}${josa(p.name)} 있어요.`
    out.push(s);
  });
  const last = legs[legs.length - 1];
  if (last) out.push(`${esc(v.name)}에 도착해요.`);
  return out;
}

// ---------- 공연 ----------
const now = new Date();
let shows = [], evSource = 'snapshot', evSavedAt = null;
// 공연 시간: 공식(주차 예상 이용률 페이지) > 과거 같은 출연자 공연(공연정보 API) > 공연장 중앙값
function estimateDur(e) {
  if (e.durOfficial) return {dur:e.dur, src:'official'};
  const T = (e.title || '').toUpperCase().replace(/[^0-9A-Z가-힣]+/g, ' ').split(' ');
  for (const [w, m] of Object.entries(D.dur.artist)) if (T.some(t => t === w || (w.length >= 3 && t.startsWith(w)))) return {dur:m, src:'past'};
  return {dur:D.dur.venue[e.venue] || 120, src:'venue'};
}
function setShows(events) {
  const all = events.flatMap(e => { const d = estimateDur(e); return e.shows.map(s => ({...e, dur:d.dur, durSrc:d.src, at:new Date(s)})); });
  const up = all.filter(s => s.at > addMin(now, -180));
  shows = (up.length ? up : all).sort((a,b) => a.at - b.at).slice(0, 16);
  if (st.show) { const m = shows.find(s => s.title === st.show.title && +s.at === +st.show.at); if (m) st.show = m; }
  if (linkOn && (!st.show || st.show.fromLink)) {
    const m = shows.find(s => s.venue === linkShow.venue && +s.at === +linkShow.at);
    if (m) st.show = m;
    else { const e = {title:linkShow.title || '공유받은 공연', venue:linkShow.venue}, d = estimateDur(e); st.show = {...e, at:linkShow.at, dur:d.dur, durSrc:d.src, fromLink:true}; }
  }
}
setShows(D.events);
const curShow = () => st.show && st.show.venue === st.venue ? st.show : null;

// ---------- 여정 카드 + 시간 ----------
function renderTrip() {
  const v = venue(), s = curShow();
  $('#trip').innerHTML = `
    <div class="kicker">${I.cal}${s ? `${fmtDate(s.at)} ${hm(s.at)} 시작` : '공연장만 선택함'}</div>
    <h2>${esc(s ? s.title : v.name)}</h2>
    <div class="where">${I.pin} ${esc(v.name)}</div>
    <div class="seg" role="group" aria-label="이동 방법">${MODES.map(m => `<button data-mode="${m.id}" aria-pressed="${st.mode === m.id}">${m.icon}${m.label}</button>`).join('')}</div>
    <div class="seg" role="group" aria-label="교통수단">${WAYS.map(w => `<button data-way="${w.id}" aria-pressed="${st.way === w.id}">${w.icon}${w.label}</button>`).join('')}</div>
    <div class="row2"><button class="change" id="openSheet">${I.swap} 공연 바꾸기</button><button class="change" id="shareBtn">${I.share} 일행에게 보내기</button></div>`;
  const T = timesFor();
  $('#times').innerHTML = s ? [
    [st.way === 'subway' ? '역 도착 권장' : '주차장 도착 권장', hm(T.arrive), 'hi'],
    ['공연 시작', hm(s.at), ''],
    [s.durSrc === 'official' ? '끝나는 시각' : '끝나는 시각(추정)', hm(T.end), ''],
    ['혼잡 피해 나서기', hm(T.leave) + ' 이후', 'hi']
  ].map(([a,b,c]) => `<div class="${c}"><small>${a}</small><b>${b}</b></div>`).join('') + (s.durSrc === 'official' ? '' : `<div class="note">끝나는 시각은 ${s.durSrc === 'past' ? '같은 출연자의 지난 공연 소요시간' : '이 공연장 공연들의 보통 소요시간'}(${s.dur}분)으로 추정했어요. 공연정보 API 기준.</div>`)
  : `<div style="grid-column:1/-1"><small>공연을 고르면 도착·출발 권장 시각을 계산해 드려요.</small></div>`;
}
function timesFor() {
  const s = curShow(), v = venue(); if (!s) return {};
  const walkM = st.way === 'subway' ? exitsFor(v)[0].p.m : 150;
  const end = addMin(s.at, s.dur);
  return {start:s.at, end, arrive:addMin(s.at, -(60 + mins(walkM))), leave:addMin(end, 70)};
}

// ---------- 가는 길 ----------
function stepHTML(dot, title, body, y) { return `<li class="step"><span class="dot ${y ? 'y' : ''}" aria-hidden="true">${dot}</span><div><div class="sh"><h3>${title}</h3>${SPEECH ? `<button class="say" data-say aria-label="이 단계 소리로 듣기">${I.spk}</button>` : ''}</div>${body}</div></li>`; }
function elevNote(S) {
  if (!live.elev) return `<p class="meta">엘리베이터 실시간 정보를 불러오는 중…</p>`;
  if (live.elev === 'fail') return `<div class="note info">${I.info}<span>엘리베이터 실시간 정보를 지금 불러오지 못했어요. 출발 전 역에 전화로 확인하세요.</span></div>`;
  const key = S.name.replace('역', '');
  const mine = live.elev.items.filter(x => x.station === key && x.line === S.line);
  if (!mine.length) return `<p class="meta">${esc(S.line)} ${esc(S.name)}은 엘리베이터 실시간 가동 정보가 공개되지 않아요. 출발 전 역에 전화로 확인하세요.</p>`;
  const stop = mine.filter(x => x.status === 'S');
  return stop.length
    ? `<div class="note warn">${I.warn}<span><b>지금 멈춘 엘리베이터</b> · ${stop.map(x => `${esc(x.loc)}(${esc(x.floors)})`).join(', ')}<br>반대 방면 승강장 엘리베이터를 이용하거나 역에 도움을 요청하세요. <span class="meta">${esc(live.elev.at)} 기준</span></span></div>`
    : `<div class="note ok">${I.ok}<span>이 역 엘리베이터 ${mine.length}대 모두 운행 중 <span class="meta">${esc(live.elev.at)} 기준</span></span></div>`;
}
function renderRoute() {
  const v = venue(), m = mode(), s = curShow(), T = timesFor(), c = centerFor(v);
  let h = speakBar('route') + '<ol class="steps">';
  if (st.way === 'subway') {
    const ex = exitsFor(v), best = ex[0], S = best.s;
    h += stepHTML('1', '출발 전 확인', elevNote(S) + `<dl class="facts"><dt>${I.phone} 역 전화</dt><dd><a href="tel:${S.tel.replace(/-/g,'')}">${S.tel}</a> (${esc(S.name)} ${esc(S.line)})</dd>${S.ramp != null ? `<dt>안전발판</dt><dd>${S.ramp ? '있음 · 승강장 틈이 걱정되면 역에 요청' : '보유 정보 없음'}</dd>` : ''}</dl>`);
    h += stepHTML('2', `${pill(S)} ${esc(S.name)}에서 내리기`, `<p>엘리베이터와 가까운 칸: <b>${esc(S.board)}</b></p>`);
    h += stepHTML('3', `<span class="exit">${best.e.no}</span>번 출구 엘리베이터로 지상까지`, `<p class="meta">${esc(S.ground)}</p>${S.warn ? `<div class="note warn">${I.warn}<span>${esc(S.warn)}</span></div>` : ''}`, true);
    h += stepHTML('4', `${esc(v.name)}까지 약 ${mins(best.p.m)}분`, `<p>${best.p.real ? `계단을 피한 길로 약 <b>${Math.round(best.p.m)}m</b> (${m.label} 기준)` : `약 ${Math.round(best.p.m)}m 추정 (직선거리 기반, ${m.label} 기준)`}</p>${best.p.steps ? `<div class="note warn">${I.warn}<span>계단 없는 길을 찾지 못해 일부 구간에 계단이 있을 수 있어요.</span></div>` : ''}${best.p.real ? `<ol class="turns">${directions(best.p.pts, v, `${best.s.name} ${best.e.no}번 출구`).map(t => `<li>${t}</li>`).join('')}</ol><p class="meta">방향과 거리는 OpenStreetMap 보행로 기준 추정이에요. 현장 안내판을 함께 확인하세요.</p>` : ''}`);
  } else {
    const ps = D.pstats.full_days_by_lot, lot = v.parking || '가까운 공연장 주차장', lots = (v.parking || '').match(/P\d+[AB]?/g) || [];
    const lp = live.parking;
    h += stepHTML('1', '출발 전 확인', `${lp ? `<div class="live"><b>${lp.p.toLocaleString()}대</b><span class="meta">/ 2,200대 주차 중 · ${esc(lp.at)}</span></div><div class="meter"><i style="width:${Math.min(100, lp.p/22)}%"></i></div>` : '<p class="meta">실시간 주차 대수를 불러오는 중…</p>'}<p class="meta">주말 만차 기록의 62%가 오후 1~3시에 몰려 있어요. 저녁 공연도 낮부터 차요.</p>`);
    h += stepHTML('2', `${esc(v.gate || '동2문')}으로 들어가 ${esc(lot)} 주차`, `<p>${v.pcap ? `${v.pcap}대 규모` : ''}${lots.map(l => ps[l] ? ` · ${l}는 혼잡 기록 92일 중 ${ps[l]}일 만차` : '').join('')}</p><p class="meta">장애인·국가유공자 차량은 주차요금 50% 할인이에요(10분당 600원, 하루 최대 2만 원). 대형 공연 날엔 사전정산이 없고, 공연 티켓이 있어도 따로 할인되지 않아요. 입차는 오전 6시~밤 10시.</p>`, true);
    h += stepHTML('3', `${esc(v.name)}까지 걸어서 ${esc(v.pwalk || '몇')}분`, `<p class="meta">만남의광장 휠체어 진입로: 동2문 입차 → 그래피티의 벽 주차장 → 올림픽공원역 쪽 경사로</p>`);
  }
  // 도착 후
  let w = '';
  if (st.mode !== 'stroller' && T.end) {
    if (T.end.getHours()*60 + T.end.getMinutes() > 19*60) w = `<div class="note warn">${I.warn}<span>공연이 ${hm(T.end)}쯤 끝나는데 안내센터는 19:00에 닫아요. 대여 휠체어는 공연 전에 반납해야 하니 공연장 안에서 쓸 휠체어는 미리 챙기세요.</span></div>`;
    else if ((T.end - T.arrive)/60000 > 180) w = `<div class="note warn">${I.warn}<span>도착부터 종료까지 3시간이 넘어요. 무료 대여는 3시간까지예요.</span></div>`;
  }
  const tl = toiletsNear(v);
  h += stepHTML(I.pin, '공연장 도착', `<dl class="facts">
      <dt>${st.mode === 'stroller' ? '수유실' : '휠체어 대여'}</dt><dd>${st.mode === 'stroller' ? '평화의광장 안내센터(전자레인지 있음, 09:00~19:00)' : `${esc(c.name)} · 공연장에서 약 ${mins(c.p.m)}분 · 09:00~19:00, 신분증 맡기고 3시간 무료 · <a href="tel:${c.tel.split('~')[0].replace(/-/g,'')}">${esc(c.tel)}</a>`}</dd>
      <dt>가까운 화장실</dt><dd>${tl.map(t => `${esc(t.p)} ${esc(t.d)} (${Math.round(t.m)}m)`).join(' · ')}</dd></dl>${w}`);
  h += '</ol>';
  if (st.way === 'subway') {
    const seen = new Set([exitsFor(v)[0].s.id]);
    const alts = exitsFor(v).filter(x => !seen.has(x.s.id) && seen.add(x.s.id)).slice(0, 3);
    h += `<details class="alt"><summary>다른 역으로 가기 (${alts.length})</summary>${alts.map(x => `<div class="altrow"><p style="margin:0">${pill(x.s)} <b>${esc(x.s.name)}</b> <span class="exit">${x.e.no}</span>번 출구 → 약 ${mins(x.p.m)}분</p>${x.s.warn ? `<p class="meta">${esc(x.s.warn)}</p>` : ''}${elevNote(x.s)}</div>`).join('')}</details>`;
  }
  $('#pane-route').innerHTML = h;
  markSpeaking();
}

// ---------- 공연 후 ----------
// ---------- 막차 ----------
const HOLI = ['01-01','03-01','05-05','06-06','08-15','10-03','10-09','12-25'];  // 양력 공휴일(음력 명절·대체공휴일은 역에 확인)
const dayKind = d => (d.getDay() === 0 || d.getDay() === 6 || HOLI.includes(String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0'))) ? 'we' : 'wd';
function lastTrains(s, base) {
  const L = D.lastTrain.st[s.id]; if (!L) return [];
  return L[dayKind(base)].map(([dir, to, t]) => { const [H, M] = t.split(':').map(Number), d = new Date(base); d.setHours(H, M, 0, 0); if (H < 4) d.setDate(d.getDate() + 1); return {dir, to, at:d}; });
}
const TERM = ['방화', '마천', '중앙보훈병원', '개화', '별내', '모란'];  // 노선 종점
function ltTable(T, x) {
  const walk = mins(x.p.m) + 10;  // 걷는 시간 + 엘리베이터·개찰구 여유 10분
  const rows = lastTrains(x.s, T.start); if (!rows.length) return null;
  const groups = {}; rows.forEach(r => (groups[r.dir] ??= []).push(r));
  const base = t => t.replace('(급행)', ''), lab = t => base(t) + '행' + (t.includes('급행') ? ' 급행' : '');
  const miss = [];
  const body = Object.values(groups).sort((p, q) => q.length - p.length).map(g => {
    const term = TERM.find(t => g.some(r => base(r.to) === t)) || base(g[0].to), fulls = g.filter(r => base(r.to) === term), last = fulls.reduce((a, b) => b.at > a.at ? b : a);
    const by = addMin(last.at, -walk); if (T.leave > by) miss.push({r:last, by});
    return [...g].sort((a, b) => a.at - b.at).map(r => `<tr class="${base(r.to) === term ? '' : 'sub'}"><th scope="row">${esc(lab(r.to))}${base(r.to) === term ? ' <small>(종점)</small>' : ''}</th><td>${r === last ? `<b>${hm(r.at)}</b>` : hm(r.at)}</td><td>${hm(addMin(r.at, -walk))}</td></tr>`).join('');
  }).join('<tr class="gap"><td colspan="3"></td></tr>');
  return {miss, html:`<table><caption>${esc(x.s.name)} ${esc(x.s.line)} · ${x.e.no}번 출구까지 약 ${mins(x.p.m)}분</caption><thead><tr><th scope="col">열차(가는 곳)</th><th scope="col">막차</th><th scope="col">공연장에서 나설 시각</th></tr></thead><tbody>${body}</tbody></table>`};
}
function lastTrainHTML(T, v) {
  const all = exitsFor(v), seen = new Set(), per = all.filter(x => !seen.has(x.s.id) && seen.add(x.s.id));
  const main = ltTable(T, per[0]); if (!main) return '';
  const others = per.slice(1).map(x => ltTable(T, x)).filter(Boolean);
  const nm = m => esc(m.r.to.replace('(급행)', '')) + '행' + (m.r.to.includes('급행') ? ' 급행' : '');
  return `<div class="lt"><h3>막차 확인 <small>${dayKind(T.start) === 'we' ? '토·휴일' : '평일'} 시간표</small></h3>
  ${main.miss.map(m => `<div class="note warn">${I.info}<span>혼잡을 피해 ${hm(T.leave)}까지 기다리면 <b>${nm(m)} 막차(${hm(m.r.at)})</b>를 놓칠 수 있어요. ${m.by < T.end ? `공연이 끝나기 전(${hm(m.by)})에 나서야 탈 수 있어요. 이 방향이면 장애인콜택시나 아래 다른 노선을 미리 생각해 두세요.` : `이 방향이면 <b>${hm(m.by)}</b> 전에 공연장을 나서세요.`}</span></div>`).join('')}
  ${main.html}
  ${others.length ? `<details><summary>다른 역·노선 막차 보기</summary>${others.map(o => o.html).join('')}</details>` : ''}
  <p class="meta">표의 '가는 곳'까지 가거나 그 전에 내리면 그 열차를 탈 수 있어요. 나설 시각은 걷는 시간에 엘리베이터·개찰구 여유 10분을 더해 계산했어요. 서울교통공사 시간표(${D.lastTrain.asof} 기준)이며, 음력 명절·대체공휴일은 역에 확인하세요.</p></div>`;
}

function renderAfter() {
  const T = timesFor(), A = D.exit25, mx = Math.max(...A.event), v = venue();
  let h = speakBar('after');
  if (T.end) h += `<p class="meta" style="margin:0">혼잡을 피해 나서기 좋은 시각</p><div class="big">${hm(T.leave)} 이후</div>`;
  else h += `<h3 style="margin:0 0 4px">공연이 끝나면 1시간 넘게 붐벼요</h3>`;
  h += `<p>큰 공연이 끝나면 20~40분 뒤에 가장 붐벼요. 평소 같은 시각의 약 10배예요. 70분 뒤에는 절반, 90분 뒤에는 3분의 1로 줄어요. 엘리베이터와 출구 앞 줄도 이때 가장 길어요.</p>`;
  h += `<div class="note info">${I.info}<span>오래 기다리기 어렵다면 <b>공연이 끝나기 직전에 먼저 나서는 것</b>도 방법이에요. 끝나기 10분 전은 가장 붐빌 때의 3분의 1 정도예요.</span></div>`;
  if (T.end && st.way === 'subway') h += lastTrainHTML(T, v);
  h += `<div class="bars" role="img" aria-label="공연 종료 전후 10분 단위 출차 대수. 종료 20분 뒤 ${mx}대로 가장 많고, 70분 뒤 절반, 90분 뒤 3분의 1로 줄어요.">${A.min.map((o, i) => {
    const lab = T.end ? hm(addMin(T.end, o)) : (o === 0 ? '종료' : (o > 0 ? '+' : '') + o + '분');
    const hot = o >= 0 && A.event[i] >= mx / 2;
    return `<span class="t ${o === 0 ? 'end' : ''}">${lab}</span><div class="track"><div class="b ${hot ? 'hot' : ''}" style="width:${A.event[i]/mx*100}%"></div><div class="w" style="left:${A.base[i]/mx*100}%"></div></div><span class="n">${A.event[i]}</span>`;
  }).join('')}</div>
  <div class="legend"><span><i style="background:#d9480f"></i>가장 붐빌 때의 절반 이상</span><span><i style="background:var(--blue)"></i>공연일 10분 출차(대)</span><span><i style="background:var(--ink);opacity:.55;width:3px"></i>공연 없는 날 같은 시각</span></div>
  <p class="meta">2025년 올림픽공원 주차장 입출차 약 240만 건 중 관객 8천 명 이상 공연일 77일을 분석했어요. 출차가 몰리기 시작한 시점을 공연 종료로 맞추고, 날마다 값의 가운데 값(중앙값)을 보여 줘요.</p>
  <ol class="steps" style="margin-top:12px">
   ${stepHTML('1', '기다리는 동안', '<p>공연장 근처 화장실을 먼저 들르고, 출구 쪽 혼잡이 줄 때까지 실내에서 쉬세요.</p>')}
   ${stepHTML('2', '돌아가는 길', st.way === 'subway' ? `<p>올 때와 같은 <span class="exit">${exitsFor(v)[0].e.no}</span>번 출구 엘리베이터를 이용하세요.</p>` : `<p>공연이 끝나면 출차의 약 ${A.gates['동2문']}%가 동2문, ${A.gates['북2문']}%가 북2문, ${A.gates['남2문']}%가 남2문으로 몰려요.${v && v.gate ? ` 이 공연장 주차장은 <b>${esc(v.gate)}</b> 쪽이에요.` : ''} 종료 70분 뒤부터 나서면 기다림이 짧아요.</p>`)}
   ${stepHTML('3', '택시가 필요하면', `<p><b>서울 장애인콜택시</b> <a class="tel" href="tel:15884388">1588-4388</a> (전화·문자, 앱 '장애인콜택시')</p><p class="meta">필요한 때 바로 접수하는 방식이 원칙이라, 공연이 끝나면 바로 접수하세요. 끝난 직후엔 대기가 길 수 있어요. 휠체어 이용 시 보호자 등 3명까지 함께 탈 수 있어요. 시각장애인은 복지콜 <a class="tel" href="tel:16004477">1600-4477</a>.</p><p class="meta">타는 곳은 콜센터에 공연장 이름과 가까운 출입문(${esc((v && v.gate) || '동2문')})을 함께 말하면 찾기 쉬워요.</p>`)}
  </ol>`;
  $('#pane-after').innerHTML = h;
  markSpeaking();
}

// ---------- 지도 ----------
const B = {n:37.5262, s:37.5105, w:127.1085, e:127.1400};
const kx = 1000 / (B.e - B.w), ky = kx / Math.cos(rad(37.518));
const W = 1000, H = Math.round((B.n - B.s) * ky);
const P = ll => [+((ll[1]-B.w)*kx).toFixed(1), +((B.n-ll[0])*ky).toFixed(1)];
const pts = a => a.map(P).map(p => p.join(',')).join(' ');
let vb = {x:0, y:0, w:W, h:H};
const setVB = () => { const svg = $('#map'); svg.setAttribute('viewBox', `${vb.x} ${vb.y} ${vb.w} ${vb.h}`); const px = $('#mapwrap').clientWidth || 600, s = Math.max(0.35, Math.min(3, vb.w / px * 0.85)); svg.querySelectorAll('.sc').forEach(g => { const [x,y] = g.dataset.p.split(','); g.setAttribute('transform', `translate(${x} ${y}) scale(${s.toFixed(3)})`); }); };
function drawMap() {
  const v = venue() || {id:'', name:'', lat:0, lng:0}, svg = $('#map'), has = !!venue();
  let route = null;
  if (has && st.way === 'subway') route = exitsFor(v)[0].p.pts;
  const mark = (ll, inner, title, off) => { const p = P(ll); return `<g class="sc" data-p="${p[0]},${p[1]}"><title>${esc(title)}</title>${off ? `<g transform="translate(${off[0]} ${off[1]})">${inner}</g>` : inner}</g>`; };
  const OFF = {'olpark5-2':[22,20], 'olpark9-3':[-26,6], 'olpark9-4':[4,-24]};
  let g = `<title id="mapTitle">올림픽공원 지도: ${esc(v.name)}까지 경로</title><rect x="-2000" y="-2000" width="${W+4000}" height="${H+4000}" fill="var(--bg)"/>`;
  g += Object.values(D.roads).map(r => `<polyline points="${pts(r)}" fill="none" stroke="var(--road)" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>`).join('');
  g += `<polygon points="${pts(D.park)}" fill="var(--park)" stroke="light-dark(#9cc08a,#35593f)" stroke-width="2"/>`;
  if (st.layers.path && D.paths) g += `<g stroke="var(--path)" stroke-width="2.2" fill="none" stroke-linecap="round">${D.paths.map(p => `<polyline points="${pts(p)}"/>`).join('')}</g>`;
  g += `<polygon points="${pts(D.water['몽촌호'])}" fill="var(--water)"/><polygon points="${pts(D.water['88호수'])}" fill="var(--water)"/><polyline points="${pts(D.water['성내천'])}" fill="none" stroke="var(--water)" stroke-width="7"/>`;
  if (route) g += `<polyline class="route" points="${pts(route)}" stroke-opacity=".25" stroke-width="12"/><polyline class="route anim" points="${pts(route)}"/>`;
  if (st.layers.toilet) g += D.fac.filter(f => f.k === '화장실').map(f => mark(f.ll, `<rect x="-11" y="-11" width="22" height="22" rx="5" fill="#2b8a3e"/><text y="4" font-size="11" fill="#fff" text-anchor="middle" font-weight="700">WC</text>`, `화장실 · ${f.p} ${f.d}`)).join('');
  if (st.layers.store) g += D.fac.filter(f => /편의점|식음료/.test(f.k)).map(f => mark(f.ll, `<circle r="8" fill="#7048e8" stroke="#fff" stroke-width="2"/>`, `${f.k} · ${f.p}`)).join('');
  if (st.layers.center) g += D.centers.map(c => mark([c.lat,c.lng], `<circle r="15" fill="var(--yel)" stroke="#111" stroke-width="1.5"/><text y="6" font-size="17" text-anchor="middle" font-weight="700" fill="#111">i</text>`, `${c.name} · 휠체어 무료 대여`)).join('');
  g += D.venues.map(x => { const on = x.id === v.id; return mark(vll(x), `<circle r="${on ? 15 : 9}" fill="${on ? 'var(--blueBg)' : 'var(--mute)'}" stroke="#fff" stroke-width="3"/><text y="${on ? -24 : -15}" font-size="${on ? 24 : 16}" font-weight="${on ? 700 : 500}" text-anchor="middle" fill="var(--ink)" paint-order="stroke" stroke="var(--bg)" stroke-width="5">${esc(x.name)}</text>`, x.name); }).join('');
  const best = has && st.way === 'subway' ? exitsFor(v)[0].id : '';
  D.stations.forEach(s => s.ev.forEach(e => { const id = s.id + '-' + e.no, on = id === best; g += mark(e.ll, `<rect x="-16" y="-16" width="32" height="32" rx="7" fill="${on ? 'var(--yel)' : '#fff'}" stroke="${s.color}" stroke-width="3.5"/><text y="6" font-size="18" font-weight="700" text-anchor="middle" fill="#111">${e.no}</text>`, `${s.name} ${s.line} ${e.no}번 출구 엘리베이터`, OFF[id]); }));
  [['몽촌토성역', D.stations[2].ev[0].ll, 0, -30], ['한성백제역', D.stations[3].ev[0].ll, 0, 44], ['올림픽공원역', D.stations[0].ev[0].ll, -10, 48]].forEach(([n, ll, dx, dy]) => { g += mark(ll, `<text x="${dx}" y="${dy}" font-size="19" font-weight="700" text-anchor="middle" fill="var(--ink)" paint-order="stroke" stroke="var(--bg)" stroke-width="5">${n}</text>`, n); });
  svg.innerHTML = g;
  fit(has ? (route || [vll(v), [centerFor(v).lat, centerFor(v).lng]]) : D.park);
  const dirs = has && st.way === 'subway' && exitsFor(v)[0].p.real ? directions(exitsFor(v)[0].p.pts, v, `${exitsFor(v)[0].s.name} ${exitsFor(v)[0].e.no}번 출구`) : [];
  $('#mapsay').hidden = !SPEECH || !dirs.length;
  $('#mapdesc').innerHTML = dirs.length ? `<h3 style="margin:0 0 6px;font-size:16px">지도 내용 글로 보기</h3><ol class="turns">${dirs.map(t => `<li>${t}</li>`).join('')}</ol>` : '';
  $('#mapnote').textContent = !has ? '공연을 고르면 엘리베이터 출구에서 공연장까지 계단 없는 길을 그려 드려요. 노란 숫자: 엘리베이터 출구, 노란 i: 휠체어 대여.' : st.way === 'subway' ? (exitsFor(v)[0].p.real ? '파란 선: 계단을 피한 보행로 (OpenStreetMap 보행로 기준).' : '파란 선: 출구에서 공연장까지 방향 (실제 길은 현장 안내를 따르세요).') : '노란 i: 휠체어 무료 대여 안내센터';
}
function fit(list) {
  const p = list.map(P), xs = p.map(a => a[0]), ys = p.map(a => a[1]);
  let x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
  const wrap = $('#mapwrap'), ar = wrap.clientWidth / Math.max(1, wrap.clientHeight) || 4/3;
  let w = Math.max(x1 - x0, 260) * 1.6, h = Math.max(y1 - y0, 200) * 1.6;
  if (w / h > ar) h = w / ar; else w = h * ar;
  vb = {x:(x0+x1)/2 - w/2, y:(y0+y1)/2 - h/2, w, h}; setVB();
}
function zoom(f, cx, cy) { const nw = Math.min(W*1.6, Math.max(120, vb.w * f)), nh = nw * vb.h / vb.w; cx ??= vb.x + vb.w/2; cy ??= vb.y + vb.h/2; vb = {x:cx - (cx - vb.x) * nw / vb.w, y:cy - (cy - vb.y) * nh / vb.h, w:nw, h:nh}; setVB(); }
{ // 드래그·휠·핀치
  const wrap = $('#mapwrap'), ptr = new Map(); let last = null, pinch = null;
  const toSvg = (cx, cy) => { const r = wrap.getBoundingClientRect(); return [vb.x + (cx - r.left) / r.width * vb.w, vb.y + (cy - r.top) / r.height * vb.h]; };
  wrap.addEventListener('pointerdown', e => { if (e.target.closest('.zoom')) return; wrap.setPointerCapture(e.pointerId); ptr.set(e.pointerId, [e.clientX, e.clientY]); wrap.classList.add('drag'); last = [e.clientX, e.clientY]; if (ptr.size === 2) { const [a, b] = [...ptr.values()]; pinch = Math.hypot(a[0]-b[0], a[1]-b[1]); } });
  wrap.addEventListener('pointermove', e => { if (!ptr.has(e.pointerId)) return; ptr.set(e.pointerId, [e.clientX, e.clientY]); const r = wrap.getBoundingClientRect();
    if (ptr.size === 2 && pinch) { const [a, b] = [...ptr.values()], d = Math.hypot(a[0]-b[0], a[1]-b[1]); const c = toSvg((a[0]+b[0])/2, (a[1]+b[1])/2); zoom(pinch / d, c[0], c[1]); pinch = d; return; }
    vb.x -= (e.clientX - last[0]) / r.width * vb.w; vb.y -= (e.clientY - last[1]) / r.height * vb.h; last = [e.clientX, e.clientY]; setVB(); });
  const up = e => { ptr.delete(e.pointerId); if (ptr.size < 2) pinch = null; if (!ptr.size) wrap.classList.remove('drag'); else last = [...ptr.values()][0]; };
  wrap.addEventListener('pointerup', up); wrap.addEventListener('pointercancel', up);
  wrap.addEventListener('wheel', e => { e.preventDefault(); const c = toSvg(e.clientX, e.clientY); zoom(e.deltaY > 0 ? 1.15 : 1/1.15, c[0], c[1]); }, {passive:false});
  $('#zin').onclick = () => zoom(1/1.4); $('#zout').onclick = () => zoom(1.4); $('#zfit').onclick = () => drawMap();
}

// ---------- 탭 ----------
function setTab(t, quiet) {
  if (st.tab !== t) stopSpeak();
  st.tab = t;
  const desk = matchMedia('(min-width:960px)').matches;
  if (desk && t === 'map') st.tab = t = 'route';
  document.querySelectorAll('[role=tab]').forEach(b => b.setAttribute('aria-selected', b.dataset.tab === t));
  const none = !venue(); $('#pane-route').hidden = none || t !== 'route'; $('#pane-after').hidden = none || t !== 'after'; document.querySelector('.tabs').hidden = none; $('#pane-map').hidden = !desk && t !== 'map';
  if (t === 'map' && !quiet) requestAnimationFrame(drawMap);
  if (!desk && st.started && !quiet) { const el = t === 'map' ? $('#pane-map') : $('#pane-' + t); scrollTo({top:el.getBoundingClientRect().top + scrollY - 76, behavior:'smooth'}); }
  if (location.hash.slice(1) !== t) history.replaceState(null, '', '#' + t);
}

// ---------- 전체 렌더 ----------
function render() {
  if (!venue()) { renderStart(); drawMap(); setTab(st.tab, true); return; }
  $('#times').hidden = false; renderTrip(); renderRoute(); renderAfter(); drawMap(); setTab(st.tab, true);
}
function renderStart() {
  const quick = shows.slice(0, 3);
  $('#trip').innerHTML = `
    <h2 style="margin:0 0 4px">어떤 공연에 가세요?</h2>
    <p class="meta" style="margin:0">공연을 고르면 엘리베이터 있는 출구, 계단 없는 길, 휠체어 대여, 공연 뒤 혼잡 시간까지 알려 드려요.</p>
    <button class="pick" id="openSheet">${I.cal} 공연 선택</button>
    ${quick.length ? `<p class="qlabel">곧 열리는 공연</p><div class="showlist">${quick.map(s => showBtn(s, shows.indexOf(s))).join('')}</div>` : ''}
    <p class="qlabel">이동 방법 (나중에 바꿀 수 있어요)</p>
    <div class="seg" role="group" aria-label="이동 방법">${MODES.map(m => `<button data-mode="${m.id}" aria-pressed="${st.mode === m.id}">${m.icon}${m.label}</button>`).join('')}</div>
    <div class="seg" role="group" aria-label="교통수단">${WAYS.map(w => `<button data-way="${w.id}" aria-pressed="${st.way === w.id}">${w.icon}${w.label}</button>`).join('')}</div>
    ${installHTML()}`;
  $('#times').hidden = true;
  const ph = t => `<div class="empty">${I.info}<p>${t}</p><button class="pick" data-open>${I.cal} 공연 선택</button></div>`;
  $('#pane-route').innerHTML = ph('공연을 먼저 고르면 가는 길을 단계별로 안내해 드려요.');
  $('#pane-after').innerHTML = ph('공연을 고르면 끝나는 시각에 맞춰 붐비는 시간과 나서기 좋은 시각을 알려 드려요.');
}
const showBtn = (s, i) => `<button class="show" data-i="${i}" aria-pressed="${s === st.show}"><span class="d"><b>${s.at.getMonth()+1}/${s.at.getDate()}</b><span>${DOW[s.at.getDay()]} ${hm(s.at)}</span></span><span><span class="tt">${esc(s.title)}</span><br><span class="vv">${esc(D.venues.find(v => v.id === s.venue).name)}</span></span></button>`;
function renderShows() {
  $('#shows').innerHTML = shows.map((s, i) => showBtn(s, i)).join('') || '<p class="meta">예정된 공연 정보가 없어요.</p>';
  $('#evSrc').textContent = evSource === 'live' ? '올림픽공원 공식 일정에서 방금 불러온 공연이에요.' : evSource === 'saved' ? `공식 일정 ${fmtDate(evSavedAt)} ${hm(evSavedAt)}에 저장해 둔 공연이에요.` : `공연 일정: ${D.asof} 저장본`;
  $('#venueSel').innerHTML = `<option value="">공연장 고르기</option>` + D.venues.map(v => `<option value="${v.id}" ${v.id === st.venue ? 'selected' : ''}>${esc(v.name)}</option>`).join('');
}
$('#layers').innerHTML = [['path','보행로'],['toilet','화장실'],['center','안내센터'],['store','편의점']].map(([k,l]) => `<button data-k="${k}" aria-pressed="${st.layers[k]}">${l}</button>`).join('');

function shareURL() {
  const s = curShow(), p = new URLSearchParams({v:st.venue, m:st.mode, w:st.way});
  if (s) { p.set('t', s.at.toISOString()); p.set('n', s.title.slice(0, 80)); }
  return location.origin + location.pathname + '?' + p + '#route';
}
function shareText() {
  const v = venue(), s = curShow(), T = timesFor(), m = MODES.find(x => x.id === st.mode).label, w = WAYS.find(x => x.id === st.way).label;
  const L = [`[편한길 올팍] ${s ? s.title : v.name}`];
  if (s) L.push(`${fmtDate(s.at)} ${hm(s.at)} 시작 · ${v.name}`); else L.push(v.name);
  L.push(`${m} · ${w}`);
  if (s && st.way === 'subway') { const x = exitsFor(v)[0]; L.push(`${hm(T.arrive)}까지 ${x.s.name} ${x.s.line} ${x.e.no}번 출구(엘리베이터)에서 만나요`); }
  else if (s) L.push(`${hm(T.arrive)}까지 ${v.gate || '동2문'} 쪽 주차장 도착`);
  if (s) L.push(`끝나면 ${hm(T.leave)} 이후 나서기 (혼잡 피하기)`);
  return L.join('\n');
}
async function shareTrip() {
  const url = shareURL(), text = shareText();
  if (navigator.share) { try { await navigator.share({title:'편한길 올팍', text, url}); return; } catch(e) { if (e && e.name === 'AbortError') return; } }
  try { await navigator.clipboard.writeText(text + '\n' + url); toast('안내와 링크를 복사했어요. 문자나 메신저에 붙여 넣으세요.'); }
  catch(e) { toast('이 링크를 복사해 보내세요: ' + url); }
}
function toast(msg) {
  let t = $('#toast'); if (!t) { t = document.createElement('div'); t.id = 'toast'; t.setAttribute('role', 'status'); document.body.append(t); }
  t.textContent = msg; t.classList.add('on'); clearTimeout(toast.h); toast.h = setTimeout(() => t.classList.remove('on'), 3500);
}

// ---------- 설치(PWA)·오프라인 ----------
let installEvt = null;
const standalone = () => matchMedia('(display-mode: standalone)').matches || navigator.standalone;
const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
function installHTML() {
  if (standalone()) return '';
  if (installEvt) return `<div class="install"><p>휴대폰에 앱처럼 설치해 두면 공원 안에서 통신이 약해도 길 안내가 열려요.</p><button id="installBtn">설치하기</button></div>`;
  if (isIOS) return `<div class="install"><p>아이폰은 Safari 아래쪽 <b>공유</b> 버튼 → <b>홈 화면에 추가</b>를 누르면 앱처럼 설치돼요. 통신이 약해도 길 안내가 열려요.</p></div>`;
  return '';
}
addEventListener('beforeinstallprompt', e => { e.preventDefault(); installEvt = e; if (!venue()) renderStart(); });
addEventListener('appinstalled', () => { installEvt = null; toast('설치했어요. 홈 화면에서 편한길 올팍을 여세요.'); if (!venue()) renderStart(); });
const netState = () => { $('#offline').hidden = navigator.onLine; };
addEventListener('online', () => { netState(); toast('다시 연결됐어요. 새로고침하면 실시간 정보를 다시 불러와요.'); });
addEventListener('offline', netState);
if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
// 마지막으로 불러온 공식 일정을 기기에 저장해 두고, 연결이 없을 때 씀
function saveEvents(ev) { try { localStorage.setItem('pyeonhanEvents', JSON.stringify({at:Date.now(), ev})); } catch(e) {} }
function loadSavedEvents() { try { const s = JSON.parse(localStorage.getItem('pyeonhanEvents') || 'null'); if (s && Date.now() - s.at < 14 * 864e5 && s.ev.length) return s; } catch(e) {} return null; }

// 이벤트
document.addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  if (b.dataset.mode) { st.mode = b.dataset.mode; save(); render(); }
  else if (b.dataset.way) { st.way = b.dataset.way; save(); render(); }
  else if (b.dataset.tab) setTab(b.dataset.tab);
  else if (b.dataset.k) { st.layers[b.dataset.k] = !st.layers[b.dataset.k]; b.setAttribute('aria-pressed', st.layers[b.dataset.k]); drawMap(); }
  else if (b.id === 'openSheet' || b.dataset.open !== undefined) { renderShows(); $('#sheet').showModal(); }
  else if (b.id === 'sheetX') $('#sheet').close();
  else if (b.classList.contains('show')) { dropLink(); st.show = shows[+b.dataset.i]; st.venue = st.show.venue; if ($('#sheet').open) $('#sheet').close(); render(); scrollTo({top:0, behavior:'smooth'}); }
  else if (b.dataset.sayall !== undefined) { if (sp.on && sp.pane === b.dataset.sayall) stopSpeak(); else sayPane(b.dataset.sayall); }
  else if (b.dataset.rate !== undefined) { sp.rate = sp.rate < 1 ? 1 : 0.8; try { localStorage.setItem('pyeonhanRate', sp.rate); } catch(e) {} refreshBars(); if (sp.on) sayPane(sp.pane); }
  else if (b.dataset.say !== undefined) { const stEl = b.closest('.step'), pane = b.closest('.pane').id.slice(5), idx = [...document.querySelectorAll(`#pane-${pane} .step`)].indexOf(stEl); sayList(pane, [{step:idx, text:speakable(stEl)}], 0); }
  else if (b.id === 'mapsay') { if (sp.on && sp.pane === 'map') { stopSpeak(); return; } const items = [...$('#mapdesc').querySelectorAll('li')].map(li => ({step:-1, text:speakable(li)})); const c = centerFor(venue()), tl = toiletsNear(venue()); items.unshift({step:-1, text:`지도 안내예요. 파란 선은 계단을 피한 길이에요.`}); items.push({step:-1, text:`공연장에서 가장 가까운 화장실은 ${tl[0].p}, 약 ${r10(tl[0].m)}미터 거리예요. 휠체어 대여는 ${c.name}에서 해요.`}); sayList('map', items, 0); }
  else if (b.id === 'shareBtn') shareTrip();
  else if (b.id === 'installBtn' && installEvt) { installEvt.prompt(); installEvt.userChoice.finally(() => { installEvt = null; if (!venue()) renderStart(); }); }
  else if (b.id === 'bigBtn') { setFs((fsLevel + 1) % 3); save(); drawMap(); }
});
$('#sheet').addEventListener('click', e => { if (e.target === $('#sheet')) $('#sheet').close(); });
$('#venueSel').addEventListener('change', e => { if (!D.venues.some(v => v.id === e.target.value)) return; dropLink(); st.venue = e.target.value; if (st.show && st.show.venue !== st.venue) st.show = null; $('#sheet').close(); render(); });
setFs(fsLevel);
addEventListener('hashchange', () => setTab(location.hash.slice(1) || 'route'));
addEventListener('resize', () => setTab(st.tab));

$('#sources').innerHTML = `<ul>
<li><b>한국체육산업개발</b>: 올림픽공원 실시간 주차현황 API, 공식 일정안내, 공연정보(문화공공데이터광장, 2,502건), 주차장 입출차 정보(2025년 약 240만 건·2024.7 215,528건), 연계 데이터(2025 시간별 공연·관객·날씨), 주차장 혼잡도 정보(2025.2~2026.8, 699건)</li>
<li><b>서울교통공사</b>: 교통약자이용정보 API(엘리베이터 실시간 가동·안전발판), 엘리베이터 설치현황, 9호선 2·3단계 엘리베이터 설치현황, 역사 장애인화장실정보, 수유실현황, 전동휠체어 급속충전기 운영 정보</li>
<li><b>국민체육진흥공단</b>: 올림픽공원 편의시설 정보(화장실·매점 위치, 2021)</li>
<li><b>서울교통공사</b> 사이버스테이션: 역별 첫차·막차 시간표 · <b>서울시설공단</b>: 장애인콜택시 이용 안내</li>
<li>올림픽공원 홈페이지: 공연장별 주차장·주차요금, 안내센터 휠체어 대여, 휠체어 진입로 · 지도와 보행로: OpenStreetMap</li></ul>
<p><b>한계</b>: 공원 안 경사로 기울기·턱·장애인 화장실 위치는 공개 데이터가 없어요. 보행로는 OpenStreetMap에서 계단으로 표시된 길만 피한 것이라 현장과 다를 수 있어요. 공연 종료 시각은 공식 소요시간이 없으면 같은 출연자의 지난 공연이나 공연장의 보통 소요시간(공연정보 API)으로 추정해요. 공연 뒤 혼잡은 주차장 출차 기록이라 걸어서 나가는 사람의 흐름과는 조금 다를 수 있어요.</p>`;

// ---------- 시작 ----------
{ const s = loadSavedEvents(); if (s) { evSource = 'saved'; evSavedAt = new Date(s.at); setShows(s.ev); } }
netState();
renderShows(); render(); setTab(location.hash.slice(1) || 'route'); st.started = true;
(async () => { try { const j = await fetch(C.PARKING_API).then(r => r.json()); const p = +j[0].parking_sum; if (p >= 0) { live.parking = {p, at:hm(new Date()) + ' 실시간'}; if (st.way === 'car' && venue()) renderRoute(); } } catch(e) {} })();
(async () => { try { if (!C.LIVE_API) throw 0; const j = await fetch(C.LIVE_API + '/elevators').then(r => r.json()); live.elev = j.items && j.items.length ? j : 'fail'; } catch(e) { live.elev = 'fail'; } if (venue()) renderRoute(); })();
if (window.loadLiveEvents) loadLiveEvents(D.venues).then(ev => { if (ev.length) { evSource = 'live'; saveEvents(ev); setShows(ev); renderShows(); render(); } }).catch(() => {});
}
