# Compliance Checklist System: Overview & Usage Guide

**Version:** 1.0  
**Created:** Session 17  
**Authority:** TENANT_GUIDE.md v1.0

---

## Purpose & Rationale

### The Problem

The Tenant Guide is a **dense, building code-style document** (~15,000 words). Asking developers to re-read the entire guide every time they add or update an algorithm is:

1. **Inefficient** - Takes 30+ minutes per reading
2. **Error-prone** - Easy to miss critical requirements
3. **Demotivating** - Feels like bureaucracy
4. **Unscalable** - Gets worse as guide grows

### The Solution

**Stakeholder-specific compliance checklists** that are:

1. **Targeted** - Backend devs don't need frontend rules
2. **Actionable** - Clear pass/fail criteria
3. **Concise** - 5-10 minutes to complete
4. **Feedback-generating** - Highlights brittle points in Tenant Guide

---

## The Three Checklists

### 1. Backend Compliance Checklist

**Target Audience:** Backend Python developers implementing algorithm tracers

**What It Covers:**

- LOCKED: Metadata structure, trace structure, base class requirements
- CONSTRAINED: Visualization data patterns (array/timeline/graph), prediction points
- FREE: Custom fields, step types, state names
- ANTI-PATTERNS: Contract violations, base class violations

**Key Focus:** Ensuring valid JSON that frontend can consume without custom parsing

**When to Use:**

- Before committing new algorithm tracer
- During code review
- When backend unit tests pass but frontend fails

---

### 2. Frontend UI/UX Compliance Checklist

**Target Audience:** Frontend React developers implementing UI components

**What It Covers:**

- LOCKED: Modal standards, panel layout, HTML IDs, keyboard shortcuts, auto-scroll, overflow pattern
- CONSTRAINED: Visualization component interface, prediction questions (≤3 choices), completion modal
- FREE: Component architecture, state management, performance optimizations

**Key Focus:** Ensuring UI matches static mockups and Tenant Guide standards

**When to Use:**

- Before committing new visualization component
- During UI code review
- When integration tests fail
- When visual regressions detected

---

### 3. QA & Integration Compliance Checklist

**Target Audience:** QA engineers, integration testers, LLM-driven automation

**What It Covers:**

- LOCKED: All 6 test suites (modals, layout, IDs, keyboard, auto-scroll, overflow)
- CONSTRAINED: Backend contract, visualization components, prediction mode, completion modal
- Cross-algorithm tests, responsive tests, performance tests, regression tests

**Key Focus:** End-to-end validation that everything works together

**When to Use:**

- Before merging feature branch
- Before production deployment
- After major refactoring
- For automated CI/CD pipelines

---

## How They Work Together

```
 ___________________________________________________________
|                       TENANT GUIDE                       |
|                   (Constitutional Framework)             |
|             "What is LOCKED, CONSTRAINED, and FREE"      |
|__________________________________________________________|
                          |
            +-------------+-------------+-----------------+
            |                           |                 |
            v                           v                 v
  +---------------------+   +---------------------+   +---------------------+
  |     Backend         |   |     Frontend        |   |     QA/Integ        |
  |     Checklist       |   |     Checklist       |   |     Checklist       |
  |---------------------|   |---------------------|   |---------------------|
  | [x] Metadata        |   | [x] Modals          |   | [x] E2E Tests       |
  | [x] Trace           |   | [x] Panels          |   | [x] Responsive      |
  | [x] Viz Data        |   | [x] IDs             |   | [x] Regression      |
  +---------------------+   +---------------------+   +---------------------+
            |                           |                 |
            +-------------+-------------+-----------------+
                          v
                 +---------------------+
                 |  [x] Algorithm      |
                 |      Approved for   |
                 |      Production     |
                 +---------------------+

```

---

## Workflow: Adding a New Algorithm

### Phase 1: Backend Implementation

**Developer Actions:**

1. Implement algorithm tracer (inherit from `AlgorithmTracer`)
2. Run backend unit tests
3. **Self-check:** Complete Backend Compliance Checklist
4. Submit PR with checklist attached

