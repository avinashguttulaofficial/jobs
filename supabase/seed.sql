-- Seed Data for GRAIL JOBS Platform
-- Matches the companies, design aesthetics, and positions shown in the user's reference screenshots

-- Insert Categories
INSERT INTO public.categories (id, name, slug, description, icon) VALUES
('c0000001-0000-0000-0000-000000000001', 'UI/UX Design', 'ui-ux-design', 'Digital product design, user interface systems, and web application design.', 'Layout'),
('c0000002-0000-0000-0000-000000000002', 'Web & Frontend', 'web-frontend', 'Creative web development, WebGL, React, and modern interactive engineering.', 'Code'),
('c0000003-0000-0000-0000-000000000003', 'Motion & 3D', 'motion-3d', 'Lottie animation, 3D interaction, Three.js, and kinetic art direction.', 'Sparkles'),
('c0000004-0000-0000-0000-000000000004', 'Art Direction', 'art-direction', 'Creative leadership, brand identity systems, and visual storytelling.', 'Compass'),
('c0000005-0000-0000-0000-000000000005', 'Design Systems', 'design-systems', 'Component architecture, multi-brand design tokens, and accessibility.', 'Layers')
ON CONFLICT (slug) DO NOTHING;

-- Insert Skills
INSERT INTO public.skills (id, name, slug) VALUES
('s0000001-0000-0000-0000-000000000001', 'Figma', 'figma'),
('s0000002-0000-0000-0000-000000000002', 'Design Systems', 'design-systems'),
('s0000003-0000-0000-0000-000000000003', 'React', 'react'),
('s0000004-0000-0000-0000-000000000004', 'Tailwind CSS', 'tailwind-css'),
('s0000005-0000-0000-0000-000000000005', 'Lottie & Motion', 'lottie-motion'),
('s0000006-0000-0000-0000-000000000006', 'Three.js / WebGL', 'threejs-webgl'),
('s0000007-0000-0000-0000-000000000007', 'Shopify Plus', 'shopify-plus'),
('s0000008-0000-0000-0000-000000000008', 'Typography', 'typography'),
('s0000009-0000-0000-0000-000000000009', 'User Research', 'user-research')
ON CONFLICT (slug) DO NOTHING;

