# Merge Sort Execution Narrative

**Algorithm:** Merge Sort
**Input Array:** [64, 34, 25, 12, 22, 11, 90, 88, 45, 50, 33, 17]
**Array Size:** 12 elements
**Result:** [11, 12, 17, 22, 25, 33, 34, 45, 50, 64, 88, 90]
**Total Comparisons:** 29
**Total Merges:** 11

---

## Step 0: 🔄 Starting Merge Sort on array of 12 elements

**Configuration:**
- Input: [64, 34, 25, 12, 22, 11, 90, 88, 45, 50, 33, 17]
- Size: 12 elements
- Strategy: Recursive divide-and-conquer
- Time Complexity: O(n log n)

---

## Step 1: Split array [64, 34, 25, 12, 22, 11, 90, 88, 45, 50, 33, 17] into [64, 34, 25, 12, 22, 11] and [90, 88, 45, 50, 33, 17]

**Split Decision:**
- Array: [64, 34, 25, 12, 22, 11, 90, 88, 45, 50, 33, 17]
- Mid-point calculation: `mid = 12 // 2 = 6`
- Left half: [64, 34, 25, 12, 22, 11] (indices [0:6])
- Right half: [90, 88, 45, 50, 33, 17] (indices [6:12])

**Why split here?** Divide-and-conquer strategy: split roughly in half until we reach single elements (base case).

---

  ## Step 2: Split array [64, 34, 25, 12, 22, 11] into [64, 34, 25] and [12, 22, 11]

  **Split Decision:**
  - Array: [64, 34, 25, 12, 22, 11]
  - Mid-point calculation: `mid = 6 // 2 = 3`
  - Left half: [64, 34, 25] (indices [0:3])
  - Right half: [12, 22, 11] (indices [3:6])

  **Why split here?** Divide-and-conquer strategy: split roughly in half until we reach single elements (base case).

---

    ## Step 3: Split array [64, 34, 25] into [64] and [34, 25]

    **Split Decision:**
    - Array: [64, 34, 25]
    - Mid-point calculation: `mid = 3 // 2 = 1`
    - Left half: [64] (indices [0:1])
    - Right half: [34, 25] (indices [1:3])

    **Why split here?** Divide-and-conquer strategy: split roughly in half until we reach single elements (base case).

---

      ## Step 4: Base case: array [64] has 1 element(s), already sorted

      **Base Case Reached** (Depth 3)

      - Array: [64]
      - Size: 1 element(s)
      - Decision: Single element is already sorted, return as-is

---

      ## Step 5: Split array [34, 25] into [34] and [25]

      **Split Decision:**
      - Array: [34, 25]
      - Mid-point calculation: `mid = 2 // 2 = 1`
      - Left half: [34] (indices [0:1])
      - Right half: [25] (indices [1:2])

      **Why split here?** Divide-and-conquer strategy: split roughly in half until we reach single elements (base case).

---

        ## Step 6: Base case: array [34] has 1 element(s), already sorted

        **Base Case Reached** (Depth 4)

        - Array: [34]
        - Size: 1 element(s)
        - Decision: Single element is already sorted, return as-is

---

        ## Step 7: Base case: array [25] has 1 element(s), already sorted

        **Base Case Reached** (Depth 4)

        - Array: [25]
        - Size: 1 element(s)
        - Decision: Single element is already sorted, return as-is

---

      ## Step 8: Merge sorted arrays [34] and [25]

      **Merge Operation Begins** (Depth 3)

      - Left sorted array: [34]
      - Right sorted array: [25]
      - Goal: Combine into single sorted array
      - Method: Compare elements from front of each array

---

      ## Step 9: Compare 34 > 25: take 25 from right

      **Comparison:**
      - Left[0] = 34
      - Right[0] = 25
      - Decision: 34 > 25
      - Action: Take **25** from right array

---

      ## Step 10: Added 25 to result from right array

      **Take from Right:**
      - Value taken: 25
      - Left remaining: [34]
      - Right remaining: []

