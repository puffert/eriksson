---
title: "New realsese of Garak to test LlMs"
description: "New realsese of Garak to test LlMs"
pubDate: 2025-12-15
category: "Offensive Security"
tags: ["_No response_"]
image: "offensive.png"
draft: false
---

garak (Generative AI Red-teaming & Assessment Kit) is an open-source LLM vulnerability scanner developed and maintained by NVIDIA's AI Red Team.

Often described as the "Nmap for LLMs," it is a command-line tool designed to stress-test Large Language Models (LLMs) and dialog systems to discover security weaknesses and alignment failures.

## How It Works
garak automates the "red-teaming" process (simulating cyberattacks) using two main components:
 * Probes: These act as attackers, sending malicious prompts, tricky questions, and adversarial inputs to the target model.
 * Detectors: These analyze the model's output to determine if it succumbed to the attack or failed to adhere to safety guardrails.
 * 
## What It Scans For
garak checks for a wide range of vulnerabilities, including:
 * Prompt Injection: Tricking the model into ignoring instructions.
 * Jailbreaking: Bypassing safety filters to generate restricted content.
 * Hallucination: Generating false or misleading information.
 * Data Leakage: Revealing private or training data.
 * Toxicity: Producing hate speech or offensive content.
It is widely used to evaluate models before deployment and is integrated into NVIDIA’s NeMo Guardrails framework to ensure AI systems are robust and secure.

---

[Original Source](https://github.com/NVIDIA/garak/releases/tag/v0.13.3)
