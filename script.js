document.addEventListener('DOMContentLoaded', () => {
  // Set current year
  document.getElementById('year').textContent = new Date().getFullYear();

  // Smooth scroll for internal links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href.length > 1) {
        e.preventDefault();
        document.querySelector(href).scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Reveal sections on scroll with staggered animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        
        // Stagger children elements like cards and chips
        const itemsToStagger = entry.target.querySelectorAll('.card, .chip, .contact-btn, .education-item');
        itemsToStagger.forEach((item, index) => {
          item.style.transitionDelay = `${index * 100}ms`;
        });

        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.section').forEach(section => observer.observe(section));
  
  // Scroll progress bar
  const progressEl = document.querySelector('.scroll-progress span');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (progressEl) {
    const updateProgress = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressEl.style.width = `${pct}%`;
    };
    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
  }

  // 3D tilt for cards (projects + education)
  if (!prefersReduced) {
    const tiltEls = document.querySelectorAll('.card, .education-item');
    tiltEls.forEach(el => {
      let rafId = null;
      const onMove = (e) => {
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;  // 0..1
        const y = (e.clientY - rect.top) / rect.height; // 0..1
        const rotateY = (x - 0.5) * 10; // deg
        const rotateX = (0.5 - y) * 10; // deg
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          el.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
          el.style.boxShadow = '0 18px 40px rgba(0,0,0,0.35)';
        });
      };
      const onLeave = () => {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          el.style.transform = '';
          el.style.boxShadow = '';
        });
      };
      el.addEventListener('mousemove', onMove);
      el.addEventListener('mouseleave', onLeave);
      el.addEventListener('touchmove', (e) => { if (e.touches[0]) onMove(e.touches[0]); }, { passive: true });
      el.addEventListener('touchend', onLeave);
    });
  }

  // Subtle parallax for hero image
  const heroImg = document.querySelector('.hero-media img');
  if (heroImg && !prefersReduced) {
    let rafId = null;
    const onScroll = () => {
      const rect = heroImg.getBoundingClientRect();
      const vh = window.innerHeight;
      if (rect.top < vh && rect.bottom > 0) {
        const progress = (vh - rect.top) / (vh + rect.height); // 0..1 while in view
        const translateY = (progress - 0.5) * 16; // -8..8px
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          heroImg.style.transform = `translateY(${translateY}px)`;
        });
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
  }
});
