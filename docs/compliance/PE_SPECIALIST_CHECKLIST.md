# PE Specialist Checklist: Narrative Review Compliance v1.0

**Authority:** Derived from project workflow documentation  
**Purpose:** Verify algorithm narratives are pedagogically complete and logically coherent  
**Scope:** Pedagogical assessment only - focus on this checklist and narrative quality standards

---

## LOCKED REQUIREMENTS (Mandatory)

### Input Validation

- [ ] **FAA-approved narratives ONLY** - Arithmetic correctness already verified at Stage 1.5
- [ ] **Markdown format** - Working with `.md` files from `docs/narratives/[algorithm-name]/`
- [ ] **Complete narrative set** - All registered examples for algorithm provided
- [ ] **Narrative metadata present** - Algorithm name, example number, input data visible

### Core Pedagogical Assessment

- [ ] **Read and Summarize** - Understand algorithm purpose and narrative structure
  - What problem does this algorithm solve?
  - What is the high-level approach (divide-and-conquer, greedy, etc.)?
  - How many distinct phases does the narrative cover?

- [ ] **Temporal Coherence Verified** - Step N → Step N+1 logical progression
  - [ ] Each step follows naturally from previous step
  - [ ] No unexplained jumps in logic or state
  - [ ] Cause-and-effect relationships explicit
  - [ ] Timeline makes sense without referencing code

- [ ] **Decision Points Have Visible Supporting Data**
  - [ ] Every comparison shows actual values being compared
  - [ ] Every condition evaluation shows data that led to decision
  - [ ] Every branch taken (if/else) explained with visible reasons
  - [ ] No decisions made with "magic" or hidden information

- [ ] **Mental Visualization Test Passed**
  - [ ] Can reconstruct algorithm execution from narrative alone
  - [ ] No need to reference code, JSON, or external documentation
  - [ ] All state transitions described with concrete data
  - [ ] Reader can "see" the data structure evolving

- [ ] **Result Field Traceability** - All output fields mentioned during execution
  - [ ] Every field in final result was introduced earlier
  - [ ] No "surprise" data appears only in conclusion
  - [ ] Tracked values explained before used in final answer

### Pedagogical Quality Standards

- [ ] **Clarity & Readability** - Educational tool quality
  - [ ] Language appropriate for students/junior developers
  - [ ] Technical terms defined on first use
  - [ ] Sentence structure clear and concise
  - [ ] Paragraphs focused on single concepts

- [ ] **Cognitive Load Management** - Minimize mental effort
  - [ ] Information presented in digestible chunks
  - [ ] Complex operations broken into sub-steps
  - [ ] Visual markers used effectively (emojis, formatting)
  - [ ] Repetitive patterns identified and simplified

- [ ] **Explicit Explanations** - No implicit operations
  - [ ] All mutations/updates shown explicitly
  - [ ] State changes explained with before/after values
  - [ ] Loop iterations described with current values
  - [ ] Recursion depth or call stack state visible when relevant

- [ ] **Jargon & Abstraction Check** - No undefined terms
  - [ ] Algorithm-specific terms introduced before use
  - [ ] Abstract concepts grounded with concrete examples
  - [ ] Variable names meaningful without code context
  - [ ] No cryptic labels or unexplained notation

### Visual Representation Quality

- [ ] **Data Visualization Clarity** - Arrays, intervals, graphs shown effectively
  - [ ] Current state always visible in narrative
  - [ ] Pointers/indices clearly marked
  - [ ] Changes highlighted (e.g., "becomes", "→", bold text)
  - [ ] Visual noise minimized (only relevant data shown)

- [ ] **Annotation Quality** - Supporting information helpful
  - [ ] Comparisons annotated with outcomes
  - [ ] Key values labeled (e.g., "left=3", "mid=7")
  - [ ] State transitions marked explicitly
  - [ ] Metadata (step count, phase) present where helpful

---

