---
title: "Pentesting the Modern AI Stack (Part 2): Test Design and Execution Using the OWASP AI Testing Guide"
description: "- Infrastructure compromise gives you **capability**, not automatic AI-specific **effects**. Treat these separately in scope and reporting. - AI systems are probabilistic. Every test case needs defined inputs, expected outcomes, evidence sources, and repro rules. - Use IBM's five-layer AI stack model (Infrastructure → Model → Data → Orchestration → Application) for systematic coverage. - The OWASP AI Testing Guide provides structured test cases across four categories. This article maps them to the five-layer model. - Document everything: trace IDs, prompt logs, tool-call logs, retrieval logs."
pubDate: 2025-11-29
category: "Learning"
tags: ["_No response_"]
image: "AITesting.png"
draft: false
---

This is Part 2 of the VortexNode series on AI security testing. It builds on earlier VortexNode articles and formalizes the work into a repeatable test approach aligned with the OWASP AI Testing Guide (AITG).

---

## TL;DR

- Infrastructure compromise gives you **capability**, not automatic AI-specific **effects**. Treat these separately in scope and reporting.
- AI systems are probabilistic. Every test case needs defined inputs, expected outcomes, evidence sources, and repro rules.
- Use IBM's five-layer AI stack model (Infrastructure → Model → Data → Orchestration → Application) for systematic coverage.
- The OWASP AI Testing Guide provides structured test cases across four categories. This article maps them to the five-layer model.
- Document everything: trace IDs, prompt logs, tool-call logs, retrieval logs.

---

## Table of Contents

