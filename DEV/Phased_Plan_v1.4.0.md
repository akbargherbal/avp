# Multi-Algorithm Educational Platform: Implementation Plan

## Requirements Analysis

**Current State**: Working interval coverage visualization (greedy + recursive algorithm) with interactive prediction mode, visual highlighting, and educational descriptions. ~1100 lines total, 3 sessions (~10 hours) development time.

**Core Goal**: Transform single-algorithm POC into extensible platform supporting 5-8 algorithms while preserving the "backend thinks, frontend reacts" philosophy and active learning features.

**Technical Constraints**: 
- Solo dev + LLM assistant workflow
- Python 3.11+ backend (Flask)
- React frontend (functional components, Tailwind CSS)
- Must maintain existing UX quality

**Assumptions to Validate**:
1. Current trace structure can accommodate different data structures (arrays, trees) with extensions
2. Prediction mode logic can generalize across algorithm types
3. Frontend components can be reused with minimal algorithm-specific code
4. 5-8 algorithms achievable in 8-12 weeks part-time

---

## Strategic Approach

**Why This Phasing?**: Evolutionary refactoring that validates abstractions incrementally. Phase 1 extracts patterns from working code (zero risk). Phase 2 validates with a dramatically different algorithm (binary search: array-based, iterative-friendly, simple predictions). Phase 3 adds variety to stress-test the system before scaling.

**Main Risk Areas**:
1. **Over-abstraction**: Forcing algorithms into one-size-fits-all mold
2. **Prediction quality**: Not all algorithms have clear "teachable moments"
3. **Visualization complexity**: Some algorithms need novel visual metaphors
4. **Scope creep**: Feature requests during development

**Validation Strategy**:
- Each phase produces working, deployable software
- Binary search (Phase 2) validates abstractions early
- Stop conditions prevent sunk cost fallacy
- Git branches enable safe experimentation

---

## Phase 1: Extract & Generalize Core Abstractions (Week 1-2, ~12-16 hours)

### Goal
**Establish reusable infrastructure without breaking the working POC**

### Success Criteria
- ✅ `AlgorithmTracer` base class exists and is tested
- ✅ `IntervalCoverageTracer` inherits from base with identical behavior
- ✅ Frontend visualization registry working (even with one algorithm)
- ✅ POC passes all existing manual tests
- ✅ No regressions in prediction mode, highlighting, or descriptions

### Tasks

**1.1: Backend Base Tracer (4-5 hours)**

Create `backend/algorithms/base_tracer.py`:

```python
class AlgorithmTracer(ABC):
    MAX_STEPS = 10000
    
    def __init__(self):
        self.trace = []
        self.step_count = 0
        self.start_time = time.time()
        self.metadata = {}
    
    @abstractmethod
    def execute(self, input_data: Any) -> dict:
        """Returns: {result, trace: {steps, total_steps, duration}, metadata}"""
        pass
    
    @abstractmethod
    def get_prediction_points(self) -> List[Dict[str, Any]]:
        """Returns: [{step_index, question, choices, hint}]"""
        pass
```

Refactor `interval_coverage.py` to inherit:
- Extract prediction logic into `get_prediction_points()`
- Keep ALL existing methods (just add base class)
- Test: Run backend standalone, verify trace identical

**1.2: Frontend Visualization Registry (3-4 hours)**

Create `frontend/src/visualizations/registry.js`:

```javascript
const VISUALIZATION_REGISTRY = {
  'timeline_and_callstack': {
    primary: TimelineView,
    secondary: CallStackView,
    layout: 'side-by-side'
  }
  // More added in Phase 2+
};

export const getVisualizationComponents = (type) => {
  return VISUALIZATION_REGISTRY[type] || VISUALIZATION_REGISTRY['timeline_and_callstack'];
};
```

Modify `App.jsx`:
- Import registry
- Use `trace?.metadata?.visualization_type` to select components
- Default to 'timeline_and_callstack' for backward compatibility

Test: POC should work identically

**1.3: Generalize Prediction Detection (2-3 hours)**

