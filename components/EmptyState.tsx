import React from 'react';
import { View, Text } from 'react-native';

type EmptyStateProps = {
  title?: string;
  message?: string;
};

const EmptyState = ({
  title = 'No posts yet',
  message = 'Be the first to share something.',
}: EmptyStateProps) => {
  return (
    <View className="flex-1 items-center justify-center py-16">
      <Text className="text-lg font-semibold text-slate-800">{title}</Text>
      <Text className="mt-1 text-sm text-slate-500">{message}</Text>
    </View>
  );
};

export default EmptyState;
