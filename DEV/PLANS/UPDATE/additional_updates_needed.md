# Additional Updates Needed for Graph Algorithm Integration

**Context:** Implementing Tier 3 Graph Algorithms (DFS, BFS, Topological Sort, Dijkstra)  
**Status:** Pre-Implementation Planning  
**Date:** December 23, 2025

---

## Critical Updates Beyond BACKEND_CHECKLIST.md

### 🔴 CRITICAL PRIORITY (Required Before DFS Implementation)

---

#### 1. **base_tracer.py - Add Graph Helper Methods**

**File:** `backend/algorithms/base_tracer.py`  
**Current State:** Designed for array/timeline algorithms  
**Issue:** No helper methods for common graph operations

**Required Additions:**

```python
# Add to AlgorithmTracer class

def _format_adjacency_list(self, graph: Dict[str, List[str]]) -> str:
    """
    Convert adjacency list to markdown table format.
    
    Args:
        graph: Dict mapping node_id to list of neighbor node_ids
        
    Returns:
        Markdown table string showing graph structure
        
    Example:
        >>> graph = {'A': ['B', 'C'], 'B': ['D']}
        >>> print(tracer._format_adjacency_list(graph))
        | Node | Neighbors |
        |------|-----------|
        | A    | [B, C]    |
        | B    | [D]       |
    """
    lines = ["| Node | Neighbors |", "|------|-----------|"]
    for node_id in sorted(graph.keys()):
        neighbors = graph[node_id]
        neighbor_str = f"[{', '.join(neighbors)}]" if neighbors else "[]"
        lines.append(f"| {node_id}    | {neighbor_str}    |")
    return "\n".join(lines)


def _format_node_state_table(self, nodes: List[Dict], 
                              columns: List[str] = None) -> str:
    """
    Format node states as markdown table.
    
    Args:
        nodes: List of node dicts with at least 'id' field
        columns: List of column names to include (default: all keys)
        
    Returns:
        Markdown table with node states
        
    Example:
        >>> nodes = [
        ...     {'id': 'A', 'state': 'visited', 'distance': 0},
        ...     {'id': 'B', 'state': 'visiting', 'distance': 5}
        ... ]
        >>> print(tracer._format_node_state_table(nodes))
        | Node | State    | Distance |
        |------|----------|----------|
        | A    | visited  | 0        |
        | B    | visiting | 5        |
    """
    if not nodes:
        return "| Node |\n|------|\n| (empty) |"
    
    # Determine columns
    if columns is None:
        columns = list(nodes[0].keys())
    
    # Header
    header = "| " + " | ".join(col.capitalize() for col in columns) + " |"
    separator = "|" + "|".join("------" for _ in columns) + "|"
    
    # Rows
    rows = []
    for node in nodes:
        row_values = []
        for col in columns:
            value = node.get(col, '-')
            # Handle infinity symbol
            if value == float('inf'):
                value = '∞'
            row_values.append(str(value))
        rows.append("| " + " | ".join(row_values) + " |")
    
    return "\n".join([header, separator] + rows)


def _format_traversal_structure(self, structure: List, 
                                  structure_type: str = "stack") -> str:
    """
    Format stack/queue/priority queue for narrative display.
    
    Args:
        structure: List representing stack/queue/pq
        structure_type: "stack" | "queue" | "priority_queue"
        
    Returns:
        Formatted string for narrative
        
    Example:
        >>> stack = ['A', 'B', 'C']
        >>> print(tracer._format_traversal_structure(stack, "stack"))
        Stack: [A, B, C] ← C on top (explored next)
        
        >>> pq = [(3, 'C'), (5, 'B'), (8, 'D')]
        >>> print(tracer._format_traversal_structure(pq, "priority_queue"))
        Priority Queue: [(3, C), (5, B), (8, D)] ← (3, C) has min priority
    """
    if not structure:
        return f"{structure_type.capitalize()}: []"
    
    if structure_type == "stack":
        top_element = structure[-1]
        return f"Stack: {structure} ← {top_element} on top (explored next)"
    
    elif structure_type == "queue":
        front_element = structure[0]
        return f"Queue: {structure} ← {front_element} at front (processed next)"
    
    elif structure_type == "priority_queue":
        # Assume list of (priority, node) tuples
        min_element = structure[0]
        formatted = [f"({p}, {n})" for p, n in structure]
        return f"Priority Queue: [{', '.join(formatted)}] ← {min_element} has min priority"
    
    else:
        return f"{structure_type}: {structure}"


def _build_path_from_previous(self, target: str, 
                                previous_map: Dict[str, str]) -> List[str]:
    """
    Reconstruct path from source to target using previous pointers.
    
    Args:
        target: Target node ID
        previous_map: Dict mapping node_id to previous node in path
        
    Returns:
        List of node IDs from source to target
        
    Example:
        >>> previous = {'B': 'A', 'C': 'A', 'D': 'C'}
        >>> path = tracer._build_path_from_previous('D', previous)
        >>> print(path)
        ['A', 'C', 'D']
    """
    if target not in previous_map or previous_map[target] is None:
        return [target]  # Source node or unreachable
    
    path = []
    current = target
    while current is not None:
        path.append(current)
        current = previous_map.get(current)
    
    return list(reversed(path))
```

