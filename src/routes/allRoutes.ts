import { Router } from "express";
import authRoute from "./authRoute";
import userRoute from './userRoute';
import classRoute from './classRoute';
import adminRoute from './adminRoute';
import noticeRoute from './noticeRoute';
import timetableRoute from './timetableRoute';

const router = Router();

// Routes for authetication/authorization
router.use("/auth", authRoute);

// Routes for user
router.use("/user", userRoute);

// Routes for classes
router.use("/class", classRoute);

// Routes for admin management
router.use("/admin", adminRoute);

// Routes for notices
router.use("/notice", noticeRoute);

// Routes for timetable
router.use("/timetable", timetableRoute);



export default router;
