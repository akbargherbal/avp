# Algorithm Visualizer MVP Fixes: Implementation Plan

## Executive Summary

- **Current State**: Working POC with critical gaps in validation, structure, and error handling
- **Goal**: Transform POC into stable, shareable MVP through 5 critical fixes
- **Key Architectural Decision**: Remove pedagogically harmful autoplay feature while fixing structural issues—simplifies codebase and improves learning outcomes
- **Estimated Time**: 7-10 hours (can be completed in 1-2 focused sessions)

---

## Phase 1: Input Validation & Safety Limits (2-3 hours)

### Goal
**Prevent cryptic errors and DoS vulnerabilities by validating all inputs and enforcing trace size limits**

### Success Criteria
- ✅ Invalid intervals (start ≥ end, negative values) return clear 400 errors
- ✅ Submissions with >100 intervals rejected with helpful message
- ✅ Trace generation stops at 10,000 steps with clear error
- ✅ All validation errors tested manually with 5+ edge cases

### Tasks

**1.1: Add Pydantic validation models** (1-1.5 hours)
- Install pydantic: `pip install pydantic`
- Create `IntervalInput` model with validators
- **Key Decision**: Use Pydantic over manual validation for automatic error messages and type safety

```python
from pydantic import BaseModel, validator, ValidationError

class IntervalInput(BaseModel):
    id: int
    start: int
    end: int
    color: str = 'blue'
    
    @validator('id')
    def positive_id(cls, v):
        if v < 0:
            raise ValueError('id must be non-negative')
        return v
    
    @validator('end')
    def end_after_start(cls, v, values):
        if 'start' in values and v <= values['start']:
            raise ValueError(f'end ({v}) must be greater than start ({values["start"]})')
        return v
```

**1.2: Integrate validation in API endpoint** (30 min)
- Wrap interval parsing in try-except
- Return structured error responses
- Handle `ValidationError` with clear messages

```python
# In app.py
try:
    validated = [IntervalInput(**i) for i in data['intervals']]
    intervals = [Interval(**v.dict()) for v in validated]
except ValidationError as e:
    return jsonify({
        "error": "Invalid input data",
        "details": [{"field": err["loc"][0], "message": err["msg"]} 
                    for err in e.errors()]
    }), 400
```

**1.3: Add trace size limits** (30-45 min)
- Add constants to `IntervalCoverageTracer`
- Check limits in `remove_covered_intervals()` entry point
- Check step count in `_add_step()`

```python
class IntervalCoverageTracer:
    MAX_INTERVALS = 100
    MAX_STEPS = 10000
    
    def remove_covered_intervals(self, intervals):
        if len(intervals) > self.MAX_INTERVALS:
            raise ValueError(
                f"Too many intervals: {len(intervals)} "
                f"(maximum {self.MAX_INTERVALS})"
            )
        # ... rest of implementation
    
    def _add_step(self, step_type, data, description):
        if self.step_count >= self.MAX_STEPS:
            raise RuntimeError(
                f"Trace exceeded {self.MAX_STEPS} steps. "
                f"Possible infinite recursion or input too complex."
            )
        # ... rest of implementation
```

### Deliverables
- [ ] `IntervalInput` Pydantic model with 3 validators
- [ ] API returns 400 with detailed errors for invalid input
- [ ] `MAX_INTERVALS` and `MAX_STEPS` enforced with clear errors
- [ ] Manual testing completed with: start≥end, negative values, >100 intervals, edge case inputs

### Rollback Plan
**If** validation breaks existing valid inputs: Remove validators one at a time to identify issue, adjust validation logic to be more permissive while still catching critical errors

---

## Phase 2: Frontend Refactoring & Autoplay Removal (3-4 hours)

### Goal
**Make App.jsx maintainable by extracting components AND remove pedagogically harmful autoplay feature**

