import express from "express";
import connectDB from "./src/config/db";
import allRoutes from "./src/routes/allRoutes";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());


app.listen(PORT, () => {
  console.log(`🎉 Server running on port ${PORT} 🎉`);
});

// Database connection
connectDB()
  .then(() => console.log("🎉 MongoDB Connected Successfully 🎉"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/", allRoutes);