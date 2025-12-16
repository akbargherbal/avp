# Frontend Architecture Migration Guide

## Overview

As of v2.2, the frontend uses a **Context-based architecture** and **Symmetric Registries**. This guide explains how to work with the new patterns.

## Architecture Changes

| Feature         | Old Pattern                    | New Pattern                                    |
| --------------- | ------------------------------ | ---------------------------------------------- |
| **State**       | `useState` in `App.jsx`        | `src/contexts/*.jsx`                           |
| **Data Access** | Props passed down 3+ levels    | `useContext` (via custom hooks)                |
| **Logic**       | `useTraceLoader` returns state | `useTraceLoader` wraps `TraceContext`          |
| **Events**      | `window.addEventListener`      | `useKeyboardShortcuts` (via `KeyboardContext`) |
| **UI Routing**  | Hardcoded `if/else` in JSX     | `visualizationRegistry` & `stateRegistry`      |

## 1. Accessing State

**❌ Old Way (Props):**

```jsx
const MyComponent = ({ currentStep, trace }) => { ... }
```

**✅ New Way (Hooks):**

```jsx
import { useNavigation } from "../contexts/NavigationContext";
import { useTrace } from "../contexts/TraceContext";

const MyComponent = () => {
  const { currentStep } = useNavigation();
  const { trace } = useTrace();
  // ...
};
```

## 2. Adding a New Algorithm

You no longer need to modify `App.jsx`.

### Step A: Visualization (Left Panel)

1. If standard (Array/Timeline), reuse existing components.
2. If new, create `src/components/visualizations/MyView.jsx`.
3. Register in `src/utils/visualizationRegistry.js`.

### Step B: State Display (Right Panel)

1. Create `src/components/algorithm-states/MyAlgorithmState.jsx`.
2. Register in `src/utils/stateRegistry.js`.

## 3. Handling Keyboard Shortcuts

**❌ Old Way:**

```jsx
window.addEventListener("keydown", handler);
```

**✅ New Way:**

```jsx
import { useKeyboardShortcuts } from "../hooks/useKeyboardShortcuts";

useKeyboardShortcuts({
  ArrowRight: nextStep,
  Escape: closeModal, // Priority handled automatically
});
```

## 4. Performance Best Practices

- **Memoization**: Wrap visualization components in `React.memo`.
- **Static Constants**: Move constant styles/configs outside the component definition (see `TimelineView.jsx`).
- **Selectors**: If you only need one piece of data, destructure it from the hook.
