import nodemailer from 'nodemailer';
import path from 'path';
import fs from 'fs';
import ejs from 'ejs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    service: process.env.SMTP_SERVICES || 'gmail',
    secure: true,
    port: 465,
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASS,
    },
});
const getTemplate = (filename, body) => {
    body.dDate = _.formattedDate();
    const emailTemplatePath = path.join(__dirname, `./dir/email_templates`, filename);
    const template = fs.readFileSync(emailTemplatePath, { encoding: 'utf-8' });
    return ejs.render(template, body);
};
const operations = {
    send: (body) => {
        let filename = '';
        let subject = '';
        if (body.type === 'forgotPassword-admin') {
            filename = 'admin_forgot_password.html';
            subject = 'TS boilerplate Admin Reset Password';
        }
        if (body.type === 'registerUser') {
            filename = 'account_activations.html';
            subject = 'TS boilerplate Account Activation';
        }
        if (body.type == 'verifyEmail') {
            filename = 'verify_email.html';
            subject = 'TS boilerplate Email Verification';
        }
        const template = getTemplate(filename, body);
        return operations.sendEmail(subject, body, template);
    },
    sendEmail: async (subject, body, template) => {
        return transporter.sendMail({
            from: process.env.SMTP_EMAIL,
            to: body.sEmail,
            subject,
            html: template,
        });
    },
};
export default operations;
