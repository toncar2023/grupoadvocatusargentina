/**
 * ASESOR VIRTUAL "LEX" — Grupo Advocatus Argentina
 * Widget embebible, autocontenido, en un solo archivo .js
 *
 * CÓMO USARLO
 * Pegar esta línea antes de </body> en cualquier página del sitio:
 *   <script src="asesor-virtual-lex.js" defer></script>
 * No requiere nada más: el widget inyecta su propio CSS y se dibuja solo,
 * sin tocar el resto del sitio ni depender de otras librerías.
 *
 * CÓMO EDITAR EL CONTENIDO
 * Todo lo que un editor no técnico necesita tocar vive en el objeto
 * CONFIG de más abajo: el número de WhatsApp, el nombre del asesor y
 * el árbol de preguntas (TREE). El resto del archivo es motor, no hace
 * falta abrirlo para cambiar textos.
 */
(function () {
  'use strict';

  /* =========================================================
     CONFIG — lo único que un editor de contenido debería tocar
     ========================================================= */
  const CONFIG = {
    whatsappNumber: '5492216381600',
    brandName: 'Grupo Advocatus Argentina',
    advisorName: 'LEX',
    advisorRole: 'Asesor del estudio',
    accentColor: '#C9A876',
    accentBright: '#E9CE9C',
    bgColor: '#17140F',
    panelColor: '#211B13',
    textColor: '#F4EFE4',
    mutedColor: '#C2B9A6',
    whatsappColor: '#25D366',
    inactivityMs: 20000,
    typingDelayMs: [550, 900]
  };

  const TREE = {
    start: {
      bot: 'Buenas. Soy Lex, el asesor del estudio. Antes de nada, contame en qué puedo orientarte hoy.',
      options: [
        { label: 'Un tema de familia o personal', next: 'fam_ctx' },
        { label: 'Tengo una empresa o comercio', next: 'emp_ctx' },
        { label: 'Una situación penal o urgente', next: 'pen_ctx' },
        { label: 'Tuve un accidente de tránsito', next: 'acc_ctx' },
        { label: 'Ya soy cliente del estudio', next: 'cli_ctx' },
        { label: 'Solo quiero información', next: 'info' }
      ]
    },
    info: {
      bot: 'Con gusto. Para darte algo útil y no un folleto genérico, decime cuál de estas opciones se parece más a tu situación.',
      options: [
        { label: 'Un tema de familia o personal', next: 'fam_ctx' },
        { label: 'Tengo una empresa o comercio', next: 'emp_ctx' },
        { label: 'Una situación penal o urgente', next: 'pen_ctx' },
        { label: 'Tuve un accidente de tránsito', next: 'acc_ctx' }
      ]
    },
    fam_ctx: {
      bot: 'Entiendo. Estos temas suelen pesar más de lo que se muestra hacia afuera. ¿De qué se trata puntualmente?',
      field: 'segmento', value: 'Familia y particulares',
      options: [
        { label: 'Divorcio', next: 'fam_dim', field: 'contexto', value: 'Divorcio' },
        { label: 'Alquiler o desalojo', next: 'fam_dim', field: 'contexto', value: 'Alquiler o desalojo' },
        { label: 'Sucesión', next: 'fam_dim', field: 'contexto', value: 'Sucesión' },
        { label: 'Régimen de visitas o tenencia', next: 'fam_dim', field: 'contexto', value: 'Régimen de visitas o tenencia' }
      ]
    },
    fam_dim: {
      bot: 'Gracias por contarme. Eso ya me da una idea clara. ¿Hay acuerdo entre las partes o es un conflicto?',
      options: [
        { label: 'Hay acuerdo entre las partes', next: 'fam_sit', field: 'dimensión', value: 'Hay acuerdo entre las partes' },
        { label: 'No hay acuerdo', next: 'fam_sit', field: 'dimensión', value: 'No hay acuerdo' },
        { label: 'Todavía no lo sé', next: 'fam_sit', field: 'dimensión', value: 'Todavía no está definido' }
      ]
    },
    fam_sit: {
      bot: 'Perfecto. Una última pregunta, para saber con qué ritmo avanzamos: ¿hace cuánto empezó la situación?',
      options: [
        { label: 'Recién empieza', next: 'close', field: 'situación', value: 'Recién empieza' },
        { label: 'Lleva semanas', next: 'close', field: 'situación', value: 'Lleva semanas' },
        { label: 'Es urgente ya', next: 'close', field: 'situación', value: 'Es urgente' }
      ]
    },
    emp_ctx: {
      bot: 'Bien. Cuénteme, ¿qué necesita la empresa en este momento?',
      field: 'segmento', value: 'Empresa y comercio',
      options: [
        { label: 'Constituir o modificar una sociedad', next: 'emp_dim', field: 'contexto', value: 'Constituir o modificar sociedad' },
        { label: 'Cobrar una deuda', next: 'emp_dim', field: 'contexto', value: 'Cobro de deuda' },
        { label: 'Revisar o redactar un contrato', next: 'emp_dim', field: 'contexto', value: 'Revisión o redacción de contrato' },
        { label: 'Consulta por un cliente o consumidor', next: 'emp_dim', field: 'contexto', value: 'Consulta de consumidor' }
      ]
    },
    emp_dim: {
      bot: 'Entendido. ¿Qué tamaño tiene la empresa hoy?',
      options: [
        { label: 'Unipersonal o pyme chica', next: 'emp_sit', field: 'dimensión', value: 'Unipersonal o pyme chica' },
        { label: 'Pyme mediana', next: 'emp_sit', field: 'dimensión', value: 'Pyme mediana' },
        { label: 'Empresa con varias unidades de negocio', next: 'emp_sit', field: 'dimensión', value: 'Varias unidades de negocio' }
      ]
    },
    emp_sit: {
      bot: 'Y algo clave: ¿hay algún plazo corriendo, como un vencimiento, una demanda o una intimación?',
      options: [
        { label: 'Sí, hay un plazo corriendo', next: 'close', field: 'situación', value: 'Hay plazo corriendo' },
        { label: 'No por ahora', next: 'close', field: 'situación', value: 'Sin plazo urgente' },
        { label: 'No lo sé', next: 'close', field: 'situación', value: 'No lo sabe' }
      ]
    },
    pen_ctx: {
      bot: 'Le voy a hacer un par de preguntas cortas, porque en estos casos el tiempo importa. ¿Cuál es la situación?',
      field: 'segmento', value: 'Penal o urgente',
      options: [
        { label: 'Recibí una denuncia o citación', next: 'pen_dim', field: 'contexto', value: 'Denuncia o citación recibida' },
        { label: 'Hubo una detención', next: 'pen_dim', field: 'contexto', value: 'Detención' },
        { label: 'Es un delito informático', next: 'pen_dim', field: 'contexto', value: 'Delito informático' },
        { label: 'Necesito hacer una denuncia', next: 'pen_dim', field: 'contexto', value: 'Quiere hacer una denuncia' }
      ]
    },
    pen_dim: {
      bot: 'Comprendo. ¿En qué etapa está la situación en este momento?',
      options: [
        { label: 'Recién pasó', next: 'pen_sit', field: 'dimensión', value: 'Recién pasó' },
        { label: 'Ya hay una causa abierta', next: 'pen_sit', field: 'dimensión', value: 'Causa abierta' },
        { label: 'Hay una audiencia próxima', next: 'pen_sit', field: 'dimensión', value: 'Audiencia próxima' }
      ]
    },
    pen_sit: {
      bot: 'Última pregunta, y respondemos rápido según lo que me diga: ¿necesita asistencia ahora mismo?',
      options: [
        { label: 'Sí, es urgente', next: 'close', field: 'situación', value: 'Urgente, ahora mismo' },
        { label: 'Puedo esperar unas horas', next: 'close', field: 'situación', value: 'Puede esperar unas horas' },
        { label: 'Es para asesorarme antes de actuar', next: 'close', field: 'situación', value: 'Quiere asesorarse antes de actuar' }
      ]
    },
    acc_ctx: {
      bot: 'Vamos a ordenar los datos para que no tenga que repetirlos después. ¿Qué pasó?',
      field: 'segmento', value: 'Accidente de tránsito',
      options: [
        { label: 'Choque con daños materiales', next: 'acc_dim', field: 'contexto', value: 'Daños materiales' },
        { label: 'Choque con lesiones', next: 'acc_dim', field: 'contexto', value: 'Con lesiones' },
        { label: 'Me hicieron una denuncia por el accidente', next: 'acc_dim', field: 'contexto', value: 'Denunciado por el accidente' }
      ]
    },
    acc_dim: {
      bot: '¿Ya hay intervención policial, de seguros o algún expediente abierto?',
      options: [
        { label: 'Sí, ya hay expediente o siniestro abierto', next: 'acc_sit', field: 'dimensión', value: 'Expediente abierto' },
        { label: 'Todavía no hice nada', next: 'acc_sit', field: 'dimensión', value: 'Sin gestión iniciada' },
        { label: 'No lo sé', next: 'acc_sit', field: 'dimensión', value: 'No lo sabe' }
      ]
    },
    acc_sit: {
      bot: '¿Hace cuánto pasó el accidente?',
      options: [
        { label: 'Hoy o ayer', next: 'close', field: 'situación', value: 'Hoy o ayer' },
        { label: 'Esta semana', next: 'close', field: 'situación', value: 'Esta semana' },
        { label: 'Hace más tiempo', next: 'close', field: 'situación', value: 'Hace más tiempo' }
      ]
    },
    cli_ctx: {
      bot: 'Qué bueno tenerlo de vuelta. ¿En qué puedo ayudarlo hoy?',
      field: 'segmento', value: 'Ya es cliente',
      options: [
        { label: 'Novedades de mi causa', next: 'close', field: 'situación', value: 'Pide novedades de su causa' },
        { label: 'Necesito enviar documentación', next: 'close', field: 'situación', value: 'Va a enviar documentación' },
        { label: 'Quiero coordinar una reunión', next: 'close', field: 'situación', value: 'Quiere coordinar reunión' }
      ]
    }
  };

  const TEASER_MESSAGES = [
    '¿Tenés una situación legal y no sabés por dónde empezar? Contámela.',
    'Elegí tu área y te explico qué necesitamos saber para ayudarte de verdad.',
    'Cada caso empieza igual: una consulta inicial. ¿Charlamos?',
    '¿Tenés alguna duda puntual antes de escribirnos? Preguntame.',
    'Si ya tenés todo claro, te dejo directo el WhatsApp con tu resumen armado.'
  ];

  function waLink(message) {
    return 'https://wa.me/' + CONFIG.whatsappNumber + '?text=' + encodeURIComponent(message);
  }

  /* =========================================================
     ESTILOS — inyectados una sola vez, con prefijo propio (lexw-)
     para no chocar con el CSS del resto del sitio
     ========================================================= */
  const css = `
  .lexw-launcher{position:fixed;bottom:26px;right:26px;z-index:2147483000;width:64px;height:64px;border-radius:50%;
    background:radial-gradient(circle at 35% 30%, ${CONFIG.panelColor}, ${CONFIG.bgColor});border:1px solid ${CONFIG.accentColor};
    display:flex;align-items:center;justify-content:center;box-shadow:0 4px 22px rgba(0,0,0,.5);cursor:pointer;padding:0;}
  .lexw-launcher .lexw-ring{position:absolute;inset:-3px;border-radius:50%;border:1px solid ${CONFIG.accentColor};border-top-color:transparent;animation:lexw-spin 6s linear infinite;}
  @keyframes lexw-spin{to{transform:rotate(360deg);}}
  .lexw-launcher.lexw-attn{animation:lexw-bounce 1s ease-in-out 2;}
  @keyframes lexw-bounce{0%,100%{transform:translateY(0);}30%{transform:translateY(-9px);}50%{transform:translateY(0);}65%{transform:translateY(-4px);}}
  .lexw-badge{position:absolute;top:-3px;right:-3px;width:12px;height:12px;border-radius:50%;background:${CONFIG.whatsappColor};border:2px solid ${CONFIG.bgColor};}

  .lexw-teaser{position:fixed;bottom:100px;right:26px;z-index:2147482999;max-width:250px;background:${CONFIG.panelColor};
    border:1px solid rgba(238,231,216,.24);border-radius:12px 12px 2px 12px;padding:12px 14px;font-size:15px;color:${CONFIG.textColor};
    box-shadow:0 8px 26px rgba(0,0,0,.45);opacity:0;transform:scale(.9) translateY(8px);transition:.3s ease;cursor:pointer;
    font-family:Inter,system-ui,sans-serif;}
  .lexw-teaser.lexw-show{opacity:1;transform:scale(1) translateY(0);}
  .lexw-teaser b{color:${CONFIG.accentBright};display:block;margin-bottom:2px;font-size:13.5px;letter-spacing:.06em;}
  .lexw-teaser-close{position:absolute;top:4px;right:6px;background:none;border:none;color:${CONFIG.mutedColor};font-size:15px;cursor:pointer;padding:2px;}

  .lexw-panel{position:fixed;bottom:26px;right:26px;z-index:2147483001;width:352px;max-height:min(600px,78vh);
    background:${CONFIG.bgColor};border:1px solid rgba(238,231,216,.24);border-radius:16px;display:flex;flex-direction:column;
    box-shadow:0 20px 60px rgba(0,0,0,.6);opacity:0;transform:translateY(20px) scale(.96);pointer-events:none;transition:.28s ease;
    font-family:Inter,system-ui,sans-serif;color:${CONFIG.textColor};}
  .lexw-panel.lexw-open{opacity:1;transform:translateY(0) scale(1);pointer-events:all;}
  .lexw-head{display:flex;align-items:center;gap:10px;padding:14px 16px;border-bottom:1px solid rgba(238,231,216,.10);
    background:${CONFIG.panelColor};border-radius:16px 16px 0 0;}
  .lexw-head .lexw-av{width:36px;height:36px;border-radius:50%;background:${CONFIG.bgColor};border:1px solid ${CONFIG.accentColor};
    display:flex;align-items:center;justify-content:center;flex-shrink:0;}
  .lexw-head-text{display:flex;flex-direction:column;overflow:hidden;}
  .lexw-head-text b{font-size:15.5px;color:${CONFIG.accentBright};}
  .lexw-head-text span{font-size:13.5px;color:${CONFIG.mutedColor};font-family:'JetBrains Mono',monospace;}
  .lexw-head-btns{margin-left:auto;display:flex;gap:2px;flex-shrink:0;}
  .lexw-icon-btn{background:none;border:none;color:${CONFIG.mutedColor};font-size:17px;line-height:1;cursor:pointer;
    padding:6px;border-radius:6px;transition:.2s;}
  .lexw-icon-btn:hover{color:${CONFIG.accentBright};background:rgba(201,168,118,.1);}
  .lexw-icon-btn:disabled{opacity:.3;cursor:default;}
  .lexw-icon-btn:disabled:hover{background:none;color:${CONFIG.mutedColor};}

  .lexw-progress{display:flex;gap:4px;padding:10px 16px 0;}
  .lexw-progress i{flex:1;height:3px;border-radius:2px;background:rgba(238,231,216,.12);}
  .lexw-progress i.lexw-done{background:${CONFIG.accentColor};}

  .lexw-body{flex:1;overflow-y:auto;padding:14px 16px;display:flex;flex-direction:column;gap:10px;scroll-behavior:smooth;}
  .lexw-body::-webkit-scrollbar{width:5px;}
  .lexw-body::-webkit-scrollbar-thumb{background:${CONFIG.accentColor};border-radius:3px;opacity:.5;}

  .lexw-msg{max-width:88%;padding:10px 13px;border-radius:12px;font-size:15px;line-height:1.45;animation:lexw-fade .3s ease;}
  @keyframes lexw-fade{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
  .lexw-msg.lexw-bot{background:${CONFIG.panelColor};color:${CONFIG.textColor};border-bottom-left-radius:3px;align-self:flex-start;}
  .lexw-msg.lexw-user{background:#8B7042;color:#141210;border-bottom-right-radius:3px;align-self:flex-end;font-weight:600;}

  .lexw-typing{align-self:flex-start;display:flex;gap:4px;padding:12px 14px;background:${CONFIG.panelColor};border-radius:12px;border-bottom-left-radius:3px;}
  .lexw-typing span{width:6px;height:6px;border-radius:50%;background:${CONFIG.mutedColor};animation:lexw-bounce-dot 1.2s infinite ease-in-out;}
  .lexw-typing span:nth-child(2){animation-delay:.15s;}
  .lexw-typing span:nth-child(3){animation-delay:.3s;}
  @keyframes lexw-bounce-dot{0%,60%,100%{transform:translateY(0);opacity:.5;}30%{transform:translateY(-4px);opacity:1;}}

  .lexw-opt-list{display:flex;flex-direction:column;gap:7px;margin-top:2px;}
  .lexw-opt-btn{background:transparent;border:1px solid rgba(238,231,216,.24);color:${CONFIG.accentBright};text-align:left;
    padding:9px 12px;border-radius:8px;font-size:14.5px;transition:.18s;cursor:pointer;font-family:inherit;}
  .lexw-opt-btn:hover,.lexw-opt-btn:focus-visible{background:rgba(201,168,118,.12);border-color:${CONFIG.accentColor};outline:none;}

  .lexw-final{display:flex;align-items:center;gap:8px;padding:12px 16px;border-top:1px solid rgba(238,231,216,.10);}
  .lexw-final a{flex:1;text-align:center;background:${CONFIG.whatsappColor};color:#0c1f10;font-weight:700;padding:11px;
    border-radius:8px;text-decoration:none;font-size:15px;}
  .lexw-final button{background:transparent;border:1px solid rgba(238,231,216,.24);color:${CONFIG.mutedColor};
    padding:11px 12px;border-radius:8px;font-size:14.5px;cursor:pointer;}

  .lexw-disclaimer{font-size:12.5px;color:${CONFIG.mutedColor};text-align:center;padding:6px 16px 10px;opacity:.7;}

  @media (max-width:480px){
    .lexw-panel{width:calc(100vw - 20px);right:10px;bottom:86px;max-height:70vh;}
    .lexw-launcher{right:16px;bottom:16px;}
    .lexw-teaser{right:14px;max-width:calc(100vw - 90px);}
  }
  @media (prefers-reduced-motion: reduce){
    .lexw-launcher,.lexw-launcher .lexw-ring,.lexw-launcher.lexw-attn,.lexw-msg,.lexw-typing span{animation:none !important;}
  }
  `;

  function injectStyles() {
    if (document.getElementById('lexw-styles')) return;
    const style = document.createElement('style');
    style.id = 'lexw-styles';
    style.textContent = css;
    document.head.appendChild(style);
  }

  /* =========================================================
     ICONOS SVG (balanza) reutilizados en el lanzador y el header
     ========================================================= */
  function scaleSvg(color, size) {
    return `<svg width="${size}" height="${size}" viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <path d="M20 5v26M9 12h22M13 12L8 21h10L13 12zM27 12l-5 9h10l-5-9z" stroke="${color}" stroke-width="1.6" stroke-linejoin="round"/>
      <circle cx="20" cy="31" r="1.6" fill="${color}"/>
    </svg>`;
  }

  /* =========================================================
     WIDGET
     ========================================================= */
  function buildWidget() {
    injectStyles();

    const root = document.createElement('div');
    root.setAttribute('data-lex-widget', '');

    root.innerHTML = `
      <div class="lexw-teaser" id="lexwTeaser" role="button" tabindex="0" aria-label="Abrir chat con ${CONFIG.advisorName}">
        <button class="lexw-teaser-close" id="lexwTeaserClose" aria-label="Cerrar mensaje">×</button>
        <b>${CONFIG.advisorName} · ${CONFIG.advisorRole.toUpperCase()}</b>
        <span id="lexwTeaserText"></span>
      </div>

      <button class="lexw-launcher" id="lexwLauncher" aria-haspopup="dialog" aria-expanded="false" aria-label="Abrir asesor virtual ${CONFIG.advisorName}">
        <div class="lexw-ring"></div>
        ${scaleSvg(CONFIG.accentBright, 28)}
        <span class="lexw-badge" aria-hidden="true"></span>
      </button>

      <div class="lexw-panel" id="lexwPanel" role="dialog" aria-modal="true" aria-labelledby="lexwHeadName" style="display:none;">
        <div class="lexw-head">
          <div class="lexw-av">${scaleSvg(CONFIG.accentBright, 20)}</div>
          <div class="lexw-head-text">
            <b id="lexwHeadName">${CONFIG.advisorName}</b>
            <span>${CONFIG.advisorRole}</span>
          </div>
          <div class="lexw-head-btns">
            <button class="lexw-icon-btn" id="lexwBack" title="Volver a la pregunta anterior" aria-label="Volver" disabled>‹</button>
            <button class="lexw-icon-btn" id="lexwRestart" title="Empezar de nuevo" aria-label="Reiniciar conversación">↻</button>
            <button class="lexw-icon-btn" id="lexwClose" title="Cerrar" aria-label="Cerrar chat">×</button>
          </div>
        </div>
        <div class="lexw-progress" id="lexwProgress" aria-hidden="true"></div>
        <div class="lexw-body" id="lexwBody" aria-live="polite"></div>
        <p class="lexw-disclaimer">Este asesor virtual orienta su consulta; no reemplaza el asesoramiento de un abogado.</p>
      </div>
    `;
    document.body.appendChild(root);
    return root;
  }

  /* =========================================================
     LÓGICA
     ========================================================= */
  function init() {
    const root = buildWidget();
    const launcher = root.querySelector('#lexwLauncher');
    const panel = root.querySelector('#lexwPanel');
    const body = root.querySelector('#lexwBody');
    const progress = root.querySelector('#lexwProgress');
    const teaser = root.querySelector('#lexwTeaser');
    const teaserText = root.querySelector('#lexwTeaserText');
    const teaserClose = root.querySelector('#lexwTeaserClose');
    const btnClose = root.querySelector('#lexwClose');
    const btnBack = root.querySelector('#lexwBack');
    const btnRestart = root.querySelector('#lexwRestart');

    let panelOpen = false;
    let collected = {};
    let history = []; // pila de nodos visitados, para el botón "volver"
    let inactivityTimer = null;
    let teaserDismissed = false;

    const LEVELS = ['segmento', 'contexto', 'dimensión', 'situación'];

    function renderProgress(activeCount) {
      progress.innerHTML = '';
      LEVELS.forEach((_, i) => {
        const dot = document.createElement('i');
        if (i < activeCount) dot.className = 'lexw-done';
        progress.appendChild(dot);
      });
    }

    function scrollBottom() {
      body.scrollTop = body.scrollHeight;
    }

    function addMsg(text, who) {
      const m = document.createElement('div');
      m.className = 'lexw-msg lexw-' + who;
      m.textContent = text;
      body.appendChild(m);
      scrollBottom();
      return m;
    }

    function showTyping() {
      const t = document.createElement('div');
      t.className = 'lexw-typing';
      t.innerHTML = '<span></span><span></span><span></span>';
      body.appendChild(t);
      scrollBottom();
      return t;
    }

    function randomDelay() {
      const [a, b] = CONFIG.typingDelayMs;
      return a + Math.random() * (b - a);
    }

    function clearOptionLists() {
      body.querySelectorAll('.lexw-opt-list, .lexw-final').forEach(el => el.remove());
    }

    function addOptions(nodeKey) {
      const node = TREE[nodeKey];
      const wrap = document.createElement('div');
      wrap.className = 'lexw-opt-list';
      node.options.forEach(opt => {
        const b = document.createElement('button');
        b.className = 'lexw-opt-btn';
        b.type = 'button';
        b.textContent = opt.label;
        b.addEventListener('click', () => {
          resetInactivity();
          clearOptionLists();
          addMsg(opt.label, 'user');
          if (opt.field) collected[opt.field] = opt.value;
          history.push({ key: nodeKey, collectedSnapshot: Object.assign({}, collected) });
          btnBack.disabled = history.length === 0;
          if (opt.next === 'close') {
            renderClose();
          } else {
            goToNode(opt.next);
          }
        });
        wrap.appendChild(b);
      });
      body.appendChild(wrap);
      scrollBottom();
    }

    function goToNode(key) {
      const node = TREE[key];
      if (node.field && node.value && !collected[node.field]) collected[node.field] = node.value;
      const filledLevels = LEVELS.filter(l => collected[l]).length;
      renderProgress(filledLevels);
      const typing = showTyping();
      setTimeout(() => {
        typing.remove();
        addMsg(node.bot, 'bot');
        addOptions(key);
        resetInactivity();
      }, randomDelay());
    }

    function renderClose() {
      renderProgress(LEVELS.length);
      const typing = showTyping();
      setTimeout(() => {
        typing.remove();
        const parts = [];
        if (collected['segmento']) parts.push('Área: ' + collected['segmento']);
        if (collected['contexto']) parts.push('Detalle: ' + collected['contexto']);
        if (collected['dimensión']) parts.push('Contexto: ' + collected['dimensión']);
        if (collected['situación']) parts.push('Situación: ' + collected['situación']);

        addMsg('Con esto ya tengo un panorama claro de su situación. Le dejo un resumen listo para enviar por WhatsApp, así el abogado que lo reciba ya sabe de qué se trata.', 'bot');

        const summary = document.createElement('div');
        summary.className = 'lexw-msg lexw-bot';
        summary.style.fontFamily = "'JetBrains Mono', monospace";
        summary.style.fontSize = '11.5px';
        summary.innerHTML = parts.join('<br>');
        body.appendChild(summary);

        const finalMsg = 'Hola, hablé con el asesor virtual de ' + CONFIG.brandName + '. ' + parts.join('. ') + '. Quisiera coordinar una consulta.';
        const finalWrap = document.createElement('div');
        finalWrap.className = 'lexw-final';
        finalWrap.innerHTML =
          '<a href="' + waLink(finalMsg) + '" target="_blank" rel="noopener">Enviar por WhatsApp</a>' +
          '<button type="button" id="lexwNewChat">Nueva consulta</button>';
        body.appendChild(finalWrap);
        scrollBottom();
        clearTimeout(inactivityTimer);

        root.querySelector('#lexwNewChat').addEventListener('click', restartConversation);
      }, randomDelay());
    }

    function restartConversation() {
      collected = {};
      history = [];
      btnBack.disabled = true;
      body.innerHTML = '';
      renderProgress(0);
      goToNode('start');
    }

    function goBack() {
      if (history.length === 0) return;
      const prev = history.pop();
      collected = prev.collectedSnapshot;
      btnBack.disabled = history.length === 0;
      body.innerHTML = '';
      const filledLevels = LEVELS.filter(l => collected[l]).length;
      renderProgress(filledLevels);
      addMsg(TREE[prev.key].bot, 'bot');
      addOptions(prev.key);
      resetInactivity();
    }

    function resetInactivity() {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        if (!panelOpen) return;
        addMsg('Sigo por acá. Si prefiere, lo derivo directo con un abogado por WhatsApp y seguimos la conversación ahí.', 'bot');
        const wrap = document.createElement('div');
        wrap.className = 'lexw-final';
        wrap.innerHTML = '<a href="' + waLink('Hola, quiero continuar mi consulta con ' + CONFIG.brandName + '.') + '" target="_blank" rel="noopener">Continuar por WhatsApp</a>';
        body.appendChild(wrap);
        scrollBottom();
      }, CONFIG.inactivityMs);
    }

    let lastFocused = null;
    function openPanel() {
      panelOpen = true;
      lastFocused = document.activeElement;
      panel.style.display = 'flex';
      requestAnimationFrame(() => panel.classList.add('lexw-open'));
      launcher.setAttribute('aria-expanded', 'true');
      teaser.classList.remove('lexw-show');
      launcher.classList.remove('lexw-attn');
      if (body.children.length === 0) {
        renderProgress(0);
        goToNode('start');
      }
      const firstBtn = panel.querySelector('.lexw-opt-btn, #lexwClose');
      if (firstBtn) firstBtn.focus();
      document.addEventListener('keydown', onKeydown);
    }
    function closePanel() {
      panelOpen = false;
      panel.classList.remove('lexw-open');
      launcher.setAttribute('aria-expanded', 'false');
      setTimeout(() => { if (!panelOpen) panel.style.display = 'none'; }, 280);
      document.removeEventListener('keydown', onKeydown);
      if (lastFocused && lastFocused.focus) lastFocused.focus();
    }
    function onKeydown(e) {
      if (e.key === 'Escape') closePanel();
    }

    launcher.addEventListener('click', () => panelOpen ? closePanel() : openPanel());
    btnClose.addEventListener('click', closePanel);
    btnBack.addEventListener('click', goBack);
    btnRestart.addEventListener('click', restartConversation);
    teaser.addEventListener('click', openPanel);
    teaser.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openPanel(); } });
    teaserClose.addEventListener('click', (e) => {
      e.stopPropagation();
      teaser.classList.remove('lexw-show');
      teaserDismissed = true;
    });

    /* Proactividad: si el sitio anfitrión despacha el evento
       'lex:screenchange' con { detail: { index } }, mostramos un
       teaser contextual. Si el sitio no lo hace, mostramos un único
       teaser genérico a los pocos segundos de cargar la página. */
    function showTeaser(index) {
      if (panelOpen || teaserDismissed) return;
      teaserText.textContent = TEASER_MESSAGES[index] || TEASER_MESSAGES[0];
      teaser.classList.add('lexw-show');
      setTimeout(() => teaser.classList.remove('lexw-show'), 9000);
      launcher.classList.add('lexw-attn');
      setTimeout(() => launcher.classList.remove('lexw-attn'), 2200);
    }

    window.addEventListener('lex:screenchange', (e) => {
      const idx = (e && e.detail && typeof e.detail.index === 'number') ? e.detail.index : 0;
      showTeaser(idx);
    });

    setTimeout(() => showTeaser(0), 4000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
