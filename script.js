   const intro      = document.getElementById('intro');
    const pourEl     = document.getElementById('pour-scene');
    const site       = document.getElementById('site');
    const yesBtn     = document.getElementById('yes-btn');
    const screenMug  = document.getElementById('screen-mug');
    

    // ── Intro → Pour → Portfolio ────────────────
    function startPour() {
      intro.classList.add('out');
      setTimeout(() => {
        pourEl.classList.add('visible');
        setTimeout(() => {
          pourEl.classList.add('pouring');
          // Pour done — fade out pour scene, reveal site
          setTimeout(() => {
            pourEl.style.transition = 'opacity 0.8s';
            pourEl.style.opacity = '0';
            site.style.opacity = '1';
            setTimeout(() => { pourEl.style.visibility = 'hidden'; }, 900);
          }, 3800);
        }, 500);
      }, 400);
    }
    // ── Laptop scroll: mug fades then dark screen ──────────
    let mugTriggered = false;
    const laptopSection = document.querySelector('.scroll-section.laptop');

    function checkLaptopScroll() {
      if (mugTriggered || !laptopSection) return;
      const rect     = laptopSection.getBoundingClientRect();
      const scrolled  = -rect.top;
      const total     = rect.height - window.innerHeight;
      const progress  = scrolled / total;

      if (progress >= 0.55 && progress <= 0.78) {
        mugTriggered = true;
        triggerScreenFade();
      }
    }

    function triggerScreenFade() {
      // Fade mug in and out 3 times
      if (screenMug) screenMug.classList.add('fading');

      // After 3 cycles (~4.8s), show dark grey screen then scroll on
      setTimeout(() => {
        const darkEl = document.getElementById('screen-dark');
        darkEl.classList.add('active');

        // After dark screen holds for 0.8s, scroll past laptop section
        setTimeout(() => {
          const nextSection = laptopSection.nextElementSibling;
          if (nextSection) {
            nextSection.scrollIntoView({ behavior: 'smooth' });
          } else {
            window.scrollBy({ top: window.innerHeight * 2, behavior: 'smooth' });
          }
          // Fade dark screen out
          setTimeout(() => {
            darkEl.style.transition = 'opacity 0.9s ease';
            darkEl.style.opacity = '0';
            setTimeout(() => {
              darkEl.classList.remove('active');
              darkEl.style.opacity = '';
              darkEl.style.transition = '';
              if (screenMug) screenMug.classList.remove('fading');
              mugTriggered = false;
            }, 950);
          }, 600);
        }, 800);
      }, 4800);
    }

    window.addEventListener('scroll', checkLaptopScroll, { passive: true });

    // ── Button bindings ─────────────────────────────────────
    function bindBtn(el, fn) {
      el.addEventListener('click', fn);
      el.addEventListener('touchend', (e) => { e.preventDefault(); fn(); });
      el.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fn(); } });
    }

    bindBtn(yesBtn, startPour);
