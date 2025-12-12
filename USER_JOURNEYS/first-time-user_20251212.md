# Journey: First-Time User Experience (FTUE)

**Who**: A student learning algorithms
**Goal**: To understand how the algorithm visualization platform works and to explore an algorithm.
**Starting Point**: The user opens the application for the first time at `http://localhost:3000`.

---

## The Journey

### Step 1: Initial Landing Page Experience

**What happens**: Upon loading, the user sees a clean interface with "Interval Coverage" as the prominently displayed algorithm. There's a title "Interval Coverage Visualization" and "Step 1 of 23" indicating a multi-step process. A control bar shows "⏳ Predict", "Reset", "Previous" (disabled), and "Next Step" buttons. Below this, there are two main visualization panels: "Timeline Visualization" showing numerical ranges and colored legends, and "Recursive Call Stack" which initially displays "Sort intervals first to begin" and "Original unsorted intervals". There's also a "Keyboard shortcuts" button.

**User's likely thought**: "Okay, this looks like an algorithm visualization tool. 'Interval Coverage' is the current algorithm. I can step through it using 'Next Step'. I should probably sort the intervals first based on the 'Recursive Call Stack' message."

**What works well**:

-   Clear title and step indicator.
-   Intuitive "Next Step" button for progression.
-   Visual separation of controls and visualizations.

**What could be better**:

-   The term "Interval Coverage" might not be immediately clear to a complete beginner.
-   The "Recursive Call Stack" panel gives an instruction ("Sort intervals first") but it's not immediately obvious how to initiate that action if the user doesn't realize "Next Step" will handle it.
-   The "Interval Coverage" button at the top (ref=e12) looks like a label, not an interactive element to switch algorithms.

---

### Step 2: Sorting Intervals

**What happens**: After clicking "Next Step", the "Step 1 of 23" changes to "Step 2 of 23". The "Previous" button becomes enabled. The "Recursive Call Stack" panel now displays "Sorting intervals..." and below that, "📊 SORT" with the explanation: "Sorting intervals by start time (ascending) breaks ties by preferring longer intervals". The "Timeline Visualization" appears to remain the same visually, but the description indicates a logical change.

**User's likely thought**: "Okay, so clicking 'Next Step' actually starts the sorting process. The call stack explains what's happening. That's helpful. I can go back if I need to."

**What works well**:

-   Clear progress indicator ("Step 2 of 23").
-   "Previous" button becomes active, indicating navigability.
-   The "Recursive Call Stack" provides relevant and easy-to-understand explanations of the current algorithmic step.

**What could be better**:

-   The "Timeline Visualization" doesn't show an immediate visual change related to "Sorting intervals..." which might make the sorting step feel less dynamic.

---

### Step 3: Ready to Start Recursion

**What happens**: The step indicator changes to "Step 3 of 23". The "Recursive Call Stack" now shows "Ready to start recursion" and a message: "✓ Sorted! Now we can use a greedy strategy: process intervals left-to-right, keeping only those that extend our coverage." The "Timeline Visualization" still appears static.

**User's likely thought**: "Alright, the sorting is done. Now it's going to apply a 'greedy strategy' and process intervals. I'm ready for the next visual update to see this in action."

**What works well**:

-   Clear confirmation that sorting is complete ("✓ Sorted!").
-   Introduces the next high-level strategy ("greedy strategy: process intervals left-to-right") which helps set expectations.

**What could be better**:

-   The lack of visual changes in the "Timeline Visualization" for the initial sorting and setup steps might make these early steps feel a bit abstract, as the core visual changes are yet to appear.

---

### Step 4: First Recursive Call

**What happens**: The step indicator moves to "Step 4 of 23". The "Recursive Call Stack" panel now shows a detailed view of the first recursive call: "CALL #0", with "depth=0, remaining=3". It indicates "Examining: (540, 720)" and "max_end_so_far: -∞". A clear heading "🔄 RECURSION" is displayed, and a narrative explains: "New recursive call (depth 0): examining interval (540, 720) with 3 remaining". In the "Timeline Visualization", the interval "540-720" is likely highlighted.

**User's likely thought**: "Okay, now I'm seeing the actual algorithm steps. It's examining the first interval and keeping track of the 'max_end_so_far'. This is where the visualization should become more active."

**What works well**:

-   Detailed information about the current recursive call, including depth and remaining intervals.
-   Clear indication of the "Examining" interval, connecting the call stack to the data.
-   The "max_end_so_far" variable is introduced, which is crucial for understanding interval coverage.

**What could be better**:

-   The snapshot output doesn't explicitly describe visual changes in the "Timeline Visualization". It would be very helpful if the snapshot explicitly stated what visual elements were highlighted, changed color, or animated during this step to confirm the user's expectation of active visualization.

---

### Step 5: Prediction Mode - Decision Point

**What happens**: The step counter updates to "Step 5 of 23". The interface significantly changes to introduce a "Prediction Mode". A modal-like section appears in the main content area with a heading: "TEST: Will interval (540, 720) be kept or covered?". Below this, it prompts the user to "Make your prediction". A hint is provided: "💡 Hint: Compare interval.end (720) with max_end".

