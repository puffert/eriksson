---
title: "OpenAI GPT 5.2"
description: "Openai released its new modell"
pubDate: 2025-12-14
category: "News"
tags: ["_No response_"]
image: "news.png"
draft: false
---


## OpenAI publishes GPT-5.2 system card update

OpenAI released an update to the GPT-5 System Card for the GPT-5.2 family on December 11, 2025, and it standardizes the model names to gpt-5.2-instant and gpt-5.2-thinking. 

Main takeaways that matter for builders and defenders:

- Prompt injection robustness jumps hard on their connector and tool-call evals (Agent JSK and PlugInject). 

- “Hard mode” disallowed-content benchmarks look strongest on the Thinking variant across many categories. 

- Jailbreak results are mixed: Thinking improves vs 5.1, Instant drops vs 5.1 and they mention grader issues plus a possible illicit regression. 

They also note GPT-5.2 Instant refuses fewer requests for mature sexualized text output, and they describe extra safeguards for users believed to be under 18 plus early rollout of an age prediction model to apply protections automatically. 


## Pentest and cybersecurity uses

OpenAI explicitly says they trained gpt-5.2-thinking integrations to be maximally helpful for educational and cybersecurity topics, while refusing or de-escalating operational guidance for cyber abuse like malware creation, credential theft, and chained exploitation. They report improved “policy compliance rate” on their cyber safety evals versus prior GPT-5 thinking variants. 

In the Preparedness Framework section, they state gpt-5.2-thinking does not meet their threshold for “High cyber capability,” and they define that threshold in terms of removing bottlenecks to scaling end-to-end cyber operations or automating discovery and exploitation against reasonably hardened targets. 

They also show what they benchmarked for cyber capabilities, including curated public CTFs, CVE-Bench (web app exploitation in a sandbox), and an internal “Cyber Range” aimed at multi-step operations, plus they call out limitations for each of these styles of eval. 

There is also an external cyberoffensive evaluation by Irregular that reports success rates on vulnerability research and exploitation, network attack simulation, and evasion, plus cost-per-success numbers. 


---

[Original Source](https://cdn.openai.com/pdf/3a4153c8-c748-4b71-8e31-aecbde944f8d/oai_5_2_system-card.pdf)
