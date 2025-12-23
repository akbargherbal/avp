
# Dutch National Flag (Sort Colors)

The Dutch National Flag algorithm, named after the three-colored Dutch flag, solves a specific sorting problem: organizing an array containing only three distinct values (typically 0, 1, and 2) in a single pass. Invented by Edsger Dijkstra, this elegant algorithm demonstrates the power of three-way partitioning.

**Why It Matters:** Unlike general sorting algorithms that require O(n log n) comparisons, the Dutch National Flag achieves O(n) time complexity by exploiting the constraint of only three values. It maintains three regions simultaneously—elements less than, equal to, and greater than a pivot—using just three pointers.

**Real-World Applications:** This algorithm appears in quicksort optimization (three-way partitioning for duplicate-heavy data), color sorting in image processing, and any scenario requiring efficient categorization into three groups. It's particularly valuable when dealing with data that has low cardinality (few distinct values).

**Complexity:** Time O(n), Space O(1)—optimal for this problem class. The algorithm's beauty lies in its in-place operation and single-pass guarantee, making it a cornerstone example of efficient algorithm design under constraints.
