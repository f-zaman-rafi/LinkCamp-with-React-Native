import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import useAdminReports from '../Hooks/useAdminReports';
import LoadingState from './LoadingState';

type AdminReportListProps = {
  type: 'posts' | 'comments';
  returnPath: string;
};

const AdminReportList = ({ type, returnPath }: AdminReportListProps) => {
  const [page, setPage] = useState(1);
  const { items, loading, refresh } = useAdminReports(type, page, 20);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  if (loading) return <LoadingState />;

  return (
    <View className="flex-1 bg-white">
      <View className="mt-4 flex-row border-b border-slate-200 bg-slate-50 px-4 py-2">
        <Text className="w-10 text-xs font-semibold text-slate-500">#</Text>
        <Text className="flex-1 text-xs font-semibold text-slate-500">
          {type === 'posts' ? 'Post' : 'Comment'}
        </Text>
        <Text className="w-20 text-xs font-semibold text-slate-500">Reports</Text>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item._id}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            className="flex-row border-b border-slate-100 px-4 py-3"
            onPress={() =>
              router.push({
                pathname:
                  type === 'posts' ? '/(admin)/report-post/[id]' : '/(admin)/report-comment/[id]',
                params: { id: item._id, from: returnPath },
              })
            }>
            <Text className="w-10 text-sm text-slate-500">{(page - 1) * 20 + index + 1}</Text>
            <Text className="flex-1 text-sm text-slate-900">
              {item.content?.slice(0, 40) || 'No content'}
            </Text>
            <Text className="w-20 text-sm text-slate-500">{item.reportCount || 0}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View className="mt-16 items-center">
            <Text className="text-sm text-slate-500">No reports.</Text>
          </View>
        }
      />
    </View>
  );
};

export default AdminReportList;
