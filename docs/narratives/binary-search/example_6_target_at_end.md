# Binary Search Execution Narrative

**Algorithm:** Binary Search
**Input Array:** [10, 20, 30, 40, 50]
**Target Value:** 50
**Array Size:** 5 elements
**Result:** ✅ FOUND at index 4
**Total Comparisons:** 3

---

## Step 0: 🔍 Searching for 50 in sorted array of 5 elements

**Search Configuration:**
- Target: `50`
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

## Step 2: ➡️ 30 < 50, search right half (eliminate 3 elements)

**Comparison:** `30 < 50`

**Decision:** Mid value is **less than** target
- Target must be in the **right half** (larger values)
- Eliminate left half: indices [0, 2]
- Eliminated **3** elements from search

**Updated Pointers:**
- New left pointer: 3 (was 0)
- Right pointer: 4 (unchanged)

**Remaining Search Space:**
```
Index:   0   1   3   4
Value:  10  20  40  50
```
*Search space reduced to **5 elements***

---

## Step 3: 📍 Calculate middle: index 3 (value = 40)

**Calculation:**
```
mid = (3 + 4) // 2 = 3
```

**Pointers:**
- Left pointer: index 3 (value = 40)
- Right pointer: index 4 (value = 50)
- Mid pointer: index **3** (value = **40**)

**Current Search Space:**
```
Index:   3   4
Value:  40  50
        LM  R
```
*Search space: **2 elements***

---

## Step 4: ➡️ 40 < 50, search right half (eliminate 1 elements)

**Comparison:** `40 < 50`

**Decision:** Mid value is **less than** target
- Target must be in the **right half** (larger values)
- Eliminate left half: indices [3, 3]
- Eliminated **1** elements from search

**Updated Pointers:**
- New left pointer: 4 (was 3)
- Right pointer: 4 (unchanged)

**Remaining Search Space:**
```
Index:   4
Value:  50
```
*Search space reduced to **2 elements***

---

## Step 5: 📍 Calculate middle: index 4 (value = 50)

**Calculation:**
```
mid = (4 + 4) // 2 = 4
```

**Pointers:**
- Left pointer: index 4 (value = 50)
- Right pointer: index 4 (value = 50)
- Mid pointer: index **4** (value = **50**)

**Current Search Space:**
```
Index:   4
Value:  50
        LM
```
*Search space: **1 elements***

---

## Step 6: ✅ Found target 50 at index 4 (after 3 comparisons)

🎯 **Match Found!**

**Comparison:** `target (50) == mid_value (50)`

**Result:**
- Target value **50** found at index **4**
- Total comparisons: 3
- Time complexity: O(log n) = O(log 5) ≈ 3 comparisons

---

## Execution Summary

**Final Result:** Target **50** found at index **4**
**Performance:**
- Comparisons: 3
- Theoretical maximum: 3 comparisons for array of size 5
- Time Complexity: O(log n)
- Space Complexity: O(1) (iterative implementation)

