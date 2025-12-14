# Algorithm Expansion: Implementation Plan

## Adding Two Pointer, Sliding Window, and Merge Sort

---

## Requirements Analysis

**Current State:**

- ✅ Platform architecture complete and validated
- ✅ 2 algorithms live (Binary Search, Interval Coverage)
- ✅ Registry-based system proven
- ✅ ArrayView component available for reuse
- ✅ v2.1 workflow with FAA gate operational

**Core Goal:** Add 3 high-impact algorithms (Two Pointer, Sliding Window, Merge Sort) to achieve 80% curriculum completeness and enable premium pricing.

**Technical Constraints:**

- Python backend (Flask)
- React frontend with Tailwind
- Must follow v2.1 workflow (includes FAA arithmetic audit)
- All algorithms reuse existing ArrayView component
- Registry-based architecture (no app.py modifications)

**Assumptions to Validate:**

- Two Pointer and Sliding Window can effectively use ArrayView (vs. needing custom components)
- Prediction points for patterns can be pedagogically valuable (not just algorithm-specific decisions)
- FAA audit time estimates (10-15 min) hold for these algorithm types
- All three algorithms fit within 2-hour implementation target per algorithm

---

## Strategic Approach

**Why This Phasing?**

1. **Pattern First (Two Pointer, Sliding Window)** - These share conceptual similarity and build student pattern recognition skills
2. **Paradigm Last (Merge Sort)** - More complex, validates divide-and-conquer visualization
3. **Incremental Validation** - Each algorithm proves platform scalability before adding next

**Main Risk Areas:**

1. **Pattern visualization clarity** - Two Pointer/Sliding Window are more abstract than Binary Search
2. **Narrative complexity** - Merge Sort recursion depth may challenge narrative generation
3. **FAA audit scope creep** - More complex algorithms = more arithmetic to verify

**Validation Strategy:**

- Deploy each algorithm to staging immediately after integration tests pass
- Collect feedback from 3-5 beta users before starting next algorithm
- Stop if any algorithm exceeds 3x estimated time (indicates architectural issue)

---

## Phase 1: Two Pointer Pattern (Array Deduplication)

**Time Estimate:** 2-3 hours (70 min implementation + 60-90 min QA/FAA)

### Goal

Prove that pattern-based algorithms (not just classical algorithms) work well in the platform and that ArrayView can visualize pointer-based techniques effectively.

### Success Criteria

- ✅ Two-pointer visualization clearly shows left/right pointer movement
- ✅ Prediction points focus on "which pointer moves next" decisions
- ✅ Narrative passes FAA audit with ≤1 iteration of fixes
- ✅ Integration tests pass on first attempt (validates QA process)
- ✅ Beta users can explain pattern after single walkthrough

### Tasks

**1.1: Backend Tracer Implementation** (45 min)

- Create `backend/algorithms/two_pointer.py`
- Implement `TwoPointerTracer(AlgorithmTracer)`
- **Algorithm**: Remove duplicates from sorted array in-place
- **Key Decision**: Implement visualization state enrichment in `_get_visualization_state()`
  - Show array with color-coding: `unique` (kept), `duplicate` (skipped), `unprocessed`
  - Track `slow` and `fast` pointers prominently
  - Example state structure:

```python
data['visualization'] = {
    'array': [
        {'index': 0, 'value': 1, 'state': 'unique'},
        {'index': 1, 'value': 1, 'state': 'duplicate'},
        {'index': 2, 'value': 2, 'state': 'unprocessed'}
    ],
    'pointers': {
        'slow': 0,    # Write position
        'fast': 2,    # Read position
        'unique_count': 1
    }
}
```

**1.2: Prediction Points** (15 min)

- Target 5-7 prediction moments per execution
- Question pattern: "The fast pointer found [value]. What should happen next?"
- Choices (≤3):
  - `"keep"` - "Different from last unique, increment slow and copy"
  - `"skip"` - "Duplicate, move fast pointer only"
  - `"done"` - "Array fully processed"
- Correct answer based on comparison: `arr[fast] != arr[slow]`

**1.3: Narrative Generation** (10 min)

- Template structure:

```markdown
# Two Pointer Pattern: Array Deduplication

**Input:** Sorted array [1, 1, 2, 2, 3]
**Goal:** Remove duplicates in-place, return unique count

## Step N: Compare Values

**Array State:** [current array with color coding]
**Pointers:** slow=0 (last unique), fast=1 (examining)
**Comparison:** arr[fast] (1) vs arr[slow] (1)
**Decision:** Values equal → Skip (duplicate)
**Action:** Move fast pointer only: fast=2

## Final Result

**Unique Elements:** 3
**Modified Array:** [1, 2, 3, _, _]
**Pattern Demonstrated:** Two pointers moving at different speeds
```

