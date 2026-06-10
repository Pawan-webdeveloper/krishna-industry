import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { Resend } from 'resend';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

const TO_EMAIL = process.env.INQUIRY_TO_EMAIL || 'pawan572893@gmail.com';
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

function getResend() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

app.use(express.json());
app.use(express.static(path.join(__dirname, '../html-version')));

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidPhone(value: string): boolean {
  const digits = value.replace(/\D/g, '');
  return digits.length >= 7 && digits.length <= 15;
}

function isValidContact(value: string): boolean {
  const trimmed = value.trim();
  return isValidEmail(trimmed) || isValidPhone(trimmed);
}

app.post('/api/inquiry', async (req, res) => {
  const resend = getResend();
  if (!resend) {
    return res.status(500).json({ error: 'Email service is not configured. Add RESEND_API_KEY to your .env file.' });
  }

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
});

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Inquiry emails will be sent to: ${TO_EMAIL}`);
});
