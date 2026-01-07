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
  const logoUrl =
    "https://ipiguiegymrirkqzuxlq.supabase.co/storage/v1/object/sign/Images/cmc-logo.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84NWIyM2FiZi1mYjA4LTQ1YzktYmM1Ny0wYTgyNGM4Zjc2M2QiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJJbWFnZXMvY21jLWxvZ28ucG5nIiwiaWF0IjoxNzY3NzAxMTI5LCJleHAiOjE3OTkyMzcxMjl9.Wlz1KwdqneP565z6sKVu80ZT0vtRWzbv6z3x6m6lfig";

  await mailer.sendMail({
    from: "IT Support <himanshu.vishwakarma@classicmarble.com>",
    to,
    subject: "Your Internal Tool Login Credentials",
    text: `
Hello,

Your account for the CMC Material Request Tool has been created.

Please use the following credentials to log in:
Login Email: ${to}
Temporary Password: ${password}

You can log in at: ${toolLink}

For security purposes, you will be required to change your password upon your first login.

If you have any questions, please contact the IT department.

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
  <title>Your Login Credentials</title>
  <!--[if mso]>
  <style>
    .fallback-font { font-family: Arial, sans-serif; }
  </style>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f6f8fa;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f6f8fa;">
    <tr>
      <td align="center" style="padding: 20px;">
        <table role="presentation" style="max-width: 600px; width: 100%; margin: 0 auto; background-color: #ffffff; border: 1px solid #d1d5db; border-radius: 8px;">

          <!-- Header -->
          <tr>
            <td style="padding: 30px 30px 20px; border-bottom: 1px solid #d1d5db; text-align: center; background-color: #ffffff;">
              <img src="cid:cmclogo" alt="Company Logo" width="180" style="display: block; margin: 0 auto 15px auto; border: 0; width: 180px; max-width: 100%;" />
              <h1 class="fallback-font" style="margin: 0; color: #111827; font-size: 24px; font-weight: 600;">Material Request Tool</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 30px 30px 40px;">
              <p class="fallback-font" style="margin: 0 0 20px; color: #374151; font-size: 16px; line-height: 1.6;">
                Hello,
              </p>
              <p class="fallback-font" style="margin: 0 0 25px; color: #374151; font-size: 16px; line-height: 1.6;">
                An account has been created for you. Please use the credentials below to log in.
              </p>

              <!-- Credentials Box -->
              <table role="presentation" style="width: 100%; background-color: #f9fafb; border: 1px solid #d1d5db; border-radius: 6px; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 20px;">
                    <p class="fallback-font" style="margin: 0 0 8px; color: #6b7280; font-size: 14px;">Login Email</p>
                    <p class="fallback-font" style="margin: 0 0 16px; color: #111827; font-size: 16px; font-weight: 600;">${to}</p>
                    <p class="fallback-font" style="margin: 0 0 8px; color: #6b7280; font-size: 14px;">Temporary Password</p>
                    <p class="fallback-font" style="margin: 0; color: #111827; font-size: 16px; font-weight: 600; font-family: 'Courier New', monospace;">${password}</p>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                <tr>
                  <td align="center">
                    <!--[if mso]>
                    <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${toolLink}" style="height:45px;v-text-anchor:middle;width:220px;" arcsize="10%" strokecolor="#2563eb" fillcolor="#2563eb">
                      <w:anchorlock/>
                      <center style="color:#ffffff;font-family:Arial,sans-serif;font-size:16px;font-weight:bold;">
                        Login to Your Account
                      </center>
                    </v:roundrect>
                    <![endif]-->
                    <a href="${toolLink}" style="background-color: #2563eb; color: #ffffff; text-decoration: none; border-radius: 5px; padding: 12px 25px; font-size: 16px; font-weight: 600; display: inline-block; mso-hide:all;">
                      Login to Your Account
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Security Notice -->
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 16px; background-color: #f9fafb; border-radius: 4px;">
                    <p class="fallback-font" style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.5;">
                      <strong>Security Reminder:</strong> For your security, please change your password after your first login.
                    </p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 30px; background-color: #f9fafb; border-top: 1px solid #d1d5db; text-align: center;">
              <p class="fallback-font" style="margin: 0 0 10px; color: #6b7280; font-size: 14px;">
                This is an automated message. Please do not reply.
              </p>
              <p class="fallback-font" style="margin: 0; color: #9ca3af; font-size: 12px;">
                © ${new Date().getFullYear()} Classic Marble Company. All Rights Reserved.
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
    attachments: [
      {
        filename: "cmc-logo.png",
        path: logoUrl,
        cid: "cmclogo", // content-id
      },
    ],
  });
}
