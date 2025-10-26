import { useState, useRef, useEffect } from 'react';
import { Plus, Link, FileSpreadsheet, FileText, File, Menu } from 'lucide-react';
import { getKnowledgeBase, saveKnowledgeBase } from '../utils/localStorage';

interface KnowledgeBaseViewProps {
  onOpenMobileMenu?: () => void;
  initialFiles?: File[];
}

interface Document {
  id: string;
  name: string;
  type: 'folder' | 'pdf' | 'link' | 'csv' | 'excel' | 'doc' | 'txt' | 'file';
  dateAdded: string;
  access: 'Team' | 'Admin';
}

const mockDocuments: Document[] = [
  { id: '1', name: 'UPenn SRFS Policies & Procedures', type: 'folder', dateAdded: '05/06/2025 9:02 am', access: 'Team' },
  { id: '2', name: 'Aid Packaging Policies 2025.pdf', type: 'pdf', dateAdded: '05/18/2025 4:48 pm', access: 'Admin' },
  { id: '3', name: 'https://srfs.university.edu/financial-aid/highly-aided', type: 'link', dateAdded: '05/10/2025 2:40 pm', access: 'Team' },
  { id: '4', name: 'https://srfs.university.edu/financial-aid/apply/prospective-U...', type: 'link', dateAdded: '05/10/2025 2:42 pm', access: 'Team' },
  { id: '5', name: 'https://srfs.university.edu/billing-payment/understanding...', type: 'link', dateAdded: '05/10/2025 2:44 pm', access: 'Team' },
  { id: '6', name: 'FAFSA Guide 2024-2025.pdf', type: 'pdf', dateAdded: '05/15/2025 11:31 am', access: 'Team' },
  { id: '7', name: 'Scholarship Awarding Guide.pdf', type: 'pdf', dateAdded: '05/15/2025 11:33 am', access: 'Admin' },
  { id: '8', name: 'Parent FA Info Session Slides.pdf', type: 'pdf', dateAdded: '05/15/2025 11:35 am', access: 'Team' },
  { id: '9', name: 'SAP Appeal Form 2025.pdf', type: 'pdf', dateAdded: '05/15/2025 11:37 am', access: 'Team' },
];

