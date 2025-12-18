# Algorithm Visualization Platform - Workflow & Architecture Guide

**Version:** 2.4.2  
**Status:** ACTIVE - Single Source of Truth

---

## Document Authority

### What This Document Governs

This document is the **single source of truth** for:

1. **Workflow** - How algorithms move from concept to production
2. **Architecture** - What is LOCKED, CONSTRAINED, and FREE
3. **Process** - Quality gates and validation stages
4. **Requirements** - Technical and functional constraints

### Authority Hierarchy

When conflicts arise, follow this hierarchy:

#### 1. Static Mockups (Highest Authority for Visual Standards)

- **Location:** `docs/static_mockup/*.html`
- **Authority for:** Visual appearance, sizing, spacing, colors, layout, typography
- **When to use:** All visual UI decisions

**Critical Principle:** Static mockups are the **visual source of truth**. All visual requirements must align with them. It's incumbent on the Frontend developer to make sure any update they do to existing components or newly created React components conform to the visual guidelines illustrated in the static mockup documents in `docs/static_mockup/*.html`.

#### 2. This Document (WORKFLOW.md)

- **Authority for:** Functional requirements, behavioral patterns, architectural constraints, development process
- **Must reference mockups** for all visual specifications

#### 3. Compliance Checklists

- **Location:** `docs/compliance/*.md`
- **Authority for:** Validation procedures, testing criteria
- **Derived from:** This document + Static Mockups

---

## Stage 1: Backend Implementation

### Developer Actions

1. ✅ Implement algorithm tracer (inherit from `AlgorithmTracer`)
2. ✅ Implement `generate_narrative()` method (REQUIRED - v2.0)
3. ✅ Run backend unit tests
4. ✅ Generate narratives for ALL registered examples
5. ✅ Self-review narratives for logical completeness
6. ✅ **Submit narratives to FAA audit**
7. ✅ **Fix arithmetic errors, regenerate until FAA passes**
8. ✅ Complete Backend Compliance Checklist
9. ✅ Submit PR with code, FAA-approved narratives, and checklist

### Deliverables

```
backend/algorithms/my_algorithm.py
├── MyAlgorithmTracer class
│   ├── execute()
│   ├── get_prediction_points()
│   ├── _get_visualization_state()
│   └── generate_narrative()  ← REQUIRED

docs/narratives/my_algorithm/
├── example_1_basic.md          ← FAA-approved narrative
├── example_2_edge_case.md      ← FAA-approved narrative
└── example_3_complex.md        ← FAA-approved narrative

docs/compliance/
└── backend_checklist_my_algorithm.md  ← Completed checklist
```

### Self-Review Criteria

Before submitting to FAA, verify your narratives:

- [ ] Can I follow the algorithm logic from narrative alone?
- [ ] Are all decisions explained with visible data?
- [ ] Does temporal flow make sense (step N → step N+1)?
- [ ] Can I mentally visualize this without seeing code/JSON?
- [ ] Are all arithmetic claims correct? (FAA will verify this)

---

## Stage 1.5: Forensic Arithmetic Audit

### Quality Gate: Mathematical Verification

**Timing:** After backend generates narratives, before PE review  
**Validator:** Backend developer using `FAA_PERSONA.md`  
**Purpose:** Catch arithmetic errors before human PE review

### How It Works

1. Backend developer completes narrative generation (Stage 1)
2. Developer submits narratives to FAA audit:
   - Uses `FAA_PERSONA.md` as review guide
   - Verifies every quantitative claim
   - Checks arithmetic correctness
3. FAA identifies any mathematical errors
4. Developer fixes errors and regenerates narratives
5. Process repeats until FAA passes

### FAA Validation Scope

**FAA ONLY validates:**

- ✅ Arithmetic correctness (e.g., "20 - 10 = 10" not "20")
- ✅ State transition math (e.g., "max_end updated from 660 → 720")
- ✅ Quantitative claims consistency (e.g., counts match operations)
- ✅ Visualization-text alignment (e.g., shown elements match claimed elements)

**FAA does NOT validate:**

- ❌ Pedagogical quality (PE handles this in Stage 2)
- ❌ Narrative completeness (PE handles this in Stage 2)
- ❌ Writing style or clarity (PE handles this in Stage 2)
- ❌ Logical flow (PE handles this in Stage 2)

