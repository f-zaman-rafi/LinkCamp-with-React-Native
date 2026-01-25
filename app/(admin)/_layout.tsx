import React from 'react';
import { router, Tabs } from 'expo-router';
import { Image, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const logo = require('../../assets/logo_linkcamp.png');

const AdminLayout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerTitleAlign: 'center',
        tabBarStyle: { height: 70, paddingBottom: 5, paddingTop: 5 },
        headerStyle: { height: 110 },
        headerShadowVisible: false,
        headerLeft: () => (
          <Image
            source={logo}
            style={{ width: 44, height: 44, marginLeft: 12, tintColor: '#22c55e' }}
          />
        ),
        headerRight: () => (
          <TouchableOpacity className="mr-5" onPress={() => router.replace('/(tabs)')}>
            <Ionicons name="exit-outline" size={27} color="red" />
          </TouchableOpacity>
        ),
      }}>
      <Tabs.Screen
        name="users"
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="people" size={size} color={color} />,
          headerTitle: () => (
            <Text className="text-2xl font-extrabold text-[#0B1F3A]">Admin-Panel</Text>
          ),
        }}
      />

      <Tabs.Screen
        name="reports"
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="flag" size={size} color={color} />,
          headerTitle: () => (
            <Text className="text-2xl font-extrabold text-[#0B1F3A]">Admin-Panel</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="users-all"
        options={{
          href: null,
          headerTitle: () => (
            <Text className="text-2xl font-extrabold text-[#0B1F3A]">All Users</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="users-students"
        options={{
          href: null,
          headerTitle: () => (
            <Text className="text-2xl font-extrabold text-[#0B1F3A]">Students</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="users-teachers"
        options={{
          href: null,
          headerTitle: () => (
            <Text className="text-2xl font-extrabold text-[#0B1F3A]">Teachers</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="users-admins"
        options={{
          href: null,
          headerTitle: () => <Text className="text-2xl font-extrabold text-[#0B1F3A]">Admins</Text>,
        }}
      />
      <Tabs.Screen
        name="users-pending"
        options={{
          href: null,
          headerTitle: () => (
            <Text className="text-2xl font-extrabold text-[#0B1F3A]">Pending</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="users-blocked"
        options={{
          href: null,
          headerTitle: () => (
            <Text className="text-2xl font-extrabold text-[#0B1F3A]">Blocked</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="user/[id]"
        options={{
          href: null,
          headerTitle: () => <Text className="text-2xl font-extrabold text-[#0B1F3A]">User</Text>,
        }}
      />
      <Tabs.Screen
        name="reports-posts"
        options={{
          href: null,
          headerTitle: () => (
            <Text className="text-2xl font-extrabold text-[#0B1F3A]">Post Reports</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="reports-comments"
        options={{
          href: null,
          headerTitle: () => (
            <Text className="text-2xl font-extrabold text-[#0B1F3A]">Comment Reports</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="report-post/[id]"
        options={{
          href: null,
          headerTitle: () => (
            <Text className="text-2xl font-extrabold text-[#0B1F3A]">Post Report</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="report-comment/[id]"
        options={{
          href: null,
          headerTitle: () => (
            <Text className="text-2xl font-extrabold text-[#0B1F3A]">Comment Report</Text>
          ),
        }}
      />
    </Tabs>
  );
};

export default AdminLayout;
