import React from 'react';
import { View, Text } from 'react-native';

type AuthHeaderProps = {
  title?: string;
  subtitle?: string;
  containerClassName?: string;
};

const AuthHeader = ({
  subtitle = 'University Campus Platform',
  containerClassName = 'mt-20 mb-4',
}: AuthHeaderProps) => {
  return (
    <View className={containerClassName}>
      <Text className="text-4xl font-extrabold">
        <Text className="text-red-500">Link</Text>
        <Text className="text-stone-700">Camp</Text>
      </Text>

      {subtitle ? <Text className="mt-2 text-lg text-slate-500">{subtitle}</Text> : null}
    </View>
  );
};

export default AuthHeader;
