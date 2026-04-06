import { Request, Response } from "express";
import { sendErrorResponse, sendSuccessResponse } from "../utils/response";
import { notify } from "../utils/enum";
import { createClass, findClassByName, getAllClasses, getExistingClass, updateClassById } from "../services/admin/adminClassService";

export const addClass = async (req: Request, res: Response) => {
	try {
		const { class_name, subjects } = req.body;

		if (!class_name) {
			return sendErrorResponse(res, 400, "Class name is required");
		}

		// Check if class already exists
		const existingClass = await findClassByName(class_name);
		
		if (existingClass) {
			return sendErrorResponse(res, 400, notify.CLASS_EXIST);
		}

		// Ensure subjects are unique if provided
		let uniqueSubjects: string[] = [];
		if (subjects && Array.isArray(subjects)) {

			uniqueSubjects = Array.from(new Set(subjects.map((s: string) => s.trim()))).filter(s => s !== "");
		}

		const newClass = await createClass(class_name, uniqueSubjects);

		return sendSuccessResponse(res, 201, notify.CLASS_ADDED, newClass);

	} catch (error: any) {
		return sendErrorResponse(res, 500, error.message);
	}
};

export const getClasses = async (req: Request, res: Response) => {
	try {
		const classes = await getAllClasses();
		return sendSuccessResponse(res, 200, notify.CLASS_FETCH, classes);
	} catch (error: any) {
		return sendErrorResponse(res, 500, error.message);
	}
};

export const updateClass = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const { class_name, subjects } = req.body;

		if (!class_name) {
			return sendErrorResponse(res, 400, notify.CLASS_NAME_REQUIRED);
		}

		// Check if another class already has this name
		const existingClass = await getExistingClass(id, class_name);

		if (existingClass) {
			return sendErrorResponse(res, 400, notify.CLASS_EXIST);
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

		await updateClassById(id, class_name, uniqueSubjects);

		return sendSuccessResponse(res, 200, notify.CLASS_UPDATED, {});

	} catch (error: any) {
		return sendErrorResponse(res, 500, error.message);
	}
};
