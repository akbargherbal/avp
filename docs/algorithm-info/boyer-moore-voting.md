
# Boyer-Moore Voting Algorithm

## What It Is

The Boyer-Moore Voting algorithm is an elegant solution for finding the majority element in an array—an element that appears more than ⌊n/2⌋ times. It uses a clever voting mechanism where elements "vote" for or against a candidate, achieving linear time complexity with constant space.

## Why It Matters

Finding majority elements is fundamental in distributed systems (consensus algorithms), data analysis (mode detection), and fault-tolerant computing. The algorithm's brilliance lies in its efficiency: while naive approaches require O(n) space (hash maps) or O(n log n) time (sorting), Boyer-Moore achieves O(n) time with O(1) space—optimal for both metrics.

## How It Works

The algorithm operates in two phases. **Phase 1 (Finding):** Maintain a candidate and count. When examining an element, if count is 0, set it as the new candidate. Otherwise, increment count if it matches the candidate, decrement if it differs. **Phase 2 (Verification):** Count actual occurrences of the candidate to confirm it's truly a majority element.

## Real-World Applications

- **Distributed consensus:** Identifying majority votes in Byzantine fault-tolerant systems
- **Stream processing:** Finding dominant elements in data streams with limited memory
- **Quality control:** Detecting most common defect types in manufacturing
- **Network analysis:** Identifying majority traffic patterns in packet streams

## Complexity

- **Time:** O(n) - Two linear passes through the array
- **Space:** O(1) - Only stores candidate and count variables
