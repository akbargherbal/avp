# Interval Coverage Execution Narrative

**Algorithm:** Interval Coverage
**Input Size:** 6 intervals
**Output Size:** 5 intervals kept
**Removed:** 1 intervals (covered)

**Input Intervals:**
```
Interval 1: [   0,  300] (blue)
Interval 2: [ 100,  200] (green)
Interval 3: [ 250,  500] (amber)
Interval 4: [ 150,  350] (purple)
Interval 5: [ 600,  700] (red)
Interval 6: [ 650,  800] (orange)
```

**Final Result:**
```
Interval 1: [   0,  300] (KEPT)
Interval 4: [ 150,  350] (KEPT)
Interval 3: [ 250,  500] (KEPT)
Interval 5: [ 600,  700] (KEPT)
Interval 6: [ 650,  800] (KEPT)
```

---

## Step 0: Original unsorted intervals

**Configuration:**
- Total intervals: 6
- Strategy: Greedy recursive filtering
- Sort order: By start time (ascending), then by end time (descending)

---

## Step 1: Sorting intervals by start time (ascending) breaks ties by preferring longer intervals

**Sorting Strategy:**
- Primary key: `start` (ascending) - process left to right
- Secondary key: `end` (descending) - prefer longer intervals when tied

*Why this order?* Processing left-to-right lets us track coverage with a single `max_end` variable.

---

## Step 2: ✓ Sorted! Now we can use a greedy strategy: process intervals left-to-right, keeping only those that extend our coverage.

**Sorted Intervals:**
```
Interval 1: [   0,  300]
Interval 2: [ 100,  200]
Interval 4: [ 150,  350]
Interval 3: [ 250,  500]
Interval 5: [ 600,  700]
Interval 6: [ 650,  800]
```

*Now we process these left-to-right, keeping track of how far our coverage extends.*

---

## Step 3: New recursive call (depth 0): examining interval (0, 300) with 5 remaining

**Recursive Call #0** (Depth 0)

**Current State:**
- Examining: Interval 1 [0, 300]
- Current coverage (max_end): -∞
- Remaining intervals: 5

---

## Step 4: Does interval (0, 300) extend beyond max_end=-∞ (no coverage yet)? If yes, we KEEP it; if no, it's COVERED.

**Comparison:**
- Interval end: `300`
- Current max_end: `-∞ (no coverage yet)`
- Question: Does `300 > -∞ (no coverage yet)`?

**Decision Logic:**
- If YES: This interval **extends coverage** → KEEP it
- If NO: This interval is **already covered** → Skip it

---

## Step 5: ✅ KEEP: end=300 > max_end=-∞ — this interval extends our coverage, so we must keep it.

✅ **DECISION: KEEP**

**Reason:** `end=300 > max_end=None`
- Interval 1 [0, 300] extends our coverage
- It reaches beyond our current max_end
- Action: Keep this interval, update max_end

---

## Step 6: Coverage extended: max_end updated from -∞ → 300 (now we can skip intervals ending ≤ 300)

📊 **Coverage Extended**

**Update:**
- Previous max_end: `-∞`
- New max_end: `300` (from interval 1)
- Impact: Any interval ending ≤ 300 will now be considered covered

---

  ## Step 7: New recursive call (depth 1): examining interval (100, 200) with 4 remaining

  **Recursive Call #1** (Depth 1)

  **Current State:**
  - Examining: Interval 2 [100, 200]
  - Current coverage (max_end): 300
  - Remaining intervals: 4

---

  ## Step 8: Does interval (100, 200) extend beyond max_end=300? If yes, we KEEP it; if no, it's COVERED.

  **Comparison:**
  - Interval end: `200`
  - Current max_end: `300`
  - Question: Does `200 > 300`?

  **Decision Logic:**
  - If YES: This interval **extends coverage** → KEEP it
  - If NO: This interval is **already covered** → Skip it

---

  ## Step 9: ❌ COVERED: end=200 ≤ max_end=300 — an earlier interval already covers this range, so we can skip it safely.

  ❌ **DECISION: COVERED**

  **Reason:** `end=200 <= max_end=300`
  - Interval 2 [100, 200] is completely covered
  - An earlier interval already extends to 200 or beyond
  - Action: Skip this interval, continue with same max_end

