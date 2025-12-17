# Backend Checklist: Algorithm Tracer Compliance Checklist

**Version:** 2.1  
**Authority:** WORKFLOW.md v2.1 - Backend Requirements  
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

### Narrative Generation (NEW in v2.0)

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

### Narrative Anti-Patterns (NEW in v2.0)

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

---

## FREE CHOICES (Your Decision)

### Allowed Customizations

- [ ] **Step types** - Define your own (e.g., "CALCULATE_MID", "PARTITION", "MERGE")
- [ ] **State names** - Use algorithm-appropriate names (e.g., "unsorted", "pivot", "partitioned")
- [ ] **Additional metrics** - Add custom fields (comparisons, swaps, custom_metric)
- [ ] **Visualization config** - Extend with algorithm-specific settings
- [ ] **Execution stats** - Add to `metadata.execution_stats`
- [ ] **Narrative formatting** - Markdown style choices (headers, emphasis, lists)

---

## Testing Checklist

### Unit Tests

- [ ] **Valid trace structure** - Trace follows contract
- [ ] **Visualization data complete** - All required fields present
- [ ] **Step sequence logical** - Steps progress correctly
- [ ] **Prediction points valid** - If implemented, ≤3 choices each
- [ ] **Handles edge cases** - Empty input, single element, etc.

### Narrative Tests (NEW in v2.0)

- [ ] **All examples generate narratives** - No exceptions raised
- [ ] **Narratives reveal missing data** - Method fails loudly on incomplete visualization data
- [ ] **Narratives are logically complete** - QA can follow algorithm logic
- [ ] **Narratives demonstrate temporal coherence** - Step flow makes sense

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

## Example: Binary Search Validation

```python
# Quick validation script
def validate_binary_search_trace():
    tracer = BinarySearchTracer()
    result = tracer.execute({'array': [1,3,5,7,9], 'target': 5})

    # LOCKED requirements
    assert result['metadata']['algorithm'] == 'binary-search'
    assert result['metadata']['display_name'] == 'Binary Search'
    assert result['metadata']['visualization_type'] == 'array'
    assert result['metadata']['input_size'] == 5

    # CONSTRAINED requirements
    step = result['trace']['steps'][0]
    assert 'visualization' in step['data']
    assert 'array' in step['data']['visualization']
    assert len(step['data']['visualization']['array']) == 5
    assert 'pointers' in step['data']['visualization']

    # Prediction constraints
    if 'prediction_points' in result['metadata']:
        for pred in result['metadata']['prediction_points']:
            assert len(pred['choices']) <= 3, "HARD LIMIT VIOLATED"

    # NEW: Narrative validation
    narrative = tracer.generate_narrative(result)
    assert isinstance(narrative, str), "Narrative must be string"
    assert len(narrative) > 0, "Narrative cannot be empty"
    assert "Step 0" in narrative, "Narrative must include step information"
    
    # Save narrative for FAA audit
    output_path = f"docs/narratives/binary-search/basic_example.md"
    with open(output_path, 'w') as f:
        f.write(narrative)

    print("✅ Binary Search trace is compliant")
    print(f"✅ Narrative saved to {output_path}")
    print("⏳ Next: Submit to FAA audit using FAA_PERSONA.md")
```

---

## Narrative Generation Pattern Example

```python
class BinarySearchTracer(AlgorithmTracer):
    def generate_narrative(self, trace_result: dict) -> str:
        """
        Convert trace JSON to human-readable markdown narrative.
        
        CRITICAL: This method must show ALL decision data.
        If you reference a variable, SHOW its value.
        All arithmetic must be correct (FAA will verify).
        """
        narrative = "# Binary Search Execution Narrative\n\n"
        narrative += f"**Input:** Array of {trace_result['metadata']['input_size']} elements\n"
        narrative += f"**Target:** {self.target}\n\n"
        
        for step in trace_result['trace']['steps']:
            step_num = step['step']
            step_type = step['type']
            description = step['description']
            viz = step['data']['visualization']
            
            narrative += f"## Step {step_num}: {description}\n\n"
            
            # Show visualization state with ALL relevant data
            array = viz['array']
            pointers = viz['pointers']
            
            narrative += f"**Array State:**\n"
            narrative += f"```\n"
            for elem in array:
                marker = ""
                if elem['index'] == pointers['left']:
                    marker += "L"
                if elem['index'] == pointers['mid']:
                    marker += "M"
                if elem['index'] == pointers['right']:
                    marker += "R"
                narrative += f"[{elem['index']}]: {elem['value']} ({elem['state']}) {marker}\n"
            narrative += f"```\n\n"
            
            # Show decision with VISIBLE data
            if step_type == 'COMPARE':
                mid_value = array[pointers['mid']]['value']
                narrative += f"**Decision:** Compare target ({self.target}) with mid value ({mid_value})\n"
                
                if self.target == mid_value:
                    narrative += f"**Result:** {self.target} == {mid_value} → FOUND at index {pointers['mid']}\n\n"
                elif self.target < mid_value:
                    narrative += f"**Result:** {self.target} < {mid_value} → Search LEFT half\n\n"
                else:
                    narrative += f"**Result:** {self.target} > {mid_value} → Search RIGHT half\n\n"
        
        return narrative
