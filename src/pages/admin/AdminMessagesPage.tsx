import React, { useState } from 'react';
import { DataStore } from '../../services/store';
import { ContactMessage } from '../../types';
import { Mail, Trash2, CheckCircle2, Clock, Check } from 'lucide-react';

export const AdminMessagesPage: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>(() => DataStore.getContactMessages());
  const [selectedMsg, setSelectedMsg] = useState<ContactMessage | null>(null);

  const handleMarkResolved = (id: string) => {
    DataStore.updateMessageStatus(id, 'resolved');
    setMessages(DataStore.getContactMessages());
    if (selectedMsg?.id === id) {
      setSelectedMsg({ ...selectedMsg, status: 'resolved' });
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this message?')) {
      DataStore.deleteMessage(id);
      setMessages(DataStore.getContactMessages());
      if (selectedMsg?.id === id) setSelectedMsg(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 block mb-1">
          Editorial Inbound
        </span>
        <h1 className="font-display font-black text-2xl sm:text-3xl text-neutral-900 uppercase tracking-tight">
          Contact Inquiries ({messages.length})
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-neutral-200 overflow-hidden divide-y divide-neutral-100 shadow-xs text-xs">
          {messages.length > 0 ? (
            messages.map((m) => (
              <div
                key={m.id}
                onClick={() => setSelectedMsg(m)}
                className={`p-4 cursor-pointer transition-colors ${
                  selectedMsg?.id === m.id ? 'bg-neutral-100 font-medium' : 'hover:bg-neutral-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-neutral-900">{m.name}</span>
                  <span
                    className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded ${
                      m.status === 'resolved'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    {m.status}
                  </span>
                </div>
                <p className="text-neutral-700 font-medium truncate">{m.subject}</p>
                <span className="text-[10px] font-mono text-neutral-400">
                  {new Date(m.created_at).toLocaleDateString()} · {m.email}
                </span>
              </div>
            ))
          ) : (
            <p className="p-8 text-center text-neutral-500">No contact messages received.</p>
          )}
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-neutral-200 shadow-xs text-xs space-y-6">
          {selectedMsg ? (
            <>
              <div className="flex items-start justify-between border-b border-neutral-100 pb-4">
                <div>
                  <h3 className="font-display font-bold text-xl text-neutral-900">
                    {selectedMsg.subject}
                  </h3>
                  <p className="text-neutral-500 font-mono text-[11px] mt-1">
                    From: <strong className="text-neutral-900">{selectedMsg.name}</strong> ({selectedMsg.email}) ·{' '}
                    {new Date(selectedMsg.created_at).toLocaleString()}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {selectedMsg.status !== 'resolved' && (
                    <button
                      onClick={() => handleMarkResolved(selectedMsg.id)}
                      className="px-3 py-1.5 bg-emerald-700 text-white rounded font-semibold hover:bg-emerald-800 transition-colors flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Mark Resolved</span>
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(selectedMsg.id)}
                    className="p-1.5 text-neutral-400 hover:text-red-600 transition-colors"
                    title="Delete message"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200 leading-relaxed text-neutral-800 whitespace-pre-wrap">
                {selectedMsg.message}
              </div>

              <div className="pt-2">
                <a
                  href={`mailto:${selectedMsg.email}?subject=Re: ${encodeURIComponent(selectedMsg.subject)}`}
                  className="inline-block px-4 py-2 bg-[#121212] text-white rounded text-xs font-semibold hover:bg-neutral-800"
                >
                  Reply via Email Client
                </a>
              </div>
            </>
          ) : (
            <div className="py-20 text-center text-neutral-400">
              Select an inbound message from the list to review details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
