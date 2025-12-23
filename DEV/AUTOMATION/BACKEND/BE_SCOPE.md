## LLM Sandbox Definition: Stage 1 Backend Code Generator

### Boundary Definition

**IN SCOPE (What the LLM Controls)**
- Generate Python tracer class file
- Generate Python unit test file
- Generate algorithm-info markdown file
- Ensure internal consistency between these 3 artifacts
- Validate against provided compliance checklist
- Make architectural decisions within the tracer implementation
- Choose step types, state names, and custom fields
- Design narrative structure and visualization hints

**OUT OF SCOPE (What the LLM Does NOT Control)**
- Modifying `base_tracer.py`
- Modifying `registry.py` (registration happens later)
- Running FAA audit (manual stage)
- Running PE review (manual stage)
- Flask endpoint integration
- Frontend implementation
- Pipeline orchestration
- Deciding which algorithms to implement
- Cross-algorithm consistency decisions

---

### Input Contract

**Required Inputs:**
1. **Algorithm specification**
   - Algorithm name (string)
   - Algorithm description (string)
   - Input format specification (JSON schema or description)
   - Expected output specification (JSON schema or description)
   - Visualization type (array | timeline | graph | tree)

2. **Context documents**
   - BACKEND_CHECKLIST.md (compliance spec)
   - base_tracer.py (base class code)
   - 1-2 example tracer implementations
   - Visualization contract for specified type
   - Algorithm-info template/example

3. **Constraints**
   - Test coverage requirements (edge cases to handle)
   - Any algorithm-specific requirements

**Optional Inputs:**
- Prediction points specification (if interactive mode desired)
- Custom visualization config requirements
- Performance expectations

---

### Output Contract

**Required Outputs:**

1. **`[algorithm_name]_tracer.py`**
   - Complete Python class inheriting from `AlgorithmTracer`
   - Implements `execute(input_data)` method
   - Implements `_get_visualization_state()` method
   - Implements `generate_narrative(trace_result)` method
   - All methods fully functional (no placeholders)
   - Includes docstrings

2. **`test_[algorithm_name]_tracer.py`**
   - Unit tests for valid trace structure
   - Tests for visualization data completeness
   - Tests for edge cases (empty input, single element, etc.)
   - Tests for narrative generation (no exceptions)
   - Minimum 5 test cases

3. **`[algorithm_name].md`** (algorithm-info)
   - 150-250 words
   - Sections: What, Why, Complexity, Applications
   - No code snippets
   - Valid markdown syntax

4. **Self-validation report**
   - Checklist verification (which items passed/failed)
   - Known limitations or assumptions
   - Recommended manual review areas

---

### Quality Criteria (Success Conditions)

**Functional Requirements:**
- [ ] Code executes without syntax errors
- [ ] All unit tests pass
- [ ] Trace structure matches contract
- [ ] Visualization data complete for specified type
- [ ] Narrative generates without exceptions for all test cases
- [ ] No modifications to base_tracer.py required

**Compliance Requirements:**
- [ ] All LOCKED requirements from checklist satisfied
- [ ] All CONSTRAINED requirements for visualization type satisfied
- [ ] No ANTI-PATTERNS present
- [ ] Result field traceability verified (no phantom data)
- [ ] Visualization hints section included

**Documentation Requirements:**
- [ ] Algorithm-info within word limit
- [ ] Narrative includes temporal coherence
- [ ] All arithmetic claims internally consistent (pre-FAA)
- [ ] Docstrings present and accurate

---

### Failure Modes & Handling

**The LLM should explicitly flag if:**
1. **Ambiguous specification** - Input format unclear, cannot proceed
2. **Impossible constraints** - Requirements conflict (e.g., visualization type doesn't match algorithm nature)
3. **Missing context** - Required example or base class not provided
4. **Incomplete generation** - Could not complete all 3 artifacts due to complexity

**The LLM should NOT:**
1. Generate placeholder code ("TODO: implement later")
2. Make up visualization patterns not in contract
3. Modify base class assumptions
4. Generate code that depends on unspecified external libraries
5. Proceed silently when specifications conflict

---

### Sandbox Assumptions

**What the LLM can assume exists:**
- Python 3.8+ environment
- Standard library available
- `base_tracer.py` in same project structure
- JSON serialization available
- Markdown rendering available (for docs)

**What the LLM cannot assume:**
- External libraries (NumPy, etc.) unless explicitly stated
- Database connections
- File system write access (outputs are returned as strings)
- Network access
- Specific test framework version

---

### Interaction Protocol

**Single-shot generation (primary mode):**
```
INPUT → LLM → OUTPUT (3 files + validation report)
```

**Iterative refinement (optional):**
```
INPUT + FEEDBACK → LLM → REFINED OUTPUT
```
Where FEEDBACK is structured critique against checklist items

**No interaction:**
- LLM does not ask clarifying questions mid-generation
- All ambiguities must be resolved in INPUT specification
- LLM produces best effort or fails with clear error message

---

### Context Window Optimization

**Priority ordering for context (if token limit reached):**

1. **Must include (Core):**
   - BACKEND_CHECKLIST LOCKED + CONSTRAINED sections
   - base_tracer.py class definition
   - Visualization contract for specified type

2. **Should include (Quality):**
   - 1 complete example tracer
   - Algorithm-info template
   - FAA awareness statement

3. **Nice to have (Enhancement):**
   - 2nd example tracer
   - Additional checklist sections
   - Anti-pattern examples

**Truncation strategy:** Remove from bottom up if tokens constrained

---

### Validation Gates

**Pre-generation validation:**
- [ ] Algorithm name provided
- [ ] Visualization type specified
- [ ] Input/output formats defined
- [ ] Base class available

**Post-generation validation:**
- [ ] All 3 files generated
- [ ] Python syntax valid
- [ ] Checklist items addressed
- [ ] Self-validation report complete

**Handoff criteria:**
- Code + tests + docs ready for manual FAA/PE review
- No blocking errors in self-validation
- All required artifacts present

---

## Summary: Sandbox Boundaries

| Aspect | Boundary |
|--------|----------|
| **Input** | Algorithm spec + context docs |
| **Output** | 3 files (tracer, tests, docs) + validation report |
| **Autonomy** | Full control over tracer implementation |
| **Constraints** | Must inherit base class, follow checklist |
| **Awareness** | Knows FAA/PE exist, but doesn't perform them |
| **Termination** | Generates all artifacts in one shot |
| **Dependencies** | Python stdlib only (unless specified) |
| **Quality bar** | Functional code that passes unit tests |

This sandbox is **self-contained** - all inputs provided upfront, all outputs generated atomically, no external coordination required during generation.