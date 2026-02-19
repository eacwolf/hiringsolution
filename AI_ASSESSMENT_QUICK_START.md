# Quick Start: AI Questions in Assessment

## Before You Start

✅ **Backend running**: `cd backend && npm run dev`
✅ **Frontend running**: `cd frontend && npm run dev`
✅ **Environment variables**: Backend has `OPENAI_API_KEY` in `.env`

---

## End-to-End Test (5 minutes)

### Step 1: Create AI-Generated Questions ⚙️

1. Open http://localhost:5174/
2. Login with test account (or create one)
3. Click **Dashboard** → **"Create New Exam"**
4. Fill form:
   - **Title**: "Backend Engineer Test"
   - **Domain**: Engineering
   - **Skill**: Java
   - **Difficulty**: Easy
   - Keep defaults for other fields
5. Click **"Generate Questions"** ⏳ (Wait 15-30 seconds)
6. Should see 3 questions generated

### Step 2: Verify Questions Were Created ✅

After generation completes:
- Page navigates to `/questions`
- See **3 generated questions** listed
- Each shows:
  - Title (e.g., "Two Sum")
  - Description
  - Difficulty badge
  - View button

Click **View** on any question to see full details:
- Problem statement
- Constraints
- Test cases with explanations
- Reference solution
- Hints

**✓ Success**: All questions display with rich content

---

### Step 3: Take Assessment 🧑‍💻

1. From Dashboard, click **"📝 Take Assessment"**
2. **Pre-Assessment Screen**:
   - Shows "3 Questions" stat
   - Enter name and email
   - Click **"Start Assessment"**
3. See **First Question** with:
   - Title: "Two Sum"
   - Full problem statement
   - Constraints (e.g., "2 <= nums.length <= 10^4")
   - Test cases (e.g., `nums = [2,7,11,15], target = 9` → `[0,1]`)
   - Optional: Click hints or reference solution

### Step 4: Write and Test Code 💻

For the **Two Sum problem**, write simple code:

**Java**:
```java
public class Solution {
    public int[] twoSum(int[] nums, int target) {
        java.util.Map<Integer, Integer> map = new java.util.HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[]{map.get(complement), i};
            }
            map.put(nums[i], i);
        }
        return new int[]{};
    }
}
```

**Python**:
```python
def twoSum(nums, target):
    map_dict = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in map_dict:
            return [map_dict[complement], i]
        map_dict[num] = i
    return []
```

### Step 5: Run Tests ▶️

1. Click **"Run Code"** button
2. Code sent to backend at `/api/code/execute`
3. Should see **Test Results**:
   ```
   ✓ Test 1: nums = [2,7,11,15], target = 9
   ✓ Test 2: nums = [3,2,4], target = 6
   ✓ Test 3: nums = [3,3], target = 6
   
   2/2 Passed (100%)
   ```

### Step 6: Submit Solution 📤

1. Click **"Submit Solution"** button
2. Solution evaluated:
   - Test results scored
   - Code quality analyzed (formatting, comments, complexity)
   - Final score calculated
3. Popup shows: `"Solution submitted! Score: 95%"`
4. Automatically moves to **Question 2**

### Step 7: Complete Remaining Questions

Repeat Steps 4-6 for Questions 2 and 3

### Step 8: View Rankings 🏆

After submitting all 3 questions:
1. Automatically redirected to `/submissions-ranking`
2. See **Leaderboard** with:
   - Your submission ranked
   - Score breakdown
   - Comparison with other candidates
3. Click **"View Details"** to see:
   - Your code vs reference solution
   - Test results breakdown
   - Code quality metrics

---

## What Gets Displayed

### Question Details (Each Problem Shows)

✅ Problem title and description
✅ Full problem statement (what to solve)
✅ Constraints (algorithm limits)
✅ 2-3 test cases with:
   - Input example
   - Expected output
   - Explanation why
✅ Hints (collapsible)
✅ Working reference solution (collapsible)
✅ Algorithm explanation including complexity

### Assessment Interface

✅ Side-by-side editor (left: problem, right: code)
✅ Language selector (Java/Python toggle)
✅ Progress bar showing 1 of 3 questions
✅ Color-coded test results (✓ pass, ✗ fail)
✅ Navigation between questions
✅ Score in real-time

### Rankings Display

✅ Leaderboard table with:
   - Rank with medals (🥇 🥈 🥉)
   - Candidate name and email
   - Questions solved
   - Tests passed
   - Final score
✅ Statistics cards (total submissions, avg score, etc.)
✅ Filters by difficulty and language
✅ Detailed submission modal

---

## Expected Questions (AI-Generated)

### Easy Level
- **Two Sum** - Find two numbers summing to target
- **Palindrome Check** - Or similar string problem
- **Array Operations** - Basic array manipulation

### Medium Level (if difficulty: Medium selected)
- **Longest Substring Without Repeating Characters**
- **LRU Cache Implementation**
- **Binary Tree Traversal**

### Hard Level (if difficulty: Hard selected)
- **Median of Two Sorted Arrays**
- **Word Ladder**
- **Longest Valid Parentheses**

---

## Troubleshooting

### ❌ "Generating questions..." takes too long

**Cause**: OpenAI API slow or backend not connected
**Solution**:
- Wait 30+ seconds
- Check backend console for errors
- Verify `OPENAI_API_KEY` is set correctly
- Check internet connection

### ❌ "No questions available" on assessment page

**Cause**: Questions weren't generated yet
**Solution**:
1. Create exam first (see Step 1)
2. Wait for generation to complete
3. Refresh page and try assessment again

### ❌ Test results show all failures

**Cause**: Mock code executor doesn't recognize your code
**Solution**:
1. Current version uses regex-based validation
2. Use reference solution as template
3. Ensure code contains expected patterns (for, if, def, etc.)

### ❌ Code runs fine locally but fails in assessment

**Cause**: Test case input format differs
**Solution**:
1. Check test case input carefully
2. Different from your local test
3. Click "View Details" to see exact input/output
4. Copy test case directly from problem

---

## What to Look For ✅

- [x] Questions have realistic problem titles (not generic)
- [x] Problem statements are detailed and clear
- [x] Constraints are realistic and specific
- [x] Test cases have actual numbers/strings (not placeholders)
- [x] Reference solutions are runnable code (not pseudo-code)
- [x] Code quality metrics are calculated
- [x] Leaderboard shows candidates ranked by performance
- [x] Scoring is fair and consistent

---

## Performance Metrics to Check

| Metric | Expected |
|--------|----------|
| Question generation | 15-30 seconds |
| Assessment page load | <1 second |
| Test result display | <2 seconds |
| Ranking page load | <1 second |
| Submit and next question | <1 second |

---

## Success Criteria: Assessment Complete ✓

✅ Generated 3 AI questions with full problem context
✅ Viewed questions with test cases and hints
✅ Wrote code in Java/Python
✅ Ran code against test cases
✅ Submitted solution with score
✅ Saw all questions in assessment
✅ Viewed rankings and leaderboard
✅ All scores calculated correctly

**If all above work → System is ready!** 🎉
