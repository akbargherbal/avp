# Two Pointer Pattern: Array Deduplication

**Input Array:** `[0, 1, 3, 3, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 7, 8, 8, 9]`
**Goal:** Remove duplicates in-place and find the count of unique elements.
**Result:** Found **9** unique elements. Final unique array: `[0, 1, 3, 4, 5, 6, 7, 8, 9]`

---

## Step 0: 🚀 Start: slow pointer at index 0, fast pointer at index 1.

**Initial Array State:**
```
Index:    0    1    2    3    4    5    6    7    8    9    10   11   12   13   14   15   16   17  
Value:    0    1    3    3    4    4    4    5    5    5    5    6    6    6    7    8    8    9   
State:    Unique Examining Pending Pending Pending Pending Pending Pending Pending Pending Pending Pending Pending Pending Pending Pending Pending Pending
          S    F
```
---

## Step 1: Compare `arr[1]` and `arr[0]`

**State Before Comparison:**
```
Index:    0    1    2    3    4    5    6    7    8    9    10   11   12   13   14   15   16   17  
Value:    0    1    3    3    4    4    4    5    5    5    5    6    6    6    7    8    8    9   
State:    Unique Examining Pending Pending Pending Pending Pending Pending Pending Pending Pending Pending Pending Pending Pending Pending Pending Pending
          S    F
```
**Decision:** Compare value at `fast` pointer (`1`) with value at `slow` pointer (`0`).
**Result:** `1 != 0`. This is a **new unique element**.
**Action:**
1. Increment `slow` pointer to index `1`.
2. **Copy value `1` from index `1` to index `1`, overwriting `1`.**
3. Increment `fast` pointer to continue scanning.

**State After Action:**
```
Index:    0    1    2    3    4    5    6    7    8    9    10   11   12   13   14   15   16   17  
Value:    0    1    3    3    4    4    4    5    5    5    5    6    6    6    7    8    8    9   
State:    Unique Unique Examining Pending Pending Pending Pending Pending Pending Pending Pending Pending Pending Pending Pending Pending Pending Pending
               S    F
```
---

## Step 2: Compare `arr[2]` and `arr[1]`

**State Before Comparison:**
```
Index:    0    1    2    3    4    5    6    7    8    9    10   11   12   13   14   15   16   17  
Value:    0    1    3    3    4    4    4    5    5    5    5    6    6    6    7    8    8    9   
State:    Unique Unique Examining Pending Pending Pending Pending Pending Pending Pending Pending Pending Pending Pending Pending Pending Pending Pending
               S    F
```
**Decision:** Compare value at `fast` pointer (`3`) with value at `slow` pointer (`1`).
**Result:** `3 != 1`. This is a **new unique element**.
**Action:**
1. Increment `slow` pointer to index `2`.
2. **Copy value `3` from index `2` to index `2`, overwriting `3`.**
3. Increment `fast` pointer to continue scanning.

**State After Action:**
```
Index:    0    1    2    3    4    5    6    7    8    9    10   11   12   13   14   15   16   17  
Value:    0    1    3    3    4    4    4    5    5    5    5    6    6    6    7    8    8    9   
State:    Unique Unique Unique Examining Pending Pending Pending Pending Pending Pending Pending Pending Pending Pending Pending Pending Pending Pending
                    S    F
```
---

## Step 3: Compare `arr[3]` and `arr[2]`

**State Before Comparison:**
```
Index:    0    1    2    3    4    5    6    7    8    9    10   11   12   13   14   15   16   17  
Value:    0    1    3    3    4    4    4    5    5    5    5    6    6    6    7    8    8    9   
State:    Unique Unique Unique Examining Pending Pending Pending Pending Pending Pending Pending Pending Pending Pending Pending Pending Pending Pending
                    S    F
```
**Decision:** Compare value at `fast` pointer (`3`) with value at `slow` pointer (`3`).
**Result:** `3 == 3`. This is a **duplicate**.
**Action:** Increment the `fast` pointer to scan the next element.

**State After Action:**
```
Index:    0    1    2    3    4    5    6    7    8    9    10   11   12   13   14   15   16   17  
Value:    0    1    3    3    4    4    4    5    5    5    5    6    6    6    7    8    8    9   
State:    Unique Unique Unique Duplicate Examining Pending Pending Pending Pending Pending Pending Pending Pending Pending Pending Pending Pending Pending
                    S         F
```
---

