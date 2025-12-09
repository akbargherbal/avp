# AlgoViz Platform: Multi-Algorithm Visualization System

## Implementation Plan (Revised - No LLM Integration)

---

## Requirements Analysis

**Current State:**

- ✅ Working POC for interval coverage algorithm
- ✅ Backend trace generation + frontend visualization separation
- ✅ Interactive prediction mode with accuracy tracking
- ✅ Visual highlighting and educational descriptions
- ✅ Component-based architecture with 5 reusable components

**Core Goal:** Transform single-algorithm POC into a multi-algorithm visualization platform that teaches algorithms through interactive step-by-step execution and prediction challenges.

**Technical Constraints:**

- Python backend (Flask)
- React frontend
- GCP deployment target
- Must maintain existing prediction/interaction features
- Solo developer project (you)

**Assumptions to Validate:**

- Universal trace format will work across algorithm categories (sorting, searching, graphs)
- Registry pattern scales to 8-10 algorithms
- Component registry approach works for diverse visualization types
- Adding algorithm #3 takes <4 hours (proving architecture works)

---

## Strategic Approach

**Why This Phasing?**

1. **Phase 1**: Add merge sort to validate patterns (similar to intervals but different visualization)
2. **Phase 2**: Document patterns, design abstractions (Rule of Three - wait for algorithm #3)
3. **Phase 3**: Refactor to universal system with confidence
4. **Phase 4**: Prove scalability with binary search (<4 hours target)
5. **Phase 5**: Scale to 8-10 algorithms across categories
6. **Phase 6**: Production polish and deployment

**Main Risk Areas:**

1. **Over-abstraction too early** - Wait until algorithm #3 to finalize patterns
2. **Visualization complexity** - Graph algorithms need different approach than sorting/intervals
3. **Time investment** - Solo project, need to stay motivated through 6-8 weeks

**Validation Strategy:**

- Each phase produces working software (no big-bang rewrites)
- Feature flags for new components during migration
- Git commits align with phase boundaries
- Clear stop conditions to prevent scope creep

---

## Phase 1: Add Second Algorithm (Merge Sort) - Validate Patterns

**Duration: 4-6 days**  
**Goal:** Prove the architecture can handle a second algorithm category (sorting vs. greedy)

### Success Criteria

- ✅ Merge sort trace generated with prediction points at comparisons
- ✅ Array bar visualization renders correctly
- ✅ Can switch between algorithms via dropdown
- ✅ Prediction mode works for "which element comes first?" questions
- ✅ Zero changes to core components (ControlBar, PredictionModal, ErrorBoundary)

### Tasks

**1.1: Backend - Merge Sort Tracer** (1.5-2 days)

- Create `backend/algorithms/merge_sort.py`
- Implement tracer class with same output structure:
  ```python
  class MergeSortTracer:
      def sort_with_trace(self, array: List[int]) -> dict:
          return {
              "result": [...],  # Sorted array
              "trace": {"steps": [...], "total_steps": N},
              "metadata": {"input_size": len(array), ...}
          }
  ```
- **Step types to implement:**
  - `INITIAL_STATE` - Unsorted array
  - `RECURSIVE_CALL` - Divide phase (left/right halves)
  - `BASE_CASE` - Single element (already sorted)
  - `COMPARISON` - Prediction point: "Which element comes first?"
  - `MERGE_STEP` - Merging two sorted halves
  - `ALGORITHM_COMPLETE` - Final sorted array
- **Key decision:** Prediction points at every merge comparison:

  ```python
  {
      "type": "COMPARISON",
      "description": "Comparing elements: should 34 or 25 come first?",
      "data": {
          "comparing": [34, 25],
          "indices": [2, 3],
          "correct_answer": 25,
          "explanation": "25 < 34, so 25 comes first"
      },
      "prediction_point": True
  }
  ```

- **Validation:** Max 100 elements, integers only, clear error messages
- **Endpoint:** `POST /api/trace/merge-sort` with body `{"array": [64, 34, 25, ...]}`

**1.2: Frontend - Sorting Visualization Components** (1.5 days)

- Create `frontend/src/components/visualizations/sorting/` directory
- **ArrayBarsView.jsx** (main visualization):

  - Bar chart with heights proportional to values
  - Highlight comparing elements (yellow border)
  - Dim inactive elements (opacity 40%)
  - Show current subarray range
  - Color scheme: purple/pink theme

  ```jsx
  const ArrayBarsView = ({ step, highlightIndices }) => {
    const array = step?.data?.array || [];
    return (
      <div className="flex items-end gap-1 h-64">
        {array.map((value, idx) => (
          <div
            key={idx}
            className={`flex-1 transition-all ${
              highlightIndices.includes(idx)
                ? "bg-yellow-400 ring-2 ring-yellow-300"
                : "bg-purple-600"
            }`}
            style={{ height: `${(value / maxValue) * 100}%` }}
          >
            <span className="text-white text-xs">{value}</span>
          </div>
        ))}
      </div>
    );
  };
  ```

- **SortStateView.jsx** (right panel):
  - Current recursion depth
  - Left/right subarray indices
  - Comparison count
  - Current phase (divide/conquer)
- **Style:** Tailwind CSS, consistent with existing components

**1.3: Algorithm Switching UI** (0.5 days)

- Add dropdown in App.jsx header:
  ```jsx
  <select
    value={selectedAlgorithm}
    onChange={(e) => setSelectedAlgorithm(e.target.value)}
    className="bg-slate-700 text-white px-4 py-2 rounded-lg"
  >
    <option value="interval-coverage">Remove Covered Intervals</option>
    <option value="merge-sort">Merge Sort</option>
  </select>
  ```
- Store in state, update API endpoint dynamically
- Load appropriate visualization components based on selection
- Default to interval coverage (backwards compatible)

**1.4: Prediction Logic for Sorting** (0.5 days)

- Create `frontend/src/utils/predictions/sortingPrediction.js`:

  ```javascript
  export const isPredictionPoint = (step) => {
    return step?.type === "COMPARISON" && step?.prediction_point === true;
  };

  export const getCorrectAnswer = (step, nextStep) => {
    return step?.data?.correct_answer; // Backend provides answer
  };

  export const getExplanation = (step) => {
    return step?.data?.explanation || "Compare the values";
  };
  ```

- Update `PredictionModal` to handle numerical comparisons
- Show both values being compared with clear question

**1.5: Integration & Testing** (1 day)

- Test merge sort with arrays: [3,1,4,1,5], [64,34,25,12,22,11,90]
- Verify prediction mode prompts at comparisons
- Test keyboard shortcuts (arrows, space, K/C keys)
- Validate accuracy tracking works
- Check for console errors
- Test algorithm switching (no crashes)

### Deliverables

- [ ] `backend/algorithms/merge_sort.py` (~300-400 lines)
- [ ] `POST /api/trace/merge-sort` endpoint in `app.py`
- [ ] `ArrayBarsView.jsx` + `SortStateView.jsx`
- [ ] Algorithm selector dropdown in App.jsx
- [ ] `sortingPrediction.js` utility
- [ ] 5 test arrays with expected trace lengths

### Rollback Plan

**If** visualization doesn't render cleanly or takes >8 days:

- Keep merge sort backend (still useful)
- Remove frontend selector UI
- Document what didn't work for Phase 3 redesign
- Commit to `phase1-learnings` branch

---

## Phase 2: Pattern Analysis & Architecture Design - Document Before Refactoring

**Duration: 2-3 days**  
**Goal:** Analyze duplication and design universal architecture WITHOUT coding changes yet

### Success Criteria

- ✅ Clear document listing universal vs. algorithm-specific patterns
- ✅ Universal trace format v1.0 specification written
- ✅ Backend registry design documented
- ✅ Frontend registry design documented
- ✅ Decision made: "Refactor after algorithm #3"

### Tasks

**2.1: Pattern Analysis Document** (1 day)

- **Compare side-by-side:**
  - Interval coverage trace format vs. merge sort trace format
  - Prediction logic (intervals vs. sorting)
  - Visualization components (timeline vs. bars)
  - Step types (what's common, what's unique)
- **Identify duplication in App.jsx:**

  - Step navigation (universal)
  - Keyboard shortcuts (universal)
  - Prediction modal orchestration (universal)
  - Visualization component mounting (algorithm-specific)
  - Prediction logic (algorithm-specific)

- **Output:** `docs/pattern_analysis.md` with tables:

  ```markdown
  ## Universal Patterns (Same Across Algorithms)

  - Step navigation (Next/Prev/Reset)
  - Keyboard shortcuts
  - Prediction modal structure
  - Accuracy tracking

  ## Algorithm-Specific Patterns

  - Visualization components (Timeline vs ArrayBars vs Graph)
  - Prediction logic (interval comparison vs sorting comparison)
  - Step type interpretation
  - State display format
  ```

**2.2: Universal Trace Format Specification** (1 day)

- Based on generalization_guide.md recommendations
- Define **required fields** for all algorithms:

  ```json
  {
    "algorithm": {
      "name": "merge-sort",
      "category": "sorting",
      "version": "1.0"
    },
    "input": {"type": "array", "data": [...]},
    "trace": {
      "steps": [
        {
          "step": 0,
          "type": "ALGORITHM_START",
          "description": "Human-readable explanation",
          "state": {}, // Algorithm-specific state
          "visualization_hints": {
            "highlight_elements": [2, 5],
            "annotations": [...]
          },
          "decision": {
            "question": "Which comes first?",
            "options": ["A", "B"],
            "correct_answer": "A",
            "explanation": "Because..."
          },
          "prediction_point": true
        }
      ]
    },
    "result": {"type": "array", "data": [...]}
  }
  ```

- **Step Type Taxonomy:**

  - **Universal:** `ALGORITHM_START`, `ALGORITHM_COMPLETE`, `DECISION_POINT`, `STATE_UPDATE`
  - **Namespaced:** `SORT:COMPARISON`, `GRAPH:EDGE_RELAXED`, `INTERVAL:COVERAGE_EXTENDED`

- **Output:** `docs/trace_format_v1.md` (full specification with examples)

**2.3: Backend Registry Design** (0.5 days)

- Sketch `backend/algorithms/base.py`:

  ```python
  from abc import ABC, abstractmethod

  class AlgorithmTracer(ABC):
      @abstractmethod
      def get_metadata(self) -> dict:
          """Return algorithm name, category, version"""
          pass

      @abstractmethod
      def validate_input(self, input_data) -> dict:
          """Validate and normalize input"""
          pass

      @abstractmethod
      def execute(self, input_data) -> dict:
          """Generate trace in universal format"""
          pass

      def _create_step(self, step_num, type, desc, state, **kwargs):
          """Helper for standard step format"""
          pass
  ```

- Sketch `backend/algorithms/registry.py`:

  ```python
  ALGORITHM_REGISTRY = {
      'interval-coverage': IntervalCoverageTracer,
      'merge-sort': MergeSortTracer
  }

  def get_tracer(algorithm_name: str):
      if algorithm_name not in ALGORITHM_REGISTRY:
          raise ValueError(f"Unknown algorithm: {algorithm_name}")
      return ALGORITHM_REGISTRY[algorithm_name]()
  ```

- **Don't implement yet** - just design and document

- **Output:** `docs/backend_registry_design.md`

**2.4: Frontend Registry Design** (0.5 days)

- Sketch `frontend/src/config/algorithmRegistry.js`:

  ```javascript
  export const ALGORITHM_REGISTRY = {
    'interval-coverage': {
      metadata: {
        name: 'Remove Covered Intervals',
        category: 'greedy',
        difficulty: 'medium'
      },
      components: {
        mainVisualization: TimelineView,
        stateVisualization: CallStackView
      },
      predictionEngine: intervalPrediction,
      theme: {
        primaryColor: 'blue',
        accentColor: 'cyan'
      }
    },
    'merge-sort': {
      metadata: {...},
      components: {
        mainVisualization: ArrayBarsView,
        stateVisualization: SortStateView
      },
      predictionEngine: sortingPrediction,
      theme: {
        primaryColor: 'purple',
        accentColor: 'pink'
      }
    }
  };
  ```

- Sketch updated App.jsx (pseudo-code):

  ```javascript
  const algorithmType = trace?.algorithm?.name;
  const config = ALGORITHM_REGISTRY[algorithmType];
  const MainViz = config.components.mainVisualization;
  const StateViz = config.components.stateVisualization;

  return (
    <div>
      <MainViz step={step} />
      <StateViz step={step} />
    </div>
  );
  ```

- **Don't implement yet** - just design and document

- **Output:** `docs/frontend_registry_design.md`

**2.5: Decision Document** (0.5 days)

- **Question:** When to refactor?
- **Answer:** After algorithm #3 (binary search)
- **Rationale:** Need 3 algorithms to see true patterns (Rule of Three)
- Create `docs/refactor_decision.md`:

  ```markdown
  ## Decision: Refactor After Algorithm #3

  ### Why wait?

  - 2 algorithms show similarities, 3 reveal patterns
  - Risk: Over-abstract too early, wrong abstractions
  - Benefit: See sorting + greedy + searching patterns

  ### What to validate with algorithm #3:

  - Does trace format work for searching?
  - Do prediction points map cleanly?
  - What visualization patterns emerge?

  ### Go/No-Go criteria:

  - If algorithm #3 takes >6 hours: Architecture is good enough
  - If <4 hours with current setup: Maybe skip refactor
  ```

### Deliverables

- [ ] `docs/pattern_analysis.md` (duplication report)
- [ ] `docs/trace_format_v1.md` (universal format spec)
- [ ] `docs/backend_registry_design.md` (base class + registry)
- [ ] `docs/frontend_registry_design.md` (component registry)
- [ ] `docs/refactor_decision.md` (when and why)

### Rollback Plan

N/A (documentation only, no code changes)

---

## Phase 3: Add Algorithm #3 (Binary Search) - Before Refactoring

**Duration: 1-2 days**  
**Goal:** Validate current architecture with a third algorithm category (searching)

### Success Criteria

- ✅ Binary search added in <6 hours of coding
- ✅ Works with existing App.jsx structure (minimal changes)
- ✅ Prediction mode works for mid-point comparisons
- ✅ New visualization components render correctly
- ✅ Decision made: Refactor now or wait?

### Tasks

**3.1: Backend - Binary Search Tracer** (1 day)

- Create `backend/algorithms/binary_search.py`
- **Step types:**
  - `INITIAL_STATE` - Array + target
  - `CALCULATE_MID` - Show left, mid, right pointers
  - `COMPARISON` - Prediction point: "Target vs mid element?"
  - `NARROW_LEFT` - Discard right half
  - `NARROW_RIGHT` - Discard left half
  - `FOUND` - Target found at mid
  - `NOT_FOUND` - Search exhausted
- **Example trace step:**

  ```python
  {
      "type": "COMPARISON",
      "description": "Compare target (7) with mid element (9)",
      "data": {
          "array": [1,3,5,7,9,11,13,15],
          "target": 7,
          "left": 0,
          "mid": 4,
          "right": 7,
          "mid_value": 9,
          "correct_answer": "less_than"
      },
      "prediction_point": True
  }
  ```

- **Endpoint:** `POST /api/trace/binary-search` with body `{"array": [...], "target": 7}`

**3.2: Frontend - Search Visualization** (0.5 days)

- Create `ArraySearchView.jsx`:
  - Array with current search range highlighted
  - Left/mid/right pointers shown as arrows
  - Target value displayed prominently
  - Found/not-found indicator
- Create `SearchStateView.jsx`:
  - Current left/mid/right values
  - Comparison history
  - Search space size

**3.3: Prediction Logic** (0.5 days)

- Create `searchPrediction.js`:

  ```javascript
  export const isPredictionPoint = (step) => {
    return step?.type === "COMPARISON";
  };

  export const getOptions = () => {
    return ["less_than", "equal", "greater_than"];
  };
  ```

- Update `PredictionModal` to handle 3-option predictions

**3.4: Integration & Time Tracking** (1 hour)

- Add binary search to algorithm dropdown
- Test with found/not-found cases
- **Track time:** How long did this actually take?
- Document pain points

### Deliverables

- [ ] `backend/algorithms/binary_search.py` (~250 lines)
- [ ] `ArraySearchView.jsx` + `SearchStateView.jsx`
- [ ] `searchPrediction.js`
- [ ] Time log: "Actual time: X hours"
- [ ] Pain points document: "What was hardest?"

### Rollback Plan

**If** takes >8 hours: Stop, analyze bottlenecks, document for Phase 4 refactor.

---

## Phase 4: Universal Architecture Refactor - Apply Learnings

**Duration: 5-7 days**  
**Goal:** Implement registry patterns based on 3-algorithm learnings

**CONDITIONAL:** Only proceed if Phase 3 revealed clear patterns and took >4 hours (proving refactor is worth it).

### Success Criteria

- ✅ Backend uses `AlgorithmTracer` base class
- ✅ Frontend uses component registry
- ✅ All 3 existing algorithms migrated
- ✅ Universal trace format implemented
- ✅ Can add algorithm #4 in <3 hours (proving scalability)
- ✅ Zero regressions in existing features

### Tasks

**4.1: Backend - Universal Trace Format** (2 days)

- Implement `backend/algorithms/base.py`:

  ```python
  class AlgorithmTracer(ABC):
      def __init__(self):
          self.trace = []
          self.step_count = 0

      @abstractmethod
      def get_metadata(self) -> dict:
          """Return {name, category, version}"""
          pass

      @abstractmethod
      def validate_input(self, data: Any) -> dict:
          """Validate input, raise ValueError if invalid"""
          pass

      @abstractmethod
      def execute(self, data: Any) -> dict:
          """Generate trace, return standard format"""
          pass

      def _create_step(self, step_num, step_type, description,
                       state, **kwargs) -> dict:
          """Helper method for consistent step format"""
          return {
              'step': step_num,
              'type': step_type,
              'description': description,
              'state': state,
              'visualization_hints': kwargs.get('hints', {}),
              'decision': kwargs.get('decision'),
              'prediction_point': kwargs.get('prediction_point', False)
          }
  ```

- Implement `backend/algorithms/registry.py`:

  ```python
  from .interval_coverage import IntervalCoverageTracer
  from .merge_sort import MergeSortTracer
  from .binary_search import BinarySearchTracer

  ALGORITHM_REGISTRY = {
      'interval-coverage': IntervalCoverageTracer,
      'merge-sort': MergeSortTracer,
      'binary-search': BinarySearchTracer
  }

  def get_tracer(algorithm_name: str):
      if algorithm_name not in ALGORITHM_REGISTRY:
          raise ValueError(f"Unknown algorithm: {algorithm_name}")
      return ALGORITHM_REGISTRY[algorithm_name]()
  ```

- **Migrate interval coverage tracer:**

  - Inherit from `AlgorithmTracer`
  - Implement required methods
  - Keep existing logic, just wrap in new structure
  - Test: Verify trace output identical

- **Migrate merge sort tracer:**

  - Same process as intervals
  - Test: Verify predictions still work

- **Migrate binary search tracer:**

  - Same process
  - Test: Verify found/not-found cases

- **Update Flask routes:**
  ```python
  @app.route('/api/trace/<algorithm_name>', methods=['POST'])
  def generate_trace(algorithm_name):
      try:
          tracer = get_tracer(algorithm_name)
          validated_input = tracer.validate_input(request.get_json())
          result = tracer.execute(validated_input)
          return jsonify(result), 200
      except ValueError as e:
          return jsonify({'error': str(e)}), 400
  ```

**4.2: Frontend - Algorithm Registry** (2 days)

- Implement `frontend/src/config/algorithmRegistry.js`:

  ```javascript
  import { TimelineView, CallStackView } from "../components/visualizations";
  import {
    ArrayBarsView,
    SortStateView,
  } from "../components/visualizations/sorting";
  import {
    ArraySearchView,
    SearchStateView,
  } from "../components/visualizations/searching";
  import * as intervalPrediction from "../utils/predictions/intervalPrediction";
  import * as sortingPrediction from "../utils/predictions/sortingPrediction";
  import * as searchPrediction from "../utils/predictions/searchPrediction";

  export const ALGORITHM_REGISTRY = {
    "interval-coverage": {
      metadata: {
        name: "Remove Covered Intervals",
        category: "greedy",
        difficulty: "medium",
        description: "Keep only intervals not covered by others",
      },
      components: {
        mainVisualization: TimelineView,
        stateVisualization: CallStackView,
      },
      predictionEngine: intervalPrediction,
      theme: {
        primaryColor: "blue",
        accentColor: "cyan",
      },
    },
    "merge-sort": {
      metadata: {
        name: "Merge Sort",
        category: "sorting",
        difficulty: "medium",
        description: "Divide and conquer sorting",
      },
      components: {
        mainVisualization: ArrayBarsView,
        stateVisualization: SortStateView,
      },
      predictionEngine: sortingPrediction,
      theme: {
        primaryColor: "purple",
        accentColor: "pink",
      },
    },
    "binary-search": {
      metadata: {
        name: "Binary Search",
        category: "searching",
        difficulty: "easy",
        description: "Find target in sorted array",
      },
      components: {
        mainVisualization: ArraySearchView,
        stateVisualization: SearchStateView,
      },
      predictionEngine: searchPrediction,
      theme: {
        primaryColor: "green",
        accentColor: "emerald",
      },
    },
  };

  export function getAlgorithmConfig(algorithmId) {
    const config = ALGORITHM_REGISTRY[algorithmId];
    if (!config) {
      throw new Error(`Unknown algorithm: ${algorithmId}`);
    }
    return config;
  }
  ```

- **Update App.jsx** (make generic):

  ```javascript
  import { getAlgorithmConfig } from "./config/algorithmRegistry";

  function App() {
    const [trace, setTrace] = useState(null);
    const [currentStep, setCurrentStep] = useState(0);

    // Get algorithm type from trace
    const algorithmType = trace?.algorithm?.name;
    const config = algorithmType ? getAlgorithmConfig(algorithmType) : null;

    if (!config) return <LoadingScreen />;

    const step = trace?.trace?.steps?.[currentStep];
    const MainViz = config.components.mainVisualization;
    const StateViz = config.components.stateVisualization;
    const predictionEngine = config.predictionEngine;

    return (
      <div>
        <h1>{config.metadata.name}</h1>
        <MainViz step={step} trace={trace} />
        <StateViz step={step} trace={trace} />

        {predictionEngine.isPredictionPoint(step) && (
          <PredictionModal
            step={step}
            nextStep={trace.trace.steps[currentStep + 1]}
            predictionEngine={predictionEngine}
          />
        )}
      </div>
    );
  }
  ```

- **Update PredictionModal** to use engine interface:
  ```javascript
  const PredictionModal = ({ step, nextStep, predictionEngine }) => {
    const question = predictionEngine.getQuestion(step);
    const options = predictionEngine.getOptions(step);
    const correctAnswer = predictionEngine.getCorrectAnswer(step, nextStep);
    // ... rest of modal logic
  };
  ```

**4.3: Prediction Engine Abstraction** (1 day)

- Create `frontend/src/utils/predictions/basePredictionEngine.js`:

  ```javascript
  export class PredictionEngine {
    isPredictionPoint(step) {
      return step?.prediction_point === true;
    }

    getQuestion(step) {
      return step?.decision?.question || "What happens next?";
    }

    getOptions(step) {
      return step?.decision?.options || [];
    }

    getCorrectAnswer(step, nextStep) {
      return step?.decision?.correct_answer;
    }

    getExplanation(step, userAnswer, correctAnswer) {
      if (userAnswer === correctAnswer) {
        return step?.decision?.explanation || "Correct!";
      }
      return `Incorrect. ${step?.decision?.explanation || ""}`;
    }
  }
  ```

- **Refactor existing prediction utils:**
  - `intervalPrediction.js` - Extend base engine if needed
  - `sortingPrediction.js` - Use standard methods
  - `searchPrediction.js` - Use standard methods

**4.4: Testing & Validation** (1.5 days)

- **Test each algorithm individually:**

  - Interval coverage: All test cases pass
  - Merge sort: Sorting works, predictions work
  - Binary search: Found/not-found, predictions work

- **Test algorithm switching:**

  - Can switch between algorithms without crashes
  - State resets properly between switches
  - Correct visualizations load

- **Test keyboard shortcuts:**

  - Work across all algorithms
  - Prediction modal shortcuts work

- **Performance check:**

  - Load time <3s for each algorithm
  - No memory leaks during switching
  - Smooth 60fps animations

- **Regression testing:**
  - Compare screenshots before/after refactor
  - Verify accuracy tracking unchanged
  - Check completion modal still works

**4.5: Documentation** (0.5 days)

- Update `README.md`:

  - New architecture explanation
  - How to add new algorithms
  - Updated API documentation

- Create `docs/adding_algorithms.md`:

  ```markdown
  # Adding a New Algorithm

  ## Step 1: Backend Tracer (1-2 hours)

  1. Create `backend/algorithms/your_algorithm.py`
  2. Inherit from `AlgorithmTracer`
  3. Implement 3 required methods
  4. Register in `registry.py`

  ## Step 2: Frontend Visualization (1-2 hours)

  1. Create visualization components
  2. Register in `algorithmRegistry.js`
  3. Create prediction engine if needed

  ## Step 3: Test (30 min)

  1. Test with 3-5 inputs
  2. Verify predictions work
  3. Check for console errors
  ```

### Deliverables

- [ ] `backend/algorithms/base.py` (~150 lines)
- [ ] `backend/algorithms/registry.py` (~50 lines)
- [ ] All 3 tracers migrated to new base class
- [ ] `frontend/src/config/algorithmRegistry.js` (~150 lines)
- [ ] Updated App.jsx (generic, ~400 lines)
- [ ] `basePredictionEngine.js` (~100 lines)
- [ ] `docs/adding_algorithms.md`
- [ ] Updated README.md
- [ ] Regression test checklist ✅

### Rollback Plan

**If** refactor breaks features:

1. Use git: `git checkout phase3-complete` (before refactor)
2. Keep refactor in branch: `git branch phase4-refactor-attempt`
3. Document what broke
4. Decide: Fix forward or abandon refactor?

**Stop condition:** If debugging takes >3 days, rollback and keep current architecture.

---

## Phase 5: Algorithm Expansion - Scale to 8-10 Algorithms

**Duration: 8-12 days**  
**Goal:** Prove architecture scales by adding 5-7 more algorithms

**CONDITIONAL:** Only proceed if Phase 4 successful and algorithm #4 takes <3 hours.

### Algorithm Priority List

**Sorting (2 more):**

1. **Quick Sort** (2 days)

   - Partition visualization
   - Pivot selection prediction
   - Partition steps clearly shown

2. **Bubble Sort** (1 day)
   - Simple swap visualization
   - Good for beginners
   - Clear comparison predictions

**Searching (1 more):** 3. **Linear Search** (1 day)

- Simplest algorithm (good for testing)
- Step-by-step array scanning
- Found/not-found predictions

**Graphs (2-3):** 4. **BFS** (2-3 days)

- Queue visualization (important!)
- Level-by-level traversal
- Visited nodes tracking
- New visualization pattern

5. **DFS** (2 days)

   - Stack visualization
   - Backtracking clearly shown
   - Similar to BFS but different order

6. **Dijkstra** (optional, 3 days)
   - Priority queue visualization
   - Edge relaxation predictions
   - Distance table display

**Dynamic Programming (1):** 7. **0/1 Knapsack** (2-3 days)

- 2D DP table visualization
- Cell-by-cell filling
- Take/skip predictions
- New visualization pattern

### Tasks Per Algorithm (Standard Template)

**X.1: Backend Tracer** (1-2 days typical)

- Create `backend/algorithms/<algorithm_name>.py`
- Inherit from `AlgorithmTracer`
- Implement 3 required methods
- Define algorithm-specific step types
- Add prediction points (3-5 per execution)
- Validate inputs
- Register in `registry.py`
- Test with 3-5 example inputs

**X.2: Frontend Visualization** (0.5-1 day typical)

- Create main visualization component
- Create state visualization component
- Style with Tailwind (pick theme color)
- Handle visualization hints from trace
- Add smooth transitions
- Register in `algorithmRegistry.js`

**X.3: Prediction Engine** (0.5 day typical)

- Create prediction utility if logic is unique
- Otherwise use base engine
- Test prediction accuracy

**X.4: Testing** (0.5 day typical)

- Test with 3-5 inputs
- Verify prediction mode works
- Check performance (load time <3s)
- Look for console errors
- Test on mobile (responsive?)

### Success Criteria (Per Algorithm)

- ✅ Trace generated correctly
- ✅ Visualization renders without errors
- ✅ Prediction mode functional
- ✅ Added in <2 days
- ✅ Performance acceptable (<3s load)

### Special Considerations

**Graph Algorithms (BFS, DFS, Dijkstra):**

- **New visualization pattern needed:** Node-edge graphs
- **Options:**
  1. Use CSS Grid for simple graphs (recommended for MVP)
  2. Use D3.js or Cytoscape.js (if graphs complex)
  3. Start simple, upgrade later if needed
- **Decision:** Start with CSS Grid approach:
  ```jsx
  const GraphView = ({ step }) => {
    const nodes = step?.data?.nodes || [];
    const edges = step?.data?.edges || [];

    return (
      <div className="relative w-full h-96">
        {nodes.map((node) => (
          <div
            key={node.id}
            className="absolute bg-blue-500 rounded-full w-12 h-12"
            style={{ left: node.x, top: node.y }}
          >
            {node.value}
          </div>
        ))}
        {edges.map((edge) => (
          <svg className="absolute inset-0">
            <line
              x1={edge.from.x}
              y1={edge.from.y}
              x2={edge.to.x}
              y2={edge.to.y}
              stroke="white"
            />
          </svg>
        ))}
      </div>
    );
  };
  ```

**DP Algorithms (Knapsack):**

- **New pattern:** 2D table visualization
- Use HTML table or CSS Grid
- Animate cell-by-cell filling
- Highlight current cell

### Deliverables

- [ ] 5-7 new algorithm tracers
- [ ] 10-14 new visualization components
- [ ] Updated registry with all algorithms
- [ ] Performance benchmarks (all <3s load time)
- [ ] Time logs: "Algorithm X took Y hours"

### Rollback Plan

**If** any algorithm takes >4 days:

1. Pause expansion
2. Analyze: What took so long?
3. Options:
   - Simplify algorithm scope
   - Improve tooling/templates
   - Skip complex algorithms for v1.0

**Stop condition:** If 3+ algorithms take >2.5 days each, stop expansion and move to Phase 6 with fewer algorithms.

---

## Phase 6: Production Polish & Deployment

**Duration: 5-7 days**  
**Goal:** Deploy to GCP and polish for real users

### Success Criteria

- ✅ All algorithms load in <3s
- ✅ Mobile-responsive design
- ✅ Deployed to GCP Cloud Run + Firebase/Cloud Storage
- ✅ Error handling for all edge cases
- ✅ Analytics tracking usage
- ✅ User guide / tutorial exists

### Tasks

**6.1: Performance Optimization** (2 days)

- **React optimization:**

  - Add React.memo to expensive components
  - Implement virtualization for traces >100 steps
  - Lazy-load visualization components
  - Optimize re-renders with useCallback/useMemo

- **Backend optimization:**

  - Add caching for common inputs (Redis optional)
  - Optimize trace generation (profile with cProfile)
  - Add gzip compression for API responses

- **Measure:**
  - Lighthouse score >90
  - Time to Interactive <3s
  - First Contentful Paint <1.5s

**6.2: UX Polish** (2 days)

- **Algorithm selection page:**

  - Grid of algorithm cards
  - Difficulty badges (Easy/Medium/Hard)
  - Category filters (Sorting/Searching/Graphs/DP)
  - Search box

- **Mobile responsiveness:**

  - Test on iPhone/Android
  - Stack visualizations vertically on mobile
  - Ensure touch targets >44px
  - Test keyboard on mobile

- **Accessibility:**

  - Add ARIA labels to buttons
  - Keyboard navigation works everywhere
  - Screen reader support (basic)
  - Color contrast meets WCAG AA

- **Polish:**
  - Add loading skeletons
  - Smooth page transitions
  - Better error messages
  - Add tooltips to controls

**6.3: Deployment to GCP** (2 days)

**Backend (Cloud Run):**

- Create `Dockerfile`:

  ```dockerfile
  FROM python:3.11-slim
  WORKDIR /app
  COPY requirements.txt .
  RUN pip install --no-cache-dir -r requirements.txt
  COPY . .
  CMD gunicorn -w 4 -b 0.0.0.0:$PORT app:app
  ```

- Deploy steps:

  ```bash
  # Build and push image
  gcloud builds submit --tag gcr.io/PROJECT_ID/algoviz-backend

  # Deploy to Cloud Run
  gcloud run deploy algoviz-backend \
    --image gcr.io/PROJECT_ID/algoviz-backend \
    --platform managed \
    --region us-central1 \
    --allow-unauthenticated
  ```

- **Cost estimate:** ~$5-10/month for low traffic

**Frontend (Firebase Hosting or Cloud Storage + CDN):**

- Build production bundle:

  ```bash
  cd frontend
  REACT_APP_API_URL=https://your-backend-url.run.app npm run build
  ```

- Deploy to Firebase:

  ```bash
  firebase init hosting
  firebase deploy
  ```

- **Alternative:** Cloud Storage + Cloud CDN (cheaper)
- **Cost estimate:** ~$1-3/month

- **Configure:**
  - Set CORS on backend for frontend domain
  - Set up custom domain (optional)
  - Enable HTTPS

**6.4: Monitoring & Analytics** (1 day)

- **Frontend:**

  - Add Google Analytics or Plausible (privacy-friendly)
  - Track: Algorithm usage, prediction accuracy, completion rate
  - Custom events: "algorithm_started", "prediction_made", "completed"

- **Backend:**

  - Add logging with Python `logging` module
  - Set up Cloud Logging (free tier)
  - Monitor: Request count, error rate, latency

- **Error tracking:**
  - Optional: Sentry for error monitoring
  - Or use Cloud Error Reporting (free)

**6.5: Documentation & Tutorial** (1 day)

- **User guide:**

  - How to use the app
  - Keyboard shortcuts
  - Tips for learning algorithms

- **Tutorial mode:**

  - Optional: Add "🎓 Tutorial" button
  - Walks through one algorithm step-by-step
  - Explains prediction mode

- **README updates:**
  - Deployment instructions
  - Architecture diagram
  - Contributing guide

### Deliverables

- [ ] Dockerfile + deployment scripts
- [ ] Backend deployed to Cloud Run
- [ ] Frontend deployed to Firebase/Cloud Storage
- [ ] Analytics dashboard configured
- [ ] User guide written
- [ ] Performance audit report (Lighthouse >90)
- [ ] Monitoring dashboard

### Rollback Plan

**If** deployment fails:

- Keep local development working
- Document deployment issues
- Use staging environment for iteration
- Fall back to Heroku/Vercel if GCP too complex

---

## Decision Tree & Stop Conditions

```
START
  ↓
PHASE 1: Add Merge Sort (4-6 days)
  ├─ Success (<6 days, works) → PHASE 2
  ├─ Partial (6-8 days, messy) → Document issues → PHASE 2
  └─ Failure (>8 days) → STOP, analyze POC scalability

PHASE 2: Pattern Analysis (2-3 days)
  ├─ Clear patterns → PHASE 3
  └─ Unclear patterns → Add algorithm #3 → Re-analyze

PHASE 3: Add Binary Search (1-2 days)
  ├─ Added in <6 hours → Skip refactor, add more algorithms
  ├─ Added in 6-12 hours → PHASE 4 (refactor justified)
  └─ Takes >12 hours → PHASE 4 (definitely need better architecture)

PHASE 4: Universal Refactor (5-7 days)
  ├─ Success, tests pass → PHASE 5
  ├─ Minor issues → Iterate → PHASE 5
  └─ Major breakage (>3 days debugging) → ROLLBACK, keep current

PHASE 5: Add Algorithm #4 (1-2 days)
  ├─ Added in <3 hours → Continue expansion (algorithms 5-10)
  ├─ Takes 3-6 hours → Optimize tooling → Continue
  └─ Takes >6 hours → STOP expansion, go to PHASE 6 with current algorithms

PHASE 5: Algorithm Expansion (8-12 days)
  ├─ Each algorithm <2 days → Continue
  ├─ Algorithms taking 2-3 days → Slow down, improve process
  └─ Any algorithm >4 days → PAUSE, analyze bottleneck

PHASE 6: Production Polish (5-7 days)
  ├─ Deploy successful → LAUNCH
  └─ Deployment issues → Iterate, use alternative platform
```

### Explicit Stop Conditions

**STOP Phase 1 if:**

- Merge sort takes >10 days total
- Can't achieve working visualization after 8 days
- Motivation lost (solo project risk)

**STOP Phase 3 if:**

- Binary search takes >3 days
- Patterns still unclear after 3 algorithms
- Technical debt too high to continue

**STOP Phase 4 if:**

- Refactor debugging exceeds 4 days
- Tests don't pass after 1 week
- Performance degrades >50%

**STOP Phase 5 if:**

- 3+ algorithms take >3 days each
- Total time exceeds 15 days for expansion
- Visualization complexity unmanageable

**PAUSE any phase if:**

- Losing motivation (solo project)
- Other priorities emerge
- Technical blocker can't be resolved in 2 days

---

## Risk Mitigation Summary

| Risk                              | Likelihood | Impact | Mitigation                                              |
| --------------------------------- | ---------- | ------ | ------------------------------------------------------- |
| Over-abstracting too early        | Medium     | High   | Wait for algorithm #3 data, document in Phase 2         |
| Visualization complexity (graphs) | High       | Medium | Start with CSS Grid, upgrade to D3 only if needed       |
| Solo developer burnout            | Medium     | High   | Set realistic timelines, celebrate milestones           |
| Performance issues                | Low        | Medium | Profile each phase, set <3s load requirement            |
| Scope creep                       | High       | Medium | Cap at 8-10 algorithms for v1.0                         |
| Deployment complexity             | Medium     | Low    | Use Cloud Run (simpler than GKE), Firebase Hosting      |
| Time investment too high          | Medium     | High   | Stop conditions defined, can ship with fewer algorithms |

---

## Success Metrics

### Minimum Viable Success (4-5 weeks)

**Phases 1-4 Complete:**

- ✅ 3 algorithms working (intervals, merge sort, binary search)
- ✅ Universal architecture implemented
- ✅ Can add algorithm #4 in <3 hours
- ✅ Prediction mode works consistently

### Target Success (6-8 weeks)

**Phases 1-5 Complete:**

- ✅ 6-8 algorithms across 3+ categories
- ✅ Architecture proven to scale
- ✅ All core features polished
- ✅ Ready for deployment

### Stretch Goals (10-12 weeks)

**All Phases Complete:**

- ✅ 8-10 algorithms
- ✅ Deployed to GCP
- ✅ Mobile-responsive
- ✅ Analytics tracking
- ✅ User guide complete

---

## Scope Boundaries

### In Scope (v1.0)

- ✅ 6-10 core algorithms (sorting, searching, basic graphs, 1 DP)
- ✅ Backend trace generation
- ✅ Interactive prediction mode
- ✅ Keyboard navigation
- ✅ Accuracy tracking
- ✅ Single-user experience
- ✅ Responsive design (desktop + mobile)

### Out of Scope (Future)

- ❌ User accounts / save progress → v1.1
- ❌ Shareable URLs → v1.1
- ❌ Custom algorithm input → v1.2
- ❌ Side-by-side comparison → v1.2
- ❌ Advanced animations → v1.1
- ❌ Multi-language support → v2.0
- ❌ LLM explanations → Not planned
- ❌ Complex graph algorithms (Bellman-Ford, Floyd-Warshall) → v2.0

---

## Next Steps

### Immediate Actions (This Week)

1. **Set up Phase 1:**

   ```bash
   git checkout -b phase1-merge-sort
   mkdir backend/algorithms/merge_sort.py
   ```

2. **Design merge sort trace:**

   - Sketch 5-10 example steps on paper
   - Define step types
   - Plan prediction points

3. **Create backend skeleton:**

   ```python
   # backend/algorithms/merge_sort.py
   class MergeSortTracer:
       def sort_with_trace(self, array):
           # TODO: Implement
           pass
   ```

4. **Set timer:** Track how long Phase 1 actually takes

### First Validation Checkpoint (End of Phase 1)

**Questions:**

1. Did merge sort take <6 days? ✅/❌
2. Can we switch algorithms without major App.jsx changes? ✅/❌
3. Is trace format similar enough to intervals? ✅/❌
4. Does prediction mode work for comparisons? ✅/❌

**Decision:**

- **If 3+ yes:** Proceed to Phase 2 confidently
- **If 2 yes:** Proceed but document concerns
- **If 0-1 yes:** Stop, analyze what went wrong

---

## Quality Checklist (Before Each Phase)

- [ ] Git commits at phase boundaries
- [ ] README updated
- [ ] No console errors
- [ ] Performance <3s load time
- [ ] Tests pass (or test plan written)
- [ ] Can demo to friend/colleague
- [ ] Rollback tested (git checkout works)
- [ ] Motivation check: Still excited? ✅

---

**Total Estimated Time:** 22-35 days (4.5-7 weeks)  
**Solo Developer:** You  
**Confidence:** High (75%) for Phases 1-4, Medium (65%) for Phases 5-6

**Go/No-Go:** End of Phase 1 (merge sort). If >8 days, reassess entire approach.

**Remember:** This is a personal learning project. Ship with 5 algorithms is better than perfect 10 algorithms that never ships. Quality over quantity.
