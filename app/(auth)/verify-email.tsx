import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { sendEmailVerification } from 'firebase/auth';
import { auth } from '../../firebase/firebase.config';

const VerifyEmail = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const handleResend = async () => {
    try {
      setResending(true);
      if (!auth.currentUser) {
        Alert.alert('No user', 'Please sign in again.');
        return;
      }
      await sendEmailVerification(auth.currentUser);
      Alert.alert('Email sent', 'Check your inbox (and spam folder).');
    } catch (error) {
      Alert.alert('Error', 'Failed to resend verification email.');
    } finally {
      setResending(false);
    }
  };

  const handleCheckVerified = async () => {
    try {
      setLoading(true);
      if (!auth.currentUser) {
        Alert.alert('No user', 'Please sign in again.');
        return;
      }
      await auth.currentUser.reload();
      if (auth.currentUser.emailVerified) {
        Alert.alert('Verified', 'Your email is verified. Continue to setup.');
        router.replace('/(auth)/create-profile');
      } else {
        Alert.alert('Not verified', 'Please verify your email first.');
      }
    } catch (error) {
      Alert.alert('Error', 'Could not verify status. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center bg-white px-6">
      <View className="mt-20 mb-4">
        <Text className="text-4xl font-extrabold text-blue-600">LinkCamp</Text>
        <Text className="mt-2 text-lg text-slate-500">University Campus Platform</Text>
      </View>

      <View className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <Text className="text-lg font-bold text-slate-800">Verify your email</Text>
        <Text className="mt-2 text-slate-600">
          We sent a verification link to your email. Please verify your account to continue setting
          up your profile.
        </Text>
      </View>

      <View className="mt-6">
        <TouchableOpacity
          className={`w-full rounded-xl py-4 shadow-sm ${loading ? 'bg-blue-300' : 'bg-blue-600'}`}
          onPress={handleCheckVerified}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-center text-lg font-bold text-white">I’ve verified</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          className={`mt-4 w-full rounded-xl py-4 shadow-sm ${resending ? 'bg-slate-300' : 'bg-slate-200'}`}
          onPress={handleResend}
          disabled={resending}>
          {resending ? (
            <ActivityIndicator color="black" />
          ) : (
            <Text className="text-center text-lg font-bold text-slate-700">Resend email</Text>
          )}
        </TouchableOpacity>
      </View>

      <View className="mt-6">
        <Text className="text-center text-sm text-slate-500">
          Didn’t get the email? Check spam or try resending.
        </Text>
      </View>

      <TouchableOpacity className="mt-6" onPress={() => router.replace('/(auth)')}>
        <Text className="text-center font-semibold text-blue-600">Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default VerifyEmail;
