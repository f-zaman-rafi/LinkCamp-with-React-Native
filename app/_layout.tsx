import React from 'react';
import { Redirect, Stack } from 'expo-router';
import AuthProvider from '../providers/AuthProviders';
import useAuth from '../Hooks/useAuth';
import { ActivityIndicator, View } from 'react-native';
import { UserProvider } from '../providers/UserContext';

const AuthStack = () => {
  // Access authentication state from Firebase auth context
  const { user, loading } = useAuth();

  // While Firebase restores auth state (on app start / reload),
  // show a loading indicator to prevent incorrect routing
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <>
      {/* 
        Route user based on authentication state:
        - Authenticated users go to the main tab navigation
        - Unauthenticated users go to auth screens (login/signup)
      */}
      {user ? <Redirect href="/(tabs)" /> : <Redirect href="/(auth)" />}

      {/* 
        Stack must always be mounted for Expo Router.
        Screens are resolved based on the active route group.
      */}
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
