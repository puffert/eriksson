---
title: "Critical vulnerabilities in AI inference servers"
description: "Critical vulnerabilities in AI inference servers impact Meta, NVIDIA, Microsoft, vLLM, SGLang, and Modular projects."
pubDate: 2025-11-16
category: "News"
tags: ["_No response_"]
image: "news.png"
draft: false
---

Oligo Security’s new ShadowMQ research uncovers a critical RCE pattern quietly copied across major AI inference stacks from Meta, NVIDIA, Microsoft, vLLM, SGLang and Modular. By combining ZeroMQ with Python pickle over unauthenticated sockets, the same unsafe code path was reused again and again, exposing GPU clusters, model workloads and sensitive data to remote takeover. If you run your own LLM infrastructure or rely on these frameworks, this is essential reading: 

ShadowMQ – How Code Reuse Spread Critical Vulnerabilities Across the AI Ecosystem.

---

[Original Source](https://www.oligo.security/blog/shadowmq-how-code-reuse-spread-critical-vulnerabilities-across-the-ai-ecosystem)