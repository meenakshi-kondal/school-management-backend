"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignedWorkValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const commonValidation_1 = require("./commonValidation");
exports.assignedWorkValidation = joi_1.default.object({
    assigned_to: joi_1.default.array(),
    class: joi_1.default.string().required(),
    subject: joi_1.default.string().required(),
    work: joi_1.default.string().max(100).required(),
    attachment: joi_1.default.array().items(commonValidation_1.documentValidation),
    assignedOn: joi_1.default.date().default(() => new Date()),
    assigned_type: joi_1.default.string().required().default('ALL'),
    assigned_by: joi_1.default.string().required()
});