---

    ## Step 10: New recursive call (depth 2): examining interval (150, 350) with 3 remaining

    **Recursive Call #2** (Depth 2)

    **Current State:**
    - Examining: Interval 4 [150, 350]
    - Current coverage (max_end): 300
    - Remaining intervals: 3

---

    ## Step 11: Does interval (150, 350) extend beyond max_end=300? If yes, we KEEP it; if no, it's COVERED.

    **Comparison:**
    - Interval end: `350`
    - Current max_end: `300`
    - Question: Does `350 > 300`?

    **Decision Logic:**
    - If YES: This interval **extends coverage** → KEEP it
    - If NO: This interval is **already covered** → Skip it

---

    ## Step 12: ✅ KEEP: end=350 > max_end=300 — this interval extends our coverage, so we must keep it.

    ✅ **DECISION: KEEP**

    **Reason:** `end=350 > max_end=300`
    - Interval 4 [150, 350] extends our coverage
    - It reaches beyond our current max_end
    - Action: Keep this interval, update max_end

---

    ## Step 13: Coverage extended: max_end updated from 300 → 350 (now we can skip intervals ending ≤ 350)

    📊 **Coverage Extended**

    **Update:**
    - Previous max_end: `300`
    - New max_end: `350` (from interval 4)
    - Impact: Any interval ending ≤ 350 will now be considered covered

---

      ## Step 14: New recursive call (depth 3): examining interval (250, 500) with 2 remaining

      **Recursive Call #3** (Depth 3)

      **Current State:**
      - Examining: Interval 3 [250, 500]
      - Current coverage (max_end): 350
      - Remaining intervals: 2

---

      ## Step 15: Does interval (250, 500) extend beyond max_end=350? If yes, we KEEP it; if no, it's COVERED.

      **Comparison:**
      - Interval end: `500`
      - Current max_end: `350`
      - Question: Does `500 > 350`?

      **Decision Logic:**
      - If YES: This interval **extends coverage** → KEEP it
      - If NO: This interval is **already covered** → Skip it

---

      ## Step 16: ✅ KEEP: end=500 > max_end=350 — this interval extends our coverage, so we must keep it.

      ✅ **DECISION: KEEP**

      **Reason:** `end=500 > max_end=350`
      - Interval 3 [250, 500] extends our coverage
      - It reaches beyond our current max_end
      - Action: Keep this interval, update max_end

---

      ## Step 17: Coverage extended: max_end updated from 350 → 500 (now we can skip intervals ending ≤ 500)

      📊 **Coverage Extended**

      **Update:**
      - Previous max_end: `350`
      - New max_end: `500` (from interval 3)
      - Impact: Any interval ending ≤ 500 will now be considered covered

---

        ## Step 18: New recursive call (depth 4): examining interval (600, 700) with 1 remaining

        **Recursive Call #4** (Depth 4)

        **Current State:**
        - Examining: Interval 5 [600, 700]
        - Current coverage (max_end): 500
        - Remaining intervals: 1

---

        ## Step 19: Does interval (600, 700) extend beyond max_end=500? If yes, we KEEP it; if no, it's COVERED.

        **Comparison:**
        - Interval end: `700`
        - Current max_end: `500`
        - Question: Does `700 > 500`?

        **Decision Logic:**
        - If YES: This interval **extends coverage** → KEEP it
        - If NO: This interval is **already covered** → Skip it

---

        ## Step 20: ✅ KEEP: end=700 > max_end=500 — this interval extends our coverage, so we must keep it.

        ✅ **DECISION: KEEP**

        **Reason:** `end=700 > max_end=500`
        - Interval 5 [600, 700] extends our coverage
        - It reaches beyond our current max_end
        - Action: Keep this interval, update max_end

---

        ## Step 21: Coverage extended: max_end updated from 500 → 700 (now we can skip intervals ending ≤ 700)

        📊 **Coverage Extended**

        **Update:**
        - Previous max_end: `500`
        - New max_end: `700` (from interval 5)
        - Impact: Any interval ending ≤ 700 will now be considered covered

