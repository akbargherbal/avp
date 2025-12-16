# Executive Summary: Frontend Refactor Strategy

## Overall Assessment

The frontend investigation reveals **a classic case of premature architecture scaling without proper foundation**. While the registry-based backend is exemplary, the frontend suffers from a monolithic App.jsx that violates fundamental React principles, creating cascading technical debt across the entire component tree.

---

## Core Theme: **Centralized Fragility**

All 7 investigations trace back to a single root cause: **App.jsx acts as a God Object** that controls too much, distributes too much, and knows too much. This creates a brittle foundation where:

1. **Data flows through a single chokepoint** (INV-1, INV-4)
2. **Performance optimizations are defeated by design** (INV-2, INV-6)
3. **Event handling has competing priorities** (INV-3)
4. **Error isolation is incomplete** (INV-7)
5. **Visual components have hardcoded assumptions** (INV-5)

---

## Priority Matrix

### 🔴 **Sprint 1: Foundation Rebuild** (All 7 issues)

The investigations form **3 tightly coupled clusters** that must be addressed together:

#### **Cluster A: Data Architecture** (Highest ROI)

- **INV-1**: Single Responsibility Violation (3-5 days)
- **INV-4**: Prop Drilling/Data Coupling (3-5 days)
- **INV-2**: Re-render Performance (1-2 days)

**Combined Effort**: 5-8 days  
**Rationale**: These are interdependent. Fixing App.jsx's responsibilities requires redesigning data flow, which naturally addresses memoization.

#### **Cluster B: User Interaction** (Medium ROI)

- **INV-3**: Keyboard Shortcut Conflicts (2-3 days)
- **INV-7**: Error Boundary Coverage (4-8 hours)

**Combined Effort**: 3-4 days  
**Rationale**: Both relate to how the app handles unexpected user actions (keypresses, errors). A centralized approach solves both.

#### **Cluster C: Visual Stability** (Low ROI, but quick win)

- **INV-5**: CSS Positioning Fragility (8-16 hours)
- **INV-6**: Render Optimization (4-8 hours)

**Combined Effort**: 2 days  
**Rationale**: Isolated refactors with clear scope. Can be done in parallel with Cluster A/B.

---

## Recommended Refactor Strategy

### **Phase 1: Data Layer (Week 1)**

**Goal**: Break App.jsx's data monopoly

```javascript
// BEFORE: App.jsx owns everything
function App() {
  const { trace, loading } = useTraceLoader();
  const { currentStep, nextStep } = useTraceNavigation(trace);
  const { predictions } = usePredictionMode(trace);

  return <Child trace={trace} step={currentStep} predictions={predictions} />;
}

// AFTER: Context-based data access
function App() {
  return (
    <TraceProvider>
      <NavigationProvider>
        <PredictionProvider>
          <AppLayout />
        </PredictionProvider>
      </NavigationProvider>
    </TraceProvider>
  );
}

// Children consume directly
function Child() {
  const { trace } = useTrace();
  const { currentStep } = useNavigation();
  // No props needed!
}
```

**Solves**: INV-1, INV-4 (80% resolved), INV-2 (50% resolved)

---

### **Phase 2: Event Management (Week 2)**

**Goal**: Centralize all keyboard/modal interactions

```javascript
// New: KeyboardManager context
<KeyboardProvider>
  <App />
</KeyboardProvider>;

// Components register handlers with priority
function PredictionModal() {
  useKeyboardHandler("Escape", closeModal, { priority: 10 });
  useKeyboardHandler("Enter", submitAnswer, { priority: 10 });
}

function AlgorithmSwitcher() {
  useKeyboardHandler("Escape", closeDropdown, { priority: 5 });
}
```

**Solves**: INV-3 (100%), improves INV-2 (stable callbacks)

---

### **Phase 3: Resilience & Polish (Week 2)**

**Goal**: Error containment + visual stability

```javascript
// Granular error boundaries
<ErrorBoundary fallback={<ModalError />}>
  <PredictionModal />
</ErrorBoundary>;

// Extract TimelineView constants
const TIMELINE_CONFIG = {
  minVal: 0,
  maxVal: 1440,
  toPercent: (val) => (val / 1440) * 100,
};
```

**Solves**: INV-7 (100%), INV-5 (100%), INV-6 (100%)

---

## Impact Analysis

### **Before Refactor** (Current State)

```
App.jsx: 340 lines, 10 responsibilities
├─ Modifying trace data: 6-8 files affected
├─ Adding new modal: 4-5 files affected
├─ Keyboard shortcut bug: 3 components fighting
└─ Component error: Full app crash
```

### **After Refactor** (Target State)

```
App.jsx: ~80 lines, 1 responsibility (layout orchestration)
├─ Modifying trace data: 1 Context file
├─ Adding new modal: 1 file (the modal itself)
├─ Keyboard shortcut bug: Centralized handler
└─ Component error: Isolated to boundary
```

---

## Risk Assessment

| Risk                            | Mitigation                                                |
| ------------------------------- | --------------------------------------------------------- |
| **Breaking changes across app** | Incremental migration: Contexts first, then consumers     |
| **Testing burden**              | Existing hooks already tested; contexts are thin wrappers |
| **Temporary code duplication**  | Accept for 1-2 sprints during migration                   |
| **User-facing regressions**     | Feature freeze during refactor; comprehensive E2E testing |

---

## Success Metrics

1. **App.jsx LOC**: 340 → <100 lines
2. **Prop passing depth**: Eliminate "through-passing" props entirely
3. **Re-render counts**: 50% reduction in unnecessary renders (React DevTools Profiler)
4. **Keyboard conflicts**: Zero simultaneous actions for single keypress
5. **Error recovery**: Modal errors don't crash app

---

## Recommendation

**Execute all investigations in Sprint 1 as a single coordinated refactor** rather than piecemeal fixes. The investigations are too interdependent to address separately without creating intermediate unstable states.

**Timeline**: 2-3 weeks for complete refactor  
**Team Size**: 1-2 developers (avoid coordination overhead)  
**User Impact**: Zero (if done correctly with comprehensive testing)

---

## Bottom Line

The frontend needs **architectural debt repayment**, not feature work. The current structure would collapse under the weight of adding 3-5 more algorithms. This refactor transforms the frontend from a **brittle monolith** into a **modular, context-driven architecture** that matches the elegance of the backend's registry pattern.

**The main theme**: **Decentralize App.jsx's monopoly through Context API, then layer resilience on top.**
