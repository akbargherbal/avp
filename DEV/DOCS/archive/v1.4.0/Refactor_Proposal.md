# Refactoring Analysis: From Single-Algorithm POC to Multi-Algorithm Educational Platform

## Executive Summary

This report analyzes the Interval Coverage Visualization tool and proposes architectural refactorings to support multiple algorithms while preserving the core philosophy: **"Backend does ALL the thinking, frontend does ALL the reacting."** The analysis identifies clean abstraction points, algorithm-specific adaptations, and a phased migration strategy.

---

## Core Philosophy & Constraints

**Must Preserve:**

1. **Complete backend trace generation** - No algorithmic logic in frontend
2. **Active learning features** - Prediction mode, visual highlighting, educational descriptions
3. **Deterministic, replayable traces** - Frontend is a pure view layer
4. **Educational focus** - Teaching algorithm strategy, not just mechanics

**Must Accommodate:**

- Different data structures (graphs, trees, arrays, strings)
- Different visualization needs (timeline vs. tree vs. network)
- Algorithm-specific prediction points and decisions
- Varying complexity (sorting vs. dynamic programming vs. graph traversal)

---

## Section 1: Algorithm Classification & Visualization Patterns

### 1.1 Algorithm Categories

Different algorithms require fundamentally different visualization approaches:

| Category                     | Examples                             | Visualization Type     | Key Challenge                           |
| ---------------------------- | ------------------------------------ | ---------------------- | --------------------------------------- |
| **Linear/Sequential**        | Sorting, searching, two-pointers     | Timeline/array view    | State changes over linear structure     |
| **Recursive/Divide-Conquer** | Merge sort, quicksort, binary search | Call tree + array view | Visualizing recursion depth             |
| **Graph Traversal**          | DFS, BFS, Dijkstra                   | Network graph view     | Node/edge state transitions             |
| **Dynamic Programming**      | Knapsack, LCS, edit distance         | Table/matrix view      | Cell dependencies and computation order |
| **Tree Algorithms**          | Tree traversal, BST operations       | Tree diagram           | Parent-child relationships              |
| **Greedy**                   | Interval coverage (current), Huffman | Custom domain view     | Decision points and local choices       |
| **Backtracking**             | N-Queens, Sudoku                     | State space tree       | Exploration and pruning                 |

**Key Insight:** The current POC is a **Greedy + Recursive** algorithm with a **Timeline + Call Stack** visualization. This is actually a _complex_ starting point that touches multiple patterns.

### 1.2 Visualization Components Needed

```
Current POC Uses:
├─ TimelineView (domain-specific: intervals on timeline)
└─ CallStackView (generic: recursive calls)

Future Needs:
├─ ArrayView (sorting, searching, two-pointers)
├─ GraphView (network nodes and edges)
├─ TreeView (hierarchical structures)
├─ MatrixView (DP tables, grids)
├─ StateSpaceView (backtracking exploration)
└─ CallStackView (reusable across recursive algorithms)
```

---

## Section 2: Core Abstraction - Algorithm Tracer Base Class

### 2.1 Proposed Base Tracer Architecture

