---
title: "Death by Thousand Prompts a comentary"
description: "Notes after reading the paper."
pubDate: 2025-11-16
category: "Learning"
tags: ["AI"]
image: "AITesting.png"
draft: false
---

# Death by a Thousand Prompts: Multi-Turn Jailbreaks in Open-Weight Models

Death by a Thousand Prompts is a new open-weight LLM security study from Cisco AI Defense that looks at eight popular models and asks a simple question:

**What actually happens to safety guardrails once you stop testing single prompts and start behaving like a real attacker in a real conversation?**

Short version: single-turn testing makes these models look much safer than they really are. Multi-turn attacks push success rates into "this is production-killing" territory for most of the open-weight family.

This post is a walk-through of what the paper found, why it matters for defenders, and how it fits into the broader prompt-injection / jailbreak story we've been mapping on Vortex Node.

---

## What Cisco actually tested

The team ran automated adversarial testing against eight open-weight models from different labs (Alibaba, DeepSeek, Google, Meta, Microsoft, Mistral, OpenAI, Zhipu).

For each model they measured:
- Single-turn jailbreak / prompt-injection success
- Multi-turn jailbreak success, using adaptive conversations where an "attacker model" keeps poking until something breaks

Some highlights from the numbers:
- Average single-turn attack success rate: about 13%
- Average multi-turn success rate: about 64%
- Best case multi-turn: ~26% (Gemma 3–1B-IT)
- Worst case multi-turn: ~93% (Mistral Large-2)

So depending on the model, multi-turn jailbreaking is roughly 2–10x more effective than one-shot prompts.

If you've ever done manual red-teaming this is not surprising: nobody serious stops after one refusal. But it's useful to see it quantified across multiple open-weight families.

The attack styles were things we've already talked about here:
- Role-play and persona adoption
- Crescendo / gradual escalation over many turns
- Contextual ambiguity and misdirection
- Refusal reframing ("actually, the safe thing is to answer…")
- Information decomposition and reassembly

The interesting part is how differently each model family responds when you lean on those patterns.

---

## Single-turn vs multi-turn: why the gap is so large

Single-turn testing is the comfort blanket of LLM security.

You take a red-team prompt, send it once, see a refusal, and a dashboard somewhere glows green. The problem is that the model only had to be correct for one step, in the most artificial setting possible.

Multi-turn attacks are closer to how things look in production:

1. Establish a benign-looking context
2. Build rapport with the system or persona
3. Slowly push on boundaries and policies
4. Reframe refusals as misunderstandings
5. Iterate until you get the style of answer you want

Why this beats most guardrails:

**Policy is rarely modeled as a stateful constraint.** A lot of safety tuning focuses on the first visible "bad" request, not the accumulated conversation.

**Refusal templates leak patterns.** Once you see how a model refuses, you can start steering it just away from those triggers.

**Safety tokens get diluted in longer context.** Safety instructions are often buried in a giant preamble that competes with user content, tool outputs, RAG context and previous turns.

**Alignment was tuned on short interactions.** Many open-weight models were never optimized for resisting 10-step manipulation; they were optimized to not immediately do something obviously catastrophic.

The Cisco results are basically a large-scale demonstration of this pattern: as soon as you let an attacker adapt to model behavior over several turns, most lab-side guardrails crumble.

---

## Capability-first vs safety-first: alignment fingerprints

One thing the paper calls out explicitly is how lab priorities show up in the numbers.

Very roughly:

### Capability-first open-weights
- Examples in the dataset: Qwen3, Mistral Large-2, Llama 3.3-70B-Instruct
- These ship with strong general capabilities and comparatively lighter, more "developer-responsibility" safety baselines
- Result: modest single-turn jailbreak rates, but very large gaps once you move to multi-turn (70 percentage points or more in some cases)

### More safety-heavy stacks
- Examples: Gemma 3–1B-IT, OpenAI's GPT-OSS-20B
- These trade some convenience and capability for more aggressive refusals and tighter policies
- Result: lower overall attack success and much smaller single-turn vs multi-turn gaps

The important nuance: a small gap does not automatically mean "safe". It can also mean "equally vulnerable in single- and multi-turn", or "refuses a lot of benign things too".

For defenders, the gap is mostly a signal about how much extra risk appears once users are allowed to have long, messy conversations with the model. That matters a lot if you're deploying chat-style agents.

---

## Why open-weight makes this spicier

The paper is explicitly about open-weight models, not closed APIs, and that choice matters.

With open-weights you get:
- Full access to the model params (so black-box assumptions break down)
- Freedom to fine-tune away safety or re-align the model to your own "business goals"
- The ability for attackers to run the same model privately, run their own search for good jailbreaks, then bring those prompts back to your production app

Cisco points out both sides of this:
- **Positive:** open-weights are great for research, customization, internal deployments and security testing
- **Negative:** they are equally useful for building "de-aligned" assistants, or for iterating offensive prompts that will transfer to other deployments of the same family

In other words: if you adopt an open-weight model that is known to be fragile in multi-turn scenarios, you should assume that motivated attackers can and will pre-compute conversations that walk straight through your default guardrails.

---

## Threat categories: not all failures are equal

The report doesn't just give one big "attack success rate" and call it a day. It breaks things down into threat categories and "subthreats" (102 of them in total) and then looks at which buckets light up most.

