const { Resend } = require('resend');

const TO_EMAIL = process.env.INQUIRY_TO_EMAIL || 'pawan572893@gmail.com';
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidPhone(value) {
  const digits = value.replace(/\D/g, '');
  return digits.length >= 7 && digits.length <= 15;
}

function isValidContact(value) {
  const trimmed = value.trim();
  return isValidEmail(trimmed) || isValidPhone(trimmed);
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Email service is not configured. Add RESEND_API_KEY to your environment variables.' });
  }

  const resend = new Resend(apiKey);
  const { name, contact, product, enquiry } = req.body ?? {};

  if (!name?.trim()) {
    return res.status(400).json({ error: 'Name is required.' });
  }
  if (!contact?.trim() || !isValidContact(contact)) {
    return res.status(400).json({ error: 'Please enter a valid phone number or email address.' });
  }
  if (!product?.trim()) {
    return res.status(400).json({ error: 'Please select a product.' });
  }
  if (!enquiry?.trim()) {
    return res.status(400).json({ error: 'Please enter your enquiry.' });
  }

  const contactTrimmed = contact.trim();
  const contactType = isValidEmail(contactTrimmed) ? 'Email' : 'Phone';

  try {
    const { error } = await resend.emails.send({
      from: `Krishna Industries <${FROM_EMAIL}>`,
      to: [TO_EMAIL],
      replyTo: isValidEmail(contactTrimmed) ? contactTrimmed : undefined,
      subject: `Product Inquiry: ${product.trim()}`,
      html: `
        <h2>New Product Inquiry</h2>
        <table style="border-collapse:collapse;width:100%;max-width:600px;">
          <tr><td style="padding:8px 12px;font-weight:bold;border-bottom:1px solid #eee;">Name</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">${escapeHtml(name.trim())}</td></tr>
          <tr><td style="padding:8px 12px;font-weight:bold;border-bottom:1px solid #eee;">${contactType}</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">${escapeHtml(contactTrimmed)}</td></tr>
          <tr><td style="padding:8px 12px;font-weight:bold;border-bottom:1px solid #eee;">Product</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">${escapeHtml(product.trim())}</td></tr>
          <tr><td style="padding:8px 12px;font-weight:bold;vertical-align:top;">Enquiry</td><td style="padding:8px 12px;white-space:pre-wrap;">${escapeHtml(enquiry.trim())}</td></tr>
        </table>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return res.status(500).json({ error: error.message || 'Failed to send email.' });
    }

    return res.json({ success: true });
  } catch (err) {
    console.error('Inquiry send failed:', err);
    return res.status(500).json({ error: 'Failed to send inquiry. Please try again later.' });
  }
};
