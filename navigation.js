const toggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('#mobile-menu');
const label = toggle.querySelector('span');
const mobileViewport = window.matchMedia('(max-width: 767px)');

function syncMenu() {
  toggle.setAttribute('aria-expanded', String(menu.open));
  label.textContent = menu.open ? 'Закрыть' : 'Меню';
  document.documentElement.classList.toggle('menu-open', menu.open);
}

toggle.addEventListener('click', (event) => {
  // A non-modal dialog keeps the shared header and its close button accessible.
  if (menu.open) menu.close();
  else {
    menu.show();
    if (event.detail > 0) toggle.focus({ preventScroll: true });
  }
  syncMenu();
});

menu.addEventListener('close', syncMenu);
menu.addEventListener('click', (event) => {
  if (event.target.closest('a')) {
    menu.close();
    syncMenu();
  }
});

document.addEventListener('keydown', (event) => {
  if (!menu.open) return;
  if (event.key === 'Escape') {
    menu.close();
    syncMenu();
    toggle.focus();
  } else if (event.key === 'Tab') {
    const controls = [document.querySelector('.identity'), toggle, ...menu.querySelectorAll('a')];
    const first = controls[0];
    const last = controls.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
});

mobileViewport.addEventListener('change', () => {
  if (!mobileViewport.matches) {
    menu.close();
    syncMenu();
  }
});
