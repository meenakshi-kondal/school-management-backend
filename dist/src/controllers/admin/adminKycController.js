"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.list = exports.update = void 0;
const enum_1 = require("../../utils/enum");
const commonFunction_1 = require("../../utils/commonFunction");
const response_1 = require("../../utils/response");
const adminKycService_1 = require("../../services/admin/adminKycService");
const update = async (req, res) => {
    try {
        const { status, kyc_id } = req.params;
        if (!status || !kyc_id) {
            return (0, response_1.sendErrorResponse)(res, 400, enum_1.notify.KYC_PARAM_REQUIRED);
        }
        // check kyc exist or not
        const isExist = await (0, adminKycService_1.isKycExist)(kyc_id);
        if (!isExist) {
            return (0, response_1.sendErrorResponse)(res, 400, enum_1.notify.NOT_EXIST);
        }
        await (0, adminKycService_1.updateKYC)(kyc_id, parseInt(status));
        return (0, response_1.sendSuccessResponse)(res, 200, enum_1.notify.KYC_UPDATE, {});
    }
    catch (error) {
        return (0, response_1.sendErrorResponse)(res, 400, error.message);
    }
};
exports.update = update;
const list = async (req, res) => {
    try {
        const { page, limit, pagination, search, status } = req.params;
        if (!status) {
            return (0, response_1.sendErrorResponse)(res, 400, enum_1.notify.KYC_LIST_PARAM);
        }
        let allRecords;
        if (pagination) {
            if (!page || !limit) {
                return (0, response_1.sendErrorResponse)(res, 404, enum_1.notify.PAGINATION);
            }
            const paginationParam = (0, commonFunction_1.getPagination)(page, limit);
            allRecords = await (0, adminKycService_1.kycListWithPagination)(parseInt(status), paginationParam.skipPage, paginationParam.pageLimit, search);
        }
        else {
            allRecords = await (0, adminKycService_1.kycListWithoutPagination)(parseInt(status), search);
        }
    }
    catch (error) {
        return (0, response_1.sendErrorResponse)(res, 400, error.message);
    }
};
exports.list = list;
