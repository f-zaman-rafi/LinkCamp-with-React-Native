import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';

const ReportCommentDetail = () => {
  const { id, from } = useLocalSearchParams<{ id: string; from?: string }>();
  const axiosSecure = useAxiosSecure();
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axiosSecure.get('/admin/reported-comments', {
          params: { commentId: id },
        });
        setComment(res.data?.items?.[0] || null);
      } catch {
        Alert.alert('Error', 'Unable to load report.');
      } finally {
        setLoading(false);
      }
    };
    if (id) load();
  }, [id, axiosSecure]);

  const goBack = () => {
    if (from) router.replace(from);
    else router.back();
  };

  const handleDelete = async () => {
    try {
      await axiosSecure.delete(`/admin/reported-comments/${id}`);
      Alert.alert('Deleted', 'Comment deleted.');
      goBack();
    } catch {
      Alert.alert('Error', 'Delete failed.');
    }
  };

  const handleDismiss = async () => {
    try {
      await axiosSecure.delete(`/admin/reported-comments/${id}/dismiss`);
      Alert.alert('Dismissed', 'Reports cleared.');
      goBack();
    } catch {
      Alert.alert('Error', 'Dismiss failed.');
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!comment) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text>No report found.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white px-6 pt-6">
      <Text className="text-lg font-bold text-slate-900">Reported Comment</Text>
      <Text className="mt-2 text-sm text-slate-700">{comment.content || 'No content'}</Text>
      <Text className="mt-2 text-xs text-slate-500">Report Count: {comment.reportCount || 0}</Text>

      {comment.post ? (
        <View className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <Text className="text-xs text-slate-500">Original Post</Text>
          <Text className="mt-2 text-sm text-slate-700">
            {comment.post.content || 'No content'}
          </Text>
        </View>
      ) : null}

      <TouchableOpacity className="mt-6 rounded-xl bg-red-600 py-4" onPress={handleDelete}>
        <Text className="text-center text-lg font-bold text-white">Delete Comment</Text>
      </TouchableOpacity>

      <TouchableOpacity className="mt-3 rounded-xl bg-slate-800 py-4" onPress={handleDismiss}>
        <Text className="text-center text-lg font-bold text-white">Dismiss Reports</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ReportCommentDetail;
