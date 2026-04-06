import mongoose, { Schema } from 'mongoose';

const studentSchema = new Schema({
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
	photo: {
		type: Schema.Types.ObjectId,
		ref: 'documents'
	},
	guardians: {
		type: [Schema.Types.ObjectId],
		ref: 'guardians'
	},
	documents: {
		type: [Schema.Types.ObjectId],
		ref: 'documents'
	},
	class_id: { type: Schema.Types.ObjectId, ref: 'classes' },
	admission_on: { type: Date, default: new Date() },
	roll_number: { type: Number },
	is_bus_service: { type: Boolean, default: false },
	status: { type: String, enum: ['enable', 'disable'], default: 'enable' },
	is_deleted: { type: Number, default: 0, enum: [0, 1] }
}, {
	timestamps: true
});

const StudentModel = mongoose.model('students', studentSchema);

export default StudentModel;
