import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import useAuth from './useAuth'; // Custom hook to manage authentication and user state

// Create an Axios instance with base URL
const axiosSecure: AxiosInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL, // Base URL for the API
});

// Custom hook to handle secure axios requests with Firebase token handling
const useAxiosSecure = (): AxiosInstance => {
  const { user, logOut } = useAuth(); // Get the user object and logOut function from useAuth
  const router = useRouter(); // Router to navigate on authentication failure
  const [token, setToken] = useState<string | null>(null); // Store Firebase token in state

  // Custom hook to fetch the token and refresh it if necessary
  const useFirebaseToken = () => {
    useEffect(() => {
      const fetchToken = async () => {
        try {
          // Try to fetch the Firebase ID token, force refreshing it
          const fetchedToken = await user?.getIdToken(true); // 'true' ensures the token is refreshed
          setToken(fetchedToken || null); // Update the token state
        } catch (error) {
          console.error('Error fetching Firebase token:', error); // Handle any errors during token fetch
        }
      };

      fetchToken(); // Initial fetch of the token

      // Set an interval to refresh the token every hour (Firebase tokens expire every 60 minutes)
      const intervalId = setInterval(fetchToken, 60 * 60 * 1000);

      // Cleanup the interval when the component is unmounted
      return () => clearInterval(intervalId);
    }, [user]); // Dependency on 'user' to refetch token if user changes
  };

  useFirebaseToken(); // Call the custom hook to handle token fetch and refresh

  useEffect(() => {
    // Interceptor to add the Firebase token to every request header
    const requestInterceptor = axiosSecure.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        if (token) {
          config.headers.Authorization = `Bearer ${token}`; // Add token to the Authorization header
        }
        return config; // Return the updated config
      }
    );

    // Interceptor to handle errors, particularly 401 (Unauthorized) or 403 (Forbidden)
    const responseInterceptor = axiosSecure.interceptors.response.use(
      (response) => response, // Just return the response in case of success
      async (error) => {
        // If the error is due to authentication issues (401/403), log the user out
        if (error.response?.status === 401 || error.response?.status === 403) {
          await logOut(); // Call the logOut function to log the user out
          router.replace('/(auth)/sign-in'); // Redirect the user to the sign-in page
        }
        return Promise.reject(error); // Reject the error if it's not a 401/403
      }
    );

    // Cleanup interceptors on component unmount to prevent memory leaks
    return () => {
      axiosSecure.interceptors.request.eject(requestInterceptor);
      axiosSecure.interceptors.response.eject(responseInterceptor);
    };
  }, [token, logOut, router]); // Dependencies: token, logOut, and router for when any of them change

  // Return the axios instance for use in API calls
  return axiosSecure;
};

export default useAxiosSecure;
