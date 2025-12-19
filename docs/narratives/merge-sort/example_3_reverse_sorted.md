# Merge Sort Execution Narrative

**Algorithm:** Merge Sort
**Input Array:** [8, 7, 6, 5, 4, 3, 2, 1]
**Array Size:** 8 elements
**Result:** [1, 2, 3, 4, 5, 6, 7, 8]
**Total Comparisons:** 12
**Total Merges:** 7

---

## Step 0: 🔄 Starting Merge Sort on array of 8 elements

**Configuration:**
- Input: [8, 7, 6, 5, 4, 3, 2, 1]
- Size: 8 elements
- Strategy: Recursive divide-and-conquer
- Time Complexity: O(n log n)

---

## Step 1: Split array [8, 7, 6, 5, 4, 3, 2, 1] into [8, 7, 6, 5] and [4, 3, 2, 1]

**Split Decision:**
- Array: [8, 7, 6, 5, 4, 3, 2, 1]
- Mid-point calculation: `mid = 8 // 2 = 4`
- Left half: [8, 7, 6, 5] (indices [0:4])
- Right half: [4, 3, 2, 1] (indices [4:8])

**Why split here?** Divide-and-conquer strategy: split roughly in half until we reach single elements (base case).

---

  ## Step 2: Split array [8, 7, 6, 5] into [8, 7] and [6, 5]

  **Split Decision:**
  - Array: [8, 7, 6, 5]
  - Mid-point calculation: `mid = 4 // 2 = 2`
  - Left half: [8, 7] (indices [0:2])
  - Right half: [6, 5] (indices [2:4])

  **Why split here?** Divide-and-conquer strategy: split roughly in half until we reach single elements (base case).

---

    ## Step 3: Split array [8, 7] into [8] and [7]

    **Split Decision:**
    - Array: [8, 7]
    - Mid-point calculation: `mid = 2 // 2 = 1`
    - Left half: [8] (indices [0:1])
    - Right half: [7] (indices [1:2])

    **Why split here?** Divide-and-conquer strategy: split roughly in half until we reach single elements (base case).

---

      ## Step 4: Base case: array [8] has 1 element(s), already sorted

      **Base Case Reached** (Depth 3)

      - Array: [8]
      - Size: 1 element(s)
      - Decision: Single element is already sorted, return as-is

---

      ## Step 5: Base case: array [7] has 1 element(s), already sorted

      **Base Case Reached** (Depth 3)

      - Array: [7]
      - Size: 1 element(s)
      - Decision: Single element is already sorted, return as-is

---

    ## Step 6: Merge sorted arrays [8] and [7]

    **Merge Operation Begins** (Depth 2)

    - Left sorted array: [8]
    - Right sorted array: [7]
    - Goal: Combine into single sorted array
    - Method: Compare elements from front of each array

---

    ## Step 7: Compare 8 > 7: take 7 from right

    **Comparison:**
    - Left[0] = 8
    - Right[0] = 7
    - Decision: 8 > 7
    - Action: Take **7** from right array

---

    ## Step 8: Added 7 to result from right array

    **Take from Right:**
    - Value taken: 7
    - Left remaining: [8]
    - Right remaining: []

---

    ## Step 9: Right exhausted: append remaining left elements [8]

    **Append Remainder:**
    - Source: left array
    - Values: [8]
    - Reason: Other array exhausted, copy rest directly

---

    ## Step 10: Merged result: [7, 8]

    **Merge Complete** (Depth 2)

    - Result: [7, 8]
    - Size: 2 elements
    - Status: Sorted subarray ready for parent merge

---

    ## Step 11: Split array [6, 5] into [6] and [5]

    **Split Decision:**
    - Array: [6, 5]
    - Mid-point calculation: `mid = 2 // 2 = 1`
    - Left half: [6] (indices [0:1])
    - Right half: [5] (indices [1:2])

    **Why split here?** Divide-and-conquer strategy: split roughly in half until we reach single elements (base case).

