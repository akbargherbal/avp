# Merge Sort Execution Narrative

**Algorithm:** Merge Sort
**Input Array:** [5, 2, 8, 2, 9, 1, 5, 5]
**Array Size:** 8 elements
**Result:** [1, 2, 2, 5, 5, 5, 8, 9]
**Total Comparisons:** 17
**Total Merges:** 7

---

## Step 0: 🔄 Starting Merge Sort on array of 8 elements

**Configuration:**
- Input: [5, 2, 8, 2, 9, 1, 5, 5]
- Size: 8 elements
- Strategy: Recursive divide-and-conquer
- Time Complexity: O(n log n)

---

## Step 1: Split array [5, 2, 8, 2, 9, 1, 5, 5] into [5, 2, 8, 2] and [9, 1, 5, 5]

**Split Decision:**
- Array: [5, 2, 8, 2, 9, 1, 5, 5]
- Mid-point calculation: `mid = 8 // 2 = 4`
- Left half: [5, 2, 8, 2] (indices [0:4])
- Right half: [9, 1, 5, 5] (indices [4:8])

**Why split here?** Divide-and-conquer strategy: split roughly in half until we reach single elements (base case).

---

  ## Step 2: Split array [5, 2, 8, 2] into [5, 2] and [8, 2]

  **Split Decision:**
  - Array: [5, 2, 8, 2]
  - Mid-point calculation: `mid = 4 // 2 = 2`
  - Left half: [5, 2] (indices [0:2])
  - Right half: [8, 2] (indices [2:4])

  **Why split here?** Divide-and-conquer strategy: split roughly in half until we reach single elements (base case).

---

    ## Step 3: Split array [5, 2] into [5] and [2]

    **Split Decision:**
    - Array: [5, 2]
    - Mid-point calculation: `mid = 2 // 2 = 1`
    - Left half: [5] (indices [0:1])
    - Right half: [2] (indices [1:2])

    **Why split here?** Divide-and-conquer strategy: split roughly in half until we reach single elements (base case).

---

      ## Step 4: Base case: array [5] has 1 element(s), already sorted

      **Base Case Reached** (Depth 3)

      - Array: [5]
      - Size: 1 element(s)
      - Decision: Single element is already sorted, return as-is

---

      ## Step 5: Base case: array [2] has 1 element(s), already sorted

      **Base Case Reached** (Depth 3)

      - Array: [2]
      - Size: 1 element(s)
      - Decision: Single element is already sorted, return as-is

---

    ## Step 6: Merge sorted arrays [5] and [2]

    **Merge Operation Begins** (Depth 2)

    - Left sorted array: [5]
    - Right sorted array: [2]
    - Goal: Combine into single sorted array
    - Method: Compare elements from front of each array

---

    ## Step 7: Compare 5 > 2: take 2 from right

    **Comparison:**
    - Left[0] = 5
    - Right[0] = 2
    - Decision: 5 > 2
    - Action: Take **2** from right array

---

    ## Step 8: Added 2 to result from right array

    **Take from Right:**
    - Value taken: 2
    - Left remaining: [5]
    - Right remaining: []

---

    ## Step 9: Right exhausted: append remaining left elements [5]

    **Append Remainder:**
    - Source: left array
    - Values: [5]
    - Reason: Other array exhausted, copy rest directly

---

    ## Step 10: Merged result: [2, 5]

    **Merge Complete** (Depth 2)

    - Result: [2, 5]
    - Size: 2 elements
    - Status: Sorted subarray ready for parent merge

---

    ## Step 11: Split array [8, 2] into [8] and [2]

    **Split Decision:**
    - Array: [8, 2]
    - Mid-point calculation: `mid = 2 // 2 = 1`
    - Left half: [8] (indices [0:1])
    - Right half: [2] (indices [1:2])

    **Why split here?** Divide-and-conquer strategy: split roughly in half until we reach single elements (base case).

