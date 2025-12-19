import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import useAuth from '../../Hooks/useAuth';
import { Ionicons } from '@expo/vector-icons';

const SignupScreen = () => {
  const router = useRouter();
  const { signIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
      await signIn(data.email, data.password);
      router.replace('/(tabs)/feed');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unknown error occurred';
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center bg-white px-6">
      <View className="mb-8">
        <Text className="text-4xl font-extrabold text-blue-600">LinkCamp</Text>
        <Text className="mt-2 text-lg text-slate-500">University Campus Platform</Text>
      </View>

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

      <View className="mt-8">
        <Text className="text-center text-slate-500">
          Already Have an Account?{' '}
          <Text onPress={() => router.push('/')} className="font-bold text-blue-600">
            Create Account
          </Text>
        </Text>
      </View>
    </View>
  );
};

export default SignupScreen;
