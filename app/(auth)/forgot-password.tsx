import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../firebase/firebase.config';
import AuthHeader from '../../components/AuthHeader';

const ForgotPassword = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!email) {
      Alert.alert('Email required', 'Please enter your email address.');
      return;
    }
    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, email.trim());
      Alert.alert('Email sent', 'Check your inbox to reset your password.', [
        { text: 'OK', onPress: () => router.replace('/(auth)') },
      ]);
    } catch (error: any) {
      const message = error?.message || 'Failed to send reset email.';
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center bg-white px-6">
      <AuthHeader containerClassName="mb-8" />

      <Text className="mt-2 text-slate-500">
        Enter your email to receive a password reset link.
      </Text>

      <TextInput
        className="mt-6 h-14 rounded-xl border border-slate-300 px-4"
        placeholder="you@example.com"
        placeholderTextColor="#94a3b8"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TouchableOpacity
        className={`mt-6 rounded-xl py-4 ${loading ? 'bg-blue-300' : 'bg-red-600'}`}
        onPress={handleReset}
        disabled={loading}>
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-center text-lg font-bold text-white">Send Reset Email</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.replace('/(auth)')} className="mt-6">
        <Text className="text-center font-semibold text-blue-600">Back to Sign In</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ForgotPassword;
