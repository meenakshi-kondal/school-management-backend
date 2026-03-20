import UserSchema from '../schema/userSchema';
import bcrypt from 'bcryptjs';

export const seedAdmin = async () => {
    try {
        const adminEmail = 'admin@test.com';
        const adminExists = await UserSchema.findOne({ email: adminEmail, role: 'admin' });

        if (!adminExists) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('Admin@11', salt);

            const adminUser = new UserSchema({
                name: 'Super Admin',
                email: adminEmail,
                gender: 'male', // default gender since enum is restricted
                date_of_birth: new Date('1990-01-01'), // random default D.O.B
                role: 'admin',
                joining_date: new Date(),
                password: hashedPassword,
                status: 'enable'
            });

            await adminUser.save();
        }
    } catch (error) {
        console.error('❌ Error creating admin user ❌', error);
    }
};
