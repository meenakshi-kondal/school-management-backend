import express from "express";
import connectDB from "./src/config/db";
import allRoutes from "./src/routes/allRoutes";
import dotenv from "dotenv";
import cors from "cors";
import { seedAdmin } from "./src/helper/adminSeeder";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.listen(PORT, () => {
  console.log(`🎉 Server running on port ${PORT} 🎉`);
});

// Database connection
connectDB()
  .then(async () => {
    console.log("🎉 MongoDB Connected Successfully 🎉");
    await seedAdmin();
  })
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/", allRoutes);