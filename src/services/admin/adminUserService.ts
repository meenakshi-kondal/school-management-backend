import mongoose from 'mongoose';
import UserSchema from '../../schema/userSchema';

export const getUsersCount = async() => {

    try {

        const counts = await UserSchema.aggregate([
            { $match: { status: 'enable', is_deleted: 0 } },
            { $group: { _id: '$type',total: { $sum: 1 }} }
        ]);
        return counts;

    } catch (error: any) {
        throw new Error(error.message);
    }
}

export const getAllUsersCount = async() => {

    try {

        const counts = await UserSchema.aggregate([
            {
                $group: { _id: '$type',total: { $sum: 1 }}
            }
        ]);
        return counts;

    } catch (error: any) {
        throw new Error(error.message);
    }
}

export const studentsListWithPagination = async(
    className: string,
    skipPage: number,
    pageLimit: number,
    search: string
) => {

    try {

        let subquery = UserSchema.find({
            staus: 'enable',
            is_deleted:0,
            class: className,
            type: 'user'
        });

        if(search && search.trim() !== '') {
            subquery = UserSchema.find({
                $or:[
                    { email: {$regex: search, $options: 'i' } },
                    { name: {$regex: search, $options: 'i' } },
                ]
            })
        }
        const list = await subquery.select('-password')
        .skip(skipPage)
        .limit(pageLimit)
        return list;

    } catch (error: any) {
        throw new Error(error.message);
    }
}

export const studentsListWithoutPagination = async(className: string, search: string) => {

    try {

        let subquery = UserSchema.find({
            status: 'enable',
            is_deleted: 0,
            class: className,
            type: 'user'
        });

        if(search && search.trim() !== '') {

            subquery = UserSchema.find({
                $or: [
                    { email: { $regex: search, $options: 'i'}},
                    { name: { $regex: search, $options: 'i'}},
                ]
            })

        }
        const list = await subquery.select('-password')
        return list;

    } catch (error: any) {
        throw new Error(error.message);
    }
}

export const teachersListWithPagination = async(
    search: string,
    skipPage: number,
    pageLimit: number
) => {

    try {
        
        let subquery = UserSchema.find({
            type: 'teacher',
            status: 'enable',
            is_deleted: 0
        });

        if(search && search.trim() !== '') {

            subquery = UserSchema.find({
                $or:[
                    { name: { $regex: search, $options: 'i'} },
                    { class: { $regex: search, $options: 'i'} },
                ]
            })
        }

        const list = await subquery.select('-password').skip(skipPage).limit(pageLimit);
        return list;

    } catch (error: any) {
        throw new Error(error.message);
    }
}

export const teachersListWithoutPagination = async(search: string) => {

    try {
        
        let subquery = UserSchema.find({
            type: 'teacher',
            status: 'enable',
            is_deleted: 0
        });

        if(search && search.trim() !== '') {

            subquery = UserSchema.find({
                $or:[
                    { name: { $regex: search, $options: 'i'} },
                    { class: { $regex: search, $options: 'i'} },
                ]
            })
        }

        const list = await subquery.select('-password');
        return list;

    } catch (error: any) {
        throw new Error(error.message);
    }
}

export const userDetails = async(id: string) => {

    try {

        const user_id = new mongoose.Types.ObjectId(id);
        const details = await UserSchema.aggregate([
            {
                $match: {_id: user_id}
            },
            {
                $lookup: {
                    from: 'kycs',
                    localField: '_id',
                    foreignField: 'user_id',
                    as: 'kycDetails'
                }
            },
            {
                $unwind: {
                    path: "$kyc_details",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    password: 0
                }
            }
        ]);

        return details;

    } catch (error: any) {
        throw new Error(error.message);
    }
}