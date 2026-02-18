import express from "express";
import { handleGenerateQuestions } from "../controllers/generateController.js";

const router = express.Router();

/**
 * POST /api/generate
 * Generate AI interview questions
 */
router.post("/generate", handleGenerateQuestions);

export default router;
