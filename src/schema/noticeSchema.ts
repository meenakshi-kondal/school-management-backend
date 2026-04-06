import mongoose, { Schema } from 'mongoose';

const noticeSchema = new Schema({
	title: {
		type: String,
		required: true,
		trim: true
	},
	description: {
		type: String,
		required: true,
		trim: true
	},
	userId: {
		type: Schema.Types.ObjectId,
		ref: 'users',
		required: true
	},
	readBy: [{
		type: Schema.Types.ObjectId,
		ref: 'users'
	}],
	is_deleted: { type: Number, default: 0, enum: [0, 1] }
}, { timestamps: true });


const NoticeModel = mongoose.model('notices', noticeSchema);

export default NoticeModel;
