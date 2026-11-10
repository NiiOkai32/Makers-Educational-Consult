(() => {
  // Best-effort embedding mitigation; HTTP frame-ancestors is still needed for full protection.
  if (window.self !== window.top) {
    const notice = document.createElement('main');
    const heading = document.createElement('h1');
    heading.textContent = 'Open Makers directly';
    const link = document.createElement('a');
    link.href = new URL('./', document.currentScript.src).href;
    link.textContent = 'Visit the Makers Education Consult website';
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    notice.append(heading, link);
    document.body.replaceChildren(notice);
    return;
  }

  const menu = document.querySelector('.menu-button');
  const navigation = document.querySelector('nav');
  menu?.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(open));
    navigation?.classList.toggle('open', open);
  });
  function closeMenu() {
    menu?.setAttribute('aria-expanded', 'false');
    navigation?.classList.remove('open');
  }
  document.querySelectorAll('nav a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu?.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      menu.focus();
    }
  });

  const form = document.querySelector('#enquiry-form');
  if (!form) return;
  const fields = document.querySelector('#enquiry-fields');
  const preview = document.querySelector('#enquiry-preview');
  const prepared = document.querySelector('#prepared-message');
  const copy = document.querySelector('#copy-enquiry');
  const status = document.querySelector('#form-status');
  const nameInput = document.querySelector('#name');
  const serviceInput = document.querySelector('#service');
  const messageInput = document.querySelector('#message');
  if (!fields || !preview || !prepared || !copy || !status || !nameInput || !serviceInput || !messageInput) return;

  const selected = new URLSearchParams(location.search).get('service');
  if (Array.from(serviceInput.options).some(option => option.value === selected)) serviceInput.value = selected;

  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    if (!nameInput.value.trim() || !messageInput.value.trim()) {
      status.textContent = 'Please enter your name and a short description of your enquiry.';
      return;
    }
    const service = serviceInput.selectedOptions[0].textContent;
    prepared.value = `Hello Makers! My name is ${nameInput.value.trim()}.\nI’m interested in: ${service}.\n\n${messageInput.value.trim()}`;
    preview.hidden = false;
    status.textContent = 'Review your message, copy it, then open WhatsApp and paste it. Nothing has been sent.';
    prepared.focus();
  });
  fields.addEventListener('input', () => {
    preview.hidden = true;
    prepared.value = '';
    status.textContent = '';
  });
  copy.addEventListener('click', async () => {
    if (!prepared.value) return;
    try {
      await navigator.clipboard.writeText(prepared.value);
      status.textContent = 'Message copied. Open WhatsApp, paste it and review before sending.';
    } catch {
      prepared.focus();
      prepared.select();
      status.textContent = 'Automatic copying is unavailable. Copy the selected message manually, then paste it into WhatsApp.';
    }
  });
  // Enable only after the non-network submit handler and preview controls are ready.
  fields.disabled = false;
})();
