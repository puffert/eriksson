---
title: "Linear regression"
description: "Notes about linear regression"
pubDate: 2025-11-08
category: "Learning"
tags: ["_No response_"]
image: "AITesting.png"
draft: false
---

## What is Linear Regression

Linear regression is a fundamental supervised learning algorithm that predicts **continuous** values by finding a linear relationship between inputs and an output. In cybersecurity, it is a simple and explainable baseline that helps you reason about more complex models you will test, attack, or defend.

Think of it as drawing the best fitting straight line through data points to make predictions. The model learns from historical data and assumes changes in input variables lead to **proportional** changes in the output.

## Core Concepts

### Simple Linear Regression

y = m x + c

Where  
- **y** = predicted value  
- **x** = input feature  
- **m** = slope  
- **c** = intercept

### Multiple Linear Regression

y = b0 + b1 x1 + b2 x2 + ... + bn xn

## Practical Examples in a Security Context

> Keep targets **continuous** for linear regression. If the target is a class like phish vs not phish, use logistic regression.

1. **Network baseline**
   - **Inputs:** time of day, weekday flag, active sessions
   - **Output:** expected Mbps
   - **Use:** deviations from the baseline --> anomaly investigation

2. **Password strength time to crack on log scale**
   - **Inputs:** length, character sets, common patterns
   - **Output:** log seconds to crack
   - **Use:** policy guidance and risk communication

3. **Alert priority scoring**
   - **Inputs:** MITRE technique, asset criticality, failed login streak
   - **Output:** risk score 0 --> 100
   - **Use:** rank alerts and set triage threshold

4. **Remediation time forecasting**
   - **Inputs:** severity, team load, system type
   - **Output:** days to fix
   - **Use:** staffing and SLA planning

## Why This Matters for AI Security Testing

- **Data poisoning:** crafted outliers or flipped labels shift coefficients  
- **Model extraction:** coefficients can often be inferred from queries  
- **Operational evasion:** small feature tweaks push a continuous score across your action threshold

**Example:** a score based spam filter can be nudged by adjusting URL count and wording so the score falls just under the quarantine threshold.

## Testing Linear Regression Models

### Range and Robustness
- Validate input ranges and units  
- Inject missing values and unexpected categories  
- Probe outliers and confirm robust behavior

### Feature Manipulation
- Identify controllable features  
- Measure how incremental changes shift the score  
- Map which changes cross the action threshold

### Model Extraction
- Send crafted probes, solve for weights  
- Once extracted, predict and evade consistently

## Key Assumptions and How They Break in Security

1. **Linearity** additivity and proportionality  
   - Many security signals are nonlinear --> engineer features or switch models

2. **Independence of errors** no autocorrelation  
   - Logs are time dependent --> use time aware splits and diagnostics

3. **Homoscedasticity** constant residual variance  
   - Variance grows with traffic --> use robust regression or transform targets

4. **Normality of residuals** for exact intervals  
   - Heavy tails are common --> use robust metrics like MAE

5. **Multicollinearity** correlated features inflate variance  
   - Remove or merge features, or use Ridge or Elastic Net

## Practical Security Testing Checklist

- [ ] List model features and identify which an attacker can control  
- [ ] Check input validation, ranges, missing values, outliers  
- [ ] Test monotonicity changes in features move the score as expected  
- [ ] Attempt poisoning on update paths batch or online  
- [ ] Probe for coefficient extraction  
- [ ] Verify assumptions with residual plots and diagnostics  
- [ ] Use time ordered train --> validate --> test splits  
- [ ] Track drift and recalibrate thresholds

## Conclusion

Linear regression is a transparent baseline for scoring, forecasting, and capacity planning. Know where it works, where it breaks, and how attackers might steer it. That foundation makes you better at both defending and testing more complex AI systems.

---

# Logistic Regression for AI Security Professionals

## What is Logistic Regression

Logistic regression is the standard baseline for **binary classification**. It learns a weighted sum of features and converts it to a **probability** between 0 and 1. You then apply a **threshold** to turn that probability into a decision.

Pipeline in one line  
**features** --> **weighted sum** --> **sigmoid** --> **probability** --> **threshold** --> **class**

- Output is **P class equals 1**  
- Threshold 0.5 is common, but you should tune it for your costs and SOC capacity

## Core Concepts

