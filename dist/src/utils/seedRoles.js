"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const roleSchema_1 = __importDefault(require("../schema/roleSchema"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/school';
const seedRoles = async () => {
    try {
        await mongoose_1.default.connect(MONGO_URI);
        console.log('Connected to MongoDB');
        const roles = ['admin', 'teacher', 'student'];
        for (const roleName of roles) {
            const exists = await roleSchema_1.default.findOne({ name: roleName });
            if (!exists) {
                await roleSchema_1.default.create({ name: roleName });
                console.log(`Role '${roleName}' created.`);
            }
            else {
                console.log(`Role '${roleName}' already exists.`);
            }
        }
        console.log('Roles seeded successfully!');
        await mongoose_1.default.disconnect();
        process.exit(0);
    }
    catch (error) {
        console.error('Error seeding roles:', error);
        process.exit(1);
    }
};
seedRoles();
