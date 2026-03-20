import { Schema } from 'mongoose';
import UserSchema from './userSchema';

const studentSchema = new Schema({
  class_id: { type: String, required: true },
  parent_info: {
    father_name: { type: String },
    mother_name: { type: String },
    phone: { type: String },
    address: { type: String },
  },
  documents: {
    photo: { type: String },
    birth_certificate: { type: String },
    aadhar_card: { type: String },
    parent_aadhar: { type: String },
    report_card: { type: String },
  },
  is_bus_service: { type: Boolean, default: false },
  attendance_status: { type: String, enum: ['Present', 'Absent', 'Leave', 'None'], default: 'Present' },
  roll_number: { type: Number, required: true },
});

// Use discriminator if not already created
const StudentModel = UserSchema.discriminators?.['student'] || UserSchema.discriminator('student', studentSchema);

export default StudentModel;