Backend adds to trace metadata:
```python
def get_prediction_points(self):
    return [
        {
            "step_index": i,
            "question": "Will this interval be kept?",
            "choices": ["keep", "covered"],
            "hint": "Compare interval.end with max_end"
        }
        for i, step in enumerate(self.trace)
        if step.type == "EXAMINING_INTERVAL"
    ]
```

Frontend `usePredictionMode.js`:
- Read `trace.metadata.prediction_points` instead of detecting from step type
- Fallback to old detection if metadata missing (backward compatibility)

**1.4: Generic Highlight System (2-3 hours)**

Backend adds `highlights` structure to step data:
```python
self._add_step("EXAMINING_INTERVAL", {
    "interval": ...,
    "highlights": {
        "primary": interval.id,
        "type": "interval_id"
    }
}, ...)
```

Frontend `useVisualHighlight.js`:
- Extract `step.data.highlights` instead of digging into call_stack_state
- Fallback to old extraction if highlights missing

**Key Decision**: Preserve old data structures during Phase 1 for safety. New fields are additive, not replacements.

### Deliverables
- [ ] `base_tracer.py` with 100+ lines of abstract infrastructure
- [ ] `interval_coverage.py` refactored (~same line count, inherits base)
- [ ] `visualizations/registry.js` created (~50 lines)
- [ ] `App.jsx` modified to use registry (~20 line change)
- [ ] `usePredictionMode.js` reads metadata (~30 line change)
- [ ] `useVisualHighlight.js` uses generic highlights (~20 line change)
- [ ] Manual test checklist passed (15 test cases)
- [ ] Git commit: "Phase 1: Extract core abstractions"

### Rollback Plan
**If** manual tests reveal regressions: Git revert to pre-Phase-1 commit, document issues, reassess abstraction approach.

---

## Phase 2: Validate with Binary Search (Week 3, ~8-10 hours)

### Goal
**Prove abstractions work with a fundamentally different algorithm type**

### Success Criteria
- ✅ Binary search algorithm working end-to-end
- ✅ ArrayView component renders correctly
- ✅ Prediction mode works for binary search decisions
- ✅ Algorithm selector UI switches between algorithms
- ✅ No changes needed to base infrastructure
- ✅ Both algorithms deployable

### Tasks

**2.1: Binary Search Tracer (3-4 hours)**

Create `backend/algorithms/binary_search.py`:

```python
class BinarySearchTracer(AlgorithmTracer):
    def __init__(self):
        super().__init__()
        self.metadata = {
            "algorithm": "binary-search",
            "visualization_type": "array",
            "category": "Divide & Conquer"
        }
    
    def execute(self, arr: List[int], target: int) -> dict:
        # Implement with trace calls
        pass
    
    def get_prediction_points(self):
        return [
            {
                "step_index": i,
                "question": f"arr[{step.data['mid']}]={step.data['value']} vs target: which direction?",
                "choices": ["left", "right", "found"],
                "hint": "Compare midpoint value with target"
            }
            for i, step in enumerate(self.trace)
            if step.type == "COMPARE"
        ]
```

Step types: CALCULATE_MID, COMPARE, GO_LEFT, GO_RIGHT, FOUND, BASE_CASE

**2.2: ArrayView Component (2-3 hours)**

Create `frontend/src/visualizations/ArrayView.jsx`:

```jsx
const ArrayView = ({ step }) => {
  const arrayState = step?.data?.array_state || {};
  const elements = arrayState.elements || [];
  const highlight = arrayState.highlight || {};
  
  return (
    <div className="flex gap-2 items-end justify-center h-full">
      {elements.map((val, idx) => (
        <div key={idx} className={`
          w-12 h-12 flex items-center justify-center rounded
          ${highlight.mid === idx ? 'bg-yellow-500 ring-4 ring-yellow-400' : ''}
          ${highlight.left === idx || highlight.right === idx ? 'bg-blue-500' : 'bg-slate-700'}
        `}>
          <span className="text-white font-bold">{val}</span>
        </div>
      ))}
    </div>
  );
};
```

Register in `visualizations/registry.js`:
```javascript
'array': {
  primary: ArrayView,
  secondary: null,
  layout: 'centered'
}
```