## CONSTRAINED REQUIREMENTS (Follow Standards)

### Assessment Process

- [ ] **Strengths Identified** - Document what narrative does well
  - List 2-3 pedagogical strengths (e.g., clear visuals, cohesive flow)
  - Acknowledge effective teaching techniques used
  - Note patterns worth replicating in other narratives

- [ ] **Weaknesses Identified** - Document pedagogical gaps
  - List 2-4 key issues impacting educational effectiveness
  - Categorize by impact: Critical / Moderate / Minor
  - Focus on WHAT is wrong, not HOW to fix it

- [ ] **Pedagogical Impact Assessed** - Why weaknesses matter
  - How does issue increase cognitive load?
  - What confusion might this cause learners?
  - Which mental model does this disrupt?

### Feedback Delivery Standards

If narrative is **pedagogically complete**:
- [ ] **Approval Format:**
  ```markdown
  ## ✅ PE Approval: [Algorithm Name] - [Example Name]
  
  **Narrative Quality:** Pedagogically complete
  
  **Strengths:**
  - [Strength 1]
  - [Strength 2]
  - [Strength 3]
  
  **Decision:** APPROVED for Stage 3 (Frontend Integration)
  ```

If narrative has **pedagogical gaps**:
- [ ] **Feature Request Format:**
  ```markdown
  ## 📋 Feature Request: Narrative Refinement - [Algorithm Name] - [Example Name]
  
  **Context:**
  The markdown narrative serves as a blueprint for frontend visualizations and animations. 
  Pedagogical refinements ensure the educational flow translates into clear, intuitive 
  visual representations. This feedback addresses narrative structure and presentation 
  to enhance learning effectiveness.
  
  **Current State & Issues:**
  
  ### Issue 1: [Descriptive Title]
  - **Current State:** [What narrative currently does]
  - **Pedagogical Impact:** [How this affects learning]
  - **Requirement:** [What narrative should do instead - DESCRIPTIVE, not prescriptive]
  
  ### Issue 2: [Descriptive Title]
  - **Current State:** [What narrative currently does]
  - **Pedagogical Impact:** [How this affects learning]
  - **Requirement:** [What narrative should do instead]
  
  [Repeat for 2-4 issues total]
  
  **Summary:**
  These refinements will [specific educational benefits]. The improved narrative 
  will support better visualizations by [how it helps frontend implementation].
  
  **Decision:** REVISION REQUIRED - Return to Backend Developer (Stage 1)
  ```

### Feedback Characteristics

- [ ] **Descriptive (WHAT), Not Prescriptive (HOW)**
  - ❌ "Change line 47 to: 'Compare left pointer value...'"
  - ✅ "Comparison operations lack visible supporting data (which values compared)"

- [ ] **Focused on Pedagogy, Not Implementation**
  - ❌ "The loop should iterate differently"
  - ✅ "Loop iterations are unclear - reader cannot track progress through array"

- [ ] **Objective Third-Person Voice**
  - ❌ "You forgot to explain the comparison"
  - ✅ "The comparison lacks explanation of which values are being compared"

- [ ] **Grounded in Learning Theory**
  - Reference cognitive load when relevant
  - Mention mental models being built
  - Cite worked example principles when applicable

---

## ANTI-PATTERNS (Never Do)

### Scope Violations

- [ ] ✅ **NOT re-verifying arithmetic correctness**
  - FAA already handled math verification (Stage 1.5)
  - Trust all quantitative claims are correct
  - Focus ONLY on pedagogical presentation

- [ ] ✅ **NOT critiquing algorithm logic or efficiency**
  - Algorithm choice is correct by assumption
  - Do not suggest alternative approaches
  - Focus on explanation quality, not algorithm quality

- [ ] ✅ **NOT reviewing code or implementation**
  - Work ONLY with markdown narratives
  - Do not request access to tracer code
  - Do not comment on code structure

### Feedback Anti-Patterns

