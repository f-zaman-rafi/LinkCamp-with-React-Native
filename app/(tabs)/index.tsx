import { View, Text, Image } from 'react-native';
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
      {/* Replace <img> with <Image> component */}
      <View className="rounded-full">
        <Image source={{ uri: userData?.photo }} style={{ width: 100, height: 100 }} />
      </View>
    </View>
  );
};

export default Home;