**2.3: Algorithm Registry & Selector (2-3 hours)**

Backend `app.py`:
```python
ALGORITHM_REGISTRY = {
    "interval-coverage": {
        "tracer": IntervalCoverageTracer,
        "name": "Remove Covered Intervals",
        "category": "Greedy",
        "input_schema": {"type": "intervals"}
    },
    "binary-search": {
        "tracer": BinarySearchTracer,
        "name": "Binary Search",
        "category": "Divide & Conquer",
        "input_schema": {"type": "array_and_target"}
    }
}

@app.route('/api/algorithms', methods=['GET'])
def list_algorithms():
    return jsonify({"algorithms": [...]})

@app.route('/api/trace/<algorithm_id>', methods=['POST'])
def generate_trace(algorithm_id):
    # Dispatch to appropriate tracer
    pass
```

Frontend `components/AlgorithmSelector.jsx`:
```jsx
const AlgorithmSelector = ({ onSelect }) => {
  const [algorithms, setAlgorithms] = useState([]);
  
  useEffect(() => {
    fetch(`${API_URL}/algorithms`)
      .then(r => r.json())
      .then(data => setAlgorithms(data.algorithms));
  }, []);
  
  return (
    <div className="grid grid-cols-2 gap-4">
      {algorithms.map(algo => (
        <AlgorithmCard key={algo.id} algorithm={algo} onClick={() => onSelect(algo.id)} />
      ))}
    </div>
  );
};
```

Modify `App.jsx` to show selector on load, then trace player after selection.

### Deliverables
- [ ] `binary_search.py` tracer (~200 lines)
- [ ] `ArrayView.jsx` component (~100 lines)
- [ ] `AlgorithmSelector.jsx` component (~80 lines)
- [ ] Backend registry endpoints (~60 lines in app.py)
- [ ] Updated `App.jsx` with algorithm selection flow (~100 line change)
- [ ] Manual test: Both algorithms work end-to-end
- [ ] Git commit: "Phase 2: Add binary search + algorithm selector"

### Rollback Plan
**If** base abstractions need changes: Document required changes, create Phase 1.5 to fix base classes, then retry Phase 2.

---

## Phase 3: Add Algorithm Variety (Week 4-6, ~20-25 hours)

### Goal
**Expand library with 3 more algorithms to stress-test system before scaling**

### Success Criteria
- ✅ 5 total algorithms working (interval coverage + 4 new)
- ✅ At least 2 different visualization types beyond timeline/array
- ✅ Prediction mode quality maintained
- ✅ No performance issues with larger traces
- ✅ Educational descriptions for all algorithms

### Tasks

**3.1: Merge Sort (Recursive + Array View) - 6-8 hours**

Visualization: ArrayView with call stack overlay
Prediction points: "Which element comes first in merge?"
Step types: DIVIDE, MERGE_COMPARE, MERGE_COMPLETE

Complexity: Medium (recursive like interval coverage, but simpler data)

**3.2: Depth-First Search (Graph View) - 8-10 hours**

NEW: Create `GraphView.jsx` component
- Node circles with labels
- Edge lines between nodes
- Node colors: unvisited (gray), visiting (yellow), visited (green)

Visualization: Network graph with stack
Prediction points: "Which neighbor visited next?"
Step types: VISIT_NODE, EXPLORE_EDGE, BACKTRACK, COMPLETE

Complexity: High (new visualization type)

**3.3: Linear Search (Array View) - 3-4 hours**

Visualization: ArrayView (reuse from binary search)
Prediction points: "Is this the target?"
Step types: EXAMINE_ELEMENT, FOUND, NOT_FOUND

Complexity: Low (simplest algorithm, tests basic array viz)

**3.4: Selection Sort (Array View) - 3-4 hours**

Visualization: ArrayView with swap animations
Prediction points: "Which element is minimum in this range?"
Step types: FIND_MIN, SWAP, NEXT_ITERATION

Complexity: Low-Medium (array sorting, introduces swaps)

**Key Decision**: Choose algorithms with different characteristics:
- Recursive (merge sort) vs iterative (selection sort)
- Search (linear, binary) vs sort (selection, merge)
- New visualization (DFS graph) vs reused (array view)

