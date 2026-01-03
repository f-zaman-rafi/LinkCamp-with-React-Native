import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { useEffect, useMemo } from 'react';
import { useRouter } from 'expo-router';
import useAuth from './useAuth';

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
        if (error.response?.status === 401 || error.response?.status === 403) {
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
