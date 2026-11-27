{
const D = window.DATA, C = window.CONFIG || {};
const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const I = {
  elev: '<svg class="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="3" width="14" height="18" rx="1"/><path d="m10 10 2-2 2 2M10 14l2 2 2-2"/></svg>',
  xfer: '<svg class="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3l4 4-4 4M21 7H9M7 21l-4-4 4-4M3 17h12"/></svg>',
  walk: '<svg class="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13" cy="4" r="2"/><path d="M7 21l3-4M16 21l-2-4-3-3 1-6M6 12l2-3 4-1 3 3 3 1"/></svg>',
  map: '<svg class="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7l6-3 6 3 6-3v13l-6 3-6-3-6 3z"/><path d="M9 4v13M15 7v13"/></svg>',
  flag: '<svg class="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 21V4M5 4h11l-2 4 2 4H5"/></svg>',
  bus: '<svg class="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="14" rx="3"/><path d="M4 11h16M8 21v-4M16 21v-4"/><circle cx="8" cy="14" r=".8"/><circle cx="16" cy="14" r=".8"/></svg>',
  chev: '<svg class="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',
  park: '<svg class="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="3"/><path d="M10 16V8h3a2 2 0 0 1 0 4h-3"/></svg>',
  left: '<svg class="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 20v-9a3 3 0 0 0-3-3H6M10 4 6 8l4 4"/></svg>',
  right: '<svg class="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 20v-9a3 3 0 0 1 3-3h9M14 4l4 4-4 4"/></svg>',
  up: '<svg class="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20V4M6 10l6-6 6 6"/></svg>',
  back: '<svg class="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 14 4 9l5-5M4 9h11a5 5 0 0 1 0 10h-3"/></svg>',
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
function setFs(n) { fsLevel = +n || 0; const r = document.documentElement; r.classList.remove('fs1', 'fs2'); if (fsLevel) r.classList.add('fs' + fsLevel); const b = document.getElementById('bigBtn'); if (b) { const n = ['보통', '크게', '아주 크게'][fsLevel]; b.innerHTML = `<span>글자 크기</span> <span>${n}</span>`; } }
// ---------- 상태 ----------
const MODES = [{id:'wheel', label:'휠체어', speed:55, icon:I.wheel}, {id:'stroller', label:'유아차', speed:60, icon:I.stroller}, {id:'slow', label:'걷기 힘듦', speed:40, icon:I.slow}];
const WAYS = [{id:'subway', label:'지하철', icon:I.train}, {id:'car', label:'자동차', icon:I.car}];
const st = {show:null, venue:null, mode:'wheel', way:'subway', tab:'route', layers:{route:true, toilet:true, center:true, store:false, path:true, report:true}};
const live = {parking:null, elev:null, ramp:null, reports:null};
try { const s = JSON.parse(localStorage.getItem('pyeonhan') || '{}'); if (s.from) st.from = s.from; if (s.mode) st.mode = s.mode; if (s.way) st.way = s.way; if (s.fs) setFs(s.fs); else if (s.big) setFs(1); } catch(e) {}
// 공유 링크: ?v=공연장&t=시작시각&n=공연명&m=이동방법&w=교통수단
const Q = new URLSearchParams(location.search), linkShow = (() => {
  const v = Q.get('v'), t = Q.get('t'); if (!v) return null;
  if (['wheel','stroller','slow'].includes(Q.get('m'))) st.mode = Q.get('m');
  if (['subway','car'].includes(Q.get('w'))) st.way = Q.get('w');
  if (Q.get('f')) st.from = Q.get('f').slice(0, 20);
  if (!D.venues.some(x => x.id === v)) return null;
  st.venue = v; const at = t ? new Date(t) : null;
  return at && !isNaN(at) ? {title:(Q.get('n') || '').slice(0, 80), venue:v, at} : null;
})();
let linkOn = !!linkShow;
const dropLink = () => { if (location.search) { linkOn = false; history.replaceState(null, '', location.pathname + location.hash); } };
const save = () => { try { localStorage.setItem('pyeonhan', JSON.stringify({mode:st.mode, way:st.way, fs:fsLevel, from:st.from || ''})); } catch(e) {} };

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
const sp = {on:false, pane:null, idx:-1, queue:[], rate:1, voice:''};
try { sp.rate = +(localStorage.getItem('pyeonhanRate') || 1); } catch(e) {}
// 목소리: 기기에 있는 한국어 목소리 중 자연스러운 것(신경망·향상된 음질)을 먼저 고르고, 사용자가 바꿀 수 있게
try { sp.voice = localStorage.getItem('pyeonhanVoice') || ''; } catch(e) {}
const NOVELTY = /Eddy|Flo|Grandma|Grandpa|Reed|Rocko|Sandy|Shelley|Albert|Bad News|Bahh|Bells|Boing|Bubbles|Cellos|Wobble|Good News|Jester|Organ|Superstar|Trinoids|Whisper|Zarvox|Fred|Junior|Ralph|Kathy/i;
const voiceScore = v => (/Natural|Neural|Online|Enhanced|Premium|향상|고품질|프리미엄/i.test(v.name + v.voiceURI) ? 8 : 0) + (/Google/i.test(v.name) ? 6 : 0) + (/SunHi/i.test(v.name) ? 1 : 0) + (/Yuna|유나|SunHi|InJoon|Hyunsu|Minjung|Heami|Samsung/i.test(v.name) ? 2 : 0) - (NOVELTY.test(v.name) ? 20 : 0) + (v.localService ? 0 : 1);
const LANG = () => (window.I18N ? I18N.lang : 'ko'), TR = t => (window.I18N ? I18N.tr(t) : t);
const koVoices = () => SPEECH ? (speechSynthesis.getVoices() || []).filter(v => v.lang.toLowerCase().startsWith(LANG()) && !NOVELTY.test(v.name)).sort((a, b) => voiceScore(b) - voiceScore(a) || a.name.localeCompare(b.name)) : [];
const koVoice = () => { const L = koVoices(); return L.find(v => v.voiceURI === sp.voice) || L[0]; };
const voiceLabel = v => v.name.replace(/^Microsoft\s+/i, '').replace(/\s*[-–]\s*Korean.*$/i, '').replace(/\s*\((한국어|Korean).*$/i, '').replace(/Online \(Natural\)/i, '자연스러운 음성').replace(/Enhanced|Premium/i, '향상된 음질').trim() || v.name;
function voicePicker() {
  const L = koVoices(); if (!L.length) return '';
  const cur = koVoice();
  return `<label class="voice"><span>목소리</span><select data-voice>${L.map((v, i) => `<option value="${esc(v.voiceURI)}" ${v === cur ? 'selected' : ''}>${esc(voiceLabel(v))}${i === 0 && L.length > 1 ? ' (추천)' : ''}</option>`).join('')}</select></label><button class="vhelp" data-vhelp aria-expanded="${!!sp.help}">목소리 더 받기</button>${sp.help ? `<div class="vnote"><p><b>더 자연스러운 목소리를 받는 법</b></p><ul><li>아이폰: 설정 → 손쉬운 사용 → 읽기 및 말하기 → 음성 → 한국어 → '유나(향상된 음질)' 내려받기</li><li>안드로이드: 설정 → 접근성(또는 일반) → 텍스트 음성 변환 → 기본 엔진 'Google' → 음성 데이터 설치 → 한국어</li><li>PC: 크롬이나 엣지로 열면 'Google 한국의'나 '자연스러운 음성'을 고를 수 있어요.</li></ul><p class="meta">받은 뒤 이 페이지를 새로고침하면 목록에 나와요. 지금 이 기기에서 쓸 수 있는 목소리는 ${L.length}개예요.</p></div>` : ''}`;
}
// 24시간제를 말하기 좋게: 23:27 → 밤 11시 27분
const sayHM = (h, m) => { h = +h; m = +m; const p = h < 5 ? (h ? '새벽' : '밤') : h < 12 ? '오전' : h === 12 ? '낮' : h < 18 ? '오후' : h < 20 ? '저녁' : '밤'; return `${p} ${h % 12 || 12}시${m ? ' ' + m + '분' : ''}`; };
function speakable(el) {
  const c = el.cloneNode(true), end = (x, t) => x.append(t);
  // 소리로 들을 필요 없는 것: 버튼·아이콘·펼침 표시·다른 역 막차 등 접힌 상세
  c.querySelectorAll('button, .say, .dot, svg, .speak, .ic, .chev, .maplinks, .diagram, details details, .lt h3, .lt > .meta').forEach(x => x.remove());
  // 표는 '○○행 막차 ○시 ○분'으로 줄여 읽기 (종점 행만)
  const KO = LANG() === 'ko';
  c.querySelectorAll('table').forEach(t => { const r = [...t.querySelectorAll('tbody tr')].filter(x => !x.classList.contains('sub') && x.querySelector('th')); const s2 = document.createElement('p'); s2.textContent = r.map(x => x.querySelector('th').textContent.replace(/\s*[(（][^)）]*[)）]/, '') + (KO ? ' 막차, ' : ', ') + x.querySelector('td').textContent).join('. '); t.replaceWith(s2); });
  c.querySelectorAll('.tx small').forEach(x => { const k = x.textContent.trim(); if (k && c.textContent.split(k).length > 2) x.remove(); });
  if (KO) c.querySelectorAll('.exit').forEach(x => x.textContent = x.textContent + '번');
  c.querySelectorAll('.tx b, .tx small, .chip, h3, dd, p, li, .note, summary').forEach(x => end(x, '. '));
  c.querySelectorAll('dt').forEach(x => end(x, ': '));
  let t = (c.innerText || c.textContent).replace(/번번/g, '번');
  if (!KO) return t.replace(/[·•|→]/g, ', ').replace(/\s+/g, ' ').replace(/\s+([.,])/g, '$1').replace(/([.,。])(?:\s*[.,。])+/g, '$1').trim();
  t = t
    .replace(/(\d{4})-(\d{1,2})-(\d{1,2})/g, (m, y, mo, d) => `${+mo}월 ${+d}일`)
    .replace(/\b0(\d{1,2})-(\d{3,4})-(\d{4})(~\d)?/g, (m, a, b, c2) => ['0' + a, b, c2].map(g => g.split('').join(' ')).join(', '))
    .replace(/\b(1[56]\d{2})-(\d{4})\b/g, (m, a, b) => [a, b].map(g => g.split('').join(' ')).join(', '))
    .replace(/(\d{1,2}):(\d{2})\s*~\s*(\d{1,2}):(\d{2})/g, (m, a, b, c2, d) => `${sayHM(a, b)}부터 ${sayHM(c2, d)}까지`)
    .replace(/(\d{1,2}):(\d{2})/g, (m, a, b) => sayHM(a, b))
    .replace(/(?<![\d:])(1[3-9]|2[0-3])시/g, (m, a) => sayHM(a, 0))
    .replace(/\bB(\d)\b/g, '지하 $1층').replace(/\b(\d)F\b/g, '지상 $1층')
    .replace(/(\d)-(\d) 칸/g, '$1 다시 $2번 칸').replace(/(\d)-(\d)/g, '$1 다시 $2')
    .replace(/(\d)m\b/g, '$1미터').replace(/\s*→\s*/g, ', ').replace(/↔/g, '에서 ').replace(/[·•|]/g, ', ')
    .replace(/\s*\([^()]*\)(?=[가-힣])/g, '').replace(/\(([^()]*)\)/g, ', $1, ')
    .replace(/\.(?=[가-힣A-Za-z])/g, '. ').replace(/\s+/g, ' ').replace(/\s+([.,])/g, '$1').replace(/([.,])(?:\s*[.,])+/g, '$1').replace(/^[.,\s]+/, '').replace(/,\s*$/, '.').trim();
  // 같은 문장이 요약과 본문에 겹치면 한 번만
  const seen = new Set();
  return t.split(/(?<=[.?!])\s+/).filter(x => { const k = x.replace(/[\s.,]/g, ''); if (!k || seen.has(k)) return false; seen.add(k); return true; }).join(' ');
}
function speakBar(pane) {
  if (!SPEECH) return '';
  const on = sp.on && sp.pane === pane;
  return `<div class="speak" role="group" aria-label="음성 안내"><button class="sayall ${on ? 'on' : ''}" data-sayall="${pane}" aria-pressed="${on}">${on ? I.stop + ' 그만 듣기' : I.spk + (pane === 'route' ? ' 가는 길 소리로 듣기' : ' 공연 후 안내 듣기')}</button><button class="rate" data-rate>말하기 속도: ${sp.rate < 1 ? '천천히' : '보통'}</button>${voicePicker()}</div>`;
}
function stopSpeak() { if (!SPEECH) return; sp.on = false; sp.idx = -1; sp.queue = []; speechSynthesis.cancel(); markSpeaking(); refreshBars(); }
function refreshBars() { document.querySelectorAll('.speak').forEach(b => { const p = b.querySelector('[data-sayall]').dataset.sayall; b.outerHTML = speakBar(p); }); }
function markSpeaking() {
  document.querySelectorAll('.step.speaking').forEach(s => s.classList.remove('speaking'));
  // 단계별 '듣기' 버튼: 읽는 중인 단계는 '그만'으로 바뀌어 다시 누르면 멈춰요
  document.querySelectorAll('button.say[aria-pressed="true"]').forEach(b => { b.setAttribute('aria-pressed', 'false'); b.innerHTML = `${I.spk}<span>듣기</span>`; });
  if (!sp.on || sp.idx < 0) return;
  const s = document.querySelectorAll(`#pane-${sp.pane} .step`)[sp.idx];
  if (s) { s.classList.add('speaking'); const b = s.querySelector('button.say'); if (b) { b.setAttribute('aria-pressed', 'true'); b.innerHTML = `${I.stop}<span>그만</span>`; } }
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
    u.lang = window.I18N ? I18N.speechLang() : 'ko-KR'; u.rate = sp.rate; try { const v = koVoice(); if (v) u.voice = v; } catch(err) {}
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
    ? `${s && LANG() === 'ko' ? s.title + ', ' : ''}${v.name}까지 ${mode().label}로 가는 길을 안내할게요.${T.arrive ? ` ${hm(T.arrive)}까지 ${st.way === 'subway' ? '역에' : '주차장에'} 도착하면 좋아요.` : ''}`
    : (T.end ? `공연은 ${hm(T.end)}쯤 끝나요. 혼잡을 피하려면 ${hm(T.leave)} 이후에 나서세요. 공연이 끝나고 20분에서 40분 사이가 가장 붐비고, 70분 뒤에 절반으로 줄어요.` : '공연이 끝나면 1시간 넘게 붐벼요.');
  intro = TR(intro);
  const items = [{step:-1, text:speakable({cloneNode:() => { const d = document.createElement('div'); d.textContent = intro; return d; }})}];
  steps.forEach((el, i) => items.push({step:i, text:TR(`${i + 1}단계.`) + ' ' + speakable(el)}));
  sayList(pane, items, 0);
}
if (SPEECH) { speechSynthesis.getVoices(); speechSynthesis.onvoiceschanged = () => { if (!document.activeElement || !document.activeElement.matches('[data-voice]')) refreshBars(); }; }
document.addEventListener('change', e => {
  const s2 = e.target.closest('[data-voice]'); if (!s2) return;
  sp.voice = s2.value; try { localStorage.setItem('pyeonhanVoice', sp.voice); } catch(err) {}
  document.querySelectorAll('[data-voice]').forEach(x => { if (x !== s2) x.value = sp.voice; });
  if (sp.on && sp.pane !== 'map') sayPane(sp.pane);
  else { stopSpeak(); const u = new SpeechSynthesisUtterance(TR('안녕하세요. 이 목소리로 안내할게요.')); u.lang = window.I18N ? I18N.speechLang() : 'ko-KR'; u.rate = sp.rate; try { const v = koVoice(); if (v) u.voice = v; } catch(err) {} speechSynthesis.speak(u); }
});


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
  const out = [], turns = [];
  out.turns = turns;
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
    const d = i ? ((L.b - legs[i-1].b + 540) % 360) - 180 : 0;
    turns.push({text:s, ll:L.start, end:L.end, pts:L.pts, m:L.m, kind:i === 0 ? 'up' : Math.abs(d) > 135 ? 'back' : d > 0 ? 'right' : 'left', short:i === 0 ? `${compass(L.b)}으로 ${r10(L.m)}m` : `${Math.abs(d) > 135 ? '뒤로 돌아' : d > 0 ? '오른쪽' : '왼쪽'} · ${r10(L.m)}m`, poi:p ? `${side(L, p.ll)}에 ${p.name}` : ''});
  });
  const last = legs[legs.length - 1];
  if (last) { out.push(`${esc(v.name)}에 도착해요.`); turns.push({text:`${v.name}에 도착해요.`, ll:last.end, end:last.end, pts:[last.end], m:0, kind:'flag', short:'도착', poi:''}); }
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
    <h2${s ? ' data-noi18n' : ''}>${esc(s ? s.title : v.name)}</h2>
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
  ].map(([a,b,c]) => `<div class="${c}"><small>${a}</small><b>${b}</b></div>`).join('')
  : `<div style="grid-column:1/-1"><small>공연을 고르면 도착·출발 권장 시각을 계산해 드려요.</small></div>`;
}
function timesFor() {
  const s = curShow(), v = venue(); if (!s) return {};
  const walkM = st.way === 'subway' ? mainExit(v).p.m : 150;
  const end = addMin(s.at, s.dur);
  return {start:s.at, end, arrive:addMin(s.at, -(60 + mins(walkM))), leave:addMin(end, 70)};
}

