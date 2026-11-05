import React, { useState } from 'react';
import { Job, Resume } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { DataStore } from '../../services/store';
import { X, Upload, Check, AlertCircle, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ApplyModalProps {
  job: Job;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ApplyModal: React.FC<ApplyModalProps> = ({ job, isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [resumes, setResumes] = useState<Resume[]>(() => (user ? DataStore.getUserResumes(user.id) : []));
  const [selectedResumeId, setSelectedResumeId] = useState<string>(() => {
    const defaultRes = resumes.find((r) => r.is_default);
    return defaultRes ? defaultRes.id : resumes[0]?.id || '';
  });
  const [coverLetter, setCoverLetter] = useState('');
  const [uploadingNew, setUploadingNew] = useState(false);
  const [newFile, setNewFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  if (!user) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div className="bg-white rounded-xl max-w-md w-full p-6 text-center space-y-4">
          <h3 className="font-display font-bold text-xl text-neutral-900">Authentication Required</h3>
          <p className="text-sm text-neutral-600">
            You must be logged in to submit an application to {job.company?.name || 'this company'}.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-neutral-300 rounded text-xs font-semibold text-neutral-700 hover:bg-neutral-50"
            >
              Cancel
            </button>
            <Link
              to="/login"
              className="px-4 py-2 bg-[#121212] rounded text-xs font-semibold text-white hover:bg-neutral-800"
            >
              Log In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const alreadyApplied = DataStore.hasUserApplied(job.id, user.id);
  if (alreadyApplied) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4">
          <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mx-auto text-neutral-900">
            <Check className="w-6 h-6" />
          </div>
          <h3 className="font-display font-bold text-xl text-neutral-900 text-center">
            Application Already Submitted
          </h3>
          <p className="text-sm text-neutral-600 text-center">
            You have already applied for the <strong>{job.title}</strong> role at {job.company?.name}. You can review your status inside your Candidate Dashboard.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-[#121212] rounded text-xs font-semibold text-white hover:bg-neutral-800"
            >
              Close
            </button>
            <Link
              to="/dashboard/applications"
              className="px-4 py-2 border border-neutral-300 rounded text-xs font-semibold text-neutral-800 hover:bg-neutral-50"
            >
              View Application
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate mime type & size (max 5MB)
    const validMimes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validMimes.includes(file.type) && !file.name.endsWith('.pdf') && !file.name.endsWith('.docx')) {
      setError('Only PDF and DOC/DOCX files are supported.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB.');
      return;
    }

    setError(null);
    setNewFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      let finalResumeId = selectedResumeId;

      // If uploading a new file directly
      if (uploadingNew && newFile) {
        const uploaded = DataStore.uploadResume({
          userId: user.id,
          fileName: newFile.name,
          fileSize: newFile.size,
          mimeType: newFile.type || 'application/pdf',
          isDefault: resumes.length === 0,
        });
        finalResumeId = uploaded.id;
      }

      if (!finalResumeId) {
        setError('Please select or upload a resume for your application.');
        setSubmitting(false);
        return;
      }

      DataStore.submitApplication({
        jobId: job.id,
        userId: user.id,
        resumeId: finalResumeId,
        coverLetter: coverLetter.trim() || undefined,
      });

      setSubmitting(false);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'An error occurred submitting your application.');
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-xl w-full p-6 sm:p-8 space-y-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-neutral-400 hover:text-neutral-900 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 block mb-1">
            Application Dossier
          </span>
          <h2 className="font-display font-bold text-2xl text-neutral-900 leading-tight">
            Apply to {job.company?.name || 'Company'}
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            Position: <strong className="text-neutral-800">{job.title}</strong> · {job.location}
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Applicant Summary */}
          <div className="bg-neutral-50 p-4 rounded border border-neutral-100 flex items-center justify-between text-xs">
            <div>
              <p className="font-semibold text-neutral-900">{user.full_name}</p>
              <p className="text-neutral-500">{user.email}</p>
            </div>
            <Link
              to="/dashboard/profile"
              target="_blank"
              className="text-neutral-900 underline font-medium hover:text-black"
            >
              Edit Profile
            </Link>
          </div>

          {/* Resume Selection */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-neutral-900 block">
              Resume / CV (Required)
            </label>

            {!uploadingNew && resumes.length > 0 ? (
              <div className="space-y-2">
                {resumes.map((resume) => (
                  <label
                    key={resume.id}
                    className={`flex items-center justify-between p-3 rounded border cursor-pointer transition-colors text-xs ${
                      selectedResumeId === resume.id
                        ? 'border-neutral-900 bg-neutral-50 font-medium'
                        : 'border-neutral-200 hover:bg-neutral-50/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="resume"
                        value={resume.id}
                        checked={selectedResumeId === resume.id}
                        onChange={() => setSelectedResumeId(resume.id)}
                        className="text-neutral-900 focus:ring-0"
                      />
                      <FileText className="w-4 h-4 text-neutral-500" />
                      <span className="truncate max-w-[260px] sm:max-w-xs">{resume.file_name}</span>
                    </div>
                    {resume.is_default && (
                      <span className="text-[10px] font-mono text-neutral-400">Default</span>
                    )}
                  </label>
                ))}

                <button
                  type="button"
                  onClick={() => setUploadingNew(true)}
                  className="text-xs text-neutral-900 underline font-medium pt-1 hover:text-neutral-600 block"
                >
                  + Upload a different resume file
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center hover:border-neutral-400 transition-colors">
                  <Upload className="w-6 h-6 text-neutral-400 mx-auto mb-2" />
                  <label className="cursor-pointer">
                    <span className="text-xs font-semibold text-neutral-900 underline">
                      Choose PDF or DOCX file
                    </span>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                  <p className="text-[11px] text-neutral-400 mt-1">Maximum file size 5MB</p>
                  {newFile && (
                    <p className="mt-3 text-xs font-medium text-emerald-600 bg-emerald-50 py-1 px-2 rounded inline-block">
                      Selected: {newFile.name} ({(newFile.size / 1024).toFixed(1)} KB)
                    </p>
                  )}
                </div>

                {resumes.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setUploadingNew(false)}
                    className="text-xs text-neutral-600 underline hover:text-neutral-900"
                  >
                    Select an existing resume from your dashboard
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Cover Letter */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-neutral-900">
                Cover Note / Message to Hiring Director
              </label>
              <span className="text-[10px] text-neutral-400">Optional</span>
            </div>
            <textarea
              rows={4}
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Highlight relevant case studies, design principles, or specific alignment with this studio's work..."
              className="w-full text-xs p-3 border border-neutral-200 rounded focus:border-neutral-900 focus:outline-none transition-colors"
            />
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-100">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 border border-neutral-300 rounded text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-[#121212] text-white rounded text-xs font-semibold hover:bg-neutral-800 transition-colors disabled:opacity-50"
            >
              {submitting ? 'Submitting Application...' : 'Confirm & Submit Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
