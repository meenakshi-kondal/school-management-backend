import mongoose, { Schema } from "mongoose";

const classSchema = new mongoose.Schema({
  class_name: { type: String, required: true },
  subjects: [{ type: String }],
});

const qualificationSchema = new mongoose.Schema({
  institue_name: { type: String, required: true },
  degree: { type: String },
  year: { type: Date, required: true },
  board: { type: String },
});

const user = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  gender: { type: String, enum: ["male", "female", "other"], required: true },
  dateOfBirth: { type: Date, required: true },
  role: { type: String, enum: ["teacher", "student", "admin"], default: "teacher" },
  qualification: [qualificationSchema],
  class: [classSchema],
  joiningDate: { type: Date, required: true },
  is_bus_service: { type: Boolean, default: false },
  password: { type: String, required: true },
}, { timestamps: true });

const UserSchema = mongoose.model("users", user);

export default UserSchema;
