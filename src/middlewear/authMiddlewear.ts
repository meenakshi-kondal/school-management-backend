import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { sendErrorResponse } from "../utils/response";
import { notify } from "../utils/enum";
dotenv.config();

const JWT_SECRET_KEY = process.env.JWT_SECRET || '';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {

    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return sendErrorResponse(res, 401, notify.ACCESS_DENIED);
    }

    try {

        const decoded = jwt.verify(token, JWT_SECRET_KEY);
        (req as any).user = decoded;

        next();
    } catch (err) {
        return sendErrorResponse(res, 403, notify.EX_TOKEN);
    }
};
