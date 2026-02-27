const nodemailer = require('nodemailer')
const dotenv = require('dotenv')
dotenv.config();
const express = require('express');
const app = express();
const cors = require('cors');
const prisma = require('./prismaClient.js')
//middlewares
app.use(cors());
app.use(express.json());
//health checks
app.get('/', (req, res) => {
    res.send("Server Running");
});


// mailer
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

async function sendEmail(to, subject, message) {
    const info = await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject,
        text: message,
    });

    console.log("Message sent", info.messageId);
}

//API

app.post('/sendmail', async (req, res) => {
    try {
        const { to, subject, message } = req.body;

        await sendEmail(
            to,
            subject,
            message
        );
        await prisma.email.create({
            data: {
                to,
                subject,
                message,
            },
        });

        res.json({ message: "Email sent" })
    } catch (error) {
        res.status(500).json({ Error: "Failed to sent" })
    }
})

//server port
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`)
})