
# Breadth-First Search (BFS)

Breadth-First Search is a fundamental graph traversal algorithm that explores nodes level by level, visiting all neighbors at distance *d* before moving to distance *d+1*. Starting from a source node, BFS uses a queue data structure to maintain the frontier of exploration, ensuring nodes are processed in the order they are discovered.

**Why It Matters:** BFS guarantees finding the shortest path (in terms of edge count) between two nodes in an unweighted graph, making it essential for navigation systems, social network analysis (finding degrees of separation), and network broadcasting protocols. Its level-order traversal property makes it ideal for problems requiring layer-by-layer exploration, such as finding the minimum number of moves in puzzle games or detecting connected components in networks.

**Real-World Applications:** Web crawlers use BFS to discover pages at increasing link distances from a seed URL. GPS systems employ BFS variants to find shortest routes in road networks. Social media platforms use it to suggest friends within a certain degree of connection. Network protocols like spanning tree algorithms rely on BFS to prevent routing loops.

**Complexity:** Time complexity is O(V + E) where V is vertices and E is edges, as each node and edge is visited once. Space complexity is O(V) for the queue and visited set, making it efficient for sparse graphs but memory-intensive for dense networks.
