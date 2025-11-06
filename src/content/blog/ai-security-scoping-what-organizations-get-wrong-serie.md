---
title: "AI Security Scoping: What Organizations Get Wrong Serie"
description: "Overview for AI Security Scoping: What Organizations Get Wrong Serie"
pubDate: 2025-11-06
category: "Offensive Security"
tags: ["_No response_"]
image: "offensive.png"
draft: false
---
# AI Security Scoping: What Organizations Get Wrong

Organizations are deploying AI systems into production. Security teams are being asked to assess them. And most security scoping documents are fundamentally inadequate for the task.

The problem isn't that security teams lack expertise. The problem is that AI systems are different from traditional applications, and scoping approaches haven't adapted. Scope documents say "test the LLM" without defining what that means. They apply web application security frameworks to systems where the attack surface is fundamentally different.

This series addresses the gap between how organizations scope AI security assessments and what actually needs to be tested.

## The Core Problem

Traditional security scoping works like this:
1. Define the application boundaries
2. Enumerate endpoints and components
3. List vulnerability categories to test
4. Execute testing
5. Deliver report

For AI systems, this approach misses most of the attack surface.

An AI system isn't just an application. It's a model (often third-party), integrated with application code, using training data (from somewhere), processing inputs (which become prompts), generating outputs (which get used somewhere), potentially calling functions (which do things), maintaining conversation state (which creates context), and evolving constantly (through retraining, prompt changes, and new integrations).

Scope documents that say "test for prompt injection and jailbreaks" are testing one small piece while ignoring the integration points, training pipelines, function calling mechanisms, multi-turn context, output handling, and continuous changes that constitute the actual attack surface.

## What This Series Covers

Each article in this series identifies a specific scoping gap with concrete examples of what gets missed and what questions scope documents should answer.

### Article 1: Model Integration Points Nobody Tests

Most scoping focuses on the model while ignoring the integration layer where actual vulnerabilities exist.

What gets missed:
- How user input becomes model prompts (string concatenation, JSON encoding, validation)
- How applications authenticate to model APIs (API key storage, rotation)
- How model outputs get processed (HTML rendering, code execution, database queries)
- Rate limiting, error handling, session management

The model does what it's designed to do. The vulnerabilities are in how applications integrate with models.

### Article 2: Multi-Turn Context Windows

Single-turn testing dominates. Real attacks happen across conversations.

What gets missed:
- Context manipulation across multiple turns
- Session isolation between users
- Context window overflow behavior
- Cross-turn instruction injection

Adversaries condition models gradually. Single-turn tests never see this.

### Article 3: Function Calling and Tool Integration

Models with function calling can execute code and query databases. Scoping ignores the execution layer.

What gets missed:
- Authorization for function calls
- Parameter validation (SQL injection, command injection, path traversal)
- Function call chains
- Rate limiting on expensive functions

Testing the model doesn't cover what the model can do through tools.

### Article 4: The Third-Party Model Scoping Problem

Organizations use OpenAI or Anthropic APIs. Scope says "test the model" when the model is a black box.

What gets missed:
- Trust boundary definition
- What's actually testable (integration, not the model)
- Data sent to third-party APIs
- Compliance implications

You can't test the model. You can test your integration with it.

### Article 5: Training Pipeline Security

Security teams test deployed models. AI teams train models. The pipeline between them is untested.

What gets missed:
- Training data sources and integrity
- Data poisoning opportunities
- Fine-tuning risks
- Supply chain for models and datasets

If adversaries can influence training data, they control the model.

### Article 6: AI Safety as Security Scope

Security teams test technical vulnerabilities. Safety issues are "someone else's problem" until they create legal liability.

What gets missed:
- Regulatory compliance (GDPR, EU AI Act)
- Bias and discrimination
- Harmful content generation
- Alignment failures

Safety failures create organizational risk just like security failures.

### Article 7: Continuous Changes and Testing Cadence

Point-in-time assessments work for static systems. AI systems change constantly.

What gets missed:
- Model updates (by providers or through retraining)
- Prompt modifications
- Integration changes
- Training data updates

Testing in January is obsolete by March if the system changed.

