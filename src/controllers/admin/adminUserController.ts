import { Request, Response } from "express";
import { sendErrorResponse, sendSuccessResponse } from "../../utils/response";
import { getAllUsersCount, getUsersCount, studentsByClass } from "../../services/adminService";
import { notify } from "../../utils/enum";
import { getPagination } from "../../utils/commonFunction";

export const dashboard = async(req: Request, res: Response) => {

    try {

        const existsUsers = await getUsersCount();

        const allUsers = await getAllUsersCount();

        return sendSuccessResponse(res, 200, notify.GET, {existsUsers, allUsers})

    } catch (error: any) {
        return sendErrorResponse(res, 400, error.message);
    }
}

export const userList = async(req: Request, res: Response) => {

    try {
        const { type, className, page, limit, pagination} =  req.params;

        if(!type) return sendErrorResponse(res, 400, notify.TYPE_REQUIRED);
        if(!className) return sendErrorResponse(res, 400, notify.CLASSNAME_REQUIRED);

        let paginationParam = {};
        if(pagination) {
           paginationParam = getPagination(page,limit);
        }

        // added search filter, pagination
        const allStudents = await studentsByClass(type, className,  paginationParam.skipPage, paginationParam.pageLimit);

        return sendSuccessResponse(res, 200, notify.GET, allStudents);
    } catch (error: any) {
        throw new Error(error.message);
    }
}