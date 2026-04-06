import mongoose from 'mongoose';
import RoleModel from '../schema/roleSchema';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/school';

const seedRoles = async () => {
	try {
		await mongoose.connect(MONGO_URI);
		console.log('Connected to MongoDB');

		const roles = ['admin', 'teacher', 'student'];

		for (const roleName of roles) {
			const exists = await RoleModel.findOne({ name: roleName });
			if (!exists) {
				await RoleModel.create({ name: roleName });
				console.log(`Role '${roleName}' created.`);
			} else {
				console.log(`Role '${roleName}' already exists.`);
			}
		}

		console.log('Roles seeded successfully!');
		await mongoose.disconnect();
		process.exit(0);

	} catch (error) {
		console.error('Error seeding roles:', error);
		process.exit(1);
	}
};

seedRoles();
