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
  notice.setAttribute('aria-label', 'Согласие на аналитику');
  notice.innerHTML = `
    <div class="analytics-consent__copy">
      <h2>Помогите сделать сайт лучше</h2>
      <p>Я использую Яндекс Метрику, чтобы понимать, как посетители взаимодействуют с сайтом, и улучшать его. Аналитика включается только с вашего согласия.</p>
      <a href="privacy.html">Политика конфиденциальности</a>
    </div>
    <button class="nav-link" type="button">Хорошо</button>
    <p class="analytics-consent__status" role="status"></p>
  `;
  const status = notice.querySelector('[role="status"]');
  notice.querySelector('button').addEventListener('click', () => {
    try {
      localStorage.setItem(consentKey, 'allow');
    } catch {
      status.textContent = 'Не удалось сохранить выбор. Проверьте настройки хранения данных в браузере.';
      return;
    }
    notice.remove();
    loadMetrika();
  });
  document.body.append(notice);
})();
