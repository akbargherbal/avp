# Frontend Test Plan - Next 6-8 Sessions

**Project:** Algorithm Visualization Platform  
**Target Coverage:** ≥85%  
**Estimated Time:** 30-40 hours (6-8 sessions)

---

PS:
**IMPORTANT NOTES**:
Since I cannot share the entire codebase all at once, I rely on you to explicitly ask for the specific files you need to make an informed decision; do not make guesses or assumptions.

Provide `cat` commands that I can copy and paste into my terminal to share file contents with you. For example:
`cat absolute/path/to/file`

For large JSON files, use `jq` with appropriate flags to specify the data you want me to provide.

Use `pnpm` instead of `npm`, unless there is a specific need to use `npm`.

---

## Plan Overview

This plan implements the **Frontend Testing Strategy** in 6 phases across 6-8 sessions. Each phase builds on the previous, starting with LOCKED requirements (architectural contracts) and ending with comprehensive coverage.

**Key Principles:**

1. **LOCKED requirements first** - Break builds if violated
2. **Test behavior, not implementation** - Focus on user-facing outcomes
3. **Complement, don't duplicate backend** - Test consumption, not generation
4. **Maintain existing quality** - 103 hook tests are already excellent

---

## Session Overview

### Session 1: Infrastructure + LOCKED Requirements (Part 1)

**Goal:** Set up testing infrastructure and test critical modal IDs  
**Duration:** ~5 hours  
**Priority:** CRITICAL (Blocking gate)

**Tasks:**

1. **Infrastructure Setup** (1 hour)

   ```bash
   # Install additional dependencies
   cd frontend
   pnpm add -D msw@^2.0.0 jest-axe@^8.0.0

   # Create directory structure
   mkdir -p src/__tests__/{compliance,integration,fixtures}
   mkdir -p src/mocks
   ```

2. **Mock Service Worker Setup** (1 hour)

   - Create `src/mocks/handlers.js` - API mock handlers
   - Create `src/mocks/server.js` - Test server setup
   - Create `src/mocks/browser.js` - Browser server (for manual testing)
   - Update `src/setupTests.js` - Integrate MSW

3. **Test Fixtures** (1 hour)

   - Create `src/__tests__/fixtures/traces.js` - Mock trace data
   - Create `src/__tests__/fixtures/predictions.js` - Mock prediction data
   - Create `src/__tests__/fixtures/algorithms.js` - Mock algorithm list

4. **LOCKED: Modal IDs Tests** (2 hours)
   - Create `src/__tests__/compliance/locked-modal-ids.test.jsx`
   - Test PredictionModal has `#prediction-modal`
   - Test CompletionModal has `#completion-modal` (WILL FAIL - bug!)
   - **Fix CompletionModal bug** - Add missing ID
   - Verify tests pass

**Success Criteria:**

- [ ] MSW configured and working
- [ ] Test fixtures created
- [ ] Modal ID tests passing
- [ ] CompletionModal bug fixed
- [ ] CI/CD script created (`scripts/check-compliance.sh`)

**Files to Create:**

```
frontend/
├── src/
│   ├── mocks/
│   │   ├── handlers.js          # NEW
│   │   ├── server.js            # NEW
│   │   └── browser.js           # NEW
│   ├── __tests__/
│   │   ├── compliance/
│   │   │   └── locked-modal-ids.test.jsx       # NEW - CRITICAL
│   │   └── fixtures/
│   │       ├── traces.js        # NEW
│   │       ├── predictions.js   # NEW
│   │       └── algorithms.js    # NEW
│   └── setupTests.js            # UPDATE
├── scripts/
│   └── check-compliance.sh      # NEW
└── package.json                 # UPDATE (add test scripts)
```

---

### Session 2: LOCKED Requirements (Part 2) + Critical Modal Tests

**Goal:** Complete LOCKED requirement coverage and test prediction modal  
**Duration:** ~5 hours  
**Priority:** CRITICAL

**Tasks:**

1. **LOCKED: Keyboard Shortcuts** (2 hours)

   - Create `src/__tests__/compliance/locked-keyboard-shortcuts.test.jsx`
   - Test navigation shortcuts (→/← arrows, Space, Home, End, R)
   - Test prediction shortcuts (K, C, S, Enter)
   - Test completion shortcuts (Escape)
   - Test modal blocking behavior
   - Integration with App.jsx (not just hook tests)

2. **LOCKED: Overflow Pattern** (1.5 hours)

   - Create `src/__tests__/compliance/locked-overflow-pattern.test.jsx`
   - Test visualization panel uses `items-start` + `mx-auto`
   - Test anti-pattern detection (no `items-center` on overflow container)
   - Add data-testid to panels for easier testing

