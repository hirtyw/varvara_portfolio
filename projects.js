const projects = document.querySelector('#projects');
const projectHover = window.matchMedia('(min-width: 768px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
let projectCursor;

function hideProjectCursor() {
  projectCursor?.classList.remove('is-visible');
}

function syncProjectCursor() {
  if (projectHover.matches) {
    projectCursor = document.createElement('div');
    projectCursor.className = 'project-cursor';
    projectCursor.textContent = 'Скоро';
    projectCursor.setAttribute('aria-hidden', 'true');
    document.body.append(projectCursor);
  } else {
    projectCursor?.remove();
    projectCursor = null;
  }
  projects.classList.toggle('has-project-cursor', projectHover.matches);
}

projects.addEventListener('pointermove', event => {
  if (!projectCursor) return;
  const image = event.target.closest('.project__image');
  projectCursor.classList.toggle('is-visible', Boolean(image));
  if (image) {
    projectCursor.textContent = image.matches('a[href]') ? 'Смотреть' : 'Скоро';
    projectCursor.style.translate = `${event.clientX}px ${event.clientY}px`;
  }
});

projects.addEventListener('pointerleave', hideProjectCursor);
window.addEventListener('scroll', hideProjectCursor, { passive: true });
window.addEventListener('blur', hideProjectCursor);
projectHover.addEventListener('change', syncProjectCursor);
syncProjectCursor();
