# Merge Sort

## What It Does

Merge sort is a divide-and-conquer sorting algorithm that recursively splits an array into smaller subarrays until each contains a single element, then systematically merges them back together in sorted order. The algorithm guarantees O(n log n) time complexity in all cases—best, average, and worst.

## Why It Matters

Unlike simpler sorting algorithms like bubble sort or insertion sort (which degrade to O(n²)), merge sort maintains consistent O(n log n) performance regardless of input distribution. This makes it ideal for sorting large datasets where predictable performance is critical. It's also a stable sort, preserving the relative order of equal elements, which is essential in many database and data processing applications.

## Where It's Used

Merge sort powers external sorting algorithms used when data exceeds memory capacity (disk-based sorting). It's the foundation of Python's `sorted()` function (Timsort, a hybrid) and Java's `Arrays.sort()` for object arrays. LinkedIn's early infrastructure used merge sort for combining sorted result sets from distributed servers.

## Complexity

- **Time:** O(n log n) guaranteed—splits happen log n times, each merge level processes n elements
- **Space:** O(n) auxiliary space for temporary merge arrays

## Key Insight

The "aha!" moment: single elements are trivially sorted. By breaking down to this base case, then merging pairs systematically (always taking the smaller front element), we build sorted order from the bottom up. The merge step is where sorting actually happens—division just prepares the problem.
