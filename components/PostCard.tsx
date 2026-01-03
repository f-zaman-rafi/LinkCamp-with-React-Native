import React from 'react';
import { View, Image, Alert } from 'react-native';
import PostHeader from './PostHeader';
import PostActions from './PostActions';
import RepostPreview from './ReviewPreview';
import { ApiPost, VoteCounts, VoteType } from '../types/feed';
import ExpandableText from './ExpandableText';
import { postTypeLabel } from '../utils/postType';

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

  const handleRepostOptions = () => {
    Alert.alert('Repost', 'Choose an option', [
      { text: 'Repost with Thought', onPress: () => onRepostWithThought(rootId) },
      { text: 'Repost', onPress: () => onQuickRepost(rootId) },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  return (
    <View className="border-b border-slate-100 py-4">
      <PostHeader
        name={post.user?.name || 'Unknown'}
        label={label}
        photoUri={post.user?.photo}
        onMenu={() => onPostMenu(post, rootId)}
      />

      <ExpandableText
        text={post.content}
        step={300}
        className="mt-2 text-[15px] leading-5 text-slate-900"
        buttonClassName="mt-1 text-right text-xs font-semibold text-blue-600"
      />

      {post.photo ? (
        <Image source={{ uri: post.photo }} className="mt-3 h-56 w-full rounded-2xl" />
      ) : null}

      {post.repostOf ? <RepostPreview post={originalPost} /> : null}

      <PostActions
        isUpvoted={isUpvoted}
        isDownvoted={isDownvoted}
        upvotes={voteCounts.upvotes}
        downvotes={voteCounts.downvotes}
        commentCount={commentCount}
        repostCount={repostCount}
        onUpvote={() => onVote(post._id, 'upvote')}
        onDownvote={() => onVote(post._id, 'downvote')}
        onComments={() => onOpenComments(post._id)}
        onRepostOptions={handleRepostOptions}
      />
    </View>
  );
};

export default PostCard;
