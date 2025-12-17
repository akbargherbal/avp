# Algorithm Visualization Platform

## Project Overview

An educational platform for visualizing algorithms with active learning features. Built on a **registry-based architecture** that makes adding new algorithms as simple as registering a class—no endpoint configuration required.

**Philosophy:** Backend does ALL the thinking, frontend does ALL the reacting.

**Status:** ✅ Platform Architecture Complete - 2 Algorithms Live (Interval Coverage, Binary Search)

---

## 🎯 Core Architecture Principles

### The Registry Pattern (⭐ Core Innovation)

**Critical Rule:** You do NOT modify `app.py` routing logic. Algorithms self-register and appear in the UI automatically.

**How It Works:**

```python
# backend/algorithms/your_algorithm.py
class YourAlgorithmTracer(AlgorithmTracer):
    def execute(self, input_data):
        # Your algorithm + trace generation
        return self._build_trace_result(result)

    def get_prediction_points(self):
        # Identify learning moments
        return [...]

    def generate_narrative(self, trace_result):
        # Convert trace to human-readable markdown
        return "# Algorithm Execution\n\n..."

# backend/algorithms/registry.py
registry.register(
    name='your-algorithm',
    tracer_class=YourAlgorithmTracer,
    display_name='Your Algorithm',
    description='What it does',
    example_inputs=[...]
)
```

**Result:** Algorithm automatically appears in UI dropdown. No app.py changes. No frontend routing changes. ✨

---

### Unified API Endpoint

**Single endpoint handles ALL algorithms:**

```bash
POST /api/trace/unified
{
  "algorithm": "binary-search",  # or "interval-coverage", "merge-sort", etc.
  "input": {
    "array": [1, 3, 5, 7, 9],
    "target": 5
  }
}
```

**Backend Routing:**

```python
# app.py - This handles ALL algorithms automatically
@app.route('/api/trace/unified', methods=['POST'])
def generate_trace_unified():
    algorithm_name = request.json['algorithm']
    algorithm_input = request.json['input']

    # Registry lookup (automatic)
    tracer_class = registry.get(algorithm_name)
    tracer = tracer_class()

    # Execute and return trace
    return jsonify(tracer.execute(algorithm_input))
```

---

### Dynamic Component Selection

**Backend declares visualization type; frontend selects components automatically for both panels:**

**LEFT Panel (Visualization):** Registry selects visualization component based on `visualization_type`

**RIGHT Panel (Algorithm State):** Registry selects state component based on `algorithm` name

```python
# Backend declares visualization type
self.metadata = {
    'algorithm': 'binary-search',
    'visualization_type': 'array',  # ← Frontend LEFT panel reads this
    'visualization_config': {...}
}
```

```javascript
// Frontend LEFT panel - dynamically selects visualization
import { getVisualizationComponent } from "./utils/visualizationRegistry";

const VisualizationComponent = getVisualizationComponent(
  trace.metadata.visualization_type // 'array' → ArrayView
);

// Frontend RIGHT panel - dynamically selects state component
import { getStateComponent } from "./utils/stateRegistry";

const StateComponent = getStateComponent(
  currentAlgorithm // 'binary-search' → BinarySearchState
);
```

**Available Visualization Types:**

- `array` - For Binary Search, Sorting algorithms
- `timeline` - For Interval Coverage
- `graph` - Future: DFS, BFS, Dijkstra
- `tree` - Future: BST, Heap operations

---

## Project Structure

