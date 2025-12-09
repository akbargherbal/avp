# backend/algorithms/__init__.py
"""
Algorithm tracer modules.

Each algorithm module exports:
- Data classes for the algorithm's input
- A Tracer class that generates complete execution traces
"""

from .interval_coverage import Interval, IntervalCoverageTracer

__all__ = [
    'Interval',
    'IntervalCoverageTracer',
]