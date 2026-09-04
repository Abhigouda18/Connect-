import React, { useState } from 'react';
import { ConstituencyProvider, useConstituency } from './context/ConstituencyContext';
import { Header } from './components/Header';
import { CitizenPortal } from './components/citizen/CitizenPortal';
import { ReportIssueModal } from './components/citizen/ReportIssueModal';
import { IssueDetailModal } from './components/citizen/IssueDetailModal';
import { FieldWorkerPortal } from './components/field/FieldWorkerPortal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { VillageDirectory } from './components/admin/VillageDirectory';
import { VillageMembersList } from './components/admin/VillageMembersList';
import { VideoConferenceStudio } from './components/video/VideoConferenceStudio';

const ConstituencyApp: React.FC = () => {
  const {
    currentUser,
    activeView,
    activeMeeting,
    leaveMeeting,
    startMeeting,
    constituency,
  } = useConstituency();

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);

  // If user is currently in a live meeting, show full-screen Video Conference Studio
  if (activeMeeting) {
    return (
      <div className="min-h-screen bg-stone-950 flex flex-col font-sans">
        <Header onOpenReportModal={() => setIsReportModalOpen(true)} />
        <main className="flex-1">
          <VideoConferenceStudio
            meeting={activeMeeting}
            onLeave={leaveMeeting}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col font-sans text-stone-900 antialiased selection:bg-indigo-500 selection:text-white">
      {/* Universal Header with Role Switching & Live Meeting Alerts */}
      <Header onOpenReportModal={() => setIsReportModalOpen(true)} />

      {/* Main Workspace Area */}
      <main className="flex-1 pb-16">
        {/* Dedicated Village Members Directory View */}
        {activeView === 'members' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <VillageMembersList />
          </div>
        )}

        {/* Dedicated Village Directory View */}
        {activeView === 'villages' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <VillageDirectory
              onSelectIssue={(id) => setSelectedIssueId(id)}
              onStartVillageMeeting={(vId, vName) => {
                startMeeting({
                  title: `${vName} Village Samvaad with ABHI Candidate`,
                  type: 'Village',
                  villageId: vId,
                  agenda: ['Panchayat issues', 'Drinking water status', 'Voter concerns'],
                });
              }}
            />
          </div>
        )}

        {/* Citizen Portal (for Citizen Role) */}
        {activeView !== 'members' && activeView !== 'villages' && currentUser.role === 'CITIZEN' && (
          <CitizenPortal
            onOpenReportModal={() => setIsReportModalOpen(true)}
            onSelectIssue={(id) => setSelectedIssueId(id)}
          />
        )}

        {/* Field Worker Portal (for Field Worker Role) */}
        {activeView !== 'members' && activeView !== 'villages' && currentUser.role === 'FIELD_WORKER' && (
          <FieldWorkerPortal
            onSelectIssue={(id) => setSelectedIssueId(id)}
          />
        )}

        {/* Admin Dashboard / War Room (for Candidate & Admin Roles or other tabs) */}
        {activeView !== 'members' && activeView !== 'villages' && currentUser.role === 'ABHI_CANDIDATE' && (
          <AdminDashboard
            onSelectIssue={(id) => setSelectedIssueId(id)}
            onOpenReportModal={() => setIsReportModalOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-stone-200 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-indigo-600 text-white font-bold text-[11px] flex items-center justify-center">
              🏛️
            </div>
            <span className="font-bold text-stone-800">JanSeva Connect</span>
            <span>—</span>
            <span>
              {constituency.name} Assembly Constituency (AC-{constituency.acNumber}) • {constituency.district}, {constituency.state}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-emerald-700 font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              War Room Grid Online
            </span>
            <span>Helpline: {constituency.helpline}</span>
          </div>
        </div>
      </footer>

      {/* Global Modals */}
      <ReportIssueModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />

      {selectedIssueId && (
        <IssueDetailModal
          issueId={selectedIssueId}
          onClose={() => setSelectedIssueId(null)}
        />
      )}
    </div>
  );
};

export default function App() {
  return (
    <ConstituencyProvider>
      <ConstituencyApp />
    </ConstituencyProvider>
  );
}