**Why Critical:**
- Eliminates code duplication across 4 graph tracers
- Ensures consistent formatting in all graph narratives
- Makes FAA audit easier (standardized table formats)
- Reduces implementation time per algorithm by ~30%

**Estimated Impact:** +120 lines to `base_tracer.py`

---

#### 2. **registry.py - Extend Registration Schema for Graph Algorithms**

**File:** `backend/algorithms/registry.py`  
**Current State:** Supports array/timeline metadata  
**Issue:** No validation for graph-specific metadata fields

**Required Changes:**

```python
# In registry.py

def register(name: str, 
             tracer_class: Type[AlgorithmTracer],
             display_name: str,
             description: str,
             example_inputs: List[Dict],
             visualization_type: str,  # Add validation for "graph"
             visualization_config: Dict = None):  # NEW PARAMETER
    """
    Register algorithm tracer with metadata.
    
    Args:
        ...
        visualization_type: "array" | "timeline" | "graph" | "tree"
        visualization_config: Optional dict for graph-specific config
            For graphs: {'directed': bool, 'weighted': bool}
    """
    
    # Validate visualization_type
    valid_types = ['array', 'timeline', 'graph', 'tree']
    if visualization_type not in valid_types:
        raise ValueError(
            f"Invalid visualization_type '{visualization_type}'. "
            f"Must be one of: {valid_types}"
        )
    
    # Validate graph-specific config
    if visualization_type == 'graph':
        if visualization_config is None:
            raise ValueError(
                "Graph algorithms must provide visualization_config with "
                "'directed' and 'weighted' boolean fields"
            )
        required_keys = {'directed', 'weighted'}
        missing = required_keys - set(visualization_config.keys())
        if missing:
            raise ValueError(
                f"Graph visualization_config missing keys: {missing}"
            )
    
    # Store registration
    registry[name] = {
        'tracer_class': tracer_class,
        'display_name': display_name,
        'description': description,
        'example_inputs': example_inputs,
        'visualization_type': visualization_type,
        'visualization_config': visualization_config or {}
    }
```

**Example Usage:**

```python
# In registry.py - DFS registration
registry.register(
    name='depth-first-search',
    tracer_class=DFSTracer,
    display_name='Depth-First Search',
    description='Graph traversal exploring as far as possible along each branch',
    example_inputs=[
        {
            'name': 'Basic 5-Node Graph',
            'input': {
                'nodes': ['A', 'B', 'C', 'D', 'E'],
                'edges': [('A', 'B'), ('A', 'C'), ('B', 'D'), ('B', 'E')],
                'start_node': 'A'
            }
        }
    ],
    visualization_type='graph',
    visualization_config={'directed': False, 'weighted': False}
)
```

