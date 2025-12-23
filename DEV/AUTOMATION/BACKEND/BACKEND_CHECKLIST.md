# Backend Checklist: Algorithm Tracer Compliance v2.2

**Authority:** WORKFLOW.md v2.4 - Backend Requirements  
**Purpose:** Verify new algorithm tracers comply with platform requirements

---

## LOCKED REQUIREMENTS (Mandatory)

### Metadata Structure

- [ ] **`algorithm`** (string) - Unique identifier present (e.g., "merge-sort")
- [ ] **`display_name`** (string) - Human-readable name present (e.g., "Merge Sort")
- [ ] **`visualization_type`** (string) - Valid type specified: "array" | "timeline" | "graph" | "tree"
- [ ] **`input_size`** (integer) - Number of elements/nodes documented

### Trace Structure

- [ ] **`metadata`** - Contains all required fields above
- [ ] **`trace.steps`** - Array of step objects present
- [ ] **Each step has `step` field** - 0-indexed integer step number
- [ ] **Each step has `type` field** - Algorithm-defined step type (string)
- [ ] **Each step has `description` field** - Human-readable description (string)
- [ ] **Each step has `data.visualization` field** - Current state for visualization (dict)

### Inheritance & Base Class

- [ ] **Inherits from `AlgorithmTracer`** - Uses base class provided in `backend/algorithms/base_tracer.py`
- [ ] **Implements `_get_visualization_state()`** - Returns dict with current visualization data
- [ ] **Implements `execute(input_data)`** - Main algorithm logic, returns trace dict
- [ ] **No modifications to `base_tracer.py`** - All customization via subclass methods

### Narrative Generation

- [ ] **Implements `generate_narrative(trace_result: dict) -> str`**

  - Abstract method from `AlgorithmTracer` base class
  - Converts own trace JSON to human-readable markdown
  - Must be implemented (will raise NotImplementedError if not)

- [ ] **Narrative generated for ALL registered examples**

  - Every example in `registry.py` has corresponding narrative
  - Files saved to `docs/narratives/[algorithm-name]/[example-name].md`
  - Naming convention: `example_1_basic.md`, `example_2_edge_case.md`, etc.

- [ ] **Narrative generation does NOT fail**

  - No `KeyError` exceptions when accessing visualization data
  - No missing field references
  - Fails loudly if data incomplete (this is good - catches bugs!)

- [ ] **Narrative passes FAA arithmetic audit**

  - Submit narratives to FAA review using `FAA_PERSONA.md`
  - Address all arithmetic errors flagged by FAA
  - Resubmit until FAA approves (blocking requirement)
  - See Stage 1.5 in WORKFLOW.md for details

- [ ] **Algorithm info markdown file exists**

  - File location: `docs/algorithm-info/[algorithm-name].md`
  - Naming convention: Match algorithm name exactly (e.g., `binary-search.md`, `interval-coverage.md`)
  - Content: Educational overview (what, why, where used, complexity, applications)
  - No code-heavy content - focus on conceptual understanding; why this algorithm exists
  - Verified markdown syntax is valid (no broken formatting)
  - Verify 150-250 words limit.

- [ ] **Registry provides `get_info()` method**

  - `registry.get_info('algorithm-name')` returns markdown string
  - Method handles missing files gracefully (raises ValueError with helpful message)
  - Path resolution works from registry location

- [ ] **Self-review completed before FAA submission**
  - [ ] Can I follow the algorithm logic from narrative alone?
  - [ ] Are all decision points explained with visible data?
  - [ ] Does temporal flow make sense (step N → step N+1)?
  - [ ] Can I mentally visualize this without code/JSON?
  - [ ] Are all arithmetic claims correct? (FAA will verify)

### Narrative Completeness - Result Traceability

- [ ] **Every output field has narrative trail**
  - Scan final `result` object for all fields (indices, counts, positions, etc.)
  - Verify each field mentioned/derived during narrative execution
  - No "phantom" data appears only in conclusion

**Self-Check Method:**

1. List all fields in your `result` object
2. Search narrative for each field name or concept
3. Ensure introduction before usage in final summary

- [ ] **Hidden state updates made visible**
  - If algorithm tracks data beyond current visualization, explain the tracking decision
  - Show WHY secondary tracking matters before showing updates
  - Make "bookkeeping" operations pedagogically clear

**Pattern to Follow:**

1. **Purpose:** "We track [X] because we need it for [final goal]"
2. **Update:** "Current [X] becomes [value] due to [reason]"
3. **Application:** "Final result uses tracked [X]: [value]"

- [ ] **Reader reconstruction test passed**
  - Cover your result JSON, read only the narrative
  - Verify: Can you predict the complete result structure?
  - If any result fields would be surprising, add narrative context

### Frontend Visualization Guidance

- [ ] **Visualization hints section included in narrative**
  - Add standardized "🎨 Frontend Visualization Hints" section at end of narrative
  - Provide backend insights to guide frontend visualization decisions
  - Include primary metrics, visualization priorities, and key JSON paths

