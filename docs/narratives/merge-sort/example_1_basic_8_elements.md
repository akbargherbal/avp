# Merge Sort Execution Narrative

**Algorithm:** Merge Sort
**Input Array:** [38, 27, 43, 3, 9, 82, 10, 5]
**Array Size:** 8 elements
**Result:** [3, 5, 9, 10, 27, 38, 43, 82]
**Total Comparisons:** 17
**Total Merges:** 7

---

## Step 0: 🔄 Starting Merge Sort on array of 8 elements

**Configuration:**
- Input: [38, 27, 43, 3, 9, 82, 10, 5]
- Size: 8 elements
- Strategy: Recursive divide-and-conquer
- Time Complexity: O(n log n)

---

## Step 1: Split array [38, 27, 43, 3, 9, 82, 10, 5] into [38, 27, 43, 3] and [9, 82, 10, 5]

**Split Decision:**
- Array: [38, 27, 43, 3, 9, 82, 10, 5]
- Mid-point calculation: `mid = 8 // 2 = 4`
- Left half: [38, 27, 43, 3] (indices [0:4])
- Right half: [9, 82, 10, 5] (indices [4:8])

**Why split here?** Divide-and-conquer strategy: split roughly in half until we reach single elements (base case).

---

  ## Step 2: Split array [38, 27, 43, 3] into [38, 27] and [43, 3]

  **Split Decision:**
  - Array: [38, 27, 43, 3]
  - Mid-point calculation: `mid = 4 // 2 = 2`
  - Left half: [38, 27] (indices [0:2])
  - Right half: [43, 3] (indices [2:4])

  **Why split here?** Divide-and-conquer strategy: split roughly in half until we reach single elements (base case).

---

    ## Step 3: Split array [38, 27] into [38] and [27]

    **Split Decision:**
    - Array: [38, 27]
    - Mid-point calculation: `mid = 2 // 2 = 1`
    - Left half: [38] (indices [0:1])
    - Right half: [27] (indices [1:2])

    **Why split here?** Divide-and-conquer strategy: split roughly in half until we reach single elements (base case).

---

      ## Step 4: Base case: array [38] has 1 element(s), already sorted

      **Base Case Reached** (Depth 3)

      - Array: [38]
      - Size: 1 element(s)
      - Decision: Single element is already sorted, return as-is

---

      ## Step 5: Base case: array [27] has 1 element(s), already sorted

      **Base Case Reached** (Depth 3)

      - Array: [27]
      - Size: 1 element(s)
      - Decision: Single element is already sorted, return as-is

---

    ## Step 6: Merge sorted arrays [38] and [27]

    **Merge Operation Begins** (Depth 2)

    - Left sorted array: [38]
    - Right sorted array: [27]
    - Goal: Combine into single sorted array
    - Method: Compare elements from front of each array

---

    ## Step 7: Compare 38 > 27: take 27 from right

    **Comparison:**
    - Left[0] = 38
    - Right[0] = 27
    - Decision: 38 > 27
    - Action: Take **27** from right array

---

    ## Step 8: Added 27 to result from right array

    **Take from Right:**
    - Value taken: 27
    - Left remaining: [38]
    - Right remaining: []

---

    ## Step 9: Right exhausted: append remaining left elements [38]

    **Append Remainder:**
    - Source: left array
    - Values: [38]
    - Reason: Other array exhausted, copy rest directly

---

    ## Step 10: Merged result: [27, 38]

    **Merge Complete** (Depth 2)

    - Result: [27, 38]
    - Size: 2 elements
    - Status: Sorted subarray ready for parent merge

---

    ## Step 11: Split array [43, 3] into [43] and [3]

    **Split Decision:**
    - Array: [43, 3]
    - Mid-point calculation: `mid = 2 // 2 = 1`
    - Left half: [43] (indices [0:1])
    - Right half: [3] (indices [1:2])

    **Why split here?** Divide-and-conquer strategy: split roughly in half until we reach single elements (base case).

---

      ## Step 12: Base case: array [43] has 1 element(s), already sorted

      **Base Case Reached** (Depth 3)

      - Array: [43]
      - Size: 1 element(s)
      - Decision: Single element is already sorted, return as-is

