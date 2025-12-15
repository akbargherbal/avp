# Two Pointer Technique

## Overview

The Two Pointer technique is an efficient algorithmic pattern used to solve problems involving arrays or linked lists. It involves using two pointers (indices or references) that traverse the data structure in a coordinated way—often from different starting points or at different speeds—to achieve optimal time and space complexity.

## How It Works

There are several common variations of the Two Pointer pattern:

1. **Opposite Direction Pointers**:  
   - One pointer starts at the beginning (`left`), the other at the end (`right`).  
   - They move toward each other until they meet or cross.

2. **Same Direction (Fast & Slow Pointers)**:  
   - Both pointers start at the beginning.  
   - The `fast` pointer moves ahead to explore or filter elements.  
   - The `slow` pointer builds the result or tracks a position.

3. **Sliding Window**:  
   - A special case where two pointers maintain a subarray or window.  
   - The `right` pointer expands the window, the `left` contracts it based on conditions.

## Time Complexity

- **Typical Complexity**: O(n) — Each element is processed at most twice.  
- **Worst Case**: O(n) — Linear traversal, often better than nested loops (O(n²)).

## Space Complexity

- **In-place Operations**: O(1) — Only uses a few pointers and variables, no extra data structures.  
- **With Additional Storage**: O(k) — If auxiliary storage is used (e.g., for output).

## Real-World Applications

- **Array Deduplication**: Remove duplicates from a sorted list in-place.  
- **Two Sum Problems**: Find pairs in a sorted array that sum to a target.  
- **Merge Sorted Arrays**: Combine two sorted arrays efficiently.  
- **Palindrome Checking**: Verify if a string is a palindrome.  
- **Linked List Cycles**: Detect cycles using Floyd’s Tortoise and Hare.  
- **Subarray Problems**: Find subarrays with a given sum (sliding window).

## Key Variables

- **Slow Pointer (SP)**: Tracks the position for the next valid element or result.  
- **Fast Pointer (FP)**: Scans ahead to find the next candidate or condition.  
- **Left Pointer (L)**: Marks the start of a window or subarray.  
- **Right Pointer (R)**: Marks the end of a window or subarray.  
- **Target**: The goal value or condition to satisfy.

## Prerequisites

⚠️ **Important**: The Two Pointer technique is most effective when:
- The data is **sorted** (for opposite-direction pointers).
- The problem involves **pair searching**, **subarrays**, or **in-place modifications**.
- You need to **optimize time and space** beyond brute force.

## Fun Fact

The Two Pointer technique can turn an O(n²) brute-force solution into an O(n) elegant one—making it a favorite in coding interviews for its simplicity and efficiency. It’s like having two scouts exploring a list from different ends, coordinating to find the answer in one smooth pass!