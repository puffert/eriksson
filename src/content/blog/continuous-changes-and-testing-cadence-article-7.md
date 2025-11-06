---
title: "Continuous Changes and Testing Cadence Article 7 in the scope series"
description: "Point-in-time assessments work for static systems. AI systems change constantly.  What gets missed:  Model updates (by providers or through retraining) Prompt modifications Integration changes Training data updates Testing in January is obsolete by March if the system changed."
pubDate: 2025-11-06
category: "Offensive Security"
tags: ["_No response_"]
image: "offensive.png"
draft: false
---

# Continuous Changes and Testing Cadence

Point-in-time security assessments work for static systems. AI systems aren't static. Models get updated, prompts change, new integrations get added, training data evolves. Testing in January says nothing about security in July if the system changed six times in between.

## The AI System Change Rate

Traditional applications change through code deployments. AI systems change through multiple mechanisms.

### Model Updates

Using third-party APIs:

```python
# January
response = openai.chat.completions.create(model="gpt-4-0613", ...)

# March - provider updates model
response = openai.chat.completions.create(model="gpt-4-0613", ...)
# Same model name, different behavior
```

Provider updates the model behind the API. Your code didn't change. Model behavior changed. Your January testing is obsolete.

Custom models:

```python
# January deployment
model = load("customer-support-v1.pkl")

# March - retrained with new data
model = load("customer-support-v2.pkl")

# June - fine-tuned for new product
model = load("customer-support-v3.pkl")
```

Three different models in six months. Each has different attack surface. Testing v1 doesn't validate v2 or v3.

### Prompt Engineering Changes

```python
# January
system_prompt = "You are a helpful customer service agent."

# March - added constraints
system_prompt = "You are a helpful customer service agent. Never discuss pricing."

# June - added capabilities  
system_prompt = "You are a helpful customer service agent. You can access customer records and update account status."
```

Same model. Different system prompts. Different capabilities. Different attack surface.

Each prompt change potentially introduces new vulnerabilities. March's constraint might be bypassable. June's capabilities might lack authorization.

### Integration Changes

```python
# January - chat only
def chat(message):
    return model.generate(message)

# March - added database access
def chat(message):
    response = model.generate(message, tools=[query_database])
    return response

# June - added email sending
def chat(message):
    response = model.generate(message, tools=[query_database, send_email])
    return response
```

Integration complexity increases. New tools add attack surface. Testing the January chat-only version doesn't cover database queries or email sending added later.

### Training Data Updates

Organizations continuously collect new training data:

```python
# Weekly retraining
def retrain_model():
    last_week_data = get_data(last_7_days)
    current_model = load("production_model.pkl")
    updated_model = fine_tune(current_model, last_week_data)
    deploy(updated_model)
```

Every retraining cycle uses new data. If adversaries poison data in week 10, week 10's model is compromised. Testing week 1's model didn't detect week 10's vulnerability.

## Why Point-in-Time Testing Fails

Organizations schedule annual security assessments:

```
January 2024: Security assessment completed
Finding: No critical issues
Status: System approved for production

December 2024: Security breach
Root cause: Vulnerability in feature added in August
```

The August feature was never tested. Annual testing cadence missed eight months of changes.

### Configuration Drift

```python
# January config
{
    "rate_limit": 100,
    "enable_tools": false,
    "log_level": "info"
}

# June config - gradual changes
{
    "rate_limit": 1000,      # Increased for performance
    "enable_tools": true,    # Added function calling
    "log_level": "error"     # Reduced logging
}
```

Configuration changed incrementally. Each change seemed minor. Cumulatively they significantly altered security posture. Point-in-time testing in January captured the January config, not the June reality.

### Dependency Updates

```python
# requirements.txt January
openai==1.0.0
langchain==0.1.0

# requirements.txt June  
openai==1.5.0  # Security patches, new features
langchain==0.2.0  # Breaking changes, new vulnerabilities
```

Dependency updates change application behavior. New library versions might have new vulnerabilities. June's dependencies weren't tested in January.

## What Triggers Should Require Testing

