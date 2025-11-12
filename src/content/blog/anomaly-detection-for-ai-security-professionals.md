---
title: "Anomaly detection for AI security professionals"
description: "Unsupervised Algorithm Anomaly detection for AI security professionals. ML"
pubDate: 2025-11-12
category: "Learning"
tags: ["_No response_"]
image: "AITesting.png"
draft: false
---

## What is anomaly detection
Anomaly detection also called outlier detection finds **unusual** data points that deviate from normal patterns.  
intuition --> learn what normal looks like from unlabeled data --> score how strange each new event is --> sort by score for analyst review

## Why security teams use it
- **Surface rare threats** when labels are scarce or delayed
- **Reduce noise** by focusing on top unusual events
- **Hunt at scale** across logs, DNS, email, auth, processes

---

## How it works
1. **Collect normal-ish history** past data assumed mostly benign  
2. **Learn normal** fit a model of typical behavior or density  
3. **Score new items** higher score = more unusual  
4. **Threshold for action** pick a cutoff that matches analyst capacity

Output is usually a **continuous score**  
score --> threshold --> action

---

## Key algorithms
**Isolation based**  
- **Isolation Forest** randomly splits features and measures how quickly a point gets isolated. Rare points isolate fast --> high anomaly score.  
- **HBOS** histogram based outlier score. Unlikely bins in independent histograms raise the score.

**Density based**  
- **Local Outlier Factor** compares local density to neighbors. Much sparser than neighbors --> anomalous.  
- **Gaussian Mixture** models normal as a mix of Gaussians. Low likelihood under the model --> anomalous.

**Boundary based**  
- **One Class SVM** learns a frontier that encloses normal. Points outside the frontier --> anomalous.

**Reconstruction based**  
- **PCA residual** project to principal components and measure reconstruction error.  
- **Autoencoder** compress then reconstruct. Large error --> anomalous.

**Time series quick wins**  
- **Rolling z score** seasonality aware baselines per hour or weekday.  
- **Change point** detect sudden level or variance shifts.

---

## Security examples that click
- **Login anomalies** geo velocity, device novelty, hour bins, failed attempts --> flag unusual combinations  
- **DNS exfil** request size ratio, domain length, n gram scores, NXDOMAIN rate --> flag high scoring flows  
- **Process tree anomalies** rare parent child pairs, command token rarity --> surface odd chains  
- **Email intake** character n grams and URL structure features --> score unusual messages for deeper inspection

---

## Feature engineering and scaling
- **Scale numeric features** standardize so one field does not dominate distance  
- **Use ratios and rates** per user or asset to normalize volume effects  
- **Bucket rare categories** keep top frequent values and map the tail to other  
- **Time awareness** include hour of day, day of week, and rolling baselines  
- **Dimensionality reduction** PCA or Truncated SVD before distance based detectors

---

## Thresholds and operations
- Set a **daily alert budget** first for example top 500 events per day  
- Choose threshold to hit that budget on validation data  
- Provide **context** with each alert why scored high, top contributing features  
- Maintain a **feedback loop** analysts mark useful or not useful to recalibrate

---

## Evaluation that matches reality
- Use **time aware splits** fit on past --> score next period  
- Label a **small sample** of top scored items weekly for truth checks  
- Track **Precision at k** how many top k are truly interesting  
- Plot **PR curves** when you have enough spot labels  
- Measure **time to detect** and **analyst effort saved**  
- Slice results by user, tenant, sender, asset class to find blind spots

---

## Practical workflow
1. **Define scope** which stream and what volume you can triage  
2. **Assemble features** human readable first, then enrich  
3. **Split by time** training window for learning normal, next window for tuning  
4. **Run a small grid** Isolation Forest, LOF, One Class SVM, PCA residual, Autoencoder  
5. **Pick threshold** to meet alert budget with best Precision at k  
6. **Ship to trial** include top reasons and raw evidence  
7. **Monitor weekly** drift in features, score distribution, and precision  
8. **Retrain on a cadence** rolling window to track changing normal

---

## Pitfalls and fixes
- **Concept drift** normal changes over time  
  fix --> rolling retrains, windowed baselines, monitor precision weekly
- **High dimensional distance failure** everything looks equally distant  
  fix --> PCA or feature selection before distance based methods
- **Scale sensitivity** a single large ranged feature dominates  
  fix --> standardize and sanity check ranges at inference
- **Too many alerts** threshold set too low  
  fix --> start with strict top k, widen only if precision stays high
- **Contamination in training** many hidden anomalies in the training window  
  fix --> robust methods Isolation Forest, robust scalers, clean periods where possible
- **Black box scores** analysts need reasons  
  fix --> include top contributing features or nearest neighbors for context

---

## Common hyperparameters
- **Isolation Forest** `n_estimators`, `max_samples`, `max_features`, `contamination` expected anomaly rate  
- **Local Outlier Factor** `n_neighbors`, `contamination`  
- **One Class SVM** `kernel`, `nu` expected outlier fraction, `gamma` for RBF  
- **PCA residual** `n_components` retained variance target  
- **Autoencoder** depth and width, `dropout`, training `epochs`, reconstruction loss

---

## Security focused testing checklist
- [ ] Lock **scalers and compressors** to the training window reuse for scoring  
- [ ] Verify **ranges and units** at inference guard against bad inputs  
- [ ] Run **top k review** and record precision each week  
- [ ] Check **drift** feature histograms, score quantiles, cluster composition  
- [ ] Add **context fields** per alert top features, nearest normal neighbors, example peers  
- [ ] Backstop with **simple rules** to catch obvious misses and cap blast radius  
- [ ] Keep a **holdout period** for periodic unbiased checks

---

## Threats and mitigations
- **Adversarial blending** attacker mimics common patterns to hide in the crowd  
  - mitigate --> richer features that are hard to fake, per cohort baselines, supervised backstops
- **Poisoning normal** injected artifacts shift what looks normal  
  - mitigate --> change control on labels and training windows, robust estimators, outlier filtering
- **Feature manipulation** attacker changes controllable fields  
  - mitigate --> combine independent signals, include environment side features domain age, ASN, cert fingerprints

---

## Takeaways
- Anomaly detection turns unlabeled streams into **ranked leads**  
- Start simple Isolation Forest or PCA residual with time aware thresholds  
- Measure **Precision at k**, keep alerts **explainable**, and retrain on a **rolling window**  
- Treat anomalies as **investigation cues** not verdicts, backed by supervised or rule based checks

---

[Original Source](_No response_)
