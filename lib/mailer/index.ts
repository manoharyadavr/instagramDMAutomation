import nodemailer from 'nodemailer';

interface MailOptions {
    to: string;
    subject: string;
    html: string;
    text?: string;
}

class Mailer {
    private transporter: nodemailer.Transporter | null = null;

    private async getTransporter(): Promise<nodemailer.Transporter> {
        if (this.transporter) {
            return this.transporter;
        }

        // Check if SMTP is configured
        const smtpHost = process.env.SMTP_HOST;
        const smtpPort = process.env.SMTP_PORT;
        const smtpUser = process.env.SMTP_USER;
        const smtpPassword = process.env.SMTP_PASSWORD;

        if (!smtpHost || !smtpUser || !smtpPassword) {
            console.warn('SMTP not configured. Emails will be logged to console only.');
            // Create a mock transporter for development
            this.transporter = nodemailer.createTransport({
                streamTransport: true,
                newline: 'unix',
                buffer: true,
            });
            return this.transporter;
        }

        this.transporter = nodemailer.createTransport({
            host: smtpHost,
            port: parseInt(smtpPort || '587'),
            secure: parseInt(smtpPort || '587') === 465,
            auth: {
                user: smtpUser,
                pass: smtpPassword,
            },
        });

        return this.transporter;
    }

    async sendMail(options: MailOptions): Promise<void> {
        const transporter = await this.getTransporter();
        const from = process.env.SMTP_FROM || process.env.SMTP_USER || 'noreply@instagramautomation.com';

        try {
            const info = await transporter.sendMail({
                from,
                to: options.to,
                subject: options.subject,
                html: options.html,
                text: options.text || this.htmlToText(options.html),
            });

            // In development mode (mock transporter), log the email
            if (process.env.NODE_ENV === 'development') {
                console.log('Email sent (mock):', {
                    to: options.to,
                    subject: options.subject,
                    messageId: info.messageId,
                });
            }
        } catch (error: any) {
            console.error('Error sending email:', error);
            throw new Error(`Failed to send email: ${error.message}`);
        }
    }

    async sendWelcomeEmail(to: string, name: string): Promise<void> {
        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: #4F46E5; color: white; padding: 20px; text-align: center; }
                    .content { padding: 20px; background: #f9f9f9; }
                    .button { display: inline-block; padding: 12px 24px; background: #4F46E5; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Welcome to Instagram Automation!</h1>
                    </div>
                    <div class="content">
                        <p>Hi ${name},</p>
                        <p>Welcome to Instagram Automation! We're excited to have you on board.</p>
                        <p>Get started by connecting your Instagram account and setting up your automation templates.</p>
                        <a href="${process.env.NEXTAUTH_URL}/dashboard" class="button">Go to Dashboard</a>
                        <p>If you have any questions, feel free to reach out to our support team.</p>
                        <p>Best regards,<br>The Instagram Automation Team</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        await this.sendMail({
            to,
            subject: 'Welcome to Instagram Automation',
            html,
        });
    }

    async sendPasswordResetEmail(to: string, resetToken: string): Promise<void> {
        const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`;
        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: #4F46E5; color: white; padding: 20px; text-align: center; }
                    .content { padding: 20px; background: #f9f9f9; }
                    .button { display: inline-block; padding: 12px 24px; background: #4F46E5; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                    .warning { color: #dc2626; font-size: 12px; margin-top: 20px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Password Reset Request</h1>
                    </div>
                    <div class="content">
                        <p>You requested to reset your password.</p>
                        <p>Click the button below to reset your password:</p>
                        <a href="${resetUrl}" class="button">Reset Password</a>
                        <p class="warning">This link will expire in 1 hour. If you didn't request this, please ignore this email.</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        await this.sendMail({
            to,
            subject: 'Reset Your Password',
            html,
        });
    }

    async sendSubscriptionConfirmationEmail(to: string, planName: string, amount: number): Promise<void> {
        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: #4F46E5; color: white; padding: 20px; text-align: center; }
                    .content { padding: 20px; background: #f9f9f9; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Subscription Confirmed</h1>
                    </div>
                    <div class="content">
                        <p>Your subscription to the <strong>${planName}</strong> plan has been confirmed!</p>
                        <p>Amount: ₹${amount}</p>
                        <p>Thank you for your subscription. You can now access all features of your plan.</p>
                        <a href="${process.env.NEXTAUTH_URL}/dashboard/billing" class="button">View Billing</a>
                    </div>
                </div>
            </body>
            </html>
        `;

        await this.sendMail({
            to,
            subject: 'Subscription Confirmed',
            html,
        });
    }

    private htmlToText(html: string): string {
        return html
            .replace(/<[^>]*>/g, '')
            .replace(/&nbsp;/g, ' ')
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .trim();
    }
}

export const mailer = new Mailer();


