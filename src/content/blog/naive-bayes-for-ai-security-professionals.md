---
title: "Naive bayes for AI security professionals"
description: "Naive bayes for AI security professionals"
pubDate: 2025-11-09
category: "Learning"
tags: ["_No response_"]
image: "AITesting.png"
draft: false
---

## What is Naive Bayes

Naive Bayes is a **probabilistic** algorithm for **classification**. It applies **Bayes theorem** with a **naive** assumption that features are **independent given the class**.  
In security, it shines on **text and token** features that are high dimensional and sparse, like emails, URLs, domains, and logs. It is fast, simple, and often a very strong baseline.

## Bayes theorem in plain words

We want the probability that an item belongs to a class **C** after seeing evidence **x**.

P(C | x) = P(x | C) * P(C) / P(x)

- **P(C)** prior belief about the class before seeing features  
- **P(x | C)** likelihood of seeing these features if the class is C  
- **P(x)** evidence term that normalizes results

Naive Bayes multiplies the likelihoods of individual features as if they are independent given the class:

P(C | x1, x2, …, xn) ∝ P(C) * Π P(xi | C)

In practice we work in log space to avoid underflow:

log P(C | x) = log P(C) + Σ log P(xi | C)  (+ constant)

## How Naive Bayes works step by step

Using a spam example with simple clues:

1. **Estimate priors**  
   From labeled data, compute **P(Spam)** and **P(NotSpam)**.

2. **Estimate likelihoods**  
   For each feature and class, learn **P(feature | class)**.  
   Examples  
   - P(Has_URL = Yes | Spam)  
   - P(Contains “urgent” = Yes | Spam)

3. **Score a new email**  
   Combine prior and likelihoods for each class using the formulas above.

4. **Predict**  
   Pick the class with the higher posterior. Optionally, compare the posterior to an operating threshold that fits your SOC capacity.

## Types of Naive Bayes

- **Multinomial Naive Bayes**  
  For **counts** of tokens such as word or character n-grams in emails, URLs, domains, or logs. Great default for text.

- **Bernoulli Naive Bayes**  
  For **binary presence** features such as “contains urgent” or “has URL”.

- **Gaussian Naive Bayes**  
  For **continuous** numeric features that are roughly Gaussian (e.g., simple statistical telemetry per event).

- **Complement Naive Bayes**  
  A variant robust to **class imbalance** in text; often improves over vanilla Multinomial for rare attacks.

## Smoothing to avoid zero probabilities

Zero counts would make `P(x | C) = 0` and zero out the whole product. Use Laplace or Lidstone smoothing.

Multinomial NB with vocabulary size **V**:

P(w | C) = ( count(w, C) + α ) / ( Σ_w' count(w', C) + α * V )

- **α = 1** Laplace smoothing  
- **0 < α < 1** Lidstone smoothing

## Small worked spam example

Suppose priors from past data  
- P(Spam) = 0.2, P(NotSpam) = 0.8

Binary features for a new mail  
- Has_URL = Yes  
- Contains_Urgent = Yes

From training  
- P(Has_URL = Yes | Spam) = 0.8, P(Has_URL = Yes | NotSpam) = 0.2  
- P(Contains_Urgent = Yes | Spam) = 0.5, P(Contains_Urgent = Yes | NotSpam) = 0.1

Unnormalized posteriors

Score(Spam)     = 0.2  * 0.8 * 0.5   = 0.08 Score(NotSpam)  = 0.8  * 0.2 * 0.1   = 0.016

Normalize

P(Spam | x)    = 0.08 / (0.08 + 0.016)  ≈ 0.833 P(NotSpam | x) = 0.016 / (0.096)        ≈ 0.167

Predict **Spam**. In production you would compute this in **log space**.

## Security examples that click

**Spam or not spam**  
- **Features** word counts, presence of “urgent”, URL count, domain age, sender reputation  
- **Model** Multinomial or Bernoulli NB  
- **Action** quarantine if probability --> threshold

