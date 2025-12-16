# Frontend Refactor Implementation Plan

## Requirements Analysis

- **Current State**: A functional but architecturally fragile frontend with App.jsx acting as a 340-line "God Object" managing 10+ concerns. Backend is exemplary with registry pattern, but frontend hasn't scaled equivalently.
- **Core Goal**: Transform the frontend from a brittle monolith into a modular, context-driven architecture that matches the backend's elegance.
- **Technical Constraints**: React 18, no breaking changes to user experience, must maintain all existing keyboard shortcuts and modal behaviors (LOCKED requirements)
- **Assumptions to Validate**:
  - Context API will be sufficient (vs. Redux/Zustand)
  - Re-render improvements will be measurable with React DevTools Profiler
  - Existing tests will catch regressions during refactor

---

## Strategic Approach

- **Why This Phasing?**: All 7 investigations form 3 tightly coupled clusters. We attack the root cause (App.jsx monopoly) first through data architecture, then layer on interaction improvements, then polish, and finally document the architectural transformation for future maintainers.
- **Main Risk Areas**:
  1. Breaking existing keyboard shortcuts during centralization (INV-3)
  2. Creating performance regressions during Context migration (INV-2)
  3. Missing edge cases in error boundary placement (INV-7)
- **Validation Strategy**: After each phase, run full E2E test suite + React DevTools Profiler comparison. Each phase produces a working, testable increment.

---

## Phase 1: Data Architecture Foundation (5-8 days)

### Goal

**Eliminate App.jsx's data monopoly by migrating state management to Context API, reducing App.jsx from 340 lines to <100 lines.**

### Success Criteria

- ✅ App.jsx LOC reduced by 70% (340 → <100 lines)
- ✅ Zero props passed through App.jsx for trace/step/highlight data
- ✅ All existing functionality works (verified by manual test suite)
- ✅ Re-render count reduced by 30% (measured via React DevTools Profiler)

### Tasks

**1.1: Create TraceContext (1-2 days)**

- Extract `useTraceLoader` logic into `TraceProvider`
- Context provides: `{ trace, metadata, loading, error, loadTrace, availableAlgorithms }`
- Migrate `AlgorithmSwitcher`, `CompletionModal`, `AlgorithmInfoModal` to consume context
- **Key Decision**: Keep `useTraceLoader` hook as wrapper around context for backward compatibility during migration
- Code structure:

```javascript
// src/contexts/TraceContext.jsx
export const TraceProvider = ({ children }) => {
  // Move useTraceLoader logic here
  const value = {
    trace,
    metadata,
    loading,
    error,
    loadTrace,
    availableAlgorithms,
  };
  return (
    <TraceContext.Provider value={value}>{children}</TraceContext.Provider>
  );
};

export const useTrace = () => useContext(TraceContext);
```

**1.2: Create NavigationContext (1-2 days)**

- Extract `useTraceNavigation` logic into `NavigationProvider`
- Context provides: `{ currentStep, currentStepData, nextStep, prevStep, resetTrace, jumpToEnd }`
- Migrate `ControlBar`, `MainVisualizationComponent`, `StateComponent` to consume context
- **Key Decision**: Memoize all navigation handlers with `useCallback` to prevent re-render cascade
- Code structure:

```javascript
// src/contexts/NavigationContext.jsx
export const NavigationProvider = ({ children }) => {
  const { trace } = useTrace(); // Consumes TraceContext
  // Move useTraceNavigation logic here with memoized callbacks
  return <NavigationContext.Provider value={...}>{children}</NavigationContext.Provider>;
};

export const useNavigation = () => useContext(NavigationContext);
```

**1.3: Create PredictionContext (1 day)**

- Extract `usePredictionMode` logic into `PredictionProvider`
- Context provides: `{ predictionMode, togglePredictionMode, currentQuestion, submitAnswer, skipQuestion, stats }`
- Migrate `PredictionModal`, `CompletionModal` to consume context
- Memoize all prediction handlers

**1.4: Create HighlightContext (0.5 days)**

