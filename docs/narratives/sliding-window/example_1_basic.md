# Sliding Window: Maximum Sum Subarray

**Input Array:** `[1, 5, 1, 3, 2, 5, 1, 6, 7, 0, 5]`
**Window Size (k):** `3`
**Goal:** Find the contiguous subarray of size 3 with the maximum sum.
**Result:** Found a maximum sum of **14** with the subarray `[1, 6, 7]`.

**State Legend:** `in_w` = In Window, `next` = Next to Enter, `unpr` = Unprocessed

---

## Step 0: 🚀 Start: Initial window of size 3 has sum 7.

**Initial State:**
```
Index: 0    1    2    3    4    5    6    7    8    9    10  
Value: 1    5    1    3    2    5    1    6    7    0    5   
State: in_w in_w in_w next unpr unpr unpr unpr unpr unpr unpr
```
- **Current Sum:** 7
- **Max Sum:** 7
- **Best Window Position:** Index 0 (initial window)

---

## Step 1: Slide Window Right

**Slide Operation (FAA Verification):**
- Previous Sum: `7`
- Remove left element (`1` at index 0): `7 - 1 = 6`
- Add new right element (`3` at index 3): `6 + 3 = 9`
- **New Sum:** `9`

**Max Sum Tracking:**
- New sum (`9`) > Previous max sum (`7`) → **Update Max Sum!** 🚀
- **Remember this position (index 1)** - it achieves our best result so far.

**Window now at indices 1-3:** `[5, 1, 3]`

**Resulting State:**
```
Index: 0    1    2    3    4    5    6    7    8    9    10  
Value: 1    5    1    3    2    5    1    6    7    0    5   
State: unpr in_w in_w in_w next unpr unpr unpr unpr unpr unpr
```
- **Current Sum:** 9
- **Max Sum:** 9
- **Best Window Position:** Index 1

---

## Step 2: Slide Window Right

**Slide Operation (FAA Verification):**
- Previous Sum: `9`
- Remove left element (`5` at index 1): `9 - 5 = 4`
- Add new right element (`2` at index 4): `4 + 2 = 6`
- **New Sum:** `6`

**Max Sum Tracking:**
- New sum (`6`) <= Previous max sum (`9`) → Max sum remains unchanged.

**Window now at indices 2-4:** `[1, 3, 2]`

**Resulting State:**
```
Index: 0    1    2    3    4    5    6    7    8    9    10  
Value: 1    5    1    3    2    5    1    6    7    0    5   
State: unpr unpr in_w in_w in_w next unpr unpr unpr unpr unpr
```
- **Current Sum:** 6
- **Max Sum:** 9
- **Best Window Position:** Index 1

---

## Step 3: Slide Window Right

**Slide Operation (FAA Verification):**
- Previous Sum: `6`
- Remove left element (`1` at index 2): `6 - 1 = 5`
- Add new right element (`5` at index 5): `5 + 5 = 10`
- **New Sum:** `10`

**Max Sum Tracking:**
- New sum (`10`) > Previous max sum (`9`) → **Update Max Sum!** 🚀
- **Remember this position (index 3)** - it achieves our best result so far.

**Window now at indices 3-5:** `[3, 2, 5]`

**Resulting State:**
```
Index: 0    1    2    3    4    5    6    7    8    9    10  
Value: 1    5    1    3    2    5    1    6    7    0    5   
State: unpr unpr unpr in_w in_w in_w next unpr unpr unpr unpr
```
- **Current Sum:** 10
- **Max Sum:** 10
- **Best Window Position:** Index 3

---

## Step 4: Slide Window Right

**Slide Operation (FAA Verification):**
- Previous Sum: `10`
- Remove left element (`3` at index 3): `10 - 3 = 7`
- Add new right element (`1` at index 6): `7 + 1 = 8`
- **New Sum:** `8`

**Max Sum Tracking:**
- New sum (`8`) <= Previous max sum (`10`) → Max sum remains unchanged.

**Window now at indices 4-6:** `[2, 5, 1]`

