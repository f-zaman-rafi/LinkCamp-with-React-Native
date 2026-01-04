import React from 'react';
import { Tabs } from 'expo-router';
import { Image, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../providers/ThemeProvider';

const logo = require('../../assets/logo_linkcamp.png');

const TabLayout = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerTitleAlign: 'center',
        headerStyle: { height: 110, backgroundColor: theme.colors.background },
        headerTitleStyle: { color: theme.colors.text, fontWeight: '800', fontSize: 22 },
        headerShadowVisible: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 70,
          paddingBottom: 5,
          paddingTop: 5,
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.border,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.muted,
        headerLeft: () => (
          <Image
            source={logo}
            style={{ width: 52, height: 52, marginLeft: 12, resizeMode: 'contain' }}
          />
        ),
        headerRight: () => (
          <Pressable onPress={toggleTheme} style={{ marginRight: 12 }}>
            <Ionicons
              name={theme.isDark ? 'sunny' : 'moon'}
              size={22}
              color={theme.colors.primary}
            />
          </Pressable>
        ),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Feed',
          tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="announcement"
        options={{
          title: 'Announcements',
          tabBarIcon: ({ color, size }) => <Ionicons name="school" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="addPost"
        options={{
          title: 'Create',
          tabBarIcon: ({ color, size }) => <Ionicons name="add-circle" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="noticeboard"
        options={{
          title: 'Noticeboard',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="shield-checkmark" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="pending"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} />,
        }}
      />
      <Tabs.Screen name="edit-post" options={{ href: null, headerShown: false }} />
    </Tabs>
  );
};

export default TabLayout;
