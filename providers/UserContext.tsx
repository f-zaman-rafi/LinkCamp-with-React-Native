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
  userDataLoading: boolean;
  profileChecked: boolean;
  setProfileChecked: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  userData: null,
  setUserData: () => {},
  userDataLoading: true,
  profileChecked: false,
  setProfileChecked: () => {},
});

// UserProvider component to manage and provide user data
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userData, setUserData] = useState<UserData | null>(null); // Initialize user data as null
  const [userDataLoading, setUserDataLoading] = useState(true);
  const [profileChecked, setProfileChecked] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      const stored = await AsyncStorage.getItem('USER_DATA');
      if (stored) {
        setUserData(JSON.parse(stored));
      }
      setProfileChecked(true); // Mark profile as checked if data exists
      setUserDataLoading(false);
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

  return (
    <UserContext.Provider
      value={{ userData, setUserData, userDataLoading, profileChecked, setProfileChecked }}>
      {children}
    </UserContext.Provider>
  );
};

// Export the UserContext to access from other parts of the app
export const useUserContext = () => React.useContext(UserContext);
