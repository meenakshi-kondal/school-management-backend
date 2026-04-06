import { Router } from "express";
import { saveTimetableEntry, getWeeklyTimetable, deleteTimetableEntry, copyDayToAll } from "../controllers/timetableController";
import { authenticate } from "../middlewear/authMiddlewear";

const router = Router();

router.post("/save-timetable", authenticate, saveTimetableEntry);
router.post("/copy-day", authenticate, copyDayToAll);
router.get("/class-timetable/:classId", authenticate, getWeeklyTimetable);
router.delete("/delete-timetable/:id", authenticate, deleteTimetableEntry);

export default router;
