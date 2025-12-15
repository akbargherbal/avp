# Two Pointer Pattern: Array Deduplication

**Input Array:** `[1, 1, 1, 1, 1]`
**Goal:** Remove duplicates in-place and find the count of unique elements.
**Result:** Found **1** unique elements. Final unique array: `[1]`

---

## Step 0: 🚀 Start: slow pointer at index 0, fast pointer at index 1.

**Initial Array State:**
```
Index:    0    1    2    3    4   
Value:    1    1    1    1    1   
State:    Unique Examining Pending Pending Pending
          S    F
```
---

## Step 1: Compare `arr[1]` and `arr[0]`

**State Before Comparison:**
```
Index:    0    1    2    3    4   
Value:    1    1    1    1    1   
State:    Unique Examining Pending Pending Pending
          S    F
```
**Decision:** Compare value at `fast` pointer (`1`) with value at `slow` pointer (`1`).
**Result:** `1 == 1`. This is a **duplicate**.
**Action:** Increment the `fast` pointer to scan the next element.

**State After Action:**
```
Index:    0    1    2    3    4   
Value:    1    1    1    1    1   
State:    Unique Duplicate Examining Pending Pending
          S         F
```
---

## Step 2: Compare `arr[2]` and `arr[0]`

**State Before Comparison:**
```
Index:    0    1    2    3    4   
Value:    1    1    1    1    1   
State:    Unique Duplicate Examining Pending Pending
          S         F
```
**Decision:** Compare value at `fast` pointer (`1`) with value at `slow` pointer (`1`).
**Result:** `1 == 1`. This is a **duplicate**.
**Action:** Increment the `fast` pointer to scan the next element.

**State After Action:**
```
Index:    0    1    2    3    4   
Value:    1    1    1    1    1   
State:    Unique Duplicate Duplicate Examining Pending
          S              F
```
---

## Step 3: Compare `arr[3]` and `arr[0]`

**State Before Comparison:**
```
Index:    0    1    2    3    4   
Value:    1    1    1    1    1   
State:    Unique Duplicate Duplicate Examining Pending
          S              F
```
**Decision:** Compare value at `fast` pointer (`1`) with value at `slow` pointer (`1`).
**Result:** `1 == 1`. This is a **duplicate**.
**Action:** Increment the `fast` pointer to scan the next element.

**State After Action:**
```
Index:    0    1    2    3    4   
Value:    1    1    1    1    1   
State:    Unique Duplicate Duplicate Duplicate Examining
          S                   F
```
---

## Step 4: Compare `arr[4]` and `arr[0]`

**State Before Comparison:**
```
Index:    0    1    2    3    4   
Value:    1    1    1    1    1   
State:    Unique Duplicate Duplicate Duplicate Examining
          S                   F
```
**Decision:** Compare value at `fast` pointer (`1`) with value at `slow` pointer (`1`).
**Result:** `1 == 1`. This is a **duplicate**.
**Action:** Increment the `fast` pointer to scan the next element.

**State After Action:**
```
Index:    0    1    2    3    4   
Value:    1    1    1    1    1   
State:    Unique Duplicate Duplicate Duplicate Duplicate
          S
```
---

## Step 5: ✅ Complete! Found 1 unique elements.

The `fast` pointer has reached the end of the array. The algorithm is complete.
The unique elements are from index 0 to the final `slow` pointer position (0).

**Final Array State:**
```
Index:    0    1    2    3    4   
Value:    1    1    1    1    1   
State:    Unique Stale Stale Stale Stale
          S
```
**Final Unique Array Slice:** `[1]`
**Total Unique Elements:** `1`

