(function () {
  const PRODUCTS = [
    'Star 0.5HP Self Priming Monoblock',
    'Big Flow 1.0HP Self Priming Monoblock',
    'Shallow Well 1.0HP',
    'Shallow Well 1.5HP',
    '1.0 HP Submersible Control Panel',
    '1.5 HP Submersible Control Panel',
    '2.0 HP Submersible Control Panel',
    '3.0 HP Submersible Control Panel',
    'KR-SUB 6000 Pro Submersible Pump Set',
    'KR-AGRI 4200 Submersible Pump Set',
    'KR-IND 8000 X Submersible Pump Set',
    'KR-SUB 6200 Ultra Submersible Pump Set',
    'General Inquiry',
  ];

  const API_URL = window.INQUIRY_API_URL || '/api/inquiry';

  function buildProductOptions(selected) {
    return PRODUCTS.map(
      (product) =>
        `<option value="${product}"${product === selected ? ' selected' : ''}>${product}</option>`
    ).join('');
  }

  function createModal() {
    if (document.getElementById('inquiryModal')) return;

    const modal = document.createElement('div');
    modal.id = 'inquiryModal';
    modal.className = 'inquiry-modal';
    modal.setAttribute('aria-hidden', 'true');
    modal.innerHTML = `
      <div class="inquiry-modal-backdrop" data-close-modal></div>
      <div class="inquiry-modal-dialog" role="dialog" aria-modal="true" aria-labelledby="inquiryModalTitle">
        <button type="button" class="inquiry-modal-close" data-close-modal aria-label="Close form">
          <i data-lucide="x"></i>
        </button>
        <div class="inquiry-modal-header">
          <span class="label">Product Inquiry</span>
          <h2 id="inquiryModalTitle">Request a Quote</h2>
          <p>Fill in your details and our team will get back to you shortly.</p>
        </div>
        <form class="contact-form inquiry-form" id="inquiryModalForm">
          <div class="form-group">
            <label for="inquiryName">Name</label>
            <input type="text" id="inquiryName" name="name" placeholder="Your full name" required />
          </div>
          <div class="form-group">
            <label for="inquiryContact">Phone or Email</label>
            <input type="text" id="inquiryContact" name="contact" placeholder="+91 98765 43210 or you@email.com" required />
          </div>
          <div class="form-group">
            <label for="inquiryProduct">Product</label>
            <select id="inquiryProduct" name="product" required>
              <option value="">Select a product</option>
              ${buildProductOptions('')}
            </select>
          </div>
          <div class="form-group">
            <label for="inquiryEnquiry">Enquiry</label>
            <textarea id="inquiryEnquiry" name="enquiry" rows="4" placeholder="Quantity, delivery location, or technical questions..." required></textarea>
          </div>
          <p class="inquiry-form-status" id="inquiryModalStatus" hidden></p>
          <button type="submit" class="btn-submit" id="inquiryModalSubmit">
            Submit Inquiry
            <i data-lucide="arrow-right"></i>
          </button>
        </form>
      </div>
    `;
    document.body.appendChild(modal);
  }

  function openModal(product) {
    createModal();
    const modal = document.getElementById('inquiryModal');
    const productSelect = document.getElementById('inquiryProduct');
    const status = document.getElementById('inquiryModalStatus');
    const form = document.getElementById('inquiryModalForm');

    if (status) {
      status.hidden = true;
      status.textContent = '';
      status.className = 'inquiry-form-status';
    }
    if (form) form.reset();
    if (productSelect && product) {
      productSelect.innerHTML = `
        <option value="">Select a product</option>
        ${buildProductOptions(product)}
      `;
    }

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    if (typeof lucide !== 'undefined') lucide.createIcons();
    document.getElementById('inquiryName')?.focus();
  }

  function closeModal() {
    const modal = document.getElementById('inquiryModal');
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function showStatus(el, message, type) {
    if (!el) return;
    el.textContent = message;
    el.className = `inquiry-form-status inquiry-form-status--${type}`;
    el.hidden = false;
  }

  async function submitInquiry(form, statusEl, submitBtn) {
    const formData = new FormData(form);
    const payload = {
      name: formData.get('name'),
      contact: formData.get('contact'),
      product: formData.get('product'),
      enquiry: formData.get('enquiry'),
    };

    submitBtn.disabled = true;
    const originalHtml = submitBtn.innerHTML;
    submitBtn.innerHTML = 'Sending...';

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong. Please try again.');
      }

      showStatus(statusEl, 'Thank you! Your inquiry has been sent. We will contact you soon.', 'success');
      form.reset();
      setTimeout(closeModal, 2500);
    } catch (err) {
      showStatus(statusEl, err.message || 'Failed to send inquiry.', 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalHtml;
      if (typeof lucide !== 'undefined') lucide.createIcons();
    }
  }

  function wireForm(form, statusId, submitId) {
    if (!form || form.dataset.inquiryWired) return;
    form.dataset.inquiryWired = 'true';

    const statusEl = statusId ? document.getElementById(statusId) : form.querySelector('.inquiry-form-status');
    const submitBtn = submitId ? document.getElementById(submitId) : form.querySelector('[type="submit"]');

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      submitInquiry(form, statusEl, submitBtn);
    });
  }

  function populateInlineProductSelect(selectEl) {
    if (!selectEl || selectEl.options.length > 1) return;
    selectEl.innerHTML = `
      <option value="">Select a product</option>
      ${buildProductOptions('')}
    `;
  }

  document.addEventListener('DOMContentLoaded', () => {
    createModal();

    document.querySelectorAll('.btn-inquire').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openModal(btn.dataset.product || '');
      });
    });

    document.querySelectorAll('.open-inquiry-form').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openModal('');
      });
    });

    document.querySelectorAll('[data-close-modal]').forEach((el) => {
      el.addEventListener('click', closeModal);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
    });

    wireForm(document.getElementById('inquiryModalForm'), 'inquiryModalStatus', 'inquiryModalSubmit');

    const inlineForm = document.getElementById('inquiryForm');
    if (inlineForm) {
      populateInlineProductSelect(inlineForm.querySelector('[name="product"]'));
      wireForm(inlineForm, 'inquiryFormStatus', 'inquiryFormSubmit');
    }

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
      populateInlineProductSelect(contactForm.querySelector('[name="product"]'));
      wireForm(contactForm, 'contactFormStatus', 'contactFormSubmit');
    }
  });
})();
