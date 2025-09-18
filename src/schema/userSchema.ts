import mongoose, { Schema } from "mongoose";

const user = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["student", "teacher", "admin"], required: true }
}, { timestamps: true });

const UserSchema = mongoose.model("user_credentials", user);

export default UserSchema;
