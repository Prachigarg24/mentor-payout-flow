
export type UserRole = 'admin' | 'mentor';

export type SessionStatus = 'completed' | 'pending' | 'cancelled';
export type SessionType = 'live' | 'evaluation' | 'review';
export type PayoutStatus = 'pending' | 'paid' | 'disputed';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  hourlyRate?: number;
  taxInfo?: {
    pan?: string;
    gst?: string;
  };
}

export interface Session {
  id: string;
  mentorId: string;
  mentorName: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number; // in minutes
  type: SessionType;
  hourlyRate: number;
  status: SessionStatus;
  notes?: string;
}

export interface PayoutBreakdown {
  baseAmount: number;
  platformFee: number;
  platformFeePercentage: number;
  taxAmount: number;
  taxPercentage: number;
  finalAmount: number;
}

export interface Receipt {
  id: string;
  mentorId: string;
  mentorName: string;
  dateGenerated: string;
  dateRange: {
    start: string;
    end: string;
  };
  sessions: Session[];
  breakdown: PayoutBreakdown;
  status: PayoutStatus;
  notes?: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  receiverName: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  details: string;
  timestamp: string;
  entityType: 'session' | 'receipt' | 'user' | 'payment';
  entityId: string;
}
