import '../../global.css';
import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import PostEditor from '../../components/PostEditor';
import useImagePicker from '../../Hooks/useImagePicker';
import { ApiPost } from '../../types/feed';

const EditPost = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const axiosSecure = useAxiosSecure();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [content, setContent] = useState('');
  const [originalPhoto, setOriginalPhoto] = useState<string | null>(null);
  const [removePhoto, setRemovePhoto] = useState(false);

  const { photoUri, setPhotoUri, pickImage } = useImagePicker({ quality: 0.85 });

  useEffect(() => {
    if (photoUri) {
      setRemovePhoto(false);
    }
  }, [photoUri]);

  useEffect(() => {
    const loadPost = async () => {
      if (!id) return;
      try {
        const res = await axiosSecure.get(`/posts/${id}`);
        const post: ApiPost = res.data;
        setContent(post.content || '');
        setOriginalPhoto(post.photo || null);
        setPhotoUri(null);
        setRemovePhoto(false);
      } catch (error) {
        Alert.alert('Edit Error', 'Unable to load post.');
        router.back();
      } finally {
        setLoading(false);
      }
    };
    loadPost();
  }, [id, axiosSecure, router, setPhotoUri]);

  const onSave = async () => {
    if (!id) return;

    const trimmed = content.trim();
    const hasExistingPhoto = !!originalPhoto && !removePhoto;
    const hasNewPhoto = !!photoUri;

    if (!trimmed && !hasExistingPhoto && !hasNewPhoto) {
      Alert.alert('Missing content', 'Please add text or a photo.');
      return;
    }

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('content', trimmed);
      formData.append('removePhoto', removePhoto ? 'true' : 'false');

      if (photoUri) {
        formData.append('photo', {
          uri: photoUri,
          name: 'post.jpg',
          type: 'image/jpeg',
        } as any);
      }

      await axiosSecure.patch(`/posts/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      Alert.alert('Updated', 'Post updated successfully.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || 'Update failed.';
      Alert.alert('Edit Error', message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  const showPhoto = photoUri || (!removePhoto ? originalPhoto : null);

  return (
    <PostEditor
      title="Edit Post"
      subtitle="Update your post content or image."
      containerClassName="pt-16"
      content={content}
      onChangeContent={setContent}
      placeholder="Update your post..."
      photoUri={showPhoto}
      onPickPhoto={pickImage}
      showRemovePhoto={!!originalPhoto && !removePhoto && !photoUri}
      onRemovePhoto={() => {
        setPhotoUri(null);
        setRemovePhoto(true);
      }}
      primaryLabel="Save"
      primaryLoading={saving}
      onPrimaryPress={onSave}
      secondaryLabel="Cancel"
      onSecondaryPress={() => router.back()}
    />
  );
};

export default EditPost;
