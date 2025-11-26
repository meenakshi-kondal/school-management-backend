import { Router } from "express";
import authRoute from "./authRoute";
import userRoute from './userRoute';

const router = Router();

// Routes for authetication/authorization
router.use("/auth", authRoute);

// Routes for user
router.use("/user", userRoute);


export default router;
