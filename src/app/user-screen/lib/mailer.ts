import nodemailer from "nodemailer";

export const mailer = nodemailer.createTransport({
  host: process.env.OUTLOOK_SMTP_HOST,
  port: Number(process.env.OUTLOOK_SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.OUTLOOK_SMTP_USER,
    pass: process.env.OUTLOOK_SMTP_PASS,
  },
});

export async function sendCredentialsEmail(to: string, password: string) {
  await mailer.sendMail({
    from: "IT Support <himanshu.vishwakarma@classicmarble.com>",
    to,
    subject: "Your Internal Tool Login Credentials",
    text: `
Hello,

Your account has been created.

Login Email: ${to}
Temporary Password: ${password}

Please change your password after login if required.

– IT Team
`,
  });
}
