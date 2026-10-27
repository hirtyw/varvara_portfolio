const hero = document.querySelector('.hero__visual');
const heroSlides = [...hero.querySelectorAll('.hero__slide')];
const heroMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const heroLoads = new Map();
const heroFailed = new Set();
let heroCurrent = 0;
let heroTimer;
let heroGeneration = 0;
let heroVisible = !('IntersectionObserver' in window);
let heroReady = false;
let heroPaused = false;
let heroPrinting = false;
let heroPrevious;
let heroEntering;

function loadHeroSlide(index) {
  if (!heroLoads.has(index)) {
    const slide = heroSlides[index];
    slide.querySelectorAll('source[data-srcset]').forEach(source => {
      source.srcset = source.dataset.srcset;
    });
    const images = [...slide.querySelectorAll('img')];
    images.forEach(image => {
      if (image.dataset.src) image.src = image.dataset.src;
    });
    heroLoads.set(index, Promise.all(images.map(image => image.decode())).then(
      () => true,
      () => { heroFailed.add(index); return false; },
    ));
  }
  return heroLoads.get(index);
}

function nextHeroSlide() {
  for (let step = 1; step < heroSlides.length; step++) {
    const index = (heroCurrent + step) % heroSlides.length;
    if (!heroFailed.has(index)) return index;
  }
  return heroCurrent;
}

function finishHeroTransition() {
  if (heroPrevious) heroPrevious.hidden = true;
  heroEntering?.classList.remove('is-entering');
  heroPrevious = heroEntering = null;
}

function canPlayHero() {
  return heroReady && heroVisible && !heroPaused && !heroMotion.matches
    && !heroPrinting && !document.hidden
    && !document.documentElement.classList.contains('menu-open')
    && heroSlides.length - heroFailed.size > 1;
}

function scheduleHeroSlide() {
  if (!canPlayHero()) return;
  const styles = getComputedStyle(hero);
  const interval = styles.getPropertyValue(heroCurrent < 3 ? '--hero-slide-fast-interval' : '--hero-slide-interval');
  const delay = Math.max(parseFloat(interval) || 3000, (parseFloat(styles.getPropertyValue('--motion-hero-duration')) || 1000) + 50);
  const generation = heroGeneration;
  loadHeroSlide(nextHeroSlide());
  heroTimer = setTimeout(async () => {
    const next = nextHeroSlide();
    const loaded = await loadHeroSlide(next);
    if (generation !== heroGeneration || !canPlayHero()) return;
    if (loaded && next !== heroCurrent) {
      finishHeroTransition();
      heroPrevious = heroSlides[heroCurrent];
      heroEntering = heroSlides[next];
      heroEntering.hidden = false;
      heroEntering.classList.add('is-entering');
      heroCurrent = next;
    }
    scheduleHeroSlide();
  }, delay);
}

function syncHeroPlayback() {
  clearTimeout(heroTimer);
  heroGeneration++;
  hero.disabled = !heroReady || heroMotion.matches || heroSlides.length - heroFailed.size < 2;
  const label = hero.disabled ? 'Превью проектов' : heroPaused ? 'Продолжить смену изображений' : 'Приостановить смену изображений';
  hero.setAttribute('aria-label', label);
  hero.setAttribute('aria-pressed', String(heroPaused));
  hero.title = label;
  if (!canPlayHero()) finishHeroTransition();
  scheduleHeroSlide();
}

hero.addEventListener('click', () => { heroPaused = !heroPaused; syncHeroPlayback(); });
hero.addEventListener('animationend', event => {
  if (event.animationName === 'hero-slide-in') finishHeroTransition();
});
document.addEventListener('visibilitychange', syncHeroPlayback);
heroMotion.addEventListener('change', syncHeroPlayback);
window.addEventListener('beforeprint', () => { heroPrinting = true; syncHeroPlayback(); });
window.addEventListener('afterprint', () => { heroPrinting = false; syncHeroPlayback(); });
document.querySelector('.menu-toggle').addEventListener('click', syncHeroPlayback);
document.querySelector('#mobile-menu').addEventListener('click', syncHeroPlayback);
document.querySelector('#mobile-menu').addEventListener('close', syncHeroPlayback);

if ('IntersectionObserver' in window) {
  new IntersectionObserver(([entry]) => {
    heroVisible = entry.isIntersecting;
    syncHeroPlayback();
  }).observe(hero);
}
loadHeroSlide(0).then(() => { heroReady = true; syncHeroPlayback(); });
