import mongoose, { Schema } from "mongoose";

export const documentSchema = new Schema({
  docType: { type: String, required: true },
  fileUrl: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
}, { timestamps: true });
