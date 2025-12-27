import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller, set } from 'react-hook-form';
import useAuth from '../../Hooks/useAuth';
import useAxiosCommon from '../../Hooks/useAxiosCommon';
import { Ionicons } from '@expo/vector-icons';
import { useUserContext } from '../../providers/UserContext'; // Importing the user context

const LoginScreen = () => {
  const router = useRouter(); // Navigation
  const { signIn } = useAuth(); // Auth hook
  const axiosCommon = useAxiosCommon(); // Axios hook
  const { setUserData, setProfileChecked } = useUserContext(); // User context
  const [loading, setLoading] = useState(false); // Loading state
  const [showPassword, setShowPassword] = useState(false); // Show/hide password

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      // Sign in
      const credential = await signIn(data.email, data.password);

      // Check email verification
      const currentUser = credential.user;
      await currentUser.reload();
      if (!currentUser.emailVerified) {
        Alert.alert('Verify Email', 'Please verify your email before continuing.');
        router.replace('/(auth)/verify-email');
        return;
      }

      // Get token for backend calls
      const idToken = await currentUser.getIdToken();

      // Fetch user from backend
      const userResponse = await axiosCommon.get(`/user/${data.email}`, {
        headers: { Authorization: `Bearer ${idToken}` },
      });
      const user = userResponse.data;
      setProfileChecked(true);

      // If profile not completed, go to create-profile
      if (!user?.userType) {
        router.replace('/(auth)/create-profile');
        return;
      }

      // Save user data
      setUserData({
        name: user.name,
        userType: user.userType,
        user_id: user.user_id || '',
        department: user.department || '',
      });

      // Go to app
      router.replace('/(tabs)');
    } catch (error: any) {
      if (error?.response?.status === 404) {
        setProfileChecked(true);
        router.replace('/(auth)/create-profile');
        return;
      }
      Alert.alert('Login Error', error?.message, [
        { text: 'OK', onPress: () => router.replace('/(auth)') },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center bg-white px-6">
      {/*  Header */}
      <View className="mb-8">
        <Text className="text-4xl font-extrabold text-blue-600">LinkCamp</Text>
        <Text className="mt-2 text-lg text-slate-500">University Campus Platform</Text>
      </View>
      {/*  Login Form */}
      <View>
        <View className="mb-4">
          <Text className="mb-2 font-semibold text-slate-700">Email</Text>
          <Controller
            control={control}
            name="email"
            rules={{
              required: 'Email is required',
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: 'Enter a valid email address',
              },
            }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                className={`w-full rounded-xl border bg-slate-50 px-4 py-4 ${errors.email ? 'border-red-500' : 'border-slate-200'}`}
                placeholder="student@university.edu"
                value={value}
                onChangeText={onChange}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            )}
          />
          {errors.email && (
            <Text className="mt-1 text-xs text-red-500">{errors.email.message}</Text>
          )}
        </View>

        <View className="mb-6">
          <Text className="mb-2 font-semibold text-slate-700">Password</Text>
          <View className="relative justify-center">
            <Controller
              control={control}
              name="password"
              rules={{
                required: 'Password is required',
                minLength: { value: 6, message: 'Minimum 6 characters' },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
                  message: 'Needs Uppercase, Lowercase, Number, and Special Char',
                },
              }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  className={`w-full rounded-xl border bg-slate-50 px-4 py-4 pr-12 ${errors.password ? 'border-red-500' : 'border-slate-200'}`}
                  placeholder="••••••••"
                  value={value}
                  onChangeText={onChange}
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
          {errors.password && (
            <Text className="mt-1 text-xs text-red-500">{errors.password.message}</Text>
          )}
        </View>

        <TouchableOpacity
          className={`w-full rounded-xl py-4 shadow-sm ${loading ? 'bg-blue-300' : 'bg-blue-600'}`}
          onPress={handleSubmit(onSubmit)}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-center text-lg font-bold text-white">Sign In</Text>
          )}
        </TouchableOpacity>
      </View>
      {/*  Signup Link */}
      <View className="mt-8">
        <Text className="text-center text-slate-500">
          New to LinkCamp?{' '}
          <Text onPress={() => router.push('/signup')} className="font-bold text-blue-600">
            Create Account
          </Text>
        </Text>
      </View>
    </View>
  );
};

export default LoginScreen;
