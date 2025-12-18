# Sliding Window: Maximum Sum Subarray

**Input Array:** `[6, 5, 4, 3, 2, 1]`
**Window Size (k):** `4`
**Goal:** Find the contiguous subarray of size 4 with the maximum sum.
**Result:** Found a maximum sum of **18** with the subarray `[6, 5, 4, 3]`.

**State Legend:** `in_w` = In Window, `next` = Next to Enter, `unpr` = Unprocessed

---

## Step 0: 🚀 Start: Initial window of size 4 has sum 18.

**Initial State:**
```
Index: 0    1    2    3    4    5   
Value: 6    5    4    3    2    1   
State: in_w in_w in_w in_w next unpr
```
- **Current Sum:** 18
- **Max Sum:** 18
- **Best Window Position:** Index 0 (initial window)

---

## Step 1: Slide Window Right

**Slide Operation (FAA Verification):**
- Previous Sum: `18`
- Remove left element (`6` at index 0): `18 - 6 = 12`
- Add new right element (`2` at index 4): `12 + 2 = 14`
- **New Sum:** `14`

**Max Sum Tracking:**
- New sum (`14`) <= Previous max sum (`18`) → Max sum remains unchanged.

**Window now at indices 1-4:** `[5, 4, 3, 2]`

**Resulting State:**
```
Index: 0    1    2    3    4    5   
Value: 6    5    4    3    2    1   
State: unpr in_w in_w in_w in_w next
```
- **Current Sum:** 14
- **Max Sum:** 18
- **Best Window Position:** Index 0

---

## Step 2: Slide Window Right

**Slide Operation (FAA Verification):**
- Previous Sum: `14`
- Remove left element (`5` at index 1): `14 - 5 = 9`
- Add new right element (`1` at index 5): `9 + 1 = 10`
- **New Sum:** `10`

**Max Sum Tracking:**
- New sum (`10`) <= Previous max sum (`18`) → Max sum remains unchanged.

**Window now at indices 2-5:** `[4, 3, 2, 1]`

**Resulting State:**
```
Index: 0    1    2    3    4    5   
Value: 6    5    4    3    2    1   
State: unpr unpr in_w in_w in_w in_w
```
- **Current Sum:** 10
- **Max Sum:** 18
- **Best Window Position:** Index 0

---

## Step 3: ✅ Complete! Maximum sum found is 18.

The window has reached the end of the array. The algorithm is complete.
**Final State:**
```
Index: 0    1    2    3    4    5   
Value: 6    5    4    3    2    1   
State: unpr unpr in_w in_w in_w in_w
```
**Final Max Sum:** `18`
**Winning Subarray (found at index 0):** `[6, 5, 4, 3]`

---

## 🎨 Frontend Visualization Hints

### Primary Metrics to Emphasize

- **Current Sum** (`metrics.current_sum`) - Shows real-time window sum as it slides
- **Max Sum** (`metrics.max_sum`) - Shows progress toward optimal solution
- **Window Position** (`metrics.max_window_start`) - Tracks where the best window was found

### Visualization Priorities

1. **Highlight active window** - Elements with `state: 'in_window'` are the primary focus
2. **Show sum transitions** - Emphasize when `max_sum` updates (celebratory moment)
3. **Animate window movement** - Smooth slide from left to right, showing add/remove operations
4. **Visual contrast for next element** - `state: 'next'` should be distinct but not distracting

### Key JSON Paths

```
step.data.visualization.metrics.current_sum
step.data.visualization.metrics.max_sum
step.data.visualization.metrics.max_window_start
step.data.visualization.array[*].state  // 'in_window' | 'next' | 'unprocessed'
step.data.visualization.pointers.window_start
step.data.visualization.pointers.window_end
```

### Algorithm-Specific Guidance

This algorithm's efficiency comes from **reusing the previous sum** - we don't recalculate from scratch. Consider animating the "add new, remove old" operation to emphasize this optimization. The moment when `max_sum` updates is pedagogically significant - it's when the learner sees the algorithm "remember" a better solution. Visually celebrating these moments (e.g., with a brief highlight or animation) reinforces the pattern recognition that makes sliding window powerful.
