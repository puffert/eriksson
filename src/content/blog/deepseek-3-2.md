---
title: "Deepseek 3.2"
description: "New version if deepseek"
pubDate: 2025-12-02
category: "News"
tags: ["_No response_"]
image: "news.png"
draft: false
---


## DeepSeek-V3.2 and V3.2-Speciale

DeepSeek has announced **DeepSeek-V3.2** and a related high-compute variant **DeepSeek-V3.2-Speciale**. DeepSeek describes the release as focused on (1) a sparse attention method for long-context efficiency, (2) a scaled reinforcement-learning (RL) post-training protocol, and (3) a large-scale synthetic data pipeline for tool-use/agent tasks.

### What was released
- **DeepSeek-V3.2** (model weights released on Hugging Face, MIT license).
- **DeepSeek-V3.2-Speciale** (model released on Hugging Face, MIT license). The model documentation states it is intended for deep reasoning and **does not support tool calling**.
- **API availability**: DeepSeek’s API release note states V3.2-Speciale is exposed via a **temporary endpoint** and available **until Dec 15, 2025, 15:59 UTC** (with “same pricing as V3.2” and “no tool calls”).
- **API model details**: DeepSeek’s API documentation lists **128K context length** and indicates tool calls are available for V3.2 (thinking and non-thinking modes) but not for V3.2-Speciale.

### Technical claims (as stated by DeepSeek)
- **DeepSeek Sparse Attention (DSA)**: Described as a two-part mechanism—an indexing component plus fine-grained token selection that retrieves a top-k subset of key/value entries; the indexer is described as implementable in **FP8** for efficiency.
- **Scaled RL post-training**: The paper states a framework allocating a **post-training compute budget exceeding 10% of pre-training cost**.
- **Agent/task synthesis scale**: The paper states the pipeline generated **1,800+ environments** and **85,000 complex prompts** to support agent-focused training.

### Evaluation claims (as stated by DeepSeek)
DeepSeek reports results across reasoning and agentic benchmarks (including AIME 2025, HMMT 2025, Codeforces, SWE Verified, Terminal-Bench 2.0, and a “Tool Decathlon”), and positions V3.2 and V3.2-Speciale against proprietary baselines in summary figures. DeepSeek also states it published selected olympiad case materials in the model assets for secondary verification.

---

## Additional resources (no links)

### Primary sources to consult
- The DeepSeek-V3.2 technical report (PDF).
- The DeepSeek API “DeepSeek-V3.2 Release” post (endpoint window and feature notes).
- The DeepSeek API “Models & Pricing” documentation (context length, tool-call support, endpoints).
- Hugging Face model pages for DeepSeek-V3.2 and DeepSeek-V3.2-Speciale (release packaging and assets).

### Deployment / serving notes to consult
- vLLM support notes for DeepSeek-V3.2-Exp sparse attention (implementation details for serving).
- The DeepSeek-V3.2-Exp repository documentation (artifacts and benchmark tables).

### Independent reporting/context to consult
- Reuters reporting on DeepSeek’s sparse attention and cost framing around the V3.2-Exp line.
- Wall Street Journal reporting on sparse attention and efficiency claims.
- Tom’s Hardware reporting focused on deployment ecosystems and hardware support.
---

[Original Source](_No response_)
