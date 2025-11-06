---
title: "Logging, Monitoring, and Detection Article 8"
description: "Assessments find vulnerabilities. Logs detect exploitation. Most scoping focuses on finding, not detecting.  What gets missed:  What security events are logged Log retention and security Monitoring and alerting capabilities Incident investigation procedures Finding vulnerabilities matters less if exploitation goes undetected."
pubDate: 2025-11-06
category: "Offensive Security"
tags: ["_No response_"]
image: "offensive.png"
draft: false
---

# Logging, Monitoring, and Detection

Security assessments find vulnerabilities. They don't detect exploitation. Logging and monitoring do that. Yet scope documents focus entirely on finding vulnerabilities and ignore whether the organization can detect attacks when they happen.

## The Detection Gap

A typical engagement:

```
Scope: Test for prompt injection, data leakage, and unauthorized access.
Deliverable: Report of findings with severity ratings.
Missing: Can the organization detect these attacks in production?
```

Finding a vulnerability is useful. Knowing if attackers are actively exploiting it is critical. If logs don't capture relevant events, detection is impossible.

## What Should Be Logged

Most applications log something. The question is whether logs capture security-relevant events.

### Input Logging

```python
@app.route('/chat', methods=['POST'])
def chat():
    message = request.json['message']
    
    # No logging
    response = model_api.call(message)
    return response
```

No record of user inputs. If an attack succeeds, no evidence exists. Can't investigate. Can't determine scope. Can't identify attacker.

Basic logging:

```python
@app.route('/chat', methods=['POST'])
def chat():
    message = request.json['message']
    user_id = get_authenticated_user()
    
    logger.info(f"User {user_id} sent message: {message}")
    
    response = model_api.call(message)
    return response
```

Now inputs are logged. Can search logs for suspicious patterns. But is this sufficient?

### Output Logging

```python
response = model_api.call(message)

# No output logging
return response
```

Model response isn't logged. If the model leaks data, no record exists. Can't audit what information was disclosed.

With output logging:

```python
response = model_api.call(message)

logger.info(f"Model response to user {user_id}: {response}")

return response
```

Now both inputs and outputs are logged. Can correlate requests with responses. Can audit what data was disclosed.

But: logging all outputs might create privacy issues. Model responses might contain PII. Logs become sensitive data requiring protection.

### Function Call Logging

```python
def execute_function(function_name, parameters):
    # No logging
    result = functions[function_name](**parameters)
    return result
```

No record of function executions. If unauthorized function calls occur, no evidence.

With logging:

```python
def execute_function(user_id, function_name, parameters):
    logger.info(f"User {user_id} called {function_name} with {parameters}")
    
    result = functions[function_name](**parameters)
    
    logger.info(f"Function {function_name} returned: {result}")
    
    return result
```

Function calls and results are logged. Can audit who called what. Can detect unauthorized function access.

### Error Logging

```python
try:
    response = model_api.call(message)
except APIError as e:
    # No error logging
    return "An error occurred"
```

Errors aren't logged. Can't determine error frequency. Can't identify patterns. Can't detect attacks that trigger errors.

With error logging:

```python
try:
    response = model_api.call(message)
except APIError as e:
    logger.error(f"API error for user {user_id}: {str(e)}")
    logger.error(f"Input that caused error: {message}")
    return "An error occurred"
```

Errors are logged with context. Can analyze error patterns. Can detect attacks causing systematic errors.

### Authentication and Authorization Events

```python
def check_permission(user_id, resource):
    has_permission = db.query(
        "SELECT * FROM permissions WHERE user_id = ? AND resource = ?",
        user_id, resource
    )
    return has_permission

# No logging
```

Permission checks happen silently. No audit trail of access attempts.

With logging:

```python
def check_permission(user_id, resource):
    has_permission = db.query(
        "SELECT * FROM permissions WHERE user_id = ? AND resource = ?",
        user_id, resource
    )
    
    logger.info(f"User {user_id} permission check for {resource}: {has_permission}")
    
    return has_permission
```

Permission checks are logged. Can detect unauthorized access attempts. Can audit who accessed what.

## Log Retention and Storage

Logs need to be retained long enough to be useful.

### Insufficient Retention

```python
# Logs kept for 7 days
log_retention_days = 7
```

Attack happens on day 1. Goes unnoticed. Discovered on day 10. Logs from the attack are gone.

Need longer retention:

```python
# Security logs kept for 90 days
security_log_retention_days = 90

# Audit logs kept for 1 year
audit_log_retention_days = 365
```

Retention period depends on detection time and compliance requirements.

### Log Storage Security

```python
# Logs written to file
with open('/var/log/app.log', 'a') as f:
    f.write(f"{timestamp} {message}\n")
```

If file permissions allow read access to unauthorized users, logs can be tampered with or deleted.

Secure storage:

```python
# Logs sent to centralized logging system
log_client.send({
    "timestamp": timestamp,
    "level": level,
    "message": message,
    "user_id": user_id
})
```

