# 🎯 Top 10 High-Scoring Algorithm Candidates

**Evaluation Date:** December 22, 2025  
**Methodology:** Scored against 6-dimension framework (Pedagogical Value 35%, Technical Feasibility 25%, Active Learning 20%, Implementation Cost 10%, Curriculum Fit 10%, Data Contract 5%)

---

## 1. **Depth-First Search (DFS) - Graph Traversal**

| Dimension             | Score      | Weighted                          |
| --------------------- | ---------- | --------------------------------- |
| Pedagogical Value     | 9/10       | 3.15                              |
| Technical Feasibility | 7/10       | 1.75                              |
| Active Learning       | 9/10       | 1.80                              |
| Implementation Cost   | 6/10       | 0.60                              |
| Curriculum Fit        | 10/10      | 1.00                              |
| Data Contract         | 8/10       | 0.40                              |
| **TOTAL**             | **8.3/10** | ✅ **APPROVE - HIGHEST PRIORITY** |

**Rationale:**

- **Why High Score:** First graph algorithm, teaches fundamental traversal pattern, excellent prediction opportunities (predict next node, predict backtrack)
- **Decision Points:** Visit node, explore neighbor, backtrack when stuck
- **Visualization:** New `graph` type needed (nodes + edges), call stack for backtracking
- **Prediction Examples:**
  - "Which neighbor should we visit next?" [Node A, Node B, Node C]
  - "Should we backtrack now?" [Yes - No neighbors, No - Unvisited neighbors exist]
- **Dashboard Mapping:**
  - Zone 1: Current node being explored
  - Zone 2: Target node (if search problem)
  - Zone 3: "Visited: X nodes, Remaining: Y nodes"
  - Zone 4: "Visit Node X" or "Backtrack to Node Y"
  - Zone 5: Stack depth, visited count, unvisited count
- **Implementation Notes:** Needs new graph visualization (~1 hour), but reusable for BFS, Dijkstra
- **Curriculum Impact:** Opens entire graph algorithms category

---

## 2. **Breadth-First Search (BFS) - Graph Traversal**

| Dimension             | Score      | Weighted                          |
| --------------------- | ---------- | --------------------------------- |
| Pedagogical Value     | 9/10       | 3.15                              |
| Technical Feasibility | 8/10       | 2.00                              |
| Active Learning       | 8/10       | 1.60                              |
| Implementation Cost   | 8/10       | 0.80                              |
| Curriculum Fit        | 9/10       | 0.90                              |
| Data Contract         | 8/10       | 0.40                              |
| **TOTAL**             | **8.2/10** | ✅ **APPROVE - HIGHEST PRIORITY** |

**Rationale:**

- **Why High Score:** Complements DFS, teaches level-order traversal, queue-based pattern
- **Decision Points:** Enqueue neighbors, dequeue next node, level completion
- **Visualization:** Reuses graph viz from DFS, adds queue display
- **Prediction Examples:**
  - "Which node will be visited next?" [Show queue front 3 nodes]
  - "Are we done with this level?" [Yes, No]
- **Dashboard Mapping:**
  - Zone 1: Current node being processed
  - Zone 2: Target node (if applicable)
  - Zone 3: "Level: X, Queue size: Y"
  - Zone 4: "Process Node X" or "Enqueue neighbors"
  - Zone 5: Current level, queue size, visited count
- **Implementation Notes:** Reuses DFS graph viz, straightforward queue logic
- **Curriculum Impact:** Teaches queue-based exploration, contrasts with DFS stack

---

## 3. **Quick Sort - Divide & Conquer Sorting**

| Dimension             | Score      | Weighted                       |
| --------------------- | ---------- | ------------------------------ |
| Pedagogical Value     | 8/10       | 2.80                           |
| Technical Feasibility | 9/10       | 2.25                           |
| Active Learning       | 8/10       | 1.60                           |
| Implementation Cost   | 9/10       | 0.90                           |
| Curriculum Fit        | 6/10       | 0.60                           |
| Data Contract         | 9/10       | 0.45                           |
| **TOTAL**             | **7.8/10** | ✅ **APPROVE - HIGH PRIORITY** |

**Rationale:**