---

      ## Step 12: Base case: array [8] has 1 element(s), already sorted

      **Base Case Reached** (Depth 3)

      - Array: [8]
      - Size: 1 element(s)
      - Decision: Single element is already sorted, return as-is

---

      ## Step 13: Base case: array [2] has 1 element(s), already sorted

      **Base Case Reached** (Depth 3)

      - Array: [2]
      - Size: 1 element(s)
      - Decision: Single element is already sorted, return as-is

---

    ## Step 14: Merge sorted arrays [8] and [2]

    **Merge Operation Begins** (Depth 2)

    - Left sorted array: [8]
    - Right sorted array: [2]
    - Goal: Combine into single sorted array
    - Method: Compare elements from front of each array

---

    ## Step 15: Compare 8 > 2: take 2 from right

    **Comparison:**
    - Left[0] = 8
    - Right[0] = 2
    - Decision: 8 > 2
    - Action: Take **2** from right array

---

    ## Step 16: Added 2 to result from right array

    **Take from Right:**
    - Value taken: 2
    - Left remaining: [8]
    - Right remaining: []

---

    ## Step 17: Right exhausted: append remaining left elements [8]

    **Append Remainder:**
    - Source: left array
    - Values: [8]
    - Reason: Other array exhausted, copy rest directly

---

    ## Step 18: Merged result: [2, 8]

    **Merge Complete** (Depth 2)

    - Result: [2, 8]
    - Size: 2 elements
    - Status: Sorted subarray ready for parent merge

---

  ## Step 19: Merge sorted arrays [2, 5] and [2, 8]

  **Merge Operation Begins** (Depth 1)

  - Left sorted array: [2, 5]
  - Right sorted array: [2, 8]
  - Goal: Combine into single sorted array
  - Method: Compare elements from front of each array

---

  ## Step 20: Compare 2 ≤ 2: take 2 from left

  **Comparison:**
  - Left[0] = 2
  - Right[0] = 2
  - Decision: 2 < 2
  - Action: Take **2** from left array

---

  ## Step 21: Added 2 to result from left array

  **Take from Left:**
  - Value taken: 2
  - Left remaining: [5]
  - Right remaining: [2, 8]

---

  ## Step 22: Compare 5 > 2: take 2 from right

  **Comparison:**
  - Left[1] = 5
  - Right[0] = 2
  - Decision: 5 > 2
  - Action: Take **2** from right array

---

  ## Step 23: Added 2 to result from right array

  **Take from Right:**
  - Value taken: 2
  - Left remaining: [5]
  - Right remaining: [8]

---

  ## Step 24: Compare 5 ≤ 8: take 5 from left

  **Comparison:**
  - Left[1] = 5
  - Right[1] = 8
  - Decision: 5 < 8
  - Action: Take **5** from left array

---

  ## Step 25: Added 5 to result from left array

  **Take from Left:**
  - Value taken: 5
  - Left remaining: []
  - Right remaining: [8]

---

  ## Step 26: Left exhausted: append remaining right elements [8]

  **Append Remainder:**
  - Source: right array
  - Values: [8]
  - Reason: Other array exhausted, copy rest directly

---

  ## Step 27: Merged result: [2, 2, 5, 8]

  **Merge Complete** (Depth 1)

  - Result: [2, 2, 5, 8]
  - Size: 4 elements
  - Status: Sorted subarray ready for parent merge

---

  ## Step 28: Split array [9, 1, 5, 5] into [9, 1] and [5, 5]

  **Split Decision:**
  - Array: [9, 1, 5, 5]
  - Mid-point calculation: `mid = 4 // 2 = 2`
  - Left half: [9, 1] (indices [0:2])
  - Right half: [5, 5] (indices [2:4])

  **Why split here?** Divide-and-conquer strategy: split roughly in half until we reach single elements (base case).

