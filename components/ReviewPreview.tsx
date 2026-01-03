import React from 'react';
import { View, Text, Image } from 'react-native';
import Avatar from './Avatar';
import { ApiPost, PostType } from '../types/feed';

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
        <Avatar uri={post.user?.photo} size={24} />
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

export default RepostPreview;
