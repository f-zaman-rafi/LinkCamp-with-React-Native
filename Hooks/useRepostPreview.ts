import { useState } from 'react';
import useRepost from './useRepost';
import { ApiPost } from '../types/feed';

type UseRepostPreviewOptions = {
  postById: Record<string, ApiPost>;
  onSuccess?: (postId: string) => void;
};

const useRepostPreview = ({ postById, onSuccess }: UseRepostPreviewOptions) => {
  const [repostPreview, setRepostPreview] = useState<ApiPost | null>(null);

  const {
    repostOpen,
    repostText,
    setRepostText,
    repostLoading,
    openRepost,
    closeRepost,
    submitRepost,
    quickRepost,
  } = useRepost({ onSuccess });

  const openRepostWithPreview = (postId: string) => {
    setRepostPreview(postById[postId] ?? null);
    openRepost(postId);
  };

  const closeRepostWithPreview = () => {
    setRepostPreview(null);
    closeRepost();
  };

  return {
    repostOpen,
    repostText,
    setRepostText,
    repostLoading,
    submitRepost,
    quickRepost,
    openRepostWithPreview,
    closeRepostWithPreview,
    repostPreview,
  };
};

export default useRepostPreview;
