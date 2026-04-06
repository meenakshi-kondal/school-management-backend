import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema({
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	is_deleted: { type: Number, default: 0, enum: [0, 1] }
}, {
	timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

const UserModel = mongoose.model('users', userSchema);

export default UserModel;