```
interval-viz-poc/
├── backend/
│   ├── algorithms/
│   │   ├── __init__.py
│   │   ├── base_tracer.py          # ⭐ Abstract base class (CRITICAL)
│   │   ├── registry.py             # ⭐ Central algorithm registry
│   │   ├── interval_coverage.py    # Example algorithm
│   │   └── binary_search.py        # Example algorithm
│   ├── app.py                      # Flask API with unified routing
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AlgorithmSwitcher.jsx    # Dynamic algorithm selector
│   │   │   ├── ControlBar.jsx           # Navigation controls
│   │   │   ├── CompletionModal.jsx      # Success screen
│   │   │   ├── PredictionModal.jsx      # Interactive predictions
│   │   │   ├── KeyboardHints.jsx        # Shortcut guide
│   │   │   ├── panels/                  # ⭐ Layout Containers
│   │   │   │   ├── VisualizationPanel.jsx
│   │   │   │   └── StatePanel.jsx
│   │   │   ├── algorithm-states/        # ⭐ Algorithm-specific state components
│   │   │   │   ├── BinarySearchState.jsx
│   │   │   │   ├── IntervalCoverageState.jsx
│   │   │   │   └── index.js
│   │   │   └── visualizations/          # ⭐ Reusable viz components
│   │   │       ├── ArrayView.jsx
│   │   │       ├── TimelineView.jsx
│   │   │       └── index.js
│   │   ├── contexts/                    # ⭐ State Management (Context API)
│   │   │   ├── TraceContext.jsx
│   │   │   ├── NavigationContext.jsx
│   │   │   ├── PredictionContext.jsx
│   │   │   ├── HighlightContext.jsx     # ⭐ Visual cross-referencing
│   │   │   └── KeyboardContext.jsx
│   │   ├── hooks/                       # Context Consumers
│   │   │   ├── useTraceLoader.js
│   │   │   ├── useTraceNavigation.js
│   │   │   ├── usePredictionMode.js
│   │   │   ├── useVisualHighlight.js
│   │   │   └── useKeyboardShortcuts.js
│   │   ├── utils/
│   │   │   ├── stateRegistry.js         # ⭐ Dynamic state component selection
│   │   │   └── visualizationRegistry.js # ⭐ Dynamic visualization selection
│   │   ├── App.jsx
│   │   └── index.js
│   └── package.json
│
├── docs/
│   ├── compliance/                      # ⭐ Compliance checklists & workflow
│   │   ├── WORKFLOW.md                  # ⭐ Single source of truth
│   │   ├── BACKEND_CHECKLIST.md
│   │   ├── FAA_PERSONA.md               # ⭐ Arithmetic audit guide
│   │   ├── FRONTEND_CHECKLIST.md
│   │   └── PE_INTEGRATION_CHECKLIST.md
│   └── ADR/                             # Architecture decision records
│       ├── ADR-001-registry-based-architecture.md
│       └── ADR-002-component-organization-principles.md
│       └── ADR-003-context-state-management.md
│
└── README.md

⭐ = Critical files for understanding the architecture
```

---

## Compliance Framework (CRITICAL)

This platform follows a **three-tier requirement system** that defines what can and cannot be changed.

### Requirement Tiers

#### 1. LOCKED Requirements 🔒

**Cannot be changed without major version bump**

- **API Contracts**: Trace structure, metadata fields
- **Modal Behavior**: HTML IDs (`#prediction-modal`, `#completion-modal`), keyboard shortcuts, auto-scroll
- **Panel Layout**: Overflow pattern (MUST use `items-start` + `mx-auto`, NOT `items-center`)
- **Narrative Generation**: All algorithms MUST implement `generate_narrative()`

#### 2. CONSTRAINED Requirements ⚠️

**Limited flexibility with defined bounds**

- **Visualization Data**: Array/timeline/graph patterns
- **Prediction Format**: ≤3 choices maximum
- **Step Type Categorization**: 7 defined types (DECISION, COVERAGE, etc.)

#### 3. FREE Zones ✅

**Full creative freedom**

- Internal algorithm implementation
- Performance optimizations
- Custom visualization styles (within overflow pattern)

---

### Four Compliance Stages (CRITICAL)

All new algorithms MUST pass these stages:

#### Stage 1: Backend Implementation & Checklist (`docs/compliance/BACKEND_CHECKLIST.md`)

**Validates:**

- ✅ Metadata structure (`algorithm`, `display_name`, `visualization_type`)
- ✅ Trace format (steps array, timestamps, descriptions)
- ✅ Visualization data contracts (use `state` string, not `visual_state` dict)
- ✅ Prediction points format (≤3 choices)
- ✅ Base class compliance (`AlgorithmTracer` inheritance)
- ✅ **Narrative generation implemented**

**Critical Anti-Patterns:**

- ❌ Missing `display_name` field
- ❌ Using `visual_state` dict instead of `state` string
- ❌ >3 choices in prediction questions
- ❌ Hardcoding visualization logic in tracer
- ❌ Missing `generate_narrative()` implementation

---

#### Stage 1.5: FAA Audit (`docs/compliance/FAA_PERSONA.md`)

**Validates:**

