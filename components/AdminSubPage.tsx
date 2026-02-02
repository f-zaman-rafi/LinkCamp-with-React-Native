import React from 'react';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function AdminSubPage({
  children,
  backTo,
}: {
  children: React.ReactNode;
  backTo?: string;
}) {
  const router = useRouter();
  const { from } = useLocalSearchParams<{ from?: string }>();

  return (
    <>
      <Stack.Screen
        options={{
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                if (from) router.replace(from);
                else if (backTo) router.replace(backTo);
                else router.back();
              }}
              style={{ paddingHorizontal: 12 }}>
              <Ionicons name="chevron-back" size={22} color="#0B1F3A" />
            </TouchableOpacity>
          ),
        }}
      />
      {children}
    </>
  );
}
