import React from 'react';
import { BrowserRouter, Routes, Route, Outlet, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { FloatingDock } from './components/layout/FloatingDock';

// Public Pages
import { HomePage } from './pages/public/HomePage';
import { JobsPage } from './pages/public/JobsPage';
import { JobDetailPage } from './pages/public/JobDetailPage';
import { CompaniesPage } from './pages/public/CompaniesPage';
import { CompanyDetailPage } from './pages/public/CompanyDetailPage';
import { ResourcesPage } from './pages/public/ResourcesPage';
import { AboutPage } from './pages/public/AboutPage';
import { ContactPage } from './pages/public/ContactPage';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';

// Dashboard Pages
import { DashboardLayout } from './pages/dashboard/DashboardLayout';
import { OverviewTab } from './pages/dashboard/OverviewTab';
import { ProfileTab } from './pages/dashboard/ProfileTab';
import { ApplicationsTab } from './pages/dashboard/ApplicationsTab';
import { SavedJobsTab } from './pages/dashboard/SavedJobsTab';
import { ResumesTab } from './pages/dashboard/ResumesTab';
import { SettingsTab } from './pages/dashboard/SettingsTab';

// Admin Pages
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminJobsPage } from './pages/admin/AdminJobsPage';
import { AdminJobFormPage } from './pages/admin/AdminJobFormPage';
import { AdminApplicationsPage } from './pages/admin/AdminApplicationsPage';
import { AdminCompaniesPage } from './pages/admin/AdminCompaniesPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage';
import { AdminMessagesPage } from './pages/admin/AdminMessagesPage';
import { AdminSubscribersPage } from './pages/admin/AdminSubscribersPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';
import { AdminManagementPage } from './pages/admin/AdminManagementPage';

// Public Layout Container
const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#F8F9FA] text-[#121212]">
      <Navbar />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
      <FloatingDock />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Website Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/jobs" element={<JobsPage />} />
            <Route path="/jobs/:slug" element={<JobDetailPage />} />
            <Route path="/companies" element={<CompaniesPage />} />
            <Route path="/companies/:slug" element={<CompanyDetailPage />} />
            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />

            {/* Auth Routes inside Public Frame */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            {/* Job Seeker Dashboard Routes */}
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<OverviewTab />} />
              <Route path="profile" element={<ProfileTab />} />
              <Route path="applications" element={<ApplicationsTab />} />
              <Route path="saved-jobs" element={<SavedJobsTab />} />
              <Route path="resumes" element={<ResumesTab />} />
              <Route path="settings" element={<SettingsTab />} />
            </Route>
          </Route>

          {/* Protected Admin Portal Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="jobs" element={<AdminJobsPage />} />
            <Route path="jobs/new" element={<AdminJobFormPage />} />
            <Route path="jobs/:id/edit" element={<AdminJobFormPage />} />
            <Route path="applications" element={<AdminApplicationsPage />} />
            <Route path="companies" element={<AdminCompaniesPage />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="categories" element={<AdminCategoriesPage />} />
            <Route path="messages" element={<AdminMessagesPage />} />
            <Route path="subscribers" element={<AdminSubscribersPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
            <Route path="admins" element={<AdminManagementPage />} />
          </Route>

          {/* Fallback route */}
          <Route path="*" element={<HomePage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
