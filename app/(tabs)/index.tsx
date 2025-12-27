import { View, Text } from 'react-native';
import React from 'react';
import '../../global.css';
import useAuth from '../../Hooks/useAuth';

const Home = () => {
  const { user } = useAuth();

  console.log(user);

  return (
    <View className="flex-1 items-center justify-center bg-red-800">
      <Text className="text-black-500 text-4xl font-bold">Welcome to LinkCamp!</Text>
    </View>
  );
};

export default Home;
