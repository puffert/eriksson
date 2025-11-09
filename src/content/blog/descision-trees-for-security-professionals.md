---
title: "Descision trees for AI security professionals"
description: "Descision trees for security professionals"
pubDate: 2025-11-09
category: "Learning"
tags: ["_No response_"]
image: "AITesting.png"
draft: false
---

## What is a Decision Tree

A decision tree is a supervised learning algorithm for **classification** and **regression** that learns a set of **if --> then** rules from data. It is literally a tree of questions. Starting at the root, each question splits the data into purer groups until leaves make a final prediction.

Think of an analyst playbook turned into rules:
- If sender is unknown --> check if email has many links
- If links are many --> likely spam
- Else --> likely not spam

Trees learn these rules automatically from labeled examples.

## Core Parts

- **Root node** the first question the tree asks  
- **Internal nodes** questions based on features  
- **Leaf nodes** the final prediction or value

## Why Security Teams Like Trees

- **Explainable** each path is a human readable rule  
- **Fast to evaluate** great for real time decisions  
- **Flexible** capture non linear patterns and feature interactions  
- **Few data assumptions** no linearity or normality required

Note basic libraries often require numeric features and imputation for missing values. Some libraries can handle categorical values and missing values natively.

## How a Tree Learns

At each node the algorithm picks the split that makes the child groups as **pure** as possible.

### Gini impurity
Lower is better, zero means perfectly pure.

Gini(S) = 1 - Σ p_i^2

Example with class proportions 0.6 and 0.4

Gini = 1 - (0.6^2 + 0.4^2) = 0.48

### Entropy
Measures disorder. Lower is better.

Entropy(S) = - Σ p_i * log2(p_i)

Example with 0.6 and 0.4

Entropy = - (0.6 * log2(0.6) + 0.4 * log2(0.4)) ≈ 0.971

### Information gain
How much entropy drops after a split.

Gain(S, A) = Entropy(S) - Σ ( |S_v| / |S| ) * Entropy(S_v)

Pick the feature with the highest gain for the next question.

## Small Tennis Example

Goal predict **Play Tennis** yes or no using **Outlook, Temperature, Humidity, Wind**.  
A common first split is **Outlook**:
- **Overcast** --> mostly yes  
- **Rainy** --> next question could be **Wind**  
- **Sunny** --> next question could be **Humidity**

Follow the questions until leaves predict **Yes** or **No**. That is exactly how a decision tree works on any dataset.

## Security Examples That Click

**Classification**

- **Spam or not spam**  
  - **Features:** has URL, link count, words like urgent or password, unknown sender  
  - **Prediction:** spam or not spam  
  - **Leaf output:** class and probability from class ratios in the leaf

- **Phishing or not**  
  - **Features:** sender reputation, domain age, brand lookalike score, URL count  
  - **Prediction:** phish or not phish

- **Suspicious login or normal**  
  - **Features:** geo velocity, new device, hour of day, failed attempt streak  
  - **Prediction:** suspicious or normal

**Regression**

- **Risk score**  
  - **Features:** MITRE technique, asset criticality, privilege level  
  - **Output:** score 0 --> 100 for triage ordering

- **Expected bandwidth**  
  - **Features:** time of day, weekday flag, active sessions  
  - **Output:** Mbps baseline for anomaly detection

## Training Workflow For A Tree

1. **Define the decision** classify email, score alerts, flag suspicious logins  
2. **Collect labeled data** past emails, alerts, auth logs  
3. **Prepare features** simple, human readable clues work well  
4. **Split by time** train on earlier weeks --> validate on next week --> test on a later sealed week  
5. **Train the tree** pick Gini or entropy as the criterion  
6. **Tune depth and leaf sizes** to control complexity  
7. **Pick operating threshold** if using probabilities for actions  
8. **Test once** on the sealed window and deploy

## Evaluation That Matches Reality

- **Classification** Precision, Recall, F1, PR AUC for rare attacks  
- **Regression** MAE, RMSE, R²  
- **Operating point** choose the threshold that fits analyst capacity and risk tolerance  
- **Slice metrics over time** detect drift and seasonality

## Overfitting And How To Prevent It

Trees can grow too deep and memorize noise.

**Signs**
- Excellent training accuracy --> worse validation accuracy  
- Very deep tree with many tiny leaves

**Causes**
- Deep unrestricted growth  
- Tiny leaves that capture quirks  
- Data leakage

**Fixes**
- **Limit depth** `max_depth`  
- **Minimum samples** `min_samples_split`, `min_samples_leaf`  
- **Limit features per split** `max_features`  
- **Cost complexity pruning** cut back low value branches  
- **Time aware validation** to spot drift and leakage

## Underfitting And How To Fix It

If the tree is too shallow it misses structure.

**Signs**
- Low training and validation accuracy

**Fixes**
- Allow deeper trees within reason  
- Add better features that capture the signal  
- Consider ensembles like random forests or gradient boosting when single tree capacity is not enough

## Handling Class Imbalance

- **Class weights** make minority class splits more attractive  
- **Balanced sampling** without leaking time order  
- **Threshold tuning** choose a higher or lower cutoff based on Precision vs Recall needs  
- **PR AUC focus** better reflects rare attacks than accuracy

## Data Assumptions

- **No linearity assumption** trees capture non linear rules and interactions  
- **No normality assumption** residuals need not be Gaussian  
- **Robust to outliers** splits are based on orderings not distances  
- **Categoricals and missing values** basic trees prefer encoded and imputed data, some libraries handle them natively

## Common Hyperparameters To Know

- **criterion** gini or entropy  
- **max_depth** controls how many questions the tree can ask  
- **min_samples_split** and **min_samples_leaf** prevent tiny leaves  
- **max_features** random subset of features for each split  
- **ccp_alpha** cost complexity pruning strength  
- **class_weight** handle imbalance

## Security Focused Testing Checklist

- [ ] List features and identify which an attacker can control  
- [ ] Verify input validation ranges, missing values, categories  
- [ ] Trace a few decision paths end to end for explainability  
- [ ] Test small, realistic feature tweaks do outputs move as expected  
- [ ] Sweep thresholds and chart Precision --> Recall trade off  
- [ ] Check for data leakage remove post verdict or future only fields  
- [ ] Validate on future time windows not random splits  
- [ ] Monitor weekly metrics and retrain on drift  
- [ ] Prune or regularize if the tree grows too deep

## Threats And Mitigations

- **Feature gaming** attackers craft inputs that steer the path to a safe leaf  
  - *Mitigate* use multiple independent clues and ensembles  
- **Data poisoning** crafted training samples push splits toward attacker friendly rules  
  - *Mitigate* data hygiene, outlier screening, change control on labels  
- **Model extraction** rule paths can sometimes be inferred with queries  
  - *Mitigate* rate limiting, randomization at thresholds, policy controls around explanations  
- **Concept drift** attacker tactics and benign behavior change  
  - *Mitigate* sliding window retraining and ongoing calibration

## Takeaways

- Decision trees turn analyst playbooks into machine rules that are easy to read and justify  
- Keep trees simple enough to generalize and deep enough to be useful  
- Control overfitting with depth limits, leaf size, feature limits, and pruning  
- Choose metrics and thresholds that fit operational realities  
- Expect drift and plan for retraining

---

[Original Source](_No response_)
