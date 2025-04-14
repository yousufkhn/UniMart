import express from "express";
import { umsLogin } from "../controllers/umsController.js";
import cors from "cors";

const router = express.Router();

router.use(cors());

// 🟢 User Management System (UMS) Login Route
router.post("/ums-login", umsLogin);




export default router;
