import React from 'react';
import { Text, View } from 'react-native';
import { useTheme } from '../providers/ThemeProvider';

type UserNameProps = {
  name?: string | null;
  role?: string | null;
  nameClassName?: string;
  roleClassName?: string;
};

const titleCase = (value?: string | null) => {
  if (!value) return '';
  return value
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

const UserName = ({ name, role, nameClassName, roleClassName }: UserNameProps) => {
  const { theme } = useTheme();
  const displayName = titleCase(name) || 'Unknown';
  const displayRole = titleCase(role);

  return (
    <View className="flex-row flex-wrap items-center">
      <Text className={nameClassName} style={{ color: theme.colors.text, fontWeight: '600' }}>
        {displayName}
      </Text>
      {displayRole ? (
        <Text className={roleClassName} style={{ color: theme.colors.subtext, marginLeft: 6 }}>
          ({displayRole})
        </Text>
      ) : null}
    </View>
  );
};

export default UserName;
