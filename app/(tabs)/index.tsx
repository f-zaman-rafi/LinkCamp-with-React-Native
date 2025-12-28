import { View, Text } from 'react-native';
import React from 'react';
import '../../global.css';
import useUser from '../../Hooks/useUser';

const Home = () => {
  const userData = useUser();

  return (
    <View className="flex-1 items-center justify-center bg-red-800">
      <Text className="text-black-500 text-4xl font-bold">Welcome to LinkCamp!</Text>
      <Text className="text-black-500 text-4xl font-bold">{userData?.name}</Text>
      <Text className="text-black-500 text-4xl font-bold">{userData?.userType}</Text>
      <Text className="text-black-500 text-4xl font-bold">{userData?.department}</Text>
      <Text className="text-black-500 text-4xl font-bold">{userData?.user_id}</Text>
    </View>
  );
};

export default Home;
