import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const DEFAULT_CONTACT_TO = [
  'nceylansensoy@gmail.com',
  'ruzzfl@gmail.com',
];

function getContactRecipients(): string[] {
  const raw = process.env.CONTACT_TO_EMAIL;
  if (!raw) return DEFAULT_CONTACT_TO;
  return raw.split(',').map((e) => e.trim()).filter(Boolean);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, country, country_code, message } = body;

    if (!name || !email || !country || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    if (!resend) {
      console.error('[contact] RESEND_API_KEY is not configured');
      return NextResponse.json(
        { error: 'Contact form is temporarily unavailable' },
        { status: 503 }
      );
    }

    const from = process.env.CONTACT_FROM_EMAIL || 'Discover Kaçkar <onboarding@resend.dev>';
    const to = getContactRecipients();

    const safeName = String(name).trim();
    const safeEmail = String(email).trim().toLowerCase();
    const safePhone = phone?.trim() || '—';
    const safeCountry = String(country).trim();
    const safeCountryCode = country_code?.trim() || '';
    const safeMessage = String(message).trim();

    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: safeEmail,
      subject: `Contact form: ${safeName} (${safeCountry})`,
      text: [
        `New message from discoverkackar.com`,
        ``,
        `Name: ${safeName}`,
        `Email: ${safeEmail}`,
        `Phone: ${safePhone}`,
        `Country: ${safeCountry}${safeCountryCode ? ` (${safeCountryCode})` : ''}`,
        ``,
        `Message:`,
        safeMessage,
      ].join('\n'),
      html: `
        <h2>New contact form submission</h2>
        <p><strong>Name:</strong> ${escapeHtml(safeName)}</p>
        <p><strong>Email:</strong> <a href="mailto:${escapeHtml(safeEmail)}">${escapeHtml(safeEmail)}</a></p>
        <p><strong>Phone:</strong> ${escapeHtml(safePhone)}</p>
        <p><strong>Country:</strong> ${escapeHtml(safeCountry)}${safeCountryCode ? ` (${escapeHtml(safeCountryCode)})` : ''}</p>
        <hr />
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-wrap;">${escapeHtml(safeMessage)}</p>
      `.trim(),
    });

    if (error) {
      console.error('[contact] Resend error:', error);
      return NextResponse.json(
        { error: 'Failed to send message. Please try again or email us directly.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        data: { id: `email-${Date.now()}` },
        message: 'Contact form submitted successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in contact API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
