import React from 'react';
import { View, Text } from 'react-native';
import useUser from '../../Hooks/useUser';
import useAuth from '../../Hooks/useAuth';

const SomeComponent = () => {
  const userData = useUser(); // Accessing the user data (role, verify status, name)
  const { user } = useAuth();
  console.log('user Credential', user);
  console.log('user data', userData);
  return (
    <View>
      <Text>User Role: {userData?.role}</Text>
      <Text>Verification Status: {userData?.verify}</Text>
      <Text>Name:::::: {userData?.name}</Text>
    </View>
  );
};

export default SomeComponent;