**Why Critical:**
- Prevents registration of invalid graph algorithm metadata
- Ensures frontend receives `directed` and `weighted` flags
- Maintains architectural consistency

**Estimated Impact:** +30 lines to `registry.py`

---

#### 3. **Create docs/templates/GRAPH_NARRATIVE_TEMPLATE.md**

**File:** NEW - `docs/templates/GRAPH_NARRATIVE_TEMPLATE.md`  
**Purpose:** Standardized template for graph algorithm narratives

**Required Content:**

```markdown
# [Algorithm Name] Execution Narrative

**Algorithm:** [Display Name]
**Graph:** [N] nodes, [E] edges ([directed/undirected])
**Start Node:** [start_node]
**Result:** [Success/Failure summary]

---

## Step 0: Graph Structure

**Nodes:** [A, B, C, D, E] ([N] nodes)

**Adjacency List:**
[Use _format_adjacency_list() helper]

**Start Node:** [start_node]

[For weighted graphs, add:]
**Edge Weights:**
- A→B: weight
- B→C: weight

---

## Step 1: Initialize [Data Structures]

**[Structure Name] (stack/queue/priority queue):**
[Use _format_traversal_structure() helper]

**Node States:**
[Use _format_node_state_table() helper with columns: id, state]

[For shortest path algorithms, add:]
**Distance Map:** {A: 0, B: ∞, C: ∞, ...}
**Previous Map:** {A: None, B: None, C: None, ...}

---

## Step N: [Action Description]

**Current Node:** [node_id] (state=[state])

[If examining neighbors:]
**Node [X]'s Neighbors:** [Y, Z]

[If updating distances (Dijkstra):]
**Edge Relaxation [X]→[Y] (weight=[W]):**
- Calculation: dist[X] + weight = [calc]
- Comparison: [new_dist] < dist[Y] ([old_dist])
- Decision: [Update/Keep]

[If pushing to stack/queue:]
**Action:** Push [node] to [structure]
**[Structure] After:** [Use _format_traversal_structure()]

[If path tracking:]
**Path Construction Note:**
We set previous[[node]] = [prev_node] to reconstruct path later.
Path to [node] so far: [source] → ... → [node]

**Node States After:**
[Use _format_node_state_table()]

---

## Step FINAL: [Completion Summary]

**Result:** [Success/Failure]

[If pathfinding:]
**Path Reconstruction:**
- Target: [node]
- Backtrack: [node] → previous[[node]]=[X] → previous[X]=[Y] → ...
- Final Path: [source, ..., target]

[If cycle detection:]
**Cycle Analysis:**
- Nodes processed: [count]
- Unprocessed nodes: [list]
- Cycle found: [nodes involved]

---

## Execution Summary

**Algorithm Strategy:**
[1-2 sentence description of approach]

**Performance:**
- Input: [N] nodes, [E] edges
- Output: [result type]
- Time Complexity: O(...)
- Space Complexity: O(...)

**Key Insight:**
[The "aha!" moment - why this algorithm works]

---

## 🎨 Frontend Visualization Hints

### Primary Metrics to Emphasize

- **[Metric 1]** - Why it matters
- **[Metric 2]** - Why it matters
- **[Metric 3]** - Why it matters

### Visualization Priorities

1. **Topology Display** - [Force-directed/hierarchical/circular layout]
2. **Node State Transitions** - [Color scheme for unvisited/visiting/visited]
3. **Traversal Structure** - [Stack/queue shown as vertical sidebar]
4. **Animation Timing** - [What to animate when]
5. **Path Highlighting** - [If applicable, how to show paths]

### Key JSON Paths

```
step.data.visualization.graph.nodes[*].id
step.data.visualization.graph.nodes[*].state
step.data.visualization.graph.edges[*].from
step.data.visualization.graph.edges[*].to
step.data.visualization.stack (or .queue or .priority_queue)
step.data.visualization.distance_map (if shortest path)
step.data.visualization.previous_map (if pathfinding)
```

### Algorithm-Specific Guidance

[Detailed paragraph about what makes THIS algorithm's visualization unique.
Reference the Executive Summary's guidance on graph visualization priorities.]

---

**Template Version:** 1.0  
**Last Updated:** [Date]  
**Applies To:** All visualization_type: "graph" algorithms
```

