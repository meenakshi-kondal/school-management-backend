import mongoose, { Schema } from "mongoose";
import { guardianSchema } from "./guardianSchema";
import { addressSchema } from "./addressSchema";
import { documentSchema } from "./documentSchema";

const kyc = new Schema({
    documents: { type: [documentSchema], required: true },
    guardian_info: { type: [guardianSchema], required: true },
    address: { type: addressSchema },
}, { timestamps: true });

const KycSchema = mongoose.model("kyc", kyc);

export default KycSchema;