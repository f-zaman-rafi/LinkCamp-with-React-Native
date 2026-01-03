import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type PostActionsProps = {
  isUpvoted: boolean;
  isDownvoted: boolean;
  upvotes: number;
  downvotes: number;
  commentCount: number;
  repostCount: number;
  onUpvote: () => void;
  onDownvote: () => void;
  onComments: () => void;
  onRepostOptions: () => void;
};

const PostActions = ({
  isUpvoted,
  isDownvoted,
  upvotes,
  downvotes,
  commentCount,
  repostCount,
  onUpvote,
  onDownvote,
  onComments,
  onRepostOptions,
}: PostActionsProps) => {
  return (
    <View className="mt-3 flex-row gap-6">
      <TouchableOpacity className="flex-row items-center gap-2" onPress={onUpvote}>
        <Ionicons
          name={isUpvoted ? 'arrow-up' : 'arrow-up-outline'}
          size={18}
          color={isUpvoted ? '#2563eb' : '#94a3b8'}
        />
        <Text className="text-xs text-slate-500">{upvotes}</Text>
      </TouchableOpacity>

      <TouchableOpacity className="flex-row items-center gap-2" onPress={onDownvote}>
        <Ionicons
          name={isDownvoted ? 'arrow-down' : 'arrow-down-outline'}
          size={18}
          color={isDownvoted ? '#ef4444' : '#94a3b8'}
        />
        <Text className="text-xs text-slate-500">{downvotes}</Text>
      </TouchableOpacity>

      <TouchableOpacity className="flex-row items-center gap-2" onPress={onComments}>
        <Ionicons name="chatbubble-outline" size={18} color="#94a3b8" />
        <Text className="text-xs text-slate-500">{commentCount}</Text>
      </TouchableOpacity>

      <TouchableOpacity className="flex-row items-center gap-2" onPress={onRepostOptions}>
        <Ionicons name="repeat" size={18} color="#94a3b8" />
        <Text className="text-xs text-slate-500">{repostCount}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PostActions;
