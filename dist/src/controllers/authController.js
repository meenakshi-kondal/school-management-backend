"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.update_password = exports.forgot_password = exports.login = exports.registration = void 0;
const authService_1 = require("../services/authService");
const enum_1 = require("../utils/enum");
const response_1 = require("../utils/response");
const authValidation_1 = require("../validations/authValidation");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const mailHelper_1 = require("../helper/mailHelper");
dotenv_1.default.config();
const JWT_SECRET_KEY = process.env.JWT_SECRET || '';
const registration = async (req, res) => {
    try {
        const payload = req.body;
        // Choose validation based on role
        let validation = authValidation_1.userValidation;
        if (payload.role === 'student') {
            validation = authValidation_1.studentValidation;
        }
        else if (payload.role === 'teacher') {
            validation = authValidation_1.teacherValidation;
        }
        const { error, value } = validation.validate(payload);
        if (error)
            return (0, response_1.sendErrorResponse)(res, 400, error.details[0].message);
        // check if user already exists
        const userExist = await (0, authService_1.isUserExist)(payload.email);
        if (userExist) {
            return (0, response_1.sendErrorResponse)(res, 400, "User already exists with this email");
        }
        // created unique password
        const credentials = await createPassword();
        if (!credentials) {
            return (0, response_1.sendErrorResponse)(res, 400, enum_1.notify.WENT_WRONG);
        }
        // add user in db
        payload.password = credentials.hashedPassword;
        const user = await (0, authService_1.saveUser)(payload);
        if (!user) {
            return (0, response_1.sendErrorResponse)(res, 400, enum_1.notify.WENT_WRONG);
        }
        // send mail to user
        const sentMail = await (0, mailHelper_1.sendMail)(payload.email, credentials.password);
        // Note: We continue even if mail fails, but log it or return success with credentials
        return (0, response_1.sendSuccessResponse)(res, 201, `Added ${payload.role} successfully`, { email: payload.email, password: credentials.password });
    }
    catch (error) {
        return (0, response_1.sendErrorResponse)(res, 400, error.message);
    }
};
exports.registration = registration;
const login = async (req, res) => {
    try {
        const payload = req.body;
        const { error, value } = authValidation_1.loginValidation.validate(payload);
        if (error)
            return (0, response_1.sendErrorResponse)(res, 400, error.details[0].message);
        // check user is exist or not
        const isUser = await (0, authService_1.isUserExist)(payload.username);
        if (!isUser) {
            return (0, response_1.sendErrorResponse)(res, 401, enum_1.notify.NOT_USER);
        }
        const isMatch = await bcryptjs_1.default.compare(payload.password, isUser.password);
        if (!isMatch) {
            return (0, response_1.sendErrorResponse)(res, 401, enum_1.notify.WRONG_PASSWORD);
        }
        // generate token
        const token = jsonwebtoken_1.default.sign({ userId: isUser._id, email: isUser.email }, JWT_SECRET_KEY, { expiresIn: "1h" });
        const tokenPayload = {
            token, user_id: isUser._id.toString()
        };
        await (0, authService_1.saveToken)(tokenPayload);
        return (0, response_1.sendSuccessResponse)(res, 200, enum_1.notify.LOGIN, { token, user_id: isUser._id, name: isUser.name });
    }
    catch (error) {
        return (0, response_1.sendErrorResponse)(res, 400, error.message);
    }
};
exports.login = login;
const forgot_password = async (req, res) => {
    try {
        const payload = req.body;
        if (!payload || !payload.email) {
            return (0, response_1.sendErrorResponse)(res, 401, enum_1.notify.EMAIL_REQUIRED);
        }
        // check in db email is exist or not
        const user = await (0, authService_1.isUserExist)(payload.email);
        if (!user) {
            return (0, response_1.sendErrorResponse)(res, 401, enum_1.notify.NOT_USER);
        }
        // create new password
        const newPassword = await createPassword();
        if (!newPassword) {
            return (0, response_1.sendErrorResponse)(res, 401, enum_1.notify.WENT_WRONG);
        }
        // save in db
        const hashedPassword = newPassword.hashedPassword;
        await (0, authService_1.updatePassword)({ password: hashedPassword, email: payload.email });
        // send mail to user
        // await sendMail(
        //     payload.email, newPassword.password
        // );
        return (0, response_1.sendSuccessResponse)(res, 200, enum_1.notify.NEW_PASSWORD_SENT, {});
    }
    catch (error) {
        return (0, response_1.sendErrorResponse)(res, 400, error.message);
    }
};
exports.forgot_password = forgot_password;
const update_password = async (req, res) => {
    try {
        const payload = req.body;
        if (!payload || !payload.old_password || !payload.new_password || !payload.id) {
            return (0, response_1.sendErrorResponse)(res, 401, enum_1.notify.CRED_REQUIRED);
        }
        // check user exist or not
        const user = await (0, authService_1.isUser)(payload.id);
        if (!user) {
            return (0, response_1.sendErrorResponse)(res, 401, enum_1.notify.NOT_USER);
        }
        // compare old password
        const isMatch = await bcryptjs_1.default.compare(payload.old_password, user.password);
        if (!isMatch) {
            return (0, response_1.sendErrorResponse)(res, 401, enum_1.notify.WRONG_PASSWORD);
        }
        // verify new_password
        const updated_password = await verifyPassword(payload.new_password);
        // update user
        await (0, authService_1.updatePasswordById)({ password: updated_password, id: payload.id });
        return (0, response_1.sendSuccessResponse)(res, 200, enum_1.notify.PASSWORD_UPDATE, {});
    }
    catch (error) {
        return (0, response_1.sendErrorResponse)(res, 400, error.message);
    }
};
exports.update_password = update_password;
async function createPassword() {
    try {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        while (true) {
            let password = "";
            for (let i = 0; i < 6; i++) {
                password += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            // hash the password
            const salt = await bcryptjs_1.default.genSalt(10);
            const hashedPassword = await bcryptjs_1.default.hash(password, salt);
            // check if hashed password exists in DB
            const exists = await (0, authService_1.isCredentialsExist)(hashedPassword);
            if (!exists) {
                return { password, hashedPassword };
            }
        }
    }
    catch (error) {
        console.log(error);
        return null;
    }
}
async function verifyPassword(password) {
    while (true) {
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPassword = await bcryptjs_1.default.hash(password, salt);
        const exists = await (0, authService_1.isCredentialsExist)(hashedPassword);
        if (!exists) {
            return hashedPassword;
        }
    }
}
