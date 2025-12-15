# Two Pointer Pattern: Array Deduplication

**Input Array:** `[1, 1, 2, 2, 3]`
**Goal:** Remove duplicates in-place and find the count of unique elements.
**Result:** Found **3** unique elements. Final unique array: `[1, 2, 3]`

---

## Step 0: 🚀 Start: slow pointer at index 0, fast pointer at index 1.

**Initial Array State:**
```
Index:    0    1    2    3    4   
Value:    1    1    2    2    3   
State:    Unique Examining Pending Pending Pending
          S    F
```
---

## Step 1: Compare `arr[1]` and `arr[0]`

**State Before Comparison:**
```
Index:    0    1    2    3    4   
Value:    1    1    2    2    3   
State:    Unique Examining Pending Pending Pending
          S    F
```
**Decision:** Compare value at `fast` pointer (`1`) with value at `slow` pointer (`1`).
**Result:** `1 == 1`. This is a **duplicate**.
**Action:** Increment the `fast` pointer to scan the next element.

**State After Action:**
```
Index:    0    1    2    3    4   
Value:    1    1    2    2    3   
State:    Unique Duplicate Examining Pending Pending
          S         F
```
---

## Step 2: Compare `arr[2]` and `arr[0]`

**State Before Comparison:**
```
Index:    0    1    2    3    4   
Value:    1    1    2    2    3   
State:    Unique Duplicate Examining Pending Pending
          S         F
```
**Decision:** Compare value at `fast` pointer (`2`) with value at `slow` pointer (`1`).
**Result:** `2 != 1`. This is a **new unique element**.
**Action:**
1. Increment `slow` pointer to index `1`.
2. **Copy value `2` from index `2` to index `1`, overwriting `1`.**
3. Increment `fast` pointer to continue scanning.

**State After Action:**
```
Index:    0    1    2    3    4   
Value:    1    2    2    2    3   
State:    Unique Unique Duplicate Examining Pending
               S         F
```
---

## Step 3: Compare `arr[3]` and `arr[1]`

**State Before Comparison:**
```
Index:    0    1    2    3    4   
Value:    1    2    2    2    3   
State:    Unique Unique Duplicate Examining Pending
               S         F
```
**Decision:** Compare value at `fast` pointer (`2`) with value at `slow` pointer (`2`).
**Result:** `2 == 2`. This is a **duplicate**.
**Action:** Increment the `fast` pointer to scan the next element.

**State After Action:**
```
Index:    0    1    2    3    4   
Value:    1    2    2    2    3   
State:    Unique Unique Duplicate Duplicate Examining
               S              F
```
---

## Step 4: Compare `arr[4]` and `arr[1]`

**State Before Comparison:**
```
Index:    0    1    2    3    4   
Value:    1    2    2    2    3   
State:    Unique Unique Duplicate Duplicate Examining
               S              F
```
**Decision:** Compare value at `fast` pointer (`3`) with value at `slow` pointer (`2`).
**Result:** `3 != 2`. This is a **new unique element**.
**Action:**
1. Increment `slow` pointer to index `2`.
2. **Copy value `3` from index `4` to index `2`, overwriting `2`.**
3. Increment `fast` pointer to continue scanning.

**State After Action:**
```
Index:    0    1    2    3    4   
Value:    1    2    3    2    3   
State:    Unique Unique Unique Duplicate Duplicate
                    S
```
---

## Step 5: ✅ Complete! Found 3 unique elements.

The `fast` pointer has reached the end of the array. The algorithm is complete.
The unique elements are from index 0 to the final `slow` pointer position (2).

**Final Array State:**
```
Index:    0    1    2    3    4   
Value:    1    2    3    2    3   
State:    Unique Unique Unique Stale Stale
                    S
```
**Final Unique Array Slice:** `[1, 2, 3]`
**Total Unique Elements:** `3`

