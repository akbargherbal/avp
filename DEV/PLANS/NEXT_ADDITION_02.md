Based on the **Algorithm Suitability Assessment Framework**, here are the top 10 algorithms that score highest.

**Selection Strategy:**
These algorithms are prioritized because they:
1.  **Maximize Reuse:** Utilize existing `ArrayView` or `TimelineView` components (Tier 1 Visual Fit).
2.  **High Interaction:** Offer clear binary/ternary choices for predictions (Pedagogy).
3.  **Clean Dashboarding:** Map perfectly to the 5-Zone Unified Dashboard.

They represent "Low Hanging Fruit" — high educational value with minimal new frontend development.

---

### 🟢 Tier 1: Sorting (High Reuse of `ArrayView`)

These are the highest scoring candidates. They reuse the existing `ArrayView` and have very clear "Swap vs. No Swap" decision points.

#### 1. Quick Sort
*   **Score:** 25/25
*   **Why:** The "Pivot" mechanic is perfect for the Unified Dashboard.
*   **Prediction:** "Compare element X with Pivot P. Move Left or Right?" (Binary Choice).
*   **Dashboard Map:**
    *   *Zone 1 (Focus):* Current Element & Pivot.
    *   *Zone 3 (Logic):* `arr[i] < pivot`.
    *   *Zone 4 (Action):* "SWAP" or "IGNORE".

#### 2. Bubble Sort
*   **Score:** 25/25
*   **Why:** The simplest algorithm to visualize. Excellent for early learners.
*   **Prediction:** "Compare A and B. Swap?" (Binary Choice).
*   **Dashboard Map:**
    *   *Zone 1 (Focus):* Pair `(j, j+1)`.
    *   *Zone 3 (Logic):* `arr[j] > arr[j+1]`.
    *   *Zone 4 (Action):* "BUBBLE UP".

#### 3. Insertion Sort
*   **Score:** 24/25
*   **Why:** Distinct visual pattern (sorted part grows).
*   **Prediction:** "Is current element smaller than left neighbor? Shift?" (Binary Choice).
*   **Dashboard Map:**
    *   *Zone 1 (Focus):* Element being inserted.
    *   *Zone 3 (Logic):* `current < prev`.
    *   *Zone 4 (Action):* "SHIFT RIGHT".

#### 4. Selection Sort
*   **Score:** 24/25
*   **Why:** Clear distinction between "scanning" and "swapping".
*   **Prediction:** "Is this new element smaller than current minimum?" (Binary Choice).
*   **Dashboard Map:**
    *   *Zone 1 (Focus):* Current Scan & Current Min.
    *   *Zone 3 (Logic):* `current < min_so_far`.
    *   *Zone 4 (Action):* "UPDATE MIN".

---

### 🔵 Tier 2: Interval & Timeline (High Reuse of `TimelineView`)

These reuse the `TimelineView` built for Interval Coverage.

#### 5. Merge Intervals
*   **Score:** 24/25
*   **Why:** Logic is nearly identical to Interval Coverage but with a "Merge" action.
*   **Prediction:** "Do these intervals overlap?" (Binary Choice).
*   **Dashboard Map:**
    *   *Zone 1 (Focus):* Current Interval vs Last Merged.
    *   *Zone 3 (Logic):* `current.start <= last.end`.
    *   *Zone 4 (Action):* "MERGE & EXTEND".

#### 6. Meeting Rooms (I & II)
*   **Score:** 23/25
*   **Why:** Classic interview problem. Visualizes "stacking" intervals.
*   **Prediction:** "Can we fit this meeting in the current room?" (Binary Choice).
*   **Dashboard Map:**
    *   *Zone 1 (Focus):* Incoming Meeting.
    *   *Zone 3 (Logic):* `start >= earliest_end_time`.
    *   *Zone 4 (Action):* "ALLOCATE ROOM".

---

### 🟣 Tier 3: Advanced Array/Pointer (High Reuse of `ArrayView`)

These use the `ArrayView` but introduce slightly more complex logic (perfect for intermediate learners).

#### 7. Container With Most Water
*   **Score:** 23/25
*   **Why:** Excellent Two-Pointer variation.
*   **Prediction:** "Which pointer should move? Left (height X) or Right (height Y)?" (Binary Choice).
*   **Dashboard Map:**
    *   *Zone 1 (Focus):* Left & Right Bars.
    *   *Zone 2 (Goal):* Max Area Found.
    *   *Zone 3 (Logic):* `height[left] < height[right]`.
    *   *Zone 4 (Action):* "MOVE LEFT".

#### 8. Dutch National Flag (Sort Colors)
*   **Score:** 22/25
*   **Why:** Three-pointer logic (Low, Mid, High) is visually distinct (Red, White, Blue).
*   **Prediction:** "Current is 0 (Red). Swap with Low or High?" (Ternary Choice).
*   **Dashboard Map:**
    *   *Zone 1 (Focus):* Current Element (Color).
    *   *Zone 3 (Logic):* `val == 0` vs `val == 2`.
    *   *Zone 4 (Action):* "SWAP LOW".

#### 9. Kadane's Algorithm (Max Subarray)
*   **Score:** 22/25
*   **Why:** Dynamic Programming concept visualized on an array.
*   **Prediction:** "Should we start a new subarray or extend the current one?" (Binary Choice).
*   **Dashboard Map:**
    *   *Zone 1 (Focus):* Current Element + Current Sum.
    *   *Zone 3 (Logic):* `current_val > (current_sum + current_val)`.
    *   *Zone 4 (Action):* "RESET START".

#### 10. Boyer-Moore Voting Algorithm
*   **Score:** 21/25
*   **Why:** Very efficient, counter-intuitive logic that benefits greatly from visualization.
*   **Prediction:** "Count is 0. What happens to the candidate?" (Binary Choice).
*   **Dashboard Map:**
    *   *Zone 1 (Focus):* Current Candidate & Count.
    *   *Zone 3 (Logic):* `count == 0`.
    *   *Zone 4 (Action):* "NEW CANDIDATE".

---

### ❌ Excluded (For Now)
*   **BFS / DFS / Dijkstra:** Scored lower (Tier 2 Visual Fit) because they require building a new `GraphView` component. While pedagogically high value, they require more frontend investment than the list above.
*   **Heap Sort:** Requires a `TreeView` or `HeapView`.

### Recommendation
Start with **Quick Sort** and **Merge Intervals**. They cover both primary visualization types (`Array` and `Timeline`) and complete the "Basic Sorting" and "Interval" suites.