# BACKEND_CHECKLIST.md Sections Requiring Updates for Graph Algorithms

**Analysis Date:** December 23, 2025  
**Context:** Pre-Tier 3 Graph Algorithm Sprint  
**Reference:** Executive Summary on Graph Narrative Challenges

---

## Sections Requiring Modification

### 🔴 CRITICAL UPDATES REQUIRED

#### 1. **CONSTRAINED REQUIREMENTS → Graph Algorithms Section**

**Current Status:** Marked as "Future" with placeholder requirements

**Location:** Line ~449 in current checklist

**Current Content:**
```markdown
#### For Graph Algorithms (visualization_type: "graph") - Future

- [ ] **`data.visualization.graph.nodes`** - Array of node objects
- [ ] Each node has **`id`** (string) - Node identifier
- [ ] Each node has **`label`** (string) - Display label
- [ ] Each node has **`state`** (string) - "unvisited" | "visiting" | "visited"
- [ ] **`data.visualization.graph.edges`** - Array of edge objects
- [ ] Each edge has **`from`** (string) - Source node ID
- [ ] Each edge has **`to`** (string) - Target node ID
```

**Required Changes:**

1. **Remove "- Future" designation**
2. **Add weighted graph support:**
   ```markdown
   - [ ] Each edge has **`weight`** (int, optional) - Edge weight for weighted graphs
   ```

3. **Add traversal structure tracking:**
   ```markdown
   - [ ] **`data.visualization.stack`** (optional) - Array for DFS stack state
   - [ ] **`data.visualization.queue`** (optional) - Array for BFS queue state
   - [ ] **`data.visualization.priority_queue`** (optional) - Array of (priority, node) tuples for Dijkstra
   ```

4. **Add algorithm-specific state maps:**
   ```markdown
   - [ ] **`data.visualization.distance_map`** (optional) - Dict for shortest path distances (Dijkstra)
   - [ ] **`data.visualization.previous_map`** (optional) - Dict for path reconstruction
   - [ ] **`data.visualization.indegree_map`** (optional) - Dict for topological sort
   - [ ] **`data.visualization.visited_set`** (optional) - Set/list of visited nodes
   ```

5. **Add graph configuration:**
   ```markdown
   - [ ] **`metadata.visualization_config.directed`** (bool) - Whether graph is directed
   - [ ] **`metadata.visualization_config.weighted`** (bool) - Whether graph has edge weights
   ```

**Why:** Current placeholder is insufficient for actual implementation. Missing critical data structures needed for all 4 Tier 3 algorithms.

---

#### 2. **NARRATIVE GENERATION Section**

**Location:** Lines ~370-410

**Required Addition:** New subsection on graph-specific narrative patterns

**Insert After:** "Narrative passes FAA arithmetic audit" checklist item

**New Content:**

```markdown
### Graph Algorithm Narrative Requirements (Tier 3+)

For algorithms with `visualization_type: "graph"`:

- [ ] **Graph structure representation follows approved pattern**
  - Use markdown lists for adjacency (not ASCII art)
  - Show topology at Step 0 in scannable format
  - Reference topology implicitly in subsequent steps ("Node A's 2 neighbors")

- [ ] **Multi-variable state shown in tables**
  - Node states, distances, previous pointers presented in markdown tables
  - Tables updated incrementally (show "Before" and "After" when helpful)
  - FAA can verify calculations row-by-row

- [ ] **Traversal structures visible at each step**
  - Stack/Queue/Priority Queue contents shown explicitly
  - Format: `Stack: [A, B, C]` or `Queue: [(3, C), (5, B)]`
  - Changes to these structures explained ("Push B" → Stack becomes [A, B])

- [ ] **Multi-step result construction tracked**
  - Path building shown incrementally (not just final reconstruction)
  - Add "tracking annotations" when setting previous pointers
  - Example: "We track previous[D]=C to reconstruct shortest path later"
  - Final path reconstruction references earlier steps

- [ ] **Conditional logic uses decision tree format**
  - If/else branches shown explicitly
  - Example: "IF indegree==0 THEN enqueue ELSE skip"
  - Failure cases explained (cycle detection, unreachable nodes)

- [ ] **Edge operations show complete calculation**
  - For weighted graphs: `dist[A] + weight(A→B) = 0 + 5 = 5`
  - For relaxation: Show old distance, new distance, comparison
  - For edge selection: Explain why this edge was chosen

- [ ] **Adjacency information overhead minimized**
  - Full adjacency list shown once at Step 0
  - Subsequent steps reference specific neighbors only
  - Example: "Node A has 3 neighbors: [B, C, D]" instead of re-listing entire graph
```