```python
# backend/algorithms/base_tracer.py
from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional
from dataclasses import dataclass, asdict
import time

@dataclass
class TraceStep:
    """Universal step structure across all algorithms."""
    step: int
    type: str  # Algorithm can define custom types
    timestamp: float
    data: dict  # Algorithm-specific data
    description: str
    visualization_hint: Optional[str] = None  # e.g., "highlight_node", "update_cell"

class AlgorithmTracer(ABC):
    """
    Base class for all algorithm tracers.

    Philosophy: Backend generates complete execution trace,
    frontend visualizes without algorithmic logic.
    """

    MAX_STEPS = 10000  # Safety limit

    def __init__(self):
        self.trace: List[TraceStep] = []
        self.step_count = 0
        self.start_time = time.time()
        self.metadata: Dict[str, Any] = {}

    def _add_step(self, step_type: str, data: dict, description: str,
                  visualization_hint: Optional[str] = None):
        """Record a step with complete state."""
        if self.step_count >= self.MAX_STEPS:
            raise RuntimeError(f"Exceeded {self.MAX_STEPS} steps")

        # Enrich with algorithm-specific state
        enriched_data = self._enrich_step_data(data)

        self.trace.append(TraceStep(
            step=self.step_count,
            type=step_type,
            timestamp=time.time() - self.start_time,
            data=enriched_data,
            description=description,
            visualization_hint=visualization_hint
        ))
        self.step_count += 1

    @abstractmethod
    def _enrich_step_data(self, data: dict) -> dict:
        """
        Add algorithm-specific state to each step.
        E.g., current array state, graph node colors, DP table.
        """
        pass

    @abstractmethod
    def execute(self, input_data: Any) -> dict:
        """
        Execute algorithm and return:
        {
            "result": ...,
            "trace": {"steps": [...], "total_steps": N, "duration": T},
            "metadata": {"algorithm": "...", "visualization_type": "..."}
        }
        """
        pass

    @abstractmethod
    def get_prediction_points(self) -> List[Dict[str, Any]]:
        """
        Return list of steps where predictions can be made.
        Each entry: {"step_index": N, "question": "...", "choices": [...]}
        """
        pass

    def _finalize_trace(self, result: Any) -> dict:
        """Standard trace response format."""
        return {
            "result": result,
            "trace": {
                "steps": [asdict(s) for s in self.trace],
                "total_steps": len(self.trace),
                "duration": time.time() - self.start_time
            },
            "metadata": {
                **self.metadata,
                "prediction_points": self.get_prediction_points()
            }
        }
```

### 2.2 Migration: Refactor Current IntervalCoverageTracer

```python
# backend/algorithms/interval_coverage.py
from .base_tracer import AlgorithmTracer

class IntervalCoverageTracer(AlgorithmTracer):
    """Inherits trace infrastructure, focuses on domain logic."""

    def __init__(self):
        super().__init__()
        self.call_stack = []
        self.interval_states = {}
        self.original_intervals = []
        self.metadata = {
            "algorithm": "remove-covered-intervals",
            "visualization_type": "timeline_and_callstack"
        }

    def _enrich_step_data(self, data: dict) -> dict:
        """Add interval-specific visualization state."""
        return {
            **data,
            'all_intervals': self._get_all_intervals_with_state(),
            'call_stack_state': self._get_call_stack_state()
        }

    def execute(self, input_data: List[Interval]) -> dict:
        """Main entry point - was remove_covered_intervals()."""
        # ... existing logic, but now calls _finalize_trace() at end
        result = self._filter_recursive(sorted_intervals, float('-inf'))
        return self._finalize_trace([asdict(i) for i in result])

    def get_prediction_points(self) -> List[Dict[str, Any]]:
        """Identify EXAMINING_INTERVAL steps as prediction points."""
        return [
            {
                "step_index": i,
                "question": f"Will interval ({step.data['interval']['start']}, {step.data['interval']['end']}) be kept or covered?",
                "choices": ["keep", "covered"],
                "hint": "Compare interval.end with max_end"
            }
            for i, step in enumerate(self.trace)
            if step.type == "EXAMINING_INTERVAL"
        ]
```

**Benefits:**

- ✅ Minimal changes to existing code
- ✅ Clear separation of concerns (trace infrastructure vs. domain logic)
- ✅ Reusable patterns for new algorithms

---

## Section 3: Frontend Abstraction - Visualization Registry

### 3.1 Component Registry Pattern

```javascript
// frontend/src/visualizations/registry.js
import TimelineView from "./TimelineView";
import ArrayView from "./ArrayView";
import GraphView from "./GraphView";
import MatrixView from "./MatrixView";
import TreeView from "./TreeView";

const VISUALIZATION_REGISTRY = {
  timeline_and_callstack: {
    primary: TimelineView,
    secondary: CallStackView,
    layout: "side-by-side",
  },
  array: {
    primary: ArrayView,
    secondary: null,
    layout: "centered",
  },
  graph: {
    primary: GraphView,
    secondary: null,
    layout: "centered",
  },
  dp_table: {
    primary: MatrixView,
    secondary: null,
    layout: "centered",
  },
  tree: {
    primary: TreeView,
    secondary: null,
    layout: "centered",
  },
};

export const getVisualizationComponents = (visualizationType) => {
  return (
    VISUALIZATION_REGISTRY[visualizationType] || VISUALIZATION_REGISTRY["array"]
  );
};
```

