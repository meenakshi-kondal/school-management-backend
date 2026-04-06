import { isCredentialsExist, isUser, isUserExist, saveToken, saveUser, updatePassword, updatePasswordById } from "../services/authService";
import { notify } from "../utils/enum";
import { sendErrorResponse, sendSuccessResponse } from "../utils/response";
import { adminValidation, loginValidation, studentValidation, teacherValidation, userValidation, } from "../validations/authValidation";
import { Request, Response } from "express";
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { sendMail } from "../helper/mailHelper";
dotenv.config();

const JWT_SECRET_KEY = process.env.JWT_SECRET || '';

/* This API is used for the teacher and students admission in school */
export const registration = async (req: Request, res: Response) => {
   
	try {

		const payload = req.body;

		// Choose validation based on role
		let validation = userValidation;
		if (payload.role === 'student') {
			validation = studentValidation;
		} else if (payload.role === 'teacher') {
			validation = teacherValidation;
		} else if (payload.role === 'admin') {
			validation = adminValidation;
		}

		const { error, value } = validation.validate(payload);
		if (error) return sendErrorResponse(res, 400, error.details[0].message);

		// check if user already exists for that role
		const userExistResult = await isUserExist(payload.email, payload.role);
		if (userExistResult) {
			return sendErrorResponse(res, 400, `User already exists with this email for the role of ${payload.role}`);
		}

		// created unique password
		const credentials = await createPassword(payload.role);
		if (!credentials) {
			return sendErrorResponse(res, 400, notify.WENT_WRONG);
		}

		// add user in db
		payload.password = credentials.hashedPassword;
		const user = await saveUser(payload);

		if (!user) {
			return sendErrorResponse(res, 400, notify.WENT_WRONG);
		}

		// send mail to user
		await sendMail(
			payload.email, credentials.password
		);

		// Note: We continue even if mail fails, but log it or return success with credentials
		return sendSuccessResponse(res, 201, `Added ${payload.role} successfully`, { email: payload.email, password: credentials.password});

	} catch (error: any) {
		return sendErrorResponse(res, 400, error.message);
	}
}

export const login = async (req: Request, res: Response) => {
   
	try {

		const payload = req.body;

		const { error, value } = loginValidation.validate(payload);
		if (error) return sendErrorResponse(res, 400, error.details[0].message);

		// check user is exist or not
		const user = await isUserExist(payload.username);
		if (!user) {
			return sendErrorResponse(res, 401, notify.NOT_USER);
		}

		const isMatch = await bcrypt.compare(payload.password, user.password);
		if (!isMatch) {
			return sendErrorResponse(res, 401, notify.WRONG_PASSWORD);
		}

		// generate token
		const token = jwt.sign(
			{ userId: user._id, email: user.email, role: user.role },
			JWT_SECRET_KEY,
			{ expiresIn: "24h" }
		);

		const tokenPayload = {
			token, 
			userId: user._id.toString(),
			expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours expiration Date object
		};
		await saveToken(tokenPayload);

		return sendSuccessResponse(res, 200, notify.LOGIN, { token, userId: user._id, name: user.name, role: user.role });

	} catch (error: any) {
		return sendErrorResponse(res, 400, error.message);
	}
}

export const forgot_password = async (req: Request, res: Response) => {
   
	try {

		const payload = req.body;
		if (!payload || !payload.email) {
			return sendErrorResponse(res, 401, notify.EMAIL_REQUIRED);
		}

		// check in db email is exist or not
		const user = await isUserExist(payload.email);
		if (!user) {
			return sendErrorResponse(res, 401, notify.NOT_USER);
		}

		// create new password
		const newPassword = await createPassword();

		if (!newPassword) {
			return sendErrorResponse(res, 401, notify.WENT_WRONG);
		}

		// save in db
		const hashedPassword = newPassword.hashedPassword;
		await updatePassword({ password: hashedPassword, email: payload.email });

		// send mail to user
		// await sendMail(
		//     payload.email, newPassword.password
		// );

		return sendSuccessResponse(res, 200, notify.NEW_PASSWORD_SENT, {});

	} catch (error: any) {
		return sendErrorResponse(res, 400, error.message);
	}
}

export const update_password = async (req: Request, res: Response) => {
   
	try {

		const payload = req.body;

		if (!payload || !payload.old_password || !payload.new_password || !payload.id) {
			return sendErrorResponse(res, 401, notify.CRED_REQUIRED);
		}

		// check user exist or not
		const user = await isUser(payload.id);
		if (!user) {
			return sendErrorResponse(res, 401, notify.NOT_USER);
		}

		// compare old password
		const isMatch = await bcrypt.compare(payload.old_password, (user as any).password);
		if (!isMatch) {
			return sendErrorResponse(res, 401, notify.WRONG_PASSWORD);
		}

		// verify new_password
		const updated_password = await verifyPassword(payload.new_password);

		// update user
		await updatePasswordById({ password: updated_password, id: payload.id });

		return sendSuccessResponse(res, 200, notify.PASSWORD_UPDATE, {});

	} catch (error: any) {
		return sendErrorResponse(res, 400, error.message);
	}
}

async function createPassword(role?: string) {
   
	try {

		const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

		while (true) {

			let password = "";
			for (let i = 0; i < 6; i++) {
				password += chars.charAt(Math.floor(Math.random() * chars.length));
			}

			// hash the password
			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash(password, salt);

			// check if hashed password exists in DB
			const exists = await isCredentialsExist(hashedPassword, role);

			if (!exists) {
				return { password, hashedPassword };
			}
		}
	} catch (error) {
		return null;
	}

}

async function verifyPassword(password: string) {

	while (true) {

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);
		const exists = await isCredentialsExist(hashedPassword);
		if (!exists) {
			return hashedPassword;
		}
	}
}