## Step 4: Compare `arr[4]` and `arr[2]`

**State Before Comparison:**
```
Index:    0    1    2    3    4    5    6    7    8    9    10   11   12   13   14   15   16   17  
Value:    0    1    3    3    4    4    4    5    5    5    5    6    6    6    7    8    8    9   
State:    Unique Unique Unique Duplicate Examining Pending Pending Pending Pending Pending Pending Pending Pending Pending Pending Pending Pending Pending
                    S         F
```
**Decision:** Compare value at `fast` pointer (`4`) with value at `slow` pointer (`3`).
**Result:** `4 != 3`. This is a **new unique element**.
**Action:**
1. Increment `slow` pointer to index `3`.
2. **Copy value `4` from index `4` to index `3`, overwriting `3`.**
3. Increment `fast` pointer to continue scanning.

**State After Action:**
```
Index:    0    1    2    3    4    5    6    7    8    9    10   11   12   13   14   15   16   17  
Value:    0    1    3    4    4    4    4    5    5    5    5    6    6    6    7    8    8    9   
State:    Unique Unique Unique Unique Duplicate Examining Pending Pending Pending Pending Pending Pending Pending Pending Pending Pending Pending Pending
                         S         F
```
---

## Step 5: Compare `arr[5]` and `arr[3]`

**State Before Comparison:**
```
Index:    0    1    2    3    4    5    6    7    8    9    10   11   12   13   14   15   16   17  
Value:    0    1    3    4    4    4    4    5    5    5    5    6    6    6    7    8    8    9   
State:    Unique Unique Unique Unique Duplicate Examining Pending Pending Pending Pending Pending Pending Pending Pending Pending Pending Pending Pending
                         S         F
```
**Decision:** Compare value at `fast` pointer (`4`) with value at `slow` pointer (`4`).
**Result:** `4 == 4`. This is a **duplicate**.
**Action:** Increment the `fast` pointer to scan the next element.

**State After Action:**
```
Index:    0    1    2    3    4    5    6    7    8    9    10   11   12   13   14   15   16   17  
Value:    0    1    3    4    4    4    4    5    5    5    5    6    6    6    7    8    8    9   
State:    Unique Unique Unique Unique Duplicate Duplicate Examining Pending Pending Pending Pending Pending Pending Pending Pending Pending Pending Pending
                         S              F
```
---

## Step 6: Compare `arr[6]` and `arr[3]`

**State Before Comparison:**
```
Index:    0    1    2    3    4    5    6    7    8    9    10   11   12   13   14   15   16   17  
Value:    0    1    3    4    4    4    4    5    5    5    5    6    6    6    7    8    8    9   
State:    Unique Unique Unique Unique Duplicate Duplicate Examining Pending Pending Pending Pending Pending Pending Pending Pending Pending Pending Pending
                         S              F
```
**Decision:** Compare value at `fast` pointer (`4`) with value at `slow` pointer (`4`).
**Result:** `4 == 4`. This is a **duplicate**.
**Action:** Increment the `fast` pointer to scan the next element.

**State After Action:**
```
Index:    0    1    2    3    4    5    6    7    8    9    10   11   12   13   14   15   16   17  
Value:    0    1    3    4    4    4    4    5    5    5    5    6    6    6    7    8    8    9   
State:    Unique Unique Unique Unique Duplicate Duplicate Duplicate Examining Pending Pending Pending Pending Pending Pending Pending Pending Pending Pending
                         S                   F
```
---

## Step 7: Compare `arr[7]` and `arr[3]`

**State Before Comparison:**
```
Index:    0    1    2    3    4    5    6    7    8    9    10   11   12   13   14   15   16   17  
Value:    0    1    3    4    4    4    4    5    5    5    5    6    6    6    7    8    8    9   
State:    Unique Unique Unique Unique Duplicate Duplicate Duplicate Examining Pending Pending Pending Pending Pending Pending Pending Pending Pending Pending
                         S                   F
```
**Decision:** Compare value at `fast` pointer (`5`) with value at `slow` pointer (`4`).
**Result:** `5 != 4`. This is a **new unique element**.
**Action:**
1. Increment `slow` pointer to index `4`.
2. **Copy value `5` from index `7` to index `4`, overwriting `4`.**
3. Increment `fast` pointer to continue scanning.

