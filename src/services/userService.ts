import mongoose from "mongoose";
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

export const getAssignment = async (user_id: string, className: string, assigned_on: string) => {

    try {

         const filter: any = {
            is_deleted: 0,
            class: className,
            $or: [
                { assigned_type: 'ALL' },
                {
                    assigned_type: 'INDIVIDUAL',
                    assigned_to: new mongoose.Types.ObjectId(user_id)
                }
            ]
        };

        if (assigned_on) {
            const start = new Date(assigned_on);
            start.setHours(0, 0, 0, 0);

            const end = new Date(assigned_on);
            end.setHours(23, 59, 59, 999);

            filter.assigned_on = {
                $gte: start,
                $lte: end
            };
        }

        const assignedWork = await AssignmentSchema
            .find(filter)
            .populate('assigned_by', 'name email')
            .sort({ assigned_on: -1 });

        return assignedWork;
    } catch (error: any) {
        throw new Error(error.message);
    }
}