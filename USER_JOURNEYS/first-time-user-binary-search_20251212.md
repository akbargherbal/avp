# Journey: First-Time User Experience (FTUE) - Binary Search

**Who**: A student learning algorithms
**Goal**: To understand the Binary Search algorithm step-by-step.
**Starting Point**: The user has switched from "Interval Coverage" to "Binary Search" visualization at `http://localhost:3000`.

---

## The Journey

### Step 1: Initial Landing Page Experience (Binary Search)

**What happens**: Upon switching to Binary Search, the user sees a new interface. The title is "Binary Search Visualization". The step counter reads "Step 1 of 7". The control bar retains "⏳ Predict", "Reset", "Previous" (disabled), and "Next Step" buttons. The main visualization area now shows an "Array Visualization" with a target value "🎯 Target: 59". A sorted array of numbers (0-98) is displayed with indices, and ranges like "(active_range)" or "(excluded)" are indicated. The "Algorithm State" panel shows "Pointers: left=0, right=19, target=59" and "Search Progress: Space Size: 20 elements". A "CALCULATE MID" heading is visible with "mid: 9 (value = 48)".

**User's likely thought**: "Okay, this is Binary Search. I need to find 59 in this array. It looks like it's already sorted, which is good. The visualization shows the current search space and the target. It seems like it's already calculated the first middle element."

**What works well**:

-   Clear title and step indicator for the new algorithm.
-   The target value is prominently displayed.
-   The array visualization clearly shows indices and values, with visual cues for the active range and excluded elements.
-   The "Algorithm State" panel provides crucial context (left, right pointers, target, search space size).
-   The initial calculation of `mid` is presented immediately, setting up the first decision.

**What could be better**:

-   The presence of "(active_range)" on *all* initial elements might be slightly confusing; perhaps only the initial full range should be marked as active, with others as "initial".

---

### Step 2: First Prediction - Comparing Mid Value

**What happens**: The step counter updates to "Step 2 of 7". A "Prediction Mode" section appears with the heading "TEST: Compare mid value (48) with target (59). What's next?". A hint is provided: "💡 Hint: Compare 48 with 59". The user is presented with three prediction options:
1.  "Found! (48 == 59) Press F"
2.  "Search Left (48 > 59) Press L"
3.  "Search Right (48 < 59) Press R"

A disabled "Submit (Enter)" button is also visible. The "Algorithm State" panel now shows "CALCULATE MID: index 14 (value = 70)" – this seems to be a slight inconsistency or a look-ahead, as the immediate prediction is about 48, not 70. The "Array Visualization" highlights index 9 (value 48) as "(examining)".

**User's likely thought**: "The algorithm compared the middle value (48) with the target (59). Since 48 is less than 59, the target must be in the right half of the array. So, I should choose 'Search Right'. The hint also confirms this. It looks like the algorithm is already jumping ahead to calculate the next middle (70) which is a bit confusing, but my prediction should be based on 48."

**What works well**:

-   Engaging "Prediction Mode" to involve the user.
-   Clear question, hint, and options for the user's decision.
-   Keyboard shortcuts are a good addition.
-   The "Array Visualization" clearly shows which element is currently being examined.

**What could be better**:

-   **Inconsistency in mid-value display**: The "Algorithm State" panel shows the next mid-value (70) while the prediction is about the current mid-value (48). This is confusing for a first-time user. The "Algorithm State" should reflect the value *currently* being evaluated for the prediction.
-   **Visual feedback on exclusion**: While "(excluded)" is shown for previous values, it would be beneficial to see the *current* search space visually shrink or the excluded values clearly marked as the prediction is made.

---

### Step 3: Submitting the Prediction

**What happens**: After selecting "Search Right (48 < 59)", the button becomes active. The "Submit (Enter) ✓" button is now enabled.

**User's likely thought**: "I've made my prediction. Now I need to submit it to continue the search and see if I was right."

**What works well**:

-   Clear indication that a prediction has been made and is ready for submission.

**What could be better**:

-   (Same as previous FTUE) A confirmation text before submission could be beneficial.

---

### Step 4: Prediction Feedback and State Update

**What happens**: Upon submitting, the prediction interface is replaced by immediate feedback: a green checkmark and "Correct!". The message explains: "48 < 59, so the target must be in the right half (larger values)". The "Algorithm State" panel updates to reflect the new search space: "Pointers: left: 10, right: 19" (implicitly, as the left pointer moved past mid+1). The "Array Visualization" shows elements with indices 0-8 now marked as "(excluded)", and the search space size is updated to "10 elements". The "CALCULATE MID" section is now visible again, showing "mid: 14 (value = 70)".

**User's likely thought**: "Great, I was correct! It makes sense that the search space shifted to the right half. I can see the excluded elements visually now. It's ready to calculate the next middle value."

**What works well**:

