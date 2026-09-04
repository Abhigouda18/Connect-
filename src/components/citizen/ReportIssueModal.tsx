import React, { useState } from 'react';
import {
  X,
  Camera,
  MapPin,
  AlertCircle,
  CheckCircle2,
  Upload,
  Lock,
  Sparkles,
} from 'lucide-react';
import { useConstituency } from '../../context/ConstituencyContext';
import { IssueCategory, IssueUrgency } from '../../types';

interface ReportIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES: { id: IssueCategory; label: string; icon: string; examples: string }[] = [
  { id: 'water', label: 'Drinking Water & Borewells', icon: '💧', examples: 'RO filter breakdown, low pressure, contamination' },
  { id: 'roads', label: 'Roads & Potholes', icon: '🛣️', examples: 'Craters, culvert damage, mud during rains' },
  { id: 'electricity', label: 'Electricity & Transformer', icon: '⚡', examples: 'Low voltage, frequent trips, sparking' },
  { id: 'streetlights', label: 'Streetlights & Dark Spots', icon: '💡', examples: 'Dead LED fixtures, dark stretches' },
  { id: 'drainage', label: 'Drainage & Sewage', icon: '🌊', examples: 'Overflowing storm drain, blocked gutters' },
  { id: 'garbage', label: 'Garbage & Sanitation', icon: '🗑️', examples: 'Open dumping, uncleared waste, stray dogs' },
  { id: 'healthcare', label: 'PHC & Hospital Healthcare', icon: '🏥', examples: 'Doctor absence, drug shortage' },
  { id: 'education', label: 'Schools & Anganwadi', icon: '🏫', examples: 'Compound wall, roof leak, desk shortage' },
  { id: 'agriculture', label: 'Farmer & Agriculture', icon: '🌾', examples: 'Canal silt, fertilizer supply, pest advisory' },
  { id: 'other', label: 'Other Constituency Grievance', icon: '📌', examples: 'Civic registry, pensions, bus stops' },
];

