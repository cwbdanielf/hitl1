// Efeito de revelação: a imagem começa pequena e o scroll "preso"
// (via position: sticky) faz o zoom até ela ocupar a tela inteira.
(function () {
  var section = document.querySelector(".reveal");
  var img = document.querySelector(".reveal-img");
  if (!section || !img) return;

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  var MIN_SCALE = 0.12;
  var ticking = false;

  function update() {
    ticking = false;
    if (reduced.matches) {
      img.style.transform = "";
      img.style.borderRadius = "";
      return;
    }
    var rect = section.getBoundingClientRect();
    var travel = rect.height - window.innerHeight;
    var progress = Math.min(Math.max(-rect.top / travel, 0), 1);
    // easing suave para o zoom não terminar de forma brusca
    var eased = 1 - Math.pow(1 - progress, 2);
    var scale = MIN_SCALE + (1 - MIN_SCALE) * eased;
    img.style.transform = "scale(" + scale + ")";
    img.style.borderRadius = 24 * (1 - eased) + "px";
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  reduced.addEventListener("change", onScroll);
  update();
})();
