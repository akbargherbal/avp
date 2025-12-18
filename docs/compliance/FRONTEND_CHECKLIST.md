# Frontend Developer Checklist: Algorithm Integration Compliance v1.0

**Authority:** Derived from project workflow documentation  
**Purpose:** Verify new algorithm frontend components comply with platform architecture and design standards  
**Scope:** Frontend-specific requirements only - focus on this checklist and Frontend ADRs

---

## LOCKED REQUIREMENTS (Mandatory - Cannot Be Modified)

### Registry Registration

- [ ] **State component registered in `stateRegistry.js`**
  - Import statement added at top of file
  - Entry added to `STATE_REGISTRY` object
  - Key matches backend algorithm name exactly (e.g., "binary-search")
  - Verify registration with: `isStateComponentRegistered('algorithm-name')`

- [ ] **Visualization component registered in `visualizationRegistry.js`** (if new type needed)
  - Import statement added at top of file
  - Entry added to `VISUALIZATION_REGISTRY` object
  - Key matches backend `visualization_type` metadata
  - Most algorithms reuse existing: "array" → `ArrayView`, "timeline" → `TimelineView`

### Component Organization (ADR-002)

- [ ] **State component in correct directory**
  - File location: `frontend/src/components/algorithm-states/`
  - Naming convention: `{AlgorithmName}State.jsx` (PascalCase + "State" suffix)
  - Examples: `BinarySearchState.jsx`, `MergeSortState.jsx`, `DijkstraState.jsx`
  - NOT in `visualizations/` directory (that's for reusable components)

- [ ] **Visualization component in correct directory** (if creating new reusable component)
  - File location: `frontend/src/components/visualizations/`
  - Naming convention: `{ConceptName}View.jsx` (PascalCase + "View" suffix)
  - Examples: `ArrayView.jsx`, `TimelineView.jsx`, `GraphView.jsx`
  - Only create if no existing visualization fits your needs

### Static Mockup Compliance

- [ ] **Visual design matches static mockups**
  - Reference: `docs/static_mockup/algorithm_page_mockup.html`
  - Verify theme consistency (slate-800 background, slate-700 panels)
  - Verify color palette matches existing algorithms
  - Verify font sizes and spacing match mockup
  - Verify typography (font-mono for values, font-sans for labels)

- [ ] **Prediction modal matches mockup**
  - Reference: `docs/static_mockup/prediction_modal_mockup.html`
  - Choice styling consistent (hover states, selection)
  - Button placement and sizing correct
  - Modal dimensions and positioning match

- [ ] **Completion modal matches mockup**
  - Reference: `docs/static_mockup/completion_modal_mockup.html`
  - Score display formatting matches
  - Button styling consistent
  - Success/partial success states match design

### Modal Keyboard Shortcuts (LOCKED Elements - INV-3)

- [ ] **Prediction modal shortcuts verified**
  - `1`, `2`, `3` keys select choices (hardcoded in PredictionModal.jsx)
  - `s` key skips current prediction (RESERVED - critical for learning flow)
  - `Enter` submits selected answer
  - `Escape` closes modal
  - NO modifications to these shortcuts without full team approval

- [ ] **Completion modal shortcuts verified**
  - `r` key restarts algorithm
  - `Enter` restarts algorithm
  - `Escape` closes modal
  - NO modifications to these shortcuts without full team approval

- [ ] **Keyboard shortcut conflicts checked**
  - Verify no component uses `s` key for other purposes (reserved for Skip in Prediction Modal)
  - Verify no component uses `1`, `2`, `3` keys for other purposes (reserved for Prediction choices)
  - Verify no component uses `r` key for other purposes (reserved for Restart in Completion Modal)
  - Check KeyboardContext priority levels if implementing new shortcuts
  - Document any new shortcuts to avoid future conflicts

### Panel Ratio and Overflow Pattern (LOCKED Elements - INV-4)

- [ ] **Panel ratio preserved: 60/40 (Left/Right)**
  - Left panel (visualization): 60% width
  - Right panel (state): 40% width
  - Verify responsive behavior at different screen sizes
  - NO modifications to ratio without full team approval

- [ ] **Overflow pattern implemented correctly**
  - Panel content uses `overflow-y-auto` for vertical scrolling
  - Horizontal overflow hidden (`overflow-x-hidden`)
  - Content never forces horizontal scroll
  - Scrollbars appear only when content exceeds panel height

### Algorithm Info Markdown

- [ ] **Algorithm info file exists**
  - File location: `public/algorithm-info/{algorithm-name}.md`
  - Naming convention: Match algorithm name exactly (e.g., `binary-search.md`)
  - Accessible via: `GET /algorithm-info/{algorithm-name}.md`

- [ ] **Info content follows standard structure**
  - Educational overview (what, why, where used)
  - Complexity analysis (time/space)
  - Real-world applications
  - No code-heavy content (conceptual focus)
  - 150-250 words recommended length

---

## CONSTRAINED REQUIREMENTS (Follow Architecture Patterns)

### Architecture Documentation Review

- [ ] **Frontend ADRs reviewed before implementation**
  - Read `docs/ADR/FRONTEND/ADR-001-registry-based-architecture.md`
  - Read `docs/ADR/FRONTEND/ADR-002-component-organization-principles.md`
  - Read `docs/ADR/FRONTEND/ADR-003-context-state-management.md`
  - Understand registry pattern, component organization, context usage

- [ ] **Project README reviewed for context**
  - Read `README.md` for architecture overview
  - Understand backend/frontend contract (trace structure)
  - Review data flow: API → TraceContext → NavigationContext → Components

- [ ] **Document contradictions flagged**
  - If ADR conflicts with this checklist → Flag to PM
  - If ADR conflicts with README → Flag to PM
  - If README appears outdated or incorrect → Flag to PM
  - Escalate architectural conflicts before implementation

### Narrative-Driven Visualization Design

- [ ] **Backend narrative reviewed before component design**
  - Read all generated narratives: `docs/narratives/{algorithm-name}/`
  - Identify key data points mentioned in narrative
  - Identify state transitions described in narrative
  - Identify decision points requiring visual emphasis

- [ ] **Visualization plan extracts narrative insights**
  - List metrics to emphasize (from narrative "Frontend Visualization Hints")
  - List transitions to animate (based on narrative step progression)
  - List data relationships to show (pointers, ranges, comparisons)
  - Map narrative sections to visual components

- [ ] **Component design supports narrative flow**
  - Visual states match narrative descriptions
  - Transitions reflect narrative temporal coherence
  - Data visibility matches narrative references
  - No visual elements without narrative justification

### Component Props Interface (ADR-003)

- [ ] **State component receives standard props**
  - `step` (object, required): Current step data from NavigationContext
  - `trace` (object, optional): Full trace data from TraceContext
  - Additional algorithm-specific props as needed
  - PropTypes defined for all props

- [ ] **Props accessed safely with fallbacks**
  - Check `step?.data?.visualization` before access
  - Check `trace?.metadata` before access
  - Provide fallback UI if data missing
  - No crashes on null/undefined data

### Context Usage Patterns (ADR-003)

- [ ] **Use contexts appropriately**
  - `useTrace()` for raw trace data and metadata
  - `useNavigation()` for current step and navigation controls
  - `usePrediction()` for prediction mode state
  - `useHighlight()` for cross-panel visual coordination
  - `useKeyboard()` for keyboard shortcut registration

- [ ] **Avoid prop drilling**
  - Use context hooks instead of passing props through multiple layers
  - Example: Get `currentStep` from `useNavigation()` directly in component
  - Example: Get `trace.metadata` from `useTrace()` directly in component

### Visualization Component Selection (ADR-001)

- [ ] **Reuse existing visualization components when possible**
  - Array algorithms → Use `ArrayView` (visualization_type: "array")
  - Timeline algorithms → Use `TimelineView` (visualization_type: "timeline")
  - Only create new visualization if existing don't fit

- [ ] **Follow visualization component contract**
  - `step` prop: Contains `data.visualization` with visualization-specific data
  - `config` prop (optional): Contains `metadata.visualization_config`
  - Render current state based on `step.data.visualization`
  - Handle missing data gracefully

### Data Access Patterns

- [ ] **Access visualization data correctly**
  - Array algorithms: `step.data.visualization.array` (array of element objects)
  - Timeline algorithms: `step.data.visualization.all_intervals` (array of intervals)
  - Pointers: `step.data.visualization.pointers` (object with pointer names/values)
  - State: `step.data.visualization.{algorithm_specific_state}`

- [ ] **Access metadata correctly**
  - Algorithm name: `trace.metadata.algorithm`
  - Display name: `trace.metadata.display_name`
  - Visualization type: `trace.metadata.visualization_type`
  - Custom config: `trace.metadata.visualization_config`

### Component Structure Standards

- [ ] **Component follows standard structure**
  ```jsx
  import React from 'react';
  import PropTypes from 'prop-types';
  import { useTrace, useNavigation } from '@/contexts';
  
  const AlgorithmState = ({ step, trace }) => {
    // Early return for missing data
    if (!step?.data?.visualization) {
      return <div>No state data available</div>;
    }
    
    // Extract data
    const { key_data } = step.data.visualization;
    
    // Render UI
    return (
      <div className="space-y-4">
        {/* Component content */}
      </div>
    );
  };
  
  AlgorithmState.propTypes = {
    step: PropTypes.shape({
      data: PropTypes.shape({
        visualization: PropTypes.object,
      }),
    }).isRequired,
    trace: PropTypes.object,
  };
  
  export default AlgorithmState;
  ```

- [ ] **PropTypes defined for all components**
  - Document expected prop structure
  - Mark required vs optional props
  - Helps catch integration bugs early

---

## ANTI-PATTERNS (Never Do)

### Registry Violations

- [ ] ✅ **NOT skipping registry registration**
  - Example ❌: Creating component but forgetting to register in `stateRegistry.js`
  - Example ✅: Always register after creating component file
  - Consequence: Component won't render, falls back to DefaultStateComponent

- [ ] ✅ **NOT using wrong registry**
  - Example ❌: Registering state component in `visualizationRegistry.js`
  - Example ✅: State components → `stateRegistry.js`, Visualizations → `visualizationRegistry.js`
  - Consequence: Component selection fails

### Component Organization Violations (ADR-002)

- [ ] ✅ **NOT placing components in wrong directory**
  - Example ❌: Putting `BinarySearchState.jsx` in `visualizations/` directory
  - Example ✅: Algorithm-specific → `algorithm-states/`, Reusable → `visualizations/`
  - Consequence: Confuses purpose, breaks mental model

- [ ] ✅ **NOT using wrong naming convention**
  - Example ❌: Naming state component `BinarySearch.jsx` (missing "State" suffix)
  - Example ✅: State components end with "State", visualizations end with "View"
  - Consequence: Unclear which components are reusable

### Static Mockup Violations

- [ ] ✅ **NOT ignoring static mockup designs**
  - Example ❌: Using different color scheme than mockup
  - Example ✅: Referencing mockup HTML files before styling components
  - Consequence: Inconsistent UI, design debt

- [ ] ✅ **NOT creating custom themes without approval**
  - Example ❌: Using blue theme when mockup shows slate
  - Example ✅: Using exact Tailwind classes from mockup reference
  - Consequence: Visual inconsistency across algorithms

### LOCKED Element Violations

- [ ] ✅ **NOT modifying modal keyboard shortcuts**
  - Example ❌: Changing prediction modal to use `a`, `b`, `c` instead of `1`, `2`, `3`
  - Example ❌: Using `s` key for "save" or "submit" (reserved for Skip in Prediction Modal)
  - Example ✅: Using documented shortcuts without modification
  - Consequence: Breaks muscle memory, requires full testing cycle

- [ ] ✅ **NOT creating keyboard shortcut conflicts**
  - Example ❌: Adding `s` shortcut to algorithm state component (conflicts with Skip)
  - Example ❌: Using `1`, `2`, `3` for navigation (conflicts with Prediction choices)
  - Example ❌: Using `r` for "refresh" (conflicts with Restart in Completion Modal)
  - Example ✅: Check reserved shortcuts before implementing new keyboard features
  - Consequence: Unpredictable behavior, modal shortcuts stop working

- [ ] ✅ **NOT changing panel ratio**
  - Example ❌: Making right panel 50% width "because it looks better"
  - Example ✅: Preserving 60/40 ratio as documented
  - Consequence: Requires full regression testing

- [ ] ✅ **NOT breaking overflow pattern**
  - Example ❌: Using `overflow-x-auto` or allowing horizontal scroll
  - Example ✅: `overflow-y-auto` for vertical, `overflow-x-hidden` always
  - Consequence: Horizontal scroll breaks layout on small screens

### Context Usage Violations

- [ ] ✅ **NOT prop drilling when context available**
  - Example ❌: Passing `currentStep` through 3 component layers
  - Example ✅: Using `useNavigation()` hook directly in component
  - Consequence: Tight coupling, harder to refactor

- [ ] ✅ **NOT accessing context outside provider**
  - Example ❌: Using `useTrace()` in component not wrapped by `TraceProvider`
  - Example ✅: Verify component is within provider hierarchy
  - Consequence: Runtime error, undefined context

### Data Access Violations

- [ ] ✅ **NOT assuming data structure without checking**
  - Example ❌: Accessing `step.data.visualization.array[0].value` without null checks
  - Example ✅: Using optional chaining: `step?.data?.visualization?.array?.[0]?.value`
  - Consequence: Crashes on missing data

- [ ] ✅ **NOT hardcoding data paths**
  - Example ❌: Assuming pointers always exist: `const left = step.data.visualization.pointers.left`
  - Example ✅: Check existence: `const left = step.data.visualization.pointers?.left`
  - Consequence: Breaks when algorithm doesn't use pointers

### Narrative-Driven Design Violations

- [ ] ✅ **NOT implementing visualization without reading narrative**
  - Example ❌: Designing component based on code inspection alone
  - Example ✅: Reading all narratives first, extracting visual requirements
  - Consequence: Visualization doesn't match pedagogical intent

- [ ] ✅ **NOT ignoring "Frontend Visualization Hints" section**
  - Example ❌: Skipping backend's guidance on what to emphasize
  - Example ✅: Using hints to prioritize visual elements
  - Consequence: Misaligned emphasis, cognitive load mismatch

---

## FREE CHOICES (Developer Discretion)

### Component Implementation Details

- [ ] **Internal state management approach** (within ADR-003 guidelines)
  - Use `useState` for local component state
  - Use `useEffect` for side effects
  - Use `useMemo`/`useCallback` for performance optimization
  - Choice depends on component complexity

- [ ] **Styling specifics** (within theme constraints)
  - Tailwind utility class combinations
  - Spacing and padding adjustments
  - Border radius and shadow choices
  - Must stay within mockup theme palette

- [ ] **Animation and transition details**
  - Transition timing functions
  - Animation duration choices
  - Easing curves
  - Must support narrative flow, not distract

### Data Presentation Choices

- [ ] **Value formatting**
  - Decimal places for floats
  - Number formatting (commas, spaces)
  - Date/time formatting
  - Choose for readability

- [ ] **Label text**
  - Capitalization style
  - Label brevity vs clarity
  - Tooltip content
  - Choose for user understanding

### Component Structure Choices

- [ ] **Sub-component extraction**
  - When to extract helper components
  - File organization within algorithm-states/
  - Component composition patterns
  - Balance reusability with simplicity

- [ ] **Helper function organization**
  - Inline vs separate utility file
  - Pure functions vs component methods
  - Naming conventions
  - Choose for maintainability

---

## Testing Checklist

### Component Testing

- [ ] **Create testing plan for new algorithm**
  - Document test scenarios (happy path, edge cases, error states)
  - Identify critical user interactions to test
  - List data variations to verify (empty, single element, large dataset)
  - Plan for visual regression testing

- [ ] **Implement tests according to plan**
  - Test component renders without crashing
  - Test with various step data shapes
  - Test with missing/null data (graceful degradation)
  - Test prop updates trigger re-renders correctly

- [ ] **Test registry integration**
  - Verify `getStateComponent('algorithm-name')` returns correct component
  - Verify component renders when selected via algorithm switcher
  - Test fallback to DefaultStateComponent for unregistered algorithms

### Visual Testing

- [ ] **Static mockup compliance verified**
  - Side-by-side comparison with mockup HTML
  - Color palette matches exactly
  - Typography (font-family, sizes, weights) matches
  - Spacing and layout proportions match

- [ ] **Responsive behavior tested**
  - Test at multiple screen widths (mobile, tablet, desktop)
  - Verify panel ratio maintained
  - Verify overflow scrolling works
  - No horizontal scroll at any width

### Integration Testing

- [ ] **Algorithm switcher integration**
  - Algorithm appears in dropdown
  - Selecting algorithm loads correct state component
  - Switching between algorithms doesn't crash
  - State clears correctly on algorithm change

- [ ] **Navigation integration**
  - Step forward/backward updates component correctly
  - Jump to step works
  - First/last step buttons work
  - Keyboard shortcuts (Arrow keys) work

- [ ] **Prediction modal integration** (if algorithm has predictions)
  - Modal opens at correct steps
  - Choices render correctly (2-3 max)
  - Selection and submission work
  - Keyboard shortcuts (`1`, `2`, `3`, `Enter`) work

### Narrative Alignment Testing

- [ ] **Visual-narrative correspondence verified**
  - Each narrative step has corresponding visual state
  - Key data points from narrative are visible in UI
  - Transitions match narrative flow
  - No visual elements contradict narrative

- [ ] **Pedagogical effectiveness validated**
  - Can user follow algorithm logic from visualization alone?
  - Are decision points visually clear?
  - Does visual emphasis match narrative emphasis?
  - Is cognitive load reasonable?

---

## Example: Component Implementation Pattern

```jsx
import React from 'react';
import PropTypes from 'prop-types';

/**
 * MergeSortState - Displays algorithm-specific state for Merge Sort
 * 
 * Shows:
 * - Current recursion depth
 * - Active subarray boundaries
 * - Merge operation progress
 * 
 * Narrative-Driven Design:
 * - Emphasizes divide-and-conquer phases (from narrative)
 * - Highlights comparison operations (from narrative)
 * - Shows merge progress visually (from narrative hints)
 */
const MergeSortState = ({ step, trace }) => {
  // Early return for missing data (graceful degradation)
  if (!step?.data?.visualization) {
    return (
      <div className="text-gray-400 text-sm">
        No state data available for this step
      </div>
    );
  }

  // Extract visualization data (safe access with optional chaining)
  const { recursion_depth, subarray_bounds, merge_progress } = 
    step.data.visualization;

  return (
    <div className="space-y-4">
      {/* Recursion Depth - From narrative: "Track depth for divide phase" */}
      {recursion_depth !== undefined && (
        <div className="bg-slate-700/50 rounded-lg p-4">
          <h3 className="text-white font-semibold mb-2">Recursion Depth</h3>
          <div className="text-sm">
            <span className="text-gray-400">Current Level:</span>
            <span className="text-white font-mono ml-2">{recursion_depth}</span>
          </div>
        </div>
      )}

      {/* Subarray Bounds - From narrative: "Show divide boundaries" */}
      {subarray_bounds && (
        <div className="bg-slate-700/50 rounded-lg p-4">
          <h3 className="text-white font-semibold mb-2">Active Subarray</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Left:</span>
              <span className="text-white font-mono">{subarray_bounds.left}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Right:</span>
              <span className="text-white font-mono">{subarray_bounds.right}</span>
            </div>
          </div>
        </div>
      )}

      {/* Merge Progress - From narrative hints: "Visualize merge comparisons" */}
      {merge_progress && (
        <div className="bg-slate-700/50 rounded-lg p-4">
          <h3 className="text-white font-semibold mb-2">Merge Progress</h3>
          <div className="w-full bg-slate-600 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${merge_progress.percentage}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// PropTypes for type checking and documentation
MergeSortState.propTypes = {
  step: PropTypes.shape({
    data: PropTypes.shape({
      visualization: PropTypes.shape({
        recursion_depth: PropTypes.number,
        subarray_bounds: PropTypes.shape({
          left: PropTypes.number,
          right: PropTypes.number,
        }),
        merge_progress: PropTypes.shape({
          percentage: PropTypes.number,
        }),
      }),
    }),
  }).isRequired,
  trace: PropTypes.shape({
    metadata: PropTypes.shape({
      algorithm: PropTypes.string,
    }),
  }),
};

export default MergeSortState;
```

---

## Workflow Integration

**Stage 3: Frontend Integration**

1. ✅ Review this compliance checklist completely
2. ✅ Review Frontend ADRs (ADR-001, ADR-002, ADR-003)
3. ✅ Review project README.md for architecture
4. ✅ Review backend narratives for visualization insights
5. ✅ Create visualization plan based on narrative hints
6. ✅ Create state component in `algorithm-states/` directory
7. ✅ Register component in `stateRegistry.js`
8. ✅ Create/verify visualization component (reuse if possible)
9. ✅ Register visualization in `visualizationRegistry.js` (if new)
10. ✅ Create algorithm info markdown in `public/algorithm-info/`
11. ✅ Verify static mockup compliance
12. ✅ Create testing plan
13. ✅ Implement tests
14. ✅ Run all tests (unit + integration)
15. ✅ Complete this checklist
16. ✅ Submit PR with code + tests + checklist

**Next Stage:** Integration Testing (Stage 4)

---

## Time Estimates

- **ADR and Narrative Review:** 15 minutes
- **Visualization Planning:** 10 minutes
- **Component Implementation:** 30-45 minutes
- **Registry Registration:** 5 minutes
- **Algorithm Info Markdown:** 10 minutes
- **Testing Plan Creation:** 10 minutes
- **Test Implementation:** 15-20 minutes
- **Static Mockup Verification:** 10 minutes

**Total:** ~90-120 minutes for complete algorithm integration

---

## Key Reminders

**Your Focus:**
- ✅ Registry registration (state + visualization)
- ✅ Component organization (correct directories, naming)
- ✅ Static mockup compliance (theme, colors, typography)
- ✅ Narrative-driven design (read narratives first!)
- ✅ Testing (plan + implementation)

**Architecture Compliance:**
- ✅ Review ADRs before implementation
- ✅ Use context hooks (avoid prop drilling)
- ✅ Follow component structure patterns
- ✅ Respect LOCKED elements (shortcuts, panel ratio, overflow)
- ✅ Check keyboard shortcut conflicts (`s`, `1`, `2`, `3`, `r` reserved)

**Quality Standards:**
- ✅ Safe data access (optional chaining, null checks)
- ✅ PropTypes for all components
- ✅ Graceful degradation (handle missing data)
- ✅ Visual-narrative alignment

**Document Contradictions:**
- 🚨 If ADR conflicts with this checklist → Flag to PM
- 🚨 If ADR conflicts with README → Flag to PM
- 🚨 If README appears outdated → Flag to PM
- 🚨 Escalate before implementing conflicting requirements

---

**Remember:**
- Read narratives BEFORE designing components (narrative-driven approach)
- Register EVERY component you create (both registries)
- Verify mockup compliance BEFORE submitting (side-by-side comparison)
- Create tests BEFORE considering done (testing plan + implementation)
- Flag architectural conflicts IMMEDIATELY (don't implement contradictions)