The user is presented with three buttons:
1.  "Keep this interval (Press K)"
2.  "Covered by previous (Press C)"
3.  "Skip (Press S)"

A "Submit (Enter)" button is visible but disabled.

The "Recursive Call Stack" panel now shows "🔍 EXAMINE" and the explanation: "Does interval (540, 720) extend beyond max_end=-∞ (no coverage yet)? If yes, we KEEP it; if no, it's COVERED."

**User's likely thought**: "Oh, this is an interactive learning part! I need to decide if this interval (540, 720) extends past the current 'max_end_so_far' which is -∞. Since -∞ is the smallest possible value, (540, 720) definitely extends past it, so I should 'Keep this interval'."

**What works well**:

-   Introduces an interactive "Prediction Mode" which makes learning active.
-   Clear question and hint guide the user's decision-making.
-   Keyboard shortcuts are provided for predictions, enhancing efficiency.
-   The "Recursive Call Stack" continues to offer context, reinforcing the decision logic.

**What could be better**:

-   The transition into prediction mode is sudden; a brief introductory message or animation might ease the user into this new interaction.
-   The "Skip" button might confuse a first-time user who is trying to engage with the learning.

---

### Step 6: Submitting the Prediction

**What happens**: After clicking "Keep this interval", the button appears active. The "Submit (Enter)" button, which was previously disabled, is now enabled and has a checkmark, indicating the user can finalize their choice.

**User's likely thought**: "I've made my choice. Now I need to submit it to see if I was correct and to continue the algorithm."

**What works well**:

-   Clear visual feedback that a prediction has been selected.
-   The "Submit" button becoming active with a checkmark clearly indicates the next action.

**What could be better**:

-   Perhaps an immediate visual cue or text that confirms *which* option was selected (e.g., "You chose: Keep this interval") before submitting.

---

### Step 7: Prediction Feedback and Advance

**What happens**: Upon submitting, the prediction modal is replaced by immediate feedback: a green checkmark icon with the text "Correct!". Below this, a message confirms: "Interval (540, 720) was kept." Finally, a message "Advancing to next step..." appears, indicating automatic progression.

**User's likely thought**: "Great, I was correct! The feedback is clear and instant. Now the visualization should update based on my correct prediction."

**What works well**:

-   Immediate and clear visual feedback (green checkmark, "Correct!") provides positive reinforcement.
-   Confirms the action taken for the interval, reinforcing learning.
-   Automatic advancement makes the flow smooth, indicating progress without requiring another click.

**What could be better**:

-   Nothing to improve here, this is a strong moment of delight.

---

### Step 8: Coverage Extended

**What happens**: The step counter updates to "Step 7 of 23" (Note: there was an auto-advance, so this is the step *after* the prediction feedback). The "Recursive Call Stack" now shows "✅ KEEP" with the condition "720 > -∞", confirming the decision. Below this, a "📏 COVERAGE" heading appears with the explanation: "Coverage extended: max_end updated from -∞ → 720 (now we can skip intervals ending ≤ 720)". This indicates a critical state change in the algorithm.

**User's likely thought**: "Okay, so my correct prediction caused the 'max_end' to update. This 'max_end' value is important because it tells me which intervals can be skipped. I can see how this algorithm builds coverage."

**What works well**:

-   Clear visual confirmation of the "KEEP" decision.
-   Explicit update to `max_end`, a core algorithm variable.
-   Explains the *consequence* of the `max_end` update ("now we can skip intervals ending ≤ 720"), which is very helpful for understanding.

**What could be better**:

-   Again, the lack of explicit visual changes described in the snapshot for the "Timeline Visualization" for the update of `max_end` is a minor miss. A visual highlight on the timeline showing the new `max_end` boundary would be ideal.

---

### Step 9: Second Recursive Call

**What happens**: The step counter updates to "Step 8 of 23". A new recursive call appears in the "Recursive Call Stack" as "CALL #1" with "depth=1, remaining=2". It's "Examining: (540, 660)" and `max_end_so_far` is now "720". The explanation reinforces: "New recursive call (depth 1): examining interval (540, 660) with 2 remaining". In the "Timeline Visualization", a new element "max_end: 720" is now visible, confirming the previous update.

**User's likely thought**: "Okay, so the algorithm is moving to the next interval. The 'max_end' is now 720, so I'll need to compare the end of the new interval (540, 660) with 720 in the next prediction step."

**What works well**:

-   Clearly indicates the start of a new recursive call and its parameters.
-   Explicitly shows the updated `max_end` in the "Timeline Visualization", which is a welcome visual cue.

**What could be better**:

-   The description of the "Timeline Visualization" in the snapshot output is still somewhat minimal. It would be beneficial to know if the "examining" interval (540, 660) is visually highlighted.

---

### Step 10: Prediction Mode - Second Decision

