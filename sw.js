// まとめ検品君 サービスワーカー（更新したら VERSION の数字を上げる）
const VERSION = "v14";
const CACHE = "matome-kenpin-" + VERSION;
const FILES = ["./", "index.html", "manifest.json", "JsBarcode.all.min.js", "pdf.min.js", "pdf.worker.min.js", "products.json", "icon-192.png", "icon-512.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
// ネットにつながっていれば最新を取り、つながらなければ保存してある物を使う
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    fetch(e.request).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy));
      return res;
    }).catch(() => caches.match(e.request, {ignoreSearch: true}))
  );
});
