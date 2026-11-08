import { Job, Company, WorkplaceType, EmploymentType, ExperienceLevel } from '../types';
import { DataStore } from './store';

export interface HimalayasRawJob {
  title: string;
  excerpt?: string;
  description?: string;
  companyName: string;
  companySlug: string;
  companyLogo?: string;
  employmentType?: string;
  minSalary?: number | null;
  maxSalary?: number | null;
  salaryPeriod?: string;
  currency?: string;
  seniority?: string[];
  locationRestrictions?: string[];
  timezoneRestrictions?: number[];
  categories?: string[];
  parentCategories?: string[];
  applicationLink?: string;
  pubDate?: number;
  guid?: string;
}

export interface HimalayasApiResponse {
  totalCount: number;
  jobs: HimalayasRawJob[];
  nextCursor?: string;
}

export class HimalayasService {
  private static baseUrl = '/api/himalayas/jobs/api';

  /**
   * Fetch live jobs from the Himalayas Remote Jobs API with multi-page stream support
   */
  static async fetchJobs(params: {
    limit?: number;
    cursor?: string;
    pages?: number;
  } = {}): Promise<HimalayasApiResponse> {
    try {
      const allJobs: HimalayasRawJob[] = [];
      let currentCursor = params.cursor;
      let totalCount = 0;
      const pagesToFetch = params.pages ?? 4; // Fetch 4 pages (~80 live jobs) by default for comprehensive filter matches

      for (let p = 0; p < pagesToFetch; p++) {
        const url = new URL(this.baseUrl, window.location.origin);
        url.searchParams.set('limit', String(params.limit || 20));
        if (currentCursor) url.searchParams.set('cursor', currentCursor);

        const response = await fetch(url.toString(), {
          headers: {
            Accept: 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Himalayas API responded with status ${response.status}`);
        }

        const data = await response.json();
        totalCount = data.totalCount || totalCount;
        if (data.jobs && Array.isArray(data.jobs)) {
          allJobs.push(...data.jobs);
        }
        currentCursor = data.nextCursor;
        if (!currentCursor) break;
      }

      return {
        totalCount: totalCount || allJobs.length,
        jobs: allJobs,
        nextCursor: currentCursor,
      };
    } catch (error) {
      console.warn('Failed to fetch from Himalayas proxy, falling back to local simulation:', error);
      return {
        totalCount: 0,
        jobs: [],
      };
    }
  }

  /**
   * Convert a raw Himalayas job into our system's Job & Company schema and persist it
   */
  static importJob(raw: HimalayasRawJob): { job: Job; company: Company } {
    // 1. Find or create company
    const existingCompanies = DataStore.getCompanies();
    let company = existingCompanies.find(
      (c) => c.slug === raw.companySlug || c.name.toLowerCase() === raw.companyName.toLowerCase()
    );

    if (!company) {
      company = DataStore.createCompany({
        name: raw.companyName,
        slug: raw.companySlug || raw.companyName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        logo_url: raw.companyLogo || undefined,
        description: `${raw.companyName} is a remote-first organization hiring through the Himalayas talent network.`,
        website: raw.guid ? new URL(raw.guid).origin : 'https://himalayas.app',
        industry: raw.categories?.[0] || 'Software & Digital Products',
        company_size: '50-200',
        headquarters: raw.locationRestrictions?.[0] || 'Remote Worldwide',
        country: raw.locationRestrictions?.[0] || 'United States',
        city: 'Remote',
      });
    }

    // 2. Map Employment Type
    let employmentType: EmploymentType = 'full-time';
    const rawType = (raw.employmentType || '').toLowerCase();
    if (rawType.includes('contract')) employmentType = 'contract';
    else if (rawType.includes('freelance')) employmentType = 'freelance';
    else if (rawType.includes('part')) employmentType = 'part-time';
    else if (rawType.includes('intern')) employmentType = 'internship';

    // 3. Map Experience Level
    let experienceLevel: ExperienceLevel = 'mid';
    const seniority = (raw.seniority?.[0] || '').toLowerCase();
    if (seniority.includes('senior')) experienceLevel = 'senior';
    else if (seniority.includes('fresher') || seniority.includes('intern') || seniority.includes('graduate')) experienceLevel = 'freshers';
    else if (seniority.includes('entry') || seniority.includes('junior')) experienceLevel = 'entry';
    else if (seniority.includes('lead') || seniority.includes('principal')) experienceLevel = 'lead';
    else if (seniority.includes('director') || seniority.includes('executive')) experienceLevel = 'executive';

    // 4. Clean HTML description if present
    const cleanDescription = (raw.excerpt || raw.description || '')
      .replace(/<[^>]*>?/gm, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    // 5. Create Job Record
    const location = raw.locationRestrictions?.length
      ? `Remote (${raw.locationRestrictions.slice(0, 3).join(', ')})`
      : 'Remote Worldwide';

    const newJob = DataStore.createJob({
      title: raw.title,
      slug: `${raw.companySlug}-${raw.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`,
      company_id: company.id,
      description: cleanDescription || `Remote ${raw.title} opportunity at ${raw.companyName}.`,
      responsibilities: [
        'Deliver high-quality work aligned with team OKRs and sprint deliverables',
        'Collaborate across distributed timezones using asynchronous workflows',
        'Maintain clear documentation and technical standards',
      ],
      requirements: [
        'Demonstrated professional experience in relevant discipline',
        'Strong asynchronous communication and self-direction',
        'Comfort working within a fully remote, international engineering team',
      ],
      qualifications: ['Proven track record in digital products or modern web applications'],
      benefits: [
        '100% remote working flexibility',
        'Competitive compensation via Himalayas platform',
        'Global health and workstation allowances where applicable',
      ],
      location,
      country: raw.locationRestrictions?.[0] || 'United States',
      workplace_type: 'remote',
      employment_type: employmentType,
      experience_level: experienceLevel,
      salary_min: raw.minSalary || undefined,
      salary_max: raw.maxSalary || undefined,
      salary_currency: raw.currency || 'USD',
      salary_period: (raw.salaryPeriod as any) || 'yearly',
      salary_visible: Boolean(raw.minSalary),
      application_mode: 'external',
      external_application_url: raw.applicationLink || raw.guid || `https://himalayas.app/companies/${raw.companySlug}/jobs/${raw.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
      status: 'published',
      is_featured: false,
      skills: raw.categories || ['Remote', 'Engineering'],
    });

    return { job: newJob, company };
  }
}
