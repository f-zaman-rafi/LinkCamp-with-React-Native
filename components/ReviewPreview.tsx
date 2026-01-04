import React from 'react';
import { View, Text, Image } from 'react-native';
import Avatar from './Avatar';
import { ApiPost } from '../types/feed';
import ExpandableText from './ExpandableText';
import { postTypeLabel } from '../utils/postType';
import UserName from './UserName';
import { useTheme } from '../providers/ThemeProvider';

const RepostPreview = ({ post }: { post?: ApiPost }) => {
  const { theme } = useTheme();

  if (!post) {
    return (
      <View
        className="mt-3 rounded-xl border px-3 py-2"
        style={{ borderColor: theme.colors.border, backgroundColor: theme.colors.surface }}>
        <Text className="text-xs" style={{ color: theme.colors.subtext }}>
          Original post unavailable.
        </Text>
      </View>
    );
  }

  const label = postTypeLabel(post.postType);

  return (
    <View
      className="mt-3 rounded-xl border p-3"
      style={{ borderColor: theme.colors.border, backgroundColor: theme.colors.surface }}>
      <View className="flex-row items-center gap-2">
        <Avatar uri={post.user?.photo} size={24} />
        <View>
          <UserName
            name={post.user?.name}
            role={post.user?.user_type}
            nameClassName="text-xs font-semibold"
            roleClassName="text-[10px]"
          />
          {label ? (
            <Text className="text-[10px]" style={{ color: theme.colors.subtext }}>
              {label}
            </Text>
          ) : null}
        </View>
      </View>

      <ExpandableText
        text={post.content?.slice(0, 2000)}
        step={250}
        className="mt-2 text-xs"
        buttonClassName="mt-1 text-xs font-semibold"
        textStyle={{ color: theme.colors.text }}
        buttonStyle={{ color: theme.colors.primary }}
      />

      {post.photo ? (
        <Image source={{ uri: post.photo }} className="mt-2 h-40 w-full rounded-lg" />
      ) : null}
    </View>
  );
};

export default RepostPreview;
