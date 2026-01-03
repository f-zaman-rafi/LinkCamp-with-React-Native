import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import useAxiosSecure from './useAxiosSecure';
import { ApiPost, VoteCounts, VoteType } from '../types/feed';

const useFeedData = (endpoint: string = '/posts') => {
  const axiosSecure = useAxiosSecure();

  const [posts, setPosts] = useState<ApiPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [voteCounts, setVoteCounts] = useState<Record<string, VoteCounts>>({});
  const [userVotes, setUserVotes] = useState<Record<string, VoteType>>({});
  const [commentCounts, setCommentCounts] = useState<Record<string, number>>({});
  const [repostCounts, setRepostCounts] = useState<Record<string, number>>({});

  const buildVoteCountMap = (items: any[]) => {
    const map: Record<string, VoteCounts> = {};
    items.forEach((item) => {
      map[item._id] = {
        upvotes: item.upvotes || 0,
        downvotes: item.downvotes || 0,
      };
    });
    return map;
  };

  const buildUserVoteMap = (items: any[]) => {
    const map: Record<string, VoteType> = {};
    items.forEach((item) => {
      map[item.postId] = item.voteType;
    });
    return map;
  };

  const buildCountMap = (items: any[]) => {
    const map: Record<string, number> = {};
    items.forEach((item) => {
      map[item._id] = item.count || 0;
    });
    return map;
  };

  const fetchFeed = useCallback(
    async (isRefresh: boolean = false) => {
      try {
        const results = await Promise.allSettled([
          axiosSecure.get(endpoint),
          axiosSecure.get('/votes'),
          axiosSecure.get('/voteCounts'),
          axiosSecure.get('/commentCounts'),
          axiosSecure.get('/repostCounts'),
        ]);

        const postsRes = results[0];
        if (postsRes.status === 'fulfilled') {
          setPosts(postsRes.value.data || []);
        } else {
          throw postsRes.reason;
        }

        const votesRes = results[1];
        if (votesRes.status === 'fulfilled') {
          setUserVotes(buildUserVoteMap(votesRes.value.data || []));
        }

        const countsRes = results[2];
        if (countsRes.status === 'fulfilled') {
          setVoteCounts(buildVoteCountMap(countsRes.value.data || []));
        }

        const commentCountsRes = results[3];
        if (commentCountsRes.status === 'fulfilled') {
          setCommentCounts(buildCountMap(commentCountsRes.value.data || []));
        }

        const repostCountsRes = results[4];
        if (repostCountsRes.status === 'fulfilled') {
          setRepostCounts(buildCountMap(repostCountsRes.value.data || []));
        }
      } catch (error) {
        Alert.alert('Feed Error', 'Unable to load posts.');
      } finally {
        if (isRefresh) setRefreshing(false);
        else setLoading(false);
      }
    },
    [axiosSecure, endpoint]
  );

  useEffect(() => {
    setLoading(true);
    fetchFeed(false);
  }, [fetchFeed]);

  const refresh = useCallback(() => {
    setRefreshing(true);
    fetchFeed(true);
  }, [fetchFeed]);

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
        await axiosSecure.post('/votes', { postId, voteType });
      } catch (error) {
        Alert.alert('Vote Error', 'Could not update your vote.');
        fetchFeed(true);
      }
    },
    [axiosSecure, fetchFeed, userVotes]
  );

  return {
    posts,
    loading,
    refreshing,
    refresh,
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