### Success Criteria
- ✅ App.jsx reduced from 570 lines to <150 lines
- ✅ All autoplay/timer code removed (~180 lines deleted)
- ✅ 3+ new component files with clear responsibilities
- ✅ Zero duplication in control logic
- ✅ App still functions identically (minus removed autoplay)
- ✅ Navigation uses only: Reset, Previous, Next buttons

### Tasks

**2.1: Extract CompletionModal component** (30 min)
- Create `frontend/src/components/CompletionModal.jsx`
- Move lines 133-217 from App.jsx
- Props: `isOpen`, `onClose`, `stats` (steps, time, efficiency)

```jsx
// CompletionModal.jsx
const CompletionModal = ({ isOpen, onClose, stats }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      {/* Modal content - implementation during session */}
    </div>
  );
};

export default CompletionModal;
```

**2.2: Extract and consolidate ControlBar** (1-1.5 hours)
- Create `frontend/src/components/ControlBar.jsx`
- Combine logic from lines 143-175 and 496-527
- **CRITICAL**: Remove all play/pause logic, timer state, speed controls
- Keep only: Reset, Previous, Next buttons

```jsx
const ControlBar = ({ 
  currentStep, 
  totalSteps, 
  onPrev, 
  onNext, 
  onReset,
  variant = 'default' // 'default' or 'sticky'
}) => {
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;
  
  return (
    <div className={`flex items-center gap-4 ${variant === 'sticky' ? 'justify-center' : ''}`}>
      <button onClick={onReset} disabled={isFirstStep}>
        Reset
      </button>
      <button onClick={onPrev} disabled={isFirstStep}>
        Previous
      </button>
      <span>Step {currentStep + 1} of {totalSteps}</span>
      <button onClick={onNext} disabled={isLastStep}>
        Next Step
      </button>
    </div>
  );
};
```

**2.3: Remove all autoplay infrastructure** (45 min)
- Delete `isPlaying` state variable
- Delete `useEffect` with interval timer (lines 130-140)
- Delete play/pause toggle functions
- Delete any speed control variables/UI
- Remove ~180 lines of unnecessary code
- **Educational rationale note**: Add comment explaining removal serves deliberate learning

```jsx
// In App.jsx - DELETE these sections:
// const [isPlaying, setIsPlaying] = useState(false);

// useEffect(() => {
//   if (isPlaying && currentStep < trace.trace.steps.length - 1) {
//     const timer = setTimeout(() => setCurrentStep(s => s + 1), 1000);
//     return () => clearTimeout(timer);
//   }
// }, [isPlaying, currentStep, trace]);

// const togglePlay = () => setIsPlaying(!isPlaying);
```

**2.4: Update App.jsx to use new components** (30 min)
- Import extracted components
- Replace inline JSX with component calls
- Verify all props passed correctly
- Remove duplicate control renders

```jsx
import CompletionModal from './components/CompletionModal';
import ControlBar from './components/ControlBar';

function App() {
  // ... state and logic (simplified, no isPlaying)
  
  return (
    <div>
      <ControlBar 
        currentStep={currentStep}
        totalSteps={trace.trace.steps.length}
        onPrev={() => setCurrentStep(s => s - 1)}
        onNext={() => setCurrentStep(s => s + 1)}
        onReset={() => setCurrentStep(0)}
      />
      
      {/* Visualizations */}
      
      <CompletionModal 
        isOpen={showCompletion}
        onClose={() => setShowCompletion(false)}
        stats={completionStats}
      />
    </div>
  );
}
```

**2.5: Verify functionality** (15 min)
- Test navigation: Reset, Previous, Next all work
- Test completion modal appears at final step
- Verify no console errors
- Check responsive layout still works

### Deliverables
- [ ] `CompletionModal.jsx` created and functional
- [ ] `ControlBar.jsx` created with unified logic (NO play button)
- [ ] App.jsx reduced to <150 lines
- [ ] All autoplay code removed (~180 lines deleted)
- [ ] Zero duplicate control rendering
- [ ] Manual testing: all navigation works, modal displays correctly

