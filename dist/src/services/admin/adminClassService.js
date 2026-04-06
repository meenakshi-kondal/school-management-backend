"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateClassById = exports.getExistingClass = exports.getAllClasses = exports.createClass = exports.findClassByName = void 0;
const classSchema_1 = __importDefault(require("../../schema/classSchema"));
const findClassByName = async (class_name) => {
    try {
        const exist = await classSchema_1.default.findOne({
            class_name: { $regex: new RegExp(`^${class_name}$`, "i") }
        });
        return exist;
    }
    catch (error) {
        throw new Error(error.message);
    }
};
exports.findClassByName = findClassByName;
const createClass = async (class_name, subjects) => {
    try {
        const newClass = new classSchema_1.default({
            class_name,
            subjects
        });
        await newClass.save();
        return newClass;
    }
    catch (error) {
        throw new Error(error.message);
    }
};
exports.createClass = createClass;
const getAllClasses = async () => {
    try {
        const classes = await classSchema_1.default.find().sort({ class_name: 1 });
        return classes;
    }
    catch (error) {
        throw new Error(error.message);
    }
};
exports.getAllClasses = getAllClasses;
const getExistingClass = async (id, class_name) => {
    try {
        const exist = await classSchema_1.default.findOne({
            _id: { $ne: id },
            class_name: { $regex: new RegExp(`^${class_name}$`, "i") }
        });
        return exist;
    }
    catch (error) {
        throw new Error(error.message);
    }
};
exports.getExistingClass = getExistingClass;
const updateClassById = async (id, class_name, subjects) => {
    try {
        const update = await classSchema_1.default.findByIdAndUpdate(id, { class_name, subjects }, { new: true });
        return update;
    }
    catch (error) {
        throw new Error(error.message);
    }
};
exports.updateClassById = updateClassById;
