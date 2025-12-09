# Frontend Refactoring Plan: From God Component to Maintainable Architecture

## Requirements Analysis

**Current State:**

- `App.jsx` at 750 lines (130% over maintainability threshold)
- 11 state variables with complex interdependencies (2,048 possible state combinations)
- 6+ useEffect hooks with unpredictable execution order
- 2 inline components (~300 lines) recreated every render
- Zero test coverage
- All concerns mixed: data fetching, state, business logic, visualization, styling

**Core Goal:**
Reduce `App.jsx` to <150 lines while improving testability, maintainability, and developer velocity by extracting components, custom hooks, and introducing context.

**Technical Constraints:**

- React 18+ with functional components
- Tailwind CSS for styling
- No breaking changes to user experience
- Must work with existing backend API
- Zero tolerance for regressions

**Assumptions to Validate:**

1. Component extraction won't introduce performance regressions (validate with React DevTools Profiler)
2. Context won't cause excessive re-renders (validate with split contexts if needed)
3. Custom hooks can be tested independently (validate with React Testing Library)

---

## Strategic Approach

**Why This Phasing?**

The plan follows a **safety-first incremental extraction** strategy:

1. **Phase 1 (Components):** Immediate 40% reduction with minimal risk - extract self-contained UI
2. **Phase 2 (Hooks):** Isolate business logic for testability - 87% total reduction
3. **Phase 3 (Context):** Eliminate prop drilling only after hooks are proven stable

This ordering minimizes risk: each phase produces working software, and failures rollback cleanly.

**Main Risk Areas:**

1. **State synchronization bugs** - Complex interdependencies between 11 state variables
2. **Performance regressions** - Inline components currently optimized by proximity
3. **Breaking changes** - Keyboard shortcuts, prediction flow, highlighting must work identically

**Validation Strategy:**

- Manual QA checklist after each extraction (15-item smoke test)
- Git commits align with phase boundaries (instant rollback)
- PropTypes added before extraction (catch bugs early)
- React DevTools Profiler before/after (catch performance issues)

---

## Phase 1: Emergency Component Extraction (8-10 hours)

### Goal

**Reduce `App.jsx` to ~450 lines by extracting inline components and utility functions without changing behavior.**

### Success Criteria

- ✅ `App.jsx` reduced from 750 → 450 lines (40% reduction)
- ✅ All existing features work identically (keyboard shortcuts, prediction, highlighting)
- ✅ No performance regression (React DevTools Profiler: <5% slower renders)
- ✅ PropTypes validate all extracted component props
- ✅ Manual smoke test passes (15 test cases)

### Tasks

**1.1: Extract TimelineView Component** (3 hours)

- Create `frontend/src/components/visualizations/TimelineView.jsx`
- Move ~150 lines of inline component
- Add PropTypes validation
- Wrap with `React.memo` for performance
- **Key Decision:** Keep interval color mapping in component temporarily (extract in 1.3)

```javascript
// frontend/src/components/visualizations/TimelineView.jsx
import React from "react";
import PropTypes from "prop-types";

const TimelineView = ({ step, highlightedIntervalId, onIntervalHover }) => {
  const allIntervals = step?.data?.all_intervals || [];
  const maxEnd = step?.data?.max_end;
  // ... existing visualization logic
};

TimelineView.propTypes = {
  step: PropTypes.shape({
    data: PropTypes.shape({
      all_intervals: PropTypes.arrayOf(PropTypes.object),
      max_end: PropTypes.number,
    }),
  }),
  highlightedIntervalId: PropTypes.number,
  onIntervalHover: PropTypes.func.isRequired,
};

export default React.memo(TimelineView);
```

**1.2: Extract CallStackView Component** (3 hours)

- Create `frontend/src/components/visualizations/CallStackView.jsx`
- Move ~150 lines of inline component
- Add PropTypes validation
- Wrap with `React.memo`

