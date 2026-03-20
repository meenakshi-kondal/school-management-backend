import mongoose, { Schema } from 'mongoose';

const classSchema = new Schema({
    class_name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    subjects: {
        type: [String],
        default: []
    }
}, { timestamps: true });

// Pre-save hook to ensure subjects are unique within the array (case-insensitive deduplication possible, but let's do basic first)
classSchema.pre('save', function (next) {
    if (this.subjects) {
        // Convert all to lowercase if needed or just unique
        this.subjects = Array.from(new Set(this.subjects));
    }
    next();
});

const ClassModel = mongoose.model('classes', classSchema);

export default ClassModel;