### Deliverables
- [ ] 4 new tracer modules (~200-300 lines each)
- [ ] `GraphView.jsx` component (~250 lines)
- [ ] Updated registry with 5 algorithms
- [ ] Educational descriptions for all step types
- [ ] Performance test: 1000+ step traces render smoothly
- [ ] Git commits: One per algorithm

### Rollback Plan
**If** GraphView proves too complex: Skip DFS for Phase 3, add simpler Bubble Sort instead. Revisit graph algorithms in Phase 5.

---

## Phase 4: Polish & Developer Experience (Week 7-8, ~12-15 hours)

### Goal
**Make system production-ready and easy for future algorithm additions**

### Success Criteria
- ✅ Developer guide for adding new algorithms (<30 min to scaffold)
- ✅ Automated tests for base tracer and at least 2 algorithms
- ✅ Error handling for malformed traces
- ✅ Performance optimization (lazy loading, React.memo)
- ✅ Deployment documentation updated

### Tasks

**4.1: Developer Documentation (3-4 hours)**

Create `docs/ADDING_ALGORITHMS.md`:
```markdown
# Adding a New Algorithm (30-Minute Guide)

## 1. Create Tracer (15 min)
- Copy `algorithms/binary_search.py` as template
- Implement `execute()` method
- Define step types and descriptions
- Implement `get_prediction_points()`

## 2. Register Algorithm (5 min)
- Add to `ALGORITHM_REGISTRY` in `app.py`
- Define input schema

## 3. Create/Reuse Visualization (10 min)
- Use existing ArrayView/GraphView if possible
- Create new component if needed
- Register in `visualizations/registry.js`

## 4. Test (Manual)
- Run backend, frontend
- Test prediction mode
- Verify highlighting
- Check edge cases
```

**4.2: Automated Testing (4-5 hours)**

Backend tests:
```python
# backend/tests/test_base_tracer.py
def test_binary_search_trace_structure():
    tracer = BinarySearchTracer()
    result = tracer.execute([1,3,5,7,9], 5)
    
    assert "trace" in result
    assert "result" in result
    assert result["trace"]["total_steps"] > 0
    assert result["metadata"]["algorithm"] == "binary-search"

def test_prediction_points_format():
    tracer = BinarySearchTracer()
    result = tracer.execute([1,3,5,7,9], 5)
    points = result["metadata"]["prediction_points"]
    
    for point in points:
        assert "step_index" in point
        assert "question" in point
        assert "choices" in point
```

Frontend tests:
```javascript
// frontend/src/utils/__tests__/predictionUtils.test.js
test('isPredictionPoint detects decision moments', () => {
  const step = { type: 'COMPARE', data: { choices: ['left', 'right'] }};
  // Test with generic metadata
});
```

**4.3: Performance Optimization (3-4 hours)**

- Add `React.memo` to visualization components
- Implement lazy loading for algorithm selector
- Compress trace data (delta encoding for repeated state)
- Add loading indicators for large traces

**4.4: Error Boundaries & Validation (2-3 hours)**

- Backend: Validate trace structure before returning
- Frontend: Add error boundary per visualization component
- Handle missing metadata gracefully (fallbacks)
- User-friendly error messages

### Deliverables
- [ ] `ADDING_ALGORITHMS.md` guide (~400 lines)
- [ ] Test suite (~300 lines backend, ~200 lines frontend)
- [ ] Performance improvements (React.memo, lazy loading)
- [ ] Error handling improvements
- [ ] Git commit: "Phase 4: Polish & DX improvements"

### Rollback Plan
**If** time runs short: Tests and docs are lower priority than working software. Defer to Phase 5 if needed.

---

## Phase 5: Expand Algorithm Library (Week 9-12, ~20-30 hours)

### Goal
**Reach 8-10 algorithms covering major CS algorithm categories**

### Success Criteria
- ✅ 8+ algorithms across 5+ categories
- ✅ Each category has at least one "easy" algorithm
- ✅ Platform feels comprehensive for learning
- ✅ All algorithms have high-quality predictions and descriptions

