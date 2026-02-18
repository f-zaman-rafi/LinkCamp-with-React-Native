import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import useAxiosSecure from './useAxiosSecure';
import { ApiPost, VoteCounts, VoteType } from '../types/feed';
import useAuth from './useAuth';
import useFeedRealtime from './useFeedRealtime';
import useSocket from './useSocket';
import { useUserContext } from '../providers/UserContext';

type FeedResponse =
  | ApiPost[]
  | {
      items?: ApiPost[];
      nextCursor?: string | null;
    };

type UseFeedDataOptions = {
  withGlobalCounts?: boolean;
  pageSize?: number;
};

type UserPatch = {
  name?: string;
  photo?: string;
  user_type?: string;
};

const DEFAULT_PAGE_SIZE = 20;

const toId = (value: unknown): string => {
  if (value === undefined || value === null) return '';
  if (typeof value === 'string') return value;
  if (value && typeof value === 'object' && '_id' in (value as Record<string, unknown>)) {
    return String((value as Record<string, unknown>)._id);
  }
  return String(value);
};

const normalizePost = (post: ApiPost): ApiPost => {
  const normalized: ApiPost = {
    ...post,
    _id: toId(post._id),
    repostOf: post.repostOf ? String(post.repostOf) : null,
  };

  if (post.originalPost) {
    normalized.originalPost = normalizePost(post.originalPost);
  }

  return normalized;
};

const dedupeById = (items: ApiPost[]): ApiPost[] => {
  const map = new Map<string, ApiPost>();
  items.forEach((item) => {
    const id = toId(item._id);
    map.set(id, normalizePost({ ...item, _id: id }));
  });
  return Array.from(map.values());
};

const extractFeedResponse = (data: FeedResponse): { items: ApiPost[]; nextCursor: string | null } => {
  if (Array.isArray(data)) {
    return { items: dedupeById(data), nextCursor: null };
  }

  return {
    items: dedupeById(data?.items || []),
    nextCursor: data?.nextCursor || null,
  };
};

const parseEndpointMeta = (endpoint: string) => {
  const [path, rawQuery] = endpoint.split('?');
  const query = new URLSearchParams(rawQuery || '');
  const type = query.get('type');
  const profileEmail = path.startsWith('/user/profile/') ? decodeURIComponent(path.replace('/user/profile/', '')) : '';

  let feedRoom: 'all' | 'teacher' | 'admin' = 'all';
  if (path.startsWith('/teacher/announcements') || type === 'teacher') feedRoom = 'teacher';
  if (path.startsWith('/admin/notices') || type === 'admin') feedRoom = 'admin';

  return { path, type, profileEmail, feedRoom };
};

