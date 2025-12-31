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
}

// Singleton-ish export
export const mailService = new MailService();