---

      ## Step 11: Right exhausted: append remaining left elements [34]

      **Append Remainder:**
      - Source: left array
      - Values: [34]
      - Reason: Other array exhausted, copy rest directly

---

      ## Step 12: Merged result: [25, 34]

      **Merge Complete** (Depth 3)

      - Result: [25, 34]
      - Size: 2 elements
      - Status: Sorted subarray ready for parent merge

---

    ## Step 13: Merge sorted arrays [64] and [25, 34]

    **Merge Operation Begins** (Depth 2)

    - Left sorted array: [64]
    - Right sorted array: [25, 34]
    - Goal: Combine into single sorted array
    - Method: Compare elements from front of each array

---

    ## Step 14: Compare 64 > 25: take 25 from right

    **Comparison:**
    - Left[0] = 64
    - Right[0] = 25
    - Decision: 64 > 25
    - Action: Take **25** from right array

---

    ## Step 15: Added 25 to result from right array

    **Take from Right:**
    - Value taken: 25
    - Left remaining: [64]
    - Right remaining: [34]

---

    ## Step 16: Compare 64 > 34: take 34 from right

    **Comparison:**
    - Left[0] = 64
    - Right[1] = 34
    - Decision: 64 > 34
    - Action: Take **34** from right array

---

    ## Step 17: Added 34 to result from right array

    **Take from Right:**
    - Value taken: 34
    - Left remaining: [64]
    - Right remaining: []

---

    ## Step 18: Right exhausted: append remaining left elements [64]

    **Append Remainder:**
    - Source: left array
    - Values: [64]
    - Reason: Other array exhausted, copy rest directly

---

    ## Step 19: Merged result: [25, 34, 64]

    **Merge Complete** (Depth 2)

    - Result: [25, 34, 64]
    - Size: 3 elements
    - Status: Sorted subarray ready for parent merge

---

    ## Step 20: Split array [12, 22, 11] into [12] and [22, 11]

    **Split Decision:**
    - Array: [12, 22, 11]
    - Mid-point calculation: `mid = 3 // 2 = 1`
    - Left half: [12] (indices [0:1])
    - Right half: [22, 11] (indices [1:3])

    **Why split here?** Divide-and-conquer strategy: split roughly in half until we reach single elements (base case).

---

      ## Step 21: Base case: array [12] has 1 element(s), already sorted

      **Base Case Reached** (Depth 3)

      - Array: [12]
      - Size: 1 element(s)
      - Decision: Single element is already sorted, return as-is

---

      ## Step 22: Split array [22, 11] into [22] and [11]

      **Split Decision:**
      - Array: [22, 11]
      - Mid-point calculation: `mid = 2 // 2 = 1`
      - Left half: [22] (indices [0:1])
      - Right half: [11] (indices [1:2])

      **Why split here?** Divide-and-conquer strategy: split roughly in half until we reach single elements (base case).

---

        ## Step 23: Base case: array [22] has 1 element(s), already sorted

        **Base Case Reached** (Depth 4)

        - Array: [22]
        - Size: 1 element(s)
        - Decision: Single element is already sorted, return as-is

---

        ## Step 24: Base case: array [11] has 1 element(s), already sorted

        **Base Case Reached** (Depth 4)

        - Array: [11]
        - Size: 1 element(s)
        - Decision: Single element is already sorted, return as-is

---

      ## Step 25: Merge sorted arrays [22] and [11]

      **Merge Operation Begins** (Depth 3)

      - Left sorted array: [22]
      - Right sorted array: [11]
      - Goal: Combine into single sorted array
      - Method: Compare elements from front of each array

---

      ## Step 26: Compare 22 > 11: take 11 from right

      **Comparison:**
      - Left[0] = 22
      - Right[0] = 11
      - Decision: 22 > 11
      - Action: Take **11** from right array

---

      ## Step 27: Added 11 to result from right array

      **Take from Right:**
      - Value taken: 11
      - Left remaining: [22]
      - Right remaining: []

