---
title: "The Third-Party Model Scoping Problem Article 4 in scope series"
description: "Organizations use OpenAI or Anthropic APIs. Scope says “test the model” when the model is a black box.  What gets missed:  Trust boundary definition What’s actually testable (integration, not the model) Data sent to third-party APIs Compliance implications You can’t test the model. You can test your integration with it."
pubDate: 2025-11-06
category: "Offensive Security"
tags: ["_No response_"]
image: "offensive.png"
draft: false
---

# The Third-Party Model Scoping Problem

Organizations use OpenAI, Anthropic, Google, or other hosted model APIs. Scope documents say "test the AI security" without addressing that the model itself is a black box run by a third party. This creates a scoping problem: what exactly is being tested when you don't control the model?

## The Trust Boundary Problem

When using third-party models, the trust boundary sits between your application and the model API. You control everything up to the API call and everything after the response. You don't control what happens inside the API.

```python
# Your code
user_input = request.json['message']
prompt = construct_prompt(user_input)

# Third-party API (black box)
response = openai.chat.completions.create(
    model="gpt-4",
    messages=[{"role": "user", "content": prompt}]
)

# Your code  
output = format_response(response)
return output
```

You can test `construct_prompt` and `format_response`. You cannot test what OpenAI does with the prompt, how the model processes it, what training data it saw, or what safety mechanisms it has.

Most scope documents ignore this distinction. They say "test the LLM security" when they mean "test our integration with a third-party LLM API."

## What You Cannot Test

### Model Training and Safety

The model's training data, fine-tuning procedures, and safety mechanisms are entirely controlled by the provider. You cannot:

- Audit training data for poisoning
- Verify safety alignment
- Test for backdoors in weights
- Confirm bias mitigation
- Validate data sanitization during training

Scope documents sometimes include: "Test for data poisoning vulnerabilities."

If using third-party models, this is impossible. You don't have access to the training pipeline. The provider might test for data poisoning, but you cannot independently verify this.

### Model Behavior Guarantees

Providers update models without notice. GPT-4 today might behave differently than GPT-4 tomorrow.

```python
# Monday
response = openai.chat.completions.create(model="gpt-4", ...)
# Model version: gpt-4-0613

# Tuesday  
response = openai.chat.completions.create(model="gpt-4", ...)
# Model version: gpt-4-0314 (different version, different behavior)
```

Testing on Monday doesn't guarantee Tuesday's behavior. Models can be updated, safety filters can change, and outputs can differ without your application code changing at all.

Scope needs to acknowledge this: "Testing validates current model behavior. Future model updates by the provider may change behavior and require retesting."

### Internal Safety Mechanisms

Providers implement safety filters, content policies, and refusal mechanisms. These are black boxes.

User prompt: "Provide instructions for illegal activity"
Model response: "I cannot provide that information."

You don't know:
- How the refusal was triggered
- What content policy was applied
- Whether the refusal can be bypassed
- How the safety mechanism works

You can test whether refusals occur, but you cannot audit the refusal mechanism itself.

## What You Can Test

### Data Sent to the API

You control what data leaves your environment.

```python
def chat(user_id, message):
    user_data = db.query("SELECT * FROM users WHERE id = ?", user_id)
    
    prompt = f"""
    User: {user_data['name']}
    Email: {user_data['email']}
    Message: {message}
    """
    
    response = model_api.call(prompt)
    return response
```

This sends PII (name, email) to the third-party API. That data now exists on the provider's infrastructure, subject to their retention policies and security controls.

Scope should include: "Test what data is sent to third-party APIs and verify only necessary data is transmitted."

### API Authentication Security

API keys authenticate your application to the model provider.

```python
import os
api_key = os.environ['OPENAI_API_KEY']

openai.api_key = api_key
```

Where is this key stored? Environment variables, configuration files, secrets managers? Who has access? How often is it rotated?

If the API key leaks, attackers can:
- Make API calls on your account
- Exhaust your quotas
- Access your usage logs (which might contain sensitive prompts)
- Incur costs

Scope needs: "Test API key storage, access controls, rotation procedures, and monitoring of API usage."

### Rate Limiting and Cost Controls

Third-party APIs charge per token. Without rate limiting in your application, costs can spike.

```python
@app.route('/chat', methods=['POST'])
def chat():
    message = request.json['message']
    
    # No rate limiting
    response = openai.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": message}]
    )
    
    return response
```