const SAMPLE_PHOTOS = [
  { label: 'Water RO Plant', url: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?w=600&auto=format&fit=crop&q=80' },
  { label: 'Damaged Road', url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80' },
  { label: 'Transformer Box', url: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=600&auto=format&fit=crop&q=80' },
  { label: 'Overflowing Drain', url: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=600&auto=format&fit=crop&q=80' },
];

export const ReportIssueModal: React.FC<ReportIssueModalProps> = ({ isOpen, onClose }) => {
  const { villages, reportIssue, currentUser } = useConstituency();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<IssueCategory>('water');
  const [urgency, setUrgency] = useState<IssueUrgency>('high');
  const [villageId, setVillageId] = useState(villages[0]?.id || 'vil_01');
  const [wardNumber, setWardNumber] = useState<number>(3);
  const [landmark, setLandmark] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleUseLocation = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setIsLocating(false);
          setLandmark(`Geo-tagged: near Lat ${pos.coords.latitude.toFixed(4)}, Lng ${pos.coords.longitude.toFixed(4)}`);
        },
        () => {
          setIsLocating(false);
          setLandmark('Location auto-pinned near Gram Panchayat junction');
        },
        { timeout: 4000 }
      );
    } else {
      setIsLocating(false);
      setLandmark('Location auto-pinned near Gram Panchayat junction');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const newIssue = reportIssue({
      title,
      description,
      category,
      urgency,
      villageId,
      wardNumber,
      landmark: landmark || 'Local village street',
      photoUrl: photoUrl || undefined,
      isAnonymous,
    });

    setSubmittedTicket(newIssue.ticketNumber);
  };

  const handleReset = () => {
    setTitle('');
    setDescription('');
    setCategory('water');
    setUrgency('high');
    setLandmark('');
    setPhotoUrl('');
    setSubmittedTicket(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-stone-900 text-white flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold">
                JanSeva Portal
              </span>
              <h2 className="text-lg font-bold">Report a Constituency Issue</h2>
            </div>
            <p className="text-xs text-stone-300 mt-1">
              Directly routed to the ABHI Candidate Office & your local Village Coordinator
            </p>
          </div>
          <button
            onClick={handleReset}
            className="text-stone-400 hover:text-white p-1 rounded-lg hover:bg-stone-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        {submittedTicket ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-stone-900">Grievance Registered Successfully!</h3>
            <div className="inline-block px-4 py-2 bg-stone-100 rounded-xl text-stone-800 font-mono font-bold text-lg border border-stone-300">
              Ticket ID: {submittedTicket}
            </div>
            <p className="text-sm text-stone-600 max-w-md mx-auto">
              Your grievance has been received by the Assembly Command Room. A tracking SMS is sent, and your local village coordinator has been notified for on-ground verification.
            </p>
            <div className="pt-4 flex justify-center gap-3">
              <button
                onClick={handleReset}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-sm transition cursor-pointer"
              >
                Done & View My Grievances
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
            {/* Category selection */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                1. Select Issue Category <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-left text-xs transition cursor-pointer ${
                      category === cat.id
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold shadow-xs'
                        : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    <span className="text-base">{cat.icon}</span>
                    <span className="truncate">{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Issue Title & Description */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  2. Grievance Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Broken water pump near primary school / Low voltage"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Detailed Description <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe the issue, how long it has persisted, number of affected houses, and exact location specifics..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                />
              </div>
            </div>

            {/* Location & Village Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Village / Ward Cluster <span className="text-rose-500">*</span>
                </label>
                <select
                  value={villageId}
                  onChange={(e) => setVillageId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  {villages.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} ({v.mandal})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Ward Number (1 - 10)
                </label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={wardNumber}
                  onChange={(e) => setWardNumber(parseInt(e.target.value) || 1)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="sm:col-span-2">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                    Exact Landmark / Street Details
                  </label>
                  <button
                    type="button"
                    onClick={handleUseLocation}
                    disabled={isLocating}
                    className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    {isLocating ? 'Detecting GPS...' : 'Auto-detect GPS Location'}
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="e.g., Cross 3, Opposite Milk Dairy, House #42"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Urgency & Priority */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                Urgency Level
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'low', label: 'Low', color: 'border-stone-300 text-stone-700 hover:bg-stone-50' },
                  { id: 'medium', label: 'Medium', color: 'border-blue-300 text-blue-700 hover:bg-blue-50' },
                  { id: 'high', label: 'High', color: 'border-amber-400 text-amber-700 hover:bg-amber-50' },
                  { id: 'critical', label: 'Emergency', color: 'border-rose-400 text-rose-700 hover:bg-rose-50' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setUrgency(item.id as IssueUrgency)}
                    className={`py-2 px-1 text-center rounded-xl border text-xs font-bold transition cursor-pointer ${
                      urgency === item.id
                        ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                        : item.color
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Photo Attachment */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                Photo Proof / Site Picture (Recommended)
              </label>

              {photoUrl ? (
                <div className="relative rounded-xl overflow-hidden border border-stone-200 group max-h-48">
                  <img
                    src={photoUrl}
                    alt="Issue site preview"
                    className="w-full h-40 object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <button
                    type="button"
                    onClick={() => setPhotoUrl('')}
                    className="absolute top-2 right-2 p-1.5 bg-stone-900/80 text-white rounded-full hover:bg-stone-900"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="border-2 border-dashed border-stone-200 rounded-xl p-4 text-center hover:border-emerald-400 transition bg-stone-50/50">
                    <Camera className="w-6 h-6 text-stone-400 mx-auto mb-1" />
                    <p className="text-xs text-stone-600">
                      Upload from phone or select one of the sample site photos below:
                    </p>
                    <input
                      type="text"
                      placeholder="Or paste photo image URL..."
                      value={photoUrl}
                      onChange={(e) => setPhotoUrl(e.target.value)}
                      className="mt-2 w-full max-w-sm mx-auto px-3 py-1.5 text-xs rounded-lg border border-stone-300 text-stone-800"
                    />
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    <span className="text-[11px] text-stone-400 self-center">Quick Presets:</span>
                    {SAMPLE_PHOTOS.map((sample) => (
                      <button
                        key={sample.label}
                        type="button"
                        onClick={() => setPhotoUrl(sample.url)}
                        className="text-[11px] px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200 cursor-pointer"
                      >
                        + {sample.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Anonymity & Consent */}
            <div className="flex items-start gap-2.5 pt-2 p-3 bg-stone-50 rounded-xl border border-stone-200">
              <input
                id="anon_check"
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <label htmlFor="anon_check" className="text-xs text-stone-600 cursor-pointer">
                <span className="font-semibold text-stone-800 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-stone-500" />
                  Keep my contact details confidential
                </span>
                Only the ABHI Grievance Cell coordinator can view your phone number for updates. It will not be visible on public village issue boards.
              </label>
            </div>

            {/* Submit & Cancel */}
            <div className="flex justify-end gap-3 pt-3 border-t border-stone-100">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 font-semibold text-xs hover:bg-stone-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition cursor-pointer flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4" />
                Submit Grievance to ABHI Office
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
