# Merge Sort Execution Narrative

**Algorithm:** Merge Sort
**Input Array:** [1, 2, 3, 4, 5, 6, 7, 8]
**Array Size:** 8 elements
**Result:** [1, 2, 3, 4, 5, 6, 7, 8]
**Total Comparisons:** 12
**Total Merges:** 7

---

## Step 0: 🔄 Starting Merge Sort on array of 8 elements

**Configuration:**
- Input: [1, 2, 3, 4, 5, 6, 7, 8]
- Size: 8 elements
- Strategy: Recursive divide-and-conquer
- Time Complexity: O(n log n)

---

## Step 1: Split array [1, 2, 3, 4, 5, 6, 7, 8] into [1, 2, 3, 4] and [5, 6, 7, 8]

**Split Decision:**
- Array: [1, 2, 3, 4, 5, 6, 7, 8]
- Mid-point calculation: `mid = 8 // 2 = 4`
- Left half: [1, 2, 3, 4] (indices [0:4])
- Right half: [5, 6, 7, 8] (indices [4:8])

**Why split here?** Divide-and-conquer strategy: split roughly in half until we reach single elements (base case).

---

  ## Step 2: Split array [1, 2, 3, 4] into [1, 2] and [3, 4]

  **Split Decision:**
  - Array: [1, 2, 3, 4]
  - Mid-point calculation: `mid = 4 // 2 = 2`
  - Left half: [1, 2] (indices [0:2])
  - Right half: [3, 4] (indices [2:4])

  **Why split here?** Divide-and-conquer strategy: split roughly in half until we reach single elements (base case).

---

    ## Step 3: Split array [1, 2] into [1] and [2]

    **Split Decision:**
    - Array: [1, 2]
    - Mid-point calculation: `mid = 2 // 2 = 1`
    - Left half: [1] (indices [0:1])
    - Right half: [2] (indices [1:2])

    **Why split here?** Divide-and-conquer strategy: split roughly in half until we reach single elements (base case).

---

      ## Step 4: Base case: array [1] has 1 element(s), already sorted

      **Base Case Reached** (Depth 3)

      - Array: [1]
      - Size: 1 element(s)
      - Decision: Single element is already sorted, return as-is

---

      ## Step 5: Base case: array [2] has 1 element(s), already sorted

      **Base Case Reached** (Depth 3)

      - Array: [2]
      - Size: 1 element(s)
      - Decision: Single element is already sorted, return as-is

---

    ## Step 6: Merge sorted arrays [1] and [2]

    **Merge Operation Begins** (Depth 2)

    - Left sorted array: [1]
    - Right sorted array: [2]
    - Goal: Combine into single sorted array
    - Method: Compare elements from front of each array

---

    ## Step 7: Compare 1 ≤ 2: take 1 from left

    **Comparison:**
    - Left[0] = 1
    - Right[0] = 2
    - Decision: 1 < 2
    - Action: Take **1** from left array

---

    ## Step 8: Added 1 to result from left array

    **Take from Left:**
    - Value taken: 1
    - Left remaining: []
    - Right remaining: [2]

---

    ## Step 9: Left exhausted: append remaining right elements [2]

    **Append Remainder:**
    - Source: right array
    - Values: [2]
    - Reason: Other array exhausted, copy rest directly

---

    ## Step 10: Merged result: [1, 2]

    **Merge Complete** (Depth 2)

    - Result: [1, 2]
    - Size: 2 elements
    - Status: Sorted subarray ready for parent merge

---

    ## Step 11: Split array [3, 4] into [3] and [4]

    **Split Decision:**
    - Array: [3, 4]
    - Mid-point calculation: `mid = 2 // 2 = 1`
    - Left half: [3] (indices [0:1])
    - Right half: [4] (indices [1:2])

    **Why split here?** Divide-and-conquer strategy: split roughly in half until we reach single elements (base case).

---

      ## Step 12: Base case: array [3] has 1 element(s), already sorted

      **Base Case Reached** (Depth 3)

      - Array: [3]
      - Size: 1 element(s)
      - Decision: Single element is already sorted, return as-is

---

      ## Step 13: Base case: array [4] has 1 element(s), already sorted

      **Base Case Reached** (Depth 3)

      - Array: [4]
      - Size: 1 element(s)
      - Decision: Single element is already sorted, return as-is

---

    ## Step 14: Merge sorted arrays [3] and [4]

    **Merge Operation Begins** (Depth 2)

    - Left sorted array: [3]
    - Right sorted array: [4]
    - Goal: Combine into single sorted array
    - Method: Compare elements from front of each array

---

    ## Step 15: Compare 3 ≤ 4: take 3 from left

    **Comparison:**
    - Left[0] = 3
    - Right[0] = 4
    - Decision: 3 < 4
    - Action: Take **3** from left array

---

    ## Step 16: Added 3 to result from left array

    **Take from Left:**
    - Value taken: 3
    - Left remaining: []
    - Right remaining: [4]