```javascript
// frontend/src/components/visualizations/CallStackView.jsx
import React from "react";
import PropTypes from "prop-types";

const CallStackView = ({ step, activeCallRef, onIntervalHover }) => {
  const callStack = step?.data?.call_stack_state || [];
  // ... existing call stack rendering logic
};

CallStackView.propTypes = {
  step: PropTypes.object,
  activeCallRef: PropTypes.object,
  onIntervalHover: PropTypes.func.isRequired,
};

export default React.memo(CallStackView);
```

**1.3: Extract Utility Functions** (2 hours)

- Create `frontend/src/utils/stepBadges.js` - badge logic (~60 lines)
- Create `frontend/src/constants/intervalColors.js` - color mapping (~30 lines)
- Create barrel exports in `frontend/src/components/visualizations/index.js`

```javascript
// frontend/src/utils/stepBadges.js
export const getStepTypeBadge = (stepType) => {
  if (!stepType) return { color: "bg-slate-600", label: "UNKNOWN" };
  const type = stepType.toUpperCase();

  if (type.includes("DECISION")) {
    return {
      color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/50",
      label: "⚖️ DECISION",
    };
  }
  // ... rest of badge logic
};
```

```javascript
// frontend/src/constants/intervalColors.js
export const INTERVAL_COLORS = {
  blue: { bg: "bg-blue-800", text: "text-white", border: "border-blue-600" },
  green: { bg: "bg-green-600", text: "text-white", border: "border-green-500" },
  amber: { bg: "bg-amber-500", text: "text-black", border: "border-amber-400" },
  purple: {
    bg: "bg-purple-600",
    text: "text-white",
    border: "border-purple-500",
  },
};

export const getIntervalColor = (color) =>
  INTERVAL_COLORS[color] || INTERVAL_COLORS.blue;
```

**1.4: Update App.jsx Imports** (30 minutes)

- Replace inline components with imports
- Update color/badge references to use utilities
- Test all features manually

**1.5: Manual QA & Performance Check** (1.5 hours)

- Run 15-item smoke test checklist
- Profile with React DevTools (baseline vs. extracted)
- Fix any regressions before commit

### Deliverables

- [ ] `TimelineView.jsx` extracted with PropTypes
- [ ] `CallStackView.jsx` extracted with PropTypes
- [ ] `stepBadges.js` utility extracted
- [ ] `intervalColors.js` constants extracted
- [ ] `App.jsx` reduced to ~450 lines
- [ ] All features work identically
- [ ] Performance within 5% of baseline
- [ ] Git commit: `refactor: extract visualization components (Phase 1 complete)`

### Rollback Plan

**If** manual QA fails or performance >10% slower:

- `git reset --hard HEAD~1` (revert to pre-extraction commit)
- Review React DevTools Profiler for bottlenecks
- Consider extracting one component at a time instead of batch

---

## Phase 2: Custom Hooks Extraction (12-16 hours)

### Goal

**Isolate all business logic into testable custom hooks, reducing `App.jsx` to ~140 lines.**

### Success Criteria

- ✅ `App.jsx` reduced from 450 → 140 lines (70% reduction from Phase 1)
- ✅ 5 custom hooks created with clear responsibilities
- ✅ 80%+ test coverage on all hooks (React Testing Library)
- ✅ All existing features work identically
- ✅ Hook unit tests pass in CI

### Tasks

**2.1: Create useTraceLoader Hook** (3 hours)

- Extract API calling logic + loading/error states
- Add unit tests with mocked fetch

