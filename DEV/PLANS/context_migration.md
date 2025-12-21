# Interval Coverage → Unified Dashboard Migration: Implementation Kickstart

## Context Summary

**Goal:** Migrate Interval Coverage from architectural violation (call stack in RSP) to unified dashboard pattern (proven by Merge Sort).

**Current State:**

- ❌ `IntervalCoverageState.jsx` renders entire call stack in RSP (Right Side Panel)
- ✅ Backend provides correct data structure (`call_stack_state`, `all_intervals`)
- 🚨 **Backend currently broken** - returns error on API call (TypeError in interval_coverage.py line 289)

**Target State:**

- ✅ LSP (Left Side Panel): Composite visualization with `RecursiveCallStackView` + `TimelineView`
- ✅ RSP: 5-zone dashboard showing current decision moment (like Merge Sort)

---

## Evidence-Based Validation

### ✅ Merge Sort Precedent Confirmed

**Files Reviewed:**

- `MergeSortState.jsx` - Uses 5-zone dashboard for recursive algorithm ✓
- `MergeSortVisualization.jsx` - LSP composite (RecursiveCallStackView + array view) ✓
- Both components are generic and reusable ✓

### ✅ Component Compatibility Verified

**`RecursiveCallStackView.jsx`:**

- Expects: `callStackState[]` with `{id, depth, is_active, operation}`
- Expects: `allIntervals[]` with `{id, label, state, color, start, end}`
- ✅ Generic - no Merge Sort hardcoding

**`TimelineView.jsx`:**

- Expects: `step.data.visualization.all_intervals[]`
- Expects: `highlightedIntervalId`, `onIntervalHover` props
- ✅ Already built for intervals - perfect fit

### ✅ Backend Data Structure (from narrative analysis)

```javascript
// step.data.visualization.call_stack_state[]:
{
  call_id: 0,
  depth: 0,
  current_interval: {id, start, end, color},
  max_end: number | null,
  remaining_count: number,
  decision: "keep" | "covered",
  status: "active" | "returning",
  return_value: []
}

// step.data.visualization.all_intervals[]:
{
  id: number,
  start: number,
  end: number,
  color: string,
  state: "examining" | "kept" | "covered",
  label: string
}
```

### ✅ Pedagogical Intent (from narrative)

**Key Teaching Moments:**

1. **Comparison Decision:** "Does interval.end > max_end?" → Dashboard Zone 3 (Logic)
2. **Coverage Tracking:** "max_end extended from X → Y" → Dashboard Zone 2 (Goal)
3. **Recursive Context:** "Call #N, Depth D, X remaining" → Dashboard Zone 5 (Overlay)
4. **Full Picture:** See call stack tree + all intervals timeline → LSP Visualization

---

## Implementation Plan (3.5 hours)

### Phase 0: Backend Fix (BLOCKING - 30 min)

**Problem:** Backend TypeError when receiving intervals

```
File "interval_coverage.py", line 289, in <listcomp>
    id=i['id'],
TypeError: list indices must be integers or slices, not str
```

**Action:** Fix backend to accept either:

- Simple format: `[[1,3], [2,6], [8,10]]` (auto-generate IDs), OR
- Full format: `[{"id": 1, "start": 1, "end": 3}, ...]`

**Verification:**

```bash
curl -X POST http://localhost:5000/api/trace/unified \
  -H "Content-Type: application/json" \
  -d '{"algorithm": "interval-coverage", "input": {"intervals": [[1,3], [2,6], [8,10], [15,18]]}}' \
  | python3 -m json.tool | head -50
```

Should return valid trace, not error.

---

### Phase 1: LSP Composite Visualization (1 hour)

**Create:** `frontend/src/components/visualizations/IntervalCoverageVisualization.jsx`

**Pattern:** Exact copy of Merge Sort composite structure:

```javascript
import React from "react";
import PropTypes from "prop-types";
import RecursiveCallStackView from "./RecursiveCallStackView";
import TimelineView from "./TimelineView";

const IntervalCoverageVisualization = ({
  step,
  highlightedIntervalId,
  onIntervalHover,
}) => {
  const viz = step?.data?.visualization || {};

  return (
    <div className="flex h-full gap-0 overflow-hidden">
      {/* LEFT: Call Stack Tree (25%) */}
      <RecursiveCallStackView
        callStackState={viz.call_stack_state}
        allIntervals={viz.all_intervals}
      />

      {/* RIGHT: Timeline (75%) */}
      <div className="flex-1 overflow-auto bg-slate-900">
        <TimelineView
          step={step}
          highlightedIntervalId={highlightedIntervalId}
          onIntervalHover={onIntervalHover}
        />
      </div>
    </div>
  );
};

IntervalCoverageVisualization.propTypes = {
  step: PropTypes.object.isRequired,
  highlightedIntervalId: PropTypes.number,
  onIntervalHover: PropTypes.func.isRequired,
};

export default React.memo(IntervalCoverageVisualization);
```

