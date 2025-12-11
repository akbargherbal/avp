# Backend Algorithm Tracer Compliance Checklist

**Version:** 1.0  
**Authority:** TENANT_GUIDE.md v1.0 - Section 2.1 (Backend JSON Contract)  
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

## ⌠ANTI-PATTERNS (Never Do)

### Contract Violations

- [ ] ✅ **NOT omitting required metadata fields** (algorithm, display_name, etc.)
- [ ] ✅ **NOT using non-standard visualization_type** (must be array/timeline/graph/tree)
- [ ] ✅ **NOT returning steps without visualization data**
- [ ] ✅ **NOT exceeding 3 prediction choices** (HARD LIMIT)

### Base Class Violations

- [ ] ✅ **NOT modifying `base_tracer.py`** for algorithm-specific code
- [ ] ✅ **NOT hardcoding step types in base class**
- [ ] ✅ **NOT bypassing `_add_step()` method**

---

## FREE CHOICES (Your Decision)

### Allowed Customizations

- [ ] **Step types** - Define your own (e.g., "CALCULATE_MID", "PARTITION", "MERGE")
- [ ] **State names** - Use algorithm-appropriate names (e.g., "unsorted", "pivot", "partitioned")
- [ ] **Additional metrics** - Add custom fields (comparisons, swaps, custom_metric)
- [ ] **Visualization config** - Extend with algorithm-specific settings
- [ ] **Execution stats** - Add to `metadata.execution_stats`

---

## Testing Checklist

### Unit Tests

- [ ] **Valid trace structure** - Trace follows contract
- [ ] **Visualization data complete** - All required fields present
- [ ] **Step sequence logical** - Steps progress correctly
- [ ] **Prediction points valid** - If implemented, ≤3 choices each
- [ ] **Handles edge cases** - Empty input, single element, etc.

### Integration Tests

- [ ] **Flask endpoint works** - `/api/trace` accepts algorithm
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

    print("✅ Binary Search trace is compliant")
```

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

✅ **PASS** - All LOCKED requirements met, CONSTRAINED contract followed  
 **MINOR ISSUES** - Free choices questionable but acceptable  
**FAIL** - LOCKED requirements violated, return to development

---

**Remember:** If your tracer requires changes to `base_tracer.py`, you've misunderstood the architecture. Stop and reassess.
