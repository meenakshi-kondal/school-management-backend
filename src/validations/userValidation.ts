import Joi from "joi";
import { documentValidation } from "./commonValidation";

export const assignedWorkValidation = Joi.object({
    assignedTo: Joi.array().min(1).required(),
    class: Joi.string().required(),
    subject: Joi.string().required(),
    work: Joi.string().required(),
    attachment: Joi.array().items(documentValidation),
    assignedOn: Joi.date().default(() => new Date()),
});