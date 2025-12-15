# Phase 1: Two Pointer Pattern - Implementation Workflow

**Total Time Estimate:** 4.2 hours (250 minutes)

---

## Role Definitions

- **BE** = Backend Engineer (implements algorithm tracers, generates narratives)
- **FAA** = Forensic Arithmetic Auditor (validates mathematical correctness)
- **QA** = Quality Assurance Engineer (reviews narratives for logic/pedagogy)
- **FE** = Frontend Engineer (integrates visualizations, tests UI)
- **PM** = Project Manager (coordinates, makes go/no-go decisions)

---

## 0. Preparation (15 min)

**0.1** [FE] Review ArrayView component pointer rendering capabilities  
**0.2** [BE] Review `backend/algorithms/binary_search.py` as reference template  
**0.3** [BE/FAA] Review `docs/compliance/FAA_PERSONA.md` for audit criteria  
**0.4** [PM] Set up beta user cohort (recruit 3-5 users)  
**0.5** [BE] Create feature branch: `feature/two-pointer`

---

## 1. Stage 1: Backend Implementation (70 min)

### 1.1 Task 1.1: Tracer Implementation (45 min)

**1.1.1** [BE] Create `backend/algorithms/two_pointer.py`  
**1.1.2** [BE] Define `TwoPointerTracer` class inheriting from `AlgorithmTracer`  
**1.1.3** [BE] Implement `__init__()` method with instance variables  
**1.1.4** [BE] Implement `execute()` method:
   - **1.1.4.1** [BE] Validate input (array must exist)
   - **1.1.4.2** [BE] Set required metadata: `algorithm`, `display_name`, `visualization_type`
   - **1.1.4.3** [BE] Add initial state step with `_add_step()`
   - **1.1.4.4** [BE] Implement two-pointer algorithm logic (slow/fast pointers)
   - **1.1.4.5** [BE] Record each comparison/decision step with `_add_step()`
   - **1.1.4.6** [BE] Add final state step
   - **1.1.4.7** [BE] Return result using `_build_trace_result()`

**1.1.5** [BE] Implement `_get_visualization_state()` method:
   - **1.1.5.1** [BE] Build array visualization with states: `unique`, `duplicate`, `unprocessed`
   - **1.1.5.2** [BE] Add pointers dict: `slow`, `fast`, `unique_count`
   - **1.1.5.3** [BE] Return complete visualization structure

### 1.2 Task 1.2: Prediction Points (15 min)

**1.2.1** [BE] Implement `get_prediction_points()` method  
**1.2.2** [BE] Identify 5-7 decision moments in trace (when `fast` examines new element)  
**1.2.3** [BE] For each prediction point, create dict with:
   - **1.2.3.1** [BE] `step_index` - When to pause
   - **1.2.3.2** [BE] `question` - "The fast pointer found [value]. What should happen next?"
   - **1.2.3.3** [BE] `choices` - Maximum 3 options: `keep`, `skip`, `done`
   - **1.2.3.4** [BE] `correct_answer` - Based on comparison logic
   - **1.2.3.5** [BE] `hint` - Optional guidance

### 1.3 Task 1.3: Narrative Generation (10 min)

**1.3.1** [BE] Implement `generate_narrative(trace_result)` method  
**1.3.2** [BE] Build markdown header with input summary  
**1.3.3** [BE] For each step in trace:
   - **1.3.3.1** [BE] Add step header: `## Step N: [description]`
   - **1.3.3.2** [BE] Show array state with color coding
   - **1.3.3.3** [BE] Show pointer positions: `slow`, `fast`, `unique_count`
   - **1.3.3.4** [BE] Show comparison: `arr[fast] vs arr[slow]` with actual values
   - **1.3.3.5** [BE] Show decision: Keep or Skip with reasoning
   - **1.3.3.6** [BE] Show action: Which pointer(s) moved

**1.3.4** [BE] Add final result summary  
**1.3.5** [BE] Verify all quantitative claims use actual values (no undefined variables)

