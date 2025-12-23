
# Dijkstra's Algorithm

Dijkstra's Algorithm solves the single-source shortest path problem in weighted graphs with non-negative edge weights. Developed by Edsger Dijkstra in 1956, it finds the shortest path from a starting node to all other reachable nodes in the graph.

The algorithm works by maintaining a priority queue of nodes ordered by their current shortest known distance from the source. At each step, it greedily selects the unvisited node with the smallest distance, marks it as visited (finalizing its shortest distance), and then "relaxes" all edges leading to its neighbors—checking if routing through the current node provides a shorter path than previously known.

This greedy approach guarantees optimal shortest paths because once a node is visited, no shorter path to it can exist (given non-negative weights). The algorithm is fundamental in network routing protocols (OSPF), GPS navigation systems, and social network analysis.

**Time Complexity:** O((V + E) log V) with binary heap  
**Space Complexity:** O(V)  
**Key Limitation:** Requires non-negative edge weights (use Bellman-Ford for negative weights)

**Real-World Applications:**
- Internet routing protocols (finding optimal packet paths)
- GPS navigation (shortest route calculation)
- Airline route planning (minimizing travel time/cost)
- Network design and optimization