Centralized logging systems provide:
- Access controls
- Immutability (append-only)
- Encryption at rest
- Retention management

### Log Encryption

```python
# Logs contain PII
logger.info(f"User {email} logged in")
logger.info(f"Query result: {user_data}")
```

If logs contain PII and aren't encrypted, anyone with log access can view sensitive data.

Scope should specify: "Verify logs containing PII are encrypted at rest and in transit."

## Monitoring and Alerting

Logs are useful only if monitored. Most organizations collect logs but don't actively monitor them.

### Pattern Detection

```python
# Monitoring for prompt injection patterns
suspicious_patterns = [
    "ignore previous instructions",
    "disregard",
    "system prompt",
    "TRIGGER"
]

def check_input(message):
    for pattern in suspicious_patterns:
        if pattern.lower() in message.lower():
            alert_security_team(f"Suspicious pattern detected: {pattern}")
```

Simple pattern matching catches obvious attacks. But sophisticated attacks evade simple patterns.

### Behavioral Anomalies

```python
# Monitor for unusual behavior
def monitor_user_behavior(user_id):
    recent_requests = get_recent_requests(user_id, time_window=3600)
    
    if len(recent_requests) > 100:
        alert(f"User {user_id} made {len(recent_requests)} requests in 1 hour")
    
    error_rate = calculate_error_rate(recent_requests)
    if error_rate > 0.5:
        alert(f"User {user_id} has {error_rate*100}% error rate")
```

Detects anomalies like:
- Excessive request volume
- High error rates
- Unusual access patterns
- Request spikes

### Function Call Monitoring

```python
def monitor_function_calls():
    recent_calls = get_recent_function_calls(time_window=3600)
    
    # Check for repeated admin function calls
    admin_calls = [c for c in recent_calls if c['function'] in admin_functions]
    if len(admin_calls) > 10:
        alert("Unusual number of admin function calls")
    
    # Check for function call chains
    for user_id in set(c['user_id'] for c in recent_calls):
        user_calls = [c for c in recent_calls if c['user_id'] == user_id]
        if len(user_calls) > 20:
            alert(f"User {user_id} made {len(user_calls)} function calls")
```

Monitors for:
- Unauthorized function access attempts
- Excessive function usage
- Suspicious function call patterns

### Model Behavior Monitoring

```python
def monitor_model_responses():
    recent_responses = get_recent_responses(time_window=3600)
    
    # Check for refusal rate changes
    refusal_rate = calculate_refusal_rate(recent_responses)
    baseline_refusal_rate = 0.02
    
    if refusal_rate < baseline_refusal_rate * 0.5:
        alert("Model refusal rate dropped significantly")
    
    # Check for unusual response patterns
    avg_response_length = calculate_avg_length(recent_responses)
    if avg_response_length > baseline_avg_length * 2:
        alert("Model generating unusually long responses")
```

Detects:
- Jailbreak success (lower refusal rates)
- Data extraction attempts (longer responses)
- Model behavior changes

## Incident Investigation

When attacks are detected, logs enable investigation.

### Timeline Reconstruction

```python
def investigate_incident(user_id, timestamp):
    # Get all events around incident time
    events = db.query("""
        SELECT * FROM logs 
        WHERE user_id = ? 
        AND timestamp BETWEEN ? AND ?
        ORDER BY timestamp
    """, user_id, timestamp - 3600, timestamp + 3600)
    
    return events
```

Comprehensive logs allow reconstructing what happened:
- What inputs were sent
- What outputs were generated  
- What functions were called
- What errors occurred

### Attacker Identification

```python
def identify_attacker(suspicious_pattern):
    # Find all users who used this pattern
    users = db.query("""
        SELECT DISTINCT user_id 
        FROM logs 
        WHERE message LIKE ?
    """, f"%{suspicious_pattern}%")
    
    # Correlate with other indicators
    for user_id in users:
        user_activity = analyze_user_activity(user_id)
        if is_suspicious(user_activity):
            report_attacker(user_id, user_activity)
```

Logs enable identifying attackers and their techniques.

### Impact Assessment

```python
def assess_impact(incident_timestamp):
    # What data was potentially exposed?
    responses = db.query("""
        SELECT response 
        FROM logs 
        WHERE timestamp >= ? 
        AND user_id = ?
    """, incident_timestamp, attacker_user_id)
    
    # Did attacker access unauthorized data?
    unauthorized_access = db.query("""
        SELECT * FROM logs 
        WHERE user_id = ? 
        AND action = 'permission_denied'
    """, attacker_user_id)
    
    return {
        "exposed_data": analyze_responses(responses),
        "unauthorized_attempts": len(unauthorized_access)
    }
```

Logs determine breach scope and impact.

## What Scope Should Specify

Security assessments should verify logging and monitoring capabilities.

### Log Coverage

```
Verify the following events are logged:
- All user inputs to model
- All model responses
- All function calls with parameters and results
- All authentication and authorization events
- All errors and exceptions
- All configuration changes
```

### Log Content