**State After Action:**
```
Index:    0    1    2    3    4    5    6    7    8    9    10   11   12   13   14   15   16   17  
Value:    0    1    3    4    5    4    4    5    5    5    5    6    6    6    7    8    8    9   
State:    Unique Unique Unique Unique Unique Duplicate Duplicate Duplicate Examining Pending Pending Pending Pending Pending Pending Pending Pending Pending
                              S                   F
```
---

## Step 8: Compare `arr[8]` and `arr[4]`

**State Before Comparison:**
```
Index:    0    1    2    3    4    5    6    7    8    9    10   11   12   13   14   15   16   17  
Value:    0    1    3    4    5    4    4    5    5    5    5    6    6    6    7    8    8    9   
State:    Unique Unique Unique Unique Unique Duplicate Duplicate Duplicate Examining Pending Pending Pending Pending Pending Pending Pending Pending Pending
                              S                   F
```
**Decision:** Compare value at `fast` pointer (`5`) with value at `slow` pointer (`5`).
**Result:** `5 == 5`. This is a **duplicate**.
**Action:** Increment the `fast` pointer to scan the next element.

**State After Action:**
```
Index:    0    1    2    3    4    5    6    7    8    9    10   11   12   13   14   15   16   17  
Value:    0    1    3    4    5    4    4    5    5    5    5    6    6    6    7    8    8    9   
State:    Unique Unique Unique Unique Unique Duplicate Duplicate Duplicate Duplicate Examining Pending Pending Pending Pending Pending Pending Pending Pending
                              S                        F
```
---

## Step 9: Compare `arr[9]` and `arr[4]`

**State Before Comparison:**
```
Index:    0    1    2    3    4    5    6    7    8    9    10   11   12   13   14   15   16   17  
Value:    0    1    3    4    5    4    4    5    5    5    5    6    6    6    7    8    8    9   
State:    Unique Unique Unique Unique Unique Duplicate Duplicate Duplicate Duplicate Examining Pending Pending Pending Pending Pending Pending Pending Pending
                              S                        F
```
**Decision:** Compare value at `fast` pointer (`5`) with value at `slow` pointer (`5`).
**Result:** `5 == 5`. This is a **duplicate**.
**Action:** Increment the `fast` pointer to scan the next element.

**State After Action:**
```
Index:    0    1    2    3    4    5    6    7    8    9    10   11   12   13   14   15   16   17  
Value:    0    1    3    4    5    4    4    5    5    5    5    6    6    6    7    8    8    9   
State:    Unique Unique Unique Unique Unique Duplicate Duplicate Duplicate Duplicate Duplicate Examining Pending Pending Pending Pending Pending Pending Pending
                              S                             F
```
---

## Step 10: Compare `arr[10]` and `arr[4]`

**State Before Comparison:**
```
Index:    0    1    2    3    4    5    6    7    8    9    10   11   12   13   14   15   16   17  
Value:    0    1    3    4    5    4    4    5    5    5    5    6    6    6    7    8    8    9   
State:    Unique Unique Unique Unique Unique Duplicate Duplicate Duplicate Duplicate Duplicate Examining Pending Pending Pending Pending Pending Pending Pending
                              S                             F
```
**Decision:** Compare value at `fast` pointer (`5`) with value at `slow` pointer (`5`).
**Result:** `5 == 5`. This is a **duplicate**.
**Action:** Increment the `fast` pointer to scan the next element.

**State After Action:**
```
Index:    0    1    2    3    4    5    6    7    8    9    10   11   12   13   14   15   16   17  
Value:    0    1    3    4    5    4    4    5    5    5    5    6    6    6    7    8    8    9   
State:    Unique Unique Unique Unique Unique Duplicate Duplicate Duplicate Duplicate Duplicate Duplicate Examining Pending Pending Pending Pending Pending Pending
                              S                                  F
```
---

## Step 11: Compare `arr[11]` and `arr[4]`

**State Before Comparison:**
```
Index:    0    1    2    3    4    5    6    7    8    9    10   11   12   13   14   15   16   17  
Value:    0    1    3    4    5    4    4    5    5    5    5    6    6    6    7    8    8    9   
State:    Unique Unique Unique Unique Unique Duplicate Duplicate Duplicate Duplicate Duplicate Duplicate Examining Pending Pending Pending Pending Pending Pending
                              S                                  F
```
**Decision:** Compare value at `fast` pointer (`6`) with value at `slow` pointer (`5`).
**Result:** `6 != 5`. This is a **new unique element**.
**Action:**
1. Increment `slow` pointer to index `5`.
2. **Copy value `6` from index `11` to index `5`, overwriting `4`.**
3. Increment `fast` pointer to continue scanning.

