import React from 'react';
import { View, Text } from 'react-native';

type AuthHeaderProps = {
  title?: string;
  subtitle?: string;
  containerClassName?: string;
};

const AuthHeader = ({
  title = 'LinkCamp',
  subtitle = 'University Campus Platform',
  containerClassName = 'mt-20 mb-4',
}: AuthHeaderProps) => {
  return (
    <View className={containerClassName}>
      <Text className="text-4xl font-extrabold text-blue-600">{title}</Text>
      {subtitle ? <Text className="mt-2 text-lg text-slate-500">{subtitle}</Text> : null}
    </View>
  );
};

export default AuthHeader;
