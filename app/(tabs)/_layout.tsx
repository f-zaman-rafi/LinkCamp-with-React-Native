import React from 'react';
import { Tabs } from 'expo-router';
import { Image, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const logo = require('../../assets/logo_linkcamp.png');

const TabLayout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: '#0B1F3A',
        tabBarInactiveTintColor: '#94a3b8',
        headerTintColor: '#0B1F3A',
        headerTitleStyle: { color: '#0B1F3A', fontWeight: '800', fontSize: 20 },

        headerTitleAlign: 'center',
        tabBarStyle: { height: 70, paddingBottom: 5, paddingTop: 5 },
        headerStyle: { height: 110 },
        headerShadowVisible: false,
        headerLeft: () => <Image source={logo} style={{ width: 44, height: 44, marginLeft: 12 }} />,
        headerRight: () => (
          <TouchableOpacity className="mr-4">
            <Ionicons name="notifications-outline" size={22} color="#0B1F3A" />
          </TouchableOpacity>
        ),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: () => null,
          tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
          headerTitle: () => <Text className="text-2xl font-extrabold text-[#292524]">Feed</Text>,
        }}
      />

      <Tabs.Screen
        name="announcement"
        options={{
          tabBarLabel: () => null,
          tabBarIcon: ({ color, size }) => <Ionicons name="school" size={size} color={color} />,
          headerTitle: () => (
            <Text className="text-xl font-extrabold text-[#292524]">Announcements</Text>
          ),
        }}
      />

      <Tabs.Screen
        name="addPost"
        options={{
          tabBarLabel: () => null,
          tabBarIcon: ({ color, size }) => <Ionicons name="add-circle" size={size} color={color} />,
          headerTitle: () => <Text className="text-2xl font-extrabold text-[#292524]">Create</Text>,
        }}
      />

      <Tabs.Screen
        name="noticeboard"
        options={{
          tabBarLabel: () => null,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="shield-checkmark" size={size} color={color} />
          ),
          headerTitle: () => (
            <Text className="text-2xl font-extrabold text-[#292524]">Noticeboard</Text>
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: () => null,
          tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} />,
          headerTitle: () => (
            <Text className="text-2xl font-extrabold text-[#292524]">Profile</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="update-profile"
        options={{
          href: null,
          headerShown: true,
          headerTitle: 'Edit Profile',
        }}
      />
      <Tabs.Screen name="edit-post" options={{ href: null, headerShown: false }} />
    </Tabs>
  );
};

export default TabLayout;
