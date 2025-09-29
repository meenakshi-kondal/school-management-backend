import Joi from "joi";

const qualificationValidation = Joi.object({
    institue_name: Joi.string().required(),
    degree: Joi.string().required(),
    year: Joi.number().integer().min(1900).max(new Date().getFullYear()),
    board: Joi.string().required(),
});

const classValidation = Joi.object({
    class_name: Joi.string().required(),
    subjects: Joi.array().items().min(1).required()
});

export const userValidation = Joi.object({
    name: Joi.string()
        .min(3)
        .max(30)
        .required()
        .messages({
            "any.required": "Name is required",
            "string.empty": "Name cannot be empty",
            "string.min": "Name must be at least 3 characters",
            "string.max": "Name cannot exceed 30 characters",
        }),
    gender: Joi.string()
        .valid("male", "female", "other")
        .required()
        .messages({
            "any.required": "Gender is required",
            "any.only": "Gender must be male, female, or other",
        }),
    dateOfBirth: Joi.date()
        .less("now")
        .required()
        .messages({
            "any.required": "Date of Birth is required",
            "date.base": "Date of Birth must be a valid date",
            "date.less": "Date of Birth must be in the past",
        }),
    email: Joi.string().email().required().messages({
        "any.required": "Email is required",
        "string.email": "Email must be a valid email address",
    }),
    role: Joi.string()
        .valid("student", "teacher")
        .default("student")
        .messages({
            "any.only": "Role must be student or teacher",
        }),
    joiningDate: Joi.date().required().messages({
        "any.required": "Joining Date is required",
        "date.base": "Joining Date must be a valid date",
    }),
    is_bus_service: Joi.boolean().default(false),
    class: Joi.array().items(classValidation).min(1).required().messages({
        "any.required": "Class is required",
        "array.min": "At least one class must be selected",
    }),
    qualification: Joi.array().items(qualificationValidation),
}).required().messages({
    "any.required": "Please send all details",
});


export const loginValidation = Joi.object({
    username: Joi.string().email().required(),
    password: Joi.string().min(3).max(8).required(),
}).required().messages({
    "any.required": "Login credentials are required",
});

