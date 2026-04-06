import mongoose, { Schema } from 'mongoose';

const guardianSchema = new Schema({
	student_id: {
		type: Schema.Types.ObjectId,
		ref: 'students',
		required: true
	},
	name: { type: String, required: true },
	relation: {
		type: String,
		enum: ['father', 'mother', 'guardian', 'other'],
		required: true
	},
	email: { type: String },
	phone: { type: String, required: true },
	occupation: { type: String },
	aadhaar_card: {
		type: Schema.Types.ObjectId,
		ref: 'documents',
		required: true
	},
	is_deleted: { type: Number, default: 0, enum: [0, 1] }
}, {
	timestamps: true
});

export default mongoose.model('guardians', guardianSchema);