import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Avatar from './Avatar';
import UserName from './UserName';
import { useTheme } from '../providers/ThemeProvider';

type PostHeaderProps = {
  name: string;
  label?: string;
  photoUri?: string;
  role?: string;
  onMenu: () => void;
};

const PostHeader = ({ name, label, photoUri, role, onMenu }: PostHeaderProps) => {
  const { theme } = useTheme();

  return (
    <View className="flex-row items-center justify-between">
      <View className="flex-row items-center gap-3">
        <Avatar uri={photoUri} size={40} />
        <View>
          <UserName name={name} role={role} />
          {label ? (
            <Text className="text-xs" style={{ color: theme.colors.subtext }}>
              {label}
            </Text>
          ) : null}
        </View>
      </View>
      <TouchableOpacity onPress={onMenu}>
        <Ionicons name="ellipsis-horizontal" size={18} color={theme.colors.subtext} />
      </TouchableOpacity>
    </View>
  );
};

export default PostHeader;