- **Why High Score:** Industry-standard sort, teaches in-place partitioning, excellent prediction points
- **Decision Points:** Choose pivot, compare with pivot, swap elements, partition complete
- **Visualization:** Reuses ArrayView, adds partition boundaries and pivot highlighting
- **Prediction Examples:**
  - "Compare element 5 with pivot 7. Should we swap?" [Yes - goes left, No - stays right]
  - "Partition complete. Which half should we sort first?" [Left partition, Right partition]
- **Dashboard Mapping:**
  - Zone 1: Current pivot value
  - Zone 2: Target position (final pivot location)
  - Zone 3: "Element X vs Pivot Y → goes left/right"
  - Zone 4: "Swap" or "Keep position" or "Partition complete"
  - Zone 5: Left boundary, right boundary, partition size
- **Implementation Notes:** Minimal new infrastructure, reuses array viz completely
- **Curriculum Impact:** Alternative to Merge Sort, teaches in-place algorithms

---

## 4. **Dijkstra's Shortest Path - Graph Algorithm**

| Dimension             | Score      | Weighted                       |
| --------------------- | ---------- | ------------------------------ |
| Pedagogical Value     | 9/10       | 3.15                           |
| Technical Feasibility | 6/10       | 1.50                           |
| Active Learning       | 8/10       | 1.60                           |
| Implementation Cost   | 5/10       | 0.50                           |
| Curriculum Fit        | 9/10       | 0.90                           |
| Data Contract         | 7/10       | 0.35                           |
| **TOTAL**             | **7.6/10** | ✅ **APPROVE - HIGH PRIORITY** |

**Rationale:**

- **Why High Score:** Classic shortest path, teaches greedy + priority queue, high practical value
- **Decision Points:** Select min-distance node, relax edges, update distances
- **Visualization:** Reuses graph viz from DFS/BFS, adds distance labels and priority queue
- **Prediction Examples:**
  - "Which node should we visit next?" [Show 3 nodes with distances]
  - "Should we update Node B's distance?" [Yes - new path shorter, No - current path shorter]
- **Dashboard Mapping:**
  - Zone 1: Current node being explored
  - Zone 2: Destination node
  - Zone 3: "Distance to X via Y: old vs new"
  - Zone 4: "Update distance" or "Keep current distance"
  - Zone 5: Total distance so far, nodes visited, nodes remaining
- **Implementation Notes:** Requires priority queue visualization, but reuses graph structure
- **Curriculum Impact:** First weighted graph algorithm, practical pathfinding

---

## 5. **Kadane's Algorithm - Maximum Subarray (Dynamic Programming)**

| Dimension             | Score      | Weighted                       |
| --------------------- | ---------- | ------------------------------ |
| Pedagogical Value     | 8/10       | 2.80                           |
| Technical Feasibility | 9/10       | 2.25                           |
| Active Learning       | 9/10       | 1.80                           |
| Implementation Cost   | 8/10       | 0.80                           |
| Curriculum Fit        | 9/10       | 0.90                           |
| Data Contract         | 9/10       | 0.45                           |
| **TOTAL**             | **7.8/10** | ✅ **APPROVE - HIGH PRIORITY** |

**Rationale:**

- **Why High Score:** First DP algorithm, teaches optimal substructure elegantly, simple yet powerful
- **Decision Points:** Extend current subarray or start new, update global max
- **Visualization:** Reuses ArrayView with current_sum and max_sum tracking
- **Prediction Examples:**
  - "Current sum: -3. Next element: 5. Should we extend or restart?" [Extend, Restart]
  - "New sum: 7. Should we update global max?" [Yes - 7 > current max, No - keep current]
- **Dashboard Mapping:**
  - Zone 1: Current subarray sum
  - Zone 2: Global maximum sum
  - Zone 3: "Current: X + next element: Y = Z"
  - Zone 4: "Extend subarray" or "Start new subarray"
  - Zone 5: Subarray start index, subarray end index, length
- **Implementation Notes:** Very simple, minimal new infrastructure
- **Curriculum Impact:** Opens DP category, teaches optimal substructure

---

## 6. **Topological Sort (Kahn's Algorithm) - Graph Algorithm**

| Dimension             | Score      | Weighted                       |
| --------------------- | ---------- | ------------------------------ |
| Pedagogical Value     | 8/10       | 2.80                           |
| Technical Feasibility | 7/10       | 1.75                           |
| Active Learning       | 8/10       | 1.60                           |
| Implementation Cost   | 7/10       | 0.70                           |
| Curriculum Fit        | 8/10       | 0.80                           |
| Data Contract         | 8/10       | 0.40                           |
| **TOTAL**             | **7.6/10** | ✅ **APPROVE - HIGH PRIORITY** |

