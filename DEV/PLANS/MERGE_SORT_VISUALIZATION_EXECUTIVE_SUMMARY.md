# Executive Summary: Merge Sort Visualization Prototype Selection

**Document Type:** Technical Recommendation  
**Date:** December 20, 2025  
**Prepared For:** Management Review & Approval  
**Prepared By:** Frontend Architecture Team  
**Subject:** Left-Panel Visualization Strategy for Merge Sort Algorithm  

---

## Decision Required

**Which visualization prototype should be implemented for the Merge Sort algorithm's left-panel display?**

Three prototypes were commissioned and evaluated against the platform's core objectives:
- **Daisy (Prototype 01):** Dual-concept layout (Macro + Micro views)
- **Iris (Prototype 02):** Hybrid timeline with active merge stage
- **Jasmine (Prototype 03):** Data-rich hierarchical view

---

## Recommendation

**Approve: Jasmine (Prototype 03) - Data-Rich Hierarchical View**

### Strategic Rationale

Jasmine achieves the highest alignment with our platform's educational mission and architectural principles:

| Evaluation Criterion | Weight | Jasmine Score | Justification |
|---------------------|--------|---------------|---------------|
| **Pedagogical Value** | 40% | 9.0/10 | Shows actual data flow; explicit depth labels; transparent decision logic |
| **Platform Philosophy** | 15% | 9.0/10 | Data-driven design; narrative-faithful; learning-first approach |
| **Developer Experience** | 15% | 8.0/10 | Clear JSON mapping; testable components; explicit structure |
| **Compatibility** | 20% | 7.0/10 | Requires new component but justified by educational gains |
| **Scalability** | 10% | 6.5/10 | Acceptable with overflow handling |
| **WEIGHTED TOTAL** | 100% | **8.2/10** | **Leading candidate** |

**Comparison:**
- Iris: 7.5/10 (strong compatibility, weaker pedagogy)
- Daisy: 6.35/10 (unresolved design decisions)

---

## Key Differentiators: Why Jasmine Wins

### 1. Superior Learning Outcomes (Primary Objective)

**Jasmine uniquely addresses our narrative guidance:**

> *"Show how the array splits down to single elements, then merges back up. The most important pedagogical moments are: (1) the base case (single elements are sorted), and (2) the merge comparison (always take the smaller front element)."*  
> — Backend Narrative, Merge Sort Example 1

**Implementation:**
- **Actual Data Visibility:** Shows `[38, 27, 43, 3]` → `[38, 27]` → `[38]` (concrete values), not abstract index ranges `[0...3]`
- **Explicit Recursion Depth:** Uses `DEPTH 0`, `DEPTH 1`, `DEPTH 2` labels removing ambiguity
- **Boolean Comparison Logic:** Displays `27 > 3` → `FALSE` → `Take 3 from right` making decisions transparent
- **Call Stack Context:** Ancestry section shows where the current operation sits in the recursion tree

**Competitive Weakness:**
- Iris shows polished animations but obscures data behind abstract timeline bars
- Daisy uses index ranges that don't reveal what's being sorted

### 2. Alignment with Platform Philosophy

**Core Principle (from Platform README):**
> "Backend does the thinking (traces, predictions, narratives), frontend reacts (visualizes, navigates, asks questions)"

**Jasmine's Fidelity:**
- Directly visualizes backend's `all_intervals`, `call_stack_state`, and `depth` data
- No frontend logic reimplementation—pure data rendering
- 1:1 correspondence between narrative Step 20 and visual display

**Risk Mitigation:**
- Iris prioritizes "slide-deck style" polish (documented anti-pattern)
- Daisy leaves critical design decisions ("Can we fit both?") unresolved

### 3. Developer Experience & Maintainability

**Clear Component Architecture:**
```
visualizations/
  ├── RecursionHierarchyView.jsx  (reusable for DFS, BFS, Backtracking)
  └── MergeCompareView.jsx        (reusable for any merge-based algorithm)

algorithm-states/
  └── MergeSortState.jsx          (orchestration layer)
```