- **Weights and log odds:** positive weight pushes probability up, negative pushes it down  
- **Decision boundary:** where the model is indifferent probability near threshold  
- **Calibration:** align predicted probabilities with reality so 0.7 really means about 70 percent positives

## Practical Examples in a Security Context

1. **Spam or not spam**
   - **Inputs:** has URL, count of links, words like urgent or password, unknown sender
   - **Output:** probability of spam
   - **Use:** quarantine if probability --> threshold, otherwise deliver or tag

2. **Phishing email detection**
   - **Inputs:** sender reputation, URL count, brand lookalike score, domain age
   - **Output:** probability of phishing
   - **Use:** choose threshold to balance analyst time vs missed attacks

3. **Malware vs benign file**
   - **Inputs:** imported API counts, section entropy, packer flags
   - **Output:** probability malicious
   - **Use:** block when probability is high, sandbox when borderline

4. **DGA domain detection**
   - **Inputs:** length, digit ratio, n gram stats, NXDOMAIN rate
   - **Output:** probability DGA
   - **Use:** sinkhole or apply further checks above threshold

5. **Login anomaly**
   - **Inputs:** geo velocity, device fingerprint, hour of day, failed attempt streak
   - **Output:** probability suspicious
   - **Use:** step up auth if above threshold

## Evaluation for Security Reality

- **Precision and Recall:** pick the balance that fits operations  
- **F1 and PR AUC:** better for imbalanced classes common in attacks  
- **ROC AUC:** useful for overall ranking, less informative under heavy imbalance  
- **Confusion matrix by week:** spot drift and threshold problems over time

## Attacks and Weaknesses

- **Data poisoning:** attacker flips labels or injects crafted samples that shift weights  
- **Feature gaming:** attacker modifies controllable features to slip under the threshold  
- **Model extraction:** with enough probes, recover weights and intercept  
- **Label leakage:** features that encode the verdict after the fact make the model fragile

**Mitigations**  
- Use **regularization** to prevent extreme weights  
- Apply **time aware splits** and **grouped cross validation** by user or host  
- **Calibrate probabilities** and **tune thresholds** to analyst capacity  
- Monitor **feature distributions** and retrain on drift

## Testing Checklist

- [ ] Verify class definitions and labeling quality  
- [ ] Inspect coefficients largest positive and negative drivers  
- [ ] Test threshold sweeps Precision Recall trade offs  
- [ ] Probe controllable features to map evasion paths  
- [ ] Check calibration reliability diagrams and Brier score  
- [ ] Validate on future time windows not just random splits  
- [ ] Recheck on new campaigns families and tenants

## Regularization and Calibration

- **L2 Ridge** stabilizes weights and reduces variance  
- **L1 Lasso** drives some weights to zero for sparse, readable models  
- **Elastic Net** blends both for stability and sparsity  
- **Calibration options** Platt scaling or isotonic on a validation set  
- **Class imbalance tools** class weights, focal loss like weighting, stratified sampling

## Assumptions and Practical Notes

- Relationship in the **log odds** is approximately linear  
- Features are reasonably independent given the target heavy collinearity hurts stability  
- Use careful preprocessing and avoid leakage fit encoders and scalers only on training folds  
- Prefer **interpretable features** so analysts can understand and trust decisions

## Step by Step using spam

1. **Collect:** labeled emails from past weeks  
2. **Prepare:** extract simple clues has URL, urgent in subject, link count  
3. **Split:** train on earlier weeks --> validate on the next week --> test on a later sealed week  
4. **Train:** logistic regression with L2 regularization  
5. **Tune:** threshold for desired Precision or Recall and calibrate probabilities  
6. **Test:** confirm metrics on the sealed test window  
7. **Deploy:** set operational threshold and monitor weekly

## Conclusion

Logistic regression turns clear human rules into consistent machine decisions. It is fast, explainable, and easy to audit. When paired with good features, proper calibration, and time aware validation, it becomes a reliable baseline for spam filtering, phishing detection, DGA spotting, file triage, and login anomaly checks.

---

## Final takeaway

- Use **linear regression** when your target is a **number** continuous  
- Use **logistic regression** when your target is a **class** like phish vs not phish  
- Keep features simple and human readable  
- Validate on future data and tune thresholds to real operational costs  
- Watch for drift and retrain on a cadence
  
---

[Original Source](_No response_)
