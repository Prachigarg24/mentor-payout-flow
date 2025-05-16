
import { User, Session, Receipt, Message, AuditLog, PayoutStatus } from './types';
import { calculatePayoutBreakdown } from './utils';

// Generate dates relative to current date
const getRelativeDate = (daysAgo: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
};

// Sample mentors
export const mockMentors: User[] = [
  {
    id: 'mentor-1',
    name: 'Priya Sharma',
    email: 'priya.sharma@example.com',
    role: 'mentor',
    hourlyRate: 4000,
    taxInfo: {
      pan: 'ABCDE1234F',
      gst: '29ABCDE1234F1Z5',
    },
  },
  {
    id: 'mentor-2',
    name: 'Rahul Kumar',
    email: 'rahul.kumar@example.com',
    role: 'mentor',
    hourlyRate: 3500,
    taxInfo: {
      pan: 'PQRST5678G',
    },
  },
  {
    id: 'mentor-3',
    name: 'Ananya Patel',
    email: 'ananya.patel@example.com',
    role: 'mentor',
    hourlyRate: 4500,
    taxInfo: {
      pan: 'LMNOP9012H',
      gst: '27LMNOP9012H1ZK',
    },
  },
  {
    id: 'mentor-4',
    name: 'Vikram Singh',
    email: 'vikram.singh@example.com',
    role: 'mentor',
    hourlyRate: 3800,
    taxInfo: {
      pan: 'QWERT6789J',
    },
  },
  {
    id: 'mentor-5',
    name: 'Meera Reddy',
    email: 'meera.reddy@example.com',
    role: 'mentor',
    hourlyRate: 4200,
    taxInfo: {
      pan: 'ASDFG5432K',
      gst: '36ASDFG5432K1Z2',
    },
  },
];