**Benefits:**
- Each section maps to explicit JSON paths (no ambiguity)
- Components testable in isolation
- Reusable for future recursive algorithms (DFS, Quicksort, etc.)

**Development Estimate:** 90-120 minutes (standard timeline per FRONTEND_CHECKLIST.md)

---

## Risk Analysis & Mitigation

### Risk 1: Lower Compatibility Score (7/10)

**Concern:** Jasmine requires a new `RecursionHierarchyView` component (no existing equivalent).

**Mitigation:**
- **Justified Investment:** Educational value (+40% weight) outweighs short-term compatibility concerns
- **Long-Term ROI:** Hierarchical view reusable for 5+ future algorithms (DFS, BFS, Backtracking, Quicksort, Tree Traversals)
- **Precedent:** Platform already created custom `TimelineView` for Interval Coverage—same pattern applies

**Management Question:** *Do we optimize for immediate compatibility or long-term pedagogical quality?*  
**Answer:** Our mission statement prioritizes student learning outcomes.

### Risk 2: Scalability Concerns (6.5/10)

**Concern:** Ancestry section vertical space grows with array depth.

**Mitigation:**
- **Constraint Acknowledged:** Panel already has `overflow-y-auto` for scrollable content
- **Practical Limit:** Merge Sort on 16 elements = depth 4 (manageable)
- **Future Optimization:** Collapsible ancestry sections if needed (deferred to Phase 4)

**Competitive Context:**
- Iris's timeline has hardcoded grid divisions (worse scalability)
- Daisy explicitly notes scrolling requirement ("panel is scrollable")

### Risk 3: Development Timeline

**Concern:** New component creation extends implementation time.

**Counter:**
- Iris also requires custom integration work (adapting timeline to merge sort context)
- Daisy's unresolved design decisions create hidden timeline risk
- Jasmine's clear structure reduces debugging cycles

**Net Impact:** Marginal (+10-15 minutes) within acceptable variance.

---

## Alternatives Considered & Rejected

### Alternative 1: Iris (Prototype 02)

**Strengths:**
- High compatibility (8.5/10) with existing `TimelineView`
- Visual polish and animations
- Faster initial implementation

**Fatal Weakness:**
- **Pedagogical compromise:** Hides actual data behind abstract timeline bars
- Violates narrative guidance: *"show elements moving from left/right into merged result"*
- Timeline bars show index ranges, not the sorting process itself

**When to Reconsider:** If timeline visualization becomes a strategic requirement for other algorithms (not currently roadmapped).

### Alternative 2: Daisy (Prototype 01)

**Strengths:**
- Concept separation (macro vs. micro) aligns with some learning theories

**Fatal Weaknesses:**
- **Unresolved Design:** Prototype ends with "Can we fit both?" question
- **Abstract Labels:** `[0...7] Splitting` doesn't show what's being sorted
- **Developer Ambiguity:** No clear guidance on space allocation or priority

**When to Reconsider:** As a supplementary toggle view for advanced users (deferred to future enhancement).

---

## Implementation Plan (Contingent on Approval)

### Stage 1: Static Mockup Creation (FAA Gate Requirement)
**Timeline:** 15 minutes  
**Deliverable:** Jasmine adapted to match `iterative_metrics_algorithm_mockup.html` theme  
**Gate:** FAA approval before proceeding to implementation

### Stage 2: Component Development
**Timeline:** 90-120 minutes  
**Tasks:**
1. Create `RecursionHierarchyView.jsx` (60 min)
2. Create `MergeCompareView.jsx` (30 min)
3. Integrate in `MergeSortState.jsx` (30 min)
4. Register in `visualizationRegistry.js` (5 min)

