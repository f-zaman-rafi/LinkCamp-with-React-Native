import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import useAuth from './useAuth';
import { useUserContext } from '../providers/UserContext';

const useAppLogout = () => {
  const router = useRouter();
  const { logOut } = useAuth();
  const { setUserData, setProfileChecked } = useUserContext();
  const [logoutLoading, setLogoutLoading] = useState(false);

  const logoutNow = useCallback(async () => {
    if (logoutLoading) return;
    setLogoutLoading(true);
    try {
      await logOut();
      setUserData(null);
      setProfileChecked(false);
      router.replace('/(auth)');
    } catch (e) {
      console.error('Logout failed:', e);
      Alert.alert('Logout Error', 'Unable to log out right now. Please try again.');
    } finally {
      setLogoutLoading(false);
    }
  }, [logOut, logoutLoading, router, setProfileChecked, setUserData]);

  const confirmLogout = useCallback(() => {
    if (logoutLoading) return;
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: logoutNow },
    ]);
  }, [logoutLoading, logoutNow]);

  return { logoutLoading, logoutNow, confirmLogout };
};

export default useAppLogout;
