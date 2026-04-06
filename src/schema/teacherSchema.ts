import mongoose, { Schema } from 'mongoose';

const teacherSchema = new Schema({
	userId: {
		type: Schema.Types.ObjectId,
		ref: 'users',
		required: true,
		unique: true
	},
	name: { type: String, required: true },
	date_of_birth: { type: Date, required: true },
	gender: { type: String, enum: ['male', 'female', 'other'], required: true },
	blood_group: { type: String, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
	phone: { type: String },
	photo: {
		type: Schema.Types.ObjectId,
		ref: 'documents'
	},
	documents: {
		type: [Schema.Types.ObjectId],
		ref: 'documents'
	},
	guardian_id: {
		type: [Schema.Types.ObjectId],
		ref: 'guardians'
	},
	joining_date: { type: Date },
	experience: { type: Number, default: 0 },
	class: [{ type: Schema.Types.ObjectId, ref: 'classes' }],
	status: { type: String, enum: ['enable', 'disable'], default: 'enable' },
	highest_qualification: { type: String, required: true },
	is_deleted: { type: Number, default: 0, enum: [0, 1] }
}, {
	timestamps: true
});

const TeacherModel = mongoose.model('teachers', teacherSchema);

export default TeacherModel;
