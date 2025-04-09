import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js"; // Import MongoDB connection
import authRoutes from "./routes/umsRoutes.js"; // Import authentication routes
import productRoutes from "./routes/productRoutes.js"; // Import product routes

dotenv.config();
connectDB(); // Call DB connection function

const app = express();

// Middleware
app.use(cors({ origin: "*" }));  // Allow all origins for testing
app.use(express.json());

app.use(express.urlencoded({ extended: true }));


// Register the Auth Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);


// Routes
app.get("/", (req, res) => {
  res.send("UniMart Backend is Running...");
});



// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0",() => {
  console.log(`Server running on port ${PORT}`);
});
