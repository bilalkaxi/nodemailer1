require("dotenv").config();
const express = require("express");
const sendEmail = require("./mailer");
const crypto = require('crypto')

const app = express();
app.use(express.json());

const verificationTokens = {};

app.post("/register", async (req, res) => {
    try {
        const { email } = req.body;

        const token = crypto.randomBytes(32).toString("hex");

        verificationTokens[token] = email;

        const verificationLink = `http://localhost:3000/verify/${token}`;

        await sendEmail(
            email,
            "Verify Your Email",
            `<h2>Click to verify</h2>
            <a href="${verificationLink}">Click here to verify</a>`
        );

        res.json({
            message: "Verification email sent"
        });
    } catch (error) {
        console.error(error);
        res.status(500), json({ error: "Registration failed" });
    }
});
//verify token
app.get('/verify/:token', (req, res) => {
    const { token } = req.params;

    if (verificationTokens[token]) {
        const email = verificationTokens[token];
        delete verificationTokens[token];

        return res.send(`Email ${email} was verified successfully`)
    }
    res.status(400).send("Invalid or expired token");
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});