function DocumentIcon({ type }: { type: 'folder' | 'pdf' | 'link' | 'csv' | 'excel' | 'doc' | 'txt' | 'file' }) {
  if (type === 'folder') {
    return (
      <svg className="w-9 h-9" viewBox="0 0 36 36" fill="none">
        <path d="M13.5018 6.3036C13.9986 6.3198 14.3955 6.5304 14.6673 6.9336L15.3738 8.8416C15.5043 9.1098 15.7005 9.36 15.8787 9.5427C16.1055 9.774 16.4484 9.9027 16.9191 9.9027H31.95L31.9482 26.1027C31.9239 26.9811 31.6782 27.5373 31.1958 28.0305C30.6873 28.5498 29.9511 28.8027 29.0268 28.8027H7.8732C6.9498 28.8027 6.2136 28.5507 5.7051 28.0305C5.1975 27.5112 4.9509 26.757 4.9509 25.812V6.3027H13.5027L13.5018 6.3036Z" fill="#8AA8CA"/>
        <path d="M13.5018 6.3009C13.9986 6.3171 14.3955 6.5277 14.6673 6.9309L15.3738 8.8389C15.5043 9.1071 15.7005 9.3573 15.8787 9.54C16.1055 9.7713 16.4484 9.9 16.9191 9.9H31.95L31.9482 25.056C31.9239 25.9344 31.6782 26.6346 31.1958 27.1278C30.6873 27.6471 29.9511 27.9 29.0268 27.9H7.8732C6.9498 27.9 6.2136 27.648 5.7051 27.1278C5.1975 26.6085 4.9509 25.8543 4.9509 24.9093V6.3L13.5027 6.3009H13.5018Z" fill="#A1C9F7"/>
      </svg>
    );
  }
  
  if (type === 'pdf') {
    return (
      <svg className="w-9 h-9" viewBox="0 0 36 36" fill="none">
        <path d="M26.766 6.5134H9.2339C8.18482 6.5134 7.37198 6.72062 6.82041 7.12904C6.26784 7.53846 5.98755 8.14008 5.98755 8.91588V28.1357C5.98755 28.9125 6.26784 29.5131 6.82041 29.9216C7.37298 30.331 8.18482 30.5382 9.2339 30.5382H26.766C27.8151 30.5382 28.6279 30.331 29.1795 29.9216C29.7321 29.5131 30.0123 28.9125 30.0123 28.1357V8.91588C30.0123 8.13908 29.7321 7.53846 29.1795 7.12904C28.6269 6.72062 27.8151 6.5134 26.766 6.5134V6.5134Z" fill="#BFBFBF"/>
        <path d="M26.766 5.01188H9.2339C8.18482 5.01188 7.37198 5.21909 6.82041 5.62752C6.26784 6.03694 5.98755 6.63856 5.98755 7.41436V26.6342C5.98755 27.411 6.26784 28.0116 6.82041 28.42C7.37298 28.8295 8.18482 29.0367 9.2339 29.0367H26.766C27.8151 29.0367 28.6279 28.8295 29.1795 28.42C29.7321 28.0116 30.0123 27.411 30.0123 26.6342V7.41436C30.0123 6.63756 29.7321 6.03694 29.1795 5.62752C28.6269 5.21909 27.8151 5.01188 26.766 5.01188Z" fill="#F7F5F2"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M15.8808 14.0212V20.0273H18L18.1902 20.0193C20.0852 19.9252 21.0061 18.9422 21.0061 17.0242C21.0061 15.0722 20.0511 14.0882 18.0871 14.0242L15.8808 14.0212ZM17.032 15.0222V19.0263H17.7738H17.4995H17.8779C18.7468 19.0263 19.1492 18.8241 19.3474 18.6349C19.5436 18.4447 19.7548 17.8581 19.7548 17.0242C19.7548 16.1904 19.5446 15.6028 19.3474 15.4146C19.1502 15.2244 18.7468 15.0222 17.8779 15.0222H17.032Z" fill="#F25123"/>
        <path d="M26.1163 15.0222H23.1473V17.0242H25.758V18.0253H23.1473V20.0273H21.9961V14.0212H26.1163V15.0222Z" fill="#F25123"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M9.99179 14.0212V20.0273H11.143V18.0253L13.0379 18.0193C13.5655 17.9892 14.059 17.8431 14.4294 17.5027C14.8498 17.1153 14.997 16.5828 14.997 16.0232C14.997 15.4626 14.8488 14.9321 14.4284 14.5447C14.058 14.2043 13.5655 14.0572 13.0389 14.0272L9.99179 14.0212ZM11.143 15.0222V17.0242H12.8217C13.2321 17.0242 13.4153 16.8551 13.5014 16.776L13.5054 16.772C13.5905 16.6939 13.7997 16.4066 13.7997 16.0232C13.7997 15.6398 13.5895 15.3525 13.5054 15.2754L13.5014 15.2714C13.4143 15.1914 13.2311 15.0222 12.8207 15.0222H11.143V15.0222Z" fill="#F25123"/>
      </svg>
    );
  }

  if (type === 'csv' || type === 'excel') {
    return (
      <svg className="w-9 h-9" viewBox="0 0 36 36" fill="none">
        <path d="M26.766 6.5134H9.2339C8.18482 6.5134 7.37198 6.72062 6.82041 7.12904C6.26784 7.53846 5.98755 8.14008 5.98755 8.91588V28.1357C5.98755 28.9125 6.26784 29.5131 6.82041 29.9216C7.37298 30.331 8.18482 30.5382 9.2339 30.5382H26.766C27.8151 30.5382 28.6279 30.331 29.1795 29.9216C29.7321 29.5131 30.0123 28.9125 30.0123 28.1357V8.91588C30.0123 8.13908 29.7321 7.53846 29.1795 7.12904C28.6269 6.72062 27.8151 6.5134 26.766 6.5134V6.5134Z" fill="#BFBFBF"/>
        <path d="M26.766 5.01188H9.2339C8.18482 5.01188 7.37198 5.21909 6.82041 5.62752C6.26784 6.03694 5.98755 6.63856 5.98755 7.41436V26.6342C5.98755 27.411 6.26784 28.0116 6.82041 28.42C7.37298 28.8295 8.18482 29.0367 9.2339 29.0367H26.766C27.8151 29.0367 28.6279 28.8295 29.1795 28.42C29.7321 28.0116 30.0123 27.411 30.0123 26.6342V7.41436C30.0123 6.63756 29.7321 6.03694 29.1795 5.62752C28.6269 5.21909 27.8151 5.01188 26.766 5.01188Z" fill="#F7F5F2"/>
        <rect x="10" y="12" width="16" height="2" fill="#217346"/>
        <rect x="10" y="12" width="4" height="10" fill="none" stroke="#217346" strokeWidth="0.5"/>
        <rect x="14" y="12" width="4" height="10" fill="none" stroke="#217346" strokeWidth="0.5"/>
        <rect x="18" y="12" width="4" height="10" fill="none" stroke="#217346" strokeWidth="0.5"/>
        <rect x="22" y="12" width="4" height="10" fill="none" stroke="#217346" strokeWidth="0.5"/>
        <rect x="10" y="14" width="16" height="2" fill="none" stroke="#217346" strokeWidth="0.5"/>
        <rect x="10" y="16" width="16" height="2" fill="none" stroke="#217346" strokeWidth="0.5"/>
        <rect x="10" y="18" width="16" height="2" fill="none" stroke="#217346" strokeWidth="0.5"/>
        <rect x="10" y="20" width="16" height="2" fill="none" stroke="#217346" strokeWidth="0.5"/>
      </svg>
    );
  }

  if (type === 'doc') {
    return (
      <svg className="w-9 h-9" viewBox="0 0 36 36" fill="none">
        <path d="M26.766 6.5134H9.2339C8.18482 6.5134 7.37198 6.72062 6.82041 7.12904C6.26784 7.53846 5.98755 8.14008 5.98755 8.91588V28.1357C5.98755 28.9125 6.26784 29.5131 6.82041 29.9216C7.37298 30.331 8.18482 30.5382 9.2339 30.5382H26.766C27.8151 30.5382 28.6279 30.331 29.1795 29.9216C29.7321 29.5131 30.0123 28.9125 30.0123 28.1357V8.91588C30.0123 8.13908 29.7321 7.53846 29.1795 7.12904C28.6269 6.72062 27.8151 6.5134 26.766 6.5134V6.5134Z" fill="#BFBFBF"/>
        <path d="M26.766 5.01188H9.2339C8.18482 5.01188 7.37198 5.21909 6.82041 5.62752C6.26784 6.03694 5.98755 6.63856 5.98755 7.41436V26.6342C5.98755 27.411 6.26784 28.0116 6.82041 28.42C7.37298 28.8295 8.18482 29.0367 9.2339 29.0367H26.766C27.8151 29.0367 28.6279 28.8295 29.1795 28.42C29.7321 28.0116 30.0123 27.411 30.0123 26.6342V7.41436C30.0123 6.63756 29.7321 6.03694 29.1795 5.62752C28.6269 5.21909 27.8151 5.01188 26.766 5.01188Z" fill="#F7F5F2"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M15.8808 14.0212V20.0273H18L18.1902 20.0193C20.0852 19.9252 21.0061 18.9422 21.0061 17.0242C21.0061 15.0722 20.0511 14.0882 18.0871 14.0242L15.8808 14.0212ZM17.032 15.0222V19.0263H17.7738H17.4995H17.8779C18.7468 19.0263 19.1492 18.8241 19.3474 18.6349C19.5436 18.4447 19.7548 17.8581 19.7548 17.0242C19.7548 16.1904 19.5446 15.6028 19.3474 15.4146C19.1502 15.2244 18.7468 15.0222 17.8779 15.0222H17.032Z" fill="#2B5797"/>
        <path d="M26.1163 15.0222H23.1473V17.0242H25.758V18.0253H23.1473V20.0273H21.9961V14.0212H26.1163V15.0222Z" fill="#2B5797"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M9.99179 14.0212V20.0273H11.143V17.0242H12.8217C13.2321 17.0242 13.4153 16.8551 13.5014 16.776L13.5054 16.772C13.5905 16.6939 13.7997 16.4066 13.7997 16.0232C13.7997 15.6398 13.5895 15.3525 13.5054 15.2754L13.5014 15.2714C13.4143 15.1914 13.2311 15.0222 12.8207 15.0222H11.143V15.0222H9.99179V14.0212ZM11.143 15.0222V17.0242H13.0379C13.5655 17.0242 14.059 17.1703 14.4294 17.5107C14.8498 17.8981 14.997 18.4306 14.997 18.991C14.997 19.5506 14.8488 20.0811 14.4284 20.4685C14.058 20.8089 13.5655 20.956 13.0389 20.986L11.143 20.9773V15.0222Z" fill="#2B5797"/>
      </svg>
    );
  }

  if (type === 'txt') {
    return (
      <svg className="w-9 h-9" viewBox="0 0 36 36" fill="none">
        <path d="M26.766 6.5134H9.2339C8.18482 6.5134 7.37198 6.72062 6.82041 7.12904C6.26784 7.53846 5.98755 8.14008 5.98755 8.91588V28.1357C5.98755 28.9125 6.26784 29.5131 6.82041 29.9216C7.37298 30.331 8.18482 30.5382 9.2339 30.5382H26.766C27.8151 30.5382 28.6279 30.331 29.1795 29.9216C29.7321 29.5131 30.0123 28.9125 30.0123 28.1357V8.91588C30.0123 8.13908 29.7321 7.53846 29.1795 7.12904C28.6269 6.72062 27.8151 6.5134 26.766 6.5134V6.5134Z" fill="#BFBFBF"/>
        <path d="M26.766 5.01188H9.2339C8.18482 5.01188 7.37198 5.21909 6.82041 5.62752C6.26784 6.03694 5.98755 6.63856 5.98755 7.41436V26.6342C5.98755 27.411 6.26784 28.0116 6.82041 28.42C7.37298 28.8295 8.18482 29.0367 9.2339 29.0367H26.766C27.8151 29.0367 28.6279 28.8295 29.1795 28.42C29.7321 28.0116 30.0123 27.411 30.0123 26.6342V7.41436C30.0123 6.63756 29.7321 6.03694 29.1795 5.62752C28.6269 5.21909 27.8151 5.01188 26.766 5.01188Z" fill="#F7F5F2"/>
        <path d="M12.5 14.5H15V15.5H14V20H13V15.5H12.5V14.5Z" fill="#6B7280"/>
        <path d="M16 14.5H17.5L18.5 16.8L19.5 14.5H21V20H20V16.2L18.8 18.5H18.2L17 16.2V20H16V14.5Z" fill="#6B7280"/>
        <path d="M22.5 14.5H25V15.5H24V20H23V15.5H22.5V14.5Z" fill="#6B7280"/>
      </svg>
    );
  }

  if (type === 'link') {
    return (
      <svg className="w-9 h-9" viewBox="0 0 36 36" fill="none">
        <path d="M26.766 6.5134H9.2339C8.18482 6.5134 7.37198 6.72062 6.82041 7.12904C6.26784 7.53846 5.98755 8.14008 5.98755 8.91588V28.1357C5.98755 28.9125 6.26784 29.5131 6.82041 29.9216C7.37298 30.331 8.18482 30.5382 9.2339 30.5382H26.766C27.8151 30.5382 28.6279 30.331 29.1795 29.9216C29.7321 29.5131 30.0123 28.9125 30.0123 28.1357V8.91588C30.0123 8.13908 29.7321 7.53846 29.1795 7.12904C28.6269 6.72062 27.8151 6.5134 26.766 6.5134V6.5134Z" fill="#BFBFBF"/>
        <path d="M26.766 5.01188H9.2339C8.18482 5.01188 7.37198 5.21909 6.82041 5.62752C6.26784 6.03694 5.98755 6.63856 5.98755 7.41436V26.6342C5.98755 27.411 6.26784 28.0116 6.82041 28.42C7.37298 28.8295 8.18482 29.0367 9.2339 29.0367H26.766C27.8151 29.0367 28.6279 28.8295 29.1795 28.42C29.7321 28.0116 30.0123 27.411 30.0123 26.6342V7.41436C30.0123 6.63756 29.7321 6.03694 29.1795 5.62752C28.6269 5.21909 27.8151 5.01188 26.766 5.01188Z" fill="#F7F5F2"/>
        <circle cx="18" cy="17" r="6" stroke="#4A90E2" strokeWidth="1.2" fill="none"/>
        <path d="M11 17H25" stroke="#4A90E2" strokeWidth="1.2"/>
        <path d="M18 11C19.5 11 21 13 21 17C21 21 19.5 23 18 23C16.5 23 15 21 15 17C15 13 16.5 11 18 11Z" stroke="#4A90E2" strokeWidth="1.2" fill="none"/>
      </svg>
    );
  }

  // Default file icon for unknown types
  return (
    <svg className="w-9 h-9" viewBox="0 0 36 36" fill="none">
      <path d="M26.766 6.5134H9.2339C8.18482 6.5134 7.37198 6.72062 6.82041 7.12904C6.26784 7.53846 5.98755 8.14008 5.98755 8.91588V28.1357C5.98755 28.9125 6.26784 29.5131 6.82041 29.9216C7.37298 30.331 8.18482 30.5382 9.2339 30.5382H26.766C27.8151 30.5382 28.6279 30.331 29.1795 29.9216C29.7321 29.5131 30.0123 28.9125 30.0123 28.1357V8.91588C30.0123 8.13908 29.7321 7.53846 29.1795 7.12904C28.6269 6.72062 27.8151 6.5134 26.766 6.5134V6.5134Z" fill="#BFBFBF"/>
      <path d="M26.766 5.01188H9.2339C8.18482 5.01188 7.37198 5.21909 6.82041 5.62752C6.26784 6.03694 5.98755 6.63856 5.98755 7.41436V26.6342C5.98755 27.411 6.26784 28.0116 6.82041 28.42C7.37298 28.8295 8.18482 29.0367 9.2339 29.0367H26.766C27.8151 29.0367 28.6279 28.8295 29.1795 28.42C29.7321 28.0116 30.0123 27.411 30.0123 26.6342V7.41436C30.0123 6.63756 29.7321 6.03694 29.1795 5.62752C28.6269 5.21909 27.8151 5.01188 26.766 5.01188Z" fill="#F7F5F2"/>
      <path d="M13 15H23V16H13V15Z" fill="#9CA3AF"/>
      <path d="M13 18H20V19H13V18Z" fill="#9CA3AF"/>
    </svg>
  );
}