- ✅ Arithmetic correctness of all quantitative claims
- ✅ State transition mathematics (e.g., "updated from X → Y")
- ✅ Visualization-text alignment (counts match what's shown)
- ✅ No copy-paste errors or stale state propagation

**Critical:** This is a **BLOCKING gate**. Narratives with arithmetic errors cannot proceed to PE review. Catches math bugs in 10-15 minutes vs. 2 days of integration debugging.

**FAA ONLY validates mathematics, NOT:**

- ❌ Pedagogical quality (PE handles this in Stage 2)
- ❌ Narrative completeness (PE handles this in Stage 2)
- ❌ Writing style or clarity (PE handles this in Stage 2)

**Common errors caught:**

- Copy-paste errors (same number after different operations)
- Stale state propagation (previous step's value incorrectly carried forward)
- Off-by-one errors in index arithmetic
- Visualization-text mismatches

---

#### Stage 2: PE (Pedagogical Experience) Narrative Review

**Validates:**

- ✅ Logical completeness (can follow algorithm from narrative alone)
- ✅ Temporal coherence (step N → N+1 makes sense)
- ✅ Decision transparency (all comparison data visible)
- ⚠️ **Assumes arithmetic already verified by FAA**

**PE does NOT validate:**

- ❌ Arithmetic correctness (FAA already handled)
- ❌ Whether JSON structure is correct (Backend Checklist)
- ❌ Whether frontend can render it (Integration Tests)

---

#### Stage 3: Frontend Integration (`docs/compliance/FRONTEND_CHECKLIST.md`)

**Validates:**

- ✅ Modal IDs: `#prediction-modal`, `#completion-modal` (LOCKED)
- ✅ Overflow pattern: `items-start` + `mx-auto` (NOT `items-center`)
- ✅ Keyboard shortcuts (←→ navigation, R reset, K/C/S prediction)
- ✅ Auto-scroll behavior in call stack
- ✅ Component interface (`step` and `config` props)

**Critical Overflow Pattern:**

```javascript
// ✅ CORRECT: Prevents left-side cutoff
<div className="h-full flex flex-col items-start overflow-auto py-4 px-6">
  <div className="mx-auto">
    {/* content centers but doesn't cut off */}
  </div>
</div>

// ❌ INCORRECT: Causes overflow cutoff on left side
<div className="h-full flex flex-col items-center overflow-auto">
  {/* content gets cut off */}
</div>
```

---

**Complete Workflow:**

```
Backend Implementation
    ↓
Generate Narratives
    ↓
FAA Arithmetic Audit (BLOCKING)
    ↓
Backend Checklist
    ↓
PE Narrative Review (assumes math verified)
    ↓
Frontend Integration
    ↓
Frontend Checklist
    ↓
Integration Tests
    ↓
Production ✅
```

---

## Base Tracer Abstraction (CRITICAL)

All algorithms MUST inherit from `AlgorithmTracer`:

```python
class AlgorithmTracer(ABC):
    @abstractmethod
    def execute(self, input_data: Any) -> dict:
        """
        Execute algorithm and return standardized result.

        REQUIRED FIELDS in metadata:
        - display_name: str (UI display name)
        - visualization_type: str ('array', 'timeline', 'graph', 'tree')

        Returns:
        {
            "result": <algorithm output>,
            "trace": {"steps": [...], "total_steps": N, "duration": T},
            "metadata": {
                "algorithm": "name",
                "display_name": "Display Name",      # REQUIRED
                "visualization_type": "array",       # REQUIRED
                "visualization_config": {...},
                "prediction_points": [...]           # Auto-generated
            }
        }
        """
        pass

    @abstractmethod
    def get_prediction_points(self) -> List[Dict[str, Any]]:
        """
        Identify prediction moments in the trace for active learning.

        Returns a list of prediction opportunities where students should
        pause and predict the algorithm's next decision.

        CRITICAL: Maximum 3 choices per question.

        Returns: [
            {
                "step_index": int,           # Which step to pause at
                "question": str,             # Question to ask student
                "choices": [str, ...],       # Possible answers (≤3)
                "hint": str,                 # Optional hint
                "correct_answer": str        # For validation
            }
        ]

        Example for interval coverage:
            {
                "step_index": 5,
                "question": "Will this interval be kept or covered?",
                "choices": ["keep", "covered"],
                "hint": "Compare interval.end with max_end",
                "correct_answer": "keep"
            }

        Example for binary search:
            {
                "step_index": 3,
                "question": "Will we search left or right of mid?",
                "choices": ["search-left", "search-right", "found"],
                "hint": "Compare mid value with target",
                "correct_answer": "search-right"
            }
        """
        pass

    @abstractmethod
    def generate_narrative(self, trace_result: dict) -> str:
        """
        Convert trace JSON to human-readable markdown narrative.

        This narrative is reviewed by PE
        BEFORE frontend integration to catch missing data early.

        CRITICAL REQUIREMENTS:
        1. Show ALL decision data - if you reference a variable, SHOW its value
        2. Make comparisons explicit with actual values
        3. Explain decision outcomes clearly
        4. Fail loudly (KeyError) if visualization data is incomplete
        5. Narrative must be self-contained and logically complete

        Args:
            trace_result: Complete trace dictionary from execute()
                         Contains: result, trace, metadata

        Returns:
            str: Markdown-formatted narrative showing all decision logic
                 with supporting data visible at each step

        Raises:
            KeyError: If visualization data incomplete (fail loudly - catches bugs!)

        Example Structure:
            # [Algorithm Name] Execution Narrative

            **Input:** [Describe input with key parameters]
            **Goal:** [What we're trying to achieve]

            ## Step 0: [Description]
            **State:** [Show relevant visualization state]
            **Decision:** [If applicable, show comparison with actual values]
            **Result:** [Outcome of decision]

            ## Step 1: ...

            ## Final Result
            **Output:** [Algorithm result]
            **Performance:** [Key metrics if applicable]

        Good Patterns:
        - ✅ "Compare interval.start (600) with max_end (660) → 600 < 660"
        - ✅ "Decision: Keep interval [600, 720] because it extends coverage"
        - ✅ Show array/graph state at each decision point
        - ✅ Temporal coherence: step N clearly leads to step N+1

        Anti-Patterns to AVOID:
        - ❌ Referencing undefined variables: "Compare with max_end" (but max_end not shown)
        - ❌ Skipping decision outcomes: "Examining interval... [next step unrelated]"
        - ❌ Narratives requiring code to understand
        """
        pass
```

**Built-in Methods:**

- `_add_step(type, data, description)` - Record trace steps
- `_build_trace_result(result)` - Format standardized output
- `_get_visualization_state()` - Optional: Auto-enrich steps

**Safety Limits:**

- `MAX_STEPS = 10,000` - Prevents infinite loops
- Automatic error handling

---

## API Documentation (CRITICAL)

### Primary Endpoints

#### `GET /api/algorithms`

**Purpose:** Discover all available algorithms with metadata.

**Response:**

```json
[
  {
    "name": "binary-search",
    "display_name": "Binary Search",
    "description": "Search sorted array in O(log n) time",
    "example_inputs": [
      {
        "name": "Basic Search - Target Found",
        "input": {"array": [1, 3, 5, 7, 9], "target": 5}
      }
    ],
    "input_schema": {...}
  }
]
```

---

#### `POST /api/trace/unified`

**Purpose:** Generate trace for any registered algorithm.

**Request:**

```json
{
  "algorithm": "binary-search",
  "input": {
    "array": [1, 3, 5, 7, 9, 11, 13, 15],
    "target": 7
  }
}
```

**Response:**

```json
{
  "result": {
    "found": true,
    "index": 3,
    "comparisons": 3
  },
  "trace": {
    "steps": [
      {
        "step": 0,
        "type": "INITIAL_STATE",
        "timestamp": 0.001,
        "data": {
          "target": 7,
          "array_size": 8,
          "visualization": {
            "array": [
              {"index": 0, "value": 1, "state": "active_range"},
              ...
            ],
            "pointers": {"left": 0, "right": 7, "mid": null, "target": 7}
          }
        },
        "description": "🔍 Searching for 7 in sorted array of 8 elements"
      }
    ],
    "total_steps": 12,
    "duration": 0.023
  },
  "metadata": {
    "algorithm": "binary-search",
    "display_name": "Binary Search",           # REQUIRED
    "visualization_type": "array",             # REQUIRED
    "visualization_config": {...},
    "prediction_points": [...],
    "input_size": 8
  }
}
```

**Error Response (400):**

```json
{
  "error": "Unknown algorithm: 'merge-sort'",
  "available_algorithms": ["binary-search", "interval-coverage"]
}
```

---

#### `GET /api/health`

**Purpose:** Health check with registry info.

**Response:**

```json
{
  "status": "healthy",
  "service": "algorithm-trace-backend",
  "algorithms_registered": 2,
  "available_algorithms": ["binary-search", "interval-coverage"]
}
```

---

## Adding a New Algorithm (CRITICAL WORKFLOW)

**Time Investment:** ~2 hours total (including FAA audit)

### Step 1: Implement AlgorithmTracer (30-45 min)

```python
# backend/algorithms/merge_sort.py
from typing import Any, List, Dict
from .base_tracer import AlgorithmTracer

class MergeSortTracer(AlgorithmTracer):
    def __init__(self):
        super().__init__()
        self.array = []

    def execute(self, input_data: Any) -> dict:
        # Validate input
        self.array = input_data.get('array', [])
        if not self.array:
            raise ValueError("Array cannot be empty")

        # CRITICAL: Set required metadata fields
        self.metadata = {
            'algorithm': 'merge-sort',
            'display_name': 'Merge Sort',              # ← REQUIRED
            'visualization_type': 'array',             # ← REQUIRED
            'visualization_config': {
                'element_renderer': 'number',
                'show_indices': True
            }
        }

        # Initial state
        self._add_step(
            "INITIAL_STATE",
            {'array': self.array.copy()},
            f"🔢 Starting merge sort on array of {len(self.array)} elements"
        )

        # Run algorithm with trace generation
        sorted_array = self._merge_sort_recursive(self.array, 0, len(self.array) - 1)

        # Final state
        self._add_step(
            "ALGORITHM_COMPLETE",
            {'sorted_array': sorted_array},
            "✅ Array sorted!"
        )

        # CRITICAL: Use _build_trace_result()
        return self._build_trace_result(sorted_array)

    def get_prediction_points(self) -> List[Dict[str, Any]]:
        """CRITICAL: Maximum 3 choices per question"""
        predictions = []
        for i, step in enumerate(self.trace):
            if step.type == "MERGE_DECISION":
                predictions.append({
                    'step_index': i,
                    'question': "Which element should be merged next?",
                    'choices': [  # ≤3 choices
                        {'id': 'left', 'label': 'Left subarray element'},
                        {'id': 'right', 'label': 'Right subarray element'}
                    ],
                    'correct_answer': 'left'
                })
        return predictions

    def generate_narrative(self, trace_result: dict) -> str:
        """Generate human-readable markdown narrative"""
        narrative = "# Merge Sort Execution\n\n"

        # Input summary
        narrative += f"**Input Array:** {trace_result['result']}\n"
        narrative += f"**Array Size:** {len(trace_result['result'])}\n\n"

        # Step-by-step narrative
        for step in trace_result['trace']['steps']:
            narrative += f"## Step {step['step']}: {step['description']}\n\n"

            # Show visualization state with ALL relevant data
            if 'visualization' in step['data']:
                viz = step['data']['visualization']

                # Show current array state
                if 'array' in viz:
                    narrative += f"**Current Array:** {viz['array']}\n"

                # Show decision logic if applicable
                if step['type'] == 'MERGE_DECISION' and 'left_val' in step['data']:
                    left = step['data']['left_val']
                    right = step['data']['right_val']
                    narrative += f"**Comparison:** {left} vs {right}\n"
                    narrative += f"**Decision:** Select {min(left, right)} (smaller value)\n"

            narrative += "\n"

        # Final result
        narrative += "## Final Result\n\n"
        narrative += f"**Sorted Array:** {trace_result['result']}\n"
        narrative += f"**Total Steps:** {trace_result['trace']['total_steps']}\n"

        return narrative

    def _merge_sort_recursive(self, arr, left, right):
        # Implementation with _add_step() calls
        pass
```

---

### Step 2: Register in Registry (5 min)

```python
# backend/algorithms/registry.py

def register_algorithms():
    from .merge_sort import MergeSortTracer

    registry.register(
        name='merge-sort',                    # Unique ID (kebab-case)
        tracer_class=MergeSortTracer,
        display_name='Merge Sort',
        description='Divide-and-conquer sorting with O(n log n) complexity',
        example_inputs=[
            {
                'name': 'Basic Sort',
                'input': {'array': [5, 2, 8, 1, 9, 3]}
            }
        ]
    )
```

**That's it for backend!** No app.py changes needed. ✨

---

### Step 3: Generate Narratives (10 min)

Run your algorithm on all example inputs and generate markdown narratives:

```bash
cd backend
python scripts/generate_narratives.py merge-sort
```

This creates files in `docs/narratives/merge-sort/`:

- `example_1_basic_sort.md`
- `example_2_large_array.md`
- etc.

---

### Step 3.5: FAA Audit (10-15 min)

Run Forensic Arithmetic Audit on generated narratives:

1. Use `docs/compliance/FAA_PERSONA.md` as audit guide
2. Verify every quantitative claim with calculation
3. Check arithmetic correctness (not pedagogy)
4. Fix any errors and regenerate narratives
5. Repeat until FAA passes

**Critical:** This is a **BLOCKING gate**. No narrative proceeds with arithmetic errors.

**Common errors caught:**

- Copy-paste errors (same number after different operations)
- Stale state propagation (old values not updated)
- Visualization-text mismatches (text says 10, shows 8)
- Off-by-one errors in index calculations

**Expected time:**

- Initial audit: 10-15 minutes
- Re-audit after fixes: 5 minutes
- Total for clean narrative: ~15 minutes
- Total for narrative with errors: ~35 minutes (including fixes)

---

### Step 4: Backend Compliance Checklist (10 min)

Complete `docs/compliance/BACKEND_CHECKLIST.md`:

**Critical Checks:**

- [ ] Metadata has `algorithm`, `display_name`, `visualization_type`
- [ ] Trace structure matches contract
- [ ] Visualization state uses `state` (string), not `visual_state` (dict)
- [ ] Prediction points have ≤3 choices
- [ ] Inherits from `AlgorithmTracer`
- [ ] Uses `_add_step()` and `_build_trace_result()`
- [ ] **Implements `generate_narrative()` method**
- [ ] **Narratives pass FAA arithmetic audit**

**Rule:** If >3 items fail, stop and fix before proceeding.

---

### Step 5: PE Narrative Review (15 min)

PE reviews FAA-approved narratives for:

- Logical completeness
- Temporal coherence
- Decision transparency
- **Assumes arithmetic already verified by FAA**

---

### Step 6: Create/Reuse Visualization (0-30 min)

**Option A: Reuse (0 min)** - Recommended for array-based algorithms

```python
self.metadata = {
    'visualization_type': 'array',  # Reuses ArrayView automatically
}
```

**Option B: New Component (30 min)** - For custom visualizations

```javascript
// frontend/src/components/visualizations/GraphView.jsx
const GraphView = ({ step, config = {} }) => {
  const visualization = step?.data?.visualization;

  return (
    // CRITICAL: Use items-start + mx-auto pattern
    <div className="h-full flex flex-col items-start overflow-auto py-4 px-6">
      <div className="mx-auto">{/* Your visualization */}</div>
    </div>
  );
};
```

---

### Step 7: Register Visualization (5 min, if new)

```javascript
// frontend/src/utils/visualizationRegistry.js
import GraphView from "../components/visualizations/GraphView";

const VISUALIZATION_REGISTRY = {
  array: ArrayView,
  timeline: TimelineView,
  graph: GraphView, // ← Add new component
};
```

## Prediction Mode (Active Learning)

**Transform passive observation into active engagement.**

### How It Works

1. Algorithm identifies decision points via `get_prediction_points()`
2. Frontend pauses at these points
3. Student predicts outcome before seeing answer
4. Immediate feedback with accuracy tracking

### Example: Binary Search

```python
def get_prediction_points(self):
    predictions = []
    for i, step in enumerate(self.trace):
        if step.type == "CALCULATE_MID":
            predictions.append({
                'step_index': i,
                'question': f"Compare mid ({mid}) with target ({target}). What's next?",
                'choices': [  # ≤3 choices (CONSTRAINED)
                    {'id': 'found', 'label': 'Found!'},
                    {'id': 'search-left', 'label': 'Search Left'},
                    {'id': 'search-right', 'label': 'Search Right'}
                ],
                'correct_answer': 'search-right'
            })
    return predictions
```

### Keyboard Shortcuts (LOCKED)

| Keys           | Action                | Context             |
| -------------- | --------------------- | ------------------- |
| `→` or `Space` | Next step             | During navigation   |
| `←`            | Previous step         | During navigation   |
| `R` or `Home`  | Reset to start        | Anytime             |
| `End`          | Jump to end           | During navigation   |
| `K`            | Predict first option  | In prediction modal |
| `C`            | Predict second option | In prediction modal |
| `S`            | Skip question         | In prediction modal |
| `Enter`        | Submit answer         | In prediction modal |
| `Esc`          | Close modal           | In completion modal |

### Accuracy Feedback Tiers

- **90-100%**: "🎉 Excellent! You've mastered this algorithm!"
- **70-89%**: "👍 Great job! You have a solid understanding."
- **50-69%**: "📚 Good effort! Review the patterns for better accuracy."
- **<50%**: "💪 Keep practicing! Focus on understanding each decision."

---

## Environment Configuration

### Backend

```bash
# Required
FLASK_ENV=production
CORS_ORIGINS=https://your-frontend-domain.com

# Optional
MAX_INTERVALS=100
MAX_STEPS=10000
```

### Frontend

```bash
# .env.development
REACT_APP_API_URL=http://localhost:5000/api

# .env.production
REACT_APP_API_URL=https://api.your-domain.com/api
```

---

## Quick Start

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

**Expected Output:**

```
🚀 Algorithm Trace Backend Starting...
🌐 Running on: http://localhost:5000
📊 Registered Algorithms: 2
   - interval-coverage: Interval Coverage
   - binary-search: Binary Search
```

### Frontend

```bash
cd frontend
pnpm install  # or: npm install
pnpm start    # or: npm start
```

Frontend runs on `http://localhost:3000`

---

## Testing

### Backend Testing

```bash
# Discovery endpoint
curl http://localhost:5000/api/algorithms | jq

# Unified endpoint - Binary Search
curl -X POST http://localhost:5000/api/trace/unified \
  -H "Content-Type: application/json" \
  -d '{"algorithm": "binary-search", "input": {"array": [1,3,5,7,9], "target": 5}}' | jq

# Error handling - Unknown algorithm
curl -X POST http://localhost:5000/api/trace/unified \
  -H "Content-Type: application/json" \
  -d '{"algorithm": "unknown", "input": {}}' | jq
```

### Frontend Testing (Manual)

**Critical Tests:**

1. **Algorithm Discovery** - Dropdown shows all algorithms
2. **Visualization Types** - ArrayView (Binary Search), TimelineView (Interval Coverage)
3. **Overflow Handling** - Test with 20+ elements, verify no left-side cutoff
4. **Prediction Mode** - Enable, make predictions, check accuracy tracking
5. **Keyboard Shortcuts** - Test ←→ navigation, R reset, K/C/S prediction
6. **Modal IDs** - Verify `#prediction-modal`, `#completion-modal` exist
7. **Responsive** - Test 3 viewport sizes (desktop, tablet, mobile)

---

## Current Algorithms

| Algorithm             | Visualization | Status  | Prediction Points        |
| --------------------- | ------------- | ------- | ------------------------ |
| **Interval Coverage** | Timeline      | ✅ Live | Keep/Covered decisions   |
| **Binary Search**     | Array         | ✅ Live | Search direction choices |

---

## Deployment

### Backend (Production)

```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

**Environment Variables:**

- `FLASK_ENV=production`
- `CORS_ORIGINS=https://your-frontend-domain.com`

### Frontend (Production)

```bash
pnpm run build  # Output: ./build/
```

**Deployment Options:** Vercel, Netlify, AWS S3+CloudFront, GitHub Pages

**Required:** `REACT_APP_API_URL=https://api.your-domain.com/api`

---

## Support

- **GitHub Issues:** Open with [Bug], [Feature], or [Question] tag
- **Documentation:**
  - `docs/compliance/WORKFLOW.md` - Single source of truth for workflow & architecture
  - `docs/compliance/` - Compliance checklists (Backend, FAA, Frontend, PE)
  - `docs/ADR/` - Architecture Decision Records

---

## License

MIT License

---

**Status:** ✅ Platform Architecture Complete - Ready for Algorithm Expansion

**Next Steps:** Add 3rd algorithm to validate scalability
