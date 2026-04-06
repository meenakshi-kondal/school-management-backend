import Joi from "joi";
import { documentValidation } from "./commonValidation";

const guardianValidation = Joi.object({
	name: Joi.string().required(),
	relation: Joi.string().required(),
	phone: Joi.string().pattern(/^[0-9]{10}$/).required(),
	email: Joi.string().email().required(),
	occupation: Joi.string().required(),
});


export const kycValidtaion = Joi.object({
	userId: { type: String, required: true },
	guardian: Joi.array().items(guardianValidation).min(1).required(),
	documents: Joi.array().items(documentValidation).min(1).required(),
	phone: Joi.string().pattern(/^[0-9]{10}$/),
}).required();