const useFeedData = (
  endpoint: string = '/posts',
  options: UseFeedDataOptions = {}
) => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const { socket } = useSocket();
  const { userData } = useUserContext();
  const { pageSize = DEFAULT_PAGE_SIZE, withGlobalCounts = false } = options;
  const { path, type, profileEmail, feedRoom } = useMemo(() => parseEndpointMeta(endpoint), [endpoint]);

  const [posts, setPosts] = useState<ApiPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const [voteCounts, setVoteCounts] = useState<Record<string, VoteCounts>>({});
  const [userVotes, setUserVotes] = useState<Record<string, VoteType>>({});
  const [commentCounts, setCommentCounts] = useState<Record<string, number>>({});
  const [repostCounts, setRepostCounts] = useState<Record<string, number>>({});
  const currentUserEmail = user?.email || '';
  const currentSocketId = socket?.id || '';

  const applyUserPatchToPost = useCallback(
    (post: ApiPost, targetEmail: string, patch: UserPatch): ApiPost => {
      let nextPost = post;
      let changed = false;

      if (post.email === targetEmail) {
        const existingUser = post.user || {};
        const mergedUser = {
          ...existingUser,
          name: patch.name ?? existingUser.name,
          photo: patch.photo ?? existingUser.photo,
          user_type: patch.user_type ?? existingUser.user_type,
        };

        if (
          mergedUser.name !== existingUser.name ||
          mergedUser.photo !== existingUser.photo ||
          mergedUser.user_type !== existingUser.user_type
        ) {
          nextPost = { ...nextPost, user: mergedUser };
          changed = true;
        }
      }

      if (nextPost.originalPost) {
        const nextOriginal = applyUserPatchToPost(nextPost.originalPost, targetEmail, patch);
        if (nextOriginal !== nextPost.originalPost) {
          nextPost = { ...nextPost, originalPost: nextOriginal };
          changed = true;
        }
      }

      return changed ? nextPost : post;
    },
    []
  );

  const patchUserAcrossPosts = useCallback(
    (targetEmail: string, patch: UserPatch) => {
      if (!targetEmail) return;
      setPosts((prev) => {
        let hasChanges = false;
        const next = prev.map((post) => {
          const patched = applyUserPatchToPost(post, targetEmail, patch);
          if (patched !== post) hasChanges = true;
          return patched;
        });
        return hasChanges ? next : prev;
      });
    },
    [applyUserPatchToPost]
  );

  const buildVoteCountMap = (items: any[]) => {
    const map: Record<string, VoteCounts> = {};
    items.forEach((item) => {
      const id = toId(item._id);
      map[id] = {
        upvotes: item.upvotes || 0,
        downvotes: item.downvotes || 0,
      };
    });
    return map;
  };

  const buildUserVoteMap = (items: any[]) => {
    const map: Record<string, VoteType> = {};
    items.forEach((item) => {
      const id = toId(item.postId);
      if (id) {
        map[id] = item.voteType;
      }
    });
    return map;
  };

  const buildCountMap = (items: any[]) => {
    const map: Record<string, number> = {};
    items.forEach((item) => {
      const id = toId(item._id);
      map[id] = item.count || 0;
    });
    return map;
  };

  const isPostRelevant = useCallback(
    (post: ApiPost) => {
      const normalizedType = post.postType || 'general';

      if (path.startsWith('/teacher/announcements') || type === 'teacher') {
        return normalizedType === 'teacher';
      }

      if (path.startsWith('/admin/notices') || type === 'admin') {
        return normalizedType === 'admin';
      }

      if (profileEmail) {
        return post.email === profileEmail;
      }

      return true;
    },
    [path, profileEmail, type]
  );

  const fetchCountsForPosts = useCallback(
    async (postIds: string[], replace: boolean) => {
      if (!postIds.length) return;

      const idsParam = postIds.join(',');
      const params = withGlobalCounts ? undefined : { ids: idsParam };

      const results = await Promise.allSettled([
        axiosSecure.get('/votes', { params }),
        axiosSecure.get('/voteCounts', { params }),
        axiosSecure.get('/commentCounts', { params }),
        axiosSecure.get('/repostCounts', { params }),
      ]);

      const votesRes = results[0];
      if (votesRes.status === 'fulfilled') {
        const nextMap = buildUserVoteMap(votesRes.value.data || []);
        setUserVotes((prev) => (replace || withGlobalCounts ? nextMap : { ...prev, ...nextMap }));
      }

      const voteCountsRes = results[1];
      if (voteCountsRes.status === 'fulfilled') {
        const nextMap = buildVoteCountMap(voteCountsRes.value.data || []);
        setVoteCounts((prev) => (replace || withGlobalCounts ? nextMap : { ...prev, ...nextMap }));
      }

      const commentRes = results[2];
      if (commentRes.status === 'fulfilled') {
        const nextMap = buildCountMap(commentRes.value.data || []);
        setCommentCounts((prev) => (replace || withGlobalCounts ? nextMap : { ...prev, ...nextMap }));
      }

      const repostRes = results[3];
      if (repostRes.status === 'fulfilled') {
        const nextMap = buildCountMap(repostRes.value.data || []);
        setRepostCounts((prev) => (replace || withGlobalCounts ? nextMap : { ...prev, ...nextMap }));
      }
    },
    [axiosSecure, withGlobalCounts]
  );

  const fetchFeed = useCallback(
    async (mode: 'initial' | 'refresh' | 'append') => {
      const isAppend = mode === 'append';
      const params: Record<string, string | number> = { limit: pageSize };
      if (isAppend && nextCursor) {
        params.cursor = nextCursor;
      }

      try {
        const response = await axiosSecure.get(endpoint, { params });
        const { items, nextCursor: incomingCursor } = extractFeedResponse(response.data);
        if (isAppend) {
          setPosts((prev) => dedupeById([...prev, ...items]));
        } else {
          setPosts(items);
        }

        const idsToFetch = items.map((item) => item._id);
        await fetchCountsForPosts(idsToFetch, !isAppend);

        setNextCursor(incomingCursor);
        setHasMore(Boolean(incomingCursor));
      } catch (error) {
        Alert.alert('Feed Error', 'Unable to load posts.');
      } finally {
        if (mode === 'initial') setLoading(false);
        if (mode === 'refresh') setRefreshing(false);
        if (mode === 'append') setLoadingMore(false);
      }
    },
    [axiosSecure, endpoint, fetchCountsForPosts, nextCursor, pageSize]
  );

  useEffect(() => {
    setLoading(true);
    setHasMore(true);
    setNextCursor(null);
    fetchFeed('initial');
  }, [fetchFeed]);

  const refresh = useCallback(() => {
    setRefreshing(true);
    setNextCursor(null);
    setHasMore(true);
    fetchFeed('refresh');
  }, [fetchFeed]);

  const loadMore = useCallback(() => {
    if (!hasMore || loadingMore || loading || refreshing) return;
    setLoadingMore(true);
    fetchFeed('append');
  }, [fetchFeed, hasMore, loading, loadingMore, refreshing]);

  useEffect(() => {
    if (!currentUserEmail || !userData) return;

    patchUserAcrossPosts(currentUserEmail, {
      name: userData.name || undefined,
      photo: userData.photo || undefined,
      user_type: userData.userType || undefined,
    });
  }, [currentUserEmail, patchUserAcrossPosts, userData]);

  const updateCommentCount = useCallback((postId: string, delta: number) => {
    setCommentCounts((prev) => ({
      ...prev,
      [postId]: Math.max(0, (prev[postId] || 0) + delta),
    }));
  }, []);

  const updateRepostCount = useCallback((postId: string, delta: number) => {
    setRepostCounts((prev) => ({
      ...prev,
      [postId]: Math.max(0, (prev[postId] || 0) + delta),
    }));
  }, []);

  const handleVote = useCallback(
    async (postId: string, voteType: VoteType) => {
      const previous = userVotes[postId];
      const nextVote: VoteType | null = previous === voteType ? null : voteType;

      setVoteCounts((prev) => {
        const current = prev[postId] || { upvotes: 0, downvotes: 0 };
        let up = current.upvotes;
        let down = current.downvotes;

        if (previous === 'upvote') up -= 1;
        if (previous === 'downvote') down -= 1;
        if (nextVote === 'upvote') up += 1;
        if (nextVote === 'downvote') down += 1;

        return {
          ...prev,
          [postId]: { upvotes: Math.max(0, up), downvotes: Math.max(0, down) },
        };
      });

      setUserVotes((prev) => {
        const next = { ...prev };
        if (nextVote) next[postId] = nextVote;
        else delete next[postId];
        return next;
      });

      try {
        await axiosSecure.post('/votes', {
          postId,
          voteType,
          originSocketId: currentSocketId || undefined,
        });
      } catch (error: any) {
        const code = error?.response?.data?.code;
        if (code !== 'ACCOUNT_PENDING') {
          Alert.alert('Vote Error', 'Could not update your vote.');
        }
        refresh();
      }
    },
    [axiosSecure, currentSocketId, refresh, userVotes]
  );

  const trackedPostIds = useMemo(() => posts.map((post) => post._id), [posts]);

  useFeedRealtime({
    feedRoom,
    trackedPostIds,
    onPostCreated: (incoming) => {
      const post = normalizePost(incoming);
      if (!isPostRelevant(post)) return;

      setPosts((prev) => dedupeById([post, ...prev]));
    },
    onPostUpdated: (incoming) => {
      const post = normalizePost(incoming);
      const relevant = isPostRelevant(post);

      setPosts((prev) => {
        const exists = prev.some((item) => item._id === post._id);
        if (!exists && !relevant) return prev;
        if (!exists && relevant) return dedupeById([post, ...prev]);
        if (!relevant) return prev.filter((item) => item._id !== post._id);
        return prev.map((item) => (item._id === post._id ? { ...item, ...post } : item));
      });
    },
    onPostDeleted: (payload) => {
      const postId = toId(payload?.postId);
      if (!postId) return;

      setPosts((prev) => prev.filter((item) => item._id !== postId));
      setVoteCounts((prev) => {
        const next = { ...prev };
        delete next[postId];
        return next;
      });
      setCommentCounts((prev) => {
        const next = { ...prev };
        delete next[postId];
        return next;
      });
      setRepostCounts((prev) => {
        const next = { ...prev };
        delete next[postId];
        return next;
      });
      setUserVotes((prev) => {
        const next = { ...prev };
        delete next[postId];
        return next;
      });
    },
    onUserUpdated: (payload) => {
      const targetEmail = payload?.email ? String(payload.email) : '';
      if (!targetEmail) return;

      patchUserAcrossPosts(targetEmail, {
        name: payload?.name || undefined,
        photo: payload?.photo || undefined,
        user_type: payload?.userType || payload?.user_type || undefined,
      });
    },
    onVoteChanged: (payload) => {
      const postId = toId(payload?.postId);
      if (!postId) return;
      const originSocketId = payload?.originSocketId ? String(payload.originSocketId) : '';
      if (originSocketId && currentSocketId && originSocketId === currentSocketId) {
        return;
      }
      const previousVote = payload?.previousVote as VoteType | null;
      const nextVote = payload?.voteType as VoteType | null;

      setVoteCounts((prev) => {
        const current = prev[postId] || { upvotes: 0, downvotes: 0 };
        let up = current.upvotes;
        let down = current.downvotes;

        if (previousVote === 'upvote') up -= 1;
        if (previousVote === 'downvote') down -= 1;
        if (nextVote === 'upvote') up += 1;
        if (nextVote === 'downvote') down += 1;

        return {
          ...prev,
          [postId]: { upvotes: Math.max(0, up), downvotes: Math.max(0, down) },
        };
      });

      if (payload?.userEmail === currentUserEmail) {
        setUserVotes((prev) => {
          const next = { ...prev };
          if (nextVote) next[postId] = nextVote;
          else delete next[postId];
          return next;
        });
      }
    },
    onCommentCreated: (payload) => {
      const postId = toId(payload?.postId);
      if (!postId) return;
      updateCommentCount(postId, Number(payload?.delta) || 1);
    },
    onCommentDeleted: (payload) => {
      const postId = toId(payload?.postId);
      if (!postId) return;
      updateCommentCount(postId, Number(payload?.delta) || -1);
    },
    onRepostCreated: (payload) => {
      const postId = toId(payload?.postId);
      if (!postId) return;
      updateRepostCount(postId, 1);
    },
  });

  const reload = useCallback(() => {
    setRefreshing(true);
    setNextCursor(null);
    setHasMore(true);
    fetchFeed('refresh');
  }, [fetchFeed]);

  return {
    posts,
    loading,
    refreshing,
    loadingMore,
    hasMore,
    refresh,
    reload,
    loadMore,
    voteCounts,
    userVotes,
    commentCounts,
    repostCounts,
    handleVote,
    updateCommentCount,
    updateRepostCount,
  };
};

export default useFeedData;