---

      ## Step 12: Base case: array [6] has 1 element(s), already sorted

      **Base Case Reached** (Depth 3)

      - Array: [6]
      - Size: 1 element(s)
      - Decision: Single element is already sorted, return as-is

---

      ## Step 13: Base case: array [5] has 1 element(s), already sorted

      **Base Case Reached** (Depth 3)

      - Array: [5]
      - Size: 1 element(s)
      - Decision: Single element is already sorted, return as-is

---

    ## Step 14: Merge sorted arrays [6] and [5]

    **Merge Operation Begins** (Depth 2)

    - Left sorted array: [6]
    - Right sorted array: [5]
    - Goal: Combine into single sorted array
    - Method: Compare elements from front of each array

---

    ## Step 15: Compare 6 > 5: take 5 from right

    **Comparison:**
    - Left[0] = 6
    - Right[0] = 5
    - Decision: 6 > 5
    - Action: Take **5** from right array

---

    ## Step 16: Added 5 to result from right array

    **Take from Right:**
    - Value taken: 5
    - Left remaining: [6]
    - Right remaining: []

---

    ## Step 17: Right exhausted: append remaining left elements [6]

    **Append Remainder:**
    - Source: left array
    - Values: [6]
    - Reason: Other array exhausted, copy rest directly

---

    ## Step 18: Merged result: [5, 6]

    **Merge Complete** (Depth 2)

    - Result: [5, 6]
    - Size: 2 elements
    - Status: Sorted subarray ready for parent merge

---

  ## Step 19: Merge sorted arrays [7, 8] and [5, 6]

  **Merge Operation Begins** (Depth 1)

  - Left sorted array: [7, 8]
  - Right sorted array: [5, 6]
  - Goal: Combine into single sorted array
  - Method: Compare elements from front of each array

---

  ## Step 20: Compare 7 > 5: take 5 from right

  **Comparison:**
  - Left[0] = 7
  - Right[0] = 5
  - Decision: 7 > 5
  - Action: Take **5** from right array

---

  ## Step 21: Added 5 to result from right array

  **Take from Right:**
  - Value taken: 5
  - Left remaining: [7, 8]
  - Right remaining: [6]

---

  ## Step 22: Compare 7 > 6: take 6 from right

  **Comparison:**
  - Left[0] = 7
  - Right[1] = 6
  - Decision: 7 > 6
  - Action: Take **6** from right array

---

  ## Step 23: Added 6 to result from right array

  **Take from Right:**
  - Value taken: 6
  - Left remaining: [7, 8]
  - Right remaining: []

---

  ## Step 24: Right exhausted: append remaining left elements [7, 8]

  **Append Remainder:**
  - Source: left array
  - Values: [7, 8]
  - Reason: Other array exhausted, copy rest directly

---

  ## Step 25: Merged result: [5, 6, 7, 8]

  **Merge Complete** (Depth 1)

  - Result: [5, 6, 7, 8]
  - Size: 4 elements
  - Status: Sorted subarray ready for parent merge

---

  ## Step 26: Split array [4, 3, 2, 1] into [4, 3] and [2, 1]

  **Split Decision:**
  - Array: [4, 3, 2, 1]
  - Mid-point calculation: `mid = 4 // 2 = 2`
  - Left half: [4, 3] (indices [0:2])
  - Right half: [2, 1] (indices [2:4])

  **Why split here?** Divide-and-conquer strategy: split roughly in half until we reach single elements (base case).

---

    ## Step 27: Split array [4, 3] into [4] and [3]

    **Split Decision:**
    - Array: [4, 3]
    - Mid-point calculation: `mid = 2 // 2 = 1`
    - Left half: [4] (indices [0:1])
    - Right half: [3] (indices [1:2])

    **Why split here?** Divide-and-conquer strategy: split roughly in half until we reach single elements (base case).

