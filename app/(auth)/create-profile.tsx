import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { useRouter } from 'expo-router';
import { Dropdown } from 'react-native-element-dropdown';
import useAxiosCommon from '../../Hooks/useAxiosCommon';
import { useUserContext } from '../../providers/UserContext';
import { auth } from '../../firebase/firebase.config';

type UserType = 'student' | 'teacher' | 'admin';
type GenderType = 'male' | 'female' | 'other';

type ProfileFormData = {
  firstName: string;
  lastName: string;
  gender: GenderType;
  userType: UserType;
  Id?: string;
  department?: string;
  session?: string;
};

const CreateProfile = () => {
  const router = useRouter();
  const axiosCommon = useAxiosCommon();
  const { setUserData } = useUserContext();
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProfileFormData>({
    defaultValues: {
      firstName: '',
      lastName: '',
      gender: 'male',
      userType: 'student',
      Id: '',
      department: '',
      session: '',
    },
  });

  const selectedUserType = watch('userType');

  React.useEffect(() => {
    setValue('Id', '');
    setValue('department', '');
    setValue('session', '');
  }, [selectedUserType, setValue]);

  const onSubmit = async (data: ProfileFormData) => {
    setLoading(true);
    try {
      if (!auth.currentUser) {
        Alert.alert('No user', 'Please sign in again.');
        router.replace('/(auth)');
        return;
      }

      await auth.currentUser.reload();
      if (!auth.currentUser.emailVerified) {
        Alert.alert('Not verified', 'Please verify your email first.');
        router.replace('/verify-email');
        return;
      }

      const idToken = await auth.currentUser.getIdToken();
      const email = auth.currentUser.email;

      const fullName = `${data.firstName} ${data.lastName}`.trim();

      const userInfo = {
        email,
        user_id: data.Id || '',
        userType: data.userType,
        department: data.department || '',
        session: data.session || '',
        verify: 'pending',
        name: fullName,
        gender: data.gender,
      };

      await axiosCommon.post('/users', userInfo, {
        headers: { Authorization: `Bearer ${idToken}` },
      });

      setUserData({
        name: fullName,
        userType: data.userType,
        user_id: data.Id || '',
        department: data.department || '',
      });

      Alert.alert('Success', 'Profile created! Your account is pending approval.', [
        { text: 'OK', onPress: () => router.replace('/(tabs)/pending') },
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
  ].map((item) => ({ label: item, value: item }));

  const sessions = Array.from({ length: 2025 - 2003 + 1 }, (_, i) => {
    const year = 2025 - i;
    return { label: `${year}-${year + 1}`, value: `${year}-${year + 1}` };
  });

  const genders = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Other', value: 'other' },
  ];

  return (
    <View className="flex-1 bg-white px-6">
      <View className="mt-20 mb-4">
        <Text className="text-4xl font-extrabold text-blue-600">LinkCamp</Text>
        <Text className="mt-2 text-lg text-slate-500">Complete your profile</Text>
      </View>

      <ScrollView
        className="mb-12"
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}>
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

            <Text className="mb-2 font-semibold">Department</Text>
            <Controller
              control={control}
              name="department"
              rules={{ required: 'Required' }}
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

            {selectedUserType === 'student' && (
              <View>
                <Text className="mb-2 font-semibold">Session</Text>
                <Controller
                  control={control}
                  name="session"
                  rules={{ required: 'Required' }}
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
              </View>
            )}
          </View>
        )}

        <TouchableOpacity
          className={`mt-4 rounded-xl bg-blue-600 py-4 ${loading ? 'opacity-50' : ''}`}
          onPress={handleSubmit(onSubmit)}
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
