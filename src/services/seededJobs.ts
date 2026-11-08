import { Job, Company } from '../types';

export const ADDITIONAL_COMPANIES: Company[] = [
  {
    id: 'comp-pentagram',
    name: 'Pentagram',
    slug: 'pentagram',
    logo_url: 'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=160&auto=format&fit=crop&q=80',
    cover_url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&auto=format&fit=crop&q=80',
    description: 'Pentagram is a multi-disciplinary, independently-owned design studio with world-renowned partners across London, New York, Berlin, and Austin.',
    website: 'https://pentagram.com',
    industry: 'Brand Identity & Visual Design',
    company_size: '200-500',
    headquarters: 'London / New York',
    country: 'United Kingdom',
    city: 'London',
    created_at: new Date(Date.now() - 140 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'comp-locomotive',
    name: 'Locomotive',
    slug: 'locomotive',
    logo_url: 'https://images.unsplash.com/photo-1534972195531-a756b1126975?w=160&auto=format&fit=crop&q=80',
    cover_url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=80',
    description: 'Montreal-based digital agency and multiple Agency of the Year winner creating memorable digital experiences, web design, and branding.',
    website: 'https://locomotive.ca',
    industry: 'Digital Agency & WebGL',
    company_size: '20-50',
    headquarters: 'Montreal',
    country: 'Canada',
    city: 'Montreal',
    created_at: new Date(Date.now() - 110 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'comp-basic',
    name: 'BASIC/DEPT®',
    slug: 'basic-agency',
    logo_url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=160&auto=format&fit=crop&q=80',
    cover_url: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1200&auto=format&fit=crop&q=80',
    description: 'A global brand and digital experience design agency crafting flagship digital platforms for Google, Patagonia, KFC, and Apple.',
    website: 'https://basicagency.com',
    industry: 'Experience Design & Strategy',
    company_size: '100-200',
    headquarters: 'San Diego, CA',
    country: 'United States',
    city: 'San Diego',
    created_at: new Date(Date.now() - 95 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'comp-resn',
    name: 'Resn',
    slug: 'resn',
    logo_url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=160&auto=format&fit=crop&q=80',
    cover_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80',
    description: 'A digital arts practice with offices in Wellington and Amsterdam, pushing interactive design, WebGL, 3D, and creative technology.',
    website: 'https://resn.co.nz',
    industry: 'Creative Technology & 3D',
    company_size: '30-60',
    headquarters: 'Amsterdam',
    country: 'Netherlands',
    city: 'Amsterdam',
    created_at: new Date(Date.now() - 85 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'comp-koto',
    name: 'Koto Studio',
    slug: 'koto-studio',
    logo_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=160&auto=format&fit=crop&q=80',
    cover_url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1200&auto=format&fit=crop&q=80',
    description: 'Koto is an independent brand and digital agency working with the world’s most ambitious innovators like Airbnb, Sonos, and Discord.',
    website: 'https://koto.studio',
    industry: 'Brand Architecture & Design',
    company_size: '50-100',
    headquarters: 'London',
    country: 'United Kingdom',
    city: 'London',
    created_at: new Date(Date.now() - 70 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'comp-activetheory',
    name: 'Active Theory',
    slug: 'active-theory',
    logo_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=160&auto=format&fit=crop&q=80',
    cover_url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&auto=format&fit=crop&q=80',
    description: 'Creative studio specializing in real-time WebGL, interactive virtual spaces, and bleeding-edge web animations.',
    website: 'https://activetheory.net',
    industry: 'Interactive & WebGL Studio',
    company_size: '20-40',
    headquarters: 'Venice, CA',
    country: 'United States',
    city: 'Los Angeles',
    created_at: new Date(Date.now() - 65 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Helper to generate realistic seeded jobs 15 through 70
const jobTemplates = [
  { title: 'Design Systems Lead', cat: 'cat-1', type: 'full-time', exp: 'lead', loc: 'Remote, US', country: 'United States', comp: 'comp-basic', min: 160000, max: 210000, curr: 'USD', per: 'yearly', skills: ['Figma', 'Design Systems', 'React', 'Typography'] },
  { title: 'Senior Creative Technologist (Three.js / WebGL)', cat: 'cat-2', type: 'contract', exp: 'senior', loc: 'Remote Worldwide', country: 'Worldwide', comp: 'comp-locomotive', min: 95, max: 150, curr: 'USD', per: 'hourly', skills: ['Three.js / WebGL', 'React', 'Motion Design'] },
  { title: 'Art Director, Digital Campaigns', cat: 'cat-4', type: 'full-time', exp: 'senior', loc: 'London, UK (Hybrid)', country: 'United Kingdom', comp: 'comp-pentagram', min: 75000, max: 95000, curr: 'GBP', per: 'yearly', skills: ['Typography', 'Art Direction', 'Figma'] },
  { title: 'Junior Interactive Designer', cat: 'cat-1', type: 'full-time', exp: 'junior', loc: 'Berlin, DE', country: 'Germany', comp: 'comp-4', min: 42000, max: 54000, curr: 'EUR', per: 'yearly', skills: ['Figma', 'Lottie', 'UI/UX'] },
  { title: 'Lead 3D Motion Specialist', cat: 'cat-3', type: 'freelance', exp: 'lead', loc: 'Amsterdam, NL (Remote)', country: 'Netherlands', comp: 'comp-resn', min: 85, max: 140, curr: 'EUR', per: 'hourly', skills: ['Motion Design', 'Lottie', 'Three.js / WebGL'] },
  { title: 'Principal UX Architect, DTC Flagships', cat: 'cat-1', type: 'full-time', exp: 'executive', loc: 'New York, NY', country: 'United States', comp: 'comp-1', min: 185000, max: 240000, curr: 'USD', per: 'yearly', skills: ['Figma', 'UX Research', 'Shopify Plus'] },
  { title: 'Creative Frontend Engineer', cat: 'cat-2', type: 'full-time', exp: 'mid', loc: 'Paris, FR (Hybrid)', country: 'France', comp: 'comp-2', min: 58000, max: 74000, curr: 'EUR', per: 'yearly', skills: ['React', 'Tailwind CSS', 'TypeScript'] },
  { title: 'Brand Identity Director', cat: 'cat-4', type: 'full-time', exp: 'lead', loc: 'London, UK', country: 'United Kingdom', comp: 'comp-koto', min: 90000, max: 120000, curr: 'GBP', per: 'yearly', skills: ['Typography', 'Art Direction', 'Design Systems'] },
  { title: 'WebGL Shader Engineer', cat: 'cat-2', type: 'contract', exp: 'senior', loc: 'Remote Worldwide', country: 'Worldwide', comp: 'comp-activetheory', min: 110, max: 175, curr: 'USD', per: 'hourly', skills: ['Three.js / WebGL', 'GLSL', 'TypeScript'] },
  { title: 'Head of eCommerce Experience', cat: 'cat-5', type: 'full-time', exp: 'executive', loc: 'Austin, TX (Remote)', country: 'United States', comp: 'comp-5', min: 190000, max: 250000, curr: 'USD', per: 'yearly', skills: ['Shopify Plus', 'UX Research', 'Design Systems'] },
  { title: 'Product Designer, Growth & Activation', cat: 'cat-1', type: 'full-time', exp: 'mid', loc: 'San Francisco, CA', country: 'United States', comp: 'comp-linear', min: 145000, max: 180000, curr: 'USD', per: 'yearly', skills: ['Figma', 'Design Systems', 'UX Research'] },
  { title: 'Senior Brand Designer, Tech Flagship', cat: 'cat-4', type: 'full-time', exp: 'senior', loc: 'Remote, US', country: 'United States', comp: 'comp-supabase', min: 150000, max: 195000, curr: 'USD', per: 'yearly', skills: ['Typography', 'Figma', 'Motion Design'] },
  { title: 'Luxury eCommerce UI Designer', cat: 'cat-1', type: 'full-time', exp: 'mid', loc: 'London, UK', country: 'United Kingdom', comp: 'comp-3', min: 52000, max: 68000, curr: 'GBP', per: 'yearly', skills: ['Figma', 'Shopify Plus', 'Typography'] },
  { title: 'Senior Kinetic & Micro-interaction Designer', cat: 'cat-3', type: 'contract', exp: 'senior', loc: 'Zurich, CH (Remote)', country: 'Switzerland', comp: 'comp-8', min: 100, max: 160, curr: 'CHF', per: 'hourly', skills: ['Lottie', 'Motion Design', 'Figma'] },
];

export const generateSeededJobs = (): Job[] => {
  const jobs: Job[] = [];
  const totalTarget = 70;
  const startId = 15;

  for (let i = startId; i <= totalTarget; i++) {
    const template = jobTemplates[(i - startId) % jobTemplates.length];
    const daysAgo = Math.floor((i - startId) * 0.8) + 1;
    const isFeatured = i % 4 === 0;

    const baseTitle = template.title;
    const variationSuffix = i > startId + jobTemplates.length - 1 ? ` (Cohort ${Math.floor((i - startId) / jobTemplates.length) + 1})` : '';
    const title = `${baseTitle}${variationSuffix}`;
    const slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${i}`;

    jobs.push({
      id: `job-${i}`,
      title,
      slug,
      company_id: template.comp,
      category_id: template.cat,
      description: `Join an elite digital design studio committed to extraordinary craft. As ${title}, you will partner with cross-disciplinary creators to establish new interactive benchmarks for progressive global brands and product organizations.`,
      responsibilities: [
        'Deliver boundary-pushing interactive concepts and production-ready artifacts',
        'Maintain impeccable typographic rhythm, micro-animations, and visual balance',
        'Collaborate seamlessly with frontend engineers and digital product directors',
        'Participate in design critiques, sprint reviews, and studio showcase retrospectives',
      ],
      requirements: [
        'Proven expertise in modern interactive design paradigms and toolchains',
        'Flawless eye for layout typography, color hierarchy, and responsive states',
        'Demonstrated portfolio of public work across web, mobile, or experiential surfaces',
        'Clear asynchronous written communication and creative presentation skills',
      ],
      qualifications: [
        'Degree in Design, Human-Computer Interaction, Fine Arts, or equivalent practical portfolio',
        'Documented track record contributing to high-performing digital agencies or venture teams',
      ],
      benefits: [
        'Competitive international compensation package',
        'Comprehensive health, wellness, and mental care coverage',
        'Annual hardware, book, and creative software stipend ($3,500)',
        'Flexible hybrid / 100% remote working arrangements with generous PTO',
      ],
      location: template.loc,
      city: template.country === 'Worldwide' ? 'Remote' : template.loc.split(',')[0],
      country: template.country,
      workplace_type: template.loc.includes('Hybrid') ? 'hybrid' : 'remote',
      employment_type: template.type as any,
      experience_level: template.exp as any,
      salary_min: template.min,
      salary_max: template.max,
      salary_currency: template.curr,
      salary_period: template.per as any,
      salary_visible: true,
      application_mode: 'internal',
      status: 'published',
      is_featured: isFeatured,
      published_at: new Date(Date.now() - daysAgo * 86400000).toISOString(),
      created_at: new Date(Date.now() - daysAgo * 86400000).toISOString(),
      updated_at: new Date(Date.now() - daysAgo * 86400000).toISOString(),
      skills: template.skills,
    });
  }

  return jobs;
};
