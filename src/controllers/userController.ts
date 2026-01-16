import { Request, Response } from "express";
import { sendErrorResponse, sendSuccessResponse } from "../utils/response";
import { profileDetailValidation } from "../validations/authValidation";
import { isUser } from "../services/authService";
import { notify } from "../utils/enum";
import { getUserClasses, assignment, workAlreadyAssigned, getAssignment } from "../services/userService";
import { assignedWorkValidation } from "../validations/userValidation";

// This API will return the profile details of student or teacher
export const profile = async(req: Request, res: Response) => {

    try {
        
        const payload = req.body;
        
        const { error, value } = profileDetailValidation.validate(payload);
        if (error) return sendErrorResponse(res, 400, error.details[0].message);

        // check id is present in db or not
        const isUserExist = await isUser(payload.id);
        if(!isUserExist) {
            return sendErrorResponse(res, 401, notify.NOT_USER);
        }

        return sendSuccessResponse(res, 200, notify.GET, isUserExist);
        
    } catch (error: any) {
        return sendErrorResponse(res, 400, error.message);
    }
}
 
// This API will return the classes in which the teacher is enrolled.
export const teacherClasses = async(req: Request, res: Response) => {

    try {

        const payload = req.body;

        const { error, value } = profileDetailValidation.validate(payload);
        if (error) return sendErrorResponse(res, 400, error.details[0].message);

        // check id is present in db or not
        const isUserExist = await getUserClasses(payload.id);
        if (!isUserExist) {
            return sendErrorResponse(res, 401, notify.NOT_USER);
        }

        return sendSuccessResponse(res, 200, notify.GET, isUserExist);

        
    } catch (error: any) {
        return sendErrorResponse(res, 400, error.message);
    }
}

// This API is use to assigned the work to students(one or more students)
export const assignedWork = async(req: Request, res: Response) => {

    try {

        const payload = req.body;

        const { error, value } = assignedWorkValidation.validate(payload);
        if(error) return sendErrorResponse(res, 400, error.details[0].message);

        const isTeacherAssignedToClass = await getUserClasses(payload.assigned_by);
        if(!isTeacherAssignedToClass){
            return sendErrorResponse(res, 400, notify.NOT_USER);
        }

        if(isTeacherAssignedToClass.class != payload.class){
            return sendErrorResponse(res, 400, notify.TEACHER_CLASS_NOT_FOUND);
        }

        const alreadyAssigned = await workAlreadyAssigned(payload.class, payload.assigned_on, payload.assigned_by);
        if(alreadyAssigned) {
            return sendErrorResponse(res, 400, notify.ALLREADY_ASSIGNED_WORK)
        }

        const assigned = await assignment(payload);
        return sendSuccessResponse(res, 201, notify.ASSIGNED_WORK, assigned );

    } catch (error: any) {
        return sendErrorResponse(res, 400, error.message);
    }

}

// This API return the assigned work to student
export const getAssignedWork = async(req: any, res: Response) =>{

    try {
        
        const {class_name, assigned_on} = req.params;

        if(!class_name) return sendErrorResponse(res, 400, notify.CLASS_NAME_REQUIRED);

        const getWork = await getAssignment(req.user._id, class_name, assigned_on);

        return sendSuccessResponse(res, 200, notify.GET, getWork);

    } catch (error: any) {
        return sendErrorResponse(res, 400, error.message);
    }
}