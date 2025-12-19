# Binary Search Execution Narrative

**Algorithm:** Binary Search
**Input Array:** [1, 3, 5, 7, 9, 11, 13, 15]
**Target Value:** 6
**Array Size:** 8 elements
**Result:** ❌ NOT FOUND
**Total Comparisons:** 3

---

## Step 0: 🔍 Searching for 6 in sorted array of 8 elements

**Search Configuration:**
- Target: `6`
- Array size: 8 elements
- Initial range: indices [0, 7]

**Array Visualization:**
```
Index:   0   1   2   3   4   5   6   7
Value:   1   3   5   7   9  11  13  15
         ^                           ^
         L                           R
```
*Search space: **8 elements** (entire array)*

---

## Step 1: 📍 Calculate middle: index 3 (value = 7)

**Calculation:**
```
mid = (0 + 7) // 2 = 3
```

**Pointers:**
- Left pointer: index 0 (value = 1)
- Right pointer: index 7 (value = 15)
- Mid pointer: index **3** (value = **7**)

**Current Search Space:**
```
Index:   0   1   2   3   4   5   6   7
Value:   1   3   5   7   9  11  13  15
         L        M           R
```
*Search space: **8 elements***

---

## Step 2: ⬅️ 7 > 6, search left half (eliminate 5 elements)

**Comparison:** `7 > 6`

**Decision:** Mid value is **greater than** target
- Target must be in the **left half** (smaller values)
- Eliminate right half: indices [3, 7]
- Eliminated **5** elements from search

**Updated Pointers:**
- Left pointer: 0 (unchanged)
- New right pointer: 2 (was 7)

**Remaining Search Space:**
```
Index:   0   1   2
Value:   1   3   5
```
*Search space reduced to **3 elements***

---

## Step 3: 📍 Calculate middle: index 1 (value = 3)

**Calculation:**
```
mid = (0 + 2) // 2 = 1
```

**Pointers:**
- Left pointer: index 0 (value = 1)
- Right pointer: index 2 (value = 5)
- Mid pointer: index **1** (value = **3**)

**Current Search Space:**
```
Index:   0   1   2
Value:   1   3   5
         L  M  R
```
*Search space: **3 elements***

---

## Step 4: ➡️ 3 < 6, search right half (eliminate 2 elements)

**Comparison:** `3 < 6`

**Decision:** Mid value is **less than** target
- Target must be in the **right half** (larger values)
- Eliminate left half: indices [0, 1]
- Eliminated **2** elements from search

**Updated Pointers:**
- New left pointer: 2 (was 0)
- Right pointer: 2 (unchanged)

**Remaining Search Space:**
```
Index:   2
Value:   5
```
*Search space reduced to **1 element***

---

## Step 5: 📍 Calculate middle: index 2 (value = 5)

**Calculation:**
```
mid = (2 + 2) // 2 = 2
```

**Pointers:**
- Left pointer: index 2 (value = 5)
- Right pointer: index 2 (value = 5)
- Mid pointer: index **2** (value = **5**)

**Current Search Space:**
```
Index:   2
Value:   5
        LM
```
*Search space: **1 elements***

---

## Step 6: ➡️ 5 < 6, search right half (eliminate 1 elements)

**Comparison:** `5 < 6`

**Decision:** Mid value is **less than** target
- Target must be in the **right half** (larger values)
- Eliminate left half: indices [2, 2]
- Eliminated **1** elements from search

**Updated Pointers:**
- New left pointer: 3 (was 2)
- Right pointer: 2 (unchanged)

---

## Step 7: ❌ Target 6 not found in array (after 3 comparisons)

❌ **Search Exhausted**

**Final State:**
- Search space is empty (left > right)
- Target value **6** does not exist in array
- Total comparisons: 3

**All elements excluded:**
```
Index:   0   1   2   3   4   5   6   7
Value:   1   3   5   7   9  11  13  15
State:   X   X   X   X   X   X   X   X
```

---

## Execution Summary

**Final Result:** Target **6** not found in array
**Performance:**
- Comparisons: 3
- Theoretical maximum: 4 comparisons for array of size 8
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
