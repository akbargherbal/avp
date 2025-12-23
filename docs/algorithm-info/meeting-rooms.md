
# Meeting Rooms II

**Meeting Rooms II** solves the classic scheduling problem: given a list of meeting time intervals, determine the minimum number of conference rooms required to accommodate all meetings without conflicts.

## Why It Matters

This algorithm addresses a fundamental resource allocation challenge in operations research and computer science. Whether scheduling conference rooms, allocating CPU cores, or managing airport gates, the underlying problem is identical: minimize resources while satisfying temporal constraints.

## How It Works

The algorithm uses a **greedy approach with a min-heap**. First, meetings are sorted by start time. Then, for each meeting, we check if the earliest-ending meeting (heap top) has finished. If yes, reuse that room; if no, allocate a new room. The heap tracks end times of ongoing meetings, so its size at any moment equals rooms in use. The maximum heap size throughout execution is the minimum rooms needed.

## Real-World Applications

- **Corporate scheduling**: Conference room booking systems
- **Cloud computing**: Virtual machine allocation
- **Transportation**: Gate assignment at airports
- **Healthcare**: Operating room scheduling

## Complexity

- **Time:** O(n log n) - sorting dominates, heap operations are O(log n) per meeting
- **Space:** O(n) - heap stores up to n end times

This optimal solution guarantees minimal resource usage through intelligent reuse.