### Rollback Plan
**If** component extraction breaks functionality: Revert specific component file, keep changes in App.jsx until root cause identified. Git commit after each component extraction for granular rollback.

---

## Phase 3: Error Boundaries (1 hour)

### Goal
**Prevent white-screen crashes by catching rendering errors in visualization components**

### Success Criteria
- ✅ `ErrorBoundary` component wraps TimelineView and CallStackView
- ✅ Simulated rendering error shows fallback UI instead of blank page
- ✅ Error logged to console with component stack trace
- ✅ User sees "Reload" button and helpful message

### Tasks

**3.1: Create ErrorBoundary component** (30 min)
- Create `frontend/src/components/ErrorBoundary.jsx`
- Implement `getDerivedStateFromError` and `componentDidCatch`
- Design fallback UI with reload option

```jsx
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Visualization error:', error, errorInfo);
    // TODO: Send to error tracking service (future)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-center">
          <h2 className="text-xl font-bold text-red-600 mb-4">
            Visualization Error
          </h2>
          <p className="text-gray-600 mb-4">
            Something went wrong displaying this step.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

**3.2: Wrap visualization components** (15 min)
- Import ErrorBoundary in App.jsx
- Wrap TimelineView and CallStackView separately
- Keep separate boundaries so one failure doesn't break both views

```jsx
import ErrorBoundary from './components/ErrorBoundary';

// In render:
<ErrorBoundary>
  <TimelineView step={currentStepData} />
</ErrorBoundary>

<ErrorBoundary>
  <CallStackView step={currentStepData} />
</ErrorBoundary>
```

**3.3: Test error handling** (15 min)
- Temporarily add `throw new Error('test')` in TimelineView
- Verify fallback UI appears
- Verify other view still renders
- Remove test error

### Deliverables
- [ ] `ErrorBoundary.jsx` component created
- [ ] TimelineView wrapped in ErrorBoundary
- [ ] CallStackView wrapped in ErrorBoundary
- [ ] Test error shows fallback UI correctly
- [ ] Console logs error details

### Rollback Plan
**If** ErrorBoundary causes issues: Remove wrappers from App.jsx—component is isolated and won't affect existing code

---

## Phase 4: Environment Configuration (1 hour)

### Goal
**Enable deployment to production by externalizing environment-specific configuration**

### Success Criteria
- ✅ Backend URL configurable via environment variable
- ✅ `.env.development` and `.env.production` files created
- ✅ Local development still works with defaults
- ✅ README updated with environment setup instructions

### Tasks

**4.1: Configure frontend environment** (30 min)
- Create `.env.development` with local backend URL
- Create `.env.production` with placeholder production URL
- Update App.jsx to read from `process.env`
- Add `.env*.local` to `.gitignore`

```bash
# .env.development
REACT_APP_API_URL=http://localhost:5000/api

# .env.production
REACT_APP_API_URL=https://your-backend.com/api
```

```jsx
// In App.jsx
const BACKEND_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

useEffect(() => {
  fetch(`${BACKEND_URL}/trace`)
    .then(/* ... */);
}, []);
```

**4.2: Configure backend environment** (15 min)
- Add environment variable support for CORS origins
- Add max intervals/steps as environment vars
- Create example `.env` file

```python
# backend/.env.example
FLASK_ENV=development
CORS_ORIGINS=http://localhost:3000
MAX_INTERVALS=100
MAX_STEPS=10000

# backend/app.py
import os
from dotenv import load_dotenv

load_dotenv()

CORS_ORIGINS = os.getenv('CORS_ORIGINS', 'http://localhost:3000').split(',')
CORS(app, resources={r"/api/*": {"origins": CORS_ORIGINS}})
```

**4.3: Update documentation** (15 min)
- Add environment setup section to README
- Document all environment variables
- Add deployment notes

```markdown
## Environment Setup

### Development
1. Copy `.env.example` to `.env` in both `frontend/` and `backend/`
2. Adjust values if needed (defaults work for local development)

