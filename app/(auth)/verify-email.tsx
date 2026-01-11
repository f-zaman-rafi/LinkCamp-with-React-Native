import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { sendEmailVerification } from 'firebase/auth';
import { auth } from '../../firebase/firebase.config';
import useAuth from '../../Hooks/useAuth';
import AuthHeader from '../../components/AuthHeader';

const VerifyEmail = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const { logOut, user } = useAuth();

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
      <AuthHeader containerClassName="mb-8" />
      <View className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <View className="flex-row items-center gap-1">
          <Text className="text-lg font-bold text-slate-800">Verify your email</Text>
          <Text className="text-sm font-normal text-red-600">({user?.email || 'your email'})</Text>
        </View>

        <Text className="mt-2 text-slate-600">
          We sent a verification link to your email . Please verify your account to continue setting
          up your profile.
        </Text>
      </View>

      <View className="mt-6 flex-row-reverse gap-3">
        <TouchableOpacity
          className={`flex-1 rounded-xl py-4 shadow-sm ${loading ? 'bg-red-300' : 'bg-red-600'}`}
          onPress={handleCheckVerified}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-center text-lg font-bold text-white">I’ve verified</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          className={`flex-1 rounded-xl py-4 shadow-sm ${resending ? 'bg-stone-300' : 'bg-stone-800'}`}
          onPress={handleResend}
          disabled={resending}>
          {resending ? (
            <ActivityIndicator color="black" />
          ) : (
            <Text className="text-center text-lg font-bold text-white">Resend email</Text>
          )}
        </TouchableOpacity>
      </View>

      <View className="mt-6">
        <Text className="text-center text-sm text-slate-500">
          Didn’t get the email? Check spam or try resending.
        </Text>
      </View>
      <View className="mt-6 flex-row justify-center">
        <Text>Wrong email? </Text>
        <TouchableOpacity
          onPress={async () => {
            await logOut();
            router.replace('/(auth)');
          }}>
          <Text className="font-semibold text-blue-600">Go back to login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default VerifyEmail;
