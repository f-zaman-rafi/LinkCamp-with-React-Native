import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';

export async function optimizeImageForUpload(uri: string) {
  return manipulateAsync(uri, [{ resize: { width: 1280 } }], {
    compress: 0.7,
    format: SaveFormat.JPEG,
  });
}
