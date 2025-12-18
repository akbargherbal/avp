# Two Pointer Pattern: Array Deduplication

**Input Array:** `[1, 2, 3, 4, 5]`
**Goal:** Remove duplicates in-place and find the count of unique elements.
**Result:** Found **5** unique elements. Final unique array: `[1, 2, 3, 4, 5]`

---

## Step 0: 🚀 Start: slow pointer at index 0, fast pointer at index 1.

**Initial Array State:**
```
Index:    0    1    2    3    4   
Value:    1    2    3    4    5   
State:    Unique Examining Pending Pending Pending
          S    F
```
---

## Step 1: Compare `arr[1]` and `arr[0]`

**State Before Comparison:**
```
Index:    0    1    2    3    4   
Value:    1    2    3    4    5   
State:    Unique Examining Pending Pending Pending
          S    F
```
**Decision:** Compare value at `fast` pointer (`2`) with value at `slow` pointer (`1`).
**Result:** `2 != 1`. This is a **new unique element**.
**Action:**
1. Increment `slow` pointer to index `1`.
2. **Copy value `2` from index `1` to index `1`, overwriting `2`.**
3. Increment `fast` pointer to continue scanning.

**State After Action:**
```
Index:    0    1    2    3    4   
Value:    1    2    3    4    5   
State:    Unique Unique Examining Pending Pending
               S    F
```
---

## Step 2: Compare `arr[2]` and `arr[1]`

**State Before Comparison:**
```
Index:    0    1    2    3    4   
Value:    1    2    3    4    5   
State:    Unique Unique Examining Pending Pending
               S    F
```
**Decision:** Compare value at `fast` pointer (`3`) with value at `slow` pointer (`2`).
**Result:** `3 != 2`. This is a **new unique element**.
**Action:**
1. Increment `slow` pointer to index `2`.
2. **Copy value `3` from index `2` to index `2`, overwriting `3`.**
3. Increment `fast` pointer to continue scanning.

**State After Action:**
```
Index:    0    1    2    3    4   
Value:    1    2    3    4    5   
State:    Unique Unique Unique Examining Pending
                    S    F
```
---

## Step 3: Compare `arr[3]` and `arr[2]`

**State Before Comparison:**
```
Index:    0    1    2    3    4   
Value:    1    2    3    4    5   
State:    Unique Unique Unique Examining Pending
                    S    F
```
**Decision:** Compare value at `fast` pointer (`4`) with value at `slow` pointer (`3`).
**Result:** `4 != 3`. This is a **new unique element**.
**Action:**
1. Increment `slow` pointer to index `3`.
2. **Copy value `4` from index `3` to index `3`, overwriting `4`.**
3. Increment `fast` pointer to continue scanning.

**State After Action:**
```
Index:    0    1    2    3    4   
Value:    1    2    3    4    5   
State:    Unique Unique Unique Unique Examining
                         S    F
```
---

## Step 4: Compare `arr[4]` and `arr[3]`

**State Before Comparison:**
```
Index:    0    1    2    3    4   
Value:    1    2    3    4    5   
State:    Unique Unique Unique Unique Examining
                         S    F
```
**Decision:** Compare value at `fast` pointer (`5`) with value at `slow` pointer (`4`).
**Result:** `5 != 4`. This is a **new unique element**.
**Action:**
1. Increment `slow` pointer to index `4`.
2. **Copy value `5` from index `4` to index `4`, overwriting `5`.**
3. Increment `fast` pointer to continue scanning.

**State After Action:**
```
Index:    0    1    2    3    4   
Value:    1    2    3    4    5   
State:    Unique Unique Unique Unique Unique
                              S
```
---

## Step 5: ✅ Complete! Found 5 unique elements.

The `fast` pointer has reached the end of the array. The algorithm is complete.
The unique elements are from index 0 to the final `slow` pointer position (4).

**Final Array State:**
```
Index:    0    1    2    3    4   
Value:    1    2    3    4    5   
State:    Unique Unique Unique Unique Unique
                              S
```
**Final Unique Array Slice:** `[1, 2, 3, 4, 5]`
**Total Unique Elements:** `5`


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
