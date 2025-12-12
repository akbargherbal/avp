#!/usr/bin/env python3
"""
Backend Compliance Verification Test
Tests both Binary Search and Interval Coverage against Backend Compliance Checklist v1.0
"""

import sys
import json
from pathlib import Path

# Add backend to path
sys.path.insert(0, str(Path(__file__).parent / "backend"))

from algorithms.binary_search import BinarySearchTracer
from algorithms.interval_coverage import IntervalCoverageTracer


class ComplianceChecker:
    """Automated compliance checker for Backend Checklist v1.0"""
    
    def __init__(self, algorithm_name: str):
        self.algorithm_name = algorithm_name
        self.failures = []
        self.warnings = []
        self.passes = []
        
    def check(self, condition: bool, requirement: str, section: str):
        """Check a requirement and record result"""
        if condition:
            self.passes.append(f"✅ {section}: {requirement}")
        else:
            self.failures.append(f"❌ {section}: {requirement}")
            
    def warn(self, message: str):
        """Record a warning"""
        self.warnings.append(f"⚠️  {message}")
        
    def report(self):
        """Generate compliance report"""
        total = len(self.passes) + len(self.failures)
        score = len(self.passes)
        
        print(f"\n{'='*70}")
        print(f"  {self.algorithm_name} - Compliance Report")
        print(f"{'='*70}\n")
        
        print(f"📊 OVERALL SCORE: {score}/{total} ({(score/total*100):.0f}%)\n")
        
        if self.failures:
            print(f"❌ FAILURES ({len(self.failures)}):")
            for fail in self.failures:
                print(f"   {fail}")
            print()
            
        if self.warnings:
            print(f"⚠️  WARNINGS ({len(self.warnings)}):")
            for warn in self.warnings:
                print(f"   {warn}")
            print()
            
        if not self.failures:
            print("✅ ALL LOCKED & CONSTRAINED REQUIREMENTS PASSED!")
            print()
            
        return len(self.failures) == 0


