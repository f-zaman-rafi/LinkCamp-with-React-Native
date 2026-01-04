import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

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
    <View className="mt-3 flex-row gap-3">
      <TouchableOpacity className="flex-row items-center gap-0.5" onPress={onUpvote}>
        <MaterialCommunityIcons
          name={isUpvoted ? 'triangle' : 'triangle-outline'}
          size={15}
          color={isUpvoted ? '#00C853' : '#000000'} // green when upvoted
        />

        <Text className="text-xs text-black">{upvotes}</Text>
      </TouchableOpacity>

      <TouchableOpacity className="flex-row items-center gap-0.5" onPress={onDownvote}>
        <MaterialCommunityIcons
          name={isDownvoted ? 'triangle-down' : 'triangle-down-outline'}
          size={15}
          color={isDownvoted ? '#ff0000' : '#000000'} // red when downvoted
        />

        <Text className="text-xs text-black">{downvotes}</Text>
      </TouchableOpacity>

      <TouchableOpacity className="flex-row items-center gap-0.5" onPress={onComments}>
        <Ionicons name="chatbubble-outline" size={15} color="#000000" />
        <Text className="text-xs text-black">{commentCount}</Text>
      </TouchableOpacity>

      <TouchableOpacity className="flex-row items-center gap-0.5" onPress={onRepostOptions}>
        <Ionicons name="repeat" size={15} color="#000000" />
        <Text className="text-xs text-black">{repostCount}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PostActions;
