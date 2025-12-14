# Algorithm Expansion Project Tracker

**Project:** Add 3 Algorithms (Two Pointer, Sliding Window, Merge Sort)  
**Timeline:** 3-4 Days | **Total Estimate:** ~10 hours  
**Status:** 🟡 In Progress

---

## 📊 Project Overview

### Overall Progress

- [ ] **Pre-Phase Setup** (0/4 tasks) - 65 min
- [ ] **Phase 1: Two Pointer** (0/8 tasks) - 2-3 hours
- [ ] **Phase 2: Sliding Window** (0/8 tasks) - 2.5-3.5 hours
- [ ] **Phase 3: Merge Sort** (0/9 tasks) - 3-4 hours

**Total Completed:** 0/29 tasks (0%)

---

## 🎯 Pre-Phase Setup (Day 0)

**Estimated Time:** 65 minutes total

- [ ] **Review ArrayView component** (15 min)
  - Confirm pointer rendering capabilities
  - Test with mock data showing 2-3 pointers
  - Document any limitations found
- [ ] **Set up beta user cohort** (30 min)
  - Recruit 3-5 users for testing
  - Schedule availability after each phase
  - Create feedback form template
- [ ] **Prepare FAA audit environment** (15 min)
  - Review `docs/compliance/FAA_PERSONA.md`
  - Create arithmetic verification checklist
  - Set up narrative review workspace
- [ ] **Create branch structure** (5 min)
  - `git checkout -b feature/two-pointer`
  - Create `feature/sliding-window` branch
  - Create `feature/merge-sort` branch

**✅ Pre-Phase Complete When:** All 4 tasks checked

---

## 🔵 Phase 1: Two Pointer Pattern (Day 1)

**Algorithm:** Array Deduplication  
**Estimated Time:** 2-3 hours  
**Start Date:** ****\_\_\_****

### Backend Implementation (70 min)

- [ ] **1.1: Create tracer file** (10 min)
  - Create `backend/algorithms/two_pointer.py`
  - Inherit from `AlgorithmTracer`
  - Set up basic structure
- [ ] **1.2: Implement execute() method** (30 min)
  - Algorithm logic: remove duplicates in sorted array
  - Add trace steps with `_add_step()`
  - Implement visualization state:
    - Array with states: `unique`, `duplicate`, `unprocessed`
    - Pointers: `slow`, `fast`, `unique_count`
- [ ] **1.3: Implement prediction points** (15 min)
  - Target 5-7 prediction moments
  - Question: "Fast pointer found [value]. What happens next?"
  - Choices (≤3): `keep`, `skip`, `done`
- [ ] **1.4: Implement generate_narrative()** (10 min)
  - Show array state at each step
  - Display pointer positions clearly
  - Explain comparison logic with actual values
- [ ] **1.5: Register in registry** (5 min)
  - Add to `backend/algorithms/registry.py`
  - Register 3 example inputs (basic, all unique, all duplicates)

### Quality Gates (60-90 min)

- [ ] **1.6: Generate narratives** (10 min)
  - Run algorithm on all 3 example inputs
  - Save to `docs/narratives/two_pointer/`
- [ ] **1.7: FAA Audit** (10-15 min)
  - Use `FAA_PERSONA.md` to verify arithmetic
  - Check pointer position calculations
  - Fix any errors and regenerate
  - **BLOCKING:** Must pass before continuing
- [ ] **1.8: Complete checklists** (15 min)
  - Backend Compliance Checklist
  - Run unit tests
  - Deploy to staging

### Validation Checkpoint

- [ ] **1.9: Beta user testing** (30-60 min)
  - Deploy to staging
  - 3 users test for 20 min each
  - Collect clarity scores (target: ≥6/10)
  - **GO/NO-GO:** Proceed to Phase 2 only if ≥6/10

**📝 Notes:**

- Actual time spent: **\_** hours
- Clarity score: **\_**/10
- Issues found: ********\_********
- Decision: ⬜ GO to Phase 2 | ⬜ ITERATE | ⬜ STOP

---