def test_binary_search_compliance():
    """Comprehensive compliance test for Binary Search"""
    checker = ComplianceChecker("Binary Search")
    
    # Execute algorithm
    tracer = BinarySearchTracer()
    result = tracer.execute({
        'array': [1, 3, 5, 7, 9, 11, 13, 15],
        'target': 7
    })
    
    metadata = result.get('metadata', {})
    trace = result.get('trace', {})
    steps = trace.get('steps', [])
    
    print("\n🔍 Testing Binary Search Tracer...")
    print(f"   Generated {len(steps)} steps")
    
    # SECTION 1: LOCKED REQUIREMENTS - Metadata Structure
    print("\n📋 LOCKED REQUIREMENTS - Metadata Structure")
    checker.check(
        'algorithm' in metadata,
        "metadata.algorithm present",
        "Metadata"
    )
    checker.check(
        metadata.get('algorithm') == 'binary-search',
        "metadata.algorithm is 'binary-search'",
        "Metadata"
    )
    checker.check(
        'display_name' in metadata,
        "metadata.display_name present (CRITICAL FIX)",
        "Metadata"
    )
    checker.check(
        metadata.get('display_name') == 'Binary Search',
        "metadata.display_name is 'Binary Search'",
        "Metadata"
    )
    checker.check(
        'visualization_type' in metadata,
        "metadata.visualization_type present",
        "Metadata"
    )
    checker.check(
        metadata.get('visualization_type') == 'array',
        "metadata.visualization_type is 'array'",
        "Metadata"
    )
    checker.check(
        'input_size' in metadata,
        "metadata.input_size present",
        "Metadata"
    )
    
    # SECTION 2: LOCKED REQUIREMENTS - Trace Structure
    print("\n📋 LOCKED REQUIREMENTS - Trace Structure")
    checker.check(
        'trace' in result and 'steps' in trace,
        "trace.steps array present",
        "Trace"
    )
    checker.check(
        len(steps) > 0,
        "trace has steps",
        "Trace"
    )
    
    for i, step in enumerate(steps[:3]):  # Check first 3 steps
        checker.check(
            'step' in step,
            f"Step {i}: has 'step' field",
            "Trace"
        )
        checker.check(
            'type' in step,
            f"Step {i}: has 'type' field",
            "Trace"
        )
        checker.check(
            'description' in step,
            f"Step {i}: has 'description' field",
            "Trace"
        )
        checker.check(
            'data' in step and 'visualization' in step['data'],
            f"Step {i}: has 'data.visualization' field",
            "Trace"
        )
    
    # SECTION 3: CONSTRAINED REQUIREMENTS - Array Visualization
    print("\n📋 CONSTRAINED REQUIREMENTS - Array Visualization")
    first_step = steps[0]
    viz = first_step['data'].get('visualization', {})
    
    checker.check(
        'array' in viz,
        "visualization.array present",
        "Array Pattern"
    )
    
    if 'array' in viz and len(viz['array']) > 0:
        elem = viz['array'][0]
        checker.check(
            'index' in elem,
            "Array element has 'index'",
            "Array Pattern"
        )
        checker.check(
            'value' in elem,
            "Array element has 'value'",
            "Array Pattern"
        )
        checker.check(
            'state' in elem,
            "Array element has 'state'",
            "Array Pattern"
        )
    
    checker.check(
        'pointers' in viz,
        "visualization.pointers present (optional but good)",
        "Array Pattern"
    )
    
    # SECTION 4: CONSTRAINED REQUIREMENTS - Prediction Points
    print("\n📋 CONSTRAINED REQUIREMENTS - Prediction Points")
    predictions = tracer.get_prediction_points()
    
    if predictions:
        checker.check(
            len(predictions) > 0,
            f"Prediction points implemented ({len(predictions)} points)",
            "Predictions"
        )
        
        for i, pred in enumerate(predictions[:2]):  # Check first 2
            checker.check(
                'step_index' in pred,
                f"Prediction {i}: has 'step_index'",
                "Predictions"
            )
            checker.check(
                'question' in pred,
                f"Prediction {i}: has 'question'",
                "Predictions"
            )
            checker.check(
                'choices' in pred,
                f"Prediction {i}: has 'choices'",
                "Predictions"
            )
            
            # HARD LIMIT CHECK
            num_choices = len(pred.get('choices', []))
            checker.check(
                2 <= num_choices <= 3,
                f"Prediction {i}: has 2-3 choices (HARD LIMIT) - found {num_choices}",
                "Predictions"
            )
            
            for j, choice in enumerate(pred.get('choices', [])[:2]):
                checker.check(
                    'id' in choice and 'label' in choice,
                    f"Prediction {i}, Choice {j}: has 'id' and 'label'",
                    "Predictions"
                )
            
            checker.check(
                'correct_answer' in pred,
                f"Prediction {i}: has 'correct_answer'",
                "Predictions"
            )
            checker.check(
                'explanation' in pred,
                f"Prediction {i}: has 'explanation'",
                "Predictions"
            )
    
    # SECTION 5: ANTI-PATTERNS
    print("\n📋 ANTI-PATTERNS (Violations Check)")
    checker.check(
        metadata.get('visualization_type') in ['array', 'timeline', 'graph', 'tree'],
        "Uses standard visualization_type",
        "Anti-Patterns"
    )
    
    # Check no steps are missing visualization data
    all_have_viz = all('visualization' in step['data'] for step in steps)
    checker.check(
        all_have_viz,
        "All steps have visualization data",
        "Anti-Patterns"
    )
    
    return checker.report()


