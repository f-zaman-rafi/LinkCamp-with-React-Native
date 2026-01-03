import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
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
  const STEP = 300;
  const [visibleChars, setVisibleChars] = useState(STEP);

  if (!post) {
    return (
      <View className="mt-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
        <Text className="text-xs text-slate-500">Original post unavailable.</Text>
      </View>
    );
  }

  const total = post.content?.length || 0;
  const isLong = total > visibleChars;
  const displayText = post.content?.slice(0, visibleChars) || '';

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

      {displayText ? (
        <>
          <Text className="mt-2 text-xs text-slate-800">
            {displayText}
            {isLong ? '...' : ''}
          </Text>

          {isLong ? (
            <TouchableOpacity onPress={() => setVisibleChars((v) => v + STEP)}>
              <Text className="mt-1 text-xs font-semibold text-blue-600">See more</Text>
            </TouchableOpacity>
          ) : total > STEP ? (
            <TouchableOpacity onPress={() => setVisibleChars(STEP)}>
              <Text className="mt-1 text-xs font-semibold text-blue-600">See less</Text>
            </TouchableOpacity>
          ) : null}
        </>
      ) : null}
      {post.photo ? (
        <Image source={{ uri: post.photo }} className="mt-2 h-40 w-full rounded-lg" />
      ) : null}
    </View>
  );
};

export default RepostPreview;
