import { Router } from "express";
import { addClass, getAllClasses, updateClass } from "../controllers/classController";
import { authenticate } from "../middlewear/authMiddlewear";

const router = Router();

router.post("/add-class", authenticate, addClass);
router.get("/all-classes", authenticate, getAllClasses);
router.put("/update-class/:id", authenticate, updateClass);

export default router;
