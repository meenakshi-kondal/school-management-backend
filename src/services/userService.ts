import { ASSIGNMENT } from "../interfaces/auth";
import UserSchema from "../schema/userSchema";

export const getUserClasses = async (id: string) => {

    try {
        const exist = await UserSchema.findById(id).select('class');
        return exist;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export const assignment = async (payload:ASSIGNMENT) => {

    try {
        const assign = new 
    } catch (error: any) {
        throw new Error(error.message);
    }
}