### Tasks

**5.1: Additional Sorting Algorithms (6-8 hours)**
- Bubble Sort (easy, array view, many predictions)
- Insertion Sort (easy, array view, visual swaps)
- Quick Sort (medium, recursive + array view)

**5.2: Additional Search Algorithms (4-6 hours)**
- Breadth-First Search (graph view, queue visualization)
- Jump Search (array view, unique step pattern)

**5.3: Dynamic Programming (8-10 hours)**
- Fibonacci (simple, introduces DP table view)
- Create `MatrixView.jsx` component for DP tables
- Prediction points: "Should we compute or use memoized value?"

**5.4: Tree Algorithms (6-8 hours if time permits)**
- Binary Tree Traversal (inorder/preorder/postorder)
- Create `TreeView.jsx` component
- Prediction points: "Which subtree next?"

**Recommended Priority**:
1. Bubble Sort (easy win, high learning value)
2. BFS (complements DFS, reuses graph view)
3. Fibonacci DP (introduces new visualization paradigm)
4. Quick Sort (popular algorithm, builds on merge sort)
5. Others as time permits

### Deliverables
- [ ] 3-5 new algorithm tracers
- [ ] `MatrixView.jsx` component if DP added
- [ ] `TreeView.jsx` component if tree algorithms added
- [ ] Updated algorithm selector with categories
- [ ] Git commits: One per algorithm

### Rollback Plan
**If** complexity exceeds estimates: Stop at 6-7 algorithms. Platform is still valuable. Document remaining algorithms as "future work."

---

## Decision Tree & Stop Conditions

```
START
  ↓
PHASE 1: Extract Abstractions (2 weeks)
  ├─ POC still works → PHASE 2
  ├─ Minor issues → Fix (max 2 days) → PHASE 2
  └─ Major regressions → STOP: Document issues, reassess architecture
  
PHASE 2: Binary Search (1 week)
  ├─ Abstractions work cleanly → PHASE 3
  ├─ Need minor base class changes → Make changes → PHASE 3
  └─ Abstractions fundamentally flawed → STOP: Redesign Phase 1
  
PHASE 3: Add 4 Algorithms (3 weeks)
  ├─ 4 algorithms working → PHASE 4
  ├─ 2-3 algorithms working → Acceptable → PHASE 4
  └─ <2 algorithms working → REASSESS: Simplify scope or improve tooling
  
PHASE 4: Polish (2 weeks)
  ├─ Complete → PHASE 5
  ├─ Partial → Ship what exists → Optional PHASE 5
  └─ Time overrun → STOP: Ship Phase 3 state, defer polish
  
PHASE 5: Expand Library (4 weeks)
  ├─ 8+ algorithms → SUCCESS: Ship v1.0
  ├─ 6-7 algorithms → SUCCESS: Ship v1.0 (scope adjusted)
  └─ <6 algorithms → STOP: Ship as v0.9, plan v1.1
```

### Explicit Stop Conditions

**STOP if:**
1. Phase 1 breaks POC and fixes take >3 days (abstractions wrong)
2. Phase 2 reveals base classes need >50% rewrite (design flaw)
3. Any phase exceeds 2x time estimate (scope miscalculation)
4. Combined development time reaches 80 hours without Phase 4 complete (diminishing returns)
5. Performance degrades below 30fps for typical traces (architectural issue)

**REASSESS if:**
- GraphView takes >12 hours (too complex, use simpler viz)
- Prediction quality drops below 80% user satisfaction (needs redesign)
- New algorithms require >4 hours each on average (tooling insufficient)

---

## Risk Mitigation Summary

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Over-abstraction breaks POC | Low | High | Phase 1 is additive only; full test suite before Phase 2 |
| Binary search reveals design flaws | Medium | High | Phase 2 catches early; budget 1 week for fixes |
| GraphView too complex | Medium | Medium | Have fallback (skip DFS, use simpler algorithm) |
| Scope creep (users request features) | High | Medium | Strict "out of scope" list; defer to v2.0 |
| LLM coding quality varies | Medium | Low | Manual code review after each phase; refactor as needed |
| Time estimates too optimistic | Medium | Medium | 2x budget rule; stop conditions prevent sunk cost |
| Prediction mode doesn't generalize | Low | High | Phase 2 validates; pivot to "watch-only" mode if needed |

