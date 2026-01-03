import React from 'react';
import { View, Image } from 'react-native';

type AvatarProps = {
  uri?: string;
  size?: number;
};

const Avatar = ({ uri, size = 40 }: AvatarProps) => {
  const style = { width: size, height: size, borderRadius: size / 2 };

  if (uri) {
    return <Image source={{ uri }} style={style} />;
  }

  return <View style={[style, { backgroundColor: '#e2e8f0' }]} />;
};

export default Avatar;
