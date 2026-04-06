"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStudentById = exports.userDetails = exports.teachersListWithoutPagination = exports.teachersListWithPagination = exports.studentsListWithoutPagination = exports.studentsListWithPagination = exports.getAllUsersCount = exports.getUsersCount = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const studentSchema_1 = __importDefault(require("../../schema/studentSchema"));
const teacherSchema_1 = __importDefault(require("../../schema/teacherSchema"));
const getUsersCount = async () => {
    try {
        const studentCount = await studentSchema_1.default.countDocuments({ status: 'enable', is_deleted: 0 });
        const teacherCount = await teacherSchema_1.default.countDocuments({ status: 'enable', is_deleted: 0 });
        return [
            { _id: 'student', total: studentCount },
            { _id: 'teacher', total: teacherCount },
        ];
    }
    catch (error) {
        throw new Error(error.message);
    }
};
exports.getUsersCount = getUsersCount;
const getAllUsersCount = async () => {
    try {
        const studentCount = await studentSchema_1.default.countDocuments();
        const teacherCount = await teacherSchema_1.default.countDocuments();
        return [
            { _id: 'student', total: studentCount },
            { _id: 'teacher', total: teacherCount }
        ];
    }
    catch (error) {
        throw new Error(error.message);
    }
};
exports.getAllUsersCount = getAllUsersCount;
const studentsListWithPagination = async (className, skipPage, pageLimit, search, status, gender) => {
    try {
        const filter = {
            status: 'enable',
            is_deleted: 0
        };
        if (className) {
            filter['class_id'] = className;
        }
        if (gender) {
            filter['gender'] = { $regex: new RegExp(`^${gender}$`, 'i') };
        }
        if (search && search.trim() !== '') {
            const searchRegex = { $regex: search, $options: 'i' };
            const orConditions = [
                { name: searchRegex }
            ];
            // If search is numeric, check roll_number
            if (!isNaN(Number(search))) {
                orConditions.push({ roll_number: Number(search) });
            }
            filter.$or = orConditions;
        }
        const list = await studentSchema_1.default.find(filter)
            .populate({ path: 'userId', select: 'email' })
            .populate({ path: 'guardian_id' })
            .populate({ path: 'class_id', select: 'class_name' })
            .skip(skipPage)
            .limit(pageLimit)
            .sort({ roll_number: 1 });
        const total = await studentSchema_1.default.countDocuments(filter);
        // Get gender counts for the filtered class (ignoring pagination)
        const countsFilter = { ...filter };
        const genderCounts = await studentSchema_1.default.aggregate([
            { $match: countsFilter },
            { $group: { _id: '$gender', count: { $sum: 1 } } }
        ]);
        const stats = {
            total,
            boys: genderCounts.find(g => g._id === 'male' || g._id === 'Male')?.count || 0,
            girls: genderCounts.find(g => g._id === 'female' || g._id === 'Female')?.count || 0
        };
        return { list, total, stats };
    }
    catch (error) {
        throw new Error(error.message);
    }
};
exports.studentsListWithPagination = studentsListWithPagination;
const studentsListWithoutPagination = async (className, search, status, gender) => {
    try {
        const filter = {
            status: 'enable',
            is_deleted: 0
        };
        if (className) {
            filter['class_id'] = className;
        }
        if (gender) {
            filter['gender'] = { $regex: new RegExp(`^${gender}$`, 'i') };
        }
        if (search && search.trim() !== '') {
            const searchRegex = { $regex: search, $options: 'i' };
            const orConditions = [
                { name: searchRegex }
            ];
            if (!isNaN(Number(search))) {
                orConditions.push({ roll_number: Number(search) });
            }
            filter.$or = orConditions;
        }
        const list = await studentSchema_1.default.find(filter)
            .populate({ path: 'userId', select: 'email' })
            .populate({ path: 'guardian_id' })
            .sort({ roll_number: 1 });
        return list;
    }
    catch (error) {
        throw new Error(error.message);
    }
};
exports.studentsListWithoutPagination = studentsListWithoutPagination;
const teachersListWithPagination = async (search, skipPage, pageLimit) => {
    try {
        const filter = {
            status: 'enable',
            is_deleted: 0
        };
        if (search && search.trim() !== '') {
            const searchRegex = { $regex: search, $options: 'i' };
            filter.$or = [
                { name: searchRegex }
            ];
        }
        const list = await teacherSchema_1.default.find(filter)
            .populate({ path: 'userId', select: 'email' })
            .skip(skipPage)
            .limit(pageLimit);
        const total = await teacherSchema_1.default.countDocuments(filter);
        return { list, total };
    }
    catch (error) {
        throw new Error(error.message);
    }
};
exports.teachersListWithPagination = teachersListWithPagination;
const teachersListWithoutPagination = async (search) => {
    try {
        const filter = {
            status: 'enable',
            is_deleted: 0
        };
        if (search && search.trim() !== '') {
            const searchRegex = { $regex: search, $options: 'i' };
            filter.$or = [
                { name: searchRegex }
            ];
        }
        const list = await teacherSchema_1.default.find(filter)
            .populate({ path: 'userId', select: 'email' });
        return list;
    }
    catch (error) {
        throw new Error(error.message);
    }
};
exports.teachersListWithoutPagination = teachersListWithoutPagination;
const userDetails = async (id) => {
    try {
        const userId = new mongoose_1.default.Types.ObjectId(id);
        // Try student profile first
        let details = await studentSchema_1.default.aggregate([
            { $match: { userId: userId } },
            { $lookup: { from: 'users', localField: 'userId', foreignField: '_id', as: 'userInfo' } },
            { $unwind: { path: '$userInfo', preserveNullAndEmptyArrays: true } },
            { $lookup: { from: 'guardians', localField: 'guardian_id', foreignField: '_id', as: 'guardianInfo' } },
            { $unwind: { path: '$guardianInfo', preserveNullAndEmptyArrays: true } },
            { $lookup: { from: 'documents', localField: 'userId', foreignField: 'userId', as: 'documents' } },
            { $lookup: { from: 'classes', localField: 'class_id', foreignField: '_id', as: 'class_info' } },
            { $unwind: { path: '$class_info', preserveNullAndEmptyArrays: true } },
            { $project: { 'userInfo.password': 0 } }
        ]);
        if (details.length === 0) {
            // Try teacher profile
            details = await teacherSchema_1.default.aggregate([
                { $match: { userId: userId } },
                { $lookup: { from: 'users', localField: 'userId', foreignField: '_id', as: 'userInfo' } },
                { $unwind: { path: '$userInfo', preserveNullAndEmptyArrays: true } },
                { $lookup: { from: 'documents', localField: 'userId', foreignField: 'userId', as: 'documents' } },
                { $project: { 'userInfo.password': 0 } }
            ]);
        }
        return details;
    }
    catch (error) {
        throw new Error(error.message);
    }
};
exports.userDetails = userDetails;
const getStudentById = async (id) => {
    try {
        const student = await studentSchema_1.default.aggregate([
            { $match: { _id: new mongoose_1.default.Types.ObjectId(id) } },
            { $lookup: { from: 'users', localField: 'userId', foreignField: '_id', as: 'userInfo' } },
            { $unwind: { path: '$userInfo', preserveNullAndEmptyArrays: true } },
            { $lookup: { from: 'guardians', localField: 'guardian_id', foreignField: '_id', as: 'guardianInfo' } },
            { $unwind: { path: '$guardianInfo', preserveNullAndEmptyArrays: true } },
            { $lookup: { from: 'documents', localField: 'userId', foreignField: 'userId', as: 'documents' } },
            {
                $lookup: {
                    from: 'classes',
                    localField: 'class_id',
                    foreignField: '_id',
                    as: 'class_info'
                }
            },
            { $unwind: { path: '$class_info', preserveNullAndEmptyArrays: true } },
            { $project: { 'userInfo.password': 0 } }
        ]);
        return student.length > 0 ? student[0] : null;
    }
    catch (error) {
        throw new Error(error.message);
    }
};
exports.getStudentById = getStudentById;
