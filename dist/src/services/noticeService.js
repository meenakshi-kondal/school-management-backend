"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateNotice = exports.removeNotice = exports.getNoticesWithoutPagination = exports.getNoticesWithPagination = exports.createNotice = void 0;
const noticeSchema_1 = __importDefault(require("../schema/noticeSchema"));
const createNotice = async (title, description, userId) => {
    try {
        const newNotice = new noticeSchema_1.default({
            title,
            description,
            userId
        });
        await newNotice.save();
        return newNotice;
    }
    catch (error) {
        throw new Error(error.message);
    }
};
exports.createNotice = createNotice;
const getNoticesWithPagination = async (search, skipPage, pageLimit) => {
    try {
        const filter = {
            is_deleted: 0
        };
        if (search && search.trim() !== '') {
            const searchRegex = { $regex: search, $options: 'i' };
            filter.$or = [
                { title: searchRegex },
                { description: searchRegex }
            ];
        }
        const list = await noticeSchema_1.default.find(filter)
            .skip(skipPage)
            .limit(pageLimit);
        const total = await noticeSchema_1.default.countDocuments(filter);
        return { list, total };
    }
    catch (error) {
        throw new Error(error.message);
    }
};
exports.getNoticesWithPagination = getNoticesWithPagination;
const getNoticesWithoutPagination = async (search) => {
    try {
        const filter = {
            is_deleted: 0
        };
        if (search && search.trim() !== '') {
            const searchRegex = { $regex: search, $options: 'i' };
            filter.$or = [
                { name: searchRegex }
            ];
        }
        const list = await noticeSchema_1.default.find(filter);
        return list;
    }
    catch (error) {
        throw new Error(error.message);
    }
};
exports.getNoticesWithoutPagination = getNoticesWithoutPagination;
const removeNotice = async (id) => {
    try {
        const notice = await noticeSchema_1.default.findByIdAndUpdate(id, { is_deleted: 1 });
        return notice;
    }
    catch (error) {
        throw new Error(error.message);
    }
};
exports.removeNotice = removeNotice;
const updateNotice = async (id, userId) => {
    try {
        const notice = await noticeSchema_1.default.findByIdAndUpdate(id, { $addToSet: { readBy: userId } }, { new: true });
        return notice;
    }
    catch (error) {
        throw new Error(error.message);
    }
};
exports.updateNotice = updateNotice;
