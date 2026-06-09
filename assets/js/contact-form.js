document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  const status = document.getElementById('contactFormStatus');
  const button = document.getElementById('contactSubmitBtn');
  if (!form || !status || !button) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const raw = Object.fromEntries(new FormData(form).entries());
    const data = {
      name: (raw.name || '').toString().trim(),
      email: (raw.email || '').toString().trim(),
      phone: (raw.phone || '').toString().trim(),
      subject: (raw.subject || 'Website Contact Request').toString().trim(),
      message: (raw.message || `Phone: ${(raw.phone || '').toString().trim() || 'Not provided'}`).toString().trim()
    };

    if (!data.name || !data.email || !data.phone) {
      status.textContent = 'Please fill all required fields.';
      return;
    }

    button.disabled = true;
    button.textContent = 'Sending...';
    status.textContent = 'Sending your message...';

    try {
      const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.contact}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.error || 'Send failed');

      form.reset();
      status.textContent = 'Message sent successfully.';
    } catch (err) {
      status.textContent = err.message || 'Could not send message.';
    } finally {
      button.disabled = false;
      button.textContent = 'Send Message';
    }
  });
});
