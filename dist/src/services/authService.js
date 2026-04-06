"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePasswordById = exports.updatePassword = exports.isCredentialsExist = exports.saveToken = exports.getUserRoleName = exports.getUserProfile = exports.isUser = exports.isUserExist = exports.saveUser = void 0;
const tokenSchema_1 = __importDefault(require("../schema/tokenSchema"));
const userSchema_1 = __importDefault(require("../schema/userSchema"));
const roleSchema_1 = __importDefault(require("../schema/roleSchema"));
const userRoleSchema_1 = __importDefault(require("../schema/userRoleSchema"));
const studentSchema_1 = __importDefault(require("../schema/studentSchema"));
const teacherSchema_1 = __importDefault(require("../schema/teacherSchema"));
const guardianSchema_1 = __importDefault(require("../schema/guardianSchema"));
const documentSchema_1 = __importDefault(require("../schema/documentSchema"));
/**
 * This service is used to
 * Save user credentials.
 * Saves user details
 * Assigns user roles
 * Stores guardian details
 * Saves document details
 */
const saveUser = async (data) => {
    try {
        /* Save user credentials */
        const user = new userSchema_1.default({
            email: data.email,
            password: data.password
        });
        const savedUser = await user.save();
        /* Check user role */
        const role = await roleSchema_1.default.findOne({ name: data.role });
        if (!role) {
            throw new Error(`Role '${data.role}' not found. Please seed roles first.`);
        }
        /* Save user role */
        const userRole = new userRoleSchema_1.default({
            userId: savedUser._id,
            role_id: role._id
        });
        await userRole.save();
        if (data.role === 'student') {
            // Guardian details
            let guardian_id = [];
            if (data.guardian && data.guardian.length > 0) {
                for (const guardian of data.guardian) {
                    const savedGuardian = await guardianSchema_1.default.create(guardian);
                    guardian_id.push(savedGuardian._id);
                }
            }
            // User Photo
            let photo_id = null;
            if (data.photo) {
                const photo = new documentSchema_1.default({ ...data.photo });
                const savedPhoto = await photo.save();
                photo_id = savedPhoto._id;
            }
            // User documents
            let documents_ids = [];
            if (data.documents && data.documents.length > 0) {
                for (const doc of data.documents) {
                    const document = new documentSchema_1.default({ ...doc });
                    const savedDocument = await document.save();
                    documents_ids.push(savedDocument._id);
                }
            }
            // Auto-generate roll number
            const lastStudent = await studentSchema_1.default.findOne({
                class_id: data.class_id
            }).sort({ roll_number: -1 });
            const roll_number = lastStudent && lastStudent.roll_number ? lastStudent.roll_number + 1 : 1;
            const student = new studentSchema_1.default({
                userId: savedUser._id,
                name: data.name,
                date_of_birth: data.date_of_birth,
                gender: data.gender,
                blood_group: data.blood_group,
                phone: data.phone,
                photo: photo_id,
                guardian_id,
                documents: documents_ids,
                class_id: data.class_id,
                admission_on: data.admission_on || data.joining_date,
                roll_number,
                is_bus_service: data.is_bus_service || false
            });
            await student.save();
            // Save student documents if provided
            if (data.documents && data.documents.length > 0) {
                const docs = data.documents.map((doc) => ({
                    userId: savedUser._id,
                    document_type: doc.document_type,
                    document_name: doc.document_name,
                    file_url: doc.file_url
                }));
                await documentSchema_1.default.insertMany(docs);
            }
        }
        else if (data.role === 'teacher') {
            // Guardian details
            let guardian_id = [];
            if (data.guardian && data.guardian.length > 0) {
                for (const guardian of data.guardian) {
                    const savedGuardian = await guardianSchema_1.default.create(guardian);
                    guardian_id.push(savedGuardian._id);
                }
            }
            // User Photo
            let photo_id = null;
            if (data.photo) {
                const photo = new documentSchema_1.default({ ...data.photo });
                const savedPhoto = await photo.save();
                photo_id = savedPhoto._id;
            }
            // User documents
            let documents_ids = [];
            if (data.documents && data.documents.length > 0) {
                for (const doc of data.documents) {
                    const document = new documentSchema_1.default({ ...doc });
                    const savedDocument = await document.save();
                    documents_ids.push(savedDocument._id);
                }
            }
            const teacher = new teacherSchema_1.default({
                userId: savedUser._id,
                name: data.name,
                date_of_birth: data.date_of_birth,
                gender: data.gender,
                blood_group: data.blood_group,
                phone: data.phone,
                photo: data.photo,
                joining_date: data.joining_date,
                experience: data.experience || 0,
                class: data.class,
                highest_qualification: data.highest_qualification
            });
            await teacher.save();
        }
        return savedUser;
    }
    catch (error) {
        throw new Error(error.message);
    }
};
exports.saveUser = saveUser;
// Check if a user exists by email (searches the users collection)
const isUserExist = async (email, role) => {
    try {
        const user = await userSchema_1.default.findOne({ email, is_deleted: 0 });
        if (!user)
            return null;
        // If role is specified, check if user has that role
        if (role) {
            const roleDoc = await roleSchema_1.default.findOne({ name: role });
            if (!roleDoc)
                return null;
            const userRole = await userRoleSchema_1.default.findOne({
                userId: user._id,
                role_id: roleDoc._id,
                is_deleted: 0
            });
            if (!userRole)
                return null;
        }
        // Attach profile info (name) for response
        const profile = await (0, exports.getUserProfile)(user._id.toString());
        return {
            _id: user._id,
            email: user.email,
            password: user.password,
            name: profile?.name || 'Admin',
            role: role || (await (0, exports.getUserRoleName)(user._id.toString()))
        };
    }
    catch (error) {
        throw new Error(error.message);
    }
};
exports.isUserExist = isUserExist;
// Get user by ID
const isUser = async (id) => {
    try {
        const user = await userSchema_1.default.findById(id).select('-password');
        if (!user)
            return null;
        const profile = await (0, exports.getUserProfile)(id);
        const roleName = await (0, exports.getUserRoleName)(id);
        return {
            _id: user._id,
            email: user.email,
            name: profile?.name || 'Admin',
            role: roleName,
            ...profile
        };
    }
    catch (error) {
        throw new Error(error.message);
    }
};
exports.isUser = isUser;
// Helper: Get user profile from student or teacher collection
const getUserProfile = async (userId) => {
    try {
        const student = await studentSchema_1.default.findOne({ userId: userId, is_deleted: 0 }).lean();
        if (student)
            return { ...student, role: 'student' };
        const teacher = await teacherSchema_1.default.findOne({ userId: userId, is_deleted: 0 }).lean();
        if (teacher)
            return { ...teacher, role: 'teacher' };
        return null; // Admin has no profile table
    }
    catch (error) {
        throw new Error(error.message);
    }
};
exports.getUserProfile = getUserProfile;
// Helper: Get the role name for a user
const getUserRoleName = async (userId) => {
    try {
        const userRole = await userRoleSchema_1.default.findOne({ userId: userId, is_deleted: 0 })
            .populate('role_id');
        if (userRole && userRole.role_id) {
            return userRole.role_id.name;
        }
        return null;
    }
    catch (error) {
        throw new Error(error.message);
    }
};
exports.getUserRoleName = getUserRoleName;
const saveToken = async (data) => {
    try {
        const token = new tokenSchema_1.default(data);
        return await token.save();
    }
    catch (error) {
        throw new Error(error.message);
    }
};
exports.saveToken = saveToken;
const isCredentialsExist = async (password, role) => {
    try {
        const exist = await userSchema_1.default.findOne({ password });
        return exist;
    }
    catch (error) {
        console.log(error);
        throw new Error(error.message);
    }
};
exports.isCredentialsExist = isCredentialsExist;
const updatePassword = async (data) => {
    try {
        const result = await userSchema_1.default.findOneAndUpdate({ email: data.email }, { password: data.password }, { new: true });
        return result;
    }
    catch (error) {
        throw new Error(error.message);
    }
};
exports.updatePassword = updatePassword;
const updatePasswordById = async (data) => {
    try {
        const result = await userSchema_1.default.findOneAndUpdate({ _id: data.id }, { password: data.password }, { new: true });
        return result;
    }
    catch (error) {
        throw new Error(error.message);
    }
};
exports.updatePasswordById = updatePasswordById;
