import {
  UserProfile,
  Company,
  Category,
  Skill,
  Job,
  Application,
  Resume,
  SavedJob,
  ContactMessage,
  NewsletterSubscriber,
  SiteSettings,
  ApplicationStatus,
  UserRole,
} from '../types';

// Storage keys
const STORAGE_PREFIX = 'grail_jobs_';
const KEY_USER = `${STORAGE_PREFIX}current_user`;
const KEY_USERS = `${STORAGE_PREFIX}users`;
const KEY_COMPANIES = `${STORAGE_PREFIX}companies`;
const KEY_CATEGORIES = `${STORAGE_PREFIX}categories`;
const KEY_SKILLS = `${STORAGE_PREFIX}skills`;
const KEY_JOBS = `${STORAGE_PREFIX}jobs`;
const KEY_APPLICATIONS = `${STORAGE_PREFIX}applications`;
const KEY_RESUMES = `${STORAGE_PREFIX}resumes`;
const KEY_SAVED_JOBS = `${STORAGE_PREFIX}saved_jobs`;
const KEY_MESSAGES = `${STORAGE_PREFIX}messages`;
const KEY_SUBSCRIBERS = `${STORAGE_PREFIX}subscribers`;
const KEY_SETTINGS = `${STORAGE_PREFIX}settings`;

// Seed Data
const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'UI/UX Design', slug: 'ui-ux-design', description: 'Product design, design systems, interface architecture', icon: 'Layout' },
  { id: 'cat-2', name: 'Web & Frontend', slug: 'web-frontend', description: 'React, TypeScript, WebGL, creative engineering', icon: 'Code' },
  { id: 'cat-3', name: 'Motion & 3D', slug: 'motion-3d', description: 'Lottie, After Effects, Three.js, kinetic animation', icon: 'Sparkles' },
  { id: 'cat-4', name: 'Art Direction', slug: 'art-direction', description: 'Creative direction, brand identity, visual storytelling', icon: 'Compass' },
  { id: 'cat-5', name: 'eCommerce & Growth', slug: 'ecommerce-growth', description: 'Shopify Plus, direct-to-consumer optimization', icon: 'TrendingUp' },
];

const INITIAL_SKILLS: Skill[] = [
  { id: 'sk-1', name: 'Figma', slug: 'figma' },
  { id: 'sk-2', name: 'Design Systems', slug: 'design-systems' },
  { id: 'sk-3', name: 'React', slug: 'react' },
  { id: 'sk-4', name: 'Tailwind CSS', slug: 'tailwind-css' },
  { id: 'sk-5', name: 'Lottie', slug: 'lottie' },
  { id: 'sk-6', name: 'Three.js / WebGL', slug: 'threejs-webgl' },
  { id: 'sk-7', name: 'Shopify Plus', slug: 'shopify-plus' },
  { id: 'sk-8', name: 'Typography', slug: 'typography' },
  { id: 'sk-9', name: 'UX Research', slug: 'ux-research' },
  { id: 'sk-10', name: 'Motion Design', slug: 'motion-design' },
];

