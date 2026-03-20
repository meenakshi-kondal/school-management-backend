"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema_1 = __importDefault(require("./userSchema"));
const classSchema = new mongoose_1.Schema({
    class_name: { type: String, required: true },
    subjects: [{ type: String }],
});
const studentSchema = new mongoose_1.Schema({
    class: [classSchema],
    is_bus_service: { type: Boolean, default: false },
});
// Use discriminator if not already created
const StudentModel = userSchema_1.default.discriminators?.['student'] || userSchema_1.default.discriminator('student', studentSchema);
exports.default = StudentModel;
