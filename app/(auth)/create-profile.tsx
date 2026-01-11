import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import useAxiosCommon from '../../Hooks/useAxiosCommon';
import { useUserContext } from '../../providers/UserContext';
import { auth } from '../../firebase/firebase.config';
import AuthHeader from '../../components/AuthHeader';
import ProfileForm, { ProfileFormData } from '../../components/ProfileForm';
import useAuth from '../../Hooks/useAuth';

const CreateProfile = () => {
  const router = useRouter();
  const axiosCommon = useAxiosCommon();
  const { setUserData, setProfileChecked } = useUserContext();
  const [loading, setLoading] = useState(false);
  const { logOut } = useAuth();

  const onSubmit = async (data: ProfileFormData, photoUri: string | null) => {
    setLoading(true);
    try {
      if (!auth.currentUser) {
        Alert.alert('No user', 'Please sign in again.');
        return;
      }

      await auth.currentUser.reload();
      if (!auth.currentUser.emailVerified) {
        Alert.alert('Not verified', 'Please verify your email first.');
        router.replace('/(auth)/verify-email');
        return;
      }

      const idToken = await auth.currentUser.getIdToken();
      const email = auth.currentUser.email || '';
      const fullName = `${data.firstName} ${data.lastName}`.trim();

      const formData = new FormData();
      formData.append('email', email);
      formData.append('user_id', data.Id || '');
      formData.append('userType', data.userType);
      formData.append('department', data.department || '');
      formData.append('session', data.session || '');
      formData.append('verify', 'pending');
      formData.append('name', fullName);
      formData.append('gender', data.gender);

      if (photoUri) {
        formData.append('photo', {
          uri: photoUri,
          name: 'profile.jpg',
          type: 'image/jpeg',
        } as any);
      }

      const response = await axiosCommon.post('/users', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${idToken}`,
        },
      });

      const photoUrl = response?.data?.user?.photo || '';

      setUserData({
        name: fullName,
        userType: data.userType,
        user_id: data.Id || '',
        department: data.department || '',
        session: data.session || '',
        gender: data.gender || '',
        photo: photoUrl,
        verify: 'pending',
      });

      setProfileChecked(true);

      Alert.alert('Success', 'Profile created! Your account is pending approval.', [
        { text: 'OK', onPress: () => router.replace('/(tabs)') },
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

  const handleLogout = async () => {
    await logOut();
    setUserData(null);
    setProfileChecked(false);
    router.replace('/(auth)');
  };

  return (
    <View className="flex-1 justify-center bg-white px-6">
      <AuthHeader containerClassName="mb-8 mt-20" />

      <ProfileForm
        requirePhoto
        loading={loading}
        submitLabel="Save Profile"
        onSubmit={onSubmit}
        secondaryLabel="Setup Later (Logout)"
        onSecondaryPress={handleLogout}
      />
    </View>
  );
};

export default CreateProfile;
