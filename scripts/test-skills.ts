import { extractSkills } from '../src/services/normalization';

const testCases = [
  "Looking for a senior developer with 5 years experience in customer support and marketing. Must know JS, Python, and Node.js.",
  "Finance executive needed. Requirements: TS, K8s, and Terraform.",
  "Medical professional with experience in education, leadership, and React.",
  "Tags: C++, C#, AWS, medical, teamwork"
];

for (const tc of testCases) {
  console.log(`Input: "${tc}"`);
  console.log(`Extracted:`, extractSkills(tc));
  console.log('---');
}