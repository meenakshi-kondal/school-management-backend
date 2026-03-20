"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const response_1 = require("../utils/response");
const enum_1 = require("../utils/enum");
dotenv_1.default.config();
const JWT_SECRET_KEY = process.env.JWT_SECRET || '';
const authenticate = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        return (0, response_1.sendErrorResponse)(res, 401, enum_1.notify.ACCESS_DENIED);
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET_KEY);
        req.user = decoded;
        next();
    }
    catch (err) {
        return (0, response_1.sendErrorResponse)(res, 403, enum_1.notify.EX_TOKEN);
    }
};
exports.authenticate = authenticate;
