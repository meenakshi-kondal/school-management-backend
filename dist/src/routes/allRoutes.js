"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authRoute_1 = __importDefault(require("./authRoute"));
const userRoute_1 = __importDefault(require("./userRoute"));
const classRoute_1 = __importDefault(require("./classRoute"));
const adminRoute_1 = __importDefault(require("./adminRoute"));
const noticeRoute_1 = __importDefault(require("./noticeRoute"));
const router = (0, express_1.Router)();
// Routes for authetication/authorization
router.use("/auth", authRoute_1.default);
// Routes for user
router.use("/user", userRoute_1.default);
// Routes for classes
router.use("/class", classRoute_1.default);
// Routes for admin management
router.use("/admin", adminRoute_1.default);
// Routes for notices
router.use("/notice", noticeRoute_1.default);
exports.default = router;