## 🟢 Phase 2: Sliding Window Pattern (Day 2)

**Algorithm:** Maximum Sum Subarray  
**Estimated Time:** 2.5-3.5 hours  
**Start Date:** ****\_\_\_****  
**CONDITIONAL:** Only if Phase 1 clarity ≥6/10

### Backend Implementation (75 min)

- [ ] **2.1: Create tracer file** (10 min)
  - Create `backend/algorithms/sliding_window.py`
  - Inherit from `AlgorithmTracer`
- [ ] **2.2: Implement execute() method** (35 min)
  - Algorithm: find max sum of k consecutive elements
  - Visualization state:
    - Array with states: `in_window`, `next`, `unprocessed`
    - Pointers: `window_start`, `window_end`, `k`
    - Metrics: `current_sum`, `max_sum`
- [ ] **2.3: Implement prediction points** (15 min)
  - Target 6-8 prediction moments
  - Question: "Window slides right. What changes?"
  - Choices: `subtract_add`, `recalculate`, `update_max`
- [ ] **2.4: Implement generate_narrative()** (10 min)
  - Emphasize "sliding" motion
  - Show arithmetic clearly: "8 - 2 + 1 = 7"
  - Explain efficiency vs. recalculation
- [ ] **2.5: Register in registry** (5 min)
  - Add to registry with 3 example inputs

### Quality Gates (70-90 min)

- [ ] **2.6: Generate narratives** (10 min)
  - Run on all examples
  - Save to `docs/narratives/sliding_window/`
- [ ] **2.7: FAA Audit** (15-20 min)
  - **CRITICAL:** Verify all subtract/add arithmetic
  - Common errors: "8 - 2 + 1" calculations
  - Must pass before continuing
- [ ] **2.8: Complete checklists & integration** (45-60 min)
  - Backend Checklist
  - Frontend integration (ArrayView with window highlighting)
  - Frontend Checklist
  - Run full integration test suite
  - **Check:** Zero regression bugs in Binary Search/Interval Coverage

**📝 Notes:**

- Actual time spent: **\_** hours
- Regression bugs found: **\_**
- ArrayView sufficient: ⬜ YES | ⬜ NO (need WindowView)
- Decision: ⬜ CONTINUE to Phase 3 | ⬜ STOP

---

## 🟣 Phase 3: Merge Sort (Day 3)

**Algorithm:** Divide & Conquer Sorting  
**Estimated Time:** 3-4 hours  
**Start Date:** ****\_\_\_****  
**CONDITIONAL:** Only if Phases 1-2 complete with ≤5 total bugs

### Backend Implementation (90 min)

- [ ] **3.1: Create tracer file** (10 min)
  - Create `backend/algorithms/merge_sort.py`
  - Inherit from `AlgorithmTracer`
- [ ] **3.2: Implement execute() with recursion tracking** (45 min)
  - Flatten recursive execution into linear trace
  - Visualization state:
    - Array with states: `left_subarray`, `right_subarray`, `inactive`
    - Track `recursion_depth`
    - Pointers: `merge_left`, `merge_right`, `merge_target`
    - Metrics: `comparisons`, `current_operation` (divide/merge)
- [ ] **3.3: Define step types** (10 min)
  - `INITIAL_STATE`, `DIVIDE`, `BASE_CASE`
  - `MERGE_COMPARE`, `MERGE_COPY`, `MERGE_COMPLETE`
  - `ALGORITHM_COMPLETE`
- [ ] **3.4: Implement prediction points** (15 min)
  - Target 8-10 predictions (focus on merge, not recursion)
  - Question: "Merging [3] and [1]. Which goes first?"
  - Choices: `left`, `right`, `equal`
- [ ] **3.5: Implement generate_narrative()** (20 min)
  - **KEY:** Don't overwhelm with recursion details
  - Group recursive calls by depth
  - Focus narrative on merge arithmetic
  - Target: ≤50 steps total

### Quality Gates (90-120 min)

- [ ] **3.6: Generate narratives** (15 min)
  - Run on all examples (use arrays ≤5 elements)
  - **CHECK:** Narrative length ≤50 steps
  - If >50 steps: collapse divide phase into summary
