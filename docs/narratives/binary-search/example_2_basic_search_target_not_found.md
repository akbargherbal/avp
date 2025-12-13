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
Index:   0   1   2   4   5   6   7
Value:   1   3   5   9  11  13  15
```
*Search space reduced to **8 elements***

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
Index:   0   2
Value:   1   5
```
*Search space reduced to **3 elements***

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

**Remaining Search Space:**
```
Index: 
Value: 
```
*Search space reduced to **1 elements***

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

