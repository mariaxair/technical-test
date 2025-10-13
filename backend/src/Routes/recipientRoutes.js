import express from "express";
import {
  getAllRecipients,
  getValidRecipients,
  createRecipient,
  importRecipientsFromCSV,
  updateRecipient,
  deleteRecipient,
} from "../Controllers/recipientController.js";
const router = express.Router();

router.get("/", getAllRecipients);
router.get("/valid", getValidRecipients);
// router.get("/:id", getRecipientById);
router.post("/", createRecipient);
router.post("/import", importRecipientsFromCSV);
router.put("/:id", updateRecipient);
router.delete("/:id", deleteRecipient);

export default router;