```
Verify logs include:
- Timestamp (UTC, millisecond precision)
- User identifier
- Session identifier  
- Request identifier (for correlation)
- IP address
- Event type
- Event details
```

### Log Security

```
Verify:
- Logs stored in centralized system with access controls
- Logs encrypted at rest and in transit
- Log retention meets compliance requirements (90 days minimum)
- Logs are immutable (append-only)
- Log access is audited
```

### Monitoring Capabilities

```
Verify monitoring for:
- Suspicious input patterns (prompt injection indicators)
- Anomalous user behavior (request volume, error rates)
- Unauthorized function access attempts
- Model behavior changes (refusal rate, response length)
- Automated alerting for critical events
```

### Incident Response

```
Verify:
- Incident response procedures exist
- Procedures include log analysis steps
- Procedures define timeline reconstruction methods
- Procedures specify escalation criteria
- Procedures are tested regularly
```

## Testing Logging and Monitoring

Scope should include active testing of detection capabilities.

### Detection Testing

```
Test whether monitoring detects:

1. Prompt injection attempts:
   - Send known prompt injection patterns
   - Verify detection and alerting
   - Response time: < 5 minutes

2. Data extraction attempts:
   - Attempt to extract system prompt
   - Attempt to extract training data
   - Verify detection and alerting

3. Function abuse:
   - Attempt unauthorized function calls
   - Attempt function call chains
   - Verify detection and alerting

4. Volume attacks:
   - Send excessive requests
   - Verify rate limiting triggers
   - Verify alerting occurs

Success criteria: 
- 100% detection of critical attacks
- < 5 minute alert latency
- < 1% false positive rate
```

### Log Completeness Testing

```
Verify logs capture required information:

1. Perform test attack
2. Check logs for evidence
3. Verify all expected fields present
4. Verify log correlation possible
5. Verify timeline reconstruction works

Missing fields indicate logging gaps.
```

### Alert Testing

```
Test alerting mechanisms:

1. Trigger detection rule
2. Verify alert generated
3. Verify alert reaches security team
4. Measure alert latency
5. Verify alert contains actionable information

If alerts don't reach the right people, detection is useless.
```

## Common Logging Failures

### Logging Sensitive Data

```python
# Logs API keys
logger.info(f"Calling API with key: {api_key}")

# Logs passwords
logger.info(f"User {user_id} changed password to: {new_password}")
```

Logs should not contain secrets. If attackers gain log access, they gain secrets.

### Insufficient Context

```python
# Not useful
logger.info("Error occurred")

# Useful
logger.error(f"API call failed for user {user_id} with message '{message}': {error_details}")
```

Logs need context to be actionable.

### No Correlation IDs

```python
# Request 1
logger.info(f"User sent message")
logger.info(f"Model responded")

# Request 2  
logger.info(f"User sent message")
logger.info(f"Model responded")
```

Without correlation IDs, can't determine which response belongs to which request.

Better:

```python
request_id = generate_request_id()

logger.info(f"[{request_id}] User {user_id} sent message")
logger.info(f"[{request_id}] Model responded")
```

Correlation IDs enable request tracking.

### Logging After Failure

```python
try:
    response = model_api.call(message)
    logger.info("Successfully called model")
except:
    # No logging
    pass
```

If the exception prevents logging, no record of the failure exists.

Log before operations:

```python
logger.info(f"Calling model with message: {message}")

try:
    response = model_api.call(message)
    logger.info("Model call succeeded")
except Exception as e:
    logger.error(f"Model call failed: {e}")
```

## Scope Language for Logging and Monitoring

Bad scope:
```
Test AI system security.
```

Doesn't address detection capabilities.

Better scope:
```
Test AI system security and detection including:

1. Verify logging coverage:
   - User inputs logged
   - Model outputs logged
   - Function calls logged
   - Errors logged
   - Authentication events logged

2. Verify log security:
   - Centralized storage with access controls
   - Encryption at rest and in transit
   - 90-day retention
   - Immutable logs

3. Test monitoring capabilities:
   - Detect prompt injection attempts
   - Detect excessive request volume
   - Detect unauthorized function access
   - Alert latency < 5 minutes

4. Test incident response:
   - Reconstruct attack timeline from logs
   - Identify attacker from log analysis
   - Assess impact from logged data

5. Provide:
   - Detection test results (what was detected, what wasn't)
   - Log analysis samples showing investigation process
   - Monitoring coverage gaps
   - Recommended additional monitoring rules
```

## Conclusion

Finding vulnerabilities matters. Detecting exploitation matters more. Organizations that can't detect attacks in progress can't respond to them.

Effective AI security requires:
- Comprehensive logging of security events
- Secure log storage with appropriate retention
- Active monitoring and alerting
- Incident investigation capabilities
- Regular testing of detection mechanisms

Scope documents that focus only on vulnerability finding without addressing detection leave organizations blind to active exploitation. Testing should verify both that vulnerabilities exist and that exploitation would be detected.

---

[Original Source](_No response_)
