// 올림픽공원 공식 일정안내 페이지에서 공연 회차를 읽어 옵니다 (한국체육산업개발, CORS 허용).
// 실패하면 data.js 의 스냅샷을 그대로 씁니다.
window.loadLiveEvents = async function (venues) {
  const BASE = 'https://www.ksponco.or.kr';
  const html = await fetch(BASE + '/olympicpark/eventInfo/eventInfoList?mid=a20301010100').then(r => r.text());
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const items = [...doc.querySelectorAll('a.item')].map(a => ({
    place: a.querySelector('.place')?.textContent.trim() || '',
    title: a.querySelector('.title')?.textContent.trim() || '',
    date: a.querySelector('.date')?.textContent.trim() || '',
    time: a.querySelector('.time')?.textContent.trim() || '',
    href: BASE + (a.getAttribute('href') || '')
  })).filter(x => x.title && /\d{4}-\d{2}-\d{2}/.test(x.date));

  // 공식 주차 예상 이용률 페이지의 '소요시간' (주말 공연만 제공)
  const durs = {};
  try {
    const p = new DOMParser().parseFromString(await fetch(BASE + '/online/main/parking.do').then(r => r.text()), 'text/html');
    p.querySelectorAll('tr').forEach(tr => { const td = [...tr.querySelectorAll('td')].map(t => t.textContent.trim()); if (td.length >= 4 && /^\d+$/.test(td[3])) durs[td[0]] = +td[3]; });
  } catch (e) {}

  const venueOf = place => (venues.find(v => v.alias.some(a => place.replace(/\s/g, '').includes(a.replace(/\s/g, '')))) || {}).id;
  const DOW = '일월화수목금토';
  const hhmm = s => { // "오후 7시", "7PM", "19:30", "19시 30분", "오후 7시 28분"
    let m = s.match(/(\d{1,2}):(\d{2})/); if (m) return [+m[1], +m[2]];
    m = s.match(/(오전|오후)?\s*(\d{1,2})\s*시\s*(?:(\d{1,2})\s*분)?/); if (m) { let h = +m[2]; if (m[1] === '오후' && h < 12) h += 12; return [h, +(m[3] || 0)]; }
    m = s.match(/(\d{1,2})\s*(?::(\d{2}))?\s*PM/i); if (m) return [+m[1] % 12 + 12, +(m[2] || 0)];
    return null;
  };
  const shows = [];
  for (const it of items) {
    const [a, b] = it.date.match(/\d{4}-\d{2}-\d{2}/g); const end = new Date((b || a) + 'T00:00');
    const days = []; for (let d = new Date(a + 'T00:00'); d <= end && days.length < 60; d.setDate(d.getDate() + 1)) days.push(new Date(d));
    const out = [];
    for (const d of days) {
      const dw = DOW[d.getDay()];
      let t = null;
      // 1) 날짜가 적힌 구간: "11월 27일(금) 오후 7시", "11.21.(SAT) 6PM"
      const re = new RegExp(`(?<!\\d)(?:${d.getMonth() + 1}월\\s*${d.getDate()}일|(?<!\\d)${d.getMonth() + 1}\\.\\s*${d.getDate()}\\.?)([^/]{0,24})`);
      const m1 = it.time.match(re); if (m1) t = hhmm(m1[1]);
      // 2) 요일 구간: "토 오후 6시 / 일 오후 5시", "수목금 19시 30분"
      if (!t) for (const seg of it.time.split(/[\/,]/)) { const m2 = seg.match(/^\s*([일월화수목금토]+)\s*(.*)$/); if (m2 && m2[1].includes(dw)) { t = hhmm(m2[2]); if (t) break; } }
      // 3) 시간이 하나뿐이면 모든 날짜에 적용 (짧은 공연만)
      if (!t && days.length <= 7 && !/[일월화수목금토]\s*(오후|오전|\d)/.test(it.time)) { const all = it.time.match(/(\d{1,2}:\d{2}|(오전|오후)\s*\d{1,2}\s*시|\d{1,2}\s*PM)/gi); if (all && all.length === 1) t = hhmm(all[0]); }
      if (t) out.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}T${String(t[0]).padStart(2, '0')}:${String(t[1]).padStart(2, '0')}`);
    }
    const venue = venueOf(it.place);
    if (venue && out.length) shows.push({title: it.title, venue, shows: out, dur: durs[it.title] || 0, durOfficial: !!durs[it.title], link: it.href});
  }
  return shows;
};
