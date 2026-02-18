import { useEffect, useMemo, useRef } from 'react';
import useSocket from './useSocket';

type FeedRoom = 'all' | 'teacher' | 'admin';

type FeedRealtimeHandlers = {
  onPostCreated?: (post: any) => void;
  onPostUpdated?: (post: any) => void;
  onPostDeleted?: (payload: any) => void;
  onUserUpdated?: (payload: any) => void;
  onVoteChanged?: (payload: any) => void;
  onCommentCreated?: (payload: any) => void;
  onCommentUpdated?: (payload: any) => void;
  onCommentDeleted?: (payload: any) => void;
  onRepostCreated?: (payload: any) => void;
};

type UseFeedRealtimeOptions = FeedRealtimeHandlers & {
  feedRoom: FeedRoom;
  trackedPostIds?: string[];
};

const useFeedRealtime = ({
  feedRoom,
  trackedPostIds = [],
  onPostCreated,
  onPostUpdated,
  onPostDeleted,
  onUserUpdated,
  onVoteChanged,
  onCommentCreated,
  onCommentUpdated,
  onCommentDeleted,
  onRepostCreated,
}: UseFeedRealtimeOptions) => {
  const { socket } = useSocket();
  const handlersRef = useRef<FeedRealtimeHandlers>({});
  const joinedPostIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    handlersRef.current = {
      onPostCreated,
      onPostUpdated,
      onPostDeleted,
      onUserUpdated,
      onVoteChanged,
      onCommentCreated,
      onCommentUpdated,
      onCommentDeleted,
      onRepostCreated,
    };
  }, [
    onPostCreated,
    onPostUpdated,
    onPostDeleted,
    onUserUpdated,
    onVoteChanged,
    onCommentCreated,
    onCommentUpdated,
    onCommentDeleted,
    onRepostCreated,
  ]);

  useEffect(() => {
    if (!socket) return;

    socket.emit('feed:subscribe', feedRoom);
    return () => {
      socket.emit('feed:unsubscribe', feedRoom);
    };
  }, [feedRoom, socket]);

  useEffect(() => {
    if (!socket) return;

    const handlePostCreated = (payload: any) => handlersRef.current.onPostCreated?.(payload?.post || payload);
    const handlePostUpdated = (payload: any) => handlersRef.current.onPostUpdated?.(payload?.post || payload);
    const handlePostDeleted = (payload: any) => handlersRef.current.onPostDeleted?.(payload);
    const handleUserUpdated = (payload: any) => handlersRef.current.onUserUpdated?.(payload);
    const handleVoteChanged = (payload: any) => handlersRef.current.onVoteChanged?.(payload);
    const handleCommentCreated = (payload: any) => handlersRef.current.onCommentCreated?.(payload);
    const handleCommentUpdated = (payload: any) => handlersRef.current.onCommentUpdated?.(payload);
    const handleCommentDeleted = (payload: any) => handlersRef.current.onCommentDeleted?.(payload);
    const handleRepostCreated = (payload: any) => handlersRef.current.onRepostCreated?.(payload);

    socket.on('post:created', handlePostCreated);
    socket.on('post:updated', handlePostUpdated);
    socket.on('post:deleted', handlePostDeleted);
    socket.on('user:updated', handleUserUpdated);
    socket.on('vote:changed', handleVoteChanged);
    socket.on('comment:created', handleCommentCreated);
    socket.on('comment:updated', handleCommentUpdated);
    socket.on('comment:deleted', handleCommentDeleted);
    socket.on('repost:created', handleRepostCreated);

    return () => {
      socket.off('post:created', handlePostCreated);
      socket.off('post:updated', handlePostUpdated);
      socket.off('post:deleted', handlePostDeleted);
      socket.off('user:updated', handleUserUpdated);
      socket.off('vote:changed', handleVoteChanged);
      socket.off('comment:created', handleCommentCreated);
      socket.off('comment:updated', handleCommentUpdated);
      socket.off('comment:deleted', handleCommentDeleted);
      socket.off('repost:created', handleRepostCreated);
    };
  }, [socket]);

  const normalizedTrackedIds = useMemo(
    () => [...new Set(trackedPostIds.filter(Boolean))].sort(),
    [trackedPostIds]
  );
  const trackedIdsKey = normalizedTrackedIds.join('|');

  useEffect(() => {
    if (!socket) return;

    const currentIds = joinedPostIdsRef.current;
    const nextIds = new Set(normalizedTrackedIds);

    nextIds.forEach((postId) => {
      if (!currentIds.has(postId)) {
        socket.emit('post:join', postId);
      }
    });

    currentIds.forEach((postId) => {
      if (!nextIds.has(postId)) {
        socket.emit('post:leave', postId);
      }
    });

    joinedPostIdsRef.current = nextIds;
  }, [socket, trackedIdsKey, normalizedTrackedIds]);

  useEffect(() => {
    return () => {
      if (!socket) return;
      joinedPostIdsRef.current.forEach((postId) => socket.emit('post:leave', postId));
      joinedPostIdsRef.current.clear();
    };
  }, [socket]);
};

export default useFeedRealtime;
