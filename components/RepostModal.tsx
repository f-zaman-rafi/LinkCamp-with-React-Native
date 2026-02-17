import React from 'react';
import {
  Modal,
  Platform,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RepostPreview from './ReviewPreview';
import { ApiPost } from '../types/feed';

type RepostModalProps = {
  visible: boolean;
  thought: string;
  onChangeThought: (text: string) => void;
  onClose: () => void;
  onSubmit: () => void;
  loading?: boolean;
  title?: string;
  placeholder?: string;
  submitLabel?: string;
  previewPost?: ApiPost | null;
};

const THOUGHT_LIMIT = 500;

const RepostModal = ({
  visible,
  thought,
  onChangeThought,
  onClose,
  onSubmit,
  loading = false,
  title = 'Repost with Thought',
  placeholder = 'Add your thoughts...',
  submitLabel = 'Post Repost',
  previewPost = null,
}: RepostModalProps) => {
  const content = (
    <View
      style={
        Platform.OS === 'web'
          ? { width: '100%', maxWidth: 430, alignSelf: 'center', flex: 1, backgroundColor: 'white' }
          : { flex: 1, backgroundColor: 'white' }
      }>
      <View className="flex-1 px-4 pt-24">
        <View className="flex-row items-center justify-between">
          <Text className="text-lg font-semibold">{title}</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={22} color="#64748b" />
          </TouchableOpacity>
        </View>

        <ScrollView
          className="mt-4"
          contentContainerStyle={{ paddingBottom: 16 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <TextInput
            className="min-h-30 rounded-xl border border-slate-300 px-3 py-2"
            placeholder={placeholder}
            value={thought}
            onChangeText={onChangeThought}
            multiline
            maxLength={THOUGHT_LIMIT}
          />
          <Text
            className={`px-2 pt-2 text-xs ${thought.length >= THOUGHT_LIMIT ? 'text-red-500' : 'text-slate-500'}`}>
            {thought.length}/{THOUGHT_LIMIT}
          </Text>

          <RepostPreview post={previewPost || undefined} />
        </ScrollView>
      </View>

      <View className="border-t border-slate-200 bg-white px-4 pt-5 pb-10">
        <TouchableOpacity
          onPress={onSubmit}
          disabled={loading}
          className={`rounded-xl py-5 ${loading ? 'bg-slate-300' : 'bg-blue-600'}`}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-center font-semibold text-white">{submitLabel}</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType={Platform.OS === 'web' ? 'fade' : 'slide'}
      transparent={Platform.OS === 'web'}
      onRequestClose={onClose}>
      {Platform.OS === 'web' ? (
        <View style={{ flex: 1, backgroundColor: '#e5e7eb' }}>{content}</View>
      ) : (
        content
      )}
    </Modal>
  );
};

export default RepostModal;
