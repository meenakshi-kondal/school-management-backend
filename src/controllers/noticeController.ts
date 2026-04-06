import { Request, Response } from "express";
import { sendErrorResponse, sendSuccessResponse } from "../utils/response";
import { notify } from "../utils/enum";
import { createNotice, getNoticesWithoutPagination, getNoticesWithPagination, removeNotice, updateNotice } from "../services/noticeService";
import { getPagination } from "../utils/commonFunction";

export const addNotice = async (req: Request, res: Response) => {
	try {
		const { title, description } = req.body;
		const userId = (req as any).user?._id;

		if (!title) {
			return sendErrorResponse(res, 400, notify.NOTICE_TITLE_REQUIRED);
		}

		await createNotice(title, description, userId);


		return sendSuccessResponse(res, 201, notify.NOTICE_ADDED, {});

	} catch (error: any) {
		return sendErrorResponse(res, 500, error.message);
	}
};

export const noticeList = async (req: Request, res: Response) => {

	try {

		const { pagination, page, limit, search } = req.query as any;

		let notices;
		if (pagination === 'true' || pagination === true) {

			if (!page || !limit) {
				return sendErrorResponse(res, 404, notify.PAGINATION);
			}

			const paginationParam = getPagination(page as string, limit as string);

			notices = await getNoticesWithPagination(
				search,
				paginationParam.skipPage,
				paginationParam.pageLimit
			);
		} else {

			notices = await getNoticesWithoutPagination(search);
		}

		return sendSuccessResponse(res, 200, notify.NOTICE_FETCH, notices);
	} catch (error: any) {
		return sendErrorResponse(res, 500, error.message);
	}
};

export const deleteNotice = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const notice = await removeNotice(id);

		if (!notice) {
			return sendErrorResponse(res, 404, notify.NOTICE_NOT_FOUND);
		}

		return sendSuccessResponse(res, 200, notify.NOTICE_DELETED, notice);
	} catch (error: any) {
		return sendErrorResponse(res, 500, error.message);
	}
};

export const markNoticeAsRead = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const userId = (req as any).user?._id;

		await updateNotice(id, userId);

		return sendSuccessResponse(res, 200, notify.NOTICE_MARKED, {});
	} catch (error: any) {
		return sendErrorResponse(res, 500, error.message);
	}
};

