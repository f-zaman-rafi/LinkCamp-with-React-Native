import '../../global.css';
import React, { useMemo, useCallback, useRef } from 'react';
import { useRouter, useFocusEffect } from 'expo-router';
import { View, Alert, FlatList } from 'react-native';
import useAuth from '../../Hooks/useAuth';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import useFeedData from '../../Hooks/useFeedData';
import useComments from '../../Hooks/useComments';
import useReports from '../../Hooks/useReports';
import useRepostPreview from '../../Hooks/useRepostPreview';
import FeedList from '../../components/FeedList';
import PostCard from '../../components/PostCard';
import CommentsModal from '../../components/CommentsModal';
import ReportModal from '../../components/ReportModal';
import RepostModal from '../../components/RepostModal';
import LoadingState from '../../components/LoadingState';
import EmptyState from '../../components/EmptyState';
import { ApiPost } from '../../types/feed';

const FeedPage = () => {
  const router = useRouter();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const currentUserEmail = user?.email || '';
  const listRef = useRef<FlatList<ApiPost>>(null);

  // Feed data and actions
  const {
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
    reload,
  } = useFeedData('/posts');

  // Refresh feed when screen is focused
  useFocusEffect(
    useCallback(() => {
      listRef.current?.scrollToOffset({ offset: 0, animated: false });
      reload(); // silent update when coming back
    }, [reload])
  );

  // Comments management
  const {
    commentsOpen,
    commentsLoading,
    commentSubmitting,
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
  } = useComments({ onCountChange: updateCommentCount });

  // Reports management
  const {
    commentReportOpen,
    commentReportReason,
    setCommentReportReason,
    commentReportLoading,
    openCommentReport,
    closeCommentReport,
    submitCommentReport,
    quickCommentReport,
    quickPostReport,
  } = useReports();

  // Map of posts by ID for easy lookup
  const postById = useMemo(() => {
    const map: Record<string, ApiPost> = {};
    posts.forEach((p) => {
      map[p._id] = p;
    });
    return map;
  }, [posts]);

  // Repost management
  const {
    repostOpen,
    repostText,
    setRepostText,
    repostLoading,
    submitRepost,
    quickRepost,
    openRepostWithPreview,
    closeRepostWithPreview,
    repostPreview,
  } = useRepostPreview({
    postById,
    onSuccess: (postId) => {
      updateRepostCount(postId, 1);
      refresh();
    },
  });

  // Delete post function
  const deletePost = async (postId: string) => {
    try {
      await axiosSecure.delete(`/posts/${postId}`);
      refresh();
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || 'Delete failed.';
      Alert.alert('Delete Error', message);
    }
  };

  // Post actions
  const openPostActions = (post: ApiPost, rootId: string) => {
    const isOwner = !!post.email && post.email === currentUserEmail;

    if (isOwner) {
      Alert.alert('Post Options', 'Choose an action', [
        {
          text: 'Edit',
          onPress: () => router.push({ pathname: '/(tabs)/edit-post', params: { id: post._id } }),
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () =>
            Alert.alert('Delete Post', 'Are you sure?', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Delete', style: 'destructive', onPress: () => deletePost(post._id) },
            ]),
        },
        { text: 'Cancel', style: 'cancel' },
      ]);
      return;
    }

    Alert.alert('Post Options', 'Choose an action', [
      { text: 'Report', onPress: () => quickPostReport(post._id) },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  // Comment actions
  const openCommentActions = (comment: any) => {
    const isOwner = !!comment.email && comment.email === currentUserEmail;

    if (isOwner) {
      Alert.alert('Comment Options', 'Choose an action', [
        { text: 'Edit', onPress: () => startEditComment(comment) },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () =>
            Alert.alert('Delete Comment', 'Are you sure?', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Delete', style: 'destructive', onPress: () => deleteComment(comment._id) },
            ]),
        },
        { text: 'Cancel', style: 'cancel' },
      ]);
      return;
    }

    Alert.alert('Comment Options', 'Choose an action', [
      { text: 'Report', onPress: () => quickCommentReport(comment._id) },
      { text: 'Report with Details', onPress: () => openCommentReport(comment._id) },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  // Render a single post item
  const renderPost = ({ item }: { item: ApiPost }) => {
    const counts = voteCounts[item._id] || { upvotes: 0, downvotes: 0 };
    const isUpvoted = userVotes[item._id] === 'upvote';
    const isDownvoted = userVotes[item._id] === 'downvote';
    const commentCount = commentCounts[item._id] ?? 0;
    const repostCount = repostCounts[item._id] ?? 0;
    const original = item.repostOf ? postById[item.repostOf] : undefined;

    return (
      <PostCard
        post={item}
        originalPost={original}
        voteCounts={counts}
        isUpvoted={isUpvoted}
        isDownvoted={isDownvoted}
        commentCount={commentCount}
        repostCount={repostCount}
        onPostMenu={openPostActions}
        onVote={handleVote}
        onOpenComments={openComments}
        onRepostWithThought={openRepostWithPreview}
        onQuickRepost={quickRepost}
      />
    );
  };

  if (loading) {
    return <LoadingState />;
  }

  return (
    <View className="flex-1 bg-white px-4 pt-2">
      <FeedList
        listRef={listRef}
        data={posts}
        keyExtractor={(item) => item._id}
        renderItem={renderPost}
        refreshing={refreshing}
        onRefresh={refresh}
        listEmptyComponent={<EmptyState />}
      />

      <CommentsModal
        visible={commentsOpen}
        onClose={closeComments}
        comments={comments}
        loading={commentsLoading}
        commentText={commentText}
        setCommentText={setCommentText}
        onSubmit={submitComment}
        onOpenCommentActions={openCommentActions}
        isEditing={!!editingCommentId}
        onCancelEdit={cancelEditComment}
        submitting={commentSubmitting}
      />

      <ReportModal
        visible={commentReportOpen}
        title="Report Comment"
        description="Tell us why you are reporting this comment."
        reason={commentReportReason}
        onChangeReason={setCommentReportReason}
        onClose={closeCommentReport}
        onSubmit={submitCommentReport}
        loading={commentReportLoading}
      />

      <RepostModal
        visible={repostOpen}
        thought={repostText}
        onChangeThought={setRepostText}
        onClose={closeRepostWithPreview}
        onSubmit={submitRepost}
        loading={repostLoading}
        previewPost={repostPreview}
      />
    </View>
  );
};

export default FeedPage;