3. **Component: PredictionModal** (1.5 hours)
   - Create `src/components/PredictionModal.test.jsx`
   - Test modal structure (ID, question, hint, choices)
   - Test interaction (selection, submission, feedback)
   - Test semantic colors (emerald/orange/blue/red)
   - Test keyboard shortcuts integration
   - Test auto-advance behavior (2.5s timeout)

**Success Criteria:**

- [ ] 100% LOCKED requirement coverage
- [ ] All compliance tests passing
- [ ] PredictionModal fully tested
- [ ] CI/CD compliance gate working

**Files to Create:**

```
frontend/src/
├── __tests__/compliance/
│   ├── locked-keyboard-shortcuts.test.jsx     # NEW - CRITICAL
│   └── locked-overflow-pattern.test.jsx       # NEW - CRITICAL
└── components/
    └── PredictionModal.test.jsx               # NEW - CRITICAL
```

---

### Session 3: Modal Components + Registry Integration

**Goal:** Complete modal testing and test dynamic component selection  
**Duration:** ~5 hours  
**Priority:** HIGH

**Tasks:**

1. **Component: CompletionModal** (2 hours)

   - Create `src/components/CompletionModal.test.jsx`
   - Test modal structure (ID verified in Session 1)
   - Test visibility logic (only on last step)
   - Test outcome-driven theming (found/not found/complete)
   - Test algorithm-specific stats:
     - Binary Search: comparisons, result, array size
     - Interval Coverage: kept, removed, final intervals
   - Test prediction accuracy display
   - Test animations (fade-in, scale-up)
   - Test keyboard shortcuts (Escape)

2. **Integration: Visualization Registry** (1.5 hours)

   - Create `src/__tests__/integration/visualization-registry.test.jsx`
   - Test ArrayView selection for binary-search
   - Test TimelineView selection for interval-coverage
   - Test fallback behavior for unknown types
   - Test config passing from metadata
   - Add data-testid to visualization components

3. **Integration: State Registry** (1.5 hours)
   - Create `src/__tests__/integration/state-registry.test.jsx`
   - Test BinarySearchState selection
   - Test IntervalCoverageState selection
   - Test fallback component for unknown algorithms
   - Test props passing (step, trace, activeCallRef, etc.)

**Success Criteria:**

- [ ] CompletionModal fully tested
- [ ] Registry integration verified
- [ ] Dynamic component selection working
- [ ] Coverage: Modals ~80%, Integration tests created

**Files to Create:**

```
frontend/src/
├── components/
│   └── CompletionModal.test.jsx              # NEW - CRITICAL
└── __tests__/integration/
    ├── visualization-registry.test.jsx       # NEW
    └── state-registry.test.jsx               # NEW
```

---

### Session 4: Algorithm Switching + Prediction Flow

**Goal:** Test core user workflows  
**Duration:** ~5 hours  
**Priority:** HIGH

**Tasks:**

1. **Integration: Algorithm Switching** (2 hours)

   - Create `src/__tests__/integration/algorithm-switching.test.jsx`
   - Test: Switch from interval-coverage to binary-search
     - Trace loads from backend
     - Visualization component changes (Timeline → Array)
     - State component changes (IntervalCoverage → BinarySearch)
     - Step counter resets to 0
     - Prediction stats reset
   - Test: Maintain prediction mode toggle across switch
   - Test: Handle algorithm with no examples gracefully

2. **Integration: Prediction Flow** (2 hours)

   - Create `src/__tests__/integration/prediction-flow.test.jsx`
   - Test: Navigation blocking during prediction modal
     - Click Next button → blocked
     - Press arrow key → blocked
     - Submit prediction → advances
   - Test: Accuracy tracking across multiple predictions
     - Answer first correctly (1/1 = 100%)
     - Answer second incorrectly (1/2 = 50%)
     - Answer third correctly (2/3 = 66%)
     - Verify completion modal shows correct percentage
   - Test: Prediction stats reset on Reset button
   - Test: Skip functionality

3. **Integration: Unified API** (1 hour)
   - Create `src/__tests__/integration/unified-api.test.jsx`
   - Test: Fetches `/api/algorithms` on mount
   - Test: Uses `/api/trace/unified` for registered algorithms
   - Test: Fallback to legacy `/api/trace` for interval-coverage
   - Test: Error handling (network error, 404, 500)

**Success Criteria:**

