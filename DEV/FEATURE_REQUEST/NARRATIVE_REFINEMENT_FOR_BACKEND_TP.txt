**Topic:** Feature Request: Narrative Refinement for Two Pointer Algorithm Visualization

**Context:**
The generated Markdown serves as both a sanity check for the backend logic and a narrative blueprint for the Frontend developer implementation. A review of the current output suggests the narrative flow requires adjustment to better align with the pedagogical mental model of the algorithm.

The objective is to ensure the narrative reads less like a raw execution trace and more like a cohesive educational walkthrough. This will aid the Frontend developer in creating animations that accurately reflect the "cause and effect" nature of the algorithm.

**Feedback & Requirements:**

### 1. Consolidation of Logical Steps (Cause & Effect)
**Current State:**
The narrative currently fragments a single loop iteration into multiple, isolated steps (e.g., *Step 1: Compare* followed by *Step 2: Move*).
**Pedagogical Issue:**
This fragmentation increases cognitive load, forcing the reader to carry the context of the comparison across multiple headers. It obscures the direct relationship between the condition (finding a duplicate/unique) and the action (moving the pointer).
**Requirement:**
Consolidate the narrative so that **Comparison**, **Decision**, and **Action** are presented as a single atomic unit. The documentation for a step should describe the full logic: *"Comparison validated X, therefore pointer Y moves."*

### 2. Explicit Narration of Data Mutation
**Current State:**
When a unique element is found, the narrative displays the header "Placed X at index Y" and immediately shows the array in its *post-mutation* state.
**Pedagogical Issue:**
The "in-place overwrite" is the most complex concept in this pattern. By skipping the narration of the write operation and jumping straight to the result, the crucial data transformation is obfuscated.
**Requirement:**
The narrative text must explicitly describe the mutation process. It should state that a value is being **copied** from the `fast` index to the `slow` index, effectively overwriting the old data. This ensures the Frontend implementation accounts for visualizing the data transfer/write operation, not just the pointer movement.

### 3. Removal of Abstract State Codes
**Current State:**
The output includes a `State` row containing internal logic codes (e.g., `U`, `D`, `P`, `E`).
**Pedagogical Issue:**
These codes represent "undefined behavior" to the reader. They add visual noise and require the user (and the FE developer) to reverse-engineer their meaning, rather than focusing on the actual array values and indices.
**Requirement:**
Replace abstract codes with natural language descriptions within the text body. Focus the narrative on the concrete properties of the algorithm: the specific **Indices** being accessed and the **Values** being compared.

**Summary:**
Refining these areas will produce a narrative that accurately reflects the "human" explanation of the Two Pointer pattern, providing a clearer specification for the Frontend animation logic.