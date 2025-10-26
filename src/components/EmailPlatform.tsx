import { useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { DashboardView } from "./DashboardView";
import { CaseManagementView } from "./CaseManagementView";
import { CaseDetailView } from "./CaseDetailView";
import { EmailList } from "./EmailList";
import { EmailViewer } from "./EmailViewer";
import { CampaignsView } from "./CampaignsView";
import { KnowledgeBaseView } from "./KnowledgeBaseView";
import { AnalyticsView } from "./AnalyticsView";
import { SettingsView } from "./SettingsView";
import { SentView, SentEmail } from "./SentView";
import { CampaignDraft } from "./CampaignBuilder";
import { SaveIndicator, useSaveIndicator } from "./SaveIndicator";
import {
  loadAllData,
  saveEmails,
  saveSentItems,
  saveCampaignDrafts,
  saveCompletedCampaigns,
} from "../utils/localStorage";

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action:
    | "ai_response_generated"
    | "email_sent"
    | "email_received";
  details: string;
}

export interface CaseNote {
  id: string;
  author: string;
  authorRole: string;
  timestamp: string;
  content: string;
}

export interface TodoItem {
  id: string;
  content: string;
  completed: boolean;
  assignedTo: string | null;
  createdBy: string;
  createdAt: string;
  completedAt?: string;
}

export interface Email {
  id: string;
  sender: string;
  email: string;
  subject: string;
  preview: string;
  date: string;
  time: string;
  unread: boolean;
  hasAttachment?: boolean;
  fullMessage: string;
  attachment?: string;
  thread?: ThreadMessage[];
  inboxAddress?: string;
  assignedTo?: string | null;
  auditLog?: AuditLogEntry[];
  notes?: CaseNote[];
  todos?: TodoItem[];
  status?: 'Needs Attention' | 'In Progress' | 'On Hold' | 'Resolved' | null;
  caseNumber?: string;
}

export interface ThreadMessage {
  id: string;
  sender: string;
  email: string;
  date: string;
  time: string;
  message: string;
  isAI?: boolean;
}

