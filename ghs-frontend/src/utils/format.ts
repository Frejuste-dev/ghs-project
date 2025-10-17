import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { DATE_FORMATS } from '@/constants';

/**
 * Format a date to display format (dd/MM/yyyy)
 */
export const formatDate = (date: Date | string | null | undefined): string => {
  if (!date) return '-';
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, DATE_FORMATS.DISPLAY, { locale: fr });
  } catch {
    return '-';
  }
};

/**
 * Format a date with time (dd/MM/yyyy HH:mm)
 */
export const formatDateTime = (date: Date | string | null | undefined): string => {
  if (!date) return '-';
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, DATE_FORMATS.DISPLAY_WITH_TIME, { locale: fr });
  } catch {
    return '-';
  }
};

/**
 * Format a date to API format (yyyy-MM-dd)
 */
export const formatDateForAPI = (date: Date | null | undefined): string | null => {
  if (!date) return null;
  
  try {
    return format(date, DATE_FORMATS.API);
  } catch {
    return null;
  }
};

/**
 * Format time (HH:mm)
 */
export const formatTime = (time: string | null | undefined): string => {
  if (!time) return '-';
  return time;
};

/**
 * Format relative time (il y a X heures)
 */
export const formatRelativeTime = (date: Date | string | null | undefined): string => {
  if (!date) return '-';
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return formatDistanceToNow(dateObj, { locale: fr, addSuffix: true });
  } catch {
    return '-';
  }
};

/**
 * Calculate duration between two times (in hours)
 */
export const calculateDuration = (
  startTime: string,
  endTime: string
): number => {
  if (!startTime || !endTime) return 0;

  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);

  const startMinutes = startHour * 60 + startMinute;
  const endMinutes = endHour * 60 + endMinute;

  const durationMinutes = endMinutes - startMinutes;
  return Math.round((durationMinutes / 60) * 100) / 100;
};

/**
 * Format duration (hours) to readable format
 */
export const formatDuration = (hours: number): string => {
  if (hours === 0) return '0h';
  
  const wholeHours = Math.floor(hours);
  const minutes = Math.round((hours - wholeHours) * 60);
  
  if (minutes === 0) {
    return `${wholeHours}h`;
  }
  
  return `${wholeHours}h${minutes.toString().padStart(2, '0')}`;
};

/**
 * Format full name from first and last name
 */
export const formatFullName = (
  firstName: string,
  lastName: string
): string => {
  return `${firstName} ${lastName}`.trim();
};

/**
 * Format employee number
 */
export const formatEmployeeNumber = (number: string): string => {
  return number.toUpperCase();
};

/**
 * Format currency (EUR)
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
};

/**
 * Format percentage
 */
export const formatPercentage = (value: number, decimals: number = 0): string => {
  return `${value.toFixed(decimals)}%`;
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

/**
 * Get initials from name
 */
export const getInitials = (firstName: string, lastName: string): string => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};