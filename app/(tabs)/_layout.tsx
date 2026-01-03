import React from 'react';
import { Tabs } from 'expo-router';
import { Image } from 'react-native';
const logo = require('../../assets/logo_linkcamp.png');

const TabLayout = () => {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          headerShown: true,
          headerTitle: () => (
            <Image source={logo} style={{ width: 120, height: 50, resizeMode: 'contain' }} />
          ),
          headerShadowVisible: false, // removes underline
          tabBarLabel: 'Feed',
        }}
      />
      <Tabs.Screen
        name="announcement"
        options={{
          tabBarLabel: "Teacher's Feed",
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="addPost"
        options={{
          tabBarLabel: 'Add Post',
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="noticeboard"
        options={{
          tabBarLabel: 'Administration Feed',
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="pending"
        options={{
          tabBarLabel: 'Pending',
          headerShown: false,
        }}
      />
      <Tabs.Screen name="edit-post" options={{ href: null, headerShown: false }} />
    </Tabs>
  );
};

export default TabLayout;