- [ ] ✅ **NOT providing prescriptive solutions**
  - Example ❌: "Change this sentence to: '...'"
  - Example ✅: "This decision point lacks visible supporting data"

- [ ] ✅ **NOT writing code or pseudocode**
  - Example ❌: "Add: `if left < right: ...`"
  - Example ✅: "Conditional logic not explained - reader cannot predict branch taken"

- [ ] ✅ **NOT assuming learner background knowledge**
  - Example ❌: "This is obvious to anyone who knows CS"
  - Example ✅: "Binary search prerequisite (sorted array) not mentioned"

- [ ] ✅ **NOT conflating pedagogical and mathematical issues**
  - Example ❌: "The calculation 20 - 10 = 10 needs better explanation" (math is fine)
  - Example ✅: "The subtraction result appears without showing the operands"

### Process Anti-Patterns

- [ ] ✅ **NOT skipping the mental visualization test**
  - Must attempt to reconstruct execution from narrative alone
  - Narrative must be self-contained
  - If you need code/JSON to understand, narrative fails

- [ ] ✅ **NOT approving narratives with undefined references**
  - Example ❌: Approving narrative that says "compare with max_end" but max_end value not shown
  - Example ✅: Requiring all variable references to show current values

- [ ] ✅ **NOT providing feedback without pedagogical justification**
  - Every issue must explain impact on learning
  - "Increases cognitive load" or "disrupts mental model" must be clear
  - Avoid subjective preferences without educational reasoning

---

## FREE CHOICES (Your Expertise)

### Analysis Depth

- [ ] **Pedagogical Theory References** - Cite learning principles when relevant
  - Cognitive Load Theory
  - Worked Example Effect
  - Chunking and Information Processing
  - Mental Models and Schema Theory

- [ ] **Feedback Detail Level** - Within 2-4 issue guideline
  - Brief feedback for minor issues
  - Detailed analysis for critical pedagogical gaps
  - Balance comprehensiveness with actionability

- [ ] **Teaching Context Consideration** - Adapt assessment to audience
  - Beginner-friendly vs intermediate-level narratives
  - Classroom use vs self-study contexts
  - Algorithm complexity implications for cognitive load

### Quality Standards Evolution

- [ ] **Pattern Recognition** - Identify recurring issues across algorithms
  - Document common pedagogical gaps
  - Suggest narrative templates for similar algorithms
  - Build institutional knowledge of effective patterns

- [ ] **Continuous Improvement** - Refine assessment criteria
  - Update checklist based on frontend feedback
  - Incorporate user testing insights
  - Evolve standards as platform matures

---

## Testing & Validation Checklist

### Self-Check Before Approval

- [ ] **Mental Visualization Test Performed**
  - Covered the narrative, attempted reconstruction
  - Verified no external references needed
  - Confirmed temporal coherence throughout

- [ ] **Decision Point Audit Completed**
  - Listed all algorithm decisions (comparisons, branches, updates)
  - Verified each has visible supporting data in narrative
  - No "magic" decisions without explanation

- [ ] **Cognitive Load Assessment Done**
  - Identified complex sections
  - Verified chunking and pacing appropriate
  - No information overload in single step

- [ ] **Feedback Quality Check**
  - All issues have pedagogical justification
  - Descriptive (WHAT) not prescriptive (HOW)
  - Objective third-person voice maintained
  - 2-4 issues if revision required

### Integration Validation

- [ ] **Frontend Readiness** - Narrative supports visualization
  - Clear data states for each step
  - Transition points well-marked
  - Visual hints section present (from Backend)

- [ ] **Learner Perspective Maintained** - Assessment from student viewpoint
  - Assume no prior algorithm knowledge
  - Identify prerequisite concepts needed
  - Verify progressive disclosure of complexity

---

## Example: Pedagogical Assessment Pattern

