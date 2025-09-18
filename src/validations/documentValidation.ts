import Joi from "joi";

export const documentValidation = Joi.object({
    user_id: { type: String, required: true },
    role: { type: String, required: true },
    name: { type: Number, required: true },
    url: { type: String, required: true },
});