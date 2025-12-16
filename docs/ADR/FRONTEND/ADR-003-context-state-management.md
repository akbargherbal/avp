# ADR-003: Context-Based State Management Architecture

## Status

✅ Accepted (2025-01-27)
Supersedes: Hook-based prop passing pattern
Resolves: INV-1, INV-2, INV-3, INV-4, INV-6

## Context

The frontend application suffered from a "God Object" anti-pattern in `App.jsx`, which had grown to ~340 lines of code. This component was responsible for:

1. Fetching trace data
2. Managing navigation state (current step)
3. Handling prediction mode logic
4. Managing visual highlighting
5. Coordinating keyboard shortcuts
6. Rendering the UI layout

This centralization caused several issues:

- **Prop Drilling**: Data had to be passed through multiple layers (e.g., `App` -> `MainVisualization` -> `TimelineView`).
- **Performance**: Any state change in `App.jsx` caused the entire application tree to re-render.
- **Fragility**: Modifying one concern risked breaking unrelated features.
- **Maintenance**: The file was difficult to read and reason about.

## Decision

We refactored the architecture to use **React Context API** with a **Domain-Driven Design** approach, splitting state into five distinct domains:

1. **`TraceContext`**: Manages raw trace data loading and metadata.
2. **`NavigationContext`**: Manages current step index and derived step data.
3. **`PredictionContext`**: Manages active learning mode, questions, and scoring.
4. **`HighlightContext`**: Manages visual cross-referencing (hovering intervals/elements).
5. **`KeyboardContext`**: Centralizes keyboard event handling with a priority system.

We also implemented a **Symmetric Registry Pattern** for UI composition:

- **Left Panel**: `visualizationRegistry` selects the visualization component (e.g., `ArrayView`).
- **Right Panel**: `stateRegistry` selects the algorithm state component (e.g., `BinarySearchState`).

## Consequences

### Positive

- **Decoupling**: `App.jsx` reduced to <150 lines; acts solely as a layout coordinator.
- **Performance**: Re-renders are scoped to specific contexts.
- **Scalability**: New algorithms can be added via Registries without modifying core app logic.
- **Event Management**: `KeyboardContext` solves "fighting listeners" (INV-3) via priority levels.

### Negative

- **Complexity**: New contributors must understand the Context API and provider hierarchy.
- **Boilerplate**: Creating global state requires setting up a Context/Provider.
- **Nesting**: Deeper component tree in React DevTools.

## Implementation Details

### Provider Hierarchy

```jsx
<TraceProvider>
  <NavigationProvider>
    <PredictionProvider>
      <HighlightProvider>
        <KeyboardProvider>
          <App />
        </KeyboardProvider>
      </HighlightProvider>
    </PredictionProvider>
  </NavigationProvider>
</TraceProvider>
```

### Keyboard Priority System

- **Priority 10 (Critical)**: Modals (Prediction, Completion) - blocks lower priorities.
- **Priority 5 (High)**: Dropdowns, temporary UI.
- **Priority 1 (Global)**: General navigation (Arrow keys).