An attacker sends 10,000 requests with 4,000 tokens each. At $0.03 per 1K input tokens and $0.06 per 1K output tokens:

Input cost: 10,000 × 4 × $0.03 = $1,200
Output cost: 10,000 × 2 (avg response) × $0.06 = $1,200
Total: $2,400

Third-party APIs might have their own rate limits, but those protect the provider, not your budget.

Scope should specify: "Test rate limiting at application layer including per-user quotas and cost controls."

### Response Validation

The model returns text. Your application uses it. How?

```python
def get_sql_query(natural_language):
    prompt = f"Convert to SQL: {natural_language}"
    sql = model_api.call(prompt)
    
    # Execute directly
    result = db.execute(sql)
    return result
```

The model generates SQL. The application executes it without validation. The model is doing what it's designed to do: generate text that looks like SQL. The application's failure to validate is the vulnerability.

This is testable even with third-party models: "Test that model outputs are validated before use in downstream systems."

### Failure Mode Handling

APIs can fail. How does your application respond?

```python
def chat(message):
    try:
        response = model_api.call(message)
        return response
    except APIError as e:
        return f"Error: {str(e)}"
```

If the exception contains sensitive information (API endpoints, keys, internal errors), it gets exposed to users.

Possible error responses from providers:
```
APIError: Rate limit exceeded for org-abc123. Current usage: 100,000 tokens/day. Contact support at support@provider.com with request ID: req-xyz789.
```

This error message discloses:
- Organization identifier
- Usage statistics
- Support contact
- Request IDs

Scope needs: "Test error handling for API failures and verify no sensitive information disclosure."

### Fallback Behavior

When the API is unavailable, what happens?

```python
def chat(message):
    try:
        return primary_model_api.call(message)
    except:
        return fallback_model_api.call(message)
```

If the primary API fails, the application falls back to a different provider. Do both providers have the same security guarantees? Same data handling policies? Same compliance certifications?

Scope should specify: "Test fallback behavior including data handling differences between primary and fallback providers."

## Compliance and Data Handling

Third-party model APIs process your data on their infrastructure. This has compliance implications.

### Data Residency

Different providers store data in different regions:

```python
# Provider A: US data centers only
response_a = provider_a.call(message)

# Provider B: EU data centers available
response_b = provider_b.call(message, region="eu-west")
```

If your application processes EU user data and sends it to a provider with US-only infrastructure, you might violate GDPR data residency requirements.

Scope needs: "Verify data sent to third-party APIs complies with data residency requirements for all user jurisdictions."

### Data Retention

Providers have different retention policies:

- Provider A: "Prompts and completions are retained for 30 days for abuse monitoring, then deleted"
- Provider B: "Data may be retained indefinitely to improve models"
- Provider C: "Enterprise customers can opt out of data retention"

If you send PII to a provider with indefinite retention, that data exists outside your control potentially forever.

Scope should include: "Document third-party provider data retention policies and verify compliance with organizational data handling requirements."

### Subprocessors

Providers might use subprocessors:

Provider's terms: "We may use third-party infrastructure providers (AWS, Google Cloud) to process your data."

Your data goes to the model provider, who sends it to their infrastructure provider, who might have their own subprocessors. Each hop is a potential security or compliance concern.

Scope needs: "Identify all subprocessors involved in data processing and verify their security and compliance certifications."

## Vendor Security Assessments

Testing third-party models means testing the provider's security, not the model itself.

### SOC 2 and Compliance Reports

Providers typically offer:
- SOC 2 Type II reports
- ISO 27001 certification
- GDPR compliance documentation
- HIPAA compliance (sometimes)

Scope should require: "Review provider security certifications and compliance reports. Verify certifications cover the specific services being used."

Not all provider services are covered by the same certifications. A provider might have SOC 2 for their API infrastructure but not for their model training pipeline.

### Service Level Agreements

SLAs define availability, performance, and support guarantees:

```
Provider SLA:
- 99.9% uptime
- < 2 second response time (95th percentile)
- 24/7 support for critical issues
```

If the provider doesn't meet SLA, what's your recourse? Credit against future charges? But if the outage caused your application to fail, monetary credit doesn't restore lost business.

Scope needs: "Review provider SLA and verify acceptable for business requirements. Confirm fallback procedures for SLA violations."

### Incident Response

When the provider has a security incident, how do they notify customers?

Provider policy: "We notify affected customers within 72 hours of confirming a data breach."