### 1.4 Task 1.4: Registry Registration (5 min)

**1.4.1** [BE] Open `backend/algorithms/registry.py`  
**1.4.2** [BE] Import `TwoPointerTracer`  
**1.4.3** [BE] Add `registry.register()` call with:
   - **1.4.3.1** [BE] `name='two-pointer'`
   - **1.4.3.2** [BE] `tracer_class=TwoPointerTracer`
   - **1.4.3.3** [BE] `display_name='Two Pointer Pattern'`
   - **1.4.3.4** [BE] `description='Remove duplicates using slow/fast pointer technique'`
   - **1.4.3.5** [BE] Three example inputs:
      - Basic Duplicates: `[1,1,2,2,3]`
      - All Unique: `[1,2,3,4,5]`
      - All Duplicates: `[1,1,1,1,1]`

### 1.5 Run Unit Tests

**1.5.1** [BE] Run `pytest backend/algorithms/tests/test_two_pointer.py`  
**1.5.2** [BE] If failures, debug and fix bugs  
**1.5.3** [BE] Repeat until all tests pass

### 1.6 Generate Narratives

**1.6.1** [BE] Run `python backend/scripts/generate_narratives.py two-pointer`  
**1.6.2** [BE] Verify 3 markdown files created in `docs/narratives/two-pointer/`:
   - `example_1_basic_duplicates.md`
   - `example_2_all_unique.md`
   - `example_3_all_duplicates.md`

### 1.7 Backend Self-Review

**1.7.1** [BE] Read each narrative independently (without looking at code)  
**1.7.2** [BE] Verify logical completeness: Can I follow the algorithm?  
**1.7.3** [BE] Verify temporal coherence: Does step N lead to step N+1?  
**1.7.4** [BE] Verify decision transparency: Are all comparisons shown with values?  
**1.7.5** [BE] Verify mental visualization: Can I picture this without seeing code?

---

## 2. Stage 1.5: FAA Audit - BLOCKING GATE (15 min target, ≤1 iteration)

### 2.1 Initial FAA Audit (10-15 min)

**2.1.1** [FAA] Open `docs/compliance/FAA_PERSONA.md` for audit guidelines  
**2.1.2** [FAA] For each narrative file:
   - **2.1.2.1** [FAA] Verify every arithmetic claim (counts, indices, comparisons)
   - **2.1.2.2** [FAA] Check state transitions: "slow updated from X → Y" (manually calculate)
   - **2.1.2.3** [FAA] Verify array element counts match operations (e.g., "3 unique" matches shown array)
   - **2.1.2.4** [FAA] Check for copy-paste errors (same number after different operations)
   - **2.1.2.5** [FAA] Validate visualization-text alignment (shown elements = claimed elements)

**2.1.3** [FAA] Document any arithmetic errors found

### 2.2 FAA Decision Gate

**2.2.1** [FAA] **IF arithmetic errors found:**
   - **2.2.1.1** [FAA→BE] Return to Stage 1, provide error report to BE
   - **2.2.1.2** [BE] Fix errors in `two_pointer.py`
   - **2.2.1.3** [BE] Regenerate narratives
   - **2.2.1.4** [FAA] Re-run FAA audit (5 min)
   - **2.2.1.5** [FAA/BE] Repeat until clean

**2.2.2** [FAA] **IF no arithmetic errors (FAA APPROVED):**
   - **2.2.2.1** [FAA] Mark narratives as "FAA-Approved"
   - **2.2.2.2** [FAA→BE] Handoff to BE for Backend Checklist

### 2.3 Stop Condition Check

**2.3.1** [FAA/PM] **IF >3 arithmetic errors found:** INVESTIGATE for systematic bug in trace generation  
**2.3.2** [FAA/PM] **IF FAA audit takes >30 min:** Algorithm may be too complex; consider simplification

---

## 3. Stage 1 Completion: Backend Checklist (10 min)

### 3.1 Complete Backend Checklist

