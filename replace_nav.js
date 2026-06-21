const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname);

// ─── The full standalone nav HTML (pure CSS + JS, zero Elementor dependency) ───
const NAV_HTML = `
<!-- ===== WOMEN SIDE — STANDALONE NAVIGATION ===== -->
<style id="ws-nav-styles">
  /* Google Font */
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

  #ws-header {
    position: sticky;
    top: 0;
    z-index: 99999;
    background: #fff;
    box-shadow: 0 2px 16px rgba(0,0,0,.08);
    font-family: 'Inter', sans-serif;
  }
  #ws-nav-inner {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 24px;
    height: 72px;
    display: flex;
    align-items: center;
    gap: 0;
  }
  /* Logo */
  #ws-logo { flex-shrink: 0; margin-right: 32px; }
  #ws-logo img { height: 52px; width: auto; display: block; }

  /* Desktop menu */
  #ws-menu {
    display: flex;
    align-items: center;
    list-style: none;
    margin: 0;
    padding: 0;
    gap: 4px;
    flex: 1;
  }
  .ws-item { position: relative; }
  .ws-trigger {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 8px 14px;
    font-size: 15px;
    font-weight: 600;
    color: #1e1e2e;
    cursor: pointer;
    border-radius: 8px;
    border: none;
    background: none;
    white-space: nowrap;
    transition: color .2s, background .2s;
    font-family: inherit;
    text-decoration: none;
  }
  .ws-trigger:hover, .ws-item.open .ws-trigger {
    color: #714ffc;
    background: #f5f2ff;
  }
  .ws-trigger svg { transition: transform .2s; }
  .ws-item.open .ws-trigger svg { transform: rotate(180deg); }

  /* Dropdown panel */
  .ws-dropdown {
    display: none;
    position: absolute;
    top: calc(100% + 8px);
    left: 50%;
    transform: translateX(-50%);
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 12px 48px rgba(0,0,0,.14);
    padding: 24px;
    min-width: 420px;
    z-index: 99999;
    animation: wsFadeIn .18s ease;
  }
  .ws-item.open .ws-dropdown { display: block; }
  @keyframes wsFadeIn {
    from { opacity:0; transform: translateX(-50%) translateY(-8px); }
    to   { opacity:1; transform: translateX(-50%) translateY(0); }
  }
  .ws-dropdown-title {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: .1em;
    color: #999;
    margin: 0 0 12px;
  }
  .ws-dropdown-links {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .ws-dropdown-links a {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 14px;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 500;
    color: #1e1e2e;
    text-decoration: none;
    transition: background .15s, color .15s;
  }
  .ws-dropdown-links a:hover {
    background: #f5f2ff;
    color: #714ffc;
  }
  .ws-dropdown-links a svg { opacity: .4; flex-shrink: 0; }
  .ws-dropdown-links a:hover svg { opacity: 1; }
  .ws-dropdown-cols {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }
  .ws-col-title {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: .1em;
    padding: 4px 14px 8px;
    color: #714ffc;
  }

  /* Right-side buttons */
  #ws-nav-right {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-left: auto;
    flex-shrink: 0;
  }
  .ws-btn-donate {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: #714ffc;
    color: #fff !important;
    padding: 10px 20px;
    border-radius: 999px;
    font-weight: 700;
    font-size: 14px;
    text-decoration: none;
    transition: background .2s, transform .15s;
  }
  .ws-btn-donate:hover { background: #5a3de0; transform: translateY(-1px); }
  .ws-btn-contact {
    display: inline-flex;
    align-items: center;
    padding: 10px 20px;
    border-radius: 999px;
    font-weight: 600;
    font-size: 14px;
    color: #714ffc !important;
    border: 2px solid #714ffc;
    text-decoration: none;
    transition: background .2s;
  }
  .ws-btn-contact:hover { background: #f5f2ff; }

  /* Hamburger (mobile) */
  #ws-hamburger {
    display: none;
    flex-direction: column;
    gap: 5px;
    cursor: pointer;
    margin-left: auto;
    border: none;
    background: none;
    padding: 8px;
  }
  #ws-hamburger span {
    display: block;
    width: 24px;
    height: 2px;
    background: #1e1e2e;
    border-radius: 2px;
    transition: all .25s;
  }
  #ws-hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
  #ws-hamburger.open span:nth-child(2) { opacity: 0; }
  #ws-hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

  /* Mobile drawer */
  #ws-mobile-menu {
    display: none;
    position: fixed;
    inset: 0;
    background: #fff;
    z-index: 999998;
    overflow-y: auto;
    padding: 80px 24px 40px;
    flex-direction: column;
    gap: 0;
  }
  #ws-mobile-menu.open { display: flex; }
  .ws-mobile-item { border-bottom: 1px solid #f0f0f0; }
  .ws-mobile-trigger {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 16px 0;
    font-size: 17px;
    font-weight: 700;
    color: #1e1e2e;
    background: none;
    border: none;
    cursor: pointer;
    font-family: inherit;
    text-align: left;
  }
  .ws-mobile-trigger svg { flex-shrink: 0; transition: transform .2s; }
  .ws-mobile-item.open .ws-mobile-trigger svg { transform: rotate(180deg); color: #714ffc; }
  .ws-mobile-item.open .ws-mobile-trigger { color: #714ffc; }
  .ws-mobile-sub {
    display: none;
    padding: 0 0 16px 0;
    flex-direction: column;
    gap: 2px;
  }
  .ws-mobile-item.open .ws-mobile-sub { display: flex; }
  .ws-mobile-sub a {
    padding: 10px 16px;
    border-radius: 10px;
    font-size: 15px;
    font-weight: 500;
    color: #1e1e2e;
    text-decoration: none;
    display: block;
  }
  .ws-mobile-sub a:hover { background: #f5f2ff; color: #714ffc; }
  .ws-mobile-btns { display: flex; gap: 12px; flex-wrap: wrap; padding: 24px 0; }
  .ws-mobile-btns a { flex: 1; text-align: center; }

  @media (max-width: 1024px) {
    #ws-menu, #ws-nav-right { display: none; }
    #ws-hamburger { display: flex; }
  }
  @media (min-width: 1025px) {
    #ws-mobile-menu { display: none !important; }
  }

  /* Arrow SVG inline shorthand */
  .ws-arrow { width:14px; height:14px; }
  .ws-chevron { width:16px; height:16px; }
</style>

<header id="ws-header">
  <div id="ws-nav-inner">
    <!-- Logo -->
    <div id="ws-logo">
      <a href="/">
        <img src="/wp-content/uploads/2026/02/FDF-LOGO-ALT_SVG.svg" alt="Women Side" width="180" height="86">
      </a>
    </div>

    <!-- Desktop menu -->
    <ul id="ws-menu" role="menubar">

      <!-- La Fondation -->
      <li class="ws-item" role="none">
        <button class="ws-trigger" aria-haspopup="true" aria-expanded="false">
          La Fondation
          <svg class="ws-chevron" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
        </button>
        <div class="ws-dropdown">
          <div class="ws-dropdown-title">La Fondation</div>
          <div class="ws-dropdown-links">
            <a href="/qui-sommes-nous/">Qui sommes-nous ? <svg class="ws-arrow" fill="currentColor" viewBox="0 0 448 512"><path d="M190.5 66.9l22.2-22.2c9.4-9.4 24.6-9.4 33.9 0L441 239c9.4 9.4 9.4 24.6 0 33.9L246.6 467.3c-9.4 9.4-24.6 9.4-33.9 0l-22.2-22.2c-9.5-9.5-9.3-25 .4-34.3L311.4 296H24c-13.3 0-24-10.7-24-24v-32c0-13.3 10.7-24 24-24h287.4L190.9 101.2c-9.8-9.3-10-24.8-.4-34.3z"/></svg></a>
            <a href="/equipe-gouvernance/">Équipe et Gouvernance <svg class="ws-arrow" fill="currentColor" viewBox="0 0 448 512"><path d="M190.5 66.9l22.2-22.2c9.4-9.4 24.6-9.4 33.9 0L441 239c9.4 9.4 9.4 24.6 0 33.9L246.6 467.3c-9.4 9.4-24.6 9.4-33.9 0l-22.2-22.2c-9.5-9.5-9.3-25 .4-34.3L311.4 296H24c-13.3 0-24-10.7-24-24v-32c0-13.3 10.7-24 24-24h287.4L190.9 101.2c-9.8-9.3-10-24.8-.4-34.3z"/></svg></a>
            <a href="/transparence/">Transparence <svg class="ws-arrow" fill="currentColor" viewBox="0 0 448 512"><path d="M190.5 66.9l22.2-22.2c9.4-9.4 24.6-9.4 33.9 0L441 239c9.4 9.4 9.4 24.6 0 33.9L246.6 467.3c-9.4 9.4-24.6 9.4-33.9 0l-22.2-22.2c-9.5-9.5-9.3-25 .4-34.3L311.4 296H24c-13.3 0-24-10.7-24-24v-32c0-13.3 10.7-24 24-24h287.4L190.9 101.2c-9.8-9.3-10-24.8-.4-34.3z"/></svg></a>
            <a href="/publications-observatoires/">Publications &amp; Observatoires <svg class="ws-arrow" fill="currentColor" viewBox="0 0 448 512"><path d="M190.5 66.9l22.2-22.2c9.4-9.4 24.6-9.4 33.9 0L441 239c9.4 9.4 9.4 24.6 0 33.9L246.6 467.3c-9.4 9.4-24.6 9.4-33.9 0l-22.2-22.2c-9.5-9.5-9.3-25 .4-34.3L311.4 296H24c-13.3 0-24-10.7-24-24v-32c0-13.3 10.7-24 24-24h287.4L190.9 101.2c-9.8-9.3-10-24.8-.4-34.3z"/></svg></a>
          </div>
        </div>
      </li>

      <!-- Nos combats -->
      <li class="ws-item" role="none">
        <button class="ws-trigger" aria-haspopup="true" aria-expanded="false">
          Nos combats
          <svg class="ws-chevron" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
        </button>
        <div class="ws-dropdown" style="min-width:520px;">
          <div class="ws-dropdown-title">Les combats de la Fondation</div>
          <div class="ws-dropdown-links">
            <a href="/soutenir-femmes-victimes-violences/">Soutenir les femmes victimes de violences <svg class="ws-arrow" fill="currentColor" viewBox="0 0 448 512"><path d="M190.5 66.9l22.2-22.2c9.4-9.4 24.6-9.4 33.9 0L441 239c9.4 9.4 9.4 24.6 0 33.9L246.6 467.3c-9.4 9.4-24.6 9.4-33.9 0l-22.2-22.2c-9.5-9.5-9.3-25 .4-34.3L311.4 296H24c-13.3 0-24-10.7-24-24v-32c0-13.3 10.7-24 24-24h287.4L190.9 101.2c-9.8-9.3-10-24.8-.4-34.3z"/></svg></a>
            <a href="/defendre-droits-femmes/">Défendre les droits des femmes <svg class="ws-arrow" fill="currentColor" viewBox="0 0 448 512"><path d="M190.5 66.9l22.2-22.2c9.4-9.4 24.6-9.4 33.9 0L441 239c9.4 9.4 9.4 24.6 0 33.9L246.6 467.3c-9.4 9.4-24.6 9.4-33.9 0l-22.2-22.2c-9.5-9.5-9.3-25 .4-34.3L311.4 296H24c-13.3 0-24-10.7-24-24v-32c0-13.3 10.7-24 24-24h287.4L190.9 101.2c-9.8-9.3-10-24.8-.4-34.3z"/></svg></a>
            <a href="/emancipation-economique-femmes/">Œuvrer pour l'émancipation économique <svg class="ws-arrow" fill="currentColor" viewBox="0 0 448 512"><path d="M190.5 66.9l22.2-22.2c9.4-9.4 24.6-9.4 33.9 0L441 239c9.4 9.4 9.4 24.6 0 33.9L246.6 467.3c-9.4 9.4-24.6 9.4-33.9 0l-22.2-22.2c-9.5-9.5-9.3-25 .4-34.3L311.4 296H24c-13.3 0-24-10.7-24-24v-32c0-13.3 10.7-24 24-24h287.4L190.9 101.2c-9.8-9.3-10-24.8-.4-34.3z"/></svg></a>
            <a href="/mobiliser-societe-egalite/">Mobiliser la société pour l'égalité <svg class="ws-arrow" fill="currentColor" viewBox="0 0 448 512"><path d="M190.5 66.9l22.2-22.2c9.4-9.4 24.6-9.4 33.9 0L441 239c9.4 9.4 9.4 24.6 0 33.9L246.6 467.3c-9.4 9.4-24.6 9.4-33.9 0l-22.2-22.2c-9.5-9.5-9.3-25 .4-34.3L311.4 296H24c-13.3 0-24-10.7-24-24v-32c0-13.3 10.7-24 24-24h287.4L190.9 101.2c-9.8-9.3-10-24.8-.4-34.3z"/></svg></a>
            <a href="/combats-securiser-un-reseau-associatif-fort/">Sécuriser un réseau associatif fort <svg class="ws-arrow" fill="currentColor" viewBox="0 0 448 512"><path d="M190.5 66.9l22.2-22.2c9.4-9.4 24.6-9.4 33.9 0L441 239c9.4 9.4 9.4 24.6 0 33.9L246.6 467.3c-9.4 9.4-24.6 9.4-33.9 0l-22.2-22.2c-9.5-9.5-9.3-25 .4-34.3L311.4 296H24c-13.3 0-24-10.7-24-24v-32c0-13.3 10.7-24 24-24h287.4L190.9 101.2c-9.8-9.3-10-24.8-.4-34.3z"/></svg></a>
          </div>
        </div>
      </li>

      <!-- Agir avec nous -->
      <li class="ws-item" role="none">
        <button class="ws-trigger" aria-haspopup="true" aria-expanded="false">
          Agir avec nous
          <svg class="ws-chevron" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
        </button>
        <div class="ws-dropdown" style="min-width:480px;">
          <div class="ws-dropdown-cols">
            <div>
              <div class="ws-col-title">Donner</div>
              <div class="ws-dropdown-links">
                <a href="/faire-un-don/">Faire un don <svg class="ws-arrow" fill="currentColor" viewBox="0 0 448 512"><path d="M190.5 66.9l22.2-22.2c9.4-9.4 24.6-9.4 33.9 0L441 239c9.4 9.4 9.4 24.6 0 33.9L246.6 467.3c-9.4 9.4-24.6 9.4-33.9 0l-22.2-22.2c-9.5-9.5-9.3-25 .4-34.3L311.4 296H24c-13.3 0-24-10.7-24-24v-32c0-13.3 10.7-24 24-24h287.4L190.9 101.2c-9.8-9.3-10-24.8-.4-34.3z"/></svg></a>
                <a href="/legs-donation/">Faire un legs / donation <svg class="ws-arrow" fill="currentColor" viewBox="0 0 448 512"><path d="M190.5 66.9l22.2-22.2c9.4-9.4 24.6-9.4 33.9 0L441 239c9.4 9.4 9.4 24.6 0 33.9L246.6 467.3c-9.4 9.4-24.6 9.4-33.9 0l-22.2-22.2c-9.5-9.5-9.3-25 .4-34.3L311.4 296H24c-13.3 0-24-10.7-24-24v-32c0-13.3 10.7-24 24-24h287.4L190.9 101.2c-9.8-9.3-10-24.8-.4-34.3z"/></svg></a>
                <a href="/mobiliser-son-entreprise/">Mobiliser son entreprise <svg class="ws-arrow" fill="currentColor" viewBox="0 0 448 512"><path d="M190.5 66.9l22.2-22.2c9.4-9.4 24.6-9.4 33.9 0L441 239c9.4 9.4 9.4 24.6 0 33.9L246.6 467.3c-9.4 9.4-24.6 9.4-33.9 0l-22.2-22.2c-9.5-9.5-9.3-25 .4-34.3L311.4 296H24c-13.3 0-24-10.7-24-24v-32c0-13.3 10.7-24 24-24h287.4L190.9 101.2c-9.8-9.3-10-24.8-.4-34.3z"/></svg></a>
              </div>
            </div>
            <div>
              <div class="ws-col-title">Participer</div>
              <div class="ws-dropdown-links">
                <a href="/agir-avec-nous-lancer-une-collecte/">Lancer une collecte <svg class="ws-arrow" fill="currentColor" viewBox="0 0 448 512"><path d="M190.5 66.9l22.2-22.2c9.4-9.4 24.6-9.4 33.9 0L441 239c9.4 9.4 9.4 24.6 0 33.9L246.6 467.3c-9.4 9.4-24.6 9.4-33.9 0l-22.2-22.2c-9.5-9.5-9.3-25 .4-34.3L311.4 296H24c-13.3 0-24-10.7-24-24v-32c0-13.3 10.7-24 24-24h287.4L190.9 101.2c-9.8-9.3-10-24.8-.4-34.3z"/></svg></a>
                <a href="/participer-a-un-evenement/">Participer à un évènement <svg class="ws-arrow" fill="currentColor" viewBox="0 0 448 512"><path d="M190.5 66.9l22.2-22.2c9.4-9.4 24.6-9.4 33.9 0L441 239c9.4 9.4 9.4 24.6 0 33.9L246.6 467.3c-9.4 9.4-24.6 9.4-33.9 0l-22.2-22.2c-9.5-9.5-9.3-25 .4-34.3L311.4 296H24c-13.3 0-24-10.7-24-24v-32c0-13.3 10.7-24 24-24h287.4L190.9 101.2c-9.8-9.3-10-24.8-.4-34.3z"/></svg></a>
                <a href="/agir-avec-nous-devenir-benevole/">Devenir bénévole <svg class="ws-arrow" fill="currentColor" viewBox="0 0 448 512"><path d="M190.5 66.9l22.2-22.2c9.4-9.4 24.6-9.4 33.9 0L441 239c9.4 9.4 9.4 24.6 0 33.9L246.6 467.3c-9.4 9.4-24.6 9.4-33.9 0l-22.2-22.2c-9.5-9.5-9.3-25 .4-34.3L311.4 296H24c-13.3 0-24-10.7-24-24v-32c0-13.3 10.7-24 24-24h287.4L190.9 101.2c-9.8-9.3-10-24.8-.4-34.3z"/></svg></a>
                <a href="/se-former/">Se former <svg class="ws-arrow" fill="currentColor" viewBox="0 0 448 512"><path d="M190.5 66.9l22.2-22.2c9.4-9.4 24.6-9.4 33.9 0L441 239c9.4 9.4 9.4 24.6 0 33.9L246.6 467.3c-9.4 9.4-24.6 9.4-33.9 0l-22.2-22.2c-9.5-9.5-9.3-25 .4-34.3L311.4 296H24c-13.3 0-24-10.7-24-24v-32c0-13.3 10.7-24 24-24h287.4L190.9 101.2c-9.8-9.3-10-24.8-.4-34.3z"/></svg></a>
              </div>
            </div>
          </div>
        </div>
      </li>

      <!-- Actualités & Ressources -->
      <li class="ws-item" role="none">
        <button class="ws-trigger" aria-haspopup="true" aria-expanded="false">
          Actualités &amp; Ressources
          <svg class="ws-chevron" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
        </button>
        <div class="ws-dropdown">
          <div class="ws-dropdown-title">Actualités &amp; Ressources</div>
          <div class="ws-dropdown-links">
            <a href="/articles-publications/">Articles et publications <svg class="ws-arrow" fill="currentColor" viewBox="0 0 448 512"><path d="M190.5 66.9l22.2-22.2c9.4-9.4 24.6-9.4 33.9 0L441 239c9.4 9.4 9.4 24.6 0 33.9L246.6 467.3c-9.4 9.4-24.6 9.4-33.9 0l-22.2-22.2c-9.5-9.5-9.3-25 .4-34.3L311.4 296H24c-13.3 0-24-10.7-24-24v-32c0-13.3 10.7-24 24-24h287.4L190.9 101.2c-9.8-9.3-10-24.8-.4-34.3z"/></svg></a>
            <a href="/temoignages/">Témoignages <svg class="ws-arrow" fill="currentColor" viewBox="0 0 448 512"><path d="M190.5 66.9l22.2-22.2c9.4-9.4 24.6-9.4 33.9 0L441 239c9.4 9.4 9.4 24.6 0 33.9L246.6 467.3c-9.4 9.4-24.6 9.4-33.9 0l-22.2-22.2c-9.5-9.5-9.3-25 .4-34.3L311.4 296H24c-13.3 0-24-10.7-24-24v-32c0-13.3 10.7-24 24-24h287.4L190.9 101.2c-9.8-9.3-10-24.8-.4-34.3z"/></svg></a>
            <a href="/observatoire-emancipation-economique-femmes/">Observatoire de l'Émancipation Économique <svg class="ws-arrow" fill="currentColor" viewBox="0 0 448 512"><path d="M190.5 66.9l22.2-22.2c9.4-9.4 24.6-9.4 33.9 0L441 239c9.4 9.4 9.4 24.6 0 33.9L246.6 467.3c-9.4 9.4-24.6 9.4-33.9 0l-22.2-22.2c-9.5-9.5-9.3-25 .4-34.3L311.4 296H24c-13.3 0-24-10.7-24-24v-32c0-13.3 10.7-24 24-24h287.4L190.9 101.2c-9.8-9.3-10-24.8-.4-34.3z"/></svg></a>
            <a href="/faq-guides-pratiques/">FAQ &amp; guides pratiques <svg class="ws-arrow" fill="currentColor" viewBox="0 0 448 512"><path d="M190.5 66.9l22.2-22.2c9.4-9.4 24.6-9.4 33.9 0L441 239c9.4 9.4 9.4 24.6 0 33.9L246.6 467.3c-9.4 9.4-24.6 9.4-33.9 0l-22.2-22.2c-9.5-9.5-9.3-25 .4-34.3L311.4 296H24c-13.3 0-24-10.7-24-24v-32c0-13.3 10.7-24 24-24h287.4L190.9 101.2c-9.8-9.3-10-24.8-.4-34.3z"/></svg></a>
            <a href="/presse-medias/">Presse &amp; médias <svg class="ws-arrow" fill="currentColor" viewBox="0 0 448 512"><path d="M190.5 66.9l22.2-22.2c9.4-9.4 24.6-9.4 33.9 0L441 239c9.4 9.4 9.4 24.6 0 33.9L246.6 467.3c-9.4 9.4-24.6 9.4-33.9 0l-22.2-22.2c-9.5-9.5-9.3-25 .4-34.3L311.4 296H24c-13.3 0-24-10.7-24-24v-32c0-13.3 10.7-24 24-24h287.4L190.9 101.2c-9.8-9.3-10-24.8-.4-34.3z"/></svg></a>
          </div>
        </div>
      </li>
    </ul>

    <!-- Right buttons (desktop) -->
    <div id="ws-nav-right">
      <a href="/faire-un-don/" class="ws-btn-donate">Je donne ♥</a>
      <a href="/nous-contacter/" class="ws-btn-contact">Nous contacter</a>
    </div>

    <!-- Hamburger (mobile) -->
    <button id="ws-hamburger" aria-label="Menu" aria-expanded="false">
      <span></span><span></span><span></span>
    </button>
  </div>
</header>

<!-- Mobile drawer -->
<nav id="ws-mobile-menu" aria-label="Menu mobile">
  <div class="ws-mobile-item">
    <button class="ws-mobile-trigger">La Fondation <svg class="ws-chevron" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg></button>
    <div class="ws-mobile-sub">
      <a href="/qui-sommes-nous/">Qui sommes-nous ?</a>
      <a href="/equipe-gouvernance/">Équipe et Gouvernance</a>
      <a href="/transparence/">Transparence</a>
      <a href="/publications-observatoires/">Publications &amp; Observatoires</a>
    </div>
  </div>
  <div class="ws-mobile-item">
    <button class="ws-mobile-trigger">Nos combats <svg class="ws-chevron" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg></button>
    <div class="ws-mobile-sub">
      <a href="/soutenir-femmes-victimes-violences/">Soutenir les femmes victimes de violences</a>
      <a href="/defendre-droits-femmes/">Défendre les droits des femmes</a>
      <a href="/emancipation-economique-femmes/">Émancipation économique</a>
      <a href="/mobiliser-societe-egalite/">Mobiliser la société pour l'égalité</a>
      <a href="/combats-securiser-un-reseau-associatif-fort/">Sécuriser un réseau associatif fort</a>
    </div>
  </div>
  <div class="ws-mobile-item">
    <button class="ws-mobile-trigger">Agir avec nous <svg class="ws-chevron" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg></button>
    <div class="ws-mobile-sub">
      <a href="/faire-un-don/">Faire un don</a>
      <a href="/legs-donation/">Faire un legs / donation</a>
      <a href="/mobiliser-son-entreprise/">Mobiliser son entreprise</a>
      <a href="/agir-avec-nous-lancer-une-collecte/">Lancer une collecte</a>
      <a href="/participer-a-un-evenement/">Participer à un évènement</a>
      <a href="/agir-avec-nous-devenir-benevole/">Devenir bénévole</a>
      <a href="/se-former/">Se former</a>
    </div>
  </div>
  <div class="ws-mobile-item">
    <button class="ws-mobile-trigger">Actualités &amp; Ressources <svg class="ws-chevron" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg></button>
    <div class="ws-mobile-sub">
      <a href="/articles-publications/">Articles et publications</a>
      <a href="/temoignages/">Témoignages</a>
      <a href="/observatoire-emancipation-economique-femmes/">Observatoire Émancipation Économique</a>
      <a href="/faq-guides-pratiques/">FAQ &amp; guides pratiques</a>
      <a href="/presse-medias/">Presse &amp; médias</a>
    </div>
  </div>
  <div class="ws-mobile-btns">
    <a href="/faire-un-don/" class="ws-btn-donate">Je donne ♥</a>
    <a href="/nous-contacter/" class="ws-btn-contact">Nous contacter</a>
  </div>
</nav>

<script>
(function(){
  // Desktop: hover open/close
  document.querySelectorAll('.ws-item').forEach(function(item){
    var btn = item.querySelector('.ws-trigger');
    item.addEventListener('mouseenter', function(){ item.classList.add('open'); btn && btn.setAttribute('aria-expanded','true'); });
    item.addEventListener('mouseleave', function(){ item.classList.remove('open'); btn && btn.setAttribute('aria-expanded','false'); });
    btn && btn.addEventListener('click', function(){
      var isOpen = item.classList.contains('open');
      document.querySelectorAll('.ws-item').forEach(function(i){ i.classList.remove('open'); var b=i.querySelector('.ws-trigger'); b&&b.setAttribute('aria-expanded','false'); });
      if(!isOpen){ item.classList.add('open'); btn.setAttribute('aria-expanded','true'); }
    });
  });
  // Close on outside click
  document.addEventListener('click', function(e){
    if(!e.target.closest('#ws-menu')){ document.querySelectorAll('.ws-item').forEach(function(i){ i.classList.remove('open'); }); }
  });
  // Hamburger
  var ham = document.getElementById('ws-hamburger');
  var mob = document.getElementById('ws-mobile-menu');
  ham && ham.addEventListener('click', function(){
    var open = mob.classList.toggle('open');
    ham.classList.toggle('open', open);
    ham.setAttribute('aria-expanded', String(open));
  });
  // Mobile accordion
  document.querySelectorAll('.ws-mobile-trigger').forEach(function(btn){
    btn.addEventListener('click', function(){
      var item = btn.closest('.ws-mobile-item');
      var wasOpen = item.classList.contains('open');
      document.querySelectorAll('.ws-mobile-item').forEach(function(i){ i.classList.remove('open'); });
      if(!wasOpen) item.classList.add('open');
    });
  });
})();
</script>
<!-- ===== END WOMEN SIDE NAVIGATION ===== -->
`;