**Why:** Graph narratives require fundamentally different patterns than array narratives. Without explicit guidance, implementers will create inconsistent narratives that fail QA review.

---

### 🟡 MODERATE UPDATES REQUIRED

#### 3. **Frontend Visualization Guidance Section**

**Location:** Lines ~420-440

**Current Content:** Generic template for all algorithm types

**Required Changes:**

**Add graph-specific hint examples:**

```markdown
### Algorithm-Specific Guidance Examples

**For Array Algorithms:**
Binary search is about visualizing the "shrinking search space"...

**For Timeline Algorithms:**
Interval coverage emphasizes the "coverage extension" concept...

**For Graph Algorithms:**
Graph traversals require showing:
1. **Topology context** - How nodes connect (use force-directed layout or hierarchical)
2. **Traversal order** - Number nodes as visited (1, 2, 3...)
3. **Active structure** - Stack/queue shown as vertical sidebar with animations
4. **State transitions** - Node color changes (unvisited→visiting→visited)
5. **Path highlighting** - For shortest path algorithms, highlight current best path
6. **Multi-variable overlays** - Distance/indegree labels on nodes

Example paths to emphasize:
- `step.data.visualization.graph.nodes[*].state`
- `step.data.visualization.stack` or `.queue` or `.priority_queue`
- `step.data.visualization.distance_map`
- `step.data.visualization.visited_set`
```

**Why:** Frontend developers need concrete guidance on what makes graph visualizations pedagogically effective.

---

#### 4. **ANTI-PATTERNS Section → Narrative Anti-Patterns**

**Location:** Lines ~510-550

**Required Addition:** Graph-specific anti-patterns

**Add New Subsection:**

```markdown
### Graph Algorithm Narrative Anti-Patterns

- [ ] ✅ **NOT using ASCII art for graph topology**
  - Example ❌: Drawing complex node-edge diagrams in fixed-width text
  - Example ✅: Using markdown lists/tables for adjacency

- [ ] ✅ **NOT hiding traversal structure state**
  - Example ❌: "Process next node from queue" (but queue contents not shown)
  - Example ✅: "Dequeue B from [B, C, D] → Queue becomes [C, D]"

- [ ] ✅ **NOT omitting path construction steps**
  - Example ❌: Final result shows path [A, C, D] but never explained how it was built
  - Example ✅: Step 7: "Set previous[D]=C (for path reconstruction)"

- [ ] ✅ **NOT showing incomplete distance/state maps**
  - Example ❌: "Update distance to B" (but distance map not shown)
  - Example ✅: Show full table with B's row highlighted as updated

- [ ] ✅ **NOT explaining conditional branches inadequately**
  - Example ❌: "Cycle detected" (but no explanation of how/why)
  - Example ✅: Show if/else logic, evaluate condition, explain outcome
```

**Why:** Graph algorithms introduce new failure modes that don't exist in array algorithms.

---

### 🟢 MINOR UPDATES (Clarifications)

#### 5. **FREE CHOICES Section**

**Location:** Lines ~570-585

**Required Addition:** Graph-specific customization examples

```markdown
- [ ] **Graph layout hints** - Suggest node positioning for frontend (optional)
- [ ] **Edge styling** - Custom edge colors/thickness for algorithm semantics
- [ ] **Cycle highlighting** - Mark detected cycles in topological sort
```

**Why:** Clarifies that graph tracers have additional customization options.

---

#### 6. **Testing Checklist → Narrative Tests**

**Location:** Lines ~600-610

**Required Addition:**

```markdown
### Graph Algorithm Narrative Tests (Tier 3+)

- [ ] **Graph topology shown in Step 0** - Adjacency list present
- [ ] **Traversal structures tracked** - Stack/queue/priority queue visible
- [ ] **Multi-variable state tables present** - Distance maps, indegree maps, etc.
- [ ] **Path construction traceable** - Can follow how final paths were built
- [ ] **Conditional branches explained** - Cycle detection, unreachable nodes covered
```

**Why:** Ensures graph-specific narrative requirements are tested.

---

## Sections NOT Requiring Changes

### ✅ No Updates Needed

1. **LOCKED REQUIREMENTS → Metadata Structure**
   - Already flexible enough for graph metadata
   - `visualization_type: "graph"` already supported

2. **LOCKED REQUIREMENTS → Trace Structure**
   - Generic enough to handle graph steps
   - No changes needed

3. **LOCKED REQUIREMENTS → Inheritance & Base Class**
   - Base class contract remains unchanged
   - Graph tracers use same inheritance pattern

4. **Contract Violations Anti-Patterns**
   - Generic enough to apply to graphs
   - No graph-specific violations to add

5. **Example Validation Pattern**
   - Works for graph algorithms as-is
   - May want to add graph example later, but not required