**Reviewer Actions:**

1. Review code
2. Verify Backend Compliance Checklist
3. Approve or request changes

**Outcome:** ✅ Valid JSON trace that follows contract

---

### Phase 2: Frontend Integration

**Developer Actions:**

1. Create or select visualization component
2. Register in visualization registry
3. Run frontend unit tests
4. **Self-check:** Complete Frontend UI/UX Compliance Checklist
5. Submit PR with checklist attached

**Reviewer Actions:**

1. Review code
2. Compare to static mockups
3. Verify Frontend Compliance Checklist
4. Approve or request changes

**Outcome:** ✅ UI component that matches standards

---

### Phase 3: QA Validation

**QA Engineer Actions:**

1. Run automated test suite (Suites 1-14)
2. Manual smoke test on 3 browsers
3. Complete QA & Integration Checklist
4. Document any issues

**Outcome:** ✅ Algorithm approved for merge OR ⌠Issues filed for fix

---

## Integration with LLM Workflow

### For AI-Assisted Development

**Include in LLM Context:**

```markdown
You are implementing [Algorithm Name] for the Algorithm Visualization Platform.

CRITICAL CONSTRAINTS:

- Follow TENANT_GUIDE.md Sections 1 (LOCKED) and 2 (CONSTRAINED)
- Use Backend Compliance Checklist to validate output
- Reference static mockups for visual standards

OUTPUT REQUIRED:

1. Algorithm tracer code
2. Completed Backend Compliance Checklist
3. Unit tests

STOP CONDITIONS:

- If checklist has >3 failures, request human review
- If base_tracer.py requires changes, STOP and reassess
```

**For LLM-Driven QA:**

```markdown
You are validating [Algorithm Name] for production readiness.

TASK:

- Run QA & Integration Checklist (Suites 1-14)
- Document PASS/FAIL for each test
- Generate issue tickets for failures

ACCEPTANCE CRITERIA:

- All LOCKED requirement tests must PASS
- All CONSTRAINED requirement tests must PASS
- Zero regressions in existing algorithms
```

---

## Feedback Loop: Improving the Tenant Guide

### When Checklists Reveal Issues

**Scenario 1: Checklist is Unclear**

```
Developer: "I don't understand what 'items-start + mx-auto' means"

Action:
1. Add visual example to checklist
2. Update Tenant Guide with clearer explanation
3. Reference static mockup for visual proof
```

**Scenario 2: Checklist is Too Strict**

```
Developer: "The 3-choice limit is impossible for my algorithm"

Action:
1. Review algorithm's prediction strategy
2. If truly impossible, discuss with team
3. Either: (a) Simplify question, OR (b) Update Tenant Guide with exception
4. Document decision in guide
```

**Scenario 3: Checklist Misses Something**

```
QA: "New bug not caught by any checklist"

Action:
1. Document bug
2. Add test case to appropriate checklist
3. Update Tenant Guide with new anti-pattern
4. Run regression test suite
```

**The Rule:** If a checklist item is questioned 2+ times, it's a signal to update the Tenant Guide.

---

## Best Practices

### For Developers

**DO ✅**

- Complete checklist BEFORE submitting PR
- Attach checklist to PR description
- Reference specific mockup sections
- Ask questions if checklist unclear
- Treat checklist as conversation starter

**DON'T âŒ**

- Skip checklist ("I know the guide")
- Check boxes without verification
- Treat checklist as bureaucracy
- Hide failures from team
- Modify checklist without approval

---

### For Reviewers

**DO ✅**

- Verify checklist against actual code
- Reference Tenant Guide sections
- Compare to static mockups
- Explain WHY requirements exist
- Suggest improvements to checklist

**DON'T âŒ**

- Rubber-stamp checklist
- Enforce rules not in guide
- Treat checklist as gotcha tool
- Approve with ≥3 checklist failures
- Skip visual comparison to mockups

---

### For QA Engineers

**DO ✅**

- Run full test suite (Suites 1-14)
- Test on multiple browsers/viewports
- Document exact failure conditions
- Propose checklist improvements
- Verify no regressions

