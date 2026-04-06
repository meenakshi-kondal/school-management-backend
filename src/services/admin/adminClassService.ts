import ClassModel from "../../schema/classSchema";

export const findClassByName = async (class_name: string) => {

    try {
        const exist = await ClassModel.findOne({
            class_name: { $regex: new RegExp(`^${class_name}$`, "i") }
        });
        return exist;
    } catch (error: any) {
        throw new Error(error.message);
    }
}

export const createClass = async (class_name: string, subjects: string[]) => {

    try {
        const newClass = new ClassModel({
            class_name,
            subjects
        });

        await newClass.save();
        return newClass;
    } catch (error: any) {
        throw new Error(error.message);
    }
}

export const getAllClasses = async () => {

    try {
        const classes = await ClassModel.find().sort({ class_name: 1 });
        return classes;
    } catch (error: any) {
        throw new Error(error.message);
    }
}

export const getExistingClass = async (id: string, class_name: string) => {

    try {
        const exist = await ClassModel.findOne({
            _id: { $ne: id },
            class_name: { $regex: new RegExp(`^${class_name}$`, "i") }
        });
        return exist;
    } catch (error: any) {
        throw new Error(error.message);
    }
}

export const updateClassById = async (id: string, class_name: string, subjects: string[]) => {

    try {
        const update = await ClassModel.findByIdAndUpdate(
            id,
            { class_name, subjects },
            { new: true }
        );
        return update;
    } catch (error: any) {
        throw new Error(error.message);
    }
}