- Extract `useVisualHighlight` logic into `HighlightProvider`
- Context provides: `{ highlightedIntervalId, handleIntervalHover }`
- Migrate `MainVisualizationComponent`, `StateComponent` to consume context
- Wrap `handleIntervalHover` in `useCallback` to fix TimelineView memo issue (addresses INV-6)

**1.5: Refactor App.jsx (1-2 days)**

- Wrap application in Context Providers (nested: Trace → Navigation → Prediction → Highlight)
- Remove all prop passing logic
- App.jsx becomes pure layout orchestrator
- Extract algorithm info modal logic into separate component
- **Key Decision**: Keep all custom hooks functional during migration for incremental rollout

### Deliverables

- [ ] 4 new Context providers in `src/contexts/`
- [ ] App.jsx reduced to <100 lines
- [ ] All components migrated to consume contexts
- [ ] Manual test suite passes (all 14 QA tests)
- [ ] Git commit: "Phase 1: Migrate to Context API architecture"

### Rollback Plan

**If** re-render count increases >20% OR any keyboard shortcut breaks: Revert to pre-Phase-1 commit, investigate root cause, fix memoization, retry.

---

## Phase 2: Event Management & Resilience (3-4 days)

### Goal

**Centralize keyboard event handling to eliminate conflicts and add granular error boundaries to prevent component failures from cascading.**

### Success Criteria

- ✅ Single `Escape` keypress closes only highest-priority element (no simultaneous closures)
- ✅ All modals wrapped in error boundaries with fallback UI
- ✅ Uncaught errors in modals don't crash entire app
- ✅ Zero keyboard shortcut test failures

### Tasks

**2.1: Create KeyboardContext (1.5 days)**

- Build centralized keyboard event manager with priority system
- Single `window.addEventListener` in provider
- Components register handlers with priority levels (10=modal, 5=dropdown, 1=global)
- First matching handler consumes event (`stopPropagation` + `preventDefault`)
- Code structure:

```javascript
// src/contexts/KeyboardContext.jsx
export const KeyboardProvider = ({ children }) => {
  const handlers = useRef(new Map()); // Map<priority, Array<{key, callback, condition}>>

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Iterate handlers from highest to lowest priority
      for (const [priority, handlerList] of [...handlers.current].sort(
        (a, b) => b[0] - a[0]
      )) {
        for (const { key, callback, condition } of handlerList) {
          if (e.key === key && condition()) {
            e.stopPropagation();
            e.preventDefault();
            callback(e);
            return; // Consume event
          }
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <KeyboardContext.Provider value={{ registerHandler, unregisterHandler }}>
      {children}
    </KeyboardContext.Provider>
  );
};

export const useKeyboardHandler = (
  key,
  callback,
  { priority = 1, condition = () => true }
) => {
  // Register/unregister on mount/unmount
};
```

**2.2: Migrate Keyboard Listeners (1 day)**

- Refactor `useKeyboardShortcuts` to use `KeyboardProvider`
- Migrate `AlgorithmSwitcher` Escape handler (priority: 5)
- Migrate `KeyboardHints` Escape handler (priority: 5)
- Modal Escape handlers get priority: 10
- Remove all direct `window.addEventListener` calls
- **Key Decision**: Text input check (`e.target.tagName`) happens in provider, not individual handlers

**2.3: Add Modal Error Boundaries (0.5 days)**

- Wrap `PredictionModal` with ErrorBoundary + custom fallback
- Wrap `CompletionModal` with ErrorBoundary + custom fallback
- Wrap `AlgorithmInfoModal` with ErrorBoundary + custom fallback
- Fallback UI shows user-friendly message: "This modal encountered an error. [Close]"

**2.4: Integration Testing (1 day)**

- Test all Escape key scenarios (modal open, dropdown open, both open)
- Simulate errors in each modal (throw test error on button click)
- Verify error boundaries catch and display fallback
- Verify keyboard shortcuts still work after error recovery

### Deliverables