-   Excellent, immediate feedback reinforcing the user's correct prediction.
-   Clear explanation of the algorithmic outcome.
-   Visual update showing excluded elements and the reduced search space.
-   Algorithm state update (pointers, search space size) is clearly presented.

**What could be better**:

-   The immediate display of the *next* mid-value calculation in the "Algorithm State" could be slightly delayed until the *next* "Next Step" is pressed, to keep the current step focused on the outcome of the *previous* prediction.

---

### Step 5: Second Prediction - Comparing Mid Value

**What happens**: The step counter updates to "Step 4 of 7". The "Prediction Mode" reappears with the heading "TEST: Compare mid value (70) with target (59). What's next?". The hint is "💡 Hint: Compare 70 with 59". The options are "Found!", "Search Left", and "Search Right". The "Algorithm State" shows "mid: 14" and the "Array Visualization" now highlights index 14 (value 70) as "(examining)".

**User's likely thought**: "The new middle value is 70. The target is 59. Since 70 is greater than 59, I need to search in the left half. So, I'll choose 'Search Left'."

**What works well**:

-   Consistent and clear prediction interface.
-   Directly guides the user to make the correct algorithmic decision.
-   Visual highlighting of the examined element.

**What could be better**:

-   No significant issues in this step; the interaction is smooth and informative.

---

### Step 6: Submitting Second Prediction & Feedback

**What happens**: After selecting "Search Left (70 > 59)", the button becomes active, and "Submit (Enter) ✓" enables. Upon submission, the feedback is "Correct!" with the message: "70 > 59, so the target must be in the left half (smaller values)". The "Algorithm State" updates, and the "Array Visualization" now shows elements from index 15 onwards as "(excluded)", reducing the search space size to 6 elements. The "CALCULATE MID" section is shown again, indicating the next step will involve calculating a new mid-point.

**User's likely thought**: "Another correct prediction! The search space is narrowing down effectively. I can see how Binary Search quickly eliminates half of the remaining elements."

**What works well**:

-   Clear confirmation and explanation of the outcome.
-   Visual reduction of the search space.
-   Reinforces the efficiency of Binary Search.

**What could be better**:

-   (Minor) The prompt to "CALCULATE MID" appears immediately after the feedback, which might be slightly premature if the user expects to process the *outcome* of the current step first before moving to the next calculation.

---

### Step 7: Final Steps & Found

**What happens**: The user continues to click "Next Step" and make predictions. The search space narrows further until the target (59) is found. The visualization would show the final comparison, and the "Found!" prediction would be selected and submitted, leading to a success state.

**User's likely thought**: "Ah, there it is! The algorithm successfully found the target value."

**What works well**:

-   Demonstrates the successful termination of the algorithm.

**What could be better**:

-   (Not directly observed in the snapshot, but inferred) The transition to a final "Found" state should be clear and celebratory.

---

## Journey Summary

**Overall Experience**: The FTUE for Binary Search is highly effective and engaging. The clear visual representation of the array, the active search space, and the pointers, combined with the interactive prediction mode, make the algorithm easy to understand. The explanations provided in the "Algorithm State" panel and through user predictions are excellent. The main point of initial confusion is the slight inconsistency in displaying the "mid" value in the "Algorithm State" panel during the first prediction step. Otherwise, the experience is smooth, educational, and provides positive reinforcement.

**Time to Complete**: Approximately 3-5 minutes for the observed steps (Steps 1-6).

**Difficulty Level**: Easy. The guided prediction format and clear visualizations make it accessible even for beginners.

**Key Insights**:

1.  **Visual Search Space Reduction**: The core strength of this visualization is how it clearly shows the array, the target, and how the search space shrinks with each step, making the 'divide and conquer' concept tangible.
2.  **Predictive Learning**: The "Prediction Mode" is a powerful tool that actively engages the user and solidifies their understanding of the decision points within the algorithm.
3.  **Algorithm State Context**: The detailed "Algorithm State" panel (pointers, mid-value, search space size) is crucial for understanding the mechanics of Binary Search.
4.  **Minor UI Inconsistency**: The display of the mid-value calculation in the "Algorithm State" panel needs to be synchronized with the current prediction step to avoid user confusion.

**Recommendations**:

-   **Synchronize Mid-Value Display**: Ensure the "Algorithm State" panel accurately reflects the `mid` value and its corresponding array element being *currently* evaluated for prediction, not the next one. This will prevent the confusion observed in Step 2.
-   **Enhance Initial Range Clarity**: In the "Array Visualization", consider a subtle visual distinction for the initial full search range vs. elements that become "excluded" later.
-   **Clear 'Found' State**: Ensure the final state when the target is found is clearly communicated with a celebratory message and visual indication.

---

## Emotional Journey Map

```
Start Mid-Journey End
🙂 Curious → 🤔 Engaged → ✅ Confident → 😊 Satisfied
↓
"Slight confusion about the mid-value display in step 2"
"Satisfied when predictions are correct and space narrows"
```
