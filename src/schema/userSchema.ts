import mongoose, { Schema } from 'mongoose';

const baseOptions = {
    discriminatorKey: 'role',
    timestamps: true,
};

const user = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  gender: { type: String, enum: ['male', 'female', 'other'], required: true },
  date_of_birth: { type: Date, required: true },
  role: { type: String, enum: ['teacher', 'student', 'admin'], default: 'admin' },
  joining_date: { type: Date, required: true },
  password: { type: String, required: true },
  status: { type: String, enum: ['enable', 'disable'], default: 'enable'},
  is_deleted: { type: Number, default: 0, enum:[0,1]}
}, baseOptions);

const UserSchema = mongoose.model('users', user);

export default UserSchema;
