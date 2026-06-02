const TITLE_MAP: Record<string, string> = {
  'SDE': 'Software Engineer',
  'Software Engineer': 'Software Engineer',
  'Backend Developer': 'Backend Developer',
  'Frontend Developer': 'Frontend Developer',
  'Full Stack Developer': 'Full Stack Developer',
  'AI Engineer': 'AI Engineer',
  'Data Scientist': 'Data Scientist',
  'Product Manager': 'Product Manager',
  'Cloud Security': 'Cloud Security',
  'DevOps Engineer': 'DevOps Engineer',
};

export function normalizeTitle(title: string): string {
  const upperTitle = title.toUpperCase();
  
  for (const [key, value] of Object.entries(TITLE_MAP)) {
    if (upperTitle.includes(key.toUpperCase())) {
      return value;
    }
  }
  
  return title; // Fallback to original if no match
}

export function cleanSalary(salary: number | undefined): number | null {
  if (salary === undefined || isNaN(salary)) return null;
  return salary;
}