// ---------- 가는 길 ----------
function stepHTML(dot, title, body, y) { return `<li class="step"><span class="dot ${y ? 'y' : ''}" aria-hidden="true">${dot}</span><div><div class="sh"><h3>${title}</h3>${SPEECH ? `<button class="say" data-say aria-pressed="false" aria-label="이 단계 소리로 듣기">${I.spk}</button>` : ''}</div>${body}</div></li>`; }
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
// ---------- 출발역부터 (수도권 전철 노선 그래프) ----------
const LINE_NAME = {'수인·분당':'수인분당선', '경의·중앙':'경의중앙선', '신분당':'신분당선', '공항철도':'공항철도', '경강':'경강선', '경춘':'경춘선', '서해':'서해선', 'I2':'인천2호선', '인천1':'인천1호선', 'U':'의정부경전철', '용인':'용인경전철', '김포 골드라인':'김포골드라인', 'Silim':'신림선'};
const lineName = r => /^\d$/.test(r) ? r + '호선' : (LINE_NAME[r] || r);
const ARRIVE = [['올림픽공원', '5', 'olpark5'], ['올림픽공원', '9', 'olpark9'], ['몽촌토성', '8', 'mongchon'], ['한성백제', '9', 'hanseong']];
const RIDE = 2.2, XFER = 10;   // 역 사이 평균 2.2분, 교통약자 환승 10분(엘리베이터 동선)
let MG = null;
function metroGraph() {
  if (MG) return MG;
  const adj = new Map(), lines = {}, add = (a, b, w, kind) => { (adj.get(a) || adj.set(a, []).get(a)).push([b, w, kind]); };
  for (const [ref, s] of D.metro.lines) {
    (lines[ref] ??= []).push(s);
    for (let i = 1; i < s.length; i++) { const a = s[i-1] + '|' + ref, b = s[i] + '|' + ref; add(a, b, RIDE, 'ride'); add(b, a, RIDE, 'ride'); }
  }
  const byName = new Map();
  for (const k of adj.keys()) { const n = k.split('|')[0]; (byName.get(n) || byName.set(n, []).get(n)).push(k); }
  for (const [x, y] of D.metro.alias) { const A = byName.get(x) || [], B = byName.get(y) || []; byName.set(x, [...new Set([...A, ...B])]); byName.set(y, byName.get(x)); }
  for (const ks of byName.values()) for (const a of ks) for (const b of ks) if (a !== b) add(a, b, XFER, 'xfer');
  return MG = {adj, byName, lines, names:[...byName.keys()].sort()};
}
function metroRoutes(from) {
  const G = metroGraph(), starts = G.byName.get(from); if (!starts) return [];
  const dist = new Map(), prev = new Map(), Q = [];
  for (const s of starts) { dist.set(s, 0); Q.push([0, s]); }
  while (Q.length) {
    Q.sort((p, q) => p[0] - q[0]); const [d, u] = Q.shift();
    if (d > dist.get(u)) continue;
    for (const [w, c] of G.adj.get(u) || []) { const nd = d + c; if (nd < (dist.get(w) ?? 1e9)) { dist.set(w, nd); prev.set(w, u); Q.push([nd, w]); } }
  }
  const v = venue(), ex = exitsFor(v);
  return ARRIVE.map(([n, ref, sid]) => {
    const k = n + '|' + ref; if (!dist.has(k)) return null;
    const x = ex.find(e => e.s.id === sid); if (!x) return null;
    const path = []; for (let u = k; u; u = prev.get(u)) path.unshift(u);
    const legs = []; let cur = null, xf = 0;
    for (const p of path) { const [nm, r] = p.split('|'); if (!cur || cur.ref !== r) { if (cur) { if (cur.st.length === 1) legs.pop(); else xf++; } cur = {ref:r, st:[nm]}; legs.push(cur); } else cur.st.push(nm); }
    const ride = legs.reduce((s, l) => s + (l.st.length - 1) * RIDE, 0), xfer = (legs.length - 1) * XFER;
    return {sid, x, legs, ride, xfer, total:ride + xfer + mins(x.p.m)};
  }).filter(Boolean).filter(r => r.legs.length).sort((a, b) => a.total - b.total)
    .filter((r, i, A) => A.findIndex(q => q.sid === r.sid) === i);
}
function legDir(l) {
  const n = l.st.length, p = l.st[n - 2], b = l.st[n - 1];
  for (const s of metroGraph().lines[l.ref] || []) {
    for (let k = 1; k < s.length; k++) {
      const fwd = s[k-1] === p && s[k] === b, back = s[k-1] === b && s[k] === p;
      if (!fwd && !back) continue;
      if (s[0] === s[s.length - 1]) return `${l.st[1]} 방향 (${fwd ? '외선순환' : '내선순환'})`;
      return `${fwd ? s[s.length - 1] : s[0]} 방면`;
    }
  }
  return `${l.st[1]} 방향`;
}
const eun = w => { const c = w.charCodeAt(w.length - 1); return c >= 0xAC00 && c <= 0xD7A3 && (c - 0xAC00) % 28 ? '은' : '는'; };
const elevKey = n => n.replace(/\(.*?\)/g, '').replace(/역$/, '').trim();
function stationElev(name, ref) {
  const E = live.elevAll; if (!E || E === 'fail') return null;
  const ln = /^\d$/.test(ref) ? ref + '호선' : null;
  const mine = E.items.filter(x => elevKey(x.station) === name && (!ln || x.line === ln));
  return mine.length ? mine : null;
}
function elevLine(name, ref) {
  if (live.elevAll === undefined) return `<p class="meta">엘리베이터 실시간 정보를 불러오는 중…</p>`;
  const m = stationElev(name, ref);
  if (!m) return `<p class="meta">${esc(name)}역 ${esc(lineName(ref))}${eun(lineName(ref))} 엘리베이터 실시간 정보가 없어요. 필요하면 역에 확인하세요 (서울교통공사 1577-1234 · 코레일 1544-7788).</p>`;
  const stop = m.filter(x => x.status === 'S'), exits = [...new Set(m.map(x => x.exit).filter(e => /^\d+$/.test(e)))].sort((p, q) => p - q);
  const okN = m.filter(x => x.status === 'M').length, unk = m.length - okN - stop.length;
  return (stop.length ? `<div class="note warn">${I.warn}<span><b>지금 멈춘 엘리베이터</b> · ${stop.map(x => esc(x.loc || x.exit)).join(', ')}<br><span class="meta">나머지 ${okN}대 운행 중 · ${esc(live.elevAll.at)} 기준</span></span></div>` : `<div class="note ok">${I.ok}<span>엘리베이터 ${okN}대 운행 중${unk ? ` (${unk}대는 상태 정보 없음)` : ''} <span class="meta">${esc(live.elevAll.at)} 기준</span></span></div>`)
    + (exits.length ? `<p class="meta">엘리베이터 있는 출구: ${exits.map(e => `<span class="exit">${e}</span>`).join(' ')}</p>` : '');
}
async function loadElevAll() {
  if (live.elevAll !== undefined || loadElevAll.busy || !C.LIVE_API) return;
  loadElevAll.busy = true;
  try { const r = await fetch(C.LIVE_API + '/elevators/all'); if (!r.ok) throw 0; const j = await r.json(); live.elevAll = j.items && j.items.length > 20 ? j : 'fail'; }
  catch(e) { live.elevAll = 'fail'; }
  if (venue()) renderRoute();
}
function pickedRoute() {
  if (!st.from || st.way !== 'subway' || !venue()) return null;
  const key = [st.from, st.venue, st.mode, st.altSid].join('|');
  if (pickedRoute.k !== key) { pickedRoute.k = key; let R = metroRoutes(st.from); pickedRoute.o = R; const i = R.findIndex(r => r.sid === st.altSid); if (i > 0) R = [R[i], ...R.slice(0, i), ...R.slice(i + 1)]; pickedRoute.v = R[0] ? R : null; }
  return pickedRoute.v;
}
function mainExit(v) { const R = pickedRoute(); if (R) return R[0].x; const E = exitsFor(v); return (st.altSid && E.find(x => x.s.id === st.altSid)) || E[0]; }
// 길찾기 앱 연결: 출발지 = 저장한 출발역(없으면 현재 위치), 목적지 = 도착역 엘리베이터 출구
const isMobile = window.__forceMobile || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
function openApps() {
  const c = mapLinks.cur; if (!c) return;
  $('#appsTo').textContent = `${c.from} → ${c.to}`;
  $('#appsList').innerHTML = c.apps.map(a => `<li><a class="app" href="${a.href}"${a.blank ? ' target="_blank" rel="noopener"' : ''}><span class="aic ${a.k}" aria-hidden="true">${a.name[0]}</span><span>${a.name}</span>${I.chev}</a></li>`).join('')
    + (isMobile ? '' : `<li class="meta">네이버 지도는 휴대폰에서만 열려요.</li>`);
  $('#apps').showModal();
}
function mapLinks(x) {
  const dn = `${x.s.name} ${x.e.no}번 출구(엘리베이터)`, [dl, dg] = x.e.ll;
  const o = st.from && D.metro.co[st.from] ? {n:st.from.replace(/\(.*\)/, '') + '역', ll:D.metro.co[st.from]} : null;
  const E = encodeURIComponent;
  const kakao = o ? `https://map.kakao.com/link/by/traffic/${E(o.n)},${o.ll[0]},${o.ll[1]}/${E(dn)},${dl},${dg}` : `https://map.kakao.com/link/to/${E(dn)},${dl},${dg}`;
  const naver = `nmap://route/public?${o ? `slat=${o.ll[0]}&slng=${o.ll[1]}&sname=${E(o.n)}&` : ''}dlat=${dl}&dlng=${dg}&dname=${E(dn)}&appname=${E(location.origin + location.pathname)}`;
  const google = `https://www.google.com/maps/dir/?api=1${o ? `&origin=${o.ll[0]},${o.ll[1]}` : ''}&destination=${dl},${dg}&travelmode=transit`;
  mapLinks.cur = {from:o ? o.n : '현재 위치', to:dn, apps:[
    {k:'k', name:'카카오맵', href:kakao, blank:true},
    ...(isMobile ? [{k:'n', name:'네이버 지도', href:naver}] : []),
    {k:'g', name:'구글 지도', href:google, blank:true}]};
  return `<div class="maplinks"><button type="button" class="appbtn" data-apps>${I.map}<span><b>길찾기 앱으로 열기</b><small>${o ? esc(o.n) : '현재 위치'} → ${esc(dn)}</small></span>${I.chev}</button>
    <p class="meta">저상버스 예약은 '서울동행맵' 앱</p></div>`;
}
function fromHTML(R, T) {
  const opts = metroGraph().names.map(n => `<option value="${esc(window.I18N ? I18N.nameOf(n) : n)}">`).join('');
  const form = `<form class="fromform" id="fromForm"><label for="fromIn">집 근처 출발역</label><div><input id="fromIn" list="stList" autocomplete="off" placeholder="예: 노원" value="${esc(st.from ? (window.I18N ? I18N.nameOf(st.from) : st.from) : '')}"><button type="submit">확인</button>${st.from ? '<button type="button" id="fromClear">지우기</button>' : ''}</div><datalist id="stList">${opts}</datalist><p class="meta" id="fromErr" role="alert"></p></form>`;
  if (!st.from) return `<div class="fromcard">${form}<p class="meta">출발역을 고르면 출발역·환승역 엘리베이터 상태와 갈아탈 곳까지 함께 알려 드려요.</p>${mapLinks(mainExit(venue()))}</div>`;
  if (!R) return `<div class="fromcard">${form}<p class="meta">${esc(st.from)}역에서 가는 지하철 경로를 찾지 못했어요.</p></div>`;
  const r = R[0], board = T.arrive ? addMin(T.arrive, -Math.round(r.ride + r.xfer)) : null;
  return `<div class="fromcard">${form}<p><b>${esc(st.from)}역 → ${esc(r.x.s.name)}</b> · 지하철 약 ${Math.round(r.ride + r.xfer)}분 · 환승 ${r.legs.length - 1}번${board ? ` · <b>${hm(board)}</b>까지 ${esc(st.from)}역에서 타기` : ''}</p>
  ${mapLinks(r.x)}</div>`;
}
function fromSteps(R) {
  const r = R[0]; let h = '';
  h += stepHTML('A', `${esc(st.from)}역 출발 전 확인`, elevLine(st.from, r.legs[0].ref));
  r.legs.forEach((l, i) => {
    const a = l.st[0], b = l.st[l.st.length - 1], n = l.st.length - 1;
    if (i > 0) h += stepHTML('↔', `${esc(a)}역에서 ${esc(lineName(l.ref))}${/[선도]$/.test(lineName(l.ref)) && !/[선]$/.test(lineName(l.ref)) ? '로' : '으로'} 갈아타기`, `<p class="meta">교통약자 환승은 엘리베이터 동선이라 10분 정도 잡았어요.</p>` + elevLine(a, l.ref));
    h += stepHTML(String.fromCharCode(66 + i), `${esc(lineName(l.ref))} ${esc(legDir(l))} 타기`, `<p>${esc(a)} → ${esc(b)} · ${n}개 역, 약 ${Math.round(n * RIDE)}분</p>`);
  });
  if (R.length > 1) h += `<li class="step"><span class="dot" aria-hidden="true">+</span><div><details class="alt"><summary>다른 경로 (${R.length - 1})</summary>${R.slice(1, 3).map(q => `<div class="altrow"><p style="margin:0"><b>${esc(q.x.s.name)}</b> ${esc(q.x.s.line)} 도착 · 지하철 약 ${Math.round(q.ride + q.xfer)}분 · 환승 ${q.legs.length - 1}번 · 출구에서 공연장 ${mins(q.x.p.m)}분</p><p class="meta">${q.legs.map(l => `${lineName(l.ref)} ${l.st[0]}→${l.st[l.st.length - 1]}`).map(esc).join(' · ')}</p></div>`).join('')}</details></div></li>`;
  return h;
}

