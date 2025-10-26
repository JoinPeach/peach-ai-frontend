import { useState } from 'react';
import { X, Mail, User, Plus, Trash2, ChevronDown } from 'lucide-react';
import { Email } from './EmailPlatform';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';

interface CreateCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  emails: Email[];
  onSubmit: (caseData: {
    emailId: string;
    assignedTo: string;
    notes: string;
    tasks: string[];
  }) => void;
}

export function CreateCaseModal({ isOpen, onClose, emails, onSubmit }: CreateCaseModalProps) {
  const [selectedEmailId, setSelectedEmailId] = useState<string>('');
  const [assignedTo, setAssignedTo] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [tasks, setTasks] = useState<string[]>(['']);
  const [showValidationAlert, setShowValidationAlert] = useState(false);
  const [showEmailDropdown, setShowEmailDropdown] = useState(false);
  const [showAssignDropdown, setShowAssignDropdown] = useState(false);

  const teamMembers = ['Puneet Thiara', 'Sarah Johnson', 'Michael Chen', 'Emily Davis'];

  if (!isOpen) return null;

  const selectedEmail = emails.find(e => e.id === selectedEmailId);

  const handleAddTask = () => {
    setTasks([...tasks, '']);
  };

  const handleTaskChange = (index: number, value: string) => {
    const newTasks = [...tasks];
    newTasks[index] = value;
    setTasks(newTasks);
  };

  const handleRemoveTask = (index: number) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!selectedEmailId || !assignedTo) {
      setShowValidationAlert(true);
      return;
    }

    onSubmit({
      emailId: selectedEmailId,
      assignedTo,
      notes,
      tasks: tasks.filter(t => t.trim() !== ''),
    });

    // Reset form
    setSelectedEmailId('');
    setAssignedTo('');
    setNotes('');
    setTasks(['']);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-black/10">
          <h2 className="text-lg sm:text-xl">Create New Case</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-black/5 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Select Email */}
          <div className="space-y-2 relative">
            <label className="text-sm">Select Email *</label>
            <button
              type="button"
              onClick={() => setShowEmailDropdown(!showEmailDropdown)}
              className="w-full flex items-center justify-between gap-2 px-3 py-2 border border-black/10 rounded-lg bg-white hover:bg-black/5 transition-colors text-left text-sm"
            >
              <span className={selectedEmailId ? 'text-black' : 'text-[#7f7f7f]'}>
                {selectedEmailId 
                  ? `${emails.find(e => e.id === selectedEmailId)?.sender} - ${emails.find(e => e.id === selectedEmailId)?.subject}`
                  : 'Choose an email to create case from...'}
              </span>
              <ChevronDown className="w-4 h-4 text-[#7f7f7f]" />
            </button>
            {showEmailDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-black/10 rounded-lg shadow-lg max-h-60 overflow-y-auto z-10">
                {emails.length === 0 ? (
                  <div className="px-3 py-2 text-sm text-[#7f7f7f]">No emails available</div>
                ) : (
                  emails.map(email => (
                    <button
                      key={email.id}
                      type="button"
                      onClick={() => {
                        setSelectedEmailId(email.id);
                        setShowEmailDropdown(false);
                      }}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-[#f9f9f9] transition-colors"
                    >
                      {email.sender} - {email.subject}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Selected Email Preview */}
          {selectedEmail && (
            <div className="p-4 bg-[#f9f9f9] rounded-lg border border-black/10">
              <p className="text-sm mb-1">{selectedEmail.sender}</p>
              <p className="text-xs text-[#7f7f7f] mb-2">{selectedEmail.email}</p>
              <p className="text-sm mb-2">{selectedEmail.subject}</p>
              <p className="text-sm text-[#7f7f7f] line-clamp-3">{selectedEmail.preview}</p>
            </div>
          )}

          {/* Assign To */}
          <div className="space-y-2 relative">
            <label className="text-sm">Assign To *</label>
            <button
              type="button"
              onClick={() => setShowAssignDropdown(!showAssignDropdown)}
              className="w-full flex items-center justify-between gap-2 px-3 py-2 border border-black/10 rounded-lg bg-white hover:bg-black/5 transition-colors text-left text-sm"
            >
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span className={assignedTo ? 'text-black' : 'text-[#7f7f7f]'}>
                  {assignedTo || 'Select team member...'}
                </span>
              </div>
              <ChevronDown className="w-4 h-4 text-[#7f7f7f]" />
            </button>
            {showAssignDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-black/10 rounded-lg shadow-lg z-10">
                {teamMembers.map(member => (
                  <button
                    key={member}
                    type="button"
                    onClick={() => {
                      setAssignedTo(member);
                      setShowAssignDropdown(false);
                    }}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-[#f9f9f9] transition-colors"
                  >
                    {member}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="text-sm">Initial Notes</label>
            <Textarea
              placeholder="Add initial case notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>

          {/* Tasks */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm">Tasks</label>
              <button
                onClick={handleAddTask}
                className="flex items-center gap-1 text-sm text-[#FFA88B] hover:text-[#ff8c6b] transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Task
              </button>
            </div>
            <div className="space-y-2">
              {tasks.map((task, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder={`Task ${index + 1}...`}
                    value={task}
                    onChange={(e) => handleTaskChange(index, e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-[#FFA88B]/20 focus:border-[#FFA88B]"
                  />
                  {tasks.length > 1 && (
                    <button
                      onClick={() => handleRemoveTask(index)}
                      className="p-2 hover:bg-black/5 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-[#7f7f7f]" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-black/10">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-black/10 hover:bg-black/5 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-[rgb(60,64,67)] text-white rounded-lg hover:bg-[#2c2e31] transition-colors"
          >
            Create Case
          </button>
        </div>
        </div>
      </div>

      {/* Validation Alert Dialog */}
      <AlertDialog open={showValidationAlert} onOpenChange={setShowValidationAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Please select an email and assign the case</AlertDialogTitle>
            <AlertDialogDescription>
              You need to select an email and assign it to a team member before creating a case.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
