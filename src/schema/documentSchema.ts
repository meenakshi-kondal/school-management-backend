import mongoose, { Schema } from 'mongoose';

const documentSchema = new Schema({
	type: { type: String, required: true },
	name: { type: String, required: true },
	url: { type: String, required: true },
	is_deleted: { type: Number, default: 0, enum: [0, 1] }
}, {
	timestamps: true
});

const DocumentModel = mongoose.model('documents', documentSchema);

export default DocumentModel;
