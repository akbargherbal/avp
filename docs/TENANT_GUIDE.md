# Tenant Guide v1.0 - Algorithm Visualization Platform

**Document Purpose:** This guide establishes the "constitutional framework" for frontend development in the Algorithm Visualization Platform. It defines what is LOCKED (non-negotiable), CONSTRAINED (limited freedom), and FREE (full developer autonomy).

**Target Audience:** Frontend developers, LLM code generators, and contributors implementing new algorithms or UI features.

**Last Updated:** December 11, 2025 (Session 15)

---

## Table of Contents

- [Introduction](#introduction)
- [Section 1: LOCKED REQUIREMENTS (Zero Freedom)](#section-1-locked-requirements-zero-freedom-)
- [Section 2: CONSTRAINED REQUIREMENTS (Limited Freedom)](#section-2-constrained-requirements-limited-freedom-)
- [Section 3: REFERENCE IMPLEMENTATIONS (Model Code)](#section-3-reference-implementations-model-code-)
- [Section 4: FREE IMPLEMENTATION CHOICES](#section-4-free-implementation-choices-)
- [Appendix A: Quick Reference](#appendix-a-quick-reference)
- [Appendix B: LLM Prompt Templates](#appendix-b-llm-prompt-templates)

---

## Introduction

### Purpose of This Guide

This document serves as the **architectural contract** between the platform's core design and individual algorithm implementations. It exists to:

1. **Prevent regressions** - Codify lessons learned from bugs that occurred multiple times
2. **Enable LLM-driven development** - Provide clear boundaries for AI-assisted code generation
3. **Maintain consistency** - Ensure all algorithms feel like part of the same platform
4. **Accelerate development** - Reduce decision paralysis by pre-defining critical constraints

### The Three-Tier Jurisdiction System

This guide categorizes all UI elements and patterns into three jurisdictions:

| Jurisdiction    | Symbol | Freedom Level                                         | Examples                                                            |
| --------------- | ------ | ----------------------------------------------------- | ------------------------------------------------------------------- |
| **LOCKED**      | 🔒     | Zero - Must implement exactly as specified            | Modal sizes, panel ratios, HTML IDs, keyboard shortcuts             |
| **CONSTRAINED** | 🎨     | Limited - Parameters defined, implementation flexible | Visualization components, prediction questions, backend contract    |
| **FREE**        | 🚀     | Full - Developer's choice                             | Component architecture, state management, performance optimizations |

**Critical Principle:** LOCKED elements are **architectural invariants**. Violating them breaks the user experience, testing infrastructure, or accessibility. CONSTRAINED elements have design parameters but allow creativity within bounds. FREE elements are implementation details.

### LLM Integration Vision

This guide is designed to be included in LLM context when generating new algorithm implementations. By explicitly defining what can and cannot be modified, we enable:

- **Confident code generation** - LLM knows which patterns to follow exactly
- **Automated validation** - Generated code can be checked against this spec
- **Rapid prototyping** - New algorithms can be added in <5 hours using established patterns

---

## Section 1: LOCKED REQUIREMENTS (Zero Freedom) 🔒

These are **architectural invariants**. Frontend developers must implement exactly as specified. No exceptions without explicit approval and documentation update.

---

### 1.1 Modal Standards

**Purpose:** Modals must fit cleanly within the viewport without scrolling. This maintains focus and prevents distraction.

#### Size Constraints

```jsx
// ✅ CORRECT: Modal sizing (must be used exactly)
<div className="max-w-lg w-full">  {/* Small modal: 512px max */}
  {/* PredictionModal, simple dialogs */}
</div>

<div className="max-w-2xl w-full"> {/* Large modal: 672px max */}
  {/* CompletionModal, complex results */}
</div>

// Maximum height constraint (MANDATORY)
<div className="max-h-[85vh]">  {/* Never exceed 85% of viewport height */}
  {/* Modal content */}
</div>
```

#### Positioning Rules

```jsx
// ✅ CORRECT: Modal positioning (must be used exactly)
<div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
  <div className="bg-slate-800 rounded-2xl shadow-2xl border-2 border-blue-500 max-w-lg w-full p-6">
    {/* Modal content */}
  </div>
</div>

// Key requirements:
// - fixed inset-0: Full viewport overlay
// - bg-black/80 backdrop-blur-sm: Semi-transparent blurred background
// - flex items-center justify-center: Centered modal
// - z-50: Above all other content
// - p-4: Padding to prevent viewport edge collision
```

#### Scrolling Prohibition

**CRITICAL RULE:** Modal content must fit within `max-h-[85vh]` without internal scrolling.

```jsx
// ❌ WRONG: Scrollable modal body (violates viewport constraint)
<div className="max-h-[85vh] overflow-y-auto">
  {/* Long content that requires scrolling */}
</div>

// ✅ CORRECT: Content designed to fit (use compact layouts, smaller fonts, grid layouts)
<div className="max-h-[85vh]">
  <div className="grid grid-cols-3 gap-3 text-xs">
    {/* Compact, non-scrolling content */}
  </div>
</div>
```

**Rationale:** Scrolling within a modal breaks the "modal as part of current view" philosophy. Users should see all modal content at once.

#### Z-Index Hierarchy

```javascript
// Fixed z-index values (do not modify):
// - z-50: Modals (PredictionModal, CompletionModal)
// - z-40: Dropdown menus, tooltips
// - z-30: Sticky headers
// - z-20: Overlays
// - z-10: Elevated content
// - z-0: Base content
```

---

### 1.2 Panel Layout Architecture

**Purpose:** The 3:1.5 ratio ensures visualization is the primary focus while maintaining adequate space for algorithm state.

#### Mandatory Flex Ratio

```jsx
// ✅ CORRECT: Panel layout (must use these exact ratios)
<div className="flex gap-4">
  <div id="panel-visualization" className="flex-[3]">  {/* 66.67% width */}
    {/* Main visualization (Timeline, Array, Graph) */}
  </div>

  <div id="panel-steps" className="w-96">  {/* Fixed 384px OR flex-[1.5] */}
    {/* Steps, state, call stack */}
  </div>
</div>

// Alternative (responsive):
<div className="flex gap-4">
  <div className="flex-[3] min-w-0">  {/* Allows shrinking */}
    {/* Visualization */}
  </div>
  <div className="flex-[1.5] min-w-[384px]">  {/* Never smaller than 384px */}
    {/* Steps */}
  </div>
</div>
```

#### Minimum Widths

```javascript
// Required minimum widths:
// - Visualization panel: No minimum (can shrink with viewport)
// - Steps panel: 384px (w-96) minimum
//   - Rationale: Call stack frames need readable text
//   - Smaller widths cause text wrapping and readability issues
```

#### Overflow Handling

```jsx
// ✅ CORRECT: Each panel manages its own overflow
<div id="panel-visualization" className="flex-1 flex flex-col overflow-hidden">
  <div className="flex-1 overflow-auto p-6">
    {/* Scrollable visualization content */}
  </div>
</div>

<div id="panel-steps" className="w-96 flex flex-col overflow-hidden">
  <div id="panel-steps-list" className="flex-1 overflow-y-auto px-6 py-4">
    {/* Scrollable steps list */}
  </div>
</div>
```

**Rationale:** The 3:1.5 ratio was established during PoC development and validated across multiple algorithms. It provides optimal balance between visualization space and context.

---

### 1.3 HTML Landmark IDs

**Purpose:** Required IDs enable testing, debugging, accessibility, and auto-scroll behavior. These are **non-negotiable**.

#### Required IDs List

```jsx
// Application structure
#app-root              // <div> Top-level app container (outermost element)
#app-header            // <div> Main header bar (algorithm info, controls)

// Content panels
#panel-visualization   // <div> Main visualization area (left panel)
#panel-steps           // <div> Right panel container (steps/state)
#panel-steps-list      // <div> Scrollable steps/stack list
#panel-step-description // <div> Current step description (bottom of right panel)

// Dynamic elements (added by components)
#step-current          // <div> Currently executing step (auto-scroll target)
                       // - Used in CallStackView for active call frame
                       // - Must scroll into view on step change
```

#### Usage in Components

```jsx
// Example: App.jsx (Required IDs)
const AlgorithmTracePlayer = () => {
  return (
    <div id="app-root" className="w-full h-screen">
      <div id="app-header" className="bg-slate-800 px-4 py-3">
        {/* Header content */}
      </div>

      <div className="flex-1 flex gap-4">
        <div id="panel-visualization" className="flex-[3]">
          {/* Visualization */}
        </div>

        <div id="panel-steps" className="w-96 flex flex-col">
          <div id="panel-steps-list" className="flex-1 overflow-y-auto">
            {/* Steps list */}
          </div>
          <div id="panel-step-description" className="border-t p-4">
            {/* Current step description */}
          </div>
        </div>
      </div>
    </div>
  );
};

// Example: CallStackView.jsx (Dynamic ID)
const CallStackView = ({ step, activeCallRef }) => {
  return (
    <div>
      {step.data.call_stack_state.map((call, idx) => (
        <div
          key={call.id}
          id={call.is_active ? "step-current" : undefined} // Only active call gets ID
          ref={call.is_active ? activeCallRef : null}
        >
          {/* Call frame content */}
        </div>
      ))}
    </div>
  );
};
```

#### When to Use IDs vs useRef()

| Use Case                       | Solution                        | Example                                          |
| ------------------------------ | ------------------------------- | ------------------------------------------------ |
| Auto-scroll to current step    | `useRef()` + `scrollIntoView()` | `activeCallRef.current.scrollIntoView()`         |
| Test targeting (Cypress, Jest) | HTML ID                         | `cy.get('#panel-steps-list')`                    |
| Console debugging              | HTML ID                         | `document.getElementById('panel-visualization')` |
| Accessibility labels (ARIA)    | HTML ID                         | `<button aria-describedby="step-description">`   |
| Class-based styling            | Tailwind classes                | `className="bg-slate-800"`                       |

**Rationale:** IDs provide stable, framework-agnostic references for testing, debugging, and accessibility. React refs are excellent for internal component logic but invisible to external tools.

---

### 1.4 Keyboard Navigation

**Purpose:** Power users rely on keyboard shortcuts. These shortcuts are **non-negotiable** and must work consistently across all algorithms.

#### Standard Shortcuts (Always Active)

```javascript
// Required keyboard shortcuts (implement exactly as specified):

// Navigation
→ (Right Arrow)  - Next Step
← (Left Arrow)   - Previous Step
Space            - Toggle Mode (Watch/Predict)
R                - Reset (restart trace from beginning)

// Modal-specific (when modal is active)
Enter            - Submit (in PredictionModal)
S                - Skip (in PredictionModal)
Escape           - Close modal (optional enhancement)
```

#### Implementation Pattern

```javascript
// ✅ CORRECT: Global keyboard listener (from useKeyboardShortcuts.js)
useEffect(() => {
  const handleKeyPress = (event) => {
    // Ignore if modal is open (modals handle their own shortcuts)
    if (modalOpen) return;

    // Ignore if user is typing in an input field
    if (
      event.target.tagName === "INPUT" ||
      event.target.tagName === "TEXTAREA"
    ) {
      return;
    }

    switch (event.key) {
      case "ArrowRight":
        event.preventDefault();
        onNext();
        break;
      case "ArrowLeft":
        event.preventDefault();
        onPrev();
        break;
      case " ": // Space
        event.preventDefault();
        onToggleMode();
        break;
      case "r":
      case "R":
        event.preventDefault();
        onReset();
        break;
      default:
      // No action
    }
  };

  window.addEventListener("keydown", handleKeyPress);
  return () => window.removeEventListener("keydown", handleKeyPress);
}, [modalOpen, onNext, onPrev, onToggleMode, onReset]);
```

#### Prediction Shortcuts (Auto-Derived, Maximum 3)

**HARD LIMIT:** Prediction questions can have **at most 3 choices**, each with a keyboard shortcut.

```javascript
// Shortcut derivation strategy (from PredictionModal.jsx):
// 1. Try first letter of label (if unique among choices)
// 2. Try first letter of key words (capitalized words)
// 3. Fall back to numbers (1, 2, 3)

// Examples:
// "Found! (5 == 5)"    → F (first letter)
// "Search Left"        → L (key word "Left")
// "Search Right"       → R (key word "Right")
// "Keep this interval" → K (first letter)
// "Covered by previous"→ C (first letter)

// Always supported as fallback:
// 1 - First choice
// 2 - Second choice
// 3 - Third choice
```

**Rationale:** Consistent keyboard shortcuts reduce friction for power users and enable efficient trace navigation without mouse interaction. The 3-choice limit prevents shortcut conflicts and cognitive overload.

---

### 1.5 Auto-Scroll Behavior

**Purpose:** Users must always see the current execution context without manual scrolling. This is **mandatory** for recursive algorithms where the call stack exceeds viewport height.

#### Required Implementation

```javascript
// ✅ CORRECT: Auto-scroll to current step (copy-paste this pattern)
useEffect(() => {
  if (activeCallRef.current) {
    activeCallRef.current.scrollIntoView({
      behavior: "smooth", // Smooth animation (required for UX)
      block: "center", // Center the element (alternative: 'nearest')
    });
  }
}, [currentStep]); // Trigger on step change
```

#### Scroll Options Explained

```javascript
// block parameter options:
// - 'center' (CURRENT): Always centers the element in viewport
//   - Best for long traces (10+ steps)
//   - Consistent visual position
//   - Chosen for this platform
//
// - 'nearest' (ALTERNATIVE): Only scrolls if element is out of view
//   - Best for short traces (< 10 steps)
//   - Minimal scroll movement
//   - Can be jarring for long traces
//
// - 'start': Scrolls element to top of container
//   - Rarely used (element may be partially hidden by header)
```

#### When Auto-Scroll Applies

```javascript
// Auto-scroll triggers:
// 1. User navigates to next/previous step (Arrow keys, buttons)
// 2. Prediction mode auto-advances after correct answer
// 3. Watch mode (auto-play) advances to next step
// 4. User jumps to end of trace

// Auto-scroll does NOT trigger:
// - User manually scrolls the steps list (don't fight user intent)
// - Algorithm switch (trace resets, scrolling to top is expected)
```

#### Ref Management

```javascript
// ✅ CORRECT: Create and pass ref to visualization component
const activeCallRef = useRef(null);

// In parent component (App.jsx):
<CallStackView
  step={step}
  activeCallRef={activeCallRef}  // Pass ref down
/>

// In CallStackView.jsx:
<div
  id={call.is_active ? "step-current" : undefined}
  ref={call.is_active ? activeCallRef : null}  // Assign ref to active element
>
  {/* Call frame content */}
</div>
```

**Rationale:** Auto-scroll was identified as a critical UX feature in the original static mockup. Without it, users lose track of execution in recursive algorithms (e.g., Interval Coverage with 15+ call frames).

---

### 1.6 Overflow Handling Anti-Patterns

**Purpose:** Document the recurring ArrayView cutoff bug and its permanent solution. This bug occurred **3 times** during development.

#### THE PROBLEM: Flex Centering + Overflow Cutoff

**Root Cause:** Using `display: flex` with `align-items: center` (or `items-center` in Tailwind) combined with `overflow: auto` causes content at the start to be cut off when content overflows.

```jsx
// ❌ WRONG: This pattern causes left edge cutoff (DO NOT USE)
<div className="flex items-center overflow-auto">
  {/* Wide content - left portion will be inaccessible */}
  <div className="flex gap-2">
    {array.map((item) => (
      <div className="w-16">{item}</div>
    ))}
  </div>
</div>

// Why it fails:
// 1. Flex centering positions content symmetrically around container center
// 2. When content is wider than container, left half extends beyond scroll origin
// 3. Browser cannot scroll to negative positions
// 4. Result: Left content is inaccessible (cut off)
```

#### THE SOLUTION: Start Alignment + Auto Margin Wrapper

**Permanent Fix:** Use `align-items: flex-start` (or `items-start`) on the scrollable container, then wrap content in a child div with `margin: 0 auto` (or `mx-auto`).

```jsx
// ✅ CORRECT: Permanent solution (ALWAYS USE THIS PATTERN)
<div className="flex items-start overflow-auto">
  {" "}
  {/* items-start, not items-center */}
  <div className="mx-auto">
    {" "}
    {/* Centering wrapper with auto margins */}
    {/* Wide content - fully scrollable from left to right */}
    <div className="flex gap-2">
      {array.map((item) => (
        <div className="w-16">{item}</div>
      ))}
    </div>
  </div>
</div>

// How it works:
// 1. items-start aligns content to the left edge (scroll origin at 0)
// 2. overflow-auto enables scrolling from that edge
// 3. mx-auto on inner wrapper centers content when it fits viewport
// 4. When content overflows, scrolling works from left edge to right edge
// 5. All content remains accessible via horizontal scroll
```

#### Visual Explanation

```
❌ WRONG (items-center + overflow-auto):
┌─────────────────────────────────┐
│    Viewport (visible area)      │
├─────────────────────────────────┤
│ [-2][-1][0][1][2][3][4][5][6]   │  ← Centered, but [-2][-1] cut off
└─────────────────────────────────┘
     ↑                         ↑
   Cut off               Scroll origin
   (unreachable)

✅ CORRECT (items-start + mx-auto wrapper):
┌─────────────────────────────────┐
│    Viewport (visible area)      │
├─────────────────────────────────┤
│ [0][1][2][3][4][5][6][7][8]...  │  ← All accessible via scroll
└─────────────────────────────────┘
  ↑                             ↑
Scroll origin              Scrollable right
```

#### Real-World Example (ArrayView.jsx)

```jsx
// From frontend/src/components/visualizations/ArrayView.jsx
const ArrayView = ({ step, config = {} }) => {
  return (
    // PERMANENT FIX: Use items-start + mx-auto pattern
    <div className="h-full flex flex-col items-start overflow-auto py-4 px-6">
      <div className="mx-auto flex flex-col items-center gap-6 min-h-0">
        {/* Array visualization content */}
        <div className="flex gap-2">
          {array.map((element) => (
            <div key={element.index} className="w-16 h-16">
              {element.value}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
```

#### When This Pattern Applies

```javascript
// Use this pattern whenever:
// 1. Content may exceed viewport width (arrays, timelines, graphs)
// 2. Content should be centered when it fits
// 3. Content must be fully scrollable when it overflows

// Applies to:
// - ArrayView (binary search, sorting algorithms)
// - TimelineView (interval coverage, long timelines)
// - Graph visualizations (large graphs)
// - Any horizontal scrollable content in visualization panels
```

**Rationale:** This bug occurred 3 times during development because the anti-pattern (`items-center` + `overflow-auto`) is intuitive but broken. This is a **well-documented CSS flexbox issue** confirmed by industry sources. The solution (`items-start` + `mx-auto`) is the standard fix used across the web development community.

**IMPORTANT:** This anti-pattern and solution must be included in LLM context when generating new visualization components.

---

## Section 1 Summary

These LOCKED requirements are **architectural invariants**:

✅ **Modals** - max-h-[85vh], fixed positioning, no internal scrolling  
✅ **Panel Layout** - 3:1.5 flex ratio, 384px minimum for steps panel  
✅ **HTML IDs** - 6 required landmark IDs (app-root, app-header, panels, step-current)  
✅ **Keyboard Shortcuts** - Arrow keys, Space, R, Enter, S (max 3 prediction shortcuts)  
✅ **Auto-Scroll** - scrollIntoView({ behavior: 'smooth', block: 'center' })  
✅ **Overflow Pattern** - items-start + mx-auto wrapper (never items-center + overflow-auto)

Violating these requirements breaks user experience, testing, or accessibility. **No exceptions without explicit documentation update.**

---

## Section 2: CONSTRAINED REQUIREMENTS (Limited Freedom) 🎨

These elements have **design parameters** but allow implementation choices within defined boundaries. You must follow the contract, but have flexibility in how you achieve it.

---

### 2.1 Backend JSON Contract

**Purpose:** Standardized trace structure enables frontend to work with any algorithm without custom parsing logic.

#### Required Metadata Structure

```python
# Every algorithm tracer must return metadata with these fields:
metadata = {
    "algorithm": str,              # REQUIRED: Unique identifier (e.g., "binary-search")
    "display_name": str,           # REQUIRED: Human-readable name (e.g., "Binary Search")
    "visualization_type": str,     # REQUIRED: "array" | "timeline" | "graph" | "tree"
    "input_size": int,             # REQUIRED: Number of elements/nodes in input

    # OPTIONAL fields (algorithm-specific):
    "target_value": Any,           # For search algorithms
    "visualization_config": dict,  # Visualization customization
    "prediction_points": list,     # Prediction metadata (if prediction mode supported)
    "execution_stats": dict,       # Algorithm-specific statistics
}
```

**Example: Binary Search Metadata**

```json
{
  "algorithm": "binary-search",
  "display_name": "Binary Search",
  "visualization_type": "array",
  "input_size": 16,
  "target_value": 67,
  "visualization_config": {
    "show_indices": true,
    "pointer_colors": {
      "left": "blue",
      "right": "red",
      "mid": "yellow",
      "target": "green"
    }
  },
  "prediction_points": [
    {
      "step_index": 2,
      "question": "Where should we search next?",
      "choices": [
        { "id": "found", "label": "Found! (67 == 67)" },
        { "id": "search-left", "label": "Search Left" },
        { "id": "search-right", "label": "Search Right" }
      ],
      "hint": "Compare mid (67) with target (67)",
      "correct_answer": "found",
      "explanation": "The middle element equals the target!"
    }
  ]
}
```

**Example: Interval Coverage Metadata**

```json
{
  "algorithm": "interval-coverage",
  "display_name": "Interval Coverage (Recursive)",
  "visualization_type": "timeline",
  "input_size": 8,
  "visualization_config": {
    "show_timeline_grid": true,
    "interval_colors": ["blue", "green", "yellow", "red", "purple"]
  },
  "prediction_points": [
    {
      "step_index": 5,
      "question": "What will happen to this interval?",
      "choices": [
        { "id": "keep", "label": "Keep this interval" },
        { "id": "covered", "label": "Covered by previous" }
      ],
      "hint": "Check if current interval's start is before the previous end",
      "correct_answer": "covered",
      "explanation": "Interval [3, 7] is covered by [1, 8]"
    }
  ]
}
```

#### Required Trace Structure

```python
# Trace object returned by execute():
trace = {
    "metadata": metadata,  # See above
    "trace": {
        "steps": [
            {
                "step": int,              # REQUIRED: 0-indexed step number
                "type": str,              # REQUIRED: Algorithm-defined step type
                "description": str,       # REQUIRED: Human-readable description
                "data": {
                    "visualization": dict,  # REQUIRED: Current state for visualization
                    # ... algorithm-specific fields
                }
            }
        ]
    },
    "result": dict  # OPTIONAL: Final algorithm result
}
```

#### Visualization Data Patterns

**Array Algorithms (Binary Search, Sorting)**

```python
# Required structure for visualization_type: "array"
step_data = {
    "visualization": {
        "array": [
            {
                "index": int,        # REQUIRED: Array index
                "value": Any,        # REQUIRED: Element value
                "state": str         # REQUIRED: Element state (see states below)
            }
        ],
        "pointers": {              # OPTIONAL: Algorithm pointers
            "left": int | None,
            "right": int | None,
            "mid": int | None,
            "target": Any | None
        },
        "search_space_size": int   # OPTIONAL: Current search space size
    }
}

# Valid element states (choose names that make sense for your algorithm):
# - "active_range": Element is in current search/sort range
# - "examining": Element is being compared/checked
# - "found": Element matches search target
# - "excluded": Element is outside search range
# - "sorted": Element is in final sorted position (for sorting algorithms)
# - "pivot": Element is the pivot (for quicksort)
```

**Timeline Algorithms (Interval Coverage)**

```python
# Required structure for visualization_type: "timeline"
step_data = {
    "visualization": {
        "all_intervals": [
            {
                "id": str,              # REQUIRED: Unique identifier
                "start": int,           # REQUIRED: Interval start
                "end": int,             # REQUIRED: Interval end
                "color": str,           # REQUIRED: Color identifier
                "state": str            # REQUIRED: "examining" | "kept" | "covered"
            }
        ],
        "call_stack_state": [
            {
                "id": str,              # REQUIRED: Unique call frame ID
                "interval": dict,       # REQUIRED: Interval being processed
                "is_active": bool,      # REQUIRED: True for current call
                "depth": int            # REQUIRED: Recursion depth
            }
        ]
    }
}
```

**Graph Algorithms (DFS, Dijkstra) - Future**

```python
# Proposed structure for visualization_type: "graph"
step_data = {
    "visualization": {
        "graph": {
            "nodes": [
                {
                    "id": str,          # REQUIRED: Node identifier
                    "label": str,       # REQUIRED: Display label
                    "state": str        # REQUIRED: "unvisited" | "visiting" | "visited"
                }
            ],
            "edges": [
                {
                    "from": str,        # REQUIRED: Source node ID
                    "to": str,          # REQUIRED: Target node ID
                    "weight": float     # OPTIONAL: Edge weight
                }
            ]
        },
        "algorithm_state": {
            "current_node": str,        # OPTIONAL: Node being processed
            "visited": list,            # OPTIONAL: Visited node IDs
            "queue": list               # OPTIONAL: Queue/stack state
        }
    }
}
```

#### Flexibility Within Contract

**What You CAN Customize:**

```python
# ✅ ALLOWED: Add algorithm-specific fields to data
step_data = {
    "visualization": { ... },  # Required
    "comparisons": 3,          # Your custom field
    "swaps": 1,                # Your custom field
    "custom_metric": "value"   # Your custom field
}

# ✅ ALLOWED: Use algorithm-appropriate state names
element_states = ["unsorted", "pivot", "partitioned"]  # Quicksort
element_states = ["unvisited", "frontier", "visited"]  # BFS/DFS

# ✅ ALLOWED: Extend visualization config
visualization_config = {
    "show_indices": True,           # Standard
    "animate_swaps": True,          # Your addition
    "highlight_comparisons": False  # Your addition
}
```

**What You CANNOT Do:**

```python
# ❌ FORBIDDEN: Omit required metadata fields
metadata = {
    "algorithm": "my-algo"
    # Missing display_name, visualization_type, input_size
}

# ❌ FORBIDDEN: Use non-standard visualization_type
metadata = {
    "visualization_type": "custom-viz"  # Not in ["array", "timeline", "graph", "tree"]
}

# ❌ FORBIDDEN: Return steps without visualization data
step_data = {
    "comparisons": 3
    # Missing "visualization" key
}
```

**Rationale:** The contract ensures frontend can dynamically render any algorithm without custom parsing. Flexibility within the contract allows algorithms to add domain-specific data.

---

### 2.2 Visualization Components

**Purpose:** Visualization components consume standardized data and provide visual feedback. They have a required interface but freedom in rendering approach.

#### Required Component Interface

```jsx
// ✅ REQUIRED: Every visualization component must accept these props
const VisualizationComponent = ({
  step,      // REQUIRED: Current step data (includes step.data.visualization)
  config     // REQUIRED: Visualization config from metadata (optional fields)
}) => {
  // Component implementation
};

// Example usage:
<ArrayView step={currentStep} config={trace.metadata.visualization_config} />
<TimelineView step={currentStep} config={trace.metadata.visualization_config} />
```

#### Required Behavior

**1. Consume Visualization Data**

```jsx
// ✅ REQUIRED: Extract visualization data from step
const VisualizationComponent = ({ step, config = {} }) => {
  const visualization = step?.data?.visualization;

  // Always handle missing data gracefully
  if (!visualization) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        No visualization data available
      </div>
    );
  }

  // Extract algorithm-specific data
  const { array, pointers } = visualization; // For array algorithms
  // OR
  const { all_intervals, call_stack_state } = visualization; // For timeline

  // Render visualization
};
```

**2. Provide Visual Feedback for Current State**

```jsx
// ✅ REQUIRED: Highlight current execution context
const getElementClasses = (element) => {
  const baseClasses = "w-16 h-16 flex items-center justify-center rounded-lg";

  // Map element states to visual styles
  switch (element.state) {
    case "examining":
      return `${baseClasses} bg-yellow-500 border-yellow-400 scale-110 animate-pulse`;
    case "found":
      return `${baseClasses} bg-green-500 border-green-400 scale-110`;
    case "active_range":
      return `${baseClasses} bg-blue-600 border-blue-500`;
    case "excluded":
      return `${baseClasses} bg-gray-700 border-gray-600 opacity-50`;
    default:
      return `${baseClasses} bg-slate-600 border-slate-500`;
  }
};
```

**3. Handle Overflow Using Correct Pattern**

```jsx
// ✅ REQUIRED: Use items-start + mx-auto pattern (see Section 1.6)
const ArrayView = ({ step, config }) => {
  return (
    <div className="h-full flex flex-col items-start overflow-auto py-4 px-6">
      <div className="mx-auto flex flex-col items-center gap-6">
        {/* Visualization content */}
      </div>
    </div>
  );
};
```

#### Allowed Customizations

**Freedom Within Constraints:**

```jsx
// ✅ ALLOWED: Custom animation styles
<div className="transition-all duration-300 hover:scale-105">
  {element.value}
</div>;

// ✅ ALLOWED: Algorithm-specific visual elements
{
  algorithm === "quicksort" && (
    <div className="absolute -top-6 text-purple-600 font-bold">Pivot</div>
  );
}

// ✅ ALLOWED: Color scheme variations (within Tailwind palette)
const getColorScheme = (config) => {
  return config.dark_mode
    ? { bg: "bg-slate-800", text: "text-white" }
    : { bg: "bg-slate-100", text: "text-black" };
};

// ✅ ALLOWED: Layout within panel (grid vs flex vs custom)
<div className="grid grid-cols-4 gap-4">{/* Custom grid layout */}</div>;
```

**Restrictions:**

```jsx
// ❌ FORBIDDEN: Ignore step.data.visualization structure
const BadComponent = ({ step }) => {
  const data = step.custom_field;  // Don't invent your own structure
};

// ❌ FORBIDDEN: Violate overflow pattern (see Section 1.6)
<div className="flex items-center overflow-auto">  {/* NO! */}
  {/* This will cause cutoff */}
</div>

// ❌ FORBIDDEN: Exceed panel boundaries (use overflow-auto)
<div className="w-[2000px]">  {/* This breaks layout */}
  {/* Content without overflow handling */}
</div>
```

#### Visualization Registry

```javascript
// visualizationRegistry.js
import TimelineView from "../components/visualizations/TimelineView";
import ArrayView from "../components/visualizations/ArrayView";
// Future: GraphView, TreeView, MatrixView

const VISUALIZATION_REGISTRY = {
  timeline: TimelineView,
  array: ArrayView,
  // graph: GraphView,     // Add when implementing graph algorithms
  // tree: TreeView,       // Add when implementing tree algorithms
};

export const getVisualizationComponent = (type) => {
  return VISUALIZATION_REGISTRY[type] || TimelineView; // Fallback
};

// Usage in App.jsx:
const MainVisualizationComponent = getVisualizationComponent(
  trace?.metadata?.visualization_type || "timeline"
);

<MainVisualizationComponent
  step={currentStep}
  config={trace?.metadata?.visualization_config || {}}
/>;
```

**Rationale:** The component interface ensures new visualizations integrate seamlessly. Freedom in rendering approach allows algorithm-specific creativity while maintaining consistency.

---

### 2.3 Prediction Questions

**Purpose:** Prediction mode enhances learning by engaging users with the algorithm. Questions must be simple, clear, and non-overwhelming.

#### HARD LIMIT: Maximum 3 Choices

**CRITICAL RULE:** Every prediction question can have **at most 3 choices**. This is non-negotiable.

```python
# ✅ CORRECT: 2-3 choices
prediction_point = {
    "choices": [
        {"id": "keep", "label": "Keep this interval"},
        {"id": "covered", "label": "Covered by previous"}
    ]  # 2 choices ✓
}

prediction_point = {
    "choices": [
        {"id": "found", "label": "Found! (67 == 67)"},
        {"id": "search-left", "label": "Search Left"},
        {"id": "search-right", "label": "Search Right"}
    ]  # 3 choices ✓
}

# ❌ WRONG: More than 3 choices
prediction_point = {
    "choices": [
        {"id": "node-a", "label": "Visit Node A"},
        {"id": "node-b", "label": "Visit Node B"},
        {"id": "node-c", "label": "Visit Node C"},
        {"id": "node-d", "label": "Visit Node D"}
    ]  # 4 choices ✗ - VIOLATES HARD LIMIT
}
```

**Rationale:** This is NOT a quiz app. Predictions are **pedagogical nudges** to focus attention on the current step, not mastery tests. More than 3 choices:

1. Increases cognitive load (students focus on decision tree, not algorithm)
2. Requires modal scrolling (violates Section 1.1 viewport constraint)
3. Creates keyboard shortcut conflicts (max 3 semantic shortcuts)

#### Question Simplification Strategies

When natural choices exceed 3, simplify the question:

**Strategy 1: Ask Higher-Level Questions**

```python
# ❌ WRONG: DFS with 8 neighbors (too many choices)
prediction = {
    "question": "Which neighbor will DFS visit next?",
    "choices": [
        {"id": "n1", "label": "Node 1"},
        {"id": "n2", "label": "Node 2"},
        # ... 8 total choices
    ]
}

# ✅ CORRECT: Simplify to yes/no/maybe
prediction = {
    "question": "Will DFS find a path to the target?",
    "choices": [
        {"id": "yes", "label": "Yes, path exists"},
        {"id": "no", "label": "No, target unreachable"},
        {"id": "unsure", "label": "Not enough information"}
    ]  # 3 choices ✓
}
```

**Strategy 2: Group Choices Conceptually**

```python
# ❌ WRONG: Dijkstra with 10+ nodes
prediction = {
    "question": "Which node's distance will be updated?",
    "choices": [
        {"id": "node-1", "label": "Node 1"},
        {"id": "node-2", "label": "Node 2"},
        # ... 10+ total choices
    ]
}

# ✅ CORRECT: Group by region/property
prediction = {
    "question": "Which region will see distance updates?",
    "choices": [
        {"id": "north", "label": "Northern nodes"},
        {"id": "south", "label": "Southern nodes"},
        {"id": "none", "label": "No updates this step"}
    ]  # 3 choices ✓
}
```

**Strategy 3: Skip Prediction for That Step**

```python
# If simplification isn't meaningful, don't force a prediction
# Not every step needs a prediction!

# Example: Merge Sort - final merge step
# "Which element goes first in final array?" with 100 elements
# → Skip prediction, let visualization show the merge
```

#### Prediction Point Structure

```python
# Complete prediction point structure:
prediction_point = {
    "step_index": int,              # REQUIRED: Step where prediction occurs
    "question": str,                # REQUIRED: Clear, concise question
    "choices": [                    # REQUIRED: 2-3 choices (HARD LIMIT)
        {
            "id": str,              # REQUIRED: Unique choice identifier
            "label": str            # REQUIRED: Display text (used for shortcuts)
        }
    ],
    "hint": str,                    # OPTIONAL: Hint text (shown before answer)
    "correct_answer": str,          # REQUIRED: Choice ID of correct answer
    "explanation": str              # REQUIRED: Feedback after answer (why correct/incorrect)
}
```

#### Shortcut Derivation Rules

Shortcuts are auto-derived from choice labels (see Section 1.4):

```python
# Derivation strategy (implemented in PredictionModal.jsx):
# 1. Try first letter of label (if unique)
# 2. Try first letter of capitalized words ("Search Left" → L)
# 3. Fall back to numbers (1, 2, 3)

# Examples:
"Found! (67 == 67)"      → F
"Search Left"            → L
"Search Right"           → R
"Keep this interval"     → K
"Covered by previous"    → C
"Yes"                    → Y
"No"                     → N
"Maybe"                  → M

# Fallback numbers always work:
# 1 - First choice
# 2 - Second choice
# 3 - Third choice
```

**Best Practices:**

```python
# ✅ GOOD: Clear, distinct labels
choices = [
    {"id": "found", "label": "Found! (5 == 5)"},
    {"id": "left", "label": "Search Left"},
    {"id": "right", "label": "Search Right"}
]  # Shortcuts: F, L, R (distinct first letters)

# ❌ BAD: Ambiguous labels
choices = [
    {"id": "c1", "label": "Continue searching"},
    {"id": "c2", "label": "Check next element"},
    {"id": "c3", "label": "Compare values"}
]  # Shortcuts: C, C, C (conflicts!) → Falls back to 1, 2, 3
```

**Rationale:** The 3-choice limit balances educational value with UX constraints. Questions should nudge thinking, not test exhaustive knowledge.

---

### 2.4 Completion Modal

**Purpose:** Show algorithm results and prediction accuracy. Must work for any algorithm without hardcoded step types.

#### Detection Strategy: Last Step, Not Type

**CRITICAL:** Detect completion by checking if current step is the last step, NOT by checking step type.

```jsx
// ✅ CORRECT: Algorithm-agnostic detection
const CompletionModal = ({ trace, step }) => {
  const isLastStep =
    trace?.trace?.steps && step?.step === trace.trace.steps.length - 1;

  if (!isLastStep) {
    return null;
  }

  // Render completion modal
};

// ❌ WRONG: Hardcoded step type check
const BadModal = ({ step }) => {
  if (step?.type !== "ALGORITHM_COMPLETE") {
    // Breaks for other algorithms!
    return null;
  }
};
```

**Rationale:** Different algorithms use different step types for completion:

- Interval Coverage: `"ALGORITHM_COMPLETE"`
- Binary Search: `"TARGET_FOUND"` or `"TARGET_NOT_FOUND"`
- DFS: `"PATH_FOUND"` or `"NO_PATH"`

Checking last step position is algorithm-agnostic.

#### Algorithm-Specific Result Rendering

```jsx
// Detect algorithm from metadata
const algorithm = trace?.metadata?.algorithm || "unknown";
const isIntervalCoverage = algorithm === "interval-coverage";
const isBinarySearch = algorithm === "binary-search";

// Render appropriate results
const renderAlgorithmResults = () => {
  if (isIntervalCoverage) {
    return renderIntervalCoverageResults();
  } else if (isBinarySearch) {
    return renderBinarySearchResults();
  } else {
    return renderGenericResults(); // Fallback
  }
};
```

**Example: Binary Search Results**

```jsx
const renderBinarySearchResults = () => {
  const result = trace?.result || {};
  const found = result.found;
  const index = result.index;
  const comparisons = result.comparisons || 0;
  const target = trace?.metadata?.target_value;
  const arraySize = trace?.metadata?.input_size || 0;

  return (
    <>
      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3 text-center">
        <div>
          <div className="text-slate-400 text-xs">Array Size</div>
          <div className="text-xl font-bold text-white">{arraySize}</div>
        </div>
        <div>
          <div className="text-slate-400 text-xs">Comparisons</div>
          <div className="text-xl font-bold text-blue-400">{comparisons}</div>
        </div>
        <div>
          <div className="text-slate-400 text-xs">Result</div>
          <div
            className={`text-xl font-bold ${
              found ? "text-emerald-400" : "text-red-400"
            }`}
          >
            {found ? "✓" : "✗"}
          </div>
        </div>
      </div>

      {/* Result Message */}
      <div className="text-center py-3">
        {found ? (
          <div className="text-emerald-400 text-lg font-bold">
            Target {target} found at index {index}
          </div>
        ) : (
          <div className="text-red-400 text-lg font-bold">
            Target {target} not found
          </div>
        )}
      </div>
    </>
  );
};
```

#### Prediction Accuracy Display

**REQUIRED:** If algorithm supports prediction mode, display accuracy statistics.

```jsx
// Accuracy calculation (works for all algorithms)
const accuracy =
  predictionStats?.total > 0
    ? Math.round((predictionStats.correct / predictionStats.total) * 100)
    : null;

// Render accuracy section
{
  predictionStats?.total > 0 && (
    <div className="bg-slate-900/50 rounded-lg p-3 border-2 border-blue-500">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-white font-bold text-sm">Prediction Accuracy</h3>
        <div className="flex items-baseline gap-1">
          <span className={`text-2xl font-bold ${getAccuracyColor(accuracy)}`}>
            {accuracy}%
          </span>
          <span className="text-slate-400 text-xs">
            ({predictionStats.correct}/{predictionStats.total})
          </span>
        </div>
      </div>

      {/* Feedback message based on accuracy */}
      <div className={`rounded px-2 py-1.5 ${getAccuracyBgColor(accuracy)}`}>
        <p className="text-xs text-center">{getAccuracyFeedback(accuracy)}</p>
      </div>
    </div>
  );
}
```

#### Fallback for Unknown Algorithms

```jsx
// Always provide a generic fallback
const renderGenericResults = () => {
  return (
    <div className="bg-slate-900/50 rounded-lg p-3 mb-4">
      <div className="text-slate-300 text-sm text-center py-4">
        Algorithm execution complete!
      </div>
    </div>
  );
};
```

**Rationale:** Last-step detection ensures the modal works for any algorithm. Algorithm-specific rendering provides meaningful results while maintaining a generic fallback.

---

## Section 2 Summary

These CONSTRAINED requirements define **design parameters with implementation flexibility**:

✅ **Backend Contract** - Standardized metadata + trace structure (extensible with algorithm-specific fields)  
✅ **Visualization Interface** - Required props (step, config), freedom in rendering approach  
✅ **Prediction Limit** - Max 3 choices (HARD), simplify questions if natural choices exceed limit  
✅ **Completion Detection** - Check last step position, not step type (algorithm-agnostic)

**Key Principle:** Follow the contract structure, but exercise creativity within bounds. Add algorithm-specific fields, customize colors/animations, and adapt questions to your algorithm's needs—just stay within the defined parameters.

---

## Section 3: REFERENCE IMPLEMENTATIONS (Model Code) 📚

This section provides **working examples** of correct implementations. Use these as templates when creating new algorithms or components.

---

### 3.1 Modal Examples

#### PredictionModal.jsx - Algorithm-Agnostic Prediction UI

**Purpose:** Render prediction questions from any algorithm without hardcoded logic.

**Key Features:**

- Smart keyboard shortcut derivation from choice labels
- Auto-advance after correct/incorrect answer
- Supports 2-3 choices (enforces HARD LIMIT)
- Algorithm-agnostic design

**Core Pattern: Shortcut Derivation**

```jsx
/**
 * Derive semantic keyboard shortcut from choice label.
 *
 * Strategy:
 * 1. Try first letter of label (if unique among choices)
 * 2. Try first letter of key words (capitalized words like "Left"/"Right")
 * 3. Fall back to number (1, 2, 3...)
 */
const deriveShortcut = (choice, allChoices, index) => {
  const label = choice.label || "";

  // Strategy 1: Try first letter
  const firstLetter = label[0]?.toUpperCase();
  if (firstLetter && /[A-Z]/.test(firstLetter)) {
    const conflicts = allChoices.filter(
      (c) => c.label[0]?.toUpperCase() === firstLetter
    );
    if (conflicts.length === 1) {
      return firstLetter;
    }
  }

  // Strategy 2: Extract key words (capitalized words in the middle)
  const words = label.match(/\b[A-Z][a-z]+/g) || [];
  for (const word of words) {
    const letter = word[0].toUpperCase();
    const conflicts = allChoices.filter((c) => {
      const otherWords = (c.label || "").match(/\b[A-Z][a-z]+/g) || [];
      return otherWords.some((w) => w[0].toUpperCase() === letter);
    });
    if (conflicts.length === 1) {
      return letter;
    }
  }

  // Strategy 3: Fall back to number
  return (index + 1).toString();
};
```

**Core Pattern: Keyboard Handling**

```jsx
useEffect(() => {
  const handleKeyPress = (event) => {
    // Ignore if already showing feedback
    if (showFeedback) return;

    // Skip shortcut (always 'S')
    if (event.key.toLowerCase() === "s") {
      event.preventDefault();
      if (onSkip) {
        onSkip();
      }
      return;
    }

    // Submit shortcut (always 'Enter')
    if (event.key === "Enter") {
      if (selected) {
        event.preventDefault();
        handleSubmit();
      }
      return;
    }

    // Dynamic choice shortcuts - match against derived shortcuts
    const pressedKey = event.key.toUpperCase();
    const choiceIndex = shortcuts.findIndex(
      (s) => s.toUpperCase() === pressedKey
    );

    if (choiceIndex !== -1) {
      event.preventDefault();
      setSelected(predictionData.choices[choiceIndex].id);
      return;
    }

    // Fallback: Accept number keys 1-9
    const numberIndex = parseInt(event.key) - 1;
    if (
      !isNaN(numberIndex) &&
      numberIndex >= 0 &&
      numberIndex < predictionData.choices.length
    ) {
      event.preventDefault();
      setSelected(predictionData.choices[numberIndex].id);
    }
  };

  window.addEventListener("keydown", handleKeyPress);
  return () => window.removeEventListener("keydown", handleKeyPress);
}, [showFeedback, onSkip, selected, predictionData, shortcuts]);
```

**Core Pattern: Dynamic Grid Layout**

```jsx
{
  /* Choice Buttons - Responsive grid based on choice count */
}
<div
  className={`grid gap-3 mb-4 ${
    choices.length <= 2
      ? "grid-cols-2" // 2 choices: side-by-side
      : choices.length === 3
      ? "grid-cols-3" // 3 choices: three columns
      : "grid-cols-2" // Fallback (should never reach if HARD LIMIT enforced)
  }`}
>
  {choices.map((choice, index) => (
    <button
      key={choice.id}
      onClick={() => setSelected(choice.id)}
      className={`py-3 px-4 rounded-lg font-medium transition-all ${
        selected === choice.id
          ? "bg-blue-500 text-white scale-105 ring-2 ring-blue-400"
          : "bg-slate-700 text-slate-300 hover:bg-slate-600"
      }`}
    >
      <div className="text-base">{choice.label}</div>
      <div className="text-xs opacity-75 mt-1">
        Press {shortcuts[index] || index + 1}
      </div>
    </button>
  ))}
</div>;
```

**Key Takeaways:**

- Shortcut derivation is fully automatic (no hardcoding)
- Modal enforces max-h-[85vh] constraint (no scrolling)
- Feedback auto-advances after 2.5 seconds
- Works for any algorithm that provides prediction_points

---

#### CompletionModal.jsx - Algorithm-Agnostic Completion UI

**Purpose:** Display algorithm results and prediction accuracy. Must work for any algorithm.

**Key Features:**

- Last-step detection (not step type)
- Algorithm-specific result rendering
- Generic fallback for unknown algorithms
- Unified prediction accuracy display

**Core Pattern: Last-Step Detection**

```jsx
const CompletionModal = ({ trace, step, onReset, predictionStats }) => {
  // FIXED: Check if we're on the last step instead of checking step type
  // This makes the modal work for ANY algorithm's final step
  const isLastStep =
    trace?.trace?.steps && step?.step === trace.trace.steps.length - 1;

  if (!isLastStep) {
    return null;
  }

  // Detect algorithm type from metadata
  const algorithm = trace?.metadata?.algorithm || "unknown";
  const isIntervalCoverage = algorithm === "interval-coverage";
  const isBinarySearch = algorithm === "binary-search";

  // Calculate accuracy (works for all algorithms)
  const accuracy =
    predictionStats?.total > 0
      ? Math.round((predictionStats.correct / predictionStats.total) * 100)
      : null;
  const feedback = accuracy !== null ? getAccuracyFeedback(accuracy) : null;

  // Render algorithm-specific completion content
  const renderAlgorithmResults = () => {
    if (isIntervalCoverage) {
      return renderIntervalCoverageResults();
    } else if (isBinarySearch) {
      return renderBinarySearchResults();
    } else {
      // Fallback for unknown algorithms
      return renderGenericResults();
    }
  };

  // ... rest of component
};
```

**Core Pattern: Algorithm-Specific Rendering**

```jsx
const renderBinarySearchResults = () => {
  const result = trace?.result || {};
  const found = result.found;
  const index = result.index;
  const comparisons = result.comparisons || 0;
  const target = trace?.metadata?.target_value;
  const arraySize = trace?.metadata?.input_size || 0;

  return (
    <>
      {/* Stats Section - 3-column grid */}
      <div className="bg-slate-900/50 rounded-lg p-3 mb-3">
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <div className="text-slate-400 text-xs mb-0.5">Array Size</div>
            <div className="text-xl font-bold text-white">{arraySize}</div>
          </div>
          <div>
            <div className="text-slate-400 text-xs mb-0.5">Comparisons</div>
            <div className="text-xl font-bold text-blue-400">{comparisons}</div>
          </div>
          <div>
            <div className="text-slate-400 text-xs mb-0.5">Result</div>
            <div
              className={`text-xl font-bold ${
                found ? "text-emerald-400" : "text-red-400"
              }`}
            >
              {found ? "✓" : "✗"}
            </div>
          </div>
        </div>
      </div>

      {/* Final Result Message */}
      <div className="bg-slate-900/50 rounded-lg p-3 mb-4">
        <div className="text-slate-300 font-semibold mb-2 text-xs">
          Search Result:
        </div>
        <div className="text-center py-3">
          {found ? (
            <div>
              <div className="text-emerald-400 text-lg font-bold mb-1">
                Target {target} found at index {index}
              </div>
              <div className="text-slate-400 text-sm">
                Found in {comparisons} comparison{comparisons !== 1 ? "s" : ""}
              </div>
            </div>
          ) : (
            <div>
              <div className="text-red-400 text-lg font-bold mb-1">
                Target {target} not found
              </div>
              <div className="text-slate-400 text-sm">
                Searched through {comparisons} comparison
                {comparisons !== 1 ? "s" : ""}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
```

**Core Pattern: Generic Fallback**

```jsx
const renderGenericResults = () => {
  return (
    <div className="bg-slate-900/50 rounded-lg p-3 mb-4">
      <div className="text-slate-300 text-sm text-center py-4">
        Algorithm execution complete!
      </div>
    </div>
  );
};
```

**Key Takeaways:**

- Never hardcode step types for completion detection
- Always provide a generic fallback
- Use grid layouts to fit results in max-h-[85vh]
- Prediction accuracy display works for all algorithms

---

### 3.2 Visualization Examples

#### ArrayView.jsx - Array Visualization with Permanent Overflow Fix

**Purpose:** Visualize array-based algorithms (Binary Search, Sorting).

**Key Features:**

- **PERMANENT FIX** for overflow cutoff bug (items-start + mx-auto)
- State-based element styling
- Pointer indicators
- Responsive to viewport size

**Core Pattern: Overflow Handling (CRITICAL)**

```jsx
const ArrayView = ({ step, config = {} }) => {
  const visualization = step?.data?.visualization;

  if (!visualization || !visualization.array) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        No array data available
      </div>
    );
  }

  const { array, pointers, search_space_size } = visualization;

  return (
    // PERMANENT FIX: Use items-start + mx-auto pattern instead of items-center
    // This prevents flex centering from cutting off left overflow
    <div className="h-full flex flex-col items-start overflow-auto py-4 px-6">
      <div className="mx-auto flex flex-col items-center gap-6 min-h-0">
        {/* Target indicator */}
        {pointers.target !== null && pointers.target !== undefined && (
          <div className="px-4 py-2 bg-green-900/30 border border-green-600/50 rounded-lg flex-shrink-0">
            <span className="text-green-400 font-semibold">
              🎯 Target:{" "}
              <span className="text-white text-lg font-bold">
                {pointers.target}
              </span>
            </span>
          </div>
        )}

        {/* Array visualization */}
        <div className="flex flex-col items-center flex-shrink-0">
          {/* Index labels (top) */}
          <div className="flex gap-2 mb-2">
            {array.map((element) => (
              <div
                key={element.index}
                className="w-16 text-center text-gray-400 text-xs font-mono flex-shrink-0"
              >
                [{element.index}]
              </div>
            ))}
          </div>

          {/* Array elements */}
          <div className="flex gap-2">
            {array.map((element) => (
              <div
                key={element.index}
                className={getElementClasses(element)}
                title={`Index ${element.index}: ${element.value} (${element.state})`}
              >
                {element.value}
              </div>
            ))}
          </div>

          {/* Pointer indicators (bottom) */}
          {renderPointers()}
        </div>

        {/* State legend */}
        <div className="flex flex-wrap gap-4 text-xs justify-center flex-shrink-0">
          {/* Legend items */}
        </div>
      </div>
    </div>
  );
};
```

**Core Pattern: State-Based Styling**

```jsx
// Map element states to Tailwind classes
const getElementClasses = (element) => {
  const baseClasses =
    "w-16 h-16 flex items-center justify-center rounded-lg font-bold text-lg transition-all duration-300 border-2 flex-shrink-0";

  switch (element.state) {
    case "examining":
      return `${baseClasses} bg-yellow-500 border-yellow-400 text-black scale-110 shadow-lg animate-pulse`;
    case "found":
      return `${baseClasses} bg-green-500 border-green-400 text-white scale-110 shadow-lg`;
    case "active_range":
      return `${baseClasses} bg-blue-600 border-blue-500 text-white`;
    case "excluded":
      return `${baseClasses} bg-gray-700 border-gray-600 text-gray-500 opacity-50`;
    default:
      return `${baseClasses} bg-slate-600 border-slate-500 text-white`;
  }
};
```

**Core Pattern: Pointer Rendering**

```jsx
const renderPointers = () => {
  const pointerIcons = [];

  if (pointers.left !== null && pointers.left !== undefined) {
    pointerIcons.push({
      index: pointers.left,
      label: "L",
      color: "text-blue-400",
      bgColor: "bg-blue-900/50",
    });
  }

  if (pointers.right !== null && pointers.right !== undefined) {
    pointerIcons.push({
      index: pointers.right,
      label: "R",
      color: "text-red-400",
      bgColor: "bg-red-900/50",
    });
  }

  if (pointers.mid !== null && pointers.mid !== undefined) {
    pointerIcons.push({
      index: pointers.mid,
      label: "M",
      color: "text-yellow-400",
      bgColor: "bg-yellow-900/50",
    });
  }

  return (
    <div className="flex gap-2 mt-2">
      {array.map((element, idx) => (
        <div
          key={idx}
          className="w-16 h-8 flex flex-col items-center justify-end flex-shrink-0"
        >
          {pointerIcons
            .filter((p) => p.index === element.index)
            .map((pointer, pIdx) => (
              <div
                key={pIdx}
                className={`px-2 py-0.5 rounded text-xs font-bold ${pointer.color} ${pointer.bgColor} mb-0.5`}
              >
                {pointer.label}
              </div>
            ))}
        </div>
      ))}
    </div>
  );
};
```

**Key Takeaways:**

- **ALWAYS use items-start + mx-auto for scrollable content** (see Section 1.6)
- Use flex-shrink-0 on elements to prevent squishing
- Provide graceful fallback for missing data
- Use transitions for smooth state changes

---

#### TimelineView.jsx - Timeline Visualization (Interval Coverage)

**Purpose:** Visualize timeline-based algorithms (Interval Coverage).

**Key Features:**

- Horizontal timeline with intervals
- Hover interactions
- Color-coded intervals
- State-based styling (examining, kept, covered)

**Core Pattern: Timeline Rendering**

```jsx
const TimelineView = ({ step, highlightedIntervalId, onIntervalHover }) => {
  const visualization = step?.data?.visualization;

  if (!visualization || !visualization.all_intervals) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        No timeline data available
      </div>
    );
  }

  const { all_intervals } = visualization;

  // Calculate timeline bounds
  const minStart = Math.min(...all_intervals.map((i) => i.start));
  const maxEnd = Math.max(...all_intervals.map((i) => i.end));
  const timelineRange = maxEnd - minStart;

  return (
    <div className="h-full flex flex-col items-start overflow-auto p-6">
      <div className="mx-auto w-full max-w-4xl">
        {/* Timeline axis */}
        <div className="relative h-12 bg-slate-700 rounded mb-4">
          {/* Tick marks */}
        </div>

        {/* Intervals */}
        <div className="space-y-3">
          {all_intervals.map((interval) => {
            const leftPercent =
              ((interval.start - minStart) / timelineRange) * 100;
            const widthPercent =
              ((interval.end - interval.start) / timelineRange) * 100;

            return (
              <div
                key={interval.id}
                className="relative h-16"
                onMouseEnter={() => onIntervalHover?.(interval.id)}
                onMouseLeave={() => onIntervalHover?.(null)}
              >
                <div
                  className={`absolute h-12 rounded-lg transition-all duration-300 ${getIntervalClasses(
                    interval,
                    highlightedIntervalId
                  )}`}
                  style={{
                    left: `${leftPercent}%`,
                    width: `${widthPercent}%`,
                  }}
                >
                  <div className="flex items-center justify-center h-full text-white font-bold">
                    ({interval.start}, {interval.end})
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
```

**Core Pattern: Interval Styling**

```jsx
const getIntervalClasses = (interval, highlightedId) => {
  const colors = getIntervalColor(interval.color);
  const isHighlighted = interval.id === highlightedId;

  let classes = `${colors.bg} ${colors.border} border-2 ${colors.text}`;

  // State-based styling
  if (interval.state === "examining") {
    classes += " scale-105 shadow-xl ring-4 ring-yellow-400";
  } else if (interval.state === "covered") {
    classes += " opacity-50";
  }

  // Hover highlight
  if (isHighlighted) {
    classes += " scale-105 shadow-xl";
  }

  return classes;
};
```

**Key Takeaways:**

- Use percentage-based positioning for responsive timelines
- Support hover interactions for better UX
- Use items-start + mx-auto pattern for overflow
- Provide clear visual feedback for current state

---

#### CallStackView.jsx - Call Stack Visualization

**Purpose:** Visualize recursive call stack (Interval Coverage, DFS, etc.).

**Key Features:**

- Auto-scroll to active call
- Depth-based indentation
- Hover interactions
- Ref management for auto-scroll

**Core Pattern: Auto-Scroll Implementation**

```jsx
const CallStackView = ({ step, activeCallRef, onIntervalHover }) => {
  const callStack = step?.data?.visualization?.call_stack_state || [];

  // Auto-scroll to active call when step changes
  useEffect(() => {
    if (activeCallRef?.current) {
      activeCallRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [step?.step, activeCallRef]);

  return (
    <div className="space-y-2">
      {callStack.map((call, index) => (
        <div
          key={call.id}
          id={call.is_active ? "step-current" : undefined}
          ref={call.is_active ? activeCallRef : null}
          className={`p-3 rounded-lg border-2 transition-all duration-300 ${
            call.is_active
              ? "bg-yellow-500/20 border-yellow-500 shadow-lg"
              : "bg-slate-700/50 border-slate-600"
          }`}
          style={{ marginLeft: `${call.depth * 12}px` }}
          onMouseEnter={() => onIntervalHover?.(call.interval?.id)}
          onMouseLeave={() => onIntervalHover?.(null)}
        >
          <div className="text-white text-sm font-mono">
            examine({call.interval.start}, {call.interval.end})
          </div>
          {call.is_active && (
            <div className="text-yellow-400 text-xs mt-1">← Current</div>
          )}
        </div>
      ))}
    </div>
  );
};
```

**Key Takeaways:**

- Use ref + scrollIntoView for auto-scroll behavior
- Apply #step-current ID to active element only
- Use depth-based indentation for visual hierarchy
- Sync hover state with timeline visualization

---

### 3.3 Common Patterns

#### useTraceNavigation Hook - Navigation Logic

**Purpose:** Centralize trace navigation logic (next, prev, reset, jump).

**Core Pattern:**

```javascript
export const useTraceNavigation = (trace, resetPredictionStats) => {
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = trace?.trace?.steps?.length || 0;

  // Reset currentStep when trace changes (algorithm switch)
  useEffect(() => {
    setCurrentStep(0);
    // Also reset prediction stats when switching algorithms
    if (resetPredictionStats) {
      resetPredictionStats();
    }
  }, [trace, resetPredictionStats]);

  const nextStep = useCallback(() => {
    if (totalSteps > 0 && currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  }, [totalSteps, currentStep]);

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  const jumpToEnd = useCallback(() => {
    if (totalSteps > 0) {
      setCurrentStep(totalSteps - 1);
    }
  }, [totalSteps]);

  const resetTrace = useCallback(() => {
    setCurrentStep(0);
    if (resetPredictionStats) {
      resetPredictionStats();
    }
  }, [resetPredictionStats]);

  const currentStepData = useMemo(
    () => trace?.trace?.steps?.[currentStep],
    [trace, currentStep]
  );

  const isComplete = currentStepData?.type === "ALGORITHM_COMPLETE";

  return {
    currentStep,
    currentStepData,
    totalSteps,
    nextStep,
    prevStep,
    resetTrace,
    jumpToEnd,
    isComplete,
    setCurrentStep, // Exposed for keyboard shortcuts/prediction logic
  };
};
```

**Key Takeaways:**

- Reset step on trace change (algorithm switch)
- Use useCallback to prevent unnecessary re-renders
- Expose setCurrentStep for advanced use cases
- Memoize currentStepData for performance

---

#### useKeyboardShortcuts Hook - Keyboard Handling

**Purpose:** Global keyboard shortcuts for navigation.

**Core Pattern:**

```javascript
export const useKeyboardShortcuts = ({
  onNext,
  onPrev,
  onReset,
  onJumpToEnd,
  isComplete,
  modalOpen,
}) => {
  useEffect(() => {
    const handleKeyPress = (event) => {
      // Ignore if modal is open (modals handle their own shortcuts)
      if (modalOpen) return;

      // Ignore if user is typing in an input field
      if (
        event.target.tagName === "INPUT" ||
        event.target.tagName === "TEXTAREA"
      ) {
        return;
      }

      switch (event.key) {
        case "ArrowRight":
          event.preventDefault();
          if (!isComplete) {
            onNext();
          }
          break;
        case "ArrowLeft":
          event.preventDefault();
          onPrev();
          break;
        case " ": // Space
          event.preventDefault();
          // Toggle mode logic (handled by parent)
          break;
        case "r":
        case "R":
          event.preventDefault();
          onReset();
          break;
        default:
        // No action
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [onNext, onPrev, onReset, isComplete, modalOpen]);
};
```

**Key Takeaways:**

- Check for modal state before handling shortcuts
- Ignore shortcuts when typing in input fields
- Prevent default browser behavior for arrow keys
- Clean up event listeners on unmount

---

#### Dynamic Visualization Registry

**Purpose:** Map visualization types to React components dynamically.

**Core Pattern:**

```javascript
// utils/visualizationRegistry.js
import TimelineView from "../components/visualizations/TimelineView";
import ArrayView from "../components/visualizations/ArrayView";

const VISUALIZATION_REGISTRY = {
  timeline: TimelineView,
  array: ArrayView,
  // Future: graph, tree, matrix
};

export const getVisualizationComponent = (type) => {
  return VISUALIZATION_REGISTRY[type] || TimelineView; // Fallback to timeline
};

// Usage in App.jsx:
const visualizationType = trace?.metadata?.visualization_type || "timeline";
const MainVisualizationComponent = getVisualizationComponent(visualizationType);

<MainVisualizationComponent
  step={currentStep}
  config={trace?.metadata?.visualization_config || {}}
/>;
```

**Key Takeaways:**

- Centralize visualization component mapping
- Always provide a fallback component
- Easy to extend with new visualization types
- Type comes from backend metadata

---

## Section 3 Summary

These REFERENCE IMPLEMENTATIONS provide **working examples** of correct patterns:

✅ **PredictionModal** - Smart shortcut derivation, auto-advance, max 3 choices  
✅ **CompletionModal** - Last-step detection, algorithm-specific rendering, generic fallback  
✅ **ArrayView** - PERMANENT overflow fix (items-start + mx-auto), state-based styling  
✅ **TimelineView** - Percentage positioning, hover interactions, responsive design  
✅ **CallStackView** - Auto-scroll with refs, depth indentation, hover sync  
✅ **useTraceNavigation** - Centralized navigation, trace reset on algorithm switch  
✅ **useKeyboardShortcuts** - Global shortcuts, modal awareness, input field handling  
✅ **Visualization Registry** - Dynamic component selection, fallback handling

**Use these as templates when implementing new algorithms or components.** Copy the patterns, adapt to your algorithm's needs, and maintain consistency with the platform's design principles.

---

# Tenant Guide v1.0 - Algorithm Visualization Platform

**Document Purpose:** This guide establishes the "constitutional framework" for frontend development in the Algorithm Visualization Platform. It defines what is LOCKED (non-negotiable), CONSTRAINED (limited freedom), and FREE (full developer autonomy).

**Target Audience:** Frontend developers, LLM code generators, and contributors implementing new algorithms or UI features.

**Last Updated:** December 11, 2025 (Session 15)

## Section 3: REFERENCE IMPLEMENTATIONS (Model Code) 📚

This section provides **working examples** of correct implementations. Use these as templates when creating new algorithms or components.

## Section 4: FREE IMPLEMENTATION CHOICES 🚀

These elements are **entirely up to the developer**. Choose what works best for your use case, team preferences, and performance requirements.

---

### 4.1 Component Architecture

**You have full freedom to choose:**

#### File Organization

```
frontend/src/
├── components/          # ✅ Your choice: flat vs nested
│   ├── modals/         # Option 1: Group by type
│   ├── visualizations/ # Option 2: Group by feature
│   └── common/         # Option 3: Mix and match
├── hooks/              # ✅ Your choice: location and naming
├── utils/              # ✅ Your choice: helpers organization
└── contexts/           # ✅ Your choice: use or don't use
```

**Recommended (not required):**

- Group visualization components together (`components/visualizations/`)
- Separate custom hooks from components (`hooks/`)
- Keep utilities separate from business logic (`utils/`)

#### Component Patterns

```jsx
// ✅ ALLOWED: Functional components with hooks (recommended)
const MyComponent = ({ prop1, prop2 }) => {
  const [state, setState] = useState(null);
  return <div>...</div>;
};

// ✅ ALLOWED: Class components (if you prefer)
class MyComponent extends React.Component {
  state = { value: null };
  render() {
    return <div>...</div>;
  }
}

// ✅ ALLOWED: Custom hooks for logic reuse
const useCustomLogic = () => {
  const [data, setData] = useState(null);
  // ... logic
  return { data, setData };
};

// ✅ ALLOWED: Higher-order components
const withLogging = (Component) => {
  return (props) => {
    console.log("Rendering:", Component.name);
    return <Component {...props} />;
  };
};
```

#### Code Splitting

```jsx
// ✅ ALLOWED: React.lazy for code splitting
const HeavyComponent = React.lazy(() => import("./HeavyComponent"));

<Suspense fallback={<Loading />}>
  <HeavyComponent />
</Suspense>;

// ✅ ALLOWED: Dynamic imports
const loadModule = async () => {
  const module = await import("./module");
  return module.default;
};
```

---

### 4.2 State Management

**You have full freedom to choose:**

#### Built-in React State

```jsx
// ✅ ALLOWED: useState for local state
const [count, setCount] = useState(0);

// ✅ ALLOWED: useReducer for complex state
const [state, dispatch] = useReducer(reducer, initialState);

// ✅ ALLOWED: useContext for shared state
const ThemeContext = React.createContext();
const theme = useContext(ThemeContext);
```

#### External State Libraries

```jsx
// ✅ ALLOWED: Redux (if you need global state)
import { useSelector, useDispatch } from "react-redux";
const data = useSelector((state) => state.data);

// ✅ ALLOWED: Zustand (lightweight alternative)
import create from "zustand";
const useStore = create((set) => ({
  bears: 0,
  increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
}));

// ✅ ALLOWED: MobX, Recoil, Jotai, or any other library
```

**Current Implementation:** Uses built-in React hooks (useState, useReducer, useContext). Works well for current scope.

**When to Consider External Libraries:**

- Multiple algorithms need to share state across unrelated components
- Time-travel debugging would be valuable
- You're comfortable with the added complexity

---

### 4.3 Performance Optimizations

**You have full freedom to implement:**

#### Memoization

```jsx
// ✅ ALLOWED: React.memo for component memoization
const ExpensiveComponent = React.memo(({ data }) => {
  return <div>{/* expensive render */}</div>;
});

// ✅ ALLOWED: useMemo for expensive calculations
const sortedArray = useMemo(() => {
  return array.sort((a, b) => a - b);
}, [array]);

// ✅ ALLOWED: useCallback for function memoization
const handleClick = useCallback(() => {
  console.log("clicked");
}, []);
```

#### Virtualization

```jsx
// ✅ ALLOWED: React Virtual for long lists
import { useVirtual } from "react-virtual";

// ✅ ALLOWED: React Window for large datasets
import { FixedSizeList } from "react-window";
```

#### Code Splitting

```jsx
// ✅ ALLOWED: Route-based splitting
const Home = lazy(() => import("./routes/Home"));
const About = lazy(() => import("./routes/About"));

// ✅ ALLOWED: Component-based splitting
const HeavyChart = lazy(() => import("./components/HeavyChart"));
```

**Recommended (not required):**

- Profile before optimizing (React DevTools Profiler)
- Focus on components that re-render frequently
- Consider virtualization if step count exceeds 100

---

### 4.4 Testing Strategies

**You have full freedom to choose:**

#### Testing Frameworks

```javascript
// ✅ ALLOWED: Jest + React Testing Library (recommended)
import { render, screen } from "@testing-library/react";

test("renders component", () => {
  render(<MyComponent />);
  expect(screen.getByText("Hello")).toBeInTheDocument();
});

// ✅ ALLOWED: Vitest (faster alternative to Jest)
import { expect, test } from "vitest";

// ✅ ALLOWED: Cypress for E2E
cy.visit("/");
cy.get("#panel-visualization").should("be.visible");

// ✅ ALLOWED: Playwright for E2E
await page.goto("/");
await expect(page.locator("#panel-visualization")).toBeVisible();
```

#### Testing Approaches

```javascript
// ✅ ALLOWED: Unit tests for hooks
test("useTraceNavigation returns correct step", () => {
  const { result } = renderHook(() => useTraceNavigation(mockTrace));
  expect(result.current.currentStep).toBe(0);
});

// ✅ ALLOWED: Integration tests for components
test("PredictionModal handles answer submission", () => {
  render(<PredictionModal predictionData={mockPrediction} onAnswer={mockFn} />);
  fireEvent.click(screen.getByText("Search Left"));
  expect(mockFn).toHaveBeenCalledWith("search-left");
});

// ✅ ALLOWED: E2E tests for workflows
test("complete algorithm trace workflow", () => {
  // Navigate through entire trace
  // Verify completion modal appears
});
```

**Current Implementation:** Basic unit tests for hooks. Expand as needed.

**Recommended (not required):**

- Test critical user paths (navigation, prediction flow)
- Test LOCKED requirements (keyboard shortcuts, auto-scroll)
- Mock API calls for consistent tests

---

### 4.5 Animation Libraries

**You have full freedom to choose:**

```jsx
// ✅ ALLOWED: CSS transitions (current approach, simplest)
<div className="transition-all duration-300 hover:scale-105">{content}</div>;

// ✅ ALLOWED: Framer Motion (powerful, declarative)
import { motion } from "framer-motion";
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
>
  {content}
</motion.div>;

// ✅ ALLOWED: React Spring (physics-based)
import { useSpring, animated } from "react-spring";
const props = useSpring({ opacity: 1, from: { opacity: 0 } });
<animated.div style={props}>{content}</animated.div>;

// ✅ ALLOWED: GSAP (timeline-based)
import gsap from "gsap";
useEffect(() => {
  gsap.to(".element", { x: 100, duration: 1 });
}, []);
```

**Current Implementation:** Tailwind CSS transitions. Works well for current needs.

**When to Consider Animation Libraries:**

- Complex multi-step animations (array swaps, graph traversals)
- Physics-based animations (spring effects, momentum)
- Timeline control (pause, reverse, scrub animations)

---

### 4.6 Styling Approaches

**You have full freedom to choose:**

```jsx
// ✅ ALLOWED: Tailwind utility classes (current approach)
<div className="bg-slate-800 p-4 rounded-lg shadow-xl">
  {content}
</div>

// ✅ ALLOWED: CSS Modules
import styles from './Component.module.css';
<div className={styles.container}>{content}</div>

// ✅ ALLOWED: Styled Components
import styled from 'styled-components';
const Container = styled.div`
  background: #1e293b;
  padding: 1rem;
`;

// ✅ ALLOWED: Emotion
import { css } from '@emotion/react';
<div css={css`background: #1e293b;`}>{content}</div>

// ✅ ALLOWED: Plain CSS
<div className="my-container">{content}</div>
```

**Current Implementation:** Tailwind CSS. Provides rapid development and consistency.

**Recommendation:** Stick with Tailwind unless you have strong reasons to switch. It integrates well with the design system.

---

### 4.7 Build Tools & Bundlers

**You have full freedom to choose:**

```javascript
// ✅ ALLOWED: Create React App (current, zero config)
// ✅ ALLOWED: Vite (faster builds, modern ESM)
// ✅ ALLOWED: Next.js (if you need SSR/SSG)
// ✅ ALLOWED: Parcel (zero config alternative)
// ✅ ALLOWED: Custom Webpack config
```

**Current Implementation:** Create React App with `pnpm`.

**When to Consider Alternatives:**

- Vite: If build times become slow (CRA can be slow for large apps)
- Next.js: If you need server-side rendering or static generation
- Custom Webpack: If you need very specific build customizations

---

### 4.8 Linting & Formatting

**You have full freedom to choose:**

```javascript
// ✅ ALLOWED: ESLint (recommended)
// .eslintrc.js
module.exports = {
  extends: ['react-app', 'plugin:prettier/recommended'],
  rules: {
    'no-unused-vars': 'warn',
  },
};

// ✅ ALLOWED: Prettier (recommended)
// .prettierrc
{
  "semi": true,
  "singleQuote": false,
  "tabWidth": 2
}

// ✅ ALLOWED: No linting (not recommended, but allowed)
```

**Recommendation:** Use ESLint + Prettier for consistency and to catch common errors.

---

### 4.9 Git Workflow

**You have full freedom to choose:**

```bash
# ✅ ALLOWED: Feature branches
git checkout -b feature/new-algorithm

# ✅ ALLOWED: Git Flow
git flow feature start new-algorithm

# ✅ ALLOWED: Trunk-based development
git checkout main
git pull
# Make changes
git commit -m "Add new algorithm"
git push

# ✅ ALLOWED: Conventional commits
git commit -m "feat(binary-search): add default example"
git commit -m "fix(array-view): prevent overflow cutoff"
```

**Current Approach:** Feature branches with descriptive commit messages.

---

## Section 4 Summary

These FREE choices are **entirely up to you**:

🚀 **Component Architecture** - File organization, patterns, code splitting  
🚀 **State Management** - Built-in hooks, Redux, Zustand, MobX, etc.  
🚀 **Performance** - Memoization, virtualization, lazy loading  
🚀 **Testing** - Jest, Vitest, Cypress, Playwright, testing strategies  
🚀 **Animation** - CSS transitions, Framer Motion, React Spring, GSAP  
🚀 **Styling** - Tailwind (current), CSS Modules, Styled Components, Emotion  
🚀 **Build Tools** - CRA (current), Vite, Next.js, custom Webpack  
🚀 **Linting** - ESLint, Prettier, custom rules  
🚀 **Git Workflow** - Feature branches, Git Flow, trunk-based

**Key Principle:** Choose what works best for your team and project needs. The only requirement is that your choices must not violate LOCKED or CONSTRAINED requirements.

---

## Appendix A: Quick Reference

### Checklist for New Algorithms

Use this checklist when implementing a new algorithm:

#### Backend Implementation

- [ ] **Create Tracer Class** - Inherit from `AlgorithmTracer`
- [ ] **Implement Required Methods:**
  - [ ] `_get_visualization_state()` - Return current visualization data
  - [ ] `execute(input_data)` - Run algorithm, add steps
  - [ ] `get_prediction_points()` - Define prediction questions (optional)
- [ ] **Define Metadata:**
  - [ ] `algorithm` - Unique identifier (e.g., "merge-sort")
  - [ ] `display_name` - Human-readable name
  - [ ] `visualization_type` - "array" | "timeline" | "graph" | "tree"
  - [ ] `input_size` - Number of elements/nodes
- [ ] **Test Tracer:**
  - [ ] Run tracer with sample input
  - [ ] Verify trace structure
  - [ ] Check visualization data completeness
- [ ] **Register Algorithm:**
  - [ ] Add to `registry.py`
  - [ ] Verify `/api/algorithms` returns new algorithm

#### Frontend Implementation

- [ ] **Create/Select Visualization Component:**
  - [ ] Use existing component (ArrayView, TimelineView), OR
  - [ ] Create new component following interface (step, config props)
- [ ] **Register Visualization Type** (if new):
  - [ ] Add to `visualizationRegistry.js`
  - [ ] Map `visualization_type` to component
- [ ] **Test Visualization:**
  - [ ] Load algorithm trace
  - [ ] Verify visualization renders
  - [ ] Check overflow handling (items-start + mx-auto)
  - [ ] Test responsive behavior
- [ ] **Test Prediction Mode** (if implemented):
  - [ ] Verify ≤3 choices per question
  - [ ] Test keyboard shortcuts
  - [ ] Check feedback display
  - [ ] Verify accuracy tracking
- [ ] **Test Completion Modal:**
  - [ ] Verify modal appears on last step
  - [ ] Check algorithm-specific results
  - [ ] Verify prediction accuracy display
- [ ] **Test Navigation:**
  - [ ] Arrow keys work
  - [ ] Auto-scroll works (#step-current)
  - [ ] Reset returns to step 0
  - [ ] Algorithm switch resets state

#### Quality Assurance

- [ ] **LOCKED Requirements Check:**
  - [ ] Modal fits in max-h-[85vh] (no scrolling)
  - [ ] Panel layout uses 3:1.5 ratio
  - [ ] Required HTML IDs present
  - [ ] Keyboard shortcuts work
  - [ ] Auto-scroll implemented
  - [ ] Overflow uses correct pattern (items-start + mx-auto)
- [ ] **CONSTRAINED Requirements Check:**
  - [ ] Backend contract followed (metadata + trace structure)
  - [ ] Visualization component follows interface
  - [ ] Prediction questions ≤3 choices
  - [ ] Completion modal uses last-step detection
- [ ] **User Experience:**
  - [ ] Visualization is clear and informative
  - [ ] Step descriptions are helpful
  - [ ] Prediction questions are meaningful
  - [ ] No regressions in existing algorithms

---

### Common Pitfalls (Anti-Patterns)

#### ❌ PITFALL 1: Flex Centering + Overflow

**Problem:** Using `items-center` + `overflow-auto` causes content cutoff.

```jsx
// ❌ WRONG
<div className="flex items-center overflow-auto">
  {/* Wide content gets cut off on left */}
</div>

// ✅ CORRECT
<div className="flex items-start overflow-auto">
  <div className="mx-auto">
    {/* Content fully scrollable */}
  </div>
</div>
```

**Why it matters:** This bug occurred 3 times. See Section 1.6 for full explanation.

---

#### ❌ PITFALL 2: Hardcoded Step Types in Completion Detection

**Problem:** Checking step type instead of step position breaks other algorithms.

```jsx
// ❌ WRONG
if (step?.type === "ALGORITHM_COMPLETE") {
  // Only works for one algorithm
}

// ✅ CORRECT
const isLastStep =
  trace?.trace?.steps && step?.step === trace.trace.steps.length - 1;
```

**Why it matters:** Different algorithms use different completion step types.

---

#### ❌ PITFALL 3: More Than 3 Prediction Choices

**Problem:** Violates HARD LIMIT, causes modal overflow and shortcut conflicts.

```python
# ❌ WRONG
prediction_point = {
    "choices": [
        {"id": "n1", "label": "Node 1"},
        {"id": "n2", "label": "Node 2"},
        {"id": "n3", "label": "Node 3"},
        {"id": "n4", "label": "Node 4"}  # 4 choices - VIOLATES LIMIT
    ]
}

# ✅ CORRECT - Simplify question
prediction_point = {
    "question": "Will the search succeed?",
    "choices": [
        {"id": "yes", "label": "Yes"},
        {"id": "no", "label": "No"},
        {"id": "maybe", "label": "Not enough info"}
    ]  # 3 choices ✓
}
```

**Why it matters:** This is a pedagogical tool, not a quiz app. See Section 2.3.

---

#### ❌ PITFALL 4: Missing Required HTML IDs

**Problem:** Auto-scroll breaks, testing fails, accessibility suffers.

```jsx
// ❌ WRONG - No IDs
<div className="visualization-panel">
  {/* Missing #panel-visualization */}
</div>

// ✅ CORRECT
<div id="panel-visualization" className="flex-[3]">
  {/* ID enables testing, debugging, accessibility */}
</div>
```

**Why it matters:** IDs are required for core functionality. See Section 1.3.

---

#### ❌ PITFALL 5: Violating Panel Layout Ratio

**Problem:** Breaks visual hierarchy, reduces visualization space.

```jsx
// ❌ WRONG
<div className="flex-[1]">Visualization</div>  {/* Too small */}
<div className="flex-[1]">Steps</div>

// ✅ CORRECT
<div className="flex-[3]">Visualization</div>  {/* 66% width */}
<div className="w-96">Steps</div>              {/* 384px fixed */}
```

**Why it matters:** Visualization is the primary focus. See Section 1.2.

---

#### ❌ PITFALL 6: Modal Scrolling

**Problem:** Violates viewport constraint, creates poor UX.

```jsx
// ❌ WRONG
<div className="max-h-[90vh] overflow-y-auto">
  {/* Long content requiring scroll */}
</div>

// ✅ CORRECT
<div className="max-h-[85vh]">
  <div className="grid grid-cols-3 gap-3 text-xs">
    {/* Compact content that fits */}
  </div>
</div>
```

**Why it matters:** Modals should be part of current view, not standalone windows. See Section 1.1.

---

#### ❌ PITFALL 7: Ignoring Visualization Data Contract

**Problem:** Frontend breaks when algorithm changes visualization structure.

```python
# ❌ WRONG - Custom structure
step_data = {
    "my_custom_array": [...],  # Frontend doesn't know this key
    "my_pointers": {...}
}

# ✅ CORRECT - Follow contract
step_data = {
    "visualization": {  # Standard key
        "array": [...],
        "pointers": {...}
    }
}
```

**Why it matters:** Contract enables algorithm-agnostic frontend. See Section 2.1.

---

### Debugging Tips

#### Issue: Auto-Scroll Not Working

**Check:**

1. Does active element have `id="step-current"`?
2. Is `activeCallRef` assigned to active element?
3. Is `scrollIntoView()` called on step change?
4. Is element inside a scrollable container?

**Solution:**

```jsx
// Ensure ref is assigned
<div
  id={isActive ? "step-current" : undefined}
  ref={isActive ? activeCallRef : null}
>

// Ensure scroll is triggered
useEffect(() => {
  activeCallRef.current?.scrollIntoView({
    behavior: 'smooth',
    block: 'center'
  });
}, [currentStep]);
```

---

#### Issue: Content Cut Off on Left

**Check:**

1. Is parent using `items-center` + `overflow-auto`?
2. Is content wider than viewport?

**Solution:**

```jsx
// Replace items-center with items-start + mx-auto
<div className="flex items-start overflow-auto">
  <div className="mx-auto">{/* Content */}</div>
</div>
```

See Section 1.6 for full explanation.

---

#### Issue: Keyboard Shortcuts Not Working

**Check:**

1. Is modal open? (Modals handle their own shortcuts)
2. Is user typing in an input field?
3. Is event listener registered on window?
4. Is event.preventDefault() called?

**Solution:**

```jsx
useEffect(() => {
  const handleKeyPress = (event) => {
    if (modalOpen) return;
    if (event.target.tagName === "INPUT") return;

    if (event.key === "ArrowRight") {
      event.preventDefault(); // Prevent browser scroll
      onNext();
    }
  };

  window.addEventListener("keydown", handleKeyPress);
  return () => window.removeEventListener("keydown", handleKeyPress);
}, [modalOpen, onNext]);
```

---

#### Issue: Prediction Modal Shows 4+ Choices

**Check:**

1. Does backend return >3 choices?
2. Is question too specific?

**Solution:**

```python
# Simplify question to 2-3 choices
# See Section 2.3 for strategies
```

---

#### Issue: Completion Modal Doesn't Appear

**Check:**

1. Is detection using last-step check (not step type)?
2. Is `trace?.trace?.steps` defined?
3. Is current step index correct?

**Solution:**

```jsx
// Use position-based detection
const isLastStep =
  trace?.trace?.steps && step?.step === trace.trace.steps.length - 1;
```

---

## Appendix B: LLM Prompt Templates

### Template 1: New Algorithm Backend Implementation

```markdown
You are implementing a new algorithm tracer for the Algorithm Visualization Platform.

CRITICAL CONSTRAINTS (DO NOT VIOLATE):

1. Inherit from AlgorithmTracer base class
2. Follow backend JSON contract (Section 2.1)
3. Return metadata with: algorithm, display_name, visualization_type, input_size
4. Include visualization data in every step's data.visualization field
5. If adding predictions: max 3 choices per question (HARD LIMIT)

REFERENCE IMPLEMENTATIONS:

- Binary Search: backend/algorithms/binary_search.py
- Interval Coverage: backend/algorithms/interval_coverage.py

TASK:
Implement {AlgorithmName} tracer that:

- Uses visualization_type: {array|timeline|graph|tree}
- Tracks {describe algorithm state}
- Provides {X} prediction points (each with ≤3 choices)

Follow the contract exactly. Do not invent custom structures.
```

---

### Template 2: New Visualization Component

```markdown
You are creating a visualization component for the Algorithm Visualization Platform.

CRITICAL CONSTRAINTS (DO NOT VIOLATE):

1. Accept props: step, config
2. Extract visualization data from step.data.visualization
3. Use items-start + mx-auto pattern for overflow (Section 1.6)
4. Provide graceful fallback for missing data
5. Use Tailwind CSS utility classes (current styling approach)

REFERENCE IMPLEMENTATIONS:

- ArrayView: frontend/src/components/visualizations/ArrayView.jsx
- TimelineView: frontend/src/components/visualizations/TimelineView.jsx

ANTI-PATTERNS (NEVER USE):

- items-center + overflow-auto (causes content cutoff)
- Hardcoded visualization types in component
- Missing null checks for data

TASK:
Create {ComponentName} for visualization_type: {type}
Expected data structure:
{paste expected visualization structure}

Follow ArrayView.jsx overflow pattern exactly (lines 111-112).
```

---

### Template 3: Full Algorithm Integration

```markdown
You are adding {AlgorithmName} to the Algorithm Visualization Platform.

LOCKED REQUIREMENTS (MANDATORY):

1. Modals: max-h-[85vh], no scrolling
2. Panel layout: flex-[3] for viz, w-96 for steps
3. HTML IDs: #panel-visualization, #panel-steps, #step-current
4. Keyboard shortcuts: Arrow keys, Space, R, Enter, S
5. Auto-scroll: scrollIntoView({ behavior: 'smooth', block: 'center' })
6. Overflow: items-start + mx-auto pattern (Section 1.6)

CONSTRAINED REQUIREMENTS (FOLLOW CONTRACT):

1. Backend metadata: algorithm, display_name, visualization_type, input_size
2. Trace structure: steps array with visualization data
3. Prediction limit: Max 3 choices per question
4. Completion detection: Check last step position, not type

REFERENCE DOCUMENTS:

- Tenant Guide: DEV/TENANT_GUIDE.md
- Binary Search example (backend): backend/algorithms/binary_search.py
- ArrayView example (frontend): frontend/src/components/visualizations/ArrayView.jsx

TASK:

1. Implement backend tracer (inherit AlgorithmTracer)
2. Create/select visualization component (follow interface)
3. Register algorithm in registry.py
4. Add to visualizationRegistry.js if new type
5. Test all LOCKED requirements

Provide complete, working implementation following all constraints.
```

---

### Template 4: Validation Checklist for LLM-Generated Code

```markdown
Validate this algorithm implementation against Tenant Guide requirements:

LOCKED REQUIREMENTS CHECK:

- [ ] Modal fits in max-h-[85vh]
- [ ] Panel layout uses flex-[3] and w-96
- [ ] Required HTML IDs present: #panel-visualization, #panel-steps, #step-current
- [ ] Keyboard shortcuts implemented: Arrow keys, Space, R
- [ ] Auto-scroll uses scrollIntoView({ behavior: 'smooth', block: 'center' })
- [ ] Overflow uses items-start + mx-auto pattern (NOT items-center + overflow-auto)

CONSTRAINED REQUIREMENTS CHECK:

- [ ] Backend metadata includes: algorithm, display_name, visualization_type, input_size
- [ ] Trace steps include visualization data in step.data.visualization
- [ ] Prediction questions have ≤3 choices (HARD LIMIT)
- [ ] Completion detection checks last step position, not step type
- [ ] Visualization component accepts step and config props

ANTI-PATTERNS CHECK:

- [ ] No items-center + overflow-auto (see Section 1.6)
- [ ] No hardcoded step types in completion detection
- [ ] No >3 prediction choices
- [ ] No missing HTML landmark IDs
- [ ] No modal scrolling (content fits in max-h-[85vh])

If any check fails, STOP and fix before proceeding.
```

---

## Appendix C: Version History

### v1.0 (December 11, 2025)

- Initial release
- Established three-tier jurisdiction system (LOCKED, CONSTRAINED, FREE)
- Documented ArrayView overflow fix (Session 14)
- Added 3-choice prediction limit (HARD)
- Defined backend JSON contract
- Provided reference implementations
- Created LLM prompt templates

---

## Conclusion

This Tenant Guide establishes the **constitutional framework** for the Algorithm Visualization Platform. By explicitly defining what is LOCKED, CONSTRAINED, and FREE, we enable:

1. **Confident Development** - Clear boundaries for human and LLM developers
2. **Consistency** - All algorithms feel like part of the same platform
3. **Rapid Prototyping** - New algorithms can be added in <5 hours
4. **Regression Prevention** - Codified lessons from recurring bugs
5. **LLM Integration** - Ready for AI-assisted code generation

**Key Principles to Remember:**

- 🔒 **LOCKED = Architecture** - Modal sizes, layout ratios, IDs, shortcuts, overflow patterns
- 🎨 **CONSTRAINED = Contract** - Backend structure, visualization interface, prediction limits
- 🚀 **FREE = Implementation** - Component architecture, state management, testing, styling

**When in Doubt:**

1. Check if it's LOCKED (Section 1) → Follow exactly
2. Check if it's CONSTRAINED (Section 2) → Follow contract, be creative within bounds
3. If neither → It's FREE (Section 4), choose what works best

**For Future Maintainers:**

If a bug occurs 2+ times, it should be added to LOCKED requirements. If a pattern proves valuable across algorithms, it should be added to REFERENCE IMPLEMENTATIONS. If a constraint becomes limiting, revisit and document the change.

---

**Document Maintenance:**

- Update version history when making changes
- Add new anti-patterns as they're discovered
- Expand reference implementations as platform grows
- Keep LLM templates in sync with implementation patterns

**This guide is a living document.** As the platform evolves, so should this guide. Treat it as the source of truth for architectural decisions.

---

**End of Tenant Guide v1.0**

### 3.1 Modal Examples

#### PredictionModal.jsx - Algorithm-Agnostic Prediction UI

**Purpose:** Render prediction questions from any algorithm without hardcoded logic.

**Key Features:**

- Smart keyboard shortcut derivation from choice labels
- Auto-advance after correct/incorrect answer
- Supports 2-3 choices (enforces HARD LIMIT)
- Algorithm-agnostic design

**Core Pattern: Shortcut Derivation**

```jsx
/**
 * Derive semantic keyboard shortcut from choice label.
 *
 * Strategy:
 * 1. Try first letter of label (if unique among choices)
 * 2. Try first letter of key words (capitalized words like "Left"/"Right")
 * 3. Fall back to number (1, 2, 3...)
 */
const deriveShortcut = (choice, allChoices, index) => {
  const label = choice.label || "";

  // Strategy 1: Try first letter
  const firstLetter = label[0]?.toUpperCase();
  if (firstLetter && /[A-Z]/.test(firstLetter)) {
    const conflicts = allChoices.filter(
      (c) => c.label[0]?.toUpperCase() === firstLetter
    );
    if (conflicts.length === 1) {
      return firstLetter;
    }
  }

  // Strategy 2: Extract key words (capitalized words in the middle)
  const words = label.match(/\b[A-Z][a-z]+/g) || [];
  for (const word of words) {
    const letter = word[0].toUpperCase();
    const conflicts = allChoices.filter((c) => {
      const otherWords = (c.label || "").match(/\b[A-Z][a-z]+/g) || [];
      return otherWords.some((w) => w[0].toUpperCase() === letter);
    });
    if (conflicts.length === 1) {
      return letter;
    }
  }

  // Strategy 3: Fall back to number
  return (index + 1).toString();
};
```

**Core Pattern: Keyboard Handling**

```jsx
useEffect(() => {
  const handleKeyPress = (event) => {
    // Ignore if already showing feedback
    if (showFeedback) return;

    // Skip shortcut (always 'S')
    if (event.key.toLowerCase() === "s") {
      event.preventDefault();
      if (onSkip) {
        onSkip();
      }
      return;
    }

    // Submit shortcut (always 'Enter')
    if (event.key === "Enter") {
      if (selected) {
        event.preventDefault();
        handleSubmit();
      }
      return;
    }

    // Dynamic choice shortcuts - match against derived shortcuts
    const pressedKey = event.key.toUpperCase();
    const choiceIndex = shortcuts.findIndex(
      (s) => s.toUpperCase() === pressedKey
    );

    if (choiceIndex !== -1) {
      event.preventDefault();
      setSelected(predictionData.choices[choiceIndex].id);
      return;
    }

    // Fallback: Accept number keys 1-9
    const numberIndex = parseInt(event.key) - 1;
    if (
      !isNaN(numberIndex) &&
      numberIndex >= 0 &&
      numberIndex < predictionData.choices.length
    ) {
      event.preventDefault();
      setSelected(predictionData.choices[numberIndex].id);
    }
  };

  window.addEventListener("keydown", handleKeyPress);
  return () => window.removeEventListener("keydown", handleKeyPress);
}, [showFeedback, onSkip, selected, predictionData, shortcuts]);
```

**Core Pattern: Dynamic Grid Layout**

```jsx
{
  /* Choice Buttons - Responsive grid based on choice count */
}
<div
  className={`grid gap-3 mb-4 ${
    choices.length <= 2
      ? "grid-cols-2" // 2 choices: side-by-side
      : choices.length === 3
      ? "grid-cols-3" // 3 choices: three columns
      : "grid-cols-2" // Fallback (should never reach if HARD LIMIT enforced)
  }`}
>
  {choices.map((choice, index) => (
    <button
      key={choice.id}
      onClick={() => setSelected(choice.id)}
      className={`py-3 px-4 rounded-lg font-medium transition-all ${
        selected === choice.id
          ? "bg-blue-500 text-white scale-105 ring-2 ring-blue-400"
          : "bg-slate-700 text-slate-300 hover:bg-slate-600"
      }`}
    >
      <div className="text-base">{choice.label}</div>
      <div className="text-xs opacity-75 mt-1">
        Press {shortcuts[index] || index + 1}
      </div>
    </button>
  ))}
</div>;
```

**Key Takeaways:**

- Shortcut derivation is fully automatic (no hardcoding)
- Modal enforces max-h-[85vh] constraint (no scrolling)
- Feedback auto-advances after 2.5 seconds
- Works for any algorithm that provides prediction_points

---

#### CompletionModal.jsx - Algorithm-Agnostic Completion UI

**Purpose:** Display algorithm results and prediction accuracy. Must work for any algorithm.

**Key Features:**

- Last-step detection (not step type)
- Algorithm-specific result rendering
- Generic fallback for unknown algorithms
- Unified prediction accuracy display

**Core Pattern: Last-Step Detection**

```jsx
const CompletionModal = ({ trace, step, onReset, predictionStats }) => {
  // FIXED: Check if we're on the last step instead of checking step type
  // This makes the modal work for ANY algorithm's final step
  const isLastStep =
    trace?.trace?.steps && step?.step === trace.trace.steps.length - 1;

  if (!isLastStep) {
    return null;
  }

  // Detect algorithm type from metadata
  const algorithm = trace?.metadata?.algorithm || "unknown";
  const isIntervalCoverage = algorithm === "interval-coverage";
  const isBinarySearch = algorithm === "binary-search";

  // Calculate accuracy (works for all algorithms)
  const accuracy =
    predictionStats?.total > 0
      ? Math.round((predictionStats.correct / predictionStats.total) * 100)
      : null;
  const feedback = accuracy !== null ? getAccuracyFeedback(accuracy) : null;

  // Render algorithm-specific completion content
  const renderAlgorithmResults = () => {
    if (isIntervalCoverage) {
      return renderIntervalCoverageResults();
    } else if (isBinarySearch) {
      return renderBinarySearchResults();
    } else {
      // Fallback for unknown algorithms
      return renderGenericResults();
    }
  };

  // ... rest of component
};
```

**Core Pattern: Algorithm-Specific Rendering**

```jsx
const renderBinarySearchResults = () => {
  const result = trace?.result || {};
  const found = result.found;
  const index = result.index;
  const comparisons = result.comparisons || 0;
  const target = trace?.metadata?.target_value;
  const arraySize = trace?.metadata?.input_size || 0;

  return (
    <>
      {/* Stats Section - 3-column grid */}
      <div className="bg-slate-900/50 rounded-lg p-3 mb-3">
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <div className="text-slate-400 text-xs mb-0.5">Array Size</div>
            <div className="text-xl font-bold text-white">{arraySize}</div>
          </div>
          <div>
            <div className="text-slate-400 text-xs mb-0.5">Comparisons</div>
            <div className="text-xl font-bold text-blue-400">{comparisons}</div>
          </div>
          <div>
            <div className="text-slate-400 text-xs mb-0.5">Result</div>
            <div
              className={`text-xl font-bold ${
                found ? "text-emerald-400" : "text-red-400"
              }`}
            >
              {found ? "✓" : "✗"}
            </div>
          </div>
        </div>
      </div>

      {/* Final Result Message */}
      <div className="bg-slate-900/50 rounded-lg p-3 mb-4">
        <div className="text-slate-300 font-semibold mb-2 text-xs">
          Search Result:
        </div>
        <div className="text-center py-3">
          {found ? (
            <div>
              <div className="text-emerald-400 text-lg font-bold mb-1">
                Target {target} found at index {index}
              </div>
              <div className="text-slate-400 text-sm">
                Found in {comparisons} comparison{comparisons !== 1 ? "s" : ""}
              </div>
            </div>
          ) : (
            <div>
              <div className="text-red-400 text-lg font-bold mb-1">
                Target {target} not found
              </div>
              <div className="text-slate-400 text-sm">
                Searched through {comparisons} comparison
                {comparisons !== 1 ? "s" : ""}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
```

**Core Pattern: Generic Fallback**

```jsx
const renderGenericResults = () => {
  return (
    <div className="bg-slate-900/50 rounded-lg p-3 mb-4">
      <div className="text-slate-300 text-sm text-center py-4">
        Algorithm execution complete!
      </div>
    </div>
  );
};
```

**Key Takeaways:**

- Never hardcode step types for completion detection
- Always provide a generic fallback
- Use grid layouts to fit results in max-h-[85vh]
- Prediction accuracy display works for all algorithms

---

### 3.2 Visualization Examples

#### ArrayView.jsx - Array Visualization with Permanent Overflow Fix

**Purpose:** Visualize array-based algorithms (Binary Search, Sorting).

**Key Features:**

- **PERMANENT FIX** for overflow cutoff bug (items-start + mx-auto)
- State-based element styling
- Pointer indicators
- Responsive to viewport size

**Core Pattern: Overflow Handling (CRITICAL)**

```jsx
const ArrayView = ({ step, config = {} }) => {
  const visualization = step?.data?.visualization;

  if (!visualization || !visualization.array) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        No array data available
      </div>
    );
  }

  const { array, pointers, search_space_size } = visualization;

  return (
    // PERMANENT FIX: Use items-start + mx-auto pattern instead of items-center
    // This prevents flex centering from cutting off left overflow
    <div className="h-full flex flex-col items-start overflow-auto py-4 px-6">
      <div className="mx-auto flex flex-col items-center gap-6 min-h-0">
        {/* Target indicator */}
        {pointers.target !== null && pointers.target !== undefined && (
          <div className="px-4 py-2 bg-green-900/30 border border-green-600/50 rounded-lg flex-shrink-0">
            <span className="text-green-400 font-semibold">
              🎯 Target:{" "}
              <span className="text-white text-lg font-bold">
                {pointers.target}
              </span>
            </span>
          </div>
        )}

        {/* Array visualization */}
        <div className="flex flex-col items-center flex-shrink-0">
          {/* Index labels (top) */}
          <div className="flex gap-2 mb-2">
            {array.map((element) => (
              <div
                key={element.index}
                className="w-16 text-center text-gray-400 text-xs font-mono flex-shrink-0"
              >
                [{element.index}]
              </div>
            ))}
          </div>

          {/* Array elements */}
          <div className="flex gap-2">
            {array.map((element) => (
              <div
                key={element.index}
                className={getElementClasses(element)}
                title={`Index ${element.index}: ${element.value} (${element.state})`}
              >
                {element.value}
              </div>
            ))}
          </div>

          {/* Pointer indicators (bottom) */}
          {renderPointers()}
        </div>

        {/* State legend */}
        <div className="flex flex-wrap gap-4 text-xs justify-center flex-shrink-0">
          {/* Legend items */}
        </div>
      </div>
    </div>
  );
};
```

**Core Pattern: State-Based Styling**

```jsx
// Map element states to Tailwind classes
const getElementClasses = (element) => {
  const baseClasses =
    "w-16 h-16 flex items-center justify-center rounded-lg font-bold text-lg transition-all duration-300 border-2 flex-shrink-0";

  switch (element.state) {
    case "examining":
      return `${baseClasses} bg-yellow-500 border-yellow-400 text-black scale-110 shadow-lg animate-pulse`;
    case "found":
      return `${baseClasses} bg-green-500 border-green-400 text-white scale-110 shadow-lg`;
    case "active_range":
      return `${baseClasses} bg-blue-600 border-blue-500 text-white`;
    case "excluded":
      return `${baseClasses} bg-gray-700 border-gray-600 text-gray-500 opacity-50`;
    default:
      return `${baseClasses} bg-slate-600 border-slate-500 text-white`;
  }
};
```

**Core Pattern: Pointer Rendering**

```jsx
const renderPointers = () => {
  const pointerIcons = [];

  if (pointers.left !== null && pointers.left !== undefined) {
    pointerIcons.push({
      index: pointers.left,
      label: "L",
      color: "text-blue-400",
      bgColor: "bg-blue-900/50",
    });
  }

  if (pointers.right !== null && pointers.right !== undefined) {
    pointerIcons.push({
      index: pointers.right,
      label: "R",
      color: "text-red-400",
      bgColor: "bg-red-900/50",
    });
  }

  if (pointers.mid !== null && pointers.mid !== undefined) {
    pointerIcons.push({
      index: pointers.mid,
      label: "M",
      color: "text-yellow-400",
      bgColor: "bg-yellow-900/50",
    });
  }

  return (
    <div className="flex gap-2 mt-2">
      {array.map((element, idx) => (
        <div
          key={idx}
          className="w-16 h-8 flex flex-col items-center justify-end flex-shrink-0"
        >
          {pointerIcons
            .filter((p) => p.index === element.index)
            .map((pointer, pIdx) => (
              <div
                key={pIdx}
                className={`px-2 py-0.5 rounded text-xs font-bold ${pointer.color} ${pointer.bgColor} mb-0.5`}
              >
                {pointer.label}
              </div>
            ))}
        </div>
      ))}
    </div>
  );
};
```

**Key Takeaways:**

- **ALWAYS use items-start + mx-auto for scrollable content** (see Section 1.6)
- Use flex-shrink-0 on elements to prevent squishing
- Provide graceful fallback for missing data
- Use transitions for smooth state changes

---

#### TimelineView.jsx - Timeline Visualization (Interval Coverage)

**Purpose:** Visualize timeline-based algorithms (Interval Coverage).

**Key Features:**

- Horizontal timeline with intervals
- Hover interactions
- Color-coded intervals
- State-based styling (examining, kept, covered)

**Core Pattern: Timeline Rendering**

```jsx
const TimelineView = ({ step, highlightedIntervalId, onIntervalHover }) => {
  const visualization = step?.data?.visualization;

  if (!visualization || !visualization.all_intervals) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        No timeline data available
      </div>
    );
  }

  const { all_intervals } = visualization;

  // Calculate timeline bounds
  const minStart = Math.min(...all_intervals.map((i) => i.start));
  const maxEnd = Math.max(...all_intervals.map((i) => i.end));
  const timelineRange = maxEnd - minStart;

  return (
    <div className="h-full flex flex-col items-start overflow-auto p-6">
      <div className="mx-auto w-full max-w-4xl">
        {/* Timeline axis */}
        <div className="relative h-12 bg-slate-700 rounded mb-4">
          {/* Tick marks */}
        </div>

        {/* Intervals */}
        <div className="space-y-3">
          {all_intervals.map((interval) => {
            const leftPercent =
              ((interval.start - minStart) / timelineRange) * 100;
            const widthPercent =
              ((interval.end - interval.start) / timelineRange) * 100;

            return (
              <div
                key={interval.id}
                className="relative h-16"
                onMouseEnter={() => onIntervalHover?.(interval.id)}
                onMouseLeave={() => onIntervalHover?.(null)}
              >
                <div
                  className={`absolute h-12 rounded-lg transition-all duration-300 ${getIntervalClasses(
                    interval,
                    highlightedIntervalId
                  )}`}
                  style={{
                    left: `${leftPercent}%`,
                    width: `${widthPercent}%`,
                  }}
                >
                  <div className="flex items-center justify-center h-full text-white font-bold">
                    ({interval.start}, {interval.end})
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
```

**Core Pattern: Interval Styling**

```jsx
const getIntervalClasses = (interval, highlightedId) => {
  const colors = getIntervalColor(interval.color);
  const isHighlighted = interval.id === highlightedId;

  let classes = `${colors.bg} ${colors.border} border-2 ${colors.text}`;

  // State-based styling
  if (interval.state === "examining") {
    classes += " scale-105 shadow-xl ring-4 ring-yellow-400";
  } else if (interval.state === "covered") {
    classes += " opacity-50";
  }

  // Hover highlight
  if (isHighlighted) {
    classes += " scale-105 shadow-xl";
  }

  return classes;
};
```

**Key Takeaways:**

- Use percentage-based positioning for responsive timelines
- Support hover interactions for better UX
- Use items-start + mx-auto pattern for overflow
- Provide clear visual feedback for current state

---

#### CallStackView.jsx - Call Stack Visualization

**Purpose:** Visualize recursive call stack (Interval Coverage, DFS, etc.).

**Key Features:**

- Auto-scroll to active call
- Depth-based indentation
- Hover interactions
- Ref management for auto-scroll

**Core Pattern: Auto-Scroll Implementation**

```jsx
const CallStackView = ({ step, activeCallRef, onIntervalHover }) => {
  const callStack = step?.data?.visualization?.call_stack_state || [];

  // Auto-scroll to active call when step changes
  useEffect(() => {
    if (activeCallRef?.current) {
      activeCallRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [step?.step, activeCallRef]);

  return (
    <div className="space-y-2">
      {callStack.map((call, index) => (
        <div
          key={call.id}
          id={call.is_active ? "step-current" : undefined}
          ref={call.is_active ? activeCallRef : null}
          className={`p-3 rounded-lg border-2 transition-all duration-300 ${
            call.is_active
              ? "bg-yellow-500/20 border-yellow-500 shadow-lg"
              : "bg-slate-700/50 border-slate-600"
          }`}
          style={{ marginLeft: `${call.depth * 12}px` }}
          onMouseEnter={() => onIntervalHover?.(call.interval?.id)}
          onMouseLeave={() => onIntervalHover?.(null)}
        >
          <div className="text-white text-sm font-mono">
            examine({call.interval.start}, {call.interval.end})
          </div>
          {call.is_active && (
            <div className="text-yellow-400 text-xs mt-1">← Current</div>
          )}
        </div>
      ))}
    </div>
  );
};
```

**Key Takeaways:**

- Use ref + scrollIntoView for auto-scroll behavior
- Apply #step-current ID to active element only
- Use depth-based indentation for visual hierarchy
- Sync hover state with timeline visualization

---

### 3.3 Common Patterns

#### useTraceNavigation Hook - Navigation Logic

**Purpose:** Centralize trace navigation logic (next, prev, reset, jump).

**Core Pattern:**

```javascript
export const useTraceNavigation = (trace, resetPredictionStats) => {
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = trace?.trace?.steps?.length || 0;

  // Reset currentStep when trace changes (algorithm switch)
  useEffect(() => {
    setCurrentStep(0);
    // Also reset prediction stats when switching algorithms
    if (resetPredictionStats) {
      resetPredictionStats();
    }
  }, [trace, resetPredictionStats]);

  const nextStep = useCallback(() => {
    if (totalSteps > 0 && currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  }, [totalSteps, currentStep]);

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  const jumpToEnd = useCallback(() => {
    if (totalSteps > 0) {
      setCurrentStep(totalSteps - 1);
    }
  }, [totalSteps]);

  const resetTrace = useCallback(() => {
    setCurrentStep(0);
    if (resetPredictionStats) {
      resetPredictionStats();
    }
  }, [resetPredictionStats]);

  const currentStepData = useMemo(
    () => trace?.trace?.steps?.[currentStep],
    [trace, currentStep]
  );

  const isComplete = currentStepData?.type === "ALGORITHM_COMPLETE";

  return {
    currentStep,
    currentStepData,
    totalSteps,
    nextStep,
    prevStep,
    resetTrace,
    jumpToEnd,
    isComplete,
    setCurrentStep, // Exposed for keyboard shortcuts/prediction logic
  };
};
```

**Key Takeaways:**

- Reset step on trace change (algorithm switch)
- Use useCallback to prevent unnecessary re-renders
- Expose setCurrentStep for advanced use cases
- Memoize currentStepData for performance

---

#### useKeyboardShortcuts Hook - Keyboard Handling

**Purpose:** Global keyboard shortcuts for navigation.

**Core Pattern:**

```javascript
export const useKeyboardShortcuts = ({
  onNext,
  onPrev,
  onReset,
  onJumpToEnd,
  isComplete,
  modalOpen,
}) => {
  useEffect(() => {
    const handleKeyPress = (event) => {
      // Ignore if modal is open (modals handle their own shortcuts)
      if (modalOpen) return;

      // Ignore if user is typing in an input field
      if (
        event.target.tagName === "INPUT" ||
        event.target.tagName === "TEXTAREA"
      ) {
        return;
      }

      switch (event.key) {
        case "ArrowRight":
          event.preventDefault();
          if (!isComplete) {
            onNext();
          }
          break;
        case "ArrowLeft":
          event.preventDefault();
          onPrev();
          break;
        case " ": // Space
          event.preventDefault();
          // Toggle mode logic (handled by parent)
          break;
        case "r":
        case "R":
          event.preventDefault();
          onReset();
          break;
        default:
        // No action
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [onNext, onPrev, onReset, isComplete, modalOpen]);
};
```

**Key Takeaways:**

- Check for modal state before handling shortcuts
- Ignore shortcuts when typing in input fields
- Prevent default browser behavior for arrow keys
- Clean up event listeners on unmount

---

#### Dynamic Visualization Registry

**Purpose:** Map visualization types to React components dynamically.

**Core Pattern:**

```javascript
// utils/visualizationRegistry.js
import TimelineView from "../components/visualizations/TimelineView";
import ArrayView from "../components/visualizations/ArrayView";

const VISUALIZATION_REGISTRY = {
  timeline: TimelineView,
  array: ArrayView,
  // Future: graph, tree, matrix
};

export const getVisualizationComponent = (type) => {
  return VISUALIZATION_REGISTRY[type] || TimelineView; // Fallback to timeline
};

// Usage in App.jsx:
const visualizationType = trace?.metadata?.visualization_type || "timeline";
const MainVisualizationComponent = getVisualizationComponent(visualizationType);

<MainVisualizationComponent
  step={currentStep}
  config={trace?.metadata?.visualization_config || {}}
/>;
```

**Key Takeaways:**

- Centralize visualization component mapping
- Always provide a fallback component
- Easy to extend with new visualization types
- Type comes from backend metadata

---
