import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { sendEmailVerification } from 'firebase/auth';
import useAuth from '../../Hooks/useAuth';
import AuthHeader from '../../components/AuthHeader';

type SignUpFormData = {
  email: string;
  password: string;
};

const SignUpPage = () => {
  const router = useRouter();
  const { signUp } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form setup
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Handle form submission
  const onSubmit = async (data: SignUpFormData) => {
    setLoading(true);
    try {
      const userCredential = await signUp(data.email, data.password);
      const user = userCredential.user;

      await sendEmailVerification(user);

      Alert.alert(
        'Verify Email',
        'We sent a verification link to your email. Please verify to continue.'
      );
    } catch (error: any) {
      let errorMessage = 'An unexpected error occurred. Please try again later.';

      if (error.code) {
        const firebaseErrorMessages: Record<string, string> = {
          'auth/email-already-in-use': 'This email is already registered.',
          'auth/invalid-email': 'The email address is not valid.',
          'auth/weak-password': 'Password is too weak. It should contain at least 6 characters.',
          'auth/network-request-failed': 'Network error. Check your connection and try again.',
        };
        errorMessage = firebaseErrorMessages[error.code] || error.message;
      }
      router.replace('/(auth)');
      setTimeout(() => {
        Alert.alert('Signup Error', errorMessage);
      }, 300);
      return;
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center bg-white px-6">
      <AuthHeader containerClassName="mb-8" />

      <View className="mt-4">
        <View className="mb-4">
          <Text className="mb-2 font-semibold">Email</Text>
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
                className={`h-14 rounded-xl border px-4 ${errors.email ? 'border-red-500' : 'border-slate-300'}`}
                value={value}
                onChangeText={onChange}
                placeholder="student@university.edu"
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
          <Text className="mb-2 font-semibold">Password</Text>
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
                  className={`h-14 rounded-xl border px-4 pr-12 ${errors.password ? 'border-red-500' : 'border-slate-300'}`}
                  value={value}
                  onChangeText={onChange}
                  placeholder="••••••••"
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
            <Text className="text-center text-lg font-bold text-white">Create Account</Text>
          )}
        </TouchableOpacity>

        <View className="mt-6">
          <Text className="text-center text-slate-500">
            Already have an account?{' '}
            <Text onPress={() => router.push('/')} className="font-bold text-blue-600">
              Sign In
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );
};

export default SignUpPage;
