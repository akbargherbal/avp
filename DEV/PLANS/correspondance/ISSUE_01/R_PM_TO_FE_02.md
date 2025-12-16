"Excellent work on Phase 1. Your adherence to the 'Container-Presentation' pattern is critical for the long-term maintainability of our registry architecture.

I am **approving** your request to formalize this pattern. We will insert a **Phase 1.5** to extract the panel containers immediately. This will reduce `App.jsx` to a pure layout orchestrator before we complicate it with event listeners in Phase 2.

Here is the updated plan and the scaffolding for the new containers."

### Updated Plan: `FE_REFACTOR_PHASED_PLAN.md`

I have revised the plan to explicitly codify the Container-Presentation boundary.

```markdown
# Frontend Refactor Implementation Plan (v2.0)

## Status: ACTIVE - Phase 1 Complete, Entering Phase 1.5

## Phase 1: Data Architecture Foundation (COMPLETED)

- ✅ Context Infrastructure created
- ✅ Shell components migrated
- ✅ App.jsx refactored to orchestrator

---

## Phase 1.5: Container Pattern Implementation (NEW - 1 day)

### Goal

**Finalize the decoupling of App.jsx by extracting the "Bridge" logic into dedicated Container Components. This enforces the strict props contract for Registry components.**

### Success Criteria

- ✅ `App.jsx` contains ZERO logic for selecting/rendering specific algorithms
- ✅ `VisualizationPanel` handles `getVisualizationComponent` lookup
- ✅ `StatePanel` handles `getStateComponent` lookup
- ✅ Registry components (`ArrayView`, `*State`) receive data ONLY via props
- ✅ `App.jsx` reduced to <80 lines

### Tasks

**1.5.1: Create VisualizationPanel Container**

- **Role:** Smart Container
- **Contexts:** Consumes `TraceContext` (metadata), `NavigationContext` (step), `HighlightContext` (hover)
- **Logic:**
  - Determines `visualizationType` from metadata
  - Calls `getVisualizationComponent(type)`
  - Passes `step`, `config`, and `highlight` props to the dumb component
- **Error Boundary:** Wraps the inner component

**1.5.2: Create StatePanel Container**

- **Role:** Smart Container
- **Contexts:** Consumes `TraceContext` (algorithm name), `NavigationContext` (step)
- **Logic:**
  - Determines `currentAlgorithm`
  - Calls `getStateComponent(algorithm)`
  - Passes `step` and `trace` props
- **Error Boundary:** Wraps the inner component

**1.5.3: Final App.jsx Cleanup**

- Replace massive render blocks in `App.jsx` with `<VisualizationPanel />` and `<StatePanel />`

---

## Phase 2: Event Management & Resilience (3-4 days)

... [Remains unchanged]
```

---

### Task Specifications: Phase 1.5

**Owner:** Frontend Developer
**Time Estimate:** 2-3 hours

#### 1. `src/components/panels/VisualizationPanel.jsx`

**Scaffolding:**

```javascript
import React from "react";
import { useTrace } from "../../contexts/TraceContext";
import { useNavigation } from "../../contexts/NavigationContext";
import { useVisualHighlight } from "../../contexts/HighlightContext";
import { getVisualizationComponent } from "../../utils/visualizationRegistry";
import ErrorBoundary from "../ErrorBoundary";

const VisualizationPanel = () => {
  // 1. Consume Contexts
  const { trace } = useTrace();
  const { currentStepData } = useNavigation();
  const { effectiveHighlight, handleIntervalHover } = useVisualHighlight();

  // 2. Determine Component
  const visualizationType = trace?.metadata?.visualization_type;
  const visualizationConfig = trace?.metadata?.visualization_config;
  const VisualizationComponent = getVisualizationComponent(visualizationType);

  // 3. Prepare Props (The Contract)
  const componentProps = {
    step: currentStepData,
    config: visualizationConfig || {},
    // Add highlight props only if needed (or pass generic handlers)
    highlightedIntervalId: effectiveHighlight,
    onIntervalHover: handleIntervalHover,
  };

  return (
    <div
      id="panel-visualization"
      className="flex-[3] bg-slate-800 rounded-xl shadow-2xl flex flex-col overflow-hidden select-none"
    >
      {/* Header Logic Here */}
      <div className="flex-1 flex flex-col items-start overflow-auto p-6">
        <div className="mx-auto h-full w-full">
          <ErrorBoundary>
            <VisualizationComponent {...componentProps} />
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
};

export default VisualizationPanel;
```

#### 2. `src/components/panels/StatePanel.jsx`

**Scaffolding:**

```javascript
import React from "react";
import { useTrace } from "../../contexts/TraceContext";
import { useNavigation } from "../../contexts/NavigationContext";
import { useVisualHighlight } from "../../contexts/HighlightContext";
import { getStateComponent } from "../../utils/stateRegistry";
import { getStepTypeBadge } from "../../utils/stepBadges";
import ErrorBoundary from "../ErrorBoundary";

const StatePanel = () => {
  // 1. Consume Contexts
  const { trace, currentAlgorithm } = useTrace();
  const { currentStepData, currentStep } = useNavigation();
  const { handleIntervalHover } = useVisualHighlight();

  // 2. Determine Component
  const StateComponent = getStateComponent(currentAlgorithm);
  const badge = getStepTypeBadge(currentStepData?.type);

  return (
    <div
      id="panel-steps"
      className="w-96 bg-slate-800 rounded-xl shadow-2xl flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-700">
        <h2 className="text-white font-bold">Algorithm State</h2>
      </div>

      {/* Registry Component Render */}
      <div id="panel-steps-list" className="flex-1 overflow-y-auto px-6 py-4">
        <ErrorBoundary>
          <StateComponent
            step={currentStepData}
            trace={trace}
            currentStep={currentStep}
            onIntervalHover={handleIntervalHover}
          />
        </ErrorBoundary>
      </div>

      {/* Description Footer */}
      <div
        id="panel-step-description"
        className="border-t border-slate-700 p-4 bg-slate-800"
      >
        {/* Badge and Description Logic */}
      </div>
    </div>
  );
};

export default StatePanel;
```

### Execution Order

1.  **Create** the `src/components/panels/` directory.
2.  **Implement** `VisualizationPanel.jsx` and `StatePanel.jsx` using the scaffolding above.
3.  **Refactor** `App.jsx` to import and use these panels, removing the direct registry lookups and prop drilling.
4.  **Verify** that `ArrayView` and `BinarySearchState` still receive their data correctly via the React DevTools.

**Proceed immediately.** This cleanup is the final step to a pristine architecture before we tackle events.
