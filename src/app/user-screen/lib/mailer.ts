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
  const toolLink = process.env.TOOL_LINK;

  await mailer.sendMail({
    from: "IT Support <himanshu.vishwakarma@classicmarble.com>",
    to,
    subject: "Your Internal Tool Login Credentials",
    text: `
Hello,

Your account has been created for the CMC Material Request Tool.

Login Email: ${to}
Temporary Password: ${password}

Login here: ${toolLink}

Please change your password after your first login for security purposes.

Best regards,
IT Team
Classic Marble Company
`,
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Login Credentials</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f4;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f4f4f4;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; border-radius: 8px 8px 0 0; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">Welcome!</h1>
              <p style="margin: 10px 0 0; color: #000000; font-size: 16px;">Your account is ready</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.6;">
                Hello,
              </p>
              <p style="margin: 0 0 30px; color: #333333; font-size: 16px; line-height: 1.6;">
                Your account has been successfully created for the <strong>CMC Material Request Tool</strong>. You can now access the system using the credentials below.
              </p>

              <!-- Credentials Box -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f8f9fa; border-radius: 6px; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 25px;">
                    <table role="presentation" style="width: 100%; border-collapse: collapse;">
                      <tr>
                        <td style="padding: 8px 0;">
                          <span style="color: #6b7280; font-size: 14px; font-weight: 500; display: block; margin-bottom: 4px;">Login Email</span>
                          <span style="color: #1f2937; font-size: 16px; font-weight: 600;">${to}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 16px 0 8px;">
                          <span style="color: #6b7280; font-size: 14px; font-weight: 500; display: block; margin-bottom: 4px;">Temporary Password</span>
                          <span style="color: #1f2937; font-size: 16px; font-weight: 600; font-family: 'Courier New', monospace; background-color: #e5e7eb; padding: 8px 12px; border-radius: 4px; display: inline-block;">${password}</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                <tr>
                  <td style="text-align: center;">
                    <a href="${toolLink}" style="display: inline-block; padding: 14px 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 6px rgba(102, 126, 234, 0.25);">
                      Login to CMC Tool
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Security Notice -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 4px; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 16px 20px;">
                    <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.6;">
                      <strong>⚠️ Security Reminder:</strong> Please change your password immediately after your first login to ensure your account security.
                    </p>
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 10px; color: #333333; font-size: 16px; line-height: 1.6;">
                If you have any questions or need assistance, please don't hesitate to contact us.
              </p>
              <p style="margin: 0; color: #333333; font-size: 16px; line-height: 1.6;">
                Best regards,<br>
                <strong>IT Team</strong><br>
                Classic Marble Company
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 30px; background-color: #f8f9fa; border-radius: 0 0 8px 8px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 10px; color: #6b7280; font-size: 14px;">
                This is an automated message, please do not reply to this email.
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                © ${new Date().getFullYear()} Classic Marble Company. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`,
  });
}
