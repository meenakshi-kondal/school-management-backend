"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateClass = exports.getClasses = exports.addClass = void 0;
const response_1 = require("../utils/response");
const enum_1 = require("../utils/enum");
const adminClassService_1 = require("../services/admin/adminClassService");
const addClass = async (req, res) => {
    try {
        const { class_name, subjects } = req.body;
        if (!class_name) {
            return (0, response_1.sendErrorResponse)(res, 400, "Class name is required");
        }
        // Check if class already exists
        const existingClass = await (0, adminClassService_1.findClassByName)(class_name);
        if (existingClass) {
            return (0, response_1.sendErrorResponse)(res, 400, enum_1.notify.CLASS_EXIST);
        }
        // Ensure subjects are unique if provided
        let uniqueSubjects = [];
        if (subjects && Array.isArray(subjects)) {
            uniqueSubjects = Array.from(new Set(subjects.map((s) => s.trim()))).filter(s => s !== "");
        }
        const newClass = await (0, adminClassService_1.createClass)(class_name, uniqueSubjects);
        return (0, response_1.sendSuccessResponse)(res, 201, enum_1.notify.CLASS_ADDED, newClass);
    }
    catch (error) {
        return (0, response_1.sendErrorResponse)(res, 500, error.message);
    }
};
exports.addClass = addClass;
const getClasses = async (req, res) => {
    try {
        const classes = await (0, adminClassService_1.getAllClasses)();
        return (0, response_1.sendSuccessResponse)(res, 200, enum_1.notify.CLASS_FETCH, classes);
    }
    catch (error) {
        return (0, response_1.sendErrorResponse)(res, 500, error.message);
    }
};
exports.getClasses = getClasses;
const updateClass = async (req, res) => {
    try {
        const { id } = req.params;
        const { class_name, subjects } = req.body;
        if (!class_name) {
            return (0, response_1.sendErrorResponse)(res, 400, enum_1.notify.CLASS_NAME_REQUIRED);
        }
        // Check if another class already has this name
        const existingClass = await (0, adminClassService_1.getExistingClass)(id, class_name);
        if (existingClass) {
            return (0, response_1.sendErrorResponse)(res, 400, enum_1.notify.CLASS_EXIST);
        }
        // Ensure subjects are unique
        let uniqueSubjects = [];
        if (subjects) {
            const tempSubjects = Array.isArray(subjects)
                ? subjects
                : subjects.split(',').map((s) => s.trim());
            uniqueSubjects = Array.from(new Set(tempSubjects.map((s) => s.toString().trim())));
            uniqueSubjects = uniqueSubjects.filter(s => s !== "");
        }
        await (0, adminClassService_1.updateClassById)(id, class_name, uniqueSubjects);
        return (0, response_1.sendSuccessResponse)(res, 200, enum_1.notify.CLASS_UPDATED, {});
    }
    catch (error) {
        return (0, response_1.sendErrorResponse)(res, 500, error.message);
    }
};
exports.updateClass = updateClass;