- [ ] **3.7: FAA Audit** (20-30 min)
  - **CRITICAL:** Verify merge arithmetic
  - Check comparison logic step-by-step
  - Verify final sorted array
  - If >3 iterations needed: STOP (complexity too high)
- [ ] **3.8: Complete checklists & integration** (45-60 min)
  - Backend Checklist
  - Frontend integration
  - Frontend Checklist
  - Full integration test suite
  - Regression testing
- [ ] **3.9: Final QA Integration** (15 min)
  - Complete `QA_INTEGRATION_CHECKLIST.md`
  - All 14 test suites must pass
  - Visual comparison to mockups

**📝 Notes:**

- Actual time spent: **\_** hours
- Narrative length: **\_** steps (target: ≤50)
- FAA iterations: **\_** (stop if >3)
- Total bugs (all 3 phases): **\_** (stop if >10)

---

## ⚠️ Stop Conditions Monitor

**STOP IMMEDIATELY if any occur:**

- [ ] ❌ Any phase exceeds 3x estimated time
- [ ] ❌ Combined bug count >10 across all phases
- [ ] ❌ FAA audit reveals systematic arithmetic errors
- [ ] ❌ Beta user clarity <5/10
- [ ] ❌ Regression in Binary Search or Interval Coverage

**REASSESS SCOPE if:**

- [ ] ⚠️ Phase 2 requires custom WindowView (+1 hour)
- [ ] ⚠️ Phase 3 narratives >50 steps consistently
- [ ] ⚠️ Student confusion between Two Pointer & Sliding Window

---

## 📈 Success Metrics Tracking

### Minimum Viable Success

- [ ] All 3 algorithms pass 14-suite integration tests
- [ ] FAA audits pass with ≤2 iterations per algorithm
- [ ] Beta user clarity ≥6/10 for each algorithm
- [ ] Zero regression bugs
- [ ] Prediction engagement >70%

### Stretch Goals (If Ahead)

- [ ] ⭐ Add "Pattern Comparison" educational content
- [ ] ⭐ Implement WindowView component
- [ ] ⭐ Add Quick Sort (4th algorithm)
- [ ] ⭐ Performance dashboard

---

## 📋 Daily Standup Template

### Today's Focus:

**Date:** ****\_\_\_****  
**Current Phase:** ****\_\_\_****  
**Tasks Planned:** ****\_\_\_****

### Yesterday's Progress:

- Completed: ****\_\_\_****
- Blockers: ****\_\_\_****
- Time spent: **\_** hours

### Blockers/Issues:

- [ ] None
- [ ] Issue: ****\_\_\_****

### Risk Assessment:

- Timeline status: ⬜ On Track | ⬜ At Risk | ⬜ Behind
- Quality status: ⬜ Good | ⬜ Concerns | ⬜ Issues

---

## 🎉 Project Completion Checklist

### Final Validation

- [ ] All 29 tasks completed
- [ ] All 3 algorithms live in production
- [ ] Documentation updated
- [ ] Team handoff complete

### Deliverables

- [ ] `backend/algorithms/two_pointer.py`
- [ ] `backend/algorithms/sliding_window.py`
- [ ] `backend/algorithms/merge_sort.py`
- [ ] All narratives FAA-approved
- [ ] All compliance checklists complete
- [ ] Integration tests passing

### Metrics Achieved

- Total implementation time: **\_** hours (target: ~10 hours)
- Bug count: **\_** (target: <10)
- Clarity scores: TP:**_ SW:_** MS:\_\_\_ (target: ≥6/10 each)
- Prediction engagement: \_\_\_\_% (target: >70%)

---

## 📝 Notes & Lessons Learned

**Phase 1 (Two Pointer):**

-

**Phase 2 (Sliding Window):**

-

**Phase 3 (Merge Sort):**

-

**Overall Project:**

-

---

**Last Updated:** ****\_\_\_****  
**Project Status:** 🟡 In Progress | 🟢 On Track | 🔴 At Risk | ✅ Complete
