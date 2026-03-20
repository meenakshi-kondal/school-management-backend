import mongoose from 'mongoose';
import dotenv from 'dotenv';
import UserSchema from './src/schema/userSchema';
import StudentModel from './src/schema/studentSchema';
dotenv.config();

const MONGO_URI = process.env.DATABASE_URL || 'mongodb://localhost:27017/schoolDB';

async function seed() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        // Clear existing students
        await UserSchema.deleteMany({ role: 'student' });

        const classes = ['Standard 01', 'Standard 02', 'Standard 03'];
        const statuses = ['Present', 'Absent', 'Leave'];
        const genders = ['Male', 'Female'];
        
        const students = [];
        for (let i = 1; i <= 30; i++) {
            const gender = genders[Math.floor(Math.random() * genders.length)];
            const status = statuses[Math.floor(Math.random() * statuses.length)];
            const classIdx = Math.floor(Math.random() * classes.length);
            const className = classes[classIdx];
            
            students.push({
                name: `Student ${i}`,
                email: `student${i}@example.com`,
                password: 'password123',
                gender: gender,
                date_of_birth: new Date(2010, 0, i),
                role: 'student',
                joining_date: new Date(),
                status: 'enable',
                is_deleted: 0,
                class: [{ class_name: className, subjects: ['Math', 'Science'] }],
                attendance_status: status,
                is_bus_service: false
            });
        }

        // We use insertMany on the base model, discriminator key will handle the rest
        await UserSchema.insertMany(students);
        console.log('Seed data inserted successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
}

seed();
