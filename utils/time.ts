export const formatRelativeTime = (input?: string | number | Date) => {
  if (!input) return '';
  const date = input instanceof Date ? input : new Date(input);
  if (isNaN(date.getTime())) return '';

  const diff = Date.now() - date.getTime();
  if (diff < 0) return 'just now';

  const minute = 60_000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const month = 30 * day;

  if (diff < minute) return '1m';
  if (diff < hour) return `${Math.floor(diff / minute)}m`;
  if (diff < day) return `${Math.floor(diff / hour)}h`;
  if (diff < month) return `${Math.floor(diff / day)}d`;

  // older than 30 days → Month Year
  return date.toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
};
