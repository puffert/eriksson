---
title: "Unsupervised learning algorithm a quick comparison"
description: "Unsupervised learning algorithm a quick comparison"
pubDate: 2025-11-12
category: "Learning"
tags: ["_No response_"]
image: "AITesting.png"
draft: false
---

## At a glance
- **K-means** → fast clustering when groups are compact and similar size  
- **DBSCAN and HDBSCAN** → clusters of any shape with built in noise labeling  
- **Gaussian Mixture Models** → soft clusters plus a density score  
- **Agglomerative clustering** → hierarchical view you can cut at any level  
- **Spectral clustering** → non convex structure when a good similarity graph exists  
- **PCA and Truncated SVD** → compress features for speed and clarity  
- **UMAP and t SNE** → 2D maps for analyst triage not for policy  
- **Isolation Forest** → strong default for point anomalies  
- **Local Outlier Factor** → find locally sparse points  
- **One Class SVM** → frontier around normal with kernels  
- **Autoencoder anomaly** → reconstruction error for complex signals  
- **Graph communities and embeddings** → find operator cohorts in indicator graphs  
- **BIRCH and k medoids** → very large data or outlier robust clustering

---

## Comparison table

| Algorithm | Best for | Strengths | Watch outs | Typical security uses |
|---|---|---|---|---|
| **K-means** | Compact similar size clusters | Very fast, scalable, simple | Needs k, Euclidean scale sensitive, outliers pull centroids | Phishing campaign grouping from TF IDF after PCA, alert dedup buckets |
| **DBSCAN** | Arbitrary shapes with single density | Finds noise, no k | Choose eps well, mixed densities hurt | Infra clustering from TLS or URL features with noise points |
| **HDBSCAN** | Variable density clusters | Auto selects clusters, labels noise | Few knobs but still metric sensitive | Campaign discovery when densities vary across families |
| **GMM** | Elliptical soft clusters and density | Probabilities per cluster, log likelihood for anomaly | Choose K, scale features, covariance issues | Auth cohorts and low likelihood session alerts |
| **Agglomerative** | Hierarchical exploration | Dendrogram insights, flexible linkage | Needs cut level, O(n²) on large sets | Group similar alerts or binaries at different granularities |
| **Spectral** | Non convex structure on graphs | Separates intertwined shapes | Build and tune similarity graph | Domain similarity graph clustering from n grams and WHOIS |
| **PCA** | Numeric compression | Fast, stable, improves distance | Max variance ≠ max separation | Reduce URL email features 100 → 20 for faster models |
| **Truncated SVD** | Sparse text compression | Works on TF IDF directly | Dense output still needs scaling | Compress URL or email n grams before clustering or SVM |
| **UMAP t SNE** | Visual maps | Great analyst triage views | Not for policies thresholds unstable | Map alerts to see campaign islands and outliers |
| **Isolation Forest** | General point anomalies | Few assumptions, robust, fast | Thresholding and contamination choice | Login DNS process anomalies as ranked leads |
| **Local Outlier Factor** | Local density anomalies | Captures neighborhood rarity | Sensitive to k and scale | Rare device geo combos in auth streams |
| **One Class SVM** | Boundary around normal | Kernel flexibility | Needs scaling and tuning nu gamma | Baseline normal per tenant then score sessions |
| **Autoencoder** | Complex reconstruction anomalies | Learns nonlinear structure | More tuning compute less explainable | Unusual process trees command lines network bursts |
| **Graph communities and embeddings** | Relationships matter | Operator cohort mapping, inductive embeddings | Hubs and stale edges can mislead | Domain IP cert communities node2vec then HDBSCAN |
| **BIRCH k medoids** | Massive data or outlier robustness | Stream friendly or medoid exemplars | Coarse splits for BIRCH, slower for medoids | Large scale alert dedup keep a real exemplar per cluster |

---

## How to choose in practice

- **Campaign and infrastructure maps**  
  - Start **K-means** after **PCA SVD** → if shapes are weird or densities vary go **HDBSCAN**  
  - On graphs use **Louvain Leiden** communities or **node2vec** → cluster embeddings

- **Anomaly alert feeds**  
  - Start **Isolation Forest** → compare **LOF** and **PCA residual** → consider **One Class SVM** if boundary is curved  
  - For sequences or rich signals try an **Autoencoder** if you can afford tuning

- **Text and URL tokens high dimensional and sparse**  
  - **Truncated SVD** for compression → **K-means** or **HDBSCAN** for campaigns → **Isolation Forest** for anomalies

- **Mixed tabular metadata**  
  - **PCA** to 10 → 30 components → **K-means** or **GMM** for cohorts → **Isolation Forest** for outliers

- **Visualization for triage**  
  - Build **UMAP t SNE** maps from **PCA SVD** inputs → use for human sensemaking only

- **Operational constraints**  
  - Tight latency and simplicity → **K-means** or **Isolation Forest**  
  - Heavy scale → **MiniBatch K-means** or **BIRCH**  
  - Need soft membership and density → **GMM**

---

## Metrics that match operations

- **Clustering quality** silhouette and Davies–Bouldin higher silhouette lower DBI → better cohesion and separation  
- **Anomaly usefulness** Precision at top k weekly labeled sample time to detect analyst effort saved  
- **Compression adequacy** cumulative explained variance and downstream model performance  
- **Stability over time** cluster overlap across weeks centroid drift community modularity

---

## Simple starting playbook

- **Email and URL campaign discovery**  
  TF IDF → **Truncated SVD** → **HDBSCAN** → name clusters with top terms → route tickets by cluster id

- **Auth anomaly surfacing**  
  Engineer user normalized features → **Isolation Forest** → set threshold for daily alert budget → review Precision at k weekly

- **Infra grouping from TLS or DNS**  
  Handcraft fingerprints and ages → **PCA** → **DBSCAN** pick eps via k distance elbow → noise are probes one offs

- **Analyst triage map**  
  PCA → **UMAP** → plot clusters and scatter of anomalies → link points to raw evidence

---

## Guardrails

- Always **scale** features and fit scalers on past only  
- For distance methods reduce dimensionality first **PCA SVD**  
- Tune parameters with **time aware** validation  
- Treat anomalies as **leads** not verdicts keep a human loop  
- Monitor **drift** and refresh models on a cadence

---

---

[Original Source](_No response_)
