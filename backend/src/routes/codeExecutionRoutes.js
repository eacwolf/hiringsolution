import express from "express";

const router = express.Router();

// Simulated code execution endpoint
// In production, use Docker/Kubernetes or external service like Judge0

router.post("/execute", async (req, res) => {
  try {
    const { code, language, testCases } = req.body;

    if (!code || !language) {
      return res.status(400).json({ error: "Code and language are required" });
    }

    if (language === "python") {
      const results = executePythonCode(code, testCases || []);
      return res.json(results);
    } else if (language === "java") {
      const results = executeJavaCode(code, testCases || []);
      return res.json(results);
    } else {
      return res.status(400).json({ error: "Unsupported language" });
    }
  } catch (error) {
    console.error("Code execution error:", error);
    res.status(500).json({ error: "Failed to execute code" });
  }
});

// Python Code Execution (Basic implementation)
function executePythonCode(code, testCases) {
  try {
    // Note: This is a SIMPLE mock implementation
    // In production, use execSync with security measures or external service

    const results = [];
    let passedTests = 0;
    let totalTests = testCases.length;

    if (totalTests === 0) {
      return {
        success: true,
        results: [],
        passedTests: 0,
        totalTests: 0,
        score: 0,
        language: "python",
      };
    }

    // Mock test execution - in production, use docker/sandbox
    testCases.forEach((testCase, index) => {
      try {
        // Simple regex-based validation for demo purposes
        const hasInput = code.includes(testCase.input) || code.match(/def|for|while|if/);
        const hasOutput = code.includes("return") || code.includes("print");

        if (hasInput && hasOutput) {
          results.push({
            passed: true,
            input: testCase.input,
            expected: testCase.expected,
            actual: testCase.expected,
          });
          passedTests++;
        } else {
          results.push({
            passed: false,
            input: testCase.input,
            expected: testCase.expected,
            actual: "No output",
            error: "Code does not produce expected output",
          });
        }
      } catch (err) {
        results.push({
          passed: false,
          input: testCase.input,
          expected: testCase.expected,
          error: err.message,
        });
      }
    });

    const score = (passedTests / totalTests) * 100;

    return {
      success: true,
      results,
      passedTests,
      totalTests,
      score,
      language: "python",
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      language: "python",
    };
  }
}

// Java Code Execution (Basic implementation)
function executeJavaCode(code, testCases) {
  try {
    const results = [];
    let passedTests = 0;
    let totalTests = testCases.length;

    if (totalTests === 0) {
      return {
        success: true,
        results: [],
        passedTests: 0,
        totalTests: 0,
        score: 0,
        language: "java",
      };
    }

    // Mock test execution - in production, use docker/sandbox
    testCases.forEach((testCase) => {
      try {
        // Simple regex-based validation for demo purposes
        const hasClass = code.includes("class");
        const hasMethod = code.includes("public");

        if (hasClass && hasMethod) {
          results.push({
            passed: true,
            input: testCase.input,
            expected: testCase.expected,
            actual: testCase.expected,
          });
          passedTests++;
        } else {
          results.push({
            passed: false,
            input: testCase.input,
            expected: testCase.expected,
            actual: "No output",
            error: "Code does not produce expected output",
          });
        }
      } catch (err) {
        results.push({
          passed: false,
          input: testCase.input,
          expected: testCase.expected,
          error: err.message,
        });
      }
    });

    const score = (passedTests / totalTests) * 100;

    return {
      success: true,
      results,
      passedTests,
      totalTests,
      score,
      language: "java",
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      language: "java",
    };
  }
}

export default router;
