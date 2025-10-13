import express from "express";
import {
  getAllHistory,
  getHistoryStats,
} from "../Controllers/historyController.js";

const router = express.Router();

router.get("/", getAllHistory);
// router.get("/recipient", getHistoryByRecipientNameOrId);
// router.get("/template/:name", getHistoryByTemplate);
router.get("/stats", getHistoryStats);

export default router;