**Phishing or not**  
- **Features** character n-grams in URLs, brand lookalike tokens, path patterns, TLD  
- **Model** Multinomial NB over URL tokens  
- **Action** rewrite or block above threshold

**DGA domain or benign**  
- **Features** character n-grams, vowel runs, digit ratio  
- **Model** Multinomial NB  
- **Action** sinkhole or step-up checks if probability high

**Suspicious login or normal**  
- **Features** discretized hour bin, geo velocity bucket, device novelty flag  
- **Model** Bernoulli or Gaussian NB depending on encoding  
- **Action** trigger MFA if probability high

## Training workflow for Naive Bayes

1. **Define the decision** spam, phishing, DGA, suspicious login  
2. **Collect labeled data** from past weeks  
3. **Tokenize and encode** words or character n-grams, build vocabulary  
4. **Split by time** train on earlier weeks --> validate on next week --> test on a later sealed week  
5. **Train** choose Multinomial or Bernoulli, set smoothing α  
6. **Tune** vocabulary size, n-gram range, α, and operating threshold  
7. **Calibrate** probabilities if you will use them directly in policy  
8. **Test once** on the sealed window and deploy

## Evaluation that matches reality

- **Precision, Recall, F1, PR-AUC** best for rare attacks  
- **Calibration quality** reliability curves and Brier score  
- **Confusion matrix by week** spot drift and seasonal changes  
- **Operating point** set the threshold to match analyst capacity and risk tolerance

## Strengths

- **Fast and light** scales to huge vocabularies and streams  
- **Simple and explainable** contributions from each token can be reported  
- **Surprisingly strong baseline** for text and URL tasks  
- **Few data requirements** works well with limited training data

## Limitations

- **Independence assumption** tokens often correlate; NB ignores interactions  
- **Poor raw calibration** probabilities can be overconfident  
- **Sensitive to vocabulary and preprocessing** choices matter a lot

**Mitigations**  
- Add **character n-grams** and simple interaction tokens to soften independence issues  
- Use **isotonic** or **Platt scaling** to calibrate probabilities  
- Monitor **drift** and refresh vocabulary and priors periodically

## Handling class imbalance

- Adjust **priors** explicitly or via class weights in training counts  
- Use **Complement NB** for skewed text problems  
- Tune **threshold** for Precision --> Recall trade-off that fits operations  
- Evaluate with **PR-AUC** rather than accuracy

## Security focused testing checklist

- [ ] Inspect priors and likelihoods which tokens push decisions  
- [ ] Verify input validation and tokenizer behavior on weird inputs  
- [ ] Check smoothing α and vocabulary cutoffs prevent zero probabilities  
- [ ] Probe controllable features attackers can add benign words to dilute signals  
- [ ] Sweep thresholds and review Precision --> Recall trade-off  
- [ ] Check calibration reliability curves and Brier score  
- [ ] Validate on **future** time windows not random splits  
- [ ] Monitor token drift new brands, slang, and TLDs

## Threats and mitigations

- **Feature gaming** attackers add benign tokens to pull probability below threshold  
  - *Mitigate* use character n-grams, URL structure features, and ensembles

- **Data poisoning** attackers inject mislabeled or crafted messages to skew priors or token counts  
  - *Mitigate* label hygiene, change control, outlier screening, robust updates

- **Model extraction** with query access, token contributions are often inferable  
  - *Mitigate* rate limiting, aggregation, limit detailed explanations

- **Concept drift** language and attacker tactics evolve  
  - *Mitigate* sliding-window retraining and vocabulary refresh

## Takeaways

- Use **Multinomial or Bernoulli Naive Bayes** for token heavy tasks like spam, phishing, and DGA detection  
- Keep features simple and human readable; prefer character n-grams to resist obfuscation  
- Set **smoothing**, **thresholds**, and **calibration** deliberately  
- Validate on **future** data and retrain to track drift  
- Naive Bayes is a fast, explainable baseline that often gets you most of the way with very little compute
---

[Original Source](_No response_)
