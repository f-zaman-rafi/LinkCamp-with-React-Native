import React from 'react';
import { View, ActivityIndicator } from 'react-native';

const LoadingState = () => {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <ActivityIndicator size="large" color="#2563eb" />
    </View>
  );
};

export default LoadingState;
