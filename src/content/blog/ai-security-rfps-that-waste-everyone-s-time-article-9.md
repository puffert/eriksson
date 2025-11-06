---
title: "AI Security RFPs That Waste Everyone’s Time Article 9 in the scope series"
description: "Generic RFPs produce generic proposals that lead to generic testing.  What gets missed:  System architecture details vendors need Specific test scenarios required Access and constraint information Realistic timelines and budgets Bad RFPs result in proposals that don’t match actual needs."
pubDate: 2025-11-06
category: "Offensive Security"
tags: ["_No response_"]
image: "offensive.png"
draft: false
---

# AI Security RFPs That Waste Everyone's Time

Organizations issue RFPs for AI security assessments. Vendors submit proposals. Organizations select a vendor. The engagement delivers generic findings that miss actual vulnerabilities. The problem started with the RFP.

## The Generic RFP Problem

Typical RFP:

```
Request for Proposal: AI Security Assessment

Scope: Perform comprehensive security testing of our AI-powered application including prompt injection, jailbreaks, and data leakage testing.

Deliverables: Report of findings with risk ratings and remediation guidance.

Timeline: 2 weeks

Budget: $25,000
```

What's wrong with this?

### No System Architecture Information

Vendors don't know:
- What model is being used (GPT-4, Claude, custom model)
- How the model is accessed (API, self-hosted)
- What integrations exist (databases, APIs, tools)
- Whether function calling is implemented
- How conversation state is managed
- What the deployment architecture looks like

Without this information, vendors can't scope accurately. They submit generic proposals hoping to figure out details later.

Result: proposals that don't match actual system complexity.

### No Specific Attack Surface Description

"Prompt injection testing" could mean:
- Single-turn direct injection
- Multi-turn conditioning
- System prompt extraction
- Function calling manipulation
- RAG document poisoning

Without specifics, vendors guess at scope. Proposals include high-level categories without concrete test scenarios.

### No Access Information

Vendors don't know:
- What access they'll have (API keys, user accounts, source code)
- What environments are in scope (dev, staging, production)
- What testing restrictions exist
- What hours testing can occur
- What rate limits apply

Proposals assume standard access. Reality might be significantly more restricted, making proposed timeline infeasible.

## Information Vendors Need

For accurate proposals, RFPs should include:

### System Architecture

```
Architecture details:
- Model: OpenAI GPT-4 via API
- Integration: FastAPI backend, React frontend
- Function calling: Yes, 8 functions (list provided separately)
- Conversation management: Server-side sessions in Redis
- Deployment: AWS ECS containers
- Authentication: JWT tokens
- Rate limiting: 100 req/hour per user
```

This enables vendors to understand what they're testing.

### Component Inventory

```
In-scope components:
- Backend API (Python/FastAPI)
- Model integration layer (openai library)
- Function execution engine
- Session management (Redis)
- Input validation
- Output sanitization

Out of scope:
- OpenAI's model itself (third-party)
- Frontend security (separate assessment)
- Infrastructure pentest (separate assessment)
```

Clear boundaries prevent scope creep and misunderstanding.

### Specific Test Requirements

```
Required test scenarios:

1. Multi-turn prompt injection:
   - Test conversation history manipulation
   - Test gradual conditioning (minimum 15 turns)
   - Test system prompt extraction

2. Function calling security:
   - Test authorization for each of 8 functions
   - Test parameter injection
   - Test function call chaining

3. Data leakage:
   - Test for training data extraction
   - Test for other users' conversation access
   - Test for API key exposure

4. Output validation:
   - Test SQL injection via model-generated queries
   - Test XSS via model-generated HTML
   - Test command injection via model-generated commands
```

Specific scenarios enable accurate effort estimation.

### Access and Constraints

```
Testing environment:
- Access: Dedicated test environment (staging)
- Credentials: Will be provided after contract signing
- Testing window: Monday-Friday, 9am-5pm EST
- Rate limits: 1000 requests per hour for testing
- Restrictions: No production testing, no social engineering

Source code access: Yes, GitHub repository access provided
Documentation: API documentation, architecture diagrams available
```

Vendors can plan testing approach based on actual access.

### Deliverable Requirements

