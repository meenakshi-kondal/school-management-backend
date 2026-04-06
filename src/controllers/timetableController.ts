import { Request, Response } from "express";
import TimetableModel from "../schema/timetableSchema";
import ClassModel from "../schema/classSchema";

export const saveTimetableEntry = async (req: Request, res: Response) => {
    try {
        const { id, classId, day, subject, teacherId, startTime, endTime } = req.body;

        // Validation 1: No overlapping time slots for the same class
        const classOverlap = await TimetableModel.findOne({
            _id: { $ne: id },
            classId,
            day,
            $or: [
                { startTime: { $lt: endTime }, endTime: { $gt: startTime } }
            ]
        });
        if (classOverlap) {
            return res.status(400).json({ message: "Time slot overlaps with another period in this class" });
        }

        // Validation 2: A teacher should not be assigned to multiple classes at the same time
        const teacherOverlap = await TimetableModel.findOne({
            _id: { $ne: id },
            teacherId,
            day,
            $or: [
                { startTime: { $lt: endTime }, endTime: { $gt: startTime } }
            ]
        });
        if (teacherOverlap) {
            const cls = await ClassModel.findById(teacherOverlap.classId);
            return res.status(400).json({ message: `Teacher is already assigned to ${cls?.class_name || 'another class'} at this time` });
        }

        if (id) {
            const updated = await TimetableModel.findByIdAndUpdate(id, { classId, day, subject, teacherId, startTime, endTime }, { new: true });
            return res.json({ message: "Timetable entry updated", data: updated });
        } else {
            const newEntry = new TimetableModel({ classId, day, subject, teacherId, startTime, endTime });
            await newEntry.save();
            return res.status(201).json({ message: "Timetable entry saved", data: newEntry });
        }
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

export const getTimetableByClass = async (req: Request, res: Response) => {
    try {
        const { classId } = req.params;
        const timetable = await TimetableModel.find({ classId }).sort({ startTime: 1 });
        res.json({ data: timetable });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

export const deleteTimetableEntry = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await TimetableModel.findByIdAndDelete(id);
        res.json({ message: "Timetable entry deleted" });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

export const getWeeklyTimetable = async (req: Request, res: Response) => {
    try {
        const { classId } = req.params;
        const timetable = await TimetableModel.find({ classId }).sort({ startTime: 1 });
        
        // Group by day for easier frontend consumption
        const groupedData: any = {
            "Monday": [],
            "Tuesday": [],
            "Wednesday": [],
            "Thursday": [],
            "Friday": [],
            "Saturday": []
        };

        timetable.forEach((entry: any) => {
            if (groupedData[entry.day]) {
                groupedData[entry.day].push(entry);
            }
        });

        res.json({ data: groupedData });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

export const copyDayToAll = async (req: Request, res: Response) => {
    try {
        const { classId, sourceDay } = req.body;
        const otherDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].filter(d => d !== sourceDay);

        // Fetch source day entries
        const sourceEntries = await TimetableModel.find({ classId, day: sourceDay });
        if (sourceEntries.length === 0) {
            return res.status(400).json({ message: "No entries found on source day to copy." });
        }

        // Delete existing entries for other days
        await TimetableModel.deleteMany({ classId, day: { $in: otherDays } });

        // Clone entries for each other day
        const newEntries: any[] = [];
        otherDays.forEach(day => {
            sourceEntries.forEach(entry => {
                newEntries.push({
                    classId: entry.classId,
                    subject: entry.subject,
                    teacherId: entry.teacherId,
                    startTime: entry.startTime,
                    endTime: entry.endTime,
                    day: day
                });
            });
        });

        await TimetableModel.insertMany(newEntries);
        res.json({ message: `Timetable copied from ${sourceDay} to all other days!` });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};
