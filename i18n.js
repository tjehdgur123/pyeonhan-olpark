// 편한길 올팍 - 다국어 (한국어 · English · 日本語 · 中文)
// 화면을 한국어로 그린 뒤, 글자 마디를 '문장 틀' 사전으로 바꿉니다.
//  1) 고유명사(공연장·역·노선·출입문·장소)는 {p}, 시각은 {t}, 숫자는 {n} 자리로 바꿔 틀을 찾고
//  2) 사전(I18N_DICT[lang])의 틀에 번역한 이름·시각·숫자를 다시 끼웁니다.
//  틀을 못 찾으면 문장 단위로 나눠 다시 찾고, 그래도 없으면 이름만 바꿉니다.
(function () {
  const LANGS = [['ko', '한국어'], ['en', 'English'], ['ja', '日本語'], ['zh', '中文']];
  const HTML_LANG = {ko: 'ko', en: 'en', ja: 'ja', zh: 'zh-Hans'};
  const SPEECH_LANG = {ko: 'ko-KR', en: 'en-US', ja: 'ja-JP', zh: 'zh-CN'};
  let lang = 'ko';
  try { lang = localStorage.getItem('pyeonhanLang') || 'ko'; } catch (e) {}
  if (!LANGS.some(l => l[0] === lang)) lang = 'ko';
  try { const q = new URLSearchParams(location.search).get('lang'); if (q && LANGS.some(l => l[0] === q)) lang = q; } catch (e) {}

  // ---------- 한글 로마자 표기(국어의 로마자 표기법, 주요 소리 규칙만) ----------
  const CHO = ['g','kk','n','d','tt','r','m','b','pp','s','ss','','j','jj','ch','k','t','p','h'];
  const JUNG = ['a','ae','ya','yae','eo','e','yeo','ye','o','wa','wae','oe','yo','u','wo','we','wi','yu','eu','ui','i'];
  const JONG = ['','k','k','k','n','n','n','t','l','k','m','l','l','l','p','l','m','p','p','t','t','ng','t','t','k','t','p','t'];
  // 받침 → 소리 대표(0 없음, 1 ㄱ, 2 ㄴ, 3 ㄷ, 4 ㄹ, 5 ㅁ, 6 ㅂ, 7 ㅇ)
  const JCLS = [0,1,1,1,2,2,2,3,4,1,5,4,4,4,6,4,5,6,6,3,3,7,3,3,1,3,6,3];
  function romanize(word) {
    const sy = [];
    for (const ch of word) {
      const c = ch.charCodeAt(0);
      if (c >= 0xAC00 && c <= 0xD7A3) { const i = c - 0xAC00; sy.push({c:Math.floor(i / 588), v:Math.floor(i % 588 / 28), j:i % 28}); }
      else sy.push({raw:ch});
    }
    let out = '';
    for (let k = 0; k < sy.length; k++) {
      const s = sy[k];
      if (s.raw !== undefined) { out += s.raw; continue; }
      let init = CHO[s.c];
      const p = sy[k - 1];
      if (p && p.raw === undefined && k > 0) {
        const pc = JCLS[p.j];
        if (s.c === 2 || s.c === 6) { /* ㄴ ㅁ */ }
        if (s.c === 5) { if (pc === 2 || pc === 4) init = 'l'; else if (pc) init = 'n'; } // ㄹ
        if (s.c === 11 && p.j) init = { 1:'g', 2:'n', 3:'d', 4:'r', 5:'m', 6:'b', 7:'' }[pc] ?? '';
      }
      let fin = '';
      if (s.j) {
        const n = sy[k + 1], pc = JCLS[s.j];
        fin = JONG[s.j];
        if (n && n.raw === undefined) {
          if (n.c === 11 && pc !== 7) fin = '';                                  // 연음
          else if (n.c === 2 || n.c === 6 || (n.c === 5 && pc !== 2 && pc !== 4)) // 비음화
            fin = pc === 1 ? 'ng' : pc === 6 ? 'm' : pc === 3 ? 'n' : fin;
          else if (n.c === 5 && pc === 2) fin = 'l';                             // ㄴ+ㄹ
        }
      }
      out += init + JUNG[s.v] + fin;
    }
    return out;
  }
  const cap = s => s.replace(/(^|[\s-])([a-z])/g, (m, a, b) => a + b.toUpperCase());
  const roma = n => cap(romanize(n));

  // ---------- 고유명사 ----------
  // [한국어, English, 日本語, 中文]
  const NAMES = [
    ['KSPO DOME', 'KSPO DOME', 'KSPO DOME', 'KSPO DOME'],
    ['KSPO DOME(올림픽 체조경기장)', 'KSPO DOME (Olympic Gymnastics Arena)', 'KSPO DOME（オリンピック体操競技場）', 'KSPO DOME（奥林匹克体操竞技场）'],
    ['티켓링크 라이브 아레나', 'Ticketlink Live Arena', 'チケットリンク・ライブアリーナ', 'Ticketlink Live Arena'],
    ['SK핸드볼경기장(올림픽펜싱경기장)', 'SK Handball Stadium', 'SKハンドボール競技場', 'SK手球竞技场'],
    ['핸드볼경기장', 'Handball Stadium', 'ハンドボール競技場', '手球竞技场'],
    ['우리금융아트홀', 'Woori Financial Art Hall', 'ウリ金融アートホール', '友利金融艺术厅'],
    ['올림픽홀 지하주차장', 'Olympic Hall underground parking', 'オリンピックホール地下駐車場', '奥林匹克大厅地下停车场'],
    ['올림픽홀', 'Olympic Hall', 'オリンピックホール', '奥林匹克大厅'],
    ['K-아트홀', 'K-Art Hall', 'Kアートホール', 'K艺术厅'],
    ['88잔디마당', '88 Lawn', '88芝生広場', '88草坪广场'],
    ['88호수 수변무대', '88 Lake Stage', '88湖水辺ステージ', '88湖畔舞台'],
    ['88호수수변무대', '88 Lake Stage', '88湖水辺ステージ', '88湖畔舞台'],
    ['88호수', '88 Lake', '88湖', '88湖'],
    ['88마당', '88 Plaza', '88広場', '88广场'],
    ['올림픽수영경기장', 'Olympic Swimming Pool', 'オリンピック水泳競技場', '奥林匹克游泳馆'],
    ['수영경기장', 'swimming pool', '水泳競技場', '游泳馆'],
    ['실내테니스장', 'Indoor Tennis Court', '室内テニス場', '室内网球场'],
    ['실내 테니스장', 'Indoor Tennis Court', '室内テニス場', '室内网球场'],
    ['평화의광장 안내센터', 'Peace Plaza Info Center', '平和の広場案内センター', '和平广场服务中心'],
    ['만남의광장 안내센터', 'Meeting Plaza Info Center', '出会いの広場案内センター', '相会广场服务中心'],
    ['평화의 광장', 'Peace Plaza', '平和の広場', '和平广场'],
    ['평화의광장', 'Peace Plaza', '平和の広場', '和平广场'],
    ['만남의광장', 'Meeting Plaza', '出会いの広場', '相会广场'],
    ['세계평화의문', 'World Peace Gate', '世界平和の門', '世界和平之门'],
    ['한성백제박물관', 'Hanseong Baekje Museum', '漢城百済博物館', '汉城百济博物馆'],
    ['백제집자리전시관', 'Baekje House Site Exhibition Hall', '百済住居跡展示館', '百济住址展示馆'],
    ['몽촌역사관', 'Mongchon History Hall', '夢村歴史館', '梦村历史馆'],
    ['몽촌해자', 'Mongchon Moat', '夢村垓子', '梦村护城河'],
    ['가족놀이동산', 'Family Playground', '家族遊び場', '家庭游乐场'],
    ['지구촌공원', 'Global Village Park', '地球村公園', '地球村公园'],
    ['야생화학습장', 'Wildflower Garden', '野生花学習場', '野花学习园'],
    ['배드민턴장', 'Badminton Court', 'バドミントン場', '羽毛球场'],
    ['까치다리', 'Kkachi Bridge', 'カチ橋', '喜鹊桥'],
    ['청룡교', 'Cheongnyong Bridge', '青龍橋', '青龙桥'],
    ['물레방아', 'Water Mill', '水車', '水车'],
    ['백제학연구소', 'Baekje Research Institute', '百済学研究所', '百济学研究所'],
    ['체육진흥공단 본사', 'KSPO headquarters', 'KSPO本社', 'KSPO总部'],
    ['제일제면소', 'Jeil Jemyeonso', '第一製麺所', '第一制面所'],
    ['스포츠360플레이', 'Sports 360 Play', 'スポーツ360プレイ', 'Sports 360 Play'],
    ['올림픽공원', 'Olympic Park', 'オリンピック公園', '奥林匹克公园'],
    ['몽촌토성', 'Mongchontoseong', '夢村土城', '梦村土城'],
    ['한성백제', 'Hanseong Baekje', '漢城百済', '汉城百济'],
    ['둔촌오륜', 'Dunchon-oryun', '遁村五輪', '遁村五轮'],
    ['둔촌동', 'Dunchon-dong', '遁村洞', '遁村洞'],
    ['중앙보훈병원', 'VHS Medical Center', '中央報勲病院', '中央报勋医院'],
    ['수인분당선', 'Suin-Bundang Line', '水仁・盆唐線', '水仁·盆唐线'],
    ['수인분당', 'Suin-Bundang', '水仁・盆唐', '水仁·盆唐'],
    ['경의중앙선', 'Gyeongui-Jungang Line', '京義・中央線', '京义·中央线'],
    ['신분당선', 'Shinbundang Line', '新盆唐線', '新盆唐线'],
    ['공항철도', 'AREX', '空港鉄道', '机场铁路'],
    ['GTX-A', 'GTX-A', 'GTX-A', 'GTX-A'],
    ['서울역', 'Seoul Station', 'ソウル駅', '首尔站'],
    ['김포공항', 'Gimpo Airport', '金浦空港', '金浦机场'],
    ['인천공항', 'Incheon Airport', '仁川空港', '仁川机场'],
    ['서울교통공사', 'Seoul Metro', 'ソウル交通公社', '首尔交通公社'],
    ['코레일', 'Korail', 'KORAIL', 'KORAIL'],
    ['서울동행맵', 'Seoul Companion Map', 'ソウル同行マップ', '首尔同行地图'],
    ['카카오맵', 'KakaoMap', 'カカオマップ', 'Kakao地图'],
    ['네이버 지도', 'Naver Map', 'NAVERマップ', 'Naver地图'],
    ['구글 지도', 'Google Maps', 'Googleマップ', '谷歌地图'],
    ['국토교통부', 'MOLIT', '国土交通部', '国土交通部'],
    ['문화공공데이터광장', 'Culture Public Data Plaza', '文化公共データ広場', '文化公共数据广场'],
    ['국민체육진흥공단', 'KSPO', '国民体育振興公団', '国民体育振兴公团'],
    ['한국체육산업개발', 'Korea Sports Industry Development', '韓国体育産業開発', '韩国体育产业开发'],
    ['북서쪽', 'northwest', '北西', '西北'], ['북동쪽', 'northeast', '北東', '东北'], ['남서쪽', 'southwest', '南西', '西南'], ['남동쪽', 'southeast', '南東', '东南'],
    ['북쪽', 'north', '北', '北'], ['남쪽', 'south', '南', '南'], ['동쪽', 'east', '東', '东'], ['서쪽', 'west', '西', '西']
  ];
  const GATE_DIR = {'동': ['East', '東', '东'], '서': ['West', '西', '西'], '남': ['South', '南', '南'], '북': ['North', '北', '北']};
  const LI = {en: 1, ja: 2, zh: 3};

  let nameList = null, nameRe = null;
  const nameMap = new Map();
  function buildNames() {
    if (nameList) return;
    const D = window.DATA || {};
    for (const r of NAMES) nameMap.set(r[0], r);
    // 역 이름: 지하철 노선 자료의 모든 역 (손으로 정한 이름이 없으면 로마자)
    const st = new Set();
    for (const [, s] of (D.metro && D.metro.lines) || []) for (const x of s) st.add(x);
    const COMMON = new Set(['계산', '중앙', '신설', '장기', '정왕']);  // 보통 낱말과 같은 역 이름은 이름으로 보지 않아요
    for (const x of st) { const b = x.replace(/\(.*\)/, ''); if (COMMON.has(b)) continue; if (!nameMap.has(x)) { const r = nameMap.get(b); nameMap.set(x, r ? [x, r[1], r[2], r[3]] : [x, roma(b), roma(b), roma(b)]); } }
    nameList = [...nameMap.keys()].sort((a, b) => b.length - a.length);
    const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // 역 이름 뒤 '역'은 이름에 붙여 처리
    // 이름 앞은 한글이 아니고, 뒤는 끝·한글 아님·'역'·조사일 때만 이름으로 봐요 (수유실·계산해 같은 낱말 속 역 이름 제외)
    const PART = '(?=$|[^가-힣]|역|에서|에게|에|으로|로|행|은|는|이|가|을|를|까지|부터|과|와|의|쪽|방면|방향|입구|앞|옆|뒤|근처|부근|도착|출발|환승|하차)';
    nameRe = new RegExp('(?<![가-힣])(' + nameList.map(esc).join('|') + ')(역)?' + PART + '|([동서남북])(\\d)문|(\\d{1,2})호선', 'g');
  }
  function nameTr(m, k, yeok, gd, gn, line) {
    const i = LI[lang];
    if (line) return lang === 'en' ? 'Line ' + line : lang === 'ja' ? line + '号線' : line + '号线';
    if (gd) return lang === 'en' ? GATE_DIR[gd][0] + ' Gate ' + gn : GATE_DIR[gd][i - 1] + gn + (lang === 'ja' ? '門' : '门');
    const r = nameMap.get(k), n = r ? r[i] : k;
    if (!yeok) return n;
    return lang === 'en' ? n + ' Stn.' : lang === 'ja' ? n + '駅' : n + '站';
  }

  // ---------- 틀 찾기 ----------
  const HANGUL = /[가-힣]/;
  const cache = new Map();
  function templ(text) {
    buildNames();
    const P = [], N = [], T = [];
    let t = text.replace(nameRe, (...a) => { P.push(nameTr(...a)); return '{p}'; });
    t = t.replace(/\d{1,2}:\d{2}/g, m => { T.push(m); return '{t}'; });
    t = t.replace(/\d+(?:[.,]\d+)*/g, m => { N.push(m); return '{n}'; });
    return {key:t, P, N, T};
  }
  function fill(tpl, x) {
    const c = {p:0, n:0, t:0}, A = {p:x.P, n:x.N, t:x.T};
    return tpl.replace(/\{([pnt])(\d?)\}/g, (m, k, i) => { const v = i ? A[k][+i - 1] : A[k][c[k]++]; return v ?? ''; });
  }
  function trOne(s) {
    const D = window.I18N_DICT && window.I18N_DICT[lang]; if (!D) return null;
    const x = templ(s.trim()); const hit = D[x.key];
    if (hit != null) return fill(hit, x);
    if (!HANGUL.test(x.key)) return fill(x.key, x);
    return null;
  }
  function tr(text) {
    if (lang === 'ko' || !text || !HANGUL.test(text)) return text;
    if (cache.has(text)) return cache.get(text);
    const lead = text.match(/^\s*/)[0], trail = text.match(/\s*$/)[0], core = text.trim();
    let out = trOne(core);
    if (out == null) {
      // 문장 단위로 나눠 다시
      const parts = core.split(/(?<=[.?!。])\s+|\s+·\s+/);
      if (parts.length > 1) {
        const seps = core.match(/(?<=[.?!。])\s+|\s+·\s+/g) || [];
        const tp = parts.map(p => trOne(p));
        if (tp.every(v => v != null)) out = tp.map((v, i) => v + (seps[i] || '')).join('');
        else if (window.I18N_MISS) parts.forEach((p, i) => { if (tp[i] == null) window.I18N_MISS.add(templ(p.trim()).key); });
      }
    }
    if (out == null) {
      const x = templ(core);
      out = HANGUL.test(x.key) ? core.replace(nameRe, (...a) => nameTr(...a)) : fill(x.key, x);
      if (window.I18N_MISS && !/(?<=[.?!。])\s+|\s+·\s+/.test(core)) window.I18N_MISS.add(x.key);
    }
    out = lead + out + trail;
    cache.set(text, out);
    return out;
  }

  // ---------- 화면에 적용 ----------
  const ATTRS = ['aria-label', 'placeholder', 'title', 'alt'];
  const done = new WeakMap();
  function apply(root) {
    if (lang === 'ko' || !root) return;
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let n;
    while ((n = w.nextNode())) {
      const v = n.nodeValue;
      if (!HANGUL.test(v) || done.get(n) === v) continue;
      const p = n.parentElement; if (p && p.closest('script,style,[data-noi18n]')) continue;
      const o = tr(v); done.set(n, o); if (o !== v) n.nodeValue = o;
    }
    const els = root.querySelectorAll ? [root, ...root.querySelectorAll('[aria-label],[placeholder],[title],[alt]')] : [];
    for (const e of els) for (const a of ATTRS) { if (!e.getAttribute) continue; const v = e.getAttribute(a); if (v && HANGUL.test(v)) e.setAttribute(a, tr(v)); }
  }
  let pending = new Set(), sched = false;
  const mo = new MutationObserver(ms => {
    for (const m of ms) pending.add(m.type === 'characterData' ? m.target.parentNode : m.target);
    if (!sched) { sched = true; queueMicrotask(() => { sched = false; const L = [...pending]; pending = new Set(); L.forEach(x => x && apply(x)); }); }
  });
  function start() {
    document.documentElement.lang = HTML_LANG[lang];
    if (lang === 'ko') return;
    document.title = tr(document.title);
    apply(document.body);
    mo.observe(document.body, {subtree:true, childList:true, characterData:true, attributes:true, attributeFilter:ATTRS});
  }
  function setLang(l) {
    try { localStorage.setItem('pyeonhanLang', l); } catch (e) {}
    try { sessionStorage.setItem('pyeonhanTab', (location.hash || '').slice(1)); } catch (e) {}  // 보던 탭 그대로
    // 주소가 그대로면(#만 같으면) replace가 새로 읽지 않으니 reload로 다시 그려요
    const u = new URL(location.href); u.searchParams.delete('lang');
    if (u.href === location.href) location.reload(); else location.replace(u.href);
  }
  // 출발역 입력: 로마자·번역 이름도 한국어 역 이름으로
  function toKo(v) {
    buildNames(); const q = String(v).trim().toLowerCase().replace(/\s*(stn\.?|station|駅|站)$/i, '').replace(/[\s-]/g, '');
    for (const [k, r] of nameMap) if (r.slice(1).some(x => String(x).toLowerCase().replace(/[\s-]/g, '') === q)) return k;
    return v;
  }
  window.I18N = {get lang() { return lang; }, LANGS, tr, apply, setLang, start, toKo, roma, speechLang:() => SPEECH_LANG[lang], nameOf:k => { buildNames(); const r = nameMap.get(k); return lang === 'ko' || !r ? k : r[LI[lang]]; }};
})();
