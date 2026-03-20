"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddlewear_1 = require("../middlewear/authMiddlewear");
const userController_1 = require("../controllers/userController");
const router = (0, express_1.Router)();
router.get("/details", authMiddlewear_1.authenticate, userController_1.profile);
exports.default = router;