**Why Critical:**
- Provides concrete starting point for all 4 graph implementations
- Ensures narrative consistency across DFS/BFS/Topological/Dijkstra
- Reduces time to first draft by 50%
- Serves as reference for QA reviewers

**Estimated Impact:** +150 lines (new file)

---

#### 4. **docs/algorithm-info/ - Create Graph Algorithm Info Files**

**Files:** NEW - 4 files required before implementation
- `docs/algorithm-info/depth-first-search.md`
- `docs/algorithm-info/breadth-first-search.md`
- `docs/algorithm-info/topological-sort.md`
- `docs/algorithm-info/dijkstras-algorithm.md`

**Template (DFS Example):**

```markdown
# Depth-First Search

## What It Does

Depth-First Search (DFS) explores a graph by going as deep as possible along each branch before backtracking. Starting from a source node, it visits a neighbor, then that neighbor's neighbor, and so on, using a stack (or recursion) to remember where to backtrack.

## Why It Matters

DFS is fundamental to graph algorithms and appears in countless applications: detecting cycles in dependencies, solving mazes, topological sorting of tasks, finding connected components, and even in AI game-playing algorithms to explore decision trees.

## Where It's Used

- **Code Analysis:** Finding dependencies in import chains
- **Puzzle Solving:** Maze exploration, Sudoku solvers
- **Network Analysis:** Detecting cycles, finding strongly connected components
- **File Systems:** Directory traversal

## Complexity

- **Time:** O(V + E) where V = vertices, E = edges
- **Space:** O(V) for recursion stack or explicit stack

## Key Insight

The "depth-first" nature comes from the stack's Last-In-First-Out (LIFO) property: the most recently discovered neighbor is explored first, driving the algorithm deep into one branch before exploring others. This contrasts with breadth-first search's level-by-level exploration.
```

**Why Critical:**
- Required by BACKEND_CHECKLIST.md for all algorithms
- Must exist before tracer implementation (registry.get_info() dependency)
- Provides educational context for users
- 4 files × 200 words each = ~800 words total

**Estimated Impact:** +200 lines per file (4 files = 800 lines total)

---

### 🟡 MODERATE PRIORITY (During Template Development)

---

#### 5. **Update docs/compliance/WORKFLOW.md**

**File:** `docs/compliance/WORKFLOW.md`  
**Issue:** May reference array-specific examples, needs graph examples added

**Required Changes:**

**Add to Stage 1 (Backend Implementation):**

```markdown
### Graph Algorithm Considerations (Tier 3+)

For `visualization_type: "graph"` algorithms:

1. **Use base tracer graph helpers:**
   - `_format_adjacency_list()` for Step 0 topology
   - `_format_node_state_table()` for state visualization
   - `_format_traversal_structure()` for stack/queue/pq
   - `_build_path_from_previous()` for path reconstruction

2. **Follow graph narrative template:**
   - Located at `docs/templates/GRAPH_NARRATIVE_TEMPLATE.md`
   - Ensures consistency across graph algorithms

3. **Include required metadata:**
   - `visualization_config.directed`: true/false
   - `visualization_config.weighted`: true/false

4. **Track multi-variable state:**
   - Node states (unvisited/visiting/visited)
   - Traversal structure (stack/queue/priority queue)
   - Algorithm-specific maps (distance, previous, indegree)

See Executive Summary on Graph Narrative Challenges for detailed guidance.
```

