import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import useAuth from '../../Hooks/useAuth';
import { useUserContext } from '../../providers/UserContext';

const Blocked = () => {
  const router = useRouter();
  const { logOut } = useAuth();
  const { setUserData, setProfileChecked } = useUserContext();

  return (
    <View className="flex-1 justify-center bg-white px-6">
      <View className="rounded-2xl border border-red-200 bg-red-50 p-5">
        <Text className="text-lg font-bold text-red-700">Account blocked</Text>
        <Text className="mt-2 text-red-600">
          Your account is blocked. Please contact campus support to resolve this.
        </Text>
      </View>

      <TouchableOpacity
        className="mt-6 rounded-xl bg-stone-800 py-4"
        onPress={async () => {
          await logOut();
          setUserData(null);
          setProfileChecked(false);
          router.replace('/(auth)');
        }}>
        <Text className="text-center text-lg font-bold text-white">Log out</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Blocked;
