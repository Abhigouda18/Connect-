import React, { useState } from 'react';
import { X, UserCheck, Building, Clock, CheckCircle2, Shield } from 'lucide-react';
import { useConstituency } from '../../context/ConstituencyContext';
import { Issue } from '../../types';

interface AssignIssueModalProps {
  issue: Issue | null;
  onClose: () => void;
}

const DEPARTMENTS = [
  'Rural Water Supply & Sanitation (RWSS)',
  'Public Works Department (PWD)',
  'Electricity Supply Company (BESCOM)',
  'Grama Panchayat Sanitation & Health',
  'District Health Office (DHO)',
  'Education & School Infrastructure Dept',
  'Agriculture & Irrigation Wing',
  'Revenue & Taluk Office',
];

export const AssignIssueModal: React.FC<AssignIssueModalProps> = ({ issue, onClose }) => {
  const { members, assignIssue } = useConstituency();

  const [selectedMemberId, setSelectedMemberId] = useState<string>(
    members.find((m) => m.villageId === issue?.villageId)?.id || members[0]?.id || ''
  );
  const [department, setDepartment] = useState<string>(DEPARTMENTS[0]);
  const [assignmentNote, setAssignmentNote] = useState('');

  if (!issue) return null;

  // Prefer members from same village or mandal
  const sortedMembers = [...members].sort((a, b) => {
    if (a.villageId === issue.villageId && b.villageId !== issue.villageId) return -1;
    if (a.villageId !== issue.villageId && b.villageId === issue.villageId) return 1;
    return 0;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMemberId) return;

    assignIssue(
      issue.id,
      selectedMemberId,
      department,
      assignmentNote || `Dispatched from ABHI Central War Room to local field team.`
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-4 animate-in fade-in zoom-in-95">
        <div className="flex justify-between items-center border-b border-stone-100 pb-3">
          <div>
            <span className="font-mono text-xs font-bold text-indigo-700">
              {issue.ticketNumber}
            </span>
            <h3 className="font-bold text-base text-stone-900">
              Dispatch & Assign Grievance
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs">
          <span className="font-bold text-stone-900 block">{issue.title}</span>
          <span className="text-stone-500 text-[11px] block mt-0.5">
            {issue.villageName} • Ward {issue.wardNumber} • Priority: {issue.urgency}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Select field member */}
          <div>
            <label className="font-bold text-stone-700 block mb-1">
              Select Field Coordinator / Booth In-Charge <span className="text-rose-500">*</span>
            </label>
            <select
              value={selectedMemberId}
              onChange={(e) => setSelectedMemberId(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-stone-300 text-xs bg-white font-medium"
            >
              {sortedMembers.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} — {m.role} ({m.villageName}) {m.villageId === issue.villageId ? '★ Local' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Department */}
          <div>
            <label className="font-bold text-stone-700 block mb-1">
              Escalate to Government Department:
            </label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-stone-300 text-xs bg-white"
            >
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/* Internal Instructions */}
          <div>
            <label className="font-bold text-stone-700 block mb-1">
              Special Directive / Ground Instructions
            </label>
            <textarea
              rows={3}
              placeholder="e.g., Coordinate with Junior Engineer before 4 PM, provide backup drinking tanker immediately..."
              value={assignmentNote}
              onChange={(e) => setAssignmentNote(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-stone-300 text-xs resize-none focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-stone-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-stone-300 text-stone-700 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold cursor-pointer shadow-xs"
            >
              Confirm Assignment & Notify Field Team
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
