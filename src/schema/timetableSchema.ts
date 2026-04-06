import mongoose, { Schema } from 'mongoose';

const timetableSchema = new Schema({
    classId: {
        type: Schema.Types.ObjectId,
        ref: 'classes',
        required: true
    },
    day: {
        type: String,
        required: true,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    },
    subject: {
        type: String,
        required: true
    },
    teacherId: {
        type: Schema.Types.ObjectId,
        ref: 'teachers',
        required: true
    },
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: true
    }
}, { timestamps: true });

const TimetableModel = mongoose.model('timetables', timetableSchema);
export default TimetableModel;
