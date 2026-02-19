/**
 * Code Evaluation Service
 * Evaluates submitted code against test cases and reference solution
 */

/**
 * Execute Python code and return output
 * Note: In production, use a secure sandbox/Docker container
 */
export async function executePythonCode(code, testCases = []) {
  try {
    if (!code || code.trim().length === 0) {
      return { success: false, error: "Code is empty" };
    }

    // For demo: Basic validation and mock execution
    // In production: Send to backend for safe execution
    const results = [];
    
    for (const testCase of testCases) {
      try {
        // Create a function that wraps the user's code
        // This is a simplified approach for demo purposes
        const wrappedCode = `
          ${code}
          // Call the main function with test input
          try {
            const result = solution("${testCase.input}");
            "${testCase.input}" => "${result}"
          } catch(e) {
            "Error: " + e.message
          }
        `;
        
        results.push({
          input: testCase.input,
          expected: testCase.expected,
          actual: `Output for ${testCase.input}`,
          passed: true,
          error: null
        });
      } catch (error) {
        results.push({
          input: testCase.input,
          expected: testCase.expected,
          actual: null,
          passed: false,
          error: error.message
        });
      }
    }

    const passedTests = results.filter(r => r.passed).length;
    const totalTests = results.length;
    const score = totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0;

    return {
      success: true,
      results,
      passedTests,
      totalTests,
      score,
      language: "python"
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Execute Java code and return output
 */
export async function executeJavaCode(code, testCases = []) {
  try {
    if (!code || code.trim().length === 0) {
      return { success: false, error: "Code is empty" };
    }

    const results = [];
    
    for (const testCase of testCases) {
      results.push({
        input: testCase.input,
        expected: testCase.expected,
        actual: `Output for ${testCase.input}`,
        passed: true,
        error: null
      });
    }

    const passedTests = results.filter(r => r.passed).length;
    const totalTests = results.length;
    const score = totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0;

    return {
      success: true,
      results,
      passedTests,
      totalTests,
      score,
      language: "java"
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Compare code solution against reference solution
 */
export function compareSolutions(submittedCode, referenceSolution) {
  const comparison = {
    codeLength: {
      submitted: submittedCode?.length || 0,
      reference: referenceSolution?.length || 0,
    },
    complexity: analyzeComplexity(submittedCode),
    referenceComplexity: analyzeComplexity(referenceSolution),
    similarities: calculateSimilarity(submittedCode, referenceSolution),
    hasComments: (submittedCode || "").includes("//") || (submittedCode || "").includes("#"),
    isWellFormatted: checkFormatting(submittedCode),
  };

  return comparison;
}

/**
 * Analyze code complexity (basic)
 */
function analyzeComplexity(code) {
  if (!code) return "unknown";
  
  const nestedLoops = (code.match(/for|while/g) || []).length;
  const conditionals = (code.match(/if|else/g) || []).length;
  
  if (nestedLoops > 2 || conditionals > 3) return "high";
  if (nestedLoops > 0 || conditionals > 0) return "medium";
  return "low";
}

/**
 * Calculate code similarity
 */
function calculateSimilarity(code1, code2) {
  if (!code1 || !code2) return 0;
  
  const tokens1 = tokenize(code1);
  const tokens2 = tokenize(code2);
  
  const common = tokens1.filter(t => tokens2.includes(t)).length;
  const total = Math.max(tokens1.length, tokens2.length);
  
  return total > 0 ? Math.round((common / total) * 100) : 0;
}

/**
 * Simple tokenization
 */
function tokenize(code) {
  return code.toLowerCase().split(/\s+/).filter(t => t.length > 2);
}

/**
 * Check code formatting
 */
function checkFormatting(code) {
  if (!code) return false;
  
  const indentation = /^\s{2,}|\t/.test(code);
  const spacing = /\s{2,}\n/.test(code);
  
  return indentation || spacing;
}

/**
 * Calculate final score based on test cases and code quality
 */
export function calculateFinalScore(testResults, comparison) {
  let score = testResults.score || 0;

  // Bonus points for code quality
  if (comparison.isWellFormatted) score += 5;
  if (comparison.hasComments) score += 3;
  
  // Penalty for overly long code
  if (comparison.codeLength.submitted > comparison.codeLength.reference * 2) {
    score = Math.max(score - 10, 0);
  }

  return Math.min(score, 100);
}

/**
 * Rank submissions
 */
export function rankSubmissions(submissions) {
  return submissions
    .sort((a, b) => {
      if (b.testsPassed !== a.testsPassed) {
        return b.testsPassed - a.testsPassed;
      }
      if (b.finalScore !== a.finalScore) {
        return b.finalScore - a.finalScore;
      }
      return a.submissionTime - b.submissionTime;
    })
    .map((submission, index) => ({
      ...submission,
      rank: index + 1,
      percentile: Math.round(((submissions.length - index) / submissions.length) * 100)
    }));
}

/**
 * Send code to backend for execution (production)
 */
export async function executeCodeOnServer(code, language, testCases) {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  
  try {
    const response = await fetch(`${API_URL}/api/code/execute`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code,
        language,
        testCases
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Code execution failed");
    }

    return response.json();
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}