```markdown
## 📋 Feature Request: Narrative Refinement - Binary Search - Example 3

**Context:**
The markdown narrative serves as a blueprint for frontend visualizations and animations. 
Pedagogical refinements ensure the educational flow translates into clear, intuitive 
visual representations. This feedback addresses narrative structure and presentation 
to enhance learning effectiveness.

**Current State & Issues:**

### Issue 1: Hidden Comparison Data
- **Current State:** Narrative states "We compare the middle element with target" 
  without showing actual values being compared.
- **Pedagogical Impact:** Learner cannot verify the comparison logic or predict 
  the outcome. This increases cognitive load as they must mentally track values 
  while reading.
- **Requirement:** Each comparison must show concrete values: "Compare middle 
  element (value: 45) with target (value: 72)".

### Issue 2: Implicit Range Updates
- **Current State:** Search space updates appear without explaining why new 
  boundaries were chosen: "New range: [8, 15]"
- **Pedagogical Impact:** Learner loses the connection between comparison outcome 
  and range adjustment. Mental model of "binary" search is disrupted.
- **Requirement:** Range updates must explain the decision: "Since 45 < 72, 
  target must be in upper half. New range: [8, 15] (discarding lower half)."

### Issue 3: Fragmented Step Presentation
- **Current State:** Comparison and decision are separated by multiple paragraphs 
  of metadata, breaking cause-effect relationship.
- **Pedagogical Impact:** Learner must hold comparison in working memory across 
  unrelated information, increasing cognitive load and disrupting flow.
- **Requirement:** Keep cause-effect pairs contiguous. Present comparison 
  immediately followed by resulting decision before showing metadata.

**Summary:**
These refinements will reduce cognitive load by making algorithm logic explicit 
at each step. The improved narrative will support better visualizations by 
providing clear before-after states and explicit decision justifications that 
can be mapped to visual transitions.

**Decision:** REVISION REQUIRED - Return to Backend Developer (Stage 1)
```

---

## Workflow Integration

**Stage 2: PE Narrative Review**

1. ✅ Receive FAA-approved narratives from previous stage
2. ✅ Review narrative metadata and algorithm context
3. ✅ Perform mental visualization test
4. ✅ Assess pedagogical quality using checklist criteria
5. ✅ Document strengths and weaknesses
6. ✅ Provide approval OR feature request feedback
7. ✅ Complete this checklist
8. ✅ Submit review to project manager

**If APPROVED:** Narratives proceed to Stage 3 (Frontend Integration)  
**If REVISION REQUIRED:** Return to Backend Developer (Stage 1) with descriptive feedback

**Next Stage:** Frontend Integration (Stage 3)

---

## Time Estimates

- **Single Algorithm Review:** 15 minutes
- **Mental Visualization Test:** 5 minutes
- **Pedagogical Assessment:** 7 minutes
- **Feedback Writing:** 3 minutes (if revision needed)

**Optimization Tips:**
- Use mental visualization test as primary filter
- If test passes easily, likely approval
- If test struggles, dig into specific pedagogical gaps
- Reuse feedback patterns for similar issues across examples

---

## Key Reminders

**Your Focus:**
- ✅ Pedagogical effectiveness (how well it teaches)
- ✅ Logical flow and temporal coherence
- ✅ Mental visualization quality
- ✅ Learner perspective (student/junior dev)

**Not Your Focus:**
- ❌ Arithmetic correctness (FAA handled this)
- ❌ Algorithm efficiency or logic (assume correct)
- ❌ Code implementation details
- ❌ Frontend visualization capabilities

**Quality Over Speed:**
- Take full 15 minutes per algorithm
- Mental visualization test is non-negotiable
- Thorough review prevents frontend rework
- Your approval gates quality for learners

---

**Remember:**
- If you cannot mentally reconstruct execution, narrative fails
- If decisions lack visible data, narrative fails
- If temporal flow has gaps, narrative fails
- Descriptive feedback (WHAT) empowers Backend to find best solution (HOW)
