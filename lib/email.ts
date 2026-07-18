import { Resend } from 'resend';

let _resend: Resend | null = null;
function getResend(): Resend {
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY);
  }
  return _resend;
}

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'mamaddev6@gmail.com';

interface ContactEmailData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface CareerEmailData {
  name: string;
  email: string;
  phone: string;
  position: string;
  message: string;
  resumeUrl?: string;
}

export async function sendContactEmail(data: ContactEmailData): Promise<boolean> {
  try {
    await getResend().emails.send({
      from: 'DENIZ Watch <onboarding@resend.dev>',
      to: ADMIN_EMAIL,
      subject: `New Contact: ${data.subject}`,
      html: `
        <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
          <h2 style="color: #1B3A5C; font-family: 'Cormorant Garamond', serif; font-size: 28px; margin-bottom: 24px;">New Contact Message</h2>
          <div style="background: #F8F9FB; padding: 24px; border-radius: 8px; margin-bottom: 16px;">
            <p style="margin: 8px 0;"><strong>Name:</strong> ${data.name}</p>
            <p style="margin: 8px 0;"><strong>Email:</strong> ${data.email}</p>
            <p style="margin: 8px 0;"><strong>Subject:</strong> ${data.subject}</p>
          </div>
          <div style="background: #FFFFFF; border: 1px solid #E8E8E8; padding: 24px; border-radius: 8px;">
            <p style="margin: 0; line-height: 1.6; color: #1A1A1A;">${data.message.replace(/\n/g, '<br>')}</p>
          </div>
        </div>
      `,
    });
    return true;
  } catch (error) {
    console.error('Failed to send contact email:', error);
    return false;
  }
}

export async function sendCareerEmail(data: CareerEmailData): Promise<boolean> {
  try {
    await getResend().emails.send({
      from: 'DENIZ Watch <onboarding@resend.dev>',
      to: ADMIN_EMAIL,
      subject: `New Career Application: ${data.position}`,
      html: `
        <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
          <h2 style="color: #1B3A5C; font-family: 'Cormorant Garamond', serif; font-size: 28px; margin-bottom: 24px;">New Career Application</h2>
          <div style="background: #F8F9FB; padding: 24px; border-radius: 8px; margin-bottom: 16px;">
            <p style="margin: 8px 0;"><strong>Name:</strong> ${data.name}</p>
            <p style="margin: 8px 0;"><strong>Email:</strong> ${data.email}</p>
            <p style="margin: 8px 0;"><strong>Phone:</strong> ${data.phone}</p>
            <p style="margin: 8px 0;"><strong>Position:</strong> ${data.position}</p>
            ${data.resumeUrl ? `<p style="margin: 8px 0;"><strong>Resume:</strong> <a href="${data.resumeUrl}" style="color: #1B3A5C;">View Resume</a></p>` : ''}
          </div>
          <div style="background: #FFFFFF; border: 1px solid #E8E8E8; padding: 24px; border-radius: 8px;">
            <p style="margin: 0; line-height: 1.6; color: #1A1A1A;">${data.message.replace(/\n/g, '<br>')}</p>
          </div>
        </div>
      `,
    });
    return true;
  } catch (error) {
    console.error('Failed to send career email:', error);
    return false;
  }
}

export async function sendContactConfirmation(data: ContactEmailData): Promise<boolean> {
  try {
    await getResend().emails.send({
      from: 'DENIZ Watch <onboarding@resend.dev>',
      to: data.email,
      subject: 'پیام شما دریافت شد - DENIZ Watch',
      html: `
        <div style="font-family: 'Estedad', 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; direction: rtl;">
          <h2 style="color: #1B3A5C; font-family: 'Cormorant Garamond', serif; font-size: 28px; margin-bottom: 24px;">پیام شما دریافت شد</h2>
          <p style="color: #1A1A1A; line-height: 1.8; margin-bottom: 16px;">عزیز ${data.name}،</p>
          <p style="color: #1A1A1A; line-height: 1.8; margin-bottom: 16px;">تیم DENIZ Watch پیام شما را دریافت کرده است. تیم ما به زودی با شما تماس خواهد گرفت.</p>
          <div style="background: #F8F9FB; padding: 20px; border-radius: 8px; margin: 24px 0;">
            <p style="margin: 8px 0; color: #6B7280;"><strong>موضوع:</strong> ${data.subject}</p>
          </div>
          <p style="color: #6B7280; font-size: 14px;">با احترام،<br>تیم DENIZ Watch</p>
        </div>
      `,
    });
    return true;
  } catch (error) {
    console.error('Failed to send confirmation email:', error);
    return false;
  }
}

export async function sendCareerConfirmation(data: CareerEmailData): Promise<boolean> {
  try {
    await getResend().emails.send({
      from: 'DENIZ Watch <onboarding@resend.dev>',
      to: data.email,
      subject: 'درخواست استخدام شما دریافت شد - DENIZ Watch',
      html: `
        <div style="font-family: 'Estedad', 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; direction: rtl;">
          <h2 style="color: #1B3A5C; font-family: 'Cormorant Garamond', serif; font-size: 28px; margin-bottom: 24px;">درخواست استخدام دریافت شد</h2>
          <p style="color: #1A1A1A; line-height: 1.8; margin-bottom: 16px;">عزیز ${data.name}،</p>
          <p style="color: #1A1A1A; line-height: 1.8; margin-bottom: 16px;">درخواست استخدام شما برای موقعیت "${data.position}" با موفقیت دریافت گردید. تیم منابع انسانی ما رزومه شما را بررسی خواهد کرد و در صورت تطابق، با شما تماس حاصل می‌کند.</p>
          <p style="color: #6B7280; font-size: 14px;">با احترام،<br>تیم DENIZ Watch</p>
        </div>
      `,
    });
    return true;
  } catch (error) {
    console.error('Failed to send career confirmation email:', error);
    return false;
  }
}