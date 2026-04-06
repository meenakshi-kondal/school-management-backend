import mongoose, { Schema } from 'mongoose';

const userRoleSchema = new Schema({
	userId: { 
		type: Schema.Types.ObjectId, 
		ref: 'users', 
		required: true 
	},
	role_id: { 
		type: Schema.Types.ObjectId, 
		ref: 'roles', 
		required: true 
	},
	is_deleted: { type: Number, default: 0, enum: [0, 1] }
}, {
	timestamps: true
});

// Prevent duplicate role assignments for the same user
userRoleSchema.index({ userId: 1, role_id: 1 }, { unique: true });

const UserRoleModel = mongoose.model('user_roles', userRoleSchema);

export default UserRoleModel;