// ---------- 가는 길 (노선도 요약 + 한 줄 카드) ----------
const LINE_COLOR = {'1':'#0052A4','2':'#00A84D','3':'#EF7C1C','4':'#00A5DE','5':'#996CAC','6':'#CD7C2F','7':'#747F00','8':'#E6186C','9':'#BDB092','수인·분당':'#F5A200','경의·중앙':'#77C4A3','신분당':'#D4003B','공항철도':'#0090D2','경강':'#003DA5','경춘':'#0C8E72','서해':'#8FC31F','I2':'#F5A251','인천1':'#7CA8D5','U':'#FDA600','용인':'#56AD2D','김포 골드라인':'#AD8605','Silim':'#6789CA'};
const chip = (k, t) => `<span class="chip ${k}">${t}</span>`;
const PILL_ABBR = {'수인·분당':'SB', '경의·중앙':'GJ', '신분당':'SBD', '공항철도':'A', '경강':'GG', '경춘':'GC', '서해':'SH', 'I2':'I2', '인천1':'I1', 'U':'U', '용인':'Y', '김포 골드라인':'G', 'Silim':'S'};
const pillTxt = ref => /^\d$/.test(ref) ? ref : LANG() !== 'ko' && PILL_ABBR[ref] ? PILL_ABBR[ref] : lineName(ref).replace(/선$/, '').slice(0, 4);
const linePill = ref => `<span class="lp" data-noi18n style="background:${pillBg(LINE_COLOR[ref] || '#666')}">${esc(pillTxt(ref))}</span>`;
// 줄 아이콘용: 글자가 3자 이상이면 두 줄로 쌓아 동그라미 안에 다 보이게 (예: 수인/분당)
const lineIc = ref => { const t = /^\d$/.test(ref) || (LANG() !== 'ko' && PILL_ABBR[ref]) ? pillTxt(ref) : lineName(ref).replace(/선$/, '').replace(/호$/, '').slice(0, 4); if (t.length <= 2) return linePill(ref); return `<span class="lp lp2" data-noi18n style="background:${pillBg(LINE_COLOR[ref] || '#666')}">${esc(t.slice(0, 2))}<br>${esc(t.slice(2))}</span>`; };
function elevChip(list, loading) {
  if (loading) return chip('unk', '확인 중');
  if (!list || !list.length) return chip('unk', '정보 없음');
  const s = list.filter(x => x.status === 'S').length;
  return s ? chip('bad', `${s}대 멈춤`) : chip('ok', '정상');
}
function arrElev(S) {
  if (!live.elev) return 'loading'; if (live.elev === 'fail') return null;
  const m = live.elev.items.filter(x => x.station === S.name.replace('역', '') && x.line === S.line); return m.length ? m : null;
}
function row(icon, title, sub, side, body, icCls, extra) {
  const head = `<span class="ic ${icCls || ''}" aria-hidden="true">${icon}</span><span class="tx"><b>${title}</b>${sub ? `<small>${sub}</small>` : ''}</span>${side || ''}`;
  if (!body) return `<li class="step srow"><div class="sum">${head}</div></li>`;
  return `<li class="step srow${extra ? ' has-x' : ''}"><details><summary>${head}<span class="chev" aria-hidden="true">${I.chev}</span></summary><div class="body">${body}${SPEECH ? `<button class="say" data-say aria-label="이 단계 소리로 듣기">${I.spk}<span>듣기</span></button>` : ''}</div></details>${extra || ''}</li>`;
}
function diagram(nodes) {
  // nodes: [{name, seg:{color, label, dash}}] — seg는 다음 노드까지의 구간
  // 구간 길이는 글자 폭에 맞춰 정하고(겹치지 않게), 도착지 이름은 마지막 점 오른쪽에 적어요
  const ko = LANG() === 'ko', tw = s2 => [...s2].reduce((a, ch) => a + (/[　-鿿가-힣]/.test(ch) ? 12.5 : /[A-Z0-9]/.test(ch) ? 7.6 : 6.4), 0);
  const nm = nodes.map(nd => ko ? nd.name : I18N.nameOf(nd.name));
  const sl = nodes.map(nd => !nd.seg ? '' : ko ? nd.seg.label : I18N.tr(nd.seg.label).replace(/ Line$/, '').replace(/^Line /, ''));
  const n = nodes.length, ew = s2 => [...s2].reduce((a, ch) => a + (/[\u3000-\u9fff\uac00-\ud7a3]/.test(ch) ? 13.5 : /[A-Z]/.test(ch) ? 9 : 7.8), 0);
  // 도착지 이름이 길면(영어 등) 두 줄로 나눠 노선도가 작아지지 않게
  let endL = [nm[n - 1]];
  if (nm[n - 1].length > 13 && / /.test(nm[n - 1])) { const w = nm[n - 1].split(' '); let best = null; for (let k = 1; k < w.length; k++) { const a = w.slice(0, k).join(' '), b = w.slice(k).join(' '), m = Math.max(ew(a), ew(b)); if (!best || m < best.m) best = {a, b, m}; } endL = [best.a, best.b]; }
  const endW = Math.max(...endL.map(ew)) + 22;
  const L = nodes.slice(0, -1).map((nd, i) => Math.max(ko ? 44 : 36, tw(sl[i]) * 0.9 + (ko ? 12 : 8), (i === 0 ? tw(nm[0]) - 10 : tw(nm[i]) / 2) + (i + 1 < n - 1 ? tw(nm[i + 1]) / 2 : 0) + (ko ? 12 : 11)));
  let sum = L.reduce((a, b) => a + b, 0), W = 18 + sum + endW + 4;
  if (W < 330) { const k = (330 - 18 - endW - 4) / sum; for (let i = 0; i < L.length; i++) L[i] *= k; sum *= k; W = 330; }
  const X = [18]; L.forEach(l => X.push(X[X.length - 1] + l)); const x = i => X[i];
  let g = '', t = '';
  nodes.forEach((nd, i) => {
    if (i < n - 1) { const s = nd.seg; g += `<line x1="${x(i)}" y1="24" x2="${x(i+1)}" y2="24" stroke="${s.color}" stroke-width="${s.dash ? 3 : 7}" stroke-linecap="round" ${s.dash ? 'stroke-dasharray="2 6"' : ''}/>`; t += `<text x="${(x(i) + x(i+1)) / 2}" y="12" text-anchor="middle" class="dg-l" data-noi18n>${esc(sl[i])}</text>`; }
  });
  nodes.forEach((nd, i) => {
    const last = i === n - 1;
    g += nd.exit ? `<rect x="${x(i) - 10}" y="14" width="20" height="20" rx="5" fill="#ffc20e" stroke="#111" stroke-width="1"/><text x="${x(i)}" y="29" text-anchor="middle" class="dg-x">${esc(nd.exit)}</text>`
      : `<circle cx="${x(i)}" cy="24" r="${last ? 8 : 7}" fill="${last ? '#0b4fa3' : 'var(--surface)'}" stroke="${last ? '#0b4fa3' : (nodes[i-1] || nd).seg?.color || '#666'}" stroke-width="3"/>`;
    t += last ? (endL.length > 1 ? `<text x="${x(i) + 14}" y="22" text-anchor="start" class="dg-n dg-end" data-noi18n><tspan x="${x(i) + 14}">${esc(endL[0])}</tspan><tspan x="${x(i) + 14}" dy="14">${esc(endL[1])}</tspan></text>` : `<text x="${x(i) + 14}" y="29" text-anchor="start" class="dg-n dg-end" data-noi18n>${esc(nm[i])}</text>`)
      : `<text x="${x(i)}" y="54" text-anchor="${i === 0 ? 'start' : 'middle'}" ${i === 0 ? `dx="-10"` : ''} class="dg-n" data-noi18n>${esc(nm[i])}</text>`;
  });
  const label = nodes.map((nd, i) => nd.name + (i < n - 1 ? ` (${nd.seg.label})` : '')).join(' → ');
  return `<svg class="diagram" viewBox="0 0 ${Math.ceil(W)} 62" role="img" aria-label="${esc(label)}">${g}${t}</svg>`;
}
function routeHead(v, T, R) {
  const best = mainExit(v), walkMin = mins(best.p.m);
  let big, sub, nodes;
  if (st.way === 'car') {
    big = T.arrive ? `${hm(T.arrive)} 주차장 도착` : `${esc(v.gate || '동2문')} 주차장`;
    sub = `${esc(v.parking || '공연장 주차장')} · 걸어서 ${esc(v.pwalk || '몇')}분`;
    nodes = [{name:(v.gate || '동2문'), seg:{color:'#888', label:'주차', dash:false}}, {name:(v.parking || '주차장').split(',')[0], seg:{color:'#888', label:`${v.pwalk || ''}분`, dash:true}}, {name:v.name}];
  } else if (R) {
    const r = R[0], ride = Math.round(r.ride + r.xfer), board = T.arrive ? addMin(T.arrive, -ride) : null;
    big = board ? `${hm(board)} ${esc(st.from)}역 출발` : `${esc(st.from)}역 출발`;
    sub = `지하철 ${ride}분 + 걸어서 ${walkMin}분 · 환승 ${r.legs.length - 1}번`;
    nodes = r.legs.map(l => ({name:l.st[0], seg:{color:LINE_COLOR[l.ref] || '#666', label:lineName(l.ref)}}));
    nodes.push({name:r.x.s.name.replace('역', ''), exit:String(r.x.e.no), seg:{color:'#888', label:`${walkMin}분`, dash:true}});
    nodes.push({name:v.name});
  } else {
    big = T.arrive ? `${hm(T.arrive)} 역 도착` : `${esc(best.s.name)} ${esc(best.s.line)}`;
    sub = `${esc(best.s.name)} ${best.e.no}번 출구에서 걸어서 ${walkMin}분`;
    nodes = [{name:best.s.name.replace('역', ''), seg:{color:best.s.color, label:best.s.line}}, {name:`${best.e.no}번 출구`, exit:String(best.e.no), seg:{color:'#888', label:`${walkMin}분`, dash:true}}, {name:v.name}];
    nodes[0].seg = {color:'#bbb', label:'', dash:true};
  }
  return `<div class="rhead"><div class="big">${big}</div><div class="meta">${sub}</div>${diagram(nodes)}</div>`;
}
function fromBar(R) {
  const opts = metroGraph().names.map(n => `<option value="${esc(window.I18N ? I18N.nameOf(n) : n)}">`).join('');
  const form = `<form class="fromform" id="fromForm"><label for="fromIn">집 근처 출발역</label><div><input id="fromIn" list="stList" autocomplete="off" placeholder="예: 노원" value="${esc(st.from ? (window.I18N ? I18N.nameOf(st.from) : st.from) : '')}"><button type="submit">확인</button>${st.from ? '<button type="button" id="fromClear">지우기</button>' : ''}</div><datalist id="stList">${opts}</datalist><p class="meta" id="fromErr" role="alert"></p></form>`;
  const links = mapLinks(mainExit(venue()));
  if (!st.from) return `<div class="fromcard">${form}${links}</div>`;
  return `<details class="fromcard fold"><summary><span>${I.train} 출발역 <b>${esc(st.from)}</b>${R ? '' : ' · 경로 없음'}</span><span class="meta">바꾸기 · 길찾기 앱</span></summary>${form}${links}</details>`;
}
// ---------- 주차장 만차 예측: 실시간 주차 대수(10분마다 기록) + 2025 만차 기록 ----------
function parkTrend(P) {
  if (!P || !P.now) return null;
  const [t, v] = P.now, cap = P.cap || 2200, H = (P.hist || []).filter(x => t - x[0] < 3 * 3600e3 && t - x[0] > 0);
  const ago = m => { let b = null; for (const x of P.hist || []) if (Math.abs(t - m * 60000 - x[0]) < 12 * 60000 && (!b || Math.abs(t - m * 60000 - x[0]) < Math.abs(t - m * 60000 - b[0]))) b = x; return b; };
  const p30 = ago(30) || ago(20), slope = p30 ? (v - p30[1]) / ((t - p30[0]) / 600000) : null;   // 10분당 대수
  const full = cap * 0.95, eta = slope > 3 && v < full ? Math.round((full - v) / slope * 10) : null;
  const wk = ago(7 * 24 * 60);
  return {t, v, cap, pct:v / cap, slope, eta:eta != null && eta < 360 ? eta : null, wk:wk ? wk[1] : null, spark:H.concat([P.now])};
}
function parkAdvice() {
  const F = D.pstats.full_by_hour, tot = Object.values(F).reduce((a, b) => a + b, 0), early = Object.entries(F).filter(([h]) => +h >= 6 && +h < 12).reduce((a, [, n]) => a + n, 0);
  return {tot, earlyPct:Math.round(early / tot * 100), peakPct:Math.round(((F['13'] || 0) + (F['14'] || 0) + (F['15'] || 0)) / tot * 100)};
}
function sparkSvg(S, cap) {
  if (!S || S.length < 3) return '';
  const W = 300, H = 72, t0 = S[0][0], t1 = S[S.length - 1][0], lo = Math.min(...S.map(x => x[1])) * 0.95, hi = Math.max(cap, ...S.map(x => x[1]));
  const X = t => (t - t0) / Math.max(1, t1 - t0) * (W - 8) + 4, Y = v => H - 6 - (v - lo) / Math.max(1, hi - lo) * (H - 24);
  const pts = S.map(x => `${X(x[0]).toFixed(1)},${Y(x[1]).toFixed(1)}`).join(' ');
  return `<svg class="spark" viewBox="0 0 ${W} ${H}" role="img" aria-label="최근 3시간 주차 대수 변화"><text x="4" y="11" class="dg-l">최근 3시간</text><line x1="0" x2="${W}" y1="${Y(cap * 0.95)}" y2="${Y(cap * 0.95)}" stroke="#d9480f" stroke-dasharray="4 4"/><text x="${W - 4}" y="${Y(cap * 0.95) - 3}" text-anchor="end" class="dg-l">거의 참</text><polyline points="${pts}" fill="none" stroke="#0b4fa3" stroke-width="2.5"/></svg>`;
}
function parkRow(lp) {
  const P = parkTrend(live.park), A = parkAdvice();
  const v = P ? P.v : lp ? lp.p : null, cap = P ? P.cap : 2200, pct = v != null ? v / cap : 0;
  const chipH = v == null ? '' : chip(pct > .9 ? 'bad' : pct > .7 ? 'warnc' : 'ok', pct > .9 ? '거의 참' : pct > .7 ? '혼잡' : '여유');
  const sub = v == null ? '불러오는 중…' : P && P.eta != null ? `약 ${P.eta}분 뒤 거의 참 예상` : P && P.slope != null ? (P.slope > 3 ? `10분에 ${Math.round(P.slope)}대씩 늘어요` : P.slope < -3 ? '줄어드는 중' : '변화 적음') : `${v.toLocaleString()}대 / ${cap.toLocaleString()}대`;
  let body = v == null ? '' : `<div class="meter"><i style="width:${Math.min(100, pct * 100)}%"></i></div><p><b>${v.toLocaleString()}대</b> / ${cap.toLocaleString()}대 <span class="meta">${hm(new Date(P ? P.t : Date.now()))} 기준</span></p>`;
  if (P && P.spark.length >= 3) body += sparkSvg(P.spark, cap);
  if (P && P.eta != null) body += `<div class="note warn">${I.warn}<span>지금 속도(10분에 ${Math.round(P.slope)}대)라면 <b>${hm(addMin(new Date(P.t), P.eta))}</b>쯤 거의 가득 차요.</span></div>`;
  if (P && P.wk != null) { const d = v - P.wk; body += `<p>지난주 같은 요일 이 시각엔 ${P.wk.toLocaleString()}대였어요. ${Math.abs(d) < cap * 0.03 ? '비슷해요.' : d > 0 ? `${d.toLocaleString()}대 더 많아요.` : `${(-d).toLocaleString()}대 적어요.`}</p>`; }
  body += `<p>공연 날 만차 기록 ${A.tot}건 중 ${A.peakPct}%가 오후 1~3시에, ${A.earlyPct}%는 정오 전에 생겼어요. 확실하게 세우려면 <b>정오 전</b>, 늦어도 <b>오후 1시 전</b>에 도착하세요.</p>`;
  body += `<p class="meta">실시간 주차현황(10분마다 기록)과 주차장 혼잡도 기록(${A.tot}건)을 함께 썼어요. 장기 주차 차량은 출차 기록이 없어 실제 대수와 조금 다를 수 있고, 주차장별 실시간 만차 여부는 공개되지 않아요.</p>`;
  return row(I.park, v == null ? '주차장 상황' : `주차장 ${Math.round(pct * 100)}% 찼어요`, sub, chipH, body);
}
function renderRoute() {
  const v = venue(), m = mode(), s = curShow(), T = timesFor(), c = centerFor(v);
  const R = st.way === 'subway' ? pickedRoute() : null; if (st.from && st.way === 'subway') loadElevAll();
  let h = speakBar('route') + routeHead(v, T, R) + (st.way === 'subway' ? fromBar(R) : '');
  const near = routeReports();
  h += '<ol class="steps rows">';
  if (near.length) h += row(I.warn, `현장 제보 ${near.length}건`, near.slice(0, 2).map(r => RK[r.kind]).join(' · '), chip('bad', '확인'), `<ul class="plain">${near.map(r => `<li><b>${esc(RK[r.kind])}</b> ${ago(r.at)}${r.text ? ` · ${esc(r.text)}` : ''}</li>`).join('')}</ul><button class="linkbtn" data-tab="map">지도에서 보기</button>`, 'warn');
  if (st.way === 'subway') {
    const best = mainExit(v), S = best.s;
    if (R) {
      const r = R[0], o = stationElev(st.from, r.legs[0].ref), exits = o ? [...new Set(o.map(x => x.exit).filter(e => /^\d+$/.test(e)))].sort((p, q) => p - q) : [];
      h += row(I.elev, `${esc(st.from)}역 엘리베이터`, exits.length ? `${exits.join('·')}번 출구` : '출발 전에 확인', elevChip(o, live.elevAll === undefined), elevLine(st.from, r.legs[0].ref));
      r.legs.forEach((l, i) => {
        const a = l.st[0], b = l.st[l.st.length - 1], n = l.st.length - 1;
        if (i > 0) h += row(I.xfer, `${esc(a)} 환승 → ${esc(lineName(l.ref))}`, '엘리베이터 동선 약 10분', elevChip(stationElev(a, l.ref), live.elevAll === undefined), elevLine(a, l.ref));
        h += row(lineIc(l.ref), `${esc(lineName(l.ref))} ${esc(legDir(l))}`, `${esc(a)} → ${esc(b)} · ${n}개 역 · ${Math.round(n * RIDE)}분`, '', null, 'lpwrap');
      });
    }
    const ae = arrElev(S);
    h += row(linePill(S.line.replace('호선', '')), `${esc(S.name)} ${R ? '하차' : `${esc(S.line)}에서 내리기`}`, `엘리베이터 가까운 칸 ${esc(S.board)}`, elevChip(ae === 'loading' ? null : ae, ae === 'loading'),
      elevNote(S) + `<dl class="facts"><dt>${I.phone} 역 전화</dt><dd><a href="tel:${S.tel.replace(/-/g,'')}">${S.tel}</a></dd>${S.ramp != null ? `<dt>안전발판</dt><dd>${S.ramp ? '있음 · 승강장 틈이 걱정되면 역에 요청' : '보유 정보 없음'}</dd>` : ''}</dl>`, 'lpwrap');
    h += row(`<span class="exit">${best.e.no}</span>`, `${best.e.no}번 출구 엘리베이터로 지상`, esc(S.ground).slice(0, 40), S.warn ? chip('warnc', '주의') : '', `<p>${esc(S.ground)}</p>${S.warn ? `<div class="note warn">${I.warn}<span>${esc(S.warn)}</span></div>` : ''}`, 'y');
    const dirs = best.p.real ? directions(best.p.pts, v, `${best.s.name} ${best.e.no}번 출구`) : [];
    h += row(I.walk, `계단 없는 길 ${mins(best.p.m)}분`, `${Math.round(best.p.m)}m · ${m.label} 기준`, '',
      `${dirs.length ? `<ol class="turns">${dirs.map(t => `<li>${t}</li>`).join('')}</ol><p class="meta">OpenStreetMap 보행로 기준 추정이에요. 현장 안내판을 함께 확인하세요.</p>` : `<p>약 ${Math.round(best.p.m)}m 추정 (직선거리 기반)</p>`}${best.p.steps ? `<div class="note warn">${I.warn}<span>계단 없는 길을 찾지 못해 일부 구간에 계단이 있을 수 있어요.</span></div>` : ''}`, '', dirs.length ? `<button class="go xbtn" data-follow>${I.map}<span>따라가기</span></button>` : '');
  } else {
    const ps = D.pstats.full_days_by_lot, lot = v.parking || '가까운 공연장 주차장', lots = (v.parking || '').match(/P\d+[AB]?/g) || [], lp = live.parking;
    h += parkRow(lp);
    h += row(I.car, `${esc(v.gate || '동2문')} → ${esc(lot)}`, `${v.pcap ? `${v.pcap}대` : ''}${lots.map(l => ps[l] ? ` · ${l} 만차 ${ps[l]}일` : '').join('')}`, '', `<p class="meta">장애인·국가유공자 차량은 주차요금 50% 할인이에요(10분당 600원, 하루 최대 2만 원). 대형 공연 날엔 사전정산이 없고, 공연 티켓이 있어도 따로 할인되지 않아요. 입차는 오전 6시~밤 10시.</p>`);
    h += row(I.walk, `${esc(v.name)}까지 ${esc(v.pwalk || '몇')}분`, '휠체어 진입로 안내', '', `<p class="meta">만남의광장 휠체어 진입로: 동2문 입차 → 그래피티의 벽 주차장 → 올림픽공원역 쪽 경사로</p>`);
  }
  let w = '';
  if (st.mode !== 'stroller' && T.end) {
    if (T.end.getHours()*60 + T.end.getMinutes() > 19*60) w = `<div class="note warn">${I.warn}<span>공연이 ${hm(T.end)}쯤 끝나는데 안내센터는 19:00에 닫아요. 대여 휠체어는 공연 전에 반납해야 하니 공연장 안에서 쓸 휠체어는 미리 챙기세요.</span></div>`;
    else if ((T.end - T.arrive)/60000 > 180) w = `<div class="note warn">${I.warn}<span>도착부터 종료까지 3시간이 넘어요. 무료 대여는 3시간까지예요.</span></div>`;
  }
  const tl = toiletsNear(v);
  h += row(I.flag, `${esc(v.name)} 도착`, st.mode === 'stroller' ? '수유실 · 가까운 화장실' : `휠체어 대여 ${esc(c.name.replace(/\s*안내센터.*/, ''))} · 화장실 ${Math.round(tl[0].m)}m`, w ? chip('warnc', '19시 반납') : '', `<dl class="facts">
      <dt>${st.mode === 'stroller' ? '수유실' : '휠체어 대여'}</dt><dd>${st.mode === 'stroller' ? '평화의광장 안내센터(전자레인지 있음, 09:00~19:00)' : `${esc(c.name)} · 공연장에서 약 ${mins(c.p.m)}분 · 09:00~19:00, 신분증 맡기고 3시간 무료 · <a href="tel:${c.tel.split('~')[0].replace(/-/g,'')}">${esc(c.tel)}</a>`}</dd>
      <dt>가까운 화장실</dt><dd>${tl.map(t => `${esc(t.p)} ${esc(t.d)} (${Math.round(t.m)}m)`).join(' · ')}</dd></dl>${w}`, 'blue');
  h += '</ol>';
  if (st.way === 'subway') {
    // 경로 고르기: 누르면 그 경로로 가는 길·지도·막차가 모두 바뀌어요
    const cur = mainExit(v), cards = R ? pickedRoute.o.slice(0, 4).map(q => ({id:q.sid, on:q === R[0], pills:q.legs.map(l => linePill(l.ref)).join('<span class="ar" aria-hidden="true">→</span>'),
        t:`${esc(q.x.s.name)} ${esc(q.x.s.line)} 도착`, sub:`지하철 약 ${Math.round(q.ride + q.xfer)}분 · 환승 ${q.legs.length - 1}번 · 걸어서 ${mins(q.x.p.m)}분`, tot:Math.round(q.ride + q.xfer + mins(q.x.p.m))}))
      : (() => { const seen = new Set(); return exitsFor(v).filter(x => !seen.has(x.s.id) && seen.add(x.s.id)).slice(0, 4).map(x => ({id:x.s.id, on:x.s.id === cur.s.id, pills:pill(x.s),
        t:`${esc(x.s.name)} ${esc(x.s.line)} 도착`, sub:`<span class="exit">${x.e.no}</span>번 출구 → 약 ${mins(x.p.m)}분`, warn:x.s.warn})); })();
    if (cards.length > 1) h += `<section class="altpick" aria-labelledby="altT"><h3 id="altT">경로 고르기 <small>${cards.length}개</small></h3><div class="altlist">${cards.map(c2 => `<button class="altcard" data-alt="${c2.id}" aria-pressed="${c2.on}"><span class="lps">${c2.pills}</span><span class="at"><b>${c2.t}</b><small>${c2.sub}</small>${c2.warn ? `<small class="w">${esc(c2.warn)}</small>` : ''}</span>${c2.tot ? `<span class="tot">총 ${c2.tot}분</span>` : ''}${c2.on ? `<span class="chip ok">지금 경로</span>` : ''}</button>`).join('')}</div></section>`;
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
  const miss = [], tops = [];
  const body = Object.values(groups).sort((p, q) => q.length - p.length).map(g => {
    const term = TERM.find(t => g.some(r => base(r.to) === t)) || base(g[0].to), fulls = g.filter(r => base(r.to) === term), last = fulls.reduce((a, b) => b.at > a.at ? b : a);
    const by = addMin(last.at, -walk); if (T.leave > by) miss.push({r:last, by}); tops.push({to:last.to, at:last.at, by, miss:T.leave > by});
    return [...g].sort((a, b) => a.at - b.at).map(r => `<tr class="${base(r.to) === term ? '' : 'sub'}"><th scope="row">${esc(lab(r.to))}${base(r.to) === term ? ' <small>(종점)</small>' : ''}</th><td>${r === last ? `<b>${hm(r.at)}</b>` : hm(r.at)}</td><td>${hm(addMin(r.at, -walk))}</td></tr>`).join('');
  }).join('<tr class="gap"><td colspan="3"></td></tr>');
  return {miss, fulls:tops, x, html:`<table><caption>${esc(x.s.name)} ${esc(x.s.line)} · ${x.e.no}번 출구까지 약 ${mins(x.p.m)}분</caption><thead><tr><th scope="col">열차(가는 곳)</th><th scope="col">막차</th><th scope="col">공연장에서 나설 시각</th></tr></thead><tbody>${body}</tbody></table>`};
}
function lastTrainHTML(T, v) {
  const all = [mainExit(v), ...exitsFor(v)], seen = new Set(), per = all.filter(x => !seen.has(x.s.id) && seen.add(x.s.id));
  const main = ltTable(T, per[0]); if (!main) return '';
  const others = per.slice(1).map(x => ltTable(T, x)).filter(Boolean);
  const nm = m => esc(m.r.to.replace('(급행)', '')) + '행' + (m.r.to.includes('급행') ? ' 급행' : '');
  return `<div class="lt"><h3>막차 확인 <small>${dayKind(T.start) === 'we' ? '토·휴일' : '평일'} 시간표</small></h3>
  ${main.miss.map(m => `<div class="note warn">${I.info}<span>혼잡을 피해 ${hm(T.leave)}까지 기다리면 <b>${nm(m)} 막차(${hm(m.r.at)})</b>를 놓칠 수 있어요. ${m.by < T.end ? `공연이 끝나기 전(${hm(m.by)})에 나서야 탈 수 있어요. 이 방향이면 장애인콜택시나 아래 다른 노선을 미리 생각해 두세요.` : `이 방향이면 <b>${hm(m.by)}</b> 전에 공연장을 나서세요.`}</span></div>`).join('')}
  ${main.html}
  ${others.length ? `<details><summary>다른 역·노선 막차 보기</summary>${others.map(o => o.html).join('')}</details>` : ''}
  <p class="meta">표의 '가는 곳'까지 가거나 그 전에 내리면 그 열차를 탈 수 있어요. 나설 시각은 걷는 시간에 엘리베이터·개찰구 여유 10분을 더해 계산했어요. 서울교통공사 시간표(${D.lastTrain.asof} 기준)이며, 음력 명절·대체공휴일은 역에 확인하세요.</p></div>`;
}
// ---------- 집(출발역)까지 막차: 국토교통부(TAGO) 역별 시간표로 환승역마다 거꾸로 계산 ----------
const XFER_MIN = 10;   // 갈아타기: 엘리베이터로 승강장을 옮기는 시간
const TT = {};         // '역|요일' → {lines} | 'loading' | 'fail'
const bare = n => String(n || '').split('(')[0].replace(/역$/, '').trim();
const lineKey = r => String(r || '').replace(/호선$/, '').replace(/선$/, '').replace(/[·\s]/g, '');
const ttDay = d => dayKind(d) === 'wd' ? '01' : d.getDay() === 6 ? '02' : '03';
const ttMin = t => { t = String(t || ''); if (!/^\d{6}$/.test(t)) return null; const h = +t.slice(0, 2), m = +t.slice(2, 4) + +t.slice(4, 6) / 60; return (h < 4 ? h + 24 : h) * 60 + m; };
function loadTT(name, day) {
  const k = bare(name) + '|' + day; if (TT[k]) return;
  try { const c = JSON.parse(localStorage.getItem('pyeonhanTT:' + k) || 'null'); if (c && Date.now() - c.t < 432e5) { TT[k] = c.d; return; } } catch(e) {}
  if (!C.LIVE_API) { TT[k] = 'fail'; return; }
  TT[k] = 'loading';
  fetch(`${C.LIVE_API}/tt?st=${encodeURIComponent(bare(name))}&day=${day}`).then(r => r.ok ? r.json() : Promise.reject()).then(j => {
    TT[k] = j && j.lines && j.lines.length ? j : 'fail';
    if (TT[k] !== 'fail') try { localStorage.setItem('pyeonhanTT:' + k, JSON.stringify({t:Date.now(), d:TT[k]})); } catch(e) {}
  }).catch(() => { TT[k] = 'fail'; }).finally(() => { if (st.tab === 'after' || document.querySelector('#pane-after')) renderAfter(); });
}
// 그 노선에서 이름(괄호 뗀 것)으로 그래프 역 이름 찾기
function gName(ref, n) { const b = bare(n); for (const s of metroGraph().lines[ref] || []) for (const x of s) if (bare(x) === b) return x; return null; }
// 한 구간(B→A)을 타는 열차들: B 출발 시각, A 도착 시각(같은 종착역 열차를 A 시간표에서 찾아 맞춤)
function legTrains(ref, B, A, n, day) {
  const tb = TT[bare(B) + '|' + day], ta = TT[bare(A) + '|' + day];
  if (!tb || !ta || tb === 'loading' || ta === 'loading') return 'loading';
  if (tb === 'fail' || ta === 'fail') return null;
  const lb = tb.lines.find(l => lineKey(l.route) === lineKey(ref)), la = ta.lines.find(l => lineKey(l.route) === lineKey(ref));
  if (!lb || !la) return null;
  const gB = gName(ref, B), gA = gName(ref, A); if (!gB || !gA) return null;
  const toward = {}, goes = T => { if (T in toward) return toward[T]; const g = gName(ref, T); if (!g) return toward[T] = false; if (bare(g) === bare(gA)) return toward[T] = true; const p = linePath(ref, gB, g); return toward[T] = !!(p && p.includes(gA)); };
  const atA = [...la.dirs.U, ...la.dirs.D].map(([d, a, to]) => ({t:ttMin(a) ?? ttMin(d), to:bare(to)})).filter(x => x.t != null);
  const out = [];
  for (const [d, a, to] of [...lb.dirs.U, ...lb.dirs.D]) {
    const dep = ttMin(d), T = bare(to); if (dep == null || !goes(T)) continue;
    const hit = atA.filter(x => x.to === T && x.t >= dep + n * 1.5 && x.t <= dep + n * 4 + 5).sort((p, q) => p.t - q.t)[0];
    out.push({dep, arr:hit ? hit.t : dep + n * RIDE, est:!hit, to:T, B, A, ref});
  }
  return out.length ? out.sort((p, q) => p.dep - q.dep) : null;
}
function homeChain(T, x) {
  const R = pickedRoute(); if (!R || R[0].x.s.id !== x.s.id) return null;
  const day = ttDay(T.start), H = [...R[0].legs].reverse().map(l => { const s = [...l.st].reverse(); return {ref:l.ref, B:s[0], A:s[s.length - 1], n:s.length - 1}; });
  H.forEach(h => { loadTT(h.B, day); loadTT(h.A, day); });
  const L = H.map(h => legTrains(h.ref, h.B, h.A, h.n, day));
  if (L.includes('loading')) return {state:'loading'};
  if (L.includes(null)) return {state:'nodata'};
  const plan = []; let need = Infinity;
  for (let i = H.length - 1; i >= 0; i--) {
    const c = L[i].filter(t => t.arr <= need); if (!c.length) return {state:'none', at:H[i]};
    const pick = c.reduce((a, b) => b.dep > a.dep ? b : a); plan[i] = pick; need = pick.dep - XFER_MIN;
  }
  const base = new Date(T.start); base.setHours(0, 0, 0, 0);
  const D = m => new Date(base.getTime() + m * 60000);
  const by = D(plan[0].dep - (mins(x.p.m) + 10));
  return {state:'ok', plan:plan.map(p => ({...p, depD:D(p.dep), arrD:D(p.arr)})), by, arrive:D(plan[plan.length - 1].arr), miss:T.leave > by, early:T.end && by < T.end};
}
function chainRow(T, v, x, full) {
  const C2 = homeChain(T, x), to = esc(st.from) + '역';
  if (!C2) return null;
  const tail = full ? `<details class="more"><summary>공연장 근처 역 막차 시간표</summary>${full}</details>` : '';
  const sub = `${to} 도착 기준`;
  if (C2.state === 'loading') return row(I.train, `${to}까지 막차 계산 중…`, sub, chip('unk', '확인 중'), `<p class="meta">갈아타는 역의 막차 시간표를 불러오고 있어요.</p>` + tail);
  if (C2.state === 'nodata') return null;
  if (C2.state === 'none') return row(I.train, `오늘은 지하철로 ${to}까지 못 가요`, sub, chip('bad', '막차 없음'),
    `<p>${esc(C2.at.B)}역에서 ${esc(lineName(C2.at.ref))}으로 갈아탈 막차가 없어요. 장애인콜택시(1588-4388)를 미리 생각해 두세요.</p>` + tail);
  const P = C2.plan;
  const steps = P.map((p, i) => `<li><b>${esc(p.B)}</b> ${esc(lineName(p.ref))} ${esc(p.to)}행 <b>${hm(p.depD)}</b> 출발 → ${esc(p.A)} ${hm(p.arrD)}${p.est ? '쯤' : ''} 도착${i < P.length - 1 ? ` <span class="meta">(갈아타기 ${Math.round(P[i + 1].dep - p.arr)}분)</span>` : ''}</li>`).join('');
  const warn = C2.early ? `<div class="note warn">${I.warn}<span>공연이 끝나기 전, <b>${hm(C2.by)}</b>에 나서야 이 막차를 탈 수 있어요. 끝까지 보려면 장애인콜택시(1588-4388)를 미리 생각해 두세요.</span></div>`
    : C2.miss ? `<div class="note warn">${I.warn}<span>혼잡을 피해 ${hm(T.leave)}까지 기다리면 이 막차를 놓쳐요. <b>${hm(C2.by)}</b> 전에 나서세요.</span></div>` : '';
  return row(I.train, `${to} ${hm(C2.arrive)} 도착 막차`, `${hm(C2.by)}까지 공연장에서 나서기`, C2.early || C2.miss ? chip('bad', '놓칠 수 있음') : chip('ok', '여유'),
    `${warn}<p>공연장에서 <b>${hm(C2.by)}</b>까지 나서면 ${to}에 <b>${hm(C2.arrive)}</b>쯤 도착해요.</p><ol class="chain">${steps}</ol><p class="meta">갈아타는 시간은 엘리베이터 이동을 생각해 ${XFER_MIN}분 넘게 잡았고, 공연장에서 역 승강장까지는 걷는 시간에 10분을 더했어요. 국토교통부(TAGO) 역별 시간표 기준이라 실제 운행과 조금 다를 수 있어요.</p>` + tail);
}

// 출발역 방향 막차: 도착 노선을 거꾸로 타고 환승역(없으면 출발역)까지 가는 열차 중 가장 늦은 것
function linePath(ref, a, b) {
  const adj = new Map(), add = (p, q) => (adj.get(p) || adj.set(p, []).get(p)).push(q);
  for (const s of metroGraph().lines[ref] || []) for (let i = 1; i < s.length; i++) { add(s[i-1], s[i]); add(s[i], s[i-1]); }
  const prev = new Map([[a, null]]), Q = [a];
  while (Q.length) { const u = Q.shift(); if (u === b) break; for (const w of adj.get(u) || []) if (!prev.has(w)) { prev.set(w, u); Q.push(w); } }
  if (!prev.has(b)) return null;
  const p = []; for (let u = b; u; u = prev.get(u)) p.unshift(u); return p;
}
function homeTrain(T, x) {
  const R = pickedRoute(); if (!R || R[0].x.s.id !== x.s.id) return null;
  const legs = R[0].legs, L = legs[legs.length - 1], arr = L.st[L.st.length - 1], target = L.st[0];
  const ok = lastTrains(x.s, T.start).filter(r => !r.to.includes('급행')).filter(r => { if (r.to === target) return true; const p = linePath(L.ref, arr, r.to); return p && p.includes(target); });
  if (!ok.length) return null;
  const last = ok.reduce((a, b) => b.at > a.at ? b : a), by = addMin(last.at, -(mins(x.p.m) + 10));
  return {to:last.to, at:last.at, by, miss:T.leave > by, ref:L.ref, via:legs.length > 1 ? target : null};
}

// ---------- 저상버스 실시간 (서울시 버스도착정보·정류소정보, Worker /bus) ----------
const BUS = {stops:{}, low:{}};
// 외국어 화면에서는 정류장·방면 이름을 이름표로, 없으면 로마자로
const placeName = n => (LANG() === 'ko' || !window.I18N) ? n : I18N.loose(n);
function loadBus(v) {
  if (!C.LIVE_API || !v) return;
  const k = v.id;
  if (!BUS.stops[k]) {
    BUS.stops[k] = 'loading';
    fetch(`${C.LIVE_API}/bus?op=pos&x=${v.lng}&y=${v.lat}&r=500`).then(r => r.json()).then(j => {
      const L = (j.items || []).map(x => ({id:String(x.stationId), ars:String(x.arsId || ''), nm:x.stationNm, m:+x.dist || 0})).sort((a, b) => a.m - b.m).slice(0, 4);
      BUS.stops[k] = j.ok && L.length ? L : 'fail'; renderAfter();
    }).catch(() => { BUS.stops[k] = 'fail'; renderAfter(); });
    return;
  }
  if (!Array.isArray(BUS.stops[k])) return;
  for (const s of BUS.stops[k]) {
    const c = BUS.low[s.id]; if (c && (c === 'loading' || Date.now() - c.t < 60000)) continue;
    BUS.low[s.id] = 'loading';
    fetch(`${C.LIVE_API}/bus?op=low&st=${s.id}`).then(r => r.json()).then(j => { BUS.low[s.id] = {t:Date.now(), ok:j.ok, items:j.items || []}; renderAfter(); })
      .catch(() => { BUS.low[s.id] = {t:Date.now(), ok:false, items:[]}; renderAfter(); });
  }
}
function busRow(v) {
  if (!C.LIVE_API || !v) return '';
  loadBus(v);
  const S = BUS.stops[v.id];
  if (S === 'fail') return '';
  if (!Array.isArray(S)) return row(I.bus || I.car, '저상버스 실시간', '불러오는 중…', '', '');
  const secs = m => { m = String(m || ''); if (/곧 도착/.test(m)) return 30; const a = m.match(/(\d+)분/), b = m.match(/(\d+)초/); return a || b ? (a ? +a[1] * 60 : 0) + (b ? +b[1] : 0) : 1e9; };
  const ord = L => [...L].filter(x => !/운행종료/.test(x.arrmsg1 || '')).sort((a, b) => secs(a.arrmsg1) - secs(b.arrmsg1));
  const all = S.flatMap(s => { const L = BUS.low[s.id]; return L && L.items ? ord(L.items).map(x => ({...x, stop:s})) : []; }).sort((a, b) => secs(a.arrmsg1) - secs(b.arrmsg1));
  const first = all.find(x => secs(x.arrmsg1) < 1e9);
  const sub = first ? `${esc(placeName(first.rtNm))} · ${esc(first.arrmsg1)} · ${esc(placeName(first.stop.nm))}` : S.some(s => BUS.low[s.id] === 'loading' || !BUS.low[s.id]) ? '불러오는 중…' : '지금 오는 저상버스가 없어요';
  const shown = S.filter(s => { const L = BUS.low[s.id]; return !L || L === 'loading' || (L.items && ord(L.items).length); }).slice(0, 3);
  const body = (shown.length ? shown : S.slice(0, 1)).map(s => {
    const L = BUS.low[s.id], items = L && L.items ? ord(L.items) : [];
    return `<div class="busstop"><p><b data-noi18n>${esc(placeName(s.nm))}</b> <span class="meta">${s.ars ? `정류장 번호 ${esc(s.ars)} · ` : ''}공연장에서 약 ${r10(s.m)}m</span></p>${items.length ? `<ul class="buslist">${items.slice(0, 6).map(x => `<li><span class="bno" data-noi18n>${esc(placeName(x.rtNm))}</span><span>${esc(x.arrmsg1 || '')}${x.arrmsg2 && !/운행종료/.test(x.arrmsg2) ? ` <span class="meta">· 다음 ${esc(x.arrmsg2)}</span>` : ''}</span></li>`).join('')}</ul>` : `<p class="meta">${L === 'loading' || !L ? '불러오는 중…' : '지금 오는 저상버스가 없어요'}</p>`}</div>`;
  }).join('') + `<p class="meta">저상버스만 보여 줘요. 휠체어 경사판이 필요하면 버스가 설 때 기사님께 손을 들어 알려 주세요. 미리 예약하려면 '서울동행맵' 앱을 쓰세요. 서울시 버스도착정보 기준이에요.</p>`;
  return row(I.bus || I.car, '저상버스 실시간', sub, first ? chip('ok', '운행 중') : '', body);
}

function miniChart(T) {
  const A = D.exit25, mx = Math.max(...A.event), n = A.event.length, W = 330, H = 96, bw = W / n;
  const li = A.min.indexOf(70);
  let g = A.event.map((v, i) => { const h = v / mx * (H - 26), hot = A.min[i] >= 0 && v >= mx / 2; return `<rect x="${i * bw + 2}" y="${H - 18 - h}" width="${bw - 4}" height="${h}" rx="2" fill="${hot ? '#d9480f' : A.min[i] < 0 ? '#b7c3d0' : '#0b4fa3'}"/>`; }).join('');
  if (li >= 0) g += `<line x1="${li * bw + bw / 2}" x2="${li * bw + bw / 2}" y1="2" y2="${H - 18}" stroke="var(--ink)" stroke-width="2" stroke-dasharray="3 3"/><text x="${li * bw + bw / 2 + 4}" y="12" class="dg-l">나서기</text>`;
  [[0, '종료'], [30, '+30분'], [60, '+60분'], [90, '+90분']].forEach(([o, l]) => { const k = A.min.indexOf(o); if (k >= 0) g += `<text x="${k * bw + bw / 2}" y="${H - 4}" text-anchor="middle" class="dg-l">${T.end ? hm(addMin(T.end, o)) : l}</text>`; });
  return `<svg class="mini" viewBox="0 0 ${W} ${H}" role="img" aria-label="공연 종료 뒤 10분 단위 출차. 종료 20분 뒤 가장 많고, 70분 뒤 절반, 90분 뒤 3분의 1로 줄어요.">${g}</svg>`;
}
function renderAfter() {
  const T = timesFor(), A = D.exit25, mx = Math.max(...A.event), v = venue();
  let h = speakBar('after');
  h += `<div class="rhead"><div class="big">${T.end ? `${hm(T.leave)} 이후 나서기` : '끝나고 70분 뒤 나서기'}</div><div class="meta">${T.end ? `공연 끝 ${hm(T.end)} · 가장 붐빌 때 ${hm(addMin(T.end, 20))}~${hm(addMin(T.end, 40))}` : '끝나고 20~40분 뒤가 가장 붐벼요'}</div>${miniChart(T)}</div>`;
  h += '<ol class="steps rows">';
  if (T.end && st.way === 'subway') {
    const x = mainExit(v), full = lastTrainHTML(T, v), CR = st.from ? chainRow(T, v, x, full) : null, H = CR ? null : homeTrain(T, x);
    if (CR) h += CR;
    else if (H) h += row(I.train, `막차 ${esc(H.to)}행 ${hm(H.at)}`, H.via ? `${esc(H.via)}역까지만 확인됨` : `${esc(st.from)}역 도착 기준`, H.miss ? chip('bad', '놓칠 수 있음') : H.via ? chip('unk', '환승역 확인') : chip('ok', '여유'),
      `<p>${esc(st.from)}역으로 가려면 ${esc(x.s.name)} ${esc(lineName(H.ref))} <b>${esc(H.to)}행 ${hm(H.at)}</b> 열차가 막차예요. 공연장에서 <b>${hm(H.by)}</b>까지 나서면 탈 수 있어요.</p>${H.via ? `<div class="note warn">${I.info}<span>이 열차는 갈아타는 ${esc(H.via)}역까지만 확인한 거예요. ${esc(st.from)}역까지 가는 막차는 역에서 꼭 확인하세요.</span></div>` : ''}` + full);
    else if (full) h += row(I.train, '막차 확인', '', '', full);
  }
  h += row(I.info, '오래 못 기다린다면', '끝나기 10분 전에 먼저 나서기', '', `<p>끝나기 10분 전은 가장 붐빌 때의 3분의 1 정도예요. 엘리베이터와 출구 앞 줄도 이때 가장 짧아요.</p>`);
  h += row(I.flag, '기다리는 동안', '화장실 먼저 · 실내에서 쉬기', '', `<p>공연장 근처 화장실을 먼저 들르고, 출구 쪽 혼잡이 줄 때까지 실내에서 쉬세요.</p>`);
  if (st.way === 'subway') {
    const x = mainExit(v), R = pickedRoute(), L = R ? [...R[0].legs].reverse() : null;
    h += row(`<span class="exit">${x.e.no}</span>`, `${x.e.no}번 출구 엘리베이터로`, L ? `집으로: ${L.map(l => lineName(l.ref)).join(' → ')} → ${st.from}역` : `${x.s.name} ${x.s.line}`, '', L ? `<p>${L.map((l, i) => `${i ? `${esc(l.st[l.st.length - 1])}에서 ` : ''}${esc(lineName(l.ref))}`).join(' → ')} → ${esc(st.from)}역</p>` : '', 'y');
  } else h += row(I.car, '주차장 나가기', `출차 ${A.gates['동2문']}% 동2문 · ${A.gates['북2문']}% 북2문`, '', `<p>공연이 끝나면 출차의 약 ${A.gates['동2문']}%가 동2문, ${A.gates['북2문']}%가 북2문, ${A.gates['남2문']}%가 남2문으로 몰려요.${v && v.gate ? ` 이 공연장 주차장은 <b>${esc(v.gate)}</b> 쪽이에요.` : ''} 종료 70분 뒤부터 나서면 기다림이 짧아요.</p>`);
  h += busRow(v);
  h += row(I.phone, '장애인콜택시 1588-4388', '끝나면 바로 접수 · 동승 3명', '', `<p><a class="tel" href="tel:15884388">1588-4388</a> (전화·문자, 앱 '장애인콜택시')</p><p class="meta">필요한 때 바로 접수하는 방식이 원칙이라, 공연이 끝나면 바로 접수하세요. 끝난 직후엔 대기가 길 수 있어요. 휠체어 이용 시 보호자 등 3명까지 함께 탈 수 있어요. 시각장애인은 복지콜 <a class="tel" href="tel:16004477">1600-4477</a>. 타는 곳은 공연장 이름과 가까운 출입문(${esc((v && v.gate) || '동2문')})을 함께 말하세요.</p>`);
  h += '</ol>';
  h += `<details class="alt"><summary>10분 단위 혼잡 자세히 보기</summary><div class="bars" role="img" aria-label="공연 종료 전후 10분 단위 출차 대수">${A.min.map((o, i) => {
    const lab = T.end ? hm(addMin(T.end, o)) : (o === 0 ? '종료' : (o > 0 ? '+' : '') + o + '분');
    const hot = o >= 0 && A.event[i] >= mx / 2;
    return `<span class="t ${o === 0 ? 'end' : ''}">${lab}</span><div class="track"><div class="b ${hot ? 'hot' : ''}" style="width:${A.event[i]/mx*100}%"></div><div class="w" style="left:${A.base[i]/mx*100}%"></div></div><span class="n">${A.event[i]}</span>`;
  }).join('')}</div>
  <div class="legend"><span><i style="background:#d9480f"></i>가장 붐빌 때의 절반 이상</span><span><i style="background:var(--blue)"></i>공연일 10분 출차(대)</span><span><i style="background:var(--ink);opacity:.55;width:3px"></i>공연 없는 날 같은 시각</span></div>
  ${(() => { const s = curShow(); return s && s.durSrc !== 'official' ? `<p class="meta">끝나는 시각은 ${s.durSrc === 'past' ? '같은 출연자의 지난 공연 소요시간' : '이 공연장 공연들의 보통 소요시간'}(${s.dur}분)으로 추정했어요(공연정보 API).</p>` : ''; })()}
  <p class="meta">2025년 올림픽공원 주차장 입출차 약 240만 건 중 관객 8천 명 이상 공연일 77일을 분석했어요. 출차가 몰리기 시작한 시점을 공연 종료로 맞추고, 날마다 값의 가운데 값(중앙값)을 보여 줘요.</p></details>`;
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
// 지도에 그릴 경로: 기본은 '가는 길' 출구, 지도에서 출구를 눌러 바꾸거나 끌 수 있음
function mapExit(v) {
  const key = [st.venue, st.from, st.way, st.mode].join('|');
  if (st.mapKey !== key) { st.mapKey = key; st.mapExit = null; }
  if (st.mapExit === 'off' || !st.layers.route) return null;
  if (st.mapExit) { const x = exitsFor(v).find(e => e.id === st.mapExit); if (x) return x; }
  return st.way === 'subway' ? mainExit(v) : null;
}
function tapExit(id) {
  const v = venue(); if (!v) return;
  const cur = mapExit(v);
  if (cur && cur.id === id) { st.mapExit = 'off'; toast('경로를 껐어요. 출구를 다시 누르면 켜져요.'); }
  else { st.mapExit = id; st.layers.route = true; const x = exitsFor(v).find(e => e.id === id); toast(`${x.s.name} ${x.e.no}번 출구에서 가는 길을 보여 줘요.`); }
  syncLayerBtns(); drawMap();
}
function syncLayerBtns() { document.querySelectorAll('#layers button').forEach(b => { const k = b.dataset.k; b.setAttribute('aria-pressed', k === 'route' ? String(st.layers.route && st.mapExit !== 'off') : String(!!st.layers[k])); }); }
const myLoc = {on:false, pos:null, watch:null, first:true};
function toggleLoc() {
  if (myLoc.on) { navigator.geolocation.clearWatch(myLoc.watch); Object.assign(myLoc, {on:false, pos:null, watch:null}); $('#locBtn').setAttribute('aria-pressed', 'false'); drawMap(); return; }
  if (!navigator.geolocation) { toast('이 기기에서는 위치를 쓸 수 없어요.'); return; }
  Object.assign(myLoc, {on:true, first:true}); $('#locBtn').setAttribute('aria-pressed', 'true'); toast('내 위치를 찾는 중이에요…');
  myLoc.watch = navigator.geolocation.watchPosition(p => {
    const ll = [p.coords.latitude, p.coords.longitude], out = ll[0] < B.s || ll[0] > B.n || ll[1] < B.w || ll[1] > B.e;
    if (out) { if (myLoc.first) toast('지금 위치가 올림픽공원 밖이라 지도에 표시하지 않아요.'); myLoc.first = false; myLoc.pos = null; return; }
    myLoc.pos = ll;
    const me = $('#me');
    if (me && !myLoc.first) { me.dataset.p = P(ll).join(','); setVB(); return; }
    drawMap();
    if (myLoc.first) { const q = P(ll); vb.x = q[0] - vb.w / 2; vb.y = q[1] - vb.h / 2; setVB(); myLoc.first = false; toast('파란 점이 내 위치예요. 버튼을 다시 누르면 꺼져요.'); }
  }, () => { toast('위치를 가져오지 못했어요. 휴대폰 설정에서 위치 권한을 확인하세요.'); toggleLoc(); }, {enableHighAccuracy:true, maximumAge:5000, timeout:20000});
}
// ---------- 지도 따라가기 ----------
let follow = null;
function startFollow() {
  const v = venue(), x = mapExit(v) || mainExit(v); if (!x.p.real) return;
  const turns = directions(x.p.pts, v, `${x.s.name} ${x.e.no}번 출구`).turns;
  follow = {i:0, turns, pos:null, watch:null, out:false};
  if (navigator.geolocation) follow.watch = navigator.geolocation.watchPosition(onPos, () => { if (follow && !follow.pos) { follow.noGps = true; renderFollow(); } }, {enableHighAccuracy:true, maximumAge:5000, timeout:20000});
  setTab('map'); drawMap();
  setTimeout(() => { const b = $('#followCard .ft'); if (b) b.focus(); }, 50);
}
window.__dbg = {get follow() { return follow; }};
function stopFollow() { if (follow && follow.watch != null) navigator.geolocation.clearWatch(follow.watch); follow = null; drawMap(); }
function onPos(p) {
  if (!follow) return;
  const ll = [p.coords.latitude, p.coords.longitude];
  follow.out = ll[0] < B.s || ll[0] > B.n || ll[1] < B.w || ll[1] > B.e;
  follow.pos = follow.out ? null : ll;
  const t = follow.turns[follow.i];
  if (follow.pos && t && follow.i < follow.turns.length - 1 && dist(follow.pos, t.end) < 15) { follow.i++; if (sp.on || follow.voice) sayFollow(); drawMap(); return; }
  const me = $('#me'); if (me && follow.pos) { const q = P(follow.pos); me.dataset.p = q.join(','); setVB(); } else drawMap();
  renderFollow();
}
function renderFollow() {
  const box = $('#followCard'); if (!box) return;
  if (!follow) { box.hidden = true; return; }
  const t = follow.turns[follow.i], n = follow.turns.length;
  box.hidden = false;
  box.innerHTML = `<div class="fi" aria-hidden="true">${I[t.kind] || I.up}</div><div class="ft" tabindex="-1" aria-live="polite"><b>${esc(t.short)}</b><small>${esc(t.poi || (follow.i === n - 1 ? venue().name : ''))}</small></div><span class="fc">${follow.i + 1}/${n}</span>
    <div class="fb"><button data-fprev aria-label="이전 안내" ${follow.i ? '' : 'disabled'}>이전</button>${SPEECH ? `<button data-fsay>${I.spk}<span>듣기</span></button>` : ''}<button data-fnext aria-label="다음 안내" ${follow.i < n - 1 ? '' : 'disabled'}>다음</button><button data-fexit>끝내기</button></div>
    ${follow.out ? '<p class="fnote">지금 위치가 공원 밖이에요. 안내를 직접 넘기며 보세요.</p>' : follow.noGps ? '<p class="fnote">위치를 쓸 수 없어 직접 넘기며 안내해요.</p>' : !follow.pos ? '<p class="fnote">내 위치를 찾는 중…</p>' : ''}`;
}
function sayFollow() { if (!SPEECH || !follow) return; const t = follow.turns[follow.i]; sayList('map', [{step:-1, text:speakable({cloneNode:() => { const d = document.createElement('div'); d.textContent = TR(t.text); return d; }})}], 0); }

function drawMap() {
  const v = venue() || {id:'', name:'', lat:0, lng:0}, svg = $('#map'), has = !!venue();
  let route = null;
  const mx = has ? mapExit(v) : null;
  if (mx) route = mx.p.pts;
  const mark = (ll, inner, title, off, attrs) => { const p = P(ll); return `<g class="sc" data-p="${p[0]},${p[1]}" ${attrs || `data-info="${esc(title)}"`}><title>${esc(title)}</title>${off ? `<g transform="translate(${off[0]} ${off[1]})">${inner}</g>` : inner}</g>`; };
  const OFF = {'olpark5-2':[22,20], 'olpark9-3':[-26,6], 'olpark9-4':[4,-24]};
  let g = `<title id="mapTitle">올림픽공원 지도: ${esc(v.name)}까지 경로</title><rect x="-2000" y="-2000" width="${W+4000}" height="${H+4000}" fill="var(--bg)"/>`;
  g += Object.values(D.roads).map(r => `<polyline points="${pts(r)}" fill="none" stroke="var(--road)" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>`).join('');
  g += `<polygon points="${pts(D.park)}" fill="var(--park)" stroke="light-dark(#9cc08a,#35593f)" stroke-width="2"/>`;
  if (st.layers.path && D.paths) g += `<g stroke="var(--path)" stroke-width="2.2" fill="none" stroke-linecap="round">${D.paths.map(p => `<polyline points="${pts(p)}"/>`).join('')}</g>`;
  g += `<polygon points="${pts(D.water['몽촌호'])}" fill="var(--water)"/><polygon points="${pts(D.water['88호수'])}" fill="var(--water)"/><polyline points="${pts(D.water['성내천'])}" fill="none" stroke="var(--water)" stroke-width="7"/>`;
  if (route && follow) {
    g += `<polyline class="route" points="${pts(route)}" stroke-opacity=".25" stroke-width="12"/>`;
    follow.turns.slice(follow.i).forEach((t, k) => { if (t.pts.length > 1) g += `<polyline class="route" points="${pts(t.pts)}" ${k ? '' : 'stroke-width="9"'} ${k ? 'stroke-opacity=".7"' : ''}/>`; });
  } else if (route) g += `<polyline class="route" points="${pts(route)}" stroke-opacity=".25" stroke-width="12"/><polyline class="route anim" points="${pts(route)}"/>`;
  if (st.layers.toilet) g += D.fac.filter(f => f.k === '화장실').map(f => mark(f.ll, `<rect x="-11" y="-11" width="22" height="22" rx="5" fill="#2b8a3e"/><text y="4" font-size="11" fill="#fff" text-anchor="middle" font-weight="700">WC</text>`, `화장실 · ${f.p} ${f.d}`)).join('');
  if (st.layers.store) g += D.fac.filter(f => /편의점|식음료/.test(f.k)).map(f => mark(f.ll, `<circle r="8" fill="#7048e8" stroke="#fff" stroke-width="2"/>`, `${f.k} · ${f.p}`)).join('');
  if (st.layers.report && live.reports) g += live.reports.map(r => mark(r.ll, (doubted(r) ? '<g opacity=".4">' : '<g>') + (r.kind === 'good' ? `<circle r="11" fill="#2b8a3e" stroke="#fff" stroke-width="2.5"/><path d="M-5 0l3.5 3.5L5-4" stroke="#fff" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>` : `<path d="M0-14 13 10H-13z" fill="#d9480f" stroke="#fff" stroke-width="2.5" stroke-linejoin="round"/><text y="7" font-size="14" font-weight="700" fill="#fff" text-anchor="middle">!</text>`) + '</g>', `현장 제보 · ${RK[r.kind]}${r.text ? ' · ' + r.text : ''} (${ago(r.at)}, 저도 봤어요 ${r.ok || 0} · 지금은 아니에요 ${r.flag || 0})`)).join('');
  if (st.layers.center) g += D.centers.map(c => mark([c.lat,c.lng], `<circle r="15" fill="var(--yel)" stroke="#111" stroke-width="1.5"/><text y="6" font-size="17" text-anchor="middle" font-weight="700" fill="#111">i</text>`, `${c.name} · 휠체어 무료 대여`)).join('');
  g += D.venues.map(x => { const on = x.id === v.id; return mark(vll(x), `<circle r="${on ? 15 : 9}" fill="${on ? 'var(--blueBg)' : 'var(--mute)'}" stroke="#fff" stroke-width="3"/><text y="${on ? -24 : -15}" font-size="${on ? 24 : 16}" font-weight="${on ? 700 : 500}" text-anchor="middle" fill="var(--ink)" paint-order="stroke" stroke="var(--bg)" stroke-width="5">${esc(x.name)}</text>`, x.name); }).join('');
  const best = mx ? mx.id : '';
  D.stations.forEach(s => s.ev.forEach(e => { const id = s.id + '-' + e.no, on = id === best; g += mark(e.ll, `<rect x="-16" y="-16" width="32" height="32" rx="7" fill="${on ? 'var(--yel)' : '#fff'}" stroke="${s.color}" stroke-width="3.5"/><text y="6" font-size="18" font-weight="700" text-anchor="middle" fill="#111">${e.no}</text>`, `${s.name} ${s.line} ${e.no}번 출구 엘리베이터`, OFF[id], `data-exit="${id}" role="button" tabindex="0" aria-pressed="${on}"`); }));
  [['몽촌토성역', D.stations[2].ev[0].ll, 0, -30], ['한성백제역', D.stations[3].ev[0].ll, 0, 44], ['올림픽공원역', D.stations[0].ev[0].ll, -10, 48]].forEach(([n, ll, dx, dy]) => { g += mark(ll, `<text x="${dx}" y="${dy}" font-size="19" font-weight="700" text-anchor="middle" fill="var(--ink)" paint-order="stroke" stroke="var(--bg)" stroke-width="5">${n}</text>`, n, 0, 'style="pointer-events:none" aria-hidden="true"'); });
  const mePos = (follow && follow.pos) || myLoc.pos;
  if (mePos) g += `<g class="sc" id="me" data-p="${P(mePos).join(',')}" data-info="내 위치"><title>내 위치</title><circle r="16" fill="#378ADD" opacity=".25"/><circle r="8" fill="#185FA5" stroke="#fff" stroke-width="3"/></g>`;
  svg.innerHTML = g;
  if (follow) { const t = follow.turns[follow.i], nx = follow.turns[follow.i + 1]; fit([...t.pts, ...(nx ? [nx.ll] : []), ...(follow.pos ? [follow.pos] : [])], true); }
  else fit(has ? (route || [vll(v), [centerFor(v).lat, centerFor(v).lng]]) : D.park);
  renderFollow();
  const dirs = mx && mx.p.real ? directions(mx.p.pts, v, `${mx.s.name} ${mx.e.no}번 출구`) : [];
  $('#mapsay').hidden = !SPEECH || !dirs.length;
  $('#mapdesc').innerHTML = dirs.length ? `<details class="alt"><summary>지도 내용 글로 보기</summary><ol class="turns">${dirs.map(t => `<li>${t}</li>`).join('')}</ol></details>` : '';
  $('#mapnote').textContent = !has ? '공연을 고르면 엘리베이터 출구에서 공연장까지 계단 없는 길을 그려 드려요. 노란 숫자: 엘리베이터 출구, 노란 i: 휠체어 대여.' : mx ? `파란 선: ${mx.s.name} ${mx.e.no}번 출구에서 계단을 피한 길. 출구 번호를 누르면 그 출구 경로로 바뀌고, 한 번 더 누르면 꺼져요.` : '출구 번호를 누르면 그 출구에서 가는 길을 보여 줘요. 아이콘을 누르면 이름이 나와요.';
  syncLayerBtns();
}
function fit(list, tight) {
  const p = list.map(P), xs = p.map(a => a[0]), ys = p.map(a => a[1]);
  let x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
  const wrap = $('#mapwrap'), ar = wrap.clientWidth / Math.max(1, wrap.clientHeight) || 4/3;
  let w = Math.max(x1 - x0, tight ? 110 : 260) * (tight ? 1.5 : 1.6), h = Math.max(y1 - y0, tight ? 90 : 200) * (tight ? 1.5 : 1.6);
  if (w / h > ar) h = w / ar; else w = h * ar;
  vb = {x:(x0+x1)/2 - w/2, y:(y0+y1)/2 - h/2, w, h}; setVB();
}
function zoom(f, cx, cy) { const nw = Math.min(W*1.6, Math.max(120, vb.w * f)), nh = nw * vb.h / vb.w; cx ??= vb.x + vb.w/2; cy ??= vb.y + vb.h/2; vb = {x:cx - (cx - vb.x) * nw / vb.w, y:cy - (cy - vb.y) * nh / vb.h, w:nw, h:nh}; setVB(); }
{ // 드래그·휠·핀치
  const wrap = $('#mapwrap'), ptr = new Map(); let last = null, pinch = null;
  const toSvg = (cx, cy) => { const r = wrap.getBoundingClientRect(); return [vb.x + (cx - r.left) / r.width * vb.w, vb.y + (cy - r.top) / r.height * vb.h]; };
  wrap.addEventListener('pointerdown', e => { if (e.target.closest('.zoom, #pickbar, #followCard')) return; wrap.setPointerCapture(e.pointerId); ptr.set(e.pointerId, [e.clientX, e.clientY]); wrap.classList.add('drag'); last = [e.clientX, e.clientY]; if (ptr.size === 2) { const [a, b] = [...ptr.values()]; pinch = Math.hypot(a[0]-b[0], a[1]-b[1]); } });
  wrap.addEventListener('pointermove', e => { if (!ptr.has(e.pointerId)) return; ptr.set(e.pointerId, [e.clientX, e.clientY]); const r = wrap.getBoundingClientRect();
    if (ptr.size === 2 && pinch) { const [a, b] = [...ptr.values()], d = Math.hypot(a[0]-b[0], a[1]-b[1]); const c = toSvg((a[0]+b[0])/2, (a[1]+b[1])/2); zoom(pinch / d, c[0], c[1]); pinch = d; return; }
    vb.x -= (e.clientX - last[0]) / r.width * vb.w; vb.y -= (e.clientY - last[1]) / r.height * vb.h; last = [e.clientX, e.clientY]; setVB(); });
  let downAt = null;
  wrap.addEventListener('pointerdown', e => { downAt = [e.clientX, e.clientY]; }, true);
  wrap.addEventListener('click', e => { if (!pick || !downAt || e.target.closest('.zoom, #pickbar')) return; if (Math.hypot(e.clientX - downAt[0], e.clientY - downAt[1]) > 6) return; const c = toSvg(e.clientX, e.clientY); vb.x = c[0] - vb.w / 2; vb.y = c[1] - vb.h / 2; setVB(); });
  // 키보드로 지도 옮기기 (화살표)
  wrap.addEventListener('keydown', e => { const d = {ArrowLeft:[-1,0], ArrowRight:[1,0], ArrowUp:[0,-1], ArrowDown:[0,1]}[e.key]; if (!d || e.target !== wrap) return; e.preventDefault(); vb.x += d[0] * vb.w * 0.12; vb.y += d[1] * vb.h * 0.12; setVB(); });
  wrap.addEventListener('pointerup', e => {
    if (pick || !downAt || Math.hypot(e.clientX - downAt[0], e.clientY - downAt[1]) > 6 || e.target.closest('.zoom, #pickbar, #followCard')) return;
    const el = document.elementFromPoint(e.clientX, e.clientY); const t = el && el.closest('[data-exit], [data-info]'); if (!t) return;
    if (t.dataset.exit) tapExit(t.dataset.exit); else toast(t.dataset.info);
  });
  wrap.addEventListener('keydown', e => { const t = e.target.closest && e.target.closest('[data-exit]'); if (t && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); tapExit(t.dataset.exit); setTimeout(() => { const n = document.querySelector(`[data-exit="${t.dataset.exit}"]`); if (n) n.focus(); }, 30); } });
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
const showBtn = (s, i) => `<button class="show" data-i="${i}" aria-pressed="${s === st.show}"><span class="d"><b>${s.at.getMonth()+1}/${s.at.getDate()}</b><span>${DOW[s.at.getDay()]} ${hm(s.at)}</span></span><span><span class="tt" data-noi18n>${esc(s.title)}</span><br><span class="vv">${esc(D.venues.find(v => v.id === s.venue).name)}</span></span></button>`;
function renderShows() {
  $('#shows').innerHTML = shows.map((s, i) => showBtn(s, i)).join('') || '<p class="meta">예정된 공연 정보가 없어요.</p>';
  $('#evSrc').textContent = evSource === 'live' ? '올림픽공원 공식 일정에서 방금 불러온 공연이에요.' : evSource === 'saved' ? `공식 일정 ${fmtDate(evSavedAt)} ${hm(evSavedAt)}에 저장해 둔 공연이에요.` : `공연 일정: ${D.asof} 저장본`;
  $('#venueSel').innerHTML = `<option value="">공연장 고르기</option>` + D.venues.map(v => `<option value="${v.id}" ${v.id === st.venue ? 'selected' : ''}>${esc(v.name)}</option>`).join('');
}
$('#layers').innerHTML = [['route','경로'],['path','보행로'],['toilet','화장실'],['center','안내센터'],['store','편의점'],['report','현장 제보']].map(([k,l]) => `<button data-k="${k}" aria-pressed="${st.layers[k]}">${l}</button>`).join('');

function shareURL() {
  const s = curShow(), p = new URLSearchParams({v:st.venue, m:st.mode, w:st.way}); if (st.from && st.way === 'subway') p.set('f', st.from);
  if (s) { p.set('t', s.at.toISOString()); p.set('n', s.title.slice(0, 80)); }
  return location.origin + location.pathname + '?' + p + '#route';
}
function shareText() {
  const v = venue(), s = curShow(), T = timesFor(), m = MODES.find(x => x.id === st.mode).label, w = WAYS.find(x => x.id === st.way).label;
  const L = [`[편한길 올팍] ${s ? s.title : v.name}`];
  if (s) L.push(`${fmtDate(s.at)} ${hm(s.at)} 시작 · ${v.name}`); else L.push(v.name);
  L.push(`${m} · ${w}`);
  if (s && st.way === 'subway') { const x = mainExit(v); L.push(`${hm(T.arrive)}까지 ${x.s.name} ${x.s.line} ${x.e.no}번 출구(엘리베이터)에서 만나요`); }
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
if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
  // 새 버전이 올라오면 한 번 자동으로 다시 열어 옛 화면이 남지 않게
  const had = !!navigator.serviceWorker.controller; let reloaded = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => { if (had && !reloaded) { reloaded = true; location.reload(); } });
  addEventListener('load', () => navigator.serviceWorker.register('sw.js').then(reg => {
    document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') reg.update().catch(() => {}); });
  }).catch(() => {}));
}
// 마지막으로 불러온 공식 일정을 기기에 저장해 두고, 연결이 없을 때 씀
function saveEvents(ev) { try { localStorage.setItem('pyeonhanEvents', JSON.stringify({at:Date.now(), ev})); } catch(e) {} }
function loadSavedEvents() { try { const s = JSON.parse(localStorage.getItem('pyeonhanEvents') || 'null'); if (s && Date.now() - s.at < 14 * 864e5 && s.ev.length) return s; } catch(e) {} return null; }

// ---------- 현장 제보 ----------
const RK = {step:'턱·계단이 있어요', slope:'경사가 가팔라요', blocked:'길이 막혔어요(공사·행사)', elevator:'엘리베이터가 멈췄어요', toilet:'장애인 화장실을 못 써요', good:'휠체어로 다니기 좋아요'};
const score = r => (r.ok || 0) - (r.flag || 0);
const doubted = r => (r.flag || 0) > (r.ok || 0);
const ago = t => { const m = (Date.now() - t) / 60000; return m < 60 ? `${Math.max(1, Math.round(m))}분 전` : m < 1440 ? `${Math.round(m / 60)}시간 전` : `${Math.round(m / 1440)}일 전`; };
const llFromSvg = (x, y) => [B.n - y / ky, x / kx + B.w];
function routeReports() {
  if (!live.reports || !venue() || st.way !== 'subway') return [];
  const pts = mainExit(venue()).p.pts;
  return live.reports.filter(r => r.kind !== 'good' && !doubted(r) && pts.some(p => dist(p, r.ll) < 40));
}
async function loadReports() {
  if (!C.LIVE_API || !navigator.onLine) return;
  try { const r = await fetch(C.LIVE_API + '/reports'); if (!r.ok) throw 0; live.reports = (await r.json()).items || []; $('#reportBtn').hidden = false; }
  catch(e) { live.reports = null; $('#reportBtn').hidden = true; }
  renderReports(); if (venue()) { renderRoute(); } drawMap();
}
let rsort = 'new'; try { rsort = localStorage.getItem('pyeonhanRsort') || 'new'; } catch(e) {}
function renderReports() {
  const box = $('#reports'); if (!live.reports) { box.innerHTML = ''; return; }
  const v = venue(), top = rsort === 'top';
  const L = [...live.reports].sort((a, b) => (doubted(a) - doubted(b)) || (top ? (score(b) - score(a)) || (b.at - a.at) : (b.at - a.at))).slice(0, 12);
  const sb = (k, t) => `<button data-rsort="${k}" aria-pressed="${rsort === k}">${t}</button>`;
  box.innerHTML = `<h3>최근 30일 현장 제보 <small>${live.reports.length}건</small></h3>` + (live.reports.length ? `<div class="rsort" role="group" aria-label="제보 정렬">${sb('new', '최신순')}${sb('top', '추천순')}</div>` : '') + (L.length ? `<ul class="rlist">${L.map(r => `<li class="${doubted(r) ? 'doubt' : ''}"><span class="rk ${r.kind === 'good' ? 'g' : ''}">${esc(RK[r.kind])}</span>${doubted(r) ? ' <span class="dtag">확인이 엇갈려요</span>' : ''} <span class="meta">${ago(r.at)}${v ? ` · ${esc(v.name)}에서 약 ${r10(dist(r.ll, vll(v)))}m` : ''}</span>${r.text ? `<p>${esc(r.text)}</p>` : ''}<div class="rb"><button data-vote="ok" data-id="${r.id}" aria-pressed="${myVote(r.id) === 'ok'}"><svg class="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 10v11H4V10h3zM7 10l4-7a2 2 0 0 1 3 2l-1 5h6a2 2 0 0 1 2 2.3l-1.4 7A2 2 0 0 1 17.6 21H7"/></svg> 저도 봤어요 <b>${r.ok || 0}</b><span class="sr">명</span></button><button data-vote="flag" data-id="${r.id}" aria-pressed="${myVote(r.id) === 'flag'}"><svg class="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path transform="rotate(180 12 12)" d="M7 10v11H4V10h3zM7 10l4-7a2 2 0 0 1 3 2l-1 5h6a2 2 0 0 1 2 2.3l-1.4 7A2 2 0 0 1 17.6 21H7"/></svg> 지금은 아니에요 <b>${r.flag || 0}</b><span class="sr">명</span></button></div></li>`).join('')}</ul>` : '<p class="meta">아직 제보가 없어요. 다니다 불편한 곳이 있으면 알려 주세요.</p>')
    + `<p class="meta">제보는 이용자가 남긴 정보라 사실과 다를 수 있어요. 추천순은 '저도 봤어요'가 많은 제보가 위에 나와요. '지금은 아니에요'가 더 많으면 어느 순서든 맨 아래로 내려가요. '지금은 아니에요'가 3명 이상이면서 더 많으면 숨겨지고, 모든 제보는 30일 뒤 사라져요. 누른 버튼을 한 번 더 누르면 취소돼요.</p>`;
}
let pick = false;
function setPick(on) {
  pick = on; $('#mapwrap').classList.toggle('picking', on); $('#pickbar').hidden = !on; $('#reportBtn').hidden = on || !live.reports;
  if (on) { setTab('map'); $('#pickOk').focus(); }
}
function openReport(ll) {
  if (ll[0] < B.s || ll[0] > B.n || ll[1] < B.w || ll[1] > B.e) { toast('올림픽공원 안이나 가까운 역 근처를 골라 주세요.'); return; }
  const f = $('#reportForm'); f.reset(); f.dataset.ll = ll.join(','); $('#rpErr').textContent = '';
  $('#rpWhere').textContent = venue() ? `${venue().name}에서 약 ${r10(dist(ll, vll(venue())))}m 떨어진 곳` : '지도에서 고른 곳';
  $('#report').showModal();
}
async function sendReport(e) {
  e.preventDefault();
  const f = e.target, kind = (f.querySelector('input[name=kind]:checked') || {}).value, [lat, lng] = f.dataset.ll.split(',').map(Number);
  if (!kind) { $('#rpErr').textContent = '어떤 상태인지 하나 골라 주세요.'; return; }
  const btn = f.querySelector('button[type=submit]'); btn.disabled = true;
  try {
    const r = await fetch(C.LIVE_API + '/reports', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({kind, lat, lng, text:f.text.value})});
    if (r.status === 429) throw new Error('오늘은 제보를 더 남길 수 없어요. 내일 다시 알려 주세요.');
    if (!r.ok) throw new Error('보내지 못했어요. 잠시 뒤 다시 해 주세요.');
    $('#report').close(); setPick(false); toast('고마워요! 다른 분들께 30일 동안 보여요.'); loadReports();
  } catch(err) { $('#rpErr').textContent = err.message || '보내지 못했어요.'; }
  finally { btn.disabled = false; }
}
// 내가 누른 추천·비추천(오늘 하루 기준, 서버도 하루 단위로 같은 사람을 알아봐요)
const kstDay = () => new Date(Date.now() + 9 * 3600e3).toISOString().slice(0, 10);
function myVotes() { try { const o = JSON.parse(localStorage.getItem('pyeonhanVotes') || '{}'); return o.day === kstDay() ? o.v || {} : {}; } catch (e) { return {}; } }
const myVote = id => myVotes()[id] || null;
function setMyVote(id, k) { try { const v = myVotes(); if (k) v[id] = k; else delete v[id]; localStorage.setItem('pyeonhanVotes', JSON.stringify({day: kstDay(), v})); } catch (e) {} }
async function vote(id, kind, b) {
  b.disabled = true;
  try {
    const r = await fetch(`${C.LIVE_API}/reports/${id}/${kind}`, {method:'POST'}); const j = await r.json();
    if (!r.ok) throw new Error(j.error);
    if (j.same) toast('mine' in j ? '내가 올린 제보에는 누를 수 없어요.' : '이미 반영했어요.');
    else { setMyVote(id, j.mine); toast(j.mine == null ? '취소했어요.' : kind === 'ok' ? '확인해 주셔서 고마워요.' : '알려 주셔서 고마워요.'); }
    loadReports();
  } catch(e) { toast('보내지 못했어요.'); b.disabled = false; }
}

// 이벤트
document.addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  if (b.dataset.mode) { st.mode = b.dataset.mode; save(); render(); }
  else if (b.dataset.way) { st.way = b.dataset.way; save(); render(); }
  else if (b.dataset.tab) setTab(b.dataset.tab);
  else if (b.dataset.k) { if (b.dataset.k === 'route') { const on = st.layers.route && st.mapExit !== 'off'; st.layers.route = !on; if (!on) st.mapExit = null; } else st.layers[b.dataset.k] = !st.layers[b.dataset.k]; syncLayerBtns(); drawMap(); }
  else if (b.id === 'locBtn') toggleLoc();
  else if (b.id === 'openSheet' || b.dataset.open !== undefined) { renderShows(); $('#sheet').showModal(); }
  else if (b.id === 'sheetX') $('#sheet').close();
  else if (b.classList.contains('show')) { dropLink(); st.show = shows[+b.dataset.i]; st.venue = st.show.venue; st.altSid = ''; if ($('#sheet').open) $('#sheet').close(); render(); scrollTo({top:0, behavior:'smooth'}); }
  else if (b.dataset.sayall !== undefined) { if (sp.on && sp.pane === b.dataset.sayall) stopSpeak(); else sayPane(b.dataset.sayall); }
  else if (b.dataset.vhelp !== undefined) { sp.help = !sp.help; refreshBars(); const q = document.querySelector('[data-vhelp]'); if (q) q.focus(); }
  else if (b.dataset.rate !== undefined) { sp.rate = sp.rate < 1 ? 1 : 0.8; try { localStorage.setItem('pyeonhanRate', sp.rate); } catch(e) {} refreshBars(); if (sp.on) sayPane(sp.pane); }
  else if (b.dataset.say !== undefined) { const stEl = b.closest('.step'), pane = b.closest('.pane').id.slice(5), idx = [...document.querySelectorAll(`#pane-${pane} .step`)].indexOf(stEl); if (sp.on && sp.pane === pane && sp.idx === idx) stopSpeak(); else sayList(pane, [{step:idx, text:speakable(stEl)}], 0); }
  else if (b.id === 'mapsay') { if (sp.on && sp.pane === 'map') { stopSpeak(); return; } const items = [...$('#mapdesc').querySelectorAll('li')].map(li => ({step:-1, text:speakable(li)})); const c = centerFor(venue()), tl = toiletsNear(venue()); items.unshift({step:-1, text:TR(`지도 안내예요. 파란 선은 계단을 피한 길이에요.`)}); items.push({step:-1, text:TR(`공연장에서 가장 가까운 화장실은 ${tl[0].p}, 약 ${r10(tl[0].m)}미터 거리예요. 휠체어 대여는 ${c.name}에서 해요.`)}); sayList('map', items, 0); }
  else if (b.id === 'fromClear') { st.from = ''; st.altSid = ''; save(); renderRoute(); drawMap(); renderAfter(); }
  else if (b.id === 'shareBtn') shareTrip();
  else if (b.dataset.follow !== undefined) { startFollow(); }
  else if (b.dataset.fnext !== undefined && follow) { follow.i = Math.min(follow.turns.length - 1, follow.i + 1); drawMap(); if (sp.on) sayFollow(); }
  else if (b.dataset.fprev !== undefined && follow) { follow.i = Math.max(0, follow.i - 1); drawMap(); if (sp.on) sayFollow(); }
  else if (b.dataset.fsay !== undefined && follow) { follow.voice = true; sayFollow(); }
  else if (b.dataset.fexit !== undefined) { stopFollow(); }
  else if (b.dataset.rsort) { rsort = b.dataset.rsort; try { localStorage.setItem('pyeonhanRsort', rsort); } catch(e) {} renderReports(); const q = document.querySelector(`[data-rsort="${rsort}"]`); if (q) q.focus(); }
  else if (b.dataset.alt) { if (b.getAttribute('aria-pressed') === 'true') return; st.altSid = b.dataset.alt; st.mapExit = null; renderRoute(); drawMap(); renderAfter(); const q = document.querySelector(`[data-alt="${b.dataset.alt}"]`); if (q) q.focus(); toast('이 경로로 바꿨어요. 가는 길·지도·막차가 모두 바뀌었어요.'); }
  else if (b.dataset.apps !== undefined) openApps();
  else if (b.id === 'appsX') $('#apps').close();
  else if (b.id === 'reportBtn') setPick(true);
  else if (b.id === 'pickCancel') setPick(false);
  else if (b.id === 'pickOk') openReport(llFromSvg(vb.x + vb.w / 2, vb.y + vb.h / 2));
  else if (b.id === 'pickMe') { if (!navigator.geolocation) { toast('이 기기에서는 위치를 쓸 수 없어요.'); return; } navigator.geolocation.getCurrentPosition(p => { const ll = [p.coords.latitude, p.coords.longitude]; if (ll[0] < B.s || ll[0] > B.n || ll[1] < B.w || ll[1] > B.e) { toast('지금 위치가 올림픽공원 밖이에요. 지도에서 골라 주세요.'); return; } const q = P(ll); vb.x = q[0] - vb.w / 2; vb.y = q[1] - vb.h / 2; setVB(); }, () => toast('위치를 가져오지 못했어요. 지도에서 골라 주세요.'), {enableHighAccuracy:true, timeout:8000}); }
  else if (b.id === 'rpX') $('#report').close();
  else if (b.dataset.vote) vote(b.dataset.id, b.dataset.vote, b);
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
<li><b>서울교통공사</b> 교통약자이용정보 API(서울 1~8호선 전체 역 엘리베이터 실시간 상태), 사이버스테이션 역별 첫차·막차 시간표 · <b>서울시설공단</b>: 장애인콜택시 이용 안내</li>
<li>올림픽공원 홈페이지: 공연장별 주차장·주차요금, 안내센터 휠체어 대여, 휠체어 진입로 · 지도와 보행로, 수도권 전철 노선: OpenStreetMap (우이신설선·GTX-A 일부 노선 제외)</li></ul>
<p><b>한계</b>: 공원 안 경사로 기울기·턱·장애인 화장실 위치는 공개 데이터가 없어요. 보행로는 OpenStreetMap에서 계단으로 표시된 길만 피한 것이라 현장과 다를 수 있어요. 공연 종료 시각은 공식 소요시간이 없으면 같은 출연자의 지난 공연이나 공연장의 보통 소요시간(공연정보 API)으로 추정해요. 공연 뒤 혼잡은 주차장 출차 기록이라 걸어서 나가는 사람의 흐름과는 조금 다를 수 있어요.</p>`;

// ---------- 시작 ----------
{ const s = loadSavedEvents(); if (s) { evSource = 'saved'; evSavedAt = new Date(s.at); setShows(s.ev); } }
netState();
let keepTab = ''; try { keepTab = sessionStorage.getItem('pyeonhanTab') || ''; sessionStorage.removeItem('pyeonhanTab'); } catch(e) {}
renderShows(); render(); setTab(keepTab || location.hash.slice(1) || 'route'); st.started = true;
$('#reportForm').addEventListener('submit', sendReport);
document.addEventListener('submit', e => {
  if (e.target.id !== 'fromForm') return; e.preventDefault();
  const v = (window.I18N ? I18N.toKo($('#fromIn').value.trim()) : $('#fromIn').value.trim()).replace(/역$/, '').replace(/\s+/g, '');
  if (!v) return;
  if (!metroGraph().byName.has(v)) { $('#fromErr').textContent = `'${v}'역을 찾지 못했어요. 목록에서 골라 주세요. (우이신설선·GTX-A 역은 아직 없어요)`; return; }
  st.from = v; st.altSid = ''; save(); renderRoute(); drawMap(); renderAfter(); toast(`${v}역에서 출발하는 길로 바꿨어요.`);
});
$('#reportForm').addEventListener('change', () => { $('#rpErr').textContent = ''; });
loadReports();
// 언어: 머리 오른쪽 '언어' 고르기. 한국어가 아니면 화면 글자를 사전으로 바꿔요
if (window.I18N) { const L = $('#langSel'); L.value = I18N.lang; L.addEventListener('change', () => I18N.setLang(L.value)); I18N.start(); }
async function loadPark() {
  if (!C.LIVE_API) return;
  try { const j = await fetch(C.LIVE_API + '/park').then(r => r.ok ? r.json() : Promise.reject()); if (j && j.now) { live.park = j; live.parking = {p:j.now[1], at:hm(new Date(j.now[0])) + ' 실시간'}; if (st.way === 'car' && venue()) renderRoute(); } } catch(e) {}
}
loadPark(); setInterval(() => { if (document.visibilityState === 'visible' && st.way === 'car') loadPark(); }, 5 * 60000);
(async () => { try { const j = await fetch(C.PARKING_API).then(r => r.json()); const p = +j[0].parking_sum; if (p >= 0) { live.parking = {p, at:hm(new Date()) + ' 실시간'}; if (st.way === 'car' && venue()) renderRoute(); } } catch(e) {} })();
(async () => { try { if (!C.LIVE_API) throw 0; const j = await fetch(C.LIVE_API + '/elevators').then(r => r.json()); live.elev = j.items && j.items.length ? j : 'fail'; } catch(e) { live.elev = 'fail'; } if (venue()) renderRoute(); })();
if (window.loadLiveEvents) loadLiveEvents(D.venues).then(ev => { if (ev.length) { evSource = 'live'; saveEvents(ev); setShows(ev); renderShows(); render(); } }).catch(() => {});
// 앱 고르기 창: 바깥을 누르거나 앱을 고르면 닫기
$('#apps').addEventListener('click', e => { if (e.target === e.currentTarget || e.target.closest('a.app')) setTimeout(() => $('#apps').close(), 0); });
}