import mongoose, { Schema } from "mongoose";
import { guardianSchema } from "./guardianSchema";
import { addressSchema } from "./addressSchema";

const teacher = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    gender: { type: String, enum: ["male", "female", "other"], required: true },
    dateOfBirth: { type: Date, required: true },
    qualification: { type: String, required: true },
    role: { type: String, enum: ["teacher"], default: "teacher" },
    subject: { type: String, required: true },
    class: [{ type: String, required: true }],
    joiningDate: { type: Date, required: true },
    guardian_info: { type: [guardianSchema], required: true },
    address: { type: addressSchema },
    documents: [{ type: Schema.Types.ObjectId, ref: "UserDocument" }]
}, { timestamps: true });

const TeacherSchema = mongoose.model("teacher", teacher);

export default TeacherSchema;