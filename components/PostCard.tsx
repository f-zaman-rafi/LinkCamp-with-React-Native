import React from 'react';
import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export type PostType = 'general' | 'teacher' | 'admin' | 'repost';

export type ApiPost = {
  _id: string;
  email?: string;
  content?: string;
  photo?: string;
  createdAt?: string;
  postType?: PostType;
  repostOf?: string | null;
  user?: {
    name?: string;
    photo?: string;
    user_type?: string;
  };
};

export type VoteType = 'upvote' | 'downvote';

export type VoteCounts = {
  upvotes: number;
  downvotes: number;
};

type PostCardProps = {
  post: ApiPost;
  originalPost?: ApiPost;
  voteCounts: VoteCounts;
  isUpvoted: boolean;
  isDownvoted: boolean;
  commentCount: number;
  repostCount: number;
  onPostMenu: (post: ApiPost, rootId: string) => void;
  onVote: (postId: string, voteType: VoteType) => void;
  onOpenComments: (postId: string) => void;
  onRepostWithThought: (rootId: string) => void;
  onQuickRepost: (rootId: string) => void;
};

const postTypeLabel = (type?: PostType) => {
  if (type === 'repost') return 'Repost';
  if (type === 'teacher') return 'Teacher Announcement';
  if (type === 'admin') return 'Official Notice';
  if (type === 'general') return 'General Post';
  return '';
};

const RepostPreview = ({ post }: { post?: ApiPost }) => {
  if (!post) {
    return (
      <View className="mt-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
        <Text className="text-xs text-slate-500">Original post unavailable.</Text>
      </View>
    );
  }

  const label = postTypeLabel(post.postType);

  return (
    <View className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
      <View className="flex-row items-center gap-2">
        {post.user?.photo ? (
          <Image source={{ uri: post.user.photo }} className="h-6 w-6 rounded-full" />
        ) : (
          <View className="h-6 w-6 rounded-full bg-slate-200" />
        )}
        <View>
          <Text className="text-xs font-semibold text-slate-800">
            {post.user?.name || 'Unknown'}
          </Text>
          {label ? <Text className="text-[10px] text-slate-500">{label}</Text> : null}
        </View>
      </View>

      {post.content ? <Text className="mt-2 text-xs text-slate-800">{post.content}</Text> : null}

      {post.photo ? (
        <Image source={{ uri: post.photo }} className="mt-2 h-40 w-full rounded-lg" />
      ) : null}
    </View>
  );
};

const PostCard = ({
  post,
  originalPost,
  voteCounts,
  isUpvoted,
  isDownvoted,
  commentCount,
  repostCount,
  onPostMenu,
  onVote,
  onOpenComments,
  onRepostWithThought,
  onQuickRepost,
}: PostCardProps) => {
  const label = postTypeLabel(post.postType);
  const rootId = post.repostOf ? post.repostOf : post._id;

  return (
    <View className="border-b border-slate-100 py-4">
      <View className="flex-row gap-3">
        <View className="w-10 items-center">
          {post.user?.photo ? (
            <Image source={{ uri: post.user.photo }} className="h-10 w-10 rounded-full" />
          ) : (
            <View className="h-10 w-10 rounded-full bg-slate-200" />
          )}
        </View>

        <View className="flex-1">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="font-semibold text-slate-900">{post.user?.name || 'Unknown'}</Text>
              {label ? <Text className="text-xs text-slate-500">{label}</Text> : null}
            </View>
            <TouchableOpacity onPress={() => onPostMenu(post, rootId)}>
              <Ionicons name="ellipsis-horizontal" size={18} color="#94a3b8" />
            </TouchableOpacity>
          </View>

          {post.content ? (
            <Text className="mt-2 text-[15px] leading-5 text-slate-900">{post.content}</Text>
          ) : null}

          {post.photo ? (
            <Image source={{ uri: post.photo }} className="mt-3 h-56 w-full rounded-2xl" />
          ) : null}

          {post.repostOf ? <RepostPreview post={originalPost} /> : null}

          <View className="mt-3 flex-row gap-6">
            <TouchableOpacity
              className="flex-row items-center gap-2"
              onPress={() => onVote(post._id, 'upvote')}>
              <Ionicons
                name={isUpvoted ? 'arrow-up' : 'arrow-up-outline'}
                size={18}
                color={isUpvoted ? '#2563eb' : '#94a3b8'}
              />
              <Text className="text-xs text-slate-500">{voteCounts.upvotes}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-row items-center gap-2"
              onPress={() => onVote(post._id, 'downvote')}>
              <Ionicons
                name={isDownvoted ? 'arrow-down' : 'arrow-down-outline'}
                size={18}
                color={isDownvoted ? '#ef4444' : '#94a3b8'}
              />
              <Text className="text-xs text-slate-500">{voteCounts.downvotes}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-row items-center gap-2"
              onPress={() => onOpenComments(post._id)}>
              <Ionicons name="chatbubble-outline" size={18} color="#94a3b8" />
              <Text className="text-xs text-slate-500">{commentCount}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-row items-center gap-2"
              onPress={() =>
                Alert.alert('Repost', 'Choose an option', [
                  { text: 'Repost with Thought', onPress: () => onRepostWithThought(rootId) },
                  { text: 'Repost', onPress: () => onQuickRepost(rootId) },
                  { text: 'Cancel', style: 'cancel' },
                ])
              }>
              <Ionicons name="repeat" size={18} color="#94a3b8" />
              <Text className="text-xs text-slate-500">{repostCount}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default PostCard;
