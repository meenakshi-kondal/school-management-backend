import { Request, Response } from "express";
import { sendErrorResponse, sendSuccessResponse } from "../utils/response";
import { profileDetailValidation } from "../validations/authValidation";
import { isUser } from "../services/authService";
import { notify } from "../utils/enum";
import { getUserClasses } from "../services/userService";
import { assignedWorkValidation } from "../validations/userValidation";

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
 
export const teacherClasses = async(req: Request, res: Response) => {

    try {
        const payload = req.body;

         const { error, value } = profileDetailValidation.validate(payload);
        if (error) return sendErrorResponse(res, 400, error.details[0].message);

        // check id is present in db or not
        const isUserExist = await getUserClasses(payload.id);
        if(!isUserExist) {
            return sendErrorResponse(res, 401, notify.NOT_USER);
        }

        return sendSuccessResponse(res, 200, notify.GET, isUserExist);

        
    } catch (error: any) {
        return sendErrorResponse(res, 400, error.message);
    }
}

export const assignedWork = async(req: Request, res: Response) => {

    try {

        const payload = req.body;

        const { error, value } = assignedWorkValidation.validate(payload);
        if (error) return sendErrorResponse(res, 400, error.details[0].message);

        const assigned = await assignement(payload)

        
    } catch (error: any) {
        return sendErrorResponse(res, 400, error.message);
    }

}