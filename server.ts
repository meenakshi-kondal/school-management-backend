import express from "express";
import connectDB from "./src/config/db";
import allRoutes from "./src/routes/allRoutes";

const app = express();
const PORT = 5000;

app.use(express.json());


app.listen(PORT, () => {
  console.log(`🎉 Server is running on http://localhost:${PORT} 🎉`);
});

// Database connection
connectDB()
  .then(() => console.log("🎉 MongoDB Connected Successfully 🎉"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/", allRoutes);