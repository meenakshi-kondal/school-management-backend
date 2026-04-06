import NoticeModel from "../schema/noticeSchema";

export const createNotice = async (title: string, description: string, userId: string) => {
	try {
		const newNotice = new NoticeModel({
			title,
			description,
			userId
		});

		await newNotice.save();
		return newNotice;
	} catch (error: any) {
		throw new Error(error.message);
	}
}

export const getNoticesWithPagination = async (
	search: string,
	skipPage: number,
	pageLimit: number
) => {

	try {
		const filter: any = {
			is_deleted: 0
		};

		if (search && search.trim() !== '') {
			const searchRegex = { $regex: search, $options: 'i' };
			filter.$or = [
				{ title: searchRegex },
				{ description: searchRegex }
			];
		}

		const list = await NoticeModel.find(filter)
			.skip(skipPage)
			.limit(pageLimit);

		const total = await NoticeModel.countDocuments(filter);
		return { list, total };
	} catch (error: any) {
		throw new Error(error.message);
	}
}

export const getNoticesWithoutPagination = async (search: string) => {

	try {
		const filter: any = {
			is_deleted: 0
		};

		if (search && search.trim() !== '') {
			const searchRegex = { $regex: search, $options: 'i' };
			filter.$or = [
				{ name: searchRegex }
			];
		}

		const list = await NoticeModel.find(filter);
		return list;

	} catch (error: any) {
		throw new Error(error.message);
	}
}



export const removeNotice = async (id: string) => {
	try {
		const notice = await NoticeModel.findByIdAndUpdate(id, { is_deleted: 1 });
		return notice;
	} catch (error: any) {
		throw new Error(error.message);
	}
}

export const updateNotice = async (id: string, userId: string) => {
	try {
		const notice = await NoticeModel.findByIdAndUpdate(
			id,
			{ $addToSet: { readBy: userId } },
			{ new: true }
		);
		return notice;
	} catch (error: any) {
		throw new Error(error.message);
	}
}
