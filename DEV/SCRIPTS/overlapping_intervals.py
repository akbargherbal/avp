"""
Educational Interval Coverage Removal Algorithm
================================================

Problem: Given a list of intervals (start, end), remove any interval that is
completely "covered" by another interval.

An interval A covers interval B if:
- A starts at or before B starts
- A ends at or after B ends

Example: (540, 720) covers (600, 720) because:
- 540 ≤ 600 (starts earlier or same)
- 720 ≥ 720 (ends later or same)

Strategy:
1. Sort intervals by start time (ascending), then by end time (descending)
   - This ensures longer intervals come first when starts are equal
   - Makes it easy to track the "maximum end time seen so far"

2. Use recursion to process intervals one by one:
   - If current interval ends before max_end_so_far → it's covered, skip it
   - Otherwise → keep it and update max_end_so_far

Time Complexity: O(n log n) due to sorting
"""


def remove_covered_intervals_educational(intervals):
    """
    Remove intervals completely covered by other intervals.

    Args:
        intervals: List of (start, end) tuples

    Returns:
        List of intervals with covered ones removed
    """
    print("\n" + "=" * 70)
    print("ALGORITHM START: Remove Covered Intervals")
    print("=" * 70)
    print(f"\n📥 Input intervals: {intervals}")

    # STEP 1: Sort the intervals
    print("\n" + "-" * 70)
    print("STEP 1: SORT INTERVALS")
    print("-" * 70)
    print("Sort by: (start ascending, end descending)")
    print("Why? Longer intervals with same start come first")

    sorted_intervals = sorted(intervals, key=lambda x: (x[0], -x[1]))
    print(f"\n✓ Sorted result: {sorted_intervals}")

    # Visual representation
    print("\nVisual timeline:")
    for i, (start, end) in enumerate(sorted_intervals, 1):
        bar = " " * (start // 10) + "█" * ((end - start) // 10)
        print(f"  {i}. {start:4d}-{end:4d}: {bar}")

    # STEP 2: Filter covered intervals recursively
    print("\n" + "-" * 70)
    print("STEP 2: RECURSIVE FILTERING")
    print("-" * 70)
    print("Track max_end_so_far to detect covered intervals\n")

    def filter_covered(remaining, max_end_so_far, depth=0):
        """
        Recursively filter out covered intervals.

        Args:
            remaining: Intervals left to process
            max_end_so_far: Latest ending time we've seen
            depth: Recursion depth (for visualization)

        Returns:
            List of non-covered intervals
        """
        indent = "  " * depth

        # Show what we're processing
        intervals_preview = (
            f"[{len(remaining)} intervals]" if len(remaining) > 3 else str(remaining)
        )
        print(
            f"{indent}📞 CALL: filter_covered({intervals_preview}, "
            f"max_end={max_end_so_far if max_end_so_far != float('-inf') else 'START'})"
        )

        # BASE CASE: No more intervals to process
        if not remaining:
            print(f"{indent}   🛑 BASE CASE: Empty list → return []")
            return []

        # Process first interval
        current = remaining[0]
        rest = remaining[1:]

        print(f"{indent}   🔍 Examining: {current}")
        print(f"{indent}   🎯 Current max_end_so_far: {max_end_so_far}")

        # DECISION POINT: Is this interval covered?
        if current[1] <= max_end_so_far:
            # Covered: This interval ends before/at max_end_so_far
            print(f"{indent}   ❌ COVERED: {current[1]} ≤ {max_end_so_far}")
            print(f"{indent}      → Skip this interval")
            result = filter_covered(rest, max_end_so_far, depth + 1)
        else:
            # Not covered: Keep it and update max_end
            new_max_end = max(max_end_so_far, current[1])
            print(f"{indent}   ✅ NOT COVERED: {current[1]} > {max_end_so_far}")
            print(f"{indent}      → Keep this interval")
            print(f"{indent}      → Update max_end: {max_end_so_far} → {new_max_end}")
            result = [current] + filter_covered(rest, new_max_end, depth + 1)

        print(
            f"{indent}   ⬅️ RETURN: {result if len(result) <= 2 else f'[{len(result)} intervals]'}"
        )
        return result

    # Start recursion with -infinity as initial max_end
    final_result = filter_covered(sorted_intervals, float("-inf"))

    # SUMMARY
    print("\n" + "=" * 70)
    print("ALGORITHM COMPLETE")
    print("=" * 70)
    print(f"\n📤 Input:  {intervals}")
    print(f"📤 Output: {final_result}")
    print(f"\n📊 Removed {len(intervals) - len(final_result)} covered interval(s)")
    print("=" * 70 + "\n")

    return final_result


# ============================================================================
# TEST CASES
# ============================================================================

if __name__ == "__main__":
    print("\n" + "█" * 70)
    print("EDUCATIONAL TEST: Interval Coverage Algorithm")
    print("█" * 70)

    # Test Case 1: Original example
    print("\n\n🧪 TEST CASE 1: Mixed overlapping intervals")
    bookings = [(540, 660), (600, 720), (540, 720), (900, 960)]
    result = remove_covered_intervals_educational(bookings)

    print("\n💡 KEY INSIGHTS:")
    print("   • (540, 720) covers both (540, 660) and (600, 720)")
    print("   • (900, 960) doesn't overlap with others → kept")
    print("   • Only 2 intervals remain in final result")

    # Test Case 2: No coverage
    print("\n\n" + "█" * 70 + "\n")
    print("🧪 TEST CASE 2: No intervals are covered")
    no_overlap = [(100, 200), (300, 400), (500, 600)]
    result2 = remove_covered_intervals_educational(no_overlap)

    print("\n💡 KEY INSIGHTS:")
    print("   • No intervals overlap at all")
    print("   • All intervals are kept")

    # Test Case 3: Nested intervals
    print("\n\n" + "█" * 70 + "\n")
    print("🧪 TEST CASE 3: Fully nested intervals (Russian dolls)")
    nested = [(100, 1000), (200, 900), (300, 800), (400, 700)]
    result3 = remove_covered_intervals_educational(nested)

    print("\n💡 KEY INSIGHTS:")
    print("   • Largest interval (100, 1000) covers all others")
    print("   • All inner intervals are removed")
    print("   • Only the outermost interval remains")
