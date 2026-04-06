import { PipelineStage } from 'mongoose';
import KycSchema from '../../schema/kycSchema';

export const isKycExist = async (id: string) => {

    try {

        const exist = await KycSchema.findById(id);
        return exist;
    } catch (error: any) {
        throw new Error(error.message);
    }
}

export const updateKYC = async (id: string, status: number) => {

    try {

        const update = await KycSchema.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );
        return update;
    } catch (error: any) {
        throw new Error(error.message);
    }
}

export const kycListWithPagination = async (
    status: number,
    skipPage: number,
    pageLimit: number,
    search: string
) => {

    try {

        const pipeline:  PipelineStage[] = [
            {
                $match: {
                    status,
                    is_deleted: 0
                }
            },
            {
                $lookup: {
                    from: 'user',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            { $unwind: '$user' }
        ]

        if (search && search.trim() !== '') {
            pipeline.push({
                $match: {
                   "user.name": { $regex: search, $options: 'i'} 
                }
            });
        }
        const list = await KycSchema
            .aggregate(pipeline)
            .skip(skipPage)
            .limit(pageLimit);

        return list;

    } catch (error: any) {
        throw new Error(error.message);
    }
}

export const kycListWithoutPagination = async (status: number, search: string) => {

    try {

        const pipeline: PipelineStage[] = [
            {
                $match: {
                    status,
                    is_deleted: 0
                },
            },
            {
                $lookup: {
                    from: 'user',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $unwind: '$user'
            }
        ]

        if (search && search.trim()) {
            pipeline.push({
                $match: {
                    'user.name': { $regex: search, $options: 'i' }
                }
            });
        }

        return await KycSchema.aggregate(pipeline);

    } catch (error: any) {
        throw new Error(error.message);
    }
}