---

          ## Step 22: New recursive call (depth 5): examining interval (650, 800) with 0 remaining

          **Recursive Call #5** (Depth 5)

          **Current State:**
          - Examining: Interval 6 [650, 800]
          - Current coverage (max_end): 700
          - Remaining intervals: 0

---

          ## Step 23: Does interval (650, 800) extend beyond max_end=700? If yes, we KEEP it; if no, it's COVERED.

          **Comparison:**
          - Interval end: `800`
          - Current max_end: `700`
          - Question: Does `800 > 700`?

          **Decision Logic:**
          - If YES: This interval **extends coverage** → KEEP it
          - If NO: This interval is **already covered** → Skip it

---

          ## Step 24: ✅ KEEP: end=800 > max_end=700 — this interval extends our coverage, so we must keep it.

          ✅ **DECISION: KEEP**

          **Reason:** `end=800 > max_end=700`
          - Interval 6 [650, 800] extends our coverage
          - It reaches beyond our current max_end
          - Action: Keep this interval, update max_end

---

          ## Step 25: Coverage extended: max_end updated from 700 → 800 (now we can skip intervals ending ≤ 800)

          📊 **Coverage Extended**

          **Update:**
          - Previous max_end: `700`
          - New max_end: `800` (from interval 6)
          - Impact: Any interval ending ≤ 800 will now be considered covered

---

          ## Step 26: Base case: no more intervals to process, return empty result

          **Base Case Reached** (Call #6)

          - No more intervals to process
          - Final max_end for this branch: 800
          - Return: Empty list `[]`

---

          ## Step 27: ↩️ Returning from call #5: kept 1 interval(s) from this branch

          ↩️ **Return from Call #5**

          **Results:**
          - Depth: 5
          - Intervals kept: 1
          - Kept intervals: #6

---

        ## Step 28: ↩️ Returning from call #4: kept 2 interval(s) from this branch

        ↩️ **Return from Call #4**

        **Results:**
        - Depth: 4
        - Intervals kept: 2
        - Kept intervals: #5, #6

---

      ## Step 29: ↩️ Returning from call #3: kept 3 interval(s) from this branch

      ↩️ **Return from Call #3**

      **Results:**
      - Depth: 3
      - Intervals kept: 3
      - Kept intervals: #3, #5, #6

---

    ## Step 30: ↩️ Returning from call #2: kept 4 interval(s) from this branch

    ↩️ **Return from Call #2**

    **Results:**
    - Depth: 2
    - Intervals kept: 4
    - Kept intervals: #4, #3, #5, #6

---

  ## Step 31: ↩️ Returning from call #1: kept 4 interval(s) from this branch

  ↩️ **Return from Call #1**

  **Results:**
  - Depth: 1
  - Intervals kept: 4
  - Kept intervals: #4, #3, #5, #6

---

## Step 32: ↩️ Returning from call #0: kept 5 interval(s) from this branch

↩️ **Return from Call #0**

**Results:**
- Depth: 0
- Intervals kept: 5
- Kept intervals: #1, #4, #3, #5, #6

---

## Step 33: 🎉 Algorithm complete! Kept 5 essential intervals, removed 1 covered intervals.

🎉 **Algorithm Complete!**

**Summary:**
- Total intervals processed: 6
- Intervals kept: **5**
- Intervals removed (covered): 1

**Final Kept Intervals:**
```
Interval 1: [   0,  300]
Interval 4: [ 150,  350]
Interval 3: [ 250,  500]
Interval 5: [ 600,  700]
Interval 6: [ 650,  800]
```

---

## Execution Summary

**Algorithm Strategy:**
1. Sort intervals by start time (ascending), breaking ties by end time (descending)
2. Process intervals left-to-right using recursive filtering
3. Track coverage with `max_end` variable
4. Keep intervals that extend coverage, skip those already covered

**Performance:**
- Input: 6 intervals
- Output: 5 intervals
- Reduction: 1 intervals removed
- Time Complexity: O(n log n) for sorting + O(n) for filtering = **O(n log n)**
- Space Complexity: O(n) for recursion stack

**Key Insight:**
By processing sorted intervals left-to-right and tracking the rightmost coverage point (max_end), we can identify covered intervals in a single pass. An interval is covered if its end point doesn't extend beyond the current coverage (interval.end ≤ max_end).

