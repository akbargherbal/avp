# Frontend Developer Checklist: Algorithm Integration Compliance

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

### Static Mockup Compliance & Template Philosophy

#### Template Selection & Usage

- [ ] **Correct template identified**

  - Determine if algorithm is recursive or iterative
  - Iterative algorithms → `iterative_metrics_algorithm_mockup.html` (loop-based, ≤6 numeric state variables)
  - Recursive algorithms → `recursive_context_algorithm_mockup.html` (self-calling, call stack context)
  - Template studied thoroughly before implementation

- [ ] **Existing template dashboard reviewed thoroughly**

  - ⚠️ **CRITICAL:** Review existing dashboard in template BEFORE designing alternatives
  - Most algorithms fit existing dashboard structure (5-zone iterative or call stack recursive)
  - Existing dashboard is often better than initial custom designs
  - Only propose alternatives if existing dashboard genuinely doesn't fit
  - Document why existing dashboard is insufficient (if creating custom)

- [ ] **Template philosophy understood**

  - Templates are foundation, not rigid constraint
  - Templates provide architectural locking and design consistency
  - Deviations allowed when pedagogical clarity requires it
  - All deviations must be documented with reasoning

- [ ] **Template adaptation documented** (if deviating from base)
  - Why does this algorithm need deviation?
  - What pedagogical goal does deviation serve?
  - What template elements remain unchanged?
  - What template elements modified and why?
  - Deviation approved by team/PM before implementation

#### Visual Design Compliance

- [ ] **Visual design matches approved templates**

  - Reference: `docs/static_mockup/algorithm_page_mockup.html`
  - Theme consistency verified (slate-800 background, slate-700 panels)
  - Color palette matches existing algorithms
  - Font sizes and spacing match mockup
  - Typography correct (font-mono for values, font-sans for labels)

- [ ] **Algorithm-specific mockup created and approved**

  - File location: `docs/static_mockup/{algorithm-name}-{template-type}.html`
  - Mockup uses base template as starting point
  - Mockup populated with real data from JSON payload
  - Mockup demonstrates representative algorithm state
  - Side-by-side comparison with base template performed
  - Approval obtained before implementation

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

#### Backend Narrative Review (Foundation)

- [ ] **Backend narrative reviewed thoroughly**
  - File location: `docs/narratives/{algorithm-name}/`
  - All example scenarios reviewed
  - ⚠️ **IMPORTANT:** Take narrative seriously—backend engineer invested significant effort
  - Narrative contains: self-checks, mathematical accuracy, pedagogical explanations
  - Identify key data points mentioned in narrative
  - Identify state transitions described in narrative
  - Identify decision points requiring visual emphasis
  - Note: Narrative provides helpful context—JSON is definitive source of truth

#### JSON Payload Deep Analysis (CRITICAL)

- [ ] **JSON payload analyzed as primary source**

  - ⚠️ **WARNING:** JSON is the driving engine and source of truth
  - ⚠️ **BALANCE:** Don't ignore narrative—use it to understand pedagogical intent
  - Pull complete trace data for analysis
  - Review `step.data.visualization` structure for ALL step types
  - Review `step.data` fields beyond visualization
  - Cross-reference JSON structure with narrative descriptions
  - Document what's available vs. what narrative suggests
  - Identify gaps between narrative and actual data

- [ ] **Narrative-JSON synthesis completed**

  - Use narrative to understand "why" (pedagogical goals)
  - Use JSON to understand "what" (available data)
  - Don't duplicate work—if narrative clearly explains something, use it
  - Don't blindly trust narrative—always verify against JSON
  - Leverage backend engineer's work (narratives are carefully crafted)

- [ ] **Data-driven visualization plan created**
  - List metrics emphasized (from JSON, validated by narrative)
  - List transitions to communicate (based on JSON progression)
  - List data relationships to show (pointers, ranges, comparisons)
  - Map JSON fields to visual components
  - Verify no algorithm logic reimplementation in frontend

#### Component Design Validation

- [ ] **Component design supports narrative flow**
  - Visual states match narrative descriptions
  - Transitions reflect narrative temporal coherence
  - Data visibility matches narrative references
  - No visual elements without narrative justification
  - Pedagogical clarity prioritized over template compliance

### Per-Algorithm Deep Dive Workflow (CRITICAL)

**⚠️ MANDATORY PROCESS - Complete BEFORE touching any code**

For each algorithm, follow this exact sequence:

#### Step 1: Read Backend Narrative Thoroughly

- [ ] **Narrative reviewed for pedagogical intent**
  - File location: `docs/narratives/{algorithm-name}/`
  - ⚠️ **IMPORTANT:** Backend engineer invested significant effort in narrative quality
  - Review self-checks, mathematical accuracy, pedagogical explanations
  - Identify algorithm's pedagogical goals (what should students learn?)
  - Document key decision points (where does algorithm make choices?)
  - Note state transitions (how does algorithm progress?)
  - Extract learning moments (what's the "aha!" for students?)
  - Use narrative to understand the "why" behind the algorithm

#### Step 2: Analyze JSON Payload Deeply (MOST CRITICAL STEP)

- [ ] **JSON structure analyzed completely**

  - Pull live trace data: `curl -X POST http://localhost:5000/api/trace/unified -H "Content-Type: application/json" -d '{"algorithm": "{algorithm-name}", "input": {...}}' | jq '.' > /tmp/{algorithm-name}-trace.json`
  - Review all available fields in `step.data.visualization`
  - Review all available fields in `step.data` (beyond visualization)
  - Document what data is available at each step type
  - Identify edge cases (null values, initial state, completion state)

- [ ] **Data availability mapped to visualization needs**

  - List all metrics available in JSON payload
  - Categorize metrics: essential vs. nice-to-have
  - Identify which metrics serve pedagogical goals
  - Document missing data (if any) and impact on visualization
  - Verify backend contract matches narrative descriptions

- [ ] **Critical pitfalls avoided**

  - [ ] Not saying too little (underwhelming student with sparse visualization)
  - [ ] Not saying too much (overwhelming student with excessive information)
  - [ ] Not reimplementing algorithm logic in frontend (use JSON data, don't recalculate)
  - [ ] Not ignoring spatial constraints (dashboard is ~384px × 400px)

- [ ] **Strategic balance achieved**
  - Visualization tells the algorithm's story (not just displays data)
  - Information density appropriate for space constraints
  - Pedagogical narrative clear from visual progression
  - JSON payload utilized effectively (don't reinvent the wheel)

#### Step 3: Review Existing Templates & Create Visualization Outline

- [ ] **Existing template dashboard reviewed first**

  - ⚠️ **MANDATORY:** Review existing dashboard in template BEFORE sketching anything new
  - Open `iterative_metrics_algorithm_mockup.html` or `recursive_context_algorithm_mockup.html`
  - Study the 5-zone dashboard (iterative) or call stack structure (recursive)
  - Determine if existing dashboard meets your algorithm's needs
  - Existing solutions are often superior to initial custom designs
  - Only proceed with custom design if existing dashboard genuinely doesn't fit

- [ ] **Written outline created (if using existing template)**

  - What data will be displayed in each zone?
  - How will algorithm-specific data map to the 5 zones (iterative)?
  - What's the pedagogical narrative at each step type?
  - Which metrics deserve visual emphasis?
  - How will state transitions be communicated?

- [ ] **Custom design justification documented (if deviating)**

  - Why doesn't the existing dashboard fit?
  - What specific pedagogical need requires custom design?
  - What elements from existing template will be preserved?
  - What new elements are being introduced and why?

- [ ] **Outline answers key questions**
  - Does this visualization teach the algorithm effectively?
  - Is cognitive load reasonable for target audience?
  - Are spatial constraints respected?
  - Does every visual element serve a pedagogical purpose?

#### Step 4: Create Static Mockup

- [ ] **Standalone HTML mockup created**

  - File location: `docs/static_mockup/{algorithm-name}-{template-type}.html`
  - Use representative step from narrative (typically mid-algorithm)
  - Populate with actual data from JSON payload (not placeholder data)
  - Verify mockup renders correctly in browser
  - Side-by-side comparison with base template

- [ ] **Mockup quality standards met**
  - All zones/sections populated with real data
  - Typography hierarchy clear and readable
  - Color semantics appropriate for algorithm
  - No visual clutter or confusion
  - Spatial constraints respected

#### Step 5: Get Approval & Proceed

- [ ] **Mockup approval obtained**

  - Team/PM review scheduled
  - Visualization outline reviewed
  - Design decisions documented
  - Approval documented (meeting notes, chat, etc.)

- [ ] **Implementation gate passed**
  - Static mockup approved
  - All questions about JSON data resolved
  - Clear understanding of what to show vs. omit
  - Ready to write component code

**⚠️ DO NOT PROCEED TO IMPLEMENTATION WITHOUT COMPLETING ALL STEPS ABOVE**

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
  - Input parameters: `trace.metadata.input`
  - Visualization config: `trace.metadata.visualization_config`
  - Prediction config: `trace.metadata.prediction_config`

### Error Handling and Edge Cases

- [ ] **Graceful degradation implemented**

  - Handle missing `step.data.visualization` gracefully
  - Display fallback UI when data unavailable
  - No crashes on null/undefined data
  - User-friendly error messages (avoid technical jargon)

- [ ] **Edge cases handled**
  - Initial step (before algorithm starts)
  - Final step (after algorithm completes)
  - Empty input arrays
  - Single-element arrays
  - Null/undefined pointers

### Performance Considerations

- [ ] **Rendering performance optimized**

  - Use `React.memo()` for expensive components
  - Avoid unnecessary re-renders (check dependencies in hooks)
  - Use `useMemo()` for expensive calculations
  - Use `useCallback()` for callback props

- [ ] **Data transformation efficient**
  - Transform data once, not on every render
  - Cache derived values with `useMemo()`
  - Avoid deep object copying in render

### Accessibility (a11y)

- [ ] **Keyboard navigation supported**

  - All interactive elements keyboard accessible
  - Focus states visible
  - Tab order logical
  - Keyboard shortcuts documented

- [ ] **Screen reader support**
  - Semantic HTML elements used
  - ARIA labels provided where needed
  - Important state changes announced
  - Visual information has text alternatives

### Styling and Visual Consistency

- [ ] **Tailwind CSS used consistently**

  - Use existing utility classes
  - Follow project color palette (slate-700, slate-800)
  - Use existing spacing scale (p-4, mb-2, etc.)
  - Avoid inline styles unless necessary

- [ ] **Typography hierarchy maintained**

  - Headers: `text-white font-semibold`
  - Labels: `text-gray-400 text-sm`
  - Values: `text-white font-mono`
  - Descriptions: `text-gray-300 text-sm`

- [ ] **Color semantics appropriate**
  - Success/positive: green-500
  - Error/negative: red-500
  - Warning: yellow-500
  - Info/neutral: blue-500
  - Current/active: amber-400

---

## TESTING REQUIREMENTS

### Unit Testing

- [ ] **Component unit tests created**

  - File location: `frontend/src/components/algorithm-states/__tests__/{AlgorithmName}State.test.jsx`
  - Test component renders without crashing
  - Test with valid step data
  - Test with missing data (graceful degradation)
  - Test edge cases (null pointers, empty arrays)

- [ ] **PropTypes validation tested**
  - Test required props missing (should not crash)
  - Test optional props missing (should use defaults)
  - Test invalid prop types (should show console warning in dev)

### Integration Testing

- [ ] **Registry integration verified**

  - Component accessible via `getStateComponent('algorithm-name')`
  - No errors when component loaded dynamically
  - Component receives correct props from StatePanel

- [ ] **Context integration verified**

  - Component receives data from TraceContext
  - Component receives navigation state from NavigationContext
  - Component responds to prediction mode changes (if applicable)

- [ ] **Visualization integration verified**
  - Visualization component renders correctly
  - Data flows from state component to visualization
  - Highlight coordination works (if applicable)

### Manual Testing Checklist

- [ ] **Visual regression testing**

  - Compare side-by-side with static mockup
  - Verify colors, spacing, typography match
  - Test at different viewport sizes (1920x1080, 1366x768)
  - No layout shifts or visual glitches

- [ ] **Functional testing**

  - Algorithm executes without errors
  - Step navigation works (next/prev/first/last)
  - Keyboard shortcuts work
  - Prediction modal integration works (if applicable)
  - Completion modal shows correctly

- [ ] **Data accuracy testing**
  - Visual state matches backend trace data
  - Pointers update correctly
  - Metrics display correct values
  - State transitions match narrative

### Cross-Browser Testing

- [ ] **Browser compatibility verified**
  - Chrome (latest)
  - Firefox (latest)
  - Safari (latest, if possible)
  - Edge (latest, if possible)

### Testing Matrix

Test with multiple input scenarios:

- [ ] **Typical case** (medium-sized input, target found/goal achieved)
- [ ] **Edge case: Small input** (1-3 elements)
- [ ] **Edge case: Large input** (20+ elements)
- [ ] **Edge case: Empty input** (if applicable)
- [ ] **Edge case: Target not found** (if applicable - search algorithms)
- [ ] **Edge case: Already sorted** (if applicable - sorting algorithms)

### Navigation Testing

- [ ] **Step navigation verified**

  - Next step button works
  - Previous step button works
  - First step button works
  - Last step button works
  - Jump to step works
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
import React from "react";
import PropTypes from "prop-types";

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
              <span className="text-white font-mono">
                {subarray_bounds.left}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Right:</span>
              <span className="text-white font-mono">
                {subarray_bounds.right}
              </span>
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
5. ✅ Analyze JSON payload deeply (pull trace data, document structure)
6. ✅ Create visualization outline (what to show, how to map, what to omit)
7. ✅ Create static mockup with real data
8. ✅ Get mockup approval before coding
9. ✅ Create state component in `algorithm-states/` directory
10. ✅ Register component in `stateRegistry.js`
11. ✅ Create/verify visualization component (reuse if possible)
12. ✅ Register visualization in `visualizationRegistry.js` (if new)
13. ✅ Create algorithm info markdown in `public/algorithm-info/`
14. ✅ Verify static mockup compliance
15. ✅ Create testing plan
16. ✅ Implement tests
17. ✅ Run all tests (unit + integration)
18. ✅ Complete this checklist
19. ✅ Submit PR with code + tests + checklist

**Next Stage:** Integration Testing (Stage 4)

---

## Time Estimates

- **ADR and Architecture Review:** 15 minutes
- **Narrative Review:** 10 minutes
- **JSON Payload Deep Analysis:** 20-30 minutes
- **Visualization Outline Creation:** 15 minutes
- **Static Mockup Creation:** 30-45 minutes
- **Mockup Approval Meeting:** 15-30 minutes
- **Component Implementation:** 30-45 minutes
- **Registry Registration:** 5 minutes
- **Algorithm Info Markdown:** 10 minutes
- **Testing Plan Creation:** 10 minutes
- **Test Implementation:** 15-20 minutes
- **Static Mockup Verification:** 10 minutes

**Total:** ~3-4 hours for complete algorithm integration

---

## Key Reminders

**Your Focus:**

- ✅ Registry registration (state + visualization)
- ✅ Component organization (correct directories, naming)
- ✅ Static mockup compliance (theme, colors, typography)
- ✅ Review existing templates first (often better than custom designs)
- ✅ Respect narrative quality (backend engineer's pedagogical work)
- ✅ JSON-driven design (analyze payload deeply, don't reimplement logic)
- ✅ Mockup-first workflow (create and get approval before coding)
- ✅ Template flexibility (deviate when pedagogical clarity requires it)
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
- ✅ Balance information density (not too little, not too much)
- ✅ Respect spatial constraints (~384px × 400px dashboard)

**Critical Workflow Gates:**

- 🚨 DO NOT CODE without JSON analysis
- 🚨 DO NOT CODE without visualization outline
- 🚨 DO NOT CODE without static mockup approval
- 🚨 If ADR conflicts with this checklist → Flag to PM
- 🚨 If ADR conflicts with README → Flag to PM
- 🚨 If README appears outdated → Flag to PM
- 🚨 Escalate before implementing conflicting requirements

**Document Contradictions:**

- 🚨 If ADR conflicts with this checklist → Flag to PM
- 🚨 If ADR conflicts with README → Flag to PM
- 🚨 If README appears outdated → Flag to PM
- 🚨 Escalate before implementing conflicting requirements

---

**Remember:**

- JSON payload is the driving engine - narrative is helpful but JSON is definitive
- Narrative contains valuable work - respect backend engineer's effort (self-checks, pedagogy, accuracy)
- Use narrative for "why" (pedagogical intent) and JSON for "what" (actual data)
- Review existing templates FIRST - they often meet your needs and are well-designed
- Only create custom dashboards if existing templates genuinely don't fit
- Create mockup before code - get approval on design before implementation
- Balance is key - not too little (underwhelming), not too much (overwhelming)
- Templates are guidelines - deviate when pedagogical clarity requires it
- Read narratives BEFORE designing components (narrative-driven approach)
- Register EVERY component you create (both registries)
- Verify mockup compliance BEFORE submitting (side-by-side comparison)
- Create tests BEFORE considering done (testing plan + implementation)
- Flag architectural conflicts IMMEDIATELY (don't implement contradictions)