### 3.2 Algorithm-Agnostic App Component

```javascript
// frontend/src/App.jsx (refactored)
import { getVisualizationComponents } from "./visualizations/registry";

const AlgorithmTracePlayer = () => {
  const { trace, loading, error } = useTraceLoader();

  // Extract visualization type from metadata
  const visualizationType = trace?.metadata?.visualization_type || "array";
  const {
    primary: PrimaryView,
    secondary: SecondaryView,
    layout,
  } = getVisualizationComponents(visualizationType);

  // ... existing hooks (navigation, prediction, keyboard)

  return (
    <div className="w-full h-screen bg-slate-900">
      {/* Generic controls - work for all algorithms */}
      <ControlBar {...navigationProps} />

      {/* Dynamic visualization based on algorithm */}
      <div className={`visualization-container layout-${layout}`}>
        <PrimaryView step={currentStepData} {...visualProps} />
        {SecondaryView && (
          <SecondaryView step={currentStepData} {...visualProps} />
        )}
      </div>

      {/* Generic prediction modal - questions from backend */}
      <PredictionModal {...predictionProps} />
    </div>
  );
};
```

**Key Changes:**

- ✅ No hardcoded TimelineView - selected dynamically
- ✅ Layout adapts to visualization needs (side-by-side vs. centered)
- ✅ All algorithm-specific logic is in backend trace data

---

## Section 4: Prediction Mode Generalization

### 4.1 Backend: Declarative Prediction Points

Current approach (hardcoded in frontend):

```javascript
// ❌ Frontend knows algorithm semantics
const isPredictionPoint = (step) => {
  return step?.type === "EXAMINING_INTERVAL" && step?.data?.comparison;
};
```

**Refactored approach (backend declares):**

```python
# Backend explicitly marks prediction points in trace
def get_prediction_points(self) -> List[Dict[str, Any]]:
    """Algorithm defines its own prediction points."""
    return [
        {
            "step_index": i,
            "question": "Will this interval be kept?",
            "choices": ["keep", "covered"],
            "hint": "Compare interval.end with max_end",
            "correct_answer_step": i + 1  # Next step has answer
        }
        for i, step in enumerate(self.trace)
        if step.type == "EXAMINING_INTERVAL"
    ]
```

```javascript
// Frontend becomes generic
const predictionPoints = trace?.metadata?.prediction_points || [];

const isPredictionPoint = (stepIndex) => {
  return predictionPoints.some((p) => p.step_index === stepIndex);
};

const getPredictionQuestion = (stepIndex) => {
  return predictionPoints.find((p) => p.step_index === stepIndex);
};
```

### 4.2 Example: Sorting Algorithm Predictions

```python
# backend/algorithms/merge_sort.py
class MergeSortTracer(AlgorithmTracer):
    def get_prediction_points(self):
        return [
            {
                "step_index": i,
                "question": f"Which element comes first: {step.data['left']} or {step.data['right']}?",
                "choices": [str(step.data['left']), str(step.data['right'])],
                "hint": "Compare the two values",
                "correct_answer_step": i + 1
            }
            for i, step in enumerate(self.trace)
            if step.type == "MERGE_COMPARE"
        ]
```

**Benefits:**

- ✅ Each algorithm defines its own "teachable moments"
- ✅ Frontend prediction logic is fully generic
- ✅ No frontend changes when adding new algorithms

---

## Section 5: Example Algorithms & Migration Complexity

### 5.1 Complexity Matrix

