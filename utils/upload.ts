import { Platform } from 'react-native';

export const getMultipartHeaders = () => {
  return Platform.OS === 'web' ? {} : { 'Content-Type': 'multipart/form-data' };
};

export const appendImageToFormData = async (
  formData: FormData,
  field: string,
  uri: string,
  name = 'photo.jpg',
  fallbackType = 'image/jpeg'
) => {
  if (!uri) return;

  if (Platform.OS === 'web') {
    const response = await fetch(uri);
    const blob = await response.blob();
    const type = blob.type || fallbackType;

    if (typeof File !== 'undefined') {
      formData.append(field, new File([blob], name, { type }));
    } else {
      // Fallback for environments without File
      formData.append(field, blob, name);
    }
    return;
  }

  formData.append(field, {
    uri,
    name,
    type: fallbackType,
  } as any);
};
