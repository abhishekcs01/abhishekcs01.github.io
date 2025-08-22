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
        const itemsToStagger = entry.target.querySelectorAll('.card, .chip');
        itemsToStagger.forEach((item, index) => {
          item.style.transitionDelay = `${index * 100}ms`;
        });

        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.section').forEach(section => observer.observe(section));

  // Gradient cursor effect
  const cursorGradient = document.querySelector('.cursor-gradient');
  window.addEventListener('mousemove', e => {
    cursorGradient.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
  });

  // Internship Letter Modal Logic
  const modalOverlay = document.getElementById('internship-modal');
  const openModalBtn = document.getElementById('internship-letter-btn');
  const closeModalBtn = document.querySelector('.modal-close-btn');

  const openModal = () => modalOverlay.classList.add('active');
  const closeModal = () => modalOverlay.classList.remove('active');

  if (openModalBtn) {
    openModalBtn.addEventListener('click', openModal);
  }

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
  }

  // Close modal when clicking on the overlay
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      closeModal();
    }
  });

  // Close modal with the Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });
});