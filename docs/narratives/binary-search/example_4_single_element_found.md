# Binary Search Execution Narrative

**Algorithm:** Binary Search
**Input Array:** [42]
**Target Value:** 42
**Array Size:** 1 elements
**Result:** ✅ FOUND at index 0
**Total Comparisons:** 1

---

## Step 0: 🔍 Searching for 42 in sorted array of 1 elements

**Search Configuration:**
- Target: `42`
- Array size: 1 elements
- Initial range: indices [0, 0]

**Array Visualization:**
```
Index:   0
Value:  42
         ^
         L
```
*Search space: **1 elements** (entire array)*

---

## Step 1: 📍 Calculate middle: index 0 (value = 42)

**Calculation:**
```
mid = (0 + 0) // 2 = 0
```

**Pointers:**
- Left pointer: index 0 (value = 42)
- Right pointer: index 0 (value = 42)
- Mid pointer: index **0** (value = **42**)

**Current Search Space:**
```
Index:   0
Value:  42
        LM
```
*Search space: **1 elements***

---

## Step 2: ✅ Found target 42 at index 0 (after 1 comparisons)

🎯 **Match Found!**

**Comparison:** `target (42) == mid_value (42)`

**Result:**
- Target value **42** found at index **0**
- Total comparisons: 1
- Time complexity: O(log n) = O(log 1) ≈ 1 comparisons

---

## Execution Summary

**Final Result:** Target **42** found at index **0**
**Performance:**
- Comparisons: 1
- Theoretical maximum: 1 comparisons for array of size 1
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
