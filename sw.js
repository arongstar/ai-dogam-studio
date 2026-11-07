/* AI 도감 스튜디오 — 오프라인 지원 서비스 워커
   - 앱 파일: 인터넷이 되면 최신 파일을 받고, 안 되면 저장해 둔 파일을 씁니다.
   - AI 라이브러리·모델·글꼴: 한 번 받으면 저장해 두고 계속 씁니다. */
const VERSION = 'ai-dogam-v2.0.1';
const MODEL_CACHE = 'ai-dogam-model';
const SHELL = ['./', './index.html', './app.js', './styles.css', './manifest.webmanifest', './icon.svg', './icon-192.png', './icon-512.png'];
const LIBS = [
  'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.22.0/dist/tf.min.js',
  'https://cdn.jsdelivr.net/npm/@tensorflow-models/mobilenet@2.1.1/dist/mobilenet.min.js',
  'https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.min.js',
];
const LONG_LIVED = ['cdn.jsdelivr.net', 'tfhub.dev', 'www.kaggle.com', 'kaggle.com', 'storage.googleapis.com', 'fonts.googleapis.com', 'fonts.gstatic.com'];

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const shell = await caches.open(VERSION);
    await shell.addAll(SHELL);
    const libs = await caches.open(MODEL_CACHE);
    await Promise.all(LIBS.map(async u => {
      if (await libs.match(u)) return;
      try { const r = await fetch(u, { mode: 'cors' }); if (r.ok) await libs.put(u, r); } catch { /* 나중에 다시 받음 */ }
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k !== VERSION && k !== MODEL_CACHE) await caches.delete(k);
    // 예전 판에서 저장된 '내용을 확인할 수 없는(opaque)' 응답은 버립니다
    const model = await caches.open(MODEL_CACHE);
    for (const req of await model.keys()) {
      const r = await model.match(req);
      if (!r || r.type === 'opaque' || !r.ok) await model.delete(req);
    }
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // 앱 파일: 네트워크 먼저, 안 되면 저장본
  if (url.origin === self.location.origin) {
    e.respondWith((async () => {
      try {
        const r = await fetch(req);
        if (r.ok) (await caches.open(VERSION)).put(req, r.clone());
        return r;
      } catch {
        const hit = await caches.match(req, { ignoreSearch: true });
        return hit || (await caches.match('./index.html')) || Response.error();
      }
    })());
    return;
  }

  // AI 라이브러리·모델·글꼴: 저장본 먼저
  if (LONG_LIVED.includes(url.hostname)) {
    e.respondWith((async () => {
      const cache = await caches.open(MODEL_CACHE);
      const hit = await cache.match(req);
      if (hit && hit.type !== 'opaque') return hit;
      const r = await fetch(req);
      if (r.ok) cache.put(req, r.clone()).catch(() => {}); // 오류·로그인 페이지는 저장하지 않음
      return r;
    })());
  }
});
