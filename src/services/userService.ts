import { ASSIGNMENT } from "../interfaces/auth";
import AssignmentSchema from "../schema/assignmentSchema";
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

        const assign = new AssignmentSchema(payload);
        return await assign.save();
    } catch (error: any) {
        throw new Error(error.message);
    }
}

export const workAlreadyAssigned = async (classId: string, assigned_on: Date, assigned_by: string) => {

    try {

        const assignedWork = await AssignmentSchema.find({class: classId, assigned_on, assigned_by});
        return assignedWork;
    } catch (error: any) {
        throw new Error(error.message);
    }
}