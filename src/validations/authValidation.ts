import Joi from "joi";
import { addressValidation } from "./addressValidation";
import { documentValidation } from "./documentValidation";

const guardianValidation = Joi.object({
    name: { type: String, required: true },
    relation: { type: String, required: true },
    phone: { type: Number, required: true },
    email: { type: String, required: true },
    occupation: { type: String, required: true },
});

export const studentValidation = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    dateOfBirth: Joi.date().less("now").required(),
    gender: { type: String, enum: ["male", "female", "other"], required: true },
    rollNo: { type: Number, required: true },
    class: Joi.string().required(),
    section: { type: String },
    admissionDate: Joi.date().required(),
    address: addressValidation,
    is_bus_service: Joi.boolean().default(false),
    role: Joi.string().valid("student").required(),
    guardian_info: Joi.array().items(guardianValidation).min(1).required(),
    documents: Joi.array().items(documentValidation).min(1).required(),
});

export const teacherValidation = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    gender: { type: String, enum: ["male", "female", "other"], required: true },
    dateOfBirth: Joi.date().less("now").required(),
    qualification: Joi.string().required(),
    role: Joi.string().valid("teacher").required(),
    subject: Joi.string().required(),
    class: Joi.array().min(1).required(),
    joiningDate: Joi.date().required(),
    guardian_info: Joi.array().items(guardianValidation).min(1).required(),
    documents: Joi.array().items(documentValidation).min(1).required(),
});