- [ ] KeyboardContext provider in `src/contexts/KeyboardContext.jsx`
- [ ] All keyboard listeners migrated to centralized system
- [ ] 3 modals wrapped in ErrorBoundary components
- [ ] Manual test: 10 keyboard shortcut scenarios pass
- [ ] Git commit: "Phase 2: Centralize keyboard events + error boundaries"

### Rollback Plan

**If** keyboard shortcuts regress OR error boundaries cause new errors: Revert Phase 2 commit, investigate priority logic, fix, retry. Phase 1 remains intact.

---

## Phase 3: Visual Stability & Render Optimization (2 days)

### Goal

**Eliminate CSS magic numbers in TimelineView and extract static constants from component bodies to reduce re-creation overhead.**

### Success Criteria

- ✅ TimelineView has zero hardcoded offsets (4, 0.92, 48)
- ✅ ArrayView's POINTER_STYLES defined outside component
- ✅ TimelineView's constants (minVal, maxVal, toPercent) defined outside component
- ✅ TimelineView re-renders only when props actually change (verified with Profiler)

### Tasks

**3.1: Refactor TimelineView CSS (1 day)**

- Replace magic number `4` with CSS variable `--timeline-padding`
- Replace scaling factor `0.92` with `calc()` expression
- Replace pixel spacing `48` with flexbox/grid gap
- Test with parent padding changes (p-4 → p-6) to verify robustness
- Code structure:

```javascript
// Extract constants outside component
const TIMELINE_CONFIG = {
  MIN_VAL: 0,
  MAX_VAL: 1440,
  toPercent: (val) => (val / 1440) * 100,
  ITEM_GAP: "gap-12", // Tailwind class instead of hardcoded 48px
};

const TimelineView = React.memo(({ step, config, onIntervalHover }) => {
  // Use TIMELINE_CONFIG constants
  // CSS variables for dynamic values
});
```

**3.2: Extract Static Objects (0.5 days)**

- Move ArrayView's `POINTER_STYLES` outside component body
- Move TimelineView's constants outside component body
- Verify no functional changes with unit tests

**3.3: Verify TimelineView Memoization (0.5 days)**

- Ensure `onIntervalHover` is memoized in HighlightContext (already done in Phase 1.4)
- Add `console.log` to TimelineView render to verify re-render reduction
- Run React DevTools Profiler on interval-coverage algorithm
- Confirm TimelineView only re-renders when `step` changes (not on parent re-render)

### Deliverables

- [ ] TimelineView refactored with CSS variables + Tailwind
- [ ] Static objects extracted from ArrayView and TimelineView
- [ ] Visual regression test: interval-coverage renders identically
- [ ] Profiler shows 40% re-render reduction for TimelineView
- [ ] Git commit: "Phase 3: CSS refactor + static extraction"

### Rollback Plan

**If** visual layout breaks OR performance degrades: Revert Phase 3 commit. Phases 1-2 remain intact.

---

## Phase 4: Documentation & Architecture Decision Record (1-2 days)

### Goal

**Document the architectural transformation as ADR-003, update README with new patterns, and create migration guide for future developers.**

### Success Criteria

- ✅ ADR-003 published in `docs/ADR/FRONTEND/`
- ✅ Frontend README updated with Context API architecture
- ✅ Migration guide created for converting remaining hook-based components
- ✅ Investigation documents marked as "RESOLVED" with phase references

### Tasks

**4.1: Create ADR-003 (0.5 days)**

- Document title: "Context-Based State Management Architecture"
- Sections:
  - **Status**: Accepted
  - **Context**: App.jsx God Object problem (reference INV-1, INV-2, INV-4)
  - **Decision**: Migrate to Context API with 4 domain-specific contexts
  - **Consequences**:
    - Positive: Eliminated prop drilling, reduced re-renders, improved maintainability
    - Negative: Learning curve for new contributors, slightly more complex provider nesting
  - **Alternatives Considered**: Redux, Zustand, keeping hooks (explain why rejected)
  - **Implementation Details**: Provider hierarchy, memoization strategy, migration pattern
- Code structure:

```markdown
# ADR-003: Context-Based State Management Architecture

## Status

✅ Accepted (2025-01-XX)
Supersedes: Hook-based prop passing pattern
Resolves: INV-1, INV-2, INV-4

## Context

[Problem statement from Executive Summary]

## Decision

[Context API architecture with 4 providers]

## Consequences

### Positive

- App.jsx LOC: 340 → 87 (74% reduction)
- Re-renders: 50% reduction in unnecessary renders
- Prop drilling: Eliminated entirely

### Negative

- New contributors need Context API knowledge
- Provider nesting increases initial complexity

## Alternatives Considered

1. Redux Toolkit - Rejected: Overkill for application size
2. Zustand - Rejected: Context API sufficient, one less dependency
3. Keep hooks - Rejected: Doesn't solve prop drilling

## Implementation

[Code examples, provider hierarchy diagram]
```

**4.2: Create Keyboard Event Management ADR Addendum (0.25 days)**

- Document centralized keyboard handler pattern in ADR-003
- Explain priority system and event consumption
- Reference INV-3 resolution

**4.3: Update Frontend README (0.5 days)**

- Add "Architecture" section explaining Context providers
- Update "Component Architecture" section with new patterns
- Add diagram showing Context hierarchy:

```
App
└─ TraceProvider
   └─ NavigationProvider
      └─ PredictionProvider
         └─ HighlightProvider
            └─ KeyboardProvider
               └─ AppLayout
```

- Document when to use Context vs props (guideline: shared state = Context, parent-child only = props)

**4.4: Create Migration Guide (0.5 days)**

- Document in `docs/MIGRATION_GUIDE.md`
- Pattern for converting hook-based components to Context consumers
- Before/After code examples
- Common pitfalls and solutions
- Checklist for ensuring memoization

**4.5: Update Investigation Documents (0.25 days)**

- Mark INV-1, INV-2, INV-4, INV-3, INV-6, INV-7 as "RESOLVED"
- Add resolution notes referencing phase numbers and commits
- Cross-reference ADR-003 in each investigation
- Update `EXECUTIVE_SUMMARY.md` with "Post-Refactor Status" section

### Deliverables

- [ ] `docs/ADR/FRONTEND/ADR-003-context-state-management.md` created
- [ ] `frontend/README.md` updated with architecture section
- [ ] `docs/MIGRATION_GUIDE.md` created
- [ ] All 7 investigation files updated with resolution status
- [ ] `EXECUTIVE_SUMMARY.md` updated with refactor outcomes
- [ ] Git commit: "Phase 4: Document Context API architecture (ADR-003)"

### Rollback Plan

**If** documentation is incomplete: Documentation-only phase, no code risk. Can iterate without affecting functionality.

---

## Decision Tree & Stop Conditions

```
START
  ↓
PHASE 1: Data Architecture (5-8 days)
  ├─ LOC reduction >70% → PHASE 2
  ├─ Re-render increase >20% → INVESTIGATE
  │   ├─ Fix memoization → PHASE 2
  │   └─ Context overhead too high → REASSESS (consider Zustand)
  └─ Test failures >5 → STOP & DEBUG

PHASE 2: Event Management (3-4 days)
  ├─ All tests pass → PHASE 3
  ├─ Keyboard conflicts persist → INVESTIGATE
  │   ├─ Fix priority logic → PHASE 3
  │   └─ Requires redesign → STOP & REASSESS
  └─ Error boundaries cause new errors → ROLLBACK PHASE 2

PHASE 3: Visual Polish (2 days)
  ├─ Visual parity + performance gain → PHASE 4
  ├─ Layout breaks → ROLLBACK PHASE 3
  └─ Minimal performance gain → ACCEPT (still improves maintainability)

PHASE 4: Documentation (1-2 days)
  ├─ ADR complete + README updated → COMPLETE ✅
  ├─ Missing details → ITERATE (low risk)
  └─ No blockers (documentation-only phase)
```

### Explicit Stop Conditions

**STOP if:**