Scope documents need to define what changes trigger security revalidation.

### Model Changes

```
Trigger testing when:
- Base model updated (gpt-4-0613 -> gpt-4-1106)
- Custom model retrained
- Fine-tuning applied
- Model serving infrastructure changed
```

Example scope:
```
Model change testing requirements:
- Test within 48 hours of model deployment
- Regression test previous vulnerabilities
- Test new capabilities added in update
- Verify safety mechanisms remain effective
```

### System Prompt Modifications

```
Trigger testing when:
- System prompt content changes
- Instructions added or removed
- Capability descriptions modified
- Constraints added or removed
```

Even minor prompt changes affect behavior:

```python
# Before
"You are a helpful assistant."

# After  
"You are a helpful assistant. Be concise."
```

"Be concise" changes response patterns. Does it affect safety? Does it change how the model handles edge cases? Unknown without testing.

### Integration Changes

```
Trigger testing when:
- New tools/functions added
- API integrations added
- Database access modified
- External service connections added
```

Each new integration expands attack surface:

```python
# Added in June
tools = [
    existing_tool1,
    existing_tool2,
    new_tool_file_access  # New attack surface
]
```

`new_tool_file_access` needs testing. But if June's change doesn't trigger testing, it goes to production untested.

### Training Data Updates

```
Trigger testing when:
- Training data sources change
- Data collection processes modified
- New data categories included
- Data volume increases significantly
```

Significant data changes warrant testing:

```python
# January: 10k customer service conversations
train_data_v1 = load_conversations(count=10000)

# June: 100k conversations including social media
train_data_v2 = load_conversations(count=100000, sources=["tickets", "social"])
```

10x data increase plus new sources. Different attack surface. Needs testing.

## Testing Cadence Options

Different approaches for different risk levels.

### Event-Driven Testing

Test when changes occur:

```
Pipeline:
1. Code commit
2. CI runs security tests
3. Deploy if tests pass

Triggers:
- Model update: Run model-specific tests
- Prompt change: Run prompt injection tests
- New function: Run function calling tests
```

This catches changes immediately but requires automation.

### Scheduled Testing

Regular intervals:

```
Quarterly assessment:
- Full security review
- New vulnerability testing
- Regression testing
- Compliance verification

Monthly sanity checks:
- Smoke tests for critical functions
- Automated vulnerability scans
- Configuration validation
```

More predictable than event-driven but might miss issues between cycles.

### Risk-Based Testing

Frequency based on risk level:

```
High-risk systems (financial, healthcare):
- Full assessment: Quarterly
- Automated testing: Daily
- Manual review: Monthly

Medium-risk systems (customer service):
- Full assessment: Biannually  
- Automated testing: Weekly
- Manual review: Quarterly

Low-risk systems (internal tools):
- Full assessment: Annually
- Automated testing: Monthly
- Manual review: As needed
```

### Hybrid Approach

Combine methods:

```
Continuous:
- Automated tests in CI/CD
- Daily smoke tests
- Real-time monitoring

Scheduled:
- Monthly: Automated comprehensive scan
- Quarterly: Manual assessment
- Annually: Full red team engagement

Event-driven:
- Major model updates: Full regression
- Minor updates: Automated testing
- Config changes: Targeted testing
```

## Baseline and Regression Testing

Testing new versions requires baseline:

```python
# Establish baseline (v1)
baseline_results = {
    "prompt_injection": 0_detected,
    "data_leakage": 0_detected,
    "function_abuse": 0_detected
}

# Test new version (v2)
new_results = run_security_tests(model_v2)

# Compare
regressions = []
for test, result in new_results.items():
    if result > baseline_results[test]:
        regressions.append(test)
```

Regression testing verifies new versions don't reintroduce old vulnerabilities or create new ones.

### Version Control for AI Systems

Track what changed between versions:

```
Model v1 -> v2:
- Base model: gpt-4-0613 (same)
- System prompt: Added "Never discuss pricing" (changed)
- Functions: Added send_email (new)
- Training data: +5000 conversations (changed)

Test focus for v2:
- Pricing discussion bypass attempts
- send_email authorization
- Training data poisoning in new conversations
```