---

      ## Step 28: Right exhausted: append remaining left elements [22]

      **Append Remainder:**
      - Source: left array
      - Values: [22]
      - Reason: Other array exhausted, copy rest directly

---

      ## Step 29: Merged result: [11, 22]

      **Merge Complete** (Depth 3)

      - Result: [11, 22]
      - Size: 2 elements
      - Status: Sorted subarray ready for parent merge

---

    ## Step 30: Merge sorted arrays [12] and [11, 22]

    **Merge Operation Begins** (Depth 2)

    - Left sorted array: [12]
    - Right sorted array: [11, 22]
    - Goal: Combine into single sorted array
    - Method: Compare elements from front of each array

---

    ## Step 31: Compare 12 > 11: take 11 from right

    **Comparison:**
    - Left[0] = 12
    - Right[0] = 11
    - Decision: 12 > 11
    - Action: Take **11** from right array

---

    ## Step 32: Added 11 to result from right array

    **Take from Right:**
    - Value taken: 11
    - Left remaining: [12]
    - Right remaining: [22]

---

    ## Step 33: Compare 12 ≤ 22: take 12 from left

    **Comparison:**
    - Left[0] = 12
    - Right[1] = 22
    - Decision: 12 < 22
    - Action: Take **12** from left array

---

    ## Step 34: Added 12 to result from left array

    **Take from Left:**
    - Value taken: 12
    - Left remaining: []
    - Right remaining: [22]

---

    ## Step 35: Left exhausted: append remaining right elements [22]

    **Append Remainder:**
    - Source: right array
    - Values: [22]
    - Reason: Other array exhausted, copy rest directly

---

    ## Step 36: Merged result: [11, 12, 22]

    **Merge Complete** (Depth 2)

    - Result: [11, 12, 22]
    - Size: 3 elements
    - Status: Sorted subarray ready for parent merge

---

  ## Step 37: Merge sorted arrays [25, 34, 64] and [11, 12, 22]

  **Merge Operation Begins** (Depth 1)

  - Left sorted array: [25, 34, 64]
  - Right sorted array: [11, 12, 22]
  - Goal: Combine into single sorted array
  - Method: Compare elements from front of each array

---

  ## Step 38: Compare 25 > 11: take 11 from right

  **Comparison:**
  - Left[0] = 25
  - Right[0] = 11
  - Decision: 25 > 11
  - Action: Take **11** from right array

---

  ## Step 39: Added 11 to result from right array

  **Take from Right:**
  - Value taken: 11
  - Left remaining: [25, 34, 64]
  - Right remaining: [12, 22]

---

  ## Step 40: Compare 25 > 12: take 12 from right

  **Comparison:**
  - Left[0] = 25
  - Right[1] = 12
  - Decision: 25 > 12
  - Action: Take **12** from right array

---

  ## Step 41: Added 12 to result from right array

  **Take from Right:**
  - Value taken: 12
  - Left remaining: [25, 34, 64]
  - Right remaining: [22]

---

  ## Step 42: Compare 25 > 22: take 22 from right

  **Comparison:**
  - Left[0] = 25
  - Right[2] = 22
  - Decision: 25 > 22
  - Action: Take **22** from right array

---

  ## Step 43: Added 22 to result from right array

  **Take from Right:**
  - Value taken: 22
  - Left remaining: [25, 34, 64]
  - Right remaining: []

---

  ## Step 44: Right exhausted: append remaining left elements [25, 34, 64]

  **Append Remainder:**
  - Source: left array
  - Values: [25, 34, 64]
  - Reason: Other array exhausted, copy rest directly

---

  ## Step 45: Merged result: [11, 12, 22, 25, 34, 64]

  **Merge Complete** (Depth 1)

  - Result: [11, 12, 22, 25, 34, 64]
  - Size: 6 elements
  - Status: Sorted subarray ready for parent merge

---

  ## Step 46: Split array [90, 88, 45, 50, 33, 17] into [90, 88, 45] and [50, 33, 17]

  **Split Decision:**
  - Array: [90, 88, 45, 50, 33, 17]
  - Mid-point calculation: `mid = 6 // 2 = 3`
  - Left half: [90, 88, 45] (indices [0:3])
  - Right half: [50, 33, 17] (indices [3:6])

  **Why split here?** Divide-and-conquer strategy: split roughly in half until we reach single elements (base case).

