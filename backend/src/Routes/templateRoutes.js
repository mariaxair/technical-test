import express from "express";
import {
  getAllTemplates,
  createTemplate,
  updateTemplate,
  deleteTemplate,
} from "../Controllers/templateController.js";

const router = express.Router();

router.get("/", getAllTemplates);
// router.get("/:name", getTemplateByName);
router.post("/", createTemplate);
router.put("/:id", updateTemplate);
router.delete("/:id", deleteTemplate);

export default router;