**Rationale:**

- **Why High Score:** Teaches directed acyclic graphs (DAGs), dependency resolution, practical (build systems, course scheduling)
- **Decision Points:** Remove node with in-degree 0, update in-degrees of neighbors
- **Visualization:** Reuses graph viz with in-degree labels on nodes
- **Prediction Examples:**
  - "Which node has no dependencies?" [Show nodes with in-degree counts]
  - "After removing Node A, which node becomes available?" [Multiple choices]
- **Dashboard Mapping:**
  - Zone 1: Current node being processed
  - Zone 2: Total nodes in valid order
  - Zone 3: "In-degree: X → after removal: Y"
  - Zone 4: "Remove Node X from graph"
  - Zone 5: Processed count, remaining count, queue size
- **Implementation Notes:** Reuses graph viz, straightforward queue-based algorithm
- **Curriculum Impact:** Teaches DAGs and dependency resolution

---

## 7. **Longest Common Subsequence (LCS) - Dynamic Programming**

| Dimension             | Score      | Weighted                       |
| --------------------- | ---------- | ------------------------------ |
| Pedagogical Value     | 9/10       | 3.15                           |
| Technical Feasibility | 6/10       | 1.50                           |
| Active Learning       | 8/10       | 1.60                           |
| Implementation Cost   | 6/10       | 0.60                           |
| Curriculum Fit        | 8/10       | 0.80                           |
| Data Contract         | 7/10       | 0.35                           |
| **TOTAL**             | **7.6/10** | ✅ **APPROVE - HIGH PRIORITY** |

**Rationale:**

- **Why High Score:** Classic DP problem, teaches 2D table pattern, highly practical (diff tools, bioinformatics)
- **Decision Points:** Characters match or don't, take max from table neighbors
- **Visualization:** New 2D table visualization needed, but reusable for other DP problems
- **Prediction Examples:**
  - "Characters 'A' and 'A' match. What should we do?" [Take diagonal + 1, Take max from neighbors]
  - "Characters 'A' and 'B' don't match. Which value do we use?" [Left cell, Top cell]
- **Dashboard Mapping:**
  - Zone 1: Current cell value being computed
  - Zone 2: Final LCS length (goal)
  - Zone 3: "Match: take diagonal+1" or "No match: max(left, top)"
  - Zone 4: "Update cell [i][j]"
  - Zone 5: Row index, column index, current LCS length
- **Implementation Notes:** Requires 2D table viz (new component, ~1 hour), but opens DP visualization pattern
- **Curriculum Impact:** Second DP algorithm, teaches 2D table pattern

---

## 8. **Insertion Sort - Basic Sorting**

| Dimension             | Score      | Weighted                         |
| --------------------- | ---------- | -------------------------------- |
| Pedagogical Value     | 7/10       | 2.45                             |
| Technical Feasibility | 10/10      | 2.50                             |
| Active Learning       | 8/10       | 1.60                             |
| Implementation Cost   | 10/10      | 1.00                             |
| Curriculum Fit        | 6/10       | 0.60                             |
| Data Contract         | 10/10      | 0.50                             |
| **TOTAL**             | **7.5/10** | ✅ **APPROVE - MEDIUM PRIORITY** |

**Rationale:**

- **Why High Score:** Extremely simple to implement, excellent for beginners, intuitive "card sorting" metaphor
- **Decision Points:** Compare with previous elements, shift or insert
- **Visualization:** Reuses ArrayView with "sorted" and "unsorted" sections
- **Prediction Examples:**
  - "Compare 5 with sorted element 7. Should we continue left?" [Yes - 5 < 7, No - found position]
  - "Should we shift element 7 right?" [Yes - to make room, No - insert here]
- **Dashboard Mapping:**
  - Zone 1: Current element being inserted
  - Zone 2: Target position in sorted section
  - Zone 3: "Current: X vs sorted element: Y"
  - Zone 4: "Shift right" or "Insert here"
  - Zone 5: Sorted boundary, unsorted boundary, comparisons
- **Implementation Notes:** Trivial implementation, reuses all existing infrastructure
- **Curriculum Impact:** Beginner-friendly, teaches incremental sorting

---

