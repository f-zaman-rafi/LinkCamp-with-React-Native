import React, { useEffect, useState } from 'react';
import { View, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import useAxiosCommon from '../../Hooks/useAxiosCommon';
import { useUserContext } from '../../providers/UserContext';
import { auth } from '../../firebase/firebase.config';
import ProfileForm, { ProfileFormData } from '../../components/ProfileForm';
import { appendImageToFormData, getMultipartHeaders } from '../../utils/upload';

const UpdateProfilePage = () => {
  const router = useRouter();
  const axiosCommon = useAxiosCommon();
  const { userData, setUserData } = useUserContext();

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
        await appendImageToFormData(formData, 'photo', photoUri, 'profile.jpg');
        hasChanges = true;
      }

      if (!hasChanges) {
        Alert.alert('No changes', 'Nothing to update.');
        return;
      }

      formData.append('email', email);

      const response = await axiosCommon.patch('/user/profile', formData, {
        headers: {
          ...getMultipartHeaders(),
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

      Alert.alert('Updated', 'Profile updated successfully.', [
        { text: 'OK', onPress: () => router.replace('/(tabs)/profile') },
      ]);
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

  if (!initialValues) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white px-6 pb-6">
      <ProfileForm
        initialValues={initialValues}
        initialPhotoUri={initialPhoto}
        requirePhoto={false}
        loading={loading}
        submitLabel="Update Profile"
        onSubmit={onSubmit}
      />
    </View>
  );
};

export default UpdateProfilePage;