**State After Action:**
```
Index:    0    1    2    3    4    5    6    7    8    9    10   11   12   13   14   15   16   17  
Value:    0    1    3    4    5    6    4    5    5    5    5    6    6    6    7    8    8    9   
State:    Unique Unique Unique Unique Unique Unique Duplicate Duplicate Duplicate Duplicate Duplicate Duplicate Examining Pending Pending Pending Pending Pending
                                   S                                  F
```
---

## Step 12: Compare `arr[12]` and `arr[5]`

**State Before Comparison:**
```
Index:    0    1    2    3    4    5    6    7    8    9    10   11   12   13   14   15   16   17  
Value:    0    1    3    4    5    6    4    5    5    5    5    6    6    6    7    8    8    9   
State:    Unique Unique Unique Unique Unique Unique Duplicate Duplicate Duplicate Duplicate Duplicate Duplicate Examining Pending Pending Pending Pending Pending
                                   S                                  F
```
**Decision:** Compare value at `fast` pointer (`6`) with value at `slow` pointer (`6`).
**Result:** `6 == 6`. This is a **duplicate**.
**Action:** Increment the `fast` pointer to scan the next element.

**State After Action:**
```
Index:    0    1    2    3    4    5    6    7    8    9    10   11   12   13   14   15   16   17  
Value:    0    1    3    4    5    6    4    5    5    5    5    6    6    6    7    8    8    9   
State:    Unique Unique Unique Unique Unique Unique Duplicate Duplicate Duplicate Duplicate Duplicate Duplicate Duplicate Examining Pending Pending Pending Pending
                                   S                                       F
```
---

## Step 13: Compare `arr[13]` and `arr[5]`

**State Before Comparison:**
```
Index:    0    1    2    3    4    5    6    7    8    9    10   11   12   13   14   15   16   17  
Value:    0    1    3    4    5    6    4    5    5    5    5    6    6    6    7    8    8    9   
State:    Unique Unique Unique Unique Unique Unique Duplicate Duplicate Duplicate Duplicate Duplicate Duplicate Duplicate Examining Pending Pending Pending Pending
                                   S                                       F
```
**Decision:** Compare value at `fast` pointer (`6`) with value at `slow` pointer (`6`).
**Result:** `6 == 6`. This is a **duplicate**.
**Action:** Increment the `fast` pointer to scan the next element.

**State After Action:**
```
Index:    0    1    2    3    4    5    6    7    8    9    10   11   12   13   14   15   16   17  
Value:    0    1    3    4    5    6    4    5    5    5    5    6    6    6    7    8    8    9   
State:    Unique Unique Unique Unique Unique Unique Duplicate Duplicate Duplicate Duplicate Duplicate Duplicate Duplicate Duplicate Examining Pending Pending Pending
                                   S                                            F
```
---

## Step 14: Compare `arr[14]` and `arr[5]`

**State Before Comparison:**
```
Index:    0    1    2    3    4    5    6    7    8    9    10   11   12   13   14   15   16   17  
Value:    0    1    3    4    5    6    4    5    5    5    5    6    6    6    7    8    8    9   
State:    Unique Unique Unique Unique Unique Unique Duplicate Duplicate Duplicate Duplicate Duplicate Duplicate Duplicate Duplicate Examining Pending Pending Pending
                                   S                                            F
```
**Decision:** Compare value at `fast` pointer (`7`) with value at `slow` pointer (`6`).
**Result:** `7 != 6`. This is a **new unique element**.
**Action:**
1. Increment `slow` pointer to index `6`.
2. **Copy value `7` from index `14` to index `6`, overwriting `4`.**
3. Increment `fast` pointer to continue scanning.

**State After Action:**
```
Index:    0    1    2    3    4    5    6    7    8    9    10   11   12   13   14   15   16   17  
Value:    0    1    3    4    5    6    7    5    5    5    5    6    6    6    7    8    8    9   
State:    Unique Unique Unique Unique Unique Unique Unique Duplicate Duplicate Duplicate Duplicate Duplicate Duplicate Duplicate Duplicate Examining Pending Pending
                                        S                                            F
```
---

## Step 15: Compare `arr[15]` and `arr[6]`

