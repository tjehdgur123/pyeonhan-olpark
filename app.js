{
const D = window.DATA, C = window.CONFIG || {};
const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

// ---------- 상태 ----------
const MODES = [
  {id:'wheel', label:'휠체어', speed:55},
  {id:'stroller', label:'유아차', speed:60},
  {id:'slow', label:'걷기가 힘들어요', speed:40}
];
const WAYS = [{id:'subway', label:'지하철'}, {id:'car', label:'자동차'}];
let st = {show:null, venue:'kspodome', mode:'wheel', way:'subway', layers:{toilet:true, center:true, store:false}};
try { const s = JSON.parse(localStorage.getItem('pyeonhan') || '{}'); if (s.mode) st.mode = s.mode; if (s.way) st.way = s.way; if (s.big) document.body.classList.add('big'); } catch(e) {}
const save = () => { try { localStorage.setItem('pyeonhan', JSON.stringify({mode:st.mode, way:st.way, big:document.body.classList.contains('big')})); } catch(e) {} };

// ---------- 계산 도우미 ----------
const R = 6371000, rad = d => d * Math.PI / 180;
const dist = (a, b) => { const dl = rad(b[0]-a[0]), dn = rad(b[1]-a[1]); const h = Math.sin(dl/2)**2 + Math.cos(rad(a[0]))*Math.cos(rad(b[0]))*Math.sin(dn/2)**2; return 2*R*Math.asin(Math.sqrt(h)); };
const walk = m => Math.max(1, Math.round(m * 1.3 / MODES.find(x => x.id === st.mode).speed));
const venue = () => D.venues.find(v => v.id === st.venue);
const vll = v => [v.lat, v.lng];
const hm = d => d.toTimeString().slice(0,5);
const addMin = (d, m) => new Date(d.getTime() + m*60000);
const DOW = '일월화수목금토';
const fmtDate = d => `${d.getMonth()+1}/${d.getDate()}(${DOW[d.getDay()]})`;

// 공연 목록 (오늘 이후 회차, 없으면 전체)
const now = new Date();
let shows = [], eventsSource = 'snapshot';
function setShows(events) {
  let all = events.flatMap(e => e.shows.map(s => ({...e, at:new Date(s)})));
  const upcoming = all.filter(s => s.at > addMin(now, -180));
  shows = (upcoming.length ? upcoming : all).sort((a,b) => a.at - b.at).slice(0, 12);
  st.show = shows[0] || null; if (st.show) st.venue = st.show.venue;
}
setShows(D.events);

// ---------- 지도 투영 ----------
const B = {n:37.5258, s:37.5112, w:127.1095, e:127.1340};
const kx = 1000 / (B.e - B.w), ky = kx / Math.cos(rad(37.517));
const P = ll => [((ll[1]-B.w)*kx).toFixed(1), ((B.n-ll[0])*ky).toFixed(1)];
const poly = pts => pts.map(P).map(p => p.join(',')).join(' ');

function drawMap(best) {
  const v = venue(), svg = $('#map');
  const H = Math.round((B.n - B.s) * ky); svg.setAttribute('viewBox', `0 0 1000 ${H}`);
  let g = `<title id="mapTitle">올림픽공원 지도: ${esc(v.name)}까지 추천 경로</title>`;
  g += `<rect width="1000" height="${H}" fill="var(--card)"/>`;
  g += Object.values(D.roads).map(r => `<polyline points="${poly(r)}" fill="none" stroke="var(--road)" stroke-width="9" stroke-linecap="round"/>`).join('');
  g += `<polygon points="${poly(D.park)}" fill="var(--park)" stroke="light-dark(#9cc08a,#35593f)" stroke-width="2"/>`;
  g += `<polygon points="${poly(D.water['몽촌호'])}" fill="var(--water)"/><polygon points="${poly(D.water['88호수'])}" fill="var(--water)"/>`;
  g += `<polyline points="${poly(D.water['성내천'])}" fill="none" stroke="var(--water)" stroke-width="6"/>`;
  // 경로
  if (best) { const a = P(best.from), b = P(vll(v)); g += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="var(--blue)" stroke-width="8" stroke-linecap="round" class="route"/>`; }
  // 시설
  if (st.layers.toilet) g += D.fac.filter(f => f.k === '화장실').map(f => { const p = P(f.ll); return `<g><title>화장실 · ${esc(f.p)} ${esc(f.d)}</title><rect x="${p[0]-10}" y="${p[1]-10}" width="20" height="20" rx="4" fill="#2b8a3e"/><text x="${p[0]}" y="${+p[1]+4}" font-size="11" fill="#fff" text-anchor="middle" font-weight="700">WC</text></g>`; }).join('');
  if (st.layers.store) g += D.fac.filter(f => /편의점|식음료/.test(f.k)).map(f => { const p = P(f.ll); return `<circle cx="${p[0]}" cy="${p[1]}" r="6" fill="#7048e8"><title>${esc(f.k)} · ${esc(f.p)}</title></circle>`; }).join('');
  if (st.layers.center) g += D.centers.map(c => { const p = P([c.lat,c.lng]); return `<g><title>${esc(c.name)} · 휠체어 무료 대여</title><circle cx="${p[0]}" cy="${p[1]}" r="15" fill="var(--yel)" stroke="#111" stroke-width="1.5"/><text x="${p[0]}" y="${+p[1]+6}" font-size="18" text-anchor="middle" font-weight="700" fill="#111">i</text></g>`; }).join('');
  // 공연장
  g += D.venues.map(x => { const p = P(vll(x)), on = x.id === v.id; return `<g><title>${esc(x.name)}</title><circle cx="${p[0]}" cy="${p[1]}" r="${on?16:9}" fill="${on?'var(--blueBg)':'var(--mute)'}" stroke="#fff" stroke-width="2"/>${on?`<text x="${p[0]}" y="${p[1]-20}" font-size="26" font-weight="700" text-anchor="middle" fill="var(--ink)" paint-order="stroke" stroke="var(--card)" stroke-width="6">${esc(x.name)}</text>`:''}</g>`; }).join('');
  // 엘리베이터 출구
  const OFF = {olpark52:[16,18], olpark93:[-20,8], olpark94:[2,-16]};
  D.stations.forEach(s => s.ev.forEach(e => { const o = OFF[s.id+e.no] || [0,0], p = P(e.ll).map((v,i) => +v + o[i]), on = best && best.key === s.id + e.no; g += `<g><title>${esc(s.name)} ${esc(s.line)} ${e.no}번 출구 엘리베이터</title><rect x="${p[0]-15}" y="${p[1]-15}" width="30" height="30" rx="6" fill="${on?'var(--yel)':'#fff'}" stroke="${s.color}" stroke-width="3"/><text x="${p[0]}" y="${+p[1]+5}" font-size="18" font-weight="700" text-anchor="middle" fill="#111">${e.no}</text></g>`; }));
  // 역 이름
  [['몽촌토성역',D.stations[2].ev[0].ll,0,-22],['한성백제역',D.stations[3].ev[0].ll,10,36],['올림픽공원역',D.stations[0].ev[0].ll,-20,40]].forEach(([n,ll,dx,dy]) => { const p = P(ll); g += `<text x="${+p[0]+dx}" y="${+p[1]+dy}" font-size="21" font-weight="500" fill="var(--ink)" text-anchor="middle" paint-order="stroke" stroke="var(--card)" stroke-width="5">${n}</text>`; });
  svg.innerHTML = g;
}

// ---------- 렌더 ----------
function render() {
  const v = venue(), mode = MODES.find(m => m.id === st.mode);
  $('#venueSel').value = st.venue;
  document.querySelectorAll('.show').forEach((b, i) => b.setAttribute('aria-pressed', shows[i] === st.show));
  document.querySelectorAll('#modes .chip').forEach(b => b.setAttribute('aria-pressed', b.dataset.id === st.mode));
  document.querySelectorAll('#ways .chip').forEach(b => b.setAttribute('aria-pressed', b.dataset.id === st.way));

  // 역 출구 후보
  const cands = D.stations.flatMap(s => s.ev.map(e => ({s, e, key:s.id+e.no, from:e.ll, m:dist(e.ll, vll(v))}))).sort((a,b) => a.m - b.m);
  const bestSt = cands[0];
  const center = D.centers.map(c => ({...c, m:dist([c.lat,c.lng], vll(v))})).sort((a,b) => a.m - b.m)[0];
  const best = st.way === 'subway' ? bestSt : {from:[center.lat, center.lng], key:'car'};
  drawMap(best);

  // 요약
  const show = st.show && st.show.venue === st.venue ? st.show : null;
  const start = show ? show.at : null, end = show ? addMin(show.at, show.dur) : null;
  const arrive = start ? addMin(start, -(60 + walk(bestSt.m))) : null;
  const leave = end ? addMin(end, 50) : null;
  $('#sum').innerHTML = show ? [
    ['공연 시작', `${fmtDate(start)} ${hm(start)}`],
    [show.durOfficial ? '끝나는 시각' : '끝나는 시각(추정)', hm(end)],
    [st.way === 'subway' ? `${bestSt.s.name} 도착 권장` : '주차장 도착 권장', hm(arrive)],
    ['혼잡 피해 나서기', `${hm(leave)} 이후`]
  ].map(([a,b]) => `<div><small>${a}</small><strong>${b}</strong></div>`).join('')
  : `<div style="grid-column:1/-1"><small>선택한 공연장</small><strong>${esc(v.name)}</strong></div>`;

  // 카드
  let h = '';
  if (st.way === 'subway') {
    h += `<section class="card"><h3>지하철: 엘리베이터 있는 출구로 나오세요</h3>`;
    const seen = new Set();
    cands.filter(c => !seen.has(c.s.id) && seen.add(c.s.id)).slice(0, 3).forEach((c, i) => {
      const s = c.s;
      h += `<div class="st"><p style="margin:0"><span class="line" style="background:${s.color}">${s.line}</span><b>${s.name}</b> ${i===0?'· 가장 가까워요':''}</p>
      <p style="margin:6px 0"><span class="exit">${c.e.no}</span>번 출구 → ${esc(v.name)} 약 <b>${walk(c.m)}분</b> <span class="meta">(${mode.label} 기준, 직선 ${Math.round(c.m)}m)</span></p>
      ${s.warn ? `<p class="warn">${esc(s.warn)}</p>` : ''}
      <ul><li>${esc(s.ground)}</li><li>${esc(s.platform)}</li>
      <li>장애인화장실: ${esc(s.toilet)}</li>
      ${st.mode === 'stroller' ? `<li>수유실: ${esc(s.nursing)}</li>` : ''}${st.mode === 'wheel' ? `<li>전동휠체어 급속충전기: ${esc(s.charger)}</li>` : ''}</ul></div>`;
    });
    h += `<div id="evLive"></div></section>`;
  } else {
    const ps = D.pstats.full_days_by_lot, lot = v.parking || 'P5';
    const lots = lot.match(/P\d+[AB]?/g) || [];
    h += `<section class="card"><h3>자동차: ${esc(lot)} 주차장이 가장 가까워요</h3>
      <ul>${v.pcap ? `<li>${esc(lot)} · ${v.pcap}대, 공연장까지 걸어서 ${esc(v.pwalk)}분 (공원 공식 안내)</li>` : '<li>이 공연장은 공원 공식 주차 안내에 전용 주차장이 없어요. 가까운 공연장의 주차장을 이용하세요.</li>'}
      ${lots.map(l => ps[l] ? `<li>${l}는 혼잡도 기록 92일 중 <b>${ps[l]}일</b> 만차였어요.</li>` : '').join('')}
      <li>주말 만차 기록의 62%가 <b>오후 1~3시</b>에 몰려 있어요. 저녁 공연도 낮부터 차기 시작해요.</li>
      <li>장애인·국가유공자 차량 주차요금 50% 할인. 대형 공연 날엔 사전정산·할인 없음.</li>
      <li>만남의광장 휠체어 진입로: 동2문 입차 → 그래피티의 벽 주차장 → 올림픽공원역 쪽 경사로</li></ul>
      <div id="parkLive"></div></section>`;
  }
  // 휠체어 대여
  if (st.mode !== 'stroller') {
    let w = '';
    if (end && end.getHours() * 60 + end.getMinutes() > 19 * 60) w = `공연이 ${hm(end)}쯤 끝나는데 안내센터는 19:00에 문을 닫아요. 대여 휠체어는 공연 전에 반납해야 하니, 공연장 안에서 쓸 휠체어는 미리 챙기세요.`;
    else if (start && end && (end - arrive) / 60000 > 180) w = `도착부터 공연 종료까지 3시간이 넘어요. 무료 대여는 3시간까지예요.`;
    h += `<section class="card"><h3>공원 안내센터 휠체어 무료 대여</h3>
      <p style="margin:0">가장 가까운 곳: <b>${esc(center.name)}</b> (공연장에서 약 ${walk(center.m)}분)</p>
      <ul><li>운영 ${esc(center.hours)} · 휠체어 3대씩 (평화의광장·만남의광장)</li><li>신분증을 맡기고 3시간 무료</li><li>문의 ${esc(center.tel)}</li></ul>
      ${w ? `<p class="warn">${w}</p>` : ''}</section>`;
  } else {
    h += `<section class="card"><h3>유아차와 함께라면</h3><ul><li>평화의광장 안내센터에 수유실과 전자레인지가 있어요 (09:00~19:00)</li><li>지하철역 수유실은 개찰구 안 고객안전실에 있어요. 지하철 카드에서 확인하세요.</li><li>공원 화장실 위치는 지도에 표시했어요. 기저귀교환대 여부는 공개 데이터에 없어요.</li></ul></section>`;
  }
  // 공연 후 혼잡
  const ex = D.exit, ev = ex.event_days['2024-07-20'], wk = ex.weekday_avg, mx = Math.max(...ev);
  const rows = ex.labels.map((l, i) => i >= 26 && i <= 38 ? `<span>${l}</span><div><div class="b ${ev[i] > wk[i]*1.5 ? 'hot' : ''}" style="width:${ev[i]/mx*100}%"></div><div class="w" style="width:${wk[i]/mx*100}%"></div></div><span class="n">${ev[i]}</span>` : '').join('');
  h += `<section class="card"><h3>공연이 끝나면 40~50분은 붐벼요</h3>
    <p style="margin:0">2024년 7월 공원 입출차 21만 건을 10분 단위로 세 보니, 저녁 공연 날에는 공연이 끝난 직후 10분에 평일보다 <b>3~5배</b> 많은 차가 빠져나갔고 이 흐름이 <b>40~50분</b> 이어졌어요.</p>
    <div class="bars" role="img" aria-label="2024년 7월 20일 토요일 공연일 10분 단위 출차 대수, 21시 20분에 268대로 최대">${rows}</div>
    <p class="meta">파란 막대: 2024-07-20(토) 출차 대수 · 주황: 평일 평균의 1.5배 이상 · 회색 선: 평일 평균</p>
    <p>${end ? `<b>${hm(leave)} 이후</b>에 나서면` : '공연 종료 후 50분쯤 지나 나서면'} 엘리베이터와 출구 앞 줄이 짧아져요. 기다리는 동안 공연장 근처 화장실을 먼저 들르세요.</p></section>`;
  $('#cards').innerHTML = h;
  live();
}

// ---------- 실시간 (Worker 연결 시) ----------
async function live() {
  const box = $('#parkLive');
  if (box) {
    const snap = D.liveSnapshot;
    const show = (p, c, at) => { box.innerHTML = `<div class="live"><strong>${p.toLocaleString()}대</strong><span class="meta">/ ${c.toLocaleString()}대 (${esc(snap.label)}) · ${esc(at)}</span></div><div class="meter"><i style="width:${Math.min(100, p/c*100)}%"></i></div>`; };
    show(snap.parked, snap.cap, snap.at + ' 기준');
    // 한국체육산업개발 실시간 주차현황 API (공개 키, CORS 허용)
    try { const j = await fetch(C.PARKING_API).then(r => r.json()); const p = +j[0].parking_sum; if (p >= 0) show(p, snap.cap, '지금 실시간'); } catch(e) {}
  }
  const evb = $('#evLive');
  if (!evb) return;
  const drawEv = (items, at) => {
    const stopped = items.filter(x => x.status !== 'M');
    evb.innerHTML = `<div class="${stopped.length ? 'warn' : 'meta'}" style="margin-top:12px">${stopped.length
      ? `<b>지금 멈춘 엘리베이터</b> (${esc(at)})<br>` + stopped.map(x => `${esc(x.line)} ${esc(x.station)}역 ${esc(x.loc)} (${esc(x.floors)})`).join('<br>') + '<br>다른 방면 승강장 엘리베이터나 역무원(교통약자 도우미)을 이용하세요.'
      : `주변 5·8호선 엘리베이터 모두 운행 중 (${esc(at)})`}</div><p class="meta">9호선 올림픽공원·한성백제역은 실시간 가동 정보가 공개되지 않아요.</p>`;
  };
  drawEv(D.elev.items, D.elev.at + ' 기준');
  if (C.LIVE_API) try { const j = await fetch(C.LIVE_API + '/elevators').then(r => r.json()); drawEv(j.items, '지금 실시간'); } catch(e) {}
}

// ---------- 컨트롤 ----------
const drawShows = () => { $('#shows').innerHTML = shows.map((s, i) => `<button class="show${i > 3 ? ' more' : ''}" data-i="${i}" aria-pressed="false"><b>${esc(s.title)}</b><span>${fmtDate(s.at)} ${hm(s.at)} · ${esc(D.venues.find(v => v.id === s.venue).name)}</span></button>`).join('') + (shows.length > 4 ? `<button class="chip" id="moreBtn" aria-expanded="false">공연 더 보기 (${shows.length - 4})</button>` : '') || '<p class="meta">예정된 공연 정보가 없어요.</p>';
  $('#evSrc').textContent = eventsSource === 'live' ? '공연 일정: 올림픽공원 공식 일정안내에서 방금 불러왔어요.' : `공연 일정: ${D.asof} 저장본`; };
drawShows();
$('#venueSel').innerHTML = D.venues.map(v => `<option value="${v.id}">${esc(v.name)}</option>`).join('');
$('#modes').innerHTML = MODES.map(m => `<button class="chip" data-id="${m.id}">${m.label}</button>`).join('');
$('#ways').innerHTML = WAYS.map(m => `<button class="chip" data-id="${m.id}">${m.label}</button>`).join('');
$('#legend').innerHTML = [['toilet','화장실'],['center','안내센터(휠체어 대여)'],['store','편의점·매점']].map(([k,l]) => `<label><input type="checkbox" data-k="${k}" ${st.layers[k]?'checked':''}>${l}</label>`).join('') + '<span class="meta" style="display:flex;align-items:center;gap:6px"><span class="exit" style="height:1.6em;min-width:1.6em">4</span>엘리베이터 출구</span>';
$('#shows').addEventListener('click', e => { if (e.target.id === 'moreBtn') { const open = $('#shows').classList.toggle('open'); e.target.setAttribute('aria-expanded', open); e.target.textContent = open ? '접기' : `공연 더 보기 (${shows.length - 4})`; return; } const b = e.target.closest('.show'); if (!b) return; st.show = shows[+b.dataset.i]; st.venue = st.show.venue; render(); });
$('#venueSel').addEventListener('change', e => { st.venue = e.target.value; if (st.show && st.show.venue !== st.venue) st.show = null; render(); });
$('#modes').addEventListener('click', e => { const b = e.target.closest('.chip'); if (b) { st.mode = b.dataset.id; save(); render(); } });
$('#ways').addEventListener('click', e => { const b = e.target.closest('.chip'); if (b) { st.way = b.dataset.id; save(); render(); } });
$('#legend').addEventListener('change', e => { st.layers[e.target.dataset.k] = e.target.checked; render(); });
$('#bigBtn').addEventListener('click', e => { const on = document.body.classList.toggle('big'); e.target.setAttribute('aria-pressed', on); save(); });
$('#bigBtn').setAttribute('aria-pressed', document.body.classList.contains('big'));

$('#sources').innerHTML = `<ul>
<li><b>한국체육산업개발</b>: 올림픽공원 공연정보(공연 일정), 실시간 주차현황, 주차장 혼잡도 정보(2025.2~2026.8, 699건), 올림픽공원 입출차 정보(2024.7, 215,528건), 차량입출차·공연·날씨 연계 데이터</li>
<li><b>서울교통공사</b>: 엘리베이터 설치현황(2026-09-01), 9호선 2·3단계 엘리베이터 설치현황(2026-01-31), 역사 장애인화장실정보, 수유실현황, 전동휠체어 급속충전기 운영 정보, 교통약자 이용시설 승강기 가동현황</li>
<li><b>국민체육진흥공단</b>: 올림픽공원 편의시설 정보(화장실·매점 위치, 2021)</li>
<li>올림픽공원 홈페이지: 공연장별 주차장, 안내센터 휠체어 대여, 휠체어 진입로 안내 · 지도 윤곽과 출구 좌표: OpenStreetMap</li></ul>
<p><b>한계</b>: 공원 안의 경사로·턱·장애인 화장실 위치는 공개 데이터가 없어 걷는 시간을 직선거리로 추정했어요. 공연 종료 시각은 공연장 안내 소요시간 또는 150분 기준 추정이에요. 이 서비스는 이런 데이터의 추가 개방을 제안합니다.</p>`;
render();
if (window.loadLiveEvents) loadLiveEvents(D.venues).then(ev => { if (ev.length) { eventsSource = 'live'; setShows(ev); drawShows(); render(); } }).catch(() => {});
}
