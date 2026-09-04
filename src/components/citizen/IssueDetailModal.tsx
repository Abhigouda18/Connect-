import React, { useState } from 'react';
import {
  X,
  MapPin,
  Clock,
  User,
  Phone,
  Building,
  CheckCircle2,
  ThumbsUp,
  Star,
  Camera,
  Send,
  AlertCircle,
  Share2,
} from 'lucide-react';
import { useConstituency } from '../../context/ConstituencyContext';
import { IssueStatus } from '../../types';

interface IssueDetailModalProps {
  issueId: string | null;
  onClose: () => void;
}

const LIFECYCLE_STEPS: IssueStatus[] = [
  'Received',
  'Assigned',
  'In Progress',
  'Resolved',
  'Citizen Confirmed',
];

export const IssueDetailModal: React.FC<IssueDetailModalProps> = ({ issueId, onClose }) => {
  const {
    issues,
    currentUser,
    updateIssueStatus,
    confirmCitizenResolution,
    toggleUpvoteIssue,
  } = useConstituency();

  const issue = issues.find((i) => i.id === issueId);

  // Citizen rating state
  const [rating, setRating] = useState<number>(5);
  const [feedback, setFeedback] = useState('');
  const [hasRated, setHasRated] = useState(false);

  // Field worker / Admin status update state
  const [showStatusUpdate, setShowStatusUpdate] = useState(false);
  const [newStatus, setNewStatus] = useState<IssueStatus>('In Progress');
  const [updateNote, setUpdateNote] = useState('');
  const [proofPhotoUrl, setProofPhotoUrl] = useState('');

  if (!issue) return null;

  const currentStepIndex = LIFECYCLE_STEPS.indexOf(issue.status);

  const handleCitizenConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    confirmCitizenResolution(issue.id, rating, feedback || 'Issue verified and resolved satisfactorily.');
    setHasRated(true);
  };

  const handleFieldUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!updateNote.trim()) return;
    updateIssueStatus(issue.id, newStatus, updateNote, proofPhotoUrl || undefined);
    setShowStatusUpdate(false);
    setUpdateNote('');
    setProofPhotoUrl('');
  };

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case 'critical':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      case 'high':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'medium':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-stone-100 text-stone-700 border-stone-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-stone-900 text-white flex justify-between items-start shrink-0">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-stone-800 text-amber-300 border border-stone-700">
                {issue.ticketNumber}
              </span>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded border ${getUrgencyBadge(issue.urgency)}`}>
                {issue.urgency.toUpperCase()} PRIORITY
              </span>
              <span className="text-xs text-stone-400">
                Reported {new Date(issue.createdAt).toLocaleDateString()}
              </span>
            </div>
            <h2 className="text-lg font-bold text-white mt-1.5 leading-snug">
              {issue.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="text-stone-400 hover:text-white p-1 rounded-lg hover:bg-stone-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Scrollable */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Visual Lifecycle Pipeline Stepper */}
          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
            <div className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
              Grievance Lifecycle Progression
            </div>

            <div className="grid grid-cols-5 gap-1 sm:gap-2">
              {LIFECYCLE_STEPS.map((step, idx) => {
                const isPassed = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;

                return (
                  <div key={step} className="flex flex-col items-center text-center">
                    <div
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold mb-1 transition-all ${
                        isCurrent
                          ? 'bg-indigo-600 text-white ring-4 ring-indigo-100 shadow-xs scale-105'
                          : isPassed
                          ? 'bg-emerald-600 text-white'
                          : 'bg-stone-200 text-stone-500'
                      }`}
                    >
                      {isPassed ? (
                        <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
                      ) : (
                        <span>{idx + 1}</span>
                      )}
                    </div>
                    <span
                      className={`text-[10px] sm:text-xs leading-tight font-medium ${
                        isCurrent
                          ? 'text-indigo-900 font-bold'
                          : isPassed
                          ? 'text-stone-800'
                          : 'text-stone-400'
                      }`}
                    >
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Details & Photo grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                  Description
                </h4>
                <p className="text-sm text-stone-800 mt-1 leading-relaxed whitespace-pre-wrap">
                  {issue.description}
                </p>
              </div>

              <div className="pt-2 border-t border-stone-100 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-stone-600">
                  <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>
                    <strong>{issue.villageName}</strong>, Ward {issue.wardNumber} • {issue.landmark}
                  </span>
                </div>

                {issue.department && (
                  <div className="flex items-center gap-2 text-stone-600">
                    <Building className="w-4 h-4 text-indigo-500 shrink-0" />
                    <span>
                      Concerned Dept: <strong>{issue.department}</strong>
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-2 text-stone-600">
                  <User className="w-4 h-4 text-stone-400 shrink-0" />
                  <span>
                    Reported by:{' '}
                    <strong>
                      {issue.reportedBy.isAnonymous ? 'Resident (Confidential)' : issue.reportedBy.name}
                    </strong>
                  </span>
                </div>

                {issue.assignedTo && (
                  <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl mt-2">
                    <div className="text-[11px] font-bold text-amber-900 uppercase">
                      Assigned Local Field Coordinator
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <div>
                        <div className="text-xs font-bold text-stone-900">
                          {issue.assignedTo.name}
                        </div>
                        <div className="text-[11px] text-stone-500">
                          {issue.assignedTo.designation}
                        </div>
                      </div>
                      <a
                        href={`tel:${issue.assignedTo.phone}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-amber-300 text-amber-800 text-xs font-semibold hover:bg-amber-100 cursor-pointer"
                      >
                        <Phone className="w-3 h-3" />
                        Call
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Photo / Proof preview */}
            <div>
              <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-1.5">
                Site Photo / Verification Proof
              </h4>
              {issue.photoUrl ? (
                <div className="rounded-xl overflow-hidden border border-stone-200 bg-stone-100">
                  <img
                    src={issue.photoUrl}
                    alt="Issue site"
                    className="w-full h-48 object-cover hover:scale-102 transition duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="p-2 text-[11px] text-stone-500 bg-stone-50 border-t border-stone-200">
                    Uploaded during grievance submission
                  </div>
                </div>
              ) : (
                <div className="h-48 rounded-xl border-2 border-dashed border-stone-200 flex flex-col items-center justify-center text-stone-400 p-4 text-center">
                  <Camera className="w-8 h-8 mb-1 text-stone-300" />
                  <span className="text-xs">No initial photo attached</span>
                  <span className="text-[10px] text-stone-400 mt-0.5">
                    Field coordinator will take on-ground inspection pictures
                  </span>
                </div>
              )}

              {/* Upvote count */}
              <div className="mt-3 flex items-center justify-between">
                <button
                  onClick={() => toggleUpvoteIssue(issue.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition cursor-pointer ${
                    issue.upvotedBy.includes(currentUser.id)
                      ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                      : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>I also face this ({issue.upvotes})</span>
                </button>
                <span className="text-xs text-stone-500">
                  {issue.upvotes} village residents validated
                </span>
              </div>
            </div>
          </div>

          {/* Citizen Rating / Confirmation Box (Active when Resolved, or shows existing confirmation) */}
          {issue.status === 'Resolved' && !issue.citizenRating && (
            <div className="p-5 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-300 rounded-2xl shadow-xs">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-emerald-600 text-white shrink-0">
                  <Star className="w-5 h-5 fill-white" />
                </div>
                <div className="w-full">
                  <h3 className="text-sm font-bold text-emerald-950">
                    Field Team Marked This Resolved — Citizen Confirmation Required
                  </h3>
                  <p className="text-xs text-emerald-800 mt-0.5">
                    Constituency governance requires resident sign-off. Please confirm if the work was completed to your satisfaction.
                  </p>

                  <form onSubmit={handleCitizenConfirm} className="mt-3 space-y-3">
                    <div>
                      <span className="text-xs font-bold text-emerald-900 block mb-1">
                        Rate Quality of Resolution (1 to 5 Stars):
                      </span>
                      <div className="flex gap-1.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className="p-1 cursor-pointer transition hover:scale-110"
                          >
                            <Star
                              className={`w-6 h-6 ${
                                star <= rating
                                  ? 'text-amber-500 fill-amber-400'
                                  : 'text-stone-300'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <input
                        type="text"
                        placeholder="Add citizen comments / feedback for ABHI Hegde's office..."
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-emerald-300 bg-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Confirm Resolution & Sign Off
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Already Confirmed Rating Display */}
          {issue.citizenRating && (
            <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-xl flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-emerald-950">
                    Confirmed by Resident ({issue.citizenRating.citizenName})
                  </span>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          s <= issue.citizenRating!.rating
                            ? 'text-amber-500 fill-amber-400'
                            : 'text-stone-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] text-stone-500">
                    {issue.citizenRating.confirmedAt}
                  </span>
                </div>
                <p className="text-xs text-stone-700 italic mt-1">
                  "{issue.citizenRating.feedback}"
                </p>
              </div>
            </div>
          )}

          {/* Field Worker / ABHI Update Action Accordion */}
          {(currentUser.role === 'FIELD_WORKER' || currentUser.role === 'ABHI_CANDIDATE') && (
            <div className="pt-2 border-t border-stone-200">
              {!showStatusUpdate ? (
                <button
                  type="button"
                  onClick={() => setShowStatusUpdate(true)}
                  className="w-full py-2.5 rounded-xl border border-amber-400 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  Add Field Worker Progress Update / Change Status
                </button>
              ) : (
                <form onSubmit={handleFieldUpdateSubmit} className="p-4 bg-amber-50/60 border border-amber-300 rounded-xl space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-amber-950 uppercase">
                      Log Field Action / Department Intervention
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowStatusUpdate(false)}
                      className="text-xs text-stone-400 hover:text-stone-600"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-bold text-stone-700 block mb-1">
                        New Status
                      </label>
                      <select
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value as IssueStatus)}
                        className="w-full p-2 text-xs rounded-lg border border-amber-300 bg-white"
                      >
                        <option value="Assigned">Assigned to Local Team</option>
                        <option value="In Progress">In Progress (Work Underway)</option>
                        <option value="Resolved">Resolved (Awaiting Citizen Confirmation)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-stone-700 block mb-1">
                        Work Proof Photo (URL)
                      </label>
                      <input
                        type="text"
                        placeholder="https://images.unsplash.com/..."
                        value={proofPhotoUrl}
                        onChange={(e) => setProofPhotoUrl(e.target.value)}
                        className="w-full p-2 text-xs rounded-lg border border-amber-300 bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-stone-700 block mb-1">
                      Action Note / Department Response <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={2}
                      placeholder="e.g., PWD engineer inspected site, materials arrived, repair completed..."
                      value={updateNote}
                      onChange={(e) => setUpdateNote(e.target.value)}
                      className="w-full p-2 text-xs rounded-lg border border-amber-300 bg-white resize-none"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                    >
                      Save Status & Notify Citizen
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Audit History & Chronological Timeline */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Chronological Audit Trail & Actions ({issue.timeline.length})
            </h4>

            <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-200">
              {issue.timeline.map((entry) => (
                <div key={entry.id} className="relative group">
                  <div className="absolute -left-6 top-1.5 w-3 h-3 rounded-full bg-indigo-600 ring-4 ring-white" />
                  <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 text-xs">
                    <div className="flex justify-between items-center text-[11px] text-stone-500 mb-1">
                      <span className="font-bold text-stone-900">
                        {entry.authorName}{' '}
                        <span className="font-normal text-stone-500">({entry.authorRole})</span>
                      </span>
                      <span>{entry.timestamp}</span>
                    </div>
                    <p className="text-stone-700">{entry.note}</p>
                    {entry.photoProofUrl && (
                      <div className="mt-2 rounded-lg overflow-hidden border border-stone-200 max-w-xs">
                        <img
                          src={entry.photoProofUrl}
                          alt="Proof"
                          className="w-full h-32 object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-stone-50 border-t border-stone-200 flex justify-between items-center shrink-0">
          <div className="text-xs text-stone-500">
            Assembly AC-58 Sindhanur Governance Audit Log
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-stone-100 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
