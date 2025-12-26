import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth, initializeAuth } from 'firebase/auth';
import { getReactNativePersistence } from '@firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Platform } from 'react-native';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_APP_ID,
};

// ✅ Prevent re-initializing Firebase app on refresh
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth =
  Platform.OS === 'web'
    ? getAuth(app)
    : (() => {
        try {
          return initializeAuth(app, {
            persistence: getReactNativePersistence(AsyncStorage),
          });
        } catch {
          return getAuth(app);
        }
      })();

export default app;
