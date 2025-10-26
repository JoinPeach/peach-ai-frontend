import { useState, useRef, useEffect } from 'react';
import { Bold, Italic, Underline, Link, AlignLeft, List, ListOrdered, Image, FileText, X } from 'lucide-react';
import { Email } from './EmailPlatform';

interface AIResponseEditorProps {
  onClose: () => void;
  email: Email;
  initialContent?: string;
  attachedFiles?: File[];
  onRemoveFile?: (index: number) => void;
  onAttachFile?: () => void;
  fileInputRef?: React.RefObject<HTMLInputElement>;
  onSend?: (content: string) => void;
  onSave?: (content: string) => void;
  onRegenerate?: () => void;
}

export function AIResponseEditor({ onClose, email, initialContent, attachedFiles = [], onRemoveFile, onAttachFile, fileInputRef, onSend, onSave: onSaveCallback, onRegenerate }: AIResponseEditorProps) {
  const defaultContent = `Dear ${email.sender.split(' ')[0]},

We have reviewed your FAFSA application, and it has been flagged with a missing email error (C-46) that requires updating before we can continue processing your financial aid.

To resolve this, please:

1. Log in to your FAFSA at https://studentaid.gov and review your application for errors.
2. Submit the corrected information and/or upload the requested documents.
3. If you have questions or need help, contact our office or visit us during office hours.

It's important that you resolve this issue promptly so your financial aid package is not delayed. Please aim to submit the corrections by next week.

Thank you for your attention to this matter—we're here to support you through the process.

UPenn Financial Aid Office
215-898-1988 | srfs@university.edu
3451 Walnut Street
University of Pennsylvania
Philadelphia, PA 19104
Mon., Tues., Thu., Fri.: 9am-5pm | Wed.: 10am-5pm | Sat., Sun.: Closed`;

  const [content, setContent] = useState(initialContent || defaultContent);
  const [savedContent, setSavedContent] = useState(content);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Update content when initialContent changes (on regenerate)
  useEffect(() => {
    if (initialContent) {
      setContent(initialContent);
    }
  }, [initialContent]);

  const handleSave = () => {
    setSavedContent(content);
    if (onSaveCallback) {
      onSaveCallback(content);
    }
    onClose();
  };

  const wrapSelectedText = (prefix: string, suffix: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    
    if (selectedText) {
      // Wrap selected text
      const newContent = 
        content.substring(0, start) + 
        prefix + selectedText + suffix + 
        content.substring(end);
      setContent(newContent);
      
      // Restore cursor position after the wrapped text
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + prefix.length, end + prefix.length);
      }, 0);
    } else {
      // Insert at cursor position with placeholder
      const placeholder = prefix === '[' ? 'link text' : 'text';
      const newContent = 
        content.substring(0, start) + 
        prefix + placeholder + suffix + 
        content.substring(end);
      setContent(newContent);
      
      // Select the placeholder text
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + prefix.length, start + prefix.length + placeholder.length);
      }, 0);
    }
  };

  const handleBold = () => wrapSelectedText('**', '**');
  const handleItalic = () => wrapSelectedText('*', '*');
  const handleUnderline = () => wrapSelectedText('<u>', '</u>');
  
  const handleAlignLeft = () => {
    // Text is left-aligned by default, so this could add a visual marker
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    
    if (selectedText) {
      // Add alignment marker for selected text
      const newContent = 
        content.substring(0, start) + 
        '← ' + selectedText + 
        content.substring(end);
      setContent(newContent);
      
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + 2, end + 2);
      }, 0);
    }
  };
  const handleLink = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    
    const linkText = selectedText || 'link text';
    const newContent = 
      content.substring(0, start) + 
      `[${linkText}](url)` + 
      content.substring(end);
    setContent(newContent);
    
    // Select "url" for easy replacement
    setTimeout(() => {
      textarea.focus();
      const urlStart = start + linkText.length + 3; // After "[text]("
      textarea.setSelectionRange(urlStart, urlStart + 3);
    }, 0);
  };

  const handleBulletList = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    
    if (selectedText) {
      // Convert selected lines to bullet list
      const lines = selectedText.split('\n');
      const bulletList = lines.map(line => line.trim() ? `• ${line}` : line).join('\n');
      const newContent = 
        content.substring(0, start) + 
        bulletList + 
        content.substring(end);
      setContent(newContent);
      
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start, start + bulletList.length);
      }, 0);
    } else {
      // Insert a bullet list item at cursor
      const newContent = 
        content.substring(0, start) + 
        '• List item' + 
        content.substring(end);
      setContent(newContent);
      
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + 2, start + 11);
      }, 0);
    }
  };

  const handleNumberedList = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    
    if (selectedText) {
      // Convert selected lines to numbered list
      const lines = selectedText.split('\n');
      let counter = 1;
      const numberedList = lines.map(line => {
        if (line.trim()) {
          return `${counter++}. ${line}`;
        }
        return line;
      }).join('\n');
      const newContent = 
        content.substring(0, start) + 
        numberedList + 
        content.substring(end);
      setContent(newContent);
      
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start, start + numberedList.length);
      }, 0);
    } else {
      // Insert a numbered list item at cursor
      const newContent = 
        content.substring(0, start) + 
        '1. List item' + 
        content.substring(end);
      setContent(newContent);
      
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + 3, start + 12);
      }, 0);
    }
  };

  const handleImage = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    
    const altText = selectedText || 'image description';
    const newContent = 
      content.substring(0, start) + 
      `![${altText}](image-url)` + 
      content.substring(end);
    setContent(newContent);
    
    // Select "image-url" for easy replacement
    setTimeout(() => {
      textarea.focus();
      const urlStart = start + altText.length + 4; // After "![text]("
      textarea.setSelectionRange(urlStart, urlStart + 9);
    }, 0);
  };

  return (
    <div className="bg-white border border-[#e7e7e7] rounded-2xl overflow-hidden shadow-lg">
      {/* Header */}
      <div className="bg-[#e7e7e7] px-4 py-3 border-b border-[#e7e7e7] flex items-center gap-3">
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
          <path d="M19 23.375C19 23.9618 18.5523 24.4375 18 24.4375C17.4477 24.4375 17 23.9618 17 23.375C17 22.7882 17.4477 22.3125 18 22.3125C18.5523 22.3125 19 22.7882 19 23.375Z" fill="black"/>
          <path fillRule="evenodd" clipRule="evenodd" d="M12 6.8881L11.3478 9.74586C11.0871 10.8882 10.2477 11.78 9.17257 12.057L6.48292 12.75L9.17257 13.443C10.2477 13.72 11.0871 14.6118 11.3478 15.7541L12 18.6119L12.6522 15.7541C12.9129 14.6118 13.7523 13.72 14.8274 13.443L17.5171 12.75L14.8274 12.057C13.7523 11.78 12.9129 10.8882 12.6522 9.74586L12 6.8881Z" fill="black"/>
        </svg>
        <div>
          <p className="font-semibold text-[#2e2c34]">AI Suggested Email</p>
          <p className="text-sm italic text-[#2e2c34] opacity-70">Reference: FAFSA Guide 2024-2025</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full min-h-[400px] p-4 italic text-base text-[#2e2c34] bg-white border border-[#e7e7e7] rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-[#1990ff]/20"
          style={{ whiteSpace: 'pre-wrap' }}
        />

        {/* Attached Files Display in Editor */}
        {attachedFiles.length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="text-sm text-[#7f7f7f]">Attached files:</p>
            <div className="flex flex-wrap gap-2">
              {attachedFiles.map((file, index) => (
                <div 
                  key={index}
                  className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-[#ced0df] rounded-lg"
                >
                  <FileText className="w-4 h-4 text-[#666666]" />
                  <span className="text-sm text-[#2e2c34]">{file.name}</span>
                  {onRemoveFile && (
                    <button
                      onClick={() => onRemoveFile(index)}
                      className="p-0.5 hover:bg-gray-100 rounded transition-colors"
                    >
                      <X className="w-4 h-4 text-[#666666]" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer with toolbar */}
      <div className="bg-[#f2f2f2] border-t border-black/10 px-4 py-3">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-1 flex-shrink-0">
            {/* Text formatting */}
            <div className="flex items-center gap-0.5 p-0.5 rounded">
              <button onClick={handleBold} className="p-1.5 hover:bg-gray-100 rounded">
                <Bold className="w-4 h-4" />
              </button>
              <button onClick={handleItalic} className="p-1.5 hover:bg-gray-100 rounded">
                <Italic className="w-4 h-4" />
              </button>
              <button onClick={handleUnderline} className="p-1.5 hover:bg-gray-100 rounded">
                <Underline className="w-4 h-4" />
              </button>
              <button onClick={handleLink} className="p-1.5 hover:bg-gray-100 rounded">
                <Link className="w-4 h-4" />
              </button>
            </div>

            {/* List formatting */}
            <div className="flex items-center gap-0.5">
              <button onClick={handleAlignLeft} className="p-1.5 hover:bg-gray-100 rounded">
                <AlignLeft className="w-4 h-4" />
              </button>
              <button onClick={handleBulletList} className="p-1.5 hover:bg-gray-100 rounded">
                <List className="w-4 h-4" />
              </button>
              <button onClick={handleNumberedList} className="p-1.5 hover:bg-gray-100 rounded">
                <ListOrdered className="w-4 h-4" />
              </button>
              <button onClick={handleImage} className="p-1.5 hover:bg-gray-100 rounded">
                <Image className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {onRegenerate && (
              <button
                onClick={onRegenerate}
                className="px-3 py-1.5 bg-[#e7e7e7] hover:bg-[#dadada] border border-[#e7e7e7] rounded-lg flex items-center gap-1.5 transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <path d="M19 23.375C19 23.9618 18.5523 24.4375 18 24.4375C17.4477 24.4375 17 23.9618 17 23.375C17 22.7882 17.4477 22.3125 18 22.3125C18.5523 22.3125 19 22.7882 19 23.375Z" fill="currentColor"/>
                  <path d="M23 19.125C23 19.7118 22.5523 20.1875 22 20.1875C21.4477 20.1875 21 19.7118 21 19.125C21 18.5382 21.4477 18.0625 22 18.0625C22.5523 18.0625 23 18.5382 23 19.125Z" fill="currentColor"/>
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 6.8881L11.3478 9.74586C11.0871 10.8882 10.2477 11.78 9.17257 12.057L6.48292 12.75L9.17257 13.443C10.2477 13.72 11.0871 14.6118 11.3478 15.7541L12 18.6119L12.6522 15.7541C12.9129 14.6118 13.7523 13.72 14.8274 13.443L17.5171 12.75L14.8274 12.057C13.7523 11.78 12.9129 10.8882 12.6522 9.74586L12 6.8881Z" fill="currentColor"/>
                </svg>
                <span className="capitalize text-[#424242]">Regenerate</span>
              </button>
            )}
            {onAttachFile && (
              <button
                onClick={onAttachFile}
                className="px-3 py-1.5 border border-[#424242] hover:bg-gray-50 rounded-lg flex items-center gap-1.5 transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="capitalize text-[#424242]">Attach</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-[#5f6369] hover:bg-[#4a4e54] text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              className="px-4 py-1.5 bg-[#1990ff] hover:bg-[#1580e6] text-white rounded-lg transition-colors"
            >
              Save
            </button>
            {onSend && (
              <button 
                onClick={() => onSend(content)}
                className="px-4 py-1.5 bg-[#cdf4d4] hover:bg-[#b8edbe] text-[#424242] rounded-lg transition-colors flex items-center gap-1.5"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <path d="M4.01 6.03L11.52 9.25L4 8.25L4.01 6.03ZM11.51 14.75L4 17.97V15.75L11.51 14.75ZM2.01 3L2 10L17 12L2 14L2.01 21L23 12L2.01 3Z" fill="currentColor"/>
                </svg>
                Send
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}