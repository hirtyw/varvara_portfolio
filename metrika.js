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
  const notice = document.createElement('aside');
  notice.id = 'analytics-consent';
  notice.className = 'analytics-consent';
  notice.setAttribute('aria-label', 'Настройки аналитики');
  notice.hidden = consent === 'allow' || consent === 'deny';
  notice.innerHTML = `
    <p>Разрешить Яндекс Метрике собирать статистику посещений, данные о кликах и записи взаимодействий с сайтом? <a href="privacy.html">Политика конфиденциальности</a></p>
    <button type="button" value="allow">Разрешить</button>
    <button type="button" value="deny">Отклонить</button>
    <p class="analytics-consent__status" role="status"></p>
  `;
  const allow = notice.querySelector('[value="allow"]');
  const deny = notice.querySelector('[value="deny"]');
  const status = notice.querySelector('[role="status"]');
  deny.textContent = consent === 'allow' ? 'Отозвать согласие' : 'Отклонить';

  const settings = document.createElement('button');
  settings.type = 'button';
  settings.className = 'site-footer__analytics';
  settings.textContent = 'Настройки аналитики';
  settings.setAttribute('aria-controls', notice.id);
  settings.setAttribute('aria-expanded', String(!notice.hidden));
  settings.addEventListener('click', () => {
    notice.hidden = !notice.hidden;
    settings.setAttribute('aria-expanded', String(!notice.hidden));
    if (!notice.hidden) deny.focus();
  });

  function closeNotice() {
    notice.hidden = true;
    settings.setAttribute('aria-expanded', 'false');
    settings.focus({ preventScroll: true });
  }

  for (const button of notice.querySelectorAll('button')) {
    button.addEventListener('click', () => {
      const choice = button.value;
      try {
        localStorage.setItem(consentKey, choice);
      } catch {
        if (choice === 'allow' || consent === 'allow') {
          status.textContent = 'Не удалось сохранить выбор. Проверьте настройки хранения данных в браузере.';
          return;
        }
      }
      if (choice === 'deny' && consent === 'allow') {
        location.reload();
        return;
      }
      if (choice === 'allow' && consent !== 'allow') loadMetrika();
      consent = choice;
      deny.textContent = consent === 'allow' ? 'Отозвать согласие' : 'Отклонить';
      allow.disabled = consent === 'allow';
      status.textContent = '';
      closeNotice();
    });
  }
  allow.disabled = consent === 'allow';
  document.querySelector('.site-footer__content').append(settings);
  document.body.append(notice);

  if (consent === 'allow') loadMetrika();
  window.addEventListener('storage', event => {
    if (event.key === consentKey && event.newValue === 'deny' && consent === 'allow') location.reload();
  });
})();
