import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { useEffect, useMemo } from 'react';
import { useRouter } from 'expo-router';
import useAuth from './useAuth';
import { Alert } from 'react-native';

const useAxiosSecure = (): AxiosInstance => {
  const { user, logOut } = useAuth();
  const router = useRouter();

  const instance = useMemo(
    () =>
      axios.create({
        baseURL: process.env.EXPO_PUBLIC_API_URL,
      }),
    []
  );

  useEffect(() => {
    const req = instance.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
      const token = await user?.getIdToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    const res = instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const status = error.response?.status;
        const code = error.response?.data?.code;

        // Pending approval → just notify, no logout
        if (status === 403 && code === 'ACCOUNT_PENDING') {
          Alert.alert('Pending approval', 'Please wait until an admin approves your account.');
          return Promise.reject(error);
        }

        // Blocked → send to blocked page
        if (status === 403 && code === 'ACCOUNT_BLOCKED') {
          router.replace('/(auth)/blocked');
          return Promise.reject(error);
        }

        if (status === 401 || status === 403) {
          await logOut();
          router.replace('/(auth)');
        }

        return Promise.reject(error);
      }
    );

    return () => {
      instance.interceptors.request.eject(req);
      instance.interceptors.response.eject(res);
    };
  }, [instance, user, logOut, router]);

  return instance;
};

export default useAxiosSecure;