If your user data was involved, 72 hours might exceed your own notification requirements under GDPR (72 hours from when you become aware, not from incident occurrence).

Scope should specify: "Review provider incident response procedures and confirm alignment with organizational requirements."

## Scope Language for Third-Party Models

Bad scope:
```
Test the AI system security including the language model.
```

This implies testing the model itself, which isn't possible with third-party APIs.

Better scope:
```
Test integration with third-party model API (OpenAI GPT-4) including:

1. Data handling:
   - What data is sent to API (verify no unnecessary PII)
   - Data sanitization before API calls
   - Compliance with data residency requirements

2. Authentication:
   - API key storage (verify use of secrets manager)
   - Key rotation procedures
   - Access controls for key retrieval

3. Rate limiting:
   - Application-layer rate limits (current: 100 req/user/hour)
   - Cost controls and alerting
   - Behavior when limits exceeded

4. Response handling:
   - Output validation before use
   - Sanitization before rendering
   - Error handling (verify no sensitive data in error messages)

5. Availability:
   - Fallback behavior when API unavailable
   - Timeout handling
   - Degraded mode operation

6. Compliance:
   - Review provider SOC 2 report
   - Verify GDPR compliance documentation
   - Confirm data retention policies

Out of scope:
- Model training security (provider responsibility)
- Model safety mechanisms (black box)
- Provider infrastructure security (covered by their certifications)
```

## Model Provider Changes

Providers can change terms, update models, or discontinue services.

### Model Deprecation

Provider announcement: "GPT-3.5 will be deprecated on June 30, 2024. Migrate to GPT-4."

Your application:
```python
response = openai.chat.completions.create(model="gpt-3.5-turbo", ...)
```

After deprecation, this fails. Does your application have monitoring for deprecated model usage? A migration plan? Testing of the replacement model?

Scope should include: "Verify monitoring for model deprecation notices and existence of migration procedures."

### Terms of Service Changes

Provider updates terms to prohibit certain use cases:

New terms: "Our models may not be used for insurance underwriting or loan approval decisions."

If your application uses the model for these purposes, you're now in violation. Regular terms review is necessary but often outside security scope.

Scope needs: "Review current terms of service for acceptable use restrictions and verify application compliance."

## Testing Methodology Differences

Testing third-party model integrations requires different approaches than testing owned infrastructure.

### Black Box Testing Only

You cannot:
- Review model source code
- Audit training data
- Inspect model weights
- Modify safety mechanisms
- Access internal logs

All testing is black box: send inputs, observe outputs, infer behavior.

### Probabilistic Behavior

Models are non-deterministic. Same input can produce different outputs:

```python
# First call
response1 = model_api.call("What's the weather?")
# "I don't have access to real-time weather data."

# Second call, identical input
response2 = model_api.call("What's the weather?")  
# "I cannot check current weather conditions."
```

Different responses to identical inputs. This makes reproducibility difficult. Test cases that pass once might fail next run.

Scope should acknowledge: "Model responses are non-deterministic. Test cases will be run multiple times to verify consistent behavior."

### Provider Rate Limits

Testing is subject to provider rate limits. If testing requires 10,000 requests but the provider limits to 100 requests per minute, testing takes 100 minutes minimum.

Scope needs to account for this: "Confirm provider rate limits allow testing volume. Request increased limits if necessary or plan testing over extended time period."

## Shared Responsibility Model

Security is shared between you and the provider:

Provider responsibility:
- Model training security
- API infrastructure security
- Safety mechanisms
- Compliance certifications

Your responsibility:
- Data sent to API
- API authentication
- Response handling
- Application security

Scope documents need to clearly delineate these responsibilities: "Provider is responsible for model and infrastructure security. Testing focuses on application integration security."

## Conclusion

Third-party model APIs create a specific scoping challenge. The model itself is untestable. What remains testable is your integration: what data you send, how you authenticate, how you handle responses, and how you comply with regulations.

Scope documents that say "test the AI" without distinguishing between owned and third-party components will produce confusion and incomplete testing.

Effective scoping for third-party models requires:
- Clear identification of trust boundaries
- Focus on integration points, not the model itself
- Verification of provider security certifications
- Testing of data handling and compliance
- Documentation of shared responsibility model

Organizations using hosted model APIs need scope that reflects the limitations of black-box testing and the importance of integration security over model security.


---

[Original Source](_No response_)