def test_interval_coverage_compliance():
    """Comprehensive compliance test for Interval Coverage"""
    checker = ComplianceChecker("Interval Coverage")
    
    # Execute algorithm
    tracer = IntervalCoverageTracer()
    result = tracer.execute({
        'intervals': [
            {'id': 1, 'start': 1, 'end': 3, 'color': 'blue'},
            {'id': 2, 'start': 2, 'end': 6, 'color': 'green'},
            {'id': 3, 'start': 8, 'end': 10, 'color': 'purple'}
        ]
    })
    
    metadata = result.get('metadata', {})
    trace = result.get('trace', {})
    steps = trace.get('steps', [])
    
    print("\n🔍 Testing Interval Coverage Tracer...")
    print(f"   Generated {len(steps)} steps")
    
    # SECTION 1: LOCKED REQUIREMENTS - Metadata Structure
    print("\n📋 LOCKED REQUIREMENTS - Metadata Structure")
    checker.check(
        'algorithm' in metadata,
        "metadata.algorithm present",
        "Metadata"
    )
    checker.check(
        'display_name' in metadata,
        "metadata.display_name present",
        "Metadata"
    )
    checker.check(
        'visualization_type' in metadata,
        "metadata.visualization_type present",
        "Metadata"
    )
    checker.check(
        metadata.get('visualization_type') == 'timeline',
        "metadata.visualization_type is 'timeline'",
        "Metadata"
    )
    checker.check(
        'input_size' in metadata,
        "metadata.input_size present",
        "Metadata"
    )
    
    # SECTION 2: LOCKED REQUIREMENTS - Trace Structure
    print("\n📋 LOCKED REQUIREMENTS - Trace Structure")
    checker.check(
        'trace' in result and 'steps' in trace,
        "trace.steps array present",
        "Trace"
    )
    checker.check(
        len(steps) > 0,
        "trace has steps",
        "Trace"
    )
    
    for i, step in enumerate(steps[:3]):
        checker.check(
            'step' in step and 'type' in step and 'description' in step,
            f"Step {i}: has required fields",
            "Trace"
        )
        checker.check(
            'data' in step and 'visualization' in step['data'],
            f"Step {i}: has 'data.visualization' field",
            "Trace"
        )
    
    # SECTION 3: CONSTRAINED REQUIREMENTS - Timeline Visualization
    print("\n📋 CONSTRAINED REQUIREMENTS - Timeline Visualization")
    first_step = steps[0]
    viz = first_step['data'].get('visualization', {})
    
    checker.check(
        'all_intervals' in viz,
        "visualization.all_intervals present",
        "Timeline Pattern"
    )
    
    if 'all_intervals' in viz and len(viz['all_intervals']) > 0:
        interval = viz['all_intervals'][0]
        checker.check(
            'id' in interval,
            "Interval has 'id'",
            "Timeline Pattern"
        )
        checker.check(
            'start' in interval and 'end' in interval,
            "Interval has 'start' and 'end'",
            "Timeline Pattern"
        )
        checker.check(
            'color' in interval,
            "Interval has 'color'",
            "Timeline Pattern"
        )
        checker.check(
            'state' in interval,
            "Interval has 'state'",
            "Timeline Pattern"
        )
    
    checker.check(
        'call_stack_state' in viz,
        "visualization.call_stack_state present",
        "Timeline Pattern"
    )
    
    if 'call_stack_state' in viz and len(viz['call_stack_state']) > 0:
        frame = viz['call_stack_state'][0]
        checker.check(
            'id' in frame,
            "Call frame has 'id'",
            "Timeline Pattern"
        )
        checker.check(
            'is_active' in frame,
            "Call frame has 'is_active'",
            "Timeline Pattern"
        )
        checker.check(
            'depth' in frame,
            "Call frame has 'depth'",
            "Timeline Pattern"
        )
    
    # SECTION 4: CONSTRAINED REQUIREMENTS - Prediction Points
    print("\n📋 CONSTRAINED REQUIREMENTS - Prediction Points")
    predictions = tracer.get_prediction_points()
    
    if predictions:
        for i, pred in enumerate(predictions[:2]):
            num_choices = len(pred.get('choices', []))
            checker.check(
                2 <= num_choices <= 3,
                f"Prediction {i}: has 2-3 choices (found {num_choices})",
                "Predictions"
            )
    
    return checker.report()


def main():
    """Run all compliance tests"""
    print("\n" + "="*70)
    print("  BACKEND COMPLIANCE VERIFICATION TEST SUITE")
    print("  Authority: Backend Compliance Checklist v1.0")
    print("="*70)
    
    # Test both algorithms
    binary_pass = test_binary_search_compliance()
    interval_pass = test_interval_coverage_compliance()
    
    # Final summary
    print("\n" + "="*70)
    print("  FINAL SUMMARY")
    print("="*70)
    
    print(f"\n  Binary Search:      {'✅ PASS' if binary_pass else '❌ FAIL'}")
    print(f"  Interval Coverage:  {'✅ PASS' if interval_pass else '❌ FAIL'}")
    
    if binary_pass and interval_pass:
        print("\n  🎉 BOTH ALGORITHMS FULLY COMPLIANT!")
        print("  ✅ Ready to proceed to documentation updates\n")
        return 0
    else:
        print("\n  ⚠️  COMPLIANCE ISSUES DETECTED")
        print("  ❌ Fix failures before proceeding\n")
        return 1


if __name__ == "__main__":
    sys.exit(main())