- Any phase exceeds 2x estimated time (indicates architectural mismatch)
- Test suite failure rate >30% after any phase (indicates fundamental regression)
- Performance degrades >30% after Phase 1 (Context overhead unacceptable)
- Team consensus that Zustand/Redux would be faster (pivot after Phase 1)

---

## Risk Mitigation Summary

| Risk                            | Likelihood | Impact | Mitigation                                                       |
| ------------------------------- | ---------- | ------ | ---------------------------------------------------------------- |
| Context re-render cascade       | Medium     | High   | Aggressive memoization, split contexts by concern                |
| Keyboard shortcut regressions   | Medium     | High   | Comprehensive test matrix, priority system with clear precedence |
| Error boundaries hide real bugs | Low        | Medium | Logging + Sentry integration, temporary errors only              |
| CSS refactor breaks responsive  | Low        | Medium | Visual regression testing across 3 viewport sizes                |
| Incomplete migration state      | High       | High   | Feature flag per phase, can run old/new side-by-side             |
| Poor documentation              | Low        | Low    | Phase 4 dedicated to docs, can iterate post-refactor             |

---

## Success Metrics

### Minimum Viable Success (11-16 days)

- ✅ App.jsx <100 lines (from 340)
- ✅ Zero prop drilling through App.jsx
- ✅ Single Escape keypress closes only one element
- ✅ Modal errors don't crash app
- ✅ 30% re-render reduction (React DevTools Profiler)
- ✅ ADR-003 published with complete architecture rationale

### Stretch Goals (If ahead of schedule)

- Extract ControlBar logic into separate component
- Add Storybook for isolated component development
- Implement performance monitoring dashboard
- Create video walkthrough of new architecture

---

## Scope Boundaries

### In Scope

- ✅ Context API migration for all 4 data domains (trace, navigation, prediction, highlight)
- ✅ Centralized keyboard event management
- ✅ Granular error boundaries around modals
- ✅ CSS refactor for TimelineView
- ✅ Static constant extraction for performance
- ✅ Complete architectural documentation (ADR-003, README, migration guide)

### Out of Scope

- ❌ Adding new algorithms (separate sprint)
- ❌ Redesigning UI/UX (visual design unchanged)
- ❌ Backend changes (registry already perfect)
- ❌ State management library (Zustand/Redux) unless Context proves insufficient
- ❌ Component library migration (Tailwind + shadcn/ui sufficient)
- ❌ Automated documentation generation (manual is sufficient)

---

## Next Steps

1. **Create feature branch**: `git checkout -b refactor/frontend-architecture`
2. **Set up React DevTools Profiler baseline**: Record current re-render counts for comparison
3. **Create Phase 1 sub-branch**: `git checkout -b refactor/phase-1-contexts`
4. Start with TraceContext (smallest surface area, lowest risk)

## Implementation Notes

- **Technologies Requiring Research**: None (Context API, React.memo, useCallback are standard)
- **Potential Blockers**:
  - Discovering deeply nested prop dependencies not visible in static analysis
  - Keyboard event priority conflicts requiring more granular levels
  - CSS calc() expressions not working as expected in older browsers
  - Documentation verbosity vs. clarity tradeoff in ADR-003
- **Recommended Starting Point**: Create TraceContext first (1.1), migrate AlgorithmSwitcher only, verify working, then proceed to full migration. This validates the pattern before full commit.

## Quality Checklist

Before delivering each phase, verify:

- [ ] Manual test suite passes (all 14 QA Integration tests)
- [ ] React DevTools Profiler shows no performance regression
- [ ] No `console.error` or `console.warn` in browser console
- [ ] All keyboard shortcuts work (test matrix in INV-3)
- [ ] Git commit message references investigation numbers (e.g., "Phase 1: INV-1, INV-4")
- [ ] Can resume work after 1-day break using this plan
- [ ] **Phase 4 only**: All code changes referenced in ADR-003 with commit SHAs

---

**Remember**: This refactor transforms the frontend from **centralized fragility** to **distributed resilience**. Each phase produces working software. Phase 4 ensures the architectural knowledge is preserved for future maintainers—without it, the "why" behind these changes could be lost, leading to regression in future development.