**3.1.1** [BE] Open `docs/compliance/BACKEND_CHECKLIST.md`  
**3.1.2** [BE] Verify each requirement:
   - [ ] Metadata has `algorithm`, `display_name`, `visualization_type`
   - [ ] Trace structure matches contract (steps array, timestamps)
   - [ ] Visualization state uses `state` string (NOT `visual_state` dict)
   - [ ] Prediction points have ≤3 choices
   - [ ] Inherits from `AlgorithmTracer`
   - [ ] Uses `_add_step()` and `_build_trace_result()`
   - [ ] Implements `generate_narrative()` method
   - [ ] **Narratives pass FAA arithmetic audit**

### 3.2 Backend Checklist Decision Gate

**3.2.1** [BE/PM] **IF >3 items fail:** STOP and fix before proceeding  
**3.2.2** [BE] **IF ≤3 items fail:** Document failures, proceed to QA with awareness  
**3.2.3** [BE→QA] **IF all items pass:** Handoff FAA-approved narratives to QA

---

## 4. Stage 2: QA Narrative Review (20 min)

### 4.1 QA Reviews FAA-Approved Narratives

**4.1.1** [QA] Review ONLY markdown narratives (not code, not JSON)  
**4.1.2** [QA] ASSUME arithmetic already verified by FAA  
**4.1.3** [QA] Check for:
   - **4.1.3.1** [QA] Logical completeness: Can I understand the algorithm from narrative alone?
   - **4.1.3.2** [QA] Temporal coherence: Does each step logically flow to the next?
   - **4.1.3.3** [QA] Decision transparency: Are all decisions explained with supporting data?
   - **4.1.3.4** [QA] No undefined variables: All referenced values are shown
   - **4.1.3.5** [QA] Self-contained: No need to reference code or JSON

### 4.2 QA Decision Gate

**4.2.1** [QA] **IF logical/pedagogical issues found (QA REJECTED):**
   - **4.2.1.1** [QA→BE] Return to Stage 1, provide feedback report to BE
   - **4.2.1.2** [BE] Fix issues in `two_pointer.py`
   - **4.2.1.3** [BE] Regenerate narratives
   - **4.2.1.4** [FAA] Re-run FAA audit (5 min)
   - **4.2.1.5** [QA] Return narratives to QA review

**4.2.2** [QA] **IF narratives are logically complete (QA APPROVED):**
   - **4.2.2.1** [QA] Mark narratives as "QA-Approved"
   - **4.2.2.2** [QA→FE] Handoff approved narratives to FE for integration

---

## 5. Stage 3: Frontend Integration (30 min)

### 5.1 Select Visualization Component (5 min)

**5.1.1** [FE] Confirm reusing `ArrayView` component (no new component needed)  
**5.1.2** [FE] Verify `ArrayView` supports pointer rendering for `slow` and `fast` pointers  
**5.1.3** [FE] Test ArrayView with mock data containing 2 pointers

### 5.2 Verify Component Integration (10 min)

**5.2.1** [FE] Verify `utils/visualizationRegistry.js` already maps `array` → `ArrayView`  
**5.2.2** [FE] Test algorithm selection in UI dropdown (Two Pointer appears)  
**5.2.3** [FE] Run algorithm with example input, verify visualization renders

### 5.3 Complete Frontend Checklist (15 min)

**5.3.1** [FE] Open `docs/compliance/FRONTEND_CHECKLIST.md`  
**5.3.2** [FE] Verify each requirement:
   - [ ] Modal IDs: `#prediction-modal`, `#completion-modal` exist
   - [ ] Overflow pattern: Uses `items-start` + `mx-auto` (NOT `items-center`)
   - [ ] Keyboard shortcuts work (←→ navigation, R reset, K/C/S prediction)
   - [ ] Component receives `step` and `config` props correctly
   - [ ] Auto-scroll behavior works in right panel (algorithm state)
   - [ ] Pointer visualization is clear (distinct colors for slow/fast)

---

## 6. Stage 4: Integration Testing (30 min)

### 6.1 Run Integration Test Suites

