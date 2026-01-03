import '../../global.css';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import useAxiosSecure from '../../Hooks/useAxiosSecure';

type ApiPost = {
  _id: string;
  content?: string;
  photo?: string;
  postType?: string;
};

const EditPost = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const axiosSecure = useAxiosSecure();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [content, setContent] = useState('');
  const [originalPhoto, setOriginalPhoto] = useState<string | null>(null);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [removePhoto, setRemovePhoto] = useState(false);

  useEffect(() => {
    const loadPost = async () => {
      if (!id) return;
      try {
        const res = await axiosSecure.get(`/posts/${id}`);
        const post: ApiPost = res.data;
        setContent(post.content || '');
        setOriginalPhoto(post.photo || null);
      } catch (error) {
        Alert.alert('Edit Error', 'Unable to load post.');
        router.back();
      } finally {
        setLoading(false);
      }
    };
    loadPost();
  }, [id, axiosSecure, router]);

  const pickPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.85,
    });

    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
      setRemovePhoto(false);
    }
  };

  const removeCurrentPhoto = () => {
    setPhotoUri(null);
    setRemovePhoto(true);
  };

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
    <View className="flex-1 bg-white px-6 pt-16">
      <Text className="text-2xl font-bold text-slate-800">Edit Post</Text>
      <Text className="mt-1 text-slate-500">Update your post content or image.</Text>

      <TextInput
        className="mt-4 min-h-[140px] rounded-xl border border-slate-300 px-4 py-3 text-slate-800"
        placeholder="Update your post..."
        multiline
        scrollEnabled
        textAlignVertical="top"
        style={{ height: 160 }}
        value={content}
        onChangeText={setContent}
      />

      {showPhoto ? (
        <Image source={{ uri: showPhoto }} className="mt-4 h-56 w-full rounded-2xl" />
      ) : null}

      <TouchableOpacity
        onPress={pickPhoto}
        className="mt-4 rounded-xl border border-slate-300 px-4 py-3">
        <Text className="text-center text-slate-600">
          {photoUri ? 'Change Photo' : 'Add New Photo'}
        </Text>
      </TouchableOpacity>

      {originalPhoto && !removePhoto && !photoUri ? (
        <TouchableOpacity
          onPress={removeCurrentPhoto}
          className="mt-3 rounded-xl border border-red-300 px-4 py-3">
          <Text className="text-center text-red-500">Remove Current Photo</Text>
        </TouchableOpacity>
      ) : null}

      <View className="mt-6 flex-row gap-3">
        <TouchableOpacity
          onPress={() => router.back()}
          className="flex-1 rounded-xl border border-slate-300 py-3">
          <Text className="text-center text-slate-600">Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onSave}
          disabled={saving}
          className={`flex-1 rounded-xl py-3 ${saving ? 'bg-blue-300' : 'bg-blue-600'}`}>
          <Text className="text-center font-semibold text-white">
            {saving ? 'Saving...' : 'Save'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EditPost;
