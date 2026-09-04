import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  CurrentUser,
  Issue,
  Village,
  PartyMember,
  VideoMeeting,
  Announcement,
  IssueStatus,
  IssueCategory,
  IssueUrgency,
  MeetingType,
  ConstituencyProfile,
} from '../types';
import {
  INITIAL_CURRENT_USERS,
  INITIAL_VILLAGES,
  INITIAL_MEMBERS,
  INITIAL_ISSUES,
  INITIAL_MEETINGS,
  INITIAL_ANNOUNCEMENTS,
} from '../data/initialData';
import { ALL_PRESET_CONSTITUENCIES, SINDHANUR_PRESET } from '../data/presetConstituencies';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'info' | 'success' | 'alert' | 'meeting';
  read: boolean;
}

interface ConstituencyContextType {
  currentUser: CurrentUser;
  switchRole: (role: UserRole) => void;
  issues: Issue[];
  villages: Village[];
  members: PartyMember[];
  meetings: VideoMeeting[];
  announcements: Announcement[];
  activeMeeting: VideoMeeting | null;
  notifications: AppNotification[];
  unreadNotificationCount: number;
  activeView: string;
  selectedVillageId: string | null;
  selectedIssueId: string | null;
  setActiveView: (view: string) => void;
  setSelectedVillageId: (id: string | null) => void;
  setSelectedIssueId: (id: string | null) => void;
  setActiveMeeting: (meeting: VideoMeeting | null) => void;
  markNotificationsAsRead: () => void;

  // Domain Actions
  reportIssue: (data: {
    title: string;
    description: string;
    category: IssueCategory;
    urgency: IssueUrgency;
    villageId: string;
    wardNumber: number;
    boothNumber?: number;
    landmark: string;
    photoUrl?: string;
    isAnonymous: boolean;
  }) => Issue;
  assignIssue: (issueId: string, memberId: string, department?: string, note?: string) => void;
  updateIssueStatus: (
    issueId: string,
    newStatus: IssueStatus,
    note: string,
    proofPhotoUrl?: string
  ) => void;
  confirmCitizenResolution: (issueId: string, rating: number, feedback: string) => void;
  toggleUpvoteIssue: (issueId: string) => void;
  addAnnouncement: (data: Omit<Announcement, 'id' | 'date'>) => void;
  addPartyMember: (data: Omit<PartyMember, 'id' | 'joinedDate' | 'tasksAssigned' | 'tasksResolved'>) => void;
  addVillage: (data: {
    name: string;
    kannadaName?: string;
    mandal: string;
    wardsCount?: number;
    boothsCount?: number;
    population?: number;
    registeredMembers?: number;
    coordinatorName?: string;
    coordinatorPhone?: string;
    lat?: number;
    lng?: number;
  }) => Village;
  addVillagesBatch: (villageNames: string[], defaultMandal?: string) => Village[];
  startMeeting: (data: {
    title: string;
    type: MeetingType;
    villageId?: string;
    agenda: string[];
  }) => VideoMeeting;
  joinMeeting: (meetingId: string) => void;
  leaveMeeting: () => void;
  sendMeetingMessage: (meetingId: string, message: string, isHandRaised?: boolean) => void;
  addMeetingActionItem: (meetingId: string, task: string, assignedTo: string, village: string) => void;
  toggleMeetingActionItem: (meetingId: string, actionId: string) => void;

  // Member Management
  removePartyMember: (memberId: string) => void;

  // Constituency & Village Management
  constituency: ConstituencyProfile;
  updateConstituency: (profile: Partial<ConstituencyProfile>) => void;
  updateVillage: (villageId: string, data: Partial<Village>) => void;
  deleteVillage: (villageId: string) => void;
  resetVillagesToDefault: () => void;
}

const ConstituencyContext = createContext<ConstituencyContextType | undefined>(undefined);

const CURRENT_DATA_VERSION = 'ac58_sindhanur_v2';