**6.1.1** [QA] Suite 1-6: LOCKED requirements
   - **6.1.1.1** [QA] Modal behavior and IDs
   - **6.1.1.2** [QA] Keyboard shortcuts
   - **6.1.1.3** [QA] Auto-scroll functionality
   - **6.1.1.4** [QA] Overflow pattern (no left-side cutoff)

**6.1.2** [QA] Suite 7-10: CONSTRAINED requirements
   - **6.1.2.1** [QA] Backend contract validation
   - **6.1.2.2** [QA] Prediction point format
   - **6.1.2.3** [QA] Visualization data structure

**6.1.3** [QA] Suite 11-14: Integration tests
   - **6.1.3.1** [QA] Cross-algorithm switching (Binary Search ↔ Two Pointer)
   - **6.1.3.2** [QA] Responsive design (desktop, tablet, mobile)
   - **6.1.3.3** [QA] Performance with large arrays (20+ elements)
   - **6.1.3.4** [QA] Regression testing (existing algorithms still work)

### 6.2 Integration Testing Decision Gate

**6.2.1** [QA] **IF any tests fail:**
   - **6.2.1.1** [QA→FE/BE] Report failures to appropriate team
   - **6.2.1.2** [FE/BE] Debug and fix integration issues
   - **6.2.1.3** [QA] Re-run failed test suites
   - **6.2.1.4** [QA] Repeat until all pass

**6.2.2** [QA] **IF all 14 test suites pass:**
   - **6.2.2.1** [QA] Complete `docs/compliance/QA_INTEGRATION_CHECKLIST.md`
   - **6.2.2.2** [QA→PM] Approve for deployment to staging

---

## 7. Beta Testing & Validation (60 min)

### 7.1 Deploy to Staging (5 min)

**7.1.1** [FE/BE] Deploy backend + frontend to staging environment  
**7.1.2** [QA] Verify Two Pointer appears in algorithm dropdown  
**7.1.3** [QA] Smoke test with one example input

### 7.2 Beta User Testing (45 min)

**7.2.1** [PM] Send staging link to 3-5 beta users  
**7.2.2** [Beta Users] Each user tests Two Pointer algorithm (20 min per user)  
**7.2.3** [Beta Users] Provide feedback on:
   - **7.2.3.1** [Beta Users] Clarity score (1-10): Can you understand the pattern?
   - **7.2.3.2** [Beta Users] Pointer visualization clarity: Are slow/fast pointers distinct?
   - **7.2.3.3** [Beta Users] Prediction engagement: Did you answer prediction questions?
   - **7.2.3.4** [Beta Users] Pattern learning: Can you explain the two-pointer technique?

### 7.3 Analyze Feedback (10 min)

**7.3.1** [PM] Calculate average clarity score  
**7.3.2** [PM] Calculate prediction engagement rate (% questions answered)  
**7.3.3** [PM] Identify common confusion points  
**7.3.4** [PM] Check for regression feedback on existing algorithms

---

## 8. GO/NO-GO Decision Gate

### 8.1 Success Criteria Evaluation

**8.1.1** [PM] **Evaluate against minimum success criteria:**
   - [ ] FAA audit passed with ≤1 iteration
   - [ ] Backend checklist: ≤3 items failed
   - [ ] All 14 integration test suites passed
   - [ ] Beta clarity score ≥7/10
   - [ ] Prediction engagement >70%
   - [ ] Zero regression bugs in Binary Search/Interval Coverage

### 8.2 Decision Outcomes

**8.2.1** [PM] **IF clarity score ≥7/10 and all criteria met:**
   - ✅ **PHASE 1 SUCCESS**
   - [PM] Approve Phase 2: Sliding Window Pattern
   - [PM] Archive Phase 1 deliverables

