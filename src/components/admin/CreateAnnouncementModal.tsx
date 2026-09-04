import React, { useState } from 'react';
import { X, Megaphone, Sparkles, Building, AlertTriangle } from 'lucide-react';
import { useConstituency } from '../../context/ConstituencyContext';

interface CreateAnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateAnnouncementModal: React.FC<CreateAnnouncementModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { villages, addAnnouncement, currentUser } = useConstituency();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<'development_work' | 'public_meeting' | 'scheme' | 'emergency_alert'>('development_work');
  const [targetScope, setTargetScope] = useState('All Constituency');
  const [budgetSanctioned, setBudgetSanctioned] = useState('');
  const [beneficiariesCount, setBeneficiariesCount] = useState<number | undefined>(undefined);
  const [pinned, setPinned] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    addAnnouncement({
      title,
      content,
      category,
      author: currentUser.name,
      targetScope,
      metrics: {
        budgetSanctioned: budgetSanctioned || undefined,
        beneficiariesCount: beneficiariesCount || undefined,
      },
      pinned,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-4 animate-in fade-in zoom-in-95">
        <div className="flex justify-between items-center border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-600 text-white">
              <Megaphone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-stone-900">
                Broadcast Official Announcement
              </h3>
              <p className="text-xs text-stone-500">
                Notify constituents & party cadres across mobile app
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="font-bold text-stone-700 block mb-1">
              Category <span className="text-rose-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full p-2.5 rounded-xl border border-stone-300 text-xs bg-white"
            >
              <option value="development_work">🏗️ Development Work / Sanctioned Project</option>
              <option value="public_meeting">📅 Public Townhall / Medical Camp</option>
              <option value="scheme">📜 Welfare Scheme / Subsidies</option>
              <option value="emergency_alert">⚠️ Emergency / Monsoon Weather Alert</option>
            </select>
          </div>

          <div>
            <label className="font-bold text-stone-700 block mb-1">
              Headline Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. ₹3.5 Crore Road Asphalting Approved for Bettahalsoor"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-bold text-stone-700 block mb-1">
              Detailed Announcement Content <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              placeholder="Explain project details, contractor timelines, expected impact..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-stone-300 text-xs resize-none focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-bold text-stone-700 block mb-1">Target Village/Scope</label>
              <select
                value={targetScope}
                onChange={(e) => setTargetScope(e.target.value)}
                className="w-full p-2 rounded-lg border border-stone-300 text-xs bg-white"
              >
                <option value="All Constituency">All Constituency (AC-58 Sindhanur)</option>
                {villages.map((v) => (
                  <option key={v.id} value={v.name}>
                    {v.name} Only
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">Sanctioned Budget (Optional)</label>
              <input
                type="text"
                placeholder="e.g. ₹4.2 Crores"
                value={budgetSanctioned}
                onChange={(e) => setBudgetSanctioned(e.target.value)}
                className="w-full p-2 rounded-lg border border-stone-300 text-xs"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              id="pin_check"
              type="checkbox"
              checked={pinned}
              onChange={(e) => setPinned(e.target.checked)}
              className="rounded text-amber-600 focus:ring-amber-500"
            />
            <label htmlFor="pin_check" className="font-semibold text-stone-700 cursor-pointer">
              Pin to top of Citizen App Home Screen
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-stone-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-stone-300 text-stone-700 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold cursor-pointer"
            >
              Publish Announcement
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