| Algorithm         | Visualization           | Prediction Points    | Migration Effort      | Notes                            |
| ----------------- | ----------------------- | -------------------- | --------------------- | -------------------------------- |
| **Bubble Sort**   | ArrayView               | Swap decisions       | 🟢 Low (2-3 hours)    | Simple state, clear predictions  |
| **Binary Search** | ArrayView               | Mid-point decisions  | 🟢 Low (2-3 hours)    | Linear structure, few states     |
| **Merge Sort**    | ArrayView + CallStack   | Merge comparisons    | 🟡 Medium (4-6 hours) | Recursive like current POC       |
| **Dijkstra's**    | GraphView               | Next-node selection  | 🔴 High (8-12 hours)  | New visualization type           |
| **Knapsack DP**   | MatrixView              | Include/exclude item | 🔴 High (10-15 hours) | New visualization, complex state |
| **DFS/BFS**       | GraphView + Queue/Stack | Next-node choice     | 🟡 Medium (5-8 hours) | New viz, but clear structure     |

### 5.2 Sample: Binary Search Tracer

```python
# backend/algorithms/binary_search.py
from .base_tracer import AlgorithmTracer

class BinarySearchTracer(AlgorithmTracer):
    def __init__(self):
        super().__init__()
        self.metadata = {
            "algorithm": "binary-search",
            "visualization_type": "array"
        }

    def _enrich_step_data(self, data: dict) -> dict:
        """Add array state with highlight regions."""
        return {
            **data,
            "array_state": {
                "elements": self.array,
                "highlight": {
                    "left": data.get("left"),
                    "right": data.get("right"),
                    "mid": data.get("mid")
                }
            }
        }

    def execute(self, arr: List[int], target: int) -> dict:
        self.array = arr
        result = self._search(0, len(arr) - 1, target)
        return self._finalize_trace(result)

    def _search(self, left: int, right: int, target: int) -> Optional[int]:
        if left > right:
            self._add_step("BASE_CASE", {"left": left, "right": right},
                          "Search space exhausted - target not found")
            return None

        mid = (left + right) // 2
        self._add_step("CALCULATE_MID", {"left": left, "right": right, "mid": mid},
                      f"Calculate midpoint: ({left} + {right}) // 2 = {mid}")

        self._add_step("COMPARE",
                      {"mid": mid, "value": self.array[mid], "target": target},
                      f"Compare arr[{mid}]={self.array[mid]} with target={target}")

        if self.array[mid] == target:
            self._add_step("FOUND", {"index": mid, "value": self.array[mid]},
                          f"✅ Found target at index {mid}")
            return mid
        elif self.array[mid] < target:
            self._add_step("GO_RIGHT", {"new_left": mid + 1, "right": right},
                          f"arr[{mid}] < target → search right half")
            return self._search(mid + 1, right, target)
        else:
            self._add_step("GO_LEFT", {"left": left, "new_right": mid - 1},
                          f"arr[{mid}] > target → search left half")
            return self._search(left, mid - 1, target)

    def get_prediction_points(self):
        return [
            {
                "step_index": i,
                "question": f"arr[{step.data['mid']}]={step.data['value']} vs target={step.data['target']}: which direction?",
                "choices": ["left", "right", "found"],
                "hint": "Compare midpoint value with target"
            }
            for i, step in enumerate(self.trace)
            if step.type == "COMPARE"
        ]
```

**Frontend:** No changes needed! ArrayView + generic prediction logic handles it.

---

## Section 6: Visual Highlighting Generalization

### 6.1 Current State (Hardcoded for Intervals)

```javascript
// ❌ Tightly coupled to interval domain
const activeCall = callStack[callStack.length - 1];
const highlightedIntervalId = activeCall?.current_interval?.id;
```

### 6.2 Refactored: Generic Highlight System

```python
# Backend: Include highlight hints in trace
self._add_step("COMPARE",
    {
        "mid": mid,
        "highlights": {  # Generic highlight structure
            "primary": mid,  # Main focus
            "secondary": [left, right],  # Context
            "type": "index"  # or "node_id", "cell", "interval_id"
        }
    },
    "Comparing midpoint with target"
)
```

```javascript
// Frontend: Generic highlight extraction
const useVisualHighlight = (trace, currentStep) => {
  const [highlight, setHighlight] = useState(null);

  useEffect(() => {
    const step = trace?.trace?.steps?.[currentStep];
    const highlights = step?.data?.highlights;

    if (highlights) {
      setHighlight({
        primary: highlights.primary,
        secondary: highlights.secondary || [],
        type: highlights.type,
      });
    } else {
      setHighlight(null);
    }
  }, [currentStep, trace]);

  return highlight;
};
```

