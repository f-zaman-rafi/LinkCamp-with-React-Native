import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import ProfileForm, { ProfileFormData } from '../../../components/ProfileForm';

const AdminUserDetail = () => {
  const { id, from } = useLocalSearchParams<{ id: string; from?: string }>();
  const axiosSecure = useAxiosSecure();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [initialValues, setInitialValues] = useState<Partial<ProfileFormData> | null>(null);
  const [initialPhoto, setInitialPhoto] = useState<string | null>(null);
  const [status, setStatus] = useState<'pending' | 'approved' | 'blocked'>('pending');

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await axiosSecure.get(`/admin/users/${id}`);
        const u = res.data;

        const nameParts = (u.name || '').split(' ');
        const firstName = nameParts.shift() || '';
        const lastName = nameParts.join(' ');

        setInitialValues({
          firstName,
          lastName,
          gender: u.gender || '',
          userType: u.userType || 'student',
          Id: u.user_id || '',
          department: u.department || '',
          session: u.session || '',
        });
        setInitialPhoto(u.photo || null);
        setStatus(u.verify || 'pending');
      } catch {
        Alert.alert('Error', 'Unable to load user.');
      } finally {
        setLoading(false);
      }
    };

    if (id) loadUser();
  }, [id, axiosSecure]);

  const updateStatus = async () => {
    if (!id) return;
    setSaving(true);
    try {
      await axiosSecure.patch(`/admin/users/${id}`, { verify: status });
      Alert.alert('Updated', 'User status updated.');
      // after successful update:
      if (from) router.replace(from);
      else router.back();
    } catch {
      Alert.alert('Error', 'Unable to update status.');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !initialValues) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white px-6">
      <View className="my-4">
        <Text className="mb-2 text-xs font-semibold text-slate-500">Status</Text>
        <View className="flex-row gap-3">
          {(['pending', 'approved', 'blocked'] as const).map((s) => (
            <TouchableOpacity
              key={s}
              className={`flex-1 rounded-xl py-3 ${status === s ? 'bg-slate-800' : 'bg-slate-200'}`}
              onPress={() => setStatus(s)}>
              <Text
                className={`text-center font-semibold ${status === s ? 'text-white' : 'text-slate-700'}`}>
                {s.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <ProfileForm
        initialValues={initialValues}
        initialPhotoUri={initialPhoto}
        requirePhoto={false}
        onSubmit={() => {}}
        readOnly
        hideSubmit
      />

      <TouchableOpacity
        className={`my-2 rounded-xl py-4 ${saving ? 'bg-slate-300' : 'bg-red-600'}`}
        onPress={updateStatus}
        disabled={saving}>
        <Text className="text-center text-lg font-bold text-white">
          {saving ? 'Saving...' : 'Save Status'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default AdminUserDetail;
