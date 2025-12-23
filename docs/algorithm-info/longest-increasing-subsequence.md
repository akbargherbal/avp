
# Longest Increasing Subsequence (Patience Sorting)

The Longest Increasing Subsequence (LIS) problem asks: given an array of numbers, what is the length of the longest subsequence where elements appear in strictly increasing order? This fundamental problem appears in diverse applications from DNA sequence analysis to stock market trend detection.

The patience sorting algorithm solves LIS in O(n log n) time using a clever insight: maintain an array of "tails" where `tails[i]` represents the smallest ending value among all increasing subsequences of length `i+1`. For each new element, we either extend the sequence (if larger than the last tail) or use binary search to replace an existing tail with a smaller value, creating better opportunities for future extensions.

This approach mirrors the card game "patience" (solitaire), where cards are placed in piles following specific rules. The algorithm's efficiency comes from the binary search optimization—instead of checking all possible subsequences (exponential time), we maintain optimal candidates at each length and make logarithmic-time decisions.

**Real-world applications:** Version control systems (finding longest common subsequences in file diffs), bioinformatics (protein sequence alignment), financial analysis (identifying longest upward trends), and scheduling algorithms (maximizing non-overlapping activities).

**Complexity:** Time O(n log n), Space O(n)
