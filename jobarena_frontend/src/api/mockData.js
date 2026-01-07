/** @typedef {import('../types/job').Job} Job */

/** @type {Job[]} */
export const MOCK_JOBS = [
  {
    id: 'job_001',
    title: 'Frontend Engineer (React)',
    company: 'Northbridge Systems',
    location: 'New York, NY',
    type: 'Full-time',
    experience: 'Mid',
    salaryRange: '$120k–$155k',
    postedAtISO: '2026-01-03T10:00:00.000Z',
    tags: ['React', 'TypeScript', 'Accessibility', 'CSS'],
    description:
      'Build polished, accessible user interfaces for enterprise customers. You will work closely with design to ship consistent components and robust experiences.\n\nResponsibilities:\n- Implement responsive UI and reusable components\n- Improve performance and accessibility\n- Collaborate with product and backend teams\n\nRequirements:\n- 3+ years with React\n- Strong CSS fundamentals\n- Experience with design systems',
  },
  {
    id: 'job_002',
    title: 'Backend Engineer (Node.js)',
    company: 'Hearthstone Labs',
    location: 'Remote (US)',
    type: 'Full-time',
    experience: 'Senior',
    salaryRange: '$150k–$190k',
    postedAtISO: '2026-01-02T14:30:00.000Z',
    tags: ['Node.js', 'APIs', 'PostgreSQL', 'Systems'],
    description:
      'Own critical backend services powering job matching and application workflows.\n\nResponsibilities:\n- Design and build REST APIs\n- Write reliable, observable services\n- Optimize database queries\n\nRequirements:\n- 5+ years backend experience\n- Strong knowledge of HTTP and data modeling',
  },
  {
    id: 'job_003',
    title: 'Product Designer',
    company: 'Executive Gray Studio',
    location: 'Austin, TX',
    type: 'Contract',
    experience: 'Mid',
    salaryRange: '$70–$95/hr',
    postedAtISO: '2025-12-28T09:15:00.000Z',
    tags: ['Figma', 'UX', 'Design Systems'],
    description:
      'Design clean, classic product experiences for professional audiences.\n\nResponsibilities:\n- Produce flows, wireframes, and high-fidelity UI\n- Maintain a consistent component library\n- Partner with engineering for implementation\n\nRequirements:\n- 3+ years product design\n- Strong communication and craft',
  },
  {
    id: 'job_004',
    title: 'Data Analyst',
    company: 'Silverline Partners',
    location: 'Chicago, IL',
    type: 'Part-time',
    experience: 'Entry',
    salaryRange: '$65k–$80k (pro-rated)',
    postedAtISO: '2025-12-26T16:00:00.000Z',
    tags: ['SQL', 'Dashboards', 'Insights'],
    description:
      'Support business decision-making with clear analysis and dashboards.\n\nResponsibilities:\n- Build and maintain KPI dashboards\n- Perform ad-hoc analysis\n- Communicate insights to stakeholders\n\nRequirements:\n- Strong SQL\n- Comfortable with data visualization tools',
  },
  {
    id: 'job_005',
    title: 'DevOps Engineer',
    company: 'Charcoal Ridge',
    location: 'Seattle, WA',
    type: 'Full-time',
    experience: 'Lead',
    salaryRange: '$175k–$220k',
    postedAtISO: '2025-12-22T11:00:00.000Z',
    tags: ['AWS', 'Kubernetes', 'CI/CD', 'Security'],
    description:
      'Lead infrastructure modernization and reliability initiatives.\n\nResponsibilities:\n- Build CI/CD pipelines and deployment workflows\n- Improve observability and incident response\n- Lead security hardening\n\nRequirements:\n- Deep cloud experience\n- Track record of operating production systems',
  },
];

/**
 * Basic in-memory search/filter for the mock dataset.
 * @param {import('../types/job').JobSearchFilters} filters
 * @returns {Job[]}
 */
export function filterMockJobs(filters) {
  const q = (filters.query || '').trim().toLowerCase();

  return MOCK_JOBS.filter((job) => {
    const matchesQuery =
      !q ||
      job.title.toLowerCase().includes(q) ||
      job.company.toLowerCase().includes(q) ||
      job.tags.some((t) => t.toLowerCase().includes(q));

    const matchesLocation =
      !filters.locations?.length || filters.locations.includes(job.location);

    const matchesType =
      !filters.jobTypes?.length || filters.jobTypes.includes(job.type);

    const matchesExperience =
      !filters.experienceLevels?.length ||
      filters.experienceLevels.includes(job.experience);

    return matchesQuery && matchesLocation && matchesType && matchesExperience;
  });
}
