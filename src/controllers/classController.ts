import { Request, Response } from "express";
import ClassModel from "../schema/classSchema";
import { sendErrorResponse, sendSuccessResponse } from "../utils/response";

export const addClass = async (req: Request, res: Response) => {
    try {
        const { class_name, subjects } = req.body;

        if (!class_name) {
            return sendErrorResponse(res, 400, "Class name is required");
        }

        // Check if class already exists
        const existingClass = await ClassModel.findOne({ 
            class_name: { $regex: new RegExp(`^${class_name}$`, "i") } 
        });
        
        if (existingClass) {
            return sendErrorResponse(res, 400, "Class already exists");
        }

        // Ensure subjects are unique if provided
        let uniqueSubjects: string[] = [];
        if (subjects && Array.isArray(subjects)) {
            // Remove duplicates and trim
            uniqueSubjects = Array.from(new Set(subjects.map((s: string) => s.trim()))).filter(s => s !== "");
        }

        const newClass = new ClassModel({
            class_name,
            subjects: uniqueSubjects
        });

        await newClass.save();

        return sendSuccessResponse(res, 201, "Class added successfully", newClass);

    } catch (error: any) {
        return sendErrorResponse(res, 500, error.message);
    }
};

export const getAllClasses = async (req: Request, res: Response) => {
    try {
        const classes = await ClassModel.find().sort({ class_name: 1 });
        return sendSuccessResponse(res, 200, "Classes fetched successfully", classes);
    } catch (error: any) {
        return sendErrorResponse(res, 500, error.message);
    }
};

export const updateClass = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { class_name, subjects } = req.body;

        if (!class_name) {
            return sendErrorResponse(res, 400, "Class name is required");
        }

        // Check if another class already has this name
        const existingClass = await ClassModel.findOne({
            _id: { $ne: id },
            class_name: { $regex: new RegExp(`^${class_name}$`, "i") }
        });

        if (existingClass) {
            return sendErrorResponse(res, 400, "Another class with this name already exists");
        }

        // Ensure subjects are unique
        let uniqueSubjects: string[] = [];
        if (subjects) {
            const tempSubjects = Array.isArray(subjects) 
                ? subjects 
                : subjects.split(',').map((s: string) => s.trim());
            
            uniqueSubjects = Array.from(new Set(tempSubjects.map((s: any) => s.toString().trim()))) as string[];
            uniqueSubjects = uniqueSubjects.filter(s => s !== "");
        }

        const updatedClass = await ClassModel.findByIdAndUpdate(
            id,
            { class_name, subjects: uniqueSubjects },
            { new: true }
        );

        if (!updatedClass) {
            return sendErrorResponse(res, 404, "Class not found");
        }

        return sendSuccessResponse(res, 200, "Class updated successfully", updatedClass);

    } catch (error: any) {
        return sendErrorResponse(res, 500, error.message);
    }
};
