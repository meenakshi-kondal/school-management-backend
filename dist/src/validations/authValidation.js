"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.profileDetailValidation = exports.loginValidation = exports.userValidation = exports.adminValidation = exports.teacherValidation = exports.studentValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const guardianValidation = joi_1.default.object({
    father_name: joi_1.default.string(),
    mother_name: joi_1.default.string(),
    email: joi_1.default.string().email(),
    phone: joi_1.default.string().required(),
    occupation: joi_1.default.string(),
    aadhaar_card: joi_1.default.string(),
});
const commonUserFields = {
    name: joi_1.default.string()
        .min(3)
        .max(30)
        .required()
        .messages({
        "any.required": "Name is required",
        "string.empty": "Name cannot be empty",
        "string.min": "Name must be at least 3 characters",
        "string.max": "Name cannot exceed 30 characters",
    }),
    gender: joi_1.default.string()
        .valid("male", "female", "other")
        .required()
        .messages({
        "any.required": "Gender is required",
        "any.only": "Gender must be male, female, or other",
    }),
    date_of_birth: joi_1.default.date()
        .less("now")
        .required()
        .messages({
        "any.required": "Date of Birth is required",
        "date.base": "Date of Birth must be a valid date",
        "date.less": "Date of Birth must be in the past",
    }),
    email: joi_1.default.string().email().required().messages({
        "any.required": "Email is required",
        "string.email": "Email must be a valid email address",
    }),
    blood_group: joi_1.default.string().valid('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'),
    phone: joi_1.default.string(),
    photo: joi_1.default.string(),
};
exports.studentValidation = joi_1.default.object({
    ...commonUserFields,
    role: joi_1.default.string().valid("student").default("student"),
    is_bus_service: joi_1.default.boolean().default(false),
    class_id: joi_1.default.string().required().messages({
        "any.required": "Class is required",
    }),
    joining_date: joi_1.default.date().required().messages({
        "any.required": "Admission Date is required",
        "date.base": "Admission Date must be a valid date",
    }),
    guardian: guardianValidation,
}).required().messages({
    "any.required": "Please send all details",
});
exports.teacherValidation = joi_1.default.object({
    ...commonUserFields,
    role: joi_1.default.string().valid("teacher").default("teacher"),
    joining_date: joi_1.default.date().required().messages({
        "any.required": "Joining Date is required",
        "date.base": "Joining Date must be a valid date",
    }),
    experience: joi_1.default.number().min(0).default(0),
    class: joi_1.default.array().items(joi_1.default.string()),
}).required().messages({
    "any.required": "Please send all details",
});
// Admin registration — minimal fields
exports.adminValidation = joi_1.default.object({
    name: joi_1.default.string().min(3).max(30).required(),
    email: joi_1.default.string().email().required(),
    role: joi_1.default.string().valid("admin").default("admin"),
}).required();
// General user validation (backward compatibility)
exports.userValidation = joi_1.default.object({
    ...commonUserFields,
    role: joi_1.default.string().valid("student", "teacher", "admin").default("student"),
    is_bus_service: joi_1.default.boolean().default(false),
    class_id: joi_1.default.string(),
    joining_date: joi_1.default.date(),
    guardian: guardianValidation,
}).required();
exports.loginValidation = joi_1.default.object({
    username: joi_1.default.string().email().required(),
    password: joi_1.default.string().min(3).max(8).required(),
}).required().messages({
    "any.required": "Login credentials are required",
});
exports.profileDetailValidation = joi_1.default.object({
    id: joi_1.default.string().required(),
    role: joi_1.default.string().valid("student", "teacher", "admin").required(),
}).required();
