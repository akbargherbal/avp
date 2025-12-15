## Feature: Add Sliding Window Algorithm

**Classification:** New Algorithm (Full Workflow - Stages 1-4)
**Prerequisite:** Phase 1 (Two Pointer) completed with beta clarity score ≥7/10.

**Execution Plan:**

# Phase 2: Sliding Window Pattern - Implementation Workflow

**Total Time Estimate:** 4.5 hours (270 minutes)

---

## Role Definitions

- **BE** = Backend Engineer (implements algorithm tracers, generates narratives)
- **FAA** = Forensic Arithmetic Auditor (validates mathematical correctness)
- **QA** = Quality Assurance Engineer (reviews narratives for logic/pedagogy)
- **FE** = Frontend Engineer (integrates visualizations, tests UI)
- **PM** = Project Manager (coordinates, makes go/no-go decisions)

---

## 0. Preparation (15 min)

**0.1** [FE] Review `ArrayView` component; confirm it can render a highlighted *range* of elements based on the `in_window` state.
**0.2** [BE] Review `backend/algorithms/two_pointer.py` as a reference for pointer-based patterns.
**0.3** [BE/FAA] Re-familiarize with `docs/compliance/FAA_PERSONA.md`, focusing on verifying running calculations (add/subtract).
**0.4** [PM] Confirm availability of beta user cohort for feedback.
**0.5** [BE] Create feature branch from `main`: `feature/sliding-window`.

---

## 1. Stage 1: Backend Implementation (75 min)

### 1.1 Task 1.1: Tracer Implementation (50 min)

**1.1.1** [BE] Create `backend/algorithms/sliding_window.py`.
**1.1.2** [BE] Define `SlidingWindowTracer` class inheriting from `AlgorithmTracer`.
**1.1.3** [BE] Implement `execute()` method:
   - **1.1.3.1** [BE] Validate input (array and window size `k`).
   - **1.1.3.2** [BE] Set required metadata: `algorithm`, `display_name`, `visualization_type: 'array'`.
   - **1.1.3.3** [BE] Add initial state step showing the first window and its sum.
   - **1.1.3.4** [BE] Implement sliding window algorithm logic:
      - Loop from `k` to the end of the array.
      - In each step, calculate the new sum by subtracting the outgoing element and adding the incoming element.
      - Update the maximum sum if the current window's sum is greater.
   - **1.1.3.5** [BE] Record each slide and comparison step with `_add_step()`.
   - **1.1.3.6** [BE] Add final state step showing the maximum sum found.
   - **1.1.3.7** [BE] Return result using `_build_trace_result()`.

**1.1.4** [BE] Implement `_get_visualization_state()` method:
   - **1.1.4.1** [BE] Build array visualization with states: `in_window`, `next`, `unprocessed`.
   - **1.1.4.2** [BE] Add pointers dict: `window_start`, `window_end`.
   - **1.1.4.3** [BE] Add metrics dict: `current_sum`, `max_sum`.
   - **1.1.4.4** [BE] Return complete visualization structure as defined in `PAHSED_PLAN.md`.

### 1.2 Task 1.2: Prediction Points (15 min)

**1.2.1** [BE] Implement `get_prediction_points()` method.
**1.2.2** [BE] Identify decision moments before each window slide.
**1.2.3** [BE] For each prediction point, create a dict with:
   - **1.2.3.1** [BE] `step_index` - When to pause.
   - **1.2.3.2** [BE] `question` - "The window is about to slide. Will the current sum increase or decrease?"
   - **1.2.3.3** [BE] `choices` - `increase`, `decrease`, `stay_same`.
   - **1.2.3.4** [BE] `correct_answer` - Based on comparing the incoming and outgoing elements.
   - **1.2.3.5** [BE] `hint` - "Compare the element entering the window with the one leaving."

### 1.3 Task 1.3: Narrative Generation (10 min)