**Resulting State:**
```
Index: 0    1    2    3    4    5    6    7    8    9    10  
Value: 1    5    1    3    2    5    1    6    7    0    5   
State: unpr unpr unpr unpr in_w in_w in_w next unpr unpr unpr
```
- **Current Sum:** 8
- **Max Sum:** 10
- **Best Window Position:** Index 3

---

## Step 5: Slide Window Right

**Slide Operation (FAA Verification):**
- Previous Sum: `8`
- Remove left element (`2` at index 4): `8 - 2 = 6`
- Add new right element (`6` at index 7): `6 + 6 = 12`
- **New Sum:** `12`

**Max Sum Tracking:**
- New sum (`12`) > Previous max sum (`10`) → **Update Max Sum!** 🚀
- **Remember this position (index 5)** - it achieves our best result so far.

**Window now at indices 5-7:** `[5, 1, 6]`

**Resulting State:**
```
Index: 0    1    2    3    4    5    6    7    8    9    10  
Value: 1    5    1    3    2    5    1    6    7    0    5   
State: unpr unpr unpr unpr unpr in_w in_w in_w next unpr unpr
```
- **Current Sum:** 12
- **Max Sum:** 12
- **Best Window Position:** Index 5

---

## Step 6: Slide Window Right

**Slide Operation (FAA Verification):**
- Previous Sum: `12`
- Remove left element (`5` at index 5): `12 - 5 = 7`
- Add new right element (`7` at index 8): `7 + 7 = 14`
- **New Sum:** `14`

**Max Sum Tracking:**
- New sum (`14`) > Previous max sum (`12`) → **Update Max Sum!** 🚀
- **Remember this position (index 6)** - it achieves our best result so far.

**Window now at indices 6-8:** `[1, 6, 7]`

**Resulting State:**
```
Index: 0    1    2    3    4    5    6    7    8    9    10  
Value: 1    5    1    3    2    5    1    6    7    0    5   
State: unpr unpr unpr unpr unpr unpr in_w in_w in_w next unpr
```
- **Current Sum:** 14
- **Max Sum:** 14
- **Best Window Position:** Index 6

---

## Step 7: Slide Window Right

**Slide Operation (FAA Verification):**
- Previous Sum: `14`
- Remove left element (`1` at index 6): `14 - 1 = 13`
- Add new right element (`0` at index 9): `13 + 0 = 13`
- **New Sum:** `13`

**Max Sum Tracking:**
- New sum (`13`) <= Previous max sum (`14`) → Max sum remains unchanged.

**Window now at indices 7-9:** `[6, 7, 0]`

**Resulting State:**
```
Index: 0    1    2    3    4    5    6    7    8    9    10  
Value: 1    5    1    3    2    5    1    6    7    0    5   
State: unpr unpr unpr unpr unpr unpr unpr in_w in_w in_w next
```
- **Current Sum:** 13
- **Max Sum:** 14
- **Best Window Position:** Index 6

---

## Step 8: Slide Window Right

**Slide Operation (FAA Verification):**
- Previous Sum: `13`
- Remove left element (`6` at index 7): `13 - 6 = 7`
- Add new right element (`5` at index 10): `7 + 5 = 12`
- **New Sum:** `12`

**Max Sum Tracking:**
- New sum (`12`) <= Previous max sum (`14`) → Max sum remains unchanged.

**Window now at indices 8-10:** `[7, 0, 5]`

**Resulting State:**
```
Index: 0    1    2    3    4    5    6    7    8    9    10  
Value: 1    5    1    3    2    5    1    6    7    0    5   
State: unpr unpr unpr unpr unpr unpr unpr unpr in_w in_w in_w
```
- **Current Sum:** 12
- **Max Sum:** 14
- **Best Window Position:** Index 6

---

## Step 9: ✅ Complete! Maximum sum found is 14.

The window has reached the end of the array. The algorithm is complete.
**Final State:**
```
Index: 0    1    2    3    4    5    6    7    8    9    10  
Value: 1    5    1    3    2    5    1    6    7    0    5   
State: unpr unpr unpr unpr unpr unpr unpr unpr in_w in_w in_w
```
**Final Max Sum:** `14`
**Winning Subarray (found at index 6):** `[1, 6, 7]`

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
