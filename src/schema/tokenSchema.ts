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
}, { timestamps: true });

const TokenSchema = mongoose.model("kyc", kyc);

export default TokenSchema;