---

    ## Step 29: Split array [9, 1] into [9] and [1]

    **Split Decision:**
    - Array: [9, 1]
    - Mid-point calculation: `mid = 2 // 2 = 1`
    - Left half: [9] (indices [0:1])
    - Right half: [1] (indices [1:2])

    **Why split here?** Divide-and-conquer strategy: split roughly in half until we reach single elements (base case).

---

      ## Step 30: Base case: array [9] has 1 element(s), already sorted

      **Base Case Reached** (Depth 3)

      - Array: [9]
      - Size: 1 element(s)
      - Decision: Single element is already sorted, return as-is

---

      ## Step 31: Base case: array [1] has 1 element(s), already sorted

      **Base Case Reached** (Depth 3)

      - Array: [1]
      - Size: 1 element(s)
      - Decision: Single element is already sorted, return as-is

---

    ## Step 32: Merge sorted arrays [9] and [1]

    **Merge Operation Begins** (Depth 2)

    - Left sorted array: [9]
    - Right sorted array: [1]
    - Goal: Combine into single sorted array
    - Method: Compare elements from front of each array

---

    ## Step 33: Compare 9 > 1: take 1 from right

    **Comparison:**
    - Left[0] = 9
    - Right[0] = 1
    - Decision: 9 > 1
    - Action: Take **1** from right array

---

    ## Step 34: Added 1 to result from right array

    **Take from Right:**
    - Value taken: 1
    - Left remaining: [9]
    - Right remaining: []

---

    ## Step 35: Right exhausted: append remaining left elements [9]

    **Append Remainder:**
    - Source: left array
    - Values: [9]
    - Reason: Other array exhausted, copy rest directly

---

    ## Step 36: Merged result: [1, 9]

    **Merge Complete** (Depth 2)

    - Result: [1, 9]
    - Size: 2 elements
    - Status: Sorted subarray ready for parent merge

---

    ## Step 37: Split array [5, 5] into [5] and [5]

    **Split Decision:**
    - Array: [5, 5]
    - Mid-point calculation: `mid = 2 // 2 = 1`
    - Left half: [5] (indices [0:1])
    - Right half: [5] (indices [1:2])

    **Why split here?** Divide-and-conquer strategy: split roughly in half until we reach single elements (base case).

---

      ## Step 38: Base case: array [5] has 1 element(s), already sorted

      **Base Case Reached** (Depth 3)

      - Array: [5]
      - Size: 1 element(s)
      - Decision: Single element is already sorted, return as-is

---

      ## Step 39: Base case: array [5] has 1 element(s), already sorted

      **Base Case Reached** (Depth 3)

      - Array: [5]
      - Size: 1 element(s)
      - Decision: Single element is already sorted, return as-is

---

    ## Step 40: Merge sorted arrays [5] and [5]

    **Merge Operation Begins** (Depth 2)

    - Left sorted array: [5]
    - Right sorted array: [5]
    - Goal: Combine into single sorted array
    - Method: Compare elements from front of each array

---

    ## Step 41: Compare 5 ≤ 5: take 5 from left

    **Comparison:**
    - Left[0] = 5
    - Right[0] = 5
    - Decision: 5 < 5
    - Action: Take **5** from left array

---

    ## Step 42: Added 5 to result from left array

    **Take from Left:**
    - Value taken: 5
    - Left remaining: []
    - Right remaining: [5]

---

    ## Step 43: Left exhausted: append remaining right elements [5]

    **Append Remainder:**
    - Source: right array
    - Values: [5]
    - Reason: Other array exhausted, copy rest directly

---

    ## Step 44: Merged result: [5, 5]

    **Merge Complete** (Depth 2)

    - Result: [5, 5]
    - Size: 2 elements
    - Status: Sorted subarray ready for parent merge

---

  ## Step 45: Merge sorted arrays [1, 9] and [5, 5]

  **Merge Operation Begins** (Depth 1)

  - Left sorted array: [1, 9]
  - Right sorted array: [5, 5]
  - Goal: Combine into single sorted array
  - Method: Compare elements from front of each array