**Required Hint Categories:**

```markdown
## 🎨 Frontend Visualization Hints

### Primary Metrics to Emphasize

[List 2-3 most important data points for user understanding]

### Visualization Priorities

[Suggest visual emphasis - what to highlight, when to animate]

### Key JSON Paths

[Provide exact paths to critical data for frontend access]

### Algorithm-Specific Guidance

[Custom insights about this algorithm's visualization needs]
```

---

## CONSTRAINED REQUIREMENTS (Follow Contract)

### Visualization Data Patterns

#### For Array Algorithms (visualization_type: "array")

- [ ] **`data.visualization.array`** - Array of element objects present
- [ ] Each element has **`index`** (int) - Array index
- [ ] Each element has **`value`** (any) - Element value
- [ ] Each element has **`state`** (string) - Element state (e.g., "examining", "excluded", "active_range")
- [ ] **`data.visualization.pointers`** (optional) - Algorithm pointers (left, right, mid, etc.)

#### For Timeline Algorithms (visualization_type: "timeline")

- [ ] **`data.visualization.all_intervals`** - Array of interval objects present
- [ ] Each interval has **`id`** (string) - Unique identifier
- [ ] Each interval has **`start`** (int) - Interval start
- [ ] Each interval has **`end`** (int) - Interval end
- [ ] Each interval has **`color`** (string) - Color identifier
- [ ] Each interval has **`state`** (string) - "examining" | "kept" | "covered"
- [ ] **`data.visualization.call_stack_state`** - Array of call frame objects
- [ ] Each frame has **`id`** (string) - Unique call frame ID
- [ ] Each frame has **`is_active`** (bool) - True for current call
- [ ] Each frame has **`depth`** (int) - Recursion depth

#### For Graph Algorithms (visualization_type: "graph") - Future

- [ ] **`data.visualization.graph.nodes`** - Array of node objects
- [ ] Each node has **`id`** (string) - Node identifier
- [ ] Each node has **`label`** (string) - Display label
- [ ] Each node has **`state`** (string) - "unvisited" | "visiting" | "visited"
- [ ] **`data.visualization.graph.edges`** - Array of edge objects
- [ ] Each edge has **`from`** (string) - Source node ID
- [ ] Each edge has **`to`** (string) - Target node ID

### Prediction Points (Optional)

If implementing prediction mode:

- [ ] **Implements `get_prediction_points()`** - Returns list of prediction dicts
- [ ] Each prediction has **`step_index`** (int) - Step where prediction occurs
- [ ] Each prediction has **`question`** (string) - Clear, concise question
- [ ] Each prediction has **`choices`** (list) - **HARD LIMIT: 2-3 choices maximum**
- [ ] Each choice has **`id`** (string) - Unique choice identifier
- [ ] Each choice has **`label`** (string) - Display text
- [ ] Each prediction has **`correct_answer`** (string) - Choice ID of correct answer
- [ ] Each prediction has **`explanation`** (string) - Feedback after answer
- [ ] **`hint`** (string, optional) - Hint text shown before answer

### Custom Fields (Allowed)

- [ ] **Algorithm-specific fields** - Added to `data` alongside `visualization`
- [ ] **Custom visualization config** - Added to `metadata.visualization_config`
- [ ] **State names** - Use algorithm-appropriate names (e.g., "pivot" for quicksort)

---

## ANTI-PATTERNS (Never Do)

### Contract Violations

- [ ] ✅ **NOT omitting required metadata fields** (algorithm, display_name, etc.)
- [ ] ✅ **NOT using non-standard visualization_type** (must be array/timeline/graph/tree)
- [ ] ✅ **NOT returning steps without visualization data**
- [ ] ✅ **NOT exceeding 3 prediction choices** (HARD LIMIT)

### Base Class Violations

- [ ] ✅ **NOT modifying `base_tracer.py`** for algorithm-specific code
- [ ] ✅ **NOT hardcoding step types in base class**
- [ ] ✅ **NOT bypassing `_add_step()` method**

### Narrative Anti-Patterns

- [ ] ✅ **NOT referencing undefined variables in narrative**

  - Example ❌: "Compare with max_end" (but max_end value not shown)
  - Example ✅: "Compare 720 with max_end (660)"

- [ ] ✅ **NOT skipping decision outcomes**

  - Example ❌: "Examining interval... [next step unrelated]"
  - Example ✅: "Examining interval [900, 960] → KEPT (extends coverage)"

- [ ] ✅ **NOT using centralized narrative generator**

  - Each algorithm narrates ITSELF
  - No shared generator with if/elif chains

- [ ] ✅ **NOT creating narratives that require code to understand**

  - Narrative must be self-contained
  - All data referenced must be visible in narrative

