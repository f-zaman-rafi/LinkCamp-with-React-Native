import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../providers/ThemeProvider';

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
  const { theme } = useTheme();
  const neutral = theme.colors.subtext;

  return (
    <View className="my-4 flex-row gap-3">
      <TouchableOpacity className="flex-row items-center gap-0.5" onPress={onUpvote}>
        <MaterialCommunityIcons
          name={isUpvoted ? 'triangle' : 'triangle-outline'}
          size={15}
          color={isUpvoted ? '#00C853' : neutral}
        />
        <Text className="text-xs" style={{ color: isUpvoted ? '#00C853' : neutral }}>
          {upvotes}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity className="flex-row items-center gap-0.5" onPress={onDownvote}>
        <MaterialCommunityIcons
          name={isDownvoted ? 'triangle-down' : 'triangle-down-outline'}
          size={15}
          color={isDownvoted ? '#ff0000' : neutral}
        />
        <Text className="text-xs" style={{ color: isDownvoted ? '#ff0000' : neutral }}>
          {downvotes}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity className="flex-row items-center gap-0.5" onPress={onComments}>
        <Ionicons name="chatbubble-outline" size={15} color={neutral} />
        <Text className="text-xs" style={{ color: neutral }}>
          {commentCount}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity className="flex-row items-center gap-0.5" onPress={onRepostOptions}>
        <Ionicons name="repeat" size={15} color={neutral} />
        <Text className="text-xs" style={{ color: neutral }}>
          {repostCount}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default PostActions;
