import nodemailer from "nodemailer";

function createTransporter() {
    console.log("SMTP_USER:", process.env.SMTP_USER);
    console.log("SMTP_PASS:", process.env.SMTP_PASS ? "DEFINED" : "UNDEFINED");
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

export async function sendVerificationEmail(
  to: string,
  name: string,
  url: string,
): Promise<void> {
  const subject = "Xác thực email";
  const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Xác thực email</h2>
        <p>Xin chào ${name},</p>
        <p>Cảm ơn bạn đã đăng ký tài khoản! Vui lòng xác thực email để hoàn tất quá trình đăng ký.</p>
        <div style="background-color: #f4f4f4; padding: 20px; margin: 20px 0; border-radius: 5px; text-align: center;">
          <a href="${url}"
             style="background-color: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Xác thực email
          </a>
        </div>
        <p>Nếu bạn không tạo tài khoản này, vui lòng bỏ qua email này.</p>
        <p>Trân trọng,<br>Đội ngũ Ecommerce Store</p>
      </div>
    `;
  const transporter = createTransporter();
  await transporter.sendMail({
    from: process.env.SMTP_FROM || "dev.bxmt@projgis.link",
    to,
    subject,
    html,
  });
}