Ready to create the prompt template nextI will now create the **Prompt Template**.

This template is designed to be the "User Message" that you send to the LLM after loading the System Prompt. It acts as a container for the dynamic context (specific algorithm details, reference code, and checklists) while triggering the behaviors defined in the System Prompt.

It uses clear delimiters and placeholders (e.g., `{{VARIABLE}}`) to ensure the LLM distinguishes between instructions and context data.

```markdown
# Backend Tracer Generation - User Prompt Template

## 1. Task Definition
Generate the Stage 1 Backend Artifacts for the following algorithm.
**Target Algorithm:** `{{ALGORITHM_NAME}}`
**Visualization Type:** `{{VISUALIZATION_TYPE}}`

## 2. Input Specification
```json
{{ALGORITHM_SPECIFICATION_JSON}}
```

## 3. Context & Reference Materials

### A. Base Class (Immutable)
*Inherit from this class. Do not modify it.*
```python
{{BASE_TRACER_CODE}}
```

### B. Compliance Checklist (Locked Requirements)
*Strictly adhere to the LOCKED and CONSTRAINED sections.*
```markdown
{{BACKEND_CHECKLIST_EXCERPT}}
```

### C. Visualization Contract
*Ensure `data.visualization` matches this structure exactly.*
```markdown
{{VISUALIZATION_CONTRACT}}
```

### D. Reference Implementation (Few-Shot Example)
*Follow the patterns in this working tracer.*
```python
{{EXAMPLE_TRACER_CODE}}
```

### E. FAA Audit Criteria
*Ensure the narrative passes these arithmetic checks.*
```markdown
{{FAA_AUDIT_GUIDE}}
```

## 4. Execution Instructions

Based on the System Prompt rules and the context above, generate the following 4 artifacts:

1.  **`{{ALGORITHM_NAME_KEBAB}}_tracer.py`** (Complete class implementation)
2.  **`test_{{ALGORITHM_NAME_KEBAB}}_tracer.py`** (Unit tests with edge cases)
3.  **`docs/algorithm-info/{{ALGORITHM_NAME_KEBAB}}.md`** (Educational context)
4.  **Self-Validation Report** (Checklist verification)

**Constraints Reminder:**
*   **Stop Point:** Ready for FAA Audit. Do not proceed to frontend.
*   **Fail Loudly:** Raise `KeyError` if visualization data is missing in the narrative.
*   **Traceability:** Ensure every result field is explained in the narrative.
*   **Prediction:** Maximum 3 choices per question.

**Begin Generation:**
```

### How to Use This Pair

1.  **System Prompt**: Paste the artifact from the previous step into the "System Instructions" or "System Prompt" field of your LLM interface (or API call).
2.  **User Prompt**: Copy the template above. Replace the `{{PLACEHOLDERS}}` with your actual file content:
    *   `{{ALGORITHM_SPECIFICATION_JSON}}`: The JSON defining the new algorithm (inputs, outputs, edge cases).
    *   `{{BASE_TRACER_CODE}}`: Content of `backend/algorithms/base_tracer.py`.
    *   `{{BACKEND_CHECKLIST_EXCERPT}}`: Content of `docs/compliance/BACKEND_CHECKLIST.md`.
    *   `{{VISUALIZATION_CONTRACT}}`: The specific section from the checklist relevant to the viz type (e.g., Array vs Timeline).
    *   `{{EXAMPLE_TRACER_CODE}}`: A working example like `binary_search.py`.
    *   `{{FAA_AUDIT_GUIDE}}`: Content of `docs/compliance/FAA_PERSONA.md`.

This separation ensures the LLM knows *who* it is (System Prompt) separate from *what* it needs to do right now (User Prompt).