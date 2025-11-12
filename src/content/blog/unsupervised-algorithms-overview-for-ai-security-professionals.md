---
title: "Unsupervised Algorithms overview for AI Security Professionals"
description: "Unsupervised Algorithms overview for AI Security Professionals  ML"
pubDate: 2025-11-12
category: "Learning"
tags: ["_No response_"]
image: "AITesting.png"
draft: false
---

## What it is
Unsupervised learning explores **unlabeled** data to uncover structure. Instead of predicting a known label, it looks for **groups**, **lower dimensional structure**, and **unusual** points.

Think “map a new city without a guide”  
signals --> measure similarity --> find groups or outliers --> drive investigations

## Why it matters for security
- **Clustering** groups similar events or entities --> campaign views, infrastructure mapping, user cohorts  
- **Dimensionality reduction** compresses features --> faster models, clearer visual triage  
- **Anomaly detection** surfaces rare or suspicious behavior --> focused hunting

---

## Core concepts in plain words
- **Unlabeled data** no ground truth labels, you learn from the data itself  
- **Similarity measures** Euclidean, cosine, Manhattan decide what “close” means  
- **Clustering tendency** some datasets have no real groups; check before clustering  
- **Cluster validity** internal metrics like **silhouette** and **Davies–Bouldin** gauge cohesion --> separation  
- **Dimensionality** many features dilute distance meaning the **curse of dimensionality**  
- **Intrinsic dimensionality** true degrees of freedom are often smaller than feature count  
- **Anomaly vs outlier** rare points can be errors, noise, or threats — treat as **leads**, not verdicts  
- **Feature scaling** standardize or min–max so one feature does not dominate distance

---

## Three families with security examples

### Clustering
**Goal** find groups that explain the data

- **Phishing campaign clustering**  
  features --> URL character n-grams, domain age, sender org, brand lookalike  
  output --> clusters of similar emails --> blocklist at campaign granularity

- **Infrastructure fingerprinting**  
  features --> cert hash, ASN, hosting ranges, TLS params  
  output --> clusters of hosts that likely belong together --> pivot investigations

- **User behavior cohorts**  
  features --> hour of activity, device set, location mix  
  output --> normal usage groups --> tailor anomaly thresholds per cohort

**Algorithms to know**  
- **k-means** fast on large, spherical clusters; needs **k**; sensitive to scale  
- **DBSCAN** density based; finds arbitrary shapes; flags noise; needs `eps` and `min_samples`  
- **HDBSCAN** like DBSCAN but handles variable density; chooses clusters automatically  
- **Agglomerative** hierarchical view; good for small to medium sets  
- **Spectral** for non-convex structure; requires a good similarity graph

### Dimensionality reduction
**Goal** compress features while keeping signal

- **PCA** orthogonal components that explain variance --> fast, great default  
- **Autoencoders** neural compression; reconstruction error doubles as anomaly score  
- **Random projection** very fast approximate compression  
- **t-SNE and UMAP** for **visualization** and triage maps, not for production distance

**Security uses**  
- Reduce hundreds of URL or header features --> 20 components for faster downstream models  
- Visual “attack map” of alerts; analysts spot tight clusters vs scattered anomalies

### Anomaly detection
**Goal** score **how unusual** each point is

- **Isolation Forest** isolates points via random splits; high scores are rare or easy to isolate  
- **One-Class SVM** learn a frontier around normal; sensitive to scaling and kernel  
- **Local Outlier Factor** low local density compared to neighbors  
- **Elliptic Envelope** assumes Gaussian normal class  
- **Autoencoder reconstruction error** large error --> unusual

**Security uses**  
- **Login anomalies** rare geo velocity or device combinations  
- **DNS exfil** unusual query size ratio or domain patterns  
- **Process trees** odd parent–child paths or rare command lines

---

## Practical workflow for SOC teams
1. **Define the outcome** discovery map vs alerting feed  
2. **Pick features** human-readable first; encode and **scale**  
3. **Time-aware split** fit on past --> score next period to mimic reality  
4. **Run a small grid** of algorithms and parameters  
5. **Validate**  
   - Clustering --> silhouette, Davies–Bouldin, stability across resamples  
   - Anomaly --> label a small sample, use **Precision@k**, review load fits capacity  
6. **Choose thresholds** score --> action threshold that matches analyst bandwidth  
7. **Monitor drift** feature distributions, cluster composition, alert volume; retrain on a cadence

---

## Pitfalls and how to avoid them
- **Distances break in high dimensions** --> reduce with PCA or select features  
- **Scale dominates** --> standardize before distance based methods  
- **Parameter sensitivity** (k in k-means, eps in DBSCAN) --> sweep and check stability  
- **t-SNE or UMAP “clusters”** look real but are for visualization --> do not gate policy on them  
- **False positives** are common in anomalies --> keep a human-review loop and backstop rules  
- **Data leakage over time** fit compressors and detectors on **past only**, score on **future**

---

## Quick chooser
- Mostly **text or URL tokens**, high dimensional and sparse  
  - Cluster campaigns --> **HDBSCAN** or **k-means** after PCA  
  - Anomalies --> **Isolation Forest** or **One-Class SVM** after scaling

- Mixed **tabular metadata** with unknown structure  
  - Start **k-means** and **Agglomerative**; visualize with **PCA**; move to **HDBSCAN** if densities vary

- You need an **alert feed** with one score per event  
  - **Isolation Forest** or **Autoencoder error**; calibrate a stable threshold; track **Precision@k** weekly

- You want fast compression for downstream supervised models  
  - **PCA** or **Random projection**; keep components that explain enough variance

---

## Evaluation that matches operations
- **Clustering** internal metrics (silhouette, DBI), cluster stability, analyst-rated sample quality  
- **Anomaly detection** Precision@k, top-N review rate, time-to-detect, PR curves using spot labels  
- Report by **slices** sender, tenant, asset class to expose blind spots

---

## Security focused testing checklist
- [ ] Scale features and lock preprocessing to training window  
- [ ] Check clustering tendency hopkins statistic or quick visual PCA map  
- [ ] Sweep parameters and test stability across resamples  
- [ ] Label small samples from each cluster and from top anomalies  
- [ ] Set and review thresholds so daily alerts fit analyst capacity  
- [ ] Monitor drift in features, cluster counts, and anomaly score distribution  
- [ ] Document decisions so clusters and thresholds are auditable

---

## Takeaways
- Unsupervised learning turns unlabeled telemetry into **maps** and **leads**  
- Start simple PCA --> k-means for maps, Isolation Forest for alerts  
- Treat anomalies as **investigation cues**, not automatic verdicts  
- Keep workflows **time aware**, thresholds **operational**, and retraining **routine**
```0

---

[Original Source](_No response_)
