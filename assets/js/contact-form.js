document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('contactForm');
  const status = document.getElementById('contactFormStatus');
  if (!form || !status) return;

  form.addEventListener('submit', async function (event) {
    event.preventDefault();

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

    try {
      await fetch(endpoint, {
        method: 'POST',
        mode: 'no-cors',
        body: payload
      });

      form.reset();
      status.textContent = 'Message sent successfully.';
    } catch (error) {
      status.textContent = 'Unable to send message. Please try again.';
    }
  });
});
