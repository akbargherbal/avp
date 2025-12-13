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
Index:   0   1   3   4
Value:  10  20  40  50
```
*Search space reduced to **5 elements***

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

