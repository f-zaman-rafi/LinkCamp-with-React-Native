import React from 'react';
import { Tabs } from 'expo-router';
import { Image, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const logo = require('../../assets/logo_linkcamp.png');

const TabLayout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerTitleAlign: 'center',
        headerStyle: { height: 110 },
        headerTitle: () => (
          <Image source={logo} style={{ width: 70, height: 70, resizeMode: 'contain' }} />
        ),
        headerShadowVisible: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
          headerLeft: () => (
            <Text className="ml-4 text-3xl font-extrabold text-[#0B1F3A]">Feed</Text>
          ),
        }}
      />

      <Tabs.Screen
        name="announcement"
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="school" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="addPost"
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="add-circle" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="noticeboard"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="shield-checkmark" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="pending"
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} />,
        }}
      />
      <Tabs.Screen name="edit-post" options={{ href: null, headerShown: false }} />
    </Tabs>
  );
};

export default TabLayout;
