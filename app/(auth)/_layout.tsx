import React from 'react';
import { Stack } from 'expo-router';

const AuthLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Default auth screen (e.g., login) */}
      <Stack.Screen name="index" />

      {/* Signup screen */}
      <Stack.Screen name="signup" />

      {/* Email verification screen */}
      <Stack.Screen name="verify-email" />

      {/* Create profile after verification */}
      <Stack.Screen name="create-profile" />
    </Stack>
  );
};

export default AuthLayout;
