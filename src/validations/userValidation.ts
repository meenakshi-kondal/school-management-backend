import Joi from "joi";
import { documentValidation } from "./commonValidation";

export const assignedWorkValidation = Joi.object({
	assigned_to: Joi.array(),
	class: Joi.string().required(),
	subject: Joi.string().required(),
	work: Joi.string().max(100).required(),
	attachment: Joi.array().items(documentValidation),
	assignedOn: Joi.date().default(() => new Date()),
	assigned_type: Joi.string().required().default('ALL'),
	assigned_by:  Joi.string().required()
});