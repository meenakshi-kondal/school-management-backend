"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema_1 = __importDefault(require("./userSchema"));
const qualificationSchema = new mongoose_1.Schema({
    institue_name: { type: String, required: true },
    degree: { type: String },
    year: { type: Date, required: true },
    board: { type: String },
});
const classSchema = new mongoose_1.Schema({
    class_name: { type: String, required: true },
    subjects: [{ type: String }],
});
const teacherSchema = new mongoose_1.Schema({
    qualification: [qualificationSchema],
    class: [classSchema],
});
// Use discriminator if not already created
const TeacherModel = userSchema_1.default.discriminators?.['teacher'] || userSchema_1.default.discriminator('teacher', teacherSchema);
exports.default = TeacherModel;