**1.4: Registry Registration** (5 min)

```python
registry.register(
    name='two-pointer',
    tracer_class=TwoPointerTracer,
    display_name='Two Pointer Pattern',
    description='Remove duplicates using slow/fast pointer technique',
    example_inputs=[
        {'name': 'Basic Duplicates', 'input': {'array': [1,1,2,2,3]}},
        {'name': 'All Unique', 'input': {'array': [1,2,3,4,5]}},
        {'name': 'All Duplicates', 'input': {'array': [1,1,1,1,1]}}
    ]
)
```

### Deliverables

- [ ] `backend/algorithms/two_pointer.py` complete
- [ ] Unit tests pass for all 3 example inputs
- [ ] Narratives generated for all examples
- [ ] Backend Checklist completed
- [ ] FAA audit passed (arithmetic verified)

### Rollback Plan

**If** narrative clarity score <7/10 from beta users: Increase pointer prominence in visualization (larger icons, clearer labels) and regenerate narratives

**If** FAA audit reveals >3 arithmetic errors: Re-examine trace generation logic for state propagation bugs before continuing

---

## Phase 2: Sliding Window Pattern (Maximum Sum Subarray)

**Time Estimate:** 2.5-3.5 hours (75 min implementation + 70-90 min QA/FAA)  
**CONDITIONAL:** Only proceed if Phase 1 beta feedback shows ≥7/10 clarity score

### Goal

Validate that window-based visualization (another pointer pattern variant) provides clear educational value and that pattern diversity increases engagement.

### Success Criteria

- ✅ Window boundaries clearly visible in ArrayView
- ✅ Running sum tracked and displayed at each step
- ✅ Prediction points teach "expand vs. slide" decision logic
- ✅ Narrative explains window mechanics without requiring code
- ✅ Zero regression bugs in existing algorithms

### Tasks

**2.1: Backend Tracer Implementation** (50 min)

- Create `backend/algorithms/sliding_window.py`
- Implement `SlidingWindowTracer(AlgorithmTracer)`
- **Algorithm**: Find maximum sum of k consecutive elements
- **Visualization approach**: Highlight window elements with distinct state

```python
data['visualization'] = {
    'array': [
        {'index': 0, 'value': 2, 'state': 'in_window'},
        {'index': 1, 'value': 1, 'state': 'in_window'},
        {'index': 2, 'value': 5, 'state': 'in_window'},  # k=3
        {'index': 3, 'value': 1, 'state': 'next'},
        {'index': 4, 'value': 3, 'state': 'unprocessed'}
    ],
    'pointers': {
        'window_start': 0,
        'window_end': 2,
        'k': 3
    },
    'metrics': {
        'current_sum': 8,
        'max_sum': 8,
        'max_window_start': 0
    }
}
```

**2.2: Prediction Points** (15 min)

- Target 6-8 prediction moments
- Question pattern: "Window slides right. What changes?"
- Choices (≤3):
  - `"subtract_add"` - "Subtract left element, add right element"
  - `"recalculate"` - "Recalculate entire window sum"
  - `"update_max"` - "Current sum is new maximum"
- Teaching focus: Efficiency of subtract-and-add vs. recalculation

**2.3: Narrative Generation** (10 min)

- Emphasize the "sliding" motion in prose
- Show arithmetic clearly (critical for FAA):

```markdown
## Step 5: Slide Window Right

**Current Window:** [2, 1, 5] (indices 0-2)
**Current Sum:** 2 + 1 + 5 = 8

**Slide Operation:**

- Remove left element: 8 - 2 = 6
- Add new right element: 6 + 1 = 7
- **New Window:** [1, 5, 1] (indices 1-3)
- **New Sum:** 7

**Max Tracking:** Previous max (8) > current sum (7) → Keep max = 8
```

### Deliverables

- [ ] `backend/algorithms/sliding_window.py` complete
- [ ] Unit tests pass for all examples
- [ ] Narratives FAA-approved (focus on arithmetic: subtract/add operations)
- [ ] Frontend integration with ArrayView (window highlighting works)
- [ ] Frontend Checklist completed

### Rollback Plan

**If** students confuse sliding window with two pointer pattern: Add explicit "Pattern Comparison" section to narrative explaining differences

