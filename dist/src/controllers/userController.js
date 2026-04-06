"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAssignedWork = exports.assignedWork = exports.teacherClasses = exports.profile = void 0;
const response_1 = require("../utils/response");
const authValidation_1 = require("../validations/authValidation");
const enum_1 = require("../utils/enum");
const userService_1 = require("../services/userService");
const userValidation_1 = require("../validations/userValidation");
// This API will return the profile
const profile = async (req, res) => {
    try {
        const payload = req.body;
        const { error, value } = authValidation_1.profileDetailValidation.validate(payload);
        if (error)
            return (0, response_1.sendErrorResponse)(res, 400, error.details[0].message);
        // check id is present in db or not
        const isUserExist = await (0, userService_1.userProfile)(payload.id, payload.role);
        if (!isUserExist) {
            return (0, response_1.sendErrorResponse)(res, 401, enum_1.notify.NOT_USER);
        }
        return (0, response_1.sendSuccessResponse)(res, 200, enum_1.notify.GET, isUserExist);
    }
    catch (error) {
        return (0, response_1.sendErrorResponse)(res, 400, error.message);
    }
};
exports.profile = profile;
// This API will return the classes in which the teacher is enrolled.
const teacherClasses = async (req, res) => {
    try {
        const payload = req.body;
        const { error, value } = authValidation_1.profileDetailValidation.validate(payload);
        if (error)
            return (0, response_1.sendErrorResponse)(res, 400, error.details[0].message);
        // check id is present in db or not
        const isUserExist = await (0, userService_1.getUserClasses)(payload.id);
        if (!isUserExist) {
            return (0, response_1.sendErrorResponse)(res, 401, enum_1.notify.NOT_USER);
        }
        return (0, response_1.sendSuccessResponse)(res, 200, enum_1.notify.GET, isUserExist);
    }
    catch (error) {
        return (0, response_1.sendErrorResponse)(res, 400, error.message);
    }
};
exports.teacherClasses = teacherClasses;
// This API is use to assigned the work to students(one or more students)
const assignedWork = async (req, res) => {
    try {
        const payload = req.body;
        const { error, value } = userValidation_1.assignedWorkValidation.validate(payload);
        if (error)
            return (0, response_1.sendErrorResponse)(res, 400, error.details[0].message);
        const isTeacherAssignedToClass = await (0, userService_1.getUserClasses)(payload.assigned_by);
        if (!isTeacherAssignedToClass) {
            return (0, response_1.sendErrorResponse)(res, 400, enum_1.notify.NOT_USER);
        }
        if (isTeacherAssignedToClass.class != payload.class) {
            return (0, response_1.sendErrorResponse)(res, 400, enum_1.notify.TEACHER_CLASS_NOT_FOUND);
        }
        const alreadyAssigned = await (0, userService_1.workAlreadyAssigned)(payload.class, payload.assigned_on, payload.assigned_by);
        if (alreadyAssigned) {
            return (0, response_1.sendErrorResponse)(res, 400, enum_1.notify.ALLREADY_ASSIGNED_WORK);
        }
        const assigned = await (0, userService_1.assignment)(payload);
        return (0, response_1.sendSuccessResponse)(res, 201, enum_1.notify.ASSIGNED_WORK, assigned);
    }
    catch (error) {
        return (0, response_1.sendErrorResponse)(res, 400, error.message);
    }
};
exports.assignedWork = assignedWork;
// This API return the assigned work to student
const getAssignedWork = async (req, res) => {
    try {
        const { class_name, assigned_on } = req.params;
        if (!class_name)
            return (0, response_1.sendErrorResponse)(res, 400, enum_1.notify.CLASS_NAME_REQUIRED);
        const getWork = await (0, userService_1.getAssignment)(req.user._id, class_name, assigned_on);
        return (0, response_1.sendSuccessResponse)(res, 200, enum_1.notify.GET, getWork);
    }
    catch (error) {
        return (0, response_1.sendErrorResponse)(res, 400, error.message);
    }
};
exports.getAssignedWork = getAssignedWork;