- [ ] Algorithm switching fully tested
- [ ] Prediction flow validated end-to-end
- [ ] API integration verified
- [ ] All integration tests passing

**Files to Create:**

```
frontend/src/__tests__/integration/
├── algorithm-switching.test.jsx              # NEW - CRITICAL
├── prediction-flow.test.jsx                  # NEW - CRITICAL
└── unified-api.test.jsx                      # NEW
```

---

### Session 5: Component Coverage (Part 1)

**Goal:** Test navigation and control components  
**Duration:** ~5 hours  
**Priority:** HIGH

**Tasks:**

1. **Component: AlgorithmSwitcher** (1.5 hours)

   - Create `src/components/AlgorithmSwitcher.test.jsx`
   - Test: Displays current algorithm name
   - Test: Opens/closes dropdown
   - Test: Lists all available algorithms
   - Test: Highlights current algorithm
   - Test: Calls onAlgorithmSwitch callback
   - Test: Click-outside behavior
   - Test: Escape key closes dropdown
   - Test: Disabled during loading

2. **Component: ControlBar** (1 hour)

   - Create `src/components/ControlBar.test.jsx`
   - Test: Prev button disabled at step 0
   - Test: Next button disabled at last step
   - Test: Step progress display (X of Y)
   - Test: Navigation callbacks (onPrev, onNext, onReset)
   - Test: Button states during navigation

3. **Component: KeyboardHints** (1 hour)

   - Create `src/components/KeyboardHints.test.jsx`
   - Test: Displays shortcut guide
   - Test: Navigation shortcuts listed
   - Test: Prediction shortcuts listed
   - Test: Reset shortcuts listed
   - Test: Visual styling/accessibility

4. **Component: ErrorBoundary** (1.5 hours)
   - Create `src/components/ErrorBoundary.test.jsx`
   - Test: Catches rendering errors
   - Test: Displays error message
   - Test: Logs to console
   - Test: Allows app to continue functioning
   - Test: Reset mechanism (if implemented)

**Success Criteria:**

- [ ] 4 navigation components fully tested
- [ ] All callbacks verified
- [ ] Error handling validated
- [ ] Coverage: Components ~40%

**Files to Create:**

```
frontend/src/components/
├── AlgorithmSwitcher.test.jsx               # NEW
├── ControlBar.test.jsx                      # NEW
├── KeyboardHints.test.jsx                   # NEW
└── ErrorBoundary.test.jsx                   # NEW
```

---

### Session 6: Component Coverage (Part 2) - Visualizations

**Goal:** Test visualization and state components  
**Duration:** ~5 hours  
**Priority:** HIGH

**Tasks:**

1. **Component: ArrayView** (2 hours)

   - Create `src/components/visualizations/ArrayView.test.jsx`
   - Test: Renders array elements from visualization data
   - Test: Element highlighting by state:
     - `active_range` (blue)
     - `compared` (yellow)
     - `found` (green)
     - `not_in_range` (gray)
   - Test: Pointer rendering (left, right, mid, target)
   - Test: Empty array handling
   - Test: Overflow pattern compliance (`items-start` + `mx-auto`)
   - Test: Large arrays (20+ elements)
   - Add data-testid="array-view"

2. **Component: TimelineView** (2 hours)

   - Create `src/components/visualizations/TimelineView.test.jsx`
   - Test: Renders intervals from visualization data
   - Test: Interval highlighting (hovered vs active)
   - Test: Interval states:
     - `kept` (emerald)
     - `covered` (red/faded)
     - `examining` (blue pulse)
   - Test: onIntervalHover callback
   - Test: Empty intervals handling
   - Test: Overflow pattern compliance
   - Add data-testid="timeline-view"

3. **Component: IntervalCoverageState** (1 hour)
   - Create `src/components/algorithm-states/IntervalCoverageState.test.jsx`
   - Test: Renders call stack
   - Test: Active call highlighting
   - Test: Auto-scroll to active call
   - Test: Empty call stack handling
   - Test: Interval formatting (start, end)
   - Test: onIntervalHover integration

**Success Criteria:**

- [ ] All visualization components tested
- [ ] IntervalCoverageState tested (BinarySearchState already has 8 tests)
- [ ] data-testid added to components
- [ ] Coverage: Components ~65%

**Files to Create:**

```
frontend/src/components/
├── visualizations/
│   ├── ArrayView.test.jsx                   # NEW - CRITICAL
│   └── TimelineView.test.jsx                # NEW - CRITICAL
└── algorithm-states/
    └── IntervalCoverageState.test.jsx       # NEW
```

---

### Session 7: Utilities + Hook Updates

