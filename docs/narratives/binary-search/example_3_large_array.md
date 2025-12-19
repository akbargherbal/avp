# Binary Search Execution Narrative

**Algorithm:** Binary Search
**Input Array:** [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31, 33, 35, 37, 39, 41, 43, 45, 47, 49, 51, 53, 55, 57, 59, 61, 63, 65, 67, 69, 71, 73, 75, 77, 79, 81, 83, 85, 87, 89, 91, 93, 95, 97, 99]
**Target Value:** 51
**Array Size:** 50 elements
**Result:** ✅ FOUND at index 25
**Total Comparisons:** 5

---

## Step 0: 🔍 Searching for 51 in sorted array of 50 elements

**Search Configuration:**
- Target: `51`
- Array size: 50 elements
- Initial range: indices [0, 49]

**Array Visualization:**
```
Index:   0   1   2   3   4   5   6   7   8   9  10  11  12  13  14  15  16  17  18  19  20  21  22  23  24  25  26  27  28  29  30  31  32  33  34  35  36  37  38  39  40  41  42  43  44  45  46  47  48  49
Value:   1   3   5   7   9  11  13  15  17  19  21  23  25  27  29  31  33  35  37  39  41  43  45  47  49  51  53  55  57  59  61  63  65  67  69  71  73  75  77  79  81  83  85  87  89  91  93  95  97  99
         ^                                                                                                                                                                                                   ^
         L                                                                                                                                                                                                   R
```
*Search space: **50 elements** (entire array)*

---

## Step 1: 📍 Calculate middle: index 24 (value = 49)

**Calculation:**
```
mid = (0 + 49) // 2 = 24
```

**Pointers:**
- Left pointer: index 0 (value = 1)
- Right pointer: index 49 (value = 99)
- Mid pointer: index **24** (value = **49**)

**Current Search Space:**
```
Index:   0   1   2   3   4   5   6   7   8   9  10  11  12  13  14  15  16  17  18  19  20  21  22  23  24  25  26  27  28  29  30  31  32  33  34  35  36  37  38  39  40  41  42  43  44  45  46  47  48  49
Value:   1   3   5   7   9  11  13  15  17  19  21  23  25  27  29  31  33  35  37  39  41  43  45  47  49  51  53  55  57  59  61  63  65  67  69  71  73  75  77  79  81  83  85  87  89  91  93  95  97  99
         L                                                                       M                                                                          R
```
*Search space: **50 elements***

---

## Step 2: ➡️ 49 < 51, search right half (eliminate 25 elements)

**Comparison:** `49 < 51`

**Decision:** Mid value is **less than** target
- Target must be in the **right half** (larger values)
- Eliminate left half: indices [0, 24]
- Eliminated **25** elements from search

**Updated Pointers:**
- New left pointer: 25 (was 0)
- Right pointer: 49 (unchanged)

**Remaining Search Space:**
```
Index:  25  26  27  28  29  30  31  32  33  34  35  36  37  38  39  40  41  42  43  44  45  46  47  48  49
Value:  51  53  55  57  59  61  63  65  67  69  71  73  75  77  79  81  83  85  87  89  91  93  95  97  99
```
*Search space reduced to **25 elements***

---

## Step 3: 📍 Calculate middle: index 37 (value = 75)

**Calculation:**
```
mid = (25 + 49) // 2 = 37
```

**Pointers:**
- Left pointer: index 25 (value = 51)
- Right pointer: index 49 (value = 99)
- Mid pointer: index **37** (value = **75**)

**Current Search Space:**
```
Index:  25  26  27  28  29  30  31  32  33  34  35  36  37  38  39  40  41  42  43  44  45  46  47  48  49
Value:  51  53  55  57  59  61  63  65  67  69  71  73  75  77  79  81  83  85  87  89  91  93  95  97  99
         L                                   M                                   R
```
*Search space: **25 elements***

---

## Step 4: ⬅️ 75 > 51, search left half (eliminate 13 elements)

**Comparison:** `75 > 51`

**Decision:** Mid value is **greater than** target
- Target must be in the **left half** (smaller values)
- Eliminate right half: indices [37, 49]
- Eliminated **13** elements from search

**Updated Pointers:**
- Left pointer: 25 (unchanged)
- New right pointer: 36 (was 49)

**Remaining Search Space:**
```
Index:  25  26  27  28  29  30  31  32  33  34  35  36
Value:  51  53  55  57  59  61  63  65  67  69  71  73
```
*Search space reduced to **12 elements***

---

## Step 5: 📍 Calculate middle: index 30 (value = 61)

**Calculation:**
```
mid = (25 + 36) // 2 = 30
```

