"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const teacherSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
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
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'documents'
    },
    documents: {
        type: [mongoose_1.Schema.Types.ObjectId],
        ref: 'documents'
    },
    guardian_id: {
        type: [mongoose_1.Schema.Types.ObjectId],
        ref: 'guardians'
    },
    joining_date: { type: Date },
    experience: { type: Number, default: 0 },
    class: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'classes' }],
    status: { type: String, enum: ['enable', 'disable'], default: 'enable' },
    highest_qualification: { type: String, required: true },
    is_deleted: { type: Number, default: 0, enum: [0, 1] }
}, {
    timestamps: true
});
const TeacherModel = mongoose_1.default.model('teachers', teacherSchema);
exports.default = TeacherModel;