**Why Moderate:**
- Not blocking for DFS implementation
- Helpful for subsequent implementations
- Maintains workflow documentation accuracy

**Estimated Impact:** +20 lines

---

#### 6. **Update pytest Test Fixtures for Graph Algorithms**

**File:** `backend/algorithms/tests/conftest.py`  
**Issue:** Current fixtures are array/timeline focused

**Required Additions:**

```python
import pytest

@pytest.fixture
def sample_graph_undirected():
    """Basic undirected graph for testing DFS/BFS."""
    return {
        'nodes': ['A', 'B', 'C', 'D', 'E'],
        'edges': [
            ('A', 'B'), ('A', 'C'),
            ('B', 'D'), ('B', 'E'),
            ('C', 'E')
        ],
        'start_node': 'A'
    }

@pytest.fixture
def sample_graph_directed_dag():
    """Directed acyclic graph for topological sort."""
    return {
        'nodes': ['A', 'B', 'C', 'D', 'E'],
        'edges': [
            ('A', 'B'), ('A', 'C'),
            ('B', 'D'),
            ('C', 'D'), ('C', 'E'),
            ('D', 'E')
        ]
    }

@pytest.fixture
def sample_graph_directed_cycle():
    """Directed graph with cycle for negative testing."""
    return {
        'nodes': ['A', 'B', 'C'],
        'edges': [
            ('A', 'B'),
            ('B', 'C'),
            ('C', 'A')  # Creates cycle
        ]
    }

@pytest.fixture
def sample_graph_weighted():
    """Weighted graph for Dijkstra's algorithm."""
    return {
        'nodes': ['A', 'B', 'C', 'D', 'E'],
        'edges': [
            ('A', 'B', 5),  # (from, to, weight)
            ('A', 'C', 3),
            ('B', 'D', 2),
            ('C', 'D', 6),
            ('C', 'E', 4),
            ('D', 'E', 1)
        ],
        'start_node': 'A'
    }

@pytest.fixture
def sample_graph_disconnected():
    """Graph with disconnected components."""
    return {
        'nodes': ['A', 'B', 'C', 'D'],
        'edges': [
            ('A', 'B')
            # C and D are isolated
        ],
        'start_node': 'A'
    }
```

**Why Moderate:**
- Needed for test-driven development
- Ensures edge cases are covered
- Standard fixtures reduce test boilerplate

**Estimated Impact:** +60 lines

---

#### 7. **Create backend/algorithms/tests/test_graph_helpers.py**

**File:** NEW - `backend/algorithms/tests/test_graph_helpers.py`  
**Purpose:** Test the new base tracer graph helper methods

**Required Tests:**

