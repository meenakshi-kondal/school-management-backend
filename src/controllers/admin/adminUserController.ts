import { Request, Response } from 'express';
import { sendErrorResponse, sendSuccessResponse } from '../../utils/response';
import { notify } from '../../utils/enum';
import { getPagination } from '../../utils/commonFunction';
import {
    getAllUsersCount,
    getUsersCount,
    studentsListWithPagination,
    studentsListWithoutPagination, 
    teachersListWithPagination,
    teachersListWithoutPagination,
    userDetails
} from '../../services/adminService';

export const dashboard = async(req: Request, res: Response) => {

    try {

        const existsUsers = await getUsersCount();

        const allUsers = await getAllUsersCount();

        return sendSuccessResponse(res, 200, notify.GET, {existsUsers, allUsers})

    } catch (error: any) {
        return sendErrorResponse(res, 400, error.message);
    }
}

export const studentsList = async(req: Request, res: Response) => {

    try {
        const { className, page, limit, pagination, search} =  req.params;

        if(!className) return sendErrorResponse(res, 400, notify.CLASSNAME_REQUIRED);

        let allStudents;

        if(pagination) {

            if(!page || !limit) {
                return sendErrorResponse(res, 404, notify.PAGINATION);
            }
           const paginationParam = getPagination(page, limit);

            allStudents = await studentsListWithPagination(
                className,
                paginationParam.skipPage,
                paginationParam.pageLimit,
                search
            );
        } else {
             allStudents = await studentsListWithoutPagination(
                className,
                search
            );
        }

        return sendSuccessResponse(res, 200, notify.GET, allStudents);

    } catch (error: any) {
        throw new Error(error.message);
    }
}

export const teachersList = async(req: Request, res: Response) => {

    try {
        
        const { pagination, page, limit, search } = req.params;

        let allTeachers;
        if(pagination) {

            if(!page || !limit) {
                return sendErrorResponse(res, 404, notify.PAGINATION);
            }

            const paginationParam = getPagination(page, limit);

            allTeachers = await teachersListWithPagination(
                search,
                paginationParam.skipPage,
                paginationParam.pageLimit
            );
        } else {

            allTeachers = await teachersListWithoutPagination(search);
        }

        return sendSuccessResponse(res, 200, notify.GET, allTeachers);

    } catch (error: any) {
        throw new Error(error.message);
    }
}

export const studentDetails = async(req: Request, res: Response) => {

    try {
        
        const user_id = req.params.id;

        if(!user_id) {
            return sendErrorResponse(res, 400, notify.ID_REQUIRED);
        }

        const details = await userDetails(user_id);
        if(!details) {
            return sendErrorResponse(res, 400, notify.NOT_USER);
        }



    } catch (error: any) {
      throw new Error(error.message);  
    }
}