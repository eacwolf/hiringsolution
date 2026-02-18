import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generate technical interview questions using ChatGPT
 * @param {Object} formData - { domain, skill, difficulty }
 * @returns {Promise<Array>} Array of generated questions with solutions
 */
export async function generateQuestionsWithChatGPT(formData) {
  const { domain = "general", skill = "Python", difficulty = "Medium" } = formData;

  const prompt = `You are an expert technical interviewer with LeetCode experience. Generate 3 ${difficulty} level technical interview coding questions for a ${domain} role focusing on ${skill}.\n\nRequirements:\n- Questions should be similar to LeetCode problems (real, practical, coding-focused)\n- Include constraints and parameters clearly\n- Provide exact input/output test cases\n- Include working reference solution in the language (${skill})\n\nFormat EXACTLY as this JSON array structure (return ONLY valid JSON, no markdown):\n[ ... see schema ... ]\n\nMake sure:\n1. Test cases are real and verifiable\n2. Reference solution actually works for all test cases\n3. Questions are suitable for actual interviews`;

  try {
    const resp = await client.chat.completions.create({
      model: "gpt-4o",
      max_tokens: 4096,
      temperature: 0.2,
      messages: [
        { role: "user", content: prompt },
      ],
    });

    // Robustly extract text content from different SDK response shapes
    let responseText = "";
    const choice = resp.choices && resp.choices[0];
    if (!choice) throw new Error("No choices returned from OpenAI");

    if (choice.message) {
      const content = choice.message.content;
      if (typeof content === "string") responseText = content;
      else if (Array.isArray(content)) {
        const part = content.find((p) => p.type === "output_text" || p.type === "text") || content[0];
        responseText = part && (part.text || part.content || JSON.stringify(part));
      } else if (content && content[0] && content[0].text) {
        responseText = content[0].text;
      } else {
        responseText = JSON.stringify(content);
      }
    } else if (choice.text) {
      responseText = choice.text;
    } else {
      responseText = JSON.stringify(choice);
    }

    // Try to extract JSON array from the model output
    let questions = [];
    try {
      const jsonMatch = responseText.match(/\[[\s\S]*\]/);
      if (jsonMatch) questions = JSON.parse(jsonMatch[0]);
      else questions = JSON.parse(responseText);
    } catch (parseErr) {
      console.error("Failed to parse ChatGPT response:", parseErr);
      console.error("Response text:\n", responseText);
      // Fallback to mock data if parsing fails
      questions = generateMockQuestions({ skill, difficulty });
    }

    return questions.map((q, idx) => ({ id: `q-${Date.now()}-${idx}`, ...q, createdAt: new Date().toISOString() }));
  } catch (err) {
    console.error("OpenAI API error:", err && err.message ? err.message : err);
    return generateMockQuestions(formData);
  }
}

/**
 * Generate mock questions for demo/testing
 */
