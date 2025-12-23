
# Kadane's Algorithm

Kadane's Algorithm solves the **maximum subarray problem**: finding the contiguous subarray within a one-dimensional array of numbers that has the largest sum. This problem appears frequently in data analysis, financial modeling, and signal processing.

The algorithm's elegance lies in its **dynamic programming approach** that runs in O(n) time with O(1) space. At each position, it makes a simple decision: either extend the current subarray (if it helps) or start a new subarray from the current element (if the previous sum is dragging us down). This greedy local choice guarantees finding the global maximum.

**Real-world applications** include:
- **Stock trading**: Finding the best time period to hold a stock (maximum profit window)
- **Image processing**: Detecting regions of interest with maximum intensity
- **Genomics**: Identifying DNA segments with specific properties
- **Data analytics**: Finding time periods with maximum activity or growth

**Complexity**: O(n) time, O(1) space—optimal for this problem. The algorithm demonstrates how a simple rule applied consistently can solve a seemingly complex optimization problem efficiently.