---

## Summary Table

| Section | Update Priority | Reason | Estimated LOC Added |
|---------|----------------|--------|---------------------|
| Graph Algorithms (CONSTRAINED) | 🔴 Critical | Missing required fields | +30 lines |
| Narrative Generation (Graph subsection) | 🔴 Critical | Missing graph patterns | +50 lines |
| Frontend Visualization Guidance | 🟡 Moderate | Need graph examples | +20 lines |
| Narrative Anti-Patterns (Graph) | 🟡 Moderate | Prevent common mistakes | +25 lines |
| FREE CHOICES (Graph options) | 🟢 Minor | Clarification only | +5 lines |
| Testing Checklist (Graph tests) | 🟢 Minor | Ensure completeness | +10 lines |
| **Total** | - | - | **~140 lines** |

---

## Proposed Update Workflow

### Phase 1: Critical Updates (Before DFS Proof-of-Concept)
1. Update Graph Algorithms section in CONSTRAINED REQUIREMENTS
2. Add Graph Algorithm Narrative Requirements subsection
3. Update checklist version to v2.3
4. Commit changes

**Rationale:** DFS implementation needs these requirements to be compliant.

### Phase 2: Supporting Updates (During Template Creation)
1. Add graph-specific Frontend Visualization Guidance examples
2. Add Graph Algorithm Narrative Anti-Patterns
3. Update Testing Checklist with graph tests
4. Add FREE CHOICES clarifications

**Rationale:** Template development will reveal specific patterns to document.

### Phase 3: Post-Sprint Refinement (After 4 Graph Algorithms Complete)
1. Review all 4 graph narratives for common patterns
2. Refine guidance based on actual implementation experience
3. Add concrete examples from DFS/BFS/Topological/Dijkstra
4. Update checklist version to v2.4

**Rationale:** Real implementation data will improve guidance quality.

---

## Risk Assessment

**If we DON'T update the checklist:**
- ❌ DFS implementer has no graph-specific guidance
- ❌ Narrative patterns will be inconsistent across 4 algorithms
- ❌ Higher FAA failure rate (missing state data in narratives)
- ❌ QA will need to provide same feedback 4 times
- ❌ Backend checklist becomes obsolete for Tier 3

**If we DO update the checklist:**
- ✅ Clear requirements before implementation starts
- ✅ Consistent narrative quality across graph algorithms
- ✅ Faster FAA approval (complete state shown)
- ✅ Reusable template emerges naturally
- ✅ Backend checklist remains authoritative

**Recommendation:** Implement Phase 1 (critical updates) immediately, before DFS proof-of-concept begins.

---

## Appendix: Example Diff Preview

### Before (Current):
```markdown
#### For Graph Algorithms (visualization_type: "graph") - Future

- [ ] **`data.visualization.graph.nodes`** - Array of node objects
- [ ] Each node has **`id`** (string) - Node identifier
...
```

### After (Proposed):
```markdown
#### For Graph Algorithms (visualization_type: "graph")

**Required Core Fields:**
- [ ] **`data.visualization.graph.nodes`** - Array of node objects
- [ ] Each node has **`id`** (string) - Node identifier
- [ ] Each node has **`label`** (string) - Display label
- [ ] Each node has **`state`** (string) - "unvisited" | "visiting" | "visited"
- [ ] **`data.visualization.graph.edges`** - Array of edge objects
- [ ] Each edge has **`from`** (string) - Source node ID
- [ ] Each edge has **`to`** (string) - Target node ID
- [ ] Each edge has **`weight`** (int, optional) - Edge weight for weighted graphs

**Traversal Structure Fields (Algorithm-Dependent):**
- [ ] **`data.visualization.stack`** (optional) - Array for DFS stack state
- [ ] **`data.visualization.queue`** (optional) - Array for BFS queue state
- [ ] **`data.visualization.priority_queue`** (optional) - Array of tuples for Dijkstra

**Algorithm-Specific State Maps (Optional):**
- [ ] **`data.visualization.distance_map`** - Dict {node_id: distance} for shortest paths
- [ ] **`data.visualization.previous_map`** - Dict {node_id: previous_node} for path reconstruction
- [ ] **`data.visualization.indegree_map`** - Dict {node_id: indegree} for topological sort
- [ ] **`data.visualization.visited_set`** - List of visited node IDs

**Metadata Configuration:**
- [ ] **`metadata.visualization_config.directed`** (bool) - Graph directionality
- [ ] **`metadata.visualization_config.weighted`** (bool) - Whether edges have weights
```

---

**Prepared by:** Backend Development Team  
**Next Action:** Review and approve Phase 1 updates before DFS implementation
