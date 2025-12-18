# Sliding Window: Maximum Sum Subarray

**Input Array:** `[1, 2, 3, 4, 5, 6]`
**Window Size (k):** `3`
**Goal:** Find the contiguous subarray of size 3 with the maximum sum.
**Result:** Found a maximum sum of **15** with the subarray `[4, 5, 6]`.

**State Legend:** `in_w` = In Window, `next` = Next to Enter, `unpr` = Unprocessed

---

## Step 0: 🚀 Start: Initial window of size 3 has sum 6.

**Initial State:**
```
Index: 0    1    2    3    4    5   
Value: 1    2    3    4    5    6   
State: in_w in_w in_w next unpr unpr
```
- **Current Sum:** 6
- **Max Sum:** 6
- **Best Window Position:** Index 0 (initial window)

---

## Step 1: Slide Window Right

**Slide Operation (FAA Verification):**
- Previous Sum: `6`
- Remove left element (`1` at index 0): `6 - 1 = 5`
- Add new right element (`4` at index 3): `5 + 4 = 9`
- **New Sum:** `9`

**Max Sum Tracking:**
- New sum (`9`) > Previous max sum (`6`) → **Update Max Sum!** 🚀
- **Remember this position (index 1)** - it achieves our best result so far.

**Window now at indices 1-3:** `[2, 3, 4]`

**Resulting State:**
```
Index: 0    1    2    3    4    5   
Value: 1    2    3    4    5    6   
State: unpr in_w in_w in_w next unpr
```
- **Current Sum:** 9
- **Max Sum:** 9
- **Best Window Position:** Index 1

---

## Step 2: Slide Window Right

**Slide Operation (FAA Verification):**
- Previous Sum: `9`
- Remove left element (`2` at index 1): `9 - 2 = 7`
- Add new right element (`5` at index 4): `7 + 5 = 12`
- **New Sum:** `12`

**Max Sum Tracking:**
- New sum (`12`) > Previous max sum (`9`) → **Update Max Sum!** 🚀
- **Remember this position (index 2)** - it achieves our best result so far.

**Window now at indices 2-4:** `[3, 4, 5]`

**Resulting State:**
```
Index: 0    1    2    3    4    5   
Value: 1    2    3    4    5    6   
State: unpr unpr in_w in_w in_w next
```
- **Current Sum:** 12
- **Max Sum:** 12
- **Best Window Position:** Index 2

---

## Step 3: Slide Window Right

**Slide Operation (FAA Verification):**
- Previous Sum: `12`
- Remove left element (`3` at index 2): `12 - 3 = 9`
- Add new right element (`6` at index 5): `9 + 6 = 15`
- **New Sum:** `15`

**Max Sum Tracking:**
- New sum (`15`) > Previous max sum (`12`) → **Update Max Sum!** 🚀
- **Remember this position (index 3)** - it achieves our best result so far.

**Window now at indices 3-5:** `[4, 5, 6]`

**Resulting State:**
```
Index: 0    1    2    3    4    5   
Value: 1    2    3    4    5    6   
State: unpr unpr unpr in_w in_w in_w
```
- **Current Sum:** 15
- **Max Sum:** 15
- **Best Window Position:** Index 3

---

## Step 4: ✅ Complete! Maximum sum found is 15.

The window has reached the end of the array. The algorithm is complete.
**Final State:**
```
Index: 0    1    2    3    4    5   
Value: 1    2    3    4    5    6   
State: unpr unpr unpr in_w in_w in_w
```
**Final Max Sum:** `15`
**Winning Subarray (found at index 3):** `[4, 5, 6]`

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
