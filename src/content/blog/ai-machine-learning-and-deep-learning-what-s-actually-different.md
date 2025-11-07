---
title: "AI, Machine Learning, and Deep Learning: What’s Actually Different"
description: "Refined notes and thoughts on AI, Machine Learning, and Deep Learning: What’s Actually Different"
pubDate: 2025-11-07
category: "Learning"
tags: ["_No response_"]
image: "AITesting.png"
draft: false
---

People use these terms interchangeably. They shouldn’t.

_TL;DR: AI is the goal (systems that do “intelligent” tasks). ML is how most modern AI is built (learn from data). DL is one family of ML methods (multi-layer neural networks) that dominates vision, speech, and language._

I did the Red Team AI path on Hack The Box. They explained how Artificial Intelligence (AI), Machine Learning (ML), and Deep Learning (DL) relate. If you’re assessing AI systems, getting these fundamentals right helps you reason about risks and attack surfaces.

AI, ML, and DL are related but distinct. Understanding the differences matters when you’re building systems, evaluating tools, or making technical decisions.

The Hierarchy

Artificial Intelligence (AI) is the field.
Machine Learning (ML) is a set of methods within AI for learning from data.
Deep Learning (DL) is a subset of ML that uses deep neural networks.

Think concentric circles: AI >ML > DL.

What that means in practice

Early AI (rule-based, “expert systems”): Hard-coded if-then rules. Brittle and manual to maintain. (Historical example: MYCIN-style systems.)

AI with ML (no DL): Spam filters with Naive Bayes or logistic regression; fraud detection with gradient-boosted trees. Learns from data without neural nets.

AI with ML + DL: Vision, speech, and language systems built with deep nets (e.g., image classifiers, modern translation, large language models).


Examples:

Tesla Autopilot: An AI system built largely with deep neural networks trained via large-scale supervised learning on driving video; perception uses modern vision models.

ChatGPT / Claude: AI systems built with DL (Transformer architectures) trained via self-supervised pretraining, then fine-tuned (SFT) and aligned (e.g., RLHF/DPO).

Midjourney: DL (diffusion models) for image generation.

Spotify recommendations: ML combining collaborative filtering, embeddings, and other models to analyze listening patterns.

Google Translate: DL (Transformers) for neural machine translation.


Most modern AI uses ML, and a lot of high-impact ML today is DL—but not all ML is neural networks, and on tabular data, tree-based models often win.


---

Artificial Intelligence (AI)

AI is the broad field: systems performing tasks that normally require human intelligence—understanding language, recognizing objects, making decisions, solving problems, learning from experience.

Concrete examples

“Call mom” with Siri > natural language understanding

Cameras recognizing pedestrians > computer vision

Robots navigating stairs > robotics and control

Rule-based diagnostic systems > expert systems (historical)


What AI covers

Natural Language Processing (NLP): understanding and generating human language

Computer Vision: interpreting images and video

Robotics: perception + planning + control

(Historical) Expert Systems: hand-crafted rules for narrow domains


AI augments human capabilities—better decisions, faster analysis, and automation.


---

Machine Learning (ML)

ML is a subset of AI where systems learn patterns from data instead of being explicitly programmed.

Concrete example: spam filtering

Rules-only: Endless if-then lists that break when spammers change tactics.

ML: Train on labeled emails (spam/not spam). The model learns patterns and adapts.


Three major paradigms

Supervised learning (labeled data)

Examples: image classification, spam detection, fraud prevention

Driving example: training on videos labeled “pedestrian,” “stop sign,” “traffic light”


Unsupervised learning (no labels)

Examples: clustering, anomaly detection, dimensionality reduction

Spotify: grouping tracks/users by latent patterns to power discovery


Reinforcement learning (trial and error with rewards)

Examples: game playing, robotics, some control problems

LLM alignment connection: RLHF is a fine-tuning step that uses human preferences after pretraining—not the entire training process.



Where ML is deployed

Healthcare (diagnosis, drug discovery), finance (fraud, risk), marketing (segmentation, recommendations), cybersecurity (threat detection), transportation (routing, autonomy), and more.


