import { Router } from "express";
import authRoute from "./authRoute";

const router = Router();

// Routes for authetication/authorization
router.use("/auth", authRoute);


export default router;