**1.3.1** [BE] Implement `generate_narrative(trace_result)` method.
**1.3.2** [BE] For each step, show the array with the current window highlighted.
**1.3.3** [BE] **Crucially for FAA:** Show the arithmetic for the slide operation explicitly:
   - `**Slide Operation:**`
   - `Previous Sum: [old_sum]`
   - `Remove left element ([value]): [old_sum] - [value] = [intermediate_sum]`
   - `Add new right element ([value]): [intermediate_sum] + [value] = [new_sum]`
   - `**New Sum:** [new_sum]`
**1.3.4** [BE] Show the comparison to update the maximum sum: `**Max Tracking:** New sum ([new_sum]) vs. Max sum ([max_sum])`.

### 1.4 Task 1.4: Registry Registration (5 min)

**1.4.1** [BE] Open `backend/algorithms/registry.py`.
**1.4.2** [BE] Import `SlidingWindowTracer`.
**1.4.3** [BE] Add `registry.register()` call with:
   - `name='sliding-window'`
   - `tracer_class=SlidingWindowTracer`
   - `display_name='Sliding Window Pattern'`
   - `description='Find maximum sum subarray of a fixed size k'`
   - Three example inputs:
      - Basic: `{'array': [2, 1, 5, 1, 3, 2], 'k': 3}`
      - Increasing Trend: `{'array': [1, 2, 3, 4, 5, 6], 'k': 3}`
      - Decreasing Trend: `{'array': [6, 5, 4, 3, 2, 1], 'k': 4}`

### 1.5 Generate Narratives & Run Tests

**1.5.1** [BE] Run `python backend/scripts/generate_narratives.py sliding-window`.
**1.5.2** [BE] Verify 3 markdown files are created in `docs/narratives/sliding-window/`.
**1.5.3** [BE] Run unit tests for `sliding_window.py` and fix any failures.

---

## 2. Stage 1.5: FAA Audit - BLOCKING GATE (20 min target, ≤1 iteration)

### 2.1 Initial FAA Audit (15 min)

**2.1.1** [FAA] Open `docs/compliance/FAA_PERSONA.md`.
**2.1.2** [FAA] For each narrative, meticulously verify the sliding window arithmetic:
   - **2.1.2.1** [FAA] Manually recalculate `new_sum = old_sum - outgoing_element + incoming_element` for every single step.
   - **2.1.2.2** [FAA] Verify the `max_sum` is correctly updated at each step.
   - **2.1.2.3** [FAA] Check for stale state propagation (e.g., using the wrong `old_sum`).

### 2.2 FAA Decision Gate

**2.2.1** [FAA] **IF arithmetic errors found:**
   - **2.2.1.1** [FAA→BE] Return to Stage 1 with a precise report of the failed calculation step.
   - **2.2.1.2** [BE] Fix logic, regenerate narratives, and resubmit.
   - **2.2.1.3** [FAA] Re-run audit (5 min).

**2.2.2** [FAA] **IF no arithmetic errors (FAA APPROVED):**
   - **2.2.2.1** [FAA→BE] Handoff FAA-Approved narratives to BE.

---

## 3. Stage 1 Completion: Backend Checklist (10 min)

**3.1.1** [BE] Open `docs/compliance/BACKEND_CHECKLIST.md`.
**3.1.2** [BE] Verify all requirements, paying special attention to:
   - [ ] `visualization_type` is correctly set to `'array'`.
   - [ ] **Narratives have passed the FAA arithmetic audit.**
**3.1.3** [BE→QA] Handoff FAA-approved narratives to QA.

---

## 4. Stage 2: QA Narrative Review (20 min)

**4.1.1** [QA] Review ONLY the FAA-approved markdown narratives.
**4.1.2** [QA] **ASSUME arithmetic is correct.**
**4.1.3** [QA] Focus on pedagogical clarity:
   - Does the narrative effectively explain the *concept* of a "window" that "slides"?
   - Is the efficiency gain (add/subtract vs. recalculate) made clear?
   - Can a user understand the algorithm's goal and process from the text alone?
**4.1.4** [QA→FE] If approved, handoff to FE for integration.

---

## 5. Stage 3: Frontend Integration (30 min)

