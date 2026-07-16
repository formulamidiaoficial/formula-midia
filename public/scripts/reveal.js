// Shared, site-wide "reveal on scroll" + stat count-up.
// Loaded once via BaseLayout — intentionally not a React island: this is a
// few hundred bytes of vanilla JS, far cheaper than shipping a framework
// runtime for a fade-in effect.
(function () {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (!entry.isIntersecting) return;
        setTimeout(() => entry.target.classList.add("in"), i * 60);
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
  );
  document.querySelectorAll("[data-in]").forEach((el) => revealObserver.observe(el));

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
