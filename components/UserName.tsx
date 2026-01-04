import React from 'react';
import { View, Text } from 'react-native';

type UserNameProps = {
  name?: string | null;
  role?: string | null;
  nameClassName?: string;
  roleClassName?: string;
  wrapperClassName?: string;
};
const capitalize = (value?: string | null) => {
  if (!value) return '';
  return value
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const UserName = ({
  name,
  role,
  nameClassName = 'font-semibold text-slate-900',
  roleClassName = 'text-xs text-slate-500',
  wrapperClassName = 'flex-row items-center gap-2',
}: UserNameProps) => {
  const displayName = capitalize(name) || 'Unknown';
  const displayRole = role ? capitalize(role) : '';

  return (
    <View className={wrapperClassName}>
      <Text className={nameClassName}>{displayName}</Text>
      {displayRole ? <Text className={roleClassName}>({displayRole})</Text> : null}
    </View>
  );
};

export default UserName;
