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
  swap: '<svg class="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M7 4v16M7 4 4 7M7 4l3 3M17 20V4M17 20l-3-3M17 20l3-3"/></svg>',
  phone: '<svg class="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/></svg>'
};

// ---------- 상태 ----------
const MODES = [{id:'wheel', label:'휠체어', speed:55, icon:I.wheel}, {id:'stroller', label:'유아차', speed:60, icon:I.stroller}, {id:'slow', label:'걷기 힘듦', speed:40, icon:I.slow}];
const WAYS = [{id:'subway', label:'지하철', icon:I.train}, {id:'car', label:'자동차', icon:I.car}];
const st = {show:null, venue:'kspodome', mode:'wheel', way:'subway', tab:'route', layers:{toilet:true, center:true, store:false, path:true}};
const live = {parking:null, elev:null, ramp:null};
try { const s = JSON.parse(localStorage.getItem('pyeonhan') || '{}'); if (s.mode) st.mode = s.mode; if (s.way) st.way = s.way; if (s.big) document.body.classList.add('big'); } catch(e) {}
const save = () => { try { localStorage.setItem('pyeonhan', JSON.stringify({mode:st.mode, way:st.way, big:document.body.classList.contains('big')})); } catch(e) {} };

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

// ---------- 공연 ----------
const now = new Date();
let shows = [], evSource = 'snapshot';
function setShows(events) {
  const all = events.flatMap(e => e.shows.map(s => ({...e, at:new Date(s)})));
  const up = all.filter(s => s.at > addMin(now, -180));
  shows = (up.length ? up : all).sort((a,b) => a.at - b.at).slice(0, 16);
  if (!st.show || !shows.some(s => s.title === st.show.title && +s.at === +st.show.at)) { st.show = shows[0] || null; if (st.show) st.venue = st.show.venue; }
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
    <button class="change" id="openSheet">${I.swap} 다른 공연 고르기</button>`;
  const T = timesFor();
  $('#times').innerHTML = s ? [
    [st.way === 'subway' ? '역 도착 권장' : '주차장 도착 권장', hm(T.arrive), 'hi'],
    ['공연 시작', hm(s.at), ''],
    [s.durOfficial ? '끝나는 시각' : '끝나는 시각(추정)', hm(T.end), ''],
    ['혼잡 피해 나서기', hm(T.leave) + ' 이후', 'hi']
  ].map(([a,b,c]) => `<div class="${c}"><small>${a}</small><b>${b}</b></div>`).join('') + (s.durOfficial ? '' : `<div class="note">끝나는 시각은 공연 시간을 ${s.dur}분으로 가정한 추정이에요.</div>`)
  : `<div style="grid-column:1/-1"><small>공연을 고르면 도착·출발 권장 시각을 계산해 드려요.</small></div>`;
}
function timesFor() {
  const s = curShow(), v = venue(); if (!s) return {};
  const walkM = st.way === 'subway' ? exitsFor(v)[0].p.m : 150;
  const end = addMin(s.at, s.dur);
  return {start:s.at, end, arrive:addMin(s.at, -(60 + mins(walkM))), leave:addMin(end, 50)};
}

// ---------- 가는 길 ----------
function stepHTML(dot, title, body, y) { return `<li class="step"><span class="dot ${y ? 'y' : ''}" aria-hidden="true">${dot}</span><div><h3>${title}</h3>${body}</div></li>`; }
function elevNote(stationName) {
  if (!live.elev) return `<p class="meta">엘리베이터 실시간 정보를 불러오는 중…</p>`;
  if (live.elev === 'fail') return `<div class="note info">${I.info}<span>엘리베이터 실시간 정보를 지금 불러오지 못했어요. 출발 전 역에 전화로 확인하세요.</span></div>`;
  const key = stationName.replace('역', '');
  const mine = live.elev.items.filter(x => x.station === key);
  if (!mine.length) return `<p class="meta">이 역(9호선)은 엘리베이터 실시간 정보가 공개되지 않아요.</p>`;
  const stop = mine.filter(x => x.status === 'S');
  return stop.length
    ? `<div class="note warn">${I.warn}<span><b>지금 멈춘 엘리베이터</b> · ${stop.map(x => `${esc(x.loc)}(${esc(x.floors)})`).join(', ')}<br>반대 방면 승강장 엘리베이터를 이용하거나 역에 도움을 요청하세요. <span class="meta">${esc(live.elev.at)} 기준</span></span></div>`
    : `<div class="note ok">${I.ok}<span>이 역 엘리베이터 ${mine.length}대 모두 운행 중 <span class="meta">${esc(live.elev.at)} 기준</span></span></div>`;
}
function renderRoute() {
  const v = venue(), m = mode(), s = curShow(), T = timesFor(), c = centerFor(v);
  let h = '<ol class="steps">';
  if (st.way === 'subway') {
    const ex = exitsFor(v), best = ex[0], S = best.s;
    h += stepHTML('1', '출발 전 확인', elevNote(S.name) + `<dl class="facts"><dt>${I.phone} 역 전화</dt><dd><a href="tel:${S.tel.replace(/-/g,'')}">${S.tel}</a> (${esc(S.name)} ${esc(S.line)})</dd>${S.ramp != null ? `<dt>안전발판</dt><dd>${S.ramp ? '있음 · 승강장 틈이 걱정되면 역에 요청' : '보유 정보 없음'}</dd>` : ''}</dl>`);
    h += stepHTML('2', `<span class="pill" style="background:${S.color}">${S.line}</span> ${esc(S.name)}에서 내리기`, `<p>엘리베이터와 가까운 칸: <b>${esc(S.board)}</b></p>`);
    h += stepHTML('3', `<span class="exit">${best.e.no}</span>번 출구 엘리베이터로 지상까지`, `<p class="meta">${esc(S.ground)}</p>${S.warn ? `<div class="note warn">${I.warn}<span>${esc(S.warn)}</span></div>` : ''}`, true);
    h += stepHTML('4', `${esc(v.name)}까지 약 ${mins(best.p.m)}분`, `<p>${best.p.real ? `계단을 피한 길로 약 <b>${Math.round(best.p.m)}m</b> (${m.label} 기준)` : `약 ${Math.round(best.p.m)}m 추정 (직선거리 기반, ${m.label} 기준)`}</p>${best.p.steps ? `<div class="note warn">${I.warn}<span>계단 없는 길을 찾지 못해 일부 구간에 계단이 있을 수 있어요.</span></div>` : ''}`);
  } else {
    const ps = D.pstats.full_days_by_lot, lot = v.parking || '가까운 공연장 주차장', lots = (v.parking || '').match(/P\d+[AB]?/g) || [];
    const lp = live.parking;
    h += stepHTML('1', '출발 전 확인', `${lp ? `<div class="live"><b>${lp.p.toLocaleString()}대</b><span class="meta">/ 2,200대 주차 중 · ${esc(lp.at)}</span></div><div class="meter"><i style="width:${Math.min(100, lp.p/22)}%"></i></div>` : '<p class="meta">실시간 주차 대수를 불러오는 중…</p>'}<p class="meta">주말 만차 기록의 62%가 오후 1~3시에 몰려 있어요. 저녁 공연도 낮부터 차요.</p>`);
    h += stepHTML('2', `${esc(v.gate || '동2문')}으로 들어가 ${esc(lot)} 주차`, `<p>${v.pcap ? `${v.pcap}대 규모` : ''}${lots.map(l => ps[l] ? ` · ${l}는 혼잡 기록 92일 중 ${ps[l]}일 만차` : '').join('')}</p><p class="meta">장애인·국가유공자 차량 주차요금 50% 할인 (대형 공연 날엔 사전정산·할인 없음)</p>`, true);
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
    h += `<details class="alt"><summary>다른 역으로 가기 (${alts.length})</summary>${alts.map(x => `<div class="altrow"><p style="margin:0"><span class="pill" style="background:${x.s.color}">${x.s.line}</span> <b>${esc(x.s.name)}</b> <span class="exit">${x.e.no}</span>번 출구 → 약 ${mins(x.p.m)}분</p>${x.s.warn ? `<p class="meta">${esc(x.s.warn)}</p>` : ''}${elevNote(x.s.name)}</div>`).join('')}</details>`;
  }
  $('#pane-route').innerHTML = h;
}

// ---------- 공연 후 ----------
function renderAfter() {
  const T = timesFor(), A = D.exit.aligned, mx = Math.max(...A.event);
  let h = '';
  if (T.end) h += `<p class="meta" style="margin:0">혼잡을 피해 나서기 좋은 시각</p><div class="big">${hm(T.leave)} 이후</div><p>공연이 끝나고 40~50분 동안 차와 사람이 한꺼번에 빠져나가요. 엘리베이터와 출구 앞 줄도 이때 가장 길어요.</p>`;
  else h += `<h3 style="margin:0 0 4px">공연이 끝나면 40~50분은 붐벼요</h3>`;
  h += `<div class="bars" role="img" aria-label="공연 종료 전후 10분 단위 출차 대수. 종료 후 10분에 평균 ${Math.max(...A.event)}대로 가장 많고 50분 뒤 평소 수준">${A.min.map((o, i) => {
    const lab = T.end ? hm(addMin(T.end, o)) : (o === 0 ? '종료' : (o > 0 ? '+' : '') + o + '분');
    const hot = o >= 0 && A.event[i] > A.weekday[i] * 1.5;
    return `<span class="t ${o === 0 ? 'end' : ''}">${lab}</span><div class="track"><div class="b ${hot ? 'hot' : ''}" style="width:${A.event[i]/mx*100}%"></div><div class="w" style="left:${A.weekday[i]/mx*100}%"></div></div><span class="n">${A.event[i]}</span>`;
  }).join('')}</div>
  <div class="legend"><span><i style="background:#d9480f"></i>평소의 1.5배 이상</span><span><i style="background:var(--blue)"></i>공연일 10분 출차(대)</span><span><i style="background:var(--ink);opacity:.55;width:3px"></i>평일 같은 시간</span></div>
  <p class="meta">2024년 7월 공원 입출차 21만 건 중 공연이 있던 4일을, 출차가 몰리기 시작한 시점을 공연 종료로 보고 맞춰 평균했어요.</p>
  <ol class="steps" style="margin-top:12px">
   ${stepHTML('1', '기다리는 동안', '<p>공연장 근처 화장실을 먼저 들르고, 출구 쪽 혼잡이 줄 때까지 실내에서 쉬세요.</p>')}
   ${stepHTML('2', '돌아가는 길', st.way === 'subway' ? `<p>올 때와 같은 <span class="exit">${exitsFor(venue())[0].e.no}</span>번 출구 엘리베이터를 이용하세요.</p>` : '<p>출차가 줄어드는 종료 50분 뒤부터 주차장을 나서면 기다림이 짧아요.</p>')}
  </ol>`;
  $('#pane-after').innerHTML = h;
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
  const v = venue(), svg = $('#map');
  let route = null;
  if (st.way === 'subway') { const b = exitsFor(v)[0]; route = b.p.pts; }
  else { const c = centerFor(v); route = null; }
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
  const best = st.way === 'subway' ? exitsFor(v)[0].id : '';
  D.stations.forEach(s => s.ev.forEach(e => { const id = s.id + '-' + e.no, on = id === best; g += mark(e.ll, `<rect x="-16" y="-16" width="32" height="32" rx="7" fill="${on ? 'var(--yel)' : '#fff'}" stroke="${s.color}" stroke-width="3.5"/><text y="6" font-size="18" font-weight="700" text-anchor="middle" fill="#111">${e.no}</text>`, `${s.name} ${s.line} ${e.no}번 출구 엘리베이터`, OFF[id]); }));
  [['몽촌토성역', D.stations[2].ev[0].ll, 0, -30], ['한성백제역', D.stations[3].ev[0].ll, 0, 44], ['올림픽공원역', D.stations[0].ev[0].ll, -10, 48]].forEach(([n, ll, dx, dy]) => { g += mark(ll, `<text x="${dx}" y="${dy}" font-size="19" font-weight="700" text-anchor="middle" fill="var(--ink)" paint-order="stroke" stroke="var(--bg)" stroke-width="5">${n}</text>`, n); });
  svg.innerHTML = g;
  fit(route || [vll(v), [centerFor(v).lat, centerFor(v).lng]]);
  $('#mapnote').textContent = st.way === 'subway' ? (exitsFor(v)[0].p.real ? '파란 선: 계단을 피한 보행로 (OpenStreetMap 보행로 기준).' : '파란 선: 출구에서 공연장까지 방향 (실제 길은 현장 안내를 따르세요).') : '노란 i: 휠체어 무료 대여 안내센터';
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
function setTab(t) {
  st.tab = t;
  const desk = matchMedia('(min-width:960px)').matches;
  if (desk && t === 'map') st.tab = t = 'route';
  document.querySelectorAll('[role=tab]').forEach(b => b.setAttribute('aria-selected', b.dataset.tab === t));
  $('#pane-route').hidden = t !== 'route'; $('#pane-after').hidden = t !== 'after'; $('#pane-map').hidden = !desk && t !== 'map';
  if (t === 'map') requestAnimationFrame(drawMap);
  if (!desk && st.started) { const el = t === 'map' ? $('#pane-map') : $('#pane-' + t); scrollTo({top:el.getBoundingClientRect().top + scrollY - 76, behavior:'smooth'}); }
  if (location.hash.slice(1) !== t) history.replaceState(null, '', '#' + t);
}

// ---------- 전체 렌더 ----------
function render() { renderTrip(); renderRoute(); renderAfter(); drawMap(); }
function renderShows() {
  $('#shows').innerHTML = shows.map((s, i) => `<button class="show" data-i="${i}" aria-pressed="${s === st.show}"><span class="d"><b>${s.at.getMonth()+1}/${s.at.getDate()}</b><span>${DOW[s.at.getDay()]} ${hm(s.at)}</span></span><span><span class="tt">${esc(s.title)}</span><br><span class="vv">${esc(D.venues.find(v => v.id === s.venue).name)}</span></span></button>`).join('') || '<p class="meta">예정된 공연 정보가 없어요.</p>';
  $('#evSrc').textContent = evSource === 'live' ? '올림픽공원 공식 일정에서 방금 불러온 공연이에요.' : `공연 일정: ${D.asof} 저장본`;
  $('#venueSel').innerHTML = D.venues.map(v => `<option value="${v.id}" ${v.id === st.venue ? 'selected' : ''}>${esc(v.name)}</option>`).join('');
}
$('#layers').innerHTML = [['path','보행로'],['toilet','화장실'],['center','안내센터'],['store','편의점']].map(([k,l]) => `<button data-k="${k}" aria-pressed="${st.layers[k]}">${l}</button>`).join('');

// 이벤트
document.addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  if (b.dataset.mode) { st.mode = b.dataset.mode; save(); render(); }
  else if (b.dataset.way) { st.way = b.dataset.way; save(); render(); }
  else if (b.dataset.tab) setTab(b.dataset.tab);
  else if (b.dataset.k) { st.layers[b.dataset.k] = !st.layers[b.dataset.k]; b.setAttribute('aria-pressed', st.layers[b.dataset.k]); drawMap(); }
  else if (b.id === 'openSheet') { renderShows(); $('#sheet').showModal(); }
  else if (b.id === 'sheetX') $('#sheet').close();
  else if (b.classList.contains('show')) { st.show = shows[+b.dataset.i]; st.venue = st.show.venue; $('#sheet').close(); render(); }
  else if (b.id === 'bigBtn') { const on = document.body.classList.toggle('big'); b.setAttribute('aria-pressed', on); save(); }
});
$('#sheet').addEventListener('click', e => { if (e.target === $('#sheet')) $('#sheet').close(); });
$('#venueSel').addEventListener('change', e => { st.venue = e.target.value; if (st.show && st.show.venue !== st.venue) st.show = null; $('#sheet').close(); render(); });
$('#bigBtn').setAttribute('aria-pressed', document.body.classList.contains('big'));
addEventListener('hashchange', () => setTab(location.hash.slice(1) || 'route'));
addEventListener('resize', () => setTab(st.tab));

$('#sources').innerHTML = `<ul>
<li><b>한국체육산업개발</b>: 올림픽공원 실시간 주차현황 API, 공연정보·공식 일정안내, 주차장 혼잡도 정보(2025.2~2026.8, 699건), 올림픽공원 입출차 정보(2024.7, 215,528건)</li>
<li><b>서울교통공사</b>: 교통약자이용정보 API(엘리베이터 실시간 가동·안전발판), 엘리베이터 설치현황, 9호선 2·3단계 엘리베이터 설치현황, 역사 장애인화장실정보, 수유실현황, 전동휠체어 급속충전기 운영 정보</li>
<li><b>국민체육진흥공단</b>: 올림픽공원 편의시설 정보(화장실·매점 위치, 2021)</li>
<li>올림픽공원 홈페이지: 공연장별 주차장, 안내센터 휠체어 대여, 휠체어 진입로 · 지도와 보행로: OpenStreetMap</li></ul>
<p><b>한계</b>: 공원 안 경사로 기울기·턱·장애인 화장실 위치는 공개 데이터가 없어요. 보행로는 OpenStreetMap에서 계단으로 표시된 길만 피한 것이라 현장과 다를 수 있어요. 공연 종료 시각은 공식 소요시간이 없으면 150분으로 추정해요.</p>`;

// ---------- 시작 ----------
render(); setTab(location.hash.slice(1) || 'route'); st.started = true;
(async () => { try { const j = await fetch(C.PARKING_API).then(r => r.json()); const p = +j[0].parking_sum; if (p >= 0) { live.parking = {p, at:hm(new Date()) + ' 실시간'}; if (st.way === 'car') renderRoute(); } } catch(e) {} })();
(async () => { try { if (!C.LIVE_API) throw 0; const j = await fetch(C.LIVE_API + '/elevators').then(r => r.json()); live.elev = j.items && j.items.length ? j : 'fail'; } catch(e) { live.elev = 'fail'; } renderRoute(); })();
if (window.loadLiveEvents) loadLiveEvents(D.venues).then(ev => { if (ev.length) { evSource = 'live'; setShows(ev); render(); } }).catch(() => {});
}