```

**Key Principles:**
1. Show ALL data referenced in decisions
2. Make comparisons explicit with actual values
3. Explain outcomes clearly
4. Use code blocks for complex state
5. Fail loudly (KeyError) if data missing
6. **Ensure all arithmetic is correct (FAA will verify)**

---

## Quick Reference: Visualization Types

| Type       | When to Use                      | Required Fields                     |
| ---------- | -------------------------------- | ----------------------------------- |
| `array`    | Sorting, searching arrays        | `array`, `pointers` (optional)      |
| `timeline` | Intervals, time-based algorithms | `all_intervals`, `call_stack_state` |
| `graph`    | DFS, BFS, Dijkstra, etc.         | `graph.nodes`, `graph.edges`        |
| `tree`     | Tree traversals, heaps           | TBD (future)                        |

---

## Approval Criteria

✅ **PASS** - All LOCKED requirements met, CONSTRAINED contract followed, narratives generated, FAA approved  
⚠️ **MINOR ISSUES** - Free choices questionable but acceptable  
❌ **FAIL** - LOCKED requirements violated, return to development

**CRITICAL** Narratives must pass FAA arithmetic audit before QA review.

---

## Workflow Integration (v2.1)

**Stage 1: Backend Implementation**

1. ✅ Implement tracer class
2. ✅ Implement `generate_narrative()` method
3. ✅ Run unit tests
4. ✅ Generate narratives for ALL registered examples
5. ✅ **Submit narratives to FAA audit (using `FAA_PERSONA.md`)**
6. ✅ **Fix arithmetic errors, regenerate until FAA passes**
7. ✅ Self-review narratives (use checklist above)
8. ✅ Complete this checklist
9. ✅ Submit PR with code + FAA-approved narratives + checklist

**Next Stage:** QA Narrative Review (see QA_INTEGRATION_CHECKLIST.md)

**Note:** QA assumes arithmetic has been verified by FAA. QA focuses on logical completeness and pedagogical quality.

---

## FAA (Forensic Arithmetic Audit) Process 

**When:** After generating narratives, before QA submission  
**Reference:** `docs/compliance/FAA_PERSONA.md`  
**Expected Time:** 10-15 minutes initial audit, 5 minutes re-audit

**Process:**
1. Submit all generated narratives to FAA review
2. FAA verifies every quantitative claim with calculation
3. If errors found: Fix and regenerate, resubmit to FAA
4. If no errors: FAA approves, proceed to checklist completion
5. Submit PR with FAA-approved narratives

**What FAA Checks:**
- ✅ Arithmetic correctness (20 - 10 = 10, not 20)
- ✅ State transition math (variables update correctly)
- ✅ Quantitative claims consistency
- ✅ Visualization-text alignment

**What FAA Does NOT Check:**
- ❌ Pedagogical quality
- ❌ Narrative completeness
- ❌ Writing style

**Cost-Benefit:** 2 hours of FAA back-and-forth beats 2 days of integration debugging.

---

**Remember:** 
- If your tracer requires changes to `base_tracer.py`, you've misunderstood the architecture
- If your narrative has undefined variable references, you've missed required visualization data
- If your narrative has arithmetic errors, FAA will catch them (this is good!)
- Narratives that fail to generate = bugs caught early (this is good!)

**For detailed narrative implementation guidance, see:** WORKFLOW.md - Stage 1: Backend Implementation  
**For FAA audit guidance, see:** WORKFLOW.md - Stage 1.5: Forensic Arithmetic Audit
