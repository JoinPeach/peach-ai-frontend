import { useState, useRef } from 'react';
import { 
  ArrowLeft,
  Mail,
  User,
  Calendar,
  StickyNote,
  CheckSquare,
  Plus,
  Send,
  Trash2,
  FileText,
  X
} from 'lucide-react';
import { Email, CaseNote, TodoItem } from './EmailPlatform';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { AIResponseEditor } from './AIResponseEditor';

interface CaseDetailViewProps {
  caseData: Email;
  onBack: () => void;
  onUpdateCase: (id: string, updates: Partial<Email>) => void;
  onNavigate: (view: 'inbox' | 'sent') => void;
  currentUser: string;
  onSendEmail?: (email: Email, responseContent: string, attachments: string[]) => void;
}

export function CaseDetailView({ 
  caseData, 
  onBack, 
  onUpdateCase,
  onNavigate,
  currentUser,
  onSendEmail 
}: CaseDetailViewProps) {
  const [isAddNoteModalOpen, setIsAddNoteModalOpen] = useState(false);
  const [isAddTodoModalOpen, setIsAddTodoModalOpen] = useState(false);
  const [noteContent, setNoteContent] = useState('');
  const [todoContent, setTodoContent] = useState('');
  const [todoAssignee, setTodoAssignee] = useState<string>('');
  const [showAIEditor, setShowAIEditor] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [currentDisplayResponse, setCurrentDisplayResponse] = useState('');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<{ name: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddNote = () => {
    if (!noteContent.trim()) return;

    const newNote: CaseNote = {
      id: `note-${Date.now()}`,
      author: currentUser,
      authorRole: 'Financial Aid Counselor',
      timestamp: new Date().toLocaleString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }),
      content: noteContent.trim()
    };

    const updatedNotes = [...(caseData.notes || []), newNote];
    onUpdateCase(caseData.id, { notes: updatedNotes });
    setNoteContent('');
    setIsAddNoteModalOpen(false);
  };

  const handleAddTodo = () => {
    if (!todoContent.trim()) return;

    const newTodo: TodoItem = {
      id: `todo-${Date.now()}`,
      content: todoContent.trim(),
      completed: false,
      assignedTo: todoAssignee || currentUser,
      createdBy: currentUser,
      createdAt: new Date().toISOString()
    };

    const updatedTodos = [...(caseData.todos || []), newTodo];
    onUpdateCase(caseData.id, { todos: updatedTodos });
    setTodoContent('');
    setTodoAssignee('');
    setIsAddTodoModalOpen(false);
  };

  const handleToggleTodo = (todoId: string) => {
    const updatedTodos = caseData.todos?.map(todo => 
      todo.id === todoId 
        ? { 
            ...todo, 
            completed: !todo.completed,
            completedAt: !todo.completed ? new Date().toISOString() : undefined
          }
        : todo
    );
    
    onUpdateCase(caseData.id, { todos: updatedTodos });
  };

  const handleDeleteTodo = (todoId: string) => {
    const updatedTodos = caseData.todos?.filter(todo => todo.id !== todoId);
    onUpdateCase(caseData.id, { todos: updatedTodos });
  };

  const handleUpdateStatus = (status: 'Needs Attention' | 'In Progress' | 'On Hold' | 'Resolved' | null) => {
    onUpdateCase(caseData.id, { status });
  };

  const getStatusColor = (status: string | null | undefined) => {
    switch (status) {
      case 'Needs Attention':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'Resolved':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'In Progress':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'On Hold':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const generateAIResponse = () => {
    setIsGeneratingAI(true);
    
    // Simulate AI generation
    setTimeout(() => {
      const response = `Dear ${caseData.sender},

Thank you for contacting our Financial Aid office regarding your FAFSA submission.

I'd be happy to help you understand the PARENT PLUS Loan process. The PARENT PLUS Loan is a federal student loan that parents of dependent undergraduate students can use to help pay for college or career school.

Here are the key points:
• Parents must not have an adverse credit history
• The loan amount can cover the full cost of attendance minus other financial aid received
• Repayment begins within 60 days after the final loan disbursement

To apply, your parent should complete the PARENT PLUS Loan application at studentaid.gov. They'll need to provide their FSA ID.

Would you like me to schedule a call to discuss this further and review your complete financial aid package?

Best regards,
${currentUser}
Financial Aid Office`;
      
      setAiResponse(response);
      setCurrentDisplayResponse(response);
      setIsGeneratingAI(false);
    }, 2000);
  };

  const handleShowAIEditor = () => {
    if (!aiResponse) {
      generateAIResponse();
    }
    setShowAIEditor(true);
  };

  const handleRegenerate = () => {
    generateAIResponse();
  };

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files).map(file => ({ name: file.name }));
      setAttachedFiles([...attachedFiles, ...newFiles]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setAttachedFiles(attachedFiles.filter((_, i) => i !== index));
  };

  const handleSend = () => {
    if (onSendEmail) {
      onSendEmail(caseData, currentDisplayResponse, attachedFiles.map(f => f.name));
    }
    setShowAIEditor(false);
    setAiResponse('');
    setCurrentDisplayResponse('');
    setAttachedFiles([]);
  };

  return (
    <div className="flex flex-1 flex-col h-full bg-white overflow-hidden">
      {/* Header with back button */}
      <div className="p-3 sm:p-4 lg:p-6 border-b border-black/10">
        <div className="flex items-center gap-2 sm:gap-4 mb-3 sm:mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="gap-1 sm:gap-2 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Cases</span>
            <span className="sm:hidden">Back</span>
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
          <div className="flex-1 min-w-0 w-full sm:w-auto">
            <h2 className="mb-1 text-lg sm:text-xl truncate">{caseData.sender}</h2>
            <p className="text-sm text-[#7f7f7f] truncate">{caseData.email}</p>
          </div>
          <Select 
            value={caseData.status || 'none'} 
            onValueChange={(value) => handleUpdateStatus(value === 'none' ? null : value as any)}
          >
            <SelectTrigger className="w-full sm:w-[160px]">
              <SelectValue placeholder="Set status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No Status</SelectItem>
              <SelectItem value="Needs Attention">Needs Attention</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="On Hold">On Hold</SelectItem>
              <SelectItem value="Resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="gap-1 text-xs sm:text-sm">
            <Mail className="w-3 h-3 flex-shrink-0" />
            <span className="truncate max-w-[150px] sm:max-w-none">{caseData.subject}</span>
          </Badge>
          {caseData.assignedTo && (
            <Badge variant="outline" className="gap-1 text-xs sm:text-sm">
              <User className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{caseData.assignedTo}</span>
            </Badge>
          )}
          <Badge variant="outline" className="gap-1 text-xs sm:text-sm whitespace-nowrap">
            <Calendar className="w-3 h-3 flex-shrink-0" />
            {caseData.date} at {caseData.time}
          </Badge>
        </div>
      </div>

      {/* Case Content */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6">
        {/* Original Email */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Mail className="w-4 h-4 text-[#7f7f7f]" />
            <h3 className="text-sm">Original Email</h3>
          </div>
          <div className="p-4 rounded-lg border border-black/10 bg-[#f9f9f9]">
            <p className="text-sm mb-2">{caseData.fullMessage}</p>
            <button
              onClick={handleShowAIEditor}
              className="text-sm text-[#FFA88B] hover:underline flex items-center gap-1"
            >
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none">
                <path d="M19 23.375C19 23.9618 18.5523 24.4375 18 24.4375C17.4477 24.4375 17 23.9618 17 23.375C17 22.7882 17.4477 22.3125 18 22.3125C18.5523 22.3125 19 22.7882 19 23.375Z" fill="currentColor"/>
                <path d="M23 19.125C23 19.7118 22.5523 20.1875 22 20.1875C21.4477 20.1875 21 19.7118 21 19.125C21 18.5382 21.4477 18.0625 22 18.0625C22.5523 18.0625 23 18.5382 23 19.125Z" fill="currentColor"/>
                <path d="M3 6.375C3 6.9618 2.55228 7.4375 2 7.4375C1.44772 7.4375 1 6.9618 1 6.375C1 5.7882 1.44772 5.3125 2 5.3125C2.55228 5.3125 3 5.7882 3 6.375Z" fill="currentColor"/>
                <path d="M7 2.125C7 2.7118 6.55228 3.1875 6 3.1875C5.44772 3.1875 5 2.7118 5 2.125C5 1.5382 5.44772 1.0625 6 1.0625C6.55228 1.0625 7 1.5382 7 2.125Z" fill="currentColor"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M12 6.8881L11.3478 9.74586C11.0871 10.8882 10.2477 11.78 9.17257 12.057L6.48292 12.75L9.17257 13.443C10.2477 13.72 11.0871 14.6118 11.3478 15.7541L12 18.6119L12.6522 15.7541C12.9129 14.6118 13.7523 13.72 14.8274 13.443L17.5171 12.75L14.8274 12.057C13.7523 11.78 12.9129 10.8882 12.6522 9.74586L12 6.8881ZM13.3052 5.34072C12.9733 3.88642 11.0267 3.88643 10.6948 5.34072L9.78151 9.34232C9.66301 9.86155 9.28146 10.2669 8.79277 10.3929L5.02656 11.3632C3.65781 11.7158 3.65781 13.7842 5.02656 14.1368L8.79277 15.1071C9.28146 15.2331 9.66301 15.6385 9.78151 16.1577L10.6948 20.1593C11.0267 21.6136 12.9733 21.6136 13.3052 20.1593L14.2185 16.1577C14.337 15.6385 14.7185 15.2331 15.2072 15.1071L18.9734 14.1368C20.3422 13.7842 20.3422 11.7158 18.9734 11.3632L15.2072 10.3929C14.7185 10.2669 14.337 9.86155 14.2185 9.34232L13.3052 5.34072Z" fill="currentColor"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M9.00462 23.7094C8.83081 24.2041 8.31241 24.4555 7.84673 24.2709C4.8303 23.0747 2.40732 20.5914 1.16973 17.4493C0.977847 16.9621 1.194 16.4019 1.65252 16.198C2.11105 15.9941 2.63831 16.2238 2.8302 16.711C3.8762 19.3667 5.92654 21.468 8.47615 22.4791C8.94183 22.6638 9.17843 23.2146 9.00462 23.7094Z" fill="currentColor"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M22.3153 9.02077C21.8498 9.19493 21.3312 8.95873 21.157 8.49319C20.1979 5.92954 18.1971 3.87072 15.6693 2.83251C15.2095 2.64366 14.9899 2.11784 15.1787 1.65806C15.3676 1.19827 15.8934 0.978632 16.3532 1.16748C19.3427 2.39533 21.7076 4.82798 22.8429 7.86246C23.0171 8.32801 22.7809 8.8466 22.3153 9.02077Z" fill="currentColor"/>
              </svg>
              Reply with AI
            </button>
          </div>
        </div>

        {/* AI Response Section */}
        {showAIEditor && (
          <div className="mb-6">
            {!aiResponse || isGeneratingAI ? (
              <div className="bg-[#f8fbff] border border-[#c4c4c4] rounded-2xl p-6 shadow-sm">
                <div className="flex items-start gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                      <path d="M19 23.375C19 23.9618 18.5523 24.4375 18 24.4375C17.4477 24.4375 17 23.9618 17 23.375C17 22.7882 17.4477 22.3125 18 22.3125C18.5523 22.3125 19 22.7882 19 23.375Z" fill="black"/>
                      <path d="M23 19.125C23 19.7118 22.5523 20.1875 22 20.1875C21.4477 20.1875 21 19.7118 21 19.125C21 18.5382 21.4477 18.0625 22 18.0625C22.5523 18.0625 23 18.5382 23 19.125Z" fill="black"/>
                      <path d="M3 6.375C3 6.9618 2.55228 7.4375 2 7.4375C1.44772 7.4375 1 6.9618 1 6.375C1 5.7882 1.44772 5.3125 2 5.3125C2.55228 5.3125 3 5.7882 3 6.375Z" fill="black"/>
                      <path d="M7 2.125C7 2.7118 6.55228 3.1875 6 3.1875C5.44772 3.1875 5 2.7118 5 2.125C5 1.5382 5.44772 1.0625 6 1.0625C6.55228 1.0625 7 1.5382 7 2.125Z" fill="black"/>
                      <path fillRule="evenodd" clipRule="evenodd" d="M12 6.8881L11.3478 9.74586C11.0871 10.8882 10.2477 11.78 9.17257 12.057L6.48292 12.75L9.17257 13.443C10.2477 13.72 11.0871 14.6118 11.3478 15.7541L12 18.6119L12.6522 15.7541C12.9129 14.6118 13.7523 13.72 14.8274 13.443L17.5171 12.75L14.8274 12.057C13.7523 11.78 12.9129 10.8882 12.6522 9.74586L12 6.8881ZM13.3052 5.34072C12.9733 3.88642 11.0267 3.88643 10.6948 5.34072L9.78151 9.34232C9.66301 9.86155 9.28146 10.2669 8.79277 10.3929L5.02656 11.3632C3.65781 11.7158 3.65781 13.7842 5.02656 14.1368L8.79277 15.1071C9.28146 15.2331 9.66301 15.6385 9.78151 16.1577L10.6948 20.1593C11.0267 21.6136 12.9733 21.6136 13.3052 20.1593L14.2185 16.1577C14.337 15.6385 14.7185 15.2331 15.2072 15.1071L18.9734 14.1368C20.3422 13.7842 20.3422 11.7158 18.9734 11.3632L15.2072 10.3929C14.7185 10.2669 14.337 9.86155 14.2185 9.34232L13.3052 5.34072Z" fill="black"/>
                      <path fillRule="evenodd" clipRule="evenodd" d="M9.00462 23.7094C8.83081 24.2041 8.31241 24.4555 7.84673 24.2709C4.8303 23.0747 2.40732 20.5914 1.16973 17.4493C0.977847 16.9621 1.194 16.4019 1.65252 16.198C2.11105 15.9941 2.63831 16.2238 2.8302 16.711C3.8762 19.3667 5.92654 21.468 8.47615 22.4791C8.94183 22.6638 9.17843 23.2146 9.00462 23.7094Z" fill="black"/>
                      <path fillRule="evenodd" clipRule="evenodd" d="M22.3153 9.02077C21.8498 9.19493 21.3312 8.95873 21.157 8.49319C20.1979 5.92954 18.1971 3.87072 15.6693 2.83251C15.2095 2.64366 14.9899 2.11784 15.1787 1.65806C15.3676 1.19827 15.8934 0.978632 16.3532 1.16748C19.3427 2.39533 21.7076 4.82798 22.8429 7.86246C23.0171 8.32801 22.7809 8.8466 22.3153 9.02077Z" fill="black"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-[#2e2c34]">AI Suggested Email</p>
                    <p className="text-sm italic text-[#2e2c34] opacity-70 mt-1">Reference: FAFSA Guide 2024-2025</p>
                  </div>
                </div>

                <div className="text-base italic text-[#2e2c34] whitespace-pre-wrap">
                  {isGeneratingAI ? (
                    <div className="flex items-center gap-3 py-8">
                      <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-[#2e2c34]"></div>
                      <span>Generating AI response based on email and knowledge base...</span>
                    </div>
                  ) : (
                    <p>{currentDisplayResponse}</p>
                  )}
                </div>

                {!isGeneratingAI && attachedFiles.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-[#c4c4c4]">
                    <p className="text-sm text-[#2e2c34] mb-2">Attached Files:</p>
                    <div className="flex flex-wrap gap-2">
                      {attachedFiles.map((file, index) => (
                        <div 
                          key={index}
                          className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-[#ced0df] rounded-lg"
                        >
                          <FileText className="w-4 h-4 text-[#666666]" />
                          <span className="text-sm text-[#2e2c34]">{file.name}</span>
                          <button
                            onClick={() => handleRemoveFile(index)}
                            className="p-0.5 hover:bg-gray-100 rounded transition-colors"
                          >
                            <X className="w-4 h-4 text-[#666666]" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {!isGeneratingAI && (
                  <div className="flex items-center gap-3 mt-6 justify-end flex-wrap">
                    <button 
                      onClick={() => setShowAIEditor(false)}
                      className="px-4 py-2 bg-[#e7e7e7] hover:bg-[#dadada] border border-[#e7e7e7] rounded-lg transition-colors"
                    >
                      <span className="capitalize text-[#424242]">Cancel</span>
                    </button>

                    <button 
                      onClick={handleRegenerate}
                      disabled={isGeneratingAI}
                      className="px-4 py-2 bg-[#e7e7e7] hover:bg-[#dadada] border border-[#e7e7e7] rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                        <path d="M19 23.375C19 23.9618 18.5523 24.4375 18 24.4375C17.4477 24.4375 17 23.9618 17 23.375C17 22.7882 17.4477 22.3125 18 22.3125C18.5523 22.3125 19 22.7882 19 23.375Z" fill="currentColor"/>
                        <path d="M23 19.125C23 19.7118 22.5523 20.1875 22 20.1875C21.4477 20.1875 21 19.7118 21 19.125C21 18.5382 21.4477 18.0625 22 18.0625C22.5523 18.0625 23 18.5382 23 19.125Z" fill="currentColor"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M12 6.8881L11.3478 9.74586C11.0871 10.8882 10.2477 11.78 9.17257 12.057L6.48292 12.75L9.17257 13.443C10.2477 13.72 11.0871 14.6118 11.3478 15.7541L12 18.6119L12.6522 15.7541C12.9129 14.6118 13.7523 13.72 14.8274 13.443L17.5171 12.75L14.8274 12.057C13.7523 11.78 12.9129 10.8882 12.6522 9.74586L12 6.8881Z" fill="currentColor"/>
                      </svg>
                      <span className="capitalize text-[#424242]">Regenerate</span>
                    </button>

                    <button 
                      onClick={handleAttachClick}
                      className="px-4 py-2 bg-[#e7e7e7] hover:bg-[#dadada] border border-[#e7e7e7] rounded-lg flex items-center gap-2 transition-colors"
                    >
                      <FileText className="w-5 h-5 text-[#424242]" />
                      <span className="capitalize text-[#424242]">Attach</span>
                    </button>

                    <button 
                      onClick={() => {
                        // This will trigger the AIResponseEditor
                        setAiResponse(currentDisplayResponse);
                      }}
                      className="px-4 py-2 bg-[#ffecbd] hover:bg-[#ffe9a8] rounded-lg flex items-center gap-2 transition-colors"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M4 20H8L19.2929 8.70711C19.6834 8.31658 19.6834 7.68342 19.2929 7.29289L16.7071 4.70711C16.3166 4.31658 15.6834 4.31658 15.2929 4.70711L4 16V20Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span className="capitalize text-[#424242]">Edit</span>
                    </button>

                    <button 
                      onClick={handleSend}
                      className="px-4 py-2 bg-[rgb(60,64,67)] text-white hover:bg-[#2c2e31] rounded-lg flex items-center gap-2 transition-colors"
                    >
                      <Send className="w-5 h-5" />
                      <span className="capitalize">Send</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <AIResponseEditor 
                onClose={() => setShowAIEditor(false)} 
                email={caseData} 
                initialContent={currentDisplayResponse}
                attachedFiles={attachedFiles}
                onRemoveFile={handleRemoveFile}
                onAttachFile={handleAttachClick}
                fileInputRef={fileInputRef}
                onSend={handleSend}
                onRegenerate={handleRegenerate}
                onSave={(editedContent) => {
                  setCurrentDisplayResponse(editedContent);
                  setAiResponse(editedContent);
                }}
              />
            )}
          </div>
        )}

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileSelect}
        />

        <Separator className="my-6" />

        {/* Notes Section */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 mb-3">
            <div className="flex items-center gap-2">
              <StickyNote className="w-4 h-4 text-[#7f7f7f]" />
              <h3 className="text-sm">Case Notes ({caseData.notes?.length || 0})</h3>
            </div>
            <Button
              onClick={() => setIsAddNoteModalOpen(true)}
              size="sm"
              variant="outline"
              className="gap-1 w-full sm:w-auto"
            >
              <Plus className="w-4 h-4" />
              Add Note
            </Button>
          </div>

          {caseData.notes && caseData.notes.length > 0 ? (
            <div className="space-y-3">
              {caseData.notes.map(note => (
                <div key={note.id} className="p-3 sm:p-4 rounded-lg border border-black/10 bg-white">
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-1 sm:gap-2 mb-2">
                    <div className="flex-1">
                      <p className="text-sm mb-0.5">{note.author}</p>
                      <p className="text-xs text-[#7f7f7f]">{note.authorRole}</p>
                    </div>
                    <span className="text-xs text-[#7f7f7f] whitespace-nowrap">{note.timestamp}</span>
                  </div>
                  <p className="text-sm">{note.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 sm:p-8 rounded-lg border border-dashed border-black/10 text-center">
              <p className="text-sm text-[#7f7f7f]">No notes yet. Add a note to document this case.</p>
            </div>
          )}
        </div>

        <Separator className="my-6" />

        {/* Tasks Section */}
        <div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 mb-3">
            <div className="flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-[#7f7f7f]" />
              <h3 className="text-sm">Follow-up Tasks ({caseData.todos?.filter(t => !t.completed).length || 0}/{caseData.todos?.length || 0})</h3>
            </div>
            <Button
              onClick={() => setIsAddTodoModalOpen(true)}
              size="sm"
              variant="outline"
              className="gap-1 w-full sm:w-auto"
            >
              <Plus className="w-4 h-4" />
              Add Task
            </Button>
          </div>

          {caseData.todos && caseData.todos.length > 0 ? (
            <div className="space-y-2">
              {caseData.todos.map(todo => (
                <div key={todo.id} className="p-3 rounded-lg border border-black/10 bg-white flex items-start gap-3 group">
                  <Checkbox
                    checked={todo.completed}
                    onCheckedChange={() => handleToggleTodo(todo.id)}
                    className="mt-0.5"
                  />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm mb-1 ${todo.completed ? 'line-through text-[#7f7f7f]' : ''}`}>
                      {todo.content}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-[#7f7f7f]">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {todo.assignedTo}
                      </span>
                      <span>•</span>
                      <span>Created by {todo.createdBy}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteTodo(todo.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-lg border border-dashed border-black/10 text-center">
              <p className="text-sm text-[#7f7f7f]">No tasks yet. Add a task to track follow-ups.</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Note Modal */}
      <Dialog open={isAddNoteModalOpen} onOpenChange={setIsAddNoteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Case Note</DialogTitle>
            <DialogDescription>
              Document important information about this case
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Enter your note..."
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              rows={5}
              className="resize-none"
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddNoteModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddNote} disabled={!noteContent.trim()}>
                Add Note
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Todo Modal */}
      <Dialog open={isAddTodoModalOpen} onOpenChange={setIsAddTodoModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Follow-up Task</DialogTitle>
            <DialogDescription>
              Create a task to track follow-ups for this case
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm mb-2 block">Task Description</label>
              <Textarea
                placeholder="What needs to be done?"
                value={todoContent}
                onChange={(e) => setTodoContent(e.target.value)}
                rows={3}
                className="resize-none"
              />
            </div>
            <div>
              <label className="text-sm mb-2 block">Assign To</label>
              <Input
                placeholder="Enter name (optional)"
                value={todoAssignee}
                onChange={(e) => setTodoAssignee(e.target.value)}
              />
              <p className="text-xs text-[#7f7f7f] mt-1">Leave empty to assign to yourself</p>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddTodoModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddTodo} disabled={!todoContent.trim()}>
                Add Task
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