**DON'T âŒ**

- Skip responsive testing
- Test only happy path
- Approve with LOCKED failures
- Add tests without guide update
- Test in isolation (always cross-algorithm)

---

## Metrics for Success

### Quantitative

- **Time to add new algorithm** - Target: <5 hours (Phases 1-3 combined)
- **Checklist completion time** - Target: <10 minutes per checklist
- **Regression rate** - Target: <5% of algorithm additions
- **Guide clarity score** - Target: <3 checklist questions per addition

### Qualitative

- **Developer confidence** - "I know what's expected"
- **Reviewer efficiency** - "I can quickly spot issues"
- **QA thoroughness** - "I know what to test"
- **Guide evolution** - "The guide gets better with each addition"

---

## Versioning & Maintenance

### Checklist Versioning

**Format:** `[Major].[Minor].[Patch]`

- **Major:** Breaking changes to Tenant Guide (new LOCKED requirements)
- **Minor:** New CONSTRAINED requirements, clarifications
- **Patch:** Typo fixes, formatting improvements

**Current Version:** 1.0.0 (Session 17)

### When to Update

**Immediate (within session):**

- Bug discovered not covered by checklist
- Checklist item demonstrably wrong

**Next session:**

- Clarity improvements
- New examples
- Visual diagram additions

**Next version:**

- New LOCKED requirements
- New algorithm types (graph, tree)
- New stakeholder checklists (e.g., DevOps)

---

## File Organization

```
docs/
├── TENANT_GUIDE.md                        # Master document
├── compliance/
│   ├── BACKEND_CHECKLIST.md               # Backend developers
│   ├── FRONTEND_CHECKLIST.md              # Frontend developers
│   ├── QA_INTEGRATION_CHECKLIST.md        # QA engineers
│   └── CHECKLIST_SYSTEM_OVERVIEW.md       # This document
└── static_mockup/
    ├── algorithm_page_mockup.html         # Visual reference
    ├── prediction_modal_mockup.html       # Visual reference
    └── completion_modal_mockup.html       # Visual reference
```

---

## FAQ

### Q: Do I need to read the entire Tenant Guide?

**A:** Only once (when onboarding). After that, use the appropriate checklist for your role. Reference the guide when checklist items are unclear.

---

### Q: What if I disagree with a checklist item?

**A:** Raise it with the team! Checklists are living documents. If 2+ people question the same item, it's a signal to update the guide.

---

### Q: Can I modify a checklist for my specific algorithm?

**A:** No. Checklists are standardized across all algorithms. If your algorithm truly can't comply, discuss with team BEFORE implementation.

---

### Q: What if frontend checklist fails but my code works?

**A:** "It works" isn't the standard—compliance with the guide is. The checklist catches issues that will become bugs later.

---

### Q: How do I use checklists with an LLM?

**A:** Include the relevant checklist in your LLM context with the Tenant Guide. Instruct the LLM to validate its output against the checklist before presenting.

---

## Next Steps

### For This Session (17)

1. ✅ **Checklists created** (Backend, Frontend, QA)
2. 🎯 **Next:** Use Backend + Frontend checklists to audit existing algorithms (Binary Search, Interval Coverage)
3. ðŸ"‹ **Document findings** - Do they pass? What needs fixing?

### For Next Session (18)

1. **Refactor based on audit** - Bring algorithms into compliance
2. **Update Tenant Guide** - Add any missing standards discovered
3. **Finalize checklist system** - Based on real-world usage

---

## Success Criteria for Checklist System

**The checklist system is successful if:**

✅ **Efficiency** - Developers spend <10 min per checklist  
✅ **Clarity** - <3 questions per algorithm addition  
✅ **Consistency** - All algorithms look/feel the same  
✅ **Feedback** - Guide improves with each use  
✅ **Scalability** - Adding 5th algorithm easier than 2nd  
✅ **Confidence** - Team trusts the process

---

**Remember:** These checklists are tools for collaboration, not gatekeeping. Use them to ensure quality, not to slow down development.
