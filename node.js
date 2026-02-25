//import nodemailer from "nodemailer";
const nodemailer = require('nodemailer')
const dotenv = require('dotenv');
dotenv.config();
async function main() {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        }
    });

    const info = await transporter.sendMail({
        from: "Bilal",
        to: "bilaljamiljtu@gmail.com",
        subject: "Test Email",
        text: "Hello from Nodemailer",
        html: "<b>Hello From Nodemailer</b>"
    });

    console.log(('message sent', info.messageId))
}

main();

console.log(process.env.EMAIL_USER, process.env.EMAIL_PASS)