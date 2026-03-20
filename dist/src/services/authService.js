"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePasswordById = exports.updatePassword = exports.saveToken = exports.isUser = exports.isUserExist = exports.isCredentialsExist = exports.saveUser = void 0;
const tokenSchema_1 = __importDefault(require("../schema/tokenSchema"));
const userSchema_1 = __importDefault(require("../schema/userSchema"));
const studentSchema_1 = __importDefault(require("../schema/studentSchema"));
const teacherSchema_1 = __importDefault(require("../schema/teacherSchema"));
const saveUser = async (data) => {
    try {
        let user;
        if (data.role === 'student') {
            user = new studentSchema_1.default(data);
        }
        else if (data.role === 'teacher') {
            user = new teacherSchema_1.default(data);
        }
        else {
            user = new userSchema_1.default(data);
        }
        return await user.save();
    }
    catch (error) {
        throw new Error(error.message);
    }
};
exports.saveUser = saveUser;
const isCredentialsExist = async (password) => {
    try {
        // With discriminators, all are in 'users' collection
        const exist = await userSchema_1.default.findOne({ password });
        return exist;
    }
    catch (error) {
        console.log(error);
        throw new Error(error.message);
    }
};
exports.isCredentialsExist = isCredentialsExist;
const isUserExist = async (email) => {
    try {
        // Searching UserSchema will find students, teachers, and admins
        const exist = await userSchema_1.default.findOne({ email });
        return exist;
    }
    catch (error) {
        throw new Error(error.message);
    }
};
exports.isUserExist = isUserExist;
const isUser = async (id) => {
    try {
        const exist = await userSchema_1.default.findById(id).select('-password');
        return exist;
    }
    catch (error) {
        throw new Error(error.message);
    }
};
exports.isUser = isUser;
const saveToken = async (data) => {
    try {
        const token = new tokenSchema_1.default(data);
        return await token.save();
    }
    catch (error) {
        throw new Error(error.message);
    }
};
exports.saveToken = saveToken;
const updatePassword = async (data) => {
    try {
        const result = await userSchema_1.default.findOneAndUpdate({ email: data.email }, { password: data.password }, { new: true });
        return result;
    }
    catch (error) {
        throw new Error(error.message);
    }
};
exports.updatePassword = updatePassword;
const updatePasswordById = async (data) => {
    try {
        const result = await userSchema_1.default.findOneAndUpdate({ _id: data.id }, { password: data.password }, { new: true });
        return result;
    }
    catch (error) {
        throw new Error(error.message);
    }
};
exports.updatePasswordById = updatePasswordById;