```python
import pytest
from backend.algorithms.base_tracer import AlgorithmTracer

class MockGraphTracer(AlgorithmTracer):
    """Mock tracer for testing helper methods."""
    
    def _get_visualization_state(self):
        return {}
    
    def execute(self, input_data):
        return self._build_trace_result({})

def test_format_adjacency_list():
    tracer = MockGraphTracer()
    graph = {
        'A': ['B', 'C'],
        'B': ['D'],
        'C': [],
        'D': []
    }
    
    result = tracer._format_adjacency_list(graph)
    
    assert '| Node | Neighbors |' in result
    assert '| A    | [B, C]    |' in result
    assert '| C    | []        |' in result

def test_format_node_state_table():
    tracer = MockGraphTracer()
    nodes = [
        {'id': 'A', 'state': 'visited', 'distance': 0},
        {'id': 'B', 'state': 'visiting', 'distance': 5},
        {'id': 'C', 'state': 'unvisited', 'distance': float('inf')}
    ]
    
    result = tracer._format_node_state_table(nodes)
    
    assert '| Id | State | Distance |' in result
    assert '| A  | visited  | 0 |' in result
    assert '| C  | unvisited | ∞ |' in result  # Test infinity handling

def test_format_traversal_structure_stack():
    tracer = MockGraphTracer()
    stack = ['A', 'B', 'C']
    
    result = tracer._format_traversal_structure(stack, 'stack')
    
    assert 'Stack: [' in result
    assert 'C on top' in result

def test_format_traversal_structure_priority_queue():
    tracer = MockGraphTracer()
    pq = [(3, 'C'), (5, 'B'), (8, 'D')]
    
    result = tracer._format_traversal_structure(pq, 'priority_queue')
    
    assert 'Priority Queue:' in result
    assert '(3, C)' in result
    assert 'min priority' in result

def test_build_path_from_previous():
    tracer = MockGraphTracer()
    previous_map = {
        'A': None,
        'B': 'A',
        'C': 'A',
        'D': 'C',
        'E': 'B'
    }
    
    path_to_d = tracer._build_path_from_previous('D', previous_map)
    assert path_to_d == ['A', 'C', 'D']
    
    path_to_e = tracer._build_path_from_previous('E', previous_map)
    assert path_to_e == ['A', 'B', 'E']
    
    path_to_source = tracer._build_path_from_previous('A', previous_map)
    assert path_to_source == ['A']

def test_build_path_unreachable_node():
    tracer = MockGraphTracer()
    previous_map = {
        'A': None,
        'B': 'A'
        # C not in map (unreachable)
    }
    
    path = tracer._build_path_from_previous('C', previous_map)
    assert path == ['C']  # Only target, unreachable from source
```

**Why Moderate:**
- Validates helper methods work correctly
- Catches edge cases (empty graphs, infinity handling)
- Provides confidence before using in actual implementations

**Estimated Impact:** +100 lines

---

### 🟢 LOW PRIORITY (Nice-to-Have / Post-Sprint)

---

#### 8. **Update README.md - Add Graph Algorithms to Feature List**

**File:** `README.md`  
**Location:** "Status" section

**Current:**
```markdown
**Status:** ✅ Platform Architecture Complete - 4 Algorithms Live  
(Interval Coverage, Binary Search, Two Pointer, Sliding Window)
```

**Updated:**
```markdown
**Status:** ✅ Platform Architecture Complete - 8 Algorithms Live

**Array/Timeline (Tier 0-1):**
- Binary Search
- Two Pointer
- Sliding Window
- Interval Coverage

**Graph Algorithms (Tier 3):**
- Depth-First Search (DFS)
- Breadth-First Search (BFS)
- Topological Sort (Kahn's Algorithm)
- Dijkstra's Shortest Path
```

**Why Low Priority:**
- Cosmetic update, no functional impact
- Can be done after implementations complete
- Useful for project visibility

**Estimated Impact:** +10 lines

---

#### 9. **Create docs/ADR/BACKEND/ADR-002-Graph-Algorithm-Patterns.md**

**File:** NEW - Architecture Decision Record for graph patterns  
**Purpose:** Document design decisions for graph implementation approach

**Content Outline:**

```markdown
# ADR-002: Graph Algorithm Implementation Patterns

## Status
Accepted

## Context
Graph algorithms (Tier 3) present unique challenges compared to array/timeline algorithms:
- Multi-dimensional topology (can't be shown linearly)
- High state complexity (20+ variables per step)
- Multi-step result construction (paths built incrementally)

## Decision
We will use the following patterns for all graph algorithm implementations:

1. **Topology Representation:** Markdown lists/tables (not ASCII art)
2. **State Tracking:** Markdown tables for node states, distance maps, etc.
3. **Traversal Structures:** Explicit stack/queue/pq visibility at each step
4. **Path Construction:** Incremental tracking with annotations
5. **Conditional Logic:** Decision tree format for branches

## Consequences

**Positive:**
- Consistent narrative quality across graph algorithms
- Mobile-friendly (no fixed-width ASCII art)
- FAA-auditable (tables are verifiable)
- Reusable helper methods reduce implementation time

**Negative:**
- Graph narratives 2-2.5× longer than array equivalents
- Higher cognitive load for readers (more variables to track)
- Template complexity increases

## Alternatives Considered
[See Executive Summary on Graph Narrative Challenges]

## References
- Executive Summary: Graph Algorithm Narrative Visualization Challenges
- BACKEND_CHECKLIST.md v2.3
- docs/templates/GRAPH_NARRATIVE_TEMPLATE.md
```

