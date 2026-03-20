import { LOGIN, TOKEN } from "../interfaces/auth";
import TokenSchema from "../schema/tokenSchema";
import UserSchema from "../schema/userSchema";
import StudentModel from "../schema/studentSchema";
import TeacherModel from "../schema/teacherSchema";


export const saveUser = async(data: any) => {

    try {
        let user;
        if (data.role === 'student') {
            const classId = data.class_id;
            
            if (!classId) {
                throw new Error("Class ID is required for student admission");
            }

            // Find the highest roll number for this specific class
            const lastStudent = await (StudentModel as any).findOne({
                class_id: classId,
                role: 'student'
            }).sort({ roll_number: -1 });

            data.roll_number = lastStudent && lastStudent.roll_number ? lastStudent.roll_number + 1 : 1;

            user = new StudentModel(data);
        } else if (data.role === 'teacher') {
            user = new TeacherModel(data);
        } else {
            user = new UserSchema(data);
        }
        return await user.save();
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export const isCredentialsExist = async(password: string) => {

    try {
        // With discriminators, all are in 'users' collection
        const exist = await UserSchema.findOne({ password });
        return exist;
    } catch (error: any) {
        console.log(error)
        throw new Error(error.message);
    }
};

export const isUserExist = async(email: string) => {

    try {
        // Searching UserSchema will find students, teachers, and admins
        const exist = await UserSchema.findOne({ email });
        return exist;
    } catch (error: any) {
        throw new Error(error.message);
    }
}

export const isUser = async(id: string) => {

    try {
        const exist = await UserSchema.findById(id).select('-password');
        return exist;
    } catch (error: any) {
        throw new Error(error.message);
    }
}

export const saveToken = async(data: TOKEN) => {

    try {

        const token = new TokenSchema(data);
        return await token.save();
    } catch (error: any) {
        throw new Error(error.message);
    }
}

export const updatePassword = async(data: LOGIN) => {

    try {
        const result = await UserSchema.findOneAndUpdate(
            { email: data.email },
            { password: data.password },
            { new: true });
        return result;
    } catch (error: any) {
        throw new Error(error.message);
    }
}

export const updatePasswordById = async(data: LOGIN) => {

    try {
        const result = await UserSchema.findOneAndUpdate(
            { _id: data.id },
            { password: data.password },
            { new: true });
        return result;
    } catch (error: any) {
        throw new Error(error.message);
    }
}


