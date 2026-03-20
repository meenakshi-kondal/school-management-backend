"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userDetails = exports.teachersListWithoutPagination = exports.teachersListWithPagination = exports.studentsListWithoutPagination = exports.studentsListWithPagination = exports.getAllUsersCount = exports.getUsersCount = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema_1 = __importDefault(require("../../schema/userSchema"));
const getUsersCount = async () => {
    try {
        const counts = await userSchema_1.default.aggregate([
            { $match: { status: 'enable', is_deleted: 0 } },
            { $group: { _id: '$type', total: { $sum: 1 } } }
        ]);
        return counts;
    }
    catch (error) {
        throw new Error(error.message);
    }
};
exports.getUsersCount = getUsersCount;
const getAllUsersCount = async () => {
    try {
        const counts = await userSchema_1.default.aggregate([
            {
                $group: { _id: '$type', total: { $sum: 1 } }
            }
        ]);
        return counts;
    }
    catch (error) {
        throw new Error(error.message);
    }
};
exports.getAllUsersCount = getAllUsersCount;
const studentsListWithPagination = async (className, skipPage, pageLimit, search) => {
    try {
        let subquery = userSchema_1.default.find({
            staus: 'enable',
            is_deleted: 0,
            class: className,
            type: 'user'
        });
        if (search && search.trim() !== '') {
            subquery = userSchema_1.default.find({
                $or: [
                    { email: { $regex: search, $options: 'i' } },
                    { name: { $regex: search, $options: 'i' } },
                ]
            });
        }
        const list = await subquery.select('-password')
            .skip(skipPage)
            .limit(pageLimit);
        return list;
    }
    catch (error) {
        throw new Error(error.message);
    }
};
exports.studentsListWithPagination = studentsListWithPagination;
const studentsListWithoutPagination = async (className, search) => {
    try {
        let subquery = userSchema_1.default.find({
            status: 'enable',
            is_deleted: 0,
            class: className,
            type: 'user'
        });
        if (search && search.trim() !== '') {
            subquery = userSchema_1.default.find({
                $or: [
                    { email: { $regex: search, $options: 'i' } },
                    { name: { $regex: search, $options: 'i' } },
                ]
            });
        }
        const list = await subquery.select('-password');
        return list;
    }
    catch (error) {
        throw new Error(error.message);
    }
};
exports.studentsListWithoutPagination = studentsListWithoutPagination;
const teachersListWithPagination = async (search, skipPage, pageLimit) => {
    try {
        let subquery = userSchema_1.default.find({
            type: 'teacher',
            status: 'enable',
            is_deleted: 0
        });
        if (search && search.trim() !== '') {
            subquery = userSchema_1.default.find({
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { class: { $regex: search, $options: 'i' } },
                ]
            });
        }
        const list = await subquery.select('-password').skip(skipPage).limit(pageLimit);
        return list;
    }
    catch (error) {
        throw new Error(error.message);
    }
};
exports.teachersListWithPagination = teachersListWithPagination;
const teachersListWithoutPagination = async (search) => {
    try {
        let subquery = userSchema_1.default.find({
            type: 'teacher',
            status: 'enable',
            is_deleted: 0
        });
        if (search && search.trim() !== '') {
            subquery = userSchema_1.default.find({
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { class: { $regex: search, $options: 'i' } },
                ]
            });
        }
        const list = await subquery.select('-password');
        return list;
    }
    catch (error) {
        throw new Error(error.message);
    }
};
exports.teachersListWithoutPagination = teachersListWithoutPagination;
const userDetails = async (id) => {
    try {
        const user_id = new mongoose_1.default.Types.ObjectId(id);
        const details = await userSchema_1.default.aggregate([
            {
                $match: { _id: user_id }
            },
            {
                $lookup: {
                    from: 'kycs',
                    localField: '_id',
                    foreignField: 'user_id',
                    as: 'kycDetails'
                }
            },
            {
                $unwind: {
                    path: "$kyc_details",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    password: 0
                }
            }
        ]);
        return details;
    }
    catch (error) {
        throw new Error(error.message);
    }
};
exports.userDetails = userDetails;