```javascript
// frontend/src/hooks/useTraceLoader.js
import { useState, useCallback } from "react";

export const useTraceLoader = (apiUrl) => {
  const [trace, setTrace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadTrace = useCallback(
    async (intervals) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${apiUrl}/trace`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ intervals }),
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(
            `Backend returned ${response.status}: ${errData.error || "Unknown"}`
          );
        }

        const data = await response.json();
        setTrace(data);
      } catch (err) {
        setError(`Backend error: ${err.message}`);
      } finally {
        setLoading(false);
      }
    },
    [apiUrl]
  );

  const loadExampleTrace = useCallback(() => {
    loadTrace([
      { id: 1, start: 540, end: 660, color: "blue" },
      { id: 2, start: 600, end: 720, color: "green" },
      { id: 3, start: 540, end: 720, color: "amber" },
      { id: 4, start: 900, end: 960, color: "purple" },
    ]);
  }, [loadTrace]);

  return { trace, loading, error, loadTrace, loadExampleTrace };
};
```

**2.2: Create useTraceNavigation Hook** (3 hours)

- Extract step navigation logic (next, prev, reset, jump)
- Add derived state (isFirstStep, isLastStep, isComplete)
- Add unit tests

```javascript
// frontend/src/hooks/useTraceNavigation.js
import { useState, useCallback, useMemo } from "react";

