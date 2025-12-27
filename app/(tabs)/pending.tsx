import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import useUser from '../../Hooks/useUser';
import useAuth from '../../Hooks/useAuth';
import { useUserContext } from '../../providers/UserContext';

const SomeComponent = () => {
  const { setUserData, setProfileChecked } = useUserContext(); // Access the setUserData function from context
  const { logOut, loading } = useAuth(); // Get user and logOut function from useAuth hook

  const handleLogout = async () => {
    try {
      await logOut(); // Log out the user
      setUserData(null); // Clear user data from context
      setProfileChecked(false);
    } catch (error) {
      console.error('Logout failed:', error); // Handle any errors during logout
    }
  };

  return (
    <View className="flex-1 items-center justify-center text-center">
      {/* Logout Button */}
      <TouchableOpacity
        className={`w-full rounded-xl py-4 shadow-sm ${loading ? 'bg-blue-300' : 'bg-blue-600'}`}
        onPress={handleLogout} // Call handleLogout on press
        disabled={loading}>
        {loading ? (
          <ActivityIndicator color="white" /> // Show loading indicator when logging out
        ) : (
          <Text className="text-center text-lg font-bold text-white">Log Out</Text> // Show "Log Out" button text
        )}
      </TouchableOpacity>
    </View>
  );
};

export default SomeComponent;
