import { PostType } from '../types/feed';

export const postTypeLabel = (type?: PostType) => {
  if (type === 'repost') return 'Repost';
  if (type === 'teacher') return 'Teacher Announcement';
  if (type === 'admin') return 'Official Notice';
  if (type === 'general') return 'General Post';
  return '';
};
