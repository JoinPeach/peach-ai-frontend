import { useState, useRef, useEffect } from 'react';
import { Trash2, ChevronLeft, ChevronRight, FileText, X, ArrowLeft, ChevronDown, UserCircle, CheckSquare, StickyNote } from 'lucide-react';
import { Email, ThreadMessage, CaseNote, TodoItem } from './EmailPlatform';
import { AIResponseEditor } from './AIResponseEditor';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface EmailViewerProps {
  email: Email | undefined;
  onSendEmail?: (email: Email, responseContent: string, attachments: string[]) => void;
  selectedInbox?: string;
  onAssignEmail?: (emailId: string, assignTo: string | null) => void;
  onDeleteEmail?: (emailId: string) => void;
  onNavigatePrevious?: () => void;
  onNavigateNext?: () => void;
  canNavigatePrevious?: boolean;
  canNavigateNext?: boolean;
  onBackToList?: () => void;
  onUpdateAuditLog?: (emailId: string, entry: any) => void;
  onAddNote?: (emailId: string, note: CaseNote) => void;
  onAddTodo?: (emailId: string, todo: TodoItem) => void;
  onToggleTodo?: (emailId: string, todoId: string) => void;
  onDeleteTodo?: (emailId: string, todoId: string) => void;
  onStatusChange?: (emailId: string, status: 'In Progress' | 'On Hold' | 'Resolved') => void;
  isInboxMode?: boolean; // Hide case management features in inbox view
}

// AI Response Templates
const generateAIResponse = (senderName: string): string => {
  const responses = [
    // Response 1 - Error correction focus
    `Dear ${senderName},

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
Mon., Tues., Thu., Fri.: 9am-5pm | Wed.: 10am-5pm | Sat., Sun.: Closed`,

    // Response 2 - Verification required
    `Dear ${senderName},

Thank you for submitting your FAFSA. Your application has been selected for verification, which is a standard quality control process used by the Department of Education.

Please complete the following steps:

• Download and complete the Verification Worksheet from Path@UPenn
• Submit your IRS Tax Transcript (or use the IRS Data Retrieval Tool)
• Upload all documents through our secure portal within 2 weeks

Once we receive and verify your documents, we'll finalize your financial aid package. Most students complete verification within 7-10 business days.

If you need assistance obtaining any documents, please don't hesitate to contact our office—we're happy to guide you through the process.

Best regards,

UPenn Financial Aid Office
215-898-1988 | srfs@university.edu
3451 Walnut Street
University of Pennsylvania
Philadelphia, PA 19104
Mon., Tues., Thu., Fri.: 9am-5pm | Wed.: 10am-5pm | Sat., Sun.: Closed`,

    // Response 3 - Missing documents
    `Dear ${senderName},

We've received your FAFSA and appreciate you listing UPenn. To continue processing your financial aid application, we need a few additional documents:

Required documents:
1. Parent/Guardian Tax Returns (2024)
2. W-2 forms for all household earners
3. CSS Profile (if not yet submitted)

How to submit:
→ Log in to Path@UPenn and navigate to your Financial Aid Checklist
→ Upload documents through the secure document portal
→ Ensure all pages are clear and legible

Timeline: Please submit these documents within the next 14 days to avoid delays in your aid package. We process documents in the order received, typically within 5-7 business days.

Questions? Our team is here to help! Feel free to call or email anytime during office hours.

Sincerely,

UPenn Financial Aid Office
215-898-1988 | srfs@university.edu
3451 Walnut Street
University of Pennsylvania
Philadelphia, PA 19104
Mon., Tues., Thu., Fri.: 9am-5pm | Wed.: 10am-5pm | Sat., Sun.: Closed`,

    // Response 4 - Confirmation and next steps
    `Dear ${senderName},

Great news! We've successfully received your FAFSA submission. Your application is currently being reviewed by our financial aid team.

Here's what happens next:

Step 1: Review Period (2-3 weeks)
Our team will review your FAFSA and determine your financial need based on federal methodology.

Step 2: Document Review
If additional documentation is needed, you'll receive a notification via email and Path@UPenn.

Step 3: Award Letter
Once your file is complete, your financial aid award package will be posted to Path@UPenn. UPenn meets 100% of demonstrated financial need for all admitted students.

In the meantime, keep an eye on Path@UPenn for any updates to your checklist. We'll notify you immediately if we need anything else.

Congratulations on your admission, and welcome to the Penn family!

Warm regards,

UPenn Financial Aid Office
215-898-1988 | srfs@university.edu
3451 Walnut Street
University of Pennsylvania
Philadelphia, PA 19104
Mon., Tues., Thu., Fri.: 9am-5pm | Wed.: 10am-5pm | Sat., Sun.: Closed`,

    // Response 5 - Special circumstances
    `Dear ${senderName},

Thank you for reaching out regarding your FAFSA submission. I understand you may be experiencing special financial circumstances that aren't fully reflected in your application.

If your family has experienced any of the following, we encourage you to submit a Special Circumstances Appeal:
• Job loss or reduced income
• Medical expenses not covered by insurance
• Death of a parent or guardian
• Divorce or separation
• Other significant changes to your financial situation

How to submit an appeal:
1. Complete the Special Circumstances Form (available on Path@UPenn)
2. Provide supporting documentation (termination letter, medical bills, etc.)
3. Submit via our secure portal

Our appeals committee reviews each case individually and typically responds within 2-3 weeks. We're committed to working with families to ensure financial barriers don't prevent students from attending UPenn.

Please reach out if you have any questions about the process—we're here to support you.

Best,

UPenn Financial Aid Office
215-898-1988 | srfs@university.edu
3451 Walnut Street
University of Pennsylvania
Philadelphia, PA 19104
Mon., Tues., Thu., Fri.: 9am-5pm | Wed.: 10am-5pm | Sat., Sun.: Closed`
  ];

  // Randomly select a response
  const randomIndex = Math.floor(Math.random() * responses.length);
  return responses[randomIndex];
};

// Team members available for assignment
const teamMembers = [
  { id: '1', name: 'Puneet Thiara', email: 'pthiara@university.edu', role: 'Financial Aid Counselor' },
  { id: '2', name: 'Sarah Johnson', email: 'sjohnson@university.edu', role: 'Senior Counselor' },
  { id: '3', name: 'Michael Chen', email: 'mchen@university.edu', role: 'Financial Aid Advisor' },
  { id: '4', name: 'Emily Rodriguez', email: 'erodriguez@university.edu', role: 'Loan Specialist' },
  { id: '5', name: 'David Kim', email: 'dkim@university.edu', role: 'Verification Specialist' },
];

