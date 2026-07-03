// Efeito de revelação: a imagem fica em tamanho real, mas recortada
// (clip-path) numa janela pequena; o scroll "preso" (position: sticky)
// expande o recorte até a imagem inteira aparecer.
(function () {
  var section = document.querySelector(".reveal");
  var img = document.querySelector(".reveal-img");
  if (!section || !img) return;

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  var INSET_V = 41; // % recortado em cima/embaixo no início
  var INSET_H = 44; // % recortado nas laterais no início
  var RADIUS = 28;  // raio inicial dos cantos, em px
  var ticking = false;

  function update() {
    ticking = false;
    if (reduced.matches) {
      img.style.clipPath = "none";
      return;
    }
    var rect = section.getBoundingClientRect();
    var travel = rect.height - window.innerHeight;
    var progress = Math.min(Math.max(-rect.top / travel, 0), 1);
    // easing suave para a expansão não terminar de forma brusca
    var eased = 1 - Math.pow(1 - progress, 2);
    var remaining = 1 - eased;
    img.style.clipPath =
      "inset(" + INSET_V * remaining + "% " + INSET_H * remaining + "% round " + RADIUS * remaining + "px)";
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
