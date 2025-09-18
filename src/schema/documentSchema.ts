import mongoose, { Schema } from "mongoose";

const document = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  role: { type: String, enum: ["student", "teacher"], required: true },
  docType: { type: String, required: true },
  fileUrl: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
  verified: { type: Boolean, default: false }
}, { timestamps: true });

const DocumentSchema = mongoose.model("documents", document);

export default DocumentSchema;
