
# Container With Most Water

## What It Is

The Container With Most Water problem asks: given an array of heights representing vertical lines, find two lines that together with the x-axis form a container that holds the maximum amount of water. The container's capacity is determined by the shorter of the two lines (water would overflow the shorter side) multiplied by the distance between them.

## Why It Matters

This problem demonstrates the power of the **two-pointer technique** for optimization problems. The naive approach of checking all possible pairs requires O(n²) time, but the two-pointer solution achieves O(n) by intelligently eliminating suboptimal choices. The key insight: moving the pointer at the taller height can never improve the solution (width decreases, height stays limited by the shorter side), so we always move the shorter pointer.

## Real-World Applications

- **Resource allocation**: Optimizing container shipping where capacity is limited by the smallest dimension
- **Data visualization**: Finding optimal window sizes for displaying time-series data
- **Network bandwidth**: Determining maximum throughput between two points where capacity is limited by the weakest link
- **Financial modeling**: Calculating maximum profit windows in trading scenarios

## Complexity

- **Time**: O(n) - single pass with two pointers
- **Space**: O(1) - only constant extra space needed

The algorithm's elegance lies in its greedy approach: at each step, we make the locally optimal choice (move the shorter pointer) which guarantees finding the global optimum.
