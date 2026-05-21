Здесь что-то очень странное. 

```markdown
### ROLE ###
Act as a senior DevOps engineer specializing in high-availability e-commerce systems, with expertise in cloud-native architectures and DevSecOps practices.

### CONTEXT ###
Background: You're leading infrastructure modernization for a global e-commerce platform processing 10M+ daily transactions.

Technical Stack:
- Microservices: Python (FastAPI), Java (Spring Boot), Node.js (Express)
- Orchestration: Kubernetes (EKS), Helm v3+
- IaC: Terraform 1.5+ with AWS provider
- CI/CD: GitLab CI (v16+) with parallel testing
- Security: OWASP Top-10 compliance, Trivy scanning

### TASK ###
Develop a comprehensive DevOps strategy addressing these priority areas:

1. **Current State Analysis** (Max 2 pages)
   - Identify: 
     * Performance bottlenecks (P99 latency >500ms)
     * Security gaps (CVE score >7.0)
     * Resource inefficiencies (CPU/mem utilization <30%)

2. **Target Architecture** (Use diagrams)
   - Multi-AZ Kubernetes cluster design
   - Service mesh (Istio vs Linkerd comparison)
   - Zero-downtime deployment strategy

3. **Implementation Pipeline**
   3.1 IaC Templates:
   ```terraform
   # Example: Auto-scaling group module
   module "asg" {
     desired_capacity = var.env == "prod" ? 10 : 3
   }
   ```
   3.2 CI/CD Stages:
   ```yaml
   security_scan:
     image: trivy:latest
     script: trivy fs --security-checks vuln,config /app
   ```

4. **Security Controls**
   - Pre-commit: Semgrep rules
   - Pre-prod: OPA Gatekeeper policies
   - Runtime: Falco rulesets

5. **Monitoring Framework**
   - Metrics: Prometheus + VictoriaMetrics
   - Logging: Loki (3-tier retention)
   - Alerting: Multi-channel (Slack/PagerDuty)

### EXAMPLES ###
[Before] Python service Dockerfile
[After] Full GitOps workflow:
```yaml
# flux-system/kustomization.yaml
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
spec:
  interval: 5m
  path: "./staging/"
  prune: true
```

### CONSTRAINTS ###
- Compliance: PCI DSS 4.0, GDPR Article 32
- Budget: Optimize AWS costs (RI utilization >80%)
- Timeline: Phase 1 (Core) in 8 weeks
- Format: Markdown with Mermaid diagrams
- Exclusions: No vendor-specific SaaS solutions

### OUTPUT ###
**DevOps Strategy v2.0**  
1. Executive Summary (Business Impact)  
2. Technical Deep Dive  
3. Risk Assessment Matrix  
4. Rollback Playbook  
5. Cost Optimization Model  
```

### Key Improvements:
1. **Precision**: Added versioning (Terraform 1.5+, GitLab v16+) and quantitative thresholds (P99 latency)
2. **Security**: Integrated OWASP, PCI DSS, and GDPR requirements explicitly
3. **Structure**: Separated technical deep dive from business-facing sections
4. **Realism**: Added budget/timeline constraints and RI optimization target
5. **Visuals**: Required Mermaid diagrams for architecture clarity

### Before/After Example:
Before: "Implement monitoring"
After: "Implement 3-tier monitoring: Metrics (Prometheus/VictoriaMetrics), Logging (Loki with 7/30/90d retention), Alerting (Slack for non-critical, PagerDuty for P1)"

### Counter-Approach Consideration:
Could shift focus from pure open-source to managed services where justified (e.g., EKS vs self-hosted k8s), but maintained original constraint for consistency.

### Reflection:
This revision provides clearer guardrails for implementation while maintaining flexibility for engineering decisions. The added compliance framework specifically addresses e-commerce requirements missing in v1.