// Generate sessions for each mentor
export const generateMockSessions = (): Session[] => {
  let sessions: Session[] = [];
  const sessionTypes = ['live', 'evaluation', 'review'];
  const sessionStatuses = ['completed', 'pending', 'cancelled'];
  
  mockMentors.forEach(mentor => {
    // Generate 5-10 sessions for each mentor
    const sessionCount = 5 + Math.floor(Math.random() * 6);
    
    for (let i = 0; i < sessionCount; i++) {
      const daysAgo = Math.floor(Math.random() * 30); // Random day in the last 30 days
      const date = getRelativeDate(daysAgo);
      const duration = [30, 45, 60, 90][Math.floor(Math.random() * 4)]; // Random duration
      const type = sessionTypes[Math.floor(Math.random() * sessionTypes.length)] as any;
      const status = i < sessionCount - 1 ? 'completed' : sessionStatuses[Math.floor(Math.random() * sessionStatuses.length)] as any;
      
      // Generate start time between 9 AM and 6 PM
      const hour = 9 + Math.floor(Math.random() * 9);
      const minute = [0, 15, 30, 45][Math.floor(Math.random() * 4)];
      const startTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00`;
      
      // Calculate end time
      const endHour = hour + Math.floor(duration / 60);
      const endMinute = minute + (duration % 60);
      const adjustedEndHour = endHour + Math.floor(endMinute / 60);
      const adjustedEndMinute = endMinute % 60;
      const endTime = `${adjustedEndHour.toString().padStart(2, '0')}:${adjustedEndMinute.toString().padStart(2, '0')}:00`;
      
      sessions.push({
        id: `session-${mentor.id}-${i}`,
        mentorId: mentor.id,
        mentorName: mentor.name,
        date,
        startTime,
        endTime,
        duration,
        type,
        hourlyRate: mentor.hourlyRate || 4000,
        status,
        notes: status === 'cancelled' ? 'Student did not show up' : undefined,
      });
    }
  });
  
  // Sort sessions by date, most recent first
  return sessions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const mockSessions = generateMockSessions();

// Generate receipts for each mentor
export const generateMockReceipts = (): Receipt[] => {
  const receipts: Receipt[] = [];
  const payoutStatuses: PayoutStatus[] = ['pending', 'paid', 'disputed'];
  
  mockMentors.forEach((mentor, index) => {
    // Get completed sessions for this mentor
    const mentorSessions = mockSessions.filter(
      session => session.mentorId === mentor.id && session.status === 'completed'
    );
    
    // Generate 1-3 receipts for each mentor
    const receiptCount = 1 + Math.floor(Math.random() * 3);
    
    for (let i = 0; i < receiptCount; i++) {
      // Split sessions across receipts
      const sessionsPerReceipt = Math.ceil(mentorSessions.length / receiptCount);
      const start = i * sessionsPerReceipt;
      const end = Math.min((i + 1) * sessionsPerReceipt, mentorSessions.length);
      const receiptSessions = mentorSessions.slice(start, end);
      
      if (receiptSessions.length > 0) {
        // Find date range
        const dates = receiptSessions.map(s => new Date(s.date));
        const startDate = new Date(Math.min(...dates.map(d => d.getTime()))).toISOString().split('T')[0];
        const endDate = new Date(Math.max(...dates.map(d => d.getTime()))).toISOString().split('T')[0];
        
        // Generate receipt date (after the last session)
        const lastSessionDate = new Date(endDate);
        lastSessionDate.setDate(lastSessionDate.getDate() + 1);
        const receiptDate = lastSessionDate.toISOString().split('T')[0];
        
        // Calculate payout breakdown
        const breakdown = calculatePayoutBreakdown(receiptSessions);
        
        // Assign a status - make first receipt paid, others random
        const status = i === 0 ? 'paid' : payoutStatuses[Math.floor(Math.random() * payoutStatuses.length)];
        
        receipts.push({
          id: `receipt-${mentor.id}-${i}`,
          mentorId: mentor.id,
          mentorName: mentor.name,
          dateGenerated: receiptDate,
          dateRange: {
            start: startDate,
            end: endDate,
          },
          sessions: receiptSessions,
          breakdown,
          status,
          notes: status === 'disputed' ? 'Mentor has requested a review of calculation' : undefined,
        });
      }
    }
  });
  
  // Sort receipts by date generated, most recent first
  return receipts.sort(
    (a, b) => new Date(b.dateGenerated).getTime() - new Date(a.dateGenerated).getTime()
  );
};

export const mockReceipts = generateMockReceipts();

// Generate messages between admin and mentors
export const generateMockMessages = (): Message[] => {
  const messages: Message[] = [];
  const adminId = 'admin-1';
  const adminName = 'Admin User';
  
  mockMentors.forEach((mentor, mentorIndex) => {
    // Generate 5-15 messages per mentor
    const messageCount = 5 + Math.floor(Math.random() * 11);
    
    for (let i = 0; i < messageCount; i++) {
      const isFromAdmin = i % 2 === 0;
      const daysAgo = Math.floor(Math.random() * 14); // Within last 2 weeks
      const hoursAgo = Math.floor(Math.random() * 24);
      const minutesAgo = Math.floor(Math.random() * 60);
      
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);
      date.setHours(date.getHours() - hoursAgo);
      date.setMinutes(date.getMinutes() - minutesAgo);
      
      messages.push({
        id: `message-${mentor.id}-${i}`,
        senderId: isFromAdmin ? adminId : mentor.id,
        senderName: isFromAdmin ? adminName : mentor.name,
        receiverId: isFromAdmin ? mentor.id : adminId,
        receiverName: isFromAdmin ? mentor.name : adminName,
        content: getRandomMessage(isFromAdmin, i === messageCount - 1),
        timestamp: date.toISOString(),
        read: daysAgo > 0 || (daysAgo === 0 && hoursAgo > 1),
      });
    }
  });
  
  // Sort messages by timestamp, newest first
  return messages.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

const getRandomMessage = (isFromAdmin: boolean, isLast: boolean): string => {
  if (isLast) {
    return isFromAdmin 
      ? "Just to confirm, your payment for this month has been processed and should reach your account within 2-3 business days."
      : "Thank you for the update. Can you please let me know when the payment will be reflected in my account?";
  }
  
  const adminMessages = [
    "Hello, I've processed your payout for the sessions conducted last week.",
    "Could you please verify the hours logged for the session on Monday?",
    "We've updated our payment processing schedule, all payments will now be processed every Friday.",
    "Your receipt for last month's sessions is ready for review.",
    "We noticed a discrepancy in the tax calculation for your last payout. We're looking into it.",
    "Please note that platform fees have been adjusted from 12% to 10% starting this month.",
    "The latest receipt includes all sessions up to yesterday.",
    "Could you please submit your updated tax information by the end of this month?",
  ];
  
  const mentorMessages = [
    "Thank you for processing my payment.",
    "I've checked the hours logged and they look correct.",
    "I noticed my hourly rate hasn't been updated as discussed earlier.",
    "Could you please clarify how the tax deduction was calculated?",
    "I seem to be missing payment for a session I conducted last Tuesday.",
    "Thanks for your prompt response. I'll check my account and confirm the receipt.",
    "I've updated my tax information as requested.",
    "Can we schedule a call to discuss the new platform fees?",
  ];
  
  const messagesList = isFromAdmin ? adminMessages : mentorMessages;
  return messagesList[Math.floor(Math.random() * messagesList.length)];
};

export const mockMessages = generateMockMessages();

// Generate audit logs
export const generateMockAuditLogs = (): AuditLog[] => {
  const logs: AuditLog[] = [];
  const actionTypes = [
    { action: 'created', entityType: 'session' },
    { action: 'updated', entityType: 'session' },
    { action: 'deleted', entityType: 'session' },
    { action: 'generated', entityType: 'receipt' },
    { action: 'updated', entityType: 'receipt' },
    { action: 'created', entityType: 'user' },
    { action: 'updated', entityType: 'user' },
    { action: 'processed', entityType: 'payment' },
  ];
  
  // Generate 50 random audit logs
  for (let i = 0; i < 50; i++) {
    const daysAgo = Math.floor(Math.random() * 30);
    const hoursAgo = Math.floor(Math.random() * 24);
    
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    date.setHours(date.getHours() - hoursAgo);
    
    const actionInfo = actionTypes[Math.floor(Math.random() * actionTypes.length)];
    const isAdminAction = Math.random() > 0.2; // Most actions are by admin
    
    const mentor = mockMentors[Math.floor(Math.random() * mockMentors.length)];
    const userId = isAdminAction ? 'admin-1' : mentor.id;
    const userName = isAdminAction ? 'Admin User' : mentor.name;
    
    // Generate entity ID based on entity type
    let entityId = '';
    if (actionInfo.entityType === 'session') {
      const session = mockSessions[Math.floor(Math.random() * mockSessions.length)];
      entityId = session.id;
    } else if (actionInfo.entityType === 'receipt') {
      const receipt = mockReceipts[Math.floor(Math.random() * mockReceipts.length)];
      entityId = receipt.id;
    } else if (actionInfo.entityType === 'user') {
      entityId = mentor.id;
    } else if (actionInfo.entityType === 'payment') {
      const receipt = mockReceipts[Math.floor(Math.random() * mockReceipts.length)];
      entityId = receipt.id;
    }
    
    logs.push({
      id: `log-${i}`,
      userId,
      userName,
      action: actionInfo.action,
      entityType: actionInfo.entityType as any,
      entityId,
      details: getActionDetails(actionInfo.action, actionInfo.entityType, mentor.name),
      timestamp: date.toISOString(),
    });
  }
  
  // Sort logs by timestamp, newest first
  return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

const getActionDetails = (action: string, entityType: string, mentorName: string): string => {
  if (entityType === 'session') {
    if (action === 'created') return `New session created for ${mentorName}`;
    if (action === 'updated') return `Session details updated for ${mentorName}`;
    if (action === 'deleted') return `Session removed for ${mentorName}`;
  } else if (entityType === 'receipt') {
    if (action === 'generated') return `New receipt generated for ${mentorName}`;
    if (action === 'updated') return `Receipt details updated for ${mentorName}`;
  } else if (entityType === 'user') {
    if (action === 'created') return `New user account created: ${mentorName}`;
    if (action === 'updated') return `User profile updated: ${mentorName}`;
  } else if (entityType === 'payment') {
    return `Payment processed for ${mentorName}`;
  }
  
  return `${action} ${entityType} for ${mentorName}`;
};

export const mockAuditLogs = generateMockAuditLogs();

// Export all mock data
export const mockData = {
  mentors: mockMentors,
  sessions: mockSessions,
  receipts: mockReceipts,
  messages: mockMessages,
  auditLogs: mockAuditLogs,
};
