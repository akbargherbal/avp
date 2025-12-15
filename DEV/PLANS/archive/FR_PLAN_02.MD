✅ **Documentation Reviewed:**
- `WORKFLOW.md` v2.1 (Confirmed: FAA gate is BLOCKING at Stage 1.5)
- `PE_FEEDBACK.md` (Pedagogical requirements)
- `terminal.txt` (Project structure: `two_pointer.py` exists)

**Key Observations:**
- The Two Pointer algorithm is currently in the pipeline (Stage 1/1.5/2).
- The request is a **Pedagogical Refinement** of the narrative generation logic.
- **Constraint:** Changes must be reflected in `generate_narrative()`.
- **Risk:** Changing narrative logic requires a **mandatory FAA re-audit** (Stage 1.5) to ensure new text descriptions ("copying X to Y") match the arithmetic reality.

---

## Feature: Two Pointer Narrative Refinement

**Classification:** Feature Enhancement (Pedagogical Polish)
**Affected Tier:** CONSTRAINED (Narrative Logic)
**Status:** **APPROVED** for implementation.

**Technical Context:**
- Target: `backend/algorithms/two_pointer.py`
- Method: `generate_narrative(self, trace_result)`
- Current State: Narrative is too fragmented and uses internal codes.
- Goal: Atomic steps, explicit mutation descriptions, natural language.

**Stakeholders:**
- **Backend Developer** (Implementation)
- **FAA Auditor** (Re-verification of new quantitative claims)
- **QA Engineer** (Pedagogical compliance check)

---

### Execution Plan

#### Stage 1: Backend Implementation (BE) - 30 min

**Task:** Refactor `TwoPointerTracer.generate_narrative` to match pedagogical requirements.

**Requirements:**

1.  **Atomic Step Consolidation:**
    *   Combine Comparison + Decision + Action into single narrative blocks.
    *   *Do not* necessarily change the `trace` JSON steps (unless strictly needed), but *do* group them in the Markdown output.
    *   Pattern: "Because `nums[fast]` (X) != `nums[slow]` (Y), we increment slow and update."

2.  **Explicit Mutation Narration:**
    *   **MUST** describe the overwrite operation explicitly.
    *   Required phrasing pattern: "Copying value `{val}` from index `{fast}` to index `{slow}`, overwriting `{old_val}`."
    *   Avoid passive "Placed X at Y".

3.  **Natural Language State:**
    *   Map internal codes (`U`, `D`, `P`, `E`) to human-readable strings.
    *   Create a mapping dictionary within the method.
    *   **Constraint:** No single-letter codes in the final Markdown.

**Scaffolding Reference:**

```python
def generate_narrative(self, trace_result: dict) -> str:
    """
    Generate narrative with pedagogical refinements.
    
    Refinements per PE_FEEDBACK.md:
    1. Consolidate Compare/Decide/Act into atomic narrative blocks
    2. Explicitly describe data mutation (copy/overwrite)
    3. Map state codes to natural language
    """
    # TODO: Define state mapping
    # state_map = {'U': 'Unique Found', 'D': 'Duplicate', ...}
    
    # TODO: Iterate steps and group logically
    # If step is mutation, look back at previous comparison to form context
    
    pass # Backend: Implement logic
```

**Success Criteria:**
- Narrative reads as cohesive paragraphs, not disjointed log lines.
- "Overwriting" or "Copying" verbs are present in mutation steps.
- No `U`, `D`, `P`, `E` codes appear in the output.

---

#### Stage 1.5: FAA Audit (BLOCKING) - 15 min

**Task:** Re-verify arithmetic correctness of the *new* narrative text.

**Why:** We are changing the text description of operations (e.g., "Copying index 5 to index 2"). FAA must verify that the numbers at index 5 and index 2 actually match the claim.

**Process:**
- [ ] Generate new narratives: `python scripts/generate_narratives.py two-pointer`
- [ ] Verify "Copying X to Y" claims against the visualization array state.
- [ ] Verify indices cited in the "Atomic Units" match the pointers.

**Reference:** `docs/compliance/FAA_PERSONA.md`

---

#### Stage 2: QA Pedagogical Review - 15 min

**Task:** Verify compliance with `PE_FEEDBACK.md`.

**Checklist:**
- [ ] **Consolidation:** Do steps feel like atomic logical units?
- [ ] **Mutation:** Is the "overwrite" concept clear to a learner?
- [ ] **Clarity:** Are abstract codes gone?

---

**Total Time Investment:** ~1 hour
**Rollback Plan:** Revert `two_pointer.py` to previous git commit if narrative generation fails.