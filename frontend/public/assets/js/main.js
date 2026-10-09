/* Meldina FC — interações do site.
   IMPORTANTE: não há back-end. Formulários apenas simulam o envio;
   nenhum dado digitado é armazenado ou transmitido. */

(() => {
  "use strict";

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const page = document.body.dataset.page || "";

  /* ---------------- Ícones ---------------- */
  const I = {
    ig: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4.2"/><circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none"/></svg>',
    yt: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23 7.2a3 3 0 0 0-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 0 0 1 7.2 31 31 0 0 0 .5 12a31 31 0 0 0 .5 4.8 3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .5-4.8 31 31 0 0 0-.5-4.8ZM9.7 15.1V8.9L15.5 12l-5.8 3.1Z"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.8 3h3.1l-6.8 7.7L22 21h-6.2l-4.9-6.4L5.3 21H2.2l7.3-8.3L1.9 3h6.4l4.4 5.8L17.8 3Zm-1.1 16.2h1.7L7.4 4.7H5.6l11.1 14.5Z"/></svg>',
    tt: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.6 2h-3.3v13.3a2.9 2.9 0 1 1-2.9-2.9c.3 0 .6 0 .9.1V9.2a6.3 6.3 0 1 0 5.3 6.1V8.6a8 8 0 0 0 4.7 1.5V6.8a4.7 4.7 0 0 1-4.7-4.8Z"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12h15m-6-6 6 6-6 6"/></svg>',
    bag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 8h14l-1 13H6L5 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12Z"/><circle cx="12" cy="10" r="2.5"/></svg>',
    play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5v15l13-7.5-13-7.5Z"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>',
    minus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 12h12"/></svg>',
    ticket: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 8a2 2 0 0 0 0 4v0a2 2 0 0 1 0 4v2h18v-2a2 2 0 0 1 0-4 2 2 0 0 1 0-4V6H3v2Z"/><path d="M14 6v12" stroke-dasharray="2 2"/></svg>',
    crown: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 7l4.5 4L12 5l4.5 6L21 7l-2 11H5L3 7Z"/></svg>',
    star: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z"/></svg>',
    tag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 12V4h8l10 10-8 8L3 12Z"/><circle cx="7.5" cy="8.5" r="1.5"/></svg>',
    tv: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="6" width="20" height="14" rx="2"/><path d="m8 2 4 4 4-4"/></svg>',
    link: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/></svg>',
    wa: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.4 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.4-.7-2.8-1.1-4.6-4-4.8-4.2-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.4.6-.4.4c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.4 1.5.3.1.5.1.6-.1l.9-1.1c.2-.3.4-.2.7-.1l1.9.9c.3.1.5.2.5.3.1.2.1.7-.1 1.3Z"/></svg>',
  };
  window.MFC_ICONS = I;

  /* Logo Lider Sport (vetor) */
  const LIDER = `<img class="lider-logo" src="${"assets/img/lider.png"}" alt="Lider Sport">`;
  window.MFC_LIDER = LIDER;

  /* ---------------- Utilidades ---------------- */
  const BRL = (v) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  const MES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
  const MES_L = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
  const DIA = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];
  const DIA_L = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
  const d2 = (n) => String(n).padStart(2, "0");
  const parseD = (s) => new Date(s.length <= 10 ? s + "T12:00" : s);
  const fmtShort = (s) => { const d = parseD(s); return `${DIA[d.getDay()]}, ${d2(d.getDate())} ${MES[d.getMonth()]}`; };
  const fmtLong = (s) => { const d = parseD(s); return `${d.getDate()} de ${MES_L[d.getMonth()]} de ${d.getFullYear()}`; };
  const fmtTime = (s) => { const d = parseD(s); return `${d2(d.getHours())}h${d.getMinutes() ? d2(d.getMinutes()) : ""}`; };
  const asset = (p) => "assets/" + p;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* Escudos genéricos dos adversários (SVG) */
  function crest(key) {
    const t = TEAMS[key];
    if (t.us) return `<img src="${asset("img/escudo.png")}" alt="${t.nome}">`;
    if (t.img) return `<img src="${asset(t.img)}" alt="${esc(t.nome)}">`;
    const txt = `<text x="50" y="${t.shape === "round" ? 58 : 60}" text-anchor="middle" font-family="Anton, Impact, sans-serif" font-size="${t.sigla.length > 2 ? 22 : 28}" fill="${t.c2}" letter-spacing="1">${t.sigla}</text>`;
    let body;
    if (t.shape === "round") {
      body = `<circle cx="50" cy="50" r="46" fill="${t.c2}"/><circle cx="50" cy="50" r="41" fill="${t.c1}"/><circle cx="50" cy="50" r="33" fill="none" stroke="${t.c2}" stroke-width="1.5" opacity=".6"/>`;
    } else if (t.shape === "castle") {
      body = `<path d="M10 8h14v8h10V8h12v8h10V8h12v8h10V8h12v44c0 22-20 36-40 44C30 88 10 74 10 52V8Z" fill="${t.c2}"/><path d="M16 14h4v8h18v-8h4v8h18v-8h4v8h18v-8h4v38c0 18-16 30-34 38C32 82 16 70 16 52V14Z" fill="${t.c1}"/>`;
    } else {
      body = `<path d="M50 4 92 14v36c0 24-18 38-42 46C26 88 8 74 8 50V14L50 4Z" fill="${t.c2}"/><path d="M50 10 86 18v32c0 20-15 32-36 40C29 82 14 70 14 50V18L50 10Z" fill="${t.c1}"/><path d="M14 30h72" stroke="${t.c2}" stroke-width="2" opacity=".5"/>`;
    }
    return `<svg viewBox="0 0 100 100" role="img" aria-label="${esc(t.nome)}">${body}${txt}</svg>`;
  }

  const home = (f) => (f.casa ? "mfc" : f.adv);
  const away = (f) => (f.casa ? f.adv : "mfc");
  const venue = (f) => (f.casa ? MFC.estadio : f.local || "Fora de casa");
  const outcome = (f) => {
    if (!f.placar) return null;
    const [h, a] = f.placar; const us = f.casa ? h : a, them = f.casa ? a : h;
    return us > them ? "w" : us < them ? "l" : "d";
  };
  const nextFixture = () => FIXTURES.find((f) => !f.placar) || FIXTURES[FIXTURES.length - 1];
  const lastResult = () => [...FIXTURES].reverse().find((f) => f.placar);
  const newsSorted = () => [...NEWS].sort((a, b) => (a.data < b.data ? 1 : -1));

  /* ---------------- Cabeçalho / rodapé ---------------- */
  const NAV = [
    ["index.html", "Início", "inicio"],
    ["noticias.html", "Notícias", "noticias"],
    ["jogos.html", "Jogos", "jogos"],
    ["elenco.html", "Elenco", "elenco"],
    ["clube.html", "O Clube", "clube"],
    ["tv.html", "Meldina TV", "tv"],
    ["loja.html", "Loja", "loja"],
    ["socio.html", "Clube Meldina", "socio"],
  ];

  function renderChrome() {
    const nx = nextFixture();
    const header = `
      <div class="topbar">
        <div class="wrap">
          <div class="topbar__left">
            <span>Próximo jogo: <strong>${TEAMS[home(nx)].curto} x ${TEAMS[away(nx)].curto}</strong> · ${fmtShort(nx.d)} · ${fmtTime(nx.d)}</span>
            <span>Pro Clubs · Série A ${MFC.temporada} · Campeão da Série B 2025</span>
          </div>
          <div class="topbar__right">
            <a href="${MFC.instagram}" target="_blank" rel="noopener" aria-label="Instagram @meldinafc">${I.ig}<span class="hide-sm">@meldinafc</span></a>
            <a href="${MFC.youtube}" target="_blank" rel="noopener" aria-label="YouTube Meldina TV">${I.yt}<span class="hide-sm">Meldina TV</span></a>
            <span class="topbar__lang">PT-BR</span>
          </div>
        </div>
      </div>
      <header class="header" id="header">
        <div class="wrap">
          <a class="brand" href="index.html" aria-label="Meldina FC — página inicial">
            <img src="${asset("img/escudo.png")}" alt="Escudo do Meldina FC">
            <span class="brand__txt"><span class="brand__name">Meldina FC</span><span class="brand__tag">MUITO ALÉM DO JOGO</span></span>
          </a>
          <nav class="nav" id="nav" aria-label="Principal">
            ${NAV.map(([h, l, k]) => `<a href="${h}"${k === page ? ' aria-current="page"' : ""}>${l}</a>`).join("")}
          </nav>
          <div class="header__cta">
            <a class="btn btn--sm" href="socio.html">Seja sócio</a>
            <button class="cart-btn" id="cartBtn" aria-label="Abrir carrinho">${I.bag}<span class="cart-btn__count" id="cartCount">0</span></button>
            <button class="burger" id="burger" aria-label="Abrir menu" aria-expanded="false"><span></span><span></span><span></span></button>
          </div>
        </div>
      </header>`;

    const footer = `
      <section class="partners" aria-label="Parceiros">
        <div class="wrap">
          <div class="partner"><small>Patrocinador oficial</small><img class="nufut" src="${asset("img/nufut.png")}" alt="nuFUT"></div>
          <div class="partner"><small>Fornecedor oficial</small>${LIDER}</div>
          <div class="partner"><small>Mídia oficial</small><img class="mtv" src="${asset("img/mtv-white.png")}" alt="Meldina TV"></div>
          <div class="partner"><small>Programa oficial</small><span class="lider" style="font-family:var(--f-regal);font-size:1.3rem;letter-spacing:.18em">${I.crown.replace("<svg", '<svg style="width:26px;height:26px;color:var(--ouro)"')}CLUBE MELDINA</span></div>
        </div>
      </section>
      <footer class="footer">
        <div class="wrap">
          <div class="footer__top">
            <div class="footer__brand">
              <img src="${asset("img/escudo.png")}" alt="Meldina FC">
              <p>Meldina Futebol Clube. Grená, ouro e marinho. Fundado em ${MFC.fundacao}. Muito além do jogo. <em>Meldina pra sempre.</em></p>
              <div class="socials">
                <a href="${MFC.instagram}" target="_blank" rel="noopener" aria-label="Instagram">${I.ig}</a>
                <a href="${MFC.youtube}" target="_blank" rel="noopener" aria-label="YouTube">${I.yt}</a>
              </div>
            </div>
            <div><h4>Clube</h4><ul>
              <li><a href="clube.html">História</a></li><li><a href="clube.html#escudo">Escudo e cores</a></li>
              <li><a href="clube.html#uniformes">Uniformes</a></li><li><a href="elenco.html">Elenco</a></li></ul></div>
            <div><h4>Futebol</h4><ul>
              <li><a href="jogos.html">Calendário</a></li><li><a href="jogos.html#classificacao">Classificação</a></li>
              <li><a href="noticias.html">Notícias</a></li><li><a href="tv.html">Meldina TV</a></li></ul></div>
            <div><h4>Torcedor</h4><ul>
              <li><a href="socio.html">Clube Meldina</a></li><li><a href="jogos.html">Ingressos</a></li>
              <li><a href="loja.html">Loja Oficial</a></li><li><a href="${MFC.instagram}" target="_blank" rel="noopener">@meldinafc</a></li></ul></div>
          </div>
        </div>
        <div class="wrap footer__bottom">
          <span>© ${MFC.temporada} Meldina Futebol Clube. Todos os direitos reservados.</span>
          <nav><a href="#" data-soon>Política de privacidade</a><a href="#" data-soon>Termos de uso</a><a href="#" data-soon>Imprensa</a><a href="#" data-soon>Contato</a></nav>
          <span style="flex-basis:100%">Site conceitual: nenhum formulário deste site envia, coleta ou armazena dados pessoais.</span>
        </div>
      </footer>
      <div class="drawer" id="cart" aria-hidden="true">
        <div class="drawer__backdrop" data-close></div>
        <aside class="drawer__panel" role="dialog" aria-label="Carrinho">
          <div class="drawer__head"><h3 class="display">Seu carrinho</h3><button data-close aria-label="Fechar">${I.close}</button></div>
          <div class="drawer__items" id="cartItems"></div>
          <div class="drawer__foot" id="cartFoot"></div>
        </aside>
      </div>
      <div class="modal" id="modal" aria-hidden="true">
        <div class="modal__backdrop" data-close></div>
        <div class="modal__box" role="dialog" aria-modal="true"><button class="modal__close" data-close aria-label="Fechar">${I.close}</button><div id="modalBody"></div></div>
      </div>
      <div class="toasts" id="toasts" aria-live="polite"></div>`;

    $("#site-header").outerHTML = header;
    $("#site-footer").outerHTML = footer;
  }

  /* ---------------- Toast ---------------- */
  function toast(title, msg, icon = I.check) {
    const el = document.createElement("div");
    el.className = "toast";
    el.innerHTML = `<span class="toast__i">${icon}</span><div><b>${title}</b>${msg ? `<span>${msg}</span>` : ""}</div>`;
    $("#toasts").appendChild(el);
    setTimeout(() => { el.classList.add("out"); setTimeout(() => el.remove(), 400); }, 3600);
  }
  window.mfcToast = toast;

  /* ---------------- Modal ---------------- */
  let lastFocus;
  function openModal(html, small = false) {
    const m = $("#modal");
    lastFocus = document.activeElement;
    $("#modalBody").innerHTML = html;
    m.classList.toggle("modal--sm", small);
    m.classList.add("is-open");
    m.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    setTimeout(() => $(".modal__close", m).focus(), 50);
  }
  function closeModal() {
    const m = $("#modal");
    m.classList.remove("is-open");
    m.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  }
  window.mfcModal = openModal;

  /* ---------------- Jogadores ---------------- */
  function playerCard(p, i = 0) {
    return `<button class="player-card ${p.grupo === "Goleiros" ? "player-card--gk" : ""} reveal reveal-d${i % 4}" data-player="${p.id}" aria-label="Ver perfil de ${p.nome}">
      <span class="player-card__num">${p.num}</span>
      <img src="${asset("players/" + p.img)}" alt="${p.nome}" loading="lazy">
      <span class="player-card__info">
        <span>${p.capitao ? `<span class="captain captain--sm">C</span>` : ""}<span class="player-card__pos">${p.pos}</span><span class="player-card__name">${p.nome}</span></span>
        <span class="player-card__n">${p.num}</span>
      </span>
      <span class="player-card__bar"></span>
    </button>`;
  }
  function openPlayer(id) {
    const p = PLAYERS.find((x) => x.id === id);
    if (!p) return;
    openModal(`<div class="profile">
      <div class="profile__media ${p.grupo === "Goleiros" ? "gk" : ""}"><span class="num">${p.num}</span><img src="${asset("players/" + p.img)}" alt="${p.nome}"></div>
      <div class="profile__body">
        <p class="eyebrow">${p.pos}</p>
        <h2 class="display">${p.nome} <span style="color:var(--ouro)">#${p.num}</span></h2>
        ${p.capitao || p.cargo ? `<div style="display:flex;gap:8px;flex-wrap:wrap">${p.capitao ? `<span class="captain">C · Capitão</span>` : ""}${p.cargo ? `<span class="captain captain--role">${p.cargo}</span>` : ""}</div>` : ""}
        <div class="profile__meta">
          <div><small>Posição</small><b>${p.pos}</b></div>
          <div><small>Camisa</small><b>${p.num}</b></div>
          <div><small>Pé preferido</small><b>${p.pe}</b></div>
          <div><small>No clube desde</small><b>${p.desde}</b></div>
          ${p.cargo ? `<div><small>Cargo no clube</small><b>${p.cargo}</b></div>` : ""}
          <div><small>Técnico</small><b>${MFC.tecnico}</b></div>
          <div><small>Competição</small><b>${MFC.liga} · ${MFC.divisao}</b></div>
        </div>
        <p class="eyebrow no-rule" style="margin-bottom:12px">Temporada ${MFC.temporada}</p>
        <div class="stats">
          <div class="stat"><b data-count="${p.j}">0</b><small>Jogos</small></div>
          <div class="stat"><b data-count="${p.g}">0</b><small>Gols</small></div>
          <div class="stat"><b data-count="${p.a}">0</b><small>Assistências</small></div>
          <div class="stat"><b data-count="${p.extra[1]}">0</b><small>${p.extra[0]}</small></div>
        </div>
        <p class="profile__bio">${p.bio}</p>
        <div style="display:flex;gap:10px;margin-top:26px;flex-wrap:wrap">
          <a class="btn btn--sm" href="loja.html">${I.bag} Camisa com nome ${p.nome}</a>
          <a class="btn btn--sm btn--ghost" href="${MFC.instagram}" target="_blank" rel="noopener">${I.ig} @meldinafc</a>
        </div>
      </div></div>`);
    $$("#modalBody [data-count]").forEach(countUp);
  }

  function countUp(el) {
    const target = +el.dataset.count; const t0 = performance.now(); const dur = 900;
    const step = (t) => { const k = Math.min(1, (t - t0) / dur); el.textContent = Math.round(target * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }

  /* ---------------- Notícias ---------------- */
  const tagClass = (t) => (t === "Meldina TV" ? "t-tv" : t === "Clube" ? "t-clube" : t === "Nota oficial" ? "t-nota" : "");
  function newsCard(n, feature = false, i = 0) {
    return `<a class="news-card ${feature ? "news-card--feature" : ""} reveal reveal-d${i % 3}" href="noticia.html?id=${n.id}">
      <div class="news-card__img"><img src="${asset(n.img)}" alt="" loading="lazy" style="${n.pos ? `object-position:${n.pos}` : ""}">${feature ? "" : `<span class="news-card__tag ${tagClass(n.tag)}">${n.tag}</span>`}</div>
      <div class="news-card__body">
        ${feature ? `<span class="news-card__tag ${tagClass(n.tag)}">${n.tag}</span>` : ""}
        <span class="news-card__meta">${fmtLong(n.data)}</span>
        <h3>${n.titulo}</h3>
        <p>${n.resumo}</p>
      </div></a>`;
  }

  /* ---------------- Jogos ---------------- */
  function fxRow(f, isNext) {
    const o = outcome(f);
    const mid = f.placar ? `<span class="fx__score">${f.placar[0]} - ${f.placar[1]}</span>` : `<span class="fx__score vs">${fmtTime(f.d)}</span>`;
    const act = f.placar
      ? `<span class="result-tag ${o}">${o === "w" ? "VITÓRIA" : o === "d" ? "EMPATE" : "DERROTA"}</span>${f.relato ? `<a class="fx__venue link-arrow" href="noticia.html?id=${f.relato}">Relato ${I.arrow}</a>` : `<span class="fx__venue">${venue(f)}</span>`}`
      : f.casa
        ? `<button class="btn btn--sm" data-ticket="${f.d}">${I.ticket} Ingressos</button><span class="fx__venue">${venue(f)}</span>`
        : `<button class="btn btn--sm btn--ghost" data-remind="${f.d}">Lembrar-me</button><span class="fx__venue">${venue(f)}</span>`;
    return `<div class="fx ${isNext ? "is-next" : ""} reveal" data-comp="${f.comp}" data-state="${f.placar ? "res" : "cal"}">
      <div class="fx__when"><b>${fmtShort(f.d)}</b><small>${f.placar ? "Encerrado" : fmtTime(f.d)} · ${f.fase}</small><span class="fx__comp">${f.comp}</span></div>
      <div class="fx__match">
        <div class="fx__team">${TEAMS[home(f)].nome}${crest(home(f))}</div>
        ${mid}
        <div class="fx__team">${crest(away(f))}${TEAMS[away(f)].nome}</div>
      </div>
      <div class="fx__act">${act}</div></div>`;
  }

  function standingsRows(limit) {
    const rows = STANDINGS.slice(0, limit || STANDINGS.length);
    return rows.map((r, i) => {
      const t = TEAMS[r.t]; const pts = r.v * 3 + r.e;
      const zone = i < 4 ? "zone-g" : i >= STANDINGS.length - 2 ? "zone-r" : "";
      return `<tr class="${t.us ? "is-us" : ""}">
        <td><span class="pos-badge ${zone}">${i + 1}</span></td>
        <td><span class="t">${crest(r.t)}${t.nome}</span></td>
        <td class="pts">${pts}</td><td>${r.j}</td><td>${r.v}</td><td>${r.e}</td><td>${r.d}</td>
        <td>${r.gp}</td><td>${r.gc}</td><td>${r.gp - r.gc > 0 ? "+" : ""}${r.gp - r.gc}</td>
        <td><span class="form-dots">${[...r.f].map((c) => `<i class="${c === "W" ? "" : c === "D" ? "d" : "l"}">${c === "W" ? "V" : c === "D" ? "E" : "D"}</i>`).join("")}</span></td>
      </tr>`;
    }).join("");
  }

  function ticketModal(dStr) {
    const f = FIXTURES.find((x) => x.d === dStr);
    const sectors = [["Arquibancada Coroa", 60], ["Arquibancada Grená", 45], ["Setor Visitante", 45], ["Camarote Majestade", 180]];
    openModal(`<p class="eyebrow">Ingressos · ${f.fase}</p>
      <h3 class="display" style="font-size:2.6rem">${TEAMS[home(f)].curto} x ${TEAMS[away(f)].curto}</h3>
      <p class="muted" style="margin:8px 0 24px">${DIA_L[parseD(f.d).getDay()]}, ${fmtLong(f.d)} · ${fmtTime(f.d)} · ${venue(f)}</p>
      <div style="display:grid;gap:10px" id="sectors">
        ${sectors.map(([s, v], i) => `<label style="display:flex;justify-content:space-between;align-items:center;gap:12px;padding:14px 16px;border:1px solid var(--linha-escura);border-radius:4px;cursor:pointer">
          <span style="display:flex;gap:12px;align-items:center"><input type="radio" name="setor" ${i === 0 ? "checked" : ""} style="accent-color:var(--ouro)"> <b style="font-weight:600">${s}</b></span>
          <span>${BRL(v)} <small class="muted">· Clube Meldina ${BRL(v / 2)}</small></span></label>`).join("")}
      </div>
      <button class="btn btn--block" style="margin-top:22px" id="ticketGo">${I.ticket} Continuar</button>
      <p class="muted" style="font-size:.74rem;margin:12px 0 0;text-align:center">Membros do Clube Meldina têm até 50% de desconto e prioridade na compra.</p>`, true);
    $("#ticketGo").addEventListener("click", (e) => {
      fakeLoad(e.currentTarget, () => {
        closeModal();
        toast("Ingresso reservado!", "Demonstração: nenhuma compra foi realizada.", I.ticket);
      });
    });
  }

  /* ---------------- Carrinho (somente no navegador) ---------------- */
  let cart = [];
  try { cart = JSON.parse(localStorage.getItem("mfc-cart") || "[]"); } catch (e) { cart = []; }
  const saveCart = () => { try { localStorage.setItem("mfc-cart", JSON.stringify(cart)); } catch (e) {} renderCart(); };
  function addToCart(id, size) {
    const key = id + (size ? "-" + size : "");
    const line = cart.find((l) => l.key === key);
    if (line) line.q++; else cart.push({ key, id, size, q: 1 });
    saveCart();
    const p = PRODUCTS.find((x) => x.id === id);
    toast("Adicionado ao carrinho", `${p.nome}${size ? " · " + size : ""}`, I.bag);
  }
  function renderCart() {
    const count = cart.reduce((s, l) => s + l.q, 0);
    const c = $("#cartCount");
    if (c) { c.textContent = count; c.classList.toggle("is-on", count > 0); }
    const items = $("#cartItems"), foot = $("#cartFoot");
    if (!items) return;
    if (!cart.length) {
      items.innerHTML = `<div class="drawer__empty"><img src="${asset("img/escudo-mono.png")}" alt=""><p><b>Seu carrinho está vazio.</b><br>Vista o manto da realeza.</p><a class="btn btn--grena btn--sm" href="loja.html">Ir para a loja</a></div>`;
      foot.innerHTML = "";
      return;
    }
    let sub = 0;
    items.innerHTML = cart.map((l) => {
      const p = PRODUCTS.find((x) => x.id === l.id); sub += p.preco * l.q;
      const img = p.img ? `<img src="${asset(p.img)}" alt="">` : `<img class="art" src="${asset(p.art)}" alt="">`;
      return `<div class="line"><div class="line__img" style="${p.bg ? `background:${p.bg}` : ""}">${img}</div>
        <div><div class="line__name">${p.nome}</div><div class="line__sub">${l.size ? "Tamanho " + l.size : p.cat}</div>
        <div class="qty"><button data-q="-1" data-k="${l.key}" aria-label="Diminuir">−</button><span>${l.q}</span><button data-q="1" data-k="${l.key}" aria-label="Aumentar">+</button></div></div>
        <div class="line__price">${BRL(p.preco * l.q)}<button class="line__rm" data-rm="${l.key}">Remover</button></div></div>`;
    }).join("");
    const frete = sub >= 299 ? 0 : 24.9;
    foot.innerHTML = `<div class="drawer__row"><span>Subtotal</span><span>${BRL(sub)}</span></div>
      <div class="drawer__row"><span>Frete</span><span>${frete ? BRL(frete) : "Grátis"}</span></div>
      ${frete ? `<div class="drawer__row" style="font-size:.74rem;color:var(--grena)"><span>Faltam ${BRL(299 - sub)} para frete grátis</span></div>` : ""}
      <div class="drawer__row total"><span>Total</span><span>${BRL(sub + frete)}</span></div>
      <button class="btn btn--grena btn--block" id="checkout">Finalizar compra</button>
      <p style="font-size:.72rem;color:var(--cinza);text-align:center;margin:10px 0 0">Em até 6x sem juros · Clube Meldina tem 15% off</p>`;
  }
  function openCart(open = true) {
    const d = $("#cart");
    d.classList.toggle("is-open", open);
    d.setAttribute("aria-hidden", String(!open));
    document.body.style.overflow = open ? "hidden" : "";
  }

  /* ---------------- Formulários simulados ---------------- */
  function fakeLoad(btn, done) {
    const html = btn.innerHTML; btn.disabled = true;
    btn.innerHTML = `<span class="spinner"></span> Processando`;
    setTimeout(() => { btn.innerHTML = html; btn.disabled = false; done(); }, 1300);
  }
  function validate(form) {
    let ok = true;
    $$("[required]", form).forEach((inp) => {
      const f = inp.closest(".field"); let bad = false;
      if (inp.type === "checkbox") bad = !inp.checked;
      else if (!inp.value.trim()) bad = true;
      else if (inp.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inp.value)) bad = true;
      if (f) { f.classList.toggle("has-error", bad); const e = $(".err", f); if (e) e.textContent = bad ? (inp.type === "email" && inp.value ? "E-mail inválido" : "Campo obrigatório") : ""; }
      else if (bad) inp.focus();
      if (bad) ok = false;
    });
    return ok;
  }
  function bindFakeForms() {
    $$("form[data-fake]").forEach((form) => {
      form.setAttribute("novalidate", "");
      form.setAttribute("autocomplete", "off");
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        if (!validate(form)) { toast("Confira os campos", "Alguns campos precisam de atenção.", I.close); return; }
        const btn = $("[type=submit]", form);
        fakeLoad(btn, () => {
          form.reset(); // descarta tudo o que foi digitado — nada é salvo nem enviado
          const target = form.dataset.success && $(form.dataset.success);
          if (target) { form.style.display = "none"; target.classList.add("is-on"); }
          toast(form.dataset.title || "Pronto!", form.dataset.msg || "");
        });
      });
    });
  }

  /* ---------------- Contagem regressiva ---------------- */
  function countdown(el) {
    const t = parseD(el.dataset.to).getTime();
    const tick = () => {
      let s = Math.max(0, Math.floor((t - Date.now()) / 1000));
      const d = Math.floor(s / 86400); s %= 86400; const h = Math.floor(s / 3600); s %= 3600; const m = Math.floor(s / 60); s %= 60;
      el.innerHTML = [[d, "Dias"], [h, "Horas"], [m, "Min"], [s, "Seg"]].map(([v, l]) => `<div><b>${d2(v)}</b><small>${l}</small></div>`).join("");
    };
    tick(); setInterval(tick, 1000);
  }

  /* ---------------- Renderizações por página ---------------- */
  function renderHome() {
    const nx = nextFixture(), lr = lastResult(), o = outcome(lr);
    const mc = $("#matchcenter");
    if (mc) mc.innerHTML = `
      <div class="matchbar__cell">
        <div class="mc-label"><span>Próximo jogo</span><b>${nx.comp} · ${nx.fase}</b></div>
        <div class="fixture">
          <div class="team">${crest(home(nx))}<span>${TEAMS[home(nx)].curto}</span></div>
          <div class="fixture__mid"><div class="fixture__time">${fmtTime(nx.d)}</div><div class="fixture__date">${fmtShort(nx.d)}</div></div>
          <div class="team">${crest(away(nx))}<span>${TEAMS[away(nx)].curto}</span></div>
        </div>
        <div class="countdown" data-to="${nx.d}"></div>
        <div class="fixture__venue">${I.pin}${venue(nx)}</div>
        <div class="fixture__actions"><button class="btn btn--sm" data-ticket="${nx.d}">${I.ticket} Comprar ingresso</button><a class="btn btn--sm btn--ghost" href="jogos.html">Calendário</a></div>
      </div>
      <div class="matchbar__cell">
        <div class="mc-label"><span>Último resultado</span><span class="result-tag ${o}">${o === "w" ? "VITÓRIA" : o === "d" ? "EMPATE" : "DERROTA"}</span></div>
        <div class="fixture">
          <div class="team">${crest(home(lr))}<span>${TEAMS[home(lr)].curto}</span></div>
          <div class="score">${lr.placar[0]}<i>–</i>${lr.placar[1]}</div>
          <div class="team">${crest(away(lr))}<span>${TEAMS[away(lr)].curto}</span></div>
        </div>
        <div class="fixture__venue" style="margin-top:22px">${lr.comp} · ${lr.fase} · ${fmtShort(lr.d)}</div>
        <div class="fixture__actions">${lr.relato ? `<a class="link-arrow" href="noticia.html?id=${lr.relato}">Ver relato ${I.arrow}</a>` : ""}</div>
      </div>
      <div class="matchbar__cell">
        <div class="mc-label"><span>Série A · Pro Clubs</span><a href="jogos.html#classificacao" class="link-arrow" style="font-size:.66rem">Tabela ${I.arrow}</a></div>
        <table class="mini-table">${STANDINGS.slice(0, 5).map((r, i) => `<tr class="${TEAMS[r.t].us ? "is-us" : ""}"><td>${i + 1}</td><td><span class="t">${crest(r.t)}${TEAMS[r.t].curto}</span></td><td>${r.v * 3 + r.e}</td></tr>`).join("")}</table>
      </div>`;

    const ns = newsSorted();
    const ng = $("#homeNews");
    if (ng) ng.innerHTML = newsCard(ns[0], true) + ns.slice(1, 6).map((n, i) => newsCard(n, false, i)).join("");

    const rail = $("#homeSquad");
    if (rail) rail.innerHTML = PLAYERS.map(playerCard).join("");

    const ticker = $("#ticker");
    if (ticker) {
      const crown = `<img src="${asset("img/monograma.png")}" alt="">`;
      const n = Math.max(MFC.slogans.length, MFC.frases.length);
      const mixed = [];
      for (let i = 0; i < n; i++) {
        if (MFC.slogans[i]) mixed.push(`<span class="ticker__item">${crown}<b>${MFC.slogans[i]}</b></span>`);
        if (MFC.frases[i]) mixed.push(`<span class="ticker__item">${crown}“${MFC.frases[i][0]}” <em>— ${MFC.frases[i][1]}</em></span>`);
      }
      ticker.innerHTML = mixed.join("") + mixed.join("");
    }
  }

  function renderVideos(target, list) {
    const el = $(target);
    if (!el) return;
    el.innerHTML = list.map((v, i) => `<a class="video ${i > 0 && el.dataset.layout === "list" ? "video--row" : ""} reveal" href="${MFC.youtube}" target="_blank" rel="noopener">
      <div class="video__thumb"><img class="bg" src="${asset(v.img)}" alt="" loading="lazy">
        <div class="video__overlay"><div class="video__show"><small>${v.ep}</small>${v.show}</div></div>
        <span class="video__play">${I.play}</span><span class="video__dur">${v.dur}</span></div>
      <div><div class="video__title">${v.titulo}</div><div class="video__meta">${v.meta}</div></div></a>`).join("");
  }

  function renderHomeTV() {
    const main = $("#tvMain"), side = $("#tvSide");
    if (!main) return;
    const tmp = (v, row) => `<a class="video ${row ? "video--row" : ""} reveal" href="${MFC.youtube}" target="_blank" rel="noopener">
      <div class="video__thumb"><img class="bg" src="${asset(v.img)}" alt="" loading="lazy">
        <div class="video__overlay"><div class="video__show"><small>${v.ep}</small>${v.show}</div></div>
        <span class="video__play">${I.play}</span><span class="video__dur">${v.dur}</span></div>
      <div><div class="video__title">${v.titulo}</div><div class="video__meta">${v.meta}</div></div></a>`;
    main.innerHTML = tmp(VIDEOS[0], false);
    side.innerHTML = VIDEOS.slice(1, 4).map((v) => tmp(v, true)).join("");
  }

  /* Instagram @meldinafc — sem imagens estáticas. Ordem de preferência:
     1) feed ao vivo via /api/instagram (back-end, ver README);
     2) publicações oficiais incorporadas (INSTAGRAM_POSTS em data.js, sem back-end);
     3) cartão para seguir o perfil. */
  async function renderInsta() {
    const el = $("#insta");
    if (!el) return;
    const n = +(el.dataset.count || 8);
    const follow = () => {
      el.classList.add("insta-grid--follow");
      el.innerHTML = `<a class="insta-follow" href="${MFC.instagram}" target="_blank" rel="noopener">
        <span class="insta-follow__avatar"><img src="${asset("img/escudo.png")}" alt=""></span>
        <span class="insta-follow__txt"><b>@meldinafc</b><span>Escalações, gols, bastidores e as artes oficiais do Meldina FC. Muito além do jogo.</span></span>
        <span class="btn">${I.ig} Seguir no Instagram</span></a>`;
    };
    const embeds = () => {
      const urls = (typeof INSTAGRAM_POSTS !== "undefined" ? INSTAGRAM_POSTS : []).slice(0, Math.min(n, 4));
      if (!urls.length) return follow();
      el.classList.add("insta-grid--embeds");
      el.innerHTML = urls.map((u) => `<blockquote class="instagram-media" data-instgrm-permalink="${esc(u)}" data-instgrm-version="14"><a href="${esc(u)}" target="_blank" rel="noopener">Ver esta publicação no Instagram</a></blockquote>`).join("");
      const sc = document.createElement("script"); sc.async = true; sc.src = "https://www.instagram.com/embed.js"; document.body.appendChild(sc);
    };
    if (location.protocol === "file:") return embeds();
    try {
      const ctrl = new AbortController(); setTimeout(() => ctrl.abort(), 6000);
      const r = await fetch("/api/instagram", { signal: ctrl.signal });
      if (!r.ok) return embeds();
      const data = await r.json();
      const posts = (data.posts || []).filter((p) => p.image).slice(0, n);
      if (!posts.length) return embeds();
      el.innerHTML = posts.map((p) => `<a class="insta" href="${esc(p.permalink || MFC.instagram)}" target="_blank" rel="noopener" aria-label="${esc((p.caption || "Ver no Instagram").slice(0, 80))}"><img src="${esc(p.image)}" alt="" loading="lazy">${
        p.type === "VIDEO" ? `<span class="insta__badge">${I.play}</span>` : p.type === "CAROUSEL_ALBUM" ? `<span class="insta__badge">${I.tag}</span>` : ""}${I.ig}</a>`).join("");
      const live = $("#instaLive");
      if (live) live.hidden = false;
    } catch (e) { embeds(); }
  }

  function renderTrophies() {
    const el = $("#trophies");
    if (!el) return;
    el.innerHTML = TROPHIES.map((t) => `<article class="trophy reveal">
      <div class="trophy__art">${TROPHY_SVG}<span class="trophy__count">${t.anos.length}×</span></div>
      <div class="trophy__body"><p class="eyebrow">${t.comp}</p><h3 class="display">Campeão ${t.titulo}</h3>
        <div class="trophy__years">${t.anos.map((y) => `<span>${y}</span>`).join("")}</div><p>${t.desc}</p>
        <a class="link-arrow" href="noticia.html?id=campeao-serie-b">Relembre a conquista ${I.arrow}</a></div></article>`).join("");
  }
  const TROPHY_SVG = `<svg viewBox="0 0 120 150" aria-hidden="true"><defs><linearGradient id="gold" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#ffe08a"/><stop offset=".45" stop-color="#efaa19"/><stop offset="1" stop-color="#9a6a06"/></linearGradient></defs>
    <path d="M30 14h60v30c0 22-13 38-30 42-17-4-30-20-30-42Z" fill="url(#gold)"/>
    <path d="M30 22H14c0 20 8 30 20 32M90 22h16c0 20-8 30-20 32" fill="none" stroke="url(#gold)" stroke-width="6" stroke-linecap="round"/>
    <path d="M54 86h12v22H54Z" fill="url(#gold)"/><path d="M38 108h44l6 16H32Z" fill="url(#gold)"/><rect x="26" y="124" width="68" height="16" rx="2" fill="#5a000a"/>
    <path d="m46 4 6 8 8-9 8 9 6-8v10H46Z" fill="url(#gold)"/><text x="60" y="54" text-anchor="middle" font-family="Cinzel, serif" font-weight="700" font-size="26" fill="#5a000a">B</text></svg>`;

  function renderSquadPage() {
    const el = $("#squad");
    if (!el) return;
    const groups = ["Goleiros", "Defensores", "Meio-campistas", "Atacantes"];
    const draw = (filter) => {
      el.innerHTML = groups.filter((g) => filter === "Todos" || g === filter).map((g) => {
        const ps = PLAYERS.filter((p) => p.grupo === g).sort((a, b) => a.num - b.num);
        return `<div class="group-title"><h2 class="display">${g}</h2><span>${ps.length} ${ps.length > 1 ? "JOGADORES" : "JOGADOR"}</span></div>
          <div class="squad-grid">${ps.map(playerCard).join("")}</div>`;
      }).join("");
      observeReveal();
    };
    draw("Todos");
    $$("#squadTabs .tab").forEach((t) => t.addEventListener("click", () => {
      $$("#squadTabs .tab").forEach((x) => x.classList.toggle("is-active", x === t));
      draw(t.dataset.f);
    }));
  }

  function renderGamesPage() {
    const el = $("#fixtures");
    if (!el) return;
    const nx = nextFixture();
    const draw = (mode) => {
      let list = FIXTURES.filter((f) => (mode === "res" ? f.placar : !f.placar));
      if (mode === "res") list = list.reverse();
      el.innerHTML = list.map((f) => fxRow(f, f === nx)).join("");
      observeReveal();
    };
    draw("cal");
    $$("#fxTabs .tab").forEach((t) => t.addEventListener("click", () => {
      $$("#fxTabs .tab").forEach((x) => x.classList.toggle("is-active", x === t));
      draw(t.dataset.f);
    }));
    const tb = $("#standings");
    if (tb) tb.innerHTML = standingsRows();
  }

  function renderNewsPage() {
    const el = $("#newsList");
    if (!el) return;
    const all = newsSorted();
    const draw = (tag) => {
      const list = tag === "Todas" ? all : all.filter((n) => n.tag === tag);
      el.innerHTML = list.map((n, i) => newsCard(n, i === 0 && tag === "Todas", i)).join("");
      observeReveal();
    };
    draw("Todas");
    $$("#newsTabs .tab").forEach((t) => t.addEventListener("click", () => {
      $$("#newsTabs .tab").forEach((x) => x.classList.toggle("is-active", x === t));
      draw(t.dataset.f);
    }));
  }

  function renderArticle() {
    const root = $("#article");
    if (!root) return;
    const id = new URLSearchParams(location.search).get("id");
    const n = NEWS.find((x) => x.id === id) || newsSorted()[0];
    document.title = `${n.titulo} | Meldina FC`;
    $("#artImg").src = asset(n.img);
    if (n.pos) $("#artImg").style.objectPosition = n.pos;
    if (n.poster) {
      root.classList.add("is-poster");
      $("#artPoster").innerHTML = `<img src="${asset(n.img)}" alt="${esc(n.titulo)}">`;
    }
    $("#artTag").textContent = n.tag;
    $("#artTag").className = `news-card__tag ${tagClass(n.tag)}`;
    $("#artTitle").textContent = n.titulo;
    $("#artDate").textContent = `${fmtLong(n.data)}`;
    $("#artBody").innerHTML = n.corpo.map((p) => {
      if (p.startsWith("QUOTE:")) { const [q, c] = p.slice(6).split("|"); return `<blockquote>“${q}”<cite>${c}</cite></blockquote>`; }
      if (p.startsWith("LIST:")) return `<ol class="article-list">${p.slice(5).split("|").map((x) => `<li>${x}</li>`).join("")}</ol>`;
      if (p.startsWith("SIGN:")) return `<p class="article-sign">${p.slice(5).split("|").join("<br>")}</p>`;
      if (p.startsWith("IMG:")) { const [src, cap] = p.slice(4).split("|"); return `<figure class="article-fig"><img src="${asset(src)}" alt="${esc(cap || "")}" loading="lazy">${cap ? `<figcaption>${cap}</figcaption>` : ""}</figure>`; }
      if (p === p.toUpperCase() && p.length < 60) return `<p class="article-kicker">${p}</p>`;
      return `<p>${p}</p>`;
    }).join("");
    const more = newsSorted().filter((x) => x.id !== n.id).slice(0, 3);
    $("#artMore").innerHTML = more.map((m, i) => newsCard(m, false, i)).join("");
  }

  function renderShop() {
    const el = $("#products");
    if (!el) return;
    const draw = (cat) => {
      const list = cat === "Todos" ? PRODUCTS : PRODUCTS.filter((p) => p.cat === cat);
      el.innerHTML = list.map((p, i) => `<article class="product reveal reveal-d${i % 4}">
        <div class="product__img" style="${p.bg ? `background:${p.bg}` : ""}">
          ${p.img ? `<img class="photo" src="${asset(p.img)}" alt="${p.nome}" loading="lazy">` : `<img class="art" src="${asset(p.art)}" alt="${p.nome}" loading="lazy">`}
          ${p.badge ? `<span class="product__badge">${p.badge}</span>` : ""}
        </div>
        <div class="product__body">
          <span class="product__cat">${p.cat}</span>
          <span class="product__name">${p.nome}</span>
          ${p.tam ? `<div class="sizes" data-sizes>${["P", "M", "G", "GG", "XG"].map((s, i) => `<button type="button" class="${i === 1 ? "is-active" : ""}">${s}</button>`).join("")}</div>` : ""}
          <span class="product__price">${BRL(p.preco)}<small>ou 6x de ${BRL(p.preco / 6)} sem juros</small></span>
          <button class="btn btn--dark btn--sm btn--block" data-add="${p.id}">${I.bag} Adicionar</button>
        </div></article>`).join("");
      observeReveal();
    };
    draw("Todos");
    $$("#shopTabs .tab").forEach((t) => t.addEventListener("click", () => {
      $$("#shopTabs .tab").forEach((x) => x.classList.toggle("is-active", x === t));
      draw(t.dataset.f);
    }));
  }

  /* ---------------- Hero slider ---------------- */
  function heroSlider() {
    const hero = $("#hero");
    if (!hero) return;
    const slides = $$(".hero__slide", hero), tabs = $$(".hero__tab", hero);
    let i = 0, timer;
    const go = (n) => {
      i = (n + slides.length) % slides.length;
      slides.forEach((s, k) => s.classList.toggle("is-active", k === i));
      tabs.forEach((t, k) => { t.classList.remove("is-active"); void t.offsetWidth; t.classList.toggle("is-active", k === i); });
      clearTimeout(timer); timer = setTimeout(() => go(i + 1), 7000);
    };
    tabs.forEach((t, k) => t.addEventListener("click", () => go(k)));
    go(0);
  }

  /* ---------------- Revelação ---------------- */
  let io;
  function observeReveal() {
    if (!("IntersectionObserver" in window)) { $$(".reveal").forEach((e) => e.classList.add("is-in")); return; }
    io = io || new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } }), { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    $$(".reveal:not(.is-in)").forEach((e) => io.observe(e));
  }

  /* ---------------- Eventos globais ---------------- */
  function bindGlobal() {
    const burger = $("#burger");
    burger.addEventListener("click", () => {
      document.documentElement.style.setProperty("--nav-top", $("#header").getBoundingClientRect().bottom + "px");
      const open = document.body.classList.toggle("nav-open");
      burger.setAttribute("aria-expanded", String(open));
      document.body.style.overflow = open ? "hidden" : "";
    });

    document.addEventListener("click", (e) => {
      const t = e.target.closest("button, a, [data-close]");
      if (!t) return;
      if (t.matches("[data-close]")) { if (t.closest("#cart")) openCart(false); else closeModal(); return; }
      if (t.id === "cartBtn") return openCart(true);
      if (t.dataset.player) return openPlayer(t.dataset.player);
      if (t.dataset.ticket) return ticketModal(t.dataset.ticket);
      if (t.dataset.plan) {
        const sel = $("#s-plano");
        if (sel) [...sel.options].forEach((o) => (o.selected = o.text.startsWith(t.dataset.plan)));
        return;
      }
      if (t.dataset.remind) return toast("Lembrete ativado", "Avisaremos você antes da partida.", I.check);
      if (t.dataset.add) {
        const card = t.closest(".product");
        const s = card && $(".sizes .is-active", card);
        return addToCart(t.dataset.add, s ? s.textContent : null);
      }
      if (t.closest("[data-sizes]")) { $$("button", t.parentElement).forEach((b) => b.classList.toggle("is-active", b === t)); return; }
      if (t.dataset.q) { const l = cart.find((x) => x.key === t.dataset.k); l.q += +t.dataset.q; if (l.q <= 0) cart = cart.filter((x) => x !== l); return saveCart(); }
      if (t.dataset.rm) { cart = cart.filter((x) => x.key !== t.dataset.rm); return saveCart(); }
      if (t.id === "checkout") {
        return fakeLoad(t, () => { cart = []; saveCart(); openCart(false); toast("Pedido confirmado!", "Demonstração: nenhum pagamento foi processado.", I.bag); });
      }
      if (t.dataset.share !== undefined) {
        e.preventDefault();
        try { navigator.clipboard.writeText(location.href); } catch (err) {}
        return toast("Link copiado", "Compartilhe com a torcida!", I.link);
      }
      if (t.hasAttribute("data-soon")) { e.preventDefault(); return toast("Em breve", "Esta página está sendo preparada.", I.star); }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") { closeModal(); openCart(false); }
    });

    const header = $("#header");
    const onScroll = () => {
      const h = document.documentElement;
      header.style.setProperty("--progress", (h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight)).toFixed(3));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* Títulos em fonte condensada: remove acentos (´ ` ^ ~) que colidem com as linhas vizinhas */
  const stripMarks = (root) => {
    $$(".display:not([data-keep-marks])", root).forEach((el) => {
      const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      while (w.nextNode()) { const t = w.currentNode; const v = t.nodeValue.normalize("NFD").replace(/[\u0300-\u0326\u0328-\u036f]/g, "").normalize("NFC"); if (v !== t.nodeValue) t.nodeValue = v; }
    });
  };
  new MutationObserver((ms) => ms.forEach((m) => m.addedNodes.forEach((nd) => nd.nodeType === 1 && stripMarks(nd.parentNode || nd)))).observe(document.body, { childList: true, subtree: true });

  /* ---------------- Início ---------------- */
  renderChrome();
  renderHome();
  renderHomeTV();
  renderVideos("#videos", VIDEOS);
  renderInsta();
  renderTrophies();
  renderSquadPage();
  renderGamesPage();
  renderNewsPage();
  renderArticle();
  renderShop();
  renderCart();
  heroSlider();
  bindGlobal();
  bindFakeForms();
  $$(".countdown[data-to]").forEach(countdown);
  $$("[data-icon]").forEach((el) => (el.innerHTML = I[el.dataset.icon] || ""));
  $$("[data-trophy]").forEach((el) => (el.innerHTML = TROPHY_SVG));
  stripMarks(document);
  observeReveal();
})();
