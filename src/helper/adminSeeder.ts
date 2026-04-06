import bcrypt from 'bcryptjs';
import UserModel from '../schema/userSchema';

export const seedAdmin = async () => {
	try {
		const adminEmail = 'admin@test.com';
		const adminExists = await UserModel.findOne({ email: adminEmail, role: 'admin' });

		if (!adminExists) {
			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash('Admin@11', salt);

			const adminUser = new UserModel({
				email: adminEmail,
				password: hashedPassword,
			});

			await adminUser.save();
		}
	} catch (error) {
		console.error('❌ Error creating admin user ❌', error);
	}
};
