import { Router } from "express";

const router = Router();

router.post("/registration", (req, res) => {
  const { name, email } = req.body;
  res.json({ message: `User ${name} with email ${email} created!` });
});

export default router;