export function KnowledgeBaseView({ onOpenMobileMenu, initialFiles }: KnowledgeBaseViewProps = {}) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [linkValue, setLinkValue] = useState('');
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [userId] = useState<string>(() => {
    return sessionStorage.getItem('userId') || 'default-user';
  });

  // Load documents from localStorage on mount
  useEffect(() => {
    const loadDocuments = async () => {
      try {
        const data = await getKnowledgeBase(userId);
        if (data.documents && data.documents.length > 0) {
          setDocuments(data.documents);
          setIsInitialized(true);
        }
      } catch (error) {
        console.error('Error loading knowledge base:', error);
      }
    };
    
    loadDocuments();
  }, [userId]);

  // Initialize documents from onboarding files
  useEffect(() => {
    if (initialFiles && initialFiles.length > 0 && !isInitialized) {
      const now = new Date();
      const dateAdded = now.toLocaleString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }).replace(',', '');

      const newDocuments: Document[] = initialFiles.map((file, i) => {
        const fileExtension = file.name.split('.').pop()?.toLowerCase();
        
        let fileType: 'folder' | 'pdf' | 'link' | 'csv' | 'excel' | 'doc' | 'txt' | 'file' = 'file';
        
        if (fileExtension === 'pdf') {
          fileType = 'pdf';
        } else if (fileExtension === 'csv') {
          fileType = 'csv';
        } else if (fileExtension === 'xls' || fileExtension === 'xlsx') {
          fileType = 'excel';
        } else if (fileExtension === 'doc' || fileExtension === 'docx') {
          fileType = 'doc';
        } else if (fileExtension === 'txt') {
          fileType = 'txt';
        }

        return {
          id: `onboarding-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 9)}`,
          name: file.name,
          type: fileType,
          dateAdded: dateAdded,
          access: 'Team'
        };
      });

      setDocuments(newDocuments);
      setIsInitialized(true);
    }
  }, [initialFiles, isInitialized]);

  // Auto-save documents when they change
  useEffect(() => {
    if (isInitialized && documents.length > 0) {
      const timeoutId = setTimeout(() => {
        saveKnowledgeBase(userId, documents).catch(error => {
          console.error('Error auto-saving knowledge base:', error);
        });
      }, 1000);
      
      return () => clearTimeout(timeoutId);
    }
  }, [documents, userId, isInitialized]);

  const handleUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newDocuments: Document[] = [];
    const now = new Date();
    const dateAdded = now.toLocaleString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).replace(',', '');

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      
      // Detect file type based on extension
      let fileType: 'folder' | 'pdf' | 'link' | 'csv' | 'excel' | 'doc' | 'txt' | 'file' = 'file';
      
      if (fileExtension === 'pdf') {
        fileType = 'pdf';
      } else if (fileExtension === 'csv') {
        fileType = 'csv';
      } else if (fileExtension === 'xls' || fileExtension === 'xlsx') {
        fileType = 'excel';
      } else if (fileExtension === 'doc' || fileExtension === 'docx') {
        fileType = 'doc';
      } else if (fileExtension === 'txt') {
        fileType = 'txt';
      }

      newDocuments.push({
        id: `${Date.now()}-${i}-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        type: fileType,
        dateAdded: dateAdded,
        access: 'Team'
      });
    }

    setDocuments([...documents, ...newDocuments]);
    
    // Reset the input so the same file can be selected again if needed
    if (event.target) {
      event.target.value = '';
    }
  };

  const handleDelete = (id: string) => {
    setDocuments(documents.filter(doc => doc.id !== id));
  };

  const handleLinkSubmit = () => {
    if (!linkValue.trim()) return;

    const now = new Date();
    const dateAdded = now.toLocaleString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).replace(',', '');

    const newLink: Document = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: linkValue,
      type: 'link',
      dateAdded: dateAdded,
      access: 'Team'
    };

    setDocuments([...documents, newLink]);
    setLinkValue('');
    setShowLinkInput(false);
  };

  // Empty State (Figma Frame 1)
  if (documents.length === 0) {
    return (
      <div className="flex-1 bg-white p-3 sm:p-4 lg:p-8 overflow-y-auto">
        <div className="max-w-[1148px] mx-auto p-[0px] m-[0px]">
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.txt,.csv,.xls,.xlsx"
            onChange={handleFileChange}
            className="hidden"
          />
          
          {/* Header */}
          <div className="flex items-center gap-2 mb-4 sm:mb-6 lg:mb-8">
            {onOpenMobileMenu && (
              <button
                onClick={onOpenMobileMenu}
                className="lg:hidden flex h-8 w-8 items-center justify-center rounded-lg text-[#7f7f7f] transition-colors hover:bg-[#f2f3f5] hover:text-black flex-shrink-0"
              >
                <Menu className="h-5 w-5" />
              </button>
            )}
            <h2 className="text-lg sm:text-xl lg:text-[24px]">Knowledge Base</h2>
          </div>

          <div className="flex flex-col items-center justify-center">
            <div className="max-w-[550px] w-full box-border flex flex-col gap-4 sm:gap-6 items-start p-4 sm:p-6 rounded-2xl shadow-[0px_4px_50px_0px_rgba(33,33,33,0.08),0px_4px_6px_0px_rgba(33,33,33,0.04)]">
              {/* Title Section */}
              <div className="flex flex-col h-[99px] items-center w-full">
            <div className="flex flex-col gap-3 items-center justify-center w-full">
              <div className="flex gap-1.5 items-center w-full">
                <div className="basis-0 grow h-12 min-h-px min-w-px relative">
                  <p className="font-['Montserrat:Regular',_sans-serif] font-normal text-[#6d6d6d] text-[14px] text-center leading-[20px] absolute left-1/2 top-10 translate-x-[-50%] w-[502px] overflow-ellipsis overflow-hidden" style={{ display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 3 }}>
                    The knowledge base contains any documents, policies, procedures, forms, presentations, or webpages your department wants the AI to reference when generating responses.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Upload Drag Upload */}
          <div className="bg-white relative rounded-lg w-full border border-dashed border-[#1849d6]">
            <div className="flex flex-col items-center justify-center relative size-full">
              <div className="box-border flex flex-col gap-3 items-center justify-center p-6 relative w-full">
                {/* Upload Icon */}
                <svg className="w-[42px] h-[42px]" viewBox="0 0 42 42" fill="none">
                  <g clipPath="url(#clip0_upload)">
                    <path d="M33.4418 3.12071H14.1744V11.1107H37.5569V7.23413C37.5569 4.96577 35.7108 3.12071 33.4418 3.12071Z" fill="#CED9F9"/>
                    <path d="M22.5352 12.3403H0V4.92636C0 2.20972 2.21068 0 4.92828 0H12.1336C12.8497 0 13.5396 0.150925 14.1664 0.434509C15.0418 0.828964 15.7939 1.47913 16.3213 2.3286L22.5352 12.3403Z" fill="#1640C1"/>
                    <path d="M42 14.0001V37.8815C42 40.1527 40.1511 42 37.8789 42H4.12111C1.84891 42 -6.25849e-07 40.1527 -6.25849e-07 37.8815V9.8806H37.8789C40.1511 9.8806 42 11.7285 42 14.0001Z" fill="#2354E6"/>
                    <path d="M42 14.0001V37.8815C42 40.1527 40.1511 42 37.8789 42H21V9.8806H37.8789C40.1511 9.8806 42 11.7285 42 14.0001Z" fill="#1849D6"/>
                    <path d="M32.0479 25.9398C32.0479 32.0322 27.0918 36.9887 21 36.9887C14.9082 36.9887 9.95206 32.0322 9.95206 25.9398C9.95206 19.8484 14.9082 14.8919 21 14.8919C27.0918 14.8919 32.0479 19.8484 32.0479 25.9398Z" fill="#E7ECFC"/>
                    <path d="M32.0479 25.9398C32.0479 32.0322 27.0918 36.9887 21 36.9887V14.8919C27.0918 14.8919 32.0479 19.8484 32.0479 25.9398Z" fill="#CED9F9"/>
                    <path d="M24.561 26.0754C24.3306 26.2705 24.0483 26.3657 23.7686 26.3657C23.4183 26.3657 23.0703 26.2173 22.8268 25.9283L22.2305 25.2214V29.8494C22.2305 30.5288 21.6793 31.0799 21 31.0799C20.3207 31.0799 19.7695 30.5288 19.7695 29.8494V25.2214L19.1732 25.9283C18.7342 26.4477 17.9584 26.514 17.439 26.0754C16.9199 25.6373 16.8533 24.8612 17.2913 24.3418L19.7269 21.4544C20.0445 21.0788 20.5078 20.8629 21 20.8629C21.4922 20.8629 21.9555 21.0788 22.2731 21.4544L24.7087 24.3418C25.1467 24.8612 25.0801 25.6373 24.561 26.0754Z" fill="#6C8DEF"/>
                    <path d="M24.561 26.0754C24.3306 26.2705 24.0483 26.3657 23.7686 26.3657C23.4183 26.3657 23.0703 26.2173 22.8268 25.9283L22.2305 25.2214V29.8494C22.2305 30.5288 21.6793 31.0799 21 31.0799V20.8629C21.4922 20.8629 21.9555 21.0788 22.2731 21.4544L24.7087 24.3418C25.1467 24.8612 25.0801 25.6373 24.561 26.0754Z" fill="#3B67E9"/>
                  </g>
                  <defs>
                    <clipPath id="clip0_upload">
                      <rect fill="white" height="42" width="42"/>
                    </clipPath>
                  </defs>
                </svg>

                {/* Text and Button */}
                <div className="flex flex-col gap-2 items-center w-full">
                  <p className="font-['Montserrat:Regular',_sans-serif] font-normal text-[#84818a] text-[14px] leading-[20px] whitespace-pre">
                    Drag your file(s) to start uploading
                  </p>
                  
                  {/* Divider */}
                  <div className="flex gap-3 items-center w-[201px]">
                    <div className="basis-0 bg-[#e7e7e7] grow h-[0.971px] min-h-px min-w-px" />
                    <p className="font-['Montserrat:Regular',_sans-serif] font-normal text-[#6d6d6d] text-[12px] text-center leading-[18px] whitespace-pre">
                      OR
                    </p>
                    <div className="basis-0 bg-[#e7e7e7] grow h-[0.971px] min-h-px min-w-px" />
                  </div>
                  
                  {/* Browse Button */}
                  <button
                    onClick={handleUpload}
                    className="bg-white box-border flex gap-2 items-center justify-center px-3 py-1.5 relative rounded-lg border border-[#1849d6] hover:bg-blue-50 transition-colors"
                  >
                    <p className="font-['Montserrat:SemiBold',_sans-serif] font-semibold flex flex-col justify-center text-[#1849d6] text-[12px] leading-[18px] whitespace-pre">
                      Browse files
                    </p>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Paste Link Input */}
          <div className="bg-white h-[53px] relative rounded-xl w-full border border-[#c4c4c4]">
            <div className="h-[53px] overflow-clip relative w-full">
              <input
                type="text"
                value={linkValue}
                onChange={(e) => setLinkValue(e.target.value)}
                placeholder="Paste a link"
                className="font-['Montserrat:Regular',_sans-serif] font-normal text-[#84818a] text-[16px] tracking-[0.5px] leading-[24px] w-full h-full px-4 bg-transparent border-none outline-none focus:text-[#1e1919]"
              />
              <button
                onClick={handleLinkSubmit}
                disabled={!linkValue.trim()}
                className={`absolute right-4 top-1/2 -translate-y-1/2 size-[21px] rounded-full transition-all ${
                  linkValue.trim() 
                    ? 'bg-[#1849D6] hover:bg-[#1640C1] cursor-pointer' 
                    : 'bg-[#011F5B] opacity-20 cursor-not-allowed'
                }`}
                aria-label="Submit link"
              >
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[14.823px]">
                  <svg className="block size-full" fill="none" viewBox="0 0 15 15">
                    <g clipPath="url(#clip0_arrow)">
                      <path d="M2.46875 7.41176L3.33963 8.28264L6.79228 4.83617V12.3529H8.02757V4.83617L11.474 8.28882L12.3511 7.41176L7.40993 2.47058L2.46875 7.41176Z" fill="white"/>
                    </g>
                    <defs>
                      <clipPath id="clip0_arrow">
                        <rect fill="white" height="14.8235" width="14.8235"/>
                      </clipPath>
                    </defs>
                  </svg>
                </div>
              </button>
            </div>
          </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Populated State (Figma Frame 2)
  return (
    <div className="flex-1 bg-white overflow-y-auto">
      <div className="max-w-[1148px] mx-auto px-8 py-8">
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.txt,.csv,.xls,.xlsx"
          onChange={handleFileChange}
          className="hidden"
        />
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2>Knowledge Base</h2>
        </div>

        <p className="font-['Montserrat:Regular',_sans-serif] font-normal text-[13px] text-black mb-2 leading-[17px]">
          The library contains any documents, policies, procedures, forms, presentations, or webpages your department wants the AI to reference when generating responses.
        </p>
        
        {/* Upload and Paste Link Buttons */}
        <div className="flex flex-col gap-3 items-end w-full mb-6">
          <div className="flex gap-2 items-start justify-end w-full">
            <button 
              onClick={() => setShowLinkInput(!showLinkInput)}
              className="bg-[#1849D6] relative rounded-lg border border-[#1849D6] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] hover:bg-[#1640C1] transition-colors"
            >
              <div className="box-border flex gap-2 items-center justify-center overflow-clip px-4 py-2.5 relative">
                <Link className="w-5 h-5 text-white" />
                <p className="font-['SF_Pro:Medium',_sans-serif] font-[510] text-[14px] text-white leading-[20px] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
                  Paste a link
                </p>
              </div>
            </button>
            <button 
              onClick={handleUpload}
              className="bg-[#3c4043] relative rounded-lg border border-[#3c4043] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] hover:bg-[#2c2e31] transition-colors"
            >
              <div className="box-border flex gap-2 items-center justify-center overflow-clip px-4 py-2.5 relative">
                <Plus className="w-5 h-5 text-white" />
                <p className="font-['SF_Pro:Medium',_sans-serif] font-[510] text-[14px] text-white leading-[20px] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
                  Upload
                </p>
              </div>
            </button>
          </div>

          {/* Link Input Field */}
          {showLinkInput && (
            <div className="bg-white h-[53px] relative rounded-xl w-full max-w-[500px] border border-[#c4c4c4]">
              <div className="h-[53px] overflow-clip relative w-full">
                <input
                  id="link-input"
                  type="text"
                  value={linkValue}
                  onChange={(e) => setLinkValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && linkValue.trim()) {
                      handleLinkSubmit();
                    }
                  }}
                  placeholder="Paste a link"
                  autoFocus
                  className="font-['Montserrat:Regular',_sans-serif] font-normal text-[#84818a] text-[16px] tracking-[0.5px] leading-[24px] w-full h-full px-4 bg-transparent border-none outline-none focus:text-[#1e1919]"
                />
                <button
                  onClick={handleLinkSubmit}
                  disabled={!linkValue.trim()}
                  className={`absolute right-4 top-1/2 -translate-y-1/2 size-[21px] rounded-full transition-all ${
                    linkValue.trim() 
                      ? 'bg-[#1849D6] hover:bg-[#1640C1] cursor-pointer' 
                      : 'bg-[#011F5B] opacity-20 cursor-not-allowed'
                  }`}
                  aria-label="Submit link"
                >
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[14.823px]">
                    <svg className="block size-full" fill="none" viewBox="0 0 15 15">
                      <g clipPath="url(#clip0_arrow)">
                        <path d="M2.46875 7.41176L3.33963 8.28264L6.79228 4.83617V12.3529H8.02757V4.83617L11.474 8.28882L12.3511 7.41176L7.40993 2.47058L2.46875 7.41176Z" fill="white"/>
                      </g>
                      <defs>
                        <clipPath id="clip0_arrow">
                          <rect fill="white" height="14.8235" width="14.8235"/>
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Table Header */}
        <div className="box-border flex gap-[557px] items-center pl-0 pr-[132px] py-4 w-full">
          <div className="flex gap-4 items-start">
            <div className="box-border flex gap-px h-10 items-center p-1 relative">
              <div className="flex gap-1 items-center">
                <p className="font-['Montserrat:Medium',_sans-serif] font-medium text-[#1e1919] text-[18px] leading-[22px] whitespace-pre">
                  Name
                </p>
              </div>
              <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none">
                <path d="M9.79167 15.8333V5.83333M4.375 10.2083L9.79167 5L15.2083 10.2083" stroke="#1E1919" strokeWidth="1.2" strokeMiterlimit="10"/>
              </svg>
            </div>
          </div>
          
          <div className="flex gap-32 items-center">
            <div className="box-border flex flex-col gap-1 h-10 items-start justify-center p-1">
              <p className="font-['IBM_Plex_Sans:Regular',_sans-serif] text-[#1e1919] text-[18px] leading-[22px] whitespace-pre">
                Date Added
              </p>
            </div>
            <div className="box-border flex flex-col gap-1 h-10 items-start justify-center p-1">
              <p className="font-['IBM_Plex_Sans:Regular',_sans-serif] text-[#1e1919] text-[18px] leading-[22px] whitespace-pre">
                Access
              </p>
            </div>
          </div>
          
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
            <path d="M0 14.81H3.75L14.81 3.75L11.06 0L0 11.06V14.81ZM2 11.89L11.06 2.83L11.98 3.75L2.92 12.81H2V11.89Z" fill="#666666"/>
            <path d="M3.24 0.2925C2.85 -0.0975 2.22 -0.0975 1.83 0.2925L0 2.1225L3.75 5.8725L5.58 4.0425C5.97 3.6525 5.97 3.0225 5.58 2.6325L3.24 0.2925Z" fill="#666666"/>
          </svg>
        </div>
        
        {/* Table Rows */}
        <div className="flex flex-col items-start w-full">
          {documents.map((doc, index) => (
            <div key={doc.id} className="h-14 relative w-full">
              <div className="absolute flex gap-4 items-start left-0 top-2">
                <div className="basis-0 grow h-10 min-h-px min-w-px relative">
                  <div className="flex flex-row items-center relative size-full">
                    <div className="box-border flex gap-2 h-10 items-center p-1 relative w-full">
                      <div className="basis-0 flex gap-2 grow items-center min-h-px min-w-px relative">
                        <DocumentIcon type={doc.type} />
                        {doc.type === 'link' ? (
                          <a href="#" className="font-['Montserrat:Light',_sans-serif] font-light text-[#1e1919] text-[18px] leading-[22px] underline hover:opacity-80 break-all max-w-[500px]">
                            {doc.name}
                          </a>
                        ) : (
                          <p className="font-['Montserrat:Light',_sans-serif] font-light text-[#1e1919] text-[18px] leading-[22px] max-w-[500px] break-words">
                            {doc.name}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="absolute flex gap-9 items-center justify-end left-[640px] top-2">
                <div className="box-border flex flex-col gap-1 h-10 items-start justify-center p-1 w-[194px]">
                  <p className="font-['Montserrat:Light',_sans-serif] font-light text-[#1e1919] text-[18px] leading-[22px] whitespace-pre">
                    {doc.dateAdded}
                  </p>
                </div>
                <div className="box-border flex flex-col gap-1 h-10 items-start justify-center p-1 w-[100px]">
                  <p className="font-['Montserrat:Light',_sans-serif] font-light text-[#1e1919] text-[18px] leading-[22px] whitespace-pre">
                    {doc.access}
                  </p>
                </div>
                <div className="flex gap-2 items-center justify-center w-[84px]">
                  <button 
                    onClick={() => handleDelete(doc.id)}
                    className="hover:opacity-60 transition-opacity"
                    aria-label="Delete document"
                  >
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                      <path d="M17.0003 7.91699V18.417C17.0001 19.149 16.3984 19.75 15.6663 19.75H8.33333C7.60125 19.75 7.0005 19.149 7.00033 18.417V7.91699H17.0003ZM14.0843 4.25L15.0013 5.16699H17.9163V6H6.08333V5.16699H8.99837L9.91536 4.25H14.0843Z" stroke="#524A3E" strokeOpacity="0.4"/>
                    </svg>
                  </button>
                  <button className="hover:opacity-60 transition-opacity hidden">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                      <path d="M0 14.81H3.75L14.81 3.75L11.06 0L0 11.06V14.81ZM2 11.89L11.06 2.83L11.98 3.75L2.92 12.81H2V11.89Z" fill="#524A3E" fillOpacity="0.4"/>
                      <path d="M3.24 0.2925C2.85 -0.0975 2.22 -0.0975 1.83 0.2925L0 2.1225L3.75 5.8725L5.58 4.0425C5.97 3.6525 5.97 3.0225 5.58 2.6325L3.24 0.2925Z" fill="#524A3E" fillOpacity="0.4"/>
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="absolute h-0 left-0 top-0 w-[1204px]">
                <div className="absolute bottom-0 left-0 right-0 top-[-1px]">
                  <svg className="block size-full" fill="none" viewBox="0 0 1204 1">
                    <line opacity="0.2" stroke="#524A3E" strokeOpacity="0.89" x2="1204" y1="0.5" y2="0.5"/>
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}