---

    ## Step 17: Left exhausted: append remaining right elements [4]

    **Append Remainder:**
    - Source: right array
    - Values: [4]
    - Reason: Other array exhausted, copy rest directly

---

    ## Step 18: Merged result: [3, 4]

    **Merge Complete** (Depth 2)

    - Result: [3, 4]
    - Size: 2 elements
    - Status: Sorted subarray ready for parent merge

---

  ## Step 19: Merge sorted arrays [1, 2] and [3, 4]

  **Merge Operation Begins** (Depth 1)

  - Left sorted array: [1, 2]
  - Right sorted array: [3, 4]
  - Goal: Combine into single sorted array
  - Method: Compare elements from front of each array

---

  ## Step 20: Compare 1 ≤ 3: take 1 from left

  **Comparison:**
  - Left[0] = 1
  - Right[0] = 3
  - Decision: 1 < 3
  - Action: Take **1** from left array

---

  ## Step 21: Added 1 to result from left array

  **Take from Left:**
  - Value taken: 1
  - Left remaining: [2]
  - Right remaining: [3, 4]

---

  ## Step 22: Compare 2 ≤ 3: take 2 from left

  **Comparison:**
  - Left[1] = 2
  - Right[0] = 3
  - Decision: 2 < 3
  - Action: Take **2** from left array

---

  ## Step 23: Added 2 to result from left array

  **Take from Left:**
  - Value taken: 2
  - Left remaining: []
  - Right remaining: [3, 4]

---

  ## Step 24: Left exhausted: append remaining right elements [3, 4]

  **Append Remainder:**
  - Source: right array
  - Values: [3, 4]
  - Reason: Other array exhausted, copy rest directly

---

  ## Step 25: Merged result: [1, 2, 3, 4]

  **Merge Complete** (Depth 1)

  - Result: [1, 2, 3, 4]
  - Size: 4 elements
  - Status: Sorted subarray ready for parent merge

---

  ## Step 26: Split array [5, 6, 7, 8] into [5, 6] and [7, 8]

  **Split Decision:**
  - Array: [5, 6, 7, 8]
  - Mid-point calculation: `mid = 4 // 2 = 2`
  - Left half: [5, 6] (indices [0:2])
  - Right half: [7, 8] (indices [2:4])

  **Why split here?** Divide-and-conquer strategy: split roughly in half until we reach single elements (base case).

---

    ## Step 27: Split array [5, 6] into [5] and [6]

    **Split Decision:**
    - Array: [5, 6]
    - Mid-point calculation: `mid = 2 // 2 = 1`
    - Left half: [5] (indices [0:1])
    - Right half: [6] (indices [1:2])

    **Why split here?** Divide-and-conquer strategy: split roughly in half until we reach single elements (base case).

---

      ## Step 28: Base case: array [5] has 1 element(s), already sorted

      **Base Case Reached** (Depth 3)

      - Array: [5]
      - Size: 1 element(s)
      - Decision: Single element is already sorted, return as-is

---

      ## Step 29: Base case: array [6] has 1 element(s), already sorted

      **Base Case Reached** (Depth 3)

      - Array: [6]
      - Size: 1 element(s)
      - Decision: Single element is already sorted, return as-is

---

    ## Step 30: Merge sorted arrays [5] and [6]

    **Merge Operation Begins** (Depth 2)

    - Left sorted array: [5]
    - Right sorted array: [6]
    - Goal: Combine into single sorted array
    - Method: Compare elements from front of each array

---

    ## Step 31: Compare 5 ≤ 6: take 5 from left

    **Comparison:**
    - Left[0] = 5
    - Right[0] = 6
    - Decision: 5 < 6
    - Action: Take **5** from left array

---

    ## Step 32: Added 5 to result from left array

    **Take from Left:**
    - Value taken: 5
    - Left remaining: []
    - Right remaining: [6]

---

    ## Step 33: Left exhausted: append remaining right elements [6]

    **Append Remainder:**
    - Source: right array
    - Values: [6]
    - Reason: Other array exhausted, copy rest directly

---

    ## Step 34: Merged result: [5, 6]

    **Merge Complete** (Depth 2)

    - Result: [5, 6]
    - Size: 2 elements
    - Status: Sorted subarray ready for parent merge

---

    ## Step 35: Split array [7, 8] into [7] and [8]

    **Split Decision:**
    - Array: [7, 8]
    - Mid-point calculation: `mid = 2 // 2 = 1`
    - Left half: [7] (indices [0:1])
    - Right half: [8] (indices [1:2])

    **Why split here?** Divide-and-conquer strategy: split roughly in half until we reach single elements (base case).

---

      ## Step 36: Base case: array [7] has 1 element(s), already sorted

      **Base Case Reached** (Depth 3)

      - Array: [7]
      - Size: 1 element(s)
      - Decision: Single element is already sorted, return as-is

