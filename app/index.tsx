import React from 'react';
import { Redirect } from 'expo-router';

const RootIndex = () => {
  return <Redirect href="/(auth)" />;
};

export default RootIndex;
