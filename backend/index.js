import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js"; // Import MongoDB connection
import authRoutes from "./routes/umsRoutes.js"; // Import authentication routes

dotenv.config();
connectDB(); // Call DB connection function

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Register the Auth Routes
app.use("/api/auth", authRoutes);


// Routes
app.get("/", (req, res) => {
  res.send("UniMart Backend is Running...");
});



// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