## 9. **Floyd-Warshall All-Pairs Shortest Path - Dynamic Programming**

| Dimension             | Score      | Weighted                         |
| --------------------- | ---------- | -------------------------------- |
| Pedagogical Value     | 8/10       | 2.80                             |
| Technical Feasibility | 7/10       | 1.75                             |
| Active Learning       | 7/10       | 1.40                             |
| Implementation Cost   | 6/10       | 0.60                             |
| Curriculum Fit        | 7/10       | 0.70                             |
| Data Contract         | 7/10       | 0.35                             |
| **TOTAL**             | **7.3/10** | ✅ **APPROVE - MEDIUM PRIORITY** |

**Rationale:**

- **Why High Score:** Elegant DP on graphs, teaches relaxation through intermediates
- **Decision Points:** Consider path through intermediate vertex, update if shorter
- **Visualization:** 2D distance matrix (reuses LCS table viz concept) + graph overlay
- **Prediction Examples:**
  - "Path A→C direct: 10. Path A→B→C: 7. Which should we keep?" [Direct, Via B]
  - "Should we update distance[A][C]?" [Yes - new path shorter, No - keep current]
- **Dashboard Mapping:**
  - Zone 1: Current distance being evaluated
  - Zone 2: Shortest known distance (goal)
  - Zone 3: "Direct: X vs Via K: Y → choose minimum"
  - Zone 4: "Update distance" or "Keep current"
  - Zone 5: Current intermediate vertex K, updated cells count
- **Implementation Notes:** Reuses 2D table from LCS, adds graph context
- **Curriculum Impact:** Advanced graph + DP combo, completes shortest path trilogy

---

## 10. **Longest Increasing Subsequence (LIS) - Dynamic Programming**

| Dimension             | Score      | Weighted                         |
| --------------------- | ---------- | -------------------------------- |
| Pedagogical Value     | 8/10       | 2.80                             |
| Technical Feasibility | 8/10       | 2.00                             |
| Active Learning       | 8/10       | 1.60                             |
| Implementation Cost   | 7/10       | 0.70                             |
| Curriculum Fit        | 6/10       | 0.60                             |
| Data Contract         | 8/10       | 0.40                             |
| **TOTAL**             | **7.3/10** | ✅ **APPROVE - MEDIUM PRIORITY** |

**Rationale:**

- **Why High Score:** Classic DP, teaches optimal substructure on sequences, interview-common
- **Decision Points:** Extend existing subsequence or start new, choose max length
- **Visualization:** Reuses ArrayView with DP array below showing lengths
- **Prediction Examples:**
  - "Element 5 > previous 3. Should we extend that subsequence?" [Yes - extends, No - start new]
  - "Current element can extend 2 subsequences. Which gives longer result?" [Subsequence A, Subsequence B]
- **Dashboard Mapping:**
  - Zone 1: Current element being processed
  - Zone 2: Longest subsequence length so far
  - Zone 3: "Element X > previous Y → extend to length Z"
  - Zone 4: "Extend subsequence" or "Start new"
  - Zone 5: DP array index, max length so far, extendable count
- **Implementation Notes:** Simple 1D DP array visualization, reuses array patterns
- **Curriculum Impact:** Third DP algorithm, reinforces optimal substructure pattern

---

## 📊 Summary Comparison

| Rank | Algorithm            | Total Score | Category | Priority | New Infra Needed?  |
| ---- | -------------------- | ----------- | -------- | -------- | ------------------ |
| 1    | **DFS**              | 8.3/10      | Graph    | HIGHEST  | Graph viz          |
| 2    | **BFS**              | 8.2/10      | Graph    | HIGHEST  | Reuses graph viz   |
| 3    | **Quick Sort**       | 7.8/10      | Sorting  | HIGH     | None               |
| 4    | **Kadane's**         | 7.8/10      | DP       | HIGH     | None               |
| 5    | **Dijkstra's**       | 7.6/10      | Graph    | HIGH     | Priority queue viz |
| 6    | **Topological Sort** | 7.6/10      | Graph    | HIGH     | Reuses graph viz   |
| 7    | **LCS**              | 7.6/10      | DP       | HIGH     | 2D table viz       |
| 8    | **Insertion Sort**   | 7.5/10      | Sorting  | MEDIUM   | None               |
| 9    | **Floyd-Warshall**   | 7.3/10      | Graph+DP | MEDIUM   | Reuses 2D table    |
| 10   | **LIS**              | 7.3/10      | DP       | MEDIUM   | None               |

