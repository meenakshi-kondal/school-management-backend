"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authRoute_1 = __importDefault(require("./authRoute"));
const userRoute_1 = __importDefault(require("./userRoute"));
const router = (0, express_1.Router)();
// Routes for authetication/authorization
router.use("/auth", authRoute_1.default);
// Routes for user
router.use("/user", userRoute_1.default);
exports.default = router;
