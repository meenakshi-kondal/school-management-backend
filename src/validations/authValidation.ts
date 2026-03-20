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

const commonUserFields = {
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
    date_of_birth: Joi.date()
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
    joining_date: Joi.date().required().messages({
        "any.required": "Joining Date is required",
        "date.base": "Joining Date must be a valid date",
    }),
};

export const studentValidation = Joi.object({
    ...commonUserFields,
    role: Joi.string().valid("student").default("student"),
    is_bus_service: Joi.boolean().default(false),
    class_id: Joi.string().required().messages({
        "any.required": "Class is required",
    }),
}).required().messages({
    "any.required": "Please send all details",
});

export const teacherValidation = Joi.object({
    ...commonUserFields,
    role: Joi.string().valid("teacher").default("teacher"),
    qualification: Joi.array().items(qualificationValidation).min(1).required().messages({
        "any.required": "Qualification is required",
        "array.min": "At least one qualification must be selected",
    }),
}).required().messages({
    "any.required": "Please send all details",
});

// For backward compatibility or general user (admin)
export const userValidation = Joi.object({
    ...commonUserFields,
    role: Joi.string().valid("student", "teacher", "admin").default("student"),
    is_bus_service: Joi.boolean().default(false),
    class_id: Joi.string(),
    qualification: Joi.array().items(qualificationValidation),
}).required();



export const loginValidation = Joi.object({
    username: Joi.string().email().required(),
    password: Joi.string().min(3).max(8).required(),
}).required().messages({
    "any.required": "Login credentials are required",
});

export const profileDetailValidation = Joi.object({
   id: Joi.string().required(),
}).required();

