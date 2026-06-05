# Skills Extraction Normalization Audit

## 1. The Core Issue
The previous skills extraction logic relied on naive keyword matching and loosely merged raw arrays directly from upstream job board APIs (e.g., RemoteOK). This caused generic business terms like **"customer support"**, **"marketing"**, **"finance"**, **"senior"**, **"medical"**, and **"education"** to bleed into the Technology Intelligence Dashboard, weakening the platform's credibility as a true tech-focused intelligence tool.

## 2. Refactoring Approach
The pipeline was refactored into a **Strict Technology-Focused Extraction System**. 
- Modified `src/services/normalization.ts` to implement a strict `TECHNOLOGY_DICTIONARY`.
- Replaced the simple `extractSkills` array appending in `src/services/jobService.ts` with a mechanism that joins all available text data (titles, descriptions, and source tags) and passes it purely through our whitelist filter.
- Updated `src/pages/skills.astro` UI copy to emphasize the strict, technology-driven nature of the new data.

## 3. Filtering Rules & Dictionary
We established a canonical dictionary containing explicit boundary checks (handling tricky characters like `C++`, `Node.js`, and `C#`) to prevent sub-string matching. 

### Allowed Categories:
- **Languages:** Python, JavaScript, TypeScript, Go, Rust, Java, C++, C#, Ruby, PHP, Swift, Kotlin, Scala
- **Frontend:** React, Next.js, Vue.js, Angular, Svelte, Tailwind CSS
- **Backend:** Node.js, Express, Django, FastAPI, Spring Boot, GraphQL
- **Cloud Platforms:** AWS, GCP, Azure, Cloudflare, Vercel
- **DevOps & Infrastructure:** Docker, Kubernetes, Terraform, Ansible, Jenkins, Helm, Prometheus, Grafana, GitHub Actions, Linux, CI/CD
- **Databases:** SQL, PostgreSQL, MySQL, MongoDB, Redis, Elasticsearch, Cassandra, DynamoDB
- **Data Engineering:** Snowflake, Databricks, Kafka, Airflow, Apache Spark, Hadoop, Pandas, NumPy
- **AI / ML Libraries:** TensorFlow, PyTorch, LangChain, OpenAI, Hugging Face, LLM, Scikit-learn, KubeFlow, Prompt Engineering

## 4. Removed Generic Terms
By explicitly shifting to a whitelist architecture, the system guarantees the exclusion of generic role identifiers and business adjectives. 
- **Explicitly Removed:** senior, finance, customer support, education, marketing, sales, medical, communication, leadership, teamwork, digital nomad, remote, entry-level.

## 5. Most Detected Technologies (Expected vs Actual)
During test executions against typical payloads:
- **Expected Core Tech:** Python, JavaScript, AWS, React, Node.js, TypeScript, Docker, Kubernetes, SQL, PostgreSQL.
- **Test Validation:** Passing phrases like *"Medical professional with experience in education, leadership, and React"* successfully reduced the extraction array down to just `['React']`. 
- **Legacy Tags:** Previously, tag lists like `['C++', 'C#', 'AWS', 'medical', 'teamwork']` were accepted verbatim. The new pipeline successfully whittles this down to `['C++', 'C#', 'AWS']`.

## 6. Remaining Extraction Weaknesses
- **Framework Ambiguity:** Emerging frameworks that are not explicitly tracked in the whitelist (e.g., Astro, Solid, Qwik, Deno) will currently be ignored until they are explicitly added to `TECHNOLOGY_DICTIONARY`. This requires manual curation updates to keep the dictionary fresh.
- **Context Loss:** "Go" as a programming language relies heavily on word boundary regex logic, which is an improvement, but may still occasionally result in false positives if a recruiter writes sentences formatted aggressively without spaces.
- **Version Agnosticism:** The extractor treats "React 18" and "React 19" as simply "React". Depending on future goals, we may need to track version numbers for granular technology adoption metrics.
