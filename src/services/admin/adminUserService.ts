import mongoose from 'mongoose';
import UserSchema from '../../schema/userSchema';
import StudentModel from '../../schema/studentSchema';

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
    search: string,
    status: string,
    gender: string
) => {

    try {
        const filter: any = {
            status: 'enable',
            is_deleted: 0,
            role: 'student'
        };

        if (className) {
            filter['class_id'] = className;
        }

        if (status) {
            filter['attendance_status'] = status;
        }

        if (gender) {
            filter['gender'] = { $regex: new RegExp(`^${gender}$`, 'i') };
        }

        if (search && search.trim() !== '') {
            const searchRegex = { $regex: search, $options: 'i' };
            const orConditions: any[] = [
                { email: searchRegex },
                { name: searchRegex }
            ];

            // If search is numeric, check roll_number
            if (!isNaN(Number(search))) {
                orConditions.push({ roll_number: Number(search) });
            }

            filter.$or = orConditions;
        }

        const list = await UserSchema.find(filter)
            .select('-password')
            .skip(skipPage)
            .limit(pageLimit)
            .sort({ roll_number: 1 }); // Sorting by roll number makes more sense now

        const total = await UserSchema.countDocuments(filter);
        
        // Get gender counts for the filtered class (ignoring pagination)
        const countsFilter = { ...filter };
        const genderCounts = await UserSchema.aggregate([
            { $match: countsFilter },
            { $group: { _id: '$gender', count: { $sum: 1 } } }
        ]);

        const stats = {
            total,
            boys: genderCounts.find(g => g._id === 'male' || g._id === 'Male')?.count || 0,
            girls: genderCounts.find(g => g._id === 'female' || g._id === 'Female')?.count || 0
        };

        return { list, total, stats };

    } catch (error: any) {
        throw new Error(error.message);
    }
}

export const studentsListWithoutPagination = async(className: string, search: string, status: string, gender: string) => {

    try {
        const filter: any = {
            status: 'enable',
            is_deleted: 0,
            role: 'student'
        };

        if (className) {
            filter['class_id'] = className;
        }

        if (status) {
            filter['attendance_status'] = status;
        }

        if (gender) {
            filter['gender'] = { $regex: new RegExp(`^${gender}$`, 'i') };
        }

        if (search && search.trim() !== '') {
            const searchRegex = { $regex: search, $options: 'i' };
            const orConditions: any[] = [
                { email: searchRegex },
                { name: searchRegex }
            ];
            
            if (!isNaN(Number(search))) {
                orConditions.push({ roll_number: Number(search) });
            }
            
            filter.$or = orConditions;
        }

        const list = await UserSchema.find(filter)
            .select('-password')
            .sort({ roll_number: 1 });

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

export const getStudentById = async (id: string) => {
    try {
        const student = await (StudentModel as any).aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(id) } },
            {
                $addFields: {
                    classObjId: { 
                        $cond: {
                            if: { $ne: ["$class_id", null] },
                            then: { $toObjectId: "$class_id" },
                            else: null
                        }
                    }
                }
            },
            {
                $lookup: {
                    from: 'classes',
                    localField: 'classObjId',
                    foreignField: '_id',
                    as: 'class_info'
                }
            },
            { $unwind: { path: '$class_info', preserveNullAndEmptyArrays: true } }
        ]);
        return student.length > 0 ? student[0] : null;
    } catch (error: any) {
        throw new Error(error.message);
    }
}