### Article 8: Logging, Monitoring, and Detection

Assessments find vulnerabilities. Logs detect exploitation. Most scoping focuses on finding, not detecting.

What gets missed:
- What security events are logged
- Log retention and security
- Monitoring and alerting capabilities
- Incident investigation procedures

Finding vulnerabilities matters less if exploitation goes undetected.

### Article 9: AI Security RFPs That Waste Everyone's Time

Generic RFPs produce generic proposals that lead to generic testing.

What gets missed:
- System architecture details vendors need
- Specific test scenarios required
- Access and constraint information
- Realistic timelines and budgets

Bad RFPs result in proposals that don't match actual needs.

### Article 10: AI Incident Response

Organizations have IR plans for traditional breaches. AI incidents don't fit existing procedures.

What gets missed:
- AI-specific incident categories
- Model-specific containment strategies
- Investigation procedures for AI failures
- Recovery approaches for compromised models

When AI incidents occur, traditional IR doesn't apply.

## Who This Series Is For

This series is for:
- Security teams scoping AI security assessments
- AI teams working with security on testing requirements
- Organizations writing RFPs for AI security services
- Vendors proposing AI security assessments

The goal is to bridge the gap between current scoping practices and what AI systems actually require.

## What This Series Is Not

This is not a comprehensive AI security testing guide. It doesn't provide step-by-step exploitation techniques, testing tools, or detailed methodologies.

This series focuses specifically on scoping: understanding what needs to be tested, defining boundaries, asking the right questions, and writing scope documents that produce meaningful security assessments.

Testing methodologies matter, but they're useless if applied to inadequate scope.

## The Pattern in Every Article

Each article follows the same structure:

1. Identify what organizations currently do
2. Explain what gets missed with that approach
3. Provide concrete examples of the gap
4. Show what scope documents should specify
5. Demonstrate better scope language

The emphasis is on concrete, technical examples rather than abstract principles. Code samples show real vulnerabilities. Scope examples show specific language that works versus language that doesn't.

## How to Use This Series

### For Security Teams

Use these articles to:
- Evaluate your current AI security scope documents
- Identify gaps in what you're testing
- Improve scope definition for future assessments
- Educate stakeholders on why AI security requires different approaches

### For AI Teams

Use these articles to:
- Understand what security teams need to know
- Prepare documentation for security assessments
- Identify which components are in scope
- Collaborate with security on defining testing boundaries

### For Vendors

Use these articles to:
- Evaluate RFPs for completeness
- Identify missing information needed for accurate proposals
- Educate clients on proper scoping
- Demonstrate expertise in AI security

### For Organizations Writing RFPs

Use these articles to:
- Understand what information vendors need
- Write RFPs that produce accurate proposals
- Set realistic expectations for timelines and deliverables
- Evaluate vendor responses effectively

## The Bottom Line

AI security scoping is broken. Not because people aren't trying, but because they're applying traditional approaches to fundamentally different systems.

The model is one component. The attack surface includes integration points, training pipelines, function calling mechanisms, multi-turn context, output handling, third-party dependencies, and continuous changes.

Scope documents need to reflect this reality. Testing "the AI" isn't sufficient. Testing the system that includes an AI is what matters.

This series provides the framework for doing that correctly.

---

## Series Articles

1. **Model Integration Points Nobody Tests** - The layers between user input and model output
2. **Multi-Turn Context Windows** - Why conversation history matters
3. **Function Calling and Tool Integration** - When models can execute actions
4. **The Third-Party Model Scoping Problem** - Testing what you don't control
5. **Training Pipeline Security** - The ignored attack surface
6. **AI Safety as Security Scope** - Legal and regulatory risks
7. **Continuous Changes and Testing Cadence** - Why point-in-time testing fails
8. **Logging, Monitoring, and Detection** - Finding vs detecting exploitation
9. **AI Security RFPs That Waste Everyone's Time** - How bad RFPs produce bad testing
10. **AI Incident Response** - When scoping meets reality

Each article is standalone but builds on common themes: AI systems are different, traditional scoping misses critical components, and effective scoping requires understanding the full attack surface.

---

[Original Source](_No response_)