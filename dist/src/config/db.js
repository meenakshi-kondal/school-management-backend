"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const mongoUrl = process.env.DATABASE_URL || "mongodb://localhost:27017/schoolDB";
const connectDB = async () => {
    try {
        await mongoose_1.default.connect(mongoUrl);
    }
    catch (error) {
        process.exit(1);
    }
};
exports.default = connectDB;
