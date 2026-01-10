import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Image,
} from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { Dropdown } from 'react-native-element-dropdown';
import * as ImagePicker from 'expo-image-picker';

export type UserType = 'student' | 'teacher' | 'admin';
export type GenderType = '' | 'male' | 'female' | 'other';

export type ProfileFormData = {
  firstName: string;
  lastName: string;
  gender: GenderType;
  userType: UserType;
  Id?: string;
  department?: string;
  session?: string;
  photo?: string;
};

type ProfileFormProps = {
  initialValues?: Partial<ProfileFormData>;
  initialPhotoUri?: string | null;
  requirePhoto?: boolean;
  loading?: boolean;
  submitLabel?: string;
  onSubmit: (data: ProfileFormData, photoUri: string | null) => void;
};

const ProfileForm = ({
  initialValues,
  initialPhotoUri = null,
  requirePhoto = true,
  loading = false,
  submitLabel = 'Save',
  onSubmit,
}: ProfileFormProps) => {
  const [photoUri, setPhotoUri] = useState<string | null>(initialPhotoUri);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    setError,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm<ProfileFormData>({
    defaultValues: {
      firstName: '',
      lastName: '',
      gender: '',
      userType: 'student',
      Id: '',
      department: '',
      session: '',
      ...initialValues,
    },
  });

  // If parent loads data later (edit profile), update form.
  useEffect(() => {
    if (initialValues) {
      reset({
        firstName: '',
        lastName: '',
        gender: '',
        userType: 'student',
        Id: '',
        department: '',
        session: '',
        ...initialValues,
      });
    }
  }, [initialValues, reset]);

  useEffect(() => {
    setPhotoUri(initialPhotoUri || null);
  }, [initialPhotoUri]);

  const selectedUserType = watch('userType');

  useEffect(() => {
    setValue('Id', '');
    setValue('department', '');
    setValue('session', '');
  }, [selectedUserType, setValue]);

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

  const sessions = Array.from({ length: 2025 - 2003 + 1 }, (_, i) => {
    const year = 2025 - i;
    return { label: `${year}-${year + 1}`, value: `${year}-${year + 1}` };
  });

  const genders = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Other', value: 'other' },
  ];

  const pickPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
      clearErrors('photo');
    }
  };

  const submitHandler = (data: ProfileFormData) => {
    if (requirePhoto && !photoUri) {
      setError('photo', { type: 'required', message: 'Photo is required' });
      return;
    }
    onSubmit(data, photoUri);
  };

  const onError = () => {
    if (requirePhoto && !photoUri) {
      setError('photo', { type: 'required', message: 'Photo is required' });
    }
  };

  return (
    <ScrollView
      className="mt-8 mb-12"
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}>
      {photoUri ? (
        <Image
          source={{ uri: photoUri }}
          style={{
            width: 120,
            height: 120,
            borderRadius: 60,
            alignSelf: 'center',
            marginBottom: 12,
          }}
        />
      ) : null}

      <View className="mb-4">
        <TouchableOpacity
          onPress={pickPhoto}
          className="rounded-xl border border-slate-300 px-4 py-3">
          <Text className="text-center text-slate-600">
            {photoUri ? 'Photo Selected' : 'Select Profile Photo'}
          </Text>
        </TouchableOpacity>
        {errors.photo && <Text className="mt-1 text-xs text-red-500">{errors.photo.message}</Text>}
      </View>

      <View className="mb-4">
        <Text className="mb-2 font-semibold">First Name</Text>
        <Controller
          control={control}
          name="firstName"
          rules={{ required: 'First name is required' }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              className={`h-14 rounded-xl border px-4 ${errors.firstName ? 'border-red-500' : 'border-slate-300'}`}
              value={value}
              onChangeText={onChange}
              placeholder="First name"
            />
          )}
        />
        {errors.firstName && (
          <Text className="mt-1 text-xs text-red-500">{errors.firstName.message}</Text>
        )}
      </View>

      <View className="mb-4">
        <Text className="mb-2 font-semibold">Last Name</Text>
        <Controller
          control={control}
          name="lastName"
          rules={{ required: 'Last name is required' }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              className={`h-14 rounded-xl border px-4 ${errors.lastName ? 'border-red-500' : 'border-slate-300'}`}
              value={value}
              onChangeText={onChange}
              placeholder="Last name"
            />
          )}
        />
        {errors.lastName && (
          <Text className="mt-1 text-xs text-red-500">{errors.lastName.message}</Text>
        )}
      </View>

      <View className="mb-4">
        <Text className="mb-2 font-semibold">Gender</Text>
        <Controller
          control={control}
          name="gender"
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
                errors.gender && { borderColor: 'red' },
              ]}
              placeholderStyle={{ color: '#94a3b8' }}
              data={genders}
              labelField="label"
              valueField="value"
              placeholder="Select Gender"
              value={value}
              onChange={(item) => onChange(item.value)}
            />
          )}
        />
      </View>

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
              pattern: { value: /^[0-9]*$/, message: 'ID must be a number' },
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
        onPress={handleSubmit(submitHandler, onError)}
        disabled={loading}>
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-center text-lg font-bold text-white">{submitLabel}</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ProfileForm;