**Goal:** Test utilities and update obsolete hook tests  
**Duration:** ~4 hours  
**Priority:** MEDIUM

**Tasks:**

1. **Utility: predictionUtils** (1 hour)

   - Create `src/utils/predictionUtils.test.js`
   - Test `getAccuracyFeedback()`:
     - 90-100% → "Excellent work!" (emerald)
     - 70-89% → "Great job!" (emerald)
     - 50-69% → "Good start!" (amber)
     - <50% → "Keep practicing!" (red)
   - Test `formatPredictionStats()`:
     - Accuracy calculation
     - Zero total handling
     - Stats merging

2. **Utility: stepBadges** (1 hour)

   - Create `src/utils/stepBadges.test.js`
   - Test all 7 badge types:
     - INITIAL_STATE → blue "Start"
     - DECISION → purple "Decision"
     - COVERAGE → emerald "Coverage"
     - EXAMINING_INTERVAL → amber "Examining"
     - CALCULATE_MID → blue "Calculating"
     - COMPARE → yellow "Comparing"
     - ALGORITHM_COMPLETE → green "Complete"
   - Test default fallback

3. **Utility: visualizationRegistry** (30 min)

   - Create `src/utils/visualizationRegistry.test.js`
   - Test `getVisualizationComponent()` (complement existing unit test)
   - Test `getRegisteredTypes()`
   - Test `isVisualizationTypeRegistered()`

4. **Update: usePredictionMode tests** (1.5 hours)
   - Update `src/hooks/__tests__/usePredictionMode.test.js`
   - **BREAKING CHANGE:** Hook now returns `activePrediction` object
   - Update test: `handlePredictionAnswer(userAnswer)` instead of `handlePredictionAnswer(isCorrect)`
   - Add test: `activePrediction` structure validation
   - Keep existing tests for backward compatibility where possible

**Success Criteria:**

- [ ] All utilities tested
- [ ] usePredictionMode tests updated for Phase 4 API
- [ ] No test regressions
- [ ] Coverage: Utilities ~90%

**Files to Create/Update:**

```
frontend/src/
├── utils/
│   ├── predictionUtils.test.js              # NEW
│   ├── stepBadges.test.js                   # NEW
│   └── visualizationRegistry.test.js        # NEW
└── hooks/__tests__/
    └── usePredictionMode.test.js            # UPDATE
```

---

### Session 8: Legacy Cleanup + Final Coverage Push

**Goal:** Archive obsolete tests, achieve 85% coverage, document gaps  
**Duration:** ~5 hours  
**Priority:** MEDIUM

**Tasks:**

