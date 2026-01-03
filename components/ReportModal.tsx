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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type ReportModalProps = {
  visible: boolean;
  title: string;
  description?: string;
  reason: string;
  onChangeReason: (text: string) => void;
  onClose: () => void;
  onSubmit: () => void;
  loading?: boolean;
  submitLabel?: string;
  placeholder?: string;
};

const ReportModal = ({
  visible,
  title,
  description,
  reason,
  onChangeReason,
  onClose,
  onSubmit,
  loading = false,
  submitLabel = 'Submit Report',
  placeholder = 'Write a short reason...',
}: ReportModalProps) => {
  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        className="flex-1 bg-white px-4 pt-20"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View className="flex-row items-center justify-between">
          <Text className="text-lg font-semibold">{title}</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={22} color="#64748b" />
          </TouchableOpacity>
        </View>

        {description ? <Text className="mt-3 text-sm text-slate-600">{description}</Text> : null}

        <TextInput
          className="mt-4 min-h-[120px] rounded-xl border border-slate-300 px-3 py-2"
          placeholder={placeholder}
          value={reason}
          onChangeText={onChangeReason}
          multiline
        />

        <TouchableOpacity
          onPress={onSubmit}
          disabled={loading}
          className={`mt-4 rounded-xl py-3 ${loading ? 'bg-slate-300' : 'bg-red-500'}`}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-center font-semibold text-white">{submitLabel}</Text>
          )}
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default ReportModal;
