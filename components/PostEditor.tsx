import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Image } from 'react-native';

type PostEditorProps = {
  title: string;
  subtitle?: string;
  content: string;
  onChangeContent: (text: string) => void;
  placeholder?: string;
  photoUri?: string | null;
  onPickPhoto: () => void;
  pickLabel?: string;
  showRemovePhoto?: boolean;
  onRemovePhoto?: () => void;
  removeLabel?: string;
  primaryLabel: string;
  onPrimaryPress: () => void;
  primaryLoading?: boolean;
  secondaryLabel?: string;
  onSecondaryPress?: () => void;
  containerClassName?: string;
  topSlot?: React.ReactNode;
  bottomSlot?: React.ReactNode;
};
const POST_LIMIT = 2000;

const PostEditor = ({
  title,
  subtitle,
  content,
  onChangeContent,
  placeholder = 'Write something...',
  photoUri,
  onPickPhoto,
  pickLabel,
  showRemovePhoto = false,
  onRemovePhoto,
  removeLabel = 'Remove Current Photo',
  primaryLabel,
  onPrimaryPress,
  primaryLoading = false,
  secondaryLabel,
  onSecondaryPress,
  containerClassName = 'pt-10',
  topSlot,
  bottomSlot,
}: PostEditorProps) => {
  const renderActions = () => {
    if (secondaryLabel && onSecondaryPress) {
      return (
        <View className="mt-6 flex-row gap-3">
          <TouchableOpacity
            onPress={onSecondaryPress}
            className="flex-1 rounded-xl bg-stone-800 py-3">
            <Text className="text-center text-white">{secondaryLabel}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onPrimaryPress}
            disabled={primaryLoading}
            className={`flex-1 rounded-xl py-3 ${primaryLoading ? 'bg-red-300' : 'bg-red-600'}`}>
            {primaryLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-center font-semibold text-white">{primaryLabel}</Text>
            )}
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <TouchableOpacity
        onPress={onPrimaryPress}
        disabled={primaryLoading}
        className={`mt-6 rounded-xl py-4 ${primaryLoading ? 'bg-red-300' : 'bg-red-600'}`}>
        {primaryLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-center text-lg font-bold text-white">{primaryLabel}</Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View className={`flex-1 bg-white px-6 ${containerClassName}`}>
      <Text className="text-2xl font-bold text-slate-800">{title}</Text>
      {subtitle ? <Text className="mt-1 text-slate-500">{subtitle}</Text> : null}

      {topSlot}

      <TextInput
        className="mt-4 min-h-30 rounded-xl border border-slate-300 px-4 py-3 text-slate-800"
        placeholder={placeholder}
        multiline
        scrollEnabled
        textAlignVertical="top"
        style={{ height: 160 }}
        value={content}
        onChangeText={onChangeContent}
        maxLength={POST_LIMIT}
      />
      <Text
        className={`mt-1 px-2 pt-2 text-xs ${content.length >= POST_LIMIT ? 'text-red-500' : 'text-slate-500'}`}>
        {content.length}/{POST_LIMIT}
      </Text>

      {photoUri ? (
        <Image
          source={{ uri: photoUri }}
          style={{ width: '100%', height: 220, borderRadius: 12, marginTop: 12 }}
        />
      ) : null}

      <TouchableOpacity
        onPress={onPickPhoto}
        className="mt-4 rounded-xl border border-slate-300 px-4 py-3">
        <Text className="text-center text-slate-600">
          {pickLabel ?? (photoUri ? 'Change Photo' : 'Add Photo')}
        </Text>
      </TouchableOpacity>

      {showRemovePhoto && onRemovePhoto ? (
        <TouchableOpacity
          onPress={onRemovePhoto}
          className="mt-3 rounded-xl border border-red-300 px-4 py-3">
          <Text className="text-center text-red-500">{removeLabel}</Text>
        </TouchableOpacity>
      ) : null}

      {bottomSlot}

      {renderActions()}
    </View>
  );
};

export default PostEditor;
