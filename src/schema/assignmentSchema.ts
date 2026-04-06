import mongoose, { Schema } from 'mongoose';

// Inline attachment schema for assignment files (not the same as the documents collection)
const attachmentSchema = new Schema({
	document_name: { type: String, required: true },
	file_url: { type: String, required: true },
	uploadedAt: { type: Date, default: Date.now }
});

const assignment = new Schema({
	assigned_type: { 
		type: String, enum: ['ALL', 'INDIVIDUAL', 'GROUP'],
		required: true, default: 'ALL'},
	assigned_to: [{ 
		type: Schema.Types.ObjectId, 
		ref: 'users'
	}],
	assigned_by: {
		type: Schema.Types.ObjectId, 
		ref: 'users',
		required: true
	},
	class: { type: String, required: true },
	subject: { type: String, required: true },
	work: { type: String, required: true },
	attachment: [attachmentSchema],
	assigned_on: { type: Date, default: Date.now },
	is_deleted: { type: Number, default: 0, enum:[0,1] }
});

const AssignmentSchema = mongoose.model('assignments', assignment);

export default AssignmentSchema;