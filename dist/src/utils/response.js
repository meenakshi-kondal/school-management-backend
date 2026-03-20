"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSuccessResponse = exports.sendErrorResponse = void 0;
const sendErrorResponse = (res, statusCode, message) => {
    return res.status(statusCode).json({
        success: false,
        message,
    });
};
exports.sendErrorResponse = sendErrorResponse;
const sendSuccessResponse = (res, statusCode, message, body) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data: body
    });
};
exports.sendSuccessResponse = sendSuccessResponse;
