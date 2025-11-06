---
title: "Function Calling and Tool Integration Aricle 3 in scope series"
description: "Models with function calling can execute code and query databases. Scoping ignores the execution layer.  What gets missed:  Authorization for function calls Parameter validation (SQL injection, command injection, path traversal) Function call chains Rate limiting on expensive functions Testing the model doesn’t cover what the model can do through tools."
pubDate: 2025-11-06
category: "Offensive Security"
tags: ["_No response_"]
image: "offensive.png"
draft: false
---

# Function Calling and Tool Integration

Models with function calling can execute code, query databases, and interact with external systems. Scope documents test "the LLM" while ignoring that the model now has execution capabilities. The model's role shifts from text generation to action execution, creating attack surface that doesn't exist in chat-only implementations.

## Function Calling Mechanics

Function calling allows models to invoke predefined functions based on user requests. The application defines available functions with schemas, the model decides when to call them, and the application executes the calls.

Basic implementation:
```python
def get_weather(location: str) -> str:
    """Get current weather for a location"""
    return f"Weather in {location}: 72°F, sunny"

def get_user_email(user_id: int) -> str:
    """Get user email address"""
    return db.query("SELECT email FROM users WHERE id = ?", user_id)

tools = [
    {
        "name": "get_weather",
        "description": "Get current weather for a location",
        "parameters": {"type": "object", "properties": {"location": {"type": "string"}}}
    },
    {
        "name": "get_user_email",
        "description": "Get user email address",
        "parameters": {"type": "object", "properties": {"user_id": {"type": "integer"}}}
    }
]

response = model.chat(messages, tools=tools)

if response.tool_calls:
    for call in response.tool_calls:
        result = execute_function(call.name, call.arguments)
```

The model chooses which function to call and with what parameters. The application executes these choices. This delegation of execution decisions creates the security problem.

## Unauthorized Function Access

Functions inherit the application's permissions, not the user's permissions.

### Missing Authorization Checks

```python
def get_user_data(user_id: int) -> dict:
    """Retrieve user account data"""
    return db.query("SELECT * FROM users WHERE id = ?", user_id)

def handle_request(authenticated_user_id, user_message):
    response = model.chat([{"role": "user", "content": user_message}], tools=tools)
    
    if response.tool_calls:
        for call in response.tool_calls:
            if call.name == "get_user_data":
                # No check that user_id matches authenticated_user_id
                result = get_user_data(call.arguments["user_id"])
                return result
```

User 123 is authenticated. They prompt: "Show me user 456's data." Model calls `get_user_data(456)`. Application executes without verifying user 123 has permission to access user 456's data.

The function executes with application privileges, not user privileges. Authorization must happen in the application layer before function execution.

### Function Visibility Without Access Control

```python
admin_tools = [
    {"name": "delete_user", "description": "Delete a user account"},
    {"name": "reset_database", "description": "Reset database to initial state"}
]

regular_tools = [
    {"name": "get_weather", "description": "Get weather information"}
]

def handle_request(user_role, message):
    if user_role == "admin":
        tools = admin_tools + regular_tools
    else:
        tools = regular_tools
    
    response = model.chat([{"role": "user", "content": message}], tools=tools)
```

This attempts role-based access control by showing different tools to different users. But it relies on the model not being manipulated into calling admin functions.

Correct approach:
```python
def execute_function(user_role, function_name, arguments):
    if function_name in ["delete_user", "reset_database"] and user_role != "admin":
        raise PermissionError(f"User lacks permission for {function_name}")
    
    return globals()[function_name](**arguments)
```

## Parameter Injection and Validation

Models generate function parameters. These parameters might be malicious.

### SQL Injection Through Function Parameters

```python
def search_users(query: str) -> list:
    """Search users by name"""
    sql = f"SELECT * FROM users WHERE name LIKE '%{query}%'"
    return db.execute(sql)
```

User prompt: "Search for users named admin' OR '1'='1"

Model calls: `search_users("admin' OR '1'='1")`

Application executes: `SELECT * FROM users WHERE name LIKE '%admin' OR '1'='1%'`

SQL injection via model-generated parameter.

Fix requires validation:
```python
def search_users(query: str) -> list:
    """Search users by name"""
    return db.execute("SELECT * FROM users WHERE name LIKE ?", f"%{query}%")
```

### Path Traversal in File Operations

```python
def read_file(filename: str) -> str:
    """Read a file from the documents directory"""
    path = f"/var/app/documents/{filename}"
    with open(path, 'r') as f:
        return f.read()
```

User prompt: "Read file ../../../etc/passwd"

Model calls: `read_file("../../../etc/passwd")`

Application reads: `/var/app/documents/../../../etc/passwd` which resolves to `/etc/passwd`

