// 편한길 올팍 서비스 워커: 앱 화면과 지도·안내 데이터를 저장해 두고, 통신이 약해도 열리게 해요.
// 실시간 정보(주차·엘리베이터·공연 일정)는 저장하지 않고 늘 새로 받아요.
const VERSION = '20261123n';
const CACHE = 'olpark-' + VERSION;
const SHELL = ['./', 'index.html', 'manifest.webmanifest', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/apple-touch-icon.png',
  ...['data.js', 'config.js', 'events.js', 'app.js'].map(f => f + '?v=' + VERSION)];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('olpark-') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== 'GET') return;
  // 화면(HTML): 먼저 새로 받고, 안 되면 저장본
  if (r.mode === 'navigate') {
    e.respondWith(fetch(r).then(res => { const c = res.clone(); caches.open(CACHE).then(x => x.put('index.html', c)); return res; })
      .catch(() => caches.match('index.html', {ignoreSearch: true})));
    return;
  }
  // 같은 사이트의 파일: 저장본 먼저, 뒤에서 새로 받아 두기
  if (u.origin === location.origin) {
    e.respondWith(caches.open(CACHE).then(async c => {
      const hit = await c.match(r);
      const net = fetch(r).then(res => { if (res.ok) c.put(r, res.clone()); return res; }).catch(() => hit);
      return hit || net;
    }));
    return;
  }
  // 글꼴: 한 번 받으면 저장
  if (/fonts\.(googleapis|gstatic)\.com$/.test(u.hostname)) {
    e.respondWith(caches.open(CACHE).then(async c => (await c.match(r)) || fetch(r).then(res => { c.put(r, res.clone()); return res; })));
  }
  // 그 밖(실시간 API)은 그대로 네트워크
});