**State Before Comparison:**
```
Index:    0    1    2    3    4    5    6    7    8    9    10   11   12   13   14   15   16   17  
Value:    0    1    3    4    5    6    7    5    5    5    5    6    6    6    7    8    8    9   
State:    Unique Unique Unique Unique Unique Unique Unique Duplicate Duplicate Duplicate Duplicate Duplicate Duplicate Duplicate Duplicate Examining Pending Pending
                                        S                                            F
```
**Decision:** Compare value at `fast` pointer (`8`) with value at `slow` pointer (`7`).
**Result:** `8 != 7`. This is a **new unique element**.
**Action:**
1. Increment `slow` pointer to index `7`.
2. **Copy value `8` from index `15` to index `7`, overwriting `5`.**
3. Increment `fast` pointer to continue scanning.

**State After Action:**
```
Index:    0    1    2    3    4    5    6    7    8    9    10   11   12   13   14   15   16   17  
Value:    0    1    3    4    5    6    7    8    5    5    5    6    6    6    7    8    8    9   
State:    Unique Unique Unique Unique Unique Unique Unique Unique Duplicate Duplicate Duplicate Duplicate Duplicate Duplicate Duplicate Duplicate Examining Pending
                                             S                                            F
```
---

## Step 16: Compare `arr[16]` and `arr[7]`

**State Before Comparison:**
```
Index:    0    1    2    3    4    5    6    7    8    9    10   11   12   13   14   15   16   17  
Value:    0    1    3    4    5    6    7    8    5    5    5    6    6    6    7    8    8    9   
State:    Unique Unique Unique Unique Unique Unique Unique Unique Duplicate Duplicate Duplicate Duplicate Duplicate Duplicate Duplicate Duplicate Examining Pending
                                             S                                            F
```
**Decision:** Compare value at `fast` pointer (`8`) with value at `slow` pointer (`8`).
**Result:** `8 == 8`. This is a **duplicate**.
**Action:** Increment the `fast` pointer to scan the next element.

**State After Action:**
```
Index:    0    1    2    3    4    5    6    7    8    9    10   11   12   13   14   15   16   17  
Value:    0    1    3    4    5    6    7    8    5    5    5    6    6    6    7    8    8    9   
State:    Unique Unique Unique Unique Unique Unique Unique Unique Duplicate Duplicate Duplicate Duplicate Duplicate Duplicate Duplicate Duplicate Duplicate Examining
                                             S                                                 F
```
---

## Step 17: Compare `arr[17]` and `arr[7]`

**State Before Comparison:**
```
Index:    0    1    2    3    4    5    6    7    8    9    10   11   12   13   14   15   16   17  
Value:    0    1    3    4    5    6    7    8    5    5    5    6    6    6    7    8    8    9   
State:    Unique Unique Unique Unique Unique Unique Unique Unique Duplicate Duplicate Duplicate Duplicate Duplicate Duplicate Duplicate Duplicate Duplicate Examining
                                             S                                                 F
```
**Decision:** Compare value at `fast` pointer (`9`) with value at `slow` pointer (`8`).
**Result:** `9 != 8`. This is a **new unique element**.
**Action:**
1. Increment `slow` pointer to index `8`.
2. **Copy value `9` from index `17` to index `8`, overwriting `5`.**
3. Increment `fast` pointer to continue scanning.

**State After Action:**
```
Index:    0    1    2    3    4    5    6    7    8    9    10   11   12   13   14   15   16   17  
Value:    0    1    3    4    5    6    7    8    9    5    5    6    6    6    7    8    8    9   
State:    Unique Unique Unique Unique Unique Unique Unique Unique Unique Duplicate Duplicate Duplicate Duplicate Duplicate Duplicate Duplicate Duplicate Duplicate
                                                  S
```
---

## Step 18: ✅ Complete! Found 9 unique elements.

The `fast` pointer has reached the end of the array. The algorithm is complete.
The unique elements are from index 0 to the final `slow` pointer position (8).

**Final Array State:**
```
Index:    0    1    2    3    4    5    6    7    8    9    10   11   12   13   14   15   16   17  
Value:    0    1    3    4    5    6    7    8    9    5    5    6    6    6    7    8    8    9   
State:    Unique Unique Unique Unique Unique Unique Unique Unique Unique Stale Stale Stale Stale Stale Stale Stale Stale Stale
                                                  S
```
**Final Unique Array Slice:** `[0, 1, 3, 4, 5, 6, 7, 8, 9]`
**Total Unique Elements:** `9`


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
