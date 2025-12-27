import React, { createContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the type for the user data
interface UserData {
  name: string | null;
  userType: string | null;
  user_id: string | null;
  department: string | null;
  session?: string | null;
  gender?: string | null;
  verify?: string | null;
}

// Create the context with a default value (empty user data)
const UserContext = createContext<{
  userData: UserData | null;
  setUserData: React.Dispatch<React.SetStateAction<UserData | null>>;
}>({
  userData: null,
  setUserData: () => {}, // Placeholder for the setter function
});

// UserProvider component to manage and provide user data
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userData, setUserData] = useState<UserData | null>(null); // Initialize user data as null

  useEffect(() => {
    const loadUserData = async () => {
      const stored = await AsyncStorage.getItem('USER_DATA');
      if (stored) {
        setUserData(JSON.parse(stored));
      }
    };
    loadUserData();
  }, []);

  useEffect(() => {
    if (userData) {
      AsyncStorage.setItem('USER_DATA', JSON.stringify(userData));
    } else {
      AsyncStorage.removeItem('USER_DATA');
    }
  }, [userData]);

  return <UserContext.Provider value={{ userData, setUserData }}>{children}</UserContext.Provider>;
};

// Export the UserContext to access from other parts of the app
export const useUserContext = () => React.useContext(UserContext);
