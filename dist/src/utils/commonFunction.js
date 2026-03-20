"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPagination = void 0;
const getPagination = (page, limit) => {
    let skipPage = parseInt(page);
    let pageLimit = parseInt(limit);
    skipPage = (skipPage - 1) * pageLimit;
    return { skipPage, pageLimit };
};
exports.getPagination = getPagination;
