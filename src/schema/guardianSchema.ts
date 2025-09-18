import { Schema } from "mongoose";

export const guardianSchema = new Schema({
  name: { type: String, required: true },
  relation: { type: String, enum: ["father", "mother", "guardian", "spouse"], required: true },
  phone: { type: String, required: true },
  email: { type: String },
  occupation: { type: String }
});