**If** ArrayView highlighting is insufficient: Create custom `WindowView` component (adds 1 hour to timeline)

---

## Phase 3: Merge Sort (Divide & Conquer Paradigm)

**Time Estimate:** 3-4 hours (90 min implementation + 90-120 min QA/FAA)  
**CONDITIONAL:** Only proceed if Phases 1-2 complete with ≤5 total bugs discovered in integration testing

### Goal

Validate that recursive algorithms with complex state transitions can generate clear narratives and that divide-and-conquer paradigm is effectively teachable through the platform.

### Success Criteria

- ✅ Recursive call depth visualized clearly (use array coloring for subarrays)
- ✅ Merge operation shows comparison logic explicitly
- ✅ Narrative handles recursion without becoming overwhelming (≤50 steps total)
- ✅ Prediction points focus on merge decisions, not recursion structure
- ✅ Performance metrics (comparisons, recursive calls) tracked accurately

### Tasks

**3.1: Backend Tracer with Recursion Tracking** (60 min)

- Create `backend/algorithms/merge_sort.py`
- Implement `MergeSortTracer(AlgorithmTracer)`
- **Challenge**: Flatten recursive execution into linear trace
- **Approach**: Track recursion depth, visualize active subarray

```python
data['visualization'] = {
    'array': [
        {'index': 0, 'value': 5, 'state': 'left_subarray', 'depth': 2},
        {'index': 1, 'value': 2, 'state': 'left_subarray', 'depth': 2},
        {'index': 2, 'value': 8, 'state': 'right_subarray', 'depth': 2},
        {'index': 3, 'value': 1, 'state': 'right_subarray', 'depth': 2},
        {'index': 4, 'value': 9, 'state': 'inactive', 'depth': 1}
    ],
    'pointers': {
        'merge_left': 0,
        'merge_right': 2,
        'merge_target': 0
    },
    'metrics': {
        'recursion_depth': 2,
        'comparisons': 5,
        'current_operation': 'merge'  # or 'divide'
    }
}
```

**3.2: Step Type Categorization** (15 min)

- Define clear step types for merge sort:
  - `"INITIAL_STATE"` - Show unsorted array
  - `"DIVIDE"` - Split array into subarrays
  - `"BASE_CASE"` - Single element (already sorted)
  - `"MERGE_COMPARE"` - Compare elements from two subarrays
  - `"MERGE_COPY"` - Copy element to merged array
  - `"MERGE_COMPLETE"` - Subarray merge finished
  - `"ALGORITHM_COMPLETE"` - Final sorted array

**3.3: Prediction Points for Merge Decisions** (15 min)

- Target 8-10 predictions (focus on merge phase, not recursion)
- Question pattern: "Merging [3] and [1]. Which goes first?"
- Choices (≤3):
  - `"left"` - "Take 3 from left subarray"
  - `"right"` - "Take 1 from right subarray"
  - `"equal"` - "Both equal, stable sort applies"
- Teaching focus: Comparison-based merging, not the recursion tree

**3.4: Narrative Generation (Critical - Recursion Complexity)** (20 min)

- **Key Challenge**: Don't overwhelm with recursion details
- **Solution**: Group recursive calls by depth

```markdown
# Merge Sort Execution

**Input:** [5, 2, 8, 1, 9]
**Goal:** Sort in ascending order using divide-and-conquer

## Divide Phase (Depth 1-3)

**Split 1:** [5, 2, 8, 1, 9] → [5, 2] and [8, 1, 9]
**Split 2:** [5, 2] → [5] and [2]
**Split 3:** [8, 1, 9] → [8, 1] and [9]
**Split 4:** [8, 1] → [8] and [1]

## Merge Phase (Bottom-Up)

### Step 12: Merge [5] and [2]

**Left Subarray:** [5]
**Right Subarray:** [2]
**Comparison:** 5 vs 2 → 2 < 5
**Decision:** Take 2 first
**Merged:** [2, 5]

[Continue for all merges...]

## Final Result

**Sorted Array:** [1, 2, 5, 8, 9]
**Total Comparisons:** 8
**Recursion Depth:** 3
```

**3.5: Registry Registration** (5 min)

```python
registry.register(
    name='merge-sort',
    tracer_class=MergeSortTracer,
    display_name='Merge Sort',
    description='Divide-and-conquer sorting with O(n log n) complexity',
    example_inputs=[
        {'name': 'Small Array', 'input': {'array': [5, 2, 8, 1, 9]}},
        {'name': 'Already Sorted', 'input': {'array': [1, 2, 3, 4, 5]}},
        {'name': 'Reverse Sorted', 'input': {'array': [5, 4, 3, 2, 1]}}
    ]
)
```

