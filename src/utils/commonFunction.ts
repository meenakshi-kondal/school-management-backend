import { PAGINATION } from "../interfaces/common";
import { notify } from "./enum";

export const getPagination = (page: string, limit: string) => {

    if(!page || !limit) return { message: notify.PAGINATION };

    let skipPage = parseInt(page);
    let pageLimit = parseInt(limit);

    skipPage = (skipPage - 1) * pageLimit;

    return { skipPage, pageLimit}; 
}