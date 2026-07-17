// Stat count-up on scroll. The fade-in reveal effect ([data-in]) moved to
// pure CSS (scroll-driven animations) — this is the one effect that still
// needs JS, since animating a number's text content isn't reliably doable
// in CSS yet.
(function () {
  const countObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.querySelectorAll("[data-count]").forEach((el) => {
          const target = parseFloat(el.dataset.count || "0");
          const pre = el.dataset.pre || "";
          const suf = el.dataset.suf || "";
          const decimals = (el.dataset.count || "").includes(".") ? 1 : 0;
          const dur = 1400;
          const t0 = performance.now();
          function tick(now) {
            const p = Math.min((now - t0) / dur, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            el.textContent = pre + (eased * target).toFixed(decimals) + suf;
            if (p < 1) requestAnimationFrame(tick);
          }
          requestAnimationFrame(tick);
        });
        countObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.5 }
  );
  document.querySelectorAll("[data-count-group]").forEach((el) => countObserver.observe(el));
})();