```
Required deliverables:

1. Technical report including:
   - Executive summary
   - Methodology description
   - Findings with severity ratings (using CVSS)
   - Proof-of-concept for each finding
   - Remediation guidance
   - Retest results

2. Presentation:
   - 1-hour findings presentation to technical team
   - 30-minute executive summary presentation

3. Support:
   - Available for questions during remediation
   - Retest within 30 days of fixes
```

Clear deliverable expectations prevent disputes.

## Red Flags in RFPs

Some RFP characteristics indicate problems:

### Unrealistic Timeline

```
Scope: Comprehensive AI security assessment
Timeline: 3 days
```

Comprehensive assessment in 3 days means either:
- Scope is actually very limited
- Testing will be superficial
- Vendor will scope aggressively and find nothing

Realistic timelines for thorough testing:
- Small application, single model, chat only: 1-2 weeks
- Medium application, function calling, integrations: 2-3 weeks
- Large application, custom models, complex architecture: 4-6 weeks

### Budget-Scope Mismatch

```
Scope: Test AI system including model security, application security, infrastructure security, compliance review, and red teaming
Budget: $15,000
```

This scope requires multiple specializations and significant time. At typical security consulting rates ($200-400/hour), $15k buys 38-75 hours. Not sufficient for described scope.

Either the budget needs to increase or scope needs to decrease.

### Checkbox Compliance

```
Requirements:
- Test for OWASP Top 10
- Test for OWASP LLM Top 10  
- Provide compliance report
- Certify system secure
```

"Certify system secure" is a red flag. No assessment can certify a system is secure. Security testing finds vulnerabilities that exist during testing. It doesn't prove absence of vulnerabilities.

Vendors who promise certification are overselling.

### No Technical Contact

```
Primary contact: Procurement department
Technical contact: TBD
```

Procurement can handle administrative aspects but can't answer technical questions vendors need to scope accurately.

RFPs should identify technical contacts who can provide:
- Architecture details
- Access information
- Technical constraints
- Scope clarifications

## What Good RFPs Look Like

Effective RFPs provide sufficient information for accurate proposals.

### Architecture Documentation

```
Attached documents:
- System architecture diagram
- API documentation  
- Data flow diagram
- Deployment architecture
- Component inventory with versions
```

Vendors can review actual architecture before proposing.

### Clear Objectives

```
Assessment objectives:
1. Validate security before public launch
2. Identify vulnerabilities in function calling implementation
3. Verify compliance with data protection requirements
4. Establish security baseline for ongoing testing

Success criteria:
- No critical or high severity findings remaining at retest
- Documented security controls for each threat category
- Compliance validation report for GDPR
```

Vendors understand what the organization wants to achieve.

### Realistic Constraints

```
Timeline: Assessment must complete before December 1 launch date
Budget: $40,000-60,000 range
Resource requirements: 2 consultants (senior + mid-level)
Availability: Technical team available for questions during assessment
```

Constraints are realistic and explicitly stated.

### Evaluation Criteria

```
Proposal evaluation criteria:
- AI security expertise (40%): Specific experience with LLM security
- Methodology (30%): Detailed testing approach for our architecture
- Cost (20%): Total cost including retest
- Timeline (10%): Ability to meet December 1 deadline

Required vendor qualifications:
- Minimum 3 AI security assessments completed
- Experience with OpenAI API security
- Python/FastAPI expertise
- OSCP or equivalent certification preferred
```

Vendors know how they'll be evaluated and can tailor proposals.

## Vendor Response Red Flags

Some proposal characteristics indicate problems:

### Vague Methodology

```
Methodology: We will perform comprehensive security testing using industry-standard tools and techniques to identify vulnerabilities in your AI system.
```

No specifics about:
- What tools
- What techniques  
- What testing phases
- How findings are validated

This suggests vendor doesn't understand AI security or hasn't read the RFP carefully.

### Copy-Paste Proposals

Proposal includes:
- Wrong company name
- Description of technologies not in RFP
- Generic text about "web applications" when RFP is about AI

Indicates template proposal without customization.

### Unrealistic Promises

```
We guarantee:
- 100% vulnerability detection
- Zero false positives
- Complete security certification
- Passing all compliance audits
```

No testing can guarantee 100% detection. Claims of certainty are overselling.