### Production
Set these environment variables:
- `REACT_APP_API_URL`: Your backend API URL
- `FLASK_ENV`: Set to `production`
- `CORS_ORIGINS`: Comma-separated allowed origins
```

### Deliverables
- [ ] `.env.development` and `.env.production` created
- [ ] Frontend reads `REACT_APP_API_URL` from environment
- [ ] Backend reads CORS and limits from environment
- [ ] `.env.example` files with documentation
- [ ] README updated with setup instructions

### Rollback Plan
**If** environment config breaks local dev: Restore hardcoded values temporarily, fix config syntax, re-apply. Keep defaults in code so missing env vars don't break app.

---

## Phase 5: Safe Array Access & Null Handling (30-45 min)

### Goal
**Prevent crashes from malformed data or out-of-bounds access**

### Success Criteria
- ✅ All array access uses optional chaining (`?.`)
- ✅ Missing step data shows helpful error state instead of crash
- ✅ Null/undefined intervals handled gracefully
- ✅ Test with deliberately malformed trace data

### Tasks

**5.1: Add safe array access in App.jsx** (20 min)
- Replace direct array access with optional chaining
- Add null checks before rendering
- Show error state for invalid data

```jsx
// Replace:
const step = trace.trace.steps[currentStep];

// With:
const step = trace?.trace?.steps?.[currentStep];

if (!step) {
  return (
    <div className="p-8 text-center">
      <p className="text-red-600">Invalid step data</p>
      <button onClick={() => setCurrentStep(0)}>Reset to Start</button>
    </div>
  );
}
```

**5.2: Add null handling in visualizations** (15 min)
- Check for undefined intervals in TimelineView
- Handle null `max_end` values in CallStackView
- Default to safe values when data missing

```jsx
// In TimelineView
const allIntervals = step?.data?.all_intervals || [];

{allIntervals.map((interval, idx) => {
  if (!interval) return null; // Skip malformed entries
  
  const visualState = interval.visual_state || {
    is_examining: false,
    is_covered: false,
    is_kept: false
  };
  
  // ... render interval
})}

// In CallStackView
const maxEnd = call.max_end ?? '−∞'; // Use nullish coalescing
```

**5.3: Test with malformed data** (10 min)
- Create test trace with missing fields
- Verify graceful degradation
- Check console for helpful error messages

### Deliverables
- [ ] All array access uses optional chaining
- [ ] Null checks added before rendering components
- [ ] Error states shown for invalid data
- [ ] Manual test with malformed trace passes without crashes

### Rollback Plan
**If** null handling logic has bugs: Revert specific checks causing issues, add more specific validation. Changes are localized to access patterns.

---

## Decision Tree & Stop Conditions

```
START
  ↓
PHASE 1: Input Validation (2-3h)
  ├─ Success → PHASE 2
  ├─ Pydantic errors → Check model definitions, adjust validators
  └─ Tests fail → Review edge cases, fix validation logic

PHASE 2: Refactoring & Autoplay Removal (3-4h)
  ├─ Success → PHASE 3
  ├─ Component extraction breaks UI → Rollback component, fix props/imports
  └─ Navigation broken → Check state management, verify event handlers

PHASE 3: Error Boundaries (1h)
  ├─ Success → PHASE 4
  ├─ Boundary not catching errors → Check wrapping location, verify class component
  └─ Fallback UI not showing → Check getDerivedStateFromError return value

PHASE 4: Environment Config (1h)
  ├─ Success → PHASE 5
  ├─ Env vars not loading → Check .env location, verify naming (REACT_APP_ prefix)
  └─ CORS errors → Verify origins match, check backend config

PHASE 5: Safe Access (30-45min)
  ├─ Success → MVP COMPLETE ✅
  ├─ Still crashing → Add more null checks, review error boundaries
  └─ Optional chaining too aggressive → Adjust to check only uncertain data

