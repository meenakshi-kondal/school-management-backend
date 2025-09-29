import { LOGIN, TOKEN } from "../interfaces/auth";
import TokenSchema from "../schema/tokenSchema";
import UserSchema from "../schema/userSchema";


export const saveUser = async (data: any) => {
    try {
        const user = new UserSchema(data);
        return await user.save();
    } catch (error: any) {
        return error.message;
    }
};

export const isCredentialsExist = async (password: string) => {
    try {
        const exist = await UserSchema.findOne({ password });
        return exist;
    } catch (error: any) {
        console.log(error)
        return error.message;
    }
};

export const isUserExist = async (email: string) => {
    try {
        const exist = await UserSchema.findOne({
            email
        });
        return exist;
    } catch (error: any) {
        return error.message;
    }
}

export const isUser = async (id: string) => {
    try {
        const exist = await UserSchema.findById(id);
        return exist;
    } catch (error: any) {
        return error.message;
    }
}

export const saveToken = async (data: TOKEN) => {
    try {
        const token = new TokenSchema(data);
        return await token.save();
    } catch (error: any) {
        return error.message;
    }
}

export const updatePassword = async (data: LOGIN) => {
    try {
        const result = await UserSchema.findOneAndUpdate(
            { email: data.email },
            { password: data.password },
            { new: true });
        return result;
    } catch (error: any) {
        return error.message;
    }
}

export const updatePasswordById = async (data: LOGIN) => {
    try {
        const result = await UserSchema.findOneAndUpdate(
            { id: data.id },
            { password: data.password },
            { new: true });
        return result;
    } catch (error: any) {
        return error.message;
    }
}


