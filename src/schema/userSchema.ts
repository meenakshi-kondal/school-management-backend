import mongoose, { Schema } from 'mongoose';

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
  gender: { type: String, enum: ['male', 'female', 'other'], required: true },
  date_of_birth: { type: Date, required: true },
  role: { type: String, enum: ['teacher', 'student', 'admin'], default: 'student' },
  qualification: [qualificationSchema],
  class: [classSchema],
  joining_date: { type: Date, required: true },
  is_bus_service: { type: Boolean, default: false },
  password: { type: String, required: true },
  status: { type: String, enum: ['enable', 'disable'], default: 'enable'},
  is_deleted: { type: Number, default: 0, enum:[0,1]}
}, { timestamps: true });

const UserSchema = mongoose.model('users', user);

export default UserSchema;
