# Interval Coverage Execution Narrative

**Algorithm:** Interval Coverage
**Input Size:** 4 intervals
**Output Size:** 1 intervals kept
**Removed:** 3 intervals (covered)

**Input Intervals:**
```
Interval 1: [ 100,  500] (blue)
Interval 2: [ 150,  250] (green)
Interval 3: [ 200,  300] (amber)
Interval 4: [ 350,  450] (purple)
```

**Final Result:**
```
Interval 1: [ 100,  500] (KEPT)
```

---

## Step 0: Original unsorted intervals

**Configuration:**
- Total intervals: 4
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
Interval 1: [ 100,  500]
Interval 2: [ 150,  250]
Interval 3: [ 200,  300]
Interval 4: [ 350,  450]
```

*Now we process these left-to-right, keeping track of how far our coverage extends.*

---

## Step 3: New recursive call (depth 0): examining interval (100, 500) with 3 remaining

**Recursive Call #0** (Depth 0)

**Current State:**
- Examining: Interval 1 [100, 500]
- Current coverage (max_end): -∞
- Remaining intervals: 3

---

## Step 4: Does interval (100, 500) extend beyond max_end=-∞ (no coverage yet)? If yes, we KEEP it; if no, it's COVERED.

**Comparison:**
- Interval end: `500`
- Current max_end: `-∞ (no coverage yet)`
- Question: Does `500 > -∞ (no coverage yet)`?

**Decision Logic:**
- If YES: This interval **extends coverage** → KEEP it
- If NO: This interval is **already covered** → Skip it

---

## Step 5: ✅ KEEP: end=500 > max_end=-∞ — this interval extends our coverage, so we must keep it.

✅ **DECISION: KEEP**

**Reason:** `end=500 > max_end=None`
- Interval 1 [100, 500] extends our coverage
- It reaches beyond our current max_end
- Action: Keep this interval, update max_end

---

## Step 6: Coverage extended: max_end updated from -∞ → 500 (now we can skip intervals ending ≤ 500)

📊 **Coverage Extended**

**Update:**
- Previous max_end: `-∞`
- New max_end: `500` (from interval 1)
- Impact: Any interval ending ≤ 500 will now be considered covered

---

  ## Step 7: New recursive call (depth 1): examining interval (150, 250) with 2 remaining

  **Recursive Call #1** (Depth 1)

  **Current State:**
  - Examining: Interval 2 [150, 250]
  - Current coverage (max_end): 500
  - Remaining intervals: 2

---

  ## Step 8: Does interval (150, 250) extend beyond max_end=500? If yes, we KEEP it; if no, it's COVERED.

  **Comparison:**
  - Interval end: `250`
  - Current max_end: `500`
  - Question: Does `250 > 500`?

  **Decision Logic:**
  - If YES: This interval **extends coverage** → KEEP it
  - If NO: This interval is **already covered** → Skip it

---

  ## Step 9: ❌ COVERED: end=250 ≤ max_end=500 — an earlier interval already covers this range, so we can skip it safely.

  ❌ **DECISION: COVERED**

  **Reason:** `end=250 <= max_end=500`
  - Interval 2 [150, 250] is completely covered
  - An earlier interval already extends to 250 or beyond
  - Action: Skip this interval, continue with same max_end

---

    ## Step 10: New recursive call (depth 2): examining interval (200, 300) with 1 remaining

    **Recursive Call #2** (Depth 2)

    **Current State:**
    - Examining: Interval 3 [200, 300]
    - Current coverage (max_end): 500
    - Remaining intervals: 1

---

    ## Step 11: Does interval (200, 300) extend beyond max_end=500? If yes, we KEEP it; if no, it's COVERED.

    **Comparison:**
    - Interval end: `300`
    - Current max_end: `500`
    - Question: Does `300 > 500`?

    **Decision Logic:**
    - If YES: This interval **extends coverage** → KEEP it
    - If NO: This interval is **already covered** → Skip it

---

    ## Step 12: ❌ COVERED: end=300 ≤ max_end=500 — an earlier interval already covers this range, so we can skip it safely.

    ❌ **DECISION: COVERED**

    **Reason:** `end=300 <= max_end=500`
    - Interval 3 [200, 300] is completely covered
    - An earlier interval already extends to 300 or beyond
    - Action: Skip this interval, continue with same max_end

---

      ## Step 13: New recursive call (depth 3): examining interval (350, 450) with 0 remaining

      **Recursive Call #3** (Depth 3)

      **Current State:**
      - Examining: Interval 4 [350, 450]
      - Current coverage (max_end): 500
      - Remaining intervals: 0

---

      ## Step 14: Does interval (350, 450) extend beyond max_end=500? If yes, we KEEP it; if no, it's COVERED.

      **Comparison:**
      - Interval end: `450`
      - Current max_end: `500`
      - Question: Does `450 > 500`?

      **Decision Logic:**
      - If YES: This interval **extends coverage** → KEEP it
      - If NO: This interval is **already covered** → Skip it

---

      ## Step 15: ❌ COVERED: end=450 ≤ max_end=500 — an earlier interval already covers this range, so we can skip it safely.

      ❌ **DECISION: COVERED**

      **Reason:** `end=450 <= max_end=500`
      - Interval 4 [350, 450] is completely covered
      - An earlier interval already extends to 450 or beyond
      - Action: Skip this interval, continue with same max_end

---

      ## Step 16: Base case: no more intervals to process, return empty result

      **Base Case Reached** (Call #4)

      - No more intervals to process
      - Final max_end for this branch: 500
      - Return: Empty list `[]`

---

      ## Step 17: ↩️ Returning from call #3: kept 0 interval(s) from this branch

      ↩️ **Return from Call #3**

      **Results:**
      - Depth: 3
      - Intervals kept: 0
      - Kept intervals: (none)

---

    ## Step 18: ↩️ Returning from call #2: kept 0 interval(s) from this branch

    ↩️ **Return from Call #2**

    **Results:**
    - Depth: 2
    - Intervals kept: 0
    - Kept intervals: (none)

---

  ## Step 19: ↩️ Returning from call #1: kept 0 interval(s) from this branch

  ↩️ **Return from Call #1**

  **Results:**
  - Depth: 1
  - Intervals kept: 0
  - Kept intervals: (none)

---

## Step 20: ↩️ Returning from call #0: kept 1 interval(s) from this branch

↩️ **Return from Call #0**

**Results:**
- Depth: 0
- Intervals kept: 1
- Kept intervals: #1

---

## Step 21: 🎉 Algorithm complete! Kept 1 essential intervals, removed 3 covered intervals.

🎉 **Algorithm Complete!**

**Summary:**
- Total intervals processed: 4
- Intervals kept: **1**
- Intervals removed (covered): 3

**Final Kept Intervals:**
```
Interval 1: [ 100,  500]
```

---

## Execution Summary

**Algorithm Strategy:**
1. Sort intervals by start time (ascending), breaking ties by end time (descending)
2. Process intervals left-to-right using recursive filtering
3. Track coverage with `max_end` variable
4. Keep intervals that extend coverage, skip those already covered

**Performance:**
- Input: 4 intervals
- Output: 1 intervals
- Reduction: 3 intervals removed
- Time Complexity: O(n log n) for sorting + O(n) for filtering = **O(n log n)**
- Space Complexity: O(n) for recursion stack

**Key Insight:**
By processing sorted intervals left-to-right and tracking the rightmost coverage point (max_end), we can identify covered intervals in a single pass. An interval is covered if its end point doesn't extend beyond the current coverage (interval.end ≤ max_end).