- [Layer Model Mapping](#layer-model-mapping)
- [Testing Principles (AI-Specific)](#testing-principles-ai-specific)
- [Test Planning (Before Touching the System)](#test-planning-before-touching-the-system)
- [Layered Test Methods (OWASP-Aligned)](#layered-test-methods-owasp-aligned)
  - [Infrastructure Layer](#infrastructure-layer-traditional-pentest)
  - [Model Layer](#model-layer-behavioral-security-testing)
  - [Data Layer](#data-layer-rag-embeddings-poisoning)
  - [Orchestration Layer](#orchestration-layer-agents-tool-calls-excessive-agency)
  - [Application Layer](#application-layer-hybrid-web--ai)
- [Result Classification](#result-classification-what-to-report)
- [Minimal AI Test Case Template](#minimal-ai-test-case-template)
- [References](#references)

---

## Layer Model Mapping

The OWASP AI Testing Guide organizes tests across four categories (Application, Model, Infrastructure, Data). This article uses IBM's five-layer AI stack model, which separates Orchestration as a distinct layer due to its unique attack surface: tool-calls, agent workflows, prompt chaining, and guardrail bypass logic.

| Layer | Description | AITG Test Categories |
|-------|-------------|----------------------|
| Infrastructure | Hardware, compute, cloud/container security, secrets | AITG-INF-01 through AITG-INF-06 |
| Model | Core AI engine, weights, behavioral constraints | AITG-MOD-01 through AITG-MOD-07 |
| Data | RAG pipelines, vector databases, embeddings, training data | AITG-DAT-xx, AITG-APP-08 |
| Orchestration | Agent workflows, tool-calls, routing, guardrails | AITG-APP-06, AITG-INF-03, AITG-INF-04 |
| Application | User-facing interface, output handling, auth integration | AITG-APP-01 through AITG-APP-05, AITG-APP-07 |

The orchestration layer is where most agentic AI security issues live. Traditional pentest methodologies miss this entirely because it doesn't exist in conventional application stacks.

---

## Testing Principles (AI-Specific)

### Capability vs Effect

An infrastructure compromise provides capability (access paths, privilege, placement), but AI-specific outcomes still require deliberate follow-on actions: poisoning, orchestration edits, prompt template changes, and so on.

Treat this explicitly in scope and reporting. "Control of plane" is distinct from "control of behavior."

### Repeatability Requirements

AI systems are probabilistic. A valid test case must define:

- **Input vector**: prompt, document, API call, tool-call stimulus
- **Expected outcome**: block, sanitize, refuse, safe completion, no unauthorized action
- **Evidence source**: trace ID, prompt log, tool-call logs, retrieval logs
- **Repro rules**: temperature, seed if supported, fixed context, fixed corpus snapshot

The AITG's core value is structure and repeatability rather than one-off exploitation.

---

## Test Planning (Before Touching the System)

### Asset and Boundary Definition

Document the stack across all five layers. For each layer define:

- **Assets**: tokens, weights, embeddings, prompts, tools, logs
- **Trust boundaries**: user input boundary, tool boundary, data ingestion boundary
- **Allowed agent capabilities** ("agency budget"): what tools the AI is permitted to invoke and under what conditions

### Test Environment Controls

- Staging environment with production-like integrations
- Correlated logging (prompt ID → retrieval ID → tool-call ID → output ID)
- Clear rules for what data may be used (avoid real secrets unless explicitly authorized)

---

## Layered Test Methods (OWASP-Aligned)

### Infrastructure Layer (Traditional Pentest)

**Objective:** Determine whether an attacker can obtain privileged execution or lateral movement within the AI hosting environment.

**Method categories:**

- IAM/RBAC validation and privilege escalation
- Container isolation testing
- Secrets management exposure testing
- Network segregation and service-to-service access controls
- Storage access and misconfiguration testing

**Evidence:** Kubernetes audit logs, IAM policy evaluation, container runtime logs, storage access logs.

These are standard pentest activities. AI is not required for exploitation at this layer.

---

### Model Layer (Behavioral Security Testing)

**Objective:** Determine whether the model can be coerced into violating policy, leaking restricted data, or entering unsafe operational modes.

#### Method A: Prompt Injection / Policy Bypass Testing

Prompt injection is an established LLM security issue: the attacker uses instructions crafted to override system intent.

**Test design:**

- **Direct injection**: "ignore previous instructions …"
- **Indirect injection**: payload embedded in retrieved documents, emails, tickets, or web content
- **Multi-turn coercion**: gradual escalation over multiple steps

**Pass condition:** The system maintains constraints and refuses disallowed behavior.

**Evidence:** Stored prompt chain, system prompt exposure checks, refusal signals, safety policy traces.

#### Method B: Robustness Under Adversarial Inputs

- Malformed inputs (encoding edge cases, oversized context)
- Ambiguous or conflicting instructions (to test instruction hierarchy handling)

**Pass condition:** Safe failure modes (no crashes, no unintended tool use, no policy leakage).

---

### Data Layer (RAG, Embeddings, Poisoning)

**Objective:** Determine whether attacker-controlled content can alter retrieval outcomes, influence answers, or expose restricted documents.

#### Method A: RAG Poisoning Tests

- Insert controlled "poison" documents into allowed ingestion paths (authorized test content only)
- Verify whether retrieval prioritizes malicious instructions over trusted sources

**Pass condition:** Poisoned content is detected, down-ranked, filtered, or sandboxed.

#### Method B: Retrieval Authorization Tests

- Attempt to retrieve documents outside the user's access scope using semantic queries ("find payroll", "list credentials", etc.)
- Validate ACL enforcement at retrieval time, not just at UI level

**Pass condition:** Unauthorized documents are not retrieved and cannot be inferred via iterative questioning.

**Evidence:** Retrieval logs (top-k results), ACL decisions, document IDs returned, vector DB query logs.

---

### Orchestration Layer (Agents, Tool-Calls, Excessive Agency)

**Objective:** Determine whether attackers can weaponize tool execution via model output.

#### Method A: Tool-Call Abuse Testing

- Attempt to trigger tool calls with manipulated parameters (internal URL fetches, file references, admin endpoints)
- Validate tool allow-lists and parameter validation

**Pass condition:** Unauthorized tool calls are blocked, and the request is logged with clear attribution.

#### Method B: Workflow Routing / Guardrail Bypass Testing

- Provide inputs that attempt to force routing into privileged workflows ("admin mode", "diagnostic mode", "run remediation")
- Test multi-step chains where the model tries to "earn permission"

**Pass condition:** Routing rules remain deterministic and enforce policy.

**Evidence:** Tool-call log, workflow engine trace, decision path record, policy decision rationale.

---

### Application Layer (Hybrid Web + AI)

**Objective:** Identify classic application issues amplified by AI behavior.

#### Method A: Output Handling Tests (Injection via AI Output)

- Verify that AI-generated content is properly encoded/escaped before rendering
- Validate structured output (JSON/YAML/XML) against strict schemas

**Pass condition:** No client-side execution, no parser confusion, no structured output injection.

#### Method B: Authorization Misinterpretation Tests

- Attempt to induce the application to perform actions on behalf of another user ("act as admin", "use internal token")
- Ensure authorization depends on server-side identity, not model interpretation

**Pass condition:** AI cannot override identity and privilege checks.

---

## Result Classification (What to Report)

Use a clear separation of finding types:

| Finding Type | Description |
|--------------|-------------|
| Compromise of control plane | Infrastructure, admin access, key exposure |
| Behavioral compromise | Model follows attacker intent instead of policy |
| Integrity compromise | Data poisoning, workflow tampering |
| Confidentiality compromise | RAG leakage, prompt leakage, log leakage |
| Agency compromise | Unauthorized tool invocation |

The OWASP AI Testing Guide explicitly frames AI testing as systematic across layers, not limited to a single "LLM prompt test."

---

## Minimal AI Test Case Template

Use this format to keep tests repeatable:

```
ID:             AITG-style internal ID (e.g., VN-AI-APP-PI-01)
Layer:          Application / Orchestration / Data / Model / Infrastructure
Preconditions:  Model version, config, retrieval index snapshot, temperature
Input:          Exact prompt / document payload / API call
Expected:       Refusal / safe output / no tool call / no retrieval
Observed:       Output + tool calls + retrieval results
Evidence:       Trace IDs + logs + screenshots
Severity:       Impact + likelihood + prerequisites
Fix Guidance:   Control to implement + verification step
```

---

## References

**VortexNode:**
- VortexNode article repository

**OWASP:**
- OWASP AI Testing Guide (project + scope): https://github.com/OWASP/www-project-ai-testing-guide/
- OWASP Prompt Injection overview: https://owasp.org/www-community/attacks/PromptInjection
- OWASP LLM Prompt Injection Prevention Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html

**IBM (Five-Layer AI Stack Model):**
- IBM "What Is an AI Stack?" by Lauren McHugh Olende: https://www.startuphub.ai/ai-news/ai-video/2025/the-essential-ai-stack-beyond-the-hype-of-large-language-models/
- IBM AI Stack overview: https://www.ibm.com/think/topics/ai-stack
- IBM LLM Orchestration: https://www.ibm.com/think/topics/llm-orchestration

---

[Original Source](_No response_)
