import nodemailer from 'nodemailer';

export async function sendResetCodeEmail(to: string, code: string) {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (!user || !pass) {
    throw new Error('GMAIL_USER və ya GMAIL_APP_PASSWORD .env faylında təyin edilməyib.');
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: { user, pass },
    tls: { rejectUnauthorized: false },
  });

  await transporter.sendMail({
    from: `"Valorum" <${user}>`,
    to,
    subject: 'Şifrə Sıfırlama Kodu - Valorum',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; background: #0a0a09; border-radius: 16px; overflow: hidden; border: 1px solid #222;">
        <div style="padding: 40px 32px; text-align: center;">
          <h1 style="color: #fff; font-size: 32px; margin: 0 0 4px;">Valorum<span style="color: #006B8A;">.</span></h1>
          <p style="color: #94a3b8; font-size: 14px; margin: 0 0 32px;">Şifrə Sıfırlama</p>
          <p style="color: #cbd5e1; font-size: 15px; margin: 0 0 24px;">
            Şifrənizi sıfırlamaq üçün aşağıdakı kodu istifadə edin:
          </p>
          <div style="background: #004E64; border-radius: 12px; padding: 20px; margin: 0 0 24px;">
            <span style="color: #fff; font-size: 36px; font-weight: 900; letter-spacing: 8px;">${code}</span>
          </div>
          <p style="color: #64748b; font-size: 13px; margin: 0 0 8px;">
            Bu kod <strong style="color: #94a3b8;">15 dəqiqə</strong> ərzində etibarlıdır.
          </p>
          <p style="color: #475569; font-size: 12px; margin: 0;">
            Əgər bu sorğunu siz göndərməmisinizsə, bu mesajı nəzərə almayın.
          </p>
        </div>
      </div>
    `,
  });
}
