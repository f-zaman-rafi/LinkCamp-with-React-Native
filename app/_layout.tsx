import React from 'react';
import { Redirect, Stack, useSegments } from 'expo-router';
import AuthProvider from '../providers/AuthProviders';
import useAuth from '../Hooks/useAuth';
import { ActivityIndicator, View } from 'react-native';
import { UserProvider, useUserContext } from '../providers/UserContext';

const AuthStack = () => {
  const segments = useSegments() as string[];
  const { user, loading } = useAuth();
  const { userData, userDataLoading, profileChecked } = useUserContext();

  const inAuthGroup = segments[0] === '(auth)';
  const onVerify = segments[0] === '(auth)' && segments[1] === 'verify-email';
  const onCreate = segments[0] === '(auth)' && segments[1] === 'create-profile';
  const onBlocked = segments[0] === '(auth)' && segments[1] === 'blocked';

  const shouldWaitForProfile = user?.emailVerified && !profileChecked && !onCreate;

  if (loading || userDataLoading || shouldWaitForProfile) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!user) {
    // block protected auth pages when not signed in
    if (onVerify || onCreate) return <Redirect href="/(auth)" />;

    if (!inAuthGroup) return <Redirect href="/(auth)" />;
    return <Stack screenOptions={{ headerShown: false }} />;
  }

  if (!user.emailVerified) {
    if (!onVerify) return <Redirect href="/(auth)/verify-email" />;
    return <Stack screenOptions={{ headerShown: false }} />;
  }

  if (!userData || !userData.userType) {
    if (onBlocked) return <Stack screenOptions={{ headerShown: false }} />;
    if (!onCreate) return <Redirect href="/(auth)/create-profile" />;
    return <Stack screenOptions={{ headerShown: false }} />;
  }

  if (inAuthGroup) {
    return <Redirect href="/(tabs)" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
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