---

  ## Step 46: Compare 1 ≤ 5: take 1 from left

  **Comparison:**
  - Left[0] = 1
  - Right[0] = 5
  - Decision: 1 < 5
  - Action: Take **1** from left array

---

  ## Step 47: Added 1 to result from left array

  **Take from Left:**
  - Value taken: 1
  - Left remaining: [9]
  - Right remaining: [5, 5]

---

  ## Step 48: Compare 9 > 5: take 5 from right

  **Comparison:**
  - Left[1] = 9
  - Right[0] = 5
  - Decision: 9 > 5
  - Action: Take **5** from right array

---

  ## Step 49: Added 5 to result from right array

  **Take from Right:**
  - Value taken: 5
  - Left remaining: [9]
  - Right remaining: [5]

---

  ## Step 50: Compare 9 > 5: take 5 from right

  **Comparison:**
  - Left[1] = 9
  - Right[1] = 5
  - Decision: 9 > 5
  - Action: Take **5** from right array

---

  ## Step 51: Added 5 to result from right array

  **Take from Right:**
  - Value taken: 5
  - Left remaining: [9]
  - Right remaining: []

---

  ## Step 52: Right exhausted: append remaining left elements [9]

  **Append Remainder:**
  - Source: left array
  - Values: [9]
  - Reason: Other array exhausted, copy rest directly

---

  ## Step 53: Merged result: [1, 5, 5, 9]

  **Merge Complete** (Depth 1)

  - Result: [1, 5, 5, 9]
  - Size: 4 elements
  - Status: Sorted subarray ready for parent merge

---

## Step 54: Merge sorted arrays [2, 2, 5, 8] and [1, 5, 5, 9]

**Merge Operation Begins** (Depth 0)

- Left sorted array: [2, 2, 5, 8]
- Right sorted array: [1, 5, 5, 9]
- Goal: Combine into single sorted array
- Method: Compare elements from front of each array

---

## Step 55: Compare 2 > 1: take 1 from right

**Comparison:**
- Left[0] = 2
- Right[0] = 1
- Decision: 2 > 1
- Action: Take **1** from right array

---

## Step 56: Added 1 to result from right array

**Take from Right:**
- Value taken: 1
- Left remaining: [2, 2, 5, 8]
- Right remaining: [5, 5, 9]

---

## Step 57: Compare 2 ≤ 5: take 2 from left

**Comparison:**
- Left[0] = 2
- Right[1] = 5
- Decision: 2 < 5
- Action: Take **2** from left array

---

## Step 58: Added 2 to result from left array

**Take from Left:**
- Value taken: 2
- Left remaining: [2, 5, 8]
- Right remaining: [5, 5, 9]

---

## Step 59: Compare 2 ≤ 5: take 2 from left

**Comparison:**
- Left[1] = 2
- Right[1] = 5
- Decision: 2 < 5
- Action: Take **2** from left array

---

## Step 60: Added 2 to result from left array

**Take from Left:**
- Value taken: 2
- Left remaining: [5, 8]
- Right remaining: [5, 5, 9]

---

## Step 61: Compare 5 ≤ 5: take 5 from left

**Comparison:**
- Left[2] = 5
- Right[1] = 5
- Decision: 5 < 5
- Action: Take **5** from left array

---

## Step 62: Added 5 to result from left array

**Take from Left:**
- Value taken: 5
- Left remaining: [8]
- Right remaining: [5, 5, 9]

---

## Step 63: Compare 8 > 5: take 5 from right

**Comparison:**
- Left[3] = 8
- Right[1] = 5
- Decision: 8 > 5
- Action: Take **5** from right array

---

## Step 64: Added 5 to result from right array

**Take from Right:**
- Value taken: 5
- Left remaining: [8]
- Right remaining: [5, 9]

---

## Step 65: Compare 8 > 5: take 5 from right

