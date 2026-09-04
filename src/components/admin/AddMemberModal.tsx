import React, { useState } from 'react';
import {
  X,
  User,
  Phone,
  CreditCard,
  Building,
  Image,
  Check,
  Sparkles,
  ShieldCheck,
  Tag,
} from 'lucide-react';
import { useConstituency } from '../../context/ConstituencyContext';

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultVillageId?: string;
  onMemberAdded?: (memberId: string) => void;
}

const PRESET_AVATARS = [
  {
    label: 'Leader 1',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  },
  {
    label: 'Leader 2',
    url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
  },
  {
    label: 'Leader 3',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  },
  {
    label: 'Women Lead 1',
    url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
  },
  {
    label: 'Women Lead 2',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  },
  {
    label: 'Youth Lead',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  },
];

const COMMON_ROLES = [
  'Booth In-Charge & Gram Panchayat Lead',
  'Village President',
  'Panchayat Grievance Lead',
  'Youth Wing President',
  'Women Wing President & SHG Convenor',
  'Farmer Cell Convenor',
  'Town Mandal Coordinator',
  'Rural Cluster Secretary',
  'Polling Agent & Booth Worker',
];

export const AddMemberModal: React.FC<AddMemberModalProps> = ({
  isOpen,
  onClose,
  defaultVillageId,
  onMemberAdded,
}) => {
  const { villages, addPartyMember } = useConstituency();

  const [name, setName] = useState('');
  const [kannadaName, setKannadaName] = useState('');
  const [phone, setPhone] = useState('+91 ');
  const [voterId, setVoterId] = useState('');
  const [email, setEmail] = useState('');
  const [villageId, setVillageId] = useState(defaultVillageId || villages[0]?.id || '');
  const [wardNumber, setWardNumber] = useState<number>(1);
  const [boothNumber, setBoothNumber] = useState<number>(1);
  const [role, setRole] = useState(COMMON_ROLES[0]);
  const [customRole, setCustomRole] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(PRESET_AVATARS[0].url);
  const [responsibilitiesText, setResponsibilitiesText] = useState('Panchayat grievance triage, Voter mobilization, Water canal inspection');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const selectedVillage = villages.find((v) => v.id === villageId) || villages[0];

  const handleGenerateVoterId = () => {
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    setVoterId(`SIN58-EPIC-${randomSuffix}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Please enter the member full name');
      return;
    }
    if (!phone.trim() || phone.trim() === '+91') {
      setErrorMsg('Please enter a valid contact number');
      return;
    }
    if (!voterId.trim()) {
      setErrorMsg('Please enter the member Voter ID / EPIC card number');
      return;
    }

    const assignedRole = role === 'Custom' ? customRole : role;
    const responsibilities = responsibilitiesText
      .split(',')
      .map((r) => r.trim())
      .filter(Boolean);

    addPartyMember({
      name: name.trim(),
      kannadaName: kannadaName.trim() || undefined,
      phone: phone.trim(),
      voterId: voterId.trim().toUpperCase(),
      email: email.trim() || undefined,
      villageId: selectedVillage?.id || 'vil_sindhanur_001',
      villageName: selectedVillage?.name || 'Alabanoor',
      wardNumber: Number(wardNumber) || 1,
      boothNumber: Number(boothNumber) || 1,
      role: assignedRole || 'Booth In-Charge',
      avatarUrl: avatarUrl.trim() || PRESET_AVATARS[0].url,
      status: 'active',
      responsibilities: responsibilities.length > 0 ? responsibilities : ['Village citizen grievance triage'],
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-stone-900 text-white flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-indigo-600 text-white text-xs">
                🏛️ AC-58
              </span>
              <h3 className="text-base font-bold text-white">
                Enroll New Village Member & Cadre
              </h3>
            </div>
            <p className="text-xs text-stone-400 mt-0.5">
              Register party representative with official Photo, Contact Number, and Voter ID (EPIC)
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
              {errorMsg}
            </div>
          )}

          {/* Photo / Avatar Selection */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">
              Member Photo (Avatar)
            </label>
            <div className="flex items-center gap-4">
              <img
                src={avatarUrl}
                alt="Preview"
                className="w-14 h-14 rounded-full object-cover border-2 border-indigo-600 shadow-xs shrink-0"
                referrerPolicy="no-referrer"
              />
              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap gap-2">
                  {PRESET_AVATARS.map((av, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setAvatarUrl(av.url)}
                      className={`px-2.5 py-1 text-xs rounded-lg border font-medium cursor-pointer transition ${
                        avatarUrl === av.url
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                          : 'bg-stone-50 border-stone-300 text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      {av.label}
                    </button>
                  ))}
                </div>
                <input
                  type="url"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="Or paste custom photo URL..."
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Name & Kannada Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Full Member Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Basavaraj Patil"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium text-stone-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Name in Kannada (ಹೆಸರು)
              </label>
              <input
                type="text"
                placeholder="ಉದಾ: ಬಸವರಾಜ್ ಪಾಟೀಲ್"
                value={kannadaName}
                onChange={(e) => setKannadaName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium text-stone-900"
              />
            </div>
          </div>

          {/* Contact Number & Voter ID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Contact Number (Phone) *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                <input
                  type="tel"
                  required
                  placeholder="+91 94481 00000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium text-stone-900 font-mono"
                />
              </div>
              <span className="text-[10px] text-stone-400 mt-0.5 block">
                Primary WhatsApp & call number
              </span>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-stone-700">
                  Voter ID / EPIC Card Number *
                </label>
                <button
                  type="button"
                  onClick={handleGenerateVoterId}
                  className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3 h-3" /> Auto-Generate
                </button>
              </div>
              <div className="relative">
                <CreditCard className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  placeholder="e.g. SIN58-EPIC-019284"
                  value={voterId}
                  onChange={(e) => setVoterId(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-bold uppercase tracking-wider text-stone-900 font-mono"
                />
              </div>
              <span className="text-[10px] text-stone-400 mt-0.5 block">
                Official Election Commission EPIC number
              </span>
            </div>
          </div>

          {/* Village & Mandal */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Assigned Village & Gram Panchayat *
            </label>
            <div className="relative">
              <Building className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <select
                value={villageId}
                onChange={(e) => setVillageId(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white font-medium text-stone-900 cursor-pointer"
              >
                {villages.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name} ({v.kannadaName || v.mandal}) — {v.mandal}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Ward & Booth Numbers */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Ward Number
              </label>
              <input
                type="number"
                min={1}
                max={25}
                value={wardNumber}
                onChange={(e) => setWardNumber(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Polling Booth #
              </label>
              <input
                type="number"
                min={1}
                max={300}
                value={boothNumber}
                onChange={(e) => setBoothNumber(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium"
              />
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Email Address (Optional)
              </label>
              <input
                type="email"
                placeholder="member@sindhanur.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-xs"
              />
            </div>
          </div>

          {/* Role / Designation */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Party Role / Designation *
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white font-medium text-stone-900 cursor-pointer"
            >
              {COMMON_ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
              <option value="Custom">Other Custom Designation...</option>
            </select>

            {role === 'Custom' && (
              <input
                type="text"
                placeholder="Enter custom role..."
                value={customRole}
                onChange={(e) => setCustomRole(e.target.value)}
                className="w-full mt-2 px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            )}
          </div>

          {/* Assigned Responsibilities */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Key Responsibilities (Comma-separated)
            </label>
            <input
              type="text"
              placeholder="Canal inspection, Grievance tracking, Booth roster"
              value={responsibilitiesText}
              onChange={(e) => setResponsibilitiesText(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-xs"
            />
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-stone-200 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition cursor-pointer flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4" />
              Enroll Village Member
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