### Stage 3: Quality Assurance
**Timeline:** 30 minutes  
**Testing:**
- Visual-narrative correspondence validation
- Responsive behavior (multiple screen widths)
- Keyboard shortcut conflict verification
- Edge case handling (1-element arrays, duplicates)

### Stage 4: Documentation
**Timeline:** 20 minutes  
**Deliverables:**
- Component PropTypes documentation
- Usage examples in algorithm info markdown
- Reusability notes for future algorithms

**Total Estimated Duration:** 155-185 minutes (within standard 90-120 min + testing variance)

---

## Success Metrics

**Quantitative (Measurable Post-Launch):**
1. **Prediction Accuracy:** ≥70% correct answers on merge sort prediction questions
2. **Completion Rate:** ≥85% of users complete full merge sort trace
3. **Time-to-Understanding:** <5 minutes for first successful prediction (baseline TBD)

**Qualitative (Developer Feedback):**
1. Component reuse rate for future recursive algorithms
2. Bug report frequency vs. other algorithm visualizations
3. Maintenance cost (hours spent on updates/fixes)

**Student Outcomes (If User Testing Available):**
1. Ability to trace merge sort on paper after platform interaction
2. Explanation quality: Can students articulate "why take the smaller element?"

---

## Budget & Resource Impact

**Development Cost:**
- **Engineer Time:** 3-4 hours (within sprint allocation)
- **QA Time:** 1 hour (standard testing cycle)
- **FAA Review:** 30 minutes (existing workflow)

**Ongoing Cost:**
- **Maintenance:** Negligible (follows established patterns)
- **Reusability Dividend:** -50% development time for next recursive algorithm

**Net ROI:** Positive within 2 algorithm implementations.

---

## Recommendation Summary

**Approve Jasmine (Prototype 03)** for implementation as the Merge Sort left-panel visualization.

**Justification in Three Points:**

1. **Educational Excellence:** Highest pedagogical value (9/10) through concrete data visibility, explicit depth labels, and transparent decision logic
2. **Strategic Alignment:** Best fit with platform philosophy (data-driven, narrative-faithful, learning-first)
3. **Long-Term Investment:** Creates reusable `RecursionHierarchyView` component for 5+ future algorithms

**Accept Tradeoffs:**
- Lower immediate compatibility (7/10) justified by educational gains
- Manageable scalability concerns (6.5/10) with documented mitigation

**Reject Alternatives:**
- Iris: Prioritizes aesthetics over learning outcomes
- Daisy: Unresolved design decisions create implementation risk

---

## Decision Point

**For Management Approval:**

- [ ] **APPROVED:** Proceed with Jasmine implementation per plan above
- [ ] **APPROVED WITH MODIFICATIONS:** Proceed with changes (specify):
  ```
  _______________________________________________________________
  ```
- [ ] **REJECTED:** Implement alternative (specify Iris/Daisy and rationale):
  ```
  _______________________________________________________________
  ```
- [ ] **DEFERRED:** Request additional analysis (specify questions):
  ```
  _______________________________________________________________
  ```

**Approval Signatures:**

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Product Manager | __________ | __________ | ______ |
| Tech Lead | __________ | __________ | ______ |
| Frontend Architect | __________ | __________ | ______ |

---

## Appendices

### Appendix A: Detailed Scoring Matrix
*(See full technical analysis document for complete breakdown)*

### Appendix B: Prototype Screenshots
*(Visual comparison of all three prototypes - available on request)*

### Appendix C: Narrative Alignment Examples
*(Mapping between Step 20 narrative and Jasmine visualization)*

### Appendix D: Component Reusability Roadmap
*(Future algorithms that will benefit from RecursionHierarchyView)*

---

**Document Status:** Ready for Management Review  
**Next Action:** Approval decision required to proceed to Stage 1 (Static Mockup)  
**Questions/Contact:** Frontend Architecture Team

---

*This recommendation is based on objective analysis of three commissioned prototypes against established platform criteria. The decision balances immediate implementation concerns with long-term educational mission and technical scalability.*
