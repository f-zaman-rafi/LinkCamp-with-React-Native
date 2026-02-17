import { useState } from 'react';
import { Alert } from 'react-native';
import useAxiosSecure from './useAxiosSecure';
import { getMultipartHeaders } from '../utils/upload';

type UseRepostOptions = {
  onSuccess?: (postId: string) => void;
};

const useRepost = (options: UseRepostOptions = {}) => {
  const axiosSecure = useAxiosSecure();
  const { onSuccess } = options;

  const [repostOpen, setRepostOpen] = useState(false);
  const [repostPostId, setRepostPostId] = useState<string | null>(null);
  const [repostText, setRepostText] = useState('');
  const [repostLoading, setRepostLoading] = useState(false);

  const openRepost = (postId: string) => {
    setRepostPostId(postId);
    setRepostText('');
    setRepostOpen(true);
  };

  const closeRepost = () => {
    setRepostOpen(false);
    setRepostPostId(null);
    setRepostText('');
  };

  const submitRepost = async () => {
    if (!repostPostId) return;
    setRepostLoading(true);
    try {
      const formData = new FormData();
      formData.append('content', repostText.trim() || '');
      formData.append('postType', 'repost');
      formData.append('repostOf', repostPostId);

      await axiosSecure.post('/user/post', formData, {
        headers: getMultipartHeaders(),
      });

      Alert.alert('Reposted', 'Your repost is live.');
      onSuccess?.(repostPostId);
      closeRepost();
    } catch (error: any) {
      const code = error?.response?.data?.code;
      if (code !== 'ACCOUNT_PENDING') {
        Alert.alert('Repost Error', 'Unable to repost.');
      }
    } finally {
      setRepostLoading(false);
    }
  };

  const quickRepost = async (postId: string) => {
    try {
      const formData = new FormData();
      formData.append('content', '');
      formData.append('postType', 'repost');
      formData.append('repostOf', postId);

      await axiosSecure.post('/user/post', formData, {
        headers: getMultipartHeaders(),
      });

      Alert.alert('Reposted', 'Your repost is live.');
      onSuccess?.(postId);
    } catch (error: any) {
      const code = error?.response?.data?.code;
      if (code !== 'ACCOUNT_PENDING') {
        Alert.alert('Repost Error', 'Unable to repost.');
      }
    }
  };

  return {
    repostOpen,
    repostText,
    setRepostText,
    repostLoading,
    openRepost,
    closeRepost,
    submitRepost,
    quickRepost,
  };
};

export default useRepost;
