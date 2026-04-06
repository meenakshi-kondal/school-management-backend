"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedAdmin = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userSchema_1 = __importDefault(require("../schema/userSchema"));
const seedAdmin = async () => {
    try {
        const adminEmail = 'admin@test.com';
        const adminExists = await userSchema_1.default.findOne({ email: adminEmail, role: 'admin' });
        if (!adminExists) {
            const salt = await bcryptjs_1.default.genSalt(10);
            const hashedPassword = await bcryptjs_1.default.hash('Admin@11', salt);
            const adminUser = new userSchema_1.default({
                email: adminEmail,
                password: hashedPassword,
            });
            await adminUser.save();
        }
    }
    catch (error) {
        console.error('❌ Error creating admin user ❌', error);
    }
};
exports.seedAdmin = seedAdmin;
