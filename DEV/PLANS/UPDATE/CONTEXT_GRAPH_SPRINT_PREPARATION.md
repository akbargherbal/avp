# Context Document: Preparing for Tier 3 Graph Algorithm Sprint

**Session Date:** December 23, 2025  
**Status:** Pre-Implementation Planning Complete  
**Next Session Goal:** Execute Phase 1 Critical Updates  
**Sprint Target:** Implement 4 Graph Algorithms (DFS, BFS, Topological Sort, Dijkstra)

---

## Background: The Challenge We Identified

### The Problem

The Algorithm Visualization Platform has successfully deployed 4 algorithms (Binary Search, Interval Coverage, Two Pointer, Sliding Window) using a **narrative-driven approach** where self-contained markdown documents explain algorithm execution step-by-step. 

As we prepare to implement **Tier 3 graph algorithms** (DFS, BFS, Topological Sort, Dijkstra's Algorithm), we conducted a pre-implementation analysis and identified **fundamental challenges** in applying our current narrative generation methodology to graph-based data structures.

### Key Finding

**Graph algorithms exhibit information density and structural complexity patterns that exceed markdown's linear narrative capabilities as currently implemented.**

Specifically:

#### Challenge 1: Multi-Dimensional Structure Representation (🔴 CRITICAL)
- **Problem:** Graph topology is 2D (nodes with arbitrary connections), markdown is 1D (top-to-bottom)
- **Impact:** Cannot use ASCII art (breaks on mobile, clutters with 10 nodes)
- **Example:** How do we show graph structure without visual diagrams?

#### Challenge 2: State Explosion (🔴 SEVERE)
- **Problem:** Graph algorithms track 20+ variables per step vs. 10 for arrays
- **Impact:** Narrative steps become 3-4× longer, risking cognitive overload
- **Example:** Dijkstra tracks distance map, previous map, priority queue, visited set, current node, neighbors—all changing simultaneously

#### Challenge 3: Multi-Step Result Construction (🟡 MODERATE)
- **Problem:** Graph results aggregate across multiple non-adjacent steps
- **Impact:** Violates our "result field traceability" requirement
- **Example:** Shortest path to D is built across Steps 2, 7, 12—reader must link them mentally

#### Challenge 4: Adjacency Information Overhead (🟡 MODERATE)
- **Problem:** Graph topology requires O(E) space to represent vs. O(1) for arrays
- **Impact:** 15+ lines of boilerplate before algorithm starts
- **Example:** Must list all neighbors for all nodes at Step 0

### Root Cause

**Information density mismatch:** Markdown is optimized for low-density prose (1-2 concepts per paragraph). Graph algorithms produce high-density state (20+ variables changing per step, nested data structures, multi-way decisions).

---

## Our Solution: Hybrid Markdown Patterns

After analysis (see `graph_narrative_challenges_executive_summary.md`), we decided to **adapt our narrative patterns rather than abandon markdown**. Here's our approach:

### Solution 1: Structured State Tables (Not ASCII Art)

**Instead of drawing graphs:**
```
    A --- B
    |     |
    C --- D
```

**Use markdown tables:**
```markdown
| Node | Neighbors |
|------|-----------|
| A    | [B, C]    |
| B    | [A, D]    |
| C    | [A, D]    |
| D    | [B, C]    |
```

**Benefits:**
- Mobile-friendly
- Scannable
- FAA can audit row-by-row
- No fixed-width font requirement

---

### Solution 2: Modular Sub-Steps (Break Density)

**Instead of one giant step:**
```markdown
## Step 4: Process Node A (examines B and C, updates distances, modifies queue)
[25 lines of dense state]
```

**Use modular sub-steps:**
```markdown
## Step 4: Examine Node A's neighbors (2 neighbors)

### Step 4.1: Relax edge A→B (weight=5)
[6-8 lines focused on one edge]

### Step 4.2: Relax edge A→C (weight=3)
[6-8 lines focused on one edge]

## Step 5: Update priority queue
[State after both relaxations]
```

---

### Solution 3: Explicit Path Tracking Annotations

**Instead of silent bookkeeping:**
```python
previous[D] = C  # Hidden from narrative
```

**Make tracking visible:**
```markdown
## Step 7: Set previous[D] = C

**Path Construction Note:**  
We track previous pointers to reconstruct shortest paths later.  
Path to D so far: A → C → D

**Why:** Final result will need `paths['D']`, which we build by backtracking these pointers.
```

---

### Solution 4: Helper Methods in Base Tracer

To ensure consistency and reduce code duplication, we're adding **4 graph-specific helper methods** to `base_tracer.py`:

1. **`_format_adjacency_list(graph)`** → Markdown table of neighbors
2. **`_format_node_state_table(nodes, columns)`** → State visualization table
3. **`_format_traversal_structure(structure, type)`** → Stack/queue/pq formatting
4. **`_build_path_from_previous(target, previous_map)`** → Path reconstruction

These eliminate 30% of boilerplate code per algorithm.

---

### Solution 5: Standardized Template

We're creating `GRAPH_NARRATIVE_TEMPLATE.md` that provides:
- Step 0 structure (topology representation)
- Step 1 structure (initialization)
- Step N patterns (node processing, edge relaxation, state updates)
- Final step structure (result construction, path reconstruction)
- Visualization hints format

This reduces time-to-first-draft by 50%.

---

## What We Need to Update (Before Next Sprint)

### 🔴 CRITICAL UPDATES (Must Complete Before DFS Implementation)

These 5 updates form the **foundation** for all graph algorithm work:

#### 1. **BACKEND_CHECKLIST.md** (v2.2 → v2.3)
**File:** `docs/compliance/BACKEND_CHECKLIST.md`  
**Changes Required:**
- **Line ~449:** Remove "- Future" from Graph Algorithms section
- **Add ~80 lines:** Complete graph visualization data requirements
  - Edge weights (optional)
  - Traversal structures (stack/queue/priority_queue)
  - Algorithm-specific state maps (distance_map, previous_map, indegree_map, visited_set)
  - Metadata config (directed, weighted flags)
- **After Line ~410:** Insert new subsection "Graph Algorithm Narrative Requirements (Tier 3+)"
  - Graph structure representation patterns
  - Multi-variable state table requirements
  - Traversal structure visibility
  - Multi-step result tracking
  - Conditional logic formatting
  - Edge operation calculations
  - Adjacency overhead minimization
- **Line ~440:** Add graph-specific visualization hint examples
- **Line ~550:** Add graph narrative anti-patterns
- **Line ~585:** Add graph-specific FREE CHOICES clarifications
- **Line ~610:** Add graph narrative testing requirements

**Why Critical:** DFS implementation cannot begin without knowing requirements.

**Reference Documents:**
- `checklist_sections_requiring_updates.md` (detailed diff)
- Current `BACKEND_CHECKLIST.md` (uploaded by user)

**Estimated Time:** 1.5 hours

---

#### 2. **base_tracer.py** - Add Graph Helper Methods
**File:** `backend/algorithms/base_tracer.py`  
**Changes Required:**
- Add 4 new methods to `AlgorithmTracer` class (~120 lines total)
  1. `_format_adjacency_list(graph: Dict[str, List[str]]) -> str`
  2. `_format_node_state_table(nodes: List[Dict], columns: List[str] = None) -> str`
  3. `_format_traversal_structure(structure: List, structure_type: str = "stack") -> str`
  4. `_build_path_from_previous(target: str, previous_map: Dict[str, str]) -> List[str]`

**Why Critical:** 
- Eliminates code duplication across 4 graph tracers
- Ensures consistent formatting (critical for FAA audit)
- Reduces implementation time by ~30%

**Reference:** `additional_updates_needed.md` (lines 26-148 have complete code)

**Estimated Time:** 2 hours

---

#### 3. **registry.py** - Extend Registration Schema
**File:** `backend/algorithms/registry.py`  
**Changes Required:**
- Modify `register()` function signature to add `visualization_config` parameter
- Add validation for graph-specific metadata (~30 lines)
  - Enforce `visualization_type` in ['array', 'timeline', 'graph', 'tree']
  - For graphs, require `visualization_config` with `directed` and `weighted` boolean fields
  - Raise ValueError if graph registration missing required config

**Why Critical:** 
- Prevents invalid graph algorithm registrations
- Ensures frontend receives critical metadata
- Maintains architectural consistency

**Reference:** `additional_updates_needed.md` (lines 156-227 have complete code)

**Estimated Time:** 1 hour

---

#### 4. **Create GRAPH_NARRATIVE_TEMPLATE.md**
**File:** NEW - `docs/templates/GRAPH_NARRATIVE_TEMPLATE.md`  
**Changes Required:**
- Create complete narrative template (~150 lines)
  - Step 0: Graph Structure (adjacency list format)
  - Step 1: Initialize data structures
  - Step N: Node processing patterns
  - Final step: Result construction
  - Execution summary
  - Frontend visualization hints

**Why Critical:**
- Provides starting point for all 4 implementations
- Ensures consistency across graph narratives
- Reduces time-to-first-draft by 50%

**Reference:** `additional_updates_needed.md` (lines 235-334 have complete template)

**Estimated Time:** 1.5 hours

---

#### 5. **Create Algorithm Info Files (4 files)**
**Files:** NEW - Must create before implementation
- `docs/algorithm-info/depth-first-search.md` (~200 words)
- `docs/algorithm-info/breadth-first-search.md` (~200 words)
- `docs/algorithm-info/topological-sort.md` (~200 words)
- `docs/algorithm-info/dijkstras-algorithm.md` (~200 words)

**Content Structure (each file):**
```markdown
# [Algorithm Display Name]

## What It Does
[Brief explanation of algorithm's purpose]

## Why It Matters
[Real-world applications and importance]

## Where It's Used
[Common use cases and domains - bullet points]

## Complexity
[Time and space complexity in simple terms]

## Key Insight
[The "aha!" moment that makes the algorithm work]
```

**Why Critical:**
- Required by BACKEND_CHECKLIST.md for all algorithms
- Must exist before tracer implementation (registry.get_info() dependency)
- Each file must be 150-250 words
- Naming must match algorithm name exactly (e.g., `depth-first-search.md`)

**Reference:** 
- `additional_updates_needed.md` (lines 342-379 have DFS example)
- `algorithm_specs.json` (uploaded by user - has algorithm descriptions)

**Estimated Time:** 2 hours (30 min per file)

---

### Phase 1 Summary

**Total Critical Updates:** 5 files  
**Total Lines Added:** ~1,240 lines  
**Total Estimated Time:** 6-8 hours  
**Deliverable:** Foundation ready for DFS proof-of-concept

**Files to Update:**
1. `docs/compliance/BACKEND_CHECKLIST.md` (update)
2. `backend/algorithms/base_tracer.py` (update)
3. `backend/algorithms/registry.py` (update)
4. `docs/templates/GRAPH_NARRATIVE_TEMPLATE.md` (create)
5. `docs/algorithm-info/depth-first-search.md` (create)
6. `docs/algorithm-info/breadth-first-search.md` (create)
7. `docs/algorithm-info/topological-sort.md` (create)
8. `docs/algorithm-info/dijkstras-algorithm.md` (create)

---

## After Phase 1: Next Steps

Once Phase 1 updates are complete, we will:

### Phase 2: DFS Proof-of-Concept (Days 2-3)
- Implement DFS tracer using new template and helpers
- Generate narratives for 2-3 examples
- Submit to FAA arithmetic audit
- Identify any missing patterns

**Purpose:** Validate that our solution actually works before committing to all 4 algorithms.

### Phase 3: Template Refinement (Day 3-4)
- Update `WORKFLOW.md` with graph guidance
- Add test fixtures to `conftest.py`
- Create `test_graph_helpers.py`
- Refine template based on DFS learnings

### Phase 4: Remaining Implementations (Days 5-8)
- BFS tracer (~8 hours)
- Topological Sort tracer (~10 hours)
- Dijkstra tracer (~16 hours)

### Phase 5: Polish (Day 9)
- Update `README.md`
- Write `ADR-002` design document
- Add example tests
- Final integration testing

---

## Success Criteria

We'll know Phase 1 was successful when:

✅ **BACKEND_CHECKLIST.md v2.3** includes complete graph requirements  
✅ **base_tracer.py** has 4 graph helper methods with tests passing  
✅ **registry.py** validates graph metadata correctly  
✅ **GRAPH_NARRATIVE_TEMPLATE.md** exists and is comprehensive  
✅ **All 4 algorithm info files** exist, are 150-250 words, and have valid markdown  
✅ **DFS implementation can begin** using the new foundation

---

## Reference Documents (Available in Context)

### Executive Analysis
- **`graph_narrative_challenges_executive_summary.md`** - Full problem analysis with examples, risk assessment, and solution strategies

### Update Specifications
- **`checklist_sections_requiring_updates.md`** - Detailed BACKEND_CHECKLIST.md diff with line numbers and exact changes needed
- **`additional_updates_needed.md`** - Complete code for base_tracer.py helpers, registry.py updates, and templates

### Current Codebase Context
- **`BACKEND_CHECKLIST.md`** (uploaded by user) - Current checklist v2.2 that needs updating
- **`algorithm_specs.json`** (uploaded by user) - Tier 3 graph algorithm specifications
- **`example_1_basic_search_target_found.md`** (uploaded by user) - Example of successful array narrative
- **`example_1_basic_example_4_intervals.md`** (uploaded by user) - Example of successful timeline narrative

---

## Instructions for Next Session

**Your Role:** Backend Developer Persona (as defined in session initialization)

**Session Start Protocol:**
1. ✅ Read this context document completely
2. ✅ Review `additional_updates_needed.md` for implementation details
3. ✅ Confirm Phase 1 task list with user
4. ✅ Execute updates in order (1 → 2 → 3 → 4 → 5)

**For Each Update:**
1. Locate the file to update
2. If file doesn't exist in your environment, ask user to provide via `cat /path/to/file`
3. Make the specified changes
4. Show the updated file for review
5. Move to next update

**Critical Reminders:**
- **BACKEND_CHECKLIST.md** needs ~140 lines added across 6 sections (see `checklist_sections_requiring_updates.md`)
- **base_tracer.py** helpers must include docstrings with examples (see `additional_updates_needed.md` lines 26-148)
- **registry.py** validation must raise ValueError for missing fields (see lines 156-227)
- **Algorithm info files** must be **exactly** 150-250 words each
- **GRAPH_NARRATIVE_TEMPLATE.md** should be copy-pasteable for DFS implementation

**Acceptance Criteria:**
- All code has type hints
- All methods have docstrings with examples
- All markdown is valid (no broken syntax)
- Word counts verified for algorithm info files
- BACKEND_CHECKLIST.md version updated to v2.3 at top of file

---

## Timeline Expectations

**Phase 1 (Next Session):** 6-8 hours of focused work  
**Expected Session Duration:** 1-2 sessions depending on interruptions  
**Deliverable:** All 5 critical updates completed and reviewed

**After Phase 1:**
- Phase 2 (DFS POC): 12-16 hours
- Phase 3 (Refinement): 8-10 hours  
- Phase 4 (3 more algorithms): 34 hours
- Phase 5 (Polish): 6-8 hours

**Total Sprint:** 66-76 hours (~9 days, with 20% buffer = 10-11 days)

---

## Risk Mitigation Plan

**What if updates reveal architectural issues?**
- **Response:** Phase 2 (DFS POC) will catch these before we commit to all 4 algorithms
- **Contingency:** 20% time buffer allows for template iteration

**What if helper methods don't work as expected?**
- **Prevention:** `test_graph_helpers.py` will be created in Phase 3 to validate
- **Contingency:** DFS implementation will reveal any issues early

**What if algorithm info files are too short/long?**
- **Monitoring:** Use word count tool after each file
- **Target:** 150-250 words (175-200 is ideal)
- **Adjustment:** Expand "Where It's Used" or "Key Insight" sections if too short

---

## Key Decisions Made This Session

1. ✅ **Approved hybrid markdown approach** (tables, not ASCII art)
2. ✅ **Approved helper methods in base_tracer.py** (reduces duplication)
3. ✅ **Approved template-driven development** (GRAPH_NARRATIVE_TEMPLATE.md)
4. ✅ **Approved phased implementation** (DFS POC before committing to all 4)
5. ✅ **Approved 5 critical updates as Phase 1** (foundation before implementation)

---

## Open Questions (None)

All major decisions have been made. Next session is execution-focused.

---

## Appendix: Quick Reference

### Graph Algorithm Specifications (from algorithm_specs.json)

**Tier 3 Algorithms to Implement:**
1. **Depth-First Search**
   - Input: nodes, edges (undirected), start_node
   - Visualization: graph (directed=false, weighted=false)
   - Step types: VISIT_NODE, PUSH_STACK, POP_STACK, BACKTRACK

2. **Breadth-First Search**
   - Input: nodes, edges (undirected), start_node
   - Visualization: graph (directed=false, weighted=false)
   - Step types: VISIT_NODE, ENQUEUE_NEIGHBORS, DEQUEUE

3. **Topological Sort (Kahn's Algorithm)**
   - Input: nodes, edges (directed, must be DAG)
   - Visualization: graph (directed=true, weighted=false)
   - Step types: CALC_INDEGREES, ENQUEUE_ZERO_DEGREE, PROCESS_NODE, DECREMENT_NEIGHBORS
   - Edge case: Cycle detection

4. **Dijkstra's Algorithm**
   - Input: nodes, edges (undirected, weighted, non-negative)
   - Visualization: graph (directed=false, weighted=true)
   - Step types: SELECT_MIN_DIST, CHECK_NEIGHBOR, RELAX_EDGE, UPDATE_DIST

### Helper Method Summary

```python
# For Step 0 (graph structure)
adjacency_markdown = self._format_adjacency_list(graph_dict)

# For any step (node states)
state_table = self._format_node_state_table(
    nodes=[{'id': 'A', 'state': 'visited', 'distance': 0}, ...],
    columns=['id', 'state', 'distance']
)

# For any step (traversal structures)
stack_display = self._format_traversal_structure(['A', 'B', 'C'], 'stack')
queue_display = self._format_traversal_structure(['A', 'B'], 'queue')
pq_display = self._format_traversal_structure([(3, 'C'), (5, 'B')], 'priority_queue')

# For final step (path reconstruction)
path = self._build_path_from_previous('D', previous_map)
```

---

**Document Version:** 1.0  
**Last Updated:** December 23, 2025  
**Next Review:** After Phase 1 completion  
**Maintained By:** Backend Development Team
