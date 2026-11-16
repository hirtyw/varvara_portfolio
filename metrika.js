(() => {
  if (!['varvaraportfolio.ru', 'www.varvaraportfolio.ru'].includes(location.hostname)) return;

  const consentKey = 'metrika-consent';
  const counterId = 114274457;

  function loadMetrika() {
    const script = document.createElement('script');
    script.src = 'https://mc.yandex.ru/metrika/tag.js?id=' + counterId;
    script.async = true;

    window.ym = window.ym || function () {
      (window.ym.a ||= []).push(arguments);
    };
    window.ym.l = Date.now();
    window.ym(counterId, 'init', {
      ssr: true,
      webvisor: true,
      clickmap: true,
      ecommerce: 'dataLayer',
      referrer: document.referrer,
      url: location.href,
      accurateTrackBounce: true,
      trackLinks: true,
    });
    document.head.append(script);
  }

  let consent;
  try {
    consent = localStorage.getItem(consentKey);
  } catch {
    // A blocked storage API must not prevent a choice on this page.
  }
  if (consent === 'allow') {
    loadMetrika();
    return;
  }
  if (consent === 'deny') return;

  const notice = document.createElement('aside');
  notice.className = 'analytics-consent';
  notice.setAttribute('aria-label', 'Настройки аналитики');
  notice.innerHTML = `
    <p>Разрешить Яндекс Метрике собирать статистику посещений, данные о кликах и записи взаимодействий с сайтом?</p>
    <button type="button" value="allow">Разрешить</button>
    <button type="button" value="deny">Отклонить</button>
  `;
  for (const button of notice.querySelectorAll('button')) {
    button.addEventListener('click', () => {
      try {
        localStorage.setItem(consentKey, button.value);
      } catch {
        // The choice still applies to the current page.
      }
      notice.remove();
      if (button.value === 'allow') loadMetrika();
    });
  }
  document.body.append(notice);
})();
