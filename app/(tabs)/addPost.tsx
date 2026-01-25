import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { router } from 'expo-router';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import { useUserContext } from '../../providers/UserContext';
import PostEditor from '../../components/PostEditor';
import useImagePicker from '../../Hooks/useImagePicker';
import { PostType as FeedPostType } from '../../types/feed';
import Avatar from '../../components/Avatar';

type PostType = Exclude<FeedPostType, 'repost'>;

const AddPost = () => {
  const axiosSecure = useAxiosSecure();
  const { userData } = useUserContext();

  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [postType, setPostType] = useState<PostType>('general');

  const { photoUri, setPhotoUri, pickImage } = useImagePicker({ quality: 0.8 });

  const role = userData?.userType;
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
      const code = error?.response?.data?.code;
      if (code !== 'ACCOUNT_PENDING') {
        const message =
          error?.response?.data?.message || error?.message || 'Failed to create post.';
        Alert.alert('Post Error', message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView>
      <PostEditor
        title="Create Post"
        subtitle="Share something with your campus."
        content={content}
        onChangeContent={setContent}
        photoUri={photoUri}
        onPickPhoto={pickImage}
        primaryLabel="Post"
        primaryLoading={loading}
        onPrimaryPress={handlePost}
        topSlot={
          <View className="mt-6 flex-row items-center gap-3">
            <Avatar uri={userData?.photo} size={40} />
            <Text className="text-slate-700">{userData?.name || 'You'}</Text>
          </View>
        }
        bottomSlot={
          role !== 'student' ? (
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
          ) : null
        }
      />
    </ScrollView>
  );
};

export default AddPost;