export function EmailViewer({ email, onSendEmail, selectedInbox = 'pthiara@university.edu', onAssignEmail, onDeleteEmail, onNavigatePrevious, onNavigateNext, canNavigatePrevious = false, canNavigateNext = false, onBackToList, onUpdateAuditLog, onAddNote, onAddTodo, onToggleTodo, onDeleteTodo, onStatusChange, isInboxMode = false }: EmailViewerProps) {
  const [showEditor, setShowEditor] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [aiResponse, setAiResponse] = useState<string>('');
  const [showNotesDialog, setShowNotesDialog] = useState(false);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [showTodoDialog, setShowTodoDialog] = useState(false);
  const [newTodoContent, setNewTodoContent] = useState('');
  const [newTodoAssignee, setNewTodoAssignee] = useState<string | null>(null);
  const [currentDisplayResponse, setCurrentDisplayResponse] = useState<string>('');
  const [showSentConfirmation, setShowSentConfirmation] = useState(false);
  const [hasGeneratedAIResponse, setHasGeneratedAIResponse] = useState(false);
  const [apiKeyError, setApiKeyError] = useState<string | null>(null);

  // All emails can be assigned to team members
  const canAssign = true;

  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  // Generate personalized AI response based on email content
  const generatePersonalizedResponse = (email: Email): string => {
    const firstName = email.sender.split(' ')[0];
    const subject = email.subject.toLowerCase();
    const message = email.fullMessage.toLowerCase();
    
    // Create contextual responses based on keywords in the email
    const responses = [];
    
    // FAFSA-related responses
    if (subject.includes('fafsa') || message.includes('fafsa')) {
      responses.push(
        `Hi ${firstName},\n\nThank you for reaching out about your FAFSA submission! I'm happy to help guide you through the next steps.\n\nI've reviewed your inquiry, and here's what you need to know:\n\nYour FAFSA has been received and is currently being processed. You should expect to receive your Student Aid Report (SAR) within 3-5 business days via email. Once we receive your processed FAFSA from the federal processor, we'll begin assembling your financial aid package.\n\nIn the meantime, please make sure to:\n• Check your university email regularly for any requests for additional documentation\n• Complete any outstanding items in your student portal\n• Review your SAR carefully for accuracy when it arrives\n\nIf you have any questions about the information on your FAFSA or need to make corrections, don't hesitate to reach out. I'm here to help make this process as smooth as possible for you.\n\nBest regards,\nPuneet Thiara\nSenior Financial Aid Counselor\nThe University Financial Aid Office`,
        
        `Hi ${firstName},\n\nGreat job submitting your FAFSA! I know the process can feel overwhelming, but you're taking the right steps.\n\nBased on your submission, here are your immediate next steps:\n\n1. **Review your FAFSA confirmation** - You should have received a confirmation email from Federal Student Aid. Keep this for your records.\n\n2. **Watch for your SAR** - Your Student Aid Report will arrive within 3-5 days and will show your Expected Family Contribution (EFC).\n\n3. **Complete verification if selected** - About 30% of students are randomly selected for verification. If you are, we'll send you a checklist of documents needed.\n\nOur office typically finalizes aid packages 2-3 weeks after receiving your processed FAFSA. I'll personally keep an eye on your file and reach out if we need anything else.\n\nFeel free to stop by during my office hours (Mon-Thu 10am-4pm) if you'd like to discuss your aid options in person. I'm always happy to walk students through the details.\n\nTake care,\nPuneet Thiara\nSenior Financial Aid Counselor`,
        
        // Shorter FAFSA response
        `Hi ${firstName},\n\nThank you for submitting your FAFSA! Your application has been received and is currently being processed.\n\nYou should receive your Student Aid Report (SAR) within 3-5 business days. Once we get your processed FAFSA from the federal processor, we'll start assembling your financial aid package - this typically takes 2-3 weeks.\n\nKeep an eye on your student portal for any updates or requests for additional documents. If you have questions in the meantime, feel free to reach out!\n\nBest,\nPuneet Thiara\nSenior Financial Aid Counselor`
      );
    }
    
    // Parent PLUS Loan responses
    if (subject.includes('parent plus') || subject.includes('plus loan') || message.includes('parent plus') || message.includes('plus loan')) {
      responses.push(
        `Hi ${firstName},\n\nThank you for your question about Parent PLUS Loans. This is a common option for families looking to cover educational expenses, and I'm glad to provide some clarity.\n\n**Parent PLUS Loan Overview:**\nThe Parent PLUS Loan is a federal loan that parents of dependent undergraduate students can use to help pay for college costs not covered by other financial aid. Your parent can borrow up to the full cost of attendance, minus any other aid you've received.\n\n**Key Details:**\n• Fixed interest rate: 9.08% for 2025-2026\n• 4.228% origination fee (deducted from the loan amount)\n• Credit check required (parent must not have adverse credit history)\n• Repayment begins 60 days after final disbursement (though deferment options exist)\n\n**How to Apply:**\nYour parent should visit studentaid.gov and complete the Parent PLUS Loan application. The process takes about 15 minutes, and approval is typically received within 1-3 business days.\n\nI've attached our Parent PLUS Loan guide with more detailed information. If your parent has questions about the application or would like to discuss repayment options, I'm happy to schedule a call with both of you.\n\nLet me know if you need anything else!\n\nBest,\nPuneet Thiara\nSenior Financial Aid Counselor`,
        
        `Hi ${firstName},\n\nI'm glad you reached out about Parent PLUS Loans - it's important to understand all your options before making a decision.\n\nHere's what you should know:\n\n**What is it?**\nThe Parent PLUS Loan is a federal loan in your parent's name that can cover educational costs not met by other aid. Unlike student loans, your parent is the borrower and is responsible for repayment.\n\n**Pros:**\n✓ Can borrow up to full cost of attendance\n✓ Fixed interest rate\n✓ No annual or aggregate limits\n✓ Flexible repayment options available\n\n**Cons:**\n✗ Higher interest rate than student loans (currently 9.08%)\n✗ Origination fee applies\n✗ Requires credit check\n✗ Repayment begins almost immediately\n\n**Important to consider:** Before taking out a Parent PLUS Loan, I'd recommend exploring other options like federal student loans in your name (with lower rates) or private education loans that might offer better terms.\n\nI'd be happy to sit down with you and review your complete financial aid package to see what makes the most sense for your family's situation. Would you like to schedule a 30-minute advising session this week?\n\nHere to help,\nPuneet Thiara\nSenior Financial Aid Counselor\npthiara@university.edu`,
        
        // Shorter Parent PLUS response
        `Hi ${firstName},\n\nGreat question about Parent PLUS Loans! Here's the quick overview:\n\nThe Parent PLUS Loan allows your parent to borrow up to your full cost of attendance (minus other aid). The current interest rate is 9.08% with a 4.228% origination fee. Your parent will need to pass a credit check and can apply at studentaid.gov.\n\nRepayment begins 60 days after the final disbursement, though deferment options are available. I'd recommend comparing this with other loan options to see what works best for your family.\n\nLet me know if you'd like to discuss this further or review your complete aid package together!\n\nBest,\nPuneet Thiara\nSenior Financial Aid Counselor`
      );
    }
    
    // Verification responses
    if (subject.includes('verification') || message.includes('verification') || message.includes('documents')) {
      responses.push(
        `Hi ${firstName},\n\nThank you for your email regarding verification documents. I know this can seem like an extra hurdle, but it's actually a routine process that helps ensure accurate financial aid.\n\n**What you need to submit:**\n\nBased on your FAFSA, you've been selected for verification. Here are the specific documents we need from you:\n\n1. **2024 Federal Tax Return Transcript** - You can request this for free at irs.gov/transcripts or by calling 1-800-908-9946\n2. **Verification Worksheet** - Available in your student portal under "Financial Aid Documents"\n3. **W-2 forms** - For you and your parents (if dependent)\n\n**How to submit:**\n• Log into your student portal\n• Navigate to Financial Aid > Upload Documents\n• Upload clear, legible copies of all required forms\n\n**Timeline:**\nOnce we receive your complete verification packet, we typically process it within 5-7 business days. To avoid any delays in your aid disbursement, please try to submit everything within the next 2 weeks.\n\nDon't worry if you have trouble accessing any of these documents - that's what I'm here for! Feel free to call me at (555) 123-4567 or stop by my office if you need help navigating the IRS website or have any questions.\n\nYou've got this!\n\nPuneet Thiara\nSenior Financial Aid Counselor`,
        
        `Hi ${firstName},\n\nI completely understand that gathering verification documents can feel like a lot, but I promise it's worth it to get your aid package finalized. Let me break down exactly what you need to do.\n\n**Your Verification Checklist:**\n\n☐ IRS Tax Return Transcript (2024)\n   → Fastest way: Use the IRS Data Retrieval Tool directly on your FAFSA\n   → Alternative: Request at irs.gov/transcripts (arrives in 5-10 days)\n\n☐ Completed Verification Worksheet\n   → Download from your student portal\n   → Sign and date all required sections\n   → Parent signature required if you're a dependent student\n\n☐ Identity Verification (if flagged)\n   → Upload a clear photo of your government-issued ID\n\n**Pro tip:** Most students complete verification in one sitting by using the IRS Data Retrieval Tool - it's the fastest method and automatically transfers your tax information.\n\nI've helped hundreds of students through this process, and once you have all the documents in front of you, it usually only takes about 20 minutes to complete everything.\n\nIf anything is unclear or you get stuck at any point, please don't hesitate to reach out. I'm here to make this as painless as possible!\n\nWarm regards,\nPuneet Thiara\nSenior Financial Aid Counselor\nOffice Hours: Mon-Thu 10am-4pm, Fri 10am-2pm`,
        
        // Shorter verification response
        `Hi ${firstName},\n\nThanks for reaching out about verification! You've been selected for verification (a standard quality control process), and I need a few documents from you:\n\n1. 2024 IRS Tax Return Transcript (request free at irs.gov/transcripts)\n2. Verification Worksheet (download from your student portal)\n3. All 2024 W-2 forms\n\nUpload everything through your student portal under Financial Aid > Upload Documents. We'll process your verification within 5-7 business days once we receive the complete packet.\n\nLet me know if you need help with any of this!\n\nBest,\nPuneet Thiara\nSenior Financial Aid Counselor`
      );
    }
    
    // Work-study responses
    if (subject.includes('work') || subject.includes('work-study') || message.includes('work-study') || message.includes('work study')) {
      responses.push(
        `Hi ${firstName},\n\nThank you for your interest in the Federal Work-Study program! This is one of my favorite parts of financial aid because it gives students real work experience while helping to pay for college.\n\n**Your Work-Study Award:**\nBased on your financial aid package, you've been awarded $2,500 in Federal Work-Study for the academic year. This means you're eligible to earn up to that amount through part-time employment on campus.\n\n**How it works:**\n• You'll work 10-15 hours per week during the semester\n• Most positions pay $15-17 per hour\n• You receive a regular paycheck (earnings are not applied to your student account)\n• You can study during slow periods at many positions\n\n**Finding a position:**\n1. Visit the Career Services portal at careers.university.edu\n2. Filter for "Work-Study Eligible" positions\n3. Apply directly to jobs that interest you (treat it like a regular job application)\n4. Popular departments: Library, Student Center, Academic Departments, Athletics\n\n**My advice:** Apply early! The best positions fill up quickly, especially in the first few weeks of the semester. Many supervisors are looking for students right now.\n\nI've attached a list of departments currently hiring work-study students. If you'd like help with your resume or have questions about specific positions, I'm happy to assist.\n\nBest of luck with your job search!\n\nPuneet Thiara\nSenior Financial Aid Counselor`,
        
        `Hi ${firstName},\n\nI'm so glad you're asking about Work-Study - it's a fantastic program that I always encourage students to take advantage of!\n\n**Quick Overview:**\nYou're eligible for $2,500 in Federal Work-Study this year. This is not a loan - it's money you earn through part-time work on campus. Your earnings are paid directly to you via paycheck.\n\n**Why I recommend it:**\n✓ Convenient on-campus locations\n✓ Flexible scheduling around your classes\n✓ Supervisors understand you're a student first\n✓ Great way to build your resume\n✓ Often leads to internships and career opportunities\n\n**Getting started:**\n• Browse open positions at careers.university.edu/workstudy\n• Apply to 3-5 positions that match your interests\n• Positions range from library assistants to research help to office support\n• Some departments even hire students in their field of study!\n\n**Student Success Story:** Last year, I worked with a student who got a work-study position in the Biology department. That experience led directly to a research internship and ultimately a job offer after graduation. These positions can really open doors!\n\nQuestions about specific positions or need help with the application process? Just let me know. I want to make sure you find something you'll enjoy.\n\nCheers,\nPuneet Thiara\nSenior Financial Aid Counselor\npthiara@university.edu | (555) 123-4567`,
        
        // Shorter work-study response
        `Hi ${firstName},\n\nGreat news! You're eligible for $2,500 in Federal Work-Study this year. This means you can work part-time on campus (typically 10-15 hours/week) and earn up to that amount.\n\nTo find positions, visit careers.university.edu/workstudy and filter for work-study jobs. Popular departments include the library, student centers, and academic offices. Most positions pay $15-17/hour.\n\nMy advice: apply early! The best positions fill up fast. Let me know if you need any help with your application!\n\nBest,\nPuneet Thiara\nSenior Financial Aid Counselor`
      );
    }
    
    // Scholarship/Grant responses
    if (subject.includes('scholarship') || subject.includes('grant') || message.includes('pell grant') || message.includes('scholarship')) {
      responses.push(
        `Hi ${firstName},\n\nThank you for reaching out about scholarship and grant opportunities. I love talking about "free money" for college - these are funds you don't have to pay back!\n\n**Your Current Aid:**\nBased on your FAFSA and EFC (Expected Family Contribution), here's what you may qualify for:\n\n• **Federal Pell Grant** - Up to $7,395 for the 2025-26 year (based on financial need)\n• **Federal Supplemental Educational Opportunity Grant (FSEOG)** - $500-$4,000\n• **University Grants** - Varies by institution and need\n• **State Grants** - Check your state's higher education agency website\n\n**Additional Scholarship Opportunities:**\nI encourage all my students to apply for external scholarships! Here are some great resources:\n\n1. Fastweb.com - Free scholarship matching service\n2. Scholarships.com - Database of over 3.7 million scholarships\n3. Your department/major - Many academic departments offer scholarships\n4. Local community organizations - Rotary, Lions Club, Chamber of Commerce\n\n**Pro tip:** Apply for lots of smaller scholarships ($500-$2,000). They have less competition and add up quickly. Even 15 minutes a day on scholarship applications can result in thousands of dollars.\n\nI've attached our scholarship guide with application tips and a list of scholarships specifically for students at our university. Many have deadlines coming up soon!\n\nWant to review your specific grant eligibility? Let me know and we can schedule a time to go over your financial aid package together.\n\nRooting for you!\n\nPuneet Thiara\nSenior Financial Aid Counselor`,
        
        `Hi ${firstName},\n\nGreat question about grants and scholarships! Understanding the difference between these and loans is key to making smart financial decisions.\n\n**Grants vs. Scholarships vs. Loans - What's the difference?**\n\n**Grants** (Need-based, don't repay)\n• Federal Pell Grant\n• FSEOG\n• State grants\n• Awarded based on financial need shown on your FAFSA\n\n**Scholarships** (Merit or need-based, don't repay)\n• Based on achievement, talent, demographics, or other criteria\n• Can be from the university, private organizations, or corporations\n• Require applications and sometimes essays\n\n**Loans** (MUST be repaid with interest)\n• Federal Direct Loans (subsidized and unsubsidized)\n• Private loans\n• Should be your last resort after grants and scholarships\n\n**Your Specific Situation:**\nWith your EFC of ${Math.floor(Math.random() * 5000) + 1000}, you likely qualify for federal grant aid. Once your FAFSA is fully processed, your aid package will show exactly what grants you're eligible for.\n\n**My Recommendation:**\nWhile you're waiting for your aid package, spend 30 minutes a week applying for external scholarships. I've seen students earn anywhere from $500 to $15,000 in outside scholarships - it's absolutely worth your time!\n\nLet me know if you'd like to meet to discuss your aid package or review scholarship opportunities. I'm here to help you maximize your free aid!\n\nBest,\nPuneet Thiara\nSenior Financial Aid Counselor\nOffice: Student Services Building, Room 204`,
        
        // Shorter scholarship response
        `Hi ${firstName},\n\nBased on your FAFSA, you may qualify for several types of grant aid including the Federal Pell Grant (up to $7,395) and potentially university or state grants. Once your FAFSA is processed, your aid package will show your specific grant eligibility.\n\nI also encourage you to apply for external scholarships! Check out Fastweb.com and Scholarships.com for opportunities. Even smaller scholarships ($500-$1,000) add up quickly and have less competition.\n\nLet me know if you'd like to review your aid package together once it's ready!\n\nBest,\nPuneet Thiara\nSenior Financial Aid Counselor`
      );
    }
    
    // Direct Deposit responses
    if (subject.includes('direct deposit') || subject.includes('refund') || message.includes('direct deposit') || message.includes('refund')) {
      responses.push(
        `Hi ${firstName},\n\nGreat question about setting up direct deposit! This is definitely something you'll want to do before the semester starts so you can receive any financial aid refunds quickly.\n\n**What are refunds?**\nAfter your financial aid pays for tuition, fees, and university housing, any remaining aid is refunded to you. You can use these funds for books, supplies, living expenses, etc.\n\n**Setting Up Direct Deposit:**\n\n1. Log into your student portal\n2. Navigate to Student Account > Direct Deposit\n3. Click "Add Bank Account"\n4. Enter your:\n   • Bank routing number (9 digits)\n   • Account number\n   • Account type (checking or savings)\n5. Verify and submit\n\n**Important:** Make sure you enter your information accurately! Double-check those numbers before submitting.\n\n**Timeline:**\nOnce direct deposit is set up, refunds typically arrive 3-5 business days after they're processed. Without direct deposit, you'll receive a paper check in the mail which can take 2-3 weeks.\n\n**When do refunds happen?**\n• Fall semester: Usually 1-2 weeks after the semester starts\n• Spring semester: Usually 1-2 weeks after the semester starts\n• Exact dates depend on when your aid fully processes\n\nIf you have any trouble with the portal or need help locating your bank information, don't hesitate to reach out. I want to make sure you can access your funds as soon as they're available!\n\nTake care,\nPuneet Thiara\nSenior Financial Aid Counselor`,
        
        `Hi ${firstName},\n\nI'm so glad you're asking about this now - setting up direct deposit ahead of time will save you a lot of hassle later!\n\n**Why Direct Deposit Matters:**\nIf your financial aid exceeds your tuition and fees, you'll receive a refund. With direct deposit, this money arrives in your bank account within 3-5 days. Without it, you're waiting weeks for a paper check. Trust me, you want that money fast for books and expenses!\n\n**Step-by-Step Setup:**\n\n**Step 1:** Get your bank information ready\n• Look at a check or log into your online banking\n• You'll need your routing number and account number\n\n**Step 2:** Access the student portal\n• Go to Student Services > Finances > Direct Deposit\n• Select "Add New Account"\n\n**Step 3:** Enter your information\n• Routing number (9 digits - usually the first set on your check)\n• Account number (usually the second set on your check)\n• Confirm it's a checking or savings account\n\n**Step 4:** Verify\n• The system may make a small test deposit\n• Confirm the amount to verify your account\n\n**Pro Tip:** Use a checking account that you access regularly and won't close. Some students set up their parent's account, but I recommend using your own so you have immediate access.\n\nAny issues? Our Bursar's Office can also help with this - they're in the Administration Building, 1st floor. Or feel free to stop by my office and I can walk you through it on your laptop.\n\nYou're being smart by getting this done early!\n\nBest regards,\nPuneet Thiara\nSenior Financial Aid Counselor\npthiara@university.edu`
      );
    }
    
    // Graduate PLUS Loan responses
    if (subject.includes('graduate plus') || subject.includes('grad plus') || message.includes('graduate plus') || message.includes('grad loan')) {
      responses.push(
        `Hi ${firstName},\n\nThank you for your question about the Graduate PLUS Loan program. This is an important option for graduate students, and I'm happy to explain how it works.\n\n**Graduate PLUS Loan Overview:**\n\nThe Grad PLUS Loan is a federal loan that graduate and professional students can borrow to help cover education expenses not met by other financial aid.\n\n**Key Features:**\n• Fixed interest rate: 9.08% for 2025-2026\n• Origination fee: 4.228%\n• Borrow up to your cost of attendance minus other aid received\n• Credit check required (you must not have adverse credit history)\n• You are the borrower (not your parents)\n\n**Eligibility Requirements:**\n✓ Must be enrolled at least half-time in a graduate/professional program\n✓ Must complete the FAFSA\n✓ Must not have adverse credit history\n✓ If credit is denied, you may apply with an endorser (co-signer)\n\n**How to Apply:**\n1. Complete the FAFSA if you haven't already\n2. Visit studentaid.gov and complete the Grad PLUS Loan application\n3. Complete entrance counseling\n4. Sign your Master Promissory Note (MPN)\n\n**Repayment:**\nUnlike Parent PLUS Loans, you can defer payments while enrolled at least half-time. Interest does accrue during deferment, but you have flexibility in when repayment begins.\n\n**My Recommendation:** Before borrowing the maximum amount, carefully consider your total debt load and expected income after graduation. I'd be happy to meet with you to review your complete aid package and discuss whether the Grad PLUS Loan makes sense for your situation.\n\nWould you like to schedule an appointment to go over your options in detail?\n\nBest,\nPuneet Thiara\nSenior Financial Aid Counselor`,
        
        // Shorter Grad PLUS response
        `Hi ${firstName},\n\nThe Graduate PLUS Loan is a federal loan for graduate students that allows you to borrow up to your full cost of attendance (minus other aid). The current rate is 9.08% with a 4.228% origination fee.\n\nYou'll need to pass a credit check and can apply at studentaid.gov. The good news is you can defer payments while enrolled at least half-time, though interest will accrue.\n\nBefore borrowing, I'd recommend considering your total debt load. Let me know if you'd like to discuss your options!\n\nBest,\nPuneet Thiara\nSenior Financial Aid Counselor`
      );
    }
    
    // Default personalized responses for general inquiries
    if (responses.length === 0) {
      responses.push(
        `Hi ${firstName},\n\nThank you for reaching out to our office. I appreciate you taking the time to send us your question about ${email.subject.toLowerCase()}.\n\nI've reviewed your inquiry and want to make sure I provide you with the most accurate and helpful information. Based on what you've shared, here are some key points that may help:\n\n• Your FAFSA or financial aid application is being processed and reviewed by our team\n• We typically respond to all inquiries within 24-48 business hours\n• If you need immediate assistance, feel free to call our office or stop by during walk-in hours\n\n**For fastest service:**\n• Check your student portal for real-time updates on your aid status\n• Review our FAQ page at financialaid.university.edu/faq\n• Email us with specific questions so we can provide detailed answers\n\nI want to make sure you get the support you need. If this response doesn't fully address your question, please reply with more details and I'll provide additional guidance. You can also schedule a one-on-one advising appointment through our online scheduler.\n\nI'm here to help make the financial aid process as smooth as possible for you!\n\nBest regards,\nPuneet Thiara\nSenior Financial Aid Counselor\nThe University Financial Aid Office\npthiara@university.edu | (555) 123-4567`,
        
        `Hi ${firstName},\n\nThank you so much for your email regarding ${email.subject.toLowerCase()}. I'm glad you reached out - that's exactly what I'm here for!\n\nI understand that navigating financial aid can feel overwhelming, especially with all the forms, deadlines, and terminology. Please know that you're not alone in this process, and I'm committed to helping you every step of the way.\n\n**Here's what I can do for you:**\n\n1. **Review your specific situation** - Every student's financial aid is unique, and I want to make sure you understand all your options\n\n2. **Explain your aid package** - Once your aid is finalized, we can go through each component together so you know exactly what you're receiving\n\n3. **Answer your questions** - No question is too small! Whether it's about forms, deadlines, or understanding the difference between loans and grants, I'm here to help\n\n**Next Steps:**\n\nBased on your email, I'd recommend we schedule a brief phone call or in-person meeting to discuss your situation in detail. This will allow me to pull up your file and give you personalized guidance.\n\nYou can:\n• Reply to this email with your availability\n• Call me directly at (555) 123-4567\n• Book an appointment at calendly.com/pthiara-advising\n• Stop by during walk-in hours: Mon-Thu 10am-4pm\n\nIn the meantime, make sure to check your student portal regularly for any updates or requests for additional information.\n\nLooking forward to helping you!\n\nWarm regards,\nPuneet Thiara\nSenior Financial Aid Counselor\nOffice: Student Services Building, Room 204`,
        
        // Shorter default response
        `Hi ${firstName},\n\nThank you for reaching out about ${email.subject.toLowerCase()}. I'm reviewing your inquiry and want to make sure I give you the most helpful information.\n\nYour financial aid application is being processed by our team. We typically respond to all inquiries within 24-48 hours. In the meantime, check your student portal for real-time updates on your aid status.\n\nIf you have urgent questions, feel free to call our office at (555) 123-4567 or stop by during walk-in hours (Mon-Thu 10am-4pm). I'm here to help!\n\nBest,\nPuneet Thiara\nSenior Financial Aid Counselor`
      );
    }
    
    // Randomly select one response from the contextual options
    const randomIndex = Math.floor(Math.random() * responses.length);
    return responses[randomIndex];
  };

  // AI generation removed - backend integration disabled
  const generateAIResponseFromAPI = async () => {
    if (!email) return;

    setIsGeneratingAI(true);
    try {
      // Simulate AI response generation with mock data
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate personalized response based on email content
      const personalizedResponse = generatePersonalizedResponse(email);
      
      // Set the personalized response
      setAiResponse(personalizedResponse);
      setCurrentDisplayResponse(personalizedResponse);
      setApiKeyError(null);
      
      // Add audit log entry for AI response generation
      const hasAIGeneratedLog = email.auditLog?.some(entry => entry.action === 'ai_response_generated');
      if (!hasAIGeneratedLog && onUpdateAuditLog) {
        const now = new Date();
        const timestamp = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) + ' ' + 
                          now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase();
        
        onUpdateAuditLog(email.id, {
          id: `audit-${email.id}-ai-${Math.random().toString(36).substr(2, 9)}`,
          timestamp: timestamp,
          action: 'ai_response_generated',
          details: 'AI suggested response available for review.',
        });
      }
    } catch (error) {
      console.error('Error generating AI response:', error);
      // Fall back to template response
      const fallbackResponse = generateAIResponse(email.sender.split(' ')[0]);
      setAiResponse(fallbackResponse);
      setCurrentDisplayResponse(fallbackResponse);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // Reset state and initialize AI response when email changes
  useEffect(() => {
    if (email) {
      setShowEditor(false);
      setAttachedFiles([]);
      setHasGeneratedAIResponse(false);
      setCurrentDisplayResponse('');
      setAiResponse('');
      setApiKeyError(null);
      
      // Generate AI response using API
      generateAIResponseFromAPI();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email?.id]);

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setAttachedFiles(prev => [...prev, ...Array.from(files)]);
      // Reset the input so the same file can be selected again if needed
      event.target.value = '';
    }
  };

  const handleRemoveFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleRegenerate = () => {
    if (email) {
      generateAIResponseFromAPI();
    }
  };

  const handleSend = () => {
    if (email && onSendEmail) {
      const attachmentNames = attachedFiles.map(file => file.name);
      onSendEmail(email, currentDisplayResponse, attachmentNames);
      
      // Show confirmation
      setShowSentConfirmation(true);
      setTimeout(() => {
        setShowSentConfirmation(false);
      }, 3000);

      // Reset state
      setAttachedFiles([]);
      setShowEditor(false);
    }
  };

  const handleAssignTo = (teamMemberName: string) => {
    if (email && onAssignEmail) {
      onAssignEmail(email.id, teamMemberName);
    }
  };

  const handleUnassign = () => {
    if (email && onAssignEmail) {
      onAssignEmail(email.id, null);
    }
  };

  const handleDelete = () => {
    if (email && onDeleteEmail) {
      onDeleteEmail(email.id);
    }
  };

  const handleAddNote = () => {
    if (!newNoteContent.trim() || !email || !onAddNote) return;

    const newNote: CaseNote = {
      id: `note-${Date.now()}`,
      author: 'Puneet Thiara', // Current user - you can make this dynamic
      authorRole: 'Financial Aid Counselor',
      timestamp: new Date().toLocaleString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }),
      content: newNoteContent.trim(),
    };

    onAddNote(email.id, newNote);
    setNewNoteContent('');
  };

  const handleStatusChange = (status: 'In Progress' | 'On Hold' | 'Resolved') => {
    if (email && onStatusChange) {
      onStatusChange(email.id, status);
    }
  };

  const handleAddTodo = () => {
    if (!newTodoContent.trim() || !email || !onAddTodo) return;

    const newTodo: TodoItem = {
      id: `todo-${Date.now()}`,
      content: newTodoContent.trim(),
      completed: false,
      assignedTo: newTodoAssignee,
      createdBy: 'Puneet Thiara', // Current user - you can make this dynamic
      createdAt: new Date().toLocaleString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }),
    };

    onAddTodo(email.id, newTodo);
    setNewTodoContent('');
    setNewTodoAssignee(null);
  };

  const handleToggleTodo = (todoId: string) => {
    if (email && onToggleTodo) {
      onToggleTodo(email.id, todoId);
    }
  };

  const handleDeleteTodo = (todoId: string) => {
    if (email && onDeleteTodo) {
      onDeleteTodo(email.id, todoId);
    }
  };

  const handlePreviousEmail = () => {
    if (onNavigatePrevious && canNavigatePrevious) {
      onNavigatePrevious();
    }
  };

  const handleNextEmail = () => {
    if (onNavigateNext && canNavigateNext) {
      onNavigateNext();
    }
  };

  if (!email) {
    return (
      <div className="flex-1 flex items-center justify-center border-l border-black/10">
        <div className="text-center">
          <h2 className="text-lg font-medium mb-2">No conversation selected</h2>
          <p className="text-sm text-[#1e1919]">Select an email to read</p>
        </div>
      </div>
    );
  }

  // Debug logging
  console.log('EmailViewer - Current email:', {
    id: email.id,
    sender: email.sender,
    hasAttachment: email.hasAttachment,
    attachment: email.attachment,
    thread: email.thread ? `${email.thread.length} messages` : 'no thread',
    willShowAttachment: !!email.attachment,
    renderPath: (email.thread && email.thread.length > 0) ? 'THREAD VIEW' : 'SINGLE EMAIL VIEW'
  });

  return (
    <div className="flex-1 flex flex-col border-l border-black/10 bg-white relative">
      {/* Success Toast */}
      {showSentConfirmation && (
        <div className="absolute top-4 right-4 z-50 bg-[#14ba6d] text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3">
          <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>Email sent successfully!</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between px-3 sm:px-4 lg:px-7 py-2 border-b border-zinc-200">
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Mobile back button */}
          {onBackToList && (
            <button
              onClick={onBackToList}
              className="lg:hidden p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-[#666666]" />
            </button>
          )}
          <button onClick={handleDelete} className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg">
            <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#666666]" />
          </button>
          {/* Hide checklist in inbox mode */}
          {!isInboxMode && (
            <button 
              onClick={() => setShowTodoDialog(true)}
              className="p-2 hover:bg-gray-100 rounded-lg relative"
            >
              <CheckSquare className="w-5 h-5 text-[#666666]" />
              {email?.todos && email.todos.filter(t => !t.completed).length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#1990ff] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {email.todos.filter(t => !t.completed).length}
                </span>
              )}
            </button>
          )}
          {/* Hide assignment in inbox mode */}
          {!isInboxMode && canAssign && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                {email?.assignedTo ? (
                  <button 
                    className="px-4 py-1.5 text-sm bg-[#e8f4f0] text-[#14ba6d] rounded-lg hover:bg-[#d4ede4] transition-colors flex items-center gap-2"
                  >
                    <span className="w-2 h-2 bg-[#14ba6d] rounded-full"></span>
                    <span>{email.assignedTo}</span>
                    <ChevronDown className="w-4 h-4 ml-1" />
                  </button>
                ) : (
                  <button 
                    className="px-4 py-1.5 text-sm bg-[#1990ff] text-white rounded-lg hover:bg-[#0077e6] transition-colors flex items-center gap-2"
                  >
                    <UserCircle className="w-4 h-4" />
                    <span>Assign Case</span>
                    <ChevronDown className="w-4 h-4 ml-1" />
                  </button>
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64">
                {teamMembers.map((member) => (
                  <DropdownMenuItem
                    key={member.id}
                    onClick={() => handleAssignTo(member.name)}
                    className="flex flex-col items-start py-3 cursor-pointer"
                  >
                    <div className="flex items-center gap-2 w-full">
                      <UserCircle className="w-4 h-4 text-[#666666]" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{member.name}</span>
                          {email?.assignedTo === member.name && (
                            <span className="w-1.5 h-1.5 bg-[#14ba6d] rounded-full"></span>
                          )}
                        </div>
                        <div className="text-xs text-[#7f7f7f]">{member.role}</div>
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))}
                {email?.assignedTo && (
                  <>
                    <div className="h-px bg-gray-200 my-1" />
                    <DropdownMenuItem
                      onClick={handleUnassign}
                      className="text-red-600 cursor-pointer py-2"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Unassign Case
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          {/* Hide status in inbox mode */}
          {!isInboxMode && (
            <>
              {!email?.assignedTo ? (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button 
                        disabled
                        className="px-4 py-1.5 text-sm rounded-lg transition-colors flex items-center gap-2 border-2 border-gray-300 text-gray-400 cursor-not-allowed bg-white"
                      >
                        <span className="w-2 h-2 rounded-full bg-gray-300"></span>
                        <span>Status</span>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Assign this case to change status</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button 
                      className={`px-4 py-1.5 text-sm rounded-lg transition-colors flex items-center gap-2 ${
                        email?.status === 'In Progress' || !email?.status
                        ? 'bg-[#e3f2fd] text-[#1976d2] hover:bg-[#bbdefb]'
                        : email?.status === 'On Hold'
                        ? 'bg-[#fff3e0] text-[#f57c00] hover:bg-[#ffe0b2]'
                        : email?.status === 'Resolved'
                        ? 'bg-[#e8f5e9] text-[#388e3c] hover:bg-[#c8e6c9]'
                        : 'bg-[#e3f2fd] text-[#1976d2] hover:bg-[#bbdefb]'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${
                        email?.status === 'In Progress' || !email?.status
                        ? 'bg-[#1976d2]'
                        : email?.status === 'On Hold'
                        ? 'bg-[#f57c00]'
                        : 'bg-[#388e3c]'
                      }`}></span>
                      <span>{email?.status || 'Status'}</span>
                      <ChevronDown className="w-4 h-4 ml-1" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-48">
                    <DropdownMenuItem
                      onClick={() => handleStatusChange('In Progress')}
                      className="flex items-center gap-3 cursor-pointer py-2"
                    >
                      <span className="w-2 h-2 bg-[#1976d2] rounded-full"></span>
                      <span>In Progress</span>
                      {email?.status === 'In Progress' && (
                        <span className="ml-auto text-[#1976d2]">✓</span>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleStatusChange('On Hold')}
                      className="flex items-center gap-3 cursor-pointer py-2"
                    >
                      <span className="w-2 h-2 bg-[#f57c00] rounded-full"></span>
                      <span>On Hold</span>
                      {email?.status === 'On Hold' && (
                        <span className="ml-auto text-[#f57c00]">✓</span>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleStatusChange('Resolved')}
                      className="flex items-center gap-3 cursor-pointer py-2"
                    >
                      <span className="w-2 h-2 bg-[#388e3c] rounded-full"></span>
                      <span>Mark as Resolved</span>
                      {email?.status === 'Resolved' && (
                        <span className="ml-auto text-[#388e3c]">✓</span>
                      )}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={handlePreviousEmail}
            disabled={!canNavigatePrevious}
            className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-[#666666]" />
          </button>
          <button 
            onClick={handleNextEmail}
            disabled={!canNavigateNext}
            className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-[#666666]" />
          </button>
        </div>
      </div>

      {/* Email Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-3xl">
          {/* Thread Messages */}
          {email.thread && email.thread.length > 0 ? (
            <div className="space-y-8">
              {email.thread.map((message, index) => (
                <div key={message.id}>
                  {/* Message Header */}
                  <div className="mb-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="text-sm">
                        <span className="font-medium text-[#1e1919]">from:</span>{' '}
                        <span className="text-[#7f7f7f]">{message.sender} &lt;{message.email}&gt;</span>
                      </div>
                      <span className="text-sm text-[#7f7f7f]">
                        {message.date} : {message.time}
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium text-[#1e1919]">to:</span>{' '}
                      <span className="font-medium text-[#7f7f7f]">
                        {message.sender === 'Puneet Thiara' ? email.email : (email.inboxAddress || selectedInbox)}
                      </span>
                    </div>
                  </div>

                  {/* Attachment - show on first message if email has attachment */}
                  {index === 0 && email.attachment && (
                    <div className="mb-6">
                      <div className="inline-flex items-center gap-3 px-4 py-2 bg-white border border-[#ced0df] rounded-full">
                        <FileText className="w-6 h-6 text-[#E72A2A]" />
                        <span className="text-sm text-[#0b0619]/70">{email.attachment}</span>
                      </div>
                    </div>
                  )}

                  {/* Message Body */}
                  <div className="mb-6">
                    <p className="text-base leading-6 text-[#1e1919]">{message.message}</p>
                  </div>

                  {/* Divider between messages (except last one) */}
                  {index < email.thread.length - 1 && (
                    <div className="border-t border-black/10 my-8" />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* Single Email Header */}
              <div className="mb-6">
                <div className="flex items-start justify-between mb-2">
                  <div className="text-sm">
                    <span className="font-medium text-[#1e1919]">from:</span>{' '}
                    <span className="text-[#7f7f7f]">{email.sender} &lt;{email.email}&gt;</span>
                  </div>
                  <span className="text-sm text-[#7f7f7f]">
                    September 9, 2025 : 9:16AM
                  </span>
                </div>
                <div className="text-sm">
                  <span className="font-medium text-[#1e1919]">to:</span>{' '}
                  <span className="font-medium text-[#7f7f7f]">{selectedInbox}</span>
                </div>
              </div>

              {/* Attachment */}
              {email.attachment && (
                <div className="mb-6">
                  <div className="inline-flex items-center gap-3 px-4 py-2 bg-white border border-[#ced0df] rounded-full">
                    <FileText className="w-6 h-6 text-[#E72A2A]" />
                    <span className="text-sm text-[#0b0619]/70">{email.attachment}</span>
                  </div>
                </div>
              )}

              {/* Email Body */}
              <div className="mb-8">
                <p className="text-base leading-6 text-[#1e1919]">{email.fullMessage}</p>
              </div>
            </>
          )}

          {/* Hidden file input - shared between both views */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />

          {/* API Key Error Banner - Hidden for now */}
          {false && apiKeyError && (
            <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-yellow-800 mb-1">⚠️ AI Feature Setup Required</h3>
                  <p className="text-sm text-yellow-700 mb-2">{apiKeyError}</p>
                  <div className="text-xs text-yellow-600 bg-yellow-100 p-2 rounded">
                    <strong>To enable AI responses:</strong>
                    <ol className="list-decimal ml-4 mt-1 space-y-1">
                      <li>Get your API key at <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="underline">platform.openai.com/api-keys</a></li>
                      <li>The key should start with "sk-"</li>
                      <li>Add it to Supabase → Settings → Edge Functions → Environment Variables</li>
                      <li>Variable name: <code className="bg-yellow-200 px-1 rounded">OPENAI_API_KEY</code></li>
                    </ol>
                    <p className="mt-2"><strong>Currently showing template responses.</strong></p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* AI Response Section */}
          {!showEditor ? (
            <div className="mt-8">
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
                      <span>Generating AI response based on email thread and knowledge base...</span>
                    </div>
                  ) : (
                    currentDisplayResponse
                  )}
                </div>

                {/* Attached Files Display */}
                {attachedFiles.length > 0 && (
                  <div className="mt-6 space-y-2">
                    <p className="text-sm text-[#7f7f7f]">Attached files:</p>
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

                <div className="flex items-center gap-3 mt-6 justify-end">
                  <button 
                    onClick={() => setShowEditor(true)}
                    disabled={isGeneratingAI}
                    className="px-4 py-2 bg-[#ffecbd] hover:bg-[#ffe9a8] rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M4 20H8L19.2929 8.70711C19.6834 8.31658 19.6834 7.68342 19.2929 7.29289L16.7071 4.70711C16.3166 4.31658 15.6834 4.31658 15.2929 4.70711L4 16V20Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="capitalize text-[#424242]">Edit</span>
                  </button>

                  <button 
                    onClick={handleRegenerate}
                    disabled={isGeneratingAI}
                    className="px-4 py-2 bg-[#e7e7e7] hover:bg-[#dadada] border border-[#e7e7e7] rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGeneratingAI ? (
                      <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-[#424242]"></div>
                    ) : (
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                        <path d="M19 23.375C19 23.9618 18.5523 24.4375 18 24.4375C17.4477 24.4375 17 23.9618 17 23.375C17 22.7882 17.4477 22.3125 18 22.3125C18.5523 22.3125 19 22.7882 19 23.375Z" fill="currentColor"/>
                        <path d="M23 19.125C23 19.7118 22.5523 20.1875 22 20.1875C21.4477 20.1875 21 19.7118 21 19.125C21 18.5382 21.4477 18.0625 22 18.0625C22.5523 18.0625 23 18.5382 23 19.125Z" fill="currentColor"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M12 6.8881L11.3478 9.74586C11.0871 10.8882 10.2477 11.78 9.17257 12.057L6.48292 12.75L9.17257 13.443C10.2477 13.72 11.0871 14.6118 11.3478 15.7541L12 18.6119L12.6522 15.7541C12.9129 14.6118 13.7523 13.72 14.8274 13.443L17.5171 12.75L14.8274 12.057C13.7523 11.78 12.9129 10.8882 12.6522 9.74586L12 6.8881Z" fill="currentColor"/>
                      </svg>
                    )}
                    <span className="capitalize text-[#424242]">Regenerate</span>
                  </button>

                  <button 
                    onClick={handleAttachClick}
                    disabled={isGeneratingAI}
                    className="px-4 py-2 border border-[#424242] hover:bg-gray-50 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="capitalize text-[#424242]">Attach</span>
                  </button>

                  <button 
                    onClick={handleSend}
                    disabled={isGeneratingAI}
                    className="px-4 py-2 bg-[#cdf4d4] hover:bg-[#b8edbe] rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                      <path d="M4.01 6.03L11.52 9.25L4 8.25L4.01 6.03ZM11.51 14.75L4 17.97V15.75L11.51 14.75ZM2.01 3L2 10L17 12L2 14L2.01 21L23 12L2.01 3Z" fill="currentColor"/>
                    </svg>
                    <span className="capitalize text-[#424242]">Send</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <AIResponseEditor 
              onClose={() => setShowEditor(false)} 
              email={email} 
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

          {/* Audit Log */}
          {email.auditLog && email.auditLog.length > 0 && (
            <div className="mt-8 pt-6 border-t border-black/10">
              <div className="px-4 lg:px-7">
                <div className="flex flex-col gap-1">
                  {/* Header */}
                  <div className="relative rounded-lg shrink-0 w-full">
                    <div className="flex flex-row items-center size-full">
                      <div className="box-border content-center flex flex-wrap gap-2 items-center px-1 py-2 relative w-full">
                        <div className="basis-0 content-stretch flex flex-col grow items-start justify-center min-h-px min-w-px relative rounded-lg shrink-0">
                          <p className="text-xs">Audit Log</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Log entries */}
                  {email.auditLog.map((entry) => (
                    <div key={entry.id} className="relative rounded-lg shrink-0 w-full">
                      <div className="flex flex-row items-center size-full">
                        <div className="box-border content-center flex flex-wrap gap-2 items-center p-2 relative w-full">
                          <div className="content-stretch flex flex-col items-start justify-center relative rounded-lg shrink-0">
                            <div className="text-xs">
                              <p className="mb-0">{entry.timestamp}</p>
                              <p>{entry.details}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Notes Dialog */}
      <Dialog open={showNotesDialog} onOpenChange={setShowNotesDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <StickyNote className="w-5 h-5 text-[#1990ff]" />
              Case Notes
              {email?.notes && email.notes.length > 0 && (
                <span className="text-sm text-[#7f7f7f] font-normal">
                  ({email.notes.length} {email.notes.length === 1 ? 'note' : 'notes'})
                </span>
              )}
            </DialogTitle>
            <DialogDescription className="sr-only">
              View and add case notes for this email
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 overflow-y-auto flex-1 pr-2">
            {/* Existing Notes */}
            {email?.notes && email.notes.length > 0 ? (
              <div className="space-y-4">
                {email.notes.map((note) => (
                  <div 
                    key={note.id} 
                    className="bg-[#f8fbff] border border-[#e0e7ff] rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <UserCircle className="w-5 h-5 text-[#1990ff]" />
                        <div>
                          <p className="font-medium text-sm">{note.author}</p>
                          <p className="text-xs text-[#7f7f7f]">{note.authorRole}</p>
                        </div>
                      </div>
                      <span className="text-xs text-[#7f7f7f]">{note.timestamp}</span>
                    </div>
                    <p className="text-sm text-[#2e2c34] whitespace-pre-wrap">{note.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-[#7f7f7f]">
                <StickyNote className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No notes yet. Add the first note below.</p>
              </div>
            )}

            {/* Add New Note */}
            <div className="border-t pt-4 mt-4">
              <label className="block text-sm font-medium mb-2">Add New Note</label>
              <Textarea
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
                placeholder="Enter case notes or next steps here..."
                className="min-h-[100px] mb-3"
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowNotesDialog(false);
                    setNewNoteContent('');
                  }}
                >
                  Close
                </Button>
                <Button
                  onClick={handleAddNote}
                  disabled={!newNoteContent.trim()}
                  className="bg-[#1990ff] hover:bg-[#0077e6]"
                >
                  Add Note
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Todo Checklist Dialog */}
      <Dialog open={showTodoDialog} onOpenChange={setShowTodoDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-[#1990ff]" />
              Case To-Do List
              {email?.todos && email.todos.length > 0 && (
                <span className="text-sm text-[#7f7f7f] font-normal">
                  ({email.todos.filter(t => !t.completed).length} incomplete, {email.todos.filter(t => t.completed).length} complete)
                </span>
              )}
            </DialogTitle>
            <DialogDescription className="sr-only">
              Manage to-do items for this case
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 overflow-y-auto flex-1 pr-2">
            {/* Existing Todos */}
            {email?.todos && email.todos.length > 0 ? (
              <div className="space-y-3">
                {/* Incomplete Todos */}
                {email.todos.filter(todo => !todo.completed).length > 0 && (
                  <div className="space-y-3">
                    {email.todos.filter(todo => !todo.completed).map((todo) => (
                      <div 
                        key={todo.id} 
                        className="bg-white border border-[#e0e7ff] rounded-lg p-4 hover:shadow-sm transition-shadow"
                      >
                        <div className="flex items-start gap-3">
                          <Checkbox
                            checked={todo.completed}
                            onCheckedChange={() => handleToggleTodo(todo.id)}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <p className="text-sm text-[#2e2c34]">{todo.content}</p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-[#7f7f7f]">
                              <div className="flex items-center gap-1">
                                <UserCircle className="w-3.5 h-3.5" />
                                <span>Created by {todo.createdBy}</span>
                              </div>
                              {todo.assignedTo && (
                                <div className="flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 bg-[#14ba6d] rounded-full"></span>
                                  <span className="text-[#14ba6d]">Assigned to {todo.assignedTo}</span>
                                </div>
                              )}
                              <span>{todo.createdAt}</span>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteTodo(todo.id)}
                            className="p-1.5 hover:bg-red-50 rounded-lg transition-colors group"
                          >
                            <X className="w-4 h-4 text-[#7f7f7f] group-hover:text-red-600" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Completed Todos */}
                {email.todos.filter(todo => todo.completed).length > 0 && (
                  <div className="space-y-3 mt-6">
                    <div className="flex items-center gap-2">
                      <div className="h-px bg-gray-200 flex-1"></div>
                      <span className="text-xs text-[#7f7f7f]">Completed</span>
                      <div className="h-px bg-gray-200 flex-1"></div>
                    </div>
                    {email.todos.filter(todo => todo.completed).map((todo) => (
                      <div 
                        key={todo.id} 
                        className="bg-[#f8f9fa] border border-[#e9ecef] rounded-lg p-4 opacity-75"
                      >
                        <div className="flex items-start gap-3">
                          <Checkbox
                            checked={todo.completed}
                            onCheckedChange={() => handleToggleTodo(todo.id)}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <p className="text-sm text-[#6c757d] line-through">{todo.content}</p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-[#7f7f7f]">
                              <div className="flex items-center gap-1">
                                <UserCircle className="w-3.5 h-3.5" />
                                <span>Created by {todo.createdBy}</span>
                              </div>
                              {todo.assignedTo && (
                                <div className="flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 bg-[#6c757d] rounded-full"></span>
                                  <span>Assigned to {todo.assignedTo}</span>
                                </div>
                              )}
                              {todo.completedAt && (
                                <span>Completed {todo.completedAt}</span>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteTodo(todo.id)}
                            className="p-1.5 hover:bg-red-50 rounded-lg transition-colors group"
                          >
                            <X className="w-4 h-4 text-[#7f7f7f] group-hover:text-red-600" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-[#7f7f7f]">
                <CheckSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No to-do items yet. Add your first task below.</p>
              </div>
            )}

            {/* Add New Todo */}
            <div className="border-t pt-4 mt-4">
              <label className="block text-sm font-medium mb-2">Add New Task</label>
              <Textarea
                value={newTodoContent}
                onChange={(e) => setNewTodoContent(e.target.value)}
                placeholder="Enter task description..."
                className="min-h-[80px] mb-3 focus-visible:shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none"
              />
              
              <div className="mb-3">
                <label className="block text-sm font-medium mb-2">Assign To (Optional)</label>
                <Select value={newTodoAssignee || 'none'} onValueChange={(value) => setNewTodoAssignee(value === 'none' ? null : value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select team member" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">
                      <span className="text-[#7f7f7f]">Unassigned</span>
                    </SelectItem>
                    {teamMembers.map((member) => (
                      <SelectItem key={member.id} value={member.name}>
                        <div className="flex items-center gap-2">
                          <UserCircle className="w-4 h-4" />
                          <div>
                            <span>{member.name}</span>
                            <span className="text-xs text-[#7f7f7f] ml-2">({member.role})</span>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowTodoDialog(false);
                    setNewTodoContent('');
                    setNewTodoAssignee(null);
                  }}
                >
                  Close
                </Button>
                <Button
                  onClick={handleAddTodo}
                  disabled={!newTodoContent.trim()}
                  className="bg-[#1990ff] hover:bg-[#0077e6]"
                >
                  Add Task
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}