**8.2.2** [PM] **IF clarity score 5-6/10:**
   - ⚠️ **INVESTIGATE**
   - **8.2.2.1** [PM/QA] Identify specific visualization issues
   - **8.2.2.2** [FE] Tweak pointer prominence/colors
   - **8.2.2.3** [FE] Add clearer labels to pointers
   - **8.2.2.4** [BE] Regenerate narratives if needed
   - **8.2.2.5** [Beta Users] Re-test with beta users (15 min)
   - **8.2.2.6** [PM] **IF fixed:** Proceed to Phase 2
   - **8.2.2.7** [PM] **IF not fixed:** REASSESS (consider different example algorithm)

**8.2.3** [PM] **IF clarity score <5/10:**
   - 🛑 **STOP - Pedagogical Failure**
   - [PM] Pattern visualization fundamentally unclear
   - [PM] Do not proceed to Phase 2
   - [PM] Reassess algorithm choice or approach

**8.2.4** [PM] **IF any regression bugs found:**
   - 🛑 **STOP - Platform Stability Issue**
   - [BE/FE] Fix regressions before proceeding
   - [QA] Re-run all integration tests
   - [Beta Users] Re-validate with beta users

---

## 9. Stop Conditions (Monitor Throughout)

### 9.1 Immediate Stop Triggers

**9.1.1** [PM/BE] **IF Stage 1 implementation >210 min (3x estimate):**
   - Indicates architectural mismatch
   - [PM] STOP and investigate root cause

**9.1.2** [FAA/PM] **IF FAA audit reveals >3 arithmetic errors:**
   - Indicates systematic bug in trace generation
   - [PM] STOP and fix core issue before continuing

**9.1.3** [BE/PM] **IF backend checklist >3 items fail:**
   - Indicates fundamental compliance issue
   - [PM] STOP and fix before proceeding

**9.1.4** [QA/PM] **IF regression bugs in existing algorithms:**
   - Platform stability compromised
   - [PM] STOP and fix before proceeding

**9.1.5** [PM] **IF beta clarity score <5/10:**
   - Pedagogical approach ineffective
   - [PM] STOP and reassess

---

## 10. Phase 1 Deliverables

### 10.1 Code Files

- [BE] `backend/algorithms/two_pointer.py` - Complete tracer implementation
- [BE] `backend/algorithms/registry.py` - Updated with Two Pointer registration
- [BE] `backend/algorithms/tests/test_two_pointer.py` - Unit tests

### 10.2 Documentation

- [BE/FAA/QA] `docs/narratives/two-pointer/example_1_basic_duplicates.md` (FAA + QA approved)
- [BE/FAA/QA] `docs/narratives/two-pointer/example_2_all_unique.md` (FAA + QA approved)
- [BE/FAA/QA] `docs/narratives/two-pointer/example_3_all_duplicates.md` (FAA + QA approved)
- [BE] `docs/compliance/backend_checklist_two_pointer.md` (completed)
- [FE] `docs/compliance/frontend_checklist_two_pointer.md` (completed)
- [QA] `docs/compliance/qa_integration_checklist_two_pointer.md` (completed)

### 10.3 Test Results

- [BE] Unit test results (all passing)
- [FAA] FAA audit report (arithmetic verified, ≤1 iteration)
- [QA] Integration test results (14 suites passing)
- [PM] Beta user feedback summary (3-5 users, clarity scores)

### 10.4 Beta Metrics

- [PM] Average clarity score (target: ≥7/10)
- [PM] Prediction engagement rate (target: >70%)
- [PM] Pointer visualization effectiveness rating
- [PM] Regression check results (zero issues)

---

## Phase 2 Readiness Checklist

- [ ] [PM] Phase 1 clarity score ≥7/10
- [ ] [QA] Zero regression bugs
- [ ] [FAA] FAA audit process validated (≤15 min per algorithm)
- [ ] [FE] ArrayView confirmed sufficient for pointer patterns
- [ ] [PM] Beta user cohort still available for Phase 2
- [ ] [PM] Implementation time within 2x estimate (learning curve validated)

**IF all checked:** ✅ [PM] Ready to proceed to Phase 2: Sliding Window Pattern

---

**Next Action:** [FE] Begin 0.1 - Review ArrayView pointer rendering capabilities
