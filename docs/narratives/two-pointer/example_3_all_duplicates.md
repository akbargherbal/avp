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


---

## 🎨 Frontend Visualization Hints

### Primary Metrics to Emphasize

- **Unique Count** (`metrics.unique_count`) - Shows running count of unique elements found
- **Pointer Positions** (`pointers.slow`, `pointers.fast`) - Critical for understanding the algorithm's state
- **Element States** - Visual distinction between unique, duplicate, examining, pending, and stale states

### Visualization Priorities

1. **Distinguish the two pointers clearly** - `slow` (write pointer) vs `fast` (read pointer) serve different roles
2. **Highlight the comparison moment** - Element at `fast` with state `examining` is the decision point
3. **Show in-place modification** - When unique element found, emphasize the copy operation from `fast` to `slow` position
4. **Visual separation of unique vs stale regions** - Final state should clearly show which elements matter

### Key JSON Paths

```
step.data.visualization.pointers.slow
step.data.visualization.pointers.fast
step.data.visualization.metrics.unique_count
step.data.visualization.array[*].state  // 'unique' | 'duplicate' | 'examining' | 'pending' | 'stale'
step.data.visualization.array[*].value
step.data.visualization.array[*].index
```

### Algorithm-Specific Guidance

The two-pointer technique's power comes from **in-place modification** - the array is modified as we scan it. The `slow` pointer marks the "write head" (where next unique element goes), while `fast` is the "read head" (scanning for candidates). Visually emphasizing this separation helps learners understand why we need two pointers instead of one. The moment when a unique element is found and copied (overwriting a duplicate) is pedagogically significant - consider animating this "write" operation to reinforce the in-place nature of the algorithm. The final state visualization should clearly show the "valid" region (indices 0 to slow) vs the "stale" region (beyond slow).
