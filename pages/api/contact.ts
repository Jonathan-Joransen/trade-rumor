import nodemailer from 'nodemailer';
import type { NextApiRequest, NextApiResponse } from 'next'


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if(req.method === 'POST') {
    const {subject, email, message} = req.body
    
    let text = `Email: ${email}\n Message: ${message}`

    const mailService = new MailService();
    await mailService.sendMail({
        to: process.env.CONTACT_EMAIL,
        subject: 'Contact Form: ' + subject,
        text: text,
    } as any);
    return res.status(200).json("Success")
  }
}

interface MailInterface {
    from: string;
    to: string;
    cc?: string;
    bcc?: string;
    subject: string;
    text?: string;
    html?: string;
}

class MailService {
    private static instance: MailService;
    private transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: process.env.SMTP_TLS === 'yes' ? true : false,
            auth: {
                user: process.env.SMTP_USERNAME,
                pass: process.env.SMTP_PASSWORD,
            },
        } as any);
    }
    
    //SEND MAIL
    async sendMail(
        options: MailInterface
    ) {
        return await this.transporter
            .sendMail({ 
                from: `"nbatraderumor.com" ${process.env.SMTP_SENDER as string}`,
                to: options.to,
                cc: options.cc,
                bcc: options.bcc,
                subject: options.subject,
                text: options.text,
                html: options.html,
            })
            .then((info) => {
                return info;
            });
    }
}