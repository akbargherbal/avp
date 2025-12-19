✅ **Documentation Reviewed:**

- README.md (architecture overview confirmed)
- WORKFLOW.md (FAA gate at Stage 1.5 confirmed, workflow stages: 1, 1.5, 2, 3, 4)
- terminal.txt (project structure analyzed)

**Key Observations:**

- Current workflow has 5 stages: 1 (Backend), 1.5 (FAA Audit - BLOCKING), 2 (PE Review), 3 (Frontend), 4 (QA)
- Existing sorting algorithms: None visible (Binary Search, Two Pointer, Sliding Window, Interval Coverage are comparison/search algorithms)
- Merge Sort will be the **first sorting algorithm** in the platform
- Registry pattern confirmed in `backend/algorithms/registry.py`
- Narrative generation required with FAA arithmetic audit

**Ready to proceed with Merge Sort implementation planning.**

---

# 📋 Merge Sort Implementation Plan

## **Scope & Classification**

- **Type:** Sorting (Divide & Conquer)
- **Complexity:** O(n log n) time, O(n) space
- **Input:** Array of 8-12 unique integers
- **Output:** Timeline visualization showing recursive splits and merges

---

## **🔧 STAGE 1: Backend Implementation**

**Owner:** Backend Developer  
**Time Estimate:** 45-60 minutes  
**Reference:** WORKFLOW.md Stage 1, `backend/algorithms/base_tracer.py`, existing tracer patterns

### **Tasks:**

#### 1. Create Merge Sort Tracer Class

**File:** `backend/algorithms/merge_sort.py`

```python
"""
Merge Sort Algorithm Tracer

Implements divide-and-conquer sorting with recursive splits and merges.
Tracks all split and merge operations for visualization.
"""

from typing import Any
from backend.algorithms.base_tracer import AlgorithmTracer


class MergeSortTracer(AlgorithmTracer):
    """
    Tracer for Merge Sort algorithm using divide-and-conquer strategy.

    Handles arrays of 8-12 unique integers, tracking recursive splits
    and merge operations for narrative generation.
    """

    def __init__(self):
        super().__init__()
        self.metadata = {
            'algorithm': 'merge-sort',
            'display_name': 'Merge Sort',
            'visualization_type': 'timeline',  # Shows recursive call tree
            'input_size': 10
        }

    def execute(self, input_data: dict) -> list[dict]:
        """
        Execute merge sort and capture trace steps.

        Args:
            input_data: {"array": [38, 27, 43, 3, 9, 82, 10]}

        Returns:
            List of trace steps capturing splits and merges

        Implementation Notes:
        - Track each array split (showing left/right subarrays)
        - Track each merge operation (showing comparison decisions)
        - Capture recursion depth for timeline visualization
        - Follow pattern from existing tracers for step structure
        - See WORKFLOW.md Stage 1 for trace step structure requirements

        Trace Step Structure Example:
        {
            "type": "split",
            "depth": 0,
            "array": [38, 27, 43, 3],
            "left": [38, 27],
            "right": [43, 3],
            "indices": {"start": 0, "mid": 1, "end": 3}
        }
        {
            "type": "merge",
            "depth": 2,
            "left": [27],
            "right": [38],
            "comparison": {"left_val": 27, "right_val": 38, "chose": "left"},
            "result": [27, 38]
        }
        """
        pass  # Backend Developer: Implement merge sort with trace capture

    def get_prediction_points(self, trace_data: list[dict]) -> list[dict]:
        """
        Identify points where user predicts next merge comparison.

        Returns:
            List of prediction points with question and answer choices

        Requirements:
        - HARD LIMIT: 2-3 choices maximum per prediction
        - One prediction before first merge at depth 1
        - One prediction during mid-level merge
        - See WORKFLOW.md Stage 1 for prediction point structure

        Example Prediction:
        {
            "step_index": 5,
            "question": "Which element will be selected first in this merge?",
            "choices": [
                "27 (left subarray)",
                "38 (right subarray)"
            ],
            "correct_answer": "27 (left subarray)",
            "explanation": "27 < 38, so we take from left first"
        }
        """
        pass  # Backend Developer: Implement prediction logic

    def generate_narrative(self, trace_result: dict) -> str:
        """
        Generate step-by-step narrative explaining divide-and-conquer decisions.

        Args:
            trace_result: Complete trace with metadata, steps, and result

        Returns:
            Markdown narrative explaining algorithm execution

        Requirements:
        - Extract metadata, steps, result from trace_result
        - Explain why each split divides array at midpoint
        - Explain each merge comparison decision with actual values
        - Show how recursion builds solution bottom-up
        - Must pass FAA arithmetic audit (Stage 1.5)
        - See WORKFLOW.md Stage 1 for narrative generation patterns
        - Reference existing narratives in docs/narratives/ for style

        Narrative Structure:
        1. Initial Setup (array, size, algorithm goal)
        2. Split Phase (recursive divisions with indices)
        3. Merge Phase (comparisons with actual values, choices made)
        4. Final Result (sorted array, number of operations)

        CRITICAL: All array indices, sizes, comparisons must be arithmetically verifiable
        """
        pass  # Backend Developer: Implement narrative generation

```

