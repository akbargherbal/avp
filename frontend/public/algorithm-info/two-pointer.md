# Two Pointer Pattern

## What It Does

The two-pointer technique uses two references (pointers) that traverse an array simultaneously, often at different speeds or from different directions. In the array deduplication variant, a "slow" pointer marks where to write unique elements, while a "fast" pointer scans ahead to find them. This enables in-place modification without extra space.

## Why It Matters

Two pointers eliminate the need for auxiliary data structures, achieving O(1) space complexity while maintaining O(n) time. This is crucial for memory-constrained environments and demonstrates the power of clever pointer manipulation. The pattern extends beyond deduplication to problems like palindrome checking, container optimization, and pair finding.

## Where It's Used

**Data Cleaning:** Removing duplicates from sorted logs or datasets  
**Array Manipulation:** In-place reversal, rotation, or partitioning  
**Substring Problems:** Finding patterns in strings efficiently  
**Linked Lists:** Detecting cycles or finding middle elements

## Complexity

**Time:** O(n) - Single pass through the array  
**Space:** O(1) - Modifies array in-place, no extra storage

## Key Insight

The "aha!" moment is recognizing that **two pointers with different roles** can coordinate to solve problems that seem to require copying data. The slow pointer doesn't need to examine every element—it trusts the fast pointer to do the searching. This separation of concerns (writing vs. reading) is what makes in-place algorithms possible and efficient.
