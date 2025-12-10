import UserSchema from '../schema/userSchema';

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

export const studentsByClass = async(type: string, className: string, skipPage: number, pageLimit: number) => {

    try {

        const list = await UserSchema.find({
            status: 'enable',
            is_deleted: 0,
            class: className,
            type
        }).select('-password')
        .skip(skipPage)
        .limit(pageLimit)
        return list;
    } catch (error: any) {
        throw new Error(error.message);
    }
}