**Benefits:**

- ✅ Works for any data structure (array indices, graph nodes, tree nodes, matrix cells)
- ✅ No algorithm-specific logic in frontend
- ✅ Backend controls what gets highlighted

---

## Section 7: Step Type Badges & Descriptions

### 7.1 Algorithm-Specific Badge Categories

Current system has 7 hardcoded badge types. Make this configurable:

```python
# Backend: Algorithm defines its badge categories
class BinarySearchTracer(AlgorithmTracer):
    STEP_TYPES = {
        "CALCULATE_MID": {
            "badge": "🎯 COMPUTE",
            "color": "blue",
            "category": "computation"
        },
        "COMPARE": {
            "badge": "⚖️ COMPARE",
            "color": "yellow",
            "category": "decision"
        },
        "GO_LEFT": {
            "badge": "⬅️ BRANCH",
            "color": "purple",
            "category": "recursion"
        },
        # ... more types
    }

    def _finalize_trace(self, result):
        return {
            **super()._finalize_trace(result),
            "metadata": {
                **self.metadata,
                "step_types": self.STEP_TYPES  # Include in trace
            }
        }
```

```javascript
// Frontend: Dynamic badge rendering
const getStepBadge = (stepType, trace) => {
  const stepTypes = trace?.metadata?.step_types || {};
  const config = stepTypes[stepType];

  if (!config) {
    return { label: stepType, color: "bg-slate-600" };
  }

  return {
    label: config.badge,
    color: BADGE_COLORS[config.color] || "bg-slate-600",
  };
};
```

### 7.2 Educational Description Templates

```python
# Backend: Use template system for descriptions
class DescriptionTemplate:
    TEMPLATES = {
        "compare": "Compare {a} with {b}: {a} {op} {b} → {action}",
        "update": "Update {variable} from {old} → {new}",
        "branch": "Since {condition}, we {action}",
        # ... more templates
    }

    @staticmethod
    def format(template_name: str, **kwargs) -> str:
        template = DescriptionTemplate.TEMPLATES[template_name]
        return template.format(**kwargs)

# Usage in tracer
self._add_step("COMPARE",
    {"mid": mid, "value": arr[mid], "target": target},
    DescriptionTemplate.format("compare",
        a=f"arr[{mid}]", b=f"target",
        op="<" if arr[mid] < target else ">",
        action="search right" if arr[mid] < target else "search left")
)
```

---

## Section 8: Algorithm Selection & Multi-Algorithm UI

### 8.1 Algorithm Registry

```python
# backend/app.py
from algorithms.interval_coverage import IntervalCoverageTracer
from algorithms.binary_search import BinarySearchTracer
from algorithms.merge_sort import MergeSortTracer

ALGORITHM_REGISTRY = {
    "interval-coverage": {
        "tracer": IntervalCoverageTracer,
        "name": "Remove Covered Intervals",
        "category": "Greedy",
        "difficulty": "Medium",
        "input_schema": {
            "type": "intervals",
            "description": "List of time intervals"
        }
    },
    "binary-search": {
        "tracer": BinarySearchTracer,
        "name": "Binary Search",
        "category": "Divide & Conquer",
        "difficulty": "Easy",
        "input_schema": {
            "type": "array_and_target",
            "description": "Sorted array and target value"
        }
    },
    # ... more algorithms
}

@app.route('/api/algorithms', methods=['GET'])
def list_algorithms():
    """Return available algorithms."""
    return jsonify({
        "algorithms": [
            {
                "id": algo_id,
                "name": info["name"],
                "category": info["category"],
                "difficulty": info["difficulty"]
            }
            for algo_id, info in ALGORITHM_REGISTRY.items()
        ]
    })

@app.route('/api/trace/<algorithm_id>', methods=['POST'])
def generate_trace(algorithm_id):
    """Generate trace for specified algorithm."""
    if algorithm_id not in ALGORITHM_REGISTRY:
        return jsonify({"error": "Algorithm not found"}), 404

    tracer_class = ALGORITHM_REGISTRY[algorithm_id]["tracer"]
    tracer = tracer_class()

    # Parse input based on algorithm's schema
    input_data = parse_input(request.json, algorithm_id)
    result = tracer.execute(input_data)

    return jsonify(result)
```

