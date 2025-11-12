---
title: "DBSCAN and HDBSCAN for AI security professionals"
description: "DBSCAN and HDBSCAN for AI security professionals Unsupervised learning algorithm"
pubDate: 2025-11-12
category: "Learning"
tags: ["_No response_"]
image: "AITesting.png"
draft: false
---
## What they are
DBSCAN and HDBSCAN are **density based** clustering algorithms. They group points that live in **high density** regions and mark **noise** that does not belong to any group.

intuition --> define a neighborhood radius --> dense neighborhoods grow into clusters --> sparse points become noise

- **DBSCAN** needs two knobs `eps` neighborhood size and `min_samples` minimum neighbors to be dense
- **HDBSCAN** removes the `eps` guesswork by building a hierarchy of densities and extracting stable clusters automatically; it also labels noise

## Why security teams use them
- **Campaign and infrastructure discovery** clusters appear in natural shapes without forcing k
- **Noise handling** obvious one offs are flagged as noise instead of forced into a cluster
- **Variable density** HDBSCAN handles tight and loose groups better than k-means

## How DBSCAN works step by step
1. For each point count neighbors within **eps**
2. If neighbors >= **min_samples** mark as **core** point
3. Grow a cluster by visiting all points density reachable from any core
4. Points not assigned become **noise**

## How HDBSCAN works step by step
1. Transform distances into **mutual reachability** distances
2. Build a **minimum spanning tree** over points
3. Condense the hierarchy using **min_cluster_size**
4. Extract **stable** clusters and label low stability as **noise**

## Security examples that click
- **Phishing campaign clustering**  
  features --> URL character n grams TF IDF, domain age, brand tokens  
  output --> organically shaped clusters by campaign, plus noise for one offs

- **Infrastructure grouping**  
  features --> TLS JA3 or JA4 fingerprints, cert issuer, ASN, hosting region  
  output --> clusters per operator infra even if density varies

- **Binary or process family discovery**  
  features --> section entropy, import counts, tokenized commands after PCA  
  output --> families without pre setting k, scattered experiments go to noise

## Feature engineering and scaling
- **Scale features** standardize or use cosine distance on L2 normalized TF IDF
- **High dimensional** reduce with **PCA** or **Truncated SVD** to 20 --> 100
- **Distance choice** Euclidean for dense numeric, cosine for text like URLs

## Choosing parameters
- **DBSCAN**  
  - `eps` set via **k distance plot** choose the elbow of the k nearest neighbor distance curve  
  - `min_samples` 5 --> 15 typical start higher for noisy data

- **HDBSCAN**  
  - `min_cluster_size` smallest group you care about operationally  
  - `min_samples` higher gives more noise and stricter cores default to `min_cluster_size`

## Evaluation that matches operations
- Internal cluster quality **silhouette with your chosen metric**, **Davies–Bouldin**  
- **Stability** overlap of clusters across resamples or windows  
- **Analyst utility** percent of alerts deduplicated, time saved, precision of sampled clusters

## Practical workflow
1. Define **goal** campaign map, infra map, or dedup map
2. Encode and **scale** features lock scalers to the training window
3. Sweep parameters  
   - DBSCAN sweep `eps` using k distance elbow  
   - HDBSCAN sweep `min_cluster_size` across a small grid
4. Check quality and **stability** across random seeds and weeks
5. **Name clusters** top terms, exemplar URLs, common certs
6. Integrate cluster id --> ticket, rule routing, dashboard
7. Monitor **drift** cluster counts, size distribution, stability

## Pitfalls and fixes
- **Curse of dimensionality** distances flatten  
  fix --> PCA or SVD before clustering
- **Bad scaling dominates** one feature overpowers metric  
  fix --> standardize or normalize first
- **Parameter sensitivity** tiny `eps` splits clusters, large `eps` merges everything  
  fix --> use k distance elbow or prefer **HDBSCAN**
- **Mixed densities** DBSCAN struggles  
  fix --> **HDBSCAN** handles this case

## Common hyperparameters
- **DBSCAN** `eps`, `min_samples`, `metric` euclidean or cosine  
- **HDBSCAN** `min_cluster_size`, `min_samples`, `metric`, `cluster_selection_method` eom or leaf

## Security focused testing checklist
- [ ] Verify scaling and dimensionality reduction fitted on **past only**
- [ ] For DBSCAN plot **k distance** to select `eps`
- [ ] For HDBSCAN sweep **min_cluster_size** and inspect stability
- [ ] Sample each cluster for analyst sanity checks and naming
- [ ] Track noise rate, cluster sizes, and stability over time
- [ ] Guard against leakage remove post verdict or future only fields

## Threats and mitigations
- **Feature gaming** attacker nudges features toward benign cluster core  
  - mitigate --> include hard to fake features domain age, ASN, cert lineage and backstop with supervised checks
- **Poisoning** many injected samples pull density  
  - mitigate --> rate limit training contributions, outlier screens, rolling windows
- **Concept drift** shapes move as campaigns evolve  
  - mitigate --> scheduled refits, compare cluster stability and rename or merge

## Takeaways
Use **DBSCAN** when you can set a good neighborhood scale and want noise labeling. Use **HDBSCAN** when densities vary or you do not want to guess `eps`. Always **scale**, usually **reduce**, and validate cluster **stability** and **utility**.

---

[Original Source](_No response_)
