import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Dropdown } from 'react-native-element-dropdown';
import useAuth from '../../Hooks/useAuth';
import useAxiosCommon from '../../Hooks/useAxiosCommon';
import { useUserContext } from '../../providers/UserContext';

/* ---------- Types ---------- */
type UserType = 'student' | 'teacher' | 'admin';

type SignUpFormData = {
  email: string;
  password: string;
  userType: UserType;
  Id?: string;
  department?: string;
  session?: string;
};

const SignUpPage = () => {
  const router = useRouter();
  const { signUp, user } = useAuth(); // Hook to handle Firebase authentication
  const axiosCommon = useAxiosCommon(); // Custom hook for Axios requests
  const { setUserData } = useUserContext();
  const [loading, setLoading] = useState(false); // Loading state for UI
  const [showPassword, setShowPassword] = useState(false); // Toggle for password visibility

  console.log('this is user', user);

  // Hook form setup for managing form data
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SignUpFormData>({
    defaultValues: {
      email: '',
      password: '',
      userType: 'student',
      Id: '',
      department: '',
      session: '',
    },
  });

  const selectedUserType = watch('userType'); // Watch selected user type (student/teacher/admin)

  // Clear additional fields when user type is changed
  React.useEffect(() => {
    setValue('Id', ''); // Clear ID field
    setValue('department', ''); // Clear department field
    setValue('session', ''); // Clear session field
  }, [selectedUserType, setValue]);

  /* ---------- Submit Logic ---------- */
  const onSubmit = async (data: SignUpFormData) => {
    setLoading(true); // Set loading state to true while signing up

    try {
      // Sign up the user with Firebase
      const userCredential = await signUp(data.email, data.password);
      const user = userCredential.user; // Get user info after successful sign up

      // Get Firebase ID Token after signing up
      const idToken = await user.getIdToken(); // Fetch the Firebase ID token for authentication
      console.log('Firebase ID Token:', idToken); // Log the token for debugging

      // Prepare user data for MongoDB
      const userInfo = {
        email: data.email,
        user_id: data.Id || '', // If no ID provided, use an empty string
        userType: data.userType,
        department: data.department || '', // Default empty if no department
        session: data.session || '', // Default empty if no session
        verify: 'pending', // Set default verification status
        name: '', // Empty string for name until it is set later
      };

      // Send the Firebase ID token and user data to backend
      const response = await axiosCommon.post('/users', userInfo, {
        headers: {
          Authorization: `Bearer ${idToken}`, // Pass Firebase ID token in the header for auth
        },
      });

      console.log('Backend response:', response); // Log the backend response

      // Set the global state with user data after successful signup
      setUserData({
        role: data.userType, // Set the user role (could be part of the response from backend)
        verify: 'pending', // Set the initial verification status to pending
        name: '', // Empty name, to be updated later
      });

      // Show success alert and navigate to pending request page
      Alert.alert(
        'Success',
        "You're all set! Just hang tight—your account will be approved shortly.",
        [{ text: 'OK', onPress: () => router.replace('/pending') }] // Redirect to pending page
      );
    } catch (error: any) {
      console.error('Signup error:', error); // Log the error for debugging

      // Determine a user-friendly error message
      let errorMessage = 'An unexpected error occurred. Please try again later.';

      // Handle Firebase-specific errors
      if (error.code) {
        const firebaseErrorMessages: Record<string, string> = {
          'auth/email-already-in-use': 'This email is already registered.',
          'auth/invalid-email': 'The email address is not valid.',
          'auth/weak-password': 'Password is too weak. It should contain at least 6 characters.',
          'auth/network-request-failed': 'Network error. Check your connection and try again.',
        };

        // Set the corresponding error message
        errorMessage = firebaseErrorMessages[error.code] || error.message;
      } else if (error.response) {
        // Handle errors from backend response
        errorMessage = error.response.data.message || 'Backend error occurred. Please try again.';
      }

      // Show the error message in a nice UI-friendly alert
      Alert.alert('Signup Error', errorMessage); // Display error in a user-friendly format
    } finally {
      setLoading(false); // Set loading state to false once the process is done
    }
  };

  const onError = (errorList: any) => {
    console.error('Form errors:', errorList); // Log form errors for debugging
  };

  /* ---------- Dropdown Data ---------- */
  // List of departments to select from
  const departments = [
    'Computer Science',
    'Electrical Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Business Administration',
    'Economics',
    'Accounting & Finance',
    'English',
    'Law',
    'Pharmacy',
  ].map((item) => ({ label: item, value: item }));

  // Generate sessions from 2003 to 2025
  const sessions = Array.from({ length: 2025 - 2003 + 1 }, (_, i) => {
    const year = 2025 - i;
    return { label: `${year}-${year + 1}`, value: `${year}-${year + 1}` };
  });

  return (
    <View className="flex-1 bg-white px-6">
      <View className="mt-20 mb-4">
        <Text className="text-4xl font-extrabold text-blue-600">LinkCamp</Text>
        <Text className="mt-2 text-lg text-slate-500">University Campus Platform</Text>
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        {/* Email */}
        <View className="mb-4">
          <Text className="mb-2 font-semibold">Email</Text>
          <Controller
            control={control}
            name="email"
            rules={{
              required: 'Email is required',
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: 'Enter a valid email address',
              },
            }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                className={`h-14 rounded-xl border px-4 ${errors.email ? 'border-red-500' : 'border-slate-300'}`}
                value={value}
                onChangeText={onChange}
                placeholder="student@university.edu"
                autoCapitalize="none"
              />
            )}
          />
          {errors.email && (
            <Text className="mt-1 text-xs text-red-500">{errors.email.message}</Text>
          )}
        </View>

        {/* Password */}
        <View className="mb-4">
          <Text className="mb-2 font-semibold">Password</Text>
          <View className="relative justify-center">
            <Controller
              control={control}
              name="password"
              rules={{
                required: 'Password is required',
                minLength: { value: 6, message: 'Minimum 6 characters' },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
                  message: 'Needs Uppercase, Lowercase, Number, and Special Char',
                },
              }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  className={`h-14 rounded-xl border px-4 pr-12 ${errors.password ? 'border-red-500' : 'border-slate-300'}`}
                  value={value}
                  onChangeText={onChange}
                  placeholder="••••••"
                  secureTextEntry={!showPassword}
                />
              )}
            />
            <TouchableOpacity
              className="absolute right-4"
              onPress={() => setShowPassword(!showPassword)}>
              <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={22} color="#64748b" />
            </TouchableOpacity>
          </View>
          {errors.password && (
            <Text className="mt-1 text-xs text-red-500">{errors.password.message}</Text>
          )}
        </View>

        {/* User Type */}
        <View className="mb-6">
          <Text className="mb-2 font-semibold">User Type</Text>
          <Controller
            control={control}
            name="userType"
            render={({ field: { onChange, value } }) => (
              <View className="flex-row gap-3">
                {(['student', 'teacher', 'admin'] as UserType[]).map((type) => (
                  <TouchableOpacity
                    key={type}
                    className={`flex-1 rounded-xl border py-3 ${value === type ? 'border-blue-600 bg-blue-50' : 'border-slate-300'}`}
                    onPress={() => onChange(type)}>
                    <Text
                      className={`text-center font-bold ${value === type ? 'text-blue-600' : 'text-slate-500'}`}>
                      {type.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          />
        </View>

        {/* Conditional Fields */}
        {(selectedUserType === 'student' || selectedUserType === 'teacher') && (
          <View>
            <Text className="mb-2 font-semibold">
              {selectedUserType === 'student' ? 'Student ID' : 'Teacher ID'}
            </Text>
            <Controller
              control={control}
              name="Id"
              rules={{
                required: 'ID is required',
                pattern: {
                  value: /^[0-9]*$/,
                  message: 'ID must be a number',
                },
              }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  className={`mb-4 h-14 rounded-xl border px-4 ${errors.Id ? 'border-red-500' : 'border-slate-300'}`}
                  value={value}
                  onChangeText={onChange}
                  placeholder="ID Number"
                  keyboardType="numeric"
                />
              )}
            />
            {errors.Id && (
              <Text className="-mt-3 mb-3 text-xs text-red-500">{errors.Id.message}</Text>
            )}

            <Text className="mb-2 font-semibold">Department</Text>
            <Controller
              control={control}
              name="department"
              rules={{ required: 'Required' }}
              render={({ field: { onChange, value } }) => (
                <Dropdown
                  style={[
                    {
                      height: 56,
                      borderColor: '#cbd5e1',
                      borderWidth: 1,
                      borderRadius: 12,
                      paddingHorizontal: 16,
                      marginBottom: 16,
                    },
                    errors.department && { borderColor: 'red' },
                  ]}
                  placeholderStyle={{ color: '#94a3b8' }}
                  data={departments}
                  labelField="label"
                  valueField="value"
                  placeholder="Select Department"
                  value={value}
                  onChange={(item) => onChange(item.value)}
                />
              )}
            />

            {selectedUserType === 'student' && (
              <View>
                <Text className="mb-2 font-semibold">Session</Text>
                <Controller
                  control={control}
                  name="session"
                  rules={{ required: 'Required' }}
                  render={({ field: { onChange, value } }) => (
                    <Dropdown
                      style={[
                        {
                          height: 56,
                          borderColor: '#cbd5e1',
                          borderWidth: 1,
                          borderRadius: 12,
                          paddingHorizontal: 16,
                          marginBottom: 16,
                        },
                        errors.session && { borderColor: 'red' },
                      ]}
                      placeholderStyle={{ color: '#94a3b8' }}
                      data={sessions}
                      labelField="label"
                      valueField="value"
                      placeholder="Select Session"
                      value={value}
                      onChange={(item) => onChange(item.value)}
                    />
                  )}
                />
              </View>
            )}
          </View>
        )}

        <TouchableOpacity
          className={`mt-4 rounded-xl bg-blue-600 py-4 ${loading ? 'opacity-50' : ''}`}
          onPress={handleSubmit(onSubmit, onError)}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-center text-lg font-bold text-white">Sign Up</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/')} className="my-8">
          <Text className="text-center text-slate-500">
            Already have an account? <Text className="font-bold text-blue-600">Sign In</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default SignUpPage;
