# Binary Search

## What It Does

Binary search finds a target value in a sorted array by repeatedly dividing the search space in half. At each step, it compares the middle element with the target: if they match, the search succeeds; if the middle element is too large, the algorithm searches the left half; if too small, it searches the right half. This process continues until the target is found or the search space becomes empty.

## Why It Matters

Binary search is fundamentally more efficient than linear search, reducing time complexity from O(n) to O(log n). This exponential speedup means searching a billion elements requires only about 30 comparisons. This efficiency is critical in databases, file systems, and any application processing large sorted datasets.

## Where It's Used

**Databases:** Index lookups in B-trees and sorted tables  
**Dictionaries:** Word lookup in alphabetically sorted dictionaries  
**Version Control:** Finding the commit that introduced a bug (git bisect)  
**Computer Graphics:** Ray-object intersection tests in rendering  
**Numerical Methods:** Root finding and optimization algorithms

## Complexity

**Time:** O(log n) - Halves search space each iteration  
**Space:** O(1) for iterative, O(log n) for recursive (call stack)

## Key Insight

The "aha!" moment is recognizing that **eliminating half the possibilities with a single comparison** creates exponential efficiency. You don't need to examine every element—just keep halving until you find what you need. This divide-and-conquer principle extends far beyond searching to many algorithmic problems.
