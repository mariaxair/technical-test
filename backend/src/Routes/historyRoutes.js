import express from "express";
import {
  getAllHistory,
  getHistoryById,
  getHistoryByTemplate,
  getHistoryStats,
} from "../Controllers/historyController.js";

const router = express.Router();

router.get("/", getAllHistory);
router.get("/:id", getHistoryById);
router.get("/template/:templateId", getHistoryByTemplate);
router.get("/stats", getHistoryStats);

export default router;