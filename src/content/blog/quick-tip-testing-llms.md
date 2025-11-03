---
title: "Quick Tip: Testing LLM Outputs"
description: "A quick guide to validating LLM responses programmatically"
pubDate: 2024-01-15
category: "Testing"
icon: "🧪"
tags: ["LLM", "testing", "quick-tip"]
draft: false
---

## The Problem

When working with LLMs, outputs can be unpredictable. A simple assertion might not cut it.

## Quick Solution

Use semantic similarity checks instead of exact matches:

```python
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

model = SentenceTransformer('all-MiniLM-L6-v2')

def validate_output(generated, expected):
    embeds = model.encode([generated, expected])
    similarity = cosine_similarity([embeds[0]], [embeds[1]])[0][0]
    return similarity > 0.8  # Adjust threshold as needed
```

This allows for natural language variation while ensuring the core meaning is preserved.

## Next Steps

Consider adding:
- Fuzzy matching for specific keywords
- JSON schema validation for structured outputs
- Length constraints for safety

Happy testing! 🚀
