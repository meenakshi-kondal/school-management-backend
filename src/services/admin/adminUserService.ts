import mongoose from 'mongoose';
import StudentModel from '../../schema/studentSchema';
import TeacherModel from '../../schema/teacherSchema';
import UserModel from '../../schema/userSchema';
import GuardianModel from '../../schema/guardianSchema';
import DocumentModel from '../../schema/documentSchema';

export const getUsersCount = async() => {

    try {
        const studentCount = await StudentModel.countDocuments({ status: 'enable', is_deleted: 0 });
        const teacherCount = await TeacherModel.countDocuments({ status: 'enable', is_deleted: 0 });
        
        return [
            { _id: 'student', total: studentCount },
            { _id: 'teacher', total: teacherCount },
        ];

    } catch (error: any) {
        throw new Error(error.message);
    }
}

export const getAllUsersCount = async() => {

    try {
        const studentCount = await StudentModel.countDocuments();
        const teacherCount = await TeacherModel.countDocuments();
    
        return [
            { _id: 'student', total: studentCount },
            { _id: 'teacher', total: teacherCount }
        ];

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
            is_deleted: 0
        };

        if (className) {
            filter['class_id'] = className;
        }

        if (gender) {
            filter['gender'] = { $regex: new RegExp(`^${gender}$`, 'i') };
        }

        if (search && search.trim() !== '') {
            const searchRegex = { $regex: search, $options: 'i' };
            const orConditions: any[] = [
                { name: searchRegex }
            ];

            // If search is numeric, check roll_number
            if (!isNaN(Number(search))) {
                orConditions.push({ roll_number: Number(search) });
            }

            filter.$or = orConditions;
        }

        const list = await StudentModel.find(filter)
            .populate({ path: 'userId', select: 'email' })
            .populate({ path: 'guardian_id' })
            .populate({ path: 'class_id', select: 'class_name' })
            .skip(skipPage)
            .limit(pageLimit)
            .sort({ roll_number: 1 });

        const total = await StudentModel.countDocuments(filter);
        
        // Get gender counts for the filtered class (ignoring pagination)
        const countsFilter = { ...filter };
        const genderCounts = await StudentModel.aggregate([
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
            is_deleted: 0
        };

        if (className) {
            filter['class_id'] = className;
        }

        if (gender) {
            filter['gender'] = { $regex: new RegExp(`^${gender}$`, 'i') };
        }

        if (search && search.trim() !== '') {
            const searchRegex = { $regex: search, $options: 'i' };
            const orConditions: any[] = [
                { name: searchRegex }
            ];
            
            if (!isNaN(Number(search))) {
                orConditions.push({ roll_number: Number(search) });
            }
            
            filter.$or = orConditions;
        }

        const list = await StudentModel.find(filter)
            .populate({ path: 'userId', select: 'email' })
            .populate({ path: 'guardian_id' })
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
        const filter: any = {
            status: 'enable',
            is_deleted: 0
        };

        if (search && search.trim() !== '') {
            const searchRegex = { $regex: search, $options: 'i' };
            filter.$or = [
                { name: searchRegex }
            ];
        }

        const list = await TeacherModel.find(filter)
            .populate({ path: 'userId', select: 'email' })
            .skip(skipPage)
            .limit(pageLimit);
        
        const total = await TeacherModel.countDocuments(filter);
        return { list, total };

    } catch (error: any) {
        throw new Error(error.message);
    }
}

export const teachersListWithoutPagination = async(search: string) => {

    try {
        const filter: any = {
            status: 'enable',
            is_deleted: 0
        };

        if (search && search.trim() !== '') {
            const searchRegex = { $regex: search, $options: 'i' };
            filter.$or = [
                { name: searchRegex }
            ];
        }

        const list = await TeacherModel.find(filter)
            .populate({ path: 'userId', select: 'email' });
        return list;

    } catch (error: any) {
        throw new Error(error.message);
    }
}

export const userDetails = async(id: string) => {

    try {
        const userId = new mongoose.Types.ObjectId(id);
        
        // Try student profile first
        let details = await StudentModel.aggregate([
            { $match: { userId: userId } },
            { $lookup: { from: 'users', localField: 'userId', foreignField: '_id', as: 'userInfo' } },
            { $unwind: { path: '$userInfo', preserveNullAndEmptyArrays: true } },
            { $lookup: { from: 'guardians', localField: 'guardian_id', foreignField: '_id', as: 'guardianInfo' } },
            { $unwind: { path: '$guardianInfo', preserveNullAndEmptyArrays: true } },
            { $lookup: { from: 'documents', localField: 'userId', foreignField: 'userId', as: 'documents' } },
            { $lookup: { from: 'classes', localField: 'class_id', foreignField: '_id', as: 'class_info' } },
            { $unwind: { path: '$class_info', preserveNullAndEmptyArrays: true } },
            { $project: { 'userInfo.password': 0 } }
        ]);

        if (details.length === 0) {
            // Try teacher profile
            details = await TeacherModel.aggregate([
                { $match: { userId: userId } },
                { $lookup: { from: 'users', localField: 'userId', foreignField: '_id', as: 'userInfo' } },
                { $unwind: { path: '$userInfo', preserveNullAndEmptyArrays: true } },
                { $lookup: { from: 'documents', localField: 'userId', foreignField: 'userId', as: 'documents' } },
                { $project: { 'userInfo.password': 0 } }
            ]);
        }

        return details;

    } catch (error: any) {
        throw new Error(error.message);
    }
}

export const getStudentById = async (id: string) => {
    try {
        const student = await StudentModel.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(id) } },
            { $lookup: { from: 'users', localField: 'userId', foreignField: '_id', as: 'userInfo' } },
            { $unwind: { path: '$userInfo', preserveNullAndEmptyArrays: true } },
            { $lookup: { from: 'guardians', localField: 'guardian_id', foreignField: '_id', as: 'guardianInfo' } },
            { $unwind: { path: '$guardianInfo', preserveNullAndEmptyArrays: true } },
            { $lookup: { from: 'documents', localField: 'userId', foreignField: 'userId', as: 'documents' } },
            {
                $lookup: {
                    from: 'classes',
                    localField: 'class_id',
                    foreignField: '_id',
                    as: 'class_info'
                }
            },
            { $unwind: { path: '$class_info', preserveNullAndEmptyArrays: true } },
            { $project: { 'userInfo.password': 0 } }
        ]);
        return student.length > 0 ? student[0] : null;
    } catch (error: any) {
        throw new Error(error.message);
    }
}