### Deliverables

- [ ] `backend/algorithms/merge_sort.py` complete
- [ ] Recursion flattening logic validated (trace is linear, not tree)
- [ ] Narratives FAA-approved (emphasis on merge arithmetic)
- [ ] Integration tests pass (focus on step count ≤50 for small arrays)
- [ ] QA Integration Checklist completed

### Rollback Plan

**If** narrative becomes too long (>50 steps): Collapse divide phase into single summary step, focus narrative on merge phase only

**If** recursion depth visualization confuses students: Simplify to show only "active subarray" state, remove depth annotations

**If** FAA audit takes >30 min: Indicates merge arithmetic is too complex; consider showing fewer intermediate merge steps

---

## Decision Tree & Stop Conditions

```
START
  ↓
PHASE 1: Two Pointer Pattern
  ├─ Beta feedback ≥7/10 clarity → PHASE 2
  ├─ Feedback 5-6/10 → INVESTIGATE
  │   ├─ Fixed with visualization tweaks → PHASE 2
  │   └─ Fundamental pattern clarity issue → REASSESS (consider different example)
  └─ Implementation >3x estimate → STOP (architectural problem)

PHASE 2: Sliding Window Pattern
  ├─ Zero regression bugs → PHASE 3
  ├─ 1-2 regression bugs → FIX & PHASE 3
  ├─ >3 regression bugs → STOP (platform stability issue)
  └─ ArrayView insufficient → ADD WindowView (+1 hour) → PHASE 3

PHASE 3: Merge Sort
  ├─ FAA audit passes in ≤2 iterations → SUCCESS
  ├─ Narrative length ≤50 steps → SUCCESS
  ├─ Narrative >50 steps → SIMPLIFY (collapse divide phase)
  └─ FAA audit >3 iterations → STOP (complexity too high)

END
```

### Explicit Stop Conditions

**STOP if:**

1. Any phase exceeds 3x estimated time (indicates architectural mismatch)
2. Combined bug count across all 3 algorithms >10 (quality issue)
3. FAA audit reveals systematic arithmetic pattern (trace generation bug)
4. Beta user feedback <5/10 clarity for any algorithm (pedagogical failure)
5. Any algorithm causes regression in existing 2 algorithms (platform instability)

**REASSESS SCOPE if:**

- Phase 2 requires custom WindowView (extends timeline by 1 hour)
- Phase 3 narratives consistently exceed 50 steps (consider simpler examples)
- Student confusion between Two Pointer and Sliding Window (need better differentiation)

---

## Risk Mitigation Summary

| Risk                               | Likelihood | Impact | Mitigation                                                                    |
| ---------------------------------- | ---------- | ------ | ----------------------------------------------------------------------------- |
| Pattern visualization unclear      | Medium     | High   | Beta test after Phase 1; iterate on pointer prominence before Phase 2         |
| FAA audit time underestimated      | Medium     | Medium | Front-load arithmetic verification during implementation; use simple examples |
| Merge Sort narrative too complex   | High       | Medium | Collapse divide phase into summary; focus on merge arithmetic only            |
| ArrayView insufficient for windows | Low        | Medium | Prepare WindowView component plan (1 hour); decide after Phase 1 feedback     |
| Regression bugs in Binary Search   | Low        | High   | Run full integration suite after each phase; automated regression detection   |
| Student confusion between patterns | Medium     | Low    | Add "Pattern Comparison" section to narratives; explicit differentiation      |

---

## Success Metrics

### Minimum Viable Success (3-Day Timeline)

- ✅ All 3 algorithms pass integration tests (14-suite validation)
- ✅ FAA audits pass with ≤2 iterations per algorithm
- ✅ Beta user clarity scores ≥6/10 for each algorithm
- ✅ Zero regression bugs in existing algorithms (Binary Search, Interval Coverage)
- ✅ Prediction mode engagement >70% (students answer ≥70% of prediction questions)

### Stretch Goals (If Ahead of Schedule)

- ⭐ Add "Pattern Comparison" educational content (side-by-side Two Pointer vs. Sliding Window)
- ⭐ Implement WindowView component (better window visualization than ArrayView highlighting)
- ⭐ Add 4th algorithm (Quick Sort) to complete sorting paradigms
- ⭐ Performance dashboard (show O(n) vs O(n log n) visually)

---