---

    ## Step 47: Split array [90, 88, 45] into [90] and [88, 45]

    **Split Decision:**
    - Array: [90, 88, 45]
    - Mid-point calculation: `mid = 3 // 2 = 1`
    - Left half: [90] (indices [0:1])
    - Right half: [88, 45] (indices [1:3])

    **Why split here?** Divide-and-conquer strategy: split roughly in half until we reach single elements (base case).

---

      ## Step 48: Base case: array [90] has 1 element(s), already sorted

      **Base Case Reached** (Depth 3)

      - Array: [90]
      - Size: 1 element(s)
      - Decision: Single element is already sorted, return as-is

---

      ## Step 49: Split array [88, 45] into [88] and [45]

      **Split Decision:**
      - Array: [88, 45]
      - Mid-point calculation: `mid = 2 // 2 = 1`
      - Left half: [88] (indices [0:1])
      - Right half: [45] (indices [1:2])

      **Why split here?** Divide-and-conquer strategy: split roughly in half until we reach single elements (base case).

---

        ## Step 50: Base case: array [88] has 1 element(s), already sorted

        **Base Case Reached** (Depth 4)

        - Array: [88]
        - Size: 1 element(s)
        - Decision: Single element is already sorted, return as-is

---

        ## Step 51: Base case: array [45] has 1 element(s), already sorted

        **Base Case Reached** (Depth 4)

        - Array: [45]
        - Size: 1 element(s)
        - Decision: Single element is already sorted, return as-is

---

      ## Step 52: Merge sorted arrays [88] and [45]

      **Merge Operation Begins** (Depth 3)

      - Left sorted array: [88]
      - Right sorted array: [45]
      - Goal: Combine into single sorted array
      - Method: Compare elements from front of each array

---

      ## Step 53: Compare 88 > 45: take 45 from right

      **Comparison:**
      - Left[0] = 88
      - Right[0] = 45
      - Decision: 88 > 45
      - Action: Take **45** from right array

---

      ## Step 54: Added 45 to result from right array

      **Take from Right:**
      - Value taken: 45
      - Left remaining: [88]
      - Right remaining: []

---

      ## Step 55: Right exhausted: append remaining left elements [88]

      **Append Remainder:**
      - Source: left array
      - Values: [88]
      - Reason: Other array exhausted, copy rest directly

---

      ## Step 56: Merged result: [45, 88]

      **Merge Complete** (Depth 3)

      - Result: [45, 88]
      - Size: 2 elements
      - Status: Sorted subarray ready for parent merge

---

    ## Step 57: Merge sorted arrays [90] and [45, 88]

    **Merge Operation Begins** (Depth 2)

    - Left sorted array: [90]
    - Right sorted array: [45, 88]
    - Goal: Combine into single sorted array
    - Method: Compare elements from front of each array

---

    ## Step 58: Compare 90 > 45: take 45 from right

    **Comparison:**
    - Left[0] = 90
    - Right[0] = 45
    - Decision: 90 > 45
    - Action: Take **45** from right array

---

    ## Step 59: Added 45 to result from right array

    **Take from Right:**
    - Value taken: 45
    - Left remaining: [90]
    - Right remaining: [88]

---

    ## Step 60: Compare 90 > 88: take 88 from right

    **Comparison:**
    - Left[0] = 90
    - Right[1] = 88
    - Decision: 90 > 88
    - Action: Take **88** from right array

---

    ## Step 61: Added 88 to result from right array

    **Take from Right:**
    - Value taken: 88
    - Left remaining: [90]
    - Right remaining: []

---

    ## Step 62: Right exhausted: append remaining left elements [90]

    **Append Remainder:**
    - Source: left array
    - Values: [90]
    - Reason: Other array exhausted, copy rest directly

