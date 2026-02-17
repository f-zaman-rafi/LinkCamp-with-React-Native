import { useState } from 'react';
import { Alert, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

type ImagePickerOptions = {
  allowsEditing?: boolean;
  quality?: number;
  mediaTypes?: ImagePicker.MediaTypeOptions;
};

const useImagePicker = (options: ImagePickerOptions = {}) => {
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  const pickImage = async () => {
    if (Platform.OS !== 'web') {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permission.status !== 'granted') {
        Alert.alert('Permission required', 'Please allow photo access to continue.');
        return;
      }
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: options.mediaTypes ?? ImagePicker.MediaTypeOptions.Images,
      allowsEditing: options.allowsEditing ?? true,
      quality: options.quality ?? 0.8,
    });

    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const clearImage = () => setPhotoUri(null);

  return { photoUri, setPhotoUri, pickImage, clearImage };
};

export default useImagePicker;