## Scope Boundaries

### In Scope

- ✅ Two Pointer Pattern (array deduplication)
- ✅ Sliding Window Pattern (maximum sum subarray)
- ✅ Merge Sort (divide-and-conquer paradigm)
- ✅ Reusing ArrayView for all visualizations
- ✅ FAA arithmetic audit for all narratives
- ✅ Prediction mode for all 3 algorithms
- ✅ Beta testing with 3-5 users per algorithm

### Out of Scope

- ❌ Graph algorithms (BFS, DFS) - Requires new GraphView component (~2 hours)
- ❌ Quick Sort - Too similar to Merge Sort; low marginal educational value
- ❌ Bubble/Insertion Sort - Too simple; not interview-relevant
- ❌ Custom animation system - ArrayView highlighting sufficient
- ❌ Algorithm performance comparison tool - Future enhancement
- ❌ Mobile-responsive testing - Desktop-first approach validated in Phase 1-2

---

## Next Steps

### Immediate Actions (Before Phase 1)

1. **Review ArrayView component** - Confirm pointer rendering capabilities (15 min)
2. **Set up beta user cohort** - Recruit 3-5 users willing to test after each phase (30 min)
3. **Prepare FAA audit environment** - Review `FAA_PERSONA.md` and create arithmetic verification checklist (15 min)
4. **Create branch structure** - `feature/two-pointer`, `feature/sliding-window`, `feature/merge-sort` (5 min)

### First Validation Checkpoint (After Phase 1)

1. Deploy Two Pointer to staging
2. Collect beta feedback (target: 3 users, 20 min each)
3. Analyze clarity scores and prediction engagement
4. **GO/NO-GO Decision**: Proceed to Phase 2 only if clarity ≥6/10

### What to Prepare Before Starting

- ✅ Confirm `AlgorithmTracer` base class documentation is current
- ✅ Verify ArrayView props interface (especially pointer rendering)
- ✅ Review existing Binary Search narrative for pattern inspiration
- ✅ Set up automated regression test suite trigger (run after each phase)
- ✅ Create narrative templates for each algorithm type (saves 10 min per algo)

---

## Implementation Notes

### Technologies Requiring Research

None - all technologies validated in existing algorithms:

- ✅ Python Flask (proven)
- ✅ AlgorithmTracer base class (2 algorithms validated)
- ✅ React + Tailwind (proven)
- ✅ ArrayView component (proven with Binary Search)
- ✅ Registry pattern (proven)
- ✅ FAA audit process (v2.1 workflow operational)

### Potential Blockers

1. **ArrayView pointer rendering limitations** - May not support ≥3 simultaneous pointers well
   - **Mitigation**: Test with mock data before Phase 1; adjust pointer styling if needed
2. **Merge Sort trace length** - Could exceed 50 steps for even small arrays
   - **Mitigation**: Use arrays ≤5 elements for examples; collapse divide phase in narrative
3. **FAA audit bottleneck** - If audit consistently takes >20 min, timeline slips
   - **Mitigation**: Front-load arithmetic verification during implementation; don't rely on FAA to catch errors
4. **Beta user availability** - If <3 users available, feedback validity suffers
   - **Mitigation**: Recruit backup users; consider internal team testing if external users unavailable

### Recommended Starting Point

**Start with Phase 1 (Two Pointer) immediately:**

1. Open `backend/algorithms/binary_search.py` as reference template
2. Copy structure to `backend/algorithms/two_pointer.py`
3. Focus first on `execute()` method with simple array `[1,1,2,2,3]`
4. Validate trace structure before implementing prediction points
5. Generate narrative early (don't wait until end)
6. Run FAA audit on narrative ASAP (catch errors early)

**Success indicator for Phase 1:** If implementation takes <70 min, Phases 2-3 will be faster (learning curve effect).

---

## Questions Before Starting

1. **ArrayView pointer capacity:** Can ArrayView render 2 pointers (slow/fast) with distinct colors clearly, or should we test this first?

2. **Beta user availability:** Do we have 3-5 users committed for testing after each phase, or should we plan for internal team feedback?

3. **Timeline flexibility:** Is 3-day sprint firm, or is there flexibility to extend to 4 days if Merge Sort complexity requires it?

4. **Scope priority:** If timeline pressure emerges, which is preferred: (a) Ship 2 high-quality algorithms, or (b) Ship 3 algorithms with reduced prediction points?

5. **Success criteria threshold:** Is 6/10 clarity score acceptable, or should we target 7/10 minimum for production deployment?
