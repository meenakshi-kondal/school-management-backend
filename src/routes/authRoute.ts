import { Router } from "express";
import { forgot_password, login, registration, update_password } from "../controllers/authController";
import { authenticate} from "../middlewear/authMiddlewear";

const router = Router();

router.post("/registration", registration);
router.post("/login", login);
router.post("/forgot-password", forgot_password);
router.put("/update-password", authenticate, update_password);

export default router;
