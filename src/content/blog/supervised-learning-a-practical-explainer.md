---
title: "Supervised learning — a practical explainer"
description: "What supervised learning is, how it works in practice, core algorithms, evaluation, and common pitfalls — explained plainly"
pubDate: 2025-11-08
category: "Learning"
tags: ["_No response_"]
image: "AITesting.png"
draft: false
---

Trying to understand supervised learning can be tough.

Supervised learning is the branch of ML where each example already comes with the correct answer. The goal is to learn a rule that maps features (inputs) --> label (output) in a way that holds up on new data, not just the data you trained on.

A simple analogy helps which I saw on HTB.

_Teaching a child fruits: show an apple and say “apple,” an orange and say “orange.” Over time the child connects characteristics (color, shape, size) --> correct name and can label new fruits._

Supervised learning follows the same pattern: provide labeled examples, learn the mapping, predict for unseen cases.


---

## Everyday security examples

Classification — choose a category

- Phishing detector: email --> phish / not phish.
Features: sender domain age, URL patterns, SPF/DKIM pass, tokens in subject/body.

- Malware family ID: file --> family A / B / C.
Features: extracted opcodes, imported APIs, packer flags, section entropy.

- DGA vs. benign domains: domain --> DGA / legit.
Features: length, vowel–consonant runs, n-gram stats, NXDOMAIN rate.

- Login anomaly: auth event --> suspicious / normal.
Features: geo velocity, device fingerprint, hour of day, failed-attempt streaks.


## Regression — predict a number

- Alert priority score: event --> 0–100 risk.
- Features: MITRE technique, asset criticality, blast radius, threat-intel hits.

- Time to compromise estimate: host posture --> minutes or hours.
- Features: exposed services, patch lag, privilege-graph centrality.



---

## Core terms — security flavored

- Training data: labeled alerts or logs (e.g., SOC-confirmed phish vs. clean).

- Features: what you extract (headers, n-grams, counts, graph metrics).

- Label: the ground truth (phish / not, family name, risk score).

- Model: mapping from features --> label (logistic regression, trees, boosting, neural nets).

- Training: fit parameters to reduce error on labeled events.

Prediction vs. inference: prediction = score today’s email; inference = which features drove the score.



---

## Workflow — threat ops version

1. Define the decision: triage phish, score alerts, flag DGAs.


2. Collect and clean: dedupe, parse, normalize timezones, handle class imbalance.


3. Split wisely: train / validation / test with time order preserved.


4. Train and tune: try a few models; use stratified or time-aware cross-validation.


5. Pick thresholds to match SOC capacity so the queue is workable.


6. Test once on a sealed, later time window; then deploy.




---

## Evaluation that matches security reality

- Classification: Precision, Recall, F1, PR-AUC for rare attacks.

- Phish example: if missing one hurts, raise Recall; if analyst time is scarce, raise Precision.


- Regression: MAE and RMSE for error size, R² for explained variance.

- Cost-sensitive view: weigh false negatives vs. false positives to fit your use case.



---

## Generalization, overfitting and underfitting

### Overfitting — memorizing noise

In practice: the model learns your company’s quirks and fails on a new tenant or next quarter.

- Symptoms: great training score, poor future-week score.

- Causes: model too complex, tiny dataset, data leakage, environment-specific tokens.

Fixes:

- Regularization: L2 or L1 to keep weights small and drop noisy lexical features.

- Early stopping on a later validation slice.

- Simpler model or feature pruning to remove brittle identifiers.

- Time-split cross-validation and grouped CV by user/host to avoid identity leakage.

- Data augmentation and more diverse negatives.



### Underfitting — too simple to learn the pattern

In practice: linear rules on clearly nonlinear signals.

Fixes: richer features, more expressive models, better tuning, longer training.


### Bias–variance dartboard

High bias = darts clustered away from center --> underfit.

High variance = darts scattered everywhere --> overfit.

Tune complexity and regularization until validation on future data is close to training.



---

## Cross-validation — time aware

Rolling or expanding windows: train on earlier months, validate on the next month, slide forward.

Stratified folds for class balance; grouped folds by user/host/campaign to prevent leakage.

Nested CV when comparing many models to avoid optimistic bias.



---

## Data leakage — silent model killer in security

Examples: fitting scalers on the full dataset, using post-verdict fields, mixing future IOCs when predicting the past.

Rule: fit preprocessing only on training folds; keep the test set strictly future.



---

## Regularization — quick security takes

- L2 Ridge / weight decay: smooths weights; great for numeric telemetry.

- L1 Lasso: induces sparsity; ideal for high-dimensional text like tokens and n-grams.

- Elastic Net: a stable, sparse blend.

- Dropout and early stopping: strong defaults for neural nets on URLs, binaries, sequences.



---

## Concept drift and adversaries

Detect drift: track metrics by week, calibration curves, alert volumes.

Mitigate: periodic retraining, sliding windows, refreshed hard negatives, a robust baseline.

Adversarial thinking: avoid brittle string features; favor patterns like length stats, character runs, graph structure.



---

## Security case studies

### Phishing email — classification

Features: domain age, SPF/DKIM, URL token stats, brand-lookalike score.

Label: phish / not.

Metrics: F1, PR-AUC; pick a threshold that caps daily triage load.

Pitfall: leakage from user-reported signals; strip post-decision fields.


### DGA domain — classification

Features: length, entropy, vowel–consonant patterns, n-grams, NXDOMAIN rate.

Label: DGA / benign.

Pitfall: overfitting to one family; fix with regularization and diverse families.


### Alert prioritization — regression

Features: MITRE technique, asset criticality, lateral-movement proximity, external intel.

Label: analyst priority 0–100 or incident severity.

Metrics: MAE for average points off; recalibrate periodically for drift.

---

[Original Source](_No response_)
