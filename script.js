document.addEventListener('DOMContentLoaded', () => {
  // Set current year
  document.getElementById('year').textContent = new Date().getFullYear();

  // Smooth scroll for internal links with offset for sticky header
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href.length > 1) {
        e.preventDefault();
        const target = document.querySelector(href);
        const headerHeight = document.querySelector('.site-header').offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
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
  
  // Scroll progress bar and header effect
  const progressEl = document.querySelector('.scroll-progress span');
  const header = document.querySelector('.site-header');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (progressEl) {
    let ticking = false;
    const updateProgress = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressEl.style.width = `${pct}%`;
      
      // Add shadow to header when scrolled
      if (scrollTop > 20) {
        header.style.boxShadow = '0 1px 0 0 rgba(255, 255, 255, 0.05) inset, 0 8px 24px rgba(0, 0, 0, 0.25)';
      } else {
        header.style.boxShadow = '0 1px 0 0 rgba(255, 255, 255, 0.05) inset, 0 4px 12px rgba(0, 0, 0, 0.15)';
      }
      
      ticking = false;
    };
    
    const requestTick = () => {
      if (!ticking) {
        requestAnimationFrame(updateProgress);
        ticking = true;
      }
    };
    
    updateProgress();
    window.addEventListener('scroll', requestTick, { passive: true });
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

  // Add premium magnetic effect to buttons
  if (!prefersReduced) {
    const buttons = document.querySelectorAll('.btn, .contact-btn, .chip');
    buttons.forEach(btn => {
      btn.addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.1s ease';
      });
      
      btn.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const deltaX = (x - centerX) / centerX;
        const deltaY = (y - centerY) / centerY;
        
        this.style.transform = `translate(${deltaX * 3}px, ${deltaY * 3}px) translateY(-3px)`;
      });
      
      btn.addEventListener('mouseleave', function() {
        this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        this.style.transform = '';
      });
    });
  }

  // Smooth fade-in for page load
  document.body.style.opacity = '0';
  requestAnimationFrame(() => {
    document.body.style.transition = 'opacity 0.5s ease';
    document.body.style.opacity = '1';
  });
});
