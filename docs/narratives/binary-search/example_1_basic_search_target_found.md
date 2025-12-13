# Binary Search Execution Narrative

**Algorithm:** Binary Search
**Input Array:** [4, 11, 12, 14, 22, 23, 33, 34, 39, 48, 51, 59, 63, 69, 70, 71, 74, 79, 91, 98]
**Target Value:** 59
**Array Size:** 20 elements
**Result:** ✅ FOUND at index 11
**Total Comparisons:** 3

---

## Step 0: 🔍 Searching for 59 in sorted array of 20 elements

**Search Configuration:**
- Target: `59`
- Array size: 20 elements
- Initial range: indices [0, 19]

**Array Visualization:**
```
Index:   0   1   2   3   4   5   6   7   8   9  10  11  12  13  14  15  16  17  18  19
Value:   4  11  12  14  22  23  33  34  39  48  51  59  63  69  70  71  74  79  91  98
         ^                                                                           ^
         L                                                                           R
```
*Search space: **20 elements** (entire array)*

---

## Step 1: 📍 Calculate middle: index 9 (value = 48)

**Calculation:**
```
mid = (0 + 19) // 2 = 9
```

**Pointers:**
- Left pointer: index 0 (value = 4)
- Right pointer: index 19 (value = 98)
- Mid pointer: index **9** (value = **48**)

**Current Search Space:**
```
Index:   0   1   2   3   4   5   6   7   8   9  10  11  12  13  14  15  16  17  18  19
Value:   4  11  12  14  22  23  33  34  39  48  51  59  63  69  70  71  74  79  91  98
         L                          M                             R
```
*Search space: **20 elements***

---

## Step 2: ➡️ 48 < 59, search right half (eliminate 10 elements)

**Comparison:** `48 < 59`

**Decision:** Mid value is **less than** target
- Target must be in the **right half** (larger values)
- Eliminate left half: indices [0, 9]
- Eliminated **10** elements from search

**Updated Pointers:**
- New left pointer: 10 (was 0)
- Right pointer: 19 (unchanged)

**Remaining Search Space:**
```
Index:   0   1   2   3   4   5   6   7   8  10  11  12  13  14  15  16  17  18  19
Value:   4  11  12  14  22  23  33  34  39  51  59  63  69  70  71  74  79  91  98
```
*Search space reduced to **20 elements***

---

## Step 3: 📍 Calculate middle: index 14 (value = 70)

**Calculation:**
```
mid = (10 + 19) // 2 = 14
```

**Pointers:**
- Left pointer: index 10 (value = 51)
- Right pointer: index 19 (value = 98)
- Mid pointer: index **14** (value = **70**)

**Current Search Space:**
```
Index:  10  11  12  13  14  15  16  17  18  19
Value:  51  59  63  69  70  71  74  79  91  98
         L           M              R
```
*Search space: **10 elements***

---

## Step 4: ⬅️ 70 > 59, search left half (eliminate 6 elements)

**Comparison:** `70 > 59`

**Decision:** Mid value is **greater than** target
- Target must be in the **left half** (smaller values)
- Eliminate right half: indices [14, 19]
- Eliminated **6** elements from search

**Updated Pointers:**
- Left pointer: 10 (unchanged)
- New right pointer: 13 (was 19)

**Remaining Search Space:**
```
Index:  10  11  12  13  15  16  17  18  19
Value:  51  59  63  69  71  74  79  91  98
```
*Search space reduced to **10 elements***

---

## Step 5: 📍 Calculate middle: index 11 (value = 59)

**Calculation:**
```
mid = (10 + 13) // 2 = 11
```

**Pointers:**
- Left pointer: index 10 (value = 51)
- Right pointer: index 13 (value = 69)
- Mid pointer: index **11** (value = **59**)

**Current Search Space:**
```
Index:  10  11  12  13
Value:  51  59  63  69
         L  M     R
```
*Search space: **4 elements***

---

## Step 6: ✅ Found target 59 at index 11 (after 3 comparisons)

🎯 **Match Found!**

**Comparison:** `target (59) == mid_value (59)`

**Result:**
- Target value **59** found at index **11**
- Total comparisons: 3
- Time complexity: O(log n) = O(log 20) ≈ 3 comparisons

---

## Execution Summary

**Final Result:** Target **59** found at index **11**
**Performance:**
- Comparisons: 3
- Theoretical maximum: 5 comparisons for array of size 20
- Time Complexity: O(log n)
- Space Complexity: O(1) (iterative implementation)