**Register:** `frontend/src/utils/visualizationRegistry.js`

```javascript
import IntervalCoverageVisualization from "../components/visualizations/IntervalCoverageVisualization";

const visualizationRegistry = {
  // ... existing
  "interval-coverage": IntervalCoverageVisualization,
};
```

---

### Phase 2: RSP Dashboard Refactor (1 hour)

**Refactor:** `frontend/src/components/algorithm-states/IntervalCoverageState.jsx`

**Key Change:** Show ONLY current call (not entire stack) in 5-zone layout

**Zone Mapping:**

```javascript
const IntervalCoverageState = ({ step }) => {
  // Extract current call (active call = last in stack)
  const callStack = step?.data?.visualization?.call_stack_state || [];
  const currentCall = callStack[callStack.length - 1];

  if (!currentCall) return <EmptyState stepType={step?.type} />;

  const interval = currentCall.current_interval;
  const maxEnd = currentCall.max_end;
  const decision = currentCall.decision;

  return (
    <div className="dashboard">
      {/* ZONE 1: PRIMARY - Interval Being Examined */}
      <div className="zone zone-primary">
        <div className="zone-label">Examining Interval</div>
        <div className="zone-meta">
          {getIntervalColor(interval.color).label}
        </div>
        <div className="primary-value">
          [{interval.start}, {interval.end}]
        </div>

        {/* ZONE 5: OVERLAY - Context */}
        <div className="zone-boundaries">
          <div className="boundary-cell">
            <div className="boundary-label">Depth</div>
            <div className="boundary-value">{currentCall.depth}</div>
          </div>
          <div className="boundary-cell">
            <div className="boundary-label">Remaining</div>
            <div className="boundary-value">{currentCall.remaining_count}</div>
          </div>
          <div className="boundary-cell">
            <div className="boundary-label">Call</div>
            <div className="boundary-value text-blue-300">
              #{currentCall.call_id}
            </div>
          </div>
        </div>
      </div>

      {/* ZONE 2: GOAL - Coverage Tracker */}
      <div className="zone zone-goal">
        <div className="zone-label">Max End</div>
        <div className="goal-value">{maxEnd === null ? "-∞" : maxEnd}</div>
      </div>

      {/* ZONE 3: LOGIC - Comparison */}
      <div className="zone zone-logic">
        <div className="zone-label">LOGIC</div>
        <div className="logic-content">
          <div
            className={
              decision === "keep" ? "text-emerald-300" : "text-red-300"
            }
          >
            {interval.end} {decision === "keep" ? ">" : "≤"} {maxEnd ?? "-∞"}
          </div>
          <div className="mt-1 text-[0.8em] font-normal opacity-70">
            {decision === "keep" ? "Extends Coverage" : "Already Covered"}
          </div>
        </div>
      </div>

      {/* ZONE 4: ACTION - Decision */}
      <div className="zone zone-action">
        <div
          className={`action-text ${
            decision === "keep" ? "text-emerald-200" : "text-red-200"
          }`}
        >
          {decision === "keep" ? "✅ KEEP INTERVAL" : "❌ DISCARD (COVERED)"}
        </div>
      </div>
    </div>
  );
};
```

**Handle Step Types:**

```javascript
// Early return for non-recursive steps
if (step?.type === "INITIAL_STATE") {
  return (
    <div className="text-sm italic text-slate-500">
      Sort intervals first to begin
    </div>
  );
}
if (step?.type === "SORT_BEGIN") {
  return (
    <div className="text-sm italic text-slate-500">Sorting intervals...</div>
  );
}
if (step?.type === "SORT_COMPLETE") {
  return (
    <div className="text-sm italic text-slate-500">
      Ready to start recursion
    </div>
  );
}
```

---

### Phase 3: Integration & Interactions (30 min)

**Wire Hover Interactions:**

Check parent component (likely `VisualizationPanel.jsx` or `App.jsx`) to ensure:

```javascript
const [highlightedInterval, setHighlightedInterval] = useState(null);

<IntervalCoverageVisualization
  step={currentStep}
  highlightedIntervalId={highlightedInterval}
  onIntervalHover={setHighlightedInterval}
/>;
```

**Remove Old Hover Logic:**

- Current `IntervalCoverageState` has hover handlers
- These should be REMOVED (hover now handled in LSP visualization)

**Auto-Scroll Behavior:**

- Verify `RecursiveCallStackView` scrolls to active call
- Current implementation has auto-scroll in state component - can be removed

---

### Phase 4: Testing (30 min)

**Test Cases:**

