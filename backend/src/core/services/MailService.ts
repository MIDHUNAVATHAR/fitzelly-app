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
    async sendClientInvitation(to: string, link: string, otp: string) {
        const transporter = this.getTransporter();

        if (!transporter) {
            console.log("=================================================");
            console.log(`[DEV MODE - No Credentials] Invitation for ${to}`);
            console.log(`Link: ${link}`);
            console.log(`OTP: ${otp}`);
            console.log("=================================================");
            return;
        }

        try {
            await transporter.sendMail({
                from: process.env.MAIL_USER,
                to,
                subject: 'You have been added to FITZELLY Gym',
                html: `
                    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                        <h2 style="color: #008080;">Welcome to FITZELLY!</h2>
                        <p>You have been invited to join the gym dashboard.</p>
                        <p>Please click the link below to set your password:</p>
                        <a href="${link}" style="background-color: #008080; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px 0;">Set Password</a>
                        <p>Your verification code is: <strong>${otp}</strong></p>
                        <p>This link and code will expire in 5 minutes.</p>
                    </div>
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
