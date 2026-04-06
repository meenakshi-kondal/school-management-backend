import Joi from 'joi';

const guardianValidation = Joi.object({
	relation: Joi.string(),
	name: Joi.string(),
	email: Joi.string().email(),
	phone: Joi.string().required(),
	occupation: Joi.string(),
	aadhaar_card: Joi.string().optional(),
});

const commonUserFields = {
	name: Joi.string()
		.min(3)
		.max(30)
		.required()
		.messages({
			'any.required': 'Name is required',
			'string.empty': 'Name cannot be empty',
			'string.min': 'Name must be at least 3 characters',
			'string.max': 'Name cannot exceed 30 characters',
		}),
	gender: Joi.string()
		.valid('male', 'female', 'other')
		.required()
		.messages({
			'any.required': 'Gender is required',
			'any.only': 'Gender must be male, female, or other',
		}),
	date_of_birth: Joi.date()
		.less('now')
		.required()
		.messages({
			'any.required': 'Date of Birth is required',
			'date.base': 'Date of Birth must be a valid date',
			'date.less': 'Date of Birth must be in the past',
		}),
	email: Joi.string().email().messages({
		'any.required': 'Email is required',
		'string.email': 'Email must be a valid email address',
	}),
	blood_group: Joi.string().valid('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'),
	phone: Joi.string(),
	photo: Joi.string().optional(),
};

export const studentValidation = Joi.object({
	...commonUserFields,
	role: Joi.string().valid('student').default('student'),
	is_bus_service: Joi.boolean().default(false),
	class_id: Joi.string().required().messages({
		'any.required': 'Class is required',
	}),
	guardian: guardianValidation,
}).required().messages({
	'any.required': 'Please send all details',
});

export const teacherValidation = Joi.object({
	...commonUserFields,
	role: Joi.string().valid('teacher').default('teacher'),
	joining_date: Joi.date().required().messages({
		'any.required': 'Joining Date is required',
		'date.base': 'Joining Date must be a valid date',
	}),
	experience: Joi.number().min(0).default(0),
	class: Joi.array().items(Joi.string()),
}).required().messages({
	'any.required': 'Please send all details',
});

// Admin registration — minimal fields
export const adminValidation = Joi.object({
	name: Joi.string().min(3).max(30).required(),
	email: Joi.string().email().required(),
	role: Joi.string().valid('admin').default('admin'),
}).required();

// General user validation (backward compatibility)
export const userValidation = Joi.object({
	...commonUserFields,
	role: Joi.string().valid('student', 'teacher', 'admin').default('student'),
	is_bus_service: Joi.boolean().default(false),
	class_id: Joi.string(),
	joining_date: Joi.date(),
	guardian: guardianValidation,
}).required();


export const loginValidation = Joi.object({
	username: Joi.string().email().required(),
	password: Joi.string().min(3).max(8).required(),
}).required().messages({
	'any.required': 'Login credentials are required',
});

export const profileDetailValidation = Joi.object({
   id: Joi.string().required(),
   role: Joi.string().valid('student', 'teacher', 'admin').required(),
}).required();
