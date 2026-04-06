import mongoose, { Schema } from 'mongoose';

const roleSchema = new Schema({
	name: { 
		type: String, 
		required: true, 
		unique: true, 
		enum: ['admin', 'teacher', 'student'] 
	},
	is_deleted: { type: Number, default: 0, enum: [0, 1] }
}, {
	timestamps: true
});

const RoleModel = mongoose.model('roles', roleSchema);

export default RoleModel;
