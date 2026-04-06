"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.kycValidtaion = void 0;
const joi_1 = __importDefault(require("joi"));
const commonValidation_1 = require("./commonValidation");
const guardianValidation = joi_1.default.object({
    name: joi_1.default.string().required(),
    relation: joi_1.default.string().required(),
    phone: joi_1.default.string().pattern(/^[0-9]{10}$/).required(),
    email: joi_1.default.string().email().required(),
    occupation: joi_1.default.string().required(),
});
exports.kycValidtaion = joi_1.default.object({
    userId: { type: String, required: true },
    guardian: joi_1.default.array().items(guardianValidation).min(1).required(),
    documents: joi_1.default.array().items(commonValidation_1.documentValidation).min(1).required(),
    phone: joi_1.default.string().pattern(/^[0-9]{10}$/),
}).required();
