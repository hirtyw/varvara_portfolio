const projects = document.querySelector('#projects');
const projectHover = window.matchMedia('(min-width: 768px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
const projectTouch = window.matchMedia('(max-width: 767px) and (prefers-reduced-motion: no-preference)');
let projectCursor;
let touchPoint;

function hideProjectCursor() {
  projectCursor?.classList.remove('is-visible');
}

function syncProjectCursor() {
  hideProjectCursor();
  touchPoint = null;
  if (projectHover.matches || projectTouch.matches) {
    projectCursor?.remove();
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
  if (!projectCursor || !projectHover.matches || event.pointerType !== 'mouse') return;
  const image = event.target.closest('.project__image');
  if (image) showProjectCursor(image, event);
  else hideProjectCursor();
});

function showProjectCursor(image, event) {
  projectCursor.textContent = image.closest('[data-cursor-label]')?.dataset.cursorLabel
    || (image.matches('a[href]') ? 'Смотреть' : 'Скоро');
  projectCursor.style.translate = `${event.clientX}px ${event.clientY}px`;
  projectCursor.classList.toggle('is-touch', event.pointerType !== 'mouse');
  projectCursor.classList.add('is-visible');
}

document.addEventListener('pointerdown', event => {
  if (!projectCursor || !projectTouch.matches || event.pointerType === 'mouse') return;
  touchPoint = { clientX: event.clientX, clientY: event.clientY };
  const image = event.target.closest('#projects .project__image');
  if (image) showProjectCursor(image, event);
  else hideProjectCursor();
});

window.addEventListener('pointercancel', hideProjectCursor);
projects.addEventListener('pointerleave', event => {
  if (event.pointerType === 'mouse') hideProjectCursor();
});
window.addEventListener('scroll', () => {
  if (!projectTouch.matches || !touchPoint) return hideProjectCursor();
  const image = document.elementFromPoint(touchPoint.clientX, touchPoint.clientY)?.closest('#projects .project__image');
  if (image) showProjectCursor(image, touchPoint);
  else hideProjectCursor();
}, { passive: true });
window.addEventListener('blur', hideProjectCursor);
projectHover.addEventListener('change', syncProjectCursor);
projectTouch.addEventListener('change', syncProjectCursor);
syncProjectCursor();
