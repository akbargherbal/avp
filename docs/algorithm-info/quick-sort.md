
# Quick Sort

Quick Sort is a highly efficient divide-and-conquer sorting algorithm that works by selecting a "pivot" element and partitioning the array around it. Elements smaller than the pivot move to its left, while larger elements move to its right. This process recursively continues on the left and right partitions until the entire array is sorted.

**Why It Matters:** Quick Sort is one of the fastest general-purpose sorting algorithms in practice, with an average time complexity of O(n log n). Unlike Merge Sort, it sorts in-place, requiring only O(log n) extra space for the recursion stack. This makes it ideal for memory-constrained environments.

**Real-World Applications:** Quick Sort powers sorting operations in many programming languages' standard libraries (C's `qsort`, Java's `Arrays.sort` for primitives). It's used in database query optimization, file system operations, and anywhere fast in-place sorting is needed.

**Key Insight:** The algorithm's efficiency depends on pivot selection. Poor pivot choices (like always picking the first or last element in sorted data) lead to O(n²) worst-case performance. Modern implementations use randomized or median-of-three pivot selection to avoid this. The Lomuto partition scheme (pivot = last element) is simpler to understand but less efficient than Hoare's original scheme.

**Trade-offs:** Quick Sort is unstable (doesn't preserve the relative order of equal elements) and has worst-case O(n²) time complexity, but its excellent average-case performance and cache efficiency make it the go-to choice for most sorting tasks.
