
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Session, PayoutBreakdown } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatTime(timeString: string): string {
  return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function calculateSessionAmount(session: Session): number {
  // Calculate amount based on hourly rate and duration in minutes
  return (session.hourlyRate / 60) * session.duration;
}

export function calculatePayoutBreakdown(
  sessions: Session[],
  platformFeePercentage: number = 10,
  taxPercentage: number = 18
): PayoutBreakdown {
  // Calculate base amount from all sessions
  const baseAmount = sessions.reduce(
    (total, session) => total + calculateSessionAmount(session),
    0
  );
  
  // Calculate platform fee
  const platformFee = (baseAmount * platformFeePercentage) / 100;
  
  // Calculate tax (on the amount after platform fee)
  const taxableAmount = baseAmount - platformFee;
  const taxAmount = (taxableAmount * taxPercentage) / 100;
  
  // Calculate final amount
  const finalAmount = taxableAmount - taxAmount;
  
  return {
    baseAmount,
    platformFee,
    platformFeePercentage,
    taxAmount,
    taxPercentage,
    finalAmount,
  };
}

export function generateReceipt(name: string): string {
  const timestamp = Date.now().toString(36);
  const randomChars = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `${name.substring(0, 3).toUpperCase()}-${timestamp}-${randomChars}`;
}

export function getDateRangeLabel(days: number): string {
  if (days === 7) return 'Last 7 days';
  if (days === 15) return 'Last 15 days';
  if (days === 30) return 'Last 30 days';
  if (days === 90) return 'Last 3 months';
  return 'Custom range';
}

export function getDateRange(days: number): { start: Date; end: Date } {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - days);
  return { start, end };
}

export function isWithinDateRange(date: string, start: Date, end: Date): boolean {
  const dateObj = new Date(date);
  return dateObj >= start && dateObj <= end;
}
