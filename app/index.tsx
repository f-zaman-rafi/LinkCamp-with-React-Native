import { View, Text } from 'react-native';
import React from 'react';
import '../global.css';

const Home = () => {
  return (
    <View className="flex-1 items-center justify-center bg-stone-800">
      <Text className="text-blue-500">Welcome to LinkCamp!</Text>
    </View>
  );
};

export default Home;