**Pointers:**
- Left pointer: index 25 (value = 51)
- Right pointer: index 36 (value = 73)
- Mid pointer: index **30** (value = **61**)

**Current Search Space:**
```
Index:  25  26  27  28  29  30  31  32  33  34  35  36
Value:  51  53  55  57  59  61  63  65  67  69  71  73
         L              M                 R
```
*Search space: **12 elements***

---

## Step 6: ⬅️ 61 > 51, search left half (eliminate 7 elements)

**Comparison:** `61 > 51`

**Decision:** Mid value is **greater than** target
- Target must be in the **left half** (smaller values)
- Eliminate right half: indices [30, 36]
- Eliminated **7** elements from search

**Updated Pointers:**
- Left pointer: 25 (unchanged)
- New right pointer: 29 (was 36)

**Remaining Search Space:**
```
Index:  25  26  27  28  29
Value:  51  53  55  57  59
```
*Search space reduced to **5 elements***

---

## Step 7: 📍 Calculate middle: index 27 (value = 55)

**Calculation:**
```
mid = (25 + 29) // 2 = 27
```

**Pointers:**
- Left pointer: index 25 (value = 51)
- Right pointer: index 29 (value = 59)
- Mid pointer: index **27** (value = **55**)

**Current Search Space:**
```
Index:  25  26  27  28  29
Value:  51  53  55  57  59
         L     M     R
```
*Search space: **5 elements***

---

## Step 8: ⬅️ 55 > 51, search left half (eliminate 3 elements)

**Comparison:** `55 > 51`

**Decision:** Mid value is **greater than** target
- Target must be in the **left half** (smaller values)
- Eliminate right half: indices [27, 29]
- Eliminated **3** elements from search

**Updated Pointers:**
- Left pointer: 25 (unchanged)
- New right pointer: 26 (was 29)

**Remaining Search Space:**
```
Index:  25  26
Value:  51  53
```
*Search space reduced to **2 elements***

---

## Step 9: 📍 Calculate middle: index 25 (value = 51)

**Calculation:**
```
mid = (25 + 26) // 2 = 25
```

**Pointers:**
- Left pointer: index 25 (value = 51)
- Right pointer: index 26 (value = 53)
- Mid pointer: index **25** (value = **51**)

**Current Search Space:**
```
Index:  25  26
Value:  51  53
        LM  R
```
*Search space: **2 elements***

---

## Step 10: ✅ Found target 51 at index 25 (after 5 comparisons)

🎯 **Match Found!**

**Comparison:** `target (51) == mid_value (51)`

**Result:**
- Target value **51** found at index **25**
- Total comparisons: 5
- Time complexity: O(log n) = O(log 50) ≈ 5 comparisons

---

## Execution Summary

**Final Result:** Target **51** found at index **25**
**Performance:**
- Comparisons: 5
- Theoretical maximum: 6 comparisons for array of size 50
- Time Complexity: O(log n)
- Space Complexity: O(1) (iterative implementation)

---

## 🎨 Frontend Visualization Hints

### Primary Metrics to Emphasize

- **Search Space Size** (`search_space_size`) - Shows how quickly the algorithm narrows down possibilities
- **Comparison Count** (`comparisons`) - Demonstrates O(log n) efficiency in real-time
- **Pointer Positions** (`pointers.left`, `pointers.mid`, `pointers.right`) - Visual representation of the divide-and-conquer strategy

### Visualization Priorities

1. **Highlight the shrinking search space** - Use distinct colors for `active_range` vs `excluded` states
2. **Emphasize the mid-point comparison** - The `examining` state is the critical decision moment
3. **Animate pointer movements** - Show left/right pointer jumps to visualize elimination of half the array
4. **Celebrate the find moment** - When state becomes `found`, use visual feedback (e.g., pulse, color change)

### Key JSON Paths

```
step.data.visualization.pointers.left
step.data.visualization.pointers.mid
step.data.visualization.pointers.right
step.data.visualization.pointers.target
step.data.visualization.search_space_size
step.data.visualization.array[*].state  // 'active_range' | 'examining' | 'excluded' | 'found'
step.data.visualization.array[*].value
step.data.visualization.array[*].index
```

### Algorithm-Specific Guidance

Binary search's power comes from **eliminating half the search space with each comparison**. The most pedagogically important visualization is showing this dramatic reduction - from N elements to N/2 to N/4 to N/8, etc. Consider using a **shrinking visual container** or **fading out excluded elements** to emphasize this. The mid-point calculation and comparison are the "brain" of the algorithm - highlight these moments. When the target is found (or proven absent), the final state should clearly show the journey: how many elements were examined vs. how many were eliminated without ever being touched. This reinforces the O(log n) efficiency that makes binary search so powerful.
