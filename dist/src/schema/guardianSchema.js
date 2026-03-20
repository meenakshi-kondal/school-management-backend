"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.guardianSchema = void 0;
const mongoose_1 = require("mongoose");
exports.guardianSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    relation: { type: String, enum: ["father", "mother", "guardian", "spouse"], required: true },
    phone: { type: String, required: true },
    email: { type: String },
    occupation: { type: String },
    is_deleted: { type: Number, default: 0, enum: [0, 1] }
});
