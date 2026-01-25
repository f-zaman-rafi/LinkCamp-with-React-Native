import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

const AdminUsers = () => {
  return (
    <View className="flex-1">
      <TouchableOpacity
        className="flex-1 items-center justify-center bg-slate-800"
        onPress={() => router.push('/(admin)/users-all')}>
        <Text className="text-xl font-extrabold text-white">All Users</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="flex-1 items-center justify-center bg-blue-600"
        onPress={() => router.push('/(admin)/users-students')}>
        <Text className="text-xl font-extrabold text-white">Students</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="flex-1 items-center justify-center bg-emerald-600"
        onPress={() => router.push('/(admin)/users-teachers')}>
        <Text className="text-xl font-extrabold text-white">Teachers</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="flex-1 items-center justify-center bg-purple-600"
        onPress={() => router.push('/(admin)/users-admins')}>
        <Text className="text-xl font-extrabold text-white">Admins</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="flex-1 items-center justify-center bg-amber-500"
        onPress={() => router.push('/(admin)/users-pending')}>
        <Text className="text-xl font-extrabold text-white">Pending</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="flex-1 items-center justify-center bg-rose-600"
        onPress={() => router.push('/(admin)/users-blocked')}>
        <Text className="text-xl font-extrabold text-white">Blocked</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AdminUsers;
