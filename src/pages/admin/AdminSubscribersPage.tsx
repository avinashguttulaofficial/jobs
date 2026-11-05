import React, { useState } from 'react';
import { DataStore } from '../../services/store';
import { NewsletterSubscriber } from '../../types';
import { Download, Send, Check } from 'lucide-react';

export const AdminSubscribersPage: React.FC = () => {
  const [subscribers] = useState<NewsletterSubscriber[]>(() => DataStore.getNewsletterSubscribers());
  const [notice, setNotice] = useState<string | null>(null);

  const handleExportCSV = () => {
    const headers = ['Email', 'Status', 'Subscribed Date'];
    const rows = subscribers.map((s) => [s.email, s.status, new Date(s.subscribed_at).toISOString()]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `grail_newsletter_subscribers_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setNotice('Subscribers CSV exported.');
    setTimeout(() => setNotice(null), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 block mb-1">
            Audience Distribution
          </span>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-neutral-900 uppercase tracking-tight">
            Newsletter Subscribers ({subscribers.length})
          </h1>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2 border border-neutral-300 rounded-lg text-xs font-semibold hover:bg-neutral-100 transition-colors flex items-center gap-2 bg-white"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Audience CSV</span>
        </button>
      </div>

      {notice && (
        <div className="p-3 bg-neutral-900 text-white text-xs font-mono rounded-lg shadow-sm">
          {notice}
        </div>
      )}

      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50 font-mono text-neutral-500 uppercase text-[10px]">
                <th className="py-3 px-4">Subscriber Email</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Subscribed Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 font-mono text-[11px]">
              {subscribers.map((sub) => (
                <tr key={sub.id} className="hover:bg-neutral-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-neutral-900">{sub.email}</td>
                  <td className="py-3.5 px-4">
                    <span className="text-[10px] uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">
                      {sub.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-neutral-500">
                    {new Date(sub.subscribed_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