**What happens**: The step counter updates to "Step 9 of 23". The application returns to "Prediction Mode" with a similar modal. The question is now: "TEST: Will interval (540, 660) be kept or covered?". The hint is "💡 Hint: Compare interval.end (660) with max_end". The available options are the same: "Keep this interval", "Covered by previous", and "Skip". The "Submit (Enter)" button is disabled.

The "Recursive Call Stack" clarifies: "🔍 EXAMINE" and "Does interval (540, 660) extend beyond max_end=720? If yes, we KEEP it; if no, it's COVERED."

**User's likely thought**: "Okay, this time the 'max_end' is 720. The current interval (540, 660) ends at 660, which is *less than* 720. This means it's already covered by the previous interval, so I should choose 'Covered by previous'."

**What works well**:

-   Consistent prediction interface, making it easy for the user to understand the interaction.
-   The hint and call stack explanation directly guide the user's decision based on the algorithm's logic.

**What could be better**:

-   The visual representation of `max_end` on the timeline, combined with the current interval, could be more pronounced to make the "compare" action even more intuitive.

---

### Step 11: Submitting Second Prediction

**What happens**: After clicking "Covered by previous", the button becomes active. The "Submit (Enter) ✓" button is now enabled, allowing the user to finalize their choice.

**User's likely thought**: "I've made my choice that this interval is covered. Time to submit and see if I'm right."

**What works well**:

-   Consistent feedback mechanism for selected prediction.
-   Clear indication that the prediction is ready for submission.

**What could be better**:

-   Similar to the first prediction, a clear text confirmation of the selected option before submission could be helpful.

---

### Step 12: Second Prediction Feedback and Advance

**What happens**: Upon submitting, immediate feedback is provided: a green checkmark icon with "Correct!". The message confirms: "Interval (540, 660) is covered by a previous interval." The "Advancing to next step..." message appears, indicating automatic progression.

**User's likely thought**: "Another correct prediction! This is a great way to learn. I can see how the algorithm uses 'max_end' to determine coverage."

**What works well**:

-   Immediate and clear positive feedback for a correct prediction.
-   Confirms the algorithmic outcome ("covered by a previous interval").
-   Automatic advancement keeps the flow smooth.

**What could be better**:

-   Nothing to improve here, this continues to be a strong moment of delight and reinforcement.

---

## Journey Summary

**Overall Experience**: The first-time user experience is generally positive and highly engaging, especially due to the interactive prediction mode. The application effectively guides the user through the "Interval Coverage" algorithm step-by-step. The "Recursive Call Stack" panel provides excellent contextual explanations for each algorithmic action and prediction decision. While the initial setup steps (sorting) lack prominent visual changes in the timeline, the prediction mode successfully engages the user and provides clear, immediate feedback. The interface is clean, and the core actions (Next Step, Prediction buttons) are intuitive. The "Interval Coverage" algorithm name and the non-obvious clickable algorithm switcher are minor friction points.

**Time to Complete**: Approximately 5-7 minutes for the observed steps (Steps 1-12).

**Difficulty Level**: Easy to Moderate for a user with some basic understanding of algorithms or logic, primarily due to the clear explanations and interactive guidance. A complete novice might find the initial terminology slightly challenging without prior context.

**Key Insights**:

1.  **Prediction Mode is a Highlight**: The interactive prediction mode is highly effective for active learning and user engagement, providing clear feedback and reinforcing understanding.
2.  **Call Stack Clarity**: The "Recursive Call Stack" panel is crucial for explaining the "why" behind each step and prediction, translating complex logic into understandable narratives.
3.  **Initial Terminology & Affordance**: The term "Interval Coverage" might benefit from a brief tooltip or intro for first-time users. The algorithm switcher (top button) lacks visual affordance, making it seem non-interactive.
4.  **Visual Alignment**: While the call stack explains updates to `max_end` and interval examination, explicit visual highlights or animations in the "Timeline Visualization" for these changes would further enhance comprehension.

**Recommendations**:

-   **Enhance Algorithm Switcher Discoverability**: Add a subtle "Change Algorithm" label or a more visually prominent icon next to the algorithm name at the top to indicate its interactivity.
-   **Tooltip for "Interval Coverage"**: Implement a tooltip for the "Interval Coverage" title that briefly explains what the algorithm does when hovered over.
-   **Visual Feedback for `max_end` and Examined Intervals**: Ensure that the "Timeline Visualization" provides clear visual cues (e.g., highlighting, distinct coloring, animation) for the `max_end` value and the currently examined interval during each step and especially during prediction phases. This will better align the visual experience with the textual explanations.
-   **Soft Introduction to Prediction Mode**: Consider a very brief, one-time interstitial message or a subtle animation when Prediction Mode is first encountered, explaining its purpose.

---

## Emotional Journey Map

```
Start Mid-Journey End
😊 Confident → 🤔 Curious → 💡 Aha! → ✅ Satisfied
↓
"Slightly confused by initial 'Interval Coverage' term"
"Engaged by prediction mode, felt smart when correct"
```