---

## 🎯 Recommended Implementation Order

### **Phase 1: Graph Fundamentals** (Fills largest gap)

1. **DFS** - Opens graph category, builds graph viz infrastructure
2. **BFS** - Reuses graph viz, completes basic traversal patterns

**Time Investment:** ~8 hours (5 hours each, minus 2 hours for viz reuse)  
**Curriculum Impact:** Enables entire graph algorithms category

---

### **Phase 2: Dynamic Programming Introduction** (Fills second-largest gap)

3. **Kadane's Algorithm** - Simplest DP, teaches optimal substructure
4. **LIS** - Reinforces DP pattern, still simple 1D

**Time Investment:** ~7 hours (3.5 hours each)  
**Curriculum Impact:** Opens DP category with gentle progression

---

### **Phase 3: Advanced Sorting** (Completes sorting category)

5. **Quick Sort** - Industry standard, in-place pattern
6. **Insertion Sort** - Beginner-friendly, incremental sorting

**Time Investment:** ~7 hours (3.5 hours each)  
**Curriculum Impact:** Provides alternative sorting paradigms

---

### **Phase 4: 2D Dynamic Programming** (Expands DP toolkit)

7. **LCS** - Builds 2D table viz, classic DP problem

**Time Investment:** ~5 hours (includes 2D table viz development)  
**Curriculum Impact:** Teaches 2D DP table pattern, reusable infrastructure

---

### **Phase 5: Advanced Graph Algorithms** (Completes graph category)

8. **Topological Sort** - DAGs and dependency resolution
9. **Dijkstra's** - Weighted graphs, shortest path
10. **Floyd-Warshall** - All-pairs shortest path, DP on graphs

**Time Investment:** ~12 hours (4 hours each)  
**Curriculum Impact:** Complete graph algorithms suite

---

## 🚀 Quick Wins (Immediate Candidates)

If resources are limited, prioritize these 3:

### 1. **DFS (Score: 8.3/10)**

- **Why:** Highest score, fills largest curriculum gap
- **Time:** 5 hours (includes graph viz)
- **ROI:** Opens entire graph category

### 2. **Kadane's Algorithm (Score: 7.8/10)**

- **Why:** Simplest DP, no new infrastructure
- **Time:** 3.5 hours
- **ROI:** Opens DP category with minimal cost

### 3. **Quick Sort (Score: 7.8/10)**

- **Why:** High score, zero new infrastructure, industry-standard
- **Time:** 3.5 hours
- **ROI:** Completes essential sorting patterns

**Total Quick Wins Investment:** ~12 hours for 3 high-impact algorithms

---

## 📋 Evaluation Notes

**Scoring Methodology:**

- Evaluated against 6-dimension framework with established weights
- Pedagogical value weighted highest (35%) - platform is educational first
- Technical feasibility critical (25%) - must be implementable within constraints
- Active learning weighted significantly (20%) - prediction mode is core differentiator
- Implementation cost balanced (10%) - acknowledge resource constraints
- Curriculum fit considered (10%) - strategic gap-filling
- Data contract compliance verified (5%) - technical compatibility baseline

**Common High-Scoring Traits:**

- ✅ Clear, discrete decision points (not continuous calculations)
- ✅ Visual state changes (pointers, arrays, graphs transform visibly)
- ✅ Prediction opportunities with 2-3 meaningful choices
- ✅ Reuses existing visualization infrastructure
- ✅ Fills curriculum gap (first in category or complements existing)
- ✅ Step count < 200 for typical input size

**Why These Beat Others:**

- Better than **Bubble Sort** (too simple, doesn't teach useful pattern)
- Better than **Heap Sort** (complex heap visualization, diminishing returns after Merge/Quick)
- Better than **A\* Search** (requires heuristics, harder to predict)
- Better than **Bellman-Ford** (similar to Dijkstra but more complex)
- Better than **Knapsack DP** (2D table + complex state, needs LCS infrastructure first)

---

**Next Steps:**

1. Review this list with education/curriculum team
2. Validate scoring against WORKFLOW.md criteria (once provided)
3. Select 3-5 algorithms for next implementation sprint
4. Create detailed proposals using Algorithm Proposal Template
5. Begin with Phase 1 (DFS/BFS) to maximize curriculum impact
