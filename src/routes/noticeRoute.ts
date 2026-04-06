import { Router } from "express";
import { addNotice, noticeList, deleteNotice, markNoticeAsRead } from "../controllers/noticeController";

import { authenticate } from "../middlewear/authMiddlewear";

const router = Router();

router.post("/add-notice", authenticate, addNotice);
router.get("/all-notices", authenticate, noticeList);
router.delete("/delete-notice/:id", authenticate, deleteNotice);
router.post("/read-notice/:id", authenticate, markNoticeAsRead);


export default router;