**Why Low Priority:**
- Documentation for future maintainers
- Can be written after implementations complete
- Captures lessons learned

**Estimated Impact:** +80 lines

---

#### 10. **Create Example Test for Each Graph Algorithm Type**

**Files:** NEW - Demonstration tests showing expected usage

**Purpose:** Show developers how to use new graph fixtures and helpers

**Example (test_dfs_example.py):**

```python
"""
Example test showing DFS tracer usage.
This is a reference implementation for future graph algorithms.
"""

def test_dfs_basic_traversal(sample_graph_undirected):
    """Example: DFS should visit all nodes in depth-first order."""
    from backend.algorithms.depth_first_search import DFSTracer
    
    tracer = DFSTracer()
    result = tracer.execute(sample_graph_undirected)
    
    # Verify trace structure
    assert result['metadata']['visualization_type'] == 'graph'
    assert result['metadata']['visualization_config']['directed'] == False
    
    # Verify all nodes visited
    visited = result['result']['visited_nodes']
    assert set(visited) == {'A', 'B', 'C', 'D', 'E'}
    
    # Verify narrative generates without errors
    narrative = tracer.generate_narrative(result)
    assert '## Step 0: Graph Structure' in narrative
    assert 'Adjacency List:' in narrative
    assert '🎨 Frontend Visualization Hints' in narrative

def test_dijkstra_shortest_path(sample_graph_weighted):
    """Example: Dijkstra should find shortest path with correct distances."""
    from backend.algorithms.dijkstras_algorithm import DijkstraTracer
    
    tracer = DijkstraTracer()
    result = tracer.execute(sample_graph_weighted)
    
    # Verify shortest path to E
    assert result['result']['paths']['E'] == ['A', 'C', 'E']
    assert result['result']['distances']['E'] == 7  # A→C(3) + C→E(4)
    
    # Verify narrative shows path construction
    narrative = tracer.generate_narrative(result)
    assert 'previous[E]' in narrative  # Path tracking visible
    assert 'dist[A] + weight' in narrative  # Edge relaxation shown
```

**Why Low Priority:**
- Educational, not functional
- Can be added as implementations mature
- Helpful for onboarding new contributors

**Estimated Impact:** +50 lines per algorithm (200 lines total for 4 algorithms)

---

## Summary: Complete Update Checklist

