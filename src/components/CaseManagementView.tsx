import { useState, useMemo } from 'react';
import { 
  Menu, 
  Search, 
  FolderOpen, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  User,
  StickyNote,
  CheckSquare,
  Filter,
  Mail,
  Plus,
  Bell,
  Trash2
} from 'lucide-react';
import { Email } from './EmailPlatform';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { CreateCaseModal } from './CreateCaseModal';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';

interface CaseManagementViewProps {
  emails: Email[];
  onUpdateEmail: (id: string, updates: Partial<Email>) => void;
  onOpenMobileMenu?: () => void;
  onNavigate: (view: 'inbox' | 'sent') => void;
  currentUser: string;
  onViewCaseDetail: (caseId: string) => void;
  onCreateCase: (caseData: {
    emailId: string;
    assignedTo: string;
    notes: string;
    tasks: string[];
  }) => void;
  onDeleteCase: (caseId: string) => void;
}

export function CaseManagementView({ 
  emails, 
  onUpdateEmail, 
  onOpenMobileMenu,
  onNavigate,
  currentUser,
  onViewCaseDetail,
  onCreateCase,
  onDeleteCase
}: CaseManagementViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Needs Attention' | 'In Progress' | 'On Hold' | 'Resolved'>('all');
  const [assigneeFilter, setAssigneeFilter] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [caseToDelete, setCaseToDelete] = useState<{ id: string; caseNumber: string | null } | null>(null);

  // Get cases (emails with status or assigned)
  const allCases = useMemo(() => {
    return emails.filter(email => 
      email.status || 
      email.assignedTo || 
      (email.notes && email.notes.length > 0) || 
      (email.todos && email.todos.length > 0)
    );
  }, [emails]);

  // Get unique assignees from all cases
  const uniqueAssignees = useMemo(() => {
    const assignees = new Set<string>();
    allCases.forEach(caseItem => {
      if (caseItem.assignedTo) {
        assignees.add(caseItem.assignedTo);
      }
    });
    return Array.from(assignees).sort();
  }, [allCases]);

  // Calculate statistics
  const stats = useMemo(() => {
    const needsAttention = allCases.filter(c => c.status === 'Needs Attention').length;
    const inProgress = allCases.filter(c => c.status === 'In Progress').length;
    const onHold = allCases.filter(c => c.status === 'On Hold').length;
    const resolved = allCases.filter(c => c.status === 'Resolved').length;

    return { needsAttention, inProgress, onHold, resolved, total: allCases.length };
  }, [allCases]);

  // Filter cases
  const filteredCases = useMemo(() => {
    let filtered = allCases;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(c => c.status === statusFilter);
    }

    if (assigneeFilter !== 'all') {
      filtered = filtered.filter(c => c.assignedTo === assigneeFilter);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(c => 
        c.sender.toLowerCase().includes(query) ||
        c.subject.toLowerCase().includes(query) ||
        c.email.toLowerCase().includes(query) ||
        (c.caseNumber && c.caseNumber.toLowerCase().includes(query))
      );
    }

    return filtered.sort((a, b) => {
      // Sort by status priority, then by date
      const statusOrder = { 'Needs Attention': 0, 'In Progress': 1, 'On Hold': 2, 'Resolved': 3, null: 4 };
      const aStatus = statusOrder[a.status || null];
      const bStatus = statusOrder[b.status || null];
      if (aStatus !== bStatus) return aStatus - bStatus;
      
      // If same status, sort by unread, then date
      if (a.unread !== b.unread) return a.unread ? -1 : 1;
      return 0;
    });
  }, [allCases, statusFilter, assigneeFilter, searchQuery]);

  const getStatusColor = (status: string | null | undefined) => {
    switch (status) {
      case 'Needs Attention':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'In Progress':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'On Hold':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'Resolved':
        return 'bg-green-50 text-green-700 border-green-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="flex flex-1 h-full bg-white overflow-hidden">
      {/* Mobile Menu Button */}
      {onOpenMobileMenu && (
        <div className="lg:hidden absolute top-4 left-4 z-10">
          <button
            onClick={onOpenMobileMenu}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-[#7f7f7f] transition-colors hover:bg-[#f2f3f5] hover:text-black border border-black/10 bg-white"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      )}

      <div className="flex flex-1 flex-col h-full overflow-hidden">
        {/* Case List Panel */}
        <div className="w-full h-full flex flex-col bg-white">
          {/* Header */}
          <div className="p-4 lg:p-6 border-b border-black/10 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="mb-1 text-[24px] font-normal">Cases</h1>
                <p className="text-sm text-[#7f7f7f]">Track and manage student cases</p>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-[rgb(60,64,67)] text-white rounded-lg hover:bg-[#2c2e31] transition-colors"
              >
                Create Case
              </button>
            </div>
          </div>

          {/* Statistics */}
          <div className="p-4 border-b border-black/10 flex-shrink-0">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="p-3 rounded-lg border border-black/10 bg-[#f9f9f9]">
                <div className="flex items-center gap-2 mb-1">
                  <Bell className="w-4 h-4 text-red-600" />
                  <span className="text-xs text-[#7f7f7f]">Needs Attention</span>
                </div>
                <p className="text-2xl">{stats.needsAttention}</p>
              </div>
              <div className="p-3 rounded-lg border border-black/10 bg-[#f9f9f9]">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span className="text-xs text-[#7f7f7f]">In Progress</span>
                </div>
                <p className="text-2xl">{stats.inProgress}</p>
              </div>
              <div className="p-3 rounded-lg border border-black/10 bg-[#f9f9f9]">
                <div className="flex items-center gap-2 mb-1">
                  <AlertCircle className="w-4 h-4 text-yellow-600" />
                  <span className="text-xs text-[#7f7f7f]">On Hold</span>
                </div>
                <p className="text-2xl">{stats.onHold}</p>
              </div>
              <div className="p-3 rounded-lg border border-black/10 bg-[#f9f9f9]">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span className="text-xs text-[#7f7f7f]">Resolved</span>
                </div>
                <p className="text-2xl">{stats.resolved}</p>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="p-4 border-b border-black/10 flex-shrink-0">
            <div className="flex flex-col lg:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7f7f7f]" />
                <input
                  type="text"
                  placeholder="Search by case number, student name, email, or subject..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-[#FFA88B]/20 focus:border-[#FFA88B]"
                />
              </div>
              <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
                <SelectTrigger className="w-full lg:w-[200px]">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Needs Attention">Needs Attention</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="On Hold">On Hold</SelectItem>
                  <SelectItem value="Resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
              <Select value={assigneeFilter} onValueChange={(value: string) => setAssigneeFilter(value)}>
                <SelectTrigger className="w-full lg:w-[200px]">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Assignees</SelectItem>
                  {uniqueAssignees.map(assignee => (
                    <SelectItem key={assignee} value={assignee}>
                      {assignee}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Case Table - Scrollable */}
          <div className="flex-1 overflow-y-auto overflow-x-auto min-h-0 -mx-4 px-4 sm:mx-0 sm:px-0">
            {filteredCases.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-4 sm:p-8 text-center">
                <FolderOpen className="w-10 h-10 sm:w-12 sm:h-12 text-[#7f7f7f] mb-3" />
                <p className="text-sm text-[#7f7f7f] mb-2">No cases found</p>
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="text-sm text-[#FFA88B] hover:underline"
                >
                  Create your first case
                </button>
              </div>
            ) : (
              <div className="relative min-w-[1000px] lg:min-w-0">
                <table className="w-full caption-bottom text-sm">
                  <thead className="sticky top-0 z-10 bg-[#f9f9f9]">
                    <tr className="border-b border-black/10">
                      <th className="h-10 px-2 text-left align-middle font-medium whitespace-nowrap min-w-[120px] lg:w-[160px] bg-[#f9f9f9] text-xs sm:text-sm">Case Number</th>
                      <th className="h-10 px-2 text-left align-middle font-medium whitespace-nowrap min-w-[150px] lg:w-[200px] bg-[#f9f9f9] text-xs sm:text-sm">Student</th>
                      <th className="h-10 px-2 text-left align-middle font-medium whitespace-nowrap min-w-[200px] lg:w-[280px] bg-[#f9f9f9] text-xs sm:text-sm">Subject</th>
                      <th className="h-10 px-2 text-left align-middle font-medium whitespace-nowrap min-w-[120px] lg:w-[140px] bg-[#f9f9f9] text-xs sm:text-sm">Status</th>
                      <th className="h-10 px-2 text-left align-middle font-medium whitespace-nowrap min-w-[120px] lg:w-[140px] bg-[#f9f9f9] text-xs sm:text-sm">Assigned To</th>
                      <th className="h-10 px-2 text-center align-middle font-medium whitespace-nowrap min-w-[60px] lg:w-[80px] bg-[#f9f9f9] text-xs sm:text-sm">Notes</th>
                      <th className="h-10 px-2 text-left align-middle font-medium whitespace-nowrap min-w-[50px] lg:w-[60px] bg-[#f9f9f9] text-xs sm:text-sm"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCases.map(caseItem => (
                      <tr
                        key={caseItem.id}
                        className="hover:bg-[#f9f9f9] border-b border-black/5 transition-colors"
                      >
                        <td 
                          onClick={() => onViewCaseDetail(caseItem.id)}
                          className="p-2 align-middle whitespace-nowrap cursor-pointer"
                        >
                          <div className="flex items-center gap-2">
                            {caseItem.caseNumber ? (
                              <span className="text-sm font-mono text-[#7f7f7f]">{caseItem.caseNumber}</span>
                            ) : (
                              <span className="text-xs text-[#7f7f7f]">—</span>
                            )}
                          </div>
                        </td>
                        <td 
                          onClick={() => onViewCaseDetail(caseItem.id)}
                          className="p-2 align-middle whitespace-nowrap cursor-pointer"
                        >
                          <div className="flex items-center gap-2">
                            <div className="flex-1 min-w-0">
                              <p className="truncate">{caseItem.sender}</p>
                              <p className="text-xs text-[#7f7f7f] truncate">{caseItem.email}</p>
                            </div>
                          </div>
                        </td>
                        <td 
                          onClick={() => onViewCaseDetail(caseItem.id)}
                          className="p-2 align-middle whitespace-nowrap cursor-pointer"
                        >
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-[#7f7f7f] flex-shrink-0" />
                            <span className="truncate text-sm">{caseItem.subject}</span>
                          </div>
                        </td>
                        <td 
                          onClick={() => onViewCaseDetail(caseItem.id)}
                          className="p-2 align-middle whitespace-nowrap cursor-pointer"
                        >
                          {caseItem.status ? (
                            <Badge 
                              variant="outline" 
                              className={`${getStatusColor(caseItem.status)} whitespace-nowrap`}
                            >
                              {caseItem.status}
                            </Badge>
                          ) : (
                            <span className="text-xs text-[#7f7f7f]">No status</span>
                          )}
                        </td>
                        <td 
                          onClick={() => onViewCaseDetail(caseItem.id)}
                          className="p-2 align-middle whitespace-nowrap cursor-pointer"
                        >
                          {caseItem.assignedTo ? (
                            <div className="flex items-center gap-2">
                              <User className="w-3 h-3 text-[#7f7f7f]" />
                              <span className="text-sm truncate">{caseItem.assignedTo}</span>
                            </div>
                          ) : (
                            <span className="text-xs text-[#7f7f7f]">Unassigned</span>
                          )}
                        </td>
                        <td 
                          onClick={() => onViewCaseDetail(caseItem.id)}
                          className="p-2 align-middle whitespace-nowrap text-center cursor-pointer"
                        >
                          {caseItem.notes && caseItem.notes.length > 0 ? (
                            <div className="flex items-center justify-center gap-1">
                              <StickyNote className="w-4 h-4 text-[#FFA88B]" />
                              <span className="text-sm">{caseItem.notes.length}</span>
                            </div>
                          ) : (
                            <span className="text-xs text-[#7f7f7f]">—</span>
                          )}
                        </td>
                        <td className="p-2 align-middle whitespace-nowrap">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setCaseToDelete({ id: caseItem.id, caseNumber: caseItem.caseNumber || null });
                            }}
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
                            title="Delete case"
                          >
                            <Trash2 className="w-4 h-4 text-[#7f7f7f] group-hover:text-red-600" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Case Modal */}
      <CreateCaseModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        emails={emails}
        onSubmit={onCreateCase}
      />

      {/* Delete Case Confirmation Dialog */}
      <AlertDialog open={!!caseToDelete} onOpenChange={(open) => !open && setCaseToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Case</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete case <span className="font-mono">{caseToDelete?.caseNumber || 'this case'}</span>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setCaseToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (caseToDelete) {
                  onDeleteCase(caseToDelete.id);
                  setCaseToDelete(null);
                }
              }}
              className="bg-red-500 hover:bg-red-600 focus:ring-red-500"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
