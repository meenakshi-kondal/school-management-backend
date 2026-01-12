import mongoose, { Schema } from "mongoose";
import { guardianSchema } from "./guardianSchema";
import { addressSchema } from "./addressSchema";
import { documentSchema } from "./documentSchema";

const kyc = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    documents: { type: [documentSchema], required: true },
    guardian_info: { type: [guardianSchema], required: true },
    address: { type: addressSchema },
    is_deleted: { type: Number, default: 0, enum:[0,1] },
    status: { type: Number, default: 0, enum: [0,1,2]} // 0:Pending, 1:Approved, 2:Rejected
}, { timestamps: true });

const KycSchema = mongoose.model("kyc", kyc);

export default KycSchema;