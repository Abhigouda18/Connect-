export type UserRole = 'CITIZEN' | 'FIELD_WORKER' | 'ABHI_CANDIDATE';

export type IssueCategory =
  | 'roads'
  | 'water'
  | 'electricity'
  | 'garbage'
  | 'drainage'
  | 'streetlights'
  | 'healthcare'
  | 'education'
  | 'agriculture'
  | 'other';

export type IssueStatus =
  | 'Received'
  | 'Assigned'
  | 'In Progress'
  | 'Resolved'
  | 'Citizen Confirmed';

export type IssueUrgency = 'low' | 'medium' | 'high' | 'critical';

export interface IssueTimelineEntry {
  id: string;
  status: IssueStatus;
  timestamp: string;
  authorName: string;
  authorRole: string;
  note: string;
  photoProofUrl?: string;
}

export interface CitizenRating {
  rating: number; // 1 to 5
  feedback: string;
  confirmedAt: string;
  citizenName: string;
}

export interface Issue {
  id: string;
  ticketNumber: string;
  title: string;
  description: string;
  category: IssueCategory;
  urgency: IssueUrgency;
  status: IssueStatus;
  villageId: string;
  villageName: string;
  wardNumber: number;
  boothNumber: number;
  landmark: string;
  latitude: number;
  longitude: number;
  photoUrl?: string;
  reportedBy: {
    name: string;
    phone: string;
    isAnonymous: boolean;
  };
  assignedTo?: {
    memberId: string;
    name: string;
    role: string;
    phone: string;
    designation: string;
  };
  department?: string;
  estimatedResolutionDays?: number;
  timeline: IssueTimelineEntry[];
  citizenRating?: CitizenRating;
  upvotes: number;
  upvotedBy: string[]; // user IDs or phones
  createdAt: string;
  updatedAt: string;
}

export interface Village {
  id: string;
  name: string;
  kannadaName?: string;
  gramPanchayat?: string;
  taluk?: string;
  district?: string;
  constituency?: string;
  mandal: string;
  wardsCount: number;
  boothsCount: number;
  population: number;
  registeredMembers: number;
  coordinatorId: string;
  coordinatorName: string;
  coordinatorPhone: string;
  lat: number;
  lng: number;
  activeIssuesCount: number;
  resolvedIssuesCount: number;
  lastMeetingDate?: string;
}

export interface PartyMember {
  id: string;
  name: string;
  kannadaName?: string;
  phone: string;
  voterId: string; // Voter ID / EPIC card number
  email?: string;
  villageId: string;
  villageName: string;
  wardNumber: number;
  boothNumber: number;
  role: string; // e.g. "Booth In-Charge", "Village President", "Youth Wing Convenor", "Grievance Coordinator"
  avatarUrl: string;
  status: 'active' | 'inactive';
  responsibilities: string[];
  tasksAssigned: number;
  tasksResolved: number;
  joinedDate: string;
}

export type MeetingType = 'Constituency' | 'Village' | 'Ward/Booth';

export interface MeetingChatMessage {
  id: string;
  senderName: string;
  senderRole: string;
  senderVillage?: string;
  message: string;
  timestamp: string;
  isHandRaised?: boolean;
}

export interface MeetingActionItem {
  id: string;
  task: string;
  assignedTo: string;
  village: string;
  status: 'pending' | 'in_progress' | 'completed';
}

export interface VideoMeeting {
  id: string;
  title: string;
  type: MeetingType;
  villageId?: string;
  villageName?: string;
  wardNumber?: number;
  boothNumber?: number;
  scheduledAt: string;
  status: 'live' | 'upcoming' | 'completed';
  hostName: string;
  hostRole: string;
  agenda: string[];
  participantsCount: number;
  attendeesList: {
    id: string;
    name: string;
    role: string;
    village: string;
    avatarUrl?: string;
    phone?: string;
    voterId?: string;
    isAudioOn: boolean;
    isVideoOn: boolean;
    isSpeaking: boolean;
    isHandRaised?: boolean;
  }[];
  chat: MeetingChatMessage[];
  actionItems: MeetingActionItem[];
  notes?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: 'development_work' | 'public_meeting' | 'scheme' | 'emergency_alert';
  author: string;
  date: string;
  targetScope: 'All Constituency' | string; // or specific village
  metrics?: {
    budgetSanctioned?: string;
    beneficiariesCount?: number;
    completionTarget?: string;
  };
  pinned?: boolean;
}

export interface ConstituencyProfile {
  id: string;
  name: string;
  acNumber: string;
  district: string;
  state: string;
  candidateName: string;
  candidateTitle: string;
  helpline: string;
  description?: string;
  totalElectors?: number;
  totalBooths?: number;
}

export interface CurrentUser {
  id: string;
  name: string;
  phone: string;
  role: UserRole;
  villageId?: string;
  villageName?: string;
  wardNumber?: number;
  boothNumber?: number;
  designation?: string;
  avatarUrl?: string;
}
