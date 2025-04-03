import express from "express";
import { umsLogin } from "../controllers/umsController.js";

const router = express.Router();

router.post("/ums-login", umsLogin);

export default router;