export const ConstituencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Check version migration to ensure AC-58 Sindhanur 124 villages load fresh
  if (typeof window !== 'undefined') {
    const savedVersion = localStorage.getItem('cc_data_version');
    if (savedVersion !== CURRENT_DATA_VERSION) {
      localStorage.setItem('cc_data_version', CURRENT_DATA_VERSION);
      localStorage.removeItem('cc_villages');
      localStorage.removeItem('cc_issues');
      localStorage.removeItem('cc_members');
      localStorage.removeItem('cc_meetings');
      localStorage.removeItem('cc_announcements');
      localStorage.removeItem('cc_user');
    }
  }

  // Current user / role
  const [currentUser, setCurrentUser] = useState<CurrentUser>(() => {
    const saved = localStorage.getItem('cc_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.role !== 'CITIZEN' && parsed.role !== 'FIELD_WORKER' && parsed.role !== 'ABHI_CANDIDATE') {
          return INITIAL_CURRENT_USERS.ABHI_CANDIDATE;
        }
        return parsed;
      } catch {
        return INITIAL_CURRENT_USERS.ABHI_CANDIDATE;
      }
    }
    return INITIAL_CURRENT_USERS.ABHI_CANDIDATE;
  });

  // Active view
  const [activeView, setActiveView] = useState<string>('dashboard');
  const [selectedVillageId, setSelectedVillageId] = useState<string | null>(null);
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);

  // Active Constituency Profile
  const [constituency, setConstituency] = useState<ConstituencyProfile>(() => {
    const saved = localStorage.getItem('cc_constituency');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return SINDHANUR_PRESET.profile;
      }
    }
    return SINDHANUR_PRESET.profile;
  });

  // Core entities with local persistence fallback
  const [issues, setIssues] = useState<Issue[]>(() => {
    const saved = localStorage.getItem('cc_issues');
    return saved ? JSON.parse(saved) : INITIAL_ISSUES;
  });

  const [villages, setVillages] = useState<Village[]>(() => {
    const saved = localStorage.getItem('cc_villages');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch {
        return INITIAL_VILLAGES;
      }
    }
    return INITIAL_VILLAGES;
  });

  const [members, setMembers] = useState<PartyMember[]>(() => {
    const saved = localStorage.getItem('cc_members');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const upgraded = parsed.map((m: PartyMember, idx: number) => ({
            ...m,
            voterId: m.voterId || `SIN58-EPIC-${String(10000 + idx * 832).slice(0, 6)}`,
          }));
          const existingIds = new Set(upgraded.map((m: PartyMember) => m.id));
          const missing = INITIAL_MEMBERS.filter((m) => !existingIds.has(m.id));
          return [...upgraded, ...missing];
        }
      } catch {
        return INITIAL_MEMBERS;
      }
    }
    return INITIAL_MEMBERS;
  });

  const [meetings, setMeetings] = useState<VideoMeeting[]>(() => {
    const saved = localStorage.getItem('cc_meetings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge with initial attendees if attendees were lacking photos/voterId
          return parsed.map((m: VideoMeeting) => {
            const initMatch = INITIAL_MEETINGS.find((im) => im.id === m.id);
            if (initMatch && initMatch.attendeesList.length > m.attendeesList.length) {
              return { ...m, attendeesList: initMatch.attendeesList };
            }
            return m;
          });
        }
      } catch {
        return INITIAL_MEETINGS;
      }
    }
    return INITIAL_MEETINGS;
  });

  const [activeMeeting, setActiveMeeting] = useState<VideoMeeting | null>(null);

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const saved = localStorage.getItem('cc_announcements');
    return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENTS;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'notif_1',
      title: 'Live Townhall in Progress',
      message: 'Alabanoor Village Samvaad on Canal Water & PWD Roads is currently live.',
      timestamp: '10 mins ago',
      type: 'meeting',
      read: false,
    },
    {
      id: 'notif_2',
      title: 'Issue Resolved: Agricultural Transformer',
      message: 'Ward 4 Dhadesugur transformer issue SIN-5803 resolved and 3-phase power restored.',
      timestamp: '2 hours ago',
      type: 'success',
      read: false,
    },
    {
      id: 'notif_3',
      title: 'Sindhanur Taluk Disaster Cell Notice',
      message: 'Tungabhadra river discharge alert. 24x7 control room 08535-220058 is active.',
      timestamp: 'Yesterday',
      type: 'alert',
      read: true,
    },
  ]);

  // Save to local storage on changes
  useEffect(() => {
    localStorage.setItem('cc_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('cc_constituency', JSON.stringify(constituency));
  }, [constituency]);

  useEffect(() => {
    localStorage.setItem('cc_issues', JSON.stringify(issues));
  }, [issues]);

  useEffect(() => {
    localStorage.setItem('cc_villages', JSON.stringify(villages));
  }, [villages]);

  useEffect(() => {
    localStorage.setItem('cc_members', JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem('cc_meetings', JSON.stringify(meetings));
  }, [meetings]);

  useEffect(() => {
    localStorage.setItem('cc_announcements', JSON.stringify(announcements));
  }, [announcements]);

  const switchRole = (role: UserRole) => {
    const targetUser = INITIAL_CURRENT_USERS[role];
    setCurrentUser(targetUser);

    if (role === 'CITIZEN') {
      setActiveView('citizen_home');
    } else if (role === 'FIELD_WORKER') {
      setActiveView('field_tasks');
    } else {
      setActiveView('dashboard');
    }
  };

  const addNotification = (title: string, message: string, type: 'info' | 'success' | 'alert' | 'meeting') => {
    const newNotif: AppNotification = {
      id: `notif_${Date.now()}`,
      title,
      message,
      timestamp: 'Just now',
      type,
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const markNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadNotificationCount = notifications.filter((n) => !n.read).length;

  // Report Issue
  const reportIssue = (data: {
    title: string;
    description: string;
    category: IssueCategory;
    urgency: IssueUrgency;
    villageId: string;
    wardNumber: number;
    boothNumber?: number;
    landmark: string;
    photoUrl?: string;
    isAnonymous: boolean;
  }): Issue => {
    const targetVillage = villages.find((v) => v.id === data.villageId) || villages[0];
    const ticketIdNumber = Math.floor(5801 + Math.random() * 900);
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' });

    const newIssue: Issue = {
      id: `iss_${Date.now()}`,
      ticketNumber: `SIN-${ticketIdNumber}`,
      title: data.title,
      description: data.description,
      category: data.category,
      urgency: data.urgency,
      status: 'Received',
      villageId: targetVillage.id,
      villageName: targetVillage.name,
      wardNumber: data.wardNumber,
      boothNumber: data.boothNumber || 1,
      landmark: data.landmark,
      latitude: targetVillage.lat + (Math.random() - 0.5) * 0.01,
      longitude: targetVillage.lng + (Math.random() - 0.5) * 0.01,
      photoUrl: data.photoUrl,
      reportedBy: {
        name: data.isAnonymous ? 'Anonymous Citizen' : currentUser.name,
        phone: data.isAnonymous ? 'Confidential' : currentUser.phone,
        isAnonymous: data.isAnonymous,
      },
      timeline: [
        {
          id: `tl_${Date.now()}`,
          status: 'Received',
          timestamp: nowStr,
          authorName: data.isAnonymous ? 'Anonymous Citizen' : currentUser.name,
          authorRole: 'Citizen',
          note: `Issue submitted by constituent. Awaiting triage and coordinator assignment.`,
        },
      ],
      upvotes: 1,
      upvotedBy: [currentUser.id],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setIssues((prev) => [newIssue, ...prev]);

    // Update village count
    setVillages((prev) =>
      prev.map((v) => (v.id === targetVillage.id ? { ...v, activeIssuesCount: v.activeIssuesCount + 1 } : v))
    );

    addNotification(
      `New Grievance Registered: ${newIssue.ticketNumber}`,
      `${data.title} reported in ${targetVillage.name}, Ward ${data.wardNumber}.`,
      'info'
    );

    return newIssue;
  };

  // Assign Issue
  const assignIssue = (issueId: string, memberId: string, department?: string, note?: string) => {
    const member = members.find((m) => m.id === memberId);
    if (!member) return;

    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' });

    setIssues((prev) =>
      prev.map((iss) => {
        if (iss.id !== issueId) return iss;
        const updatedTimeline = [
          ...iss.timeline,
          {
            id: `tl_${Date.now()}`,
            status: 'Assigned' as IssueStatus,
            timestamp: nowStr,
            authorName: currentUser.name,
            authorRole: currentUser.role === 'ABHI_CANDIDATE' ? 'ABHI Office' : 'Coordinator',
            note: note || `Assigned to ${member.name} (${member.role}). Department: ${department || 'General Administration'}.`,
          },
        ];

        return {
          ...iss,
          status: 'Assigned',
          assignedTo: {
            memberId: member.id,
            name: member.name,
            role: member.role,
            phone: member.phone,
            designation: member.role,
          },
          department: department || iss.department,
          timeline: updatedTimeline,
          updatedAt: new Date().toISOString(),
        };
      })
    );

    // Update member tasks
    setMembers((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, tasksAssigned: m.tasksAssigned + 1 } : m))
    );

    addNotification(
      'Issue Assigned',
      `Assigned to ${member.name} for ground action.`,
      'info'
    );
  };

  // Update Status
  const updateIssueStatus = (
    issueId: string,
    newStatus: IssueStatus,
    note: string,
    proofPhotoUrl?: string
  ) => {
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' });

    setIssues((prev) =>
      prev.map((iss) => {
        if (iss.id !== issueId) return iss;

        const updatedTimeline = [
          ...iss.timeline,
          {
            id: `tl_${Date.now()}`,
            status: newStatus,
            timestamp: nowStr,
            authorName: currentUser.name,
            authorRole: currentUser.designation || currentUser.role,
            note,
            photoProofUrl: proofPhotoUrl,
          },
        ];

        // Check if resolving
        if (newStatus === 'Resolved') {
          setVillages((vils) =>
            vils.map((v) =>
              v.id === iss.villageId
                ? {
                    ...v,
                    activeIssuesCount: Math.max(0, v.activeIssuesCount - 1),
                    resolvedIssuesCount: v.resolvedIssuesCount + 1,
                  }
                : v
            )
          );

          if (iss.assignedTo?.memberId) {
            setMembers((mems) =>
              mems.map((m) =>
                m.id === iss.assignedTo?.memberId
                  ? { ...m, tasksResolved: m.tasksResolved + 1 }
                  : m
              )
            );
          }
        }

        return {
          ...iss,
          status: newStatus,
          timeline: updatedTimeline,
          updatedAt: new Date().toISOString(),
        };
      })
    );

    addNotification(
      `Status Updated: ${newStatus}`,
      `Grievance status updated to "${newStatus}".`,
      newStatus === 'Resolved' ? 'success' : 'info'
    );
  };

  // Citizen Confirmation & Rating
  const confirmCitizenResolution = (issueId: string, rating: number, feedback: string) => {
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' });

    setIssues((prev) =>
      prev.map((iss) => {
        if (iss.id !== issueId) return iss;

        const updatedTimeline = [
          ...iss.timeline,
          {
            id: `tl_${Date.now()}`,
            status: 'Citizen Confirmed' as IssueStatus,
            timestamp: nowStr,
            authorName: currentUser.name,
            authorRole: 'Citizen Requester',
            note: `Citizen confirmed resolution with ${rating}★ score: "${feedback}"`,
          },
        ];

        return {
          ...iss,
          status: 'Citizen Confirmed',
          citizenRating: {
            rating,
            feedback,
            confirmedAt: nowStr,
            citizenName: currentUser.name,
          },
          timeline: updatedTimeline,
          updatedAt: new Date().toISOString(),
        };
      })
    );

    addNotification(
      'Citizen Confirmed Resolution',
      `Resident gave a ${rating}★ satisfaction rating. Thank you for building trust!`,
      'success'
    );
  };

  // Upvote / Validate
  const toggleUpvoteIssue = (issueId: string) => {
    setIssues((prev) =>
      prev.map((iss) => {
        if (iss.id !== issueId) return iss;
        const alreadyUpvoted = iss.upvotedBy.includes(currentUser.id);
        const upvotedBy = alreadyUpvoted
          ? iss.upvotedBy.filter((id) => id !== currentUser.id)
          : [...iss.upvotedBy, currentUser.id];
        return {
          ...iss,
          upvotes: upvotedBy.length,
          upvotedBy,
        };
      })
    );
  };

  // Add Announcement
  const addAnnouncement = (data: Omit<Announcement, 'id' | 'date'>) => {
    const newAnc: Announcement = {
      ...data,
      id: `anc_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
    };
    setAnnouncements((prev) => [newAnc, ...prev]);

    addNotification(
      'New Official Announcement',
      `"${data.title}" published to ${data.targetScope}.`,
      'info'
    );
  };

  // Add Party Member
  const addPartyMember = (data: Omit<PartyMember, 'id' | 'joinedDate' | 'tasksAssigned' | 'tasksResolved'>) => {
    const newMember: PartyMember = {
      ...data,
      id: `mem_${Date.now()}`,
      joinedDate: new Date().toISOString().split('T')[0],
      tasksAssigned: 0,
      tasksResolved: 0,
    };
    setMembers((prev) => [newMember, ...prev]);

    // Update village registered count
    setVillages((prev) =>
      prev.map((v) => (v.id === data.villageId ? { ...v, registeredMembers: v.registeredMembers + 1 } : v))
    );

    addNotification(
      'Party Member Registered',
      `${data.name} enrolled as ${data.role} in ${data.villageName}.`,
      'success'
    );
  };

  // Remove Party Member (Admin Access)
  const removePartyMember = (memberId: string) => {
    const memberToDelete = members.find((m) => m.id === memberId);
    if (!memberToDelete) return;

    setMembers((prev) => prev.filter((m) => m.id !== memberId));

    // Update village registered count
    if (memberToDelete.villageId) {
      setVillages((prev) =>
        prev.map((v) =>
          v.id === memberToDelete.villageId
            ? { ...v, registeredMembers: Math.max(0, v.registeredMembers - 1) }
            : v
        )
      );
    }

    addNotification(
      'Member Removed from Records',
      `${memberToDelete.name} (${memberToDelete.role}) was removed from ${memberToDelete.villageName} register.`,
      'alert'
    );
  };

  // Add Single Village
  const addVillage = (data: {
    name: string;
    kannadaName?: string;
    mandal: string;
    wardsCount?: number;
    boothsCount?: number;
    population?: number;
    registeredMembers?: number;
    coordinatorName?: string;
    coordinatorPhone?: string;
    lat?: number;
    lng?: number;
  }): Village => {
    const newId = `vil_${Date.now()}`;
    const lat = data.lat ?? Number((15.65 + Math.random() * 0.22).toFixed(4));
    const lng = data.lng ?? Number((76.54 + Math.random() * 0.32).toFixed(4));

    const newVillage: Village = {
      id: newId,
      name: data.name.trim(),
      kannadaName: data.kannadaName?.trim() || '',
      mandal: data.mandal.trim() || 'Sindhanur Rural GP',
      wardsCount: Number(data.wardsCount) || 4,
      boothsCount: Number(data.boothsCount) || 10,
      population: Number(data.population) || 8500,
      registeredMembers: Number(data.registeredMembers) || 620,
      coordinatorId: `mem_${Date.now()}`,
      coordinatorName: data.coordinatorName?.trim() || 'Assigned Village Convener',
      coordinatorPhone: data.coordinatorPhone?.trim() || '+91 98450 00000',
      lat,
      lng,
      activeIssuesCount: 0,
      resolvedIssuesCount: 0,
      lastMeetingDate: new Date().toISOString().split('T')[0],
    };

    setVillages((prev) => [...prev, newVillage]);
    addNotification(
      'New Village Added',
      `${newVillage.name} (${newVillage.mandal}) registered in the constituency directory.`,
      'success'
    );
    return newVillage;
  };

  // Add Multiple Villages in Batch
  const addVillagesBatch = (
    villageNames: string[],
    defaultMandal: string = 'Sindhanur Rural GP'
  ): Village[] => {
    const created: Village[] = [];
    const baseTime = Date.now();

    villageNames.forEach((raw, idx) => {
      const name = raw.trim();
      if (!name) return;
      const alreadyExists = villages.some(
        (v) => v.name.toLowerCase() === name.toLowerCase()
      );
      if (alreadyExists) return;

      const lat = Number((15.65 + Math.random() * 0.22).toFixed(4));
      const lng = Number((76.54 + Math.random() * 0.32).toFixed(4));

      const v: Village = {
        id: `vil_${baseTime}_${idx}`,
        name,
        kannadaName: '',
        mandal: defaultMandal,
        wardsCount: 4,
        boothsCount: 10,
        population: 8200,
        registeredMembers: 580,
        coordinatorId: `mem_${baseTime}_${idx}`,
        coordinatorName: 'Assigned Booth Lead',
        coordinatorPhone: '+91 98450 00000',
        lat,
        lng,
        activeIssuesCount: 0,
        resolvedIssuesCount: 0,
        lastMeetingDate: new Date().toISOString().split('T')[0],
      };
      created.push(v);
    });

    if (created.length > 0) {
      setVillages((prev) => [...prev, ...created]);
      addNotification(
        'Villages Added',
        `Successfully registered ${created.length} new village panchayats to the constituency.`,
        'success'
      );
    }
    return created;
  };

  // Update Constituency Profile
  const updateConstituency = (updates: Partial<ConstituencyProfile>) => {
    setConstituency((prev) => {
      const updated = { ...prev, ...updates };
      if (updates.candidateName && currentUser.role === 'ABHI_CANDIDATE') {
        setCurrentUser((u) => ({
          ...u,
          name: updates.candidateName!,
          designation: `${updates.candidateName} • ${updated.acNumber} - ${updated.name} Assembly Convener`,
        }));
      }
      return updated;
    });
    addNotification(
      'Constituency Updated',
      `Constituency details updated to ${updates.name || constituency.name} (AC-${updates.acNumber || constituency.acNumber}).`,
      'info'
    );
  };

  // Update an individual village
  const updateVillage = (villageId: string, data: Partial<Village>) => {
    setVillages((prev) =>
      prev.map((v) => (v.id === villageId ? { ...v, ...data } : v))
    );
    addNotification('Village Updated', `Village details updated successfully.`, 'info');
  };

  // Delete/Remove a village
  const deleteVillage = (villageId: string) => {
    const villageToDelete = villages.find((v) => v.id === villageId);
    setVillages((prev) => prev.filter((v) => v.id !== villageId));
    addNotification(
      'Village Removed',
      `${villageToDelete?.name || 'Village'} removed from the constituency.`,
      'alert'
    );
  };

  // Reset villages to default
  const resetVillagesToDefault = () => {
    const currentPreset = ALL_PRESET_CONSTITUENCIES[constituency.id] || SINDHANUR_PRESET;
    setVillages(currentPreset.villages);
    addNotification(
      'Villages Reset',
      `Restored default ${currentPreset.villages.length} villages for ${constituency.name}.`,
      'info'
    );
  };

  // Start Meeting
  const startMeeting = (data: {
    title: string;
    type: MeetingType;
    villageId?: string;
    agenda: string[];
  }): VideoMeeting => {
    const targetVillage = villages.find((v) => v.id === data.villageId);

    const newMeeting: VideoMeeting = {
      id: `meet_${Date.now()}`,
      title: data.title,
      type: data.type,
      villageId: data.villageId,
      villageName: targetVillage?.name,
      scheduledAt: 'Live Now',
      status: 'live',
      hostName: currentUser.name,
      hostRole: currentUser.role === 'ABHI_CANDIDATE' ? 'ABHI Candidate (Host)' : 'Village Convener (Host)',
      agenda: data.agenda,
      participantsCount: 1,
      attendeesList: [
        {
          id: currentUser.id,
          name: currentUser.name,
          role: currentUser.designation || 'Host',
          village: currentUser.villageName || 'Assembly HQ',
          isAudioOn: true,
          isVideoOn: true,
          isSpeaking: true,
        },
      ],
      chat: [
        {
          id: `chat_init_${Date.now()}`,
          senderName: currentUser.name,
          senderRole: 'Host',
          message: `Live town hall started for ${data.type === 'Village' && targetVillage ? targetVillage.name : 'Constituency'}. Citizens and members are joining.`,
          timestamp: 'Just now',
        },
      ],
      actionItems: [],
    };

    setMeetings((prev) => [newMeeting, ...prev]);
    setActiveMeeting(newMeeting);
    setActiveView('meeting_room');

    addNotification(
      'Village Town Hall Started',
      `Live conference launched: "${data.title}". Attendees receiving SMS/App alerts.`,
      'meeting'
    );

    return newMeeting;
  };

  const joinMeeting = (meetingId: string) => {
    const meet = meetings.find((m) => m.id === meetingId);
    if (meet) {
      setActiveMeeting(meet);
      setActiveView('meeting_room');
    }
  };

  const leaveMeeting = () => {
    setActiveMeeting(null);
    if (currentUser.role === 'CITIZEN') {
      setActiveView('citizen_home');
    } else if (currentUser.role === 'FIELD_WORKER') {
      setActiveView('field_tasks');
    } else {
      setActiveView('dashboard');
    }
  };

  const sendMeetingMessage = (meetingId: string, message: string, isHandRaised?: boolean) => {
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newChatMsg = {
      id: `chat_${Date.now()}`,
      senderName: currentUser.name,
      senderRole: currentUser.role === 'CITIZEN' ? 'Resident Citizen' : currentUser.designation || 'Member',
      senderVillage: currentUser.villageName,
      message,
      timestamp: nowStr,
      isHandRaised,
    };

    setMeetings((prev) =>
      prev.map((m) => {
        if (m.id !== meetingId) return m;
        return {
          ...m,
          chat: [...m.chat, newChatMsg],
        };
      })
    );

    if (activeMeeting && activeMeeting.id === meetingId) {
      setActiveMeeting((prev) => (prev ? { ...prev, chat: [...prev.chat, newChatMsg] } : null));
    }
  };

  const addMeetingActionItem = (meetingId: string, task: string, assignedTo: string, village: string) => {
    const newItem = {
      id: `act_${Date.now()}`,
      task,
      assignedTo,
      village,
      status: 'pending' as const,
    };

    setMeetings((prev) =>
      prev.map((m) => {
        if (m.id !== meetingId) return m;
        return {
          ...m,
          actionItems: [...m.actionItems, newItem],
        };
      })
    );

    if (activeMeeting && activeMeeting.id === meetingId) {
      setActiveMeeting((prev) => (prev ? { ...prev, actionItems: [...prev.actionItems, newItem] } : null));
    }
  };

  const toggleMeetingActionItem = (meetingId: string, actionId: string) => {
    setMeetings((prev) =>
      prev.map((m) => {
        if (m.id !== meetingId) return m;
        return {
          ...m,
          actionItems: m.actionItems.map((a) =>
            a.id === actionId
              ? { ...a, status: a.status === 'completed' ? 'pending' : 'completed' }
              : a
          ),
        };
      })
    );

    if (activeMeeting && activeMeeting.id === meetingId) {
      setActiveMeeting((prev) =>
        prev
          ? {
              ...prev,
              actionItems: prev.actionItems.map((a) =>
                a.id === actionId
                  ? { ...a, status: a.status === 'completed' ? 'pending' : 'completed' }
                  : a
              ),
            }
          : null
      );
    }
  };

  return (
    <ConstituencyContext.Provider
      value={{
        currentUser,
        switchRole,
        issues,
        villages,
        members,
        meetings,
        announcements,
        activeMeeting,
        notifications,
        unreadNotificationCount,
        activeView,
        selectedVillageId,
        selectedIssueId,
        setActiveView,
        setSelectedVillageId,
        setSelectedIssueId,
        setActiveMeeting,
        markNotificationsAsRead,
        reportIssue,
        assignIssue,
        updateIssueStatus,
        confirmCitizenResolution,
        toggleUpvoteIssue,
        addAnnouncement,
        addPartyMember,
        removePartyMember,
        addVillage,
        addVillagesBatch,
        startMeeting,
        joinMeeting,
        leaveMeeting,
        sendMeetingMessage,
        addMeetingActionItem,
        toggleMeetingActionItem,
        constituency,
        updateConstituency,
        updateVillage,
        deleteVillage,
        resetVillagesToDefault,
      }}
    >
      {children}
    </ConstituencyContext.Provider>
  );
};

export const useConstituency = () => {
  const context = useContext(ConstituencyContext);
  if (!context) {
    throw new Error('useConstituency must be used within a ConstituencyProvider');
  }
  return context;
};
