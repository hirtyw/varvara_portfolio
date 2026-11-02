const projects = document.querySelector('#projects');
const projectHover = window.matchMedia('(min-width: 768px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
const projectTouch = window.matchMedia('(max-width: 767px) and (prefers-reduced-motion: no-preference)');
let projectCursor;
let projectCursorTimer;

function hideProjectCursor() {
  clearTimeout(projectCursorTimer);
  projectCursor?.classList.remove('is-visible');
}

function syncProjectCursor() {
  hideProjectCursor();
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
  clearTimeout(projectCursorTimer);
  projectCursor.textContent = image.closest('[data-cursor-label]')?.dataset.cursorLabel
    || (image.matches('a[href]') ? 'Смотреть' : 'Скоро');
  const bounds = event.pointerType !== 'mouse' ? image.getBoundingClientRect() : null;
  const x = bounds ? bounds.left + bounds.width / 2 : event.clientX;
  const y = bounds ? bounds.top + bounds.height / 2 : event.clientY;
  projectCursor.style.translate = `${x}px ${y}px`;
  projectCursor.classList.toggle('is-touch', event.pointerType !== 'mouse');
  projectCursor.classList.add('is-visible');
}

projects.addEventListener('pointerdown', event => {
  if (!projectCursor || !projectTouch.matches || event.pointerType === 'mouse') return;
  const image = event.target.closest('.project__image');
  if (image) showProjectCursor(image, event);
});

window.addEventListener('pointerup', event => {
  if (event.pointerType !== 'mouse') {
    projectCursorTimer = setTimeout(hideProjectCursor, 900);
  }
});
window.addEventListener('pointercancel', hideProjectCursor);
projects.addEventListener('pointerleave', event => {
  if (event.pointerType === 'mouse') hideProjectCursor();
});
window.addEventListener('scroll', hideProjectCursor, { passive: true });
window.addEventListener('blur', hideProjectCursor);
projectHover.addEventListener('change', syncProjectCursor);
projectTouch.addEventListener('change', syncProjectCursor);
syncProjectCursor();
