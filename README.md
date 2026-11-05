# GRAIL JOBS — Premium Global Job Listing & Recruitment Platform

An Awwwards-inspired, editorial global recruitment platform engineered for world-class design studios, creative technologists, and digital product leaders.

---

## 1. Architectural Highlights

- **Awwwards Editorial Aesthetic**: Typography hierarchy with Plus Jakarta Sans, Outfit, and JetBrains Mono, tight letter-spacing, asymmetric grids, minimal hairline borders, and zero-pill metadata design.
- **Strict Role-Based Publishing**: Only authorized administrators can create, edit, feature, publish, unpublish, and archive jobs. Regular candidates cannot publish jobs.
- **Public Job Marketplace**:
  - Global Search with debouncing, URL parameter synchronization, and multi-criteria filters (Category, Employment Type, Country, Remote/Hybrid/On-site, Experience Level, Compensation).
  - Detailed Job Dossier with structured metadata grid, responsibilities, requirements, benefits, and company overview.
  - Interactive Application Modal with resume selection, new resume upload, duplicate prevention, and optional cover notes.
  - Studio directory with company profiles and active job listings.
- **Candidate Dashboard (`/dashboard`)**:
  - Dossier Completeness Meter.
  - Application Tracking with real-time status history (`Submitted`, `Under Review`, `Shortlisted`, `Interview`, `Hired`, `Rejected`) and internal admin feedback notes.
  - Bookmarked / Saved Jobs management.
  - Private Resumes vault with PDF/DOCX file validation, default selection, and metadata inspection.
  - Security settings with password updates and account deletion workflow.
- **Protected Administrator Portal (`/admin`)**:
  - Metric KPIs: Active published listings, drafts, expired counts, total candidate applications, and active studio count.
  - Complete Job Management (Create, Edit, Delete, Duplicate, Toggle Publish, Toggle Featured, Mark as Filled).
  - Application Review & Status Pipeline with custom administrator notes and status history tracking.
  - CSV Export for filtered candidate applications and newsletter subscribers.
  - Studio / Company CRUD with branding management.
  - User Moderation (Account suspension and reactivation).
  - Taxonomy and Skills Management with safe deletion checks.
  - Inbound Contact Message triage.
  - Super Administrator Governance (Admin role delegation and promotion).

---

## 2. Pre-Configured Demo Accounts

For evaluation and testing, the application comes preloaded with reactive sessions:

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Job Seeker** | `sarah.chen@design.co` | `password123` | Candidate Dashboard, Applications, Saved Jobs |
| **Administrator** | `admin@grailjobs.com` | `admin123` | Full Admin Portal, Job CRUD, Application Review |
| **Super Admin** | `superadmin@grailjobs.com` | `admin123` | Root Authority, Role Delegation, System Governance |

*Note: You can switch between demo roles instantaneously using the "Demo Role" dropdown in the top announcement bar or via 1-click on the `/login` screen.*

---

## 3. Technology Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, React Router 7, Motion, Lucide Icons.
- **Data & Storage Layer**: Supabase PostgreSQL client with full offline/local storage fallback and sample datasets.
- **Database Architecture**: PostgreSQL schema in `supabase/migrations/20261104000000_init_schema.sql` with Row Level Security (RLS) policies and indexes.

---

## 4. Supabase Setup & Production Deployment

To connect Grail Jobs directly to a live Supabase project:

1. Create a project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** in the Supabase Dashboard and execute:
   - `supabase/migrations/20261104000000_init_schema.sql` (Creates tables, foreign keys, RLS policies, and indexes)
   - `supabase/seed.sql` (Seeds initial studios and job listings)
3. Set your environment variables in `.env`:
   ```bash
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-public-key
   ```
4. Build for production:
   ```bash
   npm run build
   ```
