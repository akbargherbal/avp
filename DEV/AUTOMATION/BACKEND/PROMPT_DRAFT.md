PROMPT ROUGH DRAFT
---
You are implementing a new algorithm tracer for our visualization platform.

CONTEXT:
- Your output will be reviewed by an FAA (arithmetic auditor) and PE (narrative reviewer)
- You must generate: (1) tracer class, (2) unit tests, (3) algorithm-info doc
- This is Stage 1 of a larger pipeline - focus only on backend code quality

REQUIREMENTS:
[Paste BACKEND_CHECKLIST.md - "LOCKED REQUIREMENTS" + "CONSTRAINED REQUIREMENTS" sections]

BASE CLASS TO INHERIT:
[Paste base_tracer.py]

WORKING EXAMPLE:
[Paste 1 similar algorithm tracer implementation]

VISUALIZATION CONTRACT:
[Paste relevant visualization_type section from checklist]

ALGORITHM INFO FORMAT:
[Show template: 150-250 words, what/why/complexity/applications]

YOUR TASK:
Implement [ALGORITHM_NAME] that [DESCRIPTION].
Input format: [SPEC]
Expected output: [SPEC]

Generate:
1. Complete tracer class (inherits AlgorithmTracer)
2. Unit tests covering edge cases
3. Algorithm info markdown (150-250 words)

CRITICAL:
- All arithmetic in narratives must be correct (FAA will audit)
- All result fields must have narrative trail (no phantom data)
- Include visualization hints section in narrative
- Ensure base_tracer.py remains unchanged