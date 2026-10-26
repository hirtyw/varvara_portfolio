const logos = document.querySelector('.clients__logos');
const mobileLogos = window.matchMedia('(max-width: 767px)');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function syncLogoLoop() {
  logos.classList.remove('is-looping');
  logos.querySelectorAll('[aria-hidden="true"]').forEach(logo => logo.remove());
  if (!mobileLogos.matches || reducedMotion.matches) return;

  // One identical copy fills the viewport as the original sequence leaves it.
  const originals = [...logos.children];
  for (const logo of originals) {
    logo.querySelector('img').loading = 'eager';
    const copy = logo.cloneNode(true);
    copy.setAttribute('aria-hidden', 'true');
    logos.append(copy);
  }

  const distance = logos.children[originals.length].getBoundingClientRect().left
    - originals[0].getBoundingClientRect().left;
  logos.style.setProperty('--clients-loop-distance', `${distance}px`);
  logos.style.setProperty('--clients-loop-duration', `${distance / 32}s`);
  logos.scrollLeft = 0;
  logos.classList.add('is-looping');
}

mobileLogos.addEventListener('change', syncLogoLoop);
reducedMotion.addEventListener('change', syncLogoLoop);
syncLogoLoop();
