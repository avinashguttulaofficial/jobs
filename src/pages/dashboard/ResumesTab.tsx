import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { DataStore } from '../../services/store';
import { Resume } from '../../types';
import { Upload, FileText, Trash2, Check, AlertCircle, Star } from 'lucide-react';

export const ResumesTab: React.FC = () => {
  const { user } = useAuth();
  if (!user) return null;

  const [resumes, setResumes] = useState<Resume[]>(() => DataStore.getUserResumes(user.id));
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setSuccess(null);

    // Validate mime type & extension
    const validExtensions = ['.pdf', '.doc', '.docx'];
    const isDoc = validExtensions.some((ext) => file.name.toLowerCase().endsWith(ext));
    if (!isDoc) {
      setError('Unsupported file type. Please upload a PDF or DOC/DOCX document.');
      return;
    }

    // Size limit 5MB
    if (file.size > 5 * 1024 * 1024) {
      setError('File size exceeds the 5MB limit.');
      return;
    }

    try {
      const uploaded = DataStore.uploadResume({
        userId: user.id,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type || 'application/pdf',
        isDefault: resumes.length === 0,
      });

      const updated = DataStore.getUserResumes(user.id);
      setResumes(updated);
      setSuccess(`Resume "${file.name}" successfully uploaded.`);
    } catch (err: any) {
      setError('Failed to process resume file.');
    }
  };

  const handleSetDefault = (resumeId: string) => {
    DataStore.setDefaultResume(resumeId, user.id);
    setResumes(DataStore.getUserResumes(user.id));
    setSuccess('Default resume updated.');
  };

  const handleDelete = (resumeId: string) => {
    if (confirm('Are you sure you want to remove this resume from your dossier?')) {
      DataStore.deleteResume(resumeId);
      setResumes(DataStore.getUserResumes(user.id));
      setSuccess('Resume removed.');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-neutral-100 pb-4">
        <h2 className="font-display font-bold text-xl text-neutral-900">
          Resumes & Portfolio Documents
        </h2>
        <p className="text-xs text-neutral-500">
          Upload and manage your curriculum vitae. Stored in private Supabase Storage vaults.
        </p>
      </div>

      {success && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Upload Zone */}
      <div className="border-2 border-dashed border-neutral-300 hover:border-neutral-900 rounded-xl p-8 text-center transition-colors bg-neutral-50/50">
        <Upload className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
        <h4 className="font-semibold text-neutral-900 text-sm mb-1">
          Upload a New Resume
        </h4>
        <p className="text-xs text-neutral-500 mb-4 max-w-sm mx-auto">
          Accepted formats: PDF, DOC, DOCX. Maximum file size: 5 MB.
        </p>

        <label className="inline-block px-5 py-2.5 bg-[#121212] text-white rounded-lg text-xs font-semibold hover:bg-neutral-800 transition-colors cursor-pointer">
          <span>Choose File</span>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* List of Uploaded Resumes */}
      <div className="space-y-3">
        <h3 className="font-mono text-xs uppercase tracking-wider text-neutral-400">
          Uploaded Documents ({resumes.length})
        </h3>

        {resumes.length > 0 ? (
          <div className="space-y-2">
            {resumes.map((resume) => (
              <div
                key={resume.id}
                className="p-4 border border-neutral-200 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded bg-neutral-100 flex items-center justify-center text-neutral-700 shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-neutral-900 text-xs sm:text-sm">
                        {resume.file_name}
                      </span>
                      {resume.is_default && (
                        <span className="text-[10px] font-mono px-2 py-0.5 bg-neutral-900 text-white rounded font-medium">
                          Primary
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] font-mono text-neutral-400">
                      {formatFileSize(resume.file_size)} · Uploaded{' '}
                      {new Date(resume.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  {!resume.is_default && (
                    <button
                      onClick={() => handleSetDefault(resume.id)}
                      className="px-2.5 py-1 text-neutral-700 border border-neutral-200 hover:border-neutral-900 rounded font-medium transition-colors"
                    >
                      Make Default
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(resume.id)}
                    className="p-1.5 text-neutral-400 hover:text-red-600 transition-colors rounded"
                    title="Delete resume"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center border border-neutral-200 rounded-lg text-xs text-neutral-500">
            No resume uploaded yet. Upload your PDF or DOCX file to enable rapid 1-click applications.
          </div>
        )}
      </div>
    </div>
  );
};