### 8.2 Frontend: Algorithm Selector

```javascript
// frontend/src/components/AlgorithmSelector.jsx
const AlgorithmSelector = ({ onSelect }) => {
  const [algorithms, setAlgorithms] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/algorithms`)
      .then((r) => r.json())
      .then((data) => setAlgorithms(data.algorithms));
  }, []);

  return (
    <div className="algorithm-selector">
      <h2>Choose an Algorithm to Visualize</h2>
      <div className="grid grid-cols-3 gap-4">
        {algorithms.map((algo) => (
          <AlgorithmCard
            key={algo.id}
            algorithm={algo}
            onClick={() => onSelect(algo.id)}
          />
        ))}
      </div>
    </div>
  );
};
```

---

## Section 9: Phased Migration Plan

### Phase 1: Infrastructure (2-3 weeks)

**Goal:** Establish abstractions without breaking current POC

1. **Week 1: Backend Abstraction**

   - Create `AlgorithmTracer` base class
   - Refactor `IntervalCoverageTracer` to inherit from base
   - Add `get_prediction_points()` method
   - Test: Ensure POC still works identically

2. **Week 2: Frontend Registry**

   - Create visualization registry system
   - Extract `TimelineView` and `CallStackView` as registered components
   - Make `App.jsx` use registry (but only with one algorithm)
   - Test: POC should be unchanged

3. **Week 3: Generalize Prediction & Highlighting**
   - Move prediction detection to backend metadata
   - Refactor highlight system to use generic `highlights` structure
   - Update frontend to consume generic structures
   - Test: POC still works with new plumbing

**Deliverable:** POC works identically, but infrastructure is now generic.

### Phase 2: First New Algorithm (1-2 weeks)

**Goal:** Validate abstractions with a simple algorithm

4. **Week 4-5: Add Binary Search**
   - Implement `BinarySearchTracer(AlgorithmTracer)`
   - Create `ArrayView` component
   - Test end-to-end with algorithm selector
   - Document any abstraction gaps discovered

**Deliverable:** Two working algorithms with shared infrastructure.

### Phase 3: Expand Algorithm Library (ongoing)

**Goal:** Add 2-3 algorithms per sprint

5. **Priority Queue:**

   - Simple algorithms (sorting, searching) - 2-3 hours each
   - Medium algorithms (recursive, tree) - 4-6 hours each
   - Complex algorithms (graph, DP) - 8-15 hours each

6. **New Visualizations:**
   - `GraphView` for graph algorithms
   - `MatrixView` for DP tables
   - `TreeView` for tree structures

### Phase 4: Polish & Pedagogical Features (2-3 weeks)

7. **Enhanced Learning Features:**
   - Algorithm comparison mode (side-by-side)
   - Difficulty progression (auto-suggest next algorithm)
   - Shareable traces with unique URLs
   - Export as PDF/slides for teaching

---

## Section 10: Recommendations & Trade-offs

### 10.1 Recommended Approach

**Strategy: Evolutionary Refactoring**

- ✅ Preserve working POC throughout migration
- ✅ Add abstractions incrementally
- ✅ Test each change with existing algorithm
- ✅ Add second algorithm to validate abstractions
- ✅ Then scale to more algorithms

**Why This Works:**

- Low risk (POC never breaks)
- Validates abstractions early (with 2nd algorithm)
- Allows learning from each algorithm's unique needs
- Maintains educational quality throughout

### 10.2 Key Design Decisions

| Decision                    | Option A             | Option B          | Recommendation                                                                       |
| --------------------------- | -------------------- | ----------------- | ------------------------------------------------------------------------------------ |
| **Trace Format**            | Custom per algorithm | Unified schema    | **Unified with algorithm-specific `data` field** - Balance flexibility & consistency |
| **Visualization Selection** | Frontend hardcoded   | Backend declares  | **Backend declares** - Honors "backend thinks" philosophy                            |
| **Prediction Points**       | Frontend detects     | Backend specifies | **Backend specifies** - Each algorithm knows its teachable moments                   |
| **Component Sharing**       | Minimal (isolated)   | Maximum (shared)  | **Pragmatic sharing** - Reuse CallStack, but custom domain views                     |

### 10.3 Potential Pitfalls

1. **Over-abstraction:** Don't force all algorithms into same mold

   - **Mitigation:** Allow algorithm-specific data/visualizations within unified framework

2. **Visualization complexity:** Some algorithms need novel visual metaphors

   - **Mitigation:** Make visualization system extensible, not restrictive

3. **Prediction quality:** Not all algorithms have clear "decision points"

   - **Mitigation:** Make predictions optional (some algorithms in "watch-only" mode)

4. **Performance:** Complex algorithms (large graphs) may generate huge traces
   - **Mitigation:** Add trace compression, pagination, or "summary mode"

---

## Section 11: Code Structure Proposal

```
interval-viz-poc/  (renamed to algorithm-viz-platform)
├─ backend/
│  ├─ algorithms/
│  │  ├─ __init__.py
│  │  ├─ base_tracer.py           # NEW: Abstract base class
│  │  ├─ interval_coverage.py     # REFACTORED: Inherits from base
│  │  ├─ binary_search.py         # NEW: Second algorithm
│  │  ├─ merge_sort.py            # NEW
│  │  ├─ dijkstra.py              # NEW
│  │  └─ ... (more algorithms)
│  ├─ app.py                       # REFACTORED: Algorithm registry
│  └─ requirements.txt
│
├─ frontend/
│  ├─ src/
│  │  ├─ components/
│  │  │  ├─ AlgorithmSelector.jsx # NEW: Choose algorithm
│  │  │  ├─ ControlBar.jsx
│  │  │  ├─ PredictionModal.jsx   # REFACTORED: Generic
│  │  │  └─ ...
│  │  ├─ visualizations/
│  │  │  ├─ registry.js           # NEW: Map viz types to components
│  │  │  ├─ TimelineView.jsx      # EXTRACTED
│  │  │  ├─ CallStackView.jsx     # EXTRACTED
│  │  │  ├─ ArrayView.jsx         # NEW
│  │  │  ├─ GraphView.jsx         # NEW
│  │  │  ├─ MatrixView.jsx        # NEW
│  │  │  └─ TreeView.jsx          # NEW
│  │  ├─ hooks/
│  │  │  ├─ useTraceLoader.js     # REFACTORED: Takes algorithm_id
│  │  │  ├─ useTraceNavigation.js
│  │  │  ├─ usePredictionMode.js  # REFACTORED: Generic
│  │  │  └─ useVisualHighlight.js # REFACTORED: Generic
│  │  ├─ utils/
│  │  │  ├─ predictionUtils.js    # REFACTORED: Generic
│  │  │  └─ stepBadges.js         # REFACTORED: Dynamic from metadata
│  │  └─ App.jsx                   # REFACTORED: Algorithm-agnostic
│  └─ ...
│
└─ docs/
   ├─ ARCHITECTURE.md              # NEW: System design
   ├─ ADDING_ALGORITHMS.md         # NEW: Developer guide
   └─ ...
```

---

## Conclusion

The current POC has a **solid foundation** that already touches complex patterns (recursion + custom visualization). The refactoring path is clear:

1. **Extract abstractions** from working code (low risk)
2. **Validate with 2nd algorithm** (binary search - simple, different)
3. **Scale incrementally** (add algorithms in complexity order)
4. **Preserve philosophy** (backend generates complete traces)

**Critical Success Factors:**

- ✅ Keep POC working throughout migration
- ✅ Test abstractions early with diverse algorithm
- ✅ Allow algorithm-specific customization within unified framework
- ✅ Maintain educational quality (predictions, descriptions, highlighting)

**Estimated Timeline:**

- Phase 1 (Infrastructure): 3 weeks
- Phase 2 (2nd Algorithm): 2 weeks
- Phase 3 (5 more algorithms): 8-10 weeks
- Phase 4 (Polish): 3 weeks

**Total: ~4 months to production-ready multi-algorithm platform**

The architecture respects each algorithm's unique needs while maintaining the core philosophy: **backend thinks, frontend reacts, students learn actively.**
