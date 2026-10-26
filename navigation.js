const toggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('#mobile-menu');
const label = toggle.querySelector('span');
const mobileViewport = window.matchMedia('(max-width: 767px)');

function syncMenu() {
  toggle.setAttribute('aria-expanded', String(menu.open));
  label.textContent = menu.open ? 'Закрыть' : 'Меню';
  document.documentElement.classList.toggle('menu-open', menu.open);
}

toggle.addEventListener('click', () => {
  // A non-modal dialog keeps the shared header and its close button accessible.
  if (menu.open) menu.close();
  else menu.show();
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
  if (event.key === 'Escape' && menu.open) {
    menu.close();
    syncMenu();
    toggle.focus();
  }
});

mobileViewport.addEventListener('change', () => {
  if (!mobileViewport.matches) {
    menu.close();
    syncMenu();
  }
});
