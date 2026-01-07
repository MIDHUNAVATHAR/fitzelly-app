import nodemailer from 'nodemailer';

export class MailService {
    private transporter: nodemailer.Transporter | null = null;

    private getTransporter(): nodemailer.Transporter | null {
        if (this.transporter) return this.transporter;

        const user = process.env.MAIL_USER;
        const pass = process.env.MAIL_PASS;

        if (user && pass) {
            this.transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: { user, pass }
            });
            return this.transporter;
        }

        return null;
    }

    async sendOtp(to: string, otp: string) {
        const transporter = this.getTransporter();

        if (!transporter) {
            console.log("=================================================");
            console.log(`[DEV MODE - No Credentials] OTP for ${to}: ${otp}`);
            console.log("=================================================");
            return;
        }

        try {
            await transporter.sendMail({
                from: process.env.MAIL_USER,
                to,
                subject: 'Your FITZELLY Verification Code',
                html: `
                    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                        <h2 style="color: #008080;">Verify your Email</h2>
                        <p>Use the following code to complete your registration:</p>
                        <h1 style="letter-spacing: 5px; background: #f4f4f4; padding: 10px; display: inline-block;">${otp}</h1>
                        <p>This code expires in 5 minutes.</p>
                    </div>
                `
            });
            console.log(`[MailService] OTP sent to ${to}`);
        } catch (error) {
            console.error("[MailService] Failed to send email via SMTP. Falling back to console log for development.");
            console.error(error);

            console.log("=================================================");
            console.log(`[FALLBACK] OTP for ${to}: ${otp}`);
            console.log("=================================================");

            // CRITICAL: We throw the error so the Controller knows it failed
            throw new Error("SMTP_ERROR: Could not send verification email.")
        }
    }
    async sendClientInvitation(to: string, link: string, otp: string, gymName: string, role: string) {
        const transporter = this.getTransporter();

        if (!transporter) {
            console.log("=================================================");
            console.log(`[DEV MODE - No Credentials] Invitation for ${to}`);
            console.log(`Role: ${role}, Gym: ${gymName}`);
            console.log(`Link: ${link}`);
            console.log(`OTP: ${otp}`);
            console.log("=================================================");
            return;
        }

        try {
            await transporter.sendMail({
                from: process.env.MAIL_USER,
                to,
                subject: `Welcome to FITZELLY - You've been added as a ${role}`,
                html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to FITZELLY</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f9fafb; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
    <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); overflow: hidden;">
        
        <!-- Header -->
        <div style="padding: 40px 0; text-align: center; background-color: #ffffff;">
            <div style="margin-bottom: 20px;">
                <!-- Logo Layout -->
                <div style="display: inline-flex; align-items: center; justify-content: center; gap: 12px; vertical-align: middle;">
                    <!-- 'F' Logo Icon -->
                    <div style="width: 40px; height: 40px; background-color: #00ffd5; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                        <span style="font-size: 24px; font-weight: 900; color: #0f172a; line-height: 40px; display: block; width: 40px; text-align: center;">F</span>
                    </div>
                    <!-- Brand Name -->
                    <span style="font-size: 24px; font-weight: 800; color: #0f172a; letter-spacing: -0.5px;">FITZELLY</span>
                </div>
            </div>
        </div>

        <!-- Content -->
        <div style="padding: 0 48px 48px 48px; text-align: center;">
            <h1 style="margin: 0 0 24px 0; font-size: 32px; font-weight: 800; color: #0f172a; letter-spacing: -0.5px;">WELCOME!</h1>
            
            <p style="margin: 0 0 32px 0; font-size: 16px; line-height: 1.6; color: #475569;">
                You have been added as a <strong>${role}</strong> at <strong style="color: #0f172a;">${gymName}</strong>.
            </p>

            <p style="margin: 0 0 32px 0; font-size: 16px; line-height: 1.6; color: #475569;">
                To get started, please set your password using the secure link below.
            </p>

            <!-- Button -->
            <a href="${link}" style="display: inline-block; background: linear-gradient(135deg, #00ffd5 0%, #00e6c0 100%); color: #0f172a; font-weight: 700; font-size: 16px; text-decoration: none; padding: 16px 32px; border-radius: 12px; box-shadow: 0 4px 14px 0 rgba(0, 255, 213, 0.39); transition: transform 0.2s;">
                Set Your Password
            </a>

            <p style="margin: 24px 0 0 0; font-size: 14px; color: #94a3b8;">
                This link is valid for 1 hour.
            </p>
        </div>

        <!-- Footer -->
        <div style="padding: 32px; background-color: #f8fafc; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="margin: 0; font-size: 12px; color: #94a3b8;">
                © ${new Date().getFullYear()} FITZELLY. All rights reserved.
            </p>
        </div>
    </div>
</body>
</html>
                `
            });
            console.log(`[MailService] Invitation sent to ${to}`);
        } catch (error) {
            console.error("[MailService] Failed to send invitation email.");
            console.error(error);
            console.log(`[FALLBACK] Link: ${link}, OTP: ${otp}`);
            throw new Error("Failed to send invitation email. Check server logs.");
        }
    }
}

// Singleton-ish export
export const mailService = new MailService();
