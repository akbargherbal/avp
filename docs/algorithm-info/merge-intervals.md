
# Merge Intervals

## What It Is

Merge Intervals is a fundamental algorithm that combines overlapping time intervals into a minimal set of non-overlapping intervals. Given a collection of intervals (each with a start and end time), the algorithm identifies which intervals overlap and merges them into single, continuous intervals.

## Why It Matters

This algorithm solves a common real-world problem: consolidating overlapping time periods. Whether scheduling meetings, managing resource allocations, or analyzing time-series data, we often need to identify and merge overlapping ranges. The algorithm demonstrates the power of sorting as a preprocessing step—by sorting intervals by start time, we can detect overlaps with a simple linear scan, comparing each interval only with the last merged interval.

## Where It's Used

**Meeting Room Scheduling**: Merge overlapping meeting times to find available slots  
**Calendar Applications**: Consolidate busy periods across multiple calendars  
**Network Traffic Analysis**: Identify continuous periods of activity  
**Resource Management**: Optimize allocation by merging overlapping usage periods  
**Data Compression**: Reduce storage by combining adjacent or overlapping ranges

## Complexity

- **Time Complexity**: O(n log n) - dominated by sorting the intervals
- **Space Complexity**: O(n) - for storing the merged result
- **Best Case**: O(n log n) - sorting is always required
- **Worst Case**: O(n log n) - even with no overlaps, sorting is necessary

The algorithm's efficiency comes from the sorting step, which enables a single-pass merge operation.
