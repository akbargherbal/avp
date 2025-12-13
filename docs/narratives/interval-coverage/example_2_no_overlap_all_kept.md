# Interval Coverage Execution Narrative

**Algorithm:** Interval Coverage
**Input Size:** 3 intervals
**Output Size:** 3 intervals kept
**Removed:** 0 intervals (covered)

**Input Intervals:**
```
Interval 1: [ 100,  200] (blue)
Interval 2: [ 300,  400] (green)
Interval 3: [ 500,  600] (amber)
```

**Final Result:**
```
Interval 1: [ 100,  200] (KEPT)
Interval 2: [ 300,  400] (KEPT)
Interval 3: [ 500,  600] (KEPT)
```

---

## Step 0: Original unsorted intervals

**Configuration:**
- Total intervals: 3
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
Interval 1: [ 100,  200]
Interval 2: [ 300,  400]
Interval 3: [ 500,  600]
```

*Now we process these left-to-right, keeping track of how far our coverage extends.*

---

## Step 3: New recursive call (depth 0): examining interval (100, 200) with 2 remaining

**Recursive Call #0** (Depth 0)

**Current State:**
- Examining: Interval 1 [100, 200]
- Current coverage (max_end): -∞
- Remaining intervals: 2

---

## Step 4: Does interval (100, 200) extend beyond max_end=-∞ (no coverage yet)? If yes, we KEEP it; if no, it's COVERED.

**Comparison:**
- Interval end: `200`
- Current max_end: `-∞ (no coverage yet)`
- Question: Does `200 > -∞ (no coverage yet)`?

**Decision Logic:**
- If YES: This interval **extends coverage** → KEEP it
- If NO: This interval is **already covered** → Skip it

---

## Step 5: ✅ KEEP: end=200 > max_end=-∞ — this interval extends our coverage, so we must keep it.

✅ **DECISION: KEEP**

**Reason:** `end=200 > max_end=None`
- Interval 1 [100, 200] extends our coverage
- It reaches beyond our current max_end
- Action: Keep this interval, update max_end

---

## Step 6: Coverage extended: max_end updated from -∞ → 200 (now we can skip intervals ending ≤ 200)

📊 **Coverage Extended**

**Update:**
- Previous max_end: `-∞`
- New max_end: `200` (from interval 1)
- Impact: Any interval ending ≤ 200 will now be considered covered

---

  ## Step 7: New recursive call (depth 1): examining interval (300, 400) with 1 remaining

  **Recursive Call #1** (Depth 1)

  **Current State:**
  - Examining: Interval 2 [300, 400]
  - Current coverage (max_end): 200
  - Remaining intervals: 1

---

  ## Step 8: Does interval (300, 400) extend beyond max_end=200? If yes, we KEEP it; if no, it's COVERED.

  **Comparison:**
  - Interval end: `400`
  - Current max_end: `200`
  - Question: Does `400 > 200`?

  **Decision Logic:**
  - If YES: This interval **extends coverage** → KEEP it
  - If NO: This interval is **already covered** → Skip it

---

  ## Step 9: ✅ KEEP: end=400 > max_end=200 — this interval extends our coverage, so we must keep it.

  ✅ **DECISION: KEEP**

  **Reason:** `end=400 > max_end=200`
  - Interval 2 [300, 400] extends our coverage
  - It reaches beyond our current max_end
  - Action: Keep this interval, update max_end

---

  ## Step 10: Coverage extended: max_end updated from 200 → 400 (now we can skip intervals ending ≤ 400)

  📊 **Coverage Extended**

  **Update:**
  - Previous max_end: `200`
  - New max_end: `400` (from interval 2)
  - Impact: Any interval ending ≤ 400 will now be considered covered

---

    ## Step 11: New recursive call (depth 2): examining interval (500, 600) with 0 remaining

    **Recursive Call #2** (Depth 2)

    **Current State:**
    - Examining: Interval 3 [500, 600]
    - Current coverage (max_end): 400
    - Remaining intervals: 0

---

    ## Step 12: Does interval (500, 600) extend beyond max_end=400? If yes, we KEEP it; if no, it's COVERED.

    **Comparison:**
    - Interval end: `600`
    - Current max_end: `400`
    - Question: Does `600 > 400`?

    **Decision Logic:**
    - If YES: This interval **extends coverage** → KEEP it
    - If NO: This interval is **already covered** → Skip it

---

    ## Step 13: ✅ KEEP: end=600 > max_end=400 — this interval extends our coverage, so we must keep it.

    ✅ **DECISION: KEEP**

    **Reason:** `end=600 > max_end=400`
    - Interval 3 [500, 600] extends our coverage
    - It reaches beyond our current max_end
    - Action: Keep this interval, update max_end

---

    ## Step 14: Coverage extended: max_end updated from 400 → 600 (now we can skip intervals ending ≤ 600)

    📊 **Coverage Extended**

    **Update:**
    - Previous max_end: `400`
    - New max_end: `600` (from interval 3)
    - Impact: Any interval ending ≤ 600 will now be considered covered

---

    ## Step 15: Base case: no more intervals to process, return empty result

    **Base Case Reached** (Call #3)

    - No more intervals to process
    - Final max_end for this branch: 600
    - Return: Empty list `[]`

---

    ## Step 16: ↩️ Returning from call #2: kept 1 interval(s) from this branch

    ↩️ **Return from Call #2**

    **Results:**
    - Depth: 2
    - Intervals kept: 1
    - Kept intervals: #3

---

  ## Step 17: ↩️ Returning from call #1: kept 2 interval(s) from this branch

  ↩️ **Return from Call #1**

  **Results:**
  - Depth: 1
  - Intervals kept: 2
  - Kept intervals: #2, #3

---

## Step 18: ↩️ Returning from call #0: kept 3 interval(s) from this branch

↩️ **Return from Call #0**

**Results:**
- Depth: 0
- Intervals kept: 3
- Kept intervals: #1, #2, #3

---

## Step 19: 🎉 Algorithm complete! Kept 3 essential intervals, removed 0 covered intervals.

🎉 **Algorithm Complete!**

**Summary:**
- Total intervals processed: 3
- Intervals kept: **3**
- Intervals removed (covered): 0

**Final Kept Intervals:**
```
Interval 1: [ 100,  200]
Interval 2: [ 300,  400]
Interval 3: [ 500,  600]
```

---

## Execution Summary

**Algorithm Strategy:**
1. Sort intervals by start time (ascending), breaking ties by end time (descending)
2. Process intervals left-to-right using recursive filtering
3. Track coverage with `max_end` variable
4. Keep intervals that extend coverage, skip those already covered

**Performance:**
- Input: 3 intervals
- Output: 3 intervals
- Reduction: 0 intervals removed
- Time Complexity: O(n log n) for sorting + O(n) for filtering = **O(n log n)**
- Space Complexity: O(n) for recursion stack

**Key Insight:**
By processing sorted intervals left-to-right and tracking the rightmost coverage point (max_end), we can identify covered intervals in a single pass. An interval is covered if its end point doesn't extend beyond the current coverage (interval.end ≤ max_end).

