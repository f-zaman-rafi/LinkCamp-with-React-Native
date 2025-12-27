import React from 'react';
import { Redirect, Stack } from 'expo-router';
import AuthProvider from '../providers/AuthProviders';
import useAuth from '../Hooks/useAuth';
import { ActivityIndicator, View } from 'react-native';
import { UserProvider, useUserContext } from '../providers/UserContext';

const AuthStack = () => {
  // Access authentication state from Firebase auth context
  const { user, loading } = useAuth();
  const { userData } = useUserContext();

  // While Firebase restores auth state (on app start / reload),
  // show a loading indicator to prevent incorrect routing
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!user) {
    return (
      <>
        <Redirect href="/(auth)" />
        <Stack screenOptions={{ headerShown: false }} />
      </>
    );
  }

  if (!user.emailVerified) {
    return (
      <>
        <Redirect href="/(auth)/verify-email" />
        <Stack screenOptions={{ headerShown: false }} />
      </>
    );
  }
  if (!userData || !userData.userType) {
    return (
      <>
        <Redirect href="/(auth)/create-profile" />
        <Stack screenOptions={{ headerShown: false }} />
      </>
    );
  }
  return (
    <>
      <Redirect href="/(tabs)" />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
};

const RootLayout = () => {
  return (
    // Global authentication provider (Firebase auth state)
    <AuthProvider>
      {/* Global user metadata provider (role, verify status, profile info) */}
      <UserProvider>
        <AuthStack />
      </UserProvider>
    </AuthProvider>
  );
};

export default RootLayout;
