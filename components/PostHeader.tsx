import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Avatar from './Avatar';

type PostHeaderProps = {
  name: string;
  label?: string;
  photoUri?: string;
  onMenu: () => void;
};

const PostHeader = ({ name, label, photoUri, onMenu }: PostHeaderProps) => {
  return (
    <View className="flex-row items-center justify-between">
      <View className="flex-row items-center gap-3">
        <Avatar uri={photoUri} size={40} />
        <View>
          <Text className="font-semibold text-slate-900">{name}</Text>
          {label ? <Text className="text-xs text-slate-500">{label}</Text> : null}
        </View>
      </View>
      <TouchableOpacity onPress={onMenu}>
        <Ionicons name="ellipsis-horizontal" size={18} color="#94a3b8" />
      </TouchableOpacity>
    </View>
  );
};

export default PostHeader;
