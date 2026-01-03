import React from 'react';
import { View, Text, Image } from 'react-native';
import Avatar from './Avatar';
import { ApiPost } from '../types/feed';
import ExpandableText from './ExpandableText';
import { postTypeLabel } from '../utils/postType';

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
        <Avatar uri={post.user?.photo} size={24} />
        <View>
          <Text className="text-xs font-semibold text-slate-800">
            {post.user?.name || 'Unknown'}
          </Text>
          {label ? <Text className="text-[10px] text-slate-500">{label}</Text> : null}
        </View>
      </View>

      <ExpandableText
        text={post.content}
        step={300}
        className="mt-2 text-xs text-slate-800"
        buttonClassName="mt-1 text-xs font-semibold text-blue-600"
      />

      {post.photo ? (
        <Image source={{ uri: post.photo }} className="mt-2 h-40 w-full rounded-lg" />
      ) : null}
    </View>
  );
};

export default RepostPreview;
