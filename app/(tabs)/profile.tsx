import React, { useEffect, useState } from 'react';
import { View, Alert, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import useAxiosCommon from '../../Hooks/useAxiosCommon';
import { useUserContext } from '../../providers/UserContext';
import useAuth from '../../Hooks/useAuth';
import { auth } from '../../firebase/firebase.config';
import AuthHeader from '../../components/AuthHeader';
import ProfileForm, { ProfileFormData } from '../../components/ProfileForm';

const ProfilePage = () => {
  const router = useRouter();
  const axiosCommon = useAxiosCommon();
  const { userData, setUserData, setProfileChecked } = useUserContext();
  const { logOut, loading: authLoading } = useAuth();

  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState<Partial<ProfileFormData> | null>(null);
  const [initialSnapshot, setInitialSnapshot] = useState<ProfileFormData | null>(null);
  const [initialPhoto, setInitialPhoto] = useState<string | null>(null);

  useEffect(() => {
    if (userData) {
      const nameParts = (userData.name || '').split(' ');
      const firstName = nameParts.shift() || '';
      const lastName = nameParts.join(' ');

      const snapshot: ProfileFormData = {
        firstName,
        lastName,
        gender: (userData.gender as any) || '',
        userType: (userData.userType as any) || 'student',
        Id: userData.user_id || '',
        department: userData.department || '',
        session: userData.session || '',
      };

      setInitialValues(snapshot);
      setInitialSnapshot(snapshot);
      setInitialPhoto(userData.photo || null);
    }
  }, [userData]);

  const onSubmit = async (data: ProfileFormData, photoUri: string | null) => {
    if (!initialSnapshot) return;

    setLoading(true);
    try {
      if (!auth.currentUser) {
        Alert.alert('No user', 'Please sign in again.');
        return;
      }

      const idToken = await auth.currentUser.getIdToken();
      const email = auth.currentUser.email || '';
      const fullName = `${data.firstName} ${data.lastName}`.trim();

      const formData = new FormData();
      let hasChanges = false;

      const prevName = `${initialSnapshot.firstName} ${initialSnapshot.lastName}`.trim();
      if (fullName !== prevName) {
        formData.append('name', fullName);
        hasChanges = true;
      }

      if (data.gender !== initialSnapshot.gender) {
        formData.append('gender', data.gender);
        hasChanges = true;
      }

      if (data.userType !== initialSnapshot.userType) {
        formData.append('userType', data.userType);
        hasChanges = true;
      }

      if ((data.Id || '') !== (initialSnapshot.Id || '')) {
        formData.append('user_id', data.Id || '');
        hasChanges = true;
      }

      if ((data.department || '') !== (initialSnapshot.department || '')) {
        formData.append('department', data.department || '');
        hasChanges = true;
      }

      if ((data.session || '') !== (initialSnapshot.session || '')) {
        formData.append('session', data.session || '');
        hasChanges = true;
      }

      const photoChanged = photoUri && photoUri !== initialPhoto;
      if (photoChanged) {
        formData.append('photo', {
          uri: photoUri,
          name: 'profile.jpg',
          type: 'image/jpeg',
        } as any);
        hasChanges = true;
      }

      if (!hasChanges) {
        Alert.alert('No changes', 'Nothing to update.');
        return;
      }

      formData.append('email', email);

      const response = await axiosCommon.patch('/user/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${idToken}`,
        },
      });

      const updated = response?.data?.user;

      setUserData((prev) => ({
        ...(prev || {}),
        name: updated?.name || fullName,
        userType: updated?.userType || data.userType,
        user_id: updated?.user_id || data.Id || '',
        department: updated?.department || data.department || '',
        session: updated?.session || data.session || '',
        gender: updated?.gender || data.gender || '',
        photo: updated?.photo || initialPhoto || '',
        verify: updated?.verify || prev?.verify || 'pending',
      }));

      Alert.alert('Updated', 'Profile updated successfully.');
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Something went wrong. Please try again.';
      Alert.alert('Profile Error', message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logOut();
      setUserData(null);
      setProfileChecked(false);
      router.replace('/(auth)');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (!initialValues) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <View className="flex-1 justify-center bg-white px-6">
      <ProfileForm
        initialValues={initialValues}
        initialPhotoUri={initialPhoto}
        requirePhoto={false}
        loading={loading}
        submitLabel="Update Profile"
        onSubmit={onSubmit}
      />

      <View className="mt-6">
        <TouchableOpacity
          className={`w-full rounded-xl py-4 shadow-sm ${authLoading ? 'bg-blue-300' : 'bg-blue-600'}`}
          onPress={handleLogout}
          disabled={authLoading}>
          {authLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-center text-lg font-bold text-white">Log Out</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProfilePage;
