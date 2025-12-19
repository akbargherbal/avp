# Binary Search Execution Narrative

**Algorithm:** Binary Search
**Input Array:** [4, 11, 12, 14, 22, 23, 33, 34, 39, 48, 51, 59, 63, 69, 70, 71, 74, 79]
**Target Value:** 59
**Array Size:** 18 elements
**Result:** ✅ FOUND at index 11
**Total Comparisons:** 4

---

## Step 0: 🔍 Searching for 59 in sorted array of 18 elements

**Search Configuration:**
- Target: `59`
- Array size: 18 elements
- Initial range: indices [0, 17]

**Array Visualization:**
```
Index:   0   1   2   3   4   5   6   7   8   9  10  11  12  13  14  15  16  17
Value:   4  11  12  14  22  23  33  34  39  48  51  59  63  69  70  71  74  79
         ^                                                                   ^
         L                                                                   R
```
*Search space: **18 elements** (entire array)*

---

## Step 1: 📍 Calculate middle: index 8 (value = 39)

**Calculation:**
```
mid = (0 + 17) // 2 = 8
```

**Pointers:**
- Left pointer: index 0 (value = 4)
- Right pointer: index 17 (value = 79)
- Mid pointer: index **8** (value = **39**)

**Current Search Space:**
```
Index:   0   1   2   3   4   5   6   7   8   9  10  11  12  13  14  15  16  17
Value:   4  11  12  14  22  23  33  34  39  48  51  59  63  69  70  71  74  79
         L                       M                          R
```
*Search space: **18 elements***

---

## Step 2: ➡️ 39 < 59, search right half (eliminate 9 elements)

**Comparison:** `39 < 59`

**Decision:** Mid value is **less than** target
- Target must be in the **right half** (larger values)
- Eliminate left half: indices [0, 8]
- Eliminated **9** elements from search

**Updated Pointers:**
- New left pointer: 9 (was 0)
- Right pointer: 17 (unchanged)

**Remaining Search Space:**
```
Index:   9  10  11  12  13  14  15  16  17
Value:  48  51  59  63  69  70  71  74  79
```
*Search space reduced to **9 elements***

---

## Step 3: 📍 Calculate middle: index 13 (value = 69)

**Calculation:**
```
mid = (9 + 17) // 2 = 13
```

**Pointers:**
- Left pointer: index 9 (value = 48)
- Right pointer: index 17 (value = 79)
- Mid pointer: index **13** (value = **69**)

**Current Search Space:**
```
Index:   9  10  11  12  13  14  15  16  17
Value:  48  51  59  63  69  70  71  74  79
         L           M           R
```
*Search space: **9 elements***

---

## Step 4: ⬅️ 69 > 59, search left half (eliminate 5 elements)

**Comparison:** `69 > 59`

**Decision:** Mid value is **greater than** target
- Target must be in the **left half** (smaller values)
- Eliminate right half: indices [13, 17]
- Eliminated **5** elements from search

**Updated Pointers:**
- Left pointer: 9 (unchanged)
- New right pointer: 12 (was 17)

**Remaining Search Space:**
```
Index:   9  10  11  12
Value:  48  51  59  63
```
*Search space reduced to **4 elements***

---

## Step 5: 📍 Calculate middle: index 10 (value = 51)

**Calculation:**
```
mid = (9 + 12) // 2 = 10
```

**Pointers:**
- Left pointer: index 9 (value = 48)
- Right pointer: index 12 (value = 63)
- Mid pointer: index **10** (value = **51**)

**Current Search Space:**
```
Index:   9  10  11  12
Value:  48  51  59  63
         L  M     R
```
*Search space: **4 elements***

---

## Step 6: ➡️ 51 < 59, search right half (eliminate 2 elements)

**Comparison:** `51 < 59`

**Decision:** Mid value is **less than** target
- Target must be in the **right half** (larger values)
- Eliminate left half: indices [9, 10]
- Eliminated **2** elements from search

**Updated Pointers:**
- New left pointer: 11 (was 9)
- Right pointer: 12 (unchanged)

**Remaining Search Space:**
```
Index:  11  12
Value:  59  63
```
*Search space reduced to **2 elements***

---

## Step 7: 📍 Calculate middle: index 11 (value = 59)

**Calculation:**
```
mid = (11 + 12) // 2 = 11
```

**Pointers:**
- Left pointer: index 11 (value = 59)
- Right pointer: index 12 (value = 63)
- Mid pointer: index **11** (value = **59**)

**Current Search Space:**
```
Index:  11  12
Value:  59  63
        LM  R
```
*Search space: **2 elements***

---

## Step 8: ✅ Found target 59 at index 11 (after 4 comparisons)

🎯 **Match Found!**

**Comparison:** `target (59) == mid_value (59)`

**Result:**
- Target value **59** found at index **11**
- Total comparisons: 4
- Time complexity: O(log n) = O(log 18) ≈ 4 comparisons

---

## Execution Summary

**Final Result:** Target **59** found at index **11**
**Performance:**
- Comparisons: 4
- Theoretical maximum: 5 comparisons for array of size 18
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
