import '../../global.css';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
import { useRouter } from 'expo-router';
import useAuth from '../../Hooks/useAuth';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import { useUserContext } from '../../providers/UserContext';
import useAppLogout from '../../Hooks/useAppLogout';
import useFeedData from '../../Hooks/useFeedData';
import useComments from '../../Hooks/useComments';
import useReports from '../../Hooks/useReports';
import useRepostPreview from '../../Hooks/useRepostPreview';

import PostCard from '../../components/PostCard';
import CommentsModal from '../../components/CommentsModal';
import RepostModal from '../../components/RepostModal';
import LoadingState from '../../components/LoadingState';
import EmptyState from '../../components/EmptyState';
import UserName from '../../components/UserName';
import { ApiPost } from '../../types/feed';

const ProfilePage = () => {
  const router = useRouter();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const { userData, setUserData } = useUserContext();
  const { confirmLogout, logoutLoading } = useAppLogout();
  const email = user?.email || '';

  const [photoOpen, setPhotoOpen] = useState(false);
  const [profileLoading, setProfileLoading] = useState(!userData);

  const endpoint = email ? `/user/profile/${email}` : '/posts';

  const {
    posts,
    loading,
    refreshing,
    loadingMore,
    hasMore,
    refresh,
    voteCounts,
    userVotes,
    commentCounts,
    repostCounts,
    handleVote,
    updateCommentCount,
    updateRepostCount,
    loadMore,
  } = useFeedData(endpoint);

  const handleRefresh = () => {
    refresh();
    loadUser(false);
  };

  const loadUser = useCallback(async (showSpinner = false) => {
    if (!email) {
      setProfileLoading(false);
      return;
    }
    if (showSpinner) {
      setProfileLoading(true);
    }
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

  useEffect(() => {
    if (!email) {
      setProfileLoading(false);
      return;
    }

    if (userData?.name) {
      setProfileLoading(false);
      return;
    }

    loadUser(true);
  }, [email, loadUser, userData?.name]);

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
    const original = item.originalPost || (item.repostOf ? postById[item.repostOf] : undefined);

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

  if ((loading && posts.length === 0) || profileLoading) {
    return <LoadingState />;
  }

  const role = userData?.userType || '';
  const showStudent = role === 'student';
  const showTeacher = role === 'teacher';
  const showAdmin = role === 'admin';

  const header = (
    <View className="pt-4">
      <View className="pt-4">
        <TouchableOpacity
          className="w-full"
          activeOpacity={0.8}
          onPress={() => userData?.photo && setPhotoOpen(true)}>
          {userData?.photo ? (
            <Image
              source={{ uri: userData.photo }}
              style={{ width: '100%', height: 200, borderRadius: 12 }}
              resizeMode="cover"
            />
          ) : (
            <View className="h-32 w-full rounded-xl bg-slate-200" />
          )}
        </TouchableOpacity>

        <View className="mt-4 items-center">
          <UserName
            name={userData?.name}
            role={role}
            wrapperClassName="flex-row items-center gap-2"
            nameClassName="text-2xl font-bold text-slate-900"
            roleClassName="text-sm text-slate-500"
          />
        </View>
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
        <InfoRow label="Email" value={user?.email} />
      </View>

      {userData?.userType === 'admin' ? (
        <TouchableOpacity
          className="mt-3 rounded-xl border border-stone-800 py-3"
          onPress={() => router.push('/(admin)/users')}>
          <Text className="text-center font-semibold text-stone-800">Go to Admin Panel</Text>
        </TouchableOpacity>
      ) : null}

      <View className="mt-4 flex-row-reverse gap-3">
        <TouchableOpacity
          className="flex-1 rounded-xl bg-red-600 py-3"
          onPress={() => router.push('/(tabs)/update-profile')}>
          <Text className="text-center font-semibold text-white">Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`flex-1 rounded-xl py-3 shadow-sm ${logoutLoading ? 'bg-stone-300' : 'bg-stone-800'}`}
          onPress={confirmLogout}
          disabled={logoutLoading}>
          {logoutLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-center font-semibold text-white">Log Out</Text>
          )}
        </TouchableOpacity>
      </View>

      <Text className="mt-6 text-lg font-bold text-slate-900">Posts</Text>
    </View>
  );

  return (
    <View className="flex-1 bg-white">
      <FlatList
        data={mergedPosts}
        keyExtractor={(item) => item._id}
        renderItem={renderPost}
        ListHeaderComponent={header}
        ListEmptyComponent={
          <View className="mt-8">
            <EmptyState title="No posts yet" message="You haven’t shared anything." />
          </View>
        }
        refreshing={refreshing}
        onRefresh={handleRefresh}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loadingMore ? (
            <View className="py-4">
              <ActivityIndicator color="#2563eb" />
            </View>
          ) : !hasMore ? (
            <View className="py-4" />
          ) : null
        }
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
            backgroundColor: 'rgba(0,0,0,0.9)',
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
            <Ionicons name="close" size={44} color="#FF0000" />
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
