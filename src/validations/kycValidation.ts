import Joi from "joi";

const guardianValidation = Joi.object({
    name: Joi.string().required(),
    relation: Joi.string().required(),
    phone: Joi.string().pattern(/^[0-9]{10}$/).required(),
    email: Joi.string().email().required(),
    occupation: Joi.string().required(),
});

const documentValidation = Joi.object({
    name: { type: Number, required: true },
    url: { type: String, required: true },
});

export const kycValidtaion = Joi.object({
    user_id: { type: String, required: true },
    guardian: Joi.array().items(guardianValidation).min(1).required(),
    documents: Joi.array().items(documentValidation).min(1).required(),
    phone: Joi.string().pattern(/^[0-9]{10}$/),
}).required();