import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  Image,
} from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { useRouter } from 'expo-router';
import { Dropdown } from 'react-native-element-dropdown';
import useAxiosCommon from '../../Hooks/useAxiosCommon';
import { useUserContext } from '../../providers/UserContext';
import { auth } from '../../firebase/firebase.config';
import * as ImagePicker from 'expo-image-picker';
import AuthHeader from '../../components/AuthHeader';

type UserType = 'student' | 'teacher' | 'admin';
type GenderType = '' | 'male' | 'female' | 'other';

type ProfileFormData = {
  firstName: string;
  lastName: string;
  gender: GenderType;
  userType: UserType;
  Id?: string;
  department?: string;
  session?: string;
  photo?: string;
};

const CreateProfile = () => {
  const router = useRouter(); // Router for navigation
  const axiosCommon = useAxiosCommon(); // Axios hook for API
  const { setUserData, setProfileChecked } = useUserContext(); // User context setters
  const [loading, setLoading] = useState(false); // Loading state
  const [photoUri, setPhotoUri] = useState<string | null>(null); // Profile photo URI

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<ProfileFormData>({
    defaultValues: {
      firstName: '',
      lastName: '',
      gender: '',
      userType: 'student',
      Id: '',
      department: '',
      session: '',
    },
  });

  // Watch userType to conditionally render fields
  const selectedUserType = watch('userType');

  // Reset dependent fields when userType changes
  React.useEffect(() => {
    // Reset fields when userType changes
    setValue('Id', '');
    setValue('department', '');
    setValue('session', '');
  }, [selectedUserType, setValue]);

  // Handle form submission
  const onSubmit = async (data: ProfileFormData) => {
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

      if (!photoUri) {
        setError('photo', { type: 'required', message: 'Photo is required' });
        setLoading(false);
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
        photo: photoUrl,
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

  // Department options
  const departments = [
    'Computer Science',
    'Electrical Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Business Administration',
    'Economics',
    'Accounting & Finance',
    'English',
    'Law',
    'Pharmacy',
  ].map((item) => ({ label: item, value: item })); // Dept options
  // Session options
  const sessions = Array.from({ length: 2025 - 2003 + 1 }, (_, i) => {
    const year = 2025 - i;
    return { label: `${year}-${year + 1}`, value: `${year}-${year + 1}` };
  });

  // Gender options
  const genders = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Other', value: 'other' },
  ];

  const pickPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
      clearErrors('photo');
    }
  };

  const onError = (formErrors: any) => {
    if (!photoUri) {
      setError('photo', { type: 'required', message: 'Photo is required' });
    }
  };

  return (
    <View className="flex-1 justify-center bg-white px-6">
      {/* Header */}
      <AuthHeader containerClassName="mb-8" />

      {/* Profile Form */}

      <ScrollView
        className="mt-8 mb-12"
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}>
        {/* // Profile Photo Picker */}
        {photoUri ? (
          <Image
            source={{ uri: photoUri }}
            style={{
              width: 120,
              height: 120,
              borderRadius: 60,
              alignSelf: 'center',
              marginBottom: 12,
            }}
          />
        ) : null}
        <View className="mb-4">
          <TouchableOpacity
            onPress={pickPhoto}
            className="rounded-xl border border-slate-300 px-4 py-3">
            <Text className="text-center text-slate-600">
              {photoUri ? 'Photo Selected' : 'Select Profile Photo'}
            </Text>
          </TouchableOpacity>
          {errors.photo && (
            <Text className="mt-1 text-xs text-red-500">{errors.photo.message}</Text>
          )}
        </View>
        <View className="mb-4">
          <Text className="mb-2 font-semibold">First Name</Text>
          <Controller
            control={control}
            name="firstName"
            rules={{ required: 'First name is required' }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                className={`h-14 rounded-xl border px-4 ${errors.firstName ? 'border-red-500' : 'border-slate-300'}`}
                value={value}
                onChangeText={onChange}
                placeholder="John"
              />
            )}
          />
          {errors.firstName && (
            <Text className="mt-1 text-xs text-red-500">{errors.firstName.message}</Text>
          )}
        </View>

        <View className="mb-4">
          <Text className="mb-2 font-semibold">Last Name</Text>
          <Controller
            control={control}
            name="lastName"
            rules={{ required: 'Last name is required' }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                className={`h-14 rounded-xl border px-4 ${errors.lastName ? 'border-red-500' : 'border-slate-300'}`}
                value={value}
                onChangeText={onChange}
                placeholder="Doe"
              />
            )}
          />
          {errors.lastName && (
            <Text className="mt-1 text-xs text-red-500">{errors.lastName.message}</Text>
          )}
        </View>

        {/* // Gender Dropdown */}
        <View className="mb-4">
          <Text className="mb-2 font-semibold">Gender</Text>
          <Controller
            control={control}
            name="gender"
            rules={{ required: 'Gender is required' }}
            render={({ field: { onChange, value } }) => (
              <Dropdown
                style={[
                  {
                    height: 56,
                    borderColor: '#cbd5e1',
                    borderWidth: 1,
                    borderRadius: 12,
                    paddingHorizontal: 16,
                    marginBottom: 16,
                  },
                  errors.gender && { borderColor: 'red' },
                ]}
                placeholderStyle={{ color: '#94a3b8' }}
                data={genders}
                labelField="label"
                valueField="value"
                placeholder="Select Gender"
                value={value}
                onChange={(item) => onChange(item.value)}
              />
            )}
          />
          {errors.gender && (
            <Text className="-mt-3 mb-3 text-xs text-red-500">{errors.gender.message}</Text>
          )}
        </View>

        <View className="mb-6">
          <Text className="mb-2 font-semibold">User Type</Text>
          <Controller
            control={control}
            name="userType"
            render={({ field: { onChange, value } }) => (
              <View className="flex-row gap-3">
                {(['student', 'teacher', 'admin'] as UserType[]).map((type) => (
                  <TouchableOpacity
                    key={type}
                    className={`flex-1 rounded-xl border py-3 ${value === type ? 'border-blue-600 bg-blue-50' : 'border-slate-300'}`}
                    onPress={() => onChange(type)}>
                    <Text
                      className={`text-center font-bold ${value === type ? 'text-blue-600' : 'text-slate-500'}`}>
                      {type.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          />
        </View>

        {/* // Conditional Fields for Student and Teacher */}
        {(selectedUserType === 'student' || selectedUserType === 'teacher') && (
          <View>
            <Text className="mb-2 font-semibold">
              {selectedUserType === 'student' ? 'Student ID' : 'Teacher ID'}
            </Text>
            <Controller
              control={control}
              name="Id"
              rules={{
                required: 'ID is required',
                pattern: { value: /^[0-9]*$/, message: 'ID must be a number' },
              }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  className={`mb-4 h-14 rounded-xl border px-4 ${errors.Id ? 'border-red-500' : 'border-slate-300'}`}
                  value={value}
                  onChangeText={onChange}
                  placeholder="ID Number"
                  keyboardType="numeric"
                />
              )}
            />
            {errors.Id && (
              <Text className="-mt-3 mb-3 text-xs text-red-500">{errors.Id.message}</Text>
            )}

            {/* // Department field */}
            <Text className="mb-2 font-semibold">Department</Text>
            <Controller
              control={control}
              name="department"
              rules={{ required: 'Department is required' }}
              render={({ field: { onChange, value } }) => (
                <Dropdown
                  style={[
                    {
                      height: 56,
                      borderColor: '#cbd5e1',
                      borderWidth: 1,
                      borderRadius: 12,
                      paddingHorizontal: 16,
                      marginBottom: 16,
                    },
                    errors.department && { borderColor: 'red' },
                  ]}
                  placeholderStyle={{ color: '#94a3b8' }}
                  data={departments}
                  labelField="label"
                  valueField="value"
                  placeholder="Select Department"
                  value={value}
                  onChange={(item) => onChange(item.value)}
                />
              )}
            />
            {errors.department && (
              <Text className="-mt-3 mb-3 text-xs text-red-500">{errors.department.message}</Text>
            )}

            {/* // Session field for students */}
            {selectedUserType === 'student' && (
              <View className="">
                <Text className="mb-2 font-semibold">Session</Text>
                <Controller
                  control={control}
                  name="session"
                  rules={{ required: 'Session is required' }}
                  render={({ field: { onChange, value } }) => (
                    <Dropdown
                      style={[
                        {
                          height: 56,
                          borderColor: '#cbd5e1',
                          borderWidth: 1,
                          borderRadius: 12,
                          paddingHorizontal: 16,
                          marginBottom: 16,
                        },
                        errors.session && { borderColor: 'red' },
                      ]}
                      placeholderStyle={{ color: '#94a3b8' }}
                      data={sessions}
                      labelField="label"
                      valueField="value"
                      placeholder="Select Session"
                      value={value}
                      onChange={(item) => onChange(item.value)}
                    />
                  )}
                />
                {errors.session && (
                  <Text className="-mt-3 mb-3 text-xs text-red-500">{errors.session.message}</Text>
                )}
              </View>
            )}
          </View>
        )}

        <TouchableOpacity
          className={`my-4 rounded-xl bg-blue-600 py-4 ${loading ? 'opacity-50' : ''}`}
          onPress={handleSubmit(onSubmit, onError)}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-center text-lg font-bold text-white">Save Profile</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default CreateProfile;
