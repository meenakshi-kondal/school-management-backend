import Joi from "joi";

export const documentValidation = Joi.object({
	name: Joi.number().required(),
	url: Joi.string().required(),
});