export const useTraceNavigation = (trace) => {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = useCallback(() => {
    if (trace?.trace?.steps && currentStep < trace.trace.steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  }, [trace, currentStep]);

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  const resetTrace = useCallback(() => setCurrentStep(0), []);

  const jumpToEnd = useCallback(() => {
    if (trace?.trace?.steps) {
      setCurrentStep(trace.trace.steps.length - 1);
    }
  }, [trace]);

  const currentStepData = useMemo(
    () => trace?.trace?.steps?.[currentStep],
    [trace, currentStep]
  );

  const isComplete = currentStepData?.type === "ALGORITHM_COMPLETE";
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep >= (trace?.trace?.steps?.length || 0) - 1;

  return {
    currentStep,
    currentStepData,
    nextStep,
    prevStep,
    resetTrace,
    jumpToEnd,
    isComplete,
    isFirstStep,
    isLastStep,
  };
};
```

**2.3: Create usePredictionMode Hook** (4 hours)

- Extract all prediction logic (detection, stats, handlers)
- Add unit tests for prediction detection logic
- **Key Decision:** Keep auto-detection logic in hook (not component) for testability

```javascript
// frontend/src/hooks/usePredictionMode.js
import { useState, useCallback, useEffect } from "react";
import { isPredictionPoint } from "../utils/predictionUtils";

export const usePredictionMode = (trace, currentStep) => {
  const [predictionMode, setPredictionMode] = useState(true);
  const [showPrediction, setShowPrediction] = useState(false);
  const [predictionStats, setPredictionStats] = useState({
    total: 0,
    correct: 0,
  });

  const currentStepData = trace?.trace?.steps?.[currentStep];
  const nextStepData = trace?.trace?.steps?.[currentStep + 1];

  // Auto-detect prediction points
  useEffect(() => {
    if (!trace || !predictionMode) {
      setShowPrediction(false);
      return;
    }

    if (
      isPredictionPoint(currentStepData) &&
      nextStepData?.type === "DECISION_MADE"
    ) {
      setShowPrediction(true);
    } else {
      setShowPrediction(false);
    }
  }, [currentStep, trace, predictionMode, currentStepData, nextStepData]);

  const handlePredictionAnswer = useCallback((isCorrect) => {
    setPredictionStats((prev) => ({
      total: prev.total + 1,
      correct: prev.correct + (isCorrect ? 1 : 0),
    }));
    setShowPrediction(false);
    return true; // Signal to advance step
  }, []);

  const togglePredictionMode = useCallback(() => {
    setPredictionMode((prev) => !prev);
    setShowPrediction(false);
  }, []);

  const resetPredictionStats = useCallback(() => {
    setPredictionStats({ total: 0, correct: 0 });
  }, []);

  return {
    predictionMode,
    showPrediction,
    predictionStats,
    togglePredictionMode,
    handlePredictionAnswer,
    handlePredictionSkip: () => {
      setShowPrediction(false);
      return true;
    },
    resetPredictionStats,
  };
};
```

**2.4: Create useVisualHighlight Hook** (2 hours)

- Extract highlighting logic (auto + hover)
- Add unit tests

```javascript
// frontend/src/hooks/useVisualHighlight.js
import { useState, useCallback, useEffect } from "react";

export const useVisualHighlight = (trace, currentStep) => {
  const [highlightedIntervalId, setHighlightedIntervalId] = useState(null);
  const [hoverIntervalId, setHoverIntervalId] = useState(null);

  // Extract highlighted interval from active call stack entry
  useEffect(() => {
    if (!trace) {
      setHighlightedIntervalId(null);
      return;
    }

    const step = trace?.trace?.steps?.[currentStep];
    const callStack = step?.data?.call_stack_state || [];
    const activeCall = callStack[callStack.length - 1];

    setHighlightedIntervalId(activeCall?.current_interval?.id ?? null);
  }, [currentStep, trace]);

  const handleIntervalHover = useCallback((intervalId) => {
    setHoverIntervalId(intervalId);
  }, []);

  // Hover overrides step-based highlighting
  const effectiveHighlight =
    hoverIntervalId !== null ? hoverIntervalId : highlightedIntervalId;

  return {
    highlightedIntervalId: effectiveHighlight,
    onIntervalHover: handleIntervalHover,
  };
};
```

**2.5: Create useKeyboardShortcuts Hook** (3 hours)

- Extract keyboard event handling
- Add cleanup logic for event listeners
- Add unit tests (test event listener attachment/detachment)

```javascript
// frontend/src/hooks/useKeyboardShortcuts.js
import { useEffect } from "react";

export const useKeyboardShortcuts = ({
  onNext,
  onPrev,
  onReset,
  onJumpToEnd,
  isComplete,
  modalOpen,
  disabled = false,
}) => {
  useEffect(() => {
    if (disabled) return;

    const handleKeyPress = (event) => {
      // Ignore if typing in input
      if (["INPUT", "TEXTAREA"].includes(event.target.tagName)) return;

      // Ignore if modal is open
      if (modalOpen) return;

      switch (event.key) {
        case "ArrowRight":
        case " ":
          event.preventDefault();
          if (!isComplete) onNext?.();
          break;

        case "ArrowLeft":
          event.preventDefault();
          if (!isComplete) onPrev?.();
          break;

        case "r":
        case "R":
        case "Home":
          event.preventDefault();
          onReset?.();
          break;

        case "End":
          event.preventDefault();
          onJumpToEnd?.();
          break;

        case "Escape":
          if (isComplete) onPrev?.();
          break;

        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [onNext, onPrev, onReset, onJumpToEnd, isComplete, modalOpen, disabled]);
};
```

**2.6: Add Hook Unit Tests** (4 hours)

- Install React Testing Library: `pnpm add -D @testing-library/react @testing-library/jest-dom`
- Create test files for all 5 hooks
- Target 80%+ coverage

```javascript
// frontend/src/hooks/__tests__/useTraceNavigation.test.js
import { renderHook, act } from "@testing-library/react";
import { useTraceNavigation } from "../useTraceNavigation";

describe("useTraceNavigation", () => {
  const mockTrace = {
    trace: {
      steps: [
        { type: "INIT" },
        { type: "EXAMINING" },
        { type: "ALGORITHM_COMPLETE" },
      ],
    },
  };

  test("should initialize at step 0", () => {
    const { result } = renderHook(() => useTraceNavigation(mockTrace));
    expect(result.current.currentStep).toBe(0);
    expect(result.current.isFirstStep).toBe(true);
  });

  test("should advance to next step", () => {
    const { result } = renderHook(() => useTraceNavigation(mockTrace));
    act(() => result.current.nextStep());
    expect(result.current.currentStep).toBe(1);
  });

  // ... more tests
});
```

**2.7: Update App.jsx to Use Hooks** (1 hour)

- Replace useState/useEffect with custom hooks
- Verify all features work

### Deliverables

- [ ] 5 custom hooks created with clear interfaces
- [ ] Hook unit tests with 80%+ coverage
- [ ] `App.jsx` reduced to ~140 lines
- [ ] All features work identically
- [ ] Tests pass in CI
- [ ] Git commit: `refactor: extract business logic to custom hooks (Phase 2 complete)`

### Rollback Plan

**If** tests fail or behavior changes:

- `git reset --hard <phase-1-commit>` (revert to post-component-extraction)
- Extract one hook at a time instead of batch
- Add integration tests before proceeding

---

## Phase 3: Context Introduction (6-8 hours)

### Goal

**Eliminate prop drilling by introducing context providers, reducing `App.jsx` to ~100 lines.**

### Success Criteria

- ✅ `App.jsx` reduced from 140 → 100 lines (final 30% reduction)
- ✅ Zero prop drilling (all shared state via context)
- ✅ No performance regression (React DevTools: <5% slower)
- ✅ Context split to minimize re-renders (separate concerns)
- ✅ All features work identically

### Tasks

**3.1: Create TraceContext** (3 hours)

- Create `frontend/src/contexts/TraceContext.jsx`
- Combine `useTraceLoader` + `useTraceNavigation`
- Add context provider component

```javascript
// frontend/src/contexts/TraceContext.jsx
import React, { createContext, useContext } from "react";
import { useTraceLoader } from "../hooks/useTraceLoader";
import { useTraceNavigation } from "../hooks/useTraceNavigation";

const TraceContext = createContext(null);

export const TraceProvider = ({ children }) => {
  const BACKEND_URL =
    process.env.REACT_APP_API_URL || "http://localhost:5000/api";

  const loader = useTraceLoader(BACKEND_URL);
  const navigation = useTraceNavigation(loader.trace);

  const value = {
    ...loader,
    ...navigation,
  };

  return (
    <TraceContext.Provider value={value}>{children}</TraceContext.Provider>
  );
};

export const useTrace = () => {
  const context = useContext(TraceContext);
  if (!context) {
    throw new Error("useTrace must be used within TraceProvider");
  }
  return context;
};
```

**3.2: Refactor App.jsx to Use Context** (2 hours)

- Wrap app in `TraceProvider`
- Replace prop passing with `useTrace()` hook
- Keep `usePredictionMode` and `useVisualHighlight` in component (local state)

```javascript
// frontend/src/App.jsx (FINAL: ~100 lines)
import React from "react";
import { TraceProvider, useTrace } from "./contexts/TraceContext";
import { usePredictionMode } from "./hooks/usePredictionMode";
import { useVisualHighlight } from "./hooks/useVisualHighlight";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import { TimelineView, CallStackView } from "./components/visualizations";
import { getStepTypeBadge } from "./utils/stepBadges";

const AlgorithmTracePlayer = () => {
  const {
    trace,
    loading,
    error,
    currentStep,
    currentStepData,
    nextStep,
    prevStep,
    resetTrace,
    jumpToEnd,
    isComplete,
    loadExampleTrace,
  } = useTrace();

  const prediction = usePredictionMode(trace, currentStep);
  const highlight = useVisualHighlight(trace, currentStep);

  useKeyboardShortcuts({
    onNext: nextStep,
    onPrev: prevStep,
    onReset: () => {
      resetTrace();
      prediction.resetPredictionStats();
    },
    onJumpToEnd: jumpToEnd,
    isComplete,
    modalOpen: prediction.showPrediction,
  });

  const handlePredictionAnswer = (isCorrect) => {
    if (prediction.handlePredictionAnswer(isCorrect)) {
      nextStep();
    }
  };

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen error={error} onRetry={loadExampleTrace} />;
  if (!trace) return <NoTraceScreen />;

  const step = currentStepData;
  if (!step) return <InvalidStepScreen onReset={resetTrace} />;

  return (
    <div className="w-full h-screen bg-slate-900 flex items-center justify-center p-4">
      {prediction.showPrediction && (
        <PredictionModal
          step={step}
          nextStep={trace?.trace?.steps?.[currentStep + 1]}
          onAnswer={handlePredictionAnswer}
          onSkip={prediction.handlePredictionSkip}
        />
      )}

      {/* Main UI - implementation details */}
    </div>
  );
};

const App = () => (
  <TraceProvider>
    <AlgorithmTracePlayer />
  </TraceProvider>
);

export default App;
```

**3.3: Performance Testing & Optimization** (2 hours)

- Profile with React DevTools before/after
- If >5% slower, split contexts:
  ```javascript
  <TraceDataProvider>
    {" "}
    {/* rarely updates */}
    <TraceNavigationProvider>
      {" "}
      {/* updates frequently */}
      <App />
    </TraceNavigationProvider>
  </TraceDataProvider>
  ```
- Add `React.memo` to child components if needed

**3.4: Final QA & Documentation** (1 hour)

- Run full smoke test (15 items)
- Update README with new architecture
- Document context usage patterns

### Deliverables

- [ ] `TraceContext.jsx` created and tested
- [ ] `App.jsx` reduced to ~100 lines
- [ ] Zero prop drilling
- [ ] Performance within 5% of Phase 2
- [ ] Documentation updated
- [ ] Git commit: `refactor: introduce context (Phase 3 complete - 87% reduction achieved)`

### Rollback Plan

**If** performance degrades >10%:

- `git reset --hard <phase-2-commit>`
- Investigate with React DevTools Profiler
- Consider split contexts or keeping hooks in App.jsx

---

## Decision Tree & Stop Conditions

```
START (750 lines, 0% test coverage)
  ↓
PHASE 1: Extract Components (8-10 hours)
  ├─ Manual QA passes → PHASE 2
  ├─ Performance <5% slower → PHASE 2
  ├─ Performance 5-10% slower → Investigate
  │   ├─ Fixed with React.memo → PHASE 2
  │   └─ Not fixed → ROLLBACK, extract one component at a time
  └─ Manual QA fails → ROLLBACK, debug before proceeding

PHASE 2: Custom Hooks (12-16 hours)
  ├─ Tests pass + features work → PHASE 3
  ├─ Tests fail → Fix tests, retry
  ├─ Features broken → ROLLBACK, extract one hook at a time
  └─ Coverage <80% → Add more tests before proceeding

PHASE 3: Context (6-8 hours)
  ├─ Performance OK + features work → SUCCESS
  ├─ Performance degraded → Split contexts, retry
  ├─ Features broken → ROLLBACK to Phase 2
  └─ Success → CELEBRATE (87% reduction, 80%+ coverage)
```

### Explicit Stop Conditions

**STOP if:**

- Phase 1 exceeds 2x estimated time (16 hours) - reassess approach
- Phase 2 cannot achieve 80% test coverage - simplify hooks
- Any phase causes >10% performance regression after optimization
- Manual QA regression cannot be fixed within 2 hours - rollback and investigate
- Combined refactor time exceeds 40 hours (3 weeks allocated)

---

## Risk Mitigation Summary

| Risk                                | Likelihood | Impact | Mitigation                                                                    |
| ----------------------------------- | ---------- | ------ | ----------------------------------------------------------------------------- |
| Breaking keyboard shortcuts         | Medium     | High   | Manual QA checklist includes all shortcuts; test after each phase             |
| Performance regression from context | Medium     | Medium | Profile before/after; split contexts if needed; add React.memo                |
| Test setup complexity               | Medium     | Low    | Start with simple hook tests; use React Testing Library patterns              |
| State synchronization bugs          | High       | High   | Add PropTypes first; manual QA after each extraction; rollback plan ready     |
| Feature freeze blocks team          | Low        | Medium | Announce sprint in advance; dedicate 1 dev full-time; others focus on backend |
| Over-engineering                    | Low        | Low    | Follow "Rule of Three"; defer abstractions until 2nd algorithm                |

---

## Success Metrics

| Metric                    | Current  | Phase 1 Target | Phase 2 Target | Phase 3 Target | Measured By             |
| ------------------------- | -------- | -------------- | -------------- | -------------- | ----------------------- |
| **Lines in App.jsx**      | 750      | 450            | 140            | 100            | `wc -l App.jsx`         |
| **Test coverage**         | 0%       | 0%             | 80%+           | 80%+           | Jest coverage report    |
| **Component files**       | 1        | 3              | 3              | 3              | File count              |
| **Hook files**            | 0        | 0              | 5              | 5              | File count              |
| **Context providers**     | 0        | 0              | 0              | 1              | File count              |
| **Prop drilling depth**   | 4+       | 4+             | 2-3            | 0-1            | Manual audit            |
| **Cyclomatic complexity** | 40+      | 30+            | <15            | <10            | ESLint plugin           |
| **Render performance**    | Baseline | <5% slower     | <5% slower     | <5% slower     | React DevTools Profiler |

---

## Scope Boundaries

### In Scope ✅

- ✅ Extract TimelineView and CallStackView components
- ✅ Extract 5 custom hooks (loader, navigation, prediction, highlight, keyboard)
- ✅ Create TraceContext for shared state
- ✅ Add PropTypes to all extracted components
- ✅ Add unit tests for all hooks (80%+ coverage)
- ✅ Performance profiling before/after each phase
- ✅ Manual QA after each phase

### Out of Scope ❌

- ❌ Adding TypeScript (wait until architecture proven)
- ❌ E2E tests with Playwright (manual QA sufficient for now)
- ❌ Component library extraction (Storybook) - premature
- ❌ Algorithm plugin architecture (wait for 2nd algorithm)
- ❌ Visual regression tests (Chromatic) - too heavy for refactor
- ❌ Performance optimization beyond React.memo (not needed yet)
- ❌ Splitting contexts beyond single TraceContext (only if needed)

---

## Next Steps

1. **Monday Week 1:** Create feature branch `refactor/phase1-components`
2. **Tuesday-Wednesday Week 1:** Execute Phase 1 (components extraction)
3. **Thursday Week 1:** Manual QA + performance check
4. **Friday Week 1:** Merge to main if passing, or fix issues
5. **Monday-Thursday Week 2:** Execute Phase 2 (hooks extraction + tests)
6. **Friday Week 2:** Code review + merge
7. **Monday-Tuesday Week 3:** Execute Phase 3 (context)
8. **Wednesday Week 3:** Final QA + documentation
9. **Thursday Week 3:** Merge + celebrate 🎉

---

## Implementation Notes

**Technologies Requiring Research:**

- React Testing Library (hook testing patterns)
- Jest coverage reporting configuration

**Potential Blockers:**

- Keyboard event testing (may need manual QA only)
- Context performance optimization (may need split contexts)
- Hook testing complexity (may need to mock trace data carefully)

**Recommended Starting Point:**

```bash
# 1. Create feature branch
git checkout -b refactor/phase1-components

# 2. Install testing dependencies
cd frontend
pnpm add -D @testing-library/react @testing-library/jest-dom @testing-library/user-event

# 3. Create directory structure
mkdir -p src/components/visualizations src/hooks src/contexts src/utils/__tests__ src/hooks/__tests__

# 4. Start with TimelineView extraction (smallest risk)
# 5. Commit after each successful extraction
git commit -m "refactor: extract TimelineView component"

# 6. Manual QA after each commit
npm start
# Test: keyboard shortcuts, prediction mode, highlighting, step navigation
```

---

## Questions Before Starting

_No ambiguities detected - requirements are clear from SWOT analysis and existing codebase. Proceed with Phase 1._

---

**Total Estimated Time:** 26-34 hours (3-4 weeks with 1 developer full-time)

**Expected ROI:**

- **87% reduction in App.jsx** (750 → 100 lines)
- **80%+ test coverage** (0% → 80%+)
- **<5% performance impact** (measured with React DevTools)
- **10x faster feature development** (testable hooks + clear separation)

**Risk Level:** Medium (complex state, but incremental approach minimizes cascading failures)

**Go/No-Go:** Proceed - benefits far out weigh risks, and rollback plan is robust.
