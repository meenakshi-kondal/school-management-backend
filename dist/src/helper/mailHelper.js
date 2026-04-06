"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = sendMail;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
async function sendMail(email, password) {
    const transporter = nodemailer_1.default.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
    });
    const mailOptions = {
        from: "AI School",
        to: email,
        subject: "Your Account Credentials",
        text: `Hello,\n\nYour account has been created successfully.\n\nUsername: ${email}\nPassword: ${password}\n\nPlease log in and change your password.`,
        html: `
      <p>Hello,</p>
      <p>Your account has been created successfully.</p>
      <p><b>Username:</b> ${email}</p>
      <p><b>Password:</b> ${password}</p>
      <p>Please log in and change your password.</p>
    `
    };
    try {
        await transporter.sendMail(mailOptions);
        return true;
    }
    catch (error) {
        return false;
    }
}