---

      ## Step 28: Base case: array [4] has 1 element(s), already sorted

      **Base Case Reached** (Depth 3)

      - Array: [4]
      - Size: 1 element(s)
      - Decision: Single element is already sorted, return as-is

---

      ## Step 29: Base case: array [3] has 1 element(s), already sorted

      **Base Case Reached** (Depth 3)

      - Array: [3]
      - Size: 1 element(s)
      - Decision: Single element is already sorted, return as-is

---

    ## Step 30: Merge sorted arrays [4] and [3]

    **Merge Operation Begins** (Depth 2)

    - Left sorted array: [4]
    - Right sorted array: [3]
    - Goal: Combine into single sorted array
    - Method: Compare elements from front of each array

---

    ## Step 31: Compare 4 > 3: take 3 from right

    **Comparison:**
    - Left[0] = 4
    - Right[0] = 3
    - Decision: 4 > 3
    - Action: Take **3** from right array

---

    ## Step 32: Added 3 to result from right array

    **Take from Right:**
    - Value taken: 3
    - Left remaining: [4]
    - Right remaining: []

---

    ## Step 33: Right exhausted: append remaining left elements [4]

    **Append Remainder:**
    - Source: left array
    - Values: [4]
    - Reason: Other array exhausted, copy rest directly

---

    ## Step 34: Merged result: [3, 4]

    **Merge Complete** (Depth 2)

    - Result: [3, 4]
    - Size: 2 elements
    - Status: Sorted subarray ready for parent merge

---

    ## Step 35: Split array [2, 1] into [2] and [1]

    **Split Decision:**
    - Array: [2, 1]
    - Mid-point calculation: `mid = 2 // 2 = 1`
    - Left half: [2] (indices [0:1])
    - Right half: [1] (indices [1:2])

    **Why split here?** Divide-and-conquer strategy: split roughly in half until we reach single elements (base case).

---

      ## Step 36: Base case: array [2] has 1 element(s), already sorted

      **Base Case Reached** (Depth 3)

      - Array: [2]
      - Size: 1 element(s)
      - Decision: Single element is already sorted, return as-is

---

      ## Step 37: Base case: array [1] has 1 element(s), already sorted

      **Base Case Reached** (Depth 3)

      - Array: [1]
      - Size: 1 element(s)
      - Decision: Single element is already sorted, return as-is

---

    ## Step 38: Merge sorted arrays [2] and [1]

    **Merge Operation Begins** (Depth 2)

    - Left sorted array: [2]
    - Right sorted array: [1]
    - Goal: Combine into single sorted array
    - Method: Compare elements from front of each array

---

    ## Step 39: Compare 2 > 1: take 1 from right

    **Comparison:**
    - Left[0] = 2
    - Right[0] = 1
    - Decision: 2 > 1
    - Action: Take **1** from right array

---

    ## Step 40: Added 1 to result from right array

    **Take from Right:**
    - Value taken: 1
    - Left remaining: [2]
    - Right remaining: []

---

    ## Step 41: Right exhausted: append remaining left elements [2]

    **Append Remainder:**
    - Source: left array
    - Values: [2]
    - Reason: Other array exhausted, copy rest directly

---

    ## Step 42: Merged result: [1, 2]

    **Merge Complete** (Depth 2)

    - Result: [1, 2]
    - Size: 2 elements
    - Status: Sorted subarray ready for parent merge

---

  ## Step 43: Merge sorted arrays [3, 4] and [1, 2]

  **Merge Operation Begins** (Depth 1)

  - Left sorted array: [3, 4]
  - Right sorted array: [1, 2]
  - Goal: Combine into single sorted array
  - Method: Compare elements from front of each array

---

  ## Step 44: Compare 3 > 1: take 1 from right

  **Comparison:**
  - Left[0] = 3
  - Right[0] = 1
  - Decision: 3 > 1
  - Action: Take **1** from right array

---

  ## Step 45: Added 1 to result from right array

  **Take from Right:**
  - Value taken: 1
  - Left remaining: [3, 4]
  - Right remaining: [2]

