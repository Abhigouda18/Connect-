import React, { useState } from 'react';
import {
  Users,
  MapPin,
  Phone,
  Video,
  PlusCircle,
  Plus,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Shield,
  Layers,
  Search,
  UserPlus,
  Building,
  X,
  Trash2,
} from 'lucide-react';
import { useConstituency } from '../../context/ConstituencyContext';
import { Village, PartyMember } from '../../types';
import { AddVillageModal } from './AddVillageModal';

interface VillageDirectoryProps {
  onSelectIssue: (id: string) => void;
  onStartVillageMeeting: (villageId: string, villageName: string) => void;
}

export const VillageDirectory: React.FC<VillageDirectoryProps> = ({
  onSelectIssue,
  onStartVillageMeeting,
}) => {
  const {
    villages,
    members,
    issues,
    addPartyMember,
    removePartyMember,
    currentUser,
    constituency,
    setActiveView,
  } = useConstituency();

  const [selectedVillageId, setSelectedVillageId] = useState<string>(villages[0]?.id || 'vil_01');
  const [selectedMandal, setSelectedMandal] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showAddVillageModal, setShowAddVillageModal] = useState(false);

  // New member form
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberPhone, setNewMemberPhone] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('Booth In-Charge');
  const [newMemberWard, setNewMemberWard] = useState(3);
  const [newMemberBooth, setNewMemberBooth] = useState(14);
  const [newMemberResponsibilities, setNewMemberResponsibilities] = useState('Grievance reporting, voter mobilization');

  const mandals: string[] = Array.from(new Set(villages.map((v) => v.mandal)));

  const filteredVillages = villages.filter((v) => {
    if (selectedMandal !== 'all' && v.mandal !== selectedMandal) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = v.name.toLowerCase().includes(q);
      const matchKn = v.kannadaName?.toLowerCase().includes(q);
      const matchGp = (v.gramPanchayat || v.mandal).toLowerCase().includes(q);
      if (!matchName && !matchKn && !matchGp) return false;
    }
    return true;
  });

  const selectedVillage = villages.find((v) => v.id === selectedVillageId) || villages[0];

  const villageMembers = members.filter((m) => m.villageId === selectedVillage?.id);
  const villageIssues = issues.filter((i) => i.villageId === selectedVillage?.id);

  const handleAddMemberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim() || !newMemberPhone.trim() || !selectedVillage) return;

    addPartyMember({
      name: newMemberName,
      phone: newMemberPhone,
      villageId: selectedVillage.id,
      villageName: selectedVillage.name,
      wardNumber: newMemberWard,
      boothNumber: newMemberBooth,
      role: newMemberRole,
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      status: 'active',
      responsibilities: newMemberResponsibilities.split(',').map((r) => r.trim()),
    });

    setShowAddMemberModal(false);
    setNewMemberName('');
    setNewMemberPhone('');
  };

  return (
    <div className="space-y-6">
      {/* Header & Hierarchy Breadcrumb */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-stone-400 uppercase tracking-wider font-semibold">
            <span>{constituency.name} AC-{constituency.acNumber}</span>
            <span>→</span>
            <span className="text-stone-700">{selectedVillage?.mandal}</span>
            <span>→</span>
            <span className="text-indigo-600 font-bold">{selectedVillage?.name}</span>
          </div>
          <h2 className="text-xl font-bold text-stone-900 mt-1">
            Village-Wise Grassroots Member Directory
          </h2>
          <p className="text-xs text-stone-500">
            Booth committees, page pramukhs, youth leads, and village council conveners for {constituency.name}
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          <button
            id="btn-dir-view-members-roster"
            onClick={() => setActiveView('members')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold border border-indigo-200 shadow-2xs cursor-pointer transition"
          >
            <Users className="w-4 h-4" />
            Full Member Directory ({members.length})
          </button>

          <button
            id="btn-open-add-village"
            onClick={() => setShowAddVillageModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs cursor-pointer transition"
          >
            <Plus className="w-4 h-4" />
            Add Village
          </button>

          <button
            onClick={() => onStartVillageMeeting(selectedVillage.id, selectedVillage.name)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md cursor-pointer transition"
          >
            <Video className="w-4 h-4" />
            Start Meeting for {selectedVillage.name}
          </button>

          <button
            onClick={() => setShowAddMemberModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold cursor-pointer transition"
          >
            <UserPlus className="w-4 h-4" />
            Enroll Member
          </button>
        </div>
      </div>

      {/* Village Directory 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Village Selector List (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          {/* Search & Mandal Filter */}
          <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search village name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center gap-1 overflow-x-auto pb-1">
              <button
                onClick={() => setSelectedMandal('all')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap cursor-pointer transition ${
                  selectedMandal === 'all'
                    ? 'bg-stone-900 text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                All Mandals
              </button>
              {mandals.map((m) => (
                <button
                  key={m}
                  onClick={() => setSelectedMandal(m)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap cursor-pointer transition ${
                    selectedMandal === m
                      ? 'bg-stone-900 text-white'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {m.replace(' Mandal', '')}
                </button>
              ))}
            </div>
            <div className="text-[11px] font-medium text-stone-500 pt-1 border-t border-stone-100 flex items-center justify-between">
              <span>Showing {filteredVillages.length} of {villages.length} villages</span>
              {selectedMandal !== 'all' && (
                <button
                  onClick={() => setSelectedMandal('all')}
                  className="text-indigo-600 hover:underline cursor-pointer"
                >
                  Clear filter
                </button>
              )}
            </div>
          </div>

          {/* Villages List */}
          <div className="space-y-2 max-h-[640px] overflow-y-auto pr-1">
            {filteredVillages.map((v) => {
              const isSelected = v.id === selectedVillageId;
              return (
                <div
                  key={v.id}
                  onClick={() => setSelectedVillageId(v.id)}
                  className={`p-4 rounded-2xl border transition cursor-pointer flex items-center justify-between shadow-xs ${
                    isSelected
                      ? 'bg-indigo-50/80 border-indigo-400 ring-2 ring-indigo-200'
                      : 'bg-white border-stone-200 hover:border-stone-300 hover:bg-stone-50'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-stone-900">{v.name}</h4>
                      {v.kannadaName && (
                        <span className="text-xs text-stone-500 font-medium">
                          ({v.kannadaName})
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-stone-500 mt-0.5">
                      {v.mandal} • {v.wardsCount} Wards • {v.boothsCount} Booths
                    </div>
                    <div className="flex items-center gap-3 mt-2 text-[11px]">
                      <span className="text-indigo-800 font-semibold">
                        👥 {v.registeredMembers.toLocaleString()} Members
                      </span>
                      <span className="text-stone-400">•</span>
                      <span className="text-rose-600 font-medium">
                        📋 {v.activeIssuesCount} Open Issues
                      </span>
                    </div>
                  </div>

                  <ChevronRight
                    className={`w-5 h-5 transition ${
                      isSelected ? 'text-indigo-600 translate-x-1' : 'text-stone-300'
                    }`}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Village In-Depth Profile (8 cols) */}
        <div className="lg:col-span-8 space-y-5">
          {/* Selected Village Detail Card */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-stone-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-stone-900">
                    {selectedVillage.name}
                  </h3>
                  {selectedVillage.kannadaName && (
                    <span className="text-sm font-semibold text-stone-500">
                      {selectedVillage.kannadaName}
                    </span>
                  )}
                  <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-xs font-mono">
                    {selectedVillage.mandal}
                  </span>
                </div>
                <p className="text-xs text-stone-500 mt-0.5">
                  Constituency AC-58 Sindhanur • Total Population: {selectedVillage.population.toLocaleString()} residents
                </p>
              </div>

              <button
                onClick={() => onStartVillageMeeting(selectedVillage.id, selectedVillage.name)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs cursor-pointer transition"
              >
                <Video className="w-3.5 h-3.5" />
                Start Village Townhall 🎥
              </button>
            </div>

            {/* Metric stat strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-stone-500 block">Registered Members</span>
                <span className="text-lg font-bold text-stone-900 block mt-0.5">
                  {selectedVillage.registeredMembers.toLocaleString()}
                </span>
                <span className="text-[10px] text-emerald-600 font-semibold">Verified KYC</span>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-stone-500 block">Polling Booths</span>
                <span className="text-lg font-bold text-stone-900 block mt-0.5">
                  {selectedVillage.boothsCount} Booths
                </span>
                <span className="text-[10px] text-stone-500">{selectedVillage.wardsCount} Panchayat Wards</span>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-stone-500 block">Active Issues</span>
                <span className="text-lg font-bold text-rose-600 block mt-0.5">
                  {selectedVillage.activeIssuesCount}
                </span>
                <span className="text-[10px] text-stone-500">Under resolution</span>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-stone-500 block">Issues Resolved</span>
                <span className="text-lg font-bold text-emerald-600 block mt-0.5">
                  {selectedVillage.resolvedIssuesCount}
                </span>
                <span className="text-[10px] text-emerald-700 font-semibold">92% clearance</span>
              </div>
            </div>

            {/* Coordinator Info */}
            <div className="p-3 bg-indigo-50/60 border border-indigo-200 rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0">
                  {selectedVillage.coordinatorName.charAt(0)}
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-indigo-700 block">
                    Village Panchayat Convener / Lead
                  </span>
                  <span className="font-bold text-stone-900 text-sm">
                    {selectedVillage.coordinatorName}
                  </span>
                </div>
              </div>

              <a
                href={`tel:${selectedVillage.coordinatorPhone}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-indigo-300 text-indigo-800 font-bold hover:bg-indigo-50 cursor-pointer shadow-xs"
              >
                <Phone className="w-3.5 h-3.5" />
                {selectedVillage.coordinatorPhone}
              </a>
            </div>
          </div>

          {/* Village Registered Members Roster */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-base font-bold text-stone-900">
                  Designated Members & Booth Agents ({villageMembers.length})
                </h4>
                <p className="text-xs text-stone-500">
                  Organized by Ward, Booth, and Assigned Organizational Responsibilities
                </p>
              </div>

              <button
                onClick={() => setShowAddMemberModal(true)}
                className="text-xs font-bold text-indigo-700 hover:text-indigo-900 flex items-center gap-1 cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                Add Member to {selectedVillage.name}
              </button>
            </div>

            {villageMembers.length === 0 ? (
              <div className="p-8 text-center bg-stone-50 rounded-xl border border-stone-200 text-stone-500 text-xs">
                No individual member records enrolled yet in this village. Click "Enroll Member" to add one.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {villageMembers.map((member) => (
                  <div
                    key={member.id}
                    className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 hover:bg-white hover:border-stone-300 transition space-y-2.5 text-xs shadow-2xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <img
                          src={member.avatarUrl}
                          alt={member.name}
                          className="w-10 h-10 rounded-full object-cover border border-stone-300"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <h5 className="font-bold text-sm text-stone-900 leading-snug">
                            {member.name}
                          </h5>
                          <p className="text-indigo-700 font-semibold text-[11px]">
                            {member.role}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          member.status === 'active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-stone-200 text-stone-600'
                        }`}
                      >
                        {member.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-stone-100 flex justify-between items-center text-stone-600 text-[11px]">
                      <span>
                        Ward {member.wardNumber} • Booth #{member.boothNumber}
                      </span>
                      <a
                        href={`tel:${member.phone}`}
                        className="font-bold text-stone-800 hover:text-indigo-600"
                      >
                        {member.phone}
                      </a>
                    </div>

                    {member.responsibilities && member.responsibilities.length > 0 && (
                      <div className="pt-1">
                        <span className="text-[10px] uppercase font-bold text-stone-400 block mb-1">
                          Assigned Responsibilities:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {member.responsibilities.map((resp, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded bg-white text-stone-700 text-[10px] border border-stone-200"
                            >
                              {resp}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="pt-2 border-t border-stone-100 flex justify-between items-center text-[10px] text-stone-500">
                      <span>Tasks: {member.tasksResolved}/{member.tasksAssigned} resolved</span>
                      <div className="flex items-center gap-2">
                        <span>Joined {member.joinedDate}</span>
                        {currentUser.role === 'ABHI_CANDIDATE' && (
                          <button
                            id={`btn-dir-remove-member-${member.id}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (window.confirm(`Are you sure you want to remove ${member.name} (${member.role}) from party records?`)) {
                                removePartyMember(member.id);
                              }
                            }}
                            className="p-1 rounded text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer flex items-center gap-1 font-semibold text-[10px]"
                            title="Remove Member (Admin Access)"
                          >
                            <Trash2 className="w-3 h-3 text-rose-500" />
                            <span className="text-rose-600 font-bold">Remove</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Open Issues in this Village */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-3">
            <h4 className="text-base font-bold text-stone-900">
              Active Issues in {selectedVillage.name} ({villageIssues.length})
            </h4>

            <div className="space-y-2">
              {villageIssues.map((iss) => (
                <div
                  key={iss.id}
                  onClick={() => onSelectIssue(iss.id)}
                  className="p-3 rounded-xl border border-stone-200 hover:border-indigo-400 cursor-pointer flex items-center justify-between text-xs transition"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-stone-700">
                        {iss.ticketNumber}
                      </span>
                      <span className="font-bold text-stone-900">{iss.title}</span>
                    </div>
                    <span className="text-stone-500 text-[11px]">
                      Ward {iss.wardNumber} • {iss.landmark}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 text-stone-700">
                      {iss.status}
                    </span>
                    <ChevronRight className="w-4 h-4 text-stone-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Enroll Member Modal */}
      {showAddMemberModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center border-b border-stone-100 pb-3">
              <div>
                <h3 className="font-bold text-base text-stone-900">
                  Enroll Party Member / Booth Agent
                </h3>
                <p className="text-xs text-stone-500">
                  Adding to {selectedVillage.name} roster
                </p>
              </div>
              <button
                onClick={() => setShowAddMemberModal(false)}
                className="text-stone-400 hover:text-stone-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMemberSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Chandra / Bhavani Gowda"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  Mobile Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98450 00000"
                  value={newMemberPhone}
                  onChange={(e) => setNewMemberPhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Ward Number</label>
                  <input
                    type="number"
                    min={1}
                    max={15}
                    value={newMemberWard}
                    onChange={(e) => setNewMemberWard(parseInt(e.target.value) || 1)}
                    className="w-full p-2 rounded-lg border border-stone-300 text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Booth Number</label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={newMemberBooth}
                    onChange={(e) => setNewMemberBooth(parseInt(e.target.value) || 1)}
                    className="w-full p-2 rounded-lg border border-stone-300 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  Role / Designation <span className="text-rose-500">*</span>
                </label>
                <select
                  value={newMemberRole}
                  onChange={(e) => setNewMemberRole(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 text-xs bg-white"
                >
                  <option value="Booth In-Charge">Booth In-Charge</option>
                  <option value="Village Vice President">Village Vice President</option>
                  <option value="Youth Wing Convenor">Youth Wing Convenor</option>
                  <option value="Women Wing Coordinator">Women Wing Coordinator</option>
                  <option value="Panchayat Grievance Lead">Panchayat Grievance Lead</option>
                  <option value="Social Media & Alerts Agent">Social Media & Alerts Agent</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  Key Responsibilities (Comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Water monitoring, voter outreach, school liaison"
                  value={newMemberResponsibilities}
                  onChange={(e) => setNewMemberResponsibilities(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowAddMemberModal(false)}
                  className="px-4 py-2 rounded-xl border border-stone-300 text-stone-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold cursor-pointer"
                >
                  Enroll Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Village Modal */}
      <AddVillageModal
        isOpen={showAddVillageModal}
        onClose={() => setShowAddVillageModal(false)}
        onVillageAdded={(newId) => setSelectedVillageId(newId)}
      />
    </div>
  );
};
