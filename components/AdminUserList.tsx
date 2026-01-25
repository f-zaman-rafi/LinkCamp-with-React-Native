import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import useAdminUsers, { AdminUser } from '../Hooks/useAdminUsers';
import LoadingState from './LoadingState';

type AdminUserListProps = {
  title: string;
  query?: { role?: string; verify?: string };
  returnPath: string;
};

const AdminUserList = ({ title, query = {}, returnPath }: AdminUserListProps) => {
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<'name_asc' | 'name_desc'>('name_asc');

  const { users, loading, hasNext, hasPrev, refresh } = useAdminUsers({
    role: query.role,
    verify: query.verify,
    page,
    limit: 20,
    sort,
  });

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  const toggleSort = () => {
    setPage(1);
    setSort((prev) => (prev === 'name_asc' ? 'name_desc' : 'name_asc'));
  };

  const renderItem = ({ item, index }: { item: AdminUser; index: number }) => (
    <TouchableOpacity
      className="flex-row border-b border-slate-100 px-4 py-3"
      onPress={() => router.push(`/(admin)/user/${item._id}?from=${returnPath}`)}>
      <Text className="w-10 text-sm text-slate-500">{(page - 1) * 20 + index + 1}</Text>
      <Text className="flex-1 text-sm font-semibold text-slate-900">{item.name || 'Unknown'}</Text>
      <Text className="w-24 text-xs text-slate-500">{item.userType}</Text>
      <Text className="w-24 text-xs text-slate-500">{item.verify}</Text>
    </TouchableOpacity>
  );

  if (loading) return <LoadingState />;

  return (
    <View className="flex-1 bg-white">
      <Text className="px-4 pt-4 text-xl font-bold text-slate-900">{title}</Text>

      <View className="mt-4 flex-row border-b border-slate-200 bg-slate-50 px-4 py-2">
        <Text className="w-10 text-xs font-semibold text-slate-500">#</Text>

        <TouchableOpacity className="flex-1 flex-row items-center gap-1" onPress={toggleSort}>
          <Text className="text-xs font-semibold text-slate-500">Name</Text>
          <Ionicons
            name={sort === 'name_asc' ? 'arrow-up' : 'arrow-down'}
            size={12}
            color="#64748b"
          />
        </TouchableOpacity>

        <Text className="w-24 text-xs font-semibold text-slate-500">Role</Text>
        <Text className="w-24 text-xs font-semibold text-slate-500">Status</Text>
      </View>

      <FlatList
        data={users}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        ListEmptyComponent={
          <View className="mt-16 items-center">
            <Text className="text-sm text-slate-500">No users found.</Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 80 }}
      />

      <View className="absolute right-0 bottom-4 left-0 flex-row justify-between px-6">
        <TouchableOpacity
          className={`rounded-lg px-4 py-2 ${hasPrev ? 'bg-slate-800' : 'bg-slate-300'}`}
          disabled={!hasPrev}
          onPress={() => setPage((p) => Math.max(1, p - 1))}>
          <Text className="text-white">Prev</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`rounded-lg px-4 py-2 ${hasNext ? 'bg-slate-800' : 'bg-slate-300'}`}
          disabled={!hasNext}
          onPress={() => setPage((p) => p + 1)}>
          <Text className="text-white">Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AdminUserList;
