import { Schema } from 'mongoose';
import UserSchema from './userSchema';

const qualificationSchema = new Schema({
  institue_name: { type: String, required: true },
  degree: { type: String },
  year: { type: Date, required: true },
  board: { type: String },
});

const classSchema = new Schema({
  class_name: { type: String, required: true },
  subjects: [{ type: String }],
});

const teacherSchema = new Schema({
  qualification: [qualificationSchema],
  class: [classSchema],
});

// Use discriminator if not already created
const TeacherModel = UserSchema.discriminators?.['teacher'] || UserSchema.discriminator('teacher', teacherSchema);

export default TeacherModel;
