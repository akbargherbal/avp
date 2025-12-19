# Binary Search Execution Narrative

**Algorithm:** Binary Search
**Input Array:** [10, 20, 30, 40, 50]
**Target Value:** 10
**Array Size:** 5 elements
**Result:** ✅ FOUND at index 0
**Total Comparisons:** 2

---

## Step 0: 🔍 Searching for 10 in sorted array of 5 elements

**Search Configuration:**
- Target: `10`
- Array size: 5 elements
- Initial range: indices [0, 4]

**Array Visualization:**
```
Index:   0   1   2   3   4
Value:  10  20  30  40  50
         ^               ^
         L               R
```
*Search space: **5 elements** (entire array)*

---

## Step 1: 📍 Calculate middle: index 2 (value = 30)

**Calculation:**
```
mid = (0 + 4) // 2 = 2
```

**Pointers:**
- Left pointer: index 0 (value = 10)
- Right pointer: index 4 (value = 50)
- Mid pointer: index **2** (value = **30**)

**Current Search Space:**
```
Index:   0   1   2   3   4
Value:  10  20  30  40  50
         L     M     R
```
*Search space: **5 elements***

---

## Step 2: ⬅️ 30 > 10, search left half (eliminate 3 elements)

**Comparison:** `30 > 10`

**Decision:** Mid value is **greater than** target
- Target must be in the **left half** (smaller values)
- Eliminate right half: indices [2, 4]
- Eliminated **3** elements from search

**Updated Pointers:**
- Left pointer: 0 (unchanged)
- New right pointer: 1 (was 4)

**Remaining Search Space:**
```
Index:   0   1
Value:  10  20
```
*Search space reduced to **2 elements***

---

## Step 3: 📍 Calculate middle: index 0 (value = 10)

**Calculation:**
```
mid = (0 + 1) // 2 = 0
```

**Pointers:**
- Left pointer: index 0 (value = 10)
- Right pointer: index 1 (value = 20)
- Mid pointer: index **0** (value = **10**)

**Current Search Space:**
```
Index:   0   1
Value:  10  20
        LM  R
```
*Search space: **2 elements***

---

## Step 4: ✅ Found target 10 at index 0 (after 2 comparisons)

🎯 **Match Found!**

**Comparison:** `target (10) == mid_value (10)`

**Result:**
- Target value **10** found at index **0**
- Total comparisons: 2
- Time complexity: O(log n) = O(log 5) ≈ 2 comparisons

---

## Execution Summary

**Final Result:** Target **10** found at index **0**
**Performance:**
- Comparisons: 2
- Theoretical maximum: 3 comparisons for array of size 5
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
