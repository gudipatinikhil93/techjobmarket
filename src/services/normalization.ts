const TITLE_MAP: Record<string, string> = {
  'SDE': 'Software Engineer',
  'SOFTWARE ENGINEER': 'Software Engineer',
  'SOFTWARE DEVELOPER': 'Software Engineer',
  'BACKEND': 'Backend Developer',
  'FRONTEND': 'Frontend Developer',
  'FULLSTACK': 'Full Stack Developer',
  'FULL-STACK': 'Full Stack Developer',
  'FULL STACK': 'Full Stack Developer',
  'DATA SCIENTIST': 'Data Scientist',
  'DATA ANALYST': 'Data Analyst',
  'DATA ENGINEER': 'Data Engineer',
  'MACHINE LEARNING': 'AI/ML Engineer',
  'AI ENGINEER': 'AI/ML Engineer',
  'LLM': 'AI/ML Engineer',
  'NLP': 'AI/ML Engineer',
  'DEEP LEARNING': 'AI/ML Engineer',
  'PRODUCT MANAGER': 'Product Manager',
  'PRODUCT OWNER': 'Product Manager',
  'DEVOPS': 'DevOps Engineer',
  'SITE RELIABILITY': 'DevOps Engineer',
  'SRE': 'DevOps Engineer',
  'CLOUD': 'Cloud Engineer',
  'CYBERSECURITY': 'Security Engineer',
  'SECURITY': 'Security Engineer',
  'MOBILE': 'Mobile Developer',
  'IOS': 'Mobile Developer',
  'ANDROID': 'Mobile Developer',
  'REACT NATIVE': 'Mobile Developer',
  'FLUTTER': 'Mobile Developer',
  'QA': 'QA Engineer',
  'TEST': 'QA Engineer',
  'SDET': 'QA Engineer',
  'UI/UX': 'Designer',
  'DESIGNER': 'Designer',
  'GRAPHIC': 'Designer',
  'PRODUCT DESIGN': 'Designer',
  'INFRASTRUCTURE': 'Cloud Engineer',
  'SYSTEMS ENGINEER': 'Software Engineer',
  'EMBEDDED': 'Embedded Engineer',
  'FIRMWARE': 'Embedded Engineer',
  'BLOCKCHAIN': 'Web3 Developer',
  'ETHEREUM': 'Web3 Developer',
  'SMART CONTRACT': 'Web3 Developer',
  'SALESFORCE': 'Salesforce Developer',
  'SAP': 'ERP Consultant',
  'ORACLE': 'Database Administrator',
  'DBA': 'Database Administrator',
  'SOLUTIONS ARCHITECT': 'Solutions Architect',
  'ENGINEERING MANAGER': 'Engineering Manager',
  'DIRECTOR OF ENGINEERING': 'Engineering Manager',
  'CTO': 'Executive',
  'VP OF ENGINEERING': 'Executive'
};

export function normalizeTitle(title: string): string {
  if (!title) return 'Other';
  
  const upperTitle = title.toUpperCase();
  
  // Try to find a match in the map
  for (const [key, value] of Object.entries(TITLE_MAP)) {
    if (upperTitle.includes(key)) {
      return value;
    }
  }
  
  // Clean up the title if no match
  return title
    .replace(/\s*\(.*\)\s*/g, '') // Remove parentheses
    .replace(/\s*-\s*.*$/g, '')   // Remove everything after a dash
    .trim();
}

/**
 * Normalizes city names to common US tech hubs
 */
export function normalizeCity(city: string): string {
  if (!city) return 'Remote';
  
  const hubMap: Record<string, string> = {
    'SAN FRANCISCO': 'San Francisco',
    'SF': 'San Francisco',
    'BAY AREA': 'San Francisco',
    'PALO ALTO': 'San Francisco',
    'SAN JOSE': 'San Francisco',
    'MOUNTAIN VIEW': 'San Francisco',
    'MENLO PARK': 'San Francisco',
    'SUNNYVALE': 'San Francisco',
    'NEW YORK': 'New York',
    'NYC': 'New York',
    'BROOKLYN': 'New York',
    'AUSTIN': 'Austin',
    'SEATTLE': 'Seattle',
    'BELLEVUE': 'Seattle',
    'REDMOND': 'Seattle',
    'BOSTON': 'Boston',
    'CAMBRIDGE': 'Boston',
    'CHICAGO': 'Chicago',
    'LOS ANGELES': 'Los Angeles',
    'LA': 'Los Angeles',
    'SANTA MONICA': 'Los Angeles',
    'DENVER': 'Denver',
    'BOULDER': 'Denver',
    'MIAMI': 'Miami',
    'ATLANTA': 'Atlanta',
    'WASHINGTON': 'Washington DC',
    'DC': 'Washington DC',
    'SAN DIEGO': 'Los Angeles',
    'REMOTE': 'Remote',
    'ANYWHERE': 'Remote',
    'WORLDWIDE': 'Remote',
    'UNITED STATES': 'Remote', // Often means remote US
    'US': 'Remote'
  };

  const upperCity = city.toUpperCase();
  for (const [key, value] of Object.entries(hubMap)) {
    if (upperCity.includes(key)) return value;
  }

  // If not a known hub, just return the raw city or a generic 'Remote' if it implies remote
  if (upperCity.includes('REMOTE') || upperCity.includes('ANYWHERE')) return 'Remote';

  return city.trim();
}

