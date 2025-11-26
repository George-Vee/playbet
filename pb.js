// pb.js
(function () {
  'use strict';

  /* =========================
     HERO CAROUSEL (TOP BANNER)
     ========================= */
  function initHeroCarousel(root) {
    const track = root.querySelector('#veeaardvark-bannerSlides');
    const slides = Array.from(track ? track.children : []);
    const prevBtn = root.querySelector('[data-car-prev]');
    const nextBtn = root.querySelector('[data-car-next]');
    const dotsContainer = root.querySelector('#veeaardvark-bannerDots');
    const dots = dotsContainer ? Array.from(dotsContainer.children) : [];

    if (!track || slides.length === 0) return;

    let index = 0;
    let autoplayId = null;
    const AUTOPLAY_MS = 7000;

    // Basic track layout
    track.style.display = 'flex';
    track.style.transition = 'transform 0.5s ease';
    slides.forEach(function (slide) {
      slide.style.flex = '0 0 100%';
    });

    function update() {
      const width = root.clientWidth || track.clientWidth || 0;
      const offset = -index * width;
      track.style.transform = 'translateX(' + offset + 'px)';

      // Dots state
      dots.forEach(function (dot, i) {
        dot.setAttribute('aria-current', i === index ? 'true' : 'false');
      });
    }

    function goTo(newIndex) {
      if (!slides.length) return;
      if (newIndex < 0) newIndex = slides.length - 1;
      if (newIndex >= slides.length) newIndex = 0;
      index = newIndex;
      update();
    }

    function startAutoplay() {
      if (!AUTOPLAY_MS) return;
      stopAutoplay();
      autoplayId = window.setInterval(function () {
        goTo(index + 1);
      }, AUTOPLAY_MS);
    }

    function stopAutoplay() {
      if (autoplayId) {
        window.clearInterval(autoplayId);
        autoplayId = null;
      }
    }

    function resetAutoplay() {
      stopAutoplay();
      startAutoplay();
    }

    // Events
    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        goTo(index - 1);
        resetAutoplay();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        goTo(index + 1);
        resetAutoplay();
      });
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        goTo(i);
        resetAutoplay();
      });
    });

    window.addEventListener('resize', function () {
      update();
    });

    // Initial
    goTo(0);
    startAutoplay();
  }

  /* =========================
     GENERIC CAROUSELS (.vee-slider)
     ========================= */
  function initVeeSlider(slider) {
    const viewport = slider.querySelector('.vee-slider-viewport');
    const track = slider.querySelector('.vee-slider-track');
    const cards = Array.from(slider.querySelectorAll('.vee-slider-card'));
    const prevBtn = slider.querySelector('[data-slider-prev]');
    const nextBtn = slider.querySelector('[data-slider-next]');

    if (!viewport || !track || cards.length === 0) return;

    let visibleCount = 1;
    let index = 0;

    track.style.display = 'flex';
    track.style.transition = 'transform 0.4s ease';

    function measure() {
      const viewportWidth = viewport.clientWidth || 0;
      // Default: show as many as fit, at least 1
      const cardWidth = cards[0].getBoundingClientRect().width || viewportWidth;
      if (cardWidth > 0) {
        visibleCount = Math.max(1, Math.round(viewportWidth / cardWidth));
      } else {
        visibleCount = 1;
      }

      // Make cards share the row equally
      const widthPercent = 100 / visibleCount;
      cards.forEach(function (card) {
        card.style.flex = '0 0 ' + widthPercent + '%';
      });

      clampIndex();
      applyTransform();
    }

    function maxIndex() {
      return Math.max(0, cards.length - visibleCount);
    }

    function clampIndex() {
      index = Math.min(maxIndex(), Math.max(0, index));
    }

    function applyTransform() {
      const offsetPercent = -(index * (100 / visibleCount));
      track.style.transform = 'translateX(' + offsetPercent + '%)';
    }

    function move(delta) {
      index += delta;
      clampIndex();
      applyTransform();
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        move(-1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        move(1);
      });
    }

    window.addEventListener('resize', measure);

    // Initial
    measure();
  }

  /* =========================
     BOOTSTRAP ON DOM READY
     ========================= */
  document.addEventListener('DOMContentLoaded', function () {
    var hero = document.querySelector('.veeaardvark-carousel');
    if (hero) initHeroCarousel(hero);

    var sliders = document.querySelectorAll('.vee-slider');
    sliders.forEach(function (slider) {
      initVeeSlider(slider);
    });
  });
})();