MVP COMPLETE → Ready for sharing and user testing
```

### Explicit Stop Conditions

**STOP and reassess if:**
- Phase 2 refactoring exceeds 6 hours (scope too large—do minimal extraction first)
- More than 2 phases fail initial testing (underlying issue with architecture/dependencies)
- Any phase breaks existing working functionality and rollback unclear

**Success signal:**
- All 5 phases complete in 7-10 hours
- App handles invalid input gracefully
- Code reduced by ~180 lines (autoplay removal)
- No white-screen crashes on bad data

---

## Risk Mitigation Summary

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Pydantic validation too strict | Medium | Low | Start permissive, tighten after testing |
| Component extraction breaks state | Medium | Medium | Extract one at a time, commit after each |
| Autoplay removal missed dependencies | Low | Low | Search codebase for `isPlaying` before deleting |
| Environment config breaks local dev | Low | High | Keep defaults in code, test immediately |
| Over-aggressive null checks | Low | Low | Only check uncertain data sources |

---

## Success Metrics

### Minimum Viable Success (7-10 hours)

- ✅ Invalid input returns clear 400 errors (not cryptic backend crashes)
- ✅ App.jsx under 150 lines (from 570)
- ✅ ~180 lines of autoplay code removed
- ✅ Zero duplicate control logic
- ✅ Rendering errors show fallback UI (not white screen)
- ✅ Deployable to production with environment config
- ✅ Safe array access prevents out-of-bounds crashes

### Stretch Goals (If ahead of schedule)

- Add keyboard shortcuts (Space/ArrowRight = Next, ArrowLeft = Previous, R = Reset)
- Extract colorMap to separate constants file
- Add basic backend logging for trace generation
- Create simple health check endpoint verification

---

## Scope Boundaries

### In Scope
- ✅ Backend input validation with Pydantic
- ✅ Trace size limits (intervals + steps)
- ✅ Frontend component extraction (3 components minimum)
- ✅ Complete autoplay/timer removal
- ✅ Error boundary implementation
- ✅ Environment configuration for deployment
- ✅ Safe array access patterns

### Out of Scope
- ❌ Automated tests (needs separate planning—see critique.md for test strategy)
- ❌ Performance optimization (memoization, delta encoding)
- ❌ Shareable URLs / persistent storage
- ❌ Custom input editor
- ❌ Keyboard shortcuts (stretch goal only)
- ❌ Accessibility improvements (ARIA labels, screen reader support)
- ❌ Backend logging infrastructure
- ❌ Additional algorithms

---

## Implementation Notes

### Technologies Requiring Research
- **Pydantic**: Familiarize with validators and error formatting (30 min reading docs)
- **React.Component**: Error boundaries require class components (different from functional components used elsewhere)
- **Optional chaining**: Ensure understanding of `?.` vs `||` vs `??` operators

### Potential Blockers
- **Component extraction state bugs**: Props might not flow correctly—use React DevTools to inspect
- **Environment variables not loading**: Must restart dev server after .env changes
- **Pydantic validation errors confusing**: Test with simple cases first, add complexity gradually

### Recommended Starting Point
1. **Phase 1 Task 1.1**: Start with Pydantic validation—quickest win, tests immediately
2. Commit after each phase completion for clean rollback points
3. Use git branches: `git checkout -b mvp-fixes` for all changes

---

## Questions Before Starting

*None required—specifications are clear. However, consider:*

1. **Do you want more granular commits?** (e.g., commit after each component extraction vs. after each phase)
2. **Should keyboard shortcuts be in MVP or deferred?** (Currently listed as stretch goal)
3. **Any specific error tracking service to integrate?** (Error boundaries have TODO placeholder)

---

## Next Steps

1. **Create git branch**: `git checkout -b mvp-fixes`
2. **Start Phase 1**: Install Pydantic, create validation models
3. **Test early and often**: Run app after each task completion
4. **Commit after each phase**: Enables granular rollback if needed
5. **Final manual testing**: Run through full workflow with valid/invalid inputs

**Estimated total time: 7-10 hours across 1-2 focused coding sessions**