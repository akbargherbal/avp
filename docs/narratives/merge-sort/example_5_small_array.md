# Merge Sort Execution Narrative

**Algorithm:** Merge Sort
**Input Array:** [3, 1, 4, 1, 5]
**Array Size:** 5 elements
**Result:** [1, 1, 3, 4, 5]
**Total Comparisons:** 7
**Total Merges:** 4

---

## Step 0: 🔄 Starting Merge Sort on array of 5 elements

**Configuration:**
- Input: [3, 1, 4, 1, 5]
- Size: 5 elements
- Strategy: Recursive divide-and-conquer
- Time Complexity: O(n log n)

---

## Step 1: Split array [3, 1, 4, 1, 5] into [3, 1] and [4, 1, 5]

**Split Decision:**
- Array: [3, 1, 4, 1, 5]
- Mid-point calculation: `mid = 5 // 2 = 2`
- Left half: [3, 1] (indices [0:2])
- Right half: [4, 1, 5] (indices [2:5])

**Why split here?** Divide-and-conquer strategy: split roughly in half until we reach single elements (base case).

---

  ## Step 2: Split array [3, 1] into [3] and [1]

  **Split Decision:**
  - Array: [3, 1]
  - Mid-point calculation: `mid = 2 // 2 = 1`
  - Left half: [3] (indices [0:1])
  - Right half: [1] (indices [1:2])

  **Why split here?** Divide-and-conquer strategy: split roughly in half until we reach single elements (base case).

---

    ## Step 3: Base case: array [3] has 1 element(s), already sorted

    **Base Case Reached** (Depth 2)

    - Array: [3]
    - Size: 1 element(s)
    - Decision: Single element is already sorted, return as-is

---

    ## Step 4: Base case: array [1] has 1 element(s), already sorted

    **Base Case Reached** (Depth 2)

    - Array: [1]
    - Size: 1 element(s)
    - Decision: Single element is already sorted, return as-is

---

  ## Step 5: Merge sorted arrays [3] and [1]

  **Merge Operation Begins** (Depth 1)

  - Left sorted array: [3]
  - Right sorted array: [1]
  - Goal: Combine into single sorted array
  - Method: Compare elements from front of each array

---

  ## Step 6: Compare 3 > 1: take 1 from right

  **Comparison:**
  - Left[0] = 3
  - Right[0] = 1
  - Decision: 3 > 1
  - Action: Take **1** from right array

---

  ## Step 7: Added 1 to result from right array

  **Take from Right:**
  - Value taken: 1
  - Left remaining: [3]
  - Right remaining: []

---

  ## Step 8: Right exhausted: append remaining left elements [3]

  **Append Remainder:**
  - Source: left array
  - Values: [3]
  - Reason: Other array exhausted, copy rest directly

---

  ## Step 9: Merged result: [1, 3]

  **Merge Complete** (Depth 1)

  - Result: [1, 3]
  - Size: 2 elements
  - Status: Sorted subarray ready for parent merge

---

  ## Step 10: Split array [4, 1, 5] into [4] and [1, 5]

  **Split Decision:**
  - Array: [4, 1, 5]
  - Mid-point calculation: `mid = 3 // 2 = 1`
  - Left half: [4] (indices [0:1])
  - Right half: [1, 5] (indices [1:3])

  **Why split here?** Divide-and-conquer strategy: split roughly in half until we reach single elements (base case).

---

    ## Step 11: Base case: array [4] has 1 element(s), already sorted

    **Base Case Reached** (Depth 2)

    - Array: [4]
    - Size: 1 element(s)
    - Decision: Single element is already sorted, return as-is

---

    ## Step 12: Split array [1, 5] into [1] and [5]

    **Split Decision:**
    - Array: [1, 5]
    - Mid-point calculation: `mid = 2 // 2 = 1`
    - Left half: [1] (indices [0:1])
    - Right half: [5] (indices [1:2])

    **Why split here?** Divide-and-conquer strategy: split roughly in half until we reach single elements (base case).

---

      ## Step 13: Base case: array [1] has 1 element(s), already sorted

      **Base Case Reached** (Depth 3)

      - Array: [1]
      - Size: 1 element(s)
      - Decision: Single element is already sorted, return as-is

---

      ## Step 14: Base case: array [5] has 1 element(s), already sorted

      **Base Case Reached** (Depth 3)

      - Array: [5]
      - Size: 1 element(s)
      - Decision: Single element is already sorted, return as-is

---

    ## Step 15: Merge sorted arrays [1] and [5]

    **Merge Operation Begins** (Depth 2)

    - Left sorted array: [1]
    - Right sorted array: [5]
    - Goal: Combine into single sorted array
    - Method: Compare elements from front of each array

