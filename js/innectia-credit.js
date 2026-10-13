(function () {
  var word = 'INNECTIA';
  var greenLen = 6;
  var root = document.documentElement;
  var bar = document.querySelector('.site-footer-fixed');

  function isTransparent(c) {
    return !c || c === 'transparent' || c === 'rgba(0, 0, 0, 0)' || c === 'rgba(0,0,0,0)';
  }
  function solidBg(el) {
    if (!el) return '';
    var c = window.getComputedStyle(el).backgroundColor;
    return isTransparent(c) ? '' : c;
  }
  function syncChrome() {
    if (!bar) return;
    var nav = document.querySelector('header, .hd, .site-header, .mini-header, nav');
    var bg = solidBg(nav) || solidBg(document.body) || solidBg(root) || '#0A0F1C';
    root.style.setProperty('--innectia-credit-bg', bg);
    bar.style.backgroundColor = bg;
    var h = Math.ceil(bar.getBoundingClientRect().height);
    if (h < 28) h = 36;
    root.style.setProperty('--innectia-credit-h', h + 'px');
  }
  syncChrome();
  window.addEventListener('resize', syncChrome);

  var nodes = document.querySelectorAll('.innectia-type');
  var marks = document.querySelectorAll('.innectia-mark');
  if (!nodes.length) return;
  function paint(n) {
    var html = '';
    for (var i = 0; i < n; i++) {
      html += '<span class="' + (i < greenLen ? 'innect-g' : 'innect-w') + '">' + word.charAt(i) + '</span>';
    }
    for (var k = 0; k < nodes.length; k++) nodes[k].innerHTML = html;
  }
  function idle(on) {
    for (var k = 0; k < marks.length; k++) {
      marks[k].classList.toggle('is-idle', on);
    }
  }
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    paint(word.length);
    idle(true);
    syncChrome();
    return;
  }
  var n = 0;
  var writing = true;
  function tick() {
    paint(n);
    idle(writing && n === word.length);
    if (writing) {
      if (n < word.length) {
        n++;
        setTimeout(tick, 160);
      } else {
        idle(true);
        writing = false;
        setTimeout(tick, 4200);
      }
    } else {
      idle(false);
      if (n > 0) {
        n--;
        setTimeout(tick, 95);
      } else {
        writing = true;
        setTimeout(tick, 900);
      }
    }
  }
  tick();
})();
