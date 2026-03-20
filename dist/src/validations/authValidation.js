"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.profileDetailValidation = exports.loginValidation = exports.userValidation = exports.teacherValidation = exports.studentValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const qualificationValidation = joi_1.default.object({
    institue_name: joi_1.default.string().required(),
    degree: joi_1.default.string().required(),
    year: joi_1.default.number().integer().min(1900).max(new Date().getFullYear()),
    board: joi_1.default.string().required(),
});
const classValidation = joi_1.default.object({
    class_name: joi_1.default.string().required(),
    subjects: joi_1.default.array().items().min(1).required()
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
    joining_date: joi_1.default.date().required().messages({
        "any.required": "Joining Date is required",
        "date.base": "Joining Date must be a valid date",
    }),
};
exports.studentValidation = joi_1.default.object({
    ...commonUserFields,
    role: joi_1.default.string().valid("student").default("student"),
    is_bus_service: joi_1.default.boolean().default(false),
    class: joi_1.default.array().items(classValidation).min(1).required().messages({
        "any.required": "Class is required",
        "array.min": "At least one class must be selected",
    }),
}).required().messages({
    "any.required": "Please send all details",
});
exports.teacherValidation = joi_1.default.object({
    ...commonUserFields,
    role: joi_1.default.string().valid("teacher").default("teacher"),
    qualification: joi_1.default.array().items(qualificationValidation).min(1).required().messages({
        "any.required": "Qualification is required",
        "array.min": "At least one qualification must be selected",
    }),
}).required().messages({
    "any.required": "Please send all details",
});
// For backward compatibility or general user (admin)
exports.userValidation = joi_1.default.object({
    ...commonUserFields,
    role: joi_1.default.string().valid("student", "teacher", "admin").default("student"),
    is_bus_service: joi_1.default.boolean().default(false),
    class: joi_1.default.array().items(classValidation),
    qualification: joi_1.default.array().items(qualificationValidation),
}).required();
exports.loginValidation = joi_1.default.object({
    username: joi_1.default.string().email().required(),
    password: joi_1.default.string().min(3).max(8).required(),
}).required().messages({
    "any.required": "Login credentials are required",
});
exports.profileDetailValidation = joi_1.default.object({
    id: joi_1.default.string().required(),
}).required();
