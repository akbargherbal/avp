
# Topological Sort (Kahn's Algorithm)

Topological sorting solves a fundamental problem in computer science: **how do you order tasks when some must happen before others?** Imagine scheduling college courses where prerequisites must be taken first, or determining the build order for software modules where some depend on others. Topological sort produces a linear ordering of nodes in a directed acyclic graph (DAG) such that for every edge from node A to node B, A appears before B in the ordering.

Kahn's algorithm uses a clever approach: track how many dependencies (incoming edges) each node has. Nodes with zero dependencies can be processed immediately. As we process each node, we "remove" its outgoing edges by decrementing the dependency count of its neighbors. When a neighbor's count reaches zero, it becomes ready to process. This BFS-based method naturally builds the sorted order while simultaneously detecting cycles—if nodes remain unprocessed after the queue empties, a cycle exists.

**Real-world applications** include build systems (Make, Gradle), package managers (npm, pip), task schedulers, and compiler dependency resolution. The algorithm runs in **O(V + E)** time, making it efficient even for large dependency graphs.

**Word count:** 189 words
