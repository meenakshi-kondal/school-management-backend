"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("./src/config/db"));
const allRoutes_1 = __importDefault(require("./src/routes/allRoutes"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const adminSeeder_1 = require("./src/helper/adminSeeder");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.listen(PORT, () => {
    console.log(`🎉 Server running on port ${PORT} 🎉`);
});
// Database connection
(0, db_1.default)()
    .then(async () => {
    console.log("🎉 MongoDB Connected Successfully 🎉");
    await (0, adminSeeder_1.seedAdmin)();
})
    .catch((err) => console.error("MongoDB connection error:", err));
// Routes
app.use("/", allRoutes_1.default);
