import { notify } from "./enum";

export const getPagination = (page:string, limit: string) => {

	let skipPage = parseInt(page);
	let pageLimit = parseInt(limit);

	skipPage = (skipPage - 1) * pageLimit;

	return { skipPage, pageLimit}; 
}