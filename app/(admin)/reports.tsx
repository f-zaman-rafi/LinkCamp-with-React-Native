import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

const AdminReports = () => {
  return (
    <View className="flex-1">
      <TouchableOpacity
        className="flex-1 items-center justify-center bg-rose-600"
        onPress={() => router.push('/(admin)/reports-posts')}>
        <Text className="text-xl font-extrabold text-white">Post Reports</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="flex-1 items-center justify-center bg-amber-500"
        onPress={() => router.push('/(admin)/reports-comments')}>
        <Text className="text-xl font-extrabold text-white">Comment Reports</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AdminReports;
