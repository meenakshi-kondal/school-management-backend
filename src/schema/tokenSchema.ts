import mongoose, { Schema } from "mongoose";

const kyc = new Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	token: {
		type: String,
		required: true,
		unique: true,
	},
	expiresAt: {
		type: Date,
		required: true,
	},
	is_deleted: { type: Number, default: 0, enum:[0,1]}
}, { timestamps: true });

const TokenSchema = mongoose.model("kyc", kyc);

export default TokenSchema;