---

      ## Step 13: Base case: array [3] has 1 element(s), already sorted

      **Base Case Reached** (Depth 3)

      - Array: [3]
      - Size: 1 element(s)
      - Decision: Single element is already sorted, return as-is

---

    ## Step 14: Merge sorted arrays [43] and [3]

    **Merge Operation Begins** (Depth 2)

    - Left sorted array: [43]
    - Right sorted array: [3]
    - Goal: Combine into single sorted array
    - Method: Compare elements from front of each array

---

    ## Step 15: Compare 43 > 3: take 3 from right

    **Comparison:**
    - Left[0] = 43
    - Right[0] = 3
    - Decision: 43 > 3
    - Action: Take **3** from right array

---

    ## Step 16: Added 3 to result from right array

    **Take from Right:**
    - Value taken: 3
    - Left remaining: [43]
    - Right remaining: []

---

    ## Step 17: Right exhausted: append remaining left elements [43]

    **Append Remainder:**
    - Source: left array
    - Values: [43]
    - Reason: Other array exhausted, copy rest directly

---

    ## Step 18: Merged result: [3, 43]

    **Merge Complete** (Depth 2)

    - Result: [3, 43]
    - Size: 2 elements
    - Status: Sorted subarray ready for parent merge

---

  ## Step 19: Merge sorted arrays [27, 38] and [3, 43]

  **Merge Operation Begins** (Depth 1)

  - Left sorted array: [27, 38]
  - Right sorted array: [3, 43]
  - Goal: Combine into single sorted array
  - Method: Compare elements from front of each array

---

  ## Step 20: Compare 27 > 3: take 3 from right

  **Comparison:**
  - Left[0] = 27
  - Right[0] = 3
  - Decision: 27 > 3
  - Action: Take **3** from right array

---

  ## Step 21: Added 3 to result from right array

  **Take from Right:**
  - Value taken: 3
  - Left remaining: [27, 38]
  - Right remaining: [43]

---

  ## Step 22: Compare 27 ≤ 43: take 27 from left

  **Comparison:**
  - Left[0] = 27
  - Right[1] = 43
  - Decision: 27 < 43
  - Action: Take **27** from left array

---

  ## Step 23: Added 27 to result from left array

  **Take from Left:**
  - Value taken: 27
  - Left remaining: [38]
  - Right remaining: [43]

---

  ## Step 24: Compare 38 ≤ 43: take 38 from left

  **Comparison:**
  - Left[1] = 38
  - Right[1] = 43
  - Decision: 38 < 43
  - Action: Take **38** from left array

---

  ## Step 25: Added 38 to result from left array

  **Take from Left:**
  - Value taken: 38
  - Left remaining: []
  - Right remaining: [43]

---

  ## Step 26: Left exhausted: append remaining right elements [43]

  **Append Remainder:**
  - Source: right array
  - Values: [43]
  - Reason: Other array exhausted, copy rest directly

---

  ## Step 27: Merged result: [3, 27, 38, 43]

  **Merge Complete** (Depth 1)

  - Result: [3, 27, 38, 43]
  - Size: 4 elements
  - Status: Sorted subarray ready for parent merge

---

  ## Step 28: Split array [9, 82, 10, 5] into [9, 82] and [10, 5]

  **Split Decision:**
  - Array: [9, 82, 10, 5]
  - Mid-point calculation: `mid = 4 // 2 = 2`
  - Left half: [9, 82] (indices [0:2])
  - Right half: [10, 5] (indices [2:4])

  **Why split here?** Divide-and-conquer strategy: split roughly in half until we reach single elements (base case).

---

    ## Step 29: Split array [9, 82] into [9] and [82]

    **Split Decision:**
    - Array: [9, 82]
    - Mid-point calculation: `mid = 2 // 2 = 1`
    - Left half: [9] (indices [0:1])
    - Right half: [82] (indices [1:2])

    **Why split here?** Divide-and-conquer strategy: split roughly in half until we reach single elements (base case).

---

      ## Step 30: Base case: array [9] has 1 element(s), already sorted

      **Base Case Reached** (Depth 3)

      - Array: [9]
      - Size: 1 element(s)
      - Decision: Single element is already sorted, return as-is

---

      ## Step 31: Base case: array [82] has 1 element(s), already sorted

      **Base Case Reached** (Depth 3)

      - Array: [82]
      - Size: 1 element(s)
      - Decision: Single element is already sorted, return as-is

