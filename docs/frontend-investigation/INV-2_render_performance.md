# Executive Summary: Re-render Performance Concerns

## Investigation ID

INV-2: Re-render Performance

## Status

[x] Investigation Complete (Static Analysis)
[ ] Dynamic testing required to fully confirm and quantify.
[x] Issue Confirmed (based on static analysis)
Date Completed: 2025-12-16

---

## Findings Summary (3-5 sentences)

Static analysis reveals that `App.jsx` passes several non-memoized handler functions (`nextStep`, `handlePredictionAnswer`, `handlePredictionSkip`) to key child components (`ControlBar`, `PredictionModal`). These child components are not wrapped with `React.memo` in `App.jsx`. This pattern indicates a high probability of unnecessary re-renders for these children and their sub-trees every time `App.jsx` re-renders, even if their data props have not changed, leading to potential performance degradation.

---

## Evidence & Metrics

### Quantitative Data

- **Non-memoized handlers**: `nextStep`, `handlePredictionAnswer`, `handlePredictionSkip` are defined inline within `App.jsx`.
- **Receiving Components without `React.memo` (in App.jsx usage)**: `ControlBar`, `PredictionModal`, `CompletionModal`, `AlgorithmSwitcher`.
- **Memoized handlers**: `handleCloseModals` (wrapped in `useCallback`). Hooks like `switchAlgorithm`, `togglePredictionMode`, `prevStep`, `resetTrace`, `jumpToEnd`, `closeCompletionModal`, `handleIntervalHover` are assumed to be stable from their respective custom hooks.

### Qualitative Observations

- **Code Smell**: Missing `useCallback` for functions passed as props to potentially re-rendering children. Missing `React.memo` on child components when receiving unstable props.
- **Potential for unnecessary re-renders**: Every re-render of `App.jsx` (which occurs frequently during trace navigation or prediction mode changes) will create new instances of `nextStep`, `handlePredictionAnswer`, and `handlePredictionSkip`. This will trigger re-renders of `ControlBar` and `PredictionModal` even if their visual output or other data hasn't changed.
- **Impact on performance**: This could lead to a sluggish user interface, especially with large traces or complex UI trees beneath the affected components.

### Test Results

- **Static Analysis**: Identified clear code patterns (`inline functions`, `un-memoized child components`) that are known causes of unnecessary re-renders.
- **Dynamic Testing (Pending)**: Full confirmation requires running the application, adding `console.log` statements in child components' render methods, and/or using React DevTools Profiler to observe actual re-render counts during user interaction (e.g., rapid step navigation).

---

## Severity Assessment

**Impact**: [x] High
**Urgency**: [ ] Immediate / [x] Soon / [ ] Eventually / [ ] Not Needed

**Justification**: Unnecessary re-renders directly impact user experience and application responsiveness. While not immediately critical for a simple trace, it will become a significant performance bottleneck with larger traces or more complex visualisations, increasing technical debt and requiring more effort to optimize later. Addressing this early will ensure a smoother user experience and a more performant application.

---

## Affected Files & Components

**Direct Impact**:

- `frontend/src/App.jsx` (handler definitions and component rendering sections)

**Indirect Impact** (will need changes if this is fixed):

- `frontend/src/components/ControlBar.jsx` (receives `onNext`, `onPrev`, `onReset`)
- `frontend/src/components/PredictionModal.jsx` (receives `onAnswer`, `onSkip`)
- `frontend/src/components/CompletionModal.jsx` (receives `onReset`, `onClose`)
- `frontend/src/components/AlgorithmSwitcher.jsx` (receives `onAlgorithmSwitch`)

**Estimated Files to Modify**: 1 (App.jsx) + potentially 3-4 child components if `React.memo` is added to them.

---

## Dependencies & Related Investigations

**Depends On** (must be fixed first):

- [x] INV-1: Single Responsibility Violation (Refactoring `App.jsx`'s structure will naturally involve restructuring how handlers are defined and passed, making it an opportune time to address memoization).

**Blocks** (other investigations waiting on this):

- [ ] None directly, but performance issues can mask other problems.

**Related To** (could be fixed together):

- [x] INV-1: Single Responsibility Violation
- Reason: Restructuring `App.jsx` (INV-1) should include rationalizing handler definitions and prop passing, which directly addresses the root cause of re-render issues in INV-2.

---

## Recommended Solution Approach

**Strategy**: Implement memoization for unstable props passed to child components. This involves using `useCallback` for handler functions and `React.memo` for functional child components that receive these handlers, ensuring they only re-render when their props actually change.

**Implementation Steps** (rough outline, not detailed):

1.  **Memoize Handlers**: Wrap `nextStep`, `handlePredictionAnswer`, and `handlePredictionSkip` with `useCallback`, carefully defining their dependencies.
2.  **Memoize Child Components**: Wrap `ControlBar`, `PredictionModal`, `CompletionModal`, and `AlgorithmSwitcher` components with `React.memo` if they are pure components and receive stable props. This needs to be done within their respective component files.
3.  **Dynamic Testing**: After initial changes, run the application and use React DevTools Profiler to verify that unnecessary re-renders have been eliminated or significantly reduced.

**Estimated Effort**: 1-2 days (after INV-1 is complete)

**Risk Assessment**:

- Breaking changes: [ ] Yes (low, if `useCallback` dependencies are correct)
- Requires testing: [x] Yes
- Affects user experience: [ ] Yes (if not tested thoroughly) / [x] No (if done correctly, should improve UX)

---

## Recommendation

[ ] **Fix Now** - Critical path item, blocks other work
[x] **Fix in Sprint 1** - High priority, clear solution
[ ] **Fix in Sprint 2** - Medium priority, plan alongside other work
[ ] **Monitor** - Not urgent, revisit in 3 months
[ ] **Not an Issue** - Suspicion not confirmed, no action needed

**Additional Notes**: This issue is highly coupled with INV-1. It would be most efficient to address the memoization concerns during the structural refactoring of `App.jsx`. A dedicated performance profiling session with React DevTools should be conducted before and after the fix to quantify the improvement.

---

**Investigator**: CodeAuditor
**Review Date**: 2026-01-16
