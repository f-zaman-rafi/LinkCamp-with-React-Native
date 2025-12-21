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
import { Ionicons } from '@expo/vector-icons';
import { Dropdown } from 'react-native-element-dropdown';
import useAuth from '../../Hooks/useAuth';
import useAxiosCommon from '../../Hooks/useAxiosCommon';

/* ---------- Types ---------- */
type UserType = 'student' | 'teacher' | 'admin';

type SignUpFormData = {
  email: string;
  password: string;
  userType: UserType;
  Id?: string;
  department?: string;
  session?: string;
};

const SignUpPage = () => {
  const router = useRouter();
  const { signUp } = useAuth();
  const axiosCommon = useAxiosCommon();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignUpFormData>({
    defaultValues: {
      email: '',
      password: '',
      userType: 'student',
    },
  });

  const selectedUserType = watch('userType');

  /* ---------- Submit Logic ---------- */
  // const onSubmit = async (data: SignUpFormData) => {
  //   setLoading(true);
  //   try {
  //     await signUp(data.email, data.password);
  //     const userInfo = {
  //       email: data.email,
  //       user_id: data.Id ?? '',
  //       userType: data.userType,
  //       department: data.department ?? '',
  //       session: data.session ?? '',
  //       verify: 'pending',
  //       name: '',
  //     };
  //     await axiosCommon.post('/users', userInfo);
  //     Alert.alert('Success', 'Account created! Pending approval.', [
  //       { text: 'OK', onPress: () => router.replace('/pending-request') },
  //     ]);
  //   } catch (error: any) {
  //     Alert.alert('Signup failed', error.message || 'Check your connection.');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const onSubmit = (data) => {
    console.log('Form Data:', data);
  };
  /* ---------- Dropdown Data ---------- */
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

  return (
    <View className="flex-1 justify-center px-6">
      <View className="mt-22">
        <Text className="text-4xl font-extrabold text-blue-600">LinkCamp</Text>
        <Text className="mt-2 text-lg text-slate-500">University Campus Platform</Text>
      </View>

      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-start' }}
        className="mt-6">
        {/* Email */}
        <View className="mb-4">
          <Text className="mb-2 font-semibold">Email</Text>
          <Controller
            control={control}
            name="email"
            rules={{ required: 'Email is required' }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                className="h-14 rounded-xl border border-slate-300 px-4"
                value={value}
                onChangeText={onChange}
                placeholder="student@university.edu"
                autoCapitalize="none"
              />
            )}
          />
        </View>

        {/* Password */}
        <View className="mb-4">
          <Text className="mb-2 font-semibold">Password</Text>
          <View className="relative justify-center">
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  className="h-14 rounded-xl border border-slate-300 px-4 pr-12"
                  value={value}
                  onChangeText={onChange}
                  placeholder="••••••"
                  secureTextEntry={!showPassword}
                />
              )}
            />
            <TouchableOpacity
              className="absolute right-4"
              onPress={() => setShowPassword(!showPassword)}>
              <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={22} color="#64748b" />
            </TouchableOpacity>
          </View>
        </View>

        {/* User Type Selector */}
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

        {/* Conditional Fields: ID, Department, Session */}
        {(selectedUserType === 'student' || selectedUserType === 'teacher') && (
          <View>
            <Text className="mb-2 font-semibold">
              {selectedUserType === 'student' ? 'Student ID' : 'Teacher ID'}
            </Text>
            <Controller
              control={control}
              name="Id"
              rules={{ required: 'ID is required' }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  className="mb-4 h-14 rounded-xl border border-slate-300 px-4"
                  value={value}
                  onChangeText={onChange}
                  placeholder="ID Number"
                />
              )}
            />

            <Text className="mb-2 font-semibold">Department</Text>
            <Controller
              control={control}
              name="department"
              render={({ field: { onChange, value } }) => (
                <Dropdown
                  style={{
                    height: 56,
                    borderColor: '#cbd5e1',
                    borderWidth: 1,
                    borderRadius: 12,
                    paddingHorizontal: 16,
                    marginBottom: 16,
                  }}
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
                  render={({ field: { onChange, value } }) => (
                    <Dropdown
                      style={{
                        height: 56,
                        borderColor: '#cbd5e1',
                        borderWidth: 1,
                        borderRadius: 12,
                        paddingHorizontal: 16,
                        marginBottom: 16,
                      }}
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

        {/* Submit Button */}
        <TouchableOpacity
          className={`mt-4 rounded-xl bg-blue-600 py-4 ${loading ? 'opacity-50' : ''}`}
          onPress={handleSubmit(onSubmit)}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-center text-lg font-bold text-white">Sign Up</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/sign-in')} className="mt-6">
          <Text className="text-center text-slate-500">
            Already have an account? <Text className="font-bold text-blue-600">Sign In</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default SignUpPage;