---

      ## Step 37: Base case: array [8] has 1 element(s), already sorted

      **Base Case Reached** (Depth 3)

      - Array: [8]
      - Size: 1 element(s)
      - Decision: Single element is already sorted, return as-is

---

    ## Step 38: Merge sorted arrays [7] and [8]

    **Merge Operation Begins** (Depth 2)

    - Left sorted array: [7]
    - Right sorted array: [8]
    - Goal: Combine into single sorted array
    - Method: Compare elements from front of each array

---

    ## Step 39: Compare 7 ≤ 8: take 7 from left

    **Comparison:**
    - Left[0] = 7
    - Right[0] = 8
    - Decision: 7 < 8
    - Action: Take **7** from left array

---

    ## Step 40: Added 7 to result from left array

    **Take from Left:**
    - Value taken: 7
    - Left remaining: []
    - Right remaining: [8]

---

    ## Step 41: Left exhausted: append remaining right elements [8]

    **Append Remainder:**
    - Source: right array
    - Values: [8]
    - Reason: Other array exhausted, copy rest directly

---

    ## Step 42: Merged result: [7, 8]

    **Merge Complete** (Depth 2)

    - Result: [7, 8]
    - Size: 2 elements
    - Status: Sorted subarray ready for parent merge

---

  ## Step 43: Merge sorted arrays [5, 6] and [7, 8]

  **Merge Operation Begins** (Depth 1)

  - Left sorted array: [5, 6]
  - Right sorted array: [7, 8]
  - Goal: Combine into single sorted array
  - Method: Compare elements from front of each array

---

  ## Step 44: Compare 5 ≤ 7: take 5 from left

  **Comparison:**
  - Left[0] = 5
  - Right[0] = 7
  - Decision: 5 < 7
  - Action: Take **5** from left array

---

  ## Step 45: Added 5 to result from left array

  **Take from Left:**
  - Value taken: 5
  - Left remaining: [6]
  - Right remaining: [7, 8]

---

  ## Step 46: Compare 6 ≤ 7: take 6 from left

  **Comparison:**
  - Left[1] = 6
  - Right[0] = 7
  - Decision: 6 < 7
  - Action: Take **6** from left array

---

  ## Step 47: Added 6 to result from left array

  **Take from Left:**
  - Value taken: 6
  - Left remaining: []
  - Right remaining: [7, 8]

---

  ## Step 48: Left exhausted: append remaining right elements [7, 8]

  **Append Remainder:**
  - Source: right array
  - Values: [7, 8]
  - Reason: Other array exhausted, copy rest directly

---

  ## Step 49: Merged result: [5, 6, 7, 8]

  **Merge Complete** (Depth 1)

  - Result: [5, 6, 7, 8]
  - Size: 4 elements
  - Status: Sorted subarray ready for parent merge

---

## Step 50: Merge sorted arrays [1, 2, 3, 4] and [5, 6, 7, 8]

**Merge Operation Begins** (Depth 0)

- Left sorted array: [1, 2, 3, 4]
- Right sorted array: [5, 6, 7, 8]
- Goal: Combine into single sorted array
- Method: Compare elements from front of each array

---

## Step 51: Compare 1 ≤ 5: take 1 from left

**Comparison:**
- Left[0] = 1
- Right[0] = 5
- Decision: 1 < 5
- Action: Take **1** from left array

---

## Step 52: Added 1 to result from left array

**Take from Left:**
- Value taken: 1
- Left remaining: [2, 3, 4]
- Right remaining: [5, 6, 7, 8]

---

## Step 53: Compare 2 ≤ 5: take 2 from left

**Comparison:**
- Left[1] = 2
- Right[0] = 5
- Decision: 2 < 5
- Action: Take **2** from left array

---

## Step 54: Added 2 to result from left array

**Take from Left:**
- Value taken: 2
- Left remaining: [3, 4]
- Right remaining: [5, 6, 7, 8]

---

## Step 55: Compare 3 ≤ 5: take 3 from left

**Comparison:**
- Left[2] = 3
- Right[0] = 5
- Decision: 3 < 5
- Action: Take **3** from left array

---

## Step 56: Added 3 to result from left array

**Take from Left:**
- Value taken: 3
- Left remaining: [4]
- Right remaining: [5, 6, 7, 8]

---

## Step 57: Compare 4 ≤ 5: take 4 from left

**Comparison:**
- Left[3] = 4
- Right[0] = 5
- Decision: 4 < 5
- Action: Take **4** from left array

---

## Step 58: Added 4 to result from left array

**Take from Left:**
- Value taken: 4
- Left remaining: []
- Right remaining: [5, 6, 7, 8]

---

## Step 59: Left exhausted: append remaining right elements [5, 6, 7, 8]

**Append Remainder:**
- Source: right array
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
- Original array: [1, 2, 3, 4, 5, 6, 7, 8]
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
