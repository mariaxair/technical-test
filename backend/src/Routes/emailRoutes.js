import express from "express";
import { sendBulk } from "../Controllers/emailController.js";

const router = express.Router();

router.post("/send-bulk", sendBulk);
// router.post("/test", testEmail);

export default router;
