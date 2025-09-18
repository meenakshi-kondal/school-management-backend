import mongoose, { Schema } from "mongoose";
import { guardianSchema } from "./guardianSchema";
import { addressSchema } from "./addressSchema";

const student = new Schema({
  name: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, enum: ["male", "female", "other"], required: true },
  rollNo: { type: Number, required: true },
  class: { type: String, required: true },
  section: { type: String },
  admissionDate: { type: Date, required: true },
  address: { type: addressSchema, required: true },
  is_bus_service: { type: Boolean, default: false },
  role: { type: String, enum: ["student"], default: "student" },
  guardian_info: { type: [guardianSchema], required: true },
  documents: [{ type: Schema.Types.ObjectId, ref: "UserDocument" }] // references
}, { timestamps: true });

const StudentSchema = mongoose.model("student", student);

export default StudentSchema;