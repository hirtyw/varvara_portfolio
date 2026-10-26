const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');

if (!motionPreference.matches && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) show(entry.target);
    }
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  function show(element) {
    element.classList.add('is-visible');
    observer.unobserve(element);
  }

  function reveal(selector, effect, delay = 0) {
    document.querySelectorAll(selector).forEach(element => {
      element.dataset.reveal = effect;
      if (delay) element.style.setProperty('--reveal-delay', `${delay}ms`);
      observer.observe(element);
    });
  }

  reveal('.site-header, .clients h2, .about__number, .about h2, .projects__heading, .experience__number, .experience h2', 'fade');
  reveal('.hero__title, .clients__logos', 'fade', 100);
  reveal('.hero__facts, .about__copy, .experience__intro', 'fade', 150);
  reveal('.about__skills', 'fade', 650);
  reveal('.experience__jobs', 'fade', 700);
  reveal('.hero__visual, .about__portrait, .project__image', 'curtain');
  document.querySelectorAll('.project').forEach((project, index) => {
    project.dataset.reveal = 'fade';
    project.style.setProperty('--reveal-delay', `${Math.min(index * 80, 400)}ms`);
    observer.observe(project);
  });

  // Keyboard navigation must never land on an invisible control.
  document.addEventListener('focusin', event => {
    const element = event.target.closest('[data-reveal]');
    if (element) show(element);
  });

  motionPreference.addEventListener('change', event => {
    if (event.matches) {
      document.querySelectorAll('[data-reveal]').forEach(show);
      observer.disconnect();
    }
  });
}
