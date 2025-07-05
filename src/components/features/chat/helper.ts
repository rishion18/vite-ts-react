import {
  isToday,
  isYesterday,
  format,
  isThisWeek,
  startOfWeek,
  isBefore,
  parseISO,
} from 'date-fns';

export function formatChatTimestamp(isoDateStr: string): string {
  const date = parseISO(isoDateStr);

  if (isToday(date)) {
    // Return time in 24hr format like "16:30"
    return format(date, 'HH:mm');
  }

  if (isYesterday(date)) {
    return 'yesterday';
  }

  if (isThisWeek(date)) {
    // If it's this week, return weekday like "Tuesday"
    return format(date, 'EEEE'); // full day name
  }

  // If date is from previous week or earlier, return in dd/MM/yyyy format
  return format(date, 'dd/MM/yyyy');
}