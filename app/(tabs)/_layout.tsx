import React from 'react';
import { Tabs } from 'expo-router';

const TabLayout = () => {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
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
        name="noticeboard"
        options={{
          tabBarLabel: 'Administration Feed',
          headerShown: false,
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