1. **Legacy Test Audit** (1 hour)

   - Review all existing test files
   - Categorize:
     - ✅ Keep (still valid)
     - 🔄 Update (needs refactoring)
     - ❌ Archive (obsolete, POC-era)
   - Create `tests/archive/poc-era/` directory
   - Move obsolete tests (don't delete - historical reference)
   - Update `.gitignore` or `package.json` to exclude archived tests

2. **Coverage Analysis** (1 hour)

   ```bash
   # Generate coverage report
   pnpm test:coverage

   # Open HTML report
   open coverage/index.html

   # Identify gaps (target: ≥85%)
   # Focus on uncovered branches and critical paths
   ```

3. **Fill Coverage Gaps** (2 hours)

   - Write tests for uncovered components/functions
   - Focus on critical paths first:
     - App.jsx error states
     - Edge cases in registries
     - Keyboard shortcut edge cases
   - Aim for 85%+ overall coverage

4. **Documentation** (1 hour)

   - Update `frontend/README.md` with testing section
   - Document test structure and conventions
   - Create "How to Test New Features" guide
   - Document known limitations
   - Add coverage badge to README

5. **CI/CD Integration** (Optional)
   - Create `.github/workflows/frontend-tests.yml`
   - Configure Codecov integration
   - Set up coverage thresholds (85%)
   - Configure compliance gate (LOCKED tests must pass)

**Success Criteria:**

- [ ] Zero obsolete tests in main test suite
- [ ] Overall coverage ≥85%
- [ ] LOCKED requirement coverage = 100%
- [ ] Component coverage ≥80%
- [ ] Integration coverage ≥75%
- [ ] Documentation complete
- [ ] CI/CD pipeline working (if implemented)

**Files to Create/Update:**

```
frontend/
├── tests/archive/poc-era/              # NEW - Archive directory
├── README.md                           # UPDATE - Testing section
├── TESTING.md                          # NEW - Testing guide
└── .github/workflows/
    └── frontend-tests.yml              # NEW (optional)
```

---

## Session-by-Session Checklist

### Before Each Session

```bash
# Navigate to frontend directory
cd frontend

# Pull latest changes
git pull origin main

# Install dependencies (if package.json changed)
pnpm install

# Verify existing tests pass
pnpm test --watchAll=false
```

### During Each Session

```bash
# Run tests in watch mode
pnpm test

# Run specific test file
pnpm test PredictionModal.test

# Run tests matching pattern
pnpm test --testNamePattern="LOCKED"

# Check coverage for specific file
pnpm test --coverage --collectCoverageFrom="src/components/PredictionModal.jsx"

# Run compliance tests only
pnpm test:compliance
```

### After Each Session

```bash
# Run full coverage
pnpm test:coverage

# Review HTML report
open coverage/index.html

# Check compliance gate
./scripts/check-compliance.sh

# Commit progress
git add .
git commit -m "test(frontend): session X - [component] tests (coverage: Y%)"
git push origin main
```

---

## Files to Request Per Session

### Session 1 (Infrastructure + Modal IDs)

```bash
# Already have these from strategy session
cat frontend/src/components/PredictionModal.jsx
cat frontend/src/components/CompletionModal.jsx
cat frontend/src/setupTests.js
cat frontend/package.json
```

### Session 2 (Keyboard + Overflow + PredictionModal)

```bash
# Verify keyboard shortcuts implementation
cat frontend/src/hooks/useKeyboardShortcuts.js
cat frontend/src/App.jsx  # Check panel structure for overflow tests
```

### Session 3 (CompletionModal + Registry Integration)

```bash
# Registry implementations
cat frontend/src/utils/visualizationRegistry.js
cat frontend/src/utils/stateRegistry.js
```

### Session 4 (Algorithm Switching + Prediction Flow)

```bash
# Already have these
cat frontend/src/hooks/useTraceLoader.js
cat frontend/src/hooks/usePredictionMode.js
```

### Session 5 (Component Coverage Part 1)

```bash
cat frontend/src/components/AlgorithmSwitcher.jsx
cat frontend/src/components/ControlBar.jsx
cat frontend/src/components/KeyboardHints.jsx
cat frontend/src/components/ErrorBoundary.jsx
```

### Session 6 (Component Coverage Part 2)

```bash
cat frontend/src/components/visualizations/ArrayView.jsx
cat frontend/src/components/visualizations/TimelineView.jsx
cat frontend/src/components/algorithm-states/IntervalCoverageState.jsx
```

### Session 7 (Utilities + Hook Updates)

```bash
cat frontend/src/utils/predictionUtils.js
cat frontend/src/utils/stepBadges.js
cat frontend/src/hooks/__tests__/usePredictionMode.test.js  # For updating
```

### Session 8 (Legacy Cleanup + Coverage)

```bash
# Generate list of all test files
find frontend/src -name "*.test.js" -o -name "*.test.jsx"

# Review coverage report
cat frontend/coverage/coverage-summary.json
```

---

## Quick Reference: Test Commands

### Standard Test Commands

```bash
# Run all tests
pnpm test --watchAll=false

# Run tests in watch mode (interactive)
pnpm test

# Run with coverage
pnpm test:coverage

# Run compliance tests only
pnpm test:compliance

# Run integration tests only
pnpm test:integration

# Run tests in CI mode
CI=true pnpm test:coverage
```

### Debugging Tests

```bash
# Run single test file
pnpm test PredictionModal.test.jsx --watchAll=false

# Run tests matching name
pnpm test --testNamePattern="modal ID" --watchAll=false

# Show which tests would run
pnpm test --listTests

# Debug specific test with verbose output
pnpm test PredictionModal.test.jsx --verbose --no-coverage

# Update snapshots (if using snapshot tests)
pnpm test -u
```

### Coverage Analysis

```bash
# Coverage for specific file
pnpm test --coverage --collectCoverageFrom="src/components/PredictionModal.jsx" --watchAll=false

# Coverage report in terminal
pnpm test:coverage

# Open HTML coverage report
open coverage/index.html

# Coverage summary as JSON
cat coverage/coverage-summary.json | jq
```

---

## Coverage Targets Summary

| Component Category   | Target   | Current  | Priority     | Sessions |
| -------------------- | -------- | -------- | ------------ | -------- |
| LOCKED Requirements  | 100%     | 0%       | CRITICAL     | 1-2      |
| Modals (2 files)     | 90%      | 0%       | CRITICAL     | 2-3      |
| Registry Integration | 90%      | 0%       | HIGH         | 3-4      |
| Hooks (5 files)      | 95%      | ~95%     | MAINTAIN     | 7        |
| Components (8 files) | 80%      | ~10%     | HIGH         | 5-6      |
| Utilities (4 files)  | 90%      | ~60%     | MEDIUM       | 7        |
| Integration Tests    | 75%      | 0%       | HIGH         | 3-4      |
| **OVERALL**          | **≥85%** | **~50%** | **CRITICAL** | **8**    |

---

## Test Organization Reference

```
frontend/
├── src/
│   ├── components/
│   │   ├── AlgorithmSwitcher.jsx
│   │   ├── AlgorithmSwitcher.test.jsx          ← Session 5
│   │   ├── CompletionModal.jsx
│   │   ├── CompletionModal.test.jsx            ← Session 3 (CRITICAL)
│   │   ├── ControlBar.jsx
│   │   ├── ControlBar.test.jsx                 ← Session 5
│   │   ├── ErrorBoundary.jsx
│   │   ├── ErrorBoundary.test.jsx              ← Session 5
│   │   ├── KeyboardHints.jsx
│   │   ├── KeyboardHints.test.jsx              ← Session 5
│   │   ├── PredictionModal.jsx
│   │   ├── PredictionModal.test.jsx            ← Session 2 (CRITICAL)
│   │   ├── algorithm-states/
│   │   │   ├── BinarySearchState.jsx
│   │   │   ├── BinarySearchState.test.jsx      ✓ EXISTS (8 tests)
│   │   │   ├── IntervalCoverageState.jsx
│   │   │   └── IntervalCoverageState.test.jsx  ← Session 6
│   │   └── visualizations/
│   │       ├── ArrayView.jsx
│   │       ├── ArrayView.test.jsx              ← Session 6 (CRITICAL)
│   │       ├── TimelineView.jsx
│   │       └── TimelineView.test.jsx           ← Session 6 (CRITICAL)
│   ├── hooks/
│   │   └── __tests__/
│   │       ├── useKeyboardShortcuts.test.js    ✓ EXISTS
│   │       ├── usePredictionMode.test.js       ✓ EXISTS (UPDATE Session 7)
│   │       ├── useTraceLoader.test.js          ✓ EXISTS
│   │       ├── useTraceNavigation.test.js      ✓ EXISTS
│   │       └── useVisualHighlight.test.js      ✓ EXISTS
│   ├── utils/
│   │   ├── predictionUtils.js
│   │   ├── predictionUtils.test.js             ← Session 7
│   │   ├── stateRegistry.js
│   │   ├── stateRegistry.test.js               ✓ EXISTS
│   │   ├── stepBadges.js
│   │   ├── stepBadges.test.js                  ← Session 7
│   │   ├── visualizationRegistry.js
│   │   └── visualizationRegistry.test.js       ← Session 7
│   ├── __tests__/
│   │   ├── compliance/                         ← Sessions 1-2 (CRITICAL)
│   │   │   ├── locked-modal-ids.test.jsx
│   │   │   ├── locked-keyboard-shortcuts.test.jsx
│   │   │   └── locked-overflow-pattern.test.jsx
│   │   ├── integration/                        ← Sessions 3-4 (HIGH)
│   │   │   ├── algorithm-switching.test.jsx
│   │   │   ├── prediction-flow.test.jsx
│   │   │   ├── state-registry.test.jsx
│   │   │   ├── unified-api.test.jsx
│   │   │   └── visualization-registry.test.jsx
│   │   └── fixtures/                           ← Session 1
│   │       ├── algorithms.js
│   │       ├── predictions.js
│   │       └── traces.js
│   ├── mocks/                                  ← Session 1
│   │   ├── handlers.js
│   │   ├── server.js
│   │   └── browser.js
│   ├── setupTests.js                           ← UPDATE Session 1
│   └── App.jsx
├── scripts/
│   └── check-compliance.sh                     ← Session 1 (CI/CD gate)
├── tests/
│   └── archive/
│       └── poc-era/                            ← Session 8 (Legacy archive)
├── coverage/                                   ← Generated by tests
├── package.json                                ← UPDATE Session 1
├── README.md                                   ← UPDATE Session 8
└── TESTING.md                                  ← NEW Session 8
```

---

## Definition of Done

**After Session 8, you should have:**

✅ **100% LOCKED requirement coverage** (architectural contracts validated)  
✅ **≥85% overall coverage** (verified via `pnpm test:coverage`)  
✅ **All critical components tested** (modals, visualizations, state components)  
✅ **Registry behavior validated** (dynamic component selection working)  
✅ **User workflows tested** (algorithm switching, prediction flow)  
✅ **Zero obsolete tests** in main suite (archived, not deleted)  
✅ **CI/CD compliance gate** working (LOCKED tests block merge)  
✅ **Comprehensive documentation** (testing guide, conventions)  
✅ **HTML coverage report** showing gaps and progress

**Deliverables:**

- 30+ new test files across compliance/integration/component categories
- Updated hook tests (usePredictionMode for Phase 4 API)
- Test fixtures and MSW mocks for API testing
- Compliance check script for CI/CD
- Testing documentation and conventions
- Coverage report (≥85%)
- Archived POC-era tests

---

## Common Issues & Solutions

### Issue: MSW not intercepting fetch requests

**Symptom:** Tests make real network calls instead of using mocks  
**Solution:**

```javascript
// Ensure MSW server is set up in setupTests.js
import { server } from "./mocks/server";

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

### Issue: Modal tests fail - "element not in document"

**Symptom:** Modal components don't render in tests  
**Solution:** Check modal visibility conditions

```javascript
// CompletionModal only renders on last step
const mockStep = {
  type: "ALGORITHM_COMPLETE",
  step: mockTrace.trace.steps.length - 1, // Must be last step!
  data: {},
};
```

### Issue: Keyboard shortcut tests don't work

**Symptom:** Key presses don't trigger expected actions  
**Solution:** Use proper keyboard event simulation

```javascript
import userEvent from "@testing-library/user-event";

// DON'T: fireEvent.keyDown({ key: 'ArrowRight' })
// DO:
await userEvent.keyboard("{ArrowRight}");
```

### Issue: Registry tests fail - component not found

**Symptom:** `getStateComponent()` returns fallback instead of actual component  
**Solution:** Mock the registry imports properly

```javascript
// Mock must happen before imports
jest.mock("../utils/stateRegistry", () => ({
  getStateComponent: jest.fn(),
  isStateComponentRegistered: jest.fn(),
}));
```

### Issue: Coverage doesn't update after adding tests

**Symptom:** Coverage percentage stays the same  
**Solution:** Clear Jest cache

```bash
pnpm test --clearCache
pnpm test:coverage
```

### Issue: Tests are slow (>30 seconds)

**Symptom:** Test suite takes too long to run  
**Solution:**

1. Use `--maxWorkers=4` to parallelize
2. Mock heavy operations (API calls, animations)
3. Use `jest.useFakeTimers()` for timeout tests

```javascript
// Speed up 2.5s auto-advance test
jest.useFakeTimers();
// ... test code ...
jest.advanceTimersByTime(2500);
jest.useRealTimers();
```

### Issue: Overflow pattern test fails intermittently

**Symptom:** `items-start` class sometimes not found  
**Solution:** Wait for component to fully render

```javascript
await waitFor(() => {
  const panel = screen.getByTestId("panel-visualization");
  expect(panel).toHaveClass("items-start");
});
```

---

## Critical Path Testing Priority

If time is limited, test these paths first (in order):

### Priority 1: LOCKED Requirements (Session 1-2)

**Must have 100% coverage - these break builds**

1. Modal IDs (`#prediction-modal`, `#completion-modal`)
2. Keyboard shortcuts (all 7+ shortcuts working)
3. Overflow pattern (visual regression prevention)

### Priority 2: Critical Modals (Session 2-3)

**User-facing features - high impact**

1. PredictionModal (two-step confirmation, feedback)
2. CompletionModal (outcome themes, stats display)

### Priority 3: Registry Integration (Session 3-4)

**Core architecture - must work for algorithm expansion**

1. Visualization registry (ArrayView vs TimelineView selection)
2. State registry (BinarySearchState vs IntervalCoverageState selection)
3. Algorithm switching (trace loading, component swapping)

### Priority 4: User Workflows (Session 4)

**End-to-end paths - integration confidence**

1. Prediction flow (modal → answer → feedback → advance)
2. Algorithm switching (select → load → display)

### Priority 5: Component Coverage (Session 5-6)

**UI completeness - fills gaps**

1. Visualization components (ArrayView, TimelineView)
2. Navigation components (AlgorithmSwitcher, ControlBar)

### Priority 6: Utilities + Cleanup (Session 7-8)

**Polish and maintainability**

1. Utility functions (predictionUtils, stepBadges)
2. Hook updates (usePredictionMode Phase 4 API)
3. Legacy test cleanup

---

## Test Markers & Organization

Use Jest's `describe.skip()` or custom markers to organize tests:

```javascript
// Skip slow tests in watch mode
describe.skip("Performance Tests", () => {
  it("handles 1000 array elements", () => {
    // This test takes 5 seconds
  });
});

// Group related tests
describe("PredictionModal", () => {
  describe("LOCKED: Modal ID", () => {
    // Critical architectural contract
  });

  describe("User Interaction", () => {
    // Behavior tests
  });

  describe("Edge Cases", () => {
    // Error handling
  });
});
```

---

## Coverage Report Interpretation

### Good Coverage Example

```
File                    | % Stmts | % Branch | % Funcs | % Lines |
------------------------|---------|----------|---------|---------|
PredictionModal.jsx     |   92.5  |   88.2   |  100.0  |   92.5  |
CompletionModal.jsx     |   89.7  |   85.0   |   95.0  |   89.7  |
```

✅ High statement coverage  
✅ Good branch coverage (different code paths tested)  
✅ 100% function coverage (all functions called)

### Warning Signs

```
File                    | % Stmts | % Branch | % Funcs | % Lines |
------------------------|---------|----------|---------|---------|
SomeComponent.jsx       |   95.0  |   45.0   |  100.0  |   95.0  |
```

⚠️ Low branch coverage despite high statement coverage  
**Action:** Check for untested conditionals, error paths, edge cases

```
File                    | % Stmts | % Branch | % Funcs | % Lines |
------------------------|---------|----------|---------|---------|
UtilityFile.js          |   60.0  |   50.0   |   66.0  |   60.0  |
```

❌ Overall low coverage  
**Action:** Priority for new tests

### Using Coverage Report

```bash
# Generate and open HTML report
pnpm test:coverage
open coverage/index.html

# In HTML report:
# - Red lines = uncovered
# - Yellow lines = partially covered (some branches)
# - Green lines = fully covered

# Focus on:
# 1. Red lines in critical paths
# 2. Yellow lines (branch coverage gaps)
# 3. Functions never called (0 hits)
```

---

## Compliance Gate Script

```bash
#!/bin/bash
# scripts/check-compliance.sh

set -e  # Exit on any error

echo "🔍 Running Frontend Compliance Checks..."
echo "========================================="

# 1. LOCKED Requirements (CRITICAL - Must pass)
echo ""
echo "1️⃣ Validating LOCKED requirements..."
pnpm test --testPathPattern=compliance/locked --watchAll=false --bail

if [ $? -ne 0 ]; then
  echo ""
  echo "❌ LOCKED REQUIREMENTS VIOLATED"
  echo "These are architectural contracts that cannot be broken."
  echo "Fix violations before proceeding."
  exit 1
fi

echo "✅ All LOCKED requirements passing"

# 2. Coverage Thresholds
echo ""
echo "2️⃣ Checking coverage thresholds..."
pnpm test:coverage --coverageThreshold='{
  "global": {
    "lines": 85,
    "functions": 88,
    "branches": 80,
    "statements": 85
  }
}' > /dev/null 2>&1

if [ $? -ne 0 ]; then
  echo "⚠️  Coverage below threshold (target: 85%)"
  echo "Run: pnpm test:coverage"
  echo "This is a WARNING, not a failure."
else
  echo "✅ Coverage meets thresholds"
fi

# 3. Integration Tests
echo ""
echo "3️⃣ Running integration tests..."
pnpm test --testPathPattern=integration --watchAll=false --bail

if [ $? -ne 0 ]; then
  echo "⚠️  Some integration tests failing"
  exit 1
fi

echo "✅ Integration tests passing"

# 4. Summary
echo ""
echo "========================================="
echo "✅ All compliance checks passed!"
echo ""
echo "Summary:"
echo "  ✓ LOCKED requirements: 100%"
echo "  ✓ Coverage: ≥85%"
echo "  ✓ Integration tests: PASSING"
echo ""
echo "Safe to merge! 🎉"
```

Make executable:

```bash
chmod +x scripts/check-compliance.sh
```

---

## Next Session Preparation

### Before Session 1, prepare:

1. Review this test plan
2. Ensure frontend is working (run `pnpm start`)
3. Run existing tests to establish baseline: `pnpm test --watchAll=false`
4. Have Backend Test Plan handy for reference
5. Review Frontend Compliance Checklist

### Session 1 will create:

- MSW infrastructure
- Test fixtures
- First LOCKED test (modal IDs)
- Fix for CompletionModal bug

**Estimated Start:** When you're ready to begin test implementation  
**First Task:** `pnpm add -D msw@^2.0.0 jest-axe@^8.0.0`

---

**END OF TEST PLAN**
