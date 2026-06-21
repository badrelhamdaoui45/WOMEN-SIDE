/**
 * Women Side - Standalone Menu Fix
 * Makes Elementor Mega Menu work as a pure static site (no WordPress backend needed)
 */
(function () {
  'use strict';

  function initMenu() {
    /* ── 1. Mobile hamburger toggle ── */
    var toggleBtn = document.querySelector('.e-n-menu-toggle');
    var menuWrapper = document.querySelector('.e-n-menu-wrapper');
    if (toggleBtn && menuWrapper) {
      toggleBtn.addEventListener('click', function () {
        var expanded = toggleBtn.getAttribute('aria-expanded') === 'true';
        toggleBtn.setAttribute('aria-expanded', String(!expanded));
        menuWrapper.classList.toggle('e-n-menu-wrapper--open', !expanded);
      });
    }

    /* ── 2. Desktop hover + mobile click on each menu item ── */
    var items = document.querySelectorAll('.e-n-menu-item');
    var isMobile = function () { return window.innerWidth < 1025; };

    items.forEach(function (item) {
      var titleEl  = item.querySelector('.e-n-menu-title');
      var contentEl = item.querySelector('.e-n-menu-content');
      var dropBtn  = item.querySelector('.e-n-menu-dropdown-icon');

      if (!titleEl || !contentEl) return;

      function openItem() {
        item.classList.add('e-n-menu-item--active');
        contentEl.classList.add('e-n-menu-content--visible');
        if (dropBtn) dropBtn.setAttribute('aria-expanded', 'true');
      }
      function closeItem() {
        item.classList.remove('e-n-menu-item--active');
        contentEl.classList.remove('e-n-menu-content--visible');
        if (dropBtn) dropBtn.setAttribute('aria-expanded', 'false');
      }
      function closeAll() {
        items.forEach(function (i) {
          i.classList.remove('e-n-menu-item--active');
          var c = i.querySelector('.e-n-menu-content');
          if (c) c.classList.remove('e-n-menu-content--visible');
          var b = i.querySelector('.e-n-menu-dropdown-icon');
          if (b) b.setAttribute('aria-expanded', 'false');
        });
      }

      /* Desktop: hover */
      item.addEventListener('mouseenter', function () {
        if (!isMobile()) { closeAll(); openItem(); }
      });
      item.addEventListener('mouseleave', function () {
        if (!isMobile()) { closeItem(); }
      });

      /* Mobile / click on title row */
      titleEl.addEventListener('click', function () {
        if (isMobile()) {
          var isOpen = item.classList.contains('e-n-menu-item--active');
          closeAll();
          if (!isOpen) openItem();
        }
      });

      /* Dropdown chevron button */
      if (dropBtn) {
        dropBtn.addEventListener('click', function (e) {
          e.stopPropagation();
          var isOpen = item.classList.contains('e-n-menu-item--active');
          closeAll();
          if (!isOpen) openItem();
        });
      }
    });

    /* ── 3. Close menu when clicking outside ── */
    document.addEventListener('click', function (e) {
      var menu = document.querySelector('.e-n-menu');
      if (menu && !menu.contains(e.target)) {
        items.forEach(function (item) {
          item.classList.remove('e-n-menu-item--active');
          var c = item.querySelector('.e-n-menu-content');
          if (c) c.classList.remove('e-n-menu-content--visible');
          var b = item.querySelector('.e-n-menu-dropdown-icon');
          if (b) b.setAttribute('aria-expanded', 'false');
        });
      }
    });

    /* ── 4. Fix broken internal links (index.html@p=XXXX.html style) ── */
    var pageMap = {
      'index.html@p=14401.html': 'qui-sommes-nous/',
      'index.html@p=14402.html': 'qui-sommes-nous/',
      'index.html@p=14404.html': 'transparence/',
      'index.html@p=14406.html': 'equipe-gouvernance/',
      'index.html@p=14408.html': 'publications-observatoires/',
      'index.html@p=14410.html': 'vision-impact/',
      'index.html@p=14412.html': 'nous-rejoindre/',
      'index.html@p=14414.html': 'faire-un-don/',
      'index.html@p=14416.html': 'se-former/',
      'index.html@p=14418.html': 'presse-medias/',
      'index.html@p=14420.html': 'legs-donation/',
      'index.html@p=14422.html': 'nous-contacter/',
      'index.html@p=14424.html': 'numeros-utiles/',
      'index.html@p=14426.html': 'participer-a-un-evenement/',
      'index.html@p=14428.html': 'agir-avec-nous-devenir-benevole/',
      'index.html@p=14430.html': 'agir-avec-nous-mobiliser-son-entreprise/',
      'index.html@p=14432.html': 'agir-avec-nous-lancer-une-collecte/',
      'index.html@p=14434.html': 'emancipation-economique-femmes/',
      'index.html@p=14436.html': 'defendre-droits-femmes/',
      'index.html@p=14438.html': 'soutenir-femmes-victimes-violences/',
      'index.html@p=14440.html': 'mobiliser-societe-egalite/',
      'index.html@p=14444.html': 'combats-securiser-un-reseau-associatif-fort/',
      'index.html@p=14446.html': 'mobiliser-son-entreprise/',
      'index.html@p=14454.html': 'actualites/',
      'index.html@p=14456.html': 'articles-publications/',
      'index.html@p=14460.html': 'temoignages/',
      'index.html@p=14463.html': 'faq-guides-pratiques/',
      'index.html@p=14482.html': 'faire-un-don/',
      'index.html@p=16718.html': 'espace-mecene/',
      'index.html@p=20213.html': 'espace-benevole/',
    };

    document.querySelectorAll('a[href]').forEach(function (a) {
      var href = a.getAttribute('href');
      if (href && pageMap[href]) {
        a.setAttribute('href', pageMap[href]);
      }
      // Fix any remaining absolute localhost URLs
      if (href && href.includes('fondationdesfemmes.org')) {
        var relative = href.replace(/https?:\/\/fondationdesfemmes\.org\//g, '/');
        a.setAttribute('href', relative);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMenu);
  } else {
    initMenu();
  }
})();
