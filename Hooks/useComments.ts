import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import useAxiosSecure from './useAxiosSecure';
import { Comment } from '../types/feed';
import useSocket from './useSocket';

type UseCommentsOptions = {
  // kept for backward compatibility with existing callers
  onCountChange?: (postId: string, delta: number) => void;
};

const useComments = (_options: UseCommentsOptions = {}) => {
  const axiosSecure = useAxiosSecure();
  const { socket } = useSocket();

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
      } catch (error: any) {
        const code = error?.response?.data?.code;
        if (code !== 'ACCOUNT_PENDING') {
          Alert.alert('Comment Error', 'Unable to post comment.');
        }
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
        const response = await axiosSecure.patch(`/comments/${editingCommentId}`, { content: text });
        const updatedComment = response?.data?.comment;
        setComments((prev) =>
          prev.map((c) => (c._id === editingCommentId ? { ...c, ...(updatedComment || {}), content: text } : c))
        );
        setEditingCommentId(null);
        setCommentText('');
        return;
      }

      const response = await axiosSecure.post('/comments', { postId: activePostId, content: text });
      const created = response?.data?.comment;
      setCommentText('');
      if (created?._id) {
        setComments((prev) => {
          if (prev.some((c) => c._id === created._id)) return prev;
          return [...prev, created];
        });
      }
    } catch (error: any) {
      const code = error?.response?.data?.code;
      if (code !== 'ACCOUNT_PENDING') {
        Alert.alert('Comment Error', 'Unable to post comment.');
      }
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
    } catch (error: any) {
      const code = error?.response?.data?.code;
      if (code !== 'ACCOUNT_PENDING') {
        Alert.alert('Delete Error', 'Unable to delete comment.');
      }
    }
  };

  useEffect(() => {
    if (!socket || !commentsOpen || !activePostId) return;

    socket.emit('post:join', activePostId);

    const onCreated = (payload: any) => {
      if (payload?.postId !== activePostId || !payload?.comment) return;
      setComments((prev) => {
        if (prev.some((item) => item._id === payload.comment._id)) return prev;
        return [...prev, payload.comment];
      });
    };

    const onUpdated = (payload: any) => {
      if (payload?.postId !== activePostId || !payload?.comment?._id) return;
      setComments((prev) =>
        prev.map((item) => (item._id === payload.comment._id ? { ...item, ...payload.comment } : item))
      );
    };

    const onDeleted = (payload: any) => {
      if (payload?.postId !== activePostId || !payload?.commentId) return;
      setComments((prev) => prev.filter((item) => item._id !== payload.commentId));
    };

    const onUserUpdated = (payload: any) => {
      const targetEmail = payload?.email ? String(payload.email) : '';
      if (!targetEmail) return;

      setComments((prev) => {
        let hasChanges = false;
        const next = prev.map((item) => {
          if (item.email !== targetEmail) return item;

          const existingUser = item.user || {};
          const mergedUser = {
            ...existingUser,
            name: payload?.name || existingUser.name,
            photo: payload?.photo || existingUser.photo,
          };

          if (mergedUser.name === existingUser.name && mergedUser.photo === existingUser.photo) {
            return item;
          }

          hasChanges = true;
          return { ...item, user: mergedUser };
        });

        return hasChanges ? next : prev;
      });
    };

    socket.on('comment:created', onCreated);
    socket.on('comment:updated', onUpdated);
    socket.on('comment:deleted', onDeleted);
    socket.on('user:updated', onUserUpdated);

    return () => {
      socket.off('comment:created', onCreated);
      socket.off('comment:updated', onUpdated);
      socket.off('comment:deleted', onDeleted);
      socket.off('user:updated', onUserUpdated);
      socket.emit('post:leave', activePostId);
    };
  }, [activePostId, commentsOpen, socket]);

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
