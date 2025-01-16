import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.mailtrap.io',
  port: 587,
  auth: {
    user: process.env.MAILTRAP_SENDER_EMAIL,
    pass: process.env.MAILTRAP_SENDER_EMAIL_PASSWORD,
  },
});

export const sendEmail = async (to: string, subject: string, html: string): Promise<void> => {
  try {
    await transporter.sendMail({
      from: 'your-email@example.com',
      to,
      subject,
      html,
    });

    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
};
