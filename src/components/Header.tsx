import React, { useState } from 'react';
import {
  Users,
  Shield,
  UserCheck,
  Bell,
  Video,
  MapPin,
  ChevronDown,
  PhoneCall,
  CheckCircle2,
  AlertTriangle,
  Menu,
  X,
  PlusCircle,
} from 'lucide-react';
import { useConstituency } from '../context/ConstituencyContext';
import { UserRole } from '../types';

export const Header: React.FC<{ onOpenReportModal: () => void }> = ({ onOpenReportModal }) => {
  const {
    currentUser,
    switchRole,
    notifications,
    unreadNotificationCount,
    markNotificationsAsRead,
    activeView,
    setActiveView,
    activeMeeting,
    joinMeeting,
    meetings,
    constituency,
  } = useConstituency();

  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const liveMeeting = meetings.find((m) => m.status === 'live');

  const handleRoleChange = (role: UserRole) => {
    switchRole(role);
    setShowRoleMenu(false);
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'CITIZEN':
        return {
          label: 'Citizen View',
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          icon: Users,
        };
      case 'FIELD_WORKER':
        return {
          label: 'Field Coordinator',
          bg: 'bg-amber-50 text-amber-800 border-amber-200',
          icon: UserCheck,
        };
      case 'ABHI_CANDIDATE':
        return {
          label: 'ABHI Candidate / Admin',
          bg: 'bg-indigo-50 text-indigo-800 border-indigo-200',
          icon: Shield,
        };
    }
  };

  const currentBadge = getRoleBadge(currentUser.role);
  const RoleIcon = currentBadge.icon;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-stone-200 shadow-xs">
      {/* Top emergency & constituency strip */}
      <div className="bg-stone-900 text-stone-200 text-xs px-4 py-1.5 flex justify-between items-center flex-wrap gap-2">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="flex items-center gap-1.5 text-stone-300 font-medium">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            {constituency.state} Assembly Constituency {constituency.acNumber} • {constituency.name} ({constituency.district})
          </span>
          <span className="hidden sm:inline text-stone-500">|</span>
          <span className="hidden sm:inline text-stone-300">
            Office of {constituency.candidateName}
          </span>
        </div>

        <div className="flex items-center gap-4">
          {liveMeeting && activeView !== 'meeting_room' && (
            <button
              onClick={() => joinMeeting(liveMeeting.id)}
              className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold animate-pulse transition cursor-pointer"
            >
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              <Video className="w-3 h-3" />
              Town Hall Live: {liveMeeting.villageName || 'All'}
            </button>
          )}

          <div className="flex items-center gap-1.5 text-stone-400 text-xs">
            <PhoneCall className="w-3 h-3 text-emerald-400" />
            <span>Toll-Free Helpline: <strong>{constituency.helpline}</strong></span>
          </div>
        </div>
      </div>

      {/* Main navigation row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (currentUser.role === 'CITIZEN') setActiveView('citizen_home');
                else if (currentUser.role === 'FIELD_WORKER') setActiveView('field_tasks');
                else setActiveView('dashboard');
              }}
              className="flex items-center gap-2.5 text-left group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-700 to-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-sm group-hover:scale-105 transition-transform">
                🏛️
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-stone-900 tracking-tight leading-none">
                    Constituency Connect
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-800">
                    JanSeva
                  </span>
                </div>
                <p className="text-xs text-stone-500 mt-0.5">
                  Citizen Grievance & Village Governance Network
                </p>
              </div>
            </button>

            {/* Desktop Nav links based on Role */}
            <nav className="hidden md:flex items-center gap-1 ml-6 pl-6 border-l border-stone-200">
              {currentUser.role === 'ABHI_CANDIDATE' && (
                <>
                  <button
                    onClick={() => setActiveView('dashboard')}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition cursor-pointer ${
                      activeView === 'dashboard'
                        ? 'bg-stone-900 text-white'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                    }`}
                  >
                    War Room
                  </button>
                  <button
                    onClick={() => setActiveView('issues')}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition cursor-pointer ${
                      activeView === 'issues'
                        ? 'bg-stone-900 text-white'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                    }`}
                  >
                    All Grievances
                  </button>
                  <button
                    onClick={() => setActiveView('villages')}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition cursor-pointer ${
                      activeView === 'villages'
                        ? 'bg-stone-900 text-white'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                    }`}
                  >
                    Village Directory
                  </button>
                  <button
                    id="nav-village-members-desktop"
                    onClick={() => setActiveView('members')}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition cursor-pointer flex items-center gap-1.5 ${
                      activeView === 'members'
                        ? 'bg-stone-900 text-white'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Village Members</span>
                  </button>
                  <button
                    onClick={() => setActiveView('meetings')}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition cursor-pointer ${
                      activeView === 'meetings' || activeView === 'meeting_room'
                        ? 'bg-stone-900 text-white'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                    }`}
                  >
                    Town Halls 🎥
                  </button>
                  <button
                    onClick={() => setActiveView('announcements')}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition cursor-pointer ${
                      activeView === 'announcements'
                        ? 'bg-stone-900 text-white'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                    }`}
                  >
                    Development Works
                  </button>
                </>
              )}

              {currentUser.role === 'FIELD_WORKER' && (
                <>
                  <button
                    onClick={() => setActiveView('field_tasks')}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition cursor-pointer ${
                      activeView === 'field_tasks'
                        ? 'bg-amber-600 text-white'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                    }`}
                  >
                    My Assigned Tasks
                  </button>
                  <button
                    onClick={() => setActiveView('village_booth')}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition cursor-pointer ${
                      activeView === 'village_booth'
                        ? 'bg-amber-600 text-white'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                    }`}
                  >
                    My Ward & Booth
                  </button>
                  <button
                    onClick={() => setActiveView('meetings')}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition cursor-pointer ${
                      activeView === 'meetings' || activeView === 'meeting_room'
                        ? 'bg-amber-600 text-white'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                    }`}
                  >
                    Village Meetings
                  </button>
                </>
              )}

              {currentUser.role === 'CITIZEN' && (
                <>
                  <button
                    onClick={() => setActiveView('citizen_home')}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition cursor-pointer ${
                      activeView === 'citizen_home'
                        ? 'bg-emerald-700 text-white'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                    }`}
                  >
                    My Grievances
                  </button>
                  <button
                    onClick={() => setActiveView('citizen_nearby')}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition cursor-pointer ${
                      activeView === 'citizen_nearby'
                        ? 'bg-emerald-700 text-white'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                    }`}
                  >
                    Nearby Village Issues
                  </button>
                  <button
                    onClick={() => setActiveView('announcements')}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition cursor-pointer ${
                      activeView === 'announcements'
                        ? 'bg-emerald-700 text-white'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                    }`}
                  >
                    Public Updates
                  </button>
                  <button
                    onClick={() => setActiveView('meetings')}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition cursor-pointer ${
                      activeView === 'meetings' || activeView === 'meeting_room'
                        ? 'bg-emerald-700 text-white'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                    }`}
                  >
                    Join Town Hall
                  </button>
                </>
              )}
            </nav>
          </div>

          {/* Right actions: Quick Report Button + Role Switcher + Notifs */}
          <div className="flex items-center gap-2.5">
            {/* Report Grievance Quick Button */}
            <button
              onClick={onOpenReportModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold shadow-xs transition cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Report New Issue</span>
              <span className="sm:hidden">Report</span>
            </button>

            {/* Notifications Popover Toggle */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifMenu(!showNotifMenu);
                  if (!showNotifMenu && unreadNotificationCount > 0) {
                    markNotificationsAsRead();
                  }
                }}
                className="relative p-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition cursor-pointer"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotificationCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white" />
                )}
              </button>

              {showNotifMenu && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-stone-200 z-50 p-3 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                      Constituency Alerts ({notifications.length})
                    </span>
                    <button
                      onClick={() => setShowNotifMenu(false)}
                      className="text-xs text-stone-400 hover:text-stone-600"
                    >
                      Close
                    </button>
                  </div>
                  <div className="max-h-72 overflow-y-auto space-y-2 mt-2 divide-y divide-stone-100">
                    {notifications.map((n) => (
                      <div key={n.id} className="pt-2 text-xs">
                        <div className="flex items-start gap-2">
                          {n.type === 'meeting' ? (
                            <Video className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                          ) : n.type === 'success' ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                          )}
                          <div>
                            <p className="font-semibold text-stone-900">{n.title}</p>
                            <p className="text-stone-600 mt-0.5">{n.message}</p>
                            <span className="text-[10px] text-stone-400 mt-1 block">
                              {n.timestamp}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Role Switcher Pill */}
            <div className="relative">
              <button
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className={`flex items-center gap-2 pl-2.5 pr-2 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer transition ${currentBadge.bg}`}
              >
                <RoleIcon className="w-4 h-4" />
                <span className="hidden sm:inline">{currentBadge.label}</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>

              {showRoleMenu && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-stone-200 z-50 p-2 divide-y divide-stone-100">
                  <div className="px-3 py-2 text-xs font-semibold text-stone-400 uppercase tracking-wider">
                    Switch Active Experience
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => handleRoleChange('CITIZEN')}
                      className={`w-full flex items-start gap-3 p-2.5 rounded-lg text-left transition cursor-pointer ${
                        currentUser.role === 'CITIZEN' ? 'bg-emerald-50' : 'hover:bg-stone-50'
                      }`}
                    >
                      <Users className="w-4 h-4 text-emerald-600 mt-0.5" />
                      <div>
                        <div className="text-xs font-bold text-stone-900">1. Citizen Experience</div>
                        <div className="text-[11px] text-stone-500">
                          File complaints, track progress & rate resolution
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => handleRoleChange('FIELD_WORKER')}
                      className={`w-full flex items-start gap-3 p-2.5 rounded-lg text-left transition cursor-pointer ${
                        currentUser.role === 'FIELD_WORKER' ? 'bg-amber-50' : 'hover:bg-stone-50'
                      }`}
                    >
                      <UserCheck className="w-4 h-4 text-amber-600 mt-0.5" />
                      <div>
                        <div className="text-xs font-bold text-stone-900">2. Field Worker / Booth Lead</div>
                        <div className="text-[11px] text-stone-500">
                          Receive tasks, upload field proof & resolve issues
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => handleRoleChange('ABHI_CANDIDATE')}
                      className={`w-full flex items-start gap-3 p-2.5 rounded-lg text-left transition cursor-pointer ${
                        currentUser.role === 'ABHI_CANDIDATE' ? 'bg-indigo-50' : 'hover:bg-stone-50'
                      }`}
                    >
                      <Shield className="w-4 h-4 text-indigo-600 mt-0.5" />
                      <div>
                        <div className="text-xs font-bold text-stone-900">3. ABHI Candidate / Admin</div>
                        <div className="text-[11px] text-stone-500">
                          Constituency map, triage, village meetings & analytics
                        </div>
                      </div>
                    </button>
                  </div>

                  <div className="pt-2 px-3 pb-1 text-[11px] text-stone-400">
                    Currently logged in as: <strong className="text-stone-700">{currentUser.name}</strong>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-white px-4 pt-2 pb-4 space-y-1 shadow-inner">
          {currentUser.role === 'ABHI_CANDIDATE' && (
            <>
              <button
                onClick={() => {
                  setActiveView('dashboard');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-stone-800 hover:bg-stone-100"
              >
                📊 War Room Dashboard
              </button>
              <button
                onClick={() => {
                  setActiveView('issues');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-stone-800 hover:bg-stone-100"
              >
                📝 All Grievances
              </button>
              <button
                onClick={() => {
                  setActiveView('villages');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-stone-800 hover:bg-stone-100"
              >
                🏘️ Village Directory
              </button>
              <button
                id="nav-village-members-mobile"
                onClick={() => {
                  setActiveView('members');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-stone-800 hover:bg-stone-100 flex items-center gap-2"
              >
                👥 Village Members Roster
              </button>
              <button
                onClick={() => {
                  setActiveView('meetings');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-stone-800 hover:bg-stone-100"
              >
                🎥 Town Halls & Video Meetings
              </button>
              <button
                onClick={() => {
                  setActiveView('announcements');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-stone-800 hover:bg-stone-100"
              >
                📣 Public Works & Announcements
              </button>
            </>
          )}

          {currentUser.role === 'FIELD_WORKER' && (
            <>
              <button
                onClick={() => {
                  setActiveView('field_tasks');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-stone-800 hover:bg-stone-100"
              >
                ✅ My Assigned Tasks
              </button>
              <button
                onClick={() => {
                  setActiveView('village_booth');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-stone-800 hover:bg-stone-100"
              >
                📍 My Ward & Booth
              </button>
              <button
                onClick={() => {
                  setActiveView('meetings');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-stone-800 hover:bg-stone-100"
              >
                🎥 Village Meetings
              </button>
            </>
          )}

          {currentUser.role === 'CITIZEN' && (
            <>
              <button
                onClick={() => {
                  setActiveView('citizen_home');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-stone-800 hover:bg-stone-100"
              >
                📋 My Grievances
              </button>
              <button
                onClick={() => {
                  setActiveView('citizen_nearby');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-stone-800 hover:bg-stone-100"
              >
                📍 Nearby Village Issues
              </button>
              <button
                onClick={() => {
                  setActiveView('announcements');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-stone-800 hover:bg-stone-100"
              >
                📣 Public Announcements
              </button>
              <button
                onClick={() => {
                  setActiveView('meetings');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-stone-800 hover:bg-stone-100"
              >
                🎥 Join Town Hall
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
};