### Decision Gate

- **✅ APPROVED** → Proceed to Stage 2 (PE Narrative Review)
- **❌ REJECTED** → Return to Stage 1 (Fix arithmetic, regenerate)

**Critical:** FAA is a BLOCKING gate. No narrative proceeds to PE with arithmetic errors.

### Why This Gate Exists

**Problem discovered:** Generic narrative review has ~50% false-approval rate for arithmetic errors. Specialized mathematical validation catches errors that pedagogical review misses.

**Evidence:** Testing revealed 3 of 6 reviewers approved narratives with systematic arithmetic errors (claiming "20 elements remain" after "eliminating 10 from 20"). FAA persona caught 100% of arithmetic errors with 0% false positives.

**Cost-benefit:** 2 hours of FAA back-and-forth beats 2 days of integration debugging.

### FAA Audit Process

**Reference document:** `docs/compliance/FAA_PERSONA.md`

**Expected time:**

- Initial audit: 10-15 minutes
- Re-audit after fixes: 5 minutes
- Total for clean narrative: ~15 minutes
- Total for narrative with errors: ~35 minutes (including fixes)

**Common errors FAA catches:**

- Copy-paste errors (same number after different operations)
- Stale state propagation (previous step's value incorrectly carried forward)
- Off-by-one errors in index arithmetic
- Visualization-text mismatches

---

## Stage 2: PE (Pedagogical Experience) Narrative Review

### PE Specialist Role

**CRITICAL:** PE does NOT look at JSON, code, or frontend in this stage.

**ONLY INPUT:** FAA-approved markdown narratives; PE assumes arithmetic correctness has been verified by FAA.

### PE Reviews For

#### 1. Logical Completeness

- Can I follow the algorithm from start to finish?
- Are all decision points explained?
- Is the data supporting each decision visible?

#### 2. Temporal Coherence

- Does step N+1 logically follow from step N?
- Are there narrative gaps or jumps?
- Can I reconstruct the algorithm's flow?

#### 3. Mental Visualization

- Can I imagine what the visualization would show?
- Are state changes clear?
- Can I track what's happening without code?

#### 4. Decision Transparency

For each decision (keep/discard, left/right, etc.):

- Is the comparison data visible?
- Is the decision logic clear?
- Is the outcome explained?

### PE Does NOT Validate

❌ Whether JSON structure is correct (Backend Checklist handles this)  
❌ Whether frontend can render it (Integration Tests handle this)  
❌ Whether coordinates/scales are correct (rendering detail)  
❌ Performance or optimization (Integration Tests)  
❌ **Arithmetic correctness (FAA already validated)**

### Decision Gate

- **✅ APPROVED** → Proceed to Stage 3 (Frontend Integration)
- **⚠️ MINOR ISSUES** → Approved with documentation notes
- **❌ REJECTED** → Return to Stage 1 (Backend fixes and regenerates)

**Critical:** PE provides feedback on **WHY** narrative is rejected (what's missing/unclear), **NOT HOW** to fix it. Backend determines implementation.

### Common Issues to Catch

- Missing decision context (e.g., "compare with X" but X value not shown)
- Temporal gaps (step 8 → step 9 jump without explanation)
- Undefined variable references
- Unclear decision logic

**Note:** Arithmetic errors should NOT appear here (FAA caught them in Stage 1.5).

### PE Feedback Format

**✅ CORRECT Feedback (describes WHAT is wrong):**

```
❌ REJECTED - Binary Search Example 1

Issue 1: Missing decision context at Step 5
- Narrative states: "Compare target with mid"
- Problem: The actual values being compared are not visible
- Impact: Cannot verify the decision logic

Issue 2: Temporal gap between Steps 8-9
- Step 8: "Examining mid element"
- Step 9: "Search right half"
- Problem: The comparison result that led to "search right" is missing
- Impact: Cannot follow the decision flow
```

**❌ WRONG Feedback (prescribes HOW to fix):**

```
❌ REJECTED - Binary Search Example 1

Issue 1: Add mid value to Step 5
- Solution: Update narrative to include: "Compare target (5) with mid (3)"

Issue 2: Add comparison step
- Solution: Insert new step between 8-9 showing "5 > 3, search right"
```

**Principle:** PE identifies gaps, Backend decides implementation.

---

## Stage 3: Frontend Integration

### Overview

**Owner:** Frontend Developer  
**Duration:** Variable (typically 30-60 minutes for new algorithm)  
**Prerequisite:** Stage 2 complete (PE approval received)

Frontend Developer integrates PE-approved algorithm into the visualization platform using the registry-based architecture. The developer focuses on "how to render" the algorithm state, not "what to render" (backend provides the data).

### 3.1 Core Deliverables

#### Required (Every Algorithm):

1. **Algorithm-Specific State Component**

   - **File:** `frontend/src/components/algorithm-states/{AlgorithmName}State.jsx`
   - **Purpose:** Displays algorithm-specific state in RIGHT panel (e.g., pointers, call stack, search space)
   - **Interface:** Receives `{ step, trace }` props (NOT contexts)
   - **Pattern:** Pure presentational component, context-agnostic

2. **State Registry Entry**
   - **File:** `frontend/src/utils/stateRegistry.js`
   - **Action:** Import component and add entry mapping algorithm ID to component
   - **Contract:** Algorithm ID must match backend metadata exactly

#### Conditional (Only If Needed):

3. **New Visualization Component** (if existing visualizations insufficient)

   - **File:** `frontend/src/components/visualizations/{ConceptName}View.jsx`
   - **Purpose:** Generic, reusable visualization for LEFT panel (e.g., `ArrayView`, `TimelineView`)
   - **When:** Only if algorithm requires visualization type not in `visualizationRegistry`
   - **Reuse First:** Most array algorithms use `ArrayView`, interval algorithms use `TimelineView`

4. **Visualization Registry Entry** (if new visualization created)
   - **File:** `frontend/src/utils/visualizationRegistry.js`
   - **Action:** Import component and add entry mapping visualization type to component

### 3.2 Implementation Guidelines

#### Component Structure Pattern

**Algorithm State Components** (`algorithm-states/`):

- Consume props: `{ step, trace }`
- Extract data from `step.data.visualization`
- Access metadata from `trace.metadata`
- Define PropTypes for validation
- Handle missing data gracefully (early return pattern)
- Display algorithm-specific state (pointers, stacks, progress indicators)

**Example Pattern:**

```javascript
const AlgorithmNameState = ({ step, trace }) => {
  // Early return if no data
  if (!step?.data?.visualization) {
    return <div>No state data available</div>;
  }

  // Extract visualization data
  const vizData = step.data.visualization;
  const metadata = trace?.metadata;

  // Render algorithm-specific state
  return <div>{/* Display state */}</div>;
};

AlgorithmNameState.propTypes = {
  step: PropTypes.shape({
    data: PropTypes.shape({
      visualization: PropTypes.object,
    }),
  }).isRequired,
  trace: PropTypes.shape({
    metadata: PropTypes.object,
  }),
};
```

#### Naming Conventions

- **Algorithm State Components:** `{AlgorithmName}State.jsx`

  - Examples: `BinarySearchState.jsx`, `MergeSortState.jsx`
  - One component per algorithm (1:1 mapping)
  - Suffix `State` indicates algorithm-specific

- **Visualization Components:** `{ConceptName}View.jsx`
  - Examples: `ArrayView.jsx`, `TimelineView.jsx`, `GraphView.jsx`
  - Shared by multiple algorithms (1:N mapping)
  - Suffix `View` indicates reusable visualization

#### Directory Organization

```
frontend/src/components/
├── algorithm-states/          # Algorithm-specific (RIGHT panel)
│   ├── BinarySearchState.jsx
│   ├── IntervalCoverageState.jsx
│   ├── SlidingWindowState.jsx
│   └── TwoPointerState.jsx
└── visualizations/            # Reusable visualizations (LEFT panel)
    ├── ArrayView.jsx          # Used by: Binary Search, Sliding Window, Two Pointer
    ├── TimelineView.jsx       # Used by: Interval Coverage
    └── index.js
```

**Principle:** Organize by reusability, not by algorithm. See `docs/ADR/FRONTEND/ADR-002-component-organization-principles.md`.

#### Registry Integration

**State Registry** (`stateRegistry.js`):

```javascript
import BinarySearchState from "../components/algorithm-states/BinarySearchState";

const STATE_REGISTRY = {
  "binary-search": BinarySearchState, // Key must match backend metadata.algorithm
  // ...
};
```

**Visualization Registry** (`visualizationRegistry.js`):

```javascript
import ArrayView from "../components/visualizations/ArrayView";

const VISUALIZATION_REGISTRY = {
  array: ArrayView, // Key must match backend metadata.visualization_type
  timeline: TimelineView,
  // ...
};
```

#### Backend-Frontend Contract

Backend provides in trace metadata:

```json
{
  "metadata": {
    "algorithm": "binary-search", // → Selects state component
    "visualization_type": "array", // → Selects visualization component
    "visualization_config": {
      /* ... */
    } // → Passed to visualization
  }
}
```

Frontend consumes via registries:

```javascript
// Right Panel (State)
const StateComponent = getStateComponent(trace.metadata.algorithm);

// Left Panel (Visualization)
const VisualizationComponent = getVisualizationComponent(
  trace.metadata.visualization_type
);
```

### 3.3 Quality Gates

Before handoff to Stage 4 (QA), verify:

- [ ] **Component Functionality**

  - State component renders without errors
  - Component handles missing/malformed data gracefully
  - PropTypes defined and validated

- [ ] **Registry Compliance**

  - State component registered in `stateRegistry.js` with correct algorithm ID
  - If new visualization: registered in `visualizationRegistry.js` with correct type
  - Registry keys match backend metadata exactly

- [ ] **Architectural Compliance**

  - State component in `algorithm-states/` directory
  - Visualization component (if created) in `visualizations/` directory
  - Naming convention followed (`{Algorithm}State.jsx` vs `{Concept}View.jsx`)
  - Component is context-agnostic (uses props, not contexts)

- [ ] **Visual Compliance**

  - UI follows static mockup specifications (`docs/static_mockup/*.html`)
  - No deviation from established visual patterns without justification

- [ ] **Documentation**
  - Frontend Compliance Checklist completed

### 3.4 Using Narratives as Reference (Optional but Recommended)

**Narratives are your "script":**

- **JSON is the fuel** (drives your React engine) ← PRIMARY
- **Markdown narratives provide context** (accelerates understanding) ← SUPPORTING

**When to reference narratives:**

- ✅ Understanding algorithm intent ("Why does this step happen?")
- ✅ Debugging visualization ("What should step 5 look like?")
- ✅ Verifying decision logic ("Is my rendering showing the right comparison?")
- ✅ Onboarding to new algorithm ("How does this work?")

**What narratives are NOT:**

- ❌ UI specifications (you have creative freedom - see mockups)
- ❌ Layout requirements (mockups govern visual standards)
- ❌ Binding constraints (JSON is the contract)
- ❌ Implementation instructions (you decide HOW to visualize)

### 3.5 Handoff to Stage 4

**QA Engineer receives:**

- Working algorithm visualization
- State component displaying algorithm-specific data
- Registry entries for new algorithm
- Completed Frontend Compliance Checklist

**QA verifies:**

- Full algorithm flow (trace execution)
- UI interactions (step navigation, predictions)
- Visual correctness (matches mockups)
- No regressions in existing algorithms

---

## LOCKED Requirements

Cannot be changed without breaking platform architecture.

### Frontend LOCKED Elements

#### Modal Dimensions (🔒 Hardcoded in CSS)

**Source:** `docs/static_mockup/prediction_modal_mockup.html`, `docs/static_mockup/completion_modal_mockup.html`

**Why LOCKED:** Ensures consistent UX, prevents modal overflow bugs.

#### HTML IDs (🔒 Required for Testing & Accessibility)

**Source:** All static mockups

```html
<!-- Required IDs - DO NOT CHANGE -->
<div id="prediction-modal">...</div>
<div id="completion-modal">...</div>
<div id="step-current">Step {N}</div>
```

**Why LOCKED:** Automated tests rely on these IDs. Changing them breaks test suite.

#### Keyboard Shortcuts (🔒 Platform-Wide)

**Source:** `docs/static_mockup/algorithm_page_mockup.html`

```javascript
// Required shortcuts - ALL algorithms must support
'ArrowRight' → Next step
'ArrowLeft'  → Previous step
'r'          → Reset
'k' or 'c'   → Select prediction choice K/C
's'          → Skip prediction
```

**Why LOCKED:** Consistent user experience across all algorithms.

---

## CONSTRAINED Requirements

Must follow established patterns and architectural decisions. Implementation details are flexible, but architectural compliance is required.

### CONSTRAINED (Backend)

**Stakeholder:** Backend Developer  
**Approval Required:** Technical Lead  
**Reference Documents:** `docs/ADR/BACKEND/ADR-001`, `docs/compliance/BACKEND_CHECKLIST.md`

#### Trace Contract

**Metadata Structure:**

- Must include required fields: `algorithm`, `display_name`, `visualization_type`, `input_size`
- `algorithm` ID must match frontend registry key format (lowercase, hyphen-separated)
- `visualization_type` must be valid type in frontend registry (`array`, `timeline`, etc.)

**Trace Steps Structure:**

- Must include required fields: `step` (0-indexed), `type`, `description`, `data.visualization`
- Step indices must be sequential with no gaps
- Each step must contain visualization state sufficient for rendering

**Prediction Points:**

- Hard limit: 2-3 choices maximum per prediction point
- Must include: `step_index`, `question`, `choices`, `correct_answer`, `explanation`
- Prediction timing must align with meaningful decision points

**Narrative Generation:**

- Must implement `generate_narrative()` method
- Must pass FAA arithmetic audit before proceeding
- Narratives must be self-contained (no external references)
- All decision data must be visible in narrative text
- Must fail loudly on missing data (KeyError preferred over silent defaults)

#### Algorithm Registration

- Must register in `backend/algorithms/registry.py`
- Must provide example inputs for narrative generation
- Must inherit from `AlgorithmTracer` base class

### CONSTRAINED (Frontend)

**Stakeholder:** Frontend Developer  
**Approval Required:** Technical Lead  
**Reference Documents:** `docs/ADR/FRONTEND/ADR-001`, `ADR-002`, `ADR-003`, `docs/compliance/FRONTEND_CHECKLIST.md`

#### Registry Pattern Compliance

- New algorithms must register state component in `stateRegistry.js`
- Algorithm ID in registry must match backend `metadata.algorithm` exactly
- New visualization types must register in `visualizationRegistry.js`
- Visualization type in registry must match backend `metadata.visualization_type`

#### Component Organization

- Algorithm-specific state components must be placed in `algorithm-states/` directory
- Reusable visualization components must be placed in `visualizations/` directory
- Must follow naming conventions:
  - Algorithm state: `{AlgorithmName}State.jsx` (e.g., `BinarySearchState.jsx`)
  - Visualization: `{ConceptName}View.jsx` (e.g., `ArrayView.jsx`)

#### Component Architecture

- State components must be context-agnostic (consume props, not contexts)
- State components must accept props interface: `{ step, trace }`
- State components must extract data from `step.data.visualization`
- State components must define PropTypes for validation
- State components must handle missing/malformed data gracefully

#### Backend Metadata Adherence

- Must respect `algorithm` field from metadata for component selection
- Must respect `visualization_type` field for visualization selection
- Must handle `visualization_config` from metadata appropriately
- Must not assume data structure beyond documented contract

#### Fallback Handling

- Registries must provide graceful fallback for missing registrations
- Components should display meaningful error messages when data is malformed
- Must not crash application on unexpected data

#### Context Architecture Compliance

- Must follow provider hierarchy from ADR-003 when modifying core architecture
- Context consumers must respect priority system (KeyboardContext)
- New contexts must follow domain-driven design pattern

### CONSTRAINED (Pedagogical Experience)

**Stakeholder:** PE Specialist  
**Approval Required:** Lead Educator  
**Reference Documents:** `docs/compliance/WORKFLOW.md` Stage 2

#### Narrative Quality Standards

- All decision points must have visible supporting data
- Temporal flow must be coherent (step N → step N+1 logical)
- Must enable mental visualization without code/JSON
- All quantitative claims must be arithmetically correct (FAA-verified)

#### Review Scope

- Focus on logical completeness, not implementation details
- Provide descriptive feedback (WHAT is wrong), not prescriptive (HOW to fix)
- Assume arithmetic correctness (FAA already validated)
- Do not validate JSON structure or frontend rendering

---

## Backend Implementation Details

### Metadata Structure (🎨 Required Fields)

```python
self.metadata = {
    'algorithm': 'my-algorithm',           # REQUIRED
    'display_name': 'My Algorithm',        # REQUIRED
    'visualization_type': 'array',         # REQUIRED: array|timeline|graph|tree
    'input_size': 20                       # REQUIRED
}
```

### Trace Steps (🎨 Required Structure)

```python
{
    'step': 0,                   # REQUIRED: 0-indexed
    'type': 'COMPARE',           # REQUIRED: algorithm-defined
    'description': '...',        # REQUIRED: human-readable
    'data': {
        'visualization': {...}   # REQUIRED: current state
    }
}
```

### Visualization Data Patterns

#### Array Algorithms (visualization_type: "array")

```python
data['visualization'] = {
    'array': [
        {'index': 0, 'value': 1, 'state': 'active_range'},
        {'index': 1, 'value': 3, 'state': 'examining'},
        {'index': 2, 'value': 5, 'state': 'excluded'}
    ],
    'pointers': {                        # Optional
        'left': 0,
        'mid': 1,
        'right': 4
    }
}
```

#### Timeline Algorithms (visualization_type: "timeline")

```python
data['visualization'] = {
    'all_intervals': [
        {'id': 'i1', 'start': 0, 'end': 100, 'color': 'blue', 'state': 'kept'},
        {'id': 'i2', 'start': 50, 'end': 150, 'color': 'green', 'state': 'examining'}
    ],
    'call_stack_state': [
        {'id': 'call_1', 'is_active': True, 'depth': 0},
        {'id': 'call_2', 'is_active': False, 'depth': 1}
    ]
}
```

#### Graph Algorithms (visualization_type: "graph") - Future

```python
data['visualization'] = {
    'graph': {
        'nodes': [
            {'id': 'A', 'label': 'Node A', 'state': 'visiting'},
            {'id': 'B', 'label': 'Node B', 'state': 'unvisited'}
        ],
        'edges': [
            {'from': 'A', 'to': 'B', 'weight': 5}
        ]
    }
}
```

### Prediction Points

**HARD LIMIT: 2-3 choices maximum**

```python
def get_prediction_points(self):
    return [{
        'step_index': 5,                 # When to pause
        'question': 'What happens next?',
        'choices': [                     # 2-3 choices ONLY
            {'id': 'a', 'label': 'Search left'},
            {'id': 'b', 'label': 'Search right'},
            {'id': 'c', 'label': 'Target found'}
        ],
        'correct_answer': 'b',
        'explanation': 'Target (5) > mid (3), so search right',
        'hint': 'Compare target with mid value'  # Optional
    }]
```

### Narrative Generation

**LOCKED REQUIREMENT:**

```python
class MyAlgorithmTracer(AlgorithmTracer):
    def generate_narrative(self, trace_result: dict) -> str:
        """
        Convert trace JSON → human-readable markdown.

        Must:
        - Show all decision points with supporting data
        - Maintain temporal coherence
        - Enable mental visualization
        - Pass FAA arithmetic audit
        - Fail loudly if data incomplete
        """
        # Extract components from trace_result
        metadata = trace_result['metadata']
        steps = trace_result['trace']['steps']
        result = trace_result['result']

        # Header with algorithm information
        narrative = "# Algorithm Execution Narrative\n\n"
        narrative += f"**Algorithm:** {metadata['display_name']}\n"
        narrative += f"**Input Size:** {metadata['input_size']}\n\n"
        narrative += "---\n\n"

        # Step-by-step narrative
        for step in steps:
            # Show step number and description
            narrative += f"## Step {step['step']}: {step['description']}\n\n"

            # Show visualization state with ALL relevant data
            viz = step['data']['visualization']
            narrative += f"**Array:** {viz['array']}\n"
            narrative += f"**Pointers:** left={viz['pointers']['left']}, "
            narrative += f"mid={viz['pointers']['mid']}, "
            narrative += f"right={viz['pointers']['right']}\n\n"

            # Show decision with supporting data
            if step['type'] == 'COMPARE':
                narrative += f"**Decision:** Compare target ({self.target}) "
                narrative += f"with mid value ({viz['array'][viz['pointers']['mid']]['value']})\n"
                narrative += f"**Result:** Target {'>' if ... else '<'} mid → Search {'right' if ... else 'left'}\n\n"

            narrative += "---\n\n"

        # Summary
        narrative += "## Execution Summary\n\n"
        narrative += f"**Final Result:** {result}\n"
        narrative += f"**Performance Metrics:** [Include relevant metrics]\n"

        return narrative
```

**Key Principles:**

- Each algorithm narrates ITSELF (no centralized generator)
- Narratives must be self-contained (no external references)
- All decision data must be visible in narrative
- **All arithmetic must be correct (FAA will verify)**
- Fails loudly on missing data (KeyError is good!)
- Extract `metadata`, `steps`, and `result` from `trace_result` first

---

## FREE Implementation Choices

Developer's choice - not constrained.

### Component Architecture

- ✅ Functional components vs. class components
- ✅ Custom hooks organization
- ✅ State management approach (useState, useReducer, context)
- ✅ Component file structure

### Performance Optimizations

- ✅ Memoization strategy (useMemo, useCallback, React.memo)
- ✅ Virtualization for long lists
- ✅ Lazy loading
- ✅ Bundle optimization

### Testing Strategy

- ✅ Unit test framework choice
- ✅ Test coverage targets
- ✅ Integration test approach
- ✅ E2E test tools

### Backend Implementation Details

- ✅ Step type names (use algorithm-appropriate names)
- ✅ State names (e.g., "pivot", "partitioned", "merged")
- ✅ Custom metrics (comparisons, swaps, custom_metric)
- ✅ Additional visualization config

---

## Quick Reference

### Adding a New Algorithm

**Backend (Stage 1):**

1. Create tracer class inheriting `AlgorithmTracer`
2. Implement `execute()`, `get_prediction_points()`, `_get_visualization_state()`
3. Implement `generate_narrative()`
4. Register in `registry.py`
5. Generate narratives for all examples
6. **Submit narratives to FAA audit**
7. **Fix arithmetic errors, regenerate until FAA passes**
8. Complete Backend Checklist (include FAA-approved narratives)
9. Submit PR with code, narratives, and completed checklist

**FAA Audit (Stage 1.5)**

1. Use `FAA_PERSONA.md` to audit narratives
2. Verify all arithmetic claims
3. Reject if errors found
4. Backend fixes and resubmits
5. Approve when arithmetic verified

**PE (Pedagogical Experience) (Stage 2):**

1. Review FAA-approved narratives for logical completeness
2. Check temporal coherence
3. Verify decision transparency
4. APPROVE or REJECT with specific feedback
5. **Assume arithmetic already verified**

**Frontend (Stage 3):**

1. Receive FAA+PE approved narratives
2. Create algorithm state component (`{Algorithm}State.jsx`)
3. Register in `stateRegistry.js`
4. Create algorithm info markdown (`public/algorithm-info/{algorithm-name}.md`)
5. Create visualization component if needed (reuse if possible)
6. Register visualization in `visualizationRegistry.js` if new
7. Complete Frontend Checklist
8. **Trust arithmetic correctness**

**QA Integration (Stage 4):**

1. Test full algorithm flow end-to-end
2. Verify narrative accuracy matches UI rendering
3. Test prediction modal functionality
4. Run regression tests on existing algorithms
5. Complete QA Integration Checklist
6. Document any integration issues for team

### Checklist Locations

- Backend: `docs/compliance/BACKEND_CHECKLIST.md`
- **FAA Audit:** `docs/compliance/FAA_PERSONA.md`
- PE Review: `docs/compliance/PE_CHECKLIST.md`
- Frontend: `docs/compliance/FRONTEND_CHECKLIST.md`

### Visual Reference

All UI decisions: `docs/static_mockup/*.html`

### Common Anti-Patterns

**Backend:**

- ❌ Omitting required metadata fields
- ❌ Missing visualization data in steps
- ❌ >3 prediction choices
- ❌ Narrative references undefined variables
- ❌ **Arithmetic errors in narratives (FAA will catch)**
- ❌ Modifying `base_tracer.py` for algorithm-specific code

**Frontend:**

- ❌ Deviating from visual standards defined in static mockups (`docs/static_mockup/*.html`)
- ❌ All updated or newly created components must conform to visual guidelines in mockups
- ❌ State components using contexts directly (use props)
- ❌ Algorithm-specific components in `visualizations/` directory

---

**Document Status:** ✅ ACTIVE - Single Source of Truth  
**Next Review:** When adding new algorithm types (graph, tree) or major workflow changes

---
