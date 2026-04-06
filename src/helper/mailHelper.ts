import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export async function sendMail(email: string, password: string) {

	const transporter = nodemailer.createTransport({
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
	} catch (error) {
		return false;
	}
}
