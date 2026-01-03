import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import useAxiosSecure from './useAxiosSecure';
import { Comment } from '../types/feed';

type UseCommentsOptions = {
  onCountChange?: (postId: string, delta: number) => void;
};

const useComments = ({ onCountChange }: UseCommentsOptions = {}) => {
  const axiosSecure = useAxiosSecure();

  const [commentsOpen, setCommentsOpen] = useState(false);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [activePostId, setActivePostId] = useState<string | null>(null);

  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);

  const fetchComments = useCallback(
    async (postId: string) => {
      const res = await axiosSecure.get(`/comments/${postId}`);
      setComments(res.data || []);
    },
    [axiosSecure]
  );

  const openComments = useCallback(
    async (postId: string) => {
      setActivePostId(postId);
      setCommentsOpen(true);
      setCommentsLoading(true);
      try {
        await fetchComments(postId);
      } catch {
        Alert.alert('Comments Error', 'Unable to load comments.');
      } finally {
        setCommentsLoading(false);
      }
    },
    [fetchComments]
  );

  const closeComments = () => {
    setCommentsOpen(false);
    setComments([]);
    setCommentText('');
    setActivePostId(null);
    setEditingCommentId(null);
  };

  const submitComment = async () => {
    if (!activePostId) return;
    const text = commentText.trim();
    if (!text) return;

    setCommentSubmitting(true);
    try {
      if (editingCommentId) {
        await axiosSecure.patch(`/comments/${editingCommentId}`, { content: text });
        setComments((prev) =>
          prev.map((c) => (c._id === editingCommentId ? { ...c, content: text } : c))
        );
        setEditingCommentId(null);
        setCommentText('');
        return;
      }

      await axiosSecure.post('/comments', { postId: activePostId, content: text });
      setCommentText('');
      onCountChange?.(activePostId, 1);
      await fetchComments(activePostId);
    } catch {
      Alert.alert('Comment Error', 'Unable to post comment.');
    } finally {
      setCommentSubmitting(false);
    }
  };

  const startEditComment = (comment: Comment) => {
    setEditingCommentId(comment._id);
    setCommentText(comment.content);
  };

  const cancelEditComment = () => {
    setEditingCommentId(null);
    setCommentText('');
  };

  const deleteComment = async (commentId: string) => {
    if (!activePostId) return;
    try {
      await axiosSecure.delete(`/comments/${commentId}`);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
      onCountChange?.(activePostId, -1);
    } catch {
      Alert.alert('Delete Error', 'Unable to delete comment.');
    }
  };

  return {
    commentsOpen,
    commentsLoading,
    commentSubmitting,
    activePostId,
    comments,
    commentText,
    setCommentText,
    editingCommentId,
    openComments,
    closeComments,
    submitComment,
    startEditComment,
    cancelEditComment,
    deleteComment,
  };
};

export default useComments;
