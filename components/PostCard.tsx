import React, { useState } from 'react';
import { View, Image, Alert, Modal, TouchableOpacity } from 'react-native';
import PostHeader from './PostHeader';
import PostActions from './PostActions';
import RepostPreview from './ReviewPreview';
import { ApiPost, VoteCounts, VoteType } from '../types/feed';
import ExpandableText from './ExpandableText';
import { postTypeLabel } from '../utils/postType';
import { Ionicons } from '@expo/vector-icons';
import { formatRelativeTime } from '../utils/time';

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
  const [photoOpen, setPhotoOpen] = useState(false);
  const handleRepostOptions = () => {
    Alert.alert('Repost', 'Choose an option', [
      { text: 'Repost with Thought', onPress: () => onRepostWithThought(rootId) },
      { text: 'Repost', onPress: () => onQuickRepost(rootId) },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };
  const timeLabel = formatRelativeTime(post.createdAt);

  return (
    <View className="border-b-2 border-dashed border-slate-200 py-4">
      <PostHeader
        name={post.user?.name || 'Unknown'}
        label={label}
        photoUri={post.user?.photo}
        role={post.user?.user_type}
        onMenu={() => onPostMenu(post, rootId)}
      />

      <View className="ml-14.5">
        <ExpandableText
          text={post.content?.slice(0, 2000)}
          step={250}
          className="mt-2 text-[15px] leading-5 text-slate-900"
          buttonClassName="mt-1 text-right text-xs font-semibold text-blue-600"
        />

        {post.photo ? (
          <>
            <TouchableOpacity activeOpacity={0.9} onPress={() => setPhotoOpen(true)}>
              <Image source={{ uri: post.photo }} className="mt-3 h-56 w-full rounded-2xl" />
            </TouchableOpacity>

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

                <Image
                  source={{ uri: post.photo }}
                  style={{ width: '92%', height: '72%', resizeMode: 'contain' }}
                />
              </View>
            </Modal>
          </>
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
          timeLabel={timeLabel}
        />
      </View>
    </View>
  );
};

export default PostCard;