---

    ## Step 32: Merge sorted arrays [9] and [82]

    **Merge Operation Begins** (Depth 2)

    - Left sorted array: [9]
    - Right sorted array: [82]
    - Goal: Combine into single sorted array
    - Method: Compare elements from front of each array

---

    ## Step 33: Compare 9 ≤ 82: take 9 from left

    **Comparison:**
    - Left[0] = 9
    - Right[0] = 82
    - Decision: 9 < 82
    - Action: Take **9** from left array

---

    ## Step 34: Added 9 to result from left array

    **Take from Left:**
    - Value taken: 9
    - Left remaining: []
    - Right remaining: [82]

---

    ## Step 35: Left exhausted: append remaining right elements [82]

    **Append Remainder:**
    - Source: right array
    - Values: [82]
    - Reason: Other array exhausted, copy rest directly

---

    ## Step 36: Merged result: [9, 82]

    **Merge Complete** (Depth 2)

    - Result: [9, 82]
    - Size: 2 elements
    - Status: Sorted subarray ready for parent merge

---

    ## Step 37: Split array [10, 5] into [10] and [5]

    **Split Decision:**
    - Array: [10, 5]
    - Mid-point calculation: `mid = 2 // 2 = 1`
    - Left half: [10] (indices [0:1])
    - Right half: [5] (indices [1:2])

    **Why split here?** Divide-and-conquer strategy: split roughly in half until we reach single elements (base case).

---

      ## Step 38: Base case: array [10] has 1 element(s), already sorted

      **Base Case Reached** (Depth 3)

      - Array: [10]
      - Size: 1 element(s)
      - Decision: Single element is already sorted, return as-is

---

      ## Step 39: Base case: array [5] has 1 element(s), already sorted

      **Base Case Reached** (Depth 3)

      - Array: [5]
      - Size: 1 element(s)
      - Decision: Single element is already sorted, return as-is

---

    ## Step 40: Merge sorted arrays [10] and [5]

    **Merge Operation Begins** (Depth 2)

    - Left sorted array: [10]
    - Right sorted array: [5]
    - Goal: Combine into single sorted array
    - Method: Compare elements from front of each array

---

    ## Step 41: Compare 10 > 5: take 5 from right

    **Comparison:**
    - Left[0] = 10
    - Right[0] = 5
    - Decision: 10 > 5
    - Action: Take **5** from right array

---

    ## Step 42: Added 5 to result from right array

    **Take from Right:**
    - Value taken: 5
    - Left remaining: [10]
    - Right remaining: []

---

    ## Step 43: Right exhausted: append remaining left elements [10]

    **Append Remainder:**
    - Source: left array
    - Values: [10]
    - Reason: Other array exhausted, copy rest directly

---

    ## Step 44: Merged result: [5, 10]

    **Merge Complete** (Depth 2)

    - Result: [5, 10]
    - Size: 2 elements
    - Status: Sorted subarray ready for parent merge

---

  ## Step 45: Merge sorted arrays [9, 82] and [5, 10]

  **Merge Operation Begins** (Depth 1)

  - Left sorted array: [9, 82]
  - Right sorted array: [5, 10]
  - Goal: Combine into single sorted array
  - Method: Compare elements from front of each array

---

  ## Step 46: Compare 9 > 5: take 5 from right

  **Comparison:**
  - Left[0] = 9
  - Right[0] = 5
  - Decision: 9 > 5
  - Action: Take **5** from right array

---

  ## Step 47: Added 5 to result from right array

  **Take from Right:**
  - Value taken: 5
  - Left remaining: [9, 82]
  - Right remaining: [10]

---

  ## Step 48: Compare 9 ≤ 10: take 9 from left

  **Comparison:**
  - Left[0] = 9
  - Right[1] = 10
  - Decision: 9 < 10
  - Action: Take **9** from left array

---

  ## Step 49: Added 9 to result from left array

  **Take from Left:**
  - Value taken: 9
  - Left remaining: [82]
  - Right remaining: [10]

---

  ## Step 50: Compare 82 > 10: take 10 from right

  **Comparison:**
  - Left[1] = 82
  - Right[1] = 10
  - Decision: 82 > 10
  - Action: Take **10** from right array