| File/Component | Priority | Lines Added | Timeline |
|----------------|----------|-------------|----------|
| **base_tracer.py** (graph helpers) | 🔴 Critical | +120 | Before DFS |
| **registry.py** (graph validation) | 🔴 Critical | +30 | Before DFS |
| **GRAPH_NARRATIVE_TEMPLATE.md** | 🔴 Critical | +150 | Before DFS |
| **algorithm-info/*.md** (4 files) | 🔴 Critical | +800 | Before DFS |
| **BACKEND_CHECKLIST.md** | 🔴 Critical | +140 | Before DFS |
| **WORKFLOW.md** (graph section) | 🟡 Moderate | +20 | During template |
| **conftest.py** (test fixtures) | 🟡 Moderate | +60 | During template |
| **test_graph_helpers.py** | 🟡 Moderate | +100 | During template |
| **README.md** (status update) | 🟢 Low | +10 | After sprint |
| **ADR-002** (design doc) | 🟢 Low | +80 | After sprint |
| **Example tests** (4 algorithms) | 🟢 Low | +200 | After sprint |
| **Total** | - | **~1,710 lines** | - |

---

## Recommended Implementation Order

### Phase 1: Critical Foundation (Day 1)
**Before starting DFS implementation:**

1. ✅ Update `BACKEND_CHECKLIST.md` (v2.3)
2. ✅ Add graph helpers to `base_tracer.py`
3. ✅ Update `registry.py` with graph validation
4. ✅ Create `GRAPH_NARRATIVE_TEMPLATE.md`
5. ✅ Write all 4 algorithm info files

**Deliverable:** Foundation ready for DFS proof-of-concept

**Estimated Time:** 6-8 hours

---

### Phase 2: DFS Proof-of-Concept (Days 2-3)
**Validate the foundation:**

1. ✅ Implement DFS tracer using template
2. ✅ Generate narratives for 2-3 examples
3. ✅ Submit to FAA audit
4. ✅ Identify any missing patterns

**Deliverable:** Working DFS tracer + FAA-approved narratives

**Estimated Time:** 12-16 hours

---

### Phase 3: Template Refinement (Day 3-4)
**Based on DFS learnings:**

1. ✅ Update `WORKFLOW.md` with graph guidance
2. ✅ Add test fixtures to `conftest.py`
3. ✅ Create `test_graph_helpers.py`
4. ✅ Refine template based on DFS experience

**Deliverable:** Reusable template for remaining 3 algorithms

**Estimated Time:** 8-10 hours

---

### Phase 4: Remaining Implementations (Days 5-8)
**Using refined template:**

1. ✅ BFS tracer (similar to DFS, ~8 hours)
2. ✅ Topological Sort tracer (cycle detection, ~10 hours)
3. ✅ Dijkstra tracer (most complex, ~16 hours)

**Deliverable:** 4 complete graph algorithms

**Estimated Time:** 34 hours

---

### Phase 5: Polish (Day 9)
**Documentation and examples:**

1. ✅ Update `README.md`
2. ✅ Write `ADR-002`
3. ✅ Add example tests
4. ✅ Final integration testing

**Deliverable:** Production-ready Tier 3 sprint

**Estimated Time:** 6-8 hours

---

## Total Effort Estimate

| Phase | Hours | Days (8hr/day) |
|-------|-------|----------------|
| Phase 1: Foundation | 6-8 | 1 |
| Phase 2: DFS POC | 12-16 | 2 |
| Phase 3: Refinement | 8-10 | 1 |
| Phase 4: Implementations | 34 | 4 |
| Phase 5: Polish | 6-8 | 1 |
| **Total** | **66-76 hours** | **~9 days** |

**With 20% buffer:** 80-90 hours (~10-11 days)

---

## Risk Mitigation

**What if DFS POC reveals fundamental issues?**

- **Contingency:** Phase 2 includes "identify missing patterns"
- **Response:** Update template and helpers before proceeding to Phase 4
- **Buffer:** 20% time buffer allows for template iteration

**What if FAA audit failures are high?**

- **Prevention:** Base tracer helpers ensure consistent formatting
- **Prevention:** Template includes FAA self-check prompts
- **Contingency:** Each implementation includes FAA iteration time

**What if narrative length becomes prohibitive?**

- **Monitoring:** Track narrative length in Phase 2 (DFS)
- **Threshold:** If >3× array length, reassess modular sub-step approach
- **Fallback:** Executive Summary already identified this risk with solutions

---

## Success Criteria

We'll know we're successful when:

1. ✅ All 4 graph tracers pass unit tests
2. ✅ All narratives pass FAA arithmetic audit
3. ✅ QA rates pedagogical quality ≥ 4/5
4. ✅ Narrative length ≤ 2.5× array algorithm average
5. ✅ No base tracer contract violations
6. ✅ Frontend can render all 4 algorithms
7. ✅ Template reduces implementation time by 30% (BFS vs DFS)

---

**Next Action:** Review and approve Phase 1 task list, then begin foundation updates.