---

    ## Step 63: Merged result: [45, 88, 90]

    **Merge Complete** (Depth 2)

    - Result: [45, 88, 90]
    - Size: 3 elements
    - Status: Sorted subarray ready for parent merge

---

    ## Step 64: Split array [50, 33, 17] into [50] and [33, 17]

    **Split Decision:**
    - Array: [50, 33, 17]
    - Mid-point calculation: `mid = 3 // 2 = 1`
    - Left half: [50] (indices [0:1])
    - Right half: [33, 17] (indices [1:3])

    **Why split here?** Divide-and-conquer strategy: split roughly in half until we reach single elements (base case).

---

      ## Step 65: Base case: array [50] has 1 element(s), already sorted

      **Base Case Reached** (Depth 3)

      - Array: [50]
      - Size: 1 element(s)
      - Decision: Single element is already sorted, return as-is

---

      ## Step 66: Split array [33, 17] into [33] and [17]

      **Split Decision:**
      - Array: [33, 17]
      - Mid-point calculation: `mid = 2 // 2 = 1`
      - Left half: [33] (indices [0:1])
      - Right half: [17] (indices [1:2])

      **Why split here?** Divide-and-conquer strategy: split roughly in half until we reach single elements (base case).

---

        ## Step 67: Base case: array [33] has 1 element(s), already sorted

        **Base Case Reached** (Depth 4)

        - Array: [33]
        - Size: 1 element(s)
        - Decision: Single element is already sorted, return as-is

---

        ## Step 68: Base case: array [17] has 1 element(s), already sorted

        **Base Case Reached** (Depth 4)

        - Array: [17]
        - Size: 1 element(s)
        - Decision: Single element is already sorted, return as-is

---

      ## Step 69: Merge sorted arrays [33] and [17]

      **Merge Operation Begins** (Depth 3)

      - Left sorted array: [33]
      - Right sorted array: [17]
      - Goal: Combine into single sorted array
      - Method: Compare elements from front of each array

---

      ## Step 70: Compare 33 > 17: take 17 from right

      **Comparison:**
      - Left[0] = 33
      - Right[0] = 17
      - Decision: 33 > 17
      - Action: Take **17** from right array

---

      ## Step 71: Added 17 to result from right array

      **Take from Right:**
      - Value taken: 17
      - Left remaining: [33]
      - Right remaining: []

---

      ## Step 72: Right exhausted: append remaining left elements [33]

      **Append Remainder:**
      - Source: left array
      - Values: [33]
      - Reason: Other array exhausted, copy rest directly

---

      ## Step 73: Merged result: [17, 33]

      **Merge Complete** (Depth 3)

      - Result: [17, 33]
      - Size: 2 elements
      - Status: Sorted subarray ready for parent merge

---

    ## Step 74: Merge sorted arrays [50] and [17, 33]

    **Merge Operation Begins** (Depth 2)

    - Left sorted array: [50]
    - Right sorted array: [17, 33]
    - Goal: Combine into single sorted array
    - Method: Compare elements from front of each array

---

    ## Step 75: Compare 50 > 17: take 17 from right

    **Comparison:**
    - Left[0] = 50
    - Right[0] = 17
    - Decision: 50 > 17
    - Action: Take **17** from right array

---

    ## Step 76: Added 17 to result from right array

    **Take from Right:**
    - Value taken: 17
    - Left remaining: [50]
    - Right remaining: [33]

---

    ## Step 77: Compare 50 > 33: take 33 from right

    **Comparison:**
    - Left[0] = 50
    - Right[1] = 33
    - Decision: 50 > 33
    - Action: Take **33** from right array

---

    ## Step 78: Added 33 to result from right array

    **Take from Right:**
    - Value taken: 33
    - Left remaining: [50]
    - Right remaining: []

---

    ## Step 79: Right exhausted: append remaining left elements [50]

    **Append Remainder:**
    - Source: left array
    - Values: [50]
    - Reason: Other array exhausted, copy rest directly

