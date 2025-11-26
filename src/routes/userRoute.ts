import { Router } from "express";
import { authenticate} from "../middlewear/authMiddlewear";
import { profile } from "../controllers/userController";

const router = Router();

router.get("/details", authenticate, profile);

export default router;