1. **Happy Path:** Run example_1 trace, verify dashboard updates on each step
2. **Edge Cases:**
   - First interval (max_end = -∞)
   - Last interval (remaining_count = 0)
   - All intervals kept
   - All intervals covered
3. **Interactions:**
   - Hover on timeline highlights in call stack
   - Navigation updates both LSP and RSP
4. **Regression:**
   - Other algorithms still work
   - No console errors

**Verification Commands:**

```bash
# Start backend
cd backend && python app.py

# Start frontend
cd frontend && npm start

# Navigate to Interval Coverage algorithm
# Step through trace, verify:
# - LSP shows call stack tree + timeline
# - RSP shows 5-zone dashboard with current decision
# - Hover works bidirectionally
```

---

## Critical Files Reference

**Project Root:** `/home/akbar/Jupyter_Notebooks/avp`

**Files to Modify:**

- `frontend/src/components/visualizations/IntervalCoverageVisualization.jsx` (CREATE)
- `frontend/src/components/algorithm-states/IntervalCoverageState.jsx` (REFACTOR)
- `frontend/src/utils/visualizationRegistry.js` (UPDATE)

**Files to Reference:**

- `frontend/src/components/algorithm-states/MergeSortState.jsx` (Pattern)
- `frontend/src/components/visualizations/MergeSortVisualization.jsx` (Pattern)
- `frontend/src/components/visualizations/RecursiveCallStackView.jsx` (Reuse)
- `frontend/src/components/visualizations/TimelineView.jsx` (Reuse)

**Narrative for Pedagogical Context:**

- `docs/narratives/interval-coverage/example_1_basic_example_4_intervals.md`

---

## Quick Start Checklist

When resuming implementation:

### Pre-Flight

- [ ] Backend is running (`cd backend && python app.py`)
- [ ] Backend returns valid trace (not error)
- [ ] Frontend builds without errors (`cd frontend && npm start`)

### Phase 1: LSP

- [ ] Create `IntervalCoverageVisualization.jsx`
- [ ] Import RecursiveCallStackView and TimelineView
- [ ] Register in visualizationRegistry.js
- [ ] Test: LSP shows call stack tree + timeline

### Phase 2: RSP

- [ ] Refactor IntervalCoverageState.jsx to 5-zone layout
- [ ] Extract current call from stack (last element)
- [ ] Map to zones: Primary=Interval, Goal=MaxEnd, Logic=Comparison, Action=Decision
- [ ] Handle early return for non-recursive step types
- [ ] Test: RSP shows current decision in dashboard format

### Phase 3: Integration

- [ ] Wire highlightedInterval state in parent
- [ ] Pass onIntervalHover to visualization
- [ ] Remove old hover logic from state component
- [ ] Test: Hover works bidirectionally

### Phase 4: Verification

- [ ] Run all narrative examples
- [ ] Test edge cases (first, last, all kept, all covered)
- [ ] Verify no regressions in other algorithms
- [ ] Side-by-side with Merge Sort - same pattern?

---

## Success Criteria

**Architecture:**

- ✅ LSP contains structural visualization (call stack + timeline)
- ✅ RSP contains 5-zone dashboard (current decision moment)
- ✅ Pattern matches Merge Sort exactly

**Functionality:**

- ✅ Navigation updates both panels in sync
- ✅ Hover interactions work bidirectionally
- ✅ All narrative examples render correctly
- ✅ No console errors or warnings

**Visual Quality:**

- ✅ Dashboard fills available space
- ✅ Call stack tree scrolls to active call
- ✅ Timeline highlights current interval
- ✅ Color coding consistent with narrative

---

## Key Principle

**"If it worked for Merge Sort, it works for Interval Coverage."**

Both are recursive algorithms with identical backend data structures. The migration is NOT inventing new patterns - it's applying the proven Merge Sort pattern to a structurally identical algorithm.

---

## Emergency Reference

**If stuck, compare against Merge Sort:**

1. Open `MergeSortState.jsx` and `MergeSortVisualization.jsx` side-by-side
2. Copy the structure exactly
3. Swap algorithm-specific data fields
4. Test

**Backend data fields mapping:**

- Merge Sort: `merged_array`, `left`, `right`, `comparison_count`
- Interval Coverage: `current_interval`, `max_end`, `decision`, `remaining_count`

**Zone mapping parallel:**

- Merge Sort Zone 1: "Comparing 5 vs 3"
- Interval Coverage Zone 1: "Examining [540, 720]"

- Merge Sort Zone 3: "5 ≤ 3" (comparison logic)
- Interval Coverage Zone 3: "720 > -∞" (coverage logic)

Same pattern, different domain.

---

**Last Updated:** 2025-12-21
**Status:** Ready for implementation (pending backend fix)
**Estimated Time:** 3.5 hours total
