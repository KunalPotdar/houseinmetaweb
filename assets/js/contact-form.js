document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('contactForm');
  const status = document.getElementById('contactFormStatus');
  if (!form || !status) return;

  const tourRequest = new URLSearchParams(window.location.search).get('request') === 'virtual-tour';
  function selectTourRequest() {
    if (tourRequest) form.elements.subject.value = 'Virtual tour access request';
  }
  if (tourRequest) {
    document.title = 'Request a virtual tour - HouseInMeta';
    const card = form.closest('.contact-card');
    card.querySelector('.eyebrow').textContent = 'VIRTUAL TOUR ACCESS';
    card.querySelector('h2').textContent = 'Receive your virtual tour link.';
    card.querySelector('.muted').textContent = 'Fill in your name and email. Our team will send you a virtual tour link by email. Fields marked * are required.';
    form.querySelector('button[type="submit"]').textContent = 'Request my tour link';
    document.querySelector('label[for="contactSubject"]').textContent = 'Request type *';
    document.querySelector('label[for="contactMessage"]').textContent = 'Which property would you like to explore? (optional)';
    form.elements.message.placeholder = 'Tell us which property or experience interests you.';
    selectTourRequest();
  }

  form.addEventListener('submit', async function (event) {
    event.preventDefault();

    if (!form.reportValidity()) return;
    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton?.disabled) return;

    const endpoint = (form.getAttribute('data-appscript-url') || '').trim();
    if (!endpoint || endpoint.includes('PASTE_YOUR_APPS_SCRIPT_WEBAPP_URL_HERE')) {
      status.textContent = 'Please configure your Google Apps Script Web App URL in the form data-appscript-url attribute.';
      return;
    }

    const rawData = new FormData(form);
    const name = (rawData.get('name') || '').toString().trim();
    const email = (rawData.get('email') || '').toString().trim();
    const phone = (rawData.get('phone') || '').toString().trim();
    const subject = (rawData.get('subject') || 'Website Contact Request').toString().trim();
    const message = (rawData.get('message') || '').toString().trim();

    if (!name || !email) {
      status.textContent = 'Please fill all required fields.';
      return;
    }

    const payload = new FormData();
    payload.append('name', name);
    payload.append('email', email);
    payload.append('phone', phone || 'Not provided');
    payload.append('subject', subject);
    payload.append('message', message || 'Not provided');
    payload.append('submittedAt', new Date().toISOString());

    status.textContent = 'Sending your message...';
    if (submitButton) submitButton.disabled = true;
    form.setAttribute('aria-busy', 'true');

    try {
      await fetch(endpoint, {
        method: 'POST',
        mode: 'no-cors',
        body: payload
      });

      form.reset();
      selectTourRequest();
      status.textContent = tourRequest
        ? 'Your tour link request has been submitted. Our team will email you the link. For questions, email houseinmeta@gmail.com.'
        : 'Your enquiry has been submitted. For a direct conversation, email houseinmeta@gmail.com.';
    } catch (error) {
      status.textContent = 'Unable to send message. Please try again.';
    } finally {
      if (submitButton) submitButton.disabled = false;
      form.removeAttribute('aria-busy');
    }
  });
});