---

## Success Metrics

### Minimum Viable Success (12 weeks)
- ✅ 5 working algorithms (interval coverage + 4 new)
- ✅ 2 visualization types (timeline+callstack, array)
- ✅ Prediction mode works for 80% of algorithms
- ✅ Developer guide enables new algorithm in <1 hour
- ✅ No regressions in POC features
- ✅ Deployable to production

### Stretch Goals (If ahead of schedule)
- 8+ algorithms across 5 categories
- 3+ visualization types (add graph, matrix, or tree)
- Automated test coverage >60%
- Algorithm comparison mode
- Shareable trace URLs
- Export traces as PDF

---

## Scope Boundaries

### In Scope
- ✅ 5-10 algorithms (sorting, searching, basic graph, simple DP)
- ✅ 2-4 visualization types (timeline, array, graph, matrix)
- ✅ Generalized prediction mode
- ✅ Educational descriptions for all algorithms
- ✅ Developer documentation for adding algorithms
- ✅ Algorithm selector UI
- ✅ Basic performance optimization

### Out of Scope
- ❌ User accounts / save progress → V2.0
- ❌ Custom algorithm input editors → V2.0
- ❌ Side-by-side algorithm comparison → V2.0 (stretch goal)
- ❌ Advanced animations (beyond current quality) → Not needed
- ❌ Multi-language backend support → Not needed
- ❌ LLM-generated explanations → Out of scope entirely
- ❌ Complex graph algorithms (Dijkstra, A*) → V2.0 (requires weighted edges)
- ❌ Collaborative features → Not planned

---

## Next Steps

### Immediate Actions (Before Phase 1)

1. **Create development branch**: `git checkout -b refactor-multi-algorithm`
2. **Set up testing framework**: Install pytest, @testing-library/react
3. **Document current behavior**: Record 5-minute video of POC working perfectly (baseline)
4. **Create Phase 1 task list**: Break down 1.1-1.4 into 2-hour chunks

### First Validation Checkpoint (End of Week 1)

**Test Questions:**
- Does IntervalCoverageTracer still pass all manual tests?
- Can I explain the base class design to someone in 5 minutes?
- Is the code cleaner or more complex than before?
- Would adding binary search be straightforward with these abstractions?

**If "no" to any**: Stop, reassess, adjust approach.

### Recommended Starting Point

**Day 1 (4 hours):**
- Create `base_tracer.py` with TraceStep dataclass
- Write 3 abstract methods
- Make IntervalCoverageTracer inherit (don't change behavior)
- Run standalone test: `python backend/algorithms/interval_coverage.py`

**Day 2 (4 hours):**
- Create visualization registry
- Modify App.jsx to use registry
- Test: POC should work identically
- Git commit if successful

**Day 3-4 (8 hours):**
- Generalize prediction detection
- Generalize highlight system
- Full regression test
- Git commit: "Phase 1 complete"

---

## Questions Before Starting

1. **Development Environment**: Do you have pytest and React Testing Library set up? (Needed for Phase 4)

2. **Time Commitment**: Can you commit ~8-12 hours/week for 12 weeks? (If less, extend timeline proportionally)

3. **Algorithm Preferences**: Which 5 algorithms are highest priority? (Recommendation: Binary Search, Merge Sort, Linear Search, DFS, Bubble Sort)

4. **Deployment Target**: Same as current (localhost)? Or planning production deployment? (Affects Phase 4 priorities)

5. **Risk Tolerance**: If Phase 2 reveals base class design issues, prefer to: (a) Spend 1 week fixing Phase 1, or (b) Continue with workarounds and refactor in v2.0?

---

**This plan respects your POC's quality while providing a clear path to a multi-algorithm platform. Each phase is independently valuable, so you can stop at any point with working software. The 12-week timeline is realistic for a solo developer with LLM assistance, with built-in flexibility for discovery and iteration.**