#### 2. Register in Algorithm Registry

**File:** `backend/algorithms/registry.py`

```python
# Backend Developer: Add import
from backend.algorithms.merge_sort import MergeSortTracer

# Backend Developer: Add to ALGORITHM_REGISTRY dict
ALGORITHM_REGISTRY = {
    # ... existing algorithms ...
    'merge-sort': MergeSortTracer(),
}
```

#### 3. Generate Narratives for ALL Examples

**Command to run:**

```bash
cd backend
python scripts/generate_narratives.py
```

**Backend Developer Actions:**

- [ ] Create 4-6 test cases in `MergeSortTracer` (small arrays, already sorted, reverse sorted, etc.)
- [ ] Run generation script
- [ ] Verify narratives created in `docs/narratives/merge-sort/`
- [ ] Self-review each narrative for:
  - All split indices are correct
  - All merge comparisons show actual values
  - Recursion depth matches trace data
  - Final sorted array is correct

#### 4. Create Unit Tests

**File:** `backend/algorithms/tests/test_merge_sort.py`

```python
"""
Unit tests for Merge Sort tracer.

Backend Developer: Implement tests following patterns from:
- test_binary_search.py (algorithm correctness)
- test_two_pointer.py (trace structure validation)

Test Coverage Required:
- Small array (4 elements)
- Medium array (8 elements)
- Already sorted array
- Reverse sorted array
- Trace step structure (split/merge types)
- Prediction point generation
- Narrative generation (basic smoke test)
"""
pass  # Backend Developer: Implement test suite
```

---

## **🔍 STAGE 1.5: FAA Audit (BLOCKING)**

**Owner:** Backend Developer (using FAA_PERSONA.md)  
**Time Estimate:** 15-20 minutes (clean code), 40 minutes (with fixes)  
**Reference:** `docs/compliance/FAA_PERSONA.md`

### **Tasks:**

- [ ] **Switch to FAA Auditor mode** using FAA_PERSONA.md
- [ ] **Audit all generated narratives** in `docs/narratives/merge-sort/`
- [ ] **Verify arithmetic claims:**
  - Array split indices (start, mid, end calculations)
  - Subarray sizes at each depth
  - Merge comparison values match trace data
  - Element counts before/after operations
  - Recursion depth counts
