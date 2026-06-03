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
    'NEW YORK': 'New York',
    'NYC': 'New York',
    'AUSTIN': 'Austin',
    'SEATTLE': 'Seattle',
    'BOSTON': 'Boston',
    'CHICAGO': 'Chicago',
    'LOS ANGELES': 'Los Angeles',
    'LA': 'Los Angeles',
    'DENVER': 'Denver',
    'BOULDER': 'Denver',
    'MIAMI': 'Miami',
    'ATLANTA': 'Atlanta',
    'REMOTE': 'Remote',
  };

  const upperCity = city.toUpperCase();
  for (const [key, value] of Object.entries(hubMap)) {
    if (upperCity.includes(key)) return value;
  }

  return city.trim();
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
