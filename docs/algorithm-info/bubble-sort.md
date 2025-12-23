
# Bubble Sort

## What It Is

Bubble Sort is a simple comparison-based sorting algorithm that repeatedly steps through a list, compares adjacent elements, and swaps them if they're in the wrong order. The algorithm gets its name from the way larger elements "bubble" to the end of the list with each pass, like bubbles rising to the surface of water.

## Why It Matters

Despite being inefficient for large datasets (O(n²) time complexity), Bubble Sort is pedagogically valuable as an introduction to sorting algorithms. It demonstrates fundamental concepts like comparison-based sorting, in-place operations, and algorithm optimization (early termination when no swaps occur). Its simplicity makes it ideal for understanding how sorting works at a conceptual level before tackling more complex algorithms.

## Where It's Used

Bubble Sort is rarely used in production systems due to its poor performance on large datasets. However, it finds niche applications in educational contexts, small datasets where simplicity matters more than speed, and situations where the data is nearly sorted (where it can achieve O(n) performance with early termination). It's also useful for teaching algorithm analysis and demonstrating why more sophisticated sorting algorithms are necessary.

## Complexity

- **Time Complexity**: O(n²) worst/average case, O(n) best case (already sorted with optimization)
- **Space Complexity**: O(1) (in-place sorting)
- **Stability**: Stable (maintains relative order of equal elements)
