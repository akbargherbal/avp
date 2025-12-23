
# Insertion Sort

## What It Is

Insertion Sort is a simple, intuitive sorting algorithm that builds a sorted array one element at a time. It works by taking each element from the unsorted portion and inserting it into its correct position within the already-sorted portion, similar to how you might sort a hand of playing cards.

## Why It Matters

Despite its O(n²) worst-case time complexity, Insertion Sort remains relevant because it's **highly efficient for small datasets** and **nearly-sorted data**. When data is already mostly ordered, Insertion Sort approaches O(n) performance, making it faster than more complex algorithms like Quick Sort or Merge Sort in these scenarios. It's also **stable** (preserves relative order of equal elements) and **in-place** (requires minimal extra memory).

## Real-World Applications

- **Hybrid sorting algorithms**: Used as the base case in Timsort (Python's built-in sort) and Introsort (C++ STL sort) when subarrays become small
- **Online sorting**: Efficiently handles streaming data where elements arrive one at a time
- **Database systems**: Sorts small result sets or maintains sorted indexes
- **Embedded systems**: Low memory overhead makes it ideal for resource-constrained environments

## Complexity

- **Time**: O(n²) worst/average case, O(n) best case (already sorted)
- **Space**: O(1) auxiliary space (in-place)
- **Stability**: Yes (stable sort)
