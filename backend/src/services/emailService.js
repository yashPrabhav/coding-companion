const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT || 465),
    secure: Number(process.env.SMTP_PORT || 465) === 465,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

const sendPasswordResetEmail = async ({ to, resetLink }) => {
    if (!to || !resetLink) {
        throw new Error("Recipient email and reset link are required.");
    }

    if (!process.env.SMTP_USER || !process.env.SMTP_PASS || !process.env.SMTP_FROM) {
        throw new Error("Password-reset email is not configured. Check SMTP_USER, SMTP_PASS, and SMTP_FROM.");
    }

    const info = await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to,
        subject: "Reset your Coding Companion password",
        text: [
            "We received a request to reset your Coding Companion password.",
            "",
            `Reset your password using this link: ${resetLink}`,
            "",
            "This link expires in 15 minutes.",
            "If you did not request this, you can ignore this email."
        ].join("\n"),
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; line-height: 1.5;">
                <h2>Reset your Coding Companion password</h2>
                <p>We received a request to reset your Coding Companion password.</p>
                <p><a href="${resetLink}" style="display:inline-block;padding:12px 18px;background:#2563eb;color:#fff;text-decoration:none;border-radius:6px;">Reset Password</a></p>
                <p>This link expires in 15 minutes.</p>
                <p>If you did not request this, you can ignore this email.</p>
            </div>
        `
    });

    return { messageId: info.messageId, accepted: info.accepted, rejected: info.rejected };
};

module.exports = { sendPasswordResetEmail };