**5.1.1** [FE] Confirm `ArrayView` correctly renders the `in_window` state as a contiguous highlighted block.
**5.1.2** [FE] Verify the `current_sum` and `max_sum` metrics are displayed clearly in the right-hand state panel.
**5.1.3** [FE] Complete `docs/compliance/FRONTEND_CHECKLIST.md`.

---

## 6. Stage 4: Integration Testing (35 min)

**6.1.1** [QA] Run all 14 test suites.
**6.1.2** [QA] **Focus regression testing on:**
   - `two-pointer`: Ensure its pointer visualization is not broken.
   - `binary-search`: Ensure its pointer and range-highlighting still work correctly.
**6.1.3** [QA] Test with a large array (20+ elements) to verify overflow pattern and performance.
**6.1.4** [QA→PM] If all tests pass, approve for deployment to staging.

---

## 7. Beta Testing & Validation (60 min)

**7.1.1** [FE/BE] Deploy to staging environment.
**7.2.1** [PM] Send staging link to beta users.
**7.2.2** [Beta Users] Provide feedback on:
   - **Clarity Score (1-10):** Is the "window" concept clear from the visualization?
   - **Visualization:** Is the highlighted window easy to track as it moves?
   - **Pattern Differentiation:** Is it clear how this differs from the Two Pointer pattern?
**7.3.1** [PM] Analyze feedback, focusing on the visualization clarity of the window.

---

## 8. GO/NO-GO Decision Gate

**8.1.1** [PM] **Evaluate against success criteria:**
   - [ ] Beta clarity score for window visualization ≥7/10.
   - [ ] Zero regression bugs found in Phase 1 or existing algorithms.
   - [ ] FAA audit passed with ≤1 iteration.
**8.2.1** [PM] **IF all criteria met:**
   - ✅ **PHASE 2 SUCCESS**
   - [PM] Approve Phase 3: Merge Sort.
**8.2.2** [PM] **IF clarity score 5-6/10:**
   - ⚠️ **INVESTIGATE.** The `ArrayView` highlighting may be insufficient.
   - **Decision:** Either (a) Tweak `ArrayView` styling for better contrast, or (b) Scope the creation of a custom `WindowView` component (adds 1 hour to Phase 3).
**8.2.3** [PM] **IF regression bugs found:**
   - 🛑 **STOP.** Fix all regressions before proceeding to Phase 3.

---

## 9. Stop Conditions (Monitor Throughout)

**9.1.1** [PM/BE] **IF Stage 1 implementation > 225 min (3x estimate):** STOP and investigate.
**9.1.2** [FAA/PM] **IF FAA audit reveals >3 arithmetic errors:** STOP. Indicates a systematic bug in the running sum calculation.
**9.1.3** [QA/PM] **IF regression bugs are found in `two-pointer` or `binary-search`:** STOP. Platform stability is compromised.

---

## 10. Phase 2 Deliverables

### 10.1 Code Files

- [BE] `backend/algorithms/sliding_window.py`
- [BE] `backend/algorithms/registry.py` (updated)
- [BE] `backend/algorithms/tests/test_sliding_window.py`

### 10.2 Documentation

- [BE/FAA/QA] 3x FAA + QA approved narratives in `docs/narratives/sliding-window/`.
- [BE] Completed `backend_checklist_sliding_window.md`.
- [FE] Completed `frontend_checklist_sliding_window.md`.
- [QA] Completed `qa_integration_checklist_sliding_window.md`.

### 10.3 Test Results

- [PM] Beta user feedback summary (clarity score for window visualization).

---

## 11. Phase 3 Readiness Checklist

- [ ] [PM] Phase 2 clarity score ≥7/10.
- [ ] [QA] Zero regression bugs from adding Sliding Window.
- [ ] [FE] `ArrayView` confirmed sufficient for recursive subarray visualization (or `WindowView` decision made).
- [ ] [PM] Implementation time for Phase 2 was within 2x estimate.

**IF all checked:** ✅ [PM] Ready to proceed to Phase 3: Merge Sort.