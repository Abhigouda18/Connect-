import React, { useState } from 'react';
import {
  Users,
  MapPin,
  CheckCircle2,
  Clock,
  Video,
  PlusCircle,
  Megaphone,
  Filter,
  UserCheck,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  Building,
  Radio,
  Share2,
  Plus,
} from 'lucide-react';
import { useConstituency } from '../../context/ConstituencyContext';
import { ConstituencyMap } from './ConstituencyMap';
import { VillageDirectory } from './VillageDirectory';
import { AssignIssueModal } from './AssignIssueModal';
import { CreateAnnouncementModal } from './CreateAnnouncementModal';
import { AddVillageModal } from './AddVillageModal';
import { VillageMembersList } from './VillageMembersList';
import { Issue, MeetingType } from '../../types';

interface AdminDashboardProps {
  onSelectIssue: (id: string) => void;
  onOpenReportModal: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onSelectIssue,
  onOpenReportModal,
}) => {
  const {
    villages,
    issues,
    members,
    announcements,
    meetings,
    startMeeting,
    joinMeeting,
    currentUser,
    activeView,
    setActiveView,
    setSelectedVillageId,
    constituency,
  } = useConstituency();

  const [activeTab, setActiveTab] = useState<'map' | 'issues' | 'villages' | 'members' | 'meetings' | 'announcements'>('map');
  const [assignModalIssue, setAssignModalIssue] = useState<Issue | null>(null);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [showStartMeetingModal, setShowStartMeetingModal] = useState(false);
  const [showAddVillageModal, setShowAddVillageModal] = useState(false);

  // New meeting form
  const [meetingTitle, setMeetingTitle] = useState('');
  const [meetingType, setMeetingType] = useState<MeetingType>('Village');
  const [meetingVillageId, setMeetingVillageId] = useState(villages[0]?.id || '');
  const [meetingAgenda, setMeetingAgenda] = useState('RO Water supply repairs, road widening, voter outreach');

  // Filter states for issues table
  const [issueCategoryFilter, setIssueCategoryFilter] = useState('all');
  const [issueStatusFilter, setIssueStatusFilter] = useState('all');
  const [issueVillageFilter, setIssueVillageFilter] = useState('all');

  // Stats calculation
  const totalRegisteredMembers = villages.reduce((acc, v) => acc + v.registeredMembers, 0);
  const totalBoothsCount = villages.reduce((acc, v) => acc + (v.boothsCount || 0), 0);
  const totalOpenIssues = issues.filter((i) => i.status !== 'Resolved' && i.status !== 'Citizen Confirmed').length;
  const totalResolvedIssues = issues.filter((i) => i.status === 'Resolved' || i.status === 'Citizen Confirmed').length;
  const criticalIssuesCount = issues.filter((i) => i.urgency === 'critical' && i.status !== 'Resolved').length;

  const filteredIssues = issues.filter((i) => {
    if (issueCategoryFilter !== 'all' && i.category !== issueCategoryFilter) return false;
    if (issueStatusFilter !== 'all' && i.status !== issueStatusFilter) return false;
    if (issueVillageFilter !== 'all' && i.villageId !== issueVillageFilter) return false;
    return true;
  });

  const handleStartMeetingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!meetingTitle.trim()) return;

    startMeeting({
      title: meetingTitle,
      type: meetingType,
      villageId: meetingType === 'Village' ? meetingVillageId : undefined,
      agenda: meetingAgenda.split(',').map((a) => a.trim()),
    });

    setShowStartMeetingModal(false);
  };

  const handleDirectVillageMeeting = (villageId: string, villageName: string) => {
    startMeeting({
      title: `${villageName} Village Samvaad with ABHI Suresh Hegde`,
      type: 'Village',
      villageId,
      agenda: ['Local grievance redressal', 'Water & electricity updates', 'Open constituent dialogue'],
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top War Room Header & Hero KPI Strip */}
      <div className="bg-gradient-to-r from-stone-900 via-indigo-950 to-stone-900 text-white rounded-2xl p-6 shadow-lg border border-stone-800">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>CENTRAL COMMAND & ASSEMBLY ENGAGEMENT WAR ROOM</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight mt-1">
              {constituency.name} Constituency (AC-{constituency.acNumber})
            </h1>
            <p className="text-xs sm:text-sm text-stone-300 mt-0.5">
              Candidate: <strong>{constituency.candidateName}</strong> • {villages.length} Villages • {constituency.district} District, {constituency.state}
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              id="btn-admin-add-village-header"
              onClick={() => setShowAddVillageModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold shadow-md cursor-pointer transition"
            >
              <Plus className="w-4 h-4" />
              <span>Add Village</span>
            </button>

            <button
              onClick={() => setShowStartMeetingModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md cursor-pointer transition"
            >
              <Video className="w-4 h-4" />
              <span>Start Village Meeting</span>
            </button>

            <button
              onClick={() => setShowAnnouncementModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md cursor-pointer transition"
            >
              <Megaphone className="w-4 h-4" />
              <span>Broadcast Announcement</span>
            </button>
          </div>
        </div>

        {/* 5-Column High Density Metric Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-6 pt-5 border-t border-stone-800">
          <div className="bg-white/5 rounded-xl p-3 border border-white/5">
            <span className="text-[11px] text-stone-400 font-medium">Total Registered Members</span>
            <span className="text-xl sm:text-2xl font-bold text-white block mt-0.5">
              {totalRegisteredMembers.toLocaleString()}
            </span>
            <span className="text-[10px] text-emerald-400 font-semibold">100% Booth Coverage</span>
          </div>

          <div className="bg-white/5 rounded-xl p-3 border border-white/5">
            <span className="text-[11px] text-stone-400 font-medium">Villages & Panchayats</span>
            <span className="text-xl sm:text-2xl font-bold text-white block mt-0.5">
              {villages.length} <span className="text-xs text-stone-400 font-normal">Clusters</span>
            </span>
            <span className="text-[10px] text-stone-300">{totalBoothsCount} Polling Booths</span>
          </div>

          <div className="bg-white/5 rounded-xl p-3 border border-white/5">
            <span className="text-[11px] text-stone-400 font-medium">Open Grievances</span>
            <span className="text-xl sm:text-2xl font-bold text-amber-400 block mt-0.5">
              {totalOpenIssues}
            </span>
            <span className="text-[10px] text-rose-400 font-medium">
              {criticalIssuesCount} High/Emergency
            </span>
          </div>

          <div className="bg-white/5 rounded-xl p-3 border border-white/5">
            <span className="text-[11px] text-stone-400 font-medium">Resolved & Confirmed</span>
            <span className="text-xl sm:text-2xl font-bold text-emerald-400 block mt-0.5">
              {totalResolvedIssues}
            </span>
            <span className="text-[10px] text-emerald-300 font-semibold">94.6% Resolution Rate</span>
          </div>

          <div className="bg-white/5 rounded-xl p-3 border border-white/5 col-span-2 sm:col-span-1">
            <span className="text-[11px] text-stone-400 font-medium">Avg Response Time</span>
            <span className="text-xl sm:text-2xl font-bold text-indigo-300 block mt-0.5">
              18.4 hrs
            </span>
            <span className="text-[10px] text-stone-300">Target: &lt; 24 hrs</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('map')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'map'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <MapPin className="w-3.5 h-3.5 text-amber-400" />
          Constituency Map & Triage
        </button>

        <button
          onClick={() => setActiveTab('villages')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'villages'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <Building className="w-3.5 h-3.5 text-indigo-400" />
          Village-Wise Directory
        </button>

        <button
          id="tab-admin-village-members"
          onClick={() => setActiveTab('members')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'members'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <Users className="w-3.5 h-3.5 text-indigo-400" />
          Village Members List ({members.length})
        </button>

        <button
          onClick={() => setActiveTab('issues')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'issues'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          Grievances Master Queue ({issues.length})
        </button>

        <button
          onClick={() => setActiveTab('meetings')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'meetings'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <Video className="w-3.5 h-3.5 text-rose-400" />
          Town Halls & Meetings ({meetings.length})
        </button>

        <button
          onClick={() => setActiveTab('announcements')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'announcements'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <Megaphone className="w-3.5 h-3.5 text-amber-500" />
          Development Works & Sanctions
        </button>
      </div>

      {/* Tab 1: Map & Live Triage */}
      {activeTab === 'map' && (
        <div className="space-y-6">
          <ConstituencyMap
            onSelectIssue={onSelectIssue}
            onSelectVillage={(vId) => {
              setSelectedVillageId(vId);
              setActiveTab('villages');
            }}
          />

          {/* Urgent Pending Triage Dispatch Grid */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <span>Immediate Triage Dispatch Queue</span>
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Grievances awaiting assignment to local village coordinators or government department escalation
                </p>
              </div>

              <span className="text-xs font-bold text-indigo-700">
                {issues.filter((i) => i.status === 'Received').length} unassigned tickets
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {issues
                .filter((i) => i.status === 'Received' || i.urgency === 'critical')
                .slice(0, 4)
                .map((iss) => (
                  <div
                    key={iss.id}
                    className="p-4 rounded-xl border border-stone-200 bg-stone-50 hover:bg-white hover:border-indigo-300 transition space-y-2 text-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="font-mono font-bold text-stone-800">
                          {iss.ticketNumber}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            iss.urgency === 'critical'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {iss.urgency.toUpperCase()}
                        </span>
                      </div>

                      <h4
                        onClick={() => onSelectIssue(iss.id)}
                        className="font-bold text-sm text-stone-900 hover:text-indigo-600 cursor-pointer mt-1"
                      >
                        {iss.title}
                      </h4>
                      <p className="text-stone-600 line-clamp-2 mt-1">
                        {iss.description}
                      </p>

                      <div className="mt-2 text-[11px] text-stone-500">
                        {iss.villageName} • Ward {iss.wardNumber} • {iss.landmark}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-stone-200 flex justify-between items-center">
                      <span className="text-[11px] text-stone-400">
                        Resident: {iss.reportedBy.name}
                      </span>
                      <button
                        onClick={() => setAssignModalIssue(iss)}
                        className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs cursor-pointer shadow-xs"
                      >
                        Assign to Field Team →
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Village-Wise Directory */}
      {activeTab === 'villages' && (
        <VillageDirectory
          onSelectIssue={onSelectIssue}
          onStartVillageMeeting={handleDirectVillageMeeting}
        />
      )}

      {/* Tab 3: Grievances Master Queue */}
      {activeTab === 'issues' && (
        <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-base font-bold text-stone-900">
                All Constituency Grievance Records ({filteredIssues.length})
              </h3>
              <p className="text-xs text-stone-500">
                End-to-end transparent record: Citizen → Local Coordinator → Team → Department → Resolution
              </p>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2 flex-wrap">
              <select
                value={issueVillageFilter}
                onChange={(e) => setIssueVillageFilter(e.target.value)}
                className="p-2 text-xs rounded-xl border border-stone-300 bg-white"
              >
                <option value="all">All Villages</option>
                {villages.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name}
                  </option>
                ))}
              </select>

              <select
                value={issueCategoryFilter}
                onChange={(e) => setIssueCategoryFilter(e.target.value)}
                className="p-2 text-xs rounded-xl border border-stone-300 bg-white"
              >
                <option value="all">All Categories</option>
                <option value="water">Drinking Water</option>
                <option value="roads">Roads & Potholes</option>
                <option value="electricity">Electricity</option>
                <option value="streetlights">Streetlights</option>
                <option value="drainage">Drainage</option>
                <option value="healthcare">Healthcare</option>
              </select>

              <select
                value={issueStatusFilter}
                onChange={(e) => setIssueStatusFilter(e.target.value)}
                className="p-2 text-xs rounded-xl border border-stone-300 bg-white"
              >
                <option value="all">All Statuses</option>
                <option value="Received">Received</option>
                <option value="Assigned">Assigned</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Citizen Confirmed">Citizen Confirmed</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-stone-50 text-stone-600 uppercase text-[10px] tracking-wider border-y border-stone-200">
                <tr>
                  <th className="py-3 px-3">Ticket & Title</th>
                  <th className="py-3 px-3">Village & Ward</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Assigned Coordinator</th>
                  <th className="py-3 px-3">Citizen Verification</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredIssues.map((iss) => (
                  <tr
                    key={iss.id}
                    onClick={() => onSelectIssue(iss.id)}
                    className="hover:bg-stone-50 cursor-pointer transition"
                  >
                    <td className="py-3 px-3">
                      <span className="font-mono font-bold text-stone-700 block">
                        {iss.ticketNumber}
                      </span>
                      <span className="font-bold text-stone-900 block max-w-xs truncate">
                        {iss.title}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-stone-600">
                      <strong>{iss.villageName}</strong>
                      <span className="block text-stone-400 text-[11px]">Ward {iss.wardNumber}</span>
                    </td>

                    <td className="py-3 px-3 capitalize text-stone-700">
                      {iss.category}
                    </td>

                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          iss.status === 'Citizen Confirmed'
                            ? 'bg-purple-100 text-purple-800'
                            : iss.status === 'Resolved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : iss.status === 'In Progress'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-stone-100 text-stone-700'
                        }`}
                      >
                        {iss.status}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-stone-700">
                      {iss.assignedTo ? (
                        <div>
                          <span className="font-bold">{iss.assignedTo.name}</span>
                          <span className="block text-stone-400 text-[10px]">
                            {iss.department || 'Ground Coordinator'}
                          </span>
                        </div>
                      ) : (
                        <span className="text-amber-600 font-semibold">Unassigned</span>
                      )}
                    </td>

                    <td className="py-3 px-3">
                      {iss.citizenRating ? (
                        <span className="text-emerald-700 font-bold flex items-center gap-1">
                          ★ {iss.citizenRating.rating}/5 Confirmed
                        </span>
                      ) : (
                        <span className="text-stone-400 text-[11px]">Pending sign-off</span>
                      )}
                    </td>

                    <td className="py-3 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setAssignModalIssue(iss)}
                        className="px-2.5 py-1 rounded bg-stone-100 hover:bg-indigo-600 hover:text-white font-bold text-[11px] text-stone-700 transition"
                      >
                        {iss.assignedTo ? 'Re-assign' : 'Assign'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3.5: Village Members Directory */}
      {activeTab === 'members' && (
        <VillageMembersList />
      )}

      {/* Tab 4: Town Halls & Video Samvaad */}
      {activeTab === 'meetings' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-bold text-stone-900">
                Village & Constituency Video Conferences ("Jan Samvaad")
              </h3>
              <p className="text-xs text-stone-500">
                Host town halls directly with specific villages, booth cadres, or the entire constituency
              </p>
            </div>

            <button
              onClick={() => setShowStartMeetingModal(true)}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Video className="w-4 h-4" />
              Start New Townhall
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {meetings.map((meet) => (
              <div
                key={meet.id}
                className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-stone-100 text-stone-800">
                      {meet.type} Meeting
                    </span>

                    {meet.status === 'live' ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center gap-1 animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-white" />
                        LIVE NOW
                      </span>
                    ) : (
                      <span className="text-xs text-stone-400">{meet.scheduledAt}</span>
                    )}
                  </div>

                  <h4 className="font-bold text-base text-stone-900 mt-2">
                    {meet.title}
                  </h4>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Target: {meet.villageName || 'All Assembly Constituents'} • Host: {meet.hostName}
                  </p>

                  <div className="mt-3 pt-3 border-t border-stone-100 space-y-1 text-xs">
                    <span className="font-bold text-stone-700 block text-[11px] uppercase">
                      Agenda:
                    </span>
                    <ul className="list-disc pl-4 space-y-0.5 text-stone-600">
                      {meet.agenda.map((ag, idx) => (
                        <li key={idx}>{ag}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-100 flex justify-between items-center">
                  <span className="text-xs text-stone-500">
                    👥 {meet.participantsCount} participants
                  </span>
                  <button
                    onClick={() => joinMeeting(meet.id)}
                    className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <Video className="w-3.5 h-3.5" />
                    Enter Studio
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Announcements & Public Works */}
      {activeTab === 'announcements' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-bold text-stone-900">
                Public Announcements & Sanctioned Development Works
              </h3>
              <p className="text-xs text-stone-500">
                Keep the constituency informed about approved government funds and welfare projects
              </p>
            </div>

            <button
              onClick={() => setShowAnnouncementModal(true)}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Megaphone className="w-4 h-4" />
              New Announcement
            </button>
          </div>

          <div className="space-y-3">
            {announcements.map((anc) => (
              <div
                key={anc.id}
                className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-2 text-xs"
              >
                <div className="flex justify-between items-center text-[10px] text-stone-400">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-indigo-700 uppercase">
                      {anc.category.replace('_', ' ')}
                    </span>
                    <span>•</span>
                    <span className="font-semibold text-stone-700">Scope: {anc.targetScope}</span>
                  </div>
                  <span>Published {anc.date}</span>
                </div>

                <h4 className="font-bold text-base text-stone-900 leading-snug">
                  {anc.title}
                </h4>

                <p className="text-stone-700 text-xs leading-relaxed">
                  {anc.content}
                </p>

                {anc.metrics && (
                  <div className="pt-2 flex gap-3 text-[11px] font-semibold">
                    {anc.metrics.budgetSanctioned && (
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                        Sanctioned Budget: {anc.metrics.budgetSanctioned}
                      </span>
                    )}
                    {anc.metrics.beneficiariesCount && (
                      <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-800 border border-indigo-200">
                        Beneficiaries: {anc.metrics.beneficiariesCount.toLocaleString()}
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Start Village Meeting Modal */}
      {showStartMeetingModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-rose-600 text-white">
                  <Video className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-base text-stone-900">
                  Launch Village Town Hall Video Meeting
                </h3>
              </div>
              <button
                onClick={() => setShowStartMeetingModal(false)}
                className="text-stone-400 hover:text-stone-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleStartMeetingSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  Meeting Scope / Type:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Village', 'Constituency', 'Ward/Booth'] as MeetingType[]).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setMeetingType(t)}
                      className={`py-2 px-2 rounded-xl border text-center font-bold transition cursor-pointer ${
                        meetingType === t
                          ? 'bg-stone-900 text-white border-stone-900'
                          : 'border-stone-300 text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {meetingType === 'Village' && (
                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    Select Target Village:
                  </label>
                  <select
                    value={meetingVillageId}
                    onChange={(e) => setMeetingVillageId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 text-xs bg-white"
                  >
                    {villages.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name} ({v.registeredMembers} members)
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  Town Hall Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kannamangala Drinking Water Emergency Samvaad"
                  value={meetingTitle}
                  onChange={(e) => setMeetingTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  Key Agenda Topics (Comma-separated)
                </label>
                <textarea
                  rows={3}
                  value={meetingAgenda}
                  onChange={(e) => setMeetingAgenda(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 text-xs resize-none"
                />
              </div>

              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-[11px] text-rose-800">
                App & SMS alerts will automatically be broadcast to all registered constituents and coordinators in this area.
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowStartMeetingModal(false)}
                  className="px-4 py-2 rounded-xl border border-stone-300 text-stone-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold cursor-pointer"
                >
                  Launch Live Meeting 🎥
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Issue Modal */}
      {assignModalIssue && (
        <AssignIssueModal
          issue={assignModalIssue}
          onClose={() => setAssignModalIssue(null)}
        />
      )}

      {/* Create Announcement Modal */}
      {showAnnouncementModal && (
        <CreateAnnouncementModal
          isOpen={showAnnouncementModal}
          onClose={() => setShowAnnouncementModal(false)}
        />
      )}

      {/* Add Village Modal */}
      <AddVillageModal
        isOpen={showAddVillageModal}
        onClose={() => setShowAddVillageModal(false)}
        onVillageAdded={(id) => {
          setSelectedVillageId(id);
          setActiveTab('villages');
        }}
      />
    </div>
  );
};
