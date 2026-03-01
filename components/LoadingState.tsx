import React from 'react';
import { View, ActivityIndicator, Text, TouchableOpacity } from 'react-native';

type LoadingStateProps = {
  showWakeNotice?: boolean;
  onReload?: () => void;
};

const LoadingState = ({ showWakeNotice = false, onReload }: LoadingStateProps) => {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <ActivityIndicator size="large" color="#2563eb" />
      {showWakeNotice ? (
        <View className="mt-6 w-11/12 max-w-md rounded-xl border border-slate-200 bg-slate-50 p-4">
          <Text className="text-center text-sm font-semibold text-slate-700">
            Server is waking up
          </Text>
          <Text className="mt-1 text-center text-xs leading-5 text-slate-500">
            This app is running on free hosting. The first request can take a little longer after
            inactivity.
          </Text>
          {onReload ? (
            <TouchableOpacity
              onPress={onReload}
              className="mt-3 self-center rounded-lg border border-slate-300 px-4 py-2">
              <Text className="text-xs font-semibold text-slate-700">Reload</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      ) : null}
    </View>
  );
};

export default LoadingState;
