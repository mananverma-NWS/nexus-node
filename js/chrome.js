/* force a real reload if the browser restores this page from bfcache
   (e.g. hitting back/forward) so every visit boots fresh — no stale
   terminal history, no skipped boot animation, no frozen network graph */
window.addEventListener("pageshow", (event) => {
  if (event.persisted) {
    window.location.reload();
  }
});

/* status bar: live uptime clock + drifting fake telemetry */
(function () {
  const bootTime = Date.now() - Math.floor(Math.random() * 90000);

  function pad(n) { return String(n).padStart(2, "0"); }

  function tick() {
    const el = document.getElementById("sb-uptime");
    const nodesEl = document.getElementById("sb-nodes");
    const sigEl = document.getElementById("sb-signal");
    if (!el) return;

    const diff = Date.now() - bootTime;
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    el.textContent = `${pad(h)}:${pad(m)}:${pad(s)}`;

    if (nodesEl) {
      const base = 4128;
      const wobble = Math.floor(Math.sin(Date.now() / 4000) * 6);
      nodesEl.textContent = (base + wobble).toLocaleString();
    }
    if (sigEl) {
      const wobble = 92 + Math.floor(Math.sin(Date.now() / 1800) * 6);
      sigEl.textContent = wobble + "%";
    }
  }
  tick();
  setInterval(tick, 1000);
})();
