import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { render } from '@react-email/components';

interface SendMailConfiguration {
  email: string;
  subject: string;
  text?: string;
  template: any;
}

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport(
      {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: true,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
        tls: {
          rejectUnauthorized: true,
        },
      },
      {
        from: {
          name: 'Smart Click',
          address: 'mailtrap@zenithinova.com.br',
        },
        sender: {
          name: 'Smart Click',
          address: 'mailtrap@zenithinova.com.br',
        },
      },
    );
  }

  /**
   * Tranform the React template to HTML
   * @param template
   * @returns string
   */
  private generateEmail = (template) => {
    return render(template);
  };

  public async sendMail({ email, subject, template }: SendMailConfiguration) {
    const html = this.generateEmail(template);

    await this.transporter.sendMail({
      to: email,
      subject,
      html,
    });
  }
}
