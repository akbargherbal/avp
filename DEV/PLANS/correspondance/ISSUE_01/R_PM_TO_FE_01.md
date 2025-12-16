# Architectural Directive: Component Interface Contract

**To:** Frontend Visualization Specialist
**From:** ActionPlan PM
**Date:** October 26, 2023
**Subject:** DECISION - Maintain Strict Props Interface for Registry Components

After reviewing `FRONTEND_CHECKLIST.md`, `App.jsx`, and the registry architecture, I have made a determination regarding the **Strict Props vs. Context** debate.

### The Ruling

**We will MAINTAIN the Strict Props Interface for all Registry Components (Visualizations and Algorithm States).**

You **must not** refactor `ArrayView.jsx`, `TimelineView.jsx`, or any `*State.jsx` component to consume Context directly. They must remain "dumb" renderers that receive their data explicitly.

However, **Application Shell Components** (Modals, ControlBar, Switcher) **SHOULD** consume Context.

---

### The Architecture: "Container-Presentation" Pattern

We are adopting a hybrid approach to satisfy both the Refactor goals and the Compliance standards.

#### 1. Registry Components (LOCKED to Props)
*   **Scope:** Components returned by `getVisualizationComponent()` and `getStateComponent()`.
*   **Rule:** Must receive data via `step`, `config`, and `trace` props.
*   **Why:**
    *   **Testability:** Unit testing `ArrayView` requires simple JSON injection, not complex Context mocking.
    *   **Decoupling:** These components are "plugins." They should not know *how* the app manages state (Context, Redux, or future tech), only *what* data they need to render.
    *   **Explicit Contract:** The `FRONTEND_CHECKLIST.md` defines a clear API surface. Context makes dependencies implicit and hidden.

#### 2. Application Shell Components (Migrate to Context)
*   **Scope:** `App.jsx`, `ControlBar`, `AlgorithmSwitcher`, `PredictionModal`, `CompletionModal`.
*   **Rule:** These should consume `TraceContext`, `NavigationContext`, etc.
*   **Why:** These components are intrinsic to the application lifecycle and orchestration.

---

### Implementation Strategy

Your refactor of `App.jsx` should introduce **Container Components** that bridge the gap.

**Instead of:**
`App.jsx` (God Object) -> passes props -> `ArrayView`

**Refactor to:**
`App.jsx` -> `VisualizationPanel` (Container) -> consumes Context -> passes props -> `ArrayView` (Presentation)

#### Example: The Bridge

**`src/components/panels/VisualizationPanel.jsx` (New Container)**
```javascript
import { useTrace } from '../../contexts/TraceContext';
import { useNavigation } from '../../contexts/NavigationContext';
import { getVisualizationComponent } from '../../utils/visualizationRegistry';

const VisualizationPanel = () => {
  // 1. Consume Context (The "Smart" Part)
  const { trace } = useTrace();
  const { currentStepData } = useNavigation();

  // 2. Select Component
  const VisualizationComponent = getVisualizationComponent(trace?.metadata?.visualization_type);

  // 3. Render with Explicit Props (The "Contract" Part)
  return (
    <div id="panel-visualization" className="...">
       <VisualizationComponent 
          step={currentStepData} 
          config={trace?.metadata?.visualization_config} 
       />
    </div>
  );
};
```

### Action Items

1.  **Do NOT modify** `docs/compliance/FRONTEND_CHECKLIST.md`. The interface contract stands.
2.  **Proceed with Phase 1 Refactor**, but limit Context consumption to the "Application Shell" layer.
3.  **Create Container Components** (`VisualizationPanel`, `StatePanel`) to handle the extraction of data from Context and passing it to the Registry components.

**Rationale Summary:**
We are optimizing for **Scalability** (50+ algorithms). If 50 components all hook into a global context, changing that context becomes a nightmare. By keeping the 50 components as pure functions of their props, we ensure the "Backend Thinks, Frontend Reacts" philosophy remains strictly enforced at the rendering layer.

Proceed with the refactor using this boundary.