### Missing Qualifications

RFP asks for AI security experience. Proposal describes:
- 10 years web application testing
- CISSP certification
- Experience with AWS

But no mention of:
- AI security assessments
- LLM testing
- Prompt injection testing
- Model security

Vendor might not have relevant expertise.

## Improving RFP Quality

Organizations can improve RFP quality through:

### Pre-RFP Technical Assessment

Before issuing RFP:
1. Document system architecture
2. Identify all components
3. List specific security concerns
4. Determine realistic timeline and budget
5. Define success criteria

This produces RFP with sufficient detail for accurate proposals.

### Vendor Pre-Qualification

Instead of open RFP to all vendors:
1. Identify vendors with relevant expertise
2. Request capability statements
3. Pre-qualify vendors
4. Issue RFP only to qualified vendors

Reduces proposal volume and improves quality.

### Two-Stage Process

Stage 1: High-level proposal based on summary information
Stage 2: Detailed proposal after architecture review

Vendors get detailed technical information only after demonstrating basic qualifications.

### Reference Checks

Before selecting vendor:
1. Contact references
2. Ask specific questions about AI security expertise
3. Verify vendor actually performed described work
4. Confirm deliverable quality

References validate vendor claims.

## RFP Template Components

Effective AI security RFP includes:

```
1. Executive Summary
   - Organization background
   - AI system purpose
   - Assessment objectives

2. System Architecture
   - Architecture diagram
   - Component descriptions
   - Technology stack
   - Integration points
   - Deployment environment

3. Scope Definition
   - In-scope components
   - Out-of-scope components
   - Specific test scenarios
   - Testing constraints

4. Access and Logistics
   - Testing environment
   - Credentials provided
   - Testing window
   - Rate limits
   - Restrictions

5. Deliverable Requirements
   - Report format
   - Finding classification
   - Presentation requirements
   - Retest expectations
   - Timeline milestones

6. Vendor Requirements
   - Minimum qualifications
   - Required expertise
   - Team composition
   - References required

7. Evaluation Criteria
   - Scoring methodology
   - Weighting of factors
   - Selection timeline

8. Contract Terms
   - Payment terms
   - Confidentiality requirements
   - Intellectual property
   - Limitation of liability

9. Proposal Requirements
   - Proposal format
   - Page limits
   - Submission deadline
   - Contact for questions
```

## Common RFP Mistakes

### Copying Web App Pentest RFP

```
Bad: "Perform penetration testing including SQL injection, XSS, and CSRF"

Better: "Test prompt injection, function calling authorization, multi-turn manipulation, and output validation for AI-specific vulnerabilities"
```

AI security is different from web security. RFPs need AI-specific scope.

### No Budget Indication

RFP with no budget information forces vendors to guess. Proposals range from $10k to $100k. Organization gets proposals they can't afford and misses proposals in their range.

Include budget range: "Budget: $30,000-50,000"

### Excessive Page Limits

"Proposal must not exceed 5 pages"

Detailed methodology, team qualifications, and relevant experience can't fit in 5 pages. Vendors either:
- Submit superficial proposal
- Ignore page limit
- Don't respond

Reasonable limits: 15-20 pages for technical proposal.

### No Technical Evaluation

Proposals evaluated by procurement based on:
- Price (60%)
- Vendor size (20%)
- Timeline (20%)

No evaluation of technical approach or expertise. Cheapest vendor wins regardless of capability.

Include technical evaluation: Technical approach (40%), Expertise (30%), Price (20%), Timeline (10%)

## Conclusion

RFP quality determines proposal quality. Generic RFPs produce generic proposals that lead to generic testing that finds obvious issues but misses real vulnerabilities.

Effective AI security RFPs require:
- Detailed system architecture information
- Specific test scenario requirements
- Clear access and constraints
- Realistic timeline and budget
- Technical evaluation criteria

Organizations that invest time in RFP preparation get proposals that accurately scope work, from vendors with relevant expertise, producing testing that finds actual vulnerabilities.

Generic RFPs waste everyone's time: the organization reviews irrelevant proposals, vendors spend effort on proposals that don't match actual needs, and testing that results from poor scoping misses critical issues.

---

[Original Source](_No response_)