- [ ] ✅ **NOT including arithmetic errors in narratives**
  - Example ❌: "20 - 10 = 20 elements remain"
  - Example ✅: "20 - 10 = 10 elements remain"
  - FAA will catch these before QA review

### Narrative Gap Anti-Patterns

- [ ] ✅ **NOT introducing surprise result fields**

  - Example ❌: Result contains `{"winning_position": 6}` but narrative never explains position tracking
  - Example ✅: Narrative shows "We remember this position (6) since it achieved our best result so far"

- [ ] ✅ **NOT performing silent bookkeeping**

  - Example ❌: Algorithm tracks data but treats it as "implementation detail"
  - Example ✅: Explain why tracking matters: "We track X because final answer needs Y"

- [ ] ✅ **NOT omitting visualization guidance**
  - Example ❌: Narrative ends without helping frontend understand data priorities
  - Example ✅: Include standardized visualization hints section with backend insights

---

## FREE CHOICES (Your Decision)

### Allowed Customizations

- [ ] **Step types** - Define your own (e.g., "CALCULATE_MID", "PARTITION", "MERGE")
- [ ] **State names** - Use algorithm-appropriate names (e.g., "unsorted", "pivot", "partitioned")
- [ ] **Additional metrics** - Add custom fields (comparisons, swaps, custom_metric)
- [ ] **Visualization config** - Extend with algorithm-specific settings
- [ ] **Execution stats** - Add to `metadata.execution_stats`
- [ ] **Narrative formatting** - Markdown style choices (headers, emphasis, lists)
- [ ] **Visualization hint depth** - Provide detailed or minimal frontend guidance

---

## Testing Checklist

### Unit Tests

- [ ] **Valid trace structure** - Trace follows contract
- [ ] **Visualization data complete** - All required fields present
- [ ] **Step sequence logical** - Steps progress correctly
- [ ] **Prediction points valid** - If implemented, ≤3 choices each
- [ ] **Handles edge cases** - Empty input, single element, etc.

### Narrative Tests

- [ ] **All examples generate narratives** - No exceptions raised
- [ ] **Narratives reveal missing data** - Method fails loudly on incomplete visualization data
- [ ] **Narratives are logically complete** - QA can follow algorithm logic
- [ ] **Narratives demonstrate temporal coherence** - Step flow makes sense
- [ ] **Result field traceability verified** - All output fields have narrative trail
- [ ] **Visualization hints included** - Frontend guidance section present

### FAA Audit

- [ ] **Narratives pass arithmetic verification** - All quantitative claims verified correct
- [ ] **FAA approval obtained** - No arithmetic errors detected
- [ ] **Arithmetic errors fixed if found** - Regenerate and resubmit until FAA passes

### Integration Tests

- [ ] **Flask endpoint works** - `/api/trace/unified` accepts algorithm
- [ ] **Registry integration** - Algorithm registered correctly
- [ ] **Frontend can load** - Trace visible in browser console
- [ ] **No base class changes** - `base_tracer.py` unchanged

---

## Example: Enhanced Validation Pattern

```python
def validate_enhanced_tracer():
    tracer = MyAlgorithmTracer()
    result = tracer.execute({'input': 'test_data'})

    # LOCKED requirements
    assert result['metadata']['algorithm'] == 'my-algorithm'
    assert result['metadata']['display_name'] == 'My Algorithm'

    # Generate and validate narrative
    narrative = tracer.generate_narrative(result)

    # Result field traceability check
    result_fields = list(result['result'].keys())
    for field in result_fields:
        assert field in narrative or field.replace('_', ' ') in narrative, \
            f"Result field '{field}' missing from narrative"

    # Visualization hints check
    assert "🎨 Frontend Visualization Hints" in narrative, \
        "Missing visualization guidance section"
    assert "### Primary Metrics to Emphasize" in narrative, \
        "Missing primary metrics guidance"
    assert "### Key JSON Paths" in narrative, \
        "Missing JSON path guidance"

    print("✅ Enhanced tracer validation passed")
```

---

## Workflow Integration

**Stage 1: Backend Implementation**

1. ✅ Implement tracer class
2. ✅ Implement `generate_narrative()` method with visualization hints
3. ✅ Run unit tests
4. ✅ Generate narratives for ALL registered examples
5. ✅ **Verify result field traceability**
6. ✅ **Submit narratives to FAA audit** (using `FAA_PERSONA.md`)
7. ✅ **Fix arithmetic errors, regenerate until FAA passes**
8. ✅ Self-review narratives (use expanded checklist above)
9. ✅ Complete this checklist
10. ✅ Submit PR with code + FAA-approved narratives + checklist

**Next Stage:** PE Narrative Review (see WORKFLOW.md Stage 2)

---

**Remember:**

- If your tracer requires changes to `base_tracer.py`, you've misunderstood the architecture
- If your narrative has undefined variable references, you've missed required visualization data
- If your result has surprise fields, you've missed narrative context requirements
- If your narrative lacks visualization hints, you've missed frontend guidance opportunity