function generateMockQuestions(formData) {
  const { skill, difficulty } = formData;
  
  // Real LeetCode-style questions
  const mockQuestions = {
    Java: {
      Easy: [
        {
          id: `q-${Date.now()}-0`,
          title: "Two Sum",
          description: "Given an array of integers nums and an integer target, return the indices of the two numbers that add up to target.",
          problemStatement: "You may assume each input has exactly one solution and you cannot use the same element twice. You can return the answer in any order.",
          constraints: "2 <= nums.length <= 10^4, -10^9 <= nums[i] <= 10^9, -10^9 <= target <= 10^9",
          difficulty: "Easy",
          testCases: [
            {
              input: "nums = [2,7,11,15], target = 9",
              expected: "[0,1]",
              explanation: "nums[0] + nums[1] == 9, return [0, 1]"
            },
            {
              input: "nums = [3,2,4], target = 6",
              expected: "[1,2]",
              explanation: "nums[1] + nums[2] == 6, return [1, 2]"
            },
            {
              input: "nums = [3,3], target = 6",
              expected: "[0,1]",
              explanation: "nums[0] + nums[1] == 6, return [0, 1]"
            }
          ],
          referenceSolution: `public int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> map = new HashMap<>();
    for (int i = 0; i < nums.length; i++) {
        int complement = target - nums[i];
        if (map.containsKey(complement)) {
            return new int[]{map.get(complement), i};
        }
        map.put(nums[i], i);
    }
    return new int[]{};
}`,
          solutionExplanation: "Use HashMap to store value-index pairs. For each number, check if its complement exists in the map. Time: O(n), Space: O(n)",
          hints: ["Use a hash map to store values seen so far", "For each element, check if target - element exists in map"],
          createdAt: new Date().toISOString(),
        },
      ],
      Medium: [
        {
          id: `q-${Date.now()}-1`,
          title: "Longest Substring Without Repeating Characters",
          description: "Given a string s, find the length of the longest substring without repeating characters.",
          problemStatement: "Return the length of the longest substring that does not contain duplicate characters.",
          constraints: "0 <= s.length <= 5 * 10^4, s consists of English letters, digits, symbols and spaces",
          difficulty: "Medium",
          testCases: [
            {
              input: "s = \"abcabcbb\"",
              expected: "3",
              explanation: "The answer is \"abc\" with the length of 3"
            },
            {
              input: "s = \"bbbbb\"",
              expected: "1",
              explanation: "The answer is \"b\" with the length of 1"
            },
            {
              input: "s = \"pwwkew\"",
              expected: "3",
              explanation: "The answer is \"wke\" with the length of 3"
            }
          ],
          referenceSolution: `public int lengthOfLongestSubstring(String s) {
    Map<Character, Integer> map = new HashMap<>();
    int left = 0, maxLen = 0;
    for (int right = 0; right < s.length(); right++) {
        char c = s.charAt(right);
        if (map.containsKey(c)) {
            left = Math.max(left, map.get(c) + 1);
        }
        map.put(c, right);
        maxLen = Math.max(maxLen, right - left + 1);
    }
    return maxLen;
}`,
          solutionExplanation: "Use sliding window with HashMap. Maintain left and right pointers. When duplicate found, move left pointer. Time: O(n), Space: O(min(m,n))",
          hints: ["Use sliding window approach", "Store character positions in a HashMap"],
          createdAt: new Date().toISOString(),
        },
      ],
      Hard: [
        {
          id: `q-${Date.now()}-2`,
          title: "Median of Two Sorted Arrays",
          description: "Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.",
          problemStatement: "The overall run time complexity should be O(log (m+n))",
          constraints: "nums1.length == m, nums2.length == n, 0 <= m <= 1000, 0 <= n <= 1000",
          difficulty: "Hard",
          testCases: [
            {
              input: "nums1 = [1,3], nums2 = [2]",
              expected: "2.00000",
              explanation: "merged array = [1,2,3] and median is 2"
            },
            {
              input: "nums1 = [1,2], nums2 = [3,4]",
              expected: "2.50000",
              explanation: "merged array = [1,2,3,4] and median is (2 + 3) / 2 = 2.5"
            }
          ],
          referenceSolution: `public double findMedianSortedArrays(int[] nums1, int[] nums2) {
    if (nums1.length > nums2.length) {
        return findMedianSortedArrays(nums2, nums1);
    }
    int m = nums1.length, n = nums2.length;
    int left = 0, right = m;
    while (left <= right) {
        int partition1 = (left + right) / 2;
        int partition2 = (m + n + 1) / 2 - partition1;
        int left1 = partition1 == 0 ? Integer.MIN_VALUE : nums1[partition1 - 1];
        int right1 = partition1 == m ? Integer.MAX_VALUE : nums1[partition1];
        int left2 = partition2 == 0 ? Integer.MIN_VALUE : nums2[partition2 - 1];
        int right2 = partition2 == n ? Integer.MAX_VALUE : nums2[partition2];
        if (left1 <= right2 && left2 <= right1) {
            return (m + n) % 2 == 0 ? (Math.max(left1, left2) + Math.min(right1, right2)) / 2.0 : Math.max(left1, left2);
        } else if (left1 > right2) {
            right = partition1 - 1;
        } else {
            left = partition1 + 1;
        }
    }
    return -1;
}`,
          solutionExplanation: "Binary search on partition. Time: O(log(min(m,n))), Space: O(1)",
          hints: ["Use binary search", "Find the correct partition point"],
          createdAt: new Date().toISOString(),
        },
      ]
    },
    Python: {
      Easy: [
        {
          id: `q-${Date.now()}-0`,
          title: "Two Sum",
          description: "Given a list of integers and a target, return indices of two numbers that add up to target.",
          problemStatement: "You may assume each input has exactly one solution and you cannot use the same element twice.",
          constraints: "Time: O(n), Space: O(n)",
          difficulty: "Easy",
          testCases: [
            {
              input: "nums = [2,7,11,15], target = 9",
              expected: "[0,1]",
              explanation: "nums[0] + nums[1] == 9"
            },
            {
              input: "nums = [3,2,4], target = 6",
              expected: "[1,2]",
              explanation: "nums[1] + nums[2] == 6"
            }
          ],
          referenceSolution: `def twoSum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`,
          solutionExplanation: "Use dictionary to store seen values. Time O(n), Space O(n)",
          hints: ["Use a hash map", "Lookup complement for each number"],
          createdAt: new Date().toISOString(),
        },
      ],
      Medium: [
        {
          id: `q-${Date.now()}-1`,
          title: "LRU Cache",
          description: "Design and implement an LRU Cache with get and put operations.",
          problemStatement: "Implement LRUCache class with O(1) get and put operations",
          constraints: "1 <= capacity <= 3000",
          difficulty: "Medium",
          testCases: [
            {
              input: 'cache = LRUCache(2); cache.put(1,1); cache.put(2,2); cache.get(1);',
              expected: "1",
              explanation: "Get returns 1"
            }
          ],
          referenceSolution: `from collections import OrderedDict

class LRUCache:
    def __init__(self, capacity: int):
        self.cache = OrderedDict()
        self.capacity = capacity
    
    def get(self, key: int) -> int:
        if key not in self.cache:
            return -1
        self.cache.move_to_end(key)
        return self.cache[key]
    
    def put(self, key: int, value: int) -> None:
        if key in self.cache:
            self.cache.move_to_end(key)
        self.cache[key] = value
        if len(self.cache) > self.capacity:
            self.cache.popitem(last=False)`,
          solutionExplanation: "Use OrderedDict for O(1) operations",
          hints: ["Use OrderedDict", "Move accessed item to end"],
          createdAt: new Date().toISOString(),
        },
      ],
      Hard: [
        {
          id: `q-${Date.now()}-2`,
          title: "Word Ladder",
          description: "Find the shortest transformation sequence from beginWord to endWord.",
          problemStatement: "Use BFS to find shortest path",
          constraints: "1 <= len(beginWord) <= 10",
          difficulty: "Hard",
          testCases: [
            {
              input: "beginWord = 'hit', endWord = 'cog', wordList = ['hot','dot','dog','lot','log','cog']",
              expected: "5",
              explanation: "hit -> hot -> dot -> dog -> cog"
            }
          ],
          referenceSolution: `from collections import deque

def ladderLength(beginWord: str, endWord: str, wordList: list) -> int:
    word_set = set(wordList)
    if endWord not in word_set:
        return 0
    
    queue = deque([(beginWord, 1)])
    while queue:
        word, level = queue.popleft()
        if word == endWord:
            return level
        for i in range(len(word)):
            for c in 'abcdefghijklmnopqrstuvwxyz':
                new_word = word[:i] + c + word[i+1:]
                if new_word in word_set:
                    word_set.remove(new_word)
                    queue.append((new_word, level + 1))
    return 0`,
          solutionExplanation: "BFS with word transformation",
          hints: ["Use BFS", "Transform one character at a time"],
          createdAt: new Date().toISOString(),
        },
      ]
    }
  };

  // Get questions for the selected language and difficulty, or use Java Easy as fallback
  const languageQuestions = mockQuestions[skill] || mockQuestions.Java;
  const difficultyQuestions = languageQuestions[difficulty] || languageQuestions.Easy;
  
  return difficultyQuestions;
}
