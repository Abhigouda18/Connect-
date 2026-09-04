import React, { useState } from 'react';
import {
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  Video,
  MapPin,
  ThumbsUp,
  Filter,
  ChevronRight,
  ShieldCheck,
  Megaphone,
  Star,
} from 'lucide-react';
import { useConstituency } from '../../context/ConstituencyContext';
import { Issue, IssueStatus } from '../../types';

interface CitizenPortalProps {
  onOpenReportModal: () => void;
  onSelectIssue: (id: string) => void;
}

export const CitizenPortal: React.FC<CitizenPortalProps> = ({
  onOpenReportModal,
  onSelectIssue,
}) => {
  const {
    currentUser,
    issues,
    villages,
    announcements,
    meetings,
    joinMeeting,
    toggleUpvoteIssue,
    activeView,
    setActiveView,
  } = useConstituency();

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Filter issues reported by current citizen
  const myIssues = issues.filter(
    (i) =>
      i.reportedBy.name.toLowerCase().includes(currentUser.name.toLowerCase()) ||
      i.villageId === currentUser.villageId
  );

  const displayedIssues = myIssues.filter((i) => {
    if (statusFilter !== 'all' && i.status !== statusFilter) return false;
    if (categoryFilter !== 'all' && i.category !== categoryFilter) return false;
    return true;
  });

  // Nearby village issues
  const nearbyIssues = issues.filter((i) => i.villageId === currentUser.villageId);

  // Live town hall meeting
  const liveMeeting = meetings.find((m) => m.status === 'live');
  const userVillage = villages.find((v) => v.id === currentUser.villageId);

  const myActiveCount = myIssues.filter((i) => i.status !== 'Resolved' && i.status !== 'Citizen Confirmed').length;
  const myResolvedCount = myIssues.filter((i) => i.status === 'Resolved' || i.status === 'Citizen Confirmed').length;

  const getStatusBadge = (status: IssueStatus) => {
    switch (status) {
      case 'Received':
        return 'bg-stone-100 text-stone-700 border-stone-300';
      case 'Assigned':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'In Progress':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Resolved':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Citizen Confirmed':
        return 'bg-purple-100 text-purple-800 border-purple-300';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Resident Welcome & Quick Action Card */}
      <div className="bg-gradient-to-r from-stone-900 to-indigo-950 text-white rounded-2xl p-6 shadow-md border border-stone-800">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Verified AC-58 Sindhanur Constituent Resident</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              Namaskara, {currentUser.name}
            </h1>
            <p className="text-xs sm:text-sm text-stone-300 mt-1">
              Registered in <strong>{currentUser.villageName || 'Alabanoor'}</strong> • Ward {currentUser.wardNumber} • Booth {currentUser.boothNumber}
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={onOpenReportModal}
              className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold shadow-lg shadow-emerald-950/40 transition cursor-pointer"
            >
              <PlusCircle className="w-5 h-5" />
              Report New Issue
            </button>
          </div>
        </div>

        {/* Quick stat counters */}
        <div className="grid grid-cols-3 gap-3 mt-6 pt-5 border-t border-stone-800/80">
          <div className="bg-white/5 rounded-xl p-3">
            <span className="text-[11px] text-stone-400 block font-medium">In Progress</span>
            <span className="text-xl sm:text-2xl font-bold text-amber-400">{myActiveCount}</span>
          </div>
          <div className="bg-white/5 rounded-xl p-3">
            <span className="text-[11px] text-stone-400 block font-medium">Resolved & Confirmed</span>
            <span className="text-xl sm:text-2xl font-bold text-emerald-400">{myResolvedCount}</span>
          </div>
          <div className="bg-white/5 rounded-xl p-3">
            <span className="text-[11px] text-stone-400 block font-medium">Village Coordinator</span>
            <span className="text-xs sm:text-sm font-semibold text-stone-200 truncate block mt-1">
              {userVillage?.coordinatorName || 'Sunil Kumar'}
            </span>
          </div>
        </div>
      </div>

      {/* Live Video Townhall Banner (If active) */}
      {liveMeeting && (
        <div className="bg-gradient-to-r from-rose-900 to-stone-900 text-white rounded-2xl p-4 sm:p-5 border border-rose-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-rose-600 flex items-center justify-center shrink-0">
              <Video className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-extrabold uppercase tracking-wider">
                  LIVE VIDEO TOWN HALL
                </span>
                <span className="text-xs text-rose-200">
                  {liveMeeting.participantsCount} citizens attending
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white mt-1">
                {liveMeeting.title}
              </h3>
              <p className="text-xs text-stone-300 mt-0.5">
                Chaired by ABHI Candidate Adv. Suresh K. Hegde. Speak directly and raise grievances.
              </p>
            </div>
          </div>

          <button
            onClick={() => joinMeeting(liveMeeting.id)}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white text-rose-900 hover:bg-rose-50 text-xs sm:text-sm font-bold shadow-md transition cursor-pointer shrink-0 text-center"
          >
            Join Village Conference 🎥
          </button>
        </div>
      )}

      {/* Main Content Layout: Grievances + Village Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: My Grievances List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-stone-900">
                Track My Grievances & Complaints
              </h2>
              <p className="text-xs text-stone-500">
                Transparent audit trail from local coordinator to department resolution
              </p>
            </div>

            {/* Filter pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {['all', 'Received', 'In Progress', 'Resolved'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setStatusFilter(tab)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                    statusFilter === tab
                      ? 'bg-stone-900 text-white'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {tab === 'all' ? 'All Issues' : tab}
                </button>
              ))}
            </div>
          </div>

          {/* Grievances List */}
          {displayedIssues.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-stone-200 text-stone-500 space-y-3">
              <Clock className="w-8 h-8 mx-auto text-stone-400" />
              <p className="text-sm font-semibold">No grievances found under this filter.</p>
              <button
                onClick={onOpenReportModal}
                className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                File an Issue Now
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {displayedIssues.map((issue) => (
                <div
                  key={issue.id}
                  onClick={() => onSelectIssue(issue.id)}
                  className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200 hover:border-emerald-500 transition shadow-xs hover:shadow-md cursor-pointer group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 bg-stone-100 text-stone-800 rounded">
                          {issue.ticketNumber}
                        </span>
                        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getStatusBadge(issue.status)}`}>
                          {issue.status}
                        </span>
                        <span className="text-xs text-stone-400">
                          {issue.villageName} • Ward {issue.wardNumber}
                        </span>
                      </div>

                      <h3 className="text-sm sm:text-base font-bold text-stone-900 group-hover:text-emerald-700 transition">
                        {issue.title}
                      </h3>
                    </div>

                    <ChevronRight className="w-5 h-5 text-stone-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition shrink-0" />
                  </div>

                  <p className="text-xs text-stone-600 mt-2 line-clamp-2">
                    {issue.description}
                  </p>

                  {/* Lifecycle progress bar mini */}
                  <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px]">
                        {issue.assignedTo ? (
                          <span className="text-stone-700 font-medium">
                            Assigned to: {issue.assignedTo.name}
                          </span>
                        ) : (
                          <span className="text-amber-600 font-medium">
                            Awaiting ABHI triage assignment
                          </span>
                        )}
                      </span>
                    </div>

                    {issue.status === 'Resolved' && !issue.citizenRating && (
                      <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-300 rounded-full font-bold text-[11px] flex items-center gap-1">
                        <Star className="w-3 h-3 fill-emerald-600" />
                        Awaiting Your Sign-off
                      </span>
                    )}

                    {issue.citizenRating && (
                      <span className="text-emerald-700 font-semibold text-[11px] flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Signed off ({issue.citizenRating.rating}★)
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right 1 Col: Village Announcements & Nearby Grievances */}
        <div className="space-y-6">
          {/* Official ABHI Announcements */}
          <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-stone-900 font-bold text-sm">
              <Megaphone className="w-4 h-4 text-amber-600" />
              <span>Public Works & Sanction Updates</span>
            </div>

            <div className="space-y-3 divide-y divide-stone-100">
              {announcements.slice(0, 2).map((anc) => (
                <div key={anc.id} className="pt-2 text-xs space-y-1">
                  <div className="flex justify-between items-center text-[10px] text-stone-400">
                    <span className="uppercase font-bold text-indigo-700">
                      {anc.category.replace('_', ' ')}
                    </span>
                    <span>{anc.date}</span>
                  </div>
                  <h4 className="font-bold text-stone-900 leading-snug">{anc.title}</h4>
                  <p className="text-stone-600 line-clamp-3 leading-relaxed">{anc.content}</p>
                  {anc.metrics?.budgetSanctioned && (
                    <div className="inline-block px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-bold text-[10px] border border-emerald-200">
                      Sanctioned: {anc.metrics.budgetSanctioned}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Nearby Village Issues with Upvoting */}
          <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-stone-900 font-bold text-sm">
                <MapPin className="w-4 h-4 text-rose-500" />
                <span>Nearby Village Grievances</span>
              </div>
              <span className="text-[11px] text-stone-400">
                {currentUser.villageName}
              </span>
            </div>

            <p className="text-xs text-stone-500">
              Support neighborhood issues to prioritize local government intervention:
            </p>

            <div className="space-y-2.5">
              {nearbyIssues.slice(0, 3).map((iss) => (
                <div
                  key={iss.id}
                  className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs space-y-2"
                >
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-stone-900 leading-tight">
                      {iss.title}
                    </span>
                    <span className="text-[10px] font-mono text-stone-500 shrink-0">
                      {iss.ticketNumber}
                    </span>
                  </div>
                  <p className="text-stone-600 line-clamp-2 text-[11px]">
                    {iss.description}
                  </p>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-stone-400">
                      Ward {iss.wardNumber} • {iss.status}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleUpvoteIssue(iss.id);
                      }}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition cursor-pointer ${
                        iss.upvotedBy.includes(currentUser.id)
                          ? 'bg-indigo-600 text-white'
                          : 'bg-white border border-stone-300 text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      <ThumbsUp className="w-3 h-3" />
                      <span>{iss.upvotes}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