A few patterns:

**Manipulation and misinformation stay consistently high across models.** Steering narrative, bias, or factual output is still much easier than forcing obviously malicious code out of a model.

**Malicious code generation and exploitation content do vary more,** but long-conversation attacks still punch holes in most of the guardrails here.

**Context and semantic manipulation are where we see the biggest spread:** some models are relatively robust, others leak badly under multi-turn pressure.

For defenders, that suggests two practical things:

1. **You need threat-specific tuning and detection, not a single "safety" score.** A model that is decent at refusing one class of bad content might be terrible at another.

2. **You want multi-turn coverage for high-risk categories first.** If you have limited time and budget, don't start with esoteric edge cases; start with the top 10–15 subthreats where success rates are already high.

This aligns well with how we normally work in appsec: fix the highest-impact bug classes first (RCE, auth bypass), then work your way down.

---

## How this fits with prompt injection and IOH

On Vortex Node we've already walked through:
- Manual prompt injection (direct and indirect)
- Jailbreaking patterns for appsec / red-teamers
- Insecure Output Handling (LLM output → HTML / SQL / shell / workflows)

Death by a Thousand Prompts essentially sits one layer below those posts and says:

**Even if you do everything else "right" at the application level, the base model you chained in behind your agent might still fold under realistic multi-turn pressure.**

That has some concrete consequences:

**If your prompt injection tests look fine in a one-shot harness** but you never test "slow-burn" multi-turn attacks, your view of risk is optimistic.

**If your IOH / sink mapping is solid,** but the model becomes much more "helpful" after four turns of social-engineering, then those sinks are only conditionally protected.

**If you're doing fine-tuning** to make the model more useful for your use case, you may also be eroding whatever fragile multi-turn safety it had out of the box.

So the right mental model is:

> Base model jailbreak risk × prompt-injection surface × IOH sinks × your own fine-tuning

That product is the thing you actually deploy, not the model card.

---

## What defenders should take away from this

If you're responsible for AI security, some points to bake into your process:

### 1. Treat multi-turn testing as table stakes

Single-turn harnesses are still useful (regression, quick checks), but they can't be the main line of defense.

You want:
- Automated, adversarial search across multi-turn conversations
- Coverage over your own safety / policy space, not just generic "jailbreak prompts from the internet"
- Metrics that explicitly separate single vs multi-turn gaps

If a model looks fine under single-turn testing but your multi-turn harness reports "60–90% success for realistic attack strategies", you should treat that as a red flag for production use.

### 2. Assume the model is the attacker's microservice

This is the same mindset as in the IOH article:
- The LLM is not "on your side".
- Its outputs are not trusted just because the first answer was helpful.
- Every additional turn is more untrusted data flowing into your backend.

Your app-level defenses (validation, sandboxing, allowlists, isolation) need to be strong enough that even a fully jailbroken model can't do real damage when it talks to tools, HTML, SQL, or workflows.

### 3. Pick open-weights with eyes open

When you select an open-weight base model, include multi-turn jailbreak resilience as a decision factor, not just:
- License
- Context window
- Benchmark score
- Cost

If a lab's philosophy is "we ship capabilities; you add safety", then your deployment plan must include:
- Strong system-prompt design that survives long contexts
- External guardrails (policy engines, refusal models, content filters)
- Ongoing red-teaming focused on your real use cases

If you don't have the capacity to build that, a more conservative, safety-heavy model might actually be the correct choice even if its raw capabilities are slightly lower.

### 4. Align tests to your actual risk surface

The Cisco work is general-purpose. In your environment, you want to specialize:

**If you have agents with shell / code tools,** bias testing towards command and code-generation threats.

**If you embed model outputs into HTML or docs,** prioritize manipulation / misinformation and XSS-style threats.

**If the main risk is data exfiltration,** focus on extraction prompts, schema discovery, and "helpful" queries that cross trust boundaries.

The report's list of high-success subthreats is a good starting seed for internal test suites, but your own architecture should drive the final mix.

### 5. Keep iterating as models and defenses change

One subtle point from the paper: because testing uses another LLM as the "attacker" and "judge", there is inherent noise in the measurements. You should expect some false positives / negatives and variations across runs.

That's not an excuse to ignore the results. It's a reminder that:

**You need regression:** replay the same attack suites after every major model or policy update.

**You need trend-lines, not single data points:** "our multi-turn jailbreak rate is dropping over time" is more important than the exact number on any given day.

---

## Final thoughts

Death by a Thousand Prompts doesn't reveal a brand-new vuln class. It does something more uncomfortable: it tells us that many of the current "aligned" open-weight models are only aligned in a very narrow sense.

**They behave well when you talk to them like a benchmark.**  
**They behave much less well when you talk to them like an attacker.**

If you're building or testing AI systems today, that should change how you budget your time:

**Fewer hero demos of "look, it refused this prompt".**

**More boring, systematic multi-turn abuse** until you understand where it actually cracks.

**More investment in defenses** that assume the model will get jailbroken eventually, and make sure that's just an annoying log entry rather than an incident report.

The thousand prompts are coming either way. Better they come from your own red-team lab than from someone else's playbook.

---

[Original Source](_No response_)