---

  ## Step 51: Added 10 to result from right array

  **Take from Right:**
  - Value taken: 10
  - Left remaining: [82]
  - Right remaining: []

---

  ## Step 52: Right exhausted: append remaining left elements [82]

  **Append Remainder:**
  - Source: left array
  - Values: [82]
  - Reason: Other array exhausted, copy rest directly

---

  ## Step 53: Merged result: [5, 9, 10, 82]

  **Merge Complete** (Depth 1)

  - Result: [5, 9, 10, 82]
  - Size: 4 elements
  - Status: Sorted subarray ready for parent merge

---

## Step 54: Merge sorted arrays [3, 27, 38, 43] and [5, 9, 10, 82]

**Merge Operation Begins** (Depth 0)

- Left sorted array: [3, 27, 38, 43]
- Right sorted array: [5, 9, 10, 82]
- Goal: Combine into single sorted array
- Method: Compare elements from front of each array

---

## Step 55: Compare 3 ≤ 5: take 3 from left

**Comparison:**
- Left[0] = 3
- Right[0] = 5
- Decision: 3 < 5
- Action: Take **3** from left array

---

## Step 56: Added 3 to result from left array

**Take from Left:**
- Value taken: 3
- Left remaining: [27, 38, 43]
- Right remaining: [5, 9, 10, 82]

---

## Step 57: Compare 27 > 5: take 5 from right

**Comparison:**
- Left[1] = 27
- Right[0] = 5
- Decision: 27 > 5
- Action: Take **5** from right array

---

## Step 58: Added 5 to result from right array

**Take from Right:**
- Value taken: 5
- Left remaining: [27, 38, 43]
- Right remaining: [9, 10, 82]

---

## Step 59: Compare 27 > 9: take 9 from right

**Comparison:**
- Left[1] = 27
- Right[1] = 9
- Decision: 27 > 9
- Action: Take **9** from right array

---

## Step 60: Added 9 to result from right array

**Take from Right:**
- Value taken: 9
- Left remaining: [27, 38, 43]
- Right remaining: [10, 82]

---

## Step 61: Compare 27 > 10: take 10 from right

**Comparison:**
- Left[1] = 27
- Right[2] = 10
- Decision: 27 > 10
- Action: Take **10** from right array

---

## Step 62: Added 10 to result from right array

**Take from Right:**
- Value taken: 10
- Left remaining: [27, 38, 43]
- Right remaining: [82]

---

## Step 63: Compare 27 ≤ 82: take 27 from left

**Comparison:**
- Left[1] = 27
- Right[3] = 82
- Decision: 27 < 82
- Action: Take **27** from left array

---

## Step 64: Added 27 to result from left array

**Take from Left:**
- Value taken: 27
- Left remaining: [38, 43]
- Right remaining: [82]

---

## Step 65: Compare 38 ≤ 82: take 38 from left

**Comparison:**
- Left[2] = 38
- Right[3] = 82
- Decision: 38 < 82
- Action: Take **38** from left array

---

## Step 66: Added 38 to result from left array

**Take from Left:**
- Value taken: 38
- Left remaining: [43]
- Right remaining: [82]

---

## Step 67: Compare 43 ≤ 82: take 43 from left

**Comparison:**
- Left[3] = 43
- Right[3] = 82
- Decision: 43 < 82
- Action: Take **43** from left array

---

## Step 68: Added 43 to result from left array

**Take from Left:**
- Value taken: 43
- Left remaining: []
- Right remaining: [82]

---

## Step 69: Left exhausted: append remaining right elements [82]

**Append Remainder:**
- Source: right array
- Values: [82]
- Reason: Other array exhausted, copy rest directly

---

## Step 70: Merged result: [3, 5, 9, 10, 27, 38, 43, 82]

**Merge Complete** (Depth 0)

- Result: [3, 5, 9, 10, 27, 38, 43, 82]
- Size: 8 elements
- Status: Sorted subarray ready for parent merge

---

## Step 71: ✅ Merge Sort complete: 8 elements sorted

🎉 **Sorting Complete!**

**Final Result:** [3, 5, 9, 10, 27, 38, 43, 82]
**Statistics:**
- Total comparisons: 17
- Total merge operations: 7
- Original array: [38, 27, 43, 3, 9, 82, 10, 5]
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
