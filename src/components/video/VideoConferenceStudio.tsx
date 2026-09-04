import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  ScreenShare,
  Hand,
  PhoneOff,
  MessageSquare,
  Users,
  CheckSquare,
  Sparkles,
  Plus,
  Send,
  Radio,
  ShieldAlert,
  Share2,
  Copy,
  Check,
  LayoutGrid,
  Maximize2,
  Volume2,
  Phone,
  CreditCard,
  Building,
  UserPlus,
  Pin,
} from 'lucide-react';
import { useConstituency } from '../../context/ConstituencyContext';
import { VideoMeeting, PartyMember } from '../../types';

interface VideoConferenceStudioProps {
  meeting: VideoMeeting;
  onLeave: () => void;
}

export const VideoConferenceStudio: React.FC<VideoConferenceStudioProps> = ({
  meeting,
  onLeave,
}) => {
  const {
    currentUser,
    members,
    sendMeetingMessage,
    addMeetingActionItem,
    toggleMeetingActionItem,
  } = useConstituency();

  // Local media controls
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [isRecording, setIsRecording] = useState(true);

  // Layout mode: 'stage' (Speaker + bottom strip) vs 'gallery' (Equal grid for all members)
  const [layoutMode, setLayoutMode] = useState<'stage' | 'gallery'>('stage');
  const [spotlightId, setSpotlightId] = useState<string | null>(null);

  // Active right sidebar tab: 'chat' | 'attendees' | 'agenda'
  const [activeSidebar, setActiveSidebar] = useState<'chat' | 'attendees' | 'agenda'>('attendees');

  // Input states
  const [chatInput, setChatInput] = useState('');
  const [newActionTask, setNewActionTask] = useState('');
  const [newActionAssignee, setNewActionAssignee] = useState(meeting.villageName || 'Village Coordinator');
  const [copiedLink, setCopiedLink] = useState(false);
  const [selectedInviteMemberId, setSelectedInviteMemberId] = useState<string>('');

  // Real webcam feed ref
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [hasCameraStream, setHasCameraStream] = useState(false);

  // Local list of attendees so we can add invited members
  const [localAttendees, setLocalAttendees] = useState(meeting.attendeesList);

  useEffect(() => {
    setLocalAttendees(meeting.attendeesList);
  }, [meeting.attendeesList]);

  // Enrich attendees with photo, phone, voterId from members if not present
  const enrichedAttendees = useMemo(() => {
    return localAttendees.map((att) => {
      const matchedMember = members.find(
        (m) =>
          m.name.toLowerCase() === att.name.toLowerCase() ||
          att.name.toLowerCase().includes(m.name.toLowerCase()) ||
          m.name.toLowerCase().includes(att.name.toLowerCase())
      );

      return {
        ...att,
        avatarUrl:
          att.avatarUrl ||
          matchedMember?.avatarUrl ||
          `https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80`,
        phone: att.phone || matchedMember?.phone || '+91 94481 20058',
        voterId: att.voterId || matchedMember?.voterId || 'SIN58-EPIC-004128',
      };
    });
  }, [localAttendees, members]);

  // Find active speaker or spotlighted member
  const currentSpeaker = useMemo(() => {
    if (spotlightId) {
      const found = enrichedAttendees.find((a) => a.id === spotlightId);
      if (found) return found;
    }
    return enrichedAttendees.find((a) => a.isSpeaking) || enrichedAttendees[0] || {
      id: 'att_host',
      name: meeting.hostName,
      role: meeting.hostRole,
      village: meeting.villageName || 'Sindhanur Central',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=80',
      isAudioOn: true,
      isVideoOn: true,
      isSpeaking: true,
    };
  }, [spotlightId, enrichedAttendees, meeting]);

  useEffect(() => {
    let stream: MediaStream | null = null;
    if (isCameraOn) {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices
          .getUserMedia({ video: true, audio: false })
          .then((s) => {
            stream = s;
            if (videoRef.current) {
              videoRef.current.srcObject = s;
              videoRef.current.play().catch(() => {});
            }
            setHasCameraStream(true);
          })
          .catch(() => {
            setHasCameraStream(false);
          });
      }
    } else {
      if (videoRef.current && videoRef.current.srcObject) {
        const s = videoRef.current.srcObject as MediaStream;
        s.getTracks().forEach((t) => t.stop());
        videoRef.current.srcObject = null;
      }
      setHasCameraStream(false);
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [isCameraOn]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    sendMeetingMessage(meeting.id, chatInput, isHandRaised);
    setChatInput('');
  };

  const handleAddActionItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActionTask.trim()) return;

    addMeetingActionItem(
      meeting.id,
      newActionTask,
      newActionAssignee,
      meeting.villageName || 'Constituency Central'
    );
    setNewActionTask('');
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleInviteMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInviteMemberId) return;

    const memberToInvite = members.find((m) => m.id === selectedInviteMemberId);
    if (!memberToInvite) return;

    // Check if already in attendees
    if (localAttendees.some((a) => a.name === memberToInvite.name)) {
      return;
    }

    const newAttendee = {
      id: `att_${Date.now()}`,
      name: memberToInvite.name,
      role: memberToInvite.role,
      village: `${memberToInvite.villageName} (Booth #${memberToInvite.boothNumber})`,
      avatarUrl: memberToInvite.avatarUrl,
      phone: memberToInvite.phone,
      voterId: memberToInvite.voterId,
      isAudioOn: true,
      isVideoOn: true,
      isSpeaking: false,
    };

    setLocalAttendees((prev) => [...prev, newAttendee]);
    setSelectedInviteMemberId('');
  };

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col bg-stone-950 text-white select-none">
      {/* Top Conference Header Strip */}
      <div className="px-4 py-2.5 bg-stone-900 border-b border-stone-800 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-600/20 text-rose-400 border border-rose-500/30 text-xs font-bold">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>LIVE SAMVAAD</span>
          </div>

          <div>
            <h2 className="text-sm sm:text-base font-bold text-white truncate">
              {meeting.title}
            </h2>
            <p className="text-[11px] text-stone-400 flex items-center gap-2">
              <span>Type: {meeting.type} Meeting</span>
              <span>•</span>
              <span>Chaired by {meeting.hostName}</span>
              <span>•</span>
              <span className="text-emerald-400 font-semibold">
                {enrichedAttendees.length} Village Members in Call
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle: Speaker Stage vs Gallery Grid */}
          <div className="flex items-center bg-stone-800 p-0.5 rounded-xl border border-stone-700">
            <button
              onClick={() => setLayoutMode('stage')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                layoutMode === 'stage'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-stone-400 hover:text-white'
              }`}
              title="Speaker Stage View"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Speaker Stage</span>
            </button>
            <button
              onClick={() => setLayoutMode('gallery')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                layoutMode === 'gallery'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-stone-400 hover:text-white'
              }`}
              title="Gallery Grid (All Member Video Tiles)"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Members Grid</span>
            </button>
          </div>

          <button
            onClick={handleCopyLink}
            className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs flex items-center gap-1 border border-stone-700 cursor-pointer"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copiedLink ? 'Copied' : 'Invite'}</span>
          </button>

          <button
            onClick={onLeave}
            className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition shadow-xs"
          >
            <PhoneOff className="w-3.5 h-3.5" />
            <span>Leave</span>
          </button>
        </div>
      </div>

      {/* Main Studio Center: Stage + Side Panel */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left / Center Video Stage */}
        <div className="flex-1 flex flex-col p-3 sm:p-4 gap-3 bg-stone-950 overflow-y-auto">
          {/* Active Speaker Banner with Member Name & Village */}
          <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-stone-900 border border-stone-800 text-xs shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-stone-400 font-medium">Currently Speaking:</span>
              <span className="font-bold text-white text-sm">
                {currentSpeaker.name}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-stone-800 text-stone-300 text-[11px] font-semibold">
                {currentSpeaker.role}
              </span>
              <span className="hidden sm:inline text-stone-400 text-[11px]">
                • {currentSpeaker.village}
              </span>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-stone-400">
              <Volume2 className="w-4 h-4 text-emerald-400 animate-bounce" />
              <span className="hidden sm:inline">Active Audio Channel</span>
            </div>
          </div>

          {/* VIEW MODE 1: SPEAKER STAGE + BOTTOM MEMBER TILES */}
          {layoutMode === 'stage' && (
            <div className="flex-1 flex flex-col gap-3 min-h-0">
              {/* Main Speaker Screen */}
              <div className="relative flex-1 min-h-[280px] rounded-2xl bg-stone-900 border border-stone-800 overflow-hidden flex items-center justify-center shadow-2xl">
                {isScreenSharing ? (
                  /* Screen Share Mode */
                  <div className="w-full h-full p-6 bg-indigo-950/40 flex flex-col items-center justify-center text-center space-y-3">
                    <div className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold">
                      Screen Sharing: Sindhanur Irrigation & Rural Water Masterplan
                    </div>
                    <div className="max-w-md bg-stone-900/90 p-5 rounded-2xl border border-stone-700 text-left text-xs space-y-2">
                      <h4 className="font-bold text-sm text-white">
                        Sindhanur Taluk Irrigation & Rural Water Masterplan
                      </h4>
                      <ul className="list-disc pl-4 space-y-1 text-stone-300">
                        <li>Tungabhadra D-36 Distributary Canal Modernization</li>
                        <li>24x7 Drinking water supply across all 124 villages</li>
                        <li>Paddy procurement centers setup in Alabanoor & Badarli</li>
                      </ul>
                    </div>
                  </div>
                ) : hasCameraStream && currentSpeaker.name === currentUser.name ? (
                  /* Real User Camera Stream */
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover mirror"
                  />
                ) : (
                  /* High-Fidelity Speaker Stage */
                  <div className="relative w-full h-full flex items-center justify-center bg-radial from-stone-800 to-stone-950">
                    <img
                      src={currentSpeaker.avatarUrl}
                      alt={currentSpeaker.name}
                      className="w-full h-full object-cover opacity-65"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />

                    <div className="absolute text-center z-10 p-4 max-w-lg">
                      <div className="w-20 h-20 rounded-full border-4 border-white/20 mx-auto overflow-hidden shadow-2xl mb-3">
                        <img
                          src={currentSpeaker.avatarUrl}
                          alt={currentSpeaker.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <h3 className="text-xl font-bold text-white drop-shadow-md">
                        {currentSpeaker.name}
                      </h3>
                      <p className="text-xs text-indigo-300 font-semibold mt-0.5">
                        {currentSpeaker.role}
                      </p>
                      <p className="text-[11px] text-stone-300 mt-1">
                        Village: {currentSpeaker.village}
                      </p>
                    </div>
                  </div>
                )}

                {/* Speaker top-left speaking indicator */}
                <div className="absolute top-4 left-4 flex items-center gap-2 bg-stone-950/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-stone-700 text-xs font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-bold text-white">{currentSpeaker.name}</span>
                  <span className="text-stone-400">(Speaking)</span>
                </div>

                {/* Speaker bottom-left Member Name Tag & Village Pill */}
                <div className="absolute bottom-4 left-4 bg-stone-950/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-stone-700 text-xs shadow-lg">
                  <div className="font-extrabold text-white text-sm flex items-center gap-2">
                    <span>{currentSpeaker.name}</span>
                    <span className="px-2 py-0.5 rounded-md bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-wider">
                      {currentSpeaker.role}
                    </span>
                  </div>
                  <div className="text-[11px] text-stone-300 mt-0.5 flex items-center gap-1.5">
                    <Building className="w-3 h-3 text-stone-400" />
                    <span>{currentSpeaker.village}</span>
                    {currentSpeaker.voterId && (
                      <span className="text-[10px] text-amber-300 font-mono">
                        • Voter ID: {currentSpeaker.voterId}
                      </span>
                    )}
                  </div>
                </div>

                {isHandRaised && (
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-amber-500 text-stone-950 font-bold text-xs flex items-center gap-1.5 animate-bounce shadow-lg">
                    <Hand className="w-4 h-4" />
                    <span>Hand Raised</span>
                  </div>
                )}
              </div>

              {/* Secondary Participant Tiles: Showing Member Names Clearly */}
              <div className="space-y-1.5 shrink-0">
                <div className="flex items-center justify-between text-[11px] text-stone-400 px-1">
                  <span>Village Members in Meeting ({enrichedAttendees.length})</span>
                  <span className="text-[10px] text-indigo-400 font-medium">Click tile to spotlight member</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                  {enrichedAttendees.map((att) => {
                    const isSelected = currentSpeaker.id === att.id;
                    return (
                      <div
                        key={att.id}
                        onClick={() => setSpotlightId(att.id)}
                        className={`relative rounded-xl bg-stone-900 border overflow-hidden flex flex-col justify-between p-2 h-28 cursor-pointer transition group ${
                          isSelected
                            ? 'border-indigo-500 ring-2 ring-indigo-500/50 shadow-md'
                            : 'border-stone-800 hover:border-stone-600'
                        }`}
                      >
                        {/* Member Photo Background */}
                        <div className="absolute inset-0">
                          <img
                            src={att.avatarUrl}
                            alt={att.name}
                            className="w-full h-full object-cover opacity-40 group-hover:opacity-60 transition"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-transparent" />
                        </div>

                        {/* Top Micro-indicators */}
                        <div className="relative z-10 flex justify-between items-start">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              att.isSpeaking
                                ? 'bg-emerald-400 animate-ping'
                                : att.isAudioOn
                                ? 'bg-emerald-500'
                                : 'bg-stone-500'
                            }`}
                          />
                          <div className="flex items-center gap-1">
                            {att.isHandRaised && <Hand className="w-3 h-3 text-amber-400 animate-bounce" />}
                            {att.isAudioOn ? (
                              <Mic className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <MicOff className="w-3 h-3 text-rose-400" />
                            )}
                          </div>
                        </div>

                        {/* Prominent Member Name and Village tag */}
                        <div className="relative z-10 space-y-0.5">
                          <div
                            className="font-bold text-xs text-white leading-tight truncate drop-shadow-md"
                            title={att.name}
                          >
                            {att.name}
                          </div>
                          <div
                            className="text-[10px] text-indigo-300 font-medium leading-tight truncate"
                            title={att.role}
                          >
                            {att.role}
                          </div>
                          <div
                            className="text-[9px] text-stone-400 truncate"
                            title={att.village}
                          >
                            {att.village}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* VIEW MODE 2: GALLERY GRID (ALL MEMBERS ON SCREEN WITH NAME LABELS) */}
          {layoutMode === 'gallery' && (
            <div className="flex-1 overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {enrichedAttendees.map((att) => {
                  const isSpeaking = att.isSpeaking || att.id === currentSpeaker.id;
                  return (
                    <div
                      key={att.id}
                      onClick={() => setSpotlightId(att.id)}
                      className={`relative aspect-video rounded-2xl bg-stone-900 border overflow-hidden flex flex-col justify-between p-3.5 cursor-pointer transition shadow-lg group ${
                        isSpeaking
                          ? 'border-emerald-500 ring-2 ring-emerald-500/40 shadow-emerald-950/50'
                          : 'border-stone-800 hover:border-stone-600'
                      }`}
                    >
                      {/* Photo / Stream Background */}
                      <div className="absolute inset-0">
                        <img
                          src={att.avatarUrl}
                          alt={att.name}
                          className="w-full h-full object-cover opacity-50 group-hover:opacity-70 transition"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />
                      </div>

                      {/* Top status bar */}
                      <div className="relative z-10 flex items-center justify-between">
                        {isSpeaking ? (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1.5 animate-pulse">
                            <span className="w-2 h-2 rounded-full bg-emerald-400" />
                            Speaking
                          </span>
                        ) : (
                          <span className="text-[10px] text-stone-400">Live</span>
                        )}

                        <div className="flex items-center gap-1.5">
                          {att.isHandRaised && (
                            <span className="p-1 rounded-md bg-amber-500 text-stone-950">
                              <Hand className="w-3.5 h-3.5" />
                            </span>
                          )}
                          <span className="p-1 rounded-md bg-stone-950/80 text-stone-300">
                            {att.isAudioOn ? (
                              <Mic className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <MicOff className="w-3.5 h-3.5 text-rose-400" />
                            )}
                          </span>
                        </div>
                      </div>

                      {/* Prominent Member Name Card Banner */}
                      <div className="relative z-10 p-2.5 rounded-xl bg-stone-950/90 backdrop-blur-md border border-stone-800 text-xs">
                        <div className="flex items-center justify-between gap-2">
                          <div className="font-extrabold text-sm text-white truncate">
                            {att.name}
                          </div>
                          <span className="px-1.5 py-0.5 rounded bg-indigo-600 text-white text-[9px] font-bold uppercase shrink-0">
                            {att.role}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-stone-400 mt-1">
                          <span className="truncate">{att.village}</span>
                          {att.voterId && (
                            <span className="font-mono text-amber-300 text-[10px] shrink-0 font-semibold">
                              EPIC: {att.voterId}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Side Panel: Chat / Attendees / Agenda */}
        <div className="w-full md:w-92 bg-stone-900 border-l border-stone-800 flex flex-col shrink-0 h-72 md:h-auto">
          {/* Tabs */}
          <div className="flex border-b border-stone-800 text-xs font-bold">
            <button
              onClick={() => setActiveSidebar('attendees')}
              className={`flex-1 py-2.5 text-center transition cursor-pointer flex items-center justify-center gap-1.5 ${
                activeSidebar === 'attendees'
                  ? 'border-b-2 border-indigo-500 text-white bg-stone-800/50'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              Members ({enrichedAttendees.length})
            </button>
            <button
              onClick={() => setActiveSidebar('chat')}
              className={`flex-1 py-2.5 text-center transition cursor-pointer flex items-center justify-center gap-1.5 ${
                activeSidebar === 'chat'
                  ? 'border-b-2 border-indigo-500 text-white bg-stone-800/50'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Chat ({meeting.chat.length})
            </button>
            <button
              onClick={() => setActiveSidebar('agenda')}
              className={`flex-1 py-2.5 text-center transition cursor-pointer flex items-center justify-center gap-1.5 ${
                activeSidebar === 'agenda'
                  ? 'border-b-2 border-indigo-500 text-white bg-stone-800/50'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5" />
              Directives
            </button>
          </div>

          {/* Attendees Content: Showing Member Name, Contact Number, and Voter ID */}
          {activeSidebar === 'attendees' && (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Quick Member Invite Box */}
              <form onSubmit={handleInviteMember} className="p-2.5 border-b border-stone-800 bg-stone-950/40 space-y-1.5">
                <span className="text-[10px] font-bold uppercase text-stone-400 flex items-center gap-1">
                  <UserPlus className="w-3 h-3" /> Connect Village Member to Call:
                </span>
                <div className="flex gap-1.5">
                  <select
                    value={selectedInviteMemberId}
                    onChange={(e) => setSelectedInviteMemberId(e.target.value)}
                    className="flex-1 px-2 py-1.5 text-xs rounded-lg bg-stone-800 border border-stone-700 text-white focus:outline-hidden"
                  >
                    <option value="">Select Enrolled Village Member...</option>
                    {members
                      .filter((m) => !enrichedAttendees.some((a) => a.name === m.name))
                      .map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name} ({m.villageName} • {m.role})
                        </option>
                      ))}
                  </select>
                  <button
                    type="submit"
                    disabled={!selectedInviteMemberId}
                    className="px-2.5 py-1.5 text-xs font-bold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-40 cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              </form>

              {/* Attendees List with Full Member Names */}
              <div className="flex-1 p-3 overflow-y-auto space-y-2 text-xs">
                <div className="text-[10px] uppercase font-bold text-stone-400 px-1">
                  Designated Members Active in Room ({enrichedAttendees.length})
                </div>

                {enrichedAttendees.map((att) => (
                  <div
                    key={att.id}
                    className={`p-2.5 rounded-xl border transition space-y-2 ${
                      att.id === currentSpeaker.id
                        ? 'bg-indigo-950/40 border-indigo-700'
                        : 'bg-stone-800/60 border-stone-700/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={att.avatarUrl}
                          alt={att.name}
                          className="w-9 h-9 rounded-xl object-cover border border-stone-600 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          {/* Member Name */}
                          <div className="font-bold text-white text-xs leading-tight">
                            {att.name}
                          </div>
                          <div className="text-[10px] text-indigo-300 font-medium">
                            {att.role}
                          </div>
                          <div className="text-[10px] text-stone-400">
                            {att.village}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-stone-400">
                        {att.isHandRaised && <Hand className="w-3.5 h-3.5 text-amber-400" />}
                        {att.isAudioOn ? (
                          <Mic className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <MicOff className="w-3.5 h-3.5 text-stone-500" />
                        )}
                        <button
                          onClick={() => setSpotlightId(att.id)}
                          className="p-1 rounded hover:bg-stone-700 text-stone-300"
                          title="Spotlight on Stage"
                        >
                          <Pin className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Member Details: Contact Number & Voter ID */}
                    <div className="pt-1.5 border-t border-stone-700/60 flex items-center justify-between text-[10px] text-stone-300">
                      <div className="flex items-center gap-1">
                        <CreditCard className="w-3 h-3 text-amber-400" />
                        <span className="font-mono text-amber-300">{att.voterId}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-emerald-400" />
                        <a href={`tel:${att.phone}`} className="font-mono hover:underline">
                          {att.phone}
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Chat Content */}
          {activeSidebar === 'chat' && (
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 p-3 overflow-y-auto space-y-2.5 text-xs">
                {meeting.chat.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-2.5 rounded-xl text-xs space-y-1 ${
                      msg.senderName === currentUser.name
                        ? 'bg-indigo-950/80 border border-indigo-800/50 ml-4'
                        : 'bg-stone-800/80 border border-stone-700/50 mr-4'
                    }`}
                  >
                    <div className="flex justify-between items-center text-[10px] text-stone-400">
                      <span className="font-bold text-stone-200">{msg.senderName}</span>
                      <span>{msg.timestamp}</span>
                    </div>
                    <p className="text-stone-300 leading-relaxed">{msg.message}</p>
                    {msg.isHandRaised && (
                      <span className="inline-block px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-semibold">
                        ✋ Hand Raised for this question
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendMessage} className="p-3 border-t border-stone-800 flex gap-2">
                <input
                  type="text"
                  placeholder="Ask a question or raise an issue..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs rounded-xl bg-stone-800 border border-stone-700 text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {/* Agenda & Action Items Tracker */}
          {activeSidebar === 'agenda' && (
            <div className="flex-1 p-3 overflow-y-auto space-y-4 text-xs">
              {/* Meeting Agenda checklist */}
              <div>
                <div className="text-[11px] uppercase font-bold text-stone-400 mb-2">
                  Session Agenda Items
                </div>
                <div className="space-y-1.5">
                  {meeting.agenda.map((ag, idx) => (
                    <div
                      key={idx}
                      className="p-2 bg-stone-800/50 rounded-lg text-stone-300 text-[11px] flex items-start gap-2"
                    >
                      <span className="font-mono text-indigo-400">{idx + 1}.</span>
                      <span>{ag}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Items generated during townhall */}
              <div className="pt-2 border-t border-stone-800">
                <div className="text-[11px] uppercase font-bold text-stone-400 mb-2">
                  Action Directives Issued ({meeting.actionItems.length})
                </div>

                <div className="space-y-2">
                  {meeting.actionItems.map((act) => (
                    <div
                      key={act.id}
                      onClick={() => toggleMeetingActionItem(meeting.id, act.id)}
                      className={`p-2.5 rounded-xl border transition cursor-pointer text-xs space-y-1 ${
                        act.status === 'completed'
                          ? 'bg-emerald-950/40 border-emerald-800 text-stone-400 line-through'
                          : 'bg-stone-800 border-stone-700 text-stone-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">{act.task}</span>
                        {act.status === 'completed' ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        ) : (
                          <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">
                            Pending
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-stone-400">
                        Assigned: {act.assignedTo} ({act.village})
                      </div>
                    </div>
                  ))}
                </div>

                {/* Instant Directive Input for Candidate / Host */}
                <form onSubmit={handleAddActionItem} className="mt-3 space-y-2 pt-2 border-t border-stone-800">
                  <span className="text-[10px] font-bold uppercase text-stone-400 block">
                    Record Live Directive / Task:
                  </span>
                  <input
                    type="text"
                    placeholder="e.g. Inspect water tank valve by 3 PM"
                    value={newActionTask}
                    onChange={(e) => setNewActionTask(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-stone-800 border border-stone-700 text-white focus:outline-hidden"
                  />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Assignee name..."
                      value={newActionAssignee}
                      onChange={(e) => setNewActionAssignee(e.target.value)}
                      className="flex-1 px-2.5 py-1.5 text-xs rounded-lg bg-stone-800 border border-stone-700 text-white focus:outline-hidden"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs cursor-pointer"
                    >
                      Add Task
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Media Controls Bar */}
      <div className="p-3 bg-stone-900 border-t border-stone-800 flex justify-center items-center gap-3 shrink-0">
        <button
          onClick={() => setIsMicOn(!isMicOn)}
          className={`p-3 rounded-full transition cursor-pointer ${
            isMicOn
              ? 'bg-stone-800 hover:bg-stone-700 text-white'
              : 'bg-rose-600 hover:bg-rose-700 text-white'
          }`}
          title={isMicOn ? 'Mute Microphone' : 'Unmute Microphone'}
        >
          {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
        </button>

        <button
          onClick={() => setIsCameraOn(!isCameraOn)}
          className={`p-3 rounded-full transition cursor-pointer ${
            isCameraOn
              ? 'bg-stone-800 hover:bg-stone-700 text-white'
              : 'bg-rose-600 hover:bg-rose-700 text-white'
          }`}
          title={isCameraOn ? 'Turn Off Camera' : 'Turn On Camera'}
        >
          {isCameraOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
        </button>

        <button
          onClick={() => setIsScreenSharing(!isScreenSharing)}
          className={`p-3 rounded-full transition cursor-pointer ${
            isScreenSharing
              ? 'bg-indigo-600 text-white'
              : 'bg-stone-800 hover:bg-stone-700 text-stone-300'
          }`}
          title="Share Screen"
        >
          <ScreenShare className="w-5 h-5" />
        </button>

        <button
          onClick={() => setIsHandRaised(!isHandRaised)}
          className={`p-3 rounded-full transition cursor-pointer ${
            isHandRaised
              ? 'bg-amber-500 text-stone-950 shadow-md ring-2 ring-amber-300'
              : 'bg-stone-800 hover:bg-stone-700 text-stone-300'
          }`}
          title="Raise Hand to Speak"
        >
          <Hand className="w-5 h-5" />
        </button>

        <button
          onClick={onLeave}
          className="px-5 py-3 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer transition shadow-md"
        >
          <PhoneOff className="w-4 h-4" />
          <span>End / Leave Meeting</span>
        </button>
      </div>
    </div>
  );
};
