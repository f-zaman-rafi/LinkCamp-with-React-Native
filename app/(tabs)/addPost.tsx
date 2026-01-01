import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import { useUserContext } from '../../providers/UserContext';
import { router } from 'expo-router';

type PostType = 'general' | 'teacher' | 'admin'; // 'general' for students, 'teacher' for teacher announcements, 'admin' for official notices

const AddPost = () => {
  const axiosSecure = useAxiosSecure();
  const { userData } = useUserContext();
  const [content, setContent] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [postType, setPostType] = useState<PostType>('general');

  const role = userData?.userType; // 'student' | 'teacher' | 'admin'

  // Define post type options based on user role
  const postTypeOptions: { label: string; value: PostType }[] =
    role === 'teacher'
      ? [
          { label: 'General Post', value: 'general' },
          { label: 'Teacher Announcement', value: 'teacher' },
        ]
      : role === 'admin'
        ? [
            { label: 'General Post', value: 'general' },
            { label: 'Official Notice', value: 'admin' },
          ]
        : [{ label: 'General Post', value: 'general' }];

  // Function to pick photo from library
  const pickPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  // Function to handle post submission
  const handlePost = async () => {
    if (!content.trim() && !photoUri) {
      Alert.alert('Missing content', 'Please add text or a photo.');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('content', content.trim());
      formData.append('postType', postType);

      if (photoUri) {
        formData.append('photo', {
          uri: photoUri,
          name: 'post.jpg',
          type: 'image/jpeg',
        } as any);
      }

      await axiosSecure.post('/user/post', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      Alert.alert('Success', 'Post created!');
      router.replace('/(tabs)');
      setContent('');
      setPhotoUri(null);
      setPostType('general');
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || 'Failed to create post.';
      Alert.alert('Post Error', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white px-6 pt-24">
      <Text className="text-2xl font-bold text-slate-800">Create Post</Text>
      <Text className="mt-1 text-slate-500">Share something with your campus.</Text>

      <View className="mt-6 flex-row items-center gap-3">
        {userData?.photo ? (
          <Image source={{ uri: userData.photo }} className="h-10 w-10 rounded-full" />
        ) : (
          <View className="h-10 w-10 rounded-full bg-slate-200" />
        )}
        <Text className="text-slate-700">{userData?.name || 'You'}</Text>
      </View>

      <TextInput
        className="mt-4 min-h-[120px] rounded-xl border border-slate-300 px-4 py-3 text-slate-800"
        placeholder="Write something..."
        multiline
        value={content}
        onChangeText={setContent}
      />

      {photoUri ? (
        <Image
          source={{ uri: photoUri }}
          style={{ width: '100%', height: 220, borderRadius: 12, marginTop: 12 }}
        />
      ) : null}

      <TouchableOpacity
        onPress={pickPhoto}
        className="mt-4 rounded-xl border border-slate-300 px-4 py-3">
        <Text className="text-center text-slate-600">
          {photoUri ? 'Change Photo' : 'Add Photo'}
        </Text>
      </TouchableOpacity>

      {role !== 'student' && (
        <View className="mt-4">
          <Text className="mb-2 font-semibold text-slate-700">Post As</Text>
          <View className="flex-row gap-3">
            {postTypeOptions.map((opt) => (
              <TouchableOpacity
                key={opt.value}
                className={`flex-1 rounded-xl border py-3 ${
                  postType === opt.value ? 'border-blue-600 bg-blue-50' : 'border-slate-300'
                }`}
                onPress={() => setPostType(opt.value)}>
                <Text
                  className={`text-center font-bold ${
                    postType === opt.value ? 'text-blue-600' : 'text-slate-500'
                  }`}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      <TouchableOpacity
        onPress={handlePost}
        className={`mt-6 rounded-xl py-4 ${loading ? 'bg-blue-300' : 'bg-blue-600'}`}
        disabled={loading}>
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-center text-lg font-bold text-white">Post</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default AddPost;
