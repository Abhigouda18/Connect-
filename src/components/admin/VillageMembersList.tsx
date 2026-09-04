import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Filter,
  Plus,
  Phone,
  CreditCard,
  Building,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  MessageCircle,
  Video,
  Download,
  Grid,
  List,
  ShieldCheck,
  UserCheck,
  Sparkles,
  MapPin,
  X,
  Printer,
  ChevronRight,
  Trash2,
  AlertTriangle,
} from 'lucide-react';
import { useConstituency } from '../../context/ConstituencyContext';
import { PartyMember } from '../../types';
import { AddMemberModal } from './AddMemberModal';

interface VillageMembersListProps {
  initialVillageFilter?: string | null;
  onStartMeetingWithMember?: (villageId: string, villageName: string) => void;
}

export const VillageMembersList: React.FC<VillageMembersListProps> = ({
  initialVillageFilter = null,
  onStartMeetingWithMember,
}) => {
  const { members, villages, startMeeting, currentUser, removePartyMember } = useConstituency();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVillageId, setSelectedVillageId] = useState<string>(initialVillageFilter || 'all');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [inspectedMember, setInspectedMember] = useState<PartyMember | null>(null);
  const [memberToDelete, setMemberToDelete] = useState<PartyMember | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Copy Voter ID handler
  const handleCopyVoterId = (voterId: string, memberId: string) => {
    navigator.clipboard?.writeText(voterId);
    setCopiedId(memberId);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  // Roles set
  const allRoles = useMemo(() => {
    const roles = new Set<string>();
    members.forEach((m) => {
      if (m.role) roles.add(m.role);
    });
    return Array.from(roles);
  }, [members]);

  // Filtered members list
  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      // Village filter
      if (selectedVillageId !== 'all' && member.villageId !== selectedVillageId) {
        return false;
      }

      // Role filter
      if (selectedRole !== 'all' && member.role !== selectedRole) {
        return false;
      }

      // Search query filter (matches name, phone, voterId, villageName)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = member.name.toLowerCase().includes(query);
        const matchesKannada = member.kannadaName?.toLowerCase().includes(query) || false;
        const matchesPhone = member.phone.toLowerCase().includes(query);
        const matchesVoterId = (member.voterId || '').toLowerCase().includes(query);
        const matchesVillage = member.villageName.toLowerCase().includes(query);
        const matchesRole = member.role.toLowerCase().includes(query);

        if (!matchesName && !matchesKannada && !matchesPhone && !matchesVoterId && !matchesVillage && !matchesRole) {
          return false;
        }
      }

      return true;
    });
  }, [members, selectedVillageId, selectedRole, searchQuery]);

  // Metrics
  const totalMembersCount = members.length;
  const verifiedVoterIdCount = members.filter((m) => Boolean(m.voterId)).length;
  const coveredVillagesCount = new Set(members.map((m) => m.villageId)).size;
  const totalBoothsCovered = new Set(members.map((m) => `${m.villageId}-${m.boothNumber}`)).size;

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Name', 'Kannada Name', 'Contact Number', 'Voter ID (EPIC)', 'Village', 'Booth #', 'Ward #', 'Role', 'Status'];
    const rows = filteredMembers.map((m) => [
      `"${m.name}"`,
      `"${m.kannadaName || ''}"`,
      `"${m.phone}"`,
      `"${m.voterId || ''}"`,
      `"${m.villageName}"`,
      m.boothNumber,
      m.wardNumber,
      `"${m.role}"`,
      m.status,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `sindhanur_village_members_roster_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleStartTownhall = (villageId: string, villageName: string) => {
    if (onStartMeetingWithMember) {
      onStartMeetingWithMember(villageId, villageName);
    } else {
      startMeeting({
        title: `${villageName} Village Samvaad with Members`,
        type: 'Village',
        villageId,
        agenda: ['Local booth voter outreach', 'Grievance verification', 'Panchayat water & roads'],
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Header Strip */}
      <div className="bg-stone-900 rounded-3xl p-6 sm:p-8 text-white border border-stone-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[11px] font-bold tracking-wide uppercase flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                Village Cadre & Committee
              </span>
              <span className="text-xs text-stone-400 font-mono">AC-58 Sindhanur</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <span>Village Members Directory</span>
              <span className="text-base sm:text-lg font-normal text-stone-400">
                (ಗ್ರಾಮ ಸದಸ್ಯರು ಮತ್ತು ಬೂತ್ ಮುಖಂಡರು)
              </span>
            </h1>

            <p className="text-stone-300 text-xs sm:text-sm mt-1.5 max-w-2xl">
              Complete registry of designated village representatives, booth presidents, and grievance coordinators across all 124 villages of Sindhanur assembly constituency with official photo, verified contact number, and Voter ID card (EPIC).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold border border-stone-700 transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV Roster</span>
            </button>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-lg transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Enroll New Member</span>
            </button>
          </div>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-stone-800 text-xs">
          <div className="bg-white/5 rounded-xl p-3 border border-white/5">
            <span className="text-stone-400 block text-[11px]">Enrolled Members</span>
            <span className="text-xl sm:text-2xl font-bold text-white block mt-0.5">
              {totalMembersCount}
            </span>
            <span className="text-[10px] text-emerald-400 font-medium">Official Cadre Roster</span>
          </div>

          <div className="bg-white/5 rounded-xl p-3 border border-white/5">
            <span className="text-stone-400 block text-[11px]">Verified Voter IDs</span>
            <span className="text-xl sm:text-2xl font-bold text-indigo-300 block mt-0.5">
              {verifiedVoterIdCount} / {totalMembersCount}
            </span>
            <span className="text-[10px] text-emerald-400 font-medium">100% EPIC Validated</span>
          </div>

          <div className="bg-white/5 rounded-xl p-3 border border-white/5">
            <span className="text-stone-400 block text-[11px]">Villages Represented</span>
            <span className="text-xl sm:text-2xl font-bold text-amber-300 block mt-0.5">
              {coveredVillagesCount}
            </span>
            <span className="text-[10px] text-stone-300">of 124 Sindhanur Clusters</span>
          </div>

          <div className="bg-white/5 rounded-xl p-3 border border-white/5">
            <span className="text-stone-400 block text-[11px]">Polling Booths Covered</span>
            <span className="text-xl sm:text-2xl font-bold text-emerald-300 block mt-0.5">
              {totalBoothsCovered} Booths
            </span>
            <span className="text-[10px] text-stone-300">Ground In-Charge Active</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by Member Name, Contact Number, or Voter ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-xs rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-stone-50/50"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-stone-400 hover:text-stone-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Village Filter & Role Filter & View Toggle */}
          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-start md:justify-end">
            {/* Village Dropdown */}
            <div className="flex items-center gap-1.5 bg-stone-100 px-2.5 py-1.5 rounded-xl border border-stone-200 text-xs">
              <Building className="w-3.5 h-3.5 text-stone-500" />
              <select
                value={selectedVillageId}
                onChange={(e) => setSelectedVillageId(e.target.value)}
                className="bg-transparent text-xs font-semibold text-stone-800 focus:outline-hidden cursor-pointer"
              >
                <option value="all">All Villages ({villages.length})</option>
                {villages.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name} {v.kannadaName ? `(${v.kannadaName})` : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Role Dropdown */}
            <div className="flex items-center gap-1.5 bg-stone-100 px-2.5 py-1.5 rounded-xl border border-stone-200 text-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-stone-500" />
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="bg-transparent text-xs font-semibold text-stone-800 focus:outline-hidden cursor-pointer"
              >
                <option value="all">All Designations</option>
                {allRoles.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200">
              <button
                onClick={() => setViewMode('cards')}
                className={`p-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  viewMode === 'cards'
                    ? 'bg-white text-stone-900 shadow-2xs'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
                title="Cards Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-white text-stone-900 shadow-2xs'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
                title="Registry Table View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Filter Summary Tags */}
        {(selectedVillageId !== 'all' || selectedRole !== 'all' || searchQuery) && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-stone-100 text-xs">
            <span className="text-stone-500 text-[11px]">Filtered by:</span>
            {selectedVillageId !== 'all' && (
              <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1 text-[11px]">
                Village: {villages.find((v) => v.id === selectedVillageId)?.name}
                <button
                  onClick={() => setSelectedVillageId('all')}
                  className="hover:text-indigo-900"
                >
                  ×
                </button>
              </span>
            )}
            {selectedRole !== 'all' && (
              <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1 text-[11px]">
                Role: {selectedRole}
                <button
                  onClick={() => setSelectedRole('all')}
                  className="hover:text-indigo-900"
                >
                  ×
                </button>
              </span>
            )}
            {searchQuery && (
              <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1 text-[11px]">
                Query: "{searchQuery}"
                <button onClick={() => setSearchQuery('')} className="hover:text-indigo-900">
                  ×
                </button>
              </span>
            )}
            <button
              onClick={() => {
                setSelectedVillageId('all');
                setSelectedRole('all');
                setSearchQuery('');
              }}
              className="text-stone-500 hover:text-stone-800 text-[11px] underline ml-1 cursor-pointer"
            >
              Reset Filters
            </button>
            <span className="text-stone-400 text-[11px] ml-auto font-medium">
              Showing {filteredMembers.length} of {members.length} members
            </span>
          </div>
        )}
      </div>

      {/* Empty State */}
      {filteredMembers.length === 0 && (
        <div className="bg-white rounded-2xl p-12 text-center border border-stone-200 space-y-3">
          <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-stone-800">No Village Members Found</h3>
          <p className="text-xs text-stone-500 max-w-md mx-auto">
            No member matches your current search or filter criteria. Try changing filters or enroll a new member with their photo, contact number, and Voter ID.
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Enroll Village Member
          </button>
        </div>
      )}

      {/* View Mode 1: Cards Grid View */}
      {viewMode === 'cards' && filteredMembers.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMembers.map((member) => {
            const isCopied = copiedId === member.id;
            return (
              <div
                key={member.id}
                className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs hover:shadow-md hover:border-indigo-200 transition flex flex-col justify-between group relative overflow-hidden"
              >
                {/* Top Member Info Banner */}
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      {/* Photo with active indicator */}
                      <div className="relative shrink-0">
                        <img
                          src={member.avatarUrl}
                          alt={member.name}
                          className="w-14 h-14 rounded-2xl object-cover border-2 border-stone-200 group-hover:border-indigo-400 transition shadow-xs"
                          referrerPolicy="no-referrer"
                        />
                        <span
                          className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center ${
                            member.status === 'active' ? 'bg-emerald-500' : 'bg-stone-400'
                          }`}
                          title={`Status: ${member.status}`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-white" />
                        </span>
                      </div>

                      {/* Name & Kannada Name */}
                      <div>
                        <h3 className="text-sm font-bold text-stone-900 group-hover:text-indigo-600 transition leading-snug">
                          {member.name}
                        </h3>
                        {member.kannadaName && (
                          <p className="text-xs font-semibold text-stone-500">
                            {member.kannadaName}
                          </p>
                        )}
                        <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[10px] font-semibold">
                          {member.role}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => setInspectedMember(member)}
                      className="p-1 rounded-lg text-stone-400 hover:text-stone-800 hover:bg-stone-100 transition cursor-pointer shrink-0"
                      title="View Member ID Dossier"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Village & Polling Booth Tag */}
                  <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-1.5 mb-3">
                    <div className="flex items-center justify-between text-[11px] text-stone-600">
                      <span className="flex items-center gap-1 font-semibold text-stone-900">
                        <Building className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                        {member.villageName}
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-stone-200 text-stone-700 font-mono text-[10px] font-bold">
                        Ward {member.wardNumber} • Booth #{member.boothNumber}
                      </span>
                    </div>

                    {/* Key voter id box */}
                    <div className="pt-1.5 border-t border-stone-200 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <CreditCard className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span className="text-[10px] font-bold uppercase text-stone-500">
                          Voter ID (EPIC):
                        </span>
                        <span className="font-mono font-extrabold text-xs text-stone-900 tracking-wider">
                          {member.voterId || 'SIN58-PENDING'}
                        </span>
                      </div>

                      <button
                        onClick={() => handleCopyVoterId(member.voterId, member.id)}
                        className={`p-1 rounded-md text-[10px] font-semibold transition cursor-pointer flex items-center gap-1 ${
                          isCopied
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'hover:bg-stone-200 text-stone-600'
                        }`}
                        title="Copy Voter ID"
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Contact Number & Quick Actions */}
                  <div className="flex items-center justify-between py-1.5 px-2 bg-emerald-50/50 rounded-xl border border-emerald-100 text-xs mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                        <Phone className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span className="text-[9px] uppercase font-bold text-emerald-800 block">
                          Contact Number
                        </span>
                        <a
                          href={`tel:${member.phone}`}
                          className="font-mono font-bold text-xs text-emerald-950 hover:underline"
                        >
                          {member.phone}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <a
                        href={`https://wa.me/${member.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg bg-white text-emerald-700 hover:bg-emerald-600 hover:text-white border border-emerald-200 shadow-2xs transition cursor-pointer"
                        title="Chat on WhatsApp"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                      </a>
                      <a
                        href={`tel:${member.phone}`}
                        className="p-1.5 rounded-lg bg-white text-emerald-700 hover:bg-emerald-600 hover:text-white border border-emerald-200 shadow-2xs transition cursor-pointer"
                        title="Call Phone"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>

                  {/* Responsibilities pills */}
                  {member.responsibilities && member.responsibilities.length > 0 && (
                    <div className="space-y-1 mb-3">
                      <span className="text-[10px] text-stone-400 font-semibold block uppercase">
                        Assigned Responsibilities:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {member.responsibilities.slice(0, 2).map((res, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 text-[10px]"
                          >
                            {res}
                          </span>
                        ))}
                        {member.responsibilities.length > 2 && (
                          <span className="px-1.5 py-0.5 rounded-md bg-stone-100 text-stone-500 text-[10px]">
                            +{member.responsibilities.length - 2} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Footer Actions */}
                <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs mt-2">
                  <div className="text-[11px] text-stone-500">
                    <span className="font-semibold text-stone-800">{member.tasksResolved}</span>
                    <span>/{member.tasksAssigned} Grievances Redressed</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleStartTownhall(member.villageId, member.villageName)}
                      className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold flex items-center gap-1 border border-rose-200 transition cursor-pointer"
                      title="Start Video Meeting with Member"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Connect</span>
                    </button>
                    <button
                      onClick={() => setInspectedMember(member)}
                      className="px-2.5 py-1 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold transition cursor-pointer"
                    >
                      Dossier
                    </button>
                    {currentUser.role === 'ABHI_CANDIDATE' && (
                      <button
                        id={`btn-remove-member-card-${member.id}`}
                        onClick={() => setMemberToDelete(member)}
                        className="p-1.5 rounded-lg bg-stone-100 hover:bg-rose-50 text-stone-400 hover:text-rose-600 border border-transparent hover:border-rose-200 transition cursor-pointer"
                        title="Remove Member (Admin Access)"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* View Mode 2: Official Registry Table View */}
      {viewMode === 'table' && filteredMembers.length > 0 && (
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-700">
              <thead className="bg-stone-100 text-stone-800 font-bold border-b border-stone-200">
                <tr>
                  <th className="py-3 px-4">Member & Photo</th>
                  <th className="py-3 px-4">Contact Number</th>
                  <th className="py-3 px-4">Voter ID (EPIC)</th>
                  <th className="py-3 px-4">Village & Booth</th>
                  <th className="py-3 px-4">Designation & Role</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {filteredMembers.map((member) => {
                  const isCopied = copiedId === member.id;
                  return (
                    <tr
                      key={member.id}
                      className="hover:bg-stone-50/80 transition group"
                    >
                      {/* Photo & Name */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={member.avatarUrl}
                            alt={member.name}
                            className="w-10 h-10 rounded-xl object-cover border border-stone-200 shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <div className="font-bold text-stone-900">{member.name}</div>
                            {member.kannadaName && (
                              <div className="text-[11px] text-stone-500">
                                {member.kannadaName}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Contact Number */}
                      <td className="py-3 px-4 font-mono">
                        <div className="flex items-center gap-2">
                          <a
                            href={`tel:${member.phone}`}
                            className="font-bold text-emerald-800 hover:underline"
                          >
                            {member.phone}
                          </a>
                          <a
                            href={`https://wa.me/${member.phone.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-emerald-600 hover:text-emerald-800"
                            title="WhatsApp Chat"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </td>

                      {/* Voter ID */}
                      <td className="py-3 px-4 font-mono">
                        <div className="flex items-center gap-1.5">
                          <span className="font-extrabold text-stone-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 tracking-wider">
                            {member.voterId || 'SIN58-PENDING'}
                          </span>
                          <button
                            onClick={() => handleCopyVoterId(member.voterId, member.id)}
                            className="p-1 text-stone-400 hover:text-stone-700 transition cursor-pointer"
                            title="Copy Voter ID"
                          >
                            {isCopied ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Village & Booth */}
                      <td className="py-3 px-4">
                        <div className="font-semibold text-stone-900">{member.villageName}</div>
                        <div className="text-[10px] text-stone-500 font-mono">
                          Ward {member.wardNumber} • Booth #{member.boothNumber}
                        </div>
                      </td>

                      {/* Designation */}
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 rounded-md bg-stone-100 text-stone-800 font-medium text-[11px]">
                          {member.role}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            member.status === 'active'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-stone-200 text-stone-600'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              member.status === 'active' ? 'bg-emerald-500' : 'bg-stone-400'
                            }`}
                          />
                          {member.status.toUpperCase()}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleStartTownhall(member.villageId, member.villageName)}
                            className="p-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 transition cursor-pointer"
                            title="Video Call"
                          >
                            <Video className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setInspectedMember(member)}
                            className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold transition cursor-pointer"
                          >
                            View Card
                          </button>
                          {currentUser.role === 'ABHI_CANDIDATE' && (
                            <button
                              id={`btn-remove-member-table-${member.id}`}
                              onClick={() => setMemberToDelete(member)}
                              className="p-1.5 rounded-lg bg-stone-100 hover:bg-rose-50 text-stone-400 hover:text-rose-600 border border-transparent hover:border-rose-200 transition cursor-pointer"
                              title="Remove Member (Admin Access)"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Member Dossier & Official ID Card Modal */}
      {inspectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-stone-900 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-400" />
                <h3 className="text-sm font-bold">
                  Official Village Representative ID Card
                </h3>
              </div>
              <button
                onClick={() => setInspectedMember(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Official ID Card Layout */}
            <div className="p-6 space-y-5">
              <div className="relative rounded-2xl p-6 bg-radial from-stone-900 to-stone-950 text-white border-2 border-indigo-500/40 shadow-xl overflow-hidden">
                {/* Background Watermark */}
                <div className="absolute top-2 right-4 text-white/5 font-extrabold text-7xl select-none pointer-events-none">
                  AC-58
                </div>

                {/* Card Top Strip */}
                <div className="flex justify-between items-start border-b border-white/10 pb-3 mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                      🏛️
                    </div>
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                        Constituency Connect • Sindhanur
                      </div>
                      <div className="text-[10px] text-stone-400">
                        Karnataka Legislative Assembly (AC-58)
                      </div>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                    VERIFIED CADRE
                  </span>
                </div>

                {/* Photo and Details Grid */}
                <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
                  <img
                    src={inspectedMember.avatarUrl}
                    alt={inspectedMember.name}
                    className="w-24 h-28 rounded-xl object-cover border-2 border-indigo-400 shadow-md shrink-0"
                    referrerPolicy="no-referrer"
                  />

                  <div className="space-y-2 flex-1 text-center sm:text-left">
                    <div>
                      <h4 className="text-lg font-bold text-white">
                        {inspectedMember.name}
                      </h4>
                      {inspectedMember.kannadaName && (
                        <p className="text-xs font-medium text-stone-300">
                          {inspectedMember.kannadaName}
                        </p>
                      )}
                      <div className="text-xs font-semibold text-indigo-300 mt-0.5">
                        {inspectedMember.role}
                      </div>
                    </div>

                    {/* Official Voter ID card box */}
                    <div className="p-2 bg-white/10 rounded-xl border border-white/10 text-xs">
                      <span className="text-[9px] uppercase font-bold text-stone-400 block">
                        Official Election Commission Voter ID (EPIC):
                      </span>
                      <span className="font-mono font-black text-sm text-amber-300 tracking-wider">
                        {inspectedMember.voterId || 'SIN58-PENDING'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-[9px] uppercase text-stone-400 block">
                          Village:
                        </span>
                        <span className="font-semibold text-white">
                          {inspectedMember.villageName}
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase text-stone-400 block">
                          Booth & Ward:
                        </span>
                        <span className="font-semibold text-white font-mono">
                          Booth #{inspectedMember.boothNumber}, Ward {inspectedMember.wardNumber}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Strip */}
                <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1.5 text-stone-300 font-mono">
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{inspectedMember.phone}</span>
                  </div>

                  <div className="text-[10px] text-stone-400">
                    Enrolled: {inspectedMember.joinedDate}
                  </div>
                </div>
              </div>

              {/* Responsibilities & Tasks handled */}
              <div className="space-y-2 text-xs">
                <span className="font-bold text-stone-800 uppercase text-[11px] block">
                  Designated Responsibilities:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {inspectedMember.responsibilities.map((resp, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-stone-100 text-stone-700 text-xs font-medium"
                    >
                      • {resp}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-stone-200 flex flex-wrap justify-between items-center gap-2">
                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${inspectedMember.phone}`}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Phone className="w-3.5 h-3.5" /> Call Member
                  </a>

                  {currentUser.role === 'ABHI_CANDIDATE' && (
                    <button
                      id="btn-dossier-remove-member"
                      type="button"
                      onClick={() => setMemberToDelete(inspectedMember)}
                      className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-rose-50 text-rose-700 hover:text-rose-800 text-xs font-bold border border-rose-200 flex items-center gap-1.5 cursor-pointer transition"
                      title="Remove Member from Party Records"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove Member</span>
                    </button>
                  )}
                </div>

                <button
                  onClick={() => {
                    handleStartTownhall(inspectedMember.villageId, inspectedMember.villageName);
                    setInspectedMember(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Video className="w-3.5 h-3.5" /> Start Video Meeting
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Remove Member Confirmation Modal (Admin Access) */}
      {memberToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900">
                  Remove Village Member?
                </h3>
                <p className="text-xs text-stone-500">
                  Administrative action for Sindhanur AC-58
                </p>
              </div>
            </div>

            <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-700 space-y-1.5">
              <p>
                Are you sure you want to remove <strong>{memberToDelete.name}</strong> from the official records?
              </p>
              <div className="text-[11px] text-stone-500 space-y-0.5 pt-1">
                <div>• Designation: <strong className="text-stone-700">{memberToDelete.role}</strong></div>
                <div>• Village: <strong className="text-stone-700">{memberToDelete.villageName}</strong> (Ward {memberToDelete.wardNumber}, Booth #{memberToDelete.boothNumber})</div>
                <div>• EPIC Voter ID: <strong className="text-stone-700">{memberToDelete.voterId || 'N/A'}</strong></div>
                <div>• Phone: <strong className="text-stone-700 font-mono">{memberToDelete.phone}</strong></div>
              </div>
            </div>

            <p className="text-xs text-amber-800 bg-amber-50 p-2.5 rounded-lg border border-amber-200 flex items-start gap-1.5">
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
              <span>
                This will revoke their active booth agent status and decrement the registered party members count for {memberToDelete.villageName}.
              </span>
            </p>

            <div className="flex justify-end items-center gap-2.5 pt-2">
              <button
                id="btn-cancel-remove-member"
                type="button"
                onClick={() => setMemberToDelete(null)}
                className="px-4 py-2 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs font-semibold cursor-pointer transition"
              >
                Cancel
              </button>
              <button
                id="btn-confirm-remove-member"
                type="button"
                onClick={() => {
                  removePartyMember(memberToDelete.id);
                  if (inspectedMember?.id === memberToDelete.id) {
                    setInspectedMember(null);
                  }
                  setMemberToDelete(null);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs cursor-pointer transition flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Confirm & Remove</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      <AddMemberModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        defaultVillageId={selectedVillageId !== 'all' ? selectedVillageId : undefined}
      />
    </div>
  );
};