---

Deep Learning (DL)

DL is a subset of ML using deep neural networks with many layers. It shines on unstructured/high-dimensional data like images, audio, and text.

Why “deep”? Multiple layers learn increasingly abstract features.

Example: vision stack intuition

Low layers detect edges and textures

Mid layers assemble shapes and parts

High layers recognize objects and context


Key characteristics

Hierarchical feature learning: features are learned automatically rather than engineered.

End-to-end-ish training: minimal feature engineering; train from raw input to target output.

Scales with data and compute: performance often improves as datasets and models grow.


Common architectures

CNNs for images/video (e.g., medical imaging, traffic sign recognition)

Transformers for language and increasingly vision/audio; dominant today

RNNs are historically important for sequences, though many modern systems use Transformers/Conformers instead


Where DL excels

Vision, speech recognition, translation, code generation, and generative media (images/audio/video).


---

Generative AI and Large Language Models (LLMs)

Generative AI creates new content: text, images, audio, video, code.

Where it fits: Generative AI typically uses DL architectures and ML training procedures.

Examples

ChatGPT / Claude: generate and reason over text/code

Midjourney: generates images from text prompts

GitHub Copilot: assists with code generation

Text-to-speech tools: generate realistic speech from text


LLMs are a specific kind of generative AI for text, built with Transformers.

How LLMs are trained (modern view)

1. Self-supervised pretraining: predict the next token on massive text corpora.


2. Supervised fine-tuning (SFT): learn from curated prompt→response pairs.


3. Alignment (RLHF or DPO): optimize model behavior to match human preferences.



Result: a model that produces useful, human-like text.


---

How They Work Together

ML/DL are the techniques; AI is the application you interact with.

Tesla Autopilot (high level)

What it is: AI for autonomous driving

How it works (simplified):

Cameras capture video (input)

Deep vision models process scenes (DL architectures)

Trained primarily with large-scale supervised learning on labeled driving data


Outcome: Perception and planning for driving assistance


LLMs (e.g., ChatGPT/Claude)

What they are: AI for conversation and analysis

How they work: Transformers + pretraining → SFT → alignment (RLHF/DPO)

Outcome: Text generation, reasoning, and tool use


Midjourney

What it is: AI for image generation

How it works: Diffusion models trained on image–text pairs; minimal feature engineering

Outcome: Images from text prompts


Google Translate (modern)

What it is: AI for translation

How it works: Transformer-based neural machine translation trained on parallel corpora

Outcome: Translation across many languages



---

Why This Matters for Security

Security assessments benefit from thinking in layers:

AI layer (application): What is the system’s purpose? What decisions does it make? What data does it handle and expose?

ML layer (training & data): What data was used? How was it labeled? What learning paradigm? Can the training or fine-tuning be poisoned?

DL layer (architecture/behavior): What model family? What failure modes (e.g., adversarial examples, overfitting, spurious correlations)?


Threats by layer (cheat sheet)

Layer	Example Targets	Representative Risks

AI / Application	LLM chat, autopilot UI, fraud portal	Prompt injection, insecure tool use, authZ bypass, data leakage
ML / Training & Data	Datasets, labeling pipelines, feedback loops	Data poisoning/backdoors, label errors, privacy leakage, bias
DL / Model	CNNs/Transformers, inference endpoints	Adversarial inputs, model extraction, membership inference


Concrete testing angles

LLMs: prompt injection/jailbreaks, retrieval/data exfiltration, tool-use abuse, fine-tuning safety gaps

Vision systems (e.g., traffic signs): adversarial patches, distribution shift, sensor spoofing

Fraud detection models: data poisoning, evasion attacks, bias/false-positive auditing


Using the terminology precisely helps you map which attacks apply to which systems and plan red-team activity accordingly.


---

Bottom line: AI is the goal. ML is the set of data-driven methods that power it. DL is the neural-network family inside ML that currently leads on perception and language. Get the hierarchy right, and your build/evaluate/attack decisions get a lot clearer.

---

[Original Source](_No response_)