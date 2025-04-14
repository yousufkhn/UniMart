import express from "express";
import { umsLogin } from "../controllers/umsController.js";
import cors from "cors";
import User from "../models/UserModel.js"; // Import the User model

const router = express.Router();

router.use(cors());

// 🟢 Get user name photo by id
router.get("/getuser/:id", async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await User.findById(userId).select("studentName studentPicture");
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.status(200).json(user);
    } catch (error) {
      console.error("Error fetching user:", error.message);
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  export default router;