import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import useAuth from './useAuth';

const axiosSecure: AxiosInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
});

const useAxiosSecure = (): AxiosInstance => {
  const { user, logOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Attach Token to every request
    const requestInterceptor = axiosSecure.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        if (user) {
          const token = await user.getIdToken();
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      }
    );

    // Global Error Handling (401/403)
    const responseInterceptor = axiosSecure.interceptors.response.use(
      (res) => res,
      async (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
          await logOut();
          router.replace('/(auth)/sign-in');
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosSecure.interceptors.request.eject(requestInterceptor);
      axiosSecure.interceptors.response.eject(responseInterceptor);
    };
  }, [user, logOut, router]);

  return axiosSecure;
};

export default useAxiosSecure;