---

    ## Step 16: Compare 1 ≤ 5: take 1 from left

    **Comparison:**
    - Left[0] = 1
    - Right[0] = 5
    - Decision: 1 < 5
    - Action: Take **1** from left array

---

    ## Step 17: Added 1 to result from left array

    **Take from Left:**
    - Value taken: 1
    - Left remaining: []
    - Right remaining: [5]

---

    ## Step 18: Left exhausted: append remaining right elements [5]

    **Append Remainder:**
    - Source: right array
    - Values: [5]
    - Reason: Other array exhausted, copy rest directly

---

    ## Step 19: Merged result: [1, 5]

    **Merge Complete** (Depth 2)

    - Result: [1, 5]
    - Size: 2 elements
    - Status: Sorted subarray ready for parent merge

---

  ## Step 20: Merge sorted arrays [4] and [1, 5]

  **Merge Operation Begins** (Depth 1)

  - Left sorted array: [4]
  - Right sorted array: [1, 5]
  - Goal: Combine into single sorted array
  - Method: Compare elements from front of each array

---

  ## Step 21: Compare 4 > 1: take 1 from right

  **Comparison:**
  - Left[0] = 4
  - Right[0] = 1
  - Decision: 4 > 1
  - Action: Take **1** from right array

---

  ## Step 22: Added 1 to result from right array

  **Take from Right:**
  - Value taken: 1
  - Left remaining: [4]
  - Right remaining: [5]

---

  ## Step 23: Compare 4 ≤ 5: take 4 from left

  **Comparison:**
  - Left[0] = 4
  - Right[1] = 5
  - Decision: 4 < 5
  - Action: Take **4** from left array

---

  ## Step 24: Added 4 to result from left array

  **Take from Left:**
  - Value taken: 4
  - Left remaining: []
  - Right remaining: [5]

---

  ## Step 25: Left exhausted: append remaining right elements [5]

  **Append Remainder:**
  - Source: right array
  - Values: [5]
  - Reason: Other array exhausted, copy rest directly

---

  ## Step 26: Merged result: [1, 4, 5]

  **Merge Complete** (Depth 1)

  - Result: [1, 4, 5]
  - Size: 3 elements
  - Status: Sorted subarray ready for parent merge

---

## Step 27: Merge sorted arrays [1, 3] and [1, 4, 5]

**Merge Operation Begins** (Depth 0)

- Left sorted array: [1, 3]
- Right sorted array: [1, 4, 5]
- Goal: Combine into single sorted array
- Method: Compare elements from front of each array

---

## Step 28: Compare 1 ≤ 1: take 1 from left

**Comparison:**
- Left[0] = 1
- Right[0] = 1
- Decision: 1 < 1
- Action: Take **1** from left array

---

## Step 29: Added 1 to result from left array

**Take from Left:**
- Value taken: 1
- Left remaining: [3]
- Right remaining: [1, 4, 5]

---

## Step 30: Compare 3 > 1: take 1 from right

**Comparison:**
- Left[1] = 3
- Right[0] = 1
- Decision: 3 > 1
- Action: Take **1** from right array

---

## Step 31: Added 1 to result from right array

**Take from Right:**
- Value taken: 1
- Left remaining: [3]
- Right remaining: [4, 5]

---

## Step 32: Compare 3 ≤ 4: take 3 from left

**Comparison:**
- Left[1] = 3
- Right[1] = 4
- Decision: 3 < 4
- Action: Take **3** from left array

---

## Step 33: Added 3 to result from left array

**Take from Left:**
- Value taken: 3
- Left remaining: []
- Right remaining: [4, 5]

---

## Step 34: Left exhausted: append remaining right elements [4, 5]

**Append Remainder:**
- Source: right array
- Values: [4, 5]
- Reason: Other array exhausted, copy rest directly

---

## Step 35: Merged result: [1, 1, 3, 4, 5]

**Merge Complete** (Depth 0)

- Result: [1, 1, 3, 4, 5]
- Size: 5 elements
- Status: Sorted subarray ready for parent merge

---

## Step 36: ✅ Merge Sort complete: 5 elements sorted

🎉 **Sorting Complete!**

**Final Result:** [1, 1, 3, 4, 5]
**Statistics:**
- Total comparisons: 7
- Total merge operations: 4
- Original array: [3, 1, 4, 1, 5]
- Array is now sorted in ascending order

---

## Execution Summary

**Algorithm Strategy:**
1. **Divide:** Recursively split array in half until single elements
2. **Conquer:** Single elements are trivially sorted
3. **Combine:** Merge sorted subarrays by comparing front elements

**Performance:**
- Input size: 5 elements
- Comparisons: 7
- Merge operations: 4
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