const TECHNOLOGY_DICTIONARY: Record<string, string> = {
  // Languages
  'PYTHON': 'Python',
  'PY': 'Python',
  'JAVASCRIPT': 'JavaScript',
  'JS': 'JavaScript',
  'TYPESCRIPT': 'TypeScript',
  'TS': 'TypeScript',
  'GO': 'Go',
  'GOLANG': 'Go',
  'RUST': 'Rust',
  'JAVA': 'Java',
  'C++': 'C++',
  'CPP': 'C++',
  'C#': 'C#',
  'CSHARP': 'C#',
  'RUBY': 'Ruby',
  'PHP': 'PHP',
  'SWIFT': 'Swift',
  'KOTLIN': 'Kotlin',
  'SCALA': 'Scala',
  
  // Frontend
  'REACT': 'React',
  'REACTJS': 'React',
  'NEXT.JS': 'Next.js',
  'NEXTJS': 'Next.js',
  'VUE': 'Vue.js',
  'VUEJS': 'Vue.js',
  'ANGULAR': 'Angular',
  'SVELTE': 'Svelte',
  'TAILWIND': 'Tailwind CSS',
  'TAILWINDCSS': 'Tailwind CSS',
  
  // Backend
  'NODE.JS': 'Node.js',
  'NODEJS': 'Node.js',
  'NODE': 'Node.js',
  'EXPRESS': 'Express',
  'DJANGO': 'Django',
  'FASTAPI': 'FastAPI',
  'SPRING': 'Spring Boot',
  'SPRINGBOOT': 'Spring Boot',
  'GRAPHQL': 'GraphQL',

  // Cloud
  'AWS': 'AWS',
  'AMAZON WEB SERVICES': 'AWS',
  'GCP': 'GCP',
  'GOOGLE CLOUD': 'GCP',
  'AZURE': 'Azure',
  'CLOUDFLARE': 'Cloudflare',
  'VERCEL': 'Vercel',

  // DevOps & Infrastructure
  'DOCKER': 'Docker',
  'KUBERNETES': 'Kubernetes',
  'K8S': 'Kubernetes',
  'TERRAFORM': 'Terraform',
  'ANSIBLE': 'Ansible',
  'JENKINS': 'Jenkins',
  'HELM': 'Helm',
  'PROMETHEUS': 'Prometheus',
  'GRAFANA': 'Grafana',
  'GITHUB ACTIONS': 'GitHub Actions',
  'LINUX': 'Linux',
  'CI/CD': 'CI/CD',

  // Databases
  'SQL': 'SQL',
  'POSTGRESQL': 'PostgreSQL',
  'POSTGRES': 'PostgreSQL',
  'MYSQL': 'MySQL',
  'MONGODB': 'MongoDB',
  'MONGO': 'MongoDB',
  'REDIS': 'Redis',
  'ELASTICSEARCH': 'Elasticsearch',
  'CASSANDRA': 'Cassandra',
  'DYNAMODB': 'DynamoDB',

  // Data Engineering
  'SNOWFLAKE': 'Snowflake',
  'DATABRICKS': 'Databricks',
  'KAFKA': 'Kafka',
  'AIRFLOW': 'Airflow',
  'SPARK': 'Apache Spark',
  'APACHE SPARK': 'Apache Spark',
  'HADOOP': 'Hadoop',
  'PANDAS': 'Pandas',
  'NUMPY': 'NumPy',

  // AI / ML
  'TENSORFLOW': 'TensorFlow',
  'PYTORCH': 'PyTorch',
  'LANGCHAIN': 'LangChain',
  'OPENAI': 'OpenAI',
  'HUGGING FACE': 'Hugging Face',
  'HUGGINGFACE': 'Hugging Face',
  'LLM': 'LLM',
  'SCIKIT-LEARN': 'Scikit-learn',
  'KUBEFLOW': 'KubeFlow',
  'PROMPT ENGINEERING': 'Prompt Engineering',
  'AI': 'AI',
  'MACHINE LEARNING': 'Machine Learning',
  'ML': 'Machine Learning'
};

/**
 * Extracts skills from text using a STRICT whitelist of actual technologies.
 * Prevents generic terms like 'senior', 'finance', 'marketing'.
 */
export function extractSkills(text: string): string[] {
  if (!text) return [];

  const foundSkills = new Set<string>();

  // Check against our strict whitelist
  for (const [alias, canonical] of Object.entries(TECHNOLOGY_DICTIONARY)) {
    // Special case for C++ to handle + symbols correctly in regex
    const escapedAlias = alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    // We use a boundary check, but since some tools like Node.js have punctuation,
    // we need to handle boundaries carefully.
    // \b doesn't work perfectly for ++ or .js, so we use a more robust regex:
    const regex = new RegExp(`(?:^|[^a-zA-Z0-9_+#-])${escapedAlias}(?:[^a-zA-Z0-9_+#-]|$)`, 'i');
    
    if (regex.test(text)) {
      foundSkills.add(canonical);
    }
  }

  return Array.from(foundSkills);
}

export function cleanSalary(salary: number | string | undefined): number | null {
  if (salary === undefined || salary === null || salary === '') return null;
  
  if (typeof salary === 'number') {
    if (isNaN(salary) || salary === 0) return null;
    return salary;
  }

  // Parse string salary (e.g. "$150k", "$150,000")
  const cleanStr = salary.replace(/[$,kK]/g, (match) => {
    if (match.toLowerCase() === 'k') return '000';
    return '';
  }).replace(/,/g, '');

  const num = parseFloat(cleanStr);
  return isNaN(num) || num === 0 ? null : num;
}
