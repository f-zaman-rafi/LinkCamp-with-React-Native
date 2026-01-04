import React from 'react';
import {
  Modal,
  KeyboardAvoidingView,
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
  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <ScrollView>
        <KeyboardAvoidingView
          className="mb-12 flex-1 bg-white px-4 pt-24"
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View className="flex-row items-center justify-between">
            <Text className="text-lg font-semibold">{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={22} color="#64748b" />
            </TouchableOpacity>
          </View>

          <TextInput
            className="mt-4 min-h-[120px] rounded-xl border border-slate-300 px-3 py-2"
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

          <TouchableOpacity
            onPress={onSubmit}
            disabled={loading}
            className={`mt-4 rounded-xl py-3 ${loading ? 'bg-slate-300' : 'bg-blue-600'}`}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-center font-semibold text-white">{submitLabel}</Text>
            )}
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </ScrollView>
    </Modal>
  );
};

export default RepostModal;