-- Insert Companies (inspired by screenshot 4 & 5)
INSERT INTO public.companies (id, name, slug, logo_url, description, website, industry, company_size, headquarters, country, city) VALUES
('a0000001-0000-0000-0000-000000000001', 'Storetasker', 'storetasker', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&auto=format&fit=crop&q=80', 'The leading curated freelance talent platform for high-growth direct-to-consumer eCommerce brands.', 'https://storetasker.com', 'Design & Technology', '51-200', 'New York, NY', 'United States', 'New York'),
('a0000002-0000-0000-0000-000000000002', 'Dagobert', 'dagobert', 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=128&auto=format&fit=crop&q=80', 'An independent digital creative communications agency accompanying leading global brands in creative & brand strategies.', 'https://dagobert.com', 'Creative Agency', '50-100', 'Paris', 'France', 'Paris'),
('a0000003-0000-0000-0000-000000000003', 'Limesharp', 'limesharp', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=128&auto=format&fit=crop&q=80', 'An award-winning, creatively led digital commerce agency crafting bespoke solutions for luxury, fashion, and lifestyle brands.', 'https://limesharp.net', 'eCommerce & Design', '20-50', 'London', 'United Kingdom', 'London'),
('a0000004-0000-0000-0000-000000000004', 'Webwavers', 'webwavers', 'https://images.unsplash.com/photo-1534972195531-a756b1126975?w=128&auto=format&fit=crop&q=80', 'Specialist web design agency delivering bespoke digital art direction, high-octane 3D, and Lottie animations.', 'https://webwavers.de', 'Motion & Web', '10-25', 'Berlin', 'Germany', 'Berlin'),
('a0000005-0000-0000-0000-000000000005', 'Push Refresh', 'push-refresh', 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=128&auto=format&fit=crop&q=80', 'Digital agency taking rough ideas, wireframes, and turning them into exceptional, award-winning web applications.', 'https://pushrefresh.com', 'Digital Studio', '10-20', 'Austin, TX', 'United States', 'Austin'),
('a0000006-0000-0000-0000-000000000006', 'on/Sight', 'on-sight', 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=128&auto=format&fit=crop&q=80', 'A full-service eCommerce web development & design agency building high-volume storefronts.', 'https://onsight.co', 'eCommerce', '25-50', 'Denver, CO', 'United States', 'Denver'),
('a0000007-0000-0000-0000-000000000007', 'Anchour', 'anchour', 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=128&auto=format&fit=crop&q=80', 'A brand transformation and experience studio engineering digital flagships that shape markets.', 'https://anchour.com', 'Branding & Design', '30-60', 'Portland, ME', 'United States', 'Portland'),
('a0000008-0000-0000-0000-000000000008', 'Frontify', 'frontify', 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?w=128&auto=format&fit=crop&q=80', 'The brand-building platform connecting everything and everyone essential to building consistent brands.', 'https://frontify.com', 'SaaS Platform', '200-500', 'St. Gallen', 'Switzerland', 'St. Gallen')
ON CONFLICT (slug) DO NOTHING;

-- Insert Published Jobs (matches screenshot 4, 5, 6, 7)
INSERT INTO public.jobs (
    id, title, slug, company_id, category_id, description, responsibilities, requirements, qualifications, benefits,
    location, city, country, workplace_type, employment_type, experience_level,
    salary_min, salary_max, salary_currency, salary_period, salary_visible,
    application_mode, status, is_featured, published_at
) VALUES
(
    'j0000001-0000-0000-0000-000000000001',
    'Senior UI/UX Designer, eCommerce',
    'senior-ui-ux-designer-ecommerce-storetasker',
    'a0000001-0000-0000-0000-000000000001',
    'c0000001-0000-0000-0000-000000000001',
    'Storetasker is the leading talent platform for Consumer Brands - changing how brands hire exceptional freelancers and agencies across development, design, marketing, and operations. The platform has supported thousands of fractional hires for brands like Alo Yoga, SoundCloud, and DraftKings.',
    ARRAY['Design end-to-end user journeys for high-conversion Shopify storefronts', 'Deliver Figma design systems with strict tokens and component states', 'Collaborate directly with founders and senior engineers on conversion optimization'],
    ARRAY['5+ years of UI/UX design experience with direct focus on eCommerce', 'Mastery in Figma, component auto-layouts, and prototyping', 'Deep understanding of mobile-first commerce, micro-interactions, and checkout psychology'],
    ARRAY['Bachelor or equivalent industry track record in Visual / Interaction Design', 'Portfolio showcasing shipped direct-to-consumer digital products'],
    ARRAY['Competitive hourly rate ($90 - $175 / hour)', 'Fully remote and asynchronous schedule', 'Direct access to high-profile brand client network'],
    'Remote', 'New York', 'United States', 'remote', 'freelance', 'senior',
    90, 175, 'USD', 'hourly', true,
    'internal', 'published', true, timezone('utc'::text, now()) - interval '2 days'
),
(
    'j0000002-0000-0000-0000-000000000002',
    'Designer / Directeur artistique web (UI/UX)',
    'designer-directeur-artistique-web-dagobert',
    'a0000002-0000-0000-0000-000000000002',
    'c0000004-0000-0000-0000-000000000004',
    'Qui sommes-nous ? Dagobert est une agence de communication digitale indépendante qui accompagne les marques dans la création de stratégies de communication créatives, performantes et engagées. De la réflexion stratégique à la production de contenus de pointe.',
    ARRAY['Concevoir la direction artistique globale des expériences digitales', 'Guider les équipes UX et juniors sur les standards Awwwards', 'Présenter les intentions créatives aux marques partenaires'],
    ARRAY['Solide culture visuelle et typographique contemporaine', 'Maîtrise complète de Figma, After Effects et suites créatives', 'Expérience reconnue en agence interactive'],
    ARRAY['Diplôme en design graphique ou direction artistique', 'Portfolio primé ou références de réalisations web reconnues'],
    ARRAY['Cadre de travail stimulant au coeur de Paris', 'Mutuelle santé premium et tickets restaurant', 'Équipement Apple sur mesure'],
    'Paris / Hybrid', 'Paris', 'France', 'hybrid', 'full-time', 'senior',
    65000, 85000, 'EUR', 'yearly', true,
    'internal', 'published', true, timezone('utc'::text, now()) - interval '4 days'
),
(
    'j0000003-0000-0000-0000-000000000003',
    'Junior UI/UX Designer',
    'junior-ui-ux-designer-limesharp',
    'a0000003-0000-0000-0000-000000000003',
    'c0000001-0000-0000-0000-000000000001',
    'Limesharp is an award-winning, creatively led digital commerce agency creating bespoke solutions for fashion, beauty and lifestyle brands. We are a global team of designers, developers, strategy experts, and project managers on a mission to elevate retail experiences.',
    ARRAY['Support senior designers in wireframing and responsive component creation', 'Create interactive prototypes and participate in weekly design reviews', 'Maintain client design token libraries in Figma'],
    ARRAY['1-2 years experience in digital design or relevant creative portfolio', 'Proficiency in Figma and interactive wireframing', 'Eye for typographic details and grid alignment'],
    ARRAY['Relevant coursework or degree in Graphic / Interaction Design', 'Curiosity and passion for modern web aesthetics'],
    ARRAY['Mentorship program with award-winning creative directors', 'Flexible hybrid working model', 'Annual learning and conference budget'],
    'London / Hybrid', 'London', 'United Kingdom', 'hybrid', 'full-time', 'entry',
    35000, 45000, 'GBP', 'yearly', true,
    'internal', 'published', false, timezone('utc'::text, now()) - interval '7 days'
),
(
    'j0000004-0000-0000-0000-000000000004',
    'Lottie Hero Animation from Figma – Urgent',
    'lottie-hero-animation-from-figma-webwavers',
    'a0000004-0000-0000-0000-000000000004',
    'c0000003-0000-0000-0000-000000000003',
    'Were a web design agency and need a senior motion designer to build a high-performance Lottie animation for an award-winning website hero section. All screens are completely finished in Figma—were looking for pure animation craft to bring the hero to life.',
    ARRAY['Transform completed static Figma artboards into buttery 60fps animations', 'Export and optimize JSON Lottie files for sub-200kb asset delivery', 'Coordinate with frontend engineers on scroll-driven trigger points'],
    ARRAY['Mastery of Adobe After Effects and Bodymovin / LottieFiles workflow', 'Deep experience in web performance optimization for motion assets', 'Ability to meet tight sprint turnaround times'],
    ARRAY['Exceptional motion reel demonstrating interactive web kinetic work'],
    ARRAY['Immediate project start', 'Fixed milestone payment with rush bonus', 'Potential for ongoing retainer engagements'],
    'Remote', 'Berlin', 'Germany', 'remote', 'contract', 'senior',
    4000, 7500, 'EUR', 'monthly', true,
    'internal', 'published', true, timezone('utc'::text, now()) - interval '1 day'
),
(
    'j0000005-0000-0000-0000-000000000005',
    'Visual Designer (Contract to Hire)',
    'visual-designer-contract-to-hire-push-refresh',
    'a0000005-0000-0000-0000-000000000005',
    'c0000001-0000-0000-0000-000000000001',
    'Push Refresh is looking for a visual designer who can take a rough idea, a wireframe, or a conversation and turn it into something exceptional. We design and build websites and digital products for a range of visionary clients.',
    ARRAY['Craft bespoke visual concepts for early-stage startup launches', 'Produce distinctive icon sets, layouts, and interactive style guides', 'Collaborate with frontend engineers during delivery sprints'],
    ARRAY['3+ years visual design experience with contemporary agency aesthetic', 'Flawless typography, whitespace orchestration, and color restraint', 'Fluent in Figma and rapid visual prototyping'],
    ARRAY['Proven portfolio showcasing modern web interfaces'],
    ARRAY['Path to full-time staff role', 'Fully remote environment with flexible hours', 'Home workstation stipend'],
    'Remote', 'Austin', 'United States', 'remote', 'contract', 'mid',
    80000, 110000, 'USD', 'yearly', true,
    'internal', 'published', false, timezone('utc'::text, now()) - interval '10 days'
),
(
    'j0000006-0000-0000-0000-000000000006',
    'eCommerce Web Designer',
    'ecommerce-web-designer-on-sight',
    'a0000006-0000-0000-0000-000000000006',
    'c0000001-0000-0000-0000-000000000001',
    'About on/Sight: on/Sight is a full-service eCommerce web development and design agency based in Colorado. We design and build high-volume solutions for stores of all shapes and sizes, focusing on high-volume direct-to-consumer brands on Shopify.',
    ARRAY['Design full eCommerce purchase flows, PDPs, and category discovery grids', 'Produce responsive landing pages with high conversion rigor', 'Conduct competitor benchmarking and UX auditing'],
    ARRAY['Strong eCommerce UI experience with proven Shopify ecosystem knowledge', 'Proficiency in Figma and Adobe creative tools', 'Understanding of web accessibility and mobile viewport constraints'],
    ARRAY['Demonstrable DTC store projects in live production'],
    ARRAY['Comprehensive health, dental, and vision insurance', 'Remote work flexibility', 'Generous 401(k) matching program'],
    'Remote', 'Denver', 'United States', 'remote', 'full-time', 'mid',
    85000, 120000, 'USD', 'yearly', true,
    'internal', 'published', false, timezone('utc'::text, now()) - interval '14 days'
)
ON CONFLICT (slug) DO NOTHING;

-- Map Job Skills
INSERT INTO public.job_skills (job_id, skill_id) VALUES
('j0000001-0000-0000-0000-000000000001', 's0000001-0000-0000-0000-000000000001'),
('j0000001-0000-0000-0000-000000000001', 's0000002-0000-0000-0000-000000000002'),
('j0000001-0000-0000-0000-000000000001', 's0000007-0000-0000-0000-000000000007'),
('j0000004-0000-0000-0000-000000000004', 's0000005-0000-0000-0000-000000000005')
ON CONFLICT DO NOTHING;
