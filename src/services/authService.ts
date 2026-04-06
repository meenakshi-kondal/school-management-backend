import { LOGIN, TOKEN } from "../interfaces/auth";
import TokenSchema from "../schema/tokenSchema";
import UserModel from "../schema/userSchema";
import RoleModel from "../schema/roleSchema";
import UserRoleModel from "../schema/userRoleSchema";
import StudentModel from "../schema/studentSchema";
import TeacherModel from "../schema/teacherSchema";
import GuardianModel from "../schema/guardianSchema";
import DocumentModel from "../schema/documentSchema";

/**
 * This service is used to
 * Save user credentials.
 * Saves user details
 * Assigns user roles
 * Saves guardian details
 * Saves document details
 */
export const saveUser = async (data: any) => {

	try {

		/* Save user credentials */
		const user = new UserModel({
			email: data.email,
			password: data.password
		});
		const savedUser = await user.save();

		/* Check user role */
		const role = await RoleModel.findOne({ name: data.role });
		if (!role) {
			throw new Error(`Role '${data.role}' not found. Please seed roles first.`);
		}

		/* Save user role */
		const userRole = new UserRoleModel({
			userId: savedUser._id,
			role_id: role._id
		});
		await userRole.save();

		if (data.role === 'student') {

			// Guardian details
			let guardian_id = [];
			if (data.guardian && data.guardian.length > 0) {
				for (const guardian of data.guardian) {
					const savedGuardian = await GuardianModel.create(guardian);
					guardian_id.push(savedGuardian._id);
				}
			}

			// User Photo
			let photo_id = null;
			if (data.photo) {
				const photo = new DocumentModel({ ...data.photo });
				const savedPhoto = await photo.save();
				photo_id = savedPhoto._id;
			}

			// User documents
			let documents_ids = [];
			if (data.documents && data.documents.length > 0) {
				for (const doc of data.documents) {
					const document = new DocumentModel({ ...doc });
					const savedDocument = await document.save();
					documents_ids.push(savedDocument._id);
				}
			}

			// Auto-generate roll number
			const lastStudent = await StudentModel.findOne({
				class_id: data.class_id
			}).sort({ roll_number: -1 });
			const roll_number = lastStudent && lastStudent.roll_number ? lastStudent.roll_number + 1 : 1;

			const student = new StudentModel({
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
				const docs = data.documents.map((doc: any) => ({
					userId: savedUser._id,
					document_type: doc.document_type,
					document_name: doc.document_name,
					file_url: doc.file_url
				}));
				await DocumentModel.insertMany(docs);
			}

		} else if (data.role === 'teacher') {

			// Guardian details
			let guardian_id = [];
			if (data.guardian && data.guardian.length > 0) {
				for (const guardian of data.guardian) {
					const savedGuardian = await GuardianModel.create(guardian);
					guardian_id.push(savedGuardian._id);
				}
			}

			// User Photo
			let photo_id = null;
			if (data.photo) {
				const photo = new DocumentModel({ ...data.photo });
				const savedPhoto = await photo.save();
				photo_id = savedPhoto._id;
			}

			// User documents
			let documents_ids = [];
			if (data.documents && data.documents.length > 0) {
				for (const doc of data.documents) {
					const document = new DocumentModel({ ...doc });
					const savedDocument = await document.save();
					documents_ids.push(savedDocument._id);
				}
			}

			const teacher = new TeacherModel({
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

	} catch (error: any) {
		throw new Error(error.message);
	}
};

// Check if a user exists by email (searches the users collection)
export const isUserExist = async (email: string, role?: string) => {

	try {
		const user = await UserModel.findOne({ email, is_deleted: 0 });
		if (!user) return null;

		// If role is specified, check if user has that role
		if (role) {
			const roleDoc = await RoleModel.findOne({ name: role });
			if (!roleDoc) return null;

			const userRole = await UserRoleModel.findOne({
				userId: user._id,
				role_id: roleDoc._id,
				is_deleted: 0
			});
			if (!userRole) return null;
		}

		// Attach profile info (name) for response
		const profile = await getUserProfile(user._id.toString());

		return {
			_id: user._id,
			email: user.email,
			password: user.password,
			name: profile?.name || 'Admin',
			role: role || (await getUserRoleName(user._id.toString()))
		};

	} catch (error: any) {
		throw new Error(error.message);
	}
}

// Get user by ID
export const isUser = async (id: string) => {

	try {
		const user = await UserModel.findById(id).select('-password');
		if (!user) return null;

		const profile = await getUserProfile(id);
		const roleName = await getUserRoleName(id);

		return {
			_id: user._id,
			email: user.email,
			name: profile?.name || 'Admin',
			role: roleName,
			...profile
		};

	} catch (error: any) {
		throw new Error(error.message);
	}
}

// Helper: Get user profile from student or teacher collection
export const getUserProfile = async (userId: string) => {
	try {
		const student = await StudentModel.findOne({ userId: userId, is_deleted: 0 }).lean();
		if (student) return { ...student, role: 'student' };

		const teacher = await TeacherModel.findOne({ userId: userId, is_deleted: 0 }).lean();
		if (teacher) return { ...teacher, role: 'teacher' };

		return null; // Admin has no profile table
	} catch (error: any) {
		throw new Error(error.message);
	}
}

// Helper: Get the role name for a user
export const getUserRoleName = async (userId: string) => {
	try {
		const userRole = await UserRoleModel.findOne({ userId: userId, is_deleted: 0 })
			.populate('role_id');

		if (userRole && userRole.role_id) {
			return (userRole.role_id as any).name;
		}
		return null;
	} catch (error: any) {
		throw new Error(error.message);
	}
}

export const saveToken = async (data: TOKEN) => {

	try {

		const token = new TokenSchema(data);
		return await token.save();
	} catch (error: any) {
		throw new Error(error.message);
	}
}

export const isCredentialsExist = async (password: string, role?: string) => {

	try {
		const exist = await UserModel.findOne({ password });
		return exist;
	} catch (error: any) {
		console.log(error)
		throw new Error(error.message);
	}
};

export const updatePassword = async (data: LOGIN) => {

	try {
		const result = await UserModel.findOneAndUpdate(
			{ email: data.email },
			{ password: data.password },
			{ new: true });
		return result;
	} catch (error: any) {
		throw new Error(error.message);
	}
}

export const updatePasswordById = async (data: LOGIN) => {

	try {
		const result = await UserModel.findOneAndUpdate(
			{ _id: data.id },
			{ password: data.password },
			{ new: true });
		return result;
	} catch (error: any) {
		throw new Error(error.message);
	}
}