const mockEmails: Email[] = [
  {
    id: "1",
    sender: "Brittany James",
    email: "bjames@university.edu",
    subject: "FAFSA Submitted – Next Steps?",
    preview:
      "Hi, I just submitted my FAFSA for the upcoming school year...",
    date: "Today",
    time: "3:13 PM",
    unread: true,
    inboxAddress: "pthiara@university.edu",
    fullMessage:
      "Hi, I just submitted my FAFSA for the upcoming school year. I am considering taking out a PARENT PLUS Loan, how does that work?",
    assignedTo: "Puneet Thiara",
    status: "In Progress",
    caseNumber: "4829-917",
    notes: [
      {
        id: "note-1-1",
        author: "Puneet Thiara",
        authorRole: "Financial Aid Counselor",
        timestamp: "October 1, 2025 3:30 PM",
        content: "Student is interested in PARENT PLUS Loan for spring semester. Need to follow up with loan application process details.",
      },
    ],
    todos: [
      {
        id: "todo-1-1",
        content: "Send PARENT PLUS Loan application instructions",
        completed: false,
        assignedTo: "Puneet Thiara",
        createdBy: "Puneet Thiara",
        createdAt: "2025-10-01T15:30:00Z",
      },
      {
        id: "todo-1-2",
        content: "Schedule follow-up call with student",
        completed: false,
        assignedTo: "Puneet Thiara",
        createdBy: "Puneet Thiara",
        createdAt: "2025-10-01T15:30:00Z",
      },
    ],
    auditLog: [
      {
        id: "audit-1-1",
        timestamp: "October 1, 2025 3:13 PM",
        action: "email_received",
        details:
          "bjames@university.edu sent an email to pthiara@university.edu.",
      },
    ],
    thread: [
      {
        id: "t1-1",
        sender: "Brittany James",
        email: "bjames@university.edu",
        date: "September 9, 2025",
        time: "2:00PM",
        message:
          "Hi, I just submitted my FAFSA for the upcoming school year. I am considering taking out a PARENT PLUS Loan, how does that work?",
      },
      {
        id: "t1-2",
        sender: "Puneet Thiara",
        email: "pthiara@university.edu",
        date: "September 9, 2025",
        time: "2:16PM",
        message:
          "Hi Brittany, thank you for taking the right steps to gather all your documents for the upcoming FAFSA. Are you seeking PARENT PLUS Loan for this semester?",
      },
      {
        id: "t1-3",
        sender: "Brittany James",
        email: "bjames@university.edu",
        date: "September 9, 2025",
        time: "3:13PM",
        message:
          "Hello, thank you for responding to my email. I spoke to my parents and I think I will most likely need the loan in the spring semester.",
      },
    ],
  },
  {
    id: "2",
    sender: "Reggie Jackson",
    email: "rjackson@university.edu",
    subject: "Loan Disbursement Date Question",
    preview:
      "Hello, I wanted to check when the loan funds will be...",
    date: "Today",
    time: "1:45 PM",
    unread: true,
    inboxAddress: "financialaid@university.edu",
    assignedTo: "Puneet Thiara",
    status: "On Hold",
    caseNumber: "3918-846",
    notes: [
      {
        id: "note-2-1",
        author: "Puneet Thiara",
        authorRole: "Financial Aid Counselor",
        timestamp: "October 1, 2025 2:00 PM",
        content: "Waiting for loan processing department to confirm disbursement date. Student has completed all required documents.",
      },
    ],
    todos: [
      {
        id: "todo-2-1",
        content: "Check with loan processing team on disbursement timeline",
        completed: false,
        assignedTo: "Sarah Johnson",
        createdBy: "Puneet Thiara",
        createdAt: "2025-10-01T14:00:00Z",
      },
    ],
    fullMessage:
      "Hello, I wanted to check when the loan funds will be disbursed to my account. I need to pay my tuition by next week.",
    auditLog: [
      {
        id: "audit-2-1",
        timestamp: "October 1, 2025 1:45 PM",
        action: "email_received",
        details:
          "rjackson@university.edu sent an email to financialaid@university.edu.",
      },
    ],
  },
  {
    id: "3",
    sender: "Maria Garcia",
    email: "mgarcia@university.edu",
    subject: "FAFSA Verification Documents",
    preview:
      "Hi, I received a notification that I need to submit verification...",
    date: "Yesterday",
    time: "4:30 PM",
    unread: false,
    hasAttachment: true,
    attachment: "Verification_Form_2025.pdf",
    inboxAddress: "pthiara@university.edu",
    assignedTo: "Puneet Thiara",
    status: "Resolved",
    caseNumber: "2759-904",
    notes: [
      {
        id: "note-3-1",
        author: "Puneet Thiara",
        authorRole: "Financial Aid Counselor",
        timestamp: "September 30, 2025 4:35 PM",
        content: "Provided student with complete list of required verification documents. Student confirmed they have all documents and will upload by end of week.",
      },
      {
        id: "note-3-2",
        author: "Puneet Thiara",
        authorRole: "Financial Aid Counselor",
        timestamp: "October 1, 2025 10:15 AM",
        content: "All documents received and verified. Case closed.",
      },
    ],
    todos: [
      {
        id: "todo-3-1",
        content: "Review uploaded verification documents",
        completed: true,
        assignedTo: "Puneet Thiara",
        createdBy: "Puneet Thiara",
        createdAt: "2025-09-30T16:35:00Z",
        completedAt: "2025-10-01T10:15:00Z",
      },
    ],
    fullMessage:
      "Hi, I received a notification that I need to submit verification documents for my FAFSA. Can you please let me know which specific documents I need to upload?",
    auditLog: [
      {
        id: "audit-3-1",
        timestamp: "September 30, 2025 4:30 pm",
        action: "email_received",
        details:
          "mgarcia@university.edu sent an email to pthiara@university.edu.",
      },
      {
        id: "audit-3-2",
        timestamp: "September 30, 2025 4:32 pm",
        action: "ai_response_generated",
        details: "AI suggested response available for review.",
      },
      {
        id: "audit-3-3",
        timestamp: "September 30, 2025 4:35 pm",
        action: "email_sent",
        details:
          "pthiara@university.edu sent an email to mgarcia@university.edu.",
      },
    ],
  },
  {
    id: "4",
    sender: "James Wilson",
    email: "jwilson@university.edu",
    subject: "Scholarship Application Status",
    preview:
      "Good afternoon, I submitted my scholarship application last month...",
    date: "Yesterday",
    time: "2:15 PM",
    unread: false,
    inboxAddress: "financialaid@university.edu",
    fullMessage:
      "Good afternoon, I submitted my scholarship application last month and I was wondering if you could provide an update on the status?",
    assignedTo: "Sarah Johnson",
    status: "In Progress",
    caseNumber: "5683-329",
    notes: [
      {
        id: "note-4-1",
        author: "Sarah Johnson",
        authorRole: "Scholarship Coordinator",
        timestamp: "October 1, 2025 2:30 PM",
        content: "Application is under review by scholarship committee. Student has strong academic record with 3.8 GPA.",
      },
    ],
    todos: [
      {
        id: "todo-4-1",
        content: "Send committee decision to student by end of week",
        completed: false,
        assignedTo: "Sarah Johnson",
        createdBy: "Sarah Johnson",
        createdAt: "2025-10-01T14:30:00Z",
      },
    ],
  },
  {
    id: "5",
    sender: "Lisa Anderson",
    email: "landerson@university.edu",
    subject: "Work-Study Program Inquiry",
    preview:
      "Hello, I am interested in applying for the work-study program...",
    date: "Sep 8",
    time: "11:20 AM",
    unread: false,
    inboxAddress: "pthiara@university.edu",
    fullMessage:
      "Hello, I am interested in applying for the work-study program for the upcoming semester. Could you provide information about the application process and available positions?",
    assignedTo: "Puneet Thiara",
    status: "Resolved",
    caseNumber: "1946-672",
    notes: [
      {
        id: "note-5-1",
        author: "Puneet Thiara",
        authorRole: "Financial Aid Counselor",
        timestamp: "September 8, 2025 11:45 AM",
        content: "Provided student with work-study application portal link and list of available positions in library and student center.",
      },
      {
        id: "note-5-2",
        author: "Puneet Thiara",
        authorRole: "Financial Aid Counselor",
        timestamp: "September 10, 2025 9:15 AM",
        content: "Student confirmed application submitted. Case closed.",
      },
    ],
    todos: [
      {
        id: "todo-5-1",
        content: "Send work-study application instructions",
        completed: true,
        assignedTo: "Puneet Thiara",
        createdBy: "Puneet Thiara",
        createdAt: "2025-09-08T11:30:00Z",
        completedAt: "2025-09-08T11:45:00Z",
      },
    ],
  },
  {
    id: "6",
    sender: "Michael Brown",
    email: "mbrown@university.edu",
    subject: "Appeal for Additional Financial Aid",
    preview:
      "Dear Financial Aid Office, I would like to submit an appeal...",
    date: "Sep 7",
    time: "3:45 PM",
    unread: false,
    inboxAddress: "financialaid@university.edu",
    fullMessage:
      "Dear Financial Aid Office, I would like to submit an appeal for additional financial aid due to a change in my family's financial circumstances. What is the process for filing an appeal?",
    assignedTo: "Sarah Johnson",
    status: "On Hold",
    caseNumber: "7238-851",
    notes: [
      {
        id: "note-6-1",
        author: "Sarah Johnson",
        authorRole: "Scholarship Coordinator",
        timestamp: "September 7, 2025 4:00 PM",
        content: "Sent appeal form and documentation requirements to student. Waiting for completed appeal package.",
      },
    ],
    todos: [
      {
        id: "todo-6-1",
        content: "Review appeal documents once submitted",
        completed: false,
        assignedTo: "Sarah Johnson",
        createdBy: "Sarah Johnson",
        createdAt: "2025-09-07T16:00:00Z",
      },
      {
        id: "todo-6-2",
        content: "Follow up with student if no response by September 20",
        completed: false,
        assignedTo: "Sarah Johnson",
        createdBy: "Sarah Johnson",
        createdAt: "2025-09-07T16:00:00Z",
      },
    ],
  },
  {
    id: "7",
    sender: "Jennifer Taylor",
    email: "jtaylor@university.edu",
    subject: "Graduate PLUS Loan Questions",
    preview:
      "Hi, I am a graduate student and I have questions about...",
    date: "Sep 6",
    time: "10:00 AM",
    unread: false,
    inboxAddress: "pthiara@university.edu",
    fullMessage:
      "Hi, I am a graduate student and I have questions about the Graduate PLUS Loan program. What are the eligibility requirements and interest rates?",
    assignedTo: "Sarah Johnson",
    status: "In Progress",
    caseNumber: "6472-293",
    notes: [
      {
        id: "note-7-1",
        author: "Sarah Johnson",
        authorRole: "Scholarship Coordinator",
        timestamp: "September 6, 2025 10:30 AM",
        content: "Graduate student inquiring about PLUS loan options. Confirmed enrollment status and provided loan application overview.",
      },
    ],
    todos: [
      {
        id: "todo-7-1",
        content: "Send Graduate PLUS Loan rate sheet and application guide",
        completed: false,
        assignedTo: "Sarah Johnson",
        createdBy: "Sarah Johnson",
        createdAt: "2025-09-06T10:30:00Z",
      },
      {
        id: "todo-7-2",
        content: "Schedule loan counseling session",
        completed: false,
        assignedTo: "Sarah Johnson",
        createdBy: "Sarah Johnson",
        createdAt: "2025-09-06T10:30:00Z",
      },
    ],
  },
  {
    id: "8",
    sender: "Robert Martinez",
    email: "rmartinez@university.edu",
    subject: "Summer Session Financial Aid",
    preview:
      "Hello, I plan to take courses during the summer session...",
    date: "Sep 5",
    time: "1:30 PM",
    unread: false,
    inboxAddress: "financialaid@university.edu",
    fullMessage:
      "Hello, I plan to take courses during the summer session. Is financial aid available for summer courses, and how do I apply?",
    assignedTo: "Puneet Thiara",
    status: "In Progress",
    caseNumber: "5127-738",
    notes: [
      {
        id: "note-8-1",
        author: "Puneet Thiara",
        authorRole: "Financial Aid Counselor",
        timestamp: "September 5, 2025 2:00 PM",
        content: "Student is eligible for summer aid. Need to verify enrollment status and credit hours for summer term.",
      },
    ],
    todos: [
      {
        id: "todo-8-1",
        content: "Verify student enrollment for summer session",
        completed: false,
        assignedTo: "Puneet Thiara",
        createdBy: "Puneet Thiara",
        createdAt: "2025-09-05T14:00:00Z",
      },
      {
        id: "todo-8-2",
        content: "Calculate summer aid package eligibility",
        completed: false,
        assignedTo: "Puneet Thiara",
        createdBy: "Puneet Thiara",
        createdAt: "2025-09-05T14:00:00Z",
      },
    ],
  },
  {
    id: "9",
    sender: "Sarah Johnson",
    email: "sjohnson@university.edu",
    subject: "Direct Deposit Setup",
    preview:
      "Hi, I need help setting up direct deposit for my financial aid refund...",
    date: "Sep 4",
    time: "9:15 AM",
    unread: false,
    inboxAddress: "pthiara@university.edu",
    fullMessage:
      "Hi, I need help setting up direct deposit for my financial aid refund. Where can I update my banking information?",
    assignedTo: "Puneet Thiara",
    status: "Resolved",
    caseNumber: "8294-415",
    notes: [
      {
        id: "note-9-1",
        author: "Puneet Thiara",
        authorRole: "Financial Aid Counselor",
        timestamp: "September 4, 2025 9:30 AM",
        content: "Walked student through direct deposit setup process in student portal. Student successfully added bank account information.",
      },
      {
        id: "note-9-2",
        author: "Puneet Thiara",
        authorRole: "Financial Aid Counselor",
        timestamp: "September 4, 2025 9:45 AM",
        content: "Verified account setup. Student will receive refund via direct deposit in 3-5 business days. Case resolved.",
      },
    ],
    todos: [
      {
        id: "todo-9-1",
        content: "Send direct deposit confirmation email",
        completed: true,
        assignedTo: "Puneet Thiara",
        createdBy: "Puneet Thiara",
        createdAt: "2025-09-04T09:30:00Z",
        completedAt: "2025-09-04T09:45:00Z",
      },
    ],
  },
  {
    id: "10",
    sender: "David Lee",
    email: "dlee@university.edu",
    subject: "Dependency Status Question",
    preview:
      "Dear Financial Aid Team, I have a question about my dependency status...",
    date: "Aug 15",
    time: "4:00 PM",
    unread: false,
    inboxAddress: "financialaid@university.edu",
    fullMessage:
      "Dear Financial Aid Team, I have a question about my dependency status on the FAFSA. I believe I should be considered independent, but I was marked as dependent. How can I appeal this?",
    assignedTo: "Puneet Thiara",
    status: "On Hold",
    caseNumber: "3456-687",
    notes: [
      {
        id: "note-10-1",
        author: "Puneet Thiara",
        authorRole: "Financial Aid Counselor",
        timestamp: "August 15, 2025 4:30 PM",
        content: "Student requesting dependency override. Reviewed criteria for independent status - student does not meet standard criteria (age 24, married, etc.).",
      },
      {
        id: "note-10-2",
        author: "Puneet Thiara",
        authorRole: "Financial Aid Counselor",
        timestamp: "August 16, 2025 10:00 AM",
        content: "Sent dependency override appeal form and documentation requirements. Student needs to provide supporting documentation from third party (counselor, clergy, social worker).",
      },
    ],
    todos: [
      {
        id: "todo-10-1",
        content: "Review dependency override documentation when submitted",
        completed: false,
        assignedTo: "Puneet Thiara",
        createdBy: "Puneet Thiara",
        createdAt: "2025-08-15T16:30:00Z",
      },
      {
        id: "todo-10-2",
        content: "Follow up if no documents received by September 1",
        completed: true,
        assignedTo: "Puneet Thiara",
        createdBy: "Puneet Thiara",
        createdAt: "2025-08-15T16:30:00Z",
        completedAt: "2025-09-01T14:00:00Z",
      },
    ],
  },
  {
    id: "11",
    sender: "Ashley White",
    email: "awhite@university.edu",
    subject: "Pell Grant Eligibility",
    preview:
      "Hello, I wanted to inquire about my eligibility for the Pell Grant...",
    date: "Aug 12",
    time: "11:45 AM",
    unread: false,
    inboxAddress: "pthiara@university.edu",
    fullMessage:
      "Hello, I wanted to inquire about my eligibility for the Pell Grant. My EFC was calculated at 5500, does that qualify me for any grant aid?",
    assignedTo: "Puneet Thiara",
    status: "Resolved",
    caseNumber: "9012-234",
    notes: [
      {
        id: "note-11-1",
        author: "Puneet Thiara",
        authorRole: "Financial Aid Counselor",
        timestamp: "August 12, 2025 12:00 PM",
        content: "Student asking about Pell Grant eligibility with EFC of 5500. EFC is above Pell threshold but student qualifies for partial SEOG grant.",
      },
      {
        id: "note-11-2",
        author: "Puneet Thiara",
        authorRole: "Financial Aid Counselor",
        timestamp: "August 12, 2025 2:15 PM",
        content: "Explained Pell Grant eligibility criteria and reviewed complete aid package including state grants and institutional aid. Student satisfied with response.",
      },
    ],
    todos: [
      {
        id: "todo-11-1",
        content: "Send detailed breakdown of financial aid package",
        completed: true,
        assignedTo: "Puneet Thiara",
        createdBy: "Puneet Thiara",
        createdAt: "2025-08-12T12:00:00Z",
        completedAt: "2025-08-12T14:15:00Z",
      },
    ],
  },
  {
    id: "12",
    sender: "Marcus Thompson",
    email: "mthompson@university.edu",
    subject: "Appeal Deadline Extension Request",
    preview:
      "Dear Financial Aid Office, I am in the process of submitting an appeal...",
    date: "Aug 9",
    time: "9:30 AM",
    unread: false,
    inboxAddress: "financialaid@university.edu",
    fullMessage:
      "Dear Financial Aid Office, I am in the process of submitting an appeal for additional aid consideration, but I need more time to gather the required documentation. Is it possible to request an extension on the deadline?",
    assignedTo: "Sarah Johnson",
    status: "In Progress",
    caseNumber: "7564-432",
    notes: [
      {
        id: "note-12-1",
        author: "Sarah Johnson",
        authorRole: "Scholarship Coordinator",
        timestamp: "August 9, 2025 10:00 AM",
        content: "Student requesting extension on appeal deadline. Original deadline is August 20. Granted 2-week extension to September 3.",
      },
      {
        id: "note-12-2",
        author: "Sarah Johnson",
        authorRole: "Scholarship Coordinator",
        timestamp: "August 9, 2025 10:15 AM",
        content: "Sent confirmation email with new deadline and reminder of required documents: income documentation, special circumstances letter, supporting statements.",
      },
    ],
    todos: [
      {
        id: "todo-12-1",
        content: "Monitor for appeal submission by September 3",
        completed: false,
        assignedTo: "Sarah Johnson",
        createdBy: "Sarah Johnson",
        createdAt: "2025-08-09T10:15:00Z",
      },
      {
        id: "todo-12-2",
        content: "Send reminder email one week before new deadline",
        completed: false,
        assignedTo: "Sarah Johnson",
        createdBy: "Sarah Johnson",
        createdAt: "2025-08-09T10:15:00Z",
      },
    ],
  },
  {
    id: "13",
    sender: "Emily Rodriguez",
    email: "erodriguez@university.edu",
    subject: "Understanding my Financial Aid Package",
    preview:
      "Hello, I recently received my financial aid award letter and have some questions...",
    date: "Aug 8",
    time: "2:15 PM",
    unread: false,
    inboxAddress: "pthiara@university.edu",
    fullMessage:
      "Hello, I recently received my financial aid award letter and have some questions about the difference between grants, scholarships, and loans. Could someone help me understand what I need to pay back?",
    assignedTo: "Puneet Thiara",
    status: "In Progress",
    caseNumber: "6238-814",
    notes: [
      {
        id: "note-13-1",
        author: "Puneet Thiara",
        authorRole: "Financial Aid Counselor",
        timestamp: "August 8, 2025 2:45 PM",
        content: "First-year student needs guidance on understanding award letter. Scheduled 30-minute counseling appointment to review package breakdown.",
      },
    ],
    todos: [
      {
        id: "todo-13-1",
        content: "Prepare visual aid breakdown of grant vs loan types",
        completed: false,
        assignedTo: "Puneet Thiara",
        createdBy: "Puneet Thiara",
        createdAt: "2025-08-08T14:45:00Z",
      },
      {
        id: "todo-13-2",
        content: "Schedule follow-up meeting for August 15",
        completed: false,
        assignedTo: "Puneet Thiara",
        createdBy: "Puneet Thiara",
        createdAt: "2025-08-08T14:45:00Z",
      },
    ],
  },
  {
    id: "14",
    sender: "David Chen",
    email: "dchen@university.edu",
    subject: "Outside Scholarship Reporting",
    preview:
      "Hi, I just received an outside scholarship from a local organization...",
    date: "Aug 7",
    time: "4:00 PM",
    unread: false,
    hasAttachment: true,
    attachment: "Scholarship_Award_Letter.pdf",
    inboxAddress: "financialaid@university.edu",
    fullMessage:
      "Hi, I just received an outside scholarship from a local organization for $2,500. Do I need to report this to the financial aid office? Will this affect my current aid package?",
    assignedTo: "Sarah Johnson",
    status: "On Hold",
    caseNumber: "4185-592",
    notes: [
      {
        id: "note-14-1",
        author: "Sarah Johnson",
        authorRole: "Scholarship Coordinator",
        timestamp: "August 7, 2025 4:30 PM",
        content: "Student received $2,500 outside scholarship. Reviewed scholarship letter attachment. Need to adjust aid package to incorporate outside award.",
      },
      {
        id: "note-14-2",
        author: "Sarah Johnson",
        authorRole: "Scholarship Coordinator",
        timestamp: "August 8, 2025 9:00 AM",
        content: "Submitted package adjustment request to financial aid committee. Waiting for approval to reduce student loan amount and incorporate outside scholarship.",
      },
    ],
    todos: [
      {
        id: "todo-14-1",
        content: "Process aid package revision",
        completed: false,
        assignedTo: "Sarah Johnson",
        createdBy: "Sarah Johnson",
        createdAt: "2025-08-07T16:30:00Z",
      },
      {
        id: "todo-14-2",
        content: "Send revised award letter to student once approved",
        completed: false,
        assignedTo: "Sarah Johnson",
        createdBy: "Sarah Johnson",
        createdAt: "2025-08-07T16:30:00Z",
      },
      {
        id: "todo-14-3",
        content: "Verify scholarship disbursement with organization",
        completed: false,
        assignedTo: "Sarah Johnson",
        createdBy: "Sarah Johnson",
        createdAt: "2025-08-08T09:00:00Z",
      },
    ],
  },
  {
    id: "15",
    sender: "Thomas Anderson",
    email: "tanderson@university.edu",
    subject: "Missing Tax Return Documents",
    preview:
      "Hi, I received a notification that my tax return documents are missing...",
    date: "Today",
    time: "10:30 AM",
    unread: true,
    inboxAddress: "pthiara@university.edu",
    fullMessage:
      "Hi, I received a notification that my tax return documents are missing from my verification file. I thought I uploaded them last week. Can you help me figure out what happened?",
    assignedTo: "Puneet Thiara",
    status: "Needs Attention",
    caseNumber: "5829-914",
    notes: [
      {
        id: "note-15-1",
        author: "Puneet Thiara",
        authorRole: "Financial Aid Counselor",
        timestamp: "October 24, 2025 10:45 AM",
        content: "Student claims documents were uploaded last week but not showing in system. Need to check file upload history and verify which specific documents are missing.",
      },
    ],
    todos: [
      {
        id: "todo-15-1",
        content: "Check document upload system for student's submission history",
        completed: false,
        assignedTo: "Puneet Thiara",
        createdBy: "Puneet Thiara",
        createdAt: "2025-10-24T10:45:00Z",
      },
    ],
  },
  {
    id: "16",
    sender: "Jessica Martinez",
    email: "jmartinez@university.edu",
    subject: "Urgent: Tuition Payment Deadline",
    preview:
      "Hello, my tuition payment deadline is tomorrow and my financial aid hasn't been applied yet...",
    date: "Today",
    time: "9:15 AM",
    unread: true,
    inboxAddress: "financialaid@university.edu",
    fullMessage:
      "Hello, my tuition payment deadline is tomorrow and my financial aid hasn't been applied to my account yet. I'm worried about being dropped from my classes. Can you please help me urgently?",
    assignedTo: "Sarah Johnson",
    status: "Needs Attention",
    caseNumber: "7362-201",
    notes: [
      {
        id: "note-16-1",
        author: "Sarah Johnson",
        authorRole: "Scholarship Coordinator",
        timestamp: "October 24, 2025 9:30 AM",
        content: "URGENT: Student's aid package needs immediate disbursement. Checking with bursar's office on timeline. May need to contact registrar to prevent class drop.",
      },
    ],
    todos: [
      {
        id: "todo-16-1",
        content: "Contact bursar's office to expedite aid disbursement",
        completed: false,
        assignedTo: "Sarah Johnson",
        createdBy: "Sarah Johnson",
        createdAt: "2025-10-24T09:30:00Z",
      },
      {
        id: "todo-16-2",
        content: "Email registrar to request enrollment hold extension",
        completed: false,
        assignedTo: "Sarah Johnson",
        createdBy: "Sarah Johnson",
        createdAt: "2025-10-24T09:30:00Z",
      },
    ],
  },
  {
    id: "17",
    sender: "Brandon Williams",
    email: "bwilliams@university.edu",
    subject: "Book Voucher Program Question",
    preview:
      "Hi, I heard about a book voucher program for students with financial need...",
    date: "Sep 20",
    time: "3:00 PM",
    unread: false,
    inboxAddress: "pthiara@university.edu",
    fullMessage:
      "Hi, I heard about a book voucher program for students with financial need. How do I know if I qualify and what's the process to apply?",
    assignedTo: "Puneet Thiara",
    status: "In Progress",
    caseNumber: "4598-823",
    notes: [
      {
        id: "note-17-1",
        author: "Puneet Thiara",
        authorRole: "Financial Aid Counselor",
        timestamp: "September 20, 2025 3:30 PM",
        content: "Student inquiring about book voucher program. Verified Pell eligibility. Confirmed student qualifies for $600 book voucher.",
      },
    ],
    todos: [
      {
        id: "todo-17-1",
        content: "Send book voucher activation instructions",
        completed: false,
        assignedTo: "Puneet Thiara",
        createdBy: "Puneet Thiara",
        createdAt: "2025-09-20T15:30:00Z",
      },
    ],
  },
  {
    id: "18",
    sender: "Nicole Davis",
    email: "ndavis@university.edu",
    subject: "Entrance Counseling Completion",
    preview:
      "Hello, I completed the entrance counseling requirement online...",
    date: "Sep 18",
    time: "10:45 AM",
    unread: false,
    inboxAddress: "financialaid@university.edu",
    fullMessage:
      "Hello, I completed the entrance counseling requirement online but it's still showing as incomplete in my financial aid portal. Can you help verify this?",
    assignedTo: "Sarah Johnson",
    status: "In Progress",
    caseNumber: "8124-473",
    notes: [
      {
        id: "note-18-1",
        author: "Sarah Johnson",
        authorRole: "Scholarship Coordinator",
        timestamp: "September 18, 2025 11:00 AM",
        content: "Student completed entrance counseling but system not updated. Checking with IT to resolve sync issue with StudentAid.gov.",
      },
    ],
    todos: [
      {
        id: "todo-18-1",
        content: "Contact IT about portal sync issue",
        completed: false,
        assignedTo: "Sarah Johnson",
        createdBy: "Sarah Johnson",
        createdAt: "2025-09-18T11:00:00Z",
      },
      {
        id: "todo-18-2",
        content: "Manually update student record once verified",
        completed: false,
        assignedTo: "Sarah Johnson",
        createdBy: "Sarah Johnson",
        createdAt: "2025-09-18T11:00:00Z",
      },
    ],
  },
  {
    id: "19",
    sender: "Christopher Moore",
    email: "cmoore@university.edu",
    subject: "Refund Check Status",
    preview:
      "Hi, I was expecting a refund check last week but haven't received it yet...",
    date: "Sep 15",
    time: "2:30 PM",
    unread: false,
    inboxAddress: "pthiara@university.edu",
    fullMessage:
      "Hi, I was expecting a refund check last week but haven't received it yet. My aid has been disbursed according to the portal. Can you check on the status?",
    assignedTo: "Puneet Thiara",
    status: "Resolved",
    caseNumber: "3901-156",
    notes: [
      {
        id: "note-19-1",
        author: "Puneet Thiara",
        authorRole: "Financial Aid Counselor",
        timestamp: "September 15, 2025 2:45 PM",
        content: "Confirmed disbursement processed. Refund check mailed on September 10. Should arrive within 7-10 business days.",
      },
      {
        id: "note-19-2",
        author: "Puneet Thiara",
        authorRole: "Financial Aid Counselor",
        timestamp: "September 16, 2025 9:00 AM",
        content: "Student confirmed receipt of check. Case resolved.",
      },
    ],
    todos: [
      {
        id: "todo-19-1",
        content: "Verify disbursement with bursar's office",
        completed: true,
        assignedTo: "Puneet Thiara",
        createdBy: "Puneet Thiara",
        createdAt: "2025-09-15T14:45:00Z",
        completedAt: "2025-09-15T15:00:00Z",
      },
    ],
  },
  {
    id: "20",
    sender: "Amanda Taylor",
    email: "ataylor@university.edu",
    subject: "Satisfactory Academic Progress Appeal",
    preview:
      "Dear Financial Aid Office, I would like to submit an appeal for SAP...",
    date: "Sep 10",
    time: "11:00 AM",
    unread: false,
    inboxAddress: "financialaid@university.edu",
    fullMessage:
      "Dear Financial Aid Office, I would like to submit an appeal for SAP status. I had medical issues last semester that affected my grades. What documentation do I need to provide?",
    assignedTo: "Sarah Johnson",
    status: "Resolved",
    caseNumber: "6278-845",
    notes: [
      {
        id: "note-20-1",
        author: "Sarah Johnson",
        authorRole: "Scholarship Coordinator",
        timestamp: "September 10, 2025 11:30 AM",
        content: "SAP appeal request. Provided student with appeal form and documentation requirements (medical records, doctor's note, academic plan).",
      },
      {
        id: "note-20-2",
        author: "Sarah Johnson",
        authorRole: "Scholarship Coordinator",
        timestamp: "September 25, 2025 2:00 PM",
        content: "Appeal approved by committee. Student reinstated for financial aid eligibility. Academic progress plan in place.",
      },
    ],
    todos: [
      {
        id: "todo-20-1",
        content: "Review SAP appeal documentation",
        completed: true,
        assignedTo: "Sarah Johnson",
        createdBy: "Sarah Johnson",
        createdAt: "2025-09-10T11:30:00Z",
        completedAt: "2025-09-20T14:00:00Z",
      },
      {
        id: "todo-20-2",
        content: "Present appeal to committee",
        completed: true,
        assignedTo: "Sarah Johnson",
        createdBy: "Sarah Johnson",
        createdAt: "2025-09-10T11:30:00Z",
        completedAt: "2025-09-25T14:00:00Z",
      },
    ],
  },
  {
    id: "21",
    sender: "Kevin Martinez",
    email: "kmartinez@university.edu",
    subject: "Parent PLUS Loan Denial - Alternatives",
    preview:
      "Hello, my parent applied for a PLUS loan but was denied due to credit...",
    date: "Aug 25",
    time: "4:15 PM",
    unread: false,
    inboxAddress: "pthiara@university.edu",
    fullMessage:
      "Hello, my parent applied for a PLUS loan but was denied due to credit issues. What are my options now? Can I get additional student loans?",
    assignedTo: "Puneet Thiara",
    status: "Resolved",
    caseNumber: "2149-965",
    notes: [
      {
        id: "note-21-1",
        author: "Puneet Thiara",
        authorRole: "Financial Aid Counselor",
        timestamp: "August 25, 2025 4:30 PM",
        content: "Parent PLUS loan denied. Student eligible for additional $4,000 unsubsidized loan as independent student due to denial.",
      },
      {
        id: "note-21-2",
        author: "Puneet Thiara",
        authorRole: "Financial Aid Counselor",
        timestamp: "August 26, 2025 10:00 AM",
        content: "Processed loan increase. Updated award letter sent. Student accepted additional loan. Case resolved.",
      },
    ],
    todos: [
      {
        id: "todo-21-1",
        content: "Process additional unsubsidized loan eligibility",
        completed: true,
        assignedTo: "Puneet Thiara",
        createdBy: "Puneet Thiara",
        createdAt: "2025-08-25T16:30:00Z",
        completedAt: "2025-08-26T10:00:00Z",
      },
      {
        id: "todo-21-2",
        content: "Send revised award letter",
        completed: true,
        assignedTo: "Puneet Thiara",
        createdBy: "Puneet Thiara",
        createdAt: "2025-08-25T16:30:00Z",
        completedAt: "2025-08-26T10:00:00Z",
      },
    ],
  },
];

