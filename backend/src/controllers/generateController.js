import { generateQuestionsWithChatGPT } from "../services/chatgptService.js";

/**
 * Handle POST /api/generate request
 */
export async function handleGenerateQuestions(req, res) {
  try {
    const { domain, skill, difficulty } = req.body;

    // Validation
    if (!domain || !skill || !difficulty) {
      return res.status(400).json({
        error: "Missing required fields: domain, skill, difficulty",
      });
    }

    // Generate questions using ChatGPT
    const questions = await generateQuestionsWithChatGPT({
      domain,
      skill,
      difficulty,
    });

    // Return response with metadata
    return res.status(200).json({
      success: true,
      metadata: {
        generatedBy: "openai-api",
        generatedAt: new Date().toISOString(),
        form: { domain, skill, difficulty },
      },
      questions,
    });
  } catch (err) {
    console.error("Error in handleGenerateQuestions:", err);
    return res.status(500).json({
      error: "Failed to generate questions",
      message: err.message,
    });
  }
}