Knowing what changed guides testing priorities.

## Scope Language for Continuous Testing

Bad scope:
```
Perform annual security assessment of AI system.
```

This implies one-time testing regardless of changes.

Better scope:
```
Testing cadence and triggers:

1. Continuous automated testing:
   - Run on every code commit
   - Test suite: Prompt injection, output validation, function authorization
   - Block deployment if critical tests fail

2. Scheduled assessments:
   - Monthly: Automated comprehensive scan
   - Quarterly: Manual penetration test
   - Annually: Full red team engagement with report

3. Event-driven testing:
   - Model update: Full regression within 48 hours
   - System prompt change: Prompt security testing
   - New function added: Function calling security testing
   - Training data source change: Data validation testing

4. Baseline requirements:
   - Maintain baseline test results for each version
   - Compare new versions against baseline
   - Document any regressions
   - Require approval for degraded security metrics

5. Version tracking:
   - Document what changed between versions
   - Link test results to specific versions
   - Maintain test history for compliance

Out of scope:
- Testing of changes made after assessment period ends
- Continuous monitoring implementation (separate contract)
```

## Automation Requirements

Frequent testing requires automation:

```python
# CI/CD integration
def security_gate():
    results = {
        "prompt_injection": test_prompt_injection(),
        "output_validation": test_output_handling(),
        "function_auth": test_function_authorization(),
        "rate_limits": test_rate_limiting()
    }
    
    critical_failures = [k for k, v in results.items() if v["severity"] == "critical"]
    
    if critical_failures:
        block_deployment()
    
    return results
```

Scope needs to specify: "Automated testing must complete in under 15 minutes to fit CI/CD pipeline. Manual testing scheduled separately."

## Change Documentation

Effective continuous testing requires change tracking:

```
Change log format:
Date: 2024-06-15
Change type: System prompt modification
Old value: "You are a helpful assistant."
New value: "You are a helpful assistant with access to customer records."
Risk assessment: High - new data access capability
Testing required: Yes
Testing completed: 2024-06-16
Results: 2 findings (see report #456)
```

Without change documentation, continuous testing becomes reactive instead of proactive.

## Cost Considerations

Frequent testing has cost implications:

```
Annual testing: $50k once per year
Quarterly testing: $15k four times = $60k per year
Monthly testing: $5k twelve times = $60k per year
Continuous automated: $20k setup + $2k/month = $44k per year
```

Scope needs to balance thoroughness with budget:

```
Proposed approach:
- Continuous automated testing: Daily ($2k/month)
- Monthly manual review: Targeted ($5k/month)
- Quarterly deep assessment: Comprehensive ($15k/quarter)
Total annual cost: $104k

Alternative lower-cost approach:
- Continuous automated testing: Daily ($2k/month)  
- Quarterly assessment: Comprehensive ($15k/quarter)
Total annual cost: $84k
```

## Compliance Requirements

Regulations might mandate testing frequency:

```
EU AI Act (high-risk systems):
- Continuous monitoring required
- Regular testing and validation
- Documentation of all changes

PCI DSS (payment systems):
- Quarterly vulnerability scans
- Annual penetration tests
- Testing after significant changes

HIPAA (healthcare):
- Regular risk assessments
- Testing when environment changes
- Continuous monitoring
```

Scope must align with regulatory requirements: "Testing frequency meets EU AI Act requirements for high-risk AI systems."

## Conclusion

AI systems change constantly. Point-in-time security testing creates false confidence that expires with the first change after testing.

Effective AI security requires:
- Clear triggers for when testing is required
- Baseline establishment and regression testing
- Mix of continuous, scheduled, and event-driven testing
- Version control and change documentation
- Automation for frequent testing
- Budget allocation for ongoing testing

Organizations that test AI security once and declare victory are accumulating risk with every untested change. Scope documents need to explicitly address testing cadence, change triggers, and continuous validation requirements.

---

[Original Source](_No response_)