- [ ] **Check state transitions:**
  - Split operation math (mid = (start + end) // 2)
  - Merge result sizes (len(left) + len(right) = len(result))
  - Element preservation (no values lost/added)
- [ ] **Fix any arithmetic errors** and regenerate narratives
- [ ] **Repeat audit** until all narratives pass FAA approval

**CRITICAL:** This is a **BLOCKING gate**. No narrative proceeds to PE review without FAA arithmetic verification.

**Example FAA Issues to Check:**

- ❌ "We split the array [38, 27, 43, 3] at index 2" → Should be "at index 1 (midpoint)"
- ❌ "Merging [27] and [38] gives us 3 elements" → Should be "2 elements"
- ✅ "Left subarray [27] has 1 element, right subarray [38] has 1 element, merged result [27, 38] has 2 elements"

---

## **📚 STAGE 2: PE Narrative Review**

**Owner:** PE Specialist  
**Time Estimate:** 20 minutes  
**Reference:** WORKFLOW.md Stage 2, `docs/compliance/PE_SPECIALIST_CHECKLIST.md`

### **Tasks:**

- [ ] **Review FAA-approved narratives** (arithmetic already verified)
- [ ] **Check logical completeness:**
  - Does narrative explain WHY we split at midpoint?
  - Are merge comparison decisions justified with visible values?
  - Can reader visualize recursion tree without seeing code?
  - Is divide-and-conquer strategy evident?
- [ ] **Verify temporal coherence:**
  - Split phase → Base case → Merge phase flow clear?
  - Recursion depth progression logical?
- [ ] **Provide feedback if needed:**
  - WHAT is missing (don't say HOW to fix)
  - Reference specific narrative sections
  - Identify gaps in decision explanations

**Note:** Arithmetic already verified by FAA. Focus only on pedagogical clarity and logical flow.

---

## **🎨 STAGE 3: Frontend Integration**

**Owner:** Frontend Developer  
**Time Estimate:** 45-75 minutes  
**Reference:** WORKFLOW.md Stage 3, ADR-001 (registry architecture), `docs/static_mockup/recursive_context_algorithm_mockup.html`

### **Tasks:**

#### 1. Create Algorithm State Component

**File:** `frontend/src/components/algorithm-states/MergeSortState.jsx`

```jsx
import React from "react";

interface MergeSortStateProps {
  step: object;
  trace: object;
}

export const MergeSortState: React.FC<MergeSortStateProps> = ({
  step,
  trace,
}) => {
  /*
  Frontend Developer: Implement component logic
  
  Requirements:
  - Extract data from step.data.visualization
  - Access metadata from trace.metadata
  - Handle split vs merge step types differently
  - Show current operation (split/merge) prominently
  - Display recursion depth indicator
  - Handle missing data gracefully
  
  Visual Reference: docs/static_mockup/recursive_context_algorithm_mockup.html
  
  State Display Should Show:
  - Current operation type (SPLIT or MERGE)
  - Recursion depth level
  - Arrays involved in operation
  - Comparison values (for merge steps)
  - Operation result
  
  See WORKFLOW.md Stage 3 for:
  - Registry pattern requirements
  - Component organization principles
  - Props interface standards
  */

  return (
    <div className="algorithm-state">
      {/* Frontend Developer: Add JSX structure here */}
    </div>
  );
};
```

#### 2. Register Component in State Registry

**File:** `frontend/src/utils/stateRegistry.js`

```javascript
// Frontend Developer: Add import
import { MergeSortState } from "../components/algorithm-states/MergeSortState";

// Frontend Developer: Add to stateComponents object
export const stateComponents = {
  // ... existing algorithms ...
  "merge-sort": MergeSortState,
};
```

#### 3. Verify/Reuse Timeline Visualization

**File:** `frontend/src/utils/visualizationRegistry.js`

```javascript
// Frontend Developer: Verify timeline visualization is registered
// Timeline view should already exist for recursive algorithms
// If modifications needed, update TimelineView.jsx

// Expected: 'timeline' -> TimelineView mapping already exists
```

#### 4. Create Algorithm Info Markdown

**File:** `frontend/public/algorithm-info/merge-sort.md`

```markdown
<!-- Frontend Developer: Create algorithm info following pattern from existing files -->

# Merge Sort

## Overview

[Brief description of merge sort algorithm]

## How It Works

[Explain divide-and-conquer approach]

## Time Complexity

- Best Case: O(n log n)
- Average Case: O(n log n)
- Worst Case: O(n log n)

## Space Complexity

O(n) - requires auxiliary array for merging

## Key Concepts

- Divide and Conquer
- Recursive splitting
- Merging sorted subarrays
```

#### 5. Visual Compliance Check

**Reference:** `docs/static_mockup/recursive_context_algorithm_mockup.html`

- [ ] Timeline shows recursion depth levels
- [ ] Split operations clearly distinguished from merge operations
- [ ] Array elements visible at each step
- [ ] Color coding matches design system
- [ ] Responsive layout maintained

#### 6. Complete Frontend Compliance Checklist

**Reference:** `docs/compliance/FRONTEND_CHECKLIST.md`

- [ ] Component registered in stateRegistry.js
- [ ] Algorithm info markdown created
- [ ] Visualization component identified/reused
- [ ] Visual compliance with static mockup
- [ ] No console errors or warnings
- [ ] Keyboard shortcuts work (space, arrow keys)
- [ ] Prediction modal integration tested

---

## **✅ STAGE 4: Integration Testing**

**Owner:** QA  
**Time Estimate:** 20 minutes  
**Reference:** `docs/compliance/QA_INTEGRATION_CHECKLIST.md`

### **Tasks:**

- [ ] **Full algorithm flow test:**
  - Load merge sort from dashboard
  - Step through complete execution
  - Verify timeline visualization renders correctly
  - Test prediction modal appears at correct steps
- [ ] **Narrative accuracy validation:**
  - Compare narrative text to UI rendering
  - Verify split indices match visualization
  - Verify merge comparisons match displayed values
- [ ] **Prediction modal functionality:**
  - Modal appears at prediction points
  - 2-3 choices maximum displayed
  - Correct answer validation works
  - Modal keyboard shortcuts work (1, 2, 3, Enter)
- [ ] **Regression testing:**
  - Test existing algorithms still work
  - No visual regressions in other algorithm states
  - No console errors introduced
- [ ] **Complete QA Integration Checklist**

---

## **Success Criteria**

- [ ] Merge sort executes correctly for all test cases (4-12 element arrays)
- [ ] Narrative explains every split and merge decision with visible data
- [ ] Narrative passes FAA arithmetic audit (all indices, sizes, values correct)
- [ ] Timeline visualization shows recursion tree structure
- [ ] Predictions appear at 2-3 strategic moments (2-3 choices each)
- [ ] Visual design matches `recursive_context_algorithm_mockup.html`
- [ ] No regressions in existing algorithms (Binary Search, Two Pointer, etc.)
- [ ] Complete end-to-end test passes all QA checks

---

## **Risk Factors & Mitigation**

**Risk:** Recursion depth tracking complexity  
**Mitigation:** Study existing recursive algorithm patterns, implement depth counter in trace capture early

**Risk:** Timeline visualization overwhelm with large arrays  
**Mitigation:** Limit input size to 8-12 elements (already specified), use visual hierarchy to show depth levels

**Risk:** Narrative becomes too technical with recursion details  
**Mitigation:** PE Specialist focuses on "why divide here?" and "why choose this element?" questions in Stage 2 review

**Risk:** FAA audit catches merge comparison errors  
**Mitigation:** Backend Developer runs comprehensive self-review before FAA audit, uses existing narrative patterns as reference

**Risk:** First sorting algorithm - no existing pattern to follow  
**Mitigation:** Timeline visualization already exists, merge sort is well-documented algorithm, extensive testing in Stage 4

---

## **Backend Developer - You Are Clear to Start**

### **Your Immediate Actions:**

1. **Create** `backend/algorithms/merge_sort.py` using scaffolding above
2. **Implement** `execute()`, `get_prediction_points()`, `generate_narrative()` methods
3. **Register** algorithm in `backend/algorithms/registry.py`
4. **Create** 4-6 test cases (varied array sizes and patterns)
5. **Run** `python scripts/generate_narratives.py`
6. **Self-review** generated narratives for arithmetic correctness
7. **Switch to FAA mode** (use FAA_PERSONA.md) and audit your narratives
8. **Fix** any arithmetic errors and regenerate
9. **Notify PM** when Stage 1.5 (FAA audit) is complete

### **Reference Materials:**

- Existing tracers: `binary_search.py`, `two_pointer.py`, `sliding_window.py`
- Narrative examples: `docs/narratives/binary-search/`, `docs/narratives/two-pointer/`
- Test patterns: `backend/algorithms/tests/test_binary_search.py`
- WORKFLOW.md Stage 1 and 1.5 requirements

### **Time Budget:**

- Implementation: 45-60 minutes
- FAA Audit: 15-20 minutes (if clean), 40 minutes (with fixes)
- **Total: ~1.5 hours for Stages 1 + 1.5**

---

**Questions or blockers? Report back to PM immediately.**
