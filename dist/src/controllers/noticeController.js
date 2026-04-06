"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markNoticeAsRead = exports.deleteNotice = exports.noticeList = exports.addNotice = void 0;
const response_1 = require("../utils/response");
const enum_1 = require("../utils/enum");
const noticeService_1 = require("../services/noticeService");
const commonFunction_1 = require("../utils/commonFunction");
const addNotice = async (req, res) => {
    try {
        const { title, description } = req.body;
        const userId = req.user?._id;
        if (!title) {
            return (0, response_1.sendErrorResponse)(res, 400, enum_1.notify.NOTICE_TITLE_REQUIRED);
        }
        await (0, noticeService_1.createNotice)(title, description, userId);
        return (0, response_1.sendSuccessResponse)(res, 201, enum_1.notify.NOTICE_ADDED, {});
    }
    catch (error) {
        return (0, response_1.sendErrorResponse)(res, 500, error.message);
    }
};
exports.addNotice = addNotice;
const noticeList = async (req, res) => {
    try {
        const { pagination, page, limit, search } = req.query;
        let notices;
        if (pagination === 'true' || pagination === true) {
            if (!page || !limit) {
                return (0, response_1.sendErrorResponse)(res, 404, enum_1.notify.PAGINATION);
            }
            const paginationParam = (0, commonFunction_1.getPagination)(page, limit);
            notices = await (0, noticeService_1.getNoticesWithPagination)(search, paginationParam.skipPage, paginationParam.pageLimit);
        }
        else {
            notices = await (0, noticeService_1.getNoticesWithoutPagination)(search);
        }
        return (0, response_1.sendSuccessResponse)(res, 200, enum_1.notify.NOTICE_FETCH, notices);
    }
    catch (error) {
        return (0, response_1.sendErrorResponse)(res, 500, error.message);
    }
};
exports.noticeList = noticeList;
const deleteNotice = async (req, res) => {
    try {
        const { id } = req.params;
        const notice = await (0, noticeService_1.removeNotice)(id);
        if (!notice) {
            return (0, response_1.sendErrorResponse)(res, 404, enum_1.notify.NOTICE_NOT_FOUND);
        }
        return (0, response_1.sendSuccessResponse)(res, 200, enum_1.notify.NOTICE_DELETED, notice);
    }
    catch (error) {
        return (0, response_1.sendErrorResponse)(res, 500, error.message);
    }
};
exports.deleteNotice = deleteNotice;
const markNoticeAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?._id;
        await (0, noticeService_1.updateNotice)(id, userId);
        return (0, response_1.sendSuccessResponse)(res, 200, enum_1.notify.NOTICE_MARKED, {});
    }
    catch (error) {
        return (0, response_1.sendErrorResponse)(res, 500, error.message);
    }
};
exports.markNoticeAsRead = markNoticeAsRead;
