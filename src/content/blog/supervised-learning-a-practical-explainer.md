---
title: "Supervised learning — a practical explainer"
description: "What supervised learning is, how it works in practice, core algorithms, evaluation, and common pitfalls — explained plainly"
pubDate: 2025-11-08
category: "Learning"
tags: ["_No response_"]
image: "AITesting.png"
draft: false
---

Trying to understand supervised learning can be tough. This is my notes trying to explain it.

Supervised learning is the branch of ML where each example already comes with the correct answer. The goal is to learn a rule that maps **features** (inputs) --> **label** (output) in a way that holds up on new data, not just the data you trained on.

A simple analogy helps which I saw on HTB. 

_Teaching a child fruits: show an apple and say “apple,” an orange and say “orange.” Over time the child connects characteristics (color, shape, size) --> correct name and can label new fruits. Supervised learning follows the same pattern: provide labeled examples, learn the mapping, predict for unseen cases._

---

## What problem we are solving
We want the computer to make the same simple decisions a human would, but faster and at scale.  
Example: sort emails --> spam or not spam.

---

## Two common kinds of problems

**Classification**  

- Output is a category.  
- Example: email --> spam or not spam.  
  - Features you might use: contains a URL, words like **urgent** or **password**, sender is unknown, many recipients.

**Regression**  

- Output is a number.  
- Example: score an alert 0 --> 100 so the SOC can sort the queue.  
  - Features you might use: asset criticality, number of failed logins, known bad indicators.

---

## The pieces in plain words

- **Training data:** past examples with answers. For spam, old emails that analysts already marked spam or not.  
- **Features:** the clues we extract. For spam: has link, has “urgent,” sender age, suspicious domain.  
- **Label:** the answer we want to predict. For spam: spam or not.  
- **Model:** a rule the computer learns, features --> label.  
- **Training:** the model practices on the past examples until it makes fewer mistakes.  
- **Prediction:** use the trained model on today’s emails.  
- **Inference:** explain which clues mattered for a decision.

---

## Step by step using the spam example

1. **Collect:** a month of labeled emails.  
2. **Prepare:** extract simple clues like “has URL,” count of words, presence of “urgent.”  
3. **Split:** older emails for training, newer emails for validation and a final test.  
4. **Train:** try a few simple models.  
5. **Tune:** pick thresholds so the number of alerts fits analyst capacity.  
6. **Test:** run once on the sealed test set to be sure it generalizes.  
7. **Use:** tag new emails based on the score.

---

## How we measure success
- **Accuracy:** of all emails, how many did we get right.  
- **Precision:** when we say spam, how often it really is spam.  
- **Recall:** of all real spam, how much we catch.  
- **F1:** one number that balances precision and recall.  
Tip: if missing bad emails is costly, push recall up; if analyst time is scarce, push precision up.

---

## Overfitting and underfitting
**Overfitting**  
- **Idea:** the model memorizes quirks in the training data and fails on new data.  
- **Spam example:** it learns a specific internal hostname or a weekly newsletter and treats those quirks as “always spam.”  
- **You can spot it:** very high training score --> much lower validation or test score.  
- **Fixes:**  
  - Use simpler features and a simpler model.  
  - Add **regularization** so the model prefers simpler rules.  
  - **Early stopping** when validation stops improving.  
  - Train on more varied data.

**Underfitting**  
- **Idea:** the model is too simple and misses obvious patterns.  
- **You can spot it:** low training score and low validation score.  
- **Fixes:** add better features, allow a more flexible model, tune a bit more.

**Bias --> variance as a dartboard**  
- High bias --> darts tightly grouped but far from center.  
- High variance --> darts all over.  
- Aim for a small, tight cluster near the bullseye on the test set.

---

## Cross validation you can trust
- For security data, use **time order**. Train on earlier weeks --> validate on the next week.  
- This mirrors real life: yesterday teaches today.

---

## Regularization explained simply
Regularization is a small penalty for complicated rules so the model prefers simpler ones.  
- **L2:** gently pulls weights toward zero --> smoother rules.  
- **L1:** pushes some weights to exactly zero --> keeps only the most useful clues.  
- Works well when features are many and noisy, like words in emails.

---

## Tiny checklist for a first spam filter
- Keep features simple and readable: has URL, has “urgent,” sender age, suspicious domain.  
- Split by time so training is older and testing is newer.  
- Pick thresholds that match how many alerts your team can handle.  
- Watch training vs. validation. Big gap --> overfitting.  
- Retrain on a schedule because language and tactics change.

---

## Why this is useful for security
- Turns everyday analyst decisions into consistent rules.  
- Surfaces the right items first and reduces manual toil.  
- Stays explainable when you choose simple, human-readable 

---

[Original Source](_No response_)
