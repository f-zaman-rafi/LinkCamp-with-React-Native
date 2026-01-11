import '../../global.css';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  Modal,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import useAuth from '../../Hooks/useAuth';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import { useUserContext } from '../../providers/UserContext';
import useFeedData from '../../Hooks/useFeedData';
import useComments from '../../Hooks/useComments';
import useReports from '../../Hooks/useReports';
import useRepostPreview from '../../Hooks/useRepostPreview';

import PostCard from '../../components/PostCard';
import CommentsModal from '../../components/CommentsModal';
import RepostModal from '../../components/RepostModal';
import LoadingState from '../../components/LoadingState';
import EmptyState from '../../components/EmptyState';
import Avatar from '../../components/Avatar';
import UserName from '../../components/UserName';
import { ApiPost } from '../../types/feed';

type EmptyStateProps = {
  title?: string;
  subtitle?: string;
};

const ProfilePage = () => {
  const router = useRouter();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const { userData, setUserData } = useUserContext();

  const email = user?.email || '';
  const listRef = useRef<FlatList<ApiPost>>(null);

  const [photoOpen, setPhotoOpen] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);

  const endpoint = email ? `/user/profile/${email}` : '/posts';

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
  } = useFeedData(endpoint);

  const loadUser = useCallback(async () => {
    if (!email) {
      setProfileLoading(false);
      return;
    }
    setProfileLoading(true);
    try {
      const res = await axiosSecure.get(`/user/${email}`);
      const u = res.data || {};
      setUserData((prev) => ({
        ...(prev || {}),
        name: u.name ?? prev?.name ?? '',
        userType: u.userType ?? prev?.userType ?? null,
        user_id: u.user_id ?? prev?.user_id ?? '',
        department: u.department ?? prev?.department ?? '',
        session: u.session ?? prev?.session ?? '',
        gender: u.gender ?? prev?.gender ?? '',
        photo: u.photo ?? prev?.photo ?? '',
        verify: u.verify ?? prev?.verify ?? '',
      }));
    } catch {
      // keep cached userData
    } finally {
      setProfileLoading(false);
    }
  }, [axiosSecure, email, setUserData]);

  useFocusEffect(
    useCallback(() => {
      listRef.current?.scrollToOffset({ offset: 0, animated: false });
      reload();
      loadUser();
    }, [reload, loadUser])
  );

  const mergedPosts = useMemo(() => {
    return posts.map((p) =>
      p.user
        ? p
        : {
            ...p,
            user: {
              name: userData?.name || 'Unknown',
              photo: userData?.photo || '',
              user_type: userData?.userType || undefined,
            },
          }
    );
  }, [posts, userData]);

  const postById = useMemo(() => {
    const map: Record<string, ApiPost> = {};
    mergedPosts.forEach((p) => {
      map[p._id] = p;
    });
    return map;
  }, [mergedPosts]);

  const sortedPosts = useMemo(() => {
    const list = [...mergedPosts];
    return list.sort((a, b) => {
      const aTime = new Date(a.createdAt || 0).getTime();
      const bTime = new Date(b.createdAt || 0).getTime();
      return bTime - aTime;
    });
  }, [mergedPosts]);

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

  const { quickCommentReport, quickPostReport } = useReports();

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

  const deletePost = async (postId: string) => {
    try {
      await axiosSecure.delete(`/posts/${postId}`);
      refresh();
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || 'Delete failed.';
      Alert.alert('Delete Error', message);
    }
  };

  const openPostActions = (post: ApiPost, rootId: string) => {
    const isOwner = post.email ? post.email === email : true;

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

  const openCommentActions = (comment: any) => {
    const isOwner = !!comment.email && comment.email === email;

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
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

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

  if (loading || profileLoading) {
    return <LoadingState />;
  }

  const role = userData?.userType || '';
  const showStudent = role === 'student';
  const showTeacher = role === 'teacher';
  const showAdmin = role === 'admin';

  const header = (
    <View className="pt-4">
      <View className="items-center">
        <TouchableOpacity activeOpacity={0.8} onPress={() => userData?.photo && setPhotoOpen(true)}>
          <Avatar uri={userData?.photo} size={120} />
        </TouchableOpacity>

        <UserName
          name={userData?.name}
          role={role}
          wrapperClassName="mt-4 flex-row items-center gap-2"
          nameClassName="text-2xl font-bold text-slate-900"
          roleClassName="text-sm text-slate-500"
        />
      </View>

      <View className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
        {showStudent ? (
          <>
            <InfoRow label="Student ID" value={userData?.user_id} />
            <InfoRow label="Department" value={userData?.department} />
            <InfoRow label="Session" value={userData?.session} />
          </>
        ) : null}

        {showTeacher ? (
          <>
            <InfoRow label="Teacher ID" value={userData?.user_id} />
            <InfoRow label="Department" value={userData?.department} />
          </>
        ) : null}

        {showAdmin ? <InfoRow label="Role" value="Administrator" /> : null}

        {userData?.gender ? <InfoRow label="Gender" value={userData.gender} isLast /> : null}
        {!userData?.gender && (showStudent || showTeacher || showAdmin) ? (
          <InfoRow label="Gender" value="-" isLast />
        ) : null}
      </View>

      <TouchableOpacity
        className="mt-4 rounded-xl border border-blue-600 py-3"
        onPress={() => router.push('/(tabs)/update-profile')}>
        <Text className="text-center font-semibold text-blue-600">Edit Profile</Text>
      </TouchableOpacity>

      <Text className="mt-6 text-lg font-bold text-slate-900">Posts</Text>
    </View>
  );

  return (
    <View className="flex-1 bg-white">
      <FlatList
        ref={listRef}
        data={sortedPosts}
        keyExtractor={(item) => item._id}
        renderItem={renderPost}
        ListHeaderComponent={header}
        ListEmptyComponent={
          <View className="mt-8">
            <EmptyState title="No posts yet" message="You haven’t shared anything." />
          </View>
        }
        refreshing={refreshing}
        onRefresh={refresh}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
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

      <RepostModal
        visible={repostOpen}
        thought={repostText}
        onChangeThought={setRepostText}
        onClose={closeRepostWithPreview}
        onSubmit={submitRepost}
        loading={repostLoading}
        previewPost={repostPreview}
      />

      <Modal
        visible={photoOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setPhotoOpen(false)}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.8)',
          }}>
          <TouchableOpacity
            onPress={() => setPhotoOpen(false)}
            style={{
              position: 'absolute',
              top: 50,
              right: 16,
              zIndex: 10,
              padding: 8,
            }}>
            <Ionicons name="close" size={28} color="#ffffff" />
          </TouchableOpacity>

          {userData?.photo ? (
            <Image
              source={{ uri: userData.photo }}
              style={{ width: '92%', height: '72%', resizeMode: 'contain' }}
            />
          ) : null}
        </View>
      </Modal>
    </View>
  );
};

const InfoRow = ({
  label,
  value,
  isLast = false,
}: {
  label: string;
  value?: string | null;
  isLast?: boolean;
}) => (
  <View
    className={`flex-row items-center justify-between py-2 ${isLast ? '' : 'border-b border-slate-100'}`}>
    <Text className="text-xs text-slate-400 uppercase">{label}</Text>
    <Text className="text-sm font-semibold text-slate-800">{value || '-'}</Text>
  </View>
);

export default ProfilePage;