export interface CompletedCampaign {
  id: string;
  name: string;
  created: string;
  createdBy: string;
  completedDate: string;
  recipients: string[];
  subject: string;
}

const initialSentItems: SentEmail[] = [
  {
    id: "sent-1",
    type: "email",
    subject: "Re: FAFSA Deadline Question",
    recipient: "Sarah Martinez",
    recipientEmail: "smartinez@university.edu",
    sentDate: "September 30, 2025",
    sentTime: "2:45 PM",
    content:
      "Hi Sarah,\n\nThank you for reaching out regarding the FAFSA deadline. The priority deadline for the 2025-2026 academic year is February 15, 2026. However, we encourage you to submit your application as early as possible, as some aid programs are distributed on a first-come, first-served basis.\n\nIf you need assistance completing your FAFSA, please do not hesitate to schedule an appointment with our office. We offer walk-in hours Monday through Friday from 9 AM to 4 PM, or you can book a one-on-one session through our student portal.\n\nBest regards,\nFinancial Aid Office",
    attachments: [],
    aiReference: "AI-suggested response",
  },
  {
    id: "sent-2",
    type: "campaign",
    subject: "Important: Verification Documents Required",
    recipient: "All Selected Students",
    recipientEmail: "multiple@university.edu",
    recipientCount: 245,
    sentDate: "September 29, 2025",
    sentTime: "10:30 AM",
    content:
      "Dear Student,\n\nYour financial aid application has been selected for verification by the U.S. Department of Education. To complete this process, we need you to submit the following documents by October 15, 2025:\n\n• 2024 Federal Tax Return Transcript (or IRS Data Retrieval confirmation)\n• W-2 forms from all employers in 2024\n• Verification Worksheet (attached)\n\nYou can submit these documents through our secure document upload portal or bring them to our office in person during business hours.\n\nFailure to submit verification documents by the deadline may result in delays or cancellation of your financial aid package.\n\nIf you have any questions, please contact our office at financialaid@university.edu or call (555) 123-4567.\n\nSincerely,\nStudent Financial Services",
    attachments: ["Verification_Worksheet_2025.pdf"],
  },
  {
    id: "sent-3",
    type: "email",
    subject: "Re: Parent PLUS Loan Information",
    recipient: "Michael Johnson",
    recipientEmail: "mjohnson@university.edu",
    sentDate: "September 28, 2025",
    sentTime: "4:15 PM",
    content:
      "Hi Michael,\n\nThank you for your inquiry about Parent PLUS Loans. Here is what you need to know:\n\nThe Parent PLUS Loan is a federal loan that parents of dependent undergraduate students can use to help pay for college costs. Parents can borrow up to the full cost of attendance, minus any other financial aid received.\n\nKey points:\n• Interest rate: 9.08% (fixed) for 2025-2026\n• Origination fee: 4.228%\n• Credit check required\n• Repayment begins immediately, though deferment options are available\n\nTo apply, your parent should complete the Parent PLUS Loan application at studentaid.gov. The process typically takes 1-3 business days.\n\nPlease let me know if you have any other questions!\n\nBest,\nPuneet Thiara\nSenior Financial Aid Counselor",
    attachments: ["Parent_PLUS_Loan_Guide.pdf"],
    aiReference: "AI-suggested response",
  },
  {
    id: "sent-4",
    type: "email",
    subject: "Re: Scholarship Award Notification",
    recipient: "Amanda Chen",
    recipientEmail: "achen@university.edu",
    sentDate: "September 27, 2025",
    sentTime: "11:20 AM",
    content:
      "Dear Amanda,\n\nCongratulations! I am pleased to inform you that you have been awarded the Presidential Scholarship for the 2025-2026 academic year in the amount of $15,000.\n\nThis scholarship will be divided equally between the fall and spring semesters ($7,500 per semester) and will be applied directly to your student account. To maintain this scholarship, you must maintain a cumulative GPA of 3.5 or higher.\n\nYour updated financial aid package will be available in your student portal within 3-5 business days. If you have any questions about your award or how it affects your overall aid package, please do not hesitate to contact our office.\n\nOnce again, congratulations on this well-deserved recognition of your academic achievements!\n\nWarm regards,\nFinancial Aid Office",
    attachments: [],
  },
  {
    id: "sent-5",
    type: "campaign",
    subject: "Reminder: Complete Your Financial Aid To-Do List",
    recipient: "Incoming Freshmen",
    recipientEmail: "multiple@university.edu",
    recipientCount: 1834,
    sentDate: "September 25, 2025",
    sentTime: "9:00 AM",
    content:
      "Dear Incoming Student,\n\nWelcome to the University! We are excited to have you join our community this fall.\n\nTo ensure your financial aid is processed in time for the start of the semester, please complete the following items in your financial aid portal:\n\n1. Accept or decline your financial aid awards\n2. Complete entrance counseling (if you are a first-time borrower)\n3. Sign your Master Promissory Note (MPN)\n4. Submit any outstanding verification documents\n\nThese items should be completed by October 1, 2025, to avoid delays in disbursement.\n\nIf you need assistance, our office offers:\n• Virtual drop-in hours via Zoom: Monday-Friday, 1-3 PM\n• In-person appointments: Schedule through the student portal\n• Email support: financialaid@university.edu\n\nWe look forward to supporting you throughout your academic journey!\n\nBest regards,\nStudent Financial Services Team",
    attachments: [],
  },
  {
    id: "sent-6",
    type: "email",
    subject: "Re: Work-Study Position Questions",
    recipient: "David Park",
    recipientEmail: "dpark@university.edu",
    sentDate: "September 24, 2025",
    sentTime: "3:30 PM",
    content:
      "Hi David,\n\nThank you for your interest in the Federal Work-Study program! I am happy to answer your questions.\n\nYes, you are eligible for work-study based on your financial aid package. Your award is $2,500 for the academic year, which means you can earn up to that amount through work-study employment.\n\nTo find available positions:\n1. Visit the Career Services portal at careers.university.edu\n2. Filter by Work-Study positions\n3. Apply directly to positions that interest you\n\nMost positions pay $15-17 per hour, and you can typically work 10-15 hours per week. Your earnings are paid directly to you via paycheck (not applied to your student account).\n\nPopular departments include the library, student centers, academic departments, and administrative offices. I recommend applying early, as positions fill up quickly!\n\nLet me know if you have any other questions.\n\nBest,\nPuneet Thiara",
    attachments: [],
    aiReference: "AI-suggested response",
  },
];

