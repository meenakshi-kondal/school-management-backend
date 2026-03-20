"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAssignment = exports.workAlreadyAssigned = exports.assignment = exports.getUserClasses = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const assignmentSchema_1 = __importDefault(require("../schema/assignmentSchema"));
const userSchema_1 = __importDefault(require("../schema/userSchema"));
const getUserClasses = async (id) => {
    try {
        const exist = await userSchema_1.default.findById(id).select('class');
        return exist;
    }
    catch (error) {
        throw new Error(error.message);
    }
};
exports.getUserClasses = getUserClasses;
const assignment = async (payload) => {
    try {
        const assign = new assignmentSchema_1.default(payload);
        return await assign.save();
    }
    catch (error) {
        throw new Error(error.message);
    }
};
exports.assignment = assignment;
const workAlreadyAssigned = async (classId, assigned_on, assigned_by) => {
    try {
        const assignedWork = await assignmentSchema_1.default.find({ class: classId, assigned_on, assigned_by });
        return assignedWork;
    }
    catch (error) {
        throw new Error(error.message);
    }
};
exports.workAlreadyAssigned = workAlreadyAssigned;
const getAssignment = async (user_id, className, assigned_on) => {
    try {
        const filter = {
            is_deleted: 0,
            class: className,
            $or: [
                { assigned_type: 'ALL' },
                {
                    assigned_type: 'INDIVIDUAL',
                    assigned_to: new mongoose_1.default.Types.ObjectId(user_id)
                }
            ]
        };
        if (assigned_on) {
            const start = new Date(assigned_on);
            start.setHours(0, 0, 0, 0);
            const end = new Date(assigned_on);
            end.setHours(23, 59, 59, 999);
            filter.assigned_on = {
                $gte: start,
                $lte: end
            };
        }
        const assignedWork = await assignmentSchema_1.default
            .find(filter)
            .populate('assigned_by', 'name email')
            .sort({ assigned_on: -1 });
        return assignedWork;
    }
    catch (error) {
        throw new Error(error.message);
    }
};
exports.getAssignment = getAssignment;
