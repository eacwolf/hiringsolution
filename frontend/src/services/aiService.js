const STORAGE_KEY = "hireai_latest_questions";

async function fetchWithTimeout(url, options = {}, timeout = 30000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return res;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

function saveLatest(payload) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (e) {
    // ignore
  }
}

function getLatest() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function mockGenerate(formData) {
  // lightweight mock generator producing 3 questions with solutions and test cases
  const now = new Date().toISOString();
  const questions = [
    {
      id: `q-1-${Date.now()}`,
      title: `${formData.skill} - Problem 1: Basic ${formData.skill} Task`,
      description: `Write a function that demonstrates a basic ${formData.skill} concept.`,
      difficulty: formData.difficulty,
      testCases: [
        { input: "input1", expected: "output1" },
        { input: "input2", expected: "output2" },
      ],
      referenceSolution: `// reference solution for ${formData.skill} (pseudo)\nfunction solution() { return true; }`,
      createdAt: now,
    },
    {
      id: `q-2-${Date.now()}`,
      title: `${formData.skill} - Problem 2: Intermediate Challenge`,
      description: `Solve an intermediate ${formData.skill} problem.`,
      difficulty: formData.difficulty,
      testCases: [
        { input: "a", expected: "b" },
        { input: "c", expected: "d" },
      ],
      referenceSolution: `// reference solution for ${formData.skill} (pseudo)\nfunction solution() { return true; }`,
      createdAt: now,
    },
    {
      id: `q-3-${Date.now()}`,
      title: `${formData.skill} - Problem 3: Advanced Scenario`,
      description: `Advanced ${formData.skill} question to test proficiency.`,
      difficulty: formData.difficulty,
      testCases: [
        { input: "x", expected: "y" },
        { input: "z", expected: "w" },
      ],
      referenceSolution: `// reference solution for ${formData.skill} (pseudo)\nfunction solution() { return true; }`,
      createdAt: now,
    },
  ];
  return {
    metadata: { generatedBy: "mock-ai", generatedAt: now, form: formData },
    questions,
  };
}

export async function generateQuestions(formData) {
  // Try calling backend endpoint first
  const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
  try {
    const res = await fetchWithTimeout(
      `${backendUrl}/api/generate`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      },
      30000
    );

    if (!res.ok) {
      throw new Error(`Backend returned ${res.status}: ${res.statusText}`);
    }
    const payload = await res.json();
    // save and return
    saveLatest(payload);
    return payload;
  } catch (err) {
    console.warn("Backend API failed, using fallback mock:", err.message);
    // fallback to mock generator for offline/demo mode
    const fallback = mockGenerate(formData);
    saveLatest(fallback);
    return fallback;
  }
}

export { saveLatest, getLatest };