const INITIAL_COMPANIES: Company[] = [
  {
    id: 'comp-1',
    name: 'Storetasker',
    slug: 'storetasker',
    logo_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=160&auto=format&fit=crop&q=80',
    cover_url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1200&auto=format&fit=crop&q=80',
    description: 'The leading curated freelance talent platform for high-growth direct-to-consumer eCommerce brands. The platform has supported thousands of fractional hires for brands like Alo Yoga, SoundCloud, and DraftKings.',
    website: 'https://storetasker.com',
    industry: 'Design & eCommerce Talent',
    company_size: '51-200',
    headquarters: 'New York, NY',
    country: 'United States',
    city: 'New York',
    social_links: { twitter: 'https://twitter.com', linkedin: 'https://linkedin.com' },
    created_at: new Date(Date.now() - 60 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: 'comp-2',
    name: 'Dagobert',
    slug: 'dagobert',
    logo_url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=160&auto=format&fit=crop&q=80',
    cover_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80',
    description: 'An independent digital creative communications agency accompanying leading global brands in creative & brand strategies, from strategic thinking to high-end interactive production.',
    website: 'https://dagobert.com',
    industry: 'Creative Communications',
    company_size: '50-100',
    headquarters: 'Paris',
    country: 'France',
    city: 'Paris',
    social_links: { twitter: 'https://twitter.com', linkedin: 'https://linkedin.com' },
    created_at: new Date(Date.now() - 90 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
  {
    id: 'comp-3',
    name: 'Limesharp',
    slug: 'limesharp',
    logo_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=160&auto=format&fit=crop&q=80',
    cover_url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&auto=format&fit=crop&q=80',
    description: 'Award-winning digital commerce agency creating bespoke solutions for fashion, beauty and lifestyle brands worldwide.',
    website: 'https://limesharp.net',
    industry: 'Luxury eCommerce',
    company_size: '20-50',
    headquarters: 'London',
    country: 'United Kingdom',
    city: 'London',
    social_links: { linkedin: 'https://linkedin.com' },
    created_at: new Date(Date.now() - 120 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 12 * 86400000).toISOString(),
  },
  {
    id: 'comp-4',
    name: 'Webwavers',
    slug: 'webwavers',
    logo_url: 'https://images.unsplash.com/photo-1534972195531-a756b1126975?w=160&auto=format&fit=crop&q=80',
    cover_url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=80',
    description: 'High-end web agency specializing in kinetic interactions, Lottie animations, and Awwwards-caliber digital experiences.',
    website: 'https://webwavers.de',
    industry: 'Motion & Interactive Web',
    company_size: '10-25',
    headquarters: 'Berlin',
    country: 'Germany',
    city: 'Berlin',
    social_links: { twitter: 'https://twitter.com' },
    created_at: new Date(Date.now() - 45 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 'comp-5',
    name: 'Push Refresh',
    slug: 'push-refresh',
    logo_url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=160&auto=format&fit=crop&q=80',
    cover_url: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1200&auto=format&fit=crop&q=80',
    description: 'We take rough ideas, wireframes, or conversations and turn them into exceptional digital products and websites.',
    website: 'https://pushrefresh.com',
    industry: 'Digital Product Studio',
    company_size: '10-20',
    headquarters: 'Austin, TX',
    country: 'United States',
    city: 'Austin',
    social_links: { linkedin: 'https://linkedin.com' },
    created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: 'comp-6',
    name: 'on/Sight',
    slug: 'on-sight',
    logo_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=160&auto=format&fit=crop&q=80',
    cover_url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&auto=format&fit=crop&q=80',
    description: 'Full-service eCommerce web development & design agency engineering scalable storefronts for consumer brands.',
    website: 'https://onsight.co',
    industry: 'eCommerce Technology',
    company_size: '25-50',
    headquarters: 'Denver, CO',
    country: 'United States',
    city: 'Denver',
    social_links: { twitter: 'https://twitter.com' },
    created_at: new Date(Date.now() - 75 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 8 * 86400000).toISOString(),
  },
  {
    id: 'comp-7',
    name: 'Anchour',
    slug: 'anchour',
    logo_url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=160&auto=format&fit=crop&q=80',
    cover_url: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1200&auto=format&fit=crop&q=80',
    description: 'A brand transformation and experience studio engineering digital flagships that shape markets.',
    website: 'https://anchour.com',
    industry: 'Branding & Experience',
    company_size: '30-60',
    headquarters: 'Portland, ME',
    country: 'United States',
    city: 'Portland',
    social_links: { twitter: 'https://twitter.com' },
    created_at: new Date(Date.now() - 110 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 4 * 86400000).toISOString(),
  },
  {
    id: 'comp-8',
    name: 'Frontify',
    slug: 'frontify',
    logo_url: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?w=160&auto=format&fit=crop&q=80',
    cover_url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&auto=format&fit=crop&q=80',
    description: 'The brand-building platform connecting everything and everyone essential to building consistent, memorable brands.',
    website: 'https://frontify.com',
    industry: 'Brand Infrastructure SaaS',
    company_size: '200-500',
    headquarters: 'St. Gallen',
    country: 'Switzerland',
    city: 'St. Gallen',
    social_links: { twitter: 'https://twitter.com', linkedin: 'https://linkedin.com' },
    created_at: new Date(Date.now() - 180 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 6 * 86400000).toISOString(),
  },
  {
    id: 'comp-linear',
    name: 'Linear',
    slug: 'linear',
    logo_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=160&auto=format&fit=crop&q=80',
    cover_url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop&q=80',
    description: 'Linear is the issue tracking tool built for high-performance product teams. Designed for speed, craft, and precision.',
    website: 'https://linear.app',
    industry: 'Developer Productivity Software',
    company_size: '50-100',
    headquarters: 'San Francisco, CA',
    country: 'United States',
    city: 'San Francisco',
    social_links: { twitter: 'https://twitter.com/linear', linkedin: 'https://linkedin.com/company/linear-app' },
    created_at: new Date(Date.now() - 40 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 'comp-supabase',
    name: 'Supabase',
    slug: 'supabase',
    logo_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=160&auto=format&fit=crop&q=80',
    cover_url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&auto=format&fit=crop&q=80',
    description: 'Supabase is an open source Firebase alternative. Build production-grade backends in a weekend with Postgres, Auth, and Edge Functions.',
    website: 'https://supabase.com',
    industry: 'Cloud Infrastructure & Open Source',
    company_size: '100-200',
    headquarters: 'Singapore',
    country: 'Worldwide',
    city: 'Remote Worldwide',
    social_links: { twitter: 'https://twitter.com/supabase', linkedin: 'https://linkedin.com/company/supabase' },
    created_at: new Date(Date.now() - 35 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
];

const INITIAL_JOBS: Job[] = [
  {
    id: 'job-1',
    title: 'Senior UI/UX Designer, eCommerce',
    slug: 'senior-ui-ux-designer-ecommerce-storetasker',
    company_id: 'comp-1',
    category_id: 'cat-1',
    description: 'Storetasker is the leading talent platform for Consumer Brands - changing how brands hire exceptional freelancers and agencies across development, design, marketing, and operations. The platform has supported thousands of fractional hires for brands like Alo Yoga, Dermalogoica, SoundCloud, DraftKings, and Verve Coffee.',
    responsibilities: [
      'Design end-to-end user journeys for high-conversion Shopify storefronts and DTC flagships',
      'Deliver scalable Figma design systems with strict tokens, responsive layouts, and state matrices',
      'Collaborate directly with DTC founders and engineering teams on conversion rate optimization',
      'Conduct user testing sessions, competitor audits, and heuristic evaluations',
    ],
    requirements: [
      '5+ years of digital product / UI/UX design experience with direct focus on eCommerce',
      'Mastery of Figma, auto-layout 5.0, design tokens, and interactive micro-prototyping',
      'Deep understanding of mobile checkout psychology, page speed constraints, and cart mechanics',
      'Strong communication skills for presenting design rationale to brand executives',
    ],
    qualifications: [
      'Bachelor’s degree in Interaction Design, HCI, Graphic Design, or equivalent proven field experience',
      'A distinguished portfolio showcasing shipped, high-growth direct-to-consumer digital products',
    ],
    benefits: [
      'Top-tier hourly rate ($90 – $175 / hour)',
      '100% remote flexibility with asynchronous collaboration',
      'Continuous pipeline of engagements with visionary global consumer brands',
      'Access to private Storetasker creative guild and industry masterclasses',
    ],
    location: 'Remote',
    city: 'New York',
    country: 'United States',
    workplace_type: 'remote',
    employment_type: 'freelance',
    experience_level: 'senior',
    salary_min: 90,
    salary_max: 175,
    salary_currency: 'USD',
    salary_period: 'hourly',
    salary_visible: true,
    application_mode: 'internal',
    status: 'published',
    is_featured: true,
    published_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    skills: ['Figma', 'Design Systems', 'Shopify Plus', 'UX Research'],
  },
  {
    id: 'job-2',
    title: 'Designer / Directeur artistique web (UI/UX)',
    slug: 'designer-directeur-artistique-web-dagobert',
    company_id: 'comp-2',
    category_id: 'cat-4',
    description: 'Qui sommes-nous ? Dagobert est une agence de communication digitale indépendante qui accompagne les marques dans la création de stratégies de communication créatives, performantes et engagées. De la réflexion stratégique à la production de contenus de pointe.',
    responsibilities: [
      'Concevoir la direction artistique globale et l’identité visuelle des plateformes web pour nos clients de luxe',
      'Guider et mentorer les designers UX et juniors sur les standards graphiques d’excellence (Awwwards, FWA)',
      'Présenter et défendre les intentions créatives directement auprès des directions marketing',
    ],
    requirements: [
      'Culture visuelle aiguë, maîtrise raffinée de la typographie et de la composition éditoriale',
      'Maîtrise experte de Figma, suites Adobe (After Effects, Illustrator, Photoshop)',
      'Minimum 4 ans en agence créative digitale avec des récompenses ou réalisations primées',
    ],
    qualifications: [
      'Formation supérieure en Arts Graphiques, Direction Artistique ou Design Numérique',
      'Portfolio d’exception démontrant un sens affûté de l’élégance interactive',
    ],
    benefits: [
      'Rémunération attractive de 65 000 € à 85 000 € selon profil',
      'Bureaux d’exception au cœur de Paris avec rythme hybride',
      'Budget matériel Apple de dernière génération',
      'Mutuelle Alan d’entreprise prise en charge à 100%',
    ],
    location: 'Paris / Hybrid',
    city: 'Paris',
    country: 'France',
    workplace_type: 'hybrid',
    employment_type: 'full-time',
    experience_level: 'senior',
    salary_min: 65000,
    salary_max: 85000,
    salary_currency: 'EUR',
    salary_period: 'yearly',
    salary_visible: true,
    application_mode: 'internal',
    status: 'published',
    is_featured: true,
    published_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    skills: ['Figma', 'Typography', 'Motion Design', 'Design Systems'],
  },
  {
    id: 'job-3',
    title: 'Junior UI/UX Designer',
    slug: 'junior-ui-ux-designer-limesharp',
    company_id: 'comp-3',
    category_id: 'cat-1',
    description: 'Limesharp is an award-winning, creatively led digital commerce agency creating bespoke solutions for fashion, beauty & lifestyle brands. We are a global team of designers, strategy experts, and project managers on a mission to craft retail experiences that move culture forward.',
    responsibilities: [
      'Collaborate with lead designers to create wireframes, UI components, and interactive prototypes',
      'Assist in maintaining clean tokenized design libraries in Figma for luxury fashion brands',
      'Prepare production-ready design handoffs and design spec QA with frontend developers',
    ],
    requirements: [
      '1–2 years practical experience in digital product design or high-standard internship portfolio',
      'Proficiency in Figma (auto-layout, components, styles)',
      'Sharp eye for spacing, typography scale, and aesthetic cleanliness',
    ],
    qualifications: [
      'Degree or equivalent coursework in Graphic Design, UI/UX, or Interaction Design',
      'Portfolio showcasing attention to detail and strong passion for web craft',
    ],
    benefits: [
      'Annual salary £35,000 – £45,000',
      'Mentorship from renowned creative directors',
      'Flexible hybrid working schedule (2 days in London studio)',
      '£1,500 annual personal development and conference budget',
    ],
    location: 'London / Hybrid',
    city: 'London',
    country: 'United Kingdom',
    workplace_type: 'hybrid',
    employment_type: 'full-time',
    experience_level: 'entry',
    salary_min: 35000,
    salary_max: 45000,
    salary_currency: 'GBP',
    salary_period: 'yearly',
    salary_visible: true,
    application_mode: 'internal',
    status: 'published',
    is_featured: false,
    published_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    skills: ['Figma', 'Design Systems', 'Typography'],
  },
  {
    id: 'job-4',
    title: 'Lottie Hero Animation from Figma – Urgent',
    slug: 'lottie-hero-animation-from-figma-urgent-webwavers',
    company_id: 'comp-4',
    category_id: 'cat-3',
    description: 'We are an award-winning web design agency and urgently require a senior motion designer to engineer a high-performance Lottie animation for an Awwwards Site of the Day candidate hero section. All visual screens are completely finished in Figma — we are looking for precise animation craft.',
    responsibilities: [
      'Translate finalized Figma layers into liquid, 60fps vector animations in After Effects',
      'Export and optimize lightweight JSON Lottie files (target under 250kb)',
      'Sync easing curves with engineering specifications for scroll-triggered scrub playback',
    ],
    requirements: [
      'Extensive mastery of After Effects and Bodymovin / LottieFiles export pipeline',
      'Proven expertise in web performance constraints (limiting vector masks, avoiding heavy blur)',
      'Ability to complete iterative revisions within a 5-day rush timeframe',
    ],
    qualifications: [
      'Exceptional motion reel with live links to shipped web interactive animations',
    ],
    benefits: [
      'Sprint fee of €4,000 – €7,500 based on completion speed and polish',
      '100% remote asynchronous workflow',
      'Credit on our upcoming Awwwards and FWA submissions',
      'Priority access to upcoming 2026 client retainer projects',
    ],
    location: 'Remote',
    city: 'Berlin',
    country: 'Germany',
    workplace_type: 'remote',
    employment_type: 'contract',
    experience_level: 'senior',
    salary_min: 4000,
    salary_max: 7500,
    salary_currency: 'EUR',
    salary_period: 'monthly',
    salary_visible: true,
    application_mode: 'internal',
    status: 'published',
    is_featured: true,
    published_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    skills: ['Lottie', 'Motion Design', 'Figma'],
  },
  {
    id: 'job-5',
    title: 'Visual Designer (Contract to Hire)',
    slug: 'visual-designer-contract-to-hire-push-refresh',
    company_id: 'comp-5',
    category_id: 'cat-1',
    description: 'Push Refresh is looking for a visual designer who can take a rough idea, a wireframe, or a conversation and turn it into something exceptional. We design and build websites and digital products for a range of visionary clients that redefine category standards.',
    responsibilities: [
      'Formulate distinct visual identities and layout languages for new software launches',
      'Create custom iconography, vector assets, and promotional design modules',
      'Partner closely with creative directors to push boundaries of web aesthetics',
    ],
    requirements: [
      '3+ years of visual design expertise in modern agency or startup environments',
      'Impeccable mastery of whitespace, proportional grids, and modern sans-serif typography',
      'Fluency in Figma and rapid interactive wireframing',
    ],
    qualifications: [
      'Compelling design portfolio demonstrating distinctive visual solutions and taste',
    ],
    benefits: [
      '$80,000 – $110,000 annual equivalent during initial contract with conversion to equity & full-time',
      'Remote-first culture with Austin studio access for retreats',
      'Unlimited PTO and home workstation allowance',
    ],
    location: 'Remote',
    city: 'Austin',
    country: 'United States',
    workplace_type: 'remote',
    employment_type: 'contract',
    experience_level: 'mid',
    salary_min: 80000,
    salary_max: 110000,
    salary_currency: 'USD',
    salary_period: 'yearly',
    salary_visible: true,
    application_mode: 'internal',
    status: 'published',
    is_featured: false,
    published_at: new Date(Date.now() - 6 * 86400000).toISOString(),
    created_at: new Date(Date.now() - 6 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 6 * 86400000).toISOString(),
    skills: ['Figma', 'Typography', 'Design Systems'],
  },
  {
    id: 'job-6',
    title: 'eCommerce Web Designer',
    slug: 'ecommerce-web-designer-on-sight',
    company_id: 'comp-6',
    category_id: 'cat-5',
    description: 'About on/Sight: on/Sight is a full-service eCommerce web development and design agency based in Colorado. We design and build solutions for stores of all shapes and sizes, focusing on high-volume direct-to-consumer brands on the Shopify platform.',
    responsibilities: [
      'Architect intuitive shopping experiences from landing pages to checkout confirmations',
      'Build reusable component blocks for Shopify theme customizers',
      'Execute A/B testing variations for top 100 DTC brands',
    ],
    requirements: [
      'Proven track record designing Shopify storefronts with high customer conversion',
      'Expert Figma skills with structured component variants and token systems',
      'Solid grasp of HTML/CSS fundamentals to ensure developer feasibility',
    ],
    qualifications: [
      'Bachelor’s in design or equivalent demonstrated agency portfolio',
    ],
    benefits: [
      '$85,000 – $120,000 salary package',
      'Comprehensive medical, dental, and vision health coverage',
      '401(k) retirement matching program',
      'Fully remote with quarterly agency summits',
    ],
    location: 'Remote',
    city: 'Denver',
    country: 'United States',
    workplace_type: 'remote',
    employment_type: 'full-time',
    experience_level: 'mid',
    salary_min: 85000,
    salary_max: 120000,
    salary_currency: 'USD',
    salary_period: 'yearly',
    salary_visible: true,
    application_mode: 'internal',
    status: 'published',
    is_featured: false,
    published_at: new Date(Date.now() - 8 * 86400000).toISOString(),
    created_at: new Date(Date.now() - 8 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 8 * 86400000).toISOString(),
    skills: ['Shopify Plus', 'Figma', 'UX Research', 'Design Systems'],
  },
  {
    id: 'job-7',
    title: 'Senior Creative Frontend Engineer',
    slug: 'senior-creative-frontend-engineer-anchour',
    company_id: 'comp-7',
    category_id: 'cat-2',
    description: 'Anchour is seeking a Senior Creative Frontend Engineer to bring breathtaking digital brand flagships to life. You will sit at the intersection of graphic design, 3D WebGL, and modern React performance.',
    responsibilities: [
      'Build buttery smooth, responsive web applications using React, Tailwind, and Motion',
      'Implement custom Three.js shaders and fluid canvas interactions',
      'Ensure sub-1 second load times and strict WCAG accessibility compliance',
    ],
    requirements: [
      '5+ years engineering responsive web experiences with creative flair',
      'Extensive experience with React, TypeScript, and modern animation libraries',
      'Understanding of WebGL, GLSL shaders, and performance profiling',
    ],
    qualifications: [
      'Portfolio of shipped interactive websites featuring awards or recognition',
    ],
    benefits: [
      '$120,000 – $155,000 base salary',
      'Remote or Portland ME studio options',
      'Generous hardware budget and annual educational stipends',
    ],
    location: 'Remote / Portland, ME',
    city: 'Portland',
    country: 'United States',
    workplace_type: 'remote',
    employment_type: 'full-time',
    experience_level: 'senior',
    salary_min: 120000,
    salary_max: 155000,
    salary_currency: 'USD',
    salary_period: 'yearly',
    salary_visible: true,
    application_mode: 'internal',
    status: 'published',
    is_featured: true,
    published_at: new Date(Date.now() - 4 * 86400000).toISOString(),
    created_at: new Date(Date.now() - 4 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 4 * 86400000).toISOString(),
    skills: ['React', 'Tailwind CSS', 'Three.js / WebGL'],
  },
  {
    id: 'job-8',
    title: 'Lead Design Systems Architect',
    slug: 'lead-design-systems-architect-frontify',
    company_id: 'comp-8',
    category_id: 'cat-1',
    description: 'Frontify is looking for a Lead Design Systems Architect to orchestrate the foundational design tokens, components, and documentation that powers consistent brand building for thousands of international enterprises.',
    responsibilities: [
      'Govern multi-brand design tokens across Figma, React, and native platforms',
      'Establish accessibility guidelines and automated token linting pipelines',
      'Coach cross-functional product squads on design token governance',
    ],
    requirements: [
      '7+ years in product design and design engineering',
      'Recognized authority in Figma tokenization and atomic component structures',
      'Deep fluency with WCAG AAA accessibility standards',
    ],
    qualifications: [
      'Proven track record leading design systems for enterprise scale organizations',
    ],
    benefits: [
      '130,000 – 160,000 CHF salary',
      'Flexible Swiss or European remote hubs',
      'Comprehensive pension, wellness, and parental leave benefits',
    ],
    location: 'St. Gallen / Remote',
    city: 'St. Gallen',
    country: 'Switzerland',
    workplace_type: 'hybrid',
    employment_type: 'full-time',
    experience_level: 'lead',
    salary_min: 130000,
    salary_max: 160000,
    salary_currency: 'CHF',
    salary_period: 'yearly',
    salary_visible: true,
    application_mode: 'internal',
    status: 'published',
    is_featured: true,
    published_at: new Date(Date.now() - 9 * 86400000).toISOString(),
    created_at: new Date(Date.now() - 9 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 9 * 86400000).toISOString(),
    skills: ['Design Systems', 'Figma', 'React', 'Typography'],
  },
  {
    id: 'job-9',
    title: 'Senior Product Designer (Remote)',
    slug: 'senior-product-designer-remote-linear',
    company_id: 'comp-linear',
    category_id: 'cat-1',
    description: 'Linear is hiring a Senior Product Designer to craft workflows for high-performance product organizations. Synchronized via the Himalayas remote network.',
    responsibilities: [
      'Design features and workflows that enable high-velocity product teams to build better software',
      'Maintain extreme craft quality across micro-interactions, dark mode aesthetics, and keyboard shortcuts',
      'Contribute to Linear Design Systems with unified tokens across desktop and mobile',
    ],
    requirements: [
      '5+ years designing world-class developer tools or productivity software',
      'Proven experience shipping polished, complex web interfaces',
      'Obsessive attention to detail in visual design, typography, and interaction timing',
    ],
    qualifications: ['Distinguished portfolio of software applications with exceptional interaction polish'],
    benefits: [
      '$160,000 – $210,000 USD base salary + equity',
      '100% remote worldwide with flexible working hours',
      'Health insurance, 401(k), wellness stipends, and ergonomic workspace allowances',
    ],
    location: 'Remote Worldwide',
    city: 'San Francisco',
    country: 'United States',
    workplace_type: 'remote',
    employment_type: 'full-time',
    experience_level: 'senior',
    salary_min: 160000,
    salary_max: 210000,
    salary_currency: 'USD',
    salary_period: 'yearly',
    salary_visible: true,
    application_mode: 'external',
    external_application_url: 'https://himalayas.app/companies/linear/jobs/senior-product-designer',
    status: 'published',
    is_featured: true,
    published_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    skills: ['Figma', 'Design Systems', 'UX Research', 'Typography'],
  },
  {
    id: 'job-10',
    title: 'Remote Creative Technologist & WebGL Developer',
    slug: 'remote-creative-technologist-webgl-supabase',
    company_id: 'comp-supabase',
    category_id: 'cat-2',
    description: 'Supabase is hiring a Creative Technologist to craft interactive launch week experiences, 3D interactive graphics, and generative web experiences. Synchronized via Himalayas remote network.',
    responsibilities: [
      'Build generative 3D visualizers and interactive canvas showcases for Supabase launches',
      'Push the technical envelope with Three.js, WebGL shaders, and high-performance Web Workers',
      'Collaborate with the design team on viral developer marketing experiences',
    ],
    requirements: [
      'Extensive mastery of Three.js, GLSL, and modern TypeScript frontend stacks',
      'Track record of building Awwwards-caliber interactive web platforms',
      'Comfortable in an open-source, remote-first global engineering organization',
    ],
    qualifications: ['Portfolio of interactive WebGL / canvas experiments and live commercial web experiences'],
    benefits: [
      '$140,000 – $180,000 USD base salary + stock options',
      'Fully remote globally with home office budget and annual team summits',
      'Comprehensive healthcare and generous time off',
    ],
    location: 'Remote Worldwide',
    city: 'Singapore',
    country: 'Worldwide',
    workplace_type: 'remote',
    employment_type: 'full-time',
    experience_level: 'senior',
    salary_min: 140000,
    salary_max: 180000,
    salary_currency: 'USD',
    salary_period: 'yearly',
    salary_visible: true,
    application_mode: 'external',
    external_application_url: 'https://himalayas.app/companies/supabase/jobs/creative-technologist',
    status: 'published',
    is_featured: true,
    published_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    skills: ['Three.js / WebGL', 'React', 'Tailwind CSS', 'Motion Design'],
  },
  {
    id: 'job-11',
    title: 'Junior Web & UI Designer (Freshers Welcome)',
    slug: 'junior-web-ui-designer-freshers-welcome-webwavers',
    company_id: 'comp-4',
    category_id: 'cat-1',
    description: 'Webwavers is opening applications for creative graduates and freshers passionate about modern interactive digital design. You will receive 1-on-1 mentorship from lead art directors and contribute to award-winning websites.',
    responsibilities: [
      'Learn and build production UI components in Figma following tokenized design guidelines',
      'Assist in responsive layout checks and micro-animation prototyping',
      'Collaborate with frontend developers on design quality assurance',
    ],
    requirements: [
      '0–1 year of experience (fresh graduates with personal portfolio or coursework are encouraged to apply)',
      'Basic familiarity with Figma and core visual design fundamentals (spacing, typography, hierarchy)',
      'High curiosity, eagerness to learn, and strong design taste',
    ],
    qualifications: ['Personal design portfolio showcasing student projects, passion projects, or conceptual web redesigns'],
    benefits: [
      'Competitive starting salary €32,000 – €42,000 / year',
      'Comprehensive mentorship program by senior design leaders',
      'MacBook Pro hardware setup and dedicated learning stipend',
    ],
    location: 'Remote Worldwide',
    city: 'Berlin',
    country: 'Germany',
    workplace_type: 'remote',
    employment_type: 'full-time',
    experience_level: 'freshers',
    salary_min: 32000,
    salary_max: 42000,
    salary_currency: 'EUR',
    salary_period: 'yearly',
    salary_visible: true,
    application_mode: 'internal',
    status: 'published',
    is_featured: true,
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    skills: ['Figma', 'Typography', 'Design Systems', 'Motion Design'],
  },
];

// Preconfigured Users
const INITIAL_USERS: UserProfile[] = [
  {
    id: 'user-admin',
    email: 'admin@grailjobs.com',
    full_name: 'Alexander Wright',
    headline: 'Senior Recruitment Director & Platform Administrator',
    role: 'admin',
    account_status: 'active',
    location: 'San Francisco, CA',
    country: 'United States',
    phone: '+1 (415) 890-1234',
    professional_summary: 'Platform administrator overseeing global creative and engineering listings, talent vetting, and institutional partnerships.',
    portfolio_url: 'https://grailjobs.com',
    linkedin_url: 'https://linkedin.com/in/alexander-wright',
    created_at: new Date(Date.now() - 150 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'user-superadmin',
    email: 'superadmin@grailjobs.com',
    full_name: 'Elena Rostova',
    headline: 'Managing Director & Super Administrator',
    role: 'super_admin',
    account_status: 'active',
    location: 'Zurich',
    country: 'Switzerland',
    phone: '+41 44 210 9900',
    professional_summary: 'Super Administrator responsible for security policies, role delegation, and global system governance.',
    portfolio_url: 'https://grailjobs.com',
    linkedin_url: 'https://linkedin.com',
    created_at: new Date(Date.now() - 200 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'user-seeker',
    email: 'sarah.chen@design.co',
    full_name: 'Sarah Chen',
    headline: 'Senior UI/UX & Interactive Product Designer',
    role: 'user',
    account_status: 'active',
    location: 'San Francisco, CA',
    country: 'United States',
    phone: '+1 (510) 555-0199',
    professional_summary: 'Award-winning digital product designer specializing in high-growth direct-to-consumer eCommerce flagships, design systems, and delightful micro-interactions.',
    years_of_experience: '6+ years',
    work_experience: 'Senior Product Designer at Storetasker (2023 - Present)\nLead Interaction Designer at Loom Studio (2020 - 2023)\nUI/UX Designer at Agency One (2018 - 2020)',
    portfolio_url: 'https://sarahchen.design',
    linkedin_url: 'https://linkedin.com/in/sarahchen-design',
    created_at: new Date(Date.now() - 40 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const INITIAL_RESUMES: Resume[] = [
  {
    id: 'res-1',
    user_id: 'user-seeker',
    file_name: 'Sarah_Chen_Senior_Product_Designer_2026.pdf',
    storage_path: 'resumes/user-seeker/Sarah_Chen_Senior_Product_Designer_2026.pdf',
    file_size: 142850,
    mime_type: 'application/pdf',
    is_default: true,
    created_at: new Date(Date.now() - 20 * 86400000).toISOString(),
  },
  {
    id: 'res-2',
    user_id: 'user-seeker',
    file_name: 'Sarah_Chen_eCommerce_Portfolio_Summary.pdf',
    storage_path: 'resumes/user-seeker/Sarah_Chen_eCommerce_Portfolio_Summary.pdf',
    file_size: 204120,
    mime_type: 'application/pdf',
    is_default: false,
    created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
];

const INITIAL_APPLICATIONS: Application[] = [
  {
    id: 'app-1',
    job_id: 'job-1',
    user_id: 'user-seeker',
    resume_id: 'res-1',
    cover_letter: 'Hi Storetasker Team,\n\nI have followed your talent network closely and led redesigns for multiple Shopify Plus direct-to-consumer brands that drove 35%+ conversion lifts. My experience in atomic design tokens, micro-interactions, and checkout psychology directly aligns with what high-volume consumer brands require. Looking forward to connecting!',
    status: 'under_review',
    applied_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    status_history: [
      {
        id: 'hist-1',
        application_id: 'app-1',
        new_status: 'submitted',
        created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
      },
      {
        id: 'hist-2',
        application_id: 'app-1',
        previous_status: 'submitted',
        new_status: 'under_review',
        changed_by: 'user-admin',
        changed_by_name: 'Alexander Wright (Admin)',
        admin_note: 'Strong portfolio with verified Shopify DTC case studies. Candidate shortlisted for partner brand intro.',
        created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
      },
    ],
  },
];

const INITIAL_SAVED_JOBS: SavedJob[] = [
  {
    id: 'save-1',
    user_id: 'user-seeker',
    job_id: 'job-4',
    created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: 'save-2',
    user_id: 'user-seeker',
    job_id: 'job-7',
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
];

const INITIAL_SETTINGS: SiteSettings = {
  id: 'settings-1',
  site_name: 'GRAIL JOBS',
  hero_headline: 'Find work that moves you forward.',
  hero_subtitle: 'Discover opportunities from companies building the future. Find the right role, explore new possibilities and take your next career step.',
  seo_title: 'GRAIL JOBS — Premium Global Job Listing & Recruitment Platform',
  seo_description: 'Awwwards-inspired editorial job marketplace connecting world-class talent with leading creative agencies, design studios, and product companies.',
  contact_email: 'hello@grailjobs.com',
  twitter_url: 'https://twitter.com/awwwards',
  github_url: 'https://github.com',
  linkedin_url: 'https://linkedin.com',
  footer_text: '© 2026 GRAIL JOBS Inc. All rights reserved. Curated for world-class digital craft.',
};

// Event listener mechanism for state reactivity
type Listener = () => void;
const listeners = new Set<Listener>();

function notifyListeners() {
  listeners.forEach((listener) => {
    try {
      listener();
    } catch (e) {
      console.error(e);
    }
  });
}

// Storage helpers with JSON fallbacks
function getStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      localStorage.setItem(key, JSON.stringify(defaultValue));
      return defaultValue;
    }
    return JSON.parse(item) as T;
  } catch {
    return defaultValue;
  }
}

function setStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    notifyListeners();
  } catch (e) {
    console.error('Storage error:', e);
  }
}

// Reactive Store Implementation
export class DataStore {
  // Listen to changes
  static subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  // --- Auth & User Session ---
  static getCurrentUser(): UserProfile | null {
    return getStorage<UserProfile | null>(KEY_USER, INITIAL_USERS[2]); // Default to Sarah Chen (Job Seeker)
  }

  static setCurrentUser(user: UserProfile | null): void {
    setStorage(KEY_USER, user);
  }

  static getUsers(): UserProfile[] {
    return getStorage<UserProfile[]>(KEY_USERS, INITIAL_USERS);
  }

  static login(email: string, _password?: string): { success: boolean; user?: UserProfile; error?: string } {
    const users = this.getUsers();
    const cleanEmail = email.trim().toLowerCase();
    const found = users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (!found) {
      return { success: false, error: 'No account found with this email address.' };
    }
    if (found.account_status === 'suspended') {
      return { success: false, error: 'This account has been suspended by an administrator.' };
    }
    this.setCurrentUser(found);
    return { success: true, user: found };
  }

  static register(data: { email: string; full_name: string; headline?: string; location?: string }): {
    success: boolean;
    user?: UserProfile;
    error?: string;
  } {
    const users = this.getUsers();
    const cleanEmail = data.email.trim().toLowerCase();
    if (users.some((u) => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, error: 'An account with this email already exists.' };
    }

    // STRICT BUSINESS RULE: Public registration always creates role: 'user'
    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      email: cleanEmail,
      full_name: data.full_name,
      headline: data.headline || 'Product Designer & Creative Specialist',
      role: 'user',
      account_status: 'active',
      location: data.location || 'Global',
      country: 'United States',
      professional_summary: 'Looking for exciting new design and engineering opportunities.',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const updatedUsers = [...users, newUser];
    setStorage(KEY_USERS, updatedUsers);
    this.setCurrentUser(newUser);
    return { success: true, user: newUser };
  }

  static logout(): void {
    this.setCurrentUser(null);
  }

  static updateProfile(userId: string, updates: Partial<UserProfile>): UserProfile {
    const users = this.getUsers();
    let updatedProfile: UserProfile | null = null;
    const updatedUsers = users.map((u) => {
      if (u.id === userId) {
        // Prevent changing own role through profile update
        const safeUpdates = { ...updates };
        delete safeUpdates.role;
        updatedProfile = { ...u, ...safeUpdates, updated_at: new Date().toISOString() };
        return updatedProfile;
      }
      return u;
    });

    setStorage(KEY_USERS, updatedUsers);
    const currentUser = this.getCurrentUser();
    if (currentUser?.id === userId && updatedProfile) {
      this.setCurrentUser(updatedProfile);
    }
    return updatedProfile!;
  }

  static updateUserRole(userId: string, newRole: UserRole): boolean {
    const users = this.getUsers();
    const updated = users.map((u) => (u.id === userId ? { ...u, role: newRole, updated_at: new Date().toISOString() } : u));
    setStorage(KEY_USERS, updated);
    return true;
  }

  static updateUserStatus(userId: string, newStatus: 'active' | 'suspended'): boolean {
    const users = this.getUsers();
    const updated = users.map((u) =>
      u.id === userId ? { ...u, account_status: newStatus, updated_at: new Date().toISOString() } : u
    );
    setStorage(KEY_USERS, updated);
    return true;
  }

  // --- Companies ---
  static getCompanies(): Company[] {
    let companies = getStorage<Company[]>(KEY_COMPANIES, INITIAL_COMPANIES);
    const missingCompanies = INITIAL_COMPANIES.filter((ic) => !companies.some((c) => c.id === ic.id));
    if (missingCompanies.length > 0) {
      companies = [...companies, ...missingCompanies];
      setStorage(KEY_COMPANIES, companies);
    }
    const jobs = getStorage<Job[]>(KEY_JOBS, INITIAL_JOBS);
    return companies.map((c) => ({
      ...c,
      active_jobs_count: jobs.filter((j) => j.company_id === c.id && j.status === 'published').length,
    }));
  }

  static getCompanyBySlug(slug: string): Company | undefined {
    return this.getCompanies().find((c) => c.slug === slug);
  }

  static createCompany(data: Omit<Company, 'id' | 'created_at' | 'updated_at'>): Company {
    const companies = getStorage<Company[]>(KEY_COMPANIES, INITIAL_COMPANIES);
    const newCompany: Company = {
      ...data,
      id: `comp-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setStorage(KEY_COMPANIES, [newCompany, ...companies]);
    return newCompany;
  }

  static updateCompany(id: string, updates: Partial<Company>): Company {
    const companies = getStorage<Company[]>(KEY_COMPANIES, INITIAL_COMPANIES);
    let result: Company | null = null;
    const updated = companies.map((c) => {
      if (c.id === id) {
        result = { ...c, ...updates, updated_at: new Date().toISOString() };
        return result;
      }
      return c;
    });
    setStorage(KEY_COMPANIES, updated);
    return result!;
  }

  static deleteCompany(id: string): boolean {
    const jobs = this.getJobs();
    const hasJobs = jobs.some((j) => j.company_id === id);
    if (hasJobs) {
      throw new Error('Cannot delete company with active job postings. Reassign or delete the jobs first.');
    }
    const companies = getStorage<Company[]>(KEY_COMPANIES, INITIAL_COMPANIES);
    setStorage(KEY_COMPANIES, companies.filter((c) => c.id !== id));
    return true;
  }

  // --- Categories & Skills ---
  static getCategories(): Category[] {
    const categories = getStorage<Category[]>(KEY_CATEGORIES, INITIAL_CATEGORIES);
    const jobs = this.getJobs();
    return categories.map((cat) => ({
      ...cat,
      job_count: jobs.filter((j) => j.category_id === cat.id && j.status === 'published').length,
    }));
  }

  static createCategory(data: { name: string; slug: string; description?: string; icon?: string }): Category {
    const categories = getStorage<Category[]>(KEY_CATEGORIES, INITIAL_CATEGORIES);
    const newCat: Category = {
      ...data,
      id: `cat-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    setStorage(KEY_CATEGORIES, [...categories, newCat]);
    return newCat;
  }

  static deleteCategory(id: string): boolean {
    const jobs = this.getJobs();
    if (jobs.some((j) => j.category_id === id)) {
      throw new Error('Cannot delete category because it is currently assigned to one or more job listings.');
    }
    const categories = getStorage<Category[]>(KEY_CATEGORIES, INITIAL_CATEGORIES);
    setStorage(KEY_CATEGORIES, categories.filter((c) => c.id !== id));
    return true;
  }

  static getSkills(): Skill[] {
    return getStorage<Skill[]>(KEY_SKILLS, INITIAL_SKILLS);
  }

  static createSkill(name: string, slug?: string): Skill {
    const skills = getStorage<Skill[]>(KEY_SKILLS, INITIAL_SKILLS);
    const newSkill: Skill = {
      id: `sk-${Date.now()}`,
      name,
      slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
      created_at: new Date().toISOString(),
    };
    setStorage(KEY_SKILLS, [...skills, newSkill]);
    return newSkill;
  }

  // --- Jobs Management ---
  static getJobs(): Job[] {
    let jobs = getStorage<Job[]>(KEY_JOBS, INITIAL_JOBS);
    const missingJobs = INITIAL_JOBS.filter((ij) => !jobs.some((j) => j.id === ij.id));
    if (missingJobs.length > 0) {
      jobs = [...jobs, ...missingJobs];
      setStorage(KEY_JOBS, jobs);
    }
    const companies = this.getCompanies();
    const categories = getStorage<Category[]>(KEY_CATEGORIES, INITIAL_CATEGORIES);

    return jobs.map((job) => ({
      ...job,
      company: companies.find((c) => c.id === job.company_id),
      category: categories.find((cat) => cat.id === job.category_id),
    }));
  }

  static getJobBySlug(slug: string): Job | undefined {
    return this.getJobs().find((j) => j.slug === slug);
  }

  static createJob(data: Omit<Job, 'id' | 'created_at' | 'updated_at'>): Job {
    const jobs = getStorage<Job[]>(KEY_JOBS, INITIAL_JOBS);
    // Guarantee unique slug
    let baseSlug = data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    let finalSlug = baseSlug;
    let counter = 1;
    while (jobs.some((j) => j.slug === finalSlug)) {
      finalSlug = `${baseSlug}-${counter++}`;
    }

    const newJob: Job = {
      ...data,
      id: `job-${Date.now()}`,
      slug: finalSlug,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      published_at: data.status === 'published' ? new Date().toISOString() : undefined,
    };

    setStorage(KEY_JOBS, [newJob, ...jobs]);
    return newJob;
  }

  static updateJob(id: string, updates: Partial<Job>): Job {
    const jobs = getStorage<Job[]>(KEY_JOBS, INITIAL_JOBS);
    let updatedJob: Job | null = null;
    const updated = jobs.map((j) => {
      if (j.id === id) {
        updatedJob = {
          ...j,
          ...updates,
          updated_at: new Date().toISOString(),
          published_at: updates.status === 'published' && !j.published_at ? new Date().toISOString() : j.published_at,
        };
        return updatedJob;
      }
      return j;
    });

    setStorage(KEY_JOBS, updated);
    return updatedJob!;
  }

  static duplicateJob(id: string): Job {
    const original = this.getJobs().find((j) => j.id === id);
    if (!original) throw new Error('Job not found');

    const duplicateData: Omit<Job, 'id' | 'created_at' | 'updated_at'> = {
      ...original,
      title: `${original.title} (Copy)`,
      slug: `${original.slug}-copy`,
      status: 'draft',
      is_featured: false,
    };
    return this.createJob(duplicateData);
  }

  static deleteJob(id: string): boolean {
    const jobs = getStorage<Job[]>(KEY_JOBS, INITIAL_JOBS);
    setStorage(KEY_JOBS, jobs.filter((j) => j.id !== id));
    return true;
  }

  // --- Resumes ---
  static getUserResumes(userId: string): Resume[] {
    const resumes = getStorage<Resume[]>(KEY_RESUMES, INITIAL_RESUMES);
    return resumes.filter((r) => r.user_id === userId);
  }

  static uploadResume(data: {
    userId: string;
    fileName: string;
    fileSize: number;
    mimeType: string;
    isDefault?: boolean;
    dataUrl?: string;
  }): Resume {
    const resumes = getStorage<Resume[]>(KEY_RESUMES, INITIAL_RESUMES);
    const isFirst = resumes.filter((r) => r.user_id === data.userId).length === 0;

    const newResume: Resume = {
      id: `res-${Date.now()}`,
      user_id: data.userId,
      file_name: data.fileName,
      storage_path: `resumes/${data.userId}/${data.fileName}`,
      file_size: data.fileSize,
      mime_type: data.mimeType,
      is_default: data.isDefault ?? isFirst,
      created_at: new Date().toISOString(),
      data_url: data.dataUrl,
    };

    let updated = resumes;
    if (newResume.is_default) {
      updated = updated.map((r) => (r.user_id === data.userId ? { ...r, is_default: false } : r));
    }

    setStorage(KEY_RESUMES, [newResume, ...updated]);
    return newResume;
  }

  static setDefaultResume(resumeId: string, userId: string): void {
    const resumes = getStorage<Resume[]>(KEY_RESUMES, INITIAL_RESUMES);
    const updated = resumes.map((r) => {
      if (r.user_id === userId) {
        return { ...r, is_default: r.id === resumeId };
      }
      return r;
    });
    setStorage(KEY_RESUMES, updated);
  }

  static deleteResume(resumeId: string): void {
    const resumes = getStorage<Resume[]>(KEY_RESUMES, INITIAL_RESUMES);
    setStorage(KEY_RESUMES, resumes.filter((r) => r.id !== resumeId));
  }

  // --- Applications ---
  static getApplications(): Application[] {
    const apps = getStorage<Application[]>(KEY_APPLICATIONS, INITIAL_APPLICATIONS);
    const jobs = this.getJobs();
    const users = this.getUsers();
    const resumes = getStorage<Resume[]>(KEY_RESUMES, INITIAL_RESUMES);

    return apps.map((app) => ({
      ...app,
      job: jobs.find((j) => j.id === app.job_id),
      user: users.find((u) => u.id === app.user_id),
      resume: resumes.find((r) => r.id === app.resume_id),
    }));
  }

  static getUserApplications(userId: string): Application[] {
    return this.getApplications().filter((app) => app.user_id === userId);
  }

  static hasUserApplied(jobId: string, userId: string): boolean {
    const apps = getStorage<Application[]>(KEY_APPLICATIONS, INITIAL_APPLICATIONS);
    return apps.some((app) => app.job_id === jobId && app.user_id === userId);
  }

  static submitApplication(data: {
    jobId: string;
    userId: string;
    resumeId?: string;
    coverLetter?: string;
  }): Application {
    if (this.hasUserApplied(data.jobId, data.userId)) {
      throw new Error('You have already submitted an application for this position.');
    }

    const apps = getStorage<Application[]>(KEY_APPLICATIONS, INITIAL_APPLICATIONS);
    const newApp: Application = {
      id: `app-${Date.now()}`,
      job_id: data.jobId,
      user_id: data.userId,
      resume_id: data.resumeId,
      cover_letter: data.coverLetter,
      status: 'submitted',
      applied_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      status_history: [
        {
          id: `hist-${Date.now()}`,
          application_id: `app-${Date.now()}`,
          new_status: 'submitted',
          created_at: new Date().toISOString(),
        },
      ],
    };

    setStorage(KEY_APPLICATIONS, [newApp, ...apps]);
    return newApp;
  }

  static updateApplicationStatus(
    appId: string,
    newStatus: ApplicationStatus,
    adminNote?: string,
    changedByName?: string
  ): Application {
    const apps = getStorage<Application[]>(KEY_APPLICATIONS, INITIAL_APPLICATIONS);
    let updatedApp: Application | null = null;

    const updated = apps.map((app) => {
      if (app.id === appId) {
        const historyEntry = {
          id: `hist-${Date.now()}`,
          application_id: app.id,
          previous_status: app.status,
          new_status: newStatus,
          changed_by_name: changedByName || 'Administrator',
          admin_note: adminNote,
          created_at: new Date().toISOString(),
        };

        updatedApp = {
          ...app,
          status: newStatus,
          updated_at: new Date().toISOString(),
          status_history: [...(app.status_history || []), historyEntry],
        };
        return updatedApp;
      }
      return app;
    });

    setStorage(KEY_APPLICATIONS, updated);
    return updatedApp!;
  }

  // --- Saved Jobs ---
  static getSavedJobs(userId: string): SavedJob[] {
    const saved = getStorage<SavedJob[]>(KEY_SAVED_JOBS, INITIAL_SAVED_JOBS);
    const jobs = this.getJobs();
    return saved
      .filter((s) => s.user_id === userId)
      .map((s) => ({
        ...s,
        job: jobs.find((j) => j.id === s.job_id),
      }))
      .filter((s) => Boolean(s.job));
  }

  static isJobSaved(jobId: string, userId: string): boolean {
    const saved = getStorage<SavedJob[]>(KEY_SAVED_JOBS, INITIAL_SAVED_JOBS);
    return saved.some((s) => s.job_id === jobId && s.user_id === userId);
  }

  static toggleSaveJob(jobId: string, userId: string): boolean {
    const saved = getStorage<SavedJob[]>(KEY_SAVED_JOBS, INITIAL_SAVED_JOBS);
    const exists = saved.some((s) => s.job_id === jobId && s.user_id === userId);

    if (exists) {
      setStorage(
        KEY_SAVED_JOBS,
        saved.filter((s) => !(s.job_id === jobId && s.user_id === userId))
      );
      return false; // Removed
    } else {
      const newSaved: SavedJob = {
        id: `save-${Date.now()}`,
        user_id: userId,
        job_id: jobId,
        created_at: new Date().toISOString(),
      };
      setStorage(KEY_SAVED_JOBS, [newSaved, ...saved]);
      return true; // Added
    }
  }

  // --- Contact Messages ---
  static submitContactMessage(data: { name: string; email: string; subject: string; message: string }): ContactMessage {
    const messages = getStorage<ContactMessage[]>(KEY_MESSAGES, []);
    const newMsg: ContactMessage = {
      id: `msg-${Date.now()}`,
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message,
      status: 'unread',
      created_at: new Date().toISOString(),
    };
    setStorage(KEY_MESSAGES, [newMsg, ...messages]);
    return newMsg;
  }

  static getContactMessages(): ContactMessage[] {
    return getStorage<ContactMessage[]>(KEY_MESSAGES, [
      {
        id: 'msg-seed-1',
        name: 'Julian Vance',
        email: 'julian@vancestudio.design',
        subject: 'Partnership Inquiry regarding Agency Tier Listings',
        message: 'Hello, our agency in Zurich is interested in featuring multiple senior product roles on Grail Jobs. Could you connect us with your editorial team?',
        status: 'unread',
        created_at: new Date(Date.now() - 24 * 3600000).toISOString(),
      },
    ]);
  }

  static updateMessageStatus(id: string, status: 'unread' | 'read' | 'resolved'): void {
    const messages = this.getContactMessages();
    setStorage(
      KEY_MESSAGES,
      messages.map((m) => (m.id === id ? { ...m, status } : m))
    );
  }

  static deleteMessage(id: string): void {
    const messages = this.getContactMessages();
    setStorage(
      KEY_MESSAGES,
      messages.filter((m) => m.id !== id)
    );
  }

  // --- Newsletter ---
  static subscribeNewsletter(email: string): { success: boolean; message: string } {
    const cleanEmail = email.trim().toLowerCase();
    const subscribers = getStorage<NewsletterSubscriber[]>(KEY_SUBSCRIBERS, [
      { id: 'sub-1', email: 'hello@creatives.com', status: 'active', subscribed_at: new Date().toISOString() },
    ]);

    if (subscribers.some((s) => s.email.toLowerCase() === cleanEmail && s.status === 'active')) {
      return { success: true, message: 'You are already subscribed to the Grail Jobs editorial newsletter!' };
    }

    const newSub: NewsletterSubscriber = {
      id: `sub-${Date.now()}`,
      email: cleanEmail,
      status: 'active',
      subscribed_at: new Date().toISOString(),
    };

    setStorage(KEY_SUBSCRIBERS, [newSub, ...subscribers]);
    return { success: true, message: 'Welcome to the Grail Jobs newsletter. Check your inbox every Tuesday.' };
  }

  static getNewsletterSubscribers(): NewsletterSubscriber[] {
    return getStorage<NewsletterSubscriber[]>(KEY_SUBSCRIBERS, [
      { id: 'sub-1', email: 'hello@creatives.com', status: 'active', subscribed_at: new Date().toISOString() },
      { id: 'sub-2', email: 'director@atelierdesign.fr', status: 'active', subscribed_at: new Date(Date.now() - 86400000).toISOString() },
    ]);
  }

  // --- Site Settings ---
  static getSiteSettings(): SiteSettings {
    return getStorage<SiteSettings>(KEY_SETTINGS, INITIAL_SETTINGS);
  }

  static updateSiteSettings(settings: Partial<SiteSettings>): SiteSettings {
    const current = this.getSiteSettings();
    const updated = { ...current, ...settings };
    setStorage(KEY_SETTINGS, updated);
    return updated;
  }
}