Fix:
```python
import os

def read_file(filename: str) -> str:
    """Read a file from the documents directory"""
    base_dir = "/var/app/documents/"
    path = os.path.join(base_dir, filename)
    
    if not os.path.abspath(path).startswith(base_dir):
        raise ValueError("Invalid file path")
    
    with open(path, 'r') as f:
        return f.read()
```

### Command Injection

```python
def ping_host(hostname: str) -> str:
    """Ping a host to check connectivity"""
    import subprocess
    result = subprocess.run(f"ping -c 1 {hostname}", shell=True, capture_output=True)
    return result.stdout.decode()
```

User prompt: "Ping localhost; cat /etc/passwd"

Model calls: `ping_host("localhost; cat /etc/passwd")`

Application executes: `ping -c 1 localhost; cat /etc/passwd`

Fix:
```python
def ping_host(hostname: str) -> str:
    """Ping a host to check connectivity"""
    import subprocess
    import re
    
    if not re.match(r'^[a-zA-Z0-9.-]+$', hostname):
        raise ValueError("Invalid hostname")
    
    result = subprocess.run(["ping", "-c", "1", hostname], capture_output=True)
    return result.stdout.decode()
```

## Chained Function Calls

Models can chain multiple function calls in sequence. This creates multi-step attack opportunities.

### Information Gathering to Exploitation

```python
def list_users() -> list:
    """List all user IDs"""
    return db.query("SELECT id FROM users")

def get_user_details(user_id: int) -> dict:
    """Get detailed user information"""
    return db.query("SELECT * FROM users WHERE id = ?", user_id)

def send_email(to: str, subject: str, body: str) -> bool:
    """Send an email"""
    mail.send(to, subject, body)
    return True
```

User prompt: "Email all users their account details"

Model chains:
1. `list_users()` - gets [1, 2, 3, 4, 5]
2. `get_user_details(1)` - gets {email: "user1@example.com", ...}
3. `send_email("user1@example.com", "Your Details", "...")`
4. Repeat for each user

Each individual function is reasonable. Chained together, they exfiltrate all user data via email.

## Rate Limiting and Resource Exhaustion

Functions consume resources. Unlimited function calling can exhaust resources or incur costs.

### API Cost Exhaustion

```python
def web_search(query: str) -> list:
    """Search the web using paid search API"""
    return paid_api.search(query)  # Costs $0.01 per search
```

User prompt: "Search for 10,000 different variations of 'weather'"

Model generates 10,000 search function calls. Application executes all of them. Cost: $100.

Without rate limiting on function calls, adversaries exhaust API quotas or incur significant costs.

### Database Load

```python
def complex_analytics(start_date: str, end_date: str, filters: dict) -> dict:
    """Run complex analytics query"""
    return db.expensive_query(start_date, end_date, filters)  # Takes 30 seconds
```

User prompt: "Run analytics for every day in 2023 separately"

Model generates 365 function calls. Each takes 30 seconds. Total execution time: 3 hours.

## Testing Function Calling Security

Scope needs to specify function calling testing explicitly.

### Function Enumeration

Test discovery of available functions:
- Can users enumerate all available functions?
- Can function schemas be extracted?
- Are hidden/undocumented functions callable?

### Authorization Testing

For each function, test:
- Can unauthorized users call it?
- Can users call it with parameters outside their scope?
- Can authorization be bypassed through prompt manipulation?

### Parameter Validation

For each function, test parameters for:
- SQL injection
- Command injection
- Path traversal
- Integer overflow
- Type confusion

## Scope Language for Function Calling

Bad scope:
```
Test the AI assistant including function calling features.
```

Better scope:
```
Test function calling security for the following functions:

1. get_weather(location: str)
   - Parameter validation (location parameter for injection)
   - Rate limiting (max 100 calls per user per hour)
   
2. get_user_data(user_id: int)
   - Authorization (verify user can only access own data)
   - Parameter validation (user_id for SQL injection)
   
3. send_email(to: str, subject: str, body: str)
   - Authorization (verify user owns recipient email)
   - Rate limiting (max 10 calls per user per day)
   - Parameter validation (email header injection)
   
4. execute_query(sql: str)
   - Authorization (admin only)
   - Parameter validation (SQL injection, dangerous commands)

Test scenarios:
- Unauthorized function access
- Parameter injection
- Function call chains for privilege escalation
- Rate limit exhaustion
```

## Conclusion

Function calling transforms models from text generators into action executors. This fundamentally changes the attack surface. Testing "the LLM" isn't sufficient when the model can query databases, execute code, and interact with external systems.

Scope documents that don't explicitly address function calling will miss this entire class of vulnerabilities.

---

[Original Source](_No response_)