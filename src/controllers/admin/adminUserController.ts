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
    getStudentById,
    userDetails
} from '../../services/admin/adminUserService';

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
        const { className, page, limit, pagination, search, status, gender } = req.query as any;

        let allStudents;

        if (pagination === 'true' || pagination === true) {

            if (!page || !limit) {
                return sendErrorResponse(res, 404, notify.PAGINATION);
            }
            const paginationParam = getPagination(page as string, limit as string);

            allStudents = await studentsListWithPagination(
                className,
                paginationParam.skipPage,
                paginationParam.pageLimit,
                search,
                status,
                gender
            );
        } else {
            allStudents = await studentsListWithoutPagination(
                className,
                search,
                status,
                gender
            );
        }

        return sendSuccessResponse(res, 200, notify.GET, allStudents);

    } catch (error: any) {
        return sendErrorResponse(res, 400, error.message);
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
        return sendErrorResponse(res, 400, error.message);
    }
}

export const studentDetails = async(req: Request, res: Response) => {
    try {
        const user_id = req.params.id;
        if(!user_id) {
            return sendErrorResponse(res, 400, "User ID is required");
        }

        const details = await getStudentById(user_id);
        if(!details) {
            return sendErrorResponse(res, 400, "Student details not found");
        }

        return sendSuccessResponse(res, 200, notify.GET, details);

    } catch (error: any) {
        return sendErrorResponse(res, 400, error.message);
    }
}