interface EmailPlatformProps {
  onLogoClick?: () => void;
  initialKnowledgeBaseFiles?: File[];
  initialView?: 'home' | 'inbox';
}

export function EmailPlatform({
  onLogoClick,
  initialKnowledgeBaseFiles,
  initialView = 'home',
}: EmailPlatformProps = {}) {
  const [selectedEmailId, setSelectedEmailId] = useState<
    string | null
  >(null);
  const [activeView, setActiveView] = useState<
    | "home"
    | "inbox"
    | "sent"
    | "campaigns"
    | "knowledge"
    | "analytics"
    | "settings"
  >(initialView);
  const [draftCampaigns, setDraftCampaigns] = useState<
    CampaignDraft[]
  >([]);
  const [completedCampaigns, setCompletedCampaigns] = useState<
    CompletedCampaign[]
  >([]);
  const [sentItems, setSentItems] =
    useState<SentEmail[]>(initialSentItems);
  const [selectedInbox, setSelectedInbox] = useState<string>(
    "pthiara@university.edu",
  );
  const [emails, setEmails] = useState<Email[]>(mockEmails);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] =
    useState(false);
  const [showEmailViewer, setShowEmailViewer] = useState(false);
  const [settingsTab, setSettingsTab] = useState<
    string | undefined
  >(undefined);
  const [isLoadingOutlookEmails, setIsLoadingOutlookEmails] =
    useState(false);
  const [outlookConnected, setOutlookConnected] =
    useState(false);
  const [userId] = useState<string>(() => {
    // Get userId from session storage or use default
    return sessionStorage.getItem('userId') || 'default-user';
  });
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const saveIndicator = useSaveIndicator();

  // Load all data from localStorage on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        console.log(`Loading data for user: ${userId}`);
        const data = await loadAllData(userId);
        
        // Merge loaded emails with mock emails to preserve attachment data and add new mock emails
        if (data.emails && data.emails.length > 0) {
          // Merge loaded data with mock data, prioritizing attachment property from mockEmails
          const mergedEmails = data.emails.map(loadedEmail => {
            const mockEmail = mockEmails.find(m => m.id === loadedEmail.id);
            if (mockEmail && mockEmail.attachment) {
              return { ...loadedEmail, attachment: mockEmail.attachment };
            }
            return loadedEmail;
          });
          
          // Add any new mock emails that don't exist in loaded data
          const loadedEmailIds = new Set(data.emails.map(e => e.id));
          const newMockEmails = mockEmails.filter(m => !loadedEmailIds.has(m.id));
          
          setEmails([...mergedEmails, ...newMockEmails]);
        }
        if (data.sentItems && data.sentItems.length > 0) {
          setSentItems(data.sentItems);
        }
        if (data.campaignDrafts && data.campaignDrafts.length > 0) {
          setDraftCampaigns(data.campaignDrafts);
        }
        if (data.completedCampaigns && data.completedCampaigns.length > 0) {
          setCompletedCampaigns(data.completedCampaigns);
        }
        
        setIsDataLoaded(true);
        console.log('Data loaded successfully from localStorage');
      } catch (error) {
        console.error('Error loading data from localStorage:', error);
        setIsDataLoaded(true); // Continue with mock data
      }
    };
    
    loadData();
  }, [userId]);

  // Note: Outlook integration removed

  // Auto-save emails when they change
  useEffect(() => {
    if (isDataLoaded && emails.length > 0) {
      const timeoutId = setTimeout(async () => {
        try {
          saveIndicator.startSaving();
          await saveEmails(userId, emails);
          saveIndicator.finishSaving();
        } catch (error) {
          console.error('Error auto-saving emails:', error);
          saveIndicator.setSaveError('Failed to save emails');
        }
      }, 1000); // Debounce saves by 1 second
      
      return () => clearTimeout(timeoutId);
    }
  }, [emails, userId, isDataLoaded]);

  // Auto-save sent items when they change
  useEffect(() => {
    if (isDataLoaded && sentItems.length > 0) {
      const timeoutId = setTimeout(() => {
        saveSentItems(userId, sentItems).catch(error => {
          console.error('Error auto-saving sent items:', error);
        });
      }, 1000);
      
      return () => clearTimeout(timeoutId);
    }
  }, [sentItems, userId, isDataLoaded]);

  // Auto-save campaign drafts when they change
  useEffect(() => {
    if (isDataLoaded) {
      const timeoutId = setTimeout(() => {
        saveCampaignDrafts(userId, draftCampaigns).catch(error => {
          console.error('Error auto-saving campaign drafts:', error);
        });
      }, 1000);
      
      return () => clearTimeout(timeoutId);
    }
  }, [draftCampaigns, userId, isDataLoaded]);

  // Auto-save completed campaigns when they change
  useEffect(() => {
    if (isDataLoaded) {
      const timeoutId = setTimeout(() => {
        saveCompletedCampaigns(userId, completedCampaigns).catch(error => {
          console.error('Error auto-saving completed campaigns:', error);
        });
      }, 1000);
      
      return () => clearTimeout(timeoutId);
    }
  }, [completedCampaigns, userId, isDataLoaded]);

  // Outlook integration removed - using local data only

  const selectedEmail = emails.find(
    (email) => email.id === selectedEmailId,
  );
  const totalCount = emails.length;

  const handleSelectEmail = (emailId: string) => {
    setSelectedEmailId(emailId);
    // When selecting an email, update the selected address to match the email's address
    const email = emails.find((e) => e.id === emailId);
    if (email?.inboxAddress) {
      setSelectedInbox(email.inboxAddress);
    }
    // On mobile, show the email viewer when an email is selected
    setShowEmailViewer(true);
  };

  const handleBackToList = () => {
    setShowEmailViewer(false);
  };

  const handleAssignEmail = (
    emailId: string,
    assignTo: string | null,
  ) => {
    setEmails((prevEmails) =>
      prevEmails.map((email) =>
        email.id === emailId
          ? { 
              ...email, 
              assignedTo: assignTo,
              // Auto-set status to "In Progress" when assigning, clear when unassigning
              status: assignTo ? 'In Progress' : null
            }
          : email,
      ),
    );
  };

  const handleAddNote = (emailId: string, note: CaseNote) => {
    setEmails((prevEmails) =>
      prevEmails.map((email) =>
        email.id === emailId
          ? { ...email, notes: [...(email.notes || []), note] }
          : email,
      ),
    );
  };

  const handleAddTodo = (emailId: string, todo: TodoItem) => {
    setEmails((prevEmails) =>
      prevEmails.map((email) =>
        email.id === emailId
          ? { ...email, todos: [...(email.todos || []), todo] }
          : email,
      ),
    );
  };

  const handleToggleTodo = (emailId: string, todoId: string) => {
    setEmails((prevEmails) =>
      prevEmails.map((email) => {
        if (email.id === emailId && email.todos) {
          return {
            ...email,
            todos: email.todos.map((todo) =>
              todo.id === todoId
                ? {
                    ...todo,
                    completed: !todo.completed,
                    completedAt: !todo.completed
                      ? new Date().toLocaleString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: true,
                        })
                      : undefined,
                  }
                : todo
            ),
          };
        }
        return email;
      }),
    );
  };

  const handleDeleteTodo = (emailId: string, todoId: string) => {
    setEmails((prevEmails) =>
      prevEmails.map((email) => {
        if (email.id === emailId && email.todos) {
          return {
            ...email,
            todos: email.todos.filter((todo) => todo.id !== todoId),
          };
        }
        return email;
      }),
    );
  };

  const handleStatusChange = (
    emailId: string,
    status: 'Needs Attention' | 'In Progress' | 'On Hold' | 'Resolved',
  ) => {
    setEmails((prevEmails) =>
      prevEmails.map((email) =>
        email.id === emailId
          ? { ...email, status: status }
          : email,
      ),
    );
  };

  const handleCreateCase = (caseData: {
    emailId: string;
    assignedTo: string;
    notes: string;
    tasks: string[];
  }) => {
    const currentDate = new Date();
    const part1 = Math.floor(1000 + Math.random() * 9000);
    const part2 = Math.floor(100 + Math.random() * 900);
    const caseNumber = `${part1}-${part2}`;
    
    const initialNote: CaseNote | undefined = caseData.notes.trim() ? {
      id: `note-${caseData.emailId}-${Date.now()}`,
      author: caseData.assignedTo,
      authorRole: 'Financial Aid Counselor',
      timestamp: currentDate.toLocaleString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }),
      content: caseData.notes,
    } : undefined;

    const todos: TodoItem[] = caseData.tasks.map((task, index) => ({
      id: `todo-${caseData.emailId}-${Date.now()}-${index}`,
      content: task,
      completed: false,
      assignedTo: caseData.assignedTo,
      createdBy: caseData.assignedTo,
      createdAt: new Date().toISOString(),
    }));

    setEmails((prevEmails) =>
      prevEmails.map((email) =>
        email.id === caseData.emailId
          ? {
              ...email,
              caseNumber,
              assignedTo: caseData.assignedTo,
              status: 'Needs Attention',
              notes: initialNote ? [initialNote] : [],
              todos: todos.length > 0 ? todos : [],
            }
          : email,
      ),
    );
  };

  const handleDeleteCase = (caseId: string) => {
    // Remove case data from the email (convert back to regular email)
    setEmails((prevEmails) =>
      prevEmails.map((email) =>
        email.id === caseId
          ? {
              ...email,
              caseNumber: undefined,
              assignedTo: null,
              status: null,
              notes: [],
              todos: [],
            }
          : email,
      ),
    );
  };

  const handleDeleteEmail = (emailId: string) => {
    // Find the index of the email to delete
    const currentIndex = emails.findIndex(
      (e) => e.id === emailId,
    );

    // Remove the email from the list
    const updatedEmails = emails.filter(
      (e) => e.id !== emailId,
    );
    setEmails(updatedEmails);

    // Select the next email or clear selection
    if (updatedEmails.length > 0) {
      if (currentIndex < updatedEmails.length) {
        // Select the email that took the deleted email's position
        setSelectedEmailId(updatedEmails[currentIndex].id);
      } else {
        // We deleted the last email, select the new last email
        setSelectedEmailId(
          updatedEmails[updatedEmails.length - 1].id,
        );
      }
    } else {
      // No emails left
      setSelectedEmailId(null);
    }
  };

  const handleNavigateChange = (
    view:
      | "home"
      | "inbox"
      | "sent"
      | "campaigns"
      | "knowledge"
      | "analytics"
      | "settings",
    settingsTabParam?: string,
  ) => {
    setActiveView(view);
    // Set settings tab if provided
    if (view === "settings" && settingsTabParam) {
      setSettingsTab(settingsTabParam);
    } else {
      setSettingsTab(undefined);
    }
    // Close mobile sidebar when navigating
    setIsMobileSidebarOpen(false);
    // Reset to list view on mobile when changing views
    setShowEmailViewer(false);
  };

  const handleUpdateAuditLog = (
    emailId: string,
    entry: AuditLogEntry,
  ) => {
    setEmails((prevEmails) =>
      prevEmails.map((email) =>
        email.id === emailId
          ? {
              ...email,
              auditLog: [...(email.auditLog || []), entry],
            }
          : email,
      ),
    );
  };

  const handleSendEmail = (
    emailId: string,
    emailContent: string,
    attachments: string[],
  ) => {
    const email = emails.find((e) => e.id === emailId);
    if (!email) return;

    const now = new Date();
    const sentDate = now.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    const sentTime = now.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    // Add audit log entry for email sent
    const timestamp =
      now.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }) +
      " " +
      now
        .toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })
        .toLowerCase();

    handleUpdateAuditLog(emailId, {
      id: `audit-${emailId}-sent-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: timestamp,
      action: "email_sent",
      details: `${selectedInbox} sent an email to ${email.email}.`,
    });

    const newSentEmail: SentEmail = {
      id: `sent-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: "email",
      subject: `Re: ${email.subject}`,
      recipient: email.sender,
      recipientEmail: email.email,
      sentDate: sentDate,
      sentTime: sentTime,
      content: emailContent,
      attachments: attachments,
      aiReference: "AI-suggested response",
    };

    setSentItems((prev) => [newSentEmail, ...prev]);

    // Remove from cases after sending (with a small delay to show the audit log entry)
    setTimeout(() => {
      handleDeleteEmail(emailId);
    }, 500);
  };

  const handleNavigatePrevious = () => {
    const currentIndex = selectedEmailId
      ? emails.findIndex((e) => e.id === selectedEmailId)
      : -1;
    if (currentIndex > 0) {
      const prevEmail = emails[currentIndex - 1];
      setSelectedEmailId(prevEmail.id);
      if (prevEmail.inboxAddress) {
        setSelectedInbox(prevEmail.inboxAddress);
      }
    }
  };

  const handleNavigateNext = () => {
    const currentIndex = selectedEmailId
      ? emails.findIndex((e) => e.id === selectedEmailId)
      : -1;
    if (currentIndex >= 0 && currentIndex < emails.length - 1) {
      const nextEmail = emails[currentIndex + 1];
      setSelectedEmailId(nextEmail.id);
      if (nextEmail.inboxAddress) {
        setSelectedInbox(nextEmail.inboxAddress);
      }
    }
  };

  // Calculate if navigation is possible
  const currentEmailIndex = selectedEmailId
    ? emails.findIndex((e) => e.id === selectedEmailId)
    : -1;
  const canNavigatePrevious = currentEmailIndex > 0;
  const canNavigateNext =
    currentEmailIndex >= 0 &&
    currentEmailIndex < emails.length - 1;

  const handleSaveDraft = (draft: CampaignDraft) => {
    setDraftCampaigns((prev) => {
      const existingIndex = prev.findIndex(
        (d) => d.id === draft.id,
      );
      if (existingIndex >= 0) {
        // Update existing draft
        const updated = [...prev];
        updated[existingIndex] = draft;
        return updated;
      } else {
        // Add new draft
        return [...prev, draft];
      }
    });
  };

  const handleDeleteCampaigns = (campaignIds: string[]) => {
    setDraftCampaigns((prev) =>
      prev.filter((draft) => !campaignIds.includes(draft.id)),
    );
    setCompletedCampaigns((prev) =>
      prev.filter(
        (campaign) => !campaignIds.includes(campaign.id),
      ),
    );
  };

  const handleCompleteCampaign = (
    draft: CampaignDraft,
    emailContent: string,
    attachments: string[],
  ) => {
    const now = new Date();
    const sentDate = now.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    const sentTime = now.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    // Create completed campaign
    const completedCampaign: CompletedCampaign = {
      id: draft.id,
      name: draft.name,
      created: draft.created,
      createdBy: draft.createdBy,
      completedDate: sentDate,
      recipients: draft.recipients,
      subject: draft.subject,
    };

    // Create sent item
    const sentCampaign: SentEmail = {
      id: `sent-campaign-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: "campaign",
      subject: draft.subject,
      recipient: "Multiple Recipients",
      recipientEmail: "campaign@university.edu",
      recipientCount: draft.recipients.length,
      sentDate: sentDate,
      sentTime: sentTime,
      content: emailContent,
      attachments: attachments,
    };

    // Update state
    setCompletedCampaigns((prev) => [
      completedCampaign,
      ...prev,
    ]);
    setSentItems((prev) => [sentCampaign, ...prev]);
    setDraftCampaigns((prev) =>
      prev.filter((d) => d.id !== draft.id),
    );
  };

  return (
    <div className="flex h-screen w-full bg-white overflow-hidden">
      <Sidebar
        activeView={activeView}
        onNavigate={handleNavigateChange}
        totalCount={totalCount}
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={() => setIsMobileSidebarOpen(false)}
        onLogoClick={onLogoClick}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {activeView === "home" ? (
        selectedCaseId ? (
          <CaseDetailView
            caseData={emails.find(e => e.id === selectedCaseId)!}
            onBack={() => setSelectedCaseId(null)}
            onUpdateCase={(id, updates) => {
              setEmails(prevEmails =>
                prevEmails.map(email =>
                  email.id === id ? { ...email, ...updates } : email
                )
              );
            }}
            onNavigate={handleNavigateChange}
            currentUser="Puneet Thiara"
          />
        ) : (
          <CaseManagementView
            emails={emails}
            onUpdateEmail={(id, updates) => {
              setEmails(prevEmails =>
                prevEmails.map(email =>
                  email.id === id ? { ...email, ...updates } : email
                )
              );
            }}
            onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
            onNavigate={handleNavigateChange}
            currentUser="Puneet Thiara"
            onViewCaseDetail={(caseId) => setSelectedCaseId(caseId)}
            onCreateCase={handleCreateCase}
            onDeleteCase={handleDeleteCase}
          />
        )
      ) : activeView === "inbox" ? (
        <>
          {/* Mobile: Show email list OR viewer */}
          <div
            className={`lg:hidden ${showEmailViewer ? "hidden" : "flex"} flex-1`}
          >
            <EmailList
              emails={emails}
              selectedEmailId={selectedEmailId}
              onSelectEmail={handleSelectEmail}
              onInboxChange={setSelectedInbox}
              onOpenMobileMenu={() =>
                setIsMobileSidebarOpen(true)
              }
              onRefreshEmails={() => {}}
              isRefreshing={false}
              hideAssignedTag={true}
            />
          </div>
          <div
            className={`lg:hidden ${showEmailViewer ? "flex" : "hidden"} flex-1`}
          >
            <EmailViewer
              email={selectedEmail}
              onSendEmail={handleSendEmail}
              selectedInbox={selectedInbox}
              onAssignEmail={handleAssignEmail}
              onDeleteEmail={handleDeleteEmail}
              onNavigatePrevious={handleNavigatePrevious}
              onNavigateNext={handleNavigateNext}
              canNavigatePrevious={canNavigatePrevious}
              canNavigateNext={canNavigateNext}
              onBackToList={handleBackToList}
              onUpdateAuditLog={handleUpdateAuditLog}
              onAddNote={handleAddNote}
              onStatusChange={handleStatusChange}
              isInboxMode={true}
            />
          </div>

          {/* Desktop: Show both side by side */}
          <div className="hidden lg:flex flex-1">
            <EmailList
              emails={emails}
              selectedEmailId={selectedEmailId}
              onSelectEmail={handleSelectEmail}
              onInboxChange={setSelectedInbox}
              onRefreshEmails={() => {}}
              isRefreshing={false}
              hideAssignedTag={true}
            />
            <EmailViewer
              email={selectedEmail}
              onSendEmail={handleSendEmail}
              selectedInbox={selectedInbox}
              onAssignEmail={handleAssignEmail}
              onDeleteEmail={handleDeleteEmail}
              onNavigatePrevious={handleNavigatePrevious}
              onNavigateNext={handleNavigateNext}
              canNavigatePrevious={canNavigatePrevious}
              canNavigateNext={canNavigateNext}
              onUpdateAuditLog={handleUpdateAuditLog}
              onAddNote={handleAddNote}
              onAddTodo={handleAddTodo}
              onToggleTodo={handleToggleTodo}
              onDeleteTodo={handleDeleteTodo}
              onStatusChange={handleStatusChange}
              isInboxMode={true}
            />
          </div>
        </>
      ) : activeView === "campaigns" ? (
        <CampaignsView
          draftCampaigns={draftCampaigns}
          completedCampaigns={completedCampaigns}
          onSaveDraft={handleSaveDraft}
          onDeleteCampaigns={handleDeleteCampaigns}
          onCompleteCampaign={handleCompleteCampaign}
          onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
        />
      ) : activeView === "knowledge" ? (
        <KnowledgeBaseView
          onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
          initialFiles={initialKnowledgeBaseFiles}
        />
      ) : activeView === "analytics" ? (
        <AnalyticsView
          onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
        />
      ) : activeView === "settings" ? (
        <SettingsView
          onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
          initialTab={settingsTab}
        />
      ) : activeView === "sent" ? (
        <SentView
          sentItems={sentItems}
          onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
        />
      ) : (
        <div className="flex-1 flex items-center justify-center bg-white">
          <div className="text-center">
            <h2 className="mb-2">Coming Soon</h2>
            <p className="text-[#7f7f7f]">
              This feature is under development
            </p>
          </div>
        </div>
      )}

      {/* Save Indicator */}
      <SaveIndicator
        isSaving={saveIndicator.isSaving}
        lastSaved={saveIndicator.lastSaved}
        error={saveIndicator.error}
      />
    </div>
  );
}