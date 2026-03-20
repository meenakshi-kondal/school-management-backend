import { Router } from "express";
import { authenticate } from "../middlewear/authMiddlewear";
import { studentsList, teachersList, dashboard, studentDetails } from "../controllers/admin/adminUserController";

const router = Router();

router.get("/dashboard", authenticate, dashboard);
router.get("/students-list", authenticate, studentsList);
router.get("/teachers-list", authenticate, teachersList);
router.get("/student-details/:id", authenticate, studentDetails);

export default router;
