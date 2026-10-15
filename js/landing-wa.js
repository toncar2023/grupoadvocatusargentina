(function () {
  var n = "5492216381900";
  document.querySelectorAll(".cta-wa").forEach(function (el) {
    var msg = el.getAttribute("data-wa") || "Hola, quiero hacer una consulta con Grupo Advocatus Argentina.";
    el.href = "https://wa.me/" + n + "?text=" + encodeURIComponent(msg);
  });
})();
