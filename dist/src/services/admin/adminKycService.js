"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.kycListWithoutPagination = exports.kycListWithPagination = exports.updateKYC = exports.isKycExist = void 0;
const kycSchema_1 = __importDefault(require("../../schema/kycSchema"));
const isKycExist = async (id) => {
    try {
        const exist = await kycSchema_1.default.findById(id);
        return exist;
    }
    catch (error) {
        throw new Error(error.message);
    }
};
exports.isKycExist = isKycExist;
const updateKYC = async (id, status) => {
    try {
        const update = await kycSchema_1.default.findByIdAndUpdate(id, { status }, { new: true });
        return update;
    }
    catch (error) {
        throw new Error(error.message);
    }
};
exports.updateKYC = updateKYC;
const kycListWithPagination = async (status, skipPage, pageLimit, search) => {
    try {
        const pipeline = [
            {
                $match: {
                    status,
                    is_deleted: 0
                }
            },
            {
                $lookup: {
                    from: 'user',
                    localField: 'user_id',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            { $unwind: '$user' }
        ];
        if (search && search.trim() !== '') {
            pipeline.push({
                $match: {
                    "user.name": { $regex: search, $options: 'i' }
                }
            });
        }
        const list = await kycSchema_1.default
            .aggregate(pipeline)
            .skip(skipPage)
            .limit(pageLimit);
        return list;
    }
    catch (error) {
        throw new Error(error.message);
    }
};
exports.kycListWithPagination = kycListWithPagination;
const kycListWithoutPagination = async (status, search) => {
    try {
        const pipeline = [
            {
                $match: {
                    status,
                    is_deleted: 0
                },
            },
            {
                $lookup: {
                    from: 'user',
                    localField: 'user_id',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $unwind: '$user'
            }
        ];
        if (search && search.trim()) {
            pipeline.push({
                $match: {
                    'user.name': { $regex: search, $options: 'i' }
                }
            });
        }
        return await kycSchema_1.default.aggregate(pipeline);
    }
    catch (error) {
        throw new Error(error.message);
    }
};
exports.kycListWithoutPagination = kycListWithoutPagination;
