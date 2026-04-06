"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.studentDetails = exports.teachersList = exports.studentsList = exports.dashboard = void 0;
const response_1 = require("../../utils/response");
const enum_1 = require("../../utils/enum");
const commonFunction_1 = require("../../utils/commonFunction");
const adminUserService_1 = require("../../services/admin/adminUserService");
const dashboard = async (req, res) => {
    try {
        const existsUsers = await (0, adminUserService_1.getUsersCount)();
        const allUsers = await (0, adminUserService_1.getAllUsersCount)();
        return (0, response_1.sendSuccessResponse)(res, 200, enum_1.notify.GET, { existsUsers, allUsers });
    }
    catch (error) {
        return (0, response_1.sendErrorResponse)(res, 400, error.message);
    }
};
exports.dashboard = dashboard;
const studentsList = async (req, res) => {
    try {
        const { className, page, limit, pagination, search, status, gender } = req.query;
        let allStudents;
        if (pagination === 'true' || pagination === true) {
            if (!page || !limit) {
                return (0, response_1.sendErrorResponse)(res, 404, enum_1.notify.PAGINATION);
            }
            const paginationParam = (0, commonFunction_1.getPagination)(page, limit);
            allStudents = await (0, adminUserService_1.studentsListWithPagination)(className, paginationParam.skipPage, paginationParam.pageLimit, search, status, gender);
        }
        else {
            allStudents = await (0, adminUserService_1.studentsListWithoutPagination)(className, search, status, gender);
        }
        return (0, response_1.sendSuccessResponse)(res, 200, enum_1.notify.GET, allStudents);
    }
    catch (error) {
        return (0, response_1.sendErrorResponse)(res, 400, error.message);
    }
};
exports.studentsList = studentsList;
const teachersList = async (req, res) => {
    try {
        const { pagination, page, limit, search } = req.query;
        let allTeachers;
        if (pagination === 'true' || pagination === true) {
            if (!page || !limit) {
                return (0, response_1.sendErrorResponse)(res, 404, enum_1.notify.PAGINATION);
            }
            const paginationParam = (0, commonFunction_1.getPagination)(page, limit);
            allTeachers = await (0, adminUserService_1.teachersListWithPagination)(search, paginationParam.skipPage, paginationParam.pageLimit);
        }
        else {
            allTeachers = await (0, adminUserService_1.teachersListWithoutPagination)(search);
        }
        return (0, response_1.sendSuccessResponse)(res, 200, enum_1.notify.GET, allTeachers);
    }
    catch (error) {
        return (0, response_1.sendErrorResponse)(res, 400, error.message);
    }
};
exports.teachersList = teachersList;
const studentDetails = async (req, res) => {
    try {
        const userId = req.params.id;
        if (!userId) {
            return (0, response_1.sendErrorResponse)(res, 400, "User ID is required");
        }
        const details = await (0, adminUserService_1.getStudentById)(userId);
        if (!details) {
            return (0, response_1.sendErrorResponse)(res, 400, "Student details not found");
        }
        return (0, response_1.sendSuccessResponse)(res, 200, enum_1.notify.GET, details);
    }
    catch (error) {
        return (0, response_1.sendErrorResponse)(res, 400, error.message);
    }
};
exports.studentDetails = studentDetails;
