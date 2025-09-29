import Joi from "joi";

export const addressValidation = Joi.object({
    street: { type: String, required: true },
    city: { type: String, required: true },
    district: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: Number, required: true },
}).required();