---

    ## Step 80: Merged result: [17, 33, 50]

    **Merge Complete** (Depth 2)

    - Result: [17, 33, 50]
    - Size: 3 elements
    - Status: Sorted subarray ready for parent merge

---

  ## Step 81: Merge sorted arrays [45, 88, 90] and [17, 33, 50]

  **Merge Operation Begins** (Depth 1)

  - Left sorted array: [45, 88, 90]
  - Right sorted array: [17, 33, 50]
  - Goal: Combine into single sorted array
  - Method: Compare elements from front of each array

---

  ## Step 82: Compare 45 > 17: take 17 from right

  **Comparison:**
  - Left[0] = 45
  - Right[0] = 17
  - Decision: 45 > 17
  - Action: Take **17** from right array

---

  ## Step 83: Added 17 to result from right array

  **Take from Right:**
  - Value taken: 17
  - Left remaining: [45, 88, 90]
  - Right remaining: [33, 50]

---

  ## Step 84: Compare 45 > 33: take 33 from right

  **Comparison:**
  - Left[0] = 45
  - Right[1] = 33
  - Decision: 45 > 33
  - Action: Take **33** from right array

---

  ## Step 85: Added 33 to result from right array

  **Take from Right:**
  - Value taken: 33
  - Left remaining: [45, 88, 90]
  - Right remaining: [50]

---

  ## Step 86: Compare 45 ≤ 50: take 45 from left

  **Comparison:**
  - Left[0] = 45
  - Right[2] = 50
  - Decision: 45 < 50
  - Action: Take **45** from left array

---

  ## Step 87: Added 45 to result from left array

  **Take from Left:**
  - Value taken: 45
  - Left remaining: [88, 90]
  - Right remaining: [50]

---

  ## Step 88: Compare 88 > 50: take 50 from right

  **Comparison:**
  - Left[1] = 88
  - Right[2] = 50
  - Decision: 88 > 50
  - Action: Take **50** from right array

---

  ## Step 89: Added 50 to result from right array

  **Take from Right:**
  - Value taken: 50
  - Left remaining: [88, 90]
  - Right remaining: []

---

  ## Step 90: Right exhausted: append remaining left elements [88, 90]

  **Append Remainder:**
  - Source: left array
  - Values: [88, 90]
  - Reason: Other array exhausted, copy rest directly

---

  ## Step 91: Merged result: [17, 33, 45, 50, 88, 90]

  **Merge Complete** (Depth 1)

  - Result: [17, 33, 45, 50, 88, 90]
  - Size: 6 elements
  - Status: Sorted subarray ready for parent merge

---

## Step 92: Merge sorted arrays [11, 12, 22, 25, 34, 64] and [17, 33, 45, 50, 88, 90]

**Merge Operation Begins** (Depth 0)

- Left sorted array: [11, 12, 22, 25, 34, 64]
- Right sorted array: [17, 33, 45, 50, 88, 90]
- Goal: Combine into single sorted array
- Method: Compare elements from front of each array

---

## Step 93: Compare 11 ≤ 17: take 11 from left

**Comparison:**
- Left[0] = 11
- Right[0] = 17
- Decision: 11 < 17
- Action: Take **11** from left array

---

## Step 94: Added 11 to result from left array

**Take from Left:**
- Value taken: 11
- Left remaining: [12, 22, 25, 34, 64]
- Right remaining: [17, 33, 45, 50, 88, 90]

---

## Step 95: Compare 12 ≤ 17: take 12 from left

**Comparison:**
- Left[1] = 12
- Right[0] = 17
- Decision: 12 < 17
- Action: Take **12** from left array

---

## Step 96: Added 12 to result from left array

**Take from Left:**
- Value taken: 12
- Left remaining: [22, 25, 34, 64]
- Right remaining: [17, 33, 45, 50, 88, 90]

---

## Step 97: Compare 22 > 17: take 17 from right

**Comparison:**
- Left[2] = 22
- Right[0] = 17
- Decision: 22 > 17
- Action: Take **17** from right array

---

## Step 98: Added 17 to result from right array

**Take from Right:**
- Value taken: 17
- Left remaining: [22, 25, 34, 64]
- Right remaining: [33, 45, 50, 88, 90]

---

## Step 99: Compare 22 ≤ 33: take 22 from left

**Comparison:**
- Left[2] = 22
- Right[1] = 33
- Decision: 22 < 33
- Action: Take **22** from left array

---

## Step 100: Added 22 to result from left array

**Take from Left:**
- Value taken: 22
- Left remaining: [25, 34, 64]
- Right remaining: [33, 45, 50, 88, 90]

---

## Step 101: Compare 25 ≤ 33: take 25 from left

**Comparison:**
- Left[3] = 25
- Right[1] = 33
- Decision: 25 < 33
- Action: Take **25** from left array

---

## Step 102: Added 25 to result from left array

**Take from Left:**
- Value taken: 25
- Left remaining: [34, 64]
- Right remaining: [33, 45, 50, 88, 90]

---

## Step 103: Compare 34 > 33: take 33 from right

**Comparison:**
- Left[4] = 34
- Right[1] = 33
- Decision: 34 > 33
- Action: Take **33** from right array

---

## Step 104: Added 33 to result from right array

**Take from Right:**
- Value taken: 33
- Left remaining: [34, 64]
- Right remaining: [45, 50, 88, 90]

---

## Step 105: Compare 34 ≤ 45: take 34 from left

**Comparison:**
- Left[4] = 34
- Right[2] = 45
- Decision: 34 < 45
- Action: Take **34** from left array

---

## Step 106: Added 34 to result from left array

**Take from Left:**
- Value taken: 34
- Left remaining: [64]
- Right remaining: [45, 50, 88, 90]

---

## Step 107: Compare 64 > 45: take 45 from right

**Comparison:**
- Left[5] = 64
- Right[2] = 45
- Decision: 64 > 45
- Action: Take **45** from right array

---

## Step 108: Added 45 to result from right array

**Take from Right:**
- Value taken: 45
- Left remaining: [64]
- Right remaining: [50, 88, 90]

---

## Step 109: Compare 64 > 50: take 50 from right

**Comparison:**
- Left[5] = 64
- Right[3] = 50
- Decision: 64 > 50
- Action: Take **50** from right array

---

## Step 110: Added 50 to result from right array

**Take from Right:**
- Value taken: 50
- Left remaining: [64]
- Right remaining: [88, 90]

---

## Step 111: Compare 64 ≤ 88: take 64 from left

**Comparison:**
- Left[5] = 64
- Right[4] = 88
- Decision: 64 < 88
- Action: Take **64** from left array

---

## Step 112: Added 64 to result from left array

**Take from Left:**
- Value taken: 64
- Left remaining: []
- Right remaining: [88, 90]

---

## Step 113: Left exhausted: append remaining right elements [88, 90]

**Append Remainder:**
- Source: right array
- Values: [88, 90]
- Reason: Other array exhausted, copy rest directly

---

## Step 114: Merged result: [11, 12, 17, 22, 25, 33, 34, 45, 50, 64, 88, 90]

**Merge Complete** (Depth 0)

- Result: [11, 12, 17, 22, 25, 33, 34, 45, 50, 64, 88, 90]
- Size: 12 elements
- Status: Sorted subarray ready for parent merge

---

## Step 115: ✅ Merge Sort complete: 12 elements sorted

🎉 **Sorting Complete!**

**Final Result:** [11, 12, 17, 22, 25, 33, 34, 45, 50, 64, 88, 90]
**Statistics:**
- Total comparisons: 29
- Total merge operations: 11
- Original array: [64, 34, 25, 12, 22, 11, 90, 88, 45, 50, 33, 17]
- Array is now sorted in ascending order

---

## Execution Summary

**Algorithm Strategy:**
1. **Divide:** Recursively split array in half until single elements
2. **Conquer:** Single elements are trivially sorted
3. **Combine:** Merge sorted subarrays by comparing front elements

**Performance:**
- Input size: 12 elements
- Comparisons: 29
- Merge operations: 11
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
