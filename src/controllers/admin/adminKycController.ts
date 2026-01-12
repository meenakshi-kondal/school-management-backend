import {Request, Response } from "express";
import { notify } from "../../utils/enum";
import { getPagination } from "../../utils/commonFunction";
import {
    sendErrorResponse,
    sendSuccessResponse
} from "../../utils/response";
import {
    isKycExist,
    kycListWithoutPagination,
    kycListWithPagination,
    updateKYC
} from "../../services/admin/adminKycService";


export const update = async(req: Request, res: Response) => {

    try {
        
        const {status, kyc_id} = req.params;

        if(!status || !kyc_id) {
            return sendErrorResponse(res, 400, notify.KYC_PARAM_REQUIRED);
        }

        // check kyc exist or not
        const isExist = await isKycExist(kyc_id);
        if(!isExist) {
            return sendErrorResponse(res, 400, notify.NOT_EXIST);
        }

        await updateKYC(kyc_id, parseInt(status));

        return  sendSuccessResponse(res, 200, notify.KYC_UPDATE, {});

    } catch (error: any) {
        return sendErrorResponse(res, 400, error.message);
    }
}

export const list = async(req: Request, res: Response) => {

    try {
        
        const { page, limit, pagination, search, status} =  req.params;

        if(!status) {
            return sendErrorResponse(res, 400, notify.KYC_LIST_PARAM);
        }

        let allRecords;

        if(pagination) {

            if(!page || !limit) {
                return sendErrorResponse(res, 404, notify.PAGINATION);
            }

            const paginationParam = getPagination(page, limit);
            
            allRecords = await kycListWithPagination(
                parseInt(status),
                paginationParam.skipPage,
                paginationParam.pageLimit,
                search
            );
        } else {

             allRecords = await kycListWithoutPagination(
                parseInt(status),
                search
            );

        }
    } catch (error: any) {
        return sendErrorResponse(res, 400, error.message);
    }
}