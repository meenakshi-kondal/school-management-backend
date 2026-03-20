"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.documentSchema = void 0;
const mongoose_1 = require("mongoose");
exports.documentSchema = new mongoose_1.Schema({
    docType: { type: String, required: true },
    fileUrl: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now }
}, { timestamps: true });
