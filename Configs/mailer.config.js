// IMPORTING REQUIREMENTS
const nodemailer = require("nodemailer");
require("dotenv").config();

// SETTING UP SMTP TRANSPORTER
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

// FUNCTION TO SEND MAILS
const sendMail = async (to, subject, text) => {
    try {
        await transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject,
            text,
        });
    } catch (error) {
        console.error("Error sending email:", error);
    }
};

// EXPORTING THE FUNCTION SENDMAIL 
module.exports = sendMail;
