#!/usr/bin/env python3
"""
Narrative Generation Utility Script

This script generates human-readable markdown narratives from algorithm traces.
Used during backend development to create documentation for QA review.

Usage:
    python backend/scripts/generate_narratives.py <algorithm-name> [example-index]
    python backend/scripts/generate_narratives.py binary-search 0
    python backend/scripts/generate_narratives.py interval-coverage --all

Arguments:
    algorithm-name: Name of registered algorithm (e.g., 'binary-search')
    example-index: Index of example to generate (0-based), or '--all' for all examples

Output:
    Markdown files in docs/narratives/<algorithm-name>/example_<N>_<name>.md

Examples:
    # Generate narrative for first Binary Search example
    python backend/scripts/generate_narratives.py binary-search 0

    # Generate narratives for all Interval Coverage examples
    python backend/scripts/generate_narratives.py interval-coverage --all

    # Generate narratives for ALL registered algorithms
    python backend/scripts/generate_narratives.py --all-algorithms
"""

import sys
import os
from pathlib import Path
import re

# Add backend directory to path to import algorithm modules
backend_dir = Path(__file__).parent.parent
sys.path.insert(0, str(backend_dir))

from algorithms.registry import registry


def sanitize_filename(name: str) -> str:
    """
    Convert example name to safe filename component.

    Example: "Basic Search - Target Found" -> "basic_search_target_found"
    """
    # Convert to lowercase
    filename = name.lower()
    # Replace spaces and dashes with underscores
    filename = re.sub(r'[\s\-]+', '_', filename)
    # Remove non-alphanumeric characters (except underscores)
    filename = re.sub(r'[^a-z0-9_]', '', filename)
    # Collapse multiple underscores
    filename = re.sub(r'_+', '_', filename)
    # Strip leading/trailing underscores
    filename = filename.strip('_')
    return filename


def generate_narrative_for_example(
    algorithm_name: str,
    example_index: int,
    example_data: dict,
    output_dir: Path
) -> tuple[bool, str]:
    """
    Generate narrative for a single example.

    Args:
        algorithm_name: Name of the algorithm
        example_index: Index of the example
        example_data: Example dictionary with 'name' and 'input'
        output_dir: Directory to save narrative to

    Returns:
        tuple: (success: bool, message: str)
    """
    example_name = example_data.get('name', f'Example {example_index}')
    example_input = example_data['input']

    print(f"  Processing: {example_name}")

    try:
        # Get tracer class and execute
        tracer_class = registry.get(algorithm_name)
        tracer = tracer_class()
        trace_result = tracer.execute(example_input)

        # Generate narrative
        narrative = tracer.generate_narrative(trace_result)

        # Create filename
        sanitized_name = sanitize_filename(example_name)
        filename = f"example_{example_index + 1}_{sanitized_name}.md"
        output_path = output_dir / filename

        # Write to file
        output_path.write_text(narrative)

        # Use absolute path for display, then make it relative for cleaner output
        abs_path = output_path.resolve()
        try:
            rel_path = abs_path.relative_to(Path.cwd().resolve())
            display_path = rel_path
        except ValueError:
            # If relative_to fails, just use the absolute path
            display_path = abs_path

        return True, f"    ✅ Saved to: {display_path}"

    except NotImplementedError as e:
        return False, f"    ❌ ERROR: {str(e)}"
    except KeyError as e:
        return False, f"    ❌ MISSING DATA: {str(e)} (This is good - catches bugs!)"
    except Exception as e:
        return False, f"    ❌ FAILED: {type(e).__name__}: {str(e)}"


def generate_narratives_for_algorithm(algorithm_name: str, example_indices: list[int] = None) -> tuple[int, int]:
    """
    Generate narratives for an algorithm.

    Args:
        algorithm_name: Name of registered algorithm
        example_indices: List of example indices to generate, or None for all

    Returns:
        tuple: (success_count, total_count)
    """
    # Validate algorithm exists
    if not registry.is_registered(algorithm_name):
        available = ', '.join(registry._algorithms.keys())
        print(f"❌ Algorithm '{algorithm_name}' not found.")
        print(f"   Available: {available}")
        return 0, 0

    # Get algorithm metadata
    metadata = registry.get_metadata(algorithm_name)
    examples = metadata['example_inputs']

    # Determine which examples to process
    if example_indices is None:
        example_indices = list(range(len(examples)))

    print(f"\n{'='*70}")
    print(f"Algorithm: {metadata['display_name']} ({algorithm_name})")
    print(f"Examples: {len(example_indices)} of {len(examples)}")
    print(f"{'='*70}\n")

    # Create output directory - use absolute path to avoid issues
    # Navigate up from backend/scripts to project root, then to docs/narratives
    project_root = Path(__file__).parent.parent.parent
    output_dir = project_root / 'docs' / 'narratives' / algorithm_name
    output_dir.mkdir(parents=True, exist_ok=True)

    # Process each example
    success_count = 0
    results = []

    for idx in example_indices:
        if idx >= len(examples):
            results.append(f"  ⚠️  Example {idx} does not exist (max: {len(examples)-1})")
            continue

        example = examples[idx]
        success, message = generate_narrative_for_example(
            algorithm_name, idx, example, output_dir
        )
        results.append(message)
        if success:
            success_count += 1

    # Print results
    for result in results:
        print(result)

    return success_count, len(example_indices)


def main():
    """Main entry point for script."""

    # Parse arguments
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)

    first_arg = sys.argv[1]

    # Handle --all-algorithms flag
    if first_arg == '--all-algorithms':
        print("\n🚀 Generating narratives for ALL algorithms...\n")

        total_success = 0
        total_count = 0

        for algorithm_name in registry._algorithms.keys():
            success, count = generate_narratives_for_algorithm(algorithm_name)
            total_success += success
            total_count += count

        print(f"\n{'='*70}")
        print(f"TOTAL: {total_success}/{total_count} narratives generated successfully")
        print(f"{'='*70}\n")

        sys.exit(0 if total_success == total_count else 1)

    # Handle single algorithm
    algorithm_name = first_arg

    # Determine example indices
    if len(sys.argv) < 3 or sys.argv[2] == '--all':
        # Generate all examples
        example_indices = None
    else:
        # Generate specific example
        try:
            example_index = int(sys.argv[2])
            example_indices = [example_index]
        except ValueError:
            print(f"❌ Invalid example index: {sys.argv[2]}")
            print("   Use a number (0-based) or '--all'")
            sys.exit(1)

    # Generate narratives
    success_count, total_count = generate_narratives_for_algorithm(algorithm_name, example_indices)

    # Summary
    print(f"\n{'='*70}")
    if success_count == total_count:
        print(f"✅ SUCCESS: {success_count}/{total_count} narratives generated")
    else:
        print(f"⚠️  PARTIAL: {success_count}/{total_count} narratives generated")
        print(f"   {total_count - success_count} failed (see errors above)")
    print(f"{'='*70}\n")

    sys.exit(0 if success_count == total_count else 1)


if __name__ == '__main__':
    main()