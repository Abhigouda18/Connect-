import React, { useState } from 'react';
import {
  UserCheck,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  Camera,
  AlertTriangle,
  Send,
  Users,
  Shield,
  Video,
  FileCheck,
  Filter,
} from 'lucide-react';
import { useConstituency } from '../../context/ConstituencyContext';
import { Issue, IssueStatus } from '../../types';

interface FieldWorkerPortalProps {
  onSelectIssue: (id: string) => void;
}

export const FieldWorkerPortal: React.FC<FieldWorkerPortalProps> = ({ onSelectIssue }) => {
  const {
    currentUser,
    issues,
    villages,
    members,
    updateIssueStatus,
    meetings,
    joinMeeting,
  } = useConstituency();

  const [activeTab, setActiveTab] = useState<'my_tasks' | 'village_feed' | 'booth_summary'>('my_tasks');
  const [taskStatusFilter, setTaskStatusFilter] = useState<string>('all');
  const [selectedTaskForQuickAction, setSelectedTaskForQuickAction] = useState<Issue | null>(null);
  const [quickNote, setQuickNote] = useState('');
  const [quickPhoto, setQuickPhoto] = useState('');
  const [targetStatus, setTargetStatus] = useState<IssueStatus>('In Progress');

  // Find member profile
  const memberProfile = members.find((m) => m.id === 'mem_01') || members[0];
  const userVillage = villages.find((v) => v.id === currentUser.villageId) || villages[0];

  // Tasks assigned specifically to this field worker or in their village
  const myAssignedIssues = issues.filter(
    (i) => i.assignedTo?.memberId === memberProfile.id || i.assignedTo?.name === currentUser.name
  );

  const villageAllIssues = issues.filter((i) => i.villageId === currentUser.villageId);

  const filteredTasks = myAssignedIssues.filter((i) => {
    if (taskStatusFilter === 'active') return i.status === 'Assigned' || i.status === 'In Progress';
    if (taskStatusFilter === 'resolved') return i.status === 'Resolved' || i.status === 'Citizen Confirmed';
    return true;
  });

  const handleQuickStatusSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTaskForQuickAction || !quickNote.trim()) return;

    updateIssueStatus(
      selectedTaskForQuickAction.id,
      targetStatus,
      quickNote,
      quickPhoto || undefined
    );

    setSelectedTaskForQuickAction(null);
    setQuickNote('');
    setQuickPhoto('');
  };

  const liveMeeting = meetings.find((m) => m.status === 'live');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Field Worker Header Card */}
      <div className="bg-gradient-to-r from-amber-950 via-stone-900 to-stone-900 text-white rounded-2xl p-6 shadow-md border border-amber-900/50">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-600 text-white flex items-center justify-center font-bold text-xl shadow-md shrink-0">
              👷
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Ground Field Coordinator
                </span>
                <span className="text-xs text-stone-400">
                  {userVillage.mandal}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight mt-1">
                {currentUser.name}
              </h1>
              <p className="text-xs text-stone-300 mt-0.5">
                {currentUser.designation || 'Booth In-Charge & Village Grievance Lead'} • {currentUser.villageName} (Booth #{currentUser.boothNumber})
              </p>
            </div>
          </div>

          {liveMeeting && (
            <button
              onClick={() => joinMeeting(liveMeeting.id)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md cursor-pointer transition animate-pulse"
            >
              <Video className="w-4 h-4" />
              Join Live Village Townhall
            </button>
          )}
        </div>

        {/* Metric tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-stone-800">
          <div className="bg-white/5 rounded-xl p-3">
            <span className="text-[11px] text-stone-400 font-medium">My Active Tasks</span>
            <span className="text-xl sm:text-2xl font-bold text-amber-400 block mt-0.5">
              {myAssignedIssues.filter((i) => i.status === 'Assigned' || i.status === 'In Progress').length}
            </span>
          </div>
          <div className="bg-white/5 rounded-xl p-3">
            <span className="text-[11px] text-stone-400 font-medium">Tasks Resolved</span>
            <span className="text-xl sm:text-2xl font-bold text-emerald-400 block mt-0.5">
              {myAssignedIssues.filter((i) => i.status === 'Resolved' || i.status === 'Citizen Confirmed').length}
            </span>
          </div>
          <div className="bg-white/5 rounded-xl p-3">
            <span className="text-[11px] text-stone-400 font-medium">Village Registered Members</span>
            <span className="text-xl sm:text-2xl font-bold text-stone-200 block mt-0.5">
              {userVillage.registeredMembers}
            </span>
          </div>
          <div className="bg-white/5 rounded-xl p-3">
            <span className="text-[11px] text-stone-400 font-medium">Booth Population</span>
            <span className="text-xl sm:text-2xl font-bold text-stone-200 block mt-0.5">
              {userVillage.population.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
        <button
          onClick={() => setActiveTab('my_tasks')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === 'my_tasks'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          My Field Tasks ({myAssignedIssues.length})
        </button>
        <button
          onClick={() => setActiveTab('village_feed')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === 'village_feed'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          Entire Village Feed ({villageAllIssues.length})
        </button>
        <button
          onClick={() => setActiveTab('booth_summary')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === 'booth_summary'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          Booth Directory & Workers
        </button>
      </div>

      {/* Main tab content */}
      {activeTab === 'my_tasks' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-xs text-stone-500">
              Tasks routed to you by the ABHI Central War Room for ground inspection and department escalation.
            </div>

            <div className="flex items-center gap-1.5">
              {[
                { id: 'all', label: 'All Tasks' },
                { id: 'active', label: 'Pending Action' },
                { id: 'resolved', label: 'Resolved / Signed Off' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setTaskStatusFilter(f.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition ${
                    taskStatusFilter === f.id
                      ? 'bg-stone-900 text-white'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs hover:shadow-md transition space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-stone-100 text-stone-800">
                      {task.ticketNumber}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                        task.status === 'Resolved' || task.status === 'Citizen Confirmed'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : 'bg-amber-50 text-amber-800 border-amber-300'
                      }`}
                    >
                      {task.status}
                    </span>
                  </div>

                  <h3
                    onClick={() => onSelectIssue(task.id)}
                    className="font-bold text-sm text-stone-900 hover:text-amber-700 cursor-pointer mt-2"
                  >
                    {task.title}
                  </h3>

                  <p className="text-xs text-stone-600 line-clamp-2 mt-1">
                    {task.description}
                  </p>

                  <div className="mt-3 pt-2 border-t border-stone-100 space-y-1.5 text-xs text-stone-600">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      <span>
                        Ward {task.wardNumber} • {task.landmark}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-stone-500">
                        <Phone className="w-3.5 h-3.5" />
                        <span>Resident: {task.reportedBy.name}</span>
                      </div>
                      <a
                        href={`tel:${task.reportedBy.phone}`}
                        className="text-[11px] font-bold text-indigo-600 hover:underline"
                      >
                        {task.reportedBy.phone}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Ground action button */}
                <div className="pt-2 flex items-center justify-between gap-2 border-t border-stone-100">
                  <button
                    onClick={() => onSelectIssue(task.id)}
                    className="text-xs font-semibold text-stone-600 hover:text-stone-900 cursor-pointer"
                  >
                    Full History →
                  </button>

                  <button
                    onClick={() => {
                      setSelectedTaskForQuickAction(task);
                      setTargetStatus(task.status === 'Assigned' ? 'In Progress' : 'Resolved');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Update Progress
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Action Modal for Field Worker */}
      {selectedTaskForQuickAction && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center border-b border-stone-100 pb-3">
              <div>
                <span className="font-mono text-xs font-bold text-amber-700">
                  {selectedTaskForQuickAction.ticketNumber}
                </span>
                <h3 className="font-bold text-base text-stone-900">
                  Log Field Progress & Proof
                </h3>
              </div>
              <button
                onClick={() => setSelectedTaskForQuickAction(null)}
                className="text-stone-400 hover:text-stone-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleQuickStatusSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  Change Status To:
                </label>
                <select
                  value={targetStatus}
                  onChange={(e) => setTargetStatus(e.target.value as IssueStatus)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 text-xs bg-white"
                >
                  <option value="In Progress">In Progress (Inspection/Action Underway)</option>
                  <option value="Resolved">Resolved (Submit for Citizen Confirmation)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  Field Update Note / Actions Taken <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="e.g. Visited site with Panchayat Secretary, inspected water pipeline, replacement clamp fixed..."
                  value={quickNote}
                  onChange={(e) => setQuickNote(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 text-xs resize-none focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  Proof Photo URL (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Paste URL or sample link..."
                  value={quickPhoto}
                  onChange={(e) => setQuickPhoto(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedTaskForQuickAction(null)}
                  className="px-4 py-2 rounded-xl border border-stone-300 text-stone-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold cursor-pointer"
                >
                  Save & Notify ABHI Office
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Entire Village Feed Tab */}
      {activeTab === 'village_feed' && (
        <div className="space-y-3">
          <div className="text-xs text-stone-500">
            All citizen reports in <strong>{userVillage.name}</strong> across all wards.
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden divide-y divide-stone-100">
            {villageAllIssues.map((iss) => (
              <div
                key={iss.id}
                onClick={() => onSelectIssue(iss.id)}
                className="p-4 hover:bg-stone-50 cursor-pointer flex items-center justify-between gap-4 text-xs transition"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-stone-700">
                      {iss.ticketNumber}
                    </span>
                    <span className="font-semibold text-stone-900 text-sm">
                      {iss.title}
                    </span>
                  </div>
                  <div className="text-stone-500">
                    Ward {iss.wardNumber} • {iss.landmark} • Urgency: {iss.urgency}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="px-2.5 py-1 rounded-full font-bold text-[11px] bg-stone-100 text-stone-700">
                    {iss.status}
                  </span>
                  <span className="text-amber-600 font-bold hover:underline">
                    View →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Booth Summary Tab */}
      {activeTab === 'booth_summary' && (
        <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-5">
          <div>
            <h3 className="text-base font-bold text-stone-900">
              Booth #{currentUser.boothNumber || 4} & Village Organizational Structure
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Sindhanur Constituency (AC-58) → {currentUser.villageName || 'Alabanoor'} Gram Panchayat
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
              <span className="text-xs text-stone-500 block">Total Booth Voters</span>
              <span className="text-xl font-bold text-stone-900 mt-1 block">1,120</span>
              <span className="text-[11px] text-emerald-600 font-medium">84% Voter Slip distributed</span>
            </div>
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
              <span className="text-xs text-stone-500 block">Active Party Volunteers</span>
              <span className="text-xl font-bold text-stone-900 mt-1 block">24</span>
              <span className="text-[11px] text-stone-500">Across 5 page committees</span>
            </div>
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
              <span className="text-xs text-stone-500 block">Village Resolution Score</span>
              <span className="text-xl font-bold text-emerald-600 mt-1 block">92.4%</span>
              <span className="text-[11px] text-stone-500">48 of 52 issues cleared</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-3">
              Key Booth Workers in Kannamangala
            </h4>
            <div className="space-y-2">
              {members
                .filter((m) => m.villageId === 'vil_01')
                .map((m) => (
                  <div
                    key={m.id}
                    className="p-3 bg-stone-50 rounded-xl flex items-center justify-between border border-stone-200 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={m.avatarUrl}
                        alt={m.name}
                        className="w-8 h-8 rounded-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <span className="font-bold text-stone-900 block">{m.name}</span>
                        <span className="text-stone-500 text-[11px]">{m.role}</span>
                      </div>
                    </div>
                    <a
                      href={`tel:${m.phone}`}
                      className="px-3 py-1 rounded-lg bg-white border border-stone-300 text-stone-800 font-bold hover:bg-stone-100 cursor-pointer"
                    >
                      {m.phone}
                    </a>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
