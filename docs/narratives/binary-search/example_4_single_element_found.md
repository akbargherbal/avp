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