---

  ## Step 46: Compare 3 > 2: take 2 from right

  **Comparison:**
  - Left[0] = 3
  - Right[1] = 2
  - Decision: 3 > 2
  - Action: Take **2** from right array

---

  ## Step 47: Added 2 to result from right array

  **Take from Right:**
  - Value taken: 2
  - Left remaining: [3, 4]
  - Right remaining: []

---

  ## Step 48: Right exhausted: append remaining left elements [3, 4]

  **Append Remainder:**
  - Source: left array
  - Values: [3, 4]
  - Reason: Other array exhausted, copy rest directly

---

  ## Step 49: Merged result: [1, 2, 3, 4]

  **Merge Complete** (Depth 1)

  - Result: [1, 2, 3, 4]
  - Size: 4 elements
  - Status: Sorted subarray ready for parent merge

---

## Step 50: Merge sorted arrays [5, 6, 7, 8] and [1, 2, 3, 4]

**Merge Operation Begins** (Depth 0)

- Left sorted array: [5, 6, 7, 8]
- Right sorted array: [1, 2, 3, 4]
- Goal: Combine into single sorted array
- Method: Compare elements from front of each array

---

## Step 51: Compare 5 > 1: take 1 from right

**Comparison:**
- Left[0] = 5
- Right[0] = 1
- Decision: 5 > 1
- Action: Take **1** from right array

---

## Step 52: Added 1 to result from right array

**Take from Right:**
- Value taken: 1
- Left remaining: [5, 6, 7, 8]
- Right remaining: [2, 3, 4]

---

## Step 53: Compare 5 > 2: take 2 from right

**Comparison:**
- Left[0] = 5
- Right[1] = 2
- Decision: 5 > 2
- Action: Take **2** from right array

---

## Step 54: Added 2 to result from right array

**Take from Right:**
- Value taken: 2
- Left remaining: [5, 6, 7, 8]
- Right remaining: [3, 4]

---

## Step 55: Compare 5 > 3: take 3 from right

**Comparison:**
- Left[0] = 5
- Right[2] = 3
- Decision: 5 > 3
- Action: Take **3** from right array

---

## Step 56: Added 3 to result from right array

**Take from Right:**
- Value taken: 3
- Left remaining: [5, 6, 7, 8]
- Right remaining: [4]

---

## Step 57: Compare 5 > 4: take 4 from right

**Comparison:**
- Left[0] = 5
- Right[3] = 4
- Decision: 5 > 4
- Action: Take **4** from right array

---

## Step 58: Added 4 to result from right array

**Take from Right:**
- Value taken: 4
- Left remaining: [5, 6, 7, 8]
- Right remaining: []

---

## Step 59: Right exhausted: append remaining left elements [5, 6, 7, 8]

**Append Remainder:**
- Source: left array
- Values: [5, 6, 7, 8]
- Reason: Other array exhausted, copy rest directly

---

## Step 60: Merged result: [1, 2, 3, 4, 5, 6, 7, 8]

**Merge Complete** (Depth 0)

- Result: [1, 2, 3, 4, 5, 6, 7, 8]
- Size: 8 elements
- Status: Sorted subarray ready for parent merge

---

## Step 61: ✅ Merge Sort complete: 8 elements sorted

🎉 **Sorting Complete!**

**Final Result:** [1, 2, 3, 4, 5, 6, 7, 8]
**Statistics:**
- Total comparisons: 12
- Total merge operations: 7
- Original array: [8, 7, 6, 5, 4, 3, 2, 1]
- Array is now sorted in ascending order

---

## Execution Summary

**Algorithm Strategy:**
1. **Divide:** Recursively split array in half until single elements
2. **Conquer:** Single elements are trivially sorted
3. **Combine:** Merge sorted subarrays by comparing front elements

**Performance:**
- Input size: 8 elements
- Comparisons: 12
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
