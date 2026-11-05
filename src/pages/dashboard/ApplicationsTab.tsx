import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { DataStore } from '../../services/store';
import { Application, ApplicationStatus } from '../../types';
import { ChevronDown, ChevronUp, Clock, CheckCircle2, FileText, ExternalLink, AlertCircle } from 'lucide-react';

export const ApplicationsTab: React.FC = () => {
  const { user } = useAuth();
  if (!user) return null;

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const applications = DataStore.getUserApplications(user.id);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'submitted':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'under_review':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'shortlisted':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'interview':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'hired':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'rejected':
        return 'bg-neutral-100 text-neutral-600 border-neutral-200';
      case 'withdrawn':
        return 'bg-neutral-100 text-neutral-400 border-neutral-200';
      default:
        return 'bg-neutral-50 text-neutral-700 border-neutral-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-neutral-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-xl text-neutral-900">
            My Submitted Applications
          </h2>
          <p className="text-xs text-neutral-500">
            Track application progress, review studio feedback, and view status changes in real-time.
          </p>
        </div>
        <span className="text-xs font-mono text-neutral-400">
          {applications.length} Submissions
        </span>
      </div>

      {applications.length > 0 ? (
        <div className="space-y-4">
          {applications.map((app) => {
            const isExpanded = expandedId === app.id;
            return (
              <div
                key={app.id}
                className="border border-neutral-200 rounded-xl overflow-hidden bg-white transition-all shadow-xs"
              >
                <div
                  onClick={() => toggleExpand(app.id)}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-neutral-50/50 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/jobs/${app.job?.slug}`}
                        onClick={(e) => e.stopPropagation()}
                        className="font-bold text-neutral-900 hover:underline text-sm sm:text-base font-display"
                      >
                        {app.job?.title || 'Unknown Position'}
                      </Link>
                      <span className="text-neutral-400">·</span>
                      <span className="text-xs text-neutral-600 font-medium">
                        {app.job?.company?.name || 'Studio'}
                      </span>
                    </div>
                    <div className="text-neutral-400 font-mono text-[11px] flex items-center gap-2">
                      <span>Applied: {new Date(app.applied_at).toLocaleDateString()}</span>
                      <span>·</span>
                      <span>{app.job?.location}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`text-[11px] font-mono uppercase tracking-wider px-2.5 py-1 rounded border font-semibold ${getStatusBadge(
                        app.status
                      )}`}
                    >
                      {app.status.replace('_', ' ')}
                    </span>
                    <button className="text-neutral-400 hover:text-neutral-900 p-1">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details: Status Timeline & Cover Letter */}
                {isExpanded && (
                  <div className="p-5 bg-neutral-50/60 border-t border-neutral-100 space-y-6 text-xs">
                    {/* Status History Timeline */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-neutral-900 font-mono uppercase text-[10px] tracking-wider">
                        Application Status History & Notes
                      </h4>

                      <div className="space-y-3 border-l-2 border-neutral-200 pl-4 ml-1">
                        {app.status_history && app.status_history.length > 0 ? (
                          app.status_history.map((hist) => (
                            <div key={hist.id} className="relative space-y-1">
                              <span className="absolute -left-[21px] top-1 w-2 h-2 rounded-full bg-neutral-900" />
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-neutral-900 uppercase font-mono text-[11px]">
                                  {hist.new_status.replace('_', ' ')}
                                </span>
                                <span className="text-[10px] text-neutral-400">
                                  {new Date(hist.created_at).toLocaleString()}
                                </span>
                              </div>
                              {hist.changed_by_name && (
                                <p className="text-[11px] text-neutral-500">
                                  Updated by {hist.changed_by_name}
                                </p>
                              )}
                              {hist.admin_note && (
                                <div className="p-2.5 bg-white border border-neutral-200 rounded text-neutral-700 text-xs italic">
                                  "{hist.admin_note}"
                                </div>
                              )}
                            </div>
                          ))
                        ) : (
                          <div className="text-neutral-500 text-xs">
                            Application received by editorial recruitment team.
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Resume & Cover Note Attached */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-neutral-200">
                      <div>
                        <h4 className="font-semibold text-neutral-900 text-[11px] mb-1">
                          Resume Attached
                        </h4>
                        <div className="flex items-center gap-2 text-neutral-600 bg-white p-2 rounded border border-neutral-200">
                          <FileText className="w-4 h-4 text-neutral-400 shrink-0" />
                          <span className="truncate">{app.resume?.file_name || 'Uploaded Resume Dossier'}</span>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-neutral-900 text-[11px] mb-1">
                          Cover Note to Hiring Lead
                        </h4>
                        <div className="bg-white p-2.5 rounded border border-neutral-200 text-neutral-600 text-xs whitespace-pre-wrap max-h-28 overflow-y-auto">
                          {app.cover_letter || 'No additional cover note submitted.'}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 text-center border border-dashed border-neutral-200 rounded-xl space-y-3">
          <p className="text-neutral-500 text-xs">
            You haven't applied to any roles yet. Explore the jobs board to find matching positions.
          </p>
          <Link
            to="/jobs"
            className="inline-block px-4 py-2 bg-[#121212] text-white text-xs font-semibold rounded hover:bg-neutral-800"
          >
            Find Positions
          </Link>
        </div>
      )}
    </div>
  );
};