// Regex to find the Elementor header/nav block to replace
// We replace from the opening <header> tag (containing elementor-location-header)
// all the way to its closing </header>
const HEADER_REGEX = /<header[^>]*elementor-location-header[^>]*>[\s\S]*?<\/header>/;

let updated = 0;

function processFile(filePath) {
  let content;
  try { content = fs.readFileSync(filePath, 'utf8'); }
  catch(e) { return; }

  if (!HEADER_REGEX.test(content)) return;

  // Replace the Elementor header with our clean nav
  const newContent = content.replace(HEADER_REGEX, NAV_HTML);

  if (newContent !== content) {
    try { fs.writeFileSync(filePath, newContent, 'utf8'); updated++; }
    catch(e) { console.error('Write error:', filePath); }
  }
}

function walk(dir) {
  let entries;
  try { entries = fs.readdirSync(dir); } catch(e) { return; }
  for (const e of entries) {
    const full = path.join(dir, e);
    let stat; try { stat = fs.statSync(full); } catch(err) { continue; }
    if (stat.isDirectory() && !e.startsWith('.') && e !== 'fondationdesfemmes_download') walk(full);
    else if (stat.isFile() && e.endsWith('.html')) processFile(full);
  }
}

console.log('Replacing Elementor nav with standalone Women Side navigation...');
walk(rootDir);
console.log('Done. Updated:', updated, 'pages.');