**Comparison:**
- Left[3] = 8
- Right[2] = 5
- Decision: 8 > 5
- Action: Take **5** from right array

---

## Step 66: Added 5 to result from right array

**Take from Right:**
- Value taken: 5
- Left remaining: [8]
- Right remaining: [9]

---

## Step 67: Compare 8 ≤ 9: take 8 from left

**Comparison:**
- Left[3] = 8
- Right[3] = 9
- Decision: 8 < 9
- Action: Take **8** from left array

---

## Step 68: Added 8 to result from left array

**Take from Left:**
- Value taken: 8
- Left remaining: []
- Right remaining: [9]

---

## Step 69: Left exhausted: append remaining right elements [9]

**Append Remainder:**
- Source: right array
- Values: [9]
- Reason: Other array exhausted, copy rest directly

---

## Step 70: Merged result: [1, 2, 2, 5, 5, 5, 8, 9]

**Merge Complete** (Depth 0)

- Result: [1, 2, 2, 5, 5, 5, 8, 9]
- Size: 8 elements
- Status: Sorted subarray ready for parent merge

---

## Step 71: ✅ Merge Sort complete: 8 elements sorted

🎉 **Sorting Complete!**

**Final Result:** [1, 2, 2, 5, 5, 5, 8, 9]
**Statistics:**
- Total comparisons: 17
- Total merge operations: 7
- Original array: [5, 2, 8, 2, 9, 1, 5, 5]
- Array is now sorted in ascending order

---

## Execution Summary

**Algorithm Strategy:**
1. **Divide:** Recursively split array in half until single elements
2. **Conquer:** Single elements are trivially sorted
3. **Combine:** Merge sorted subarrays by comparing front elements

**Performance:**
- Input size: 8 elements
- Comparisons: 17
- Merge operations: 7
- Time Complexity: O(n log n) - guaranteed, even for worst case
- Space Complexity: O(n) - requires auxiliary arrays for merging

**Key Insight:**
Merge sort's power comes from breaking down the sorting problem into smaller subproblems (single elements are already sorted), then building the solution back up through systematic merging. The merge step is where the actual sorting happens - by always taking the smaller front element from two sorted arrays, we maintain sorted order in the combined result.

---

## 🎨 Frontend Visualization Hints

### Primary Metrics to Emphasize

- **Recursion Depth** (`depth`) - Shows the tree structure of divide-and-conquer
- **Comparison Count** (`comparisons`) - Demonstrates O(n log n) efficiency accumulating
- **Array Segments** (`all_intervals`) - Visual representation of splits and merges

### Visualization Priorities

1. **Show recursion tree structure** - Use vertical depth levels to display parent-child relationships
2. **Highlight active comparisons** - When merging, emphasize the two elements being compared
3. **Animate the merge process** - Show elements moving from left/right into merged result
4. **Color-code by depth** - Use distinct colors for different recursion levels
5. **Display call stack state** - Show which recursive calls are active vs. completed

### Key JSON Paths

```
step.data.visualization.all_intervals[*].start
step.data.visualization.all_intervals[*].end
step.data.visualization.all_intervals[*].state  // 'splitting' | 'merging' | 'complete'
step.data.visualization.call_stack_state[*].depth
step.data.visualization.call_stack_state[*].is_active
step.data.visualization.call_stack_state[*].operation
step.data.visualization.comparison_count
step.data.visualization.merge_count
```

### Algorithm-Specific Guidance

Merge sort is fundamentally about **recursion and merging**. The visualization should emphasize the tree structure - show how the array splits down to single elements, then merges back up. The most important pedagogical moments are: (1) the base case (single elements are sorted), and (2) the merge comparison (always take the smaller front element). Use vertical space to show depth levels, and animate the merge process element-by-element to make the sorting logic transparent. The call stack state helps users understand which recursive calls are in progress vs. complete. Consider showing both the 'top-down' split phase and 'bottom-up' merge phase distinctly.
