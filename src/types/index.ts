export type UserRole = 'user' | 'admin' | 'super_admin';
export type AccountStatus = 'active' | 'suspended' | 'pending_deletion';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  headline?: string;
  phone?: string;
  location?: string;
  country?: string;
  professional_summary?: string;
  years_of_experience?: string;
  work_experience?: string;
  portfolio_url?: string;
  linkedin_url?: string;
  role: UserRole;
  account_status: AccountStatus;
  created_at: string;
  updated_at: string;
}

export interface Company {
  id: string;
  name: string;
  slug: string;
  logo_url?: string;
  cover_url?: string;
  description: string;
  website: string;
  industry: string;
  company_size: string;
  headquarters: string;
  country: string;
  city: string;
  social_links?: Record<string, string>;
  created_at: string;
  updated_at: string;
  active_jobs_count?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  created_at?: string;
  job_count?: number;
}

export interface Skill {
  id: string;
  name: string;
  slug: string;
  created_at?: string;
}

export type WorkplaceType = 'remote' | 'hybrid' | 'on-site';
export type EmploymentType = 'full-time' | 'part-time' | 'contract' | 'freelance' | 'internship';
export type ExperienceLevel = 'entry' | 'mid' | 'senior' | 'lead' | 'executive';
export type SalaryPeriod = 'hourly' | 'monthly' | 'yearly';
export type JobStatus = 'draft' | 'published' | 'expired' | 'filled' | 'archived';
export type ApplicationMode = 'internal' | 'external';

export interface Job {
  id: string;
  title: string;
  slug: string;
  company_id: string;
  company?: Company;
  category_id?: string;
  category?: Category;
  description: string;
  responsibilities: string[];
  requirements: string[];
  qualifications: string[];
  benefits: string[];
  location: string;
  city?: string;
  country: string;
  workplace_type: WorkplaceType;
  employment_type: EmploymentType;
  experience_level: ExperienceLevel;
  salary_min?: number;
  salary_max?: number;
  salary_currency: string;
  salary_period: SalaryPeriod;
  salary_visible: boolean;
  application_mode: ApplicationMode;
  external_application_url?: string;
  application_deadline?: string;
  status: JobStatus;
  is_featured: boolean;
  published_at?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
  skills?: string[];
}

export interface Resume {
  id: string;
  user_id: string;
  file_name: string;
  storage_path: string;
  file_size: number;
  mime_type: string;
  is_default: boolean;
  created_at: string;
  data_url?: string;
}

export type ApplicationStatus =
  | 'submitted'
  | 'under_review'
  | 'shortlisted'
  | 'interview'
  | 'rejected'
  | 'hired'
  | 'withdrawn';

export interface ApplicationStatusHistory {
  id: string;
  application_id: string;
  previous_status?: ApplicationStatus;
  new_status: ApplicationStatus;
  changed_by?: string;
  changed_by_name?: string;
  admin_note?: string;
  created_at: string;
}

export interface Application {
  id: string;
  job_id: string;
  job?: Job;
  user_id: string;
  user?: UserProfile;
  resume_id?: string;
  resume?: Resume;
  cover_letter?: string;
  status: ApplicationStatus;
  applied_at: string;
  updated_at: string;
  status_history?: ApplicationStatusHistory[];
}

export interface SavedJob {
  id: string;
  user_id: string;
  job_id: string;
  job?: Job;
  created_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'resolved';
  created_at: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  status: 'active' | 'unsubscribed';
  subscribed_at: string;
}

export interface SiteSettings {
  id: string;
  site_name: string;
  hero_headline: string;
  hero_subtitle: string;
  seo_title: string;
  seo_description: string;
  contact_email: string;
  twitter_url?: string;
  github_url?: string;
  linkedin_url?: string;
  footer_text: string;
}
