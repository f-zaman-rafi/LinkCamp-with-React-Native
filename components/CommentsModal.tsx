import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Comment } from '../types/feed';
import Avatar from './Avatar';
import UserName from './UserName';
import ExpandableText from './ExpandableText';
import { formatRelativeTime } from '../utils/time';

type CommentsModalProps = {
  visible: boolean;
  onClose: () => void;
  comments: Comment[];
  loading: boolean;
  commentText: string;
  setCommentText: (text: string) => void;
  onSubmit: () => void;
  onOpenCommentActions: (comment: Comment) => void;
  isEditing: boolean;
  onCancelEdit: () => void;
  submitting?: boolean;
  title?: string;
};
const COMMENT_LIMIT = 500;
const MIN_INPUT_HEIGHT = 44;
const MAX_INPUT_HEIGHT = 160;

const CommentsModal = ({
  visible,
  onClose,
  comments,
  loading,
  commentText,
  setCommentText,
  onSubmit,
  onOpenCommentActions,
  isEditing,
  onCancelEdit,
  submitting = false,
  title = 'Comments',
}: CommentsModalProps) => {
  const [inputHeight, setInputHeight] = useState(MIN_INPUT_HEIGHT);
  const isAutoGrowEnabled = Platform.OS !== 'web';
  const insets = useSafeAreaInsets();
  const [androidKeyboardHeight, setAndroidKeyboardHeight] = useState(0);

  useEffect(() => {
    if (!commentText) {
      setInputHeight(MIN_INPUT_HEIGHT);
    }
  }, [commentText]);

  useEffect(() => {
    if (Platform.OS !== 'android') return;

    const showSub = Keyboard.addListener('keyboardDidShow', (event) => {
      setAndroidKeyboardHeight(event.endCoordinates?.height ?? 0);
    });
    const hideSub = Keyboard.addListener('keyboardDidHide', () => {
      setAndroidKeyboardHeight(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const modalContent = (
    <>
      <View className="flex-row items-center justify-between">
        <Text className="text-lg font-semibold">{title}</Text>
        <TouchableOpacity onPress={onClose}>
          <Ionicons name="close" size={22} color="#64748b" />
        </TouchableOpacity>
      </View>

      <View className="mt-4" style={{ flex: 1 }}>
        {loading ? (
          <View style={{ flex: 1 }} className="items-center justify-center">
            <ActivityIndicator color="#2563eb" />
          </View>
        ) : comments.length === 0 ? (
          <View style={{ flex: 1 }} className="items-center justify-center">
            <Text className="text-sm text-slate-500">No comments yet.</Text>
          </View>
        ) : (
          <FlatList
            style={{ flex: 1 }}
            data={comments}
            keyExtractor={(item) => item._id}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            renderItem={({ item }) => (
              <View className="mt-4 flex-row gap-3 border-b border-dashed border-slate-300 pb-4">
                <Avatar uri={item.user?.photo} size={32} />
                <View className="flex-1">
                  <View className="flex-row items-center justify-between pb-2">
                    <View className="flex items-start">
                      <UserName
                        name={item.user?.name}
                        role={(item.user as any)?.user_type}
                        nameClassName="text-sm font-semibold text-slate-800"
                        roleClassName="text-[10px] text-slate-500"
                      />
                      {item.createdAt ? (
                        <Text className="mt-1 text-right text-[10px] text-slate-400">
                          {formatRelativeTime(item.createdAt)}
                        </Text>
                      ) : null}
                    </View>

                    <TouchableOpacity onPress={() => onOpenCommentActions(item)}>
                      <Ionicons name="ellipsis-horizontal" size={16} color="#94a3b8" />
                    </TouchableOpacity>
                  </View>
                  <ExpandableText
                    text={item.content?.slice(0, 500)}
                    step={250}
                    className="text-sm text-slate-700"
                    buttonClassName="mt-1 text-xs font-semibold text-blue-600"
                  />
                </View>
              </View>
            )}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      {isEditing ? (
        <View className="mt-4 flex-row items-center justify-between rounded-xl bg-slate-100 px-3 py-2">
          <Text className="text-xs text-slate-600">Editing your comment</Text>
          <TouchableOpacity onPress={onCancelEdit}>
            <Text className="text-xs font-semibold text-blue-600">Cancel</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      <View
        className="mt-4"
        style={{
          marginBottom: Platform.OS === 'ios' ? Math.max(8, insets.bottom + 4) : 8,
        }}>
        <View className="flex-row items-center gap-2 border-t border-slate-100 pt-3">
          <TextInput
            className="flex-1 rounded-xl border border-slate-300 px-3 py-2"
            placeholder={isEditing ? 'Edit your comment...' : 'Write a comment...'}
            value={commentText}
            onChangeText={setCommentText}
            maxLength={COMMENT_LIMIT}
            multiline
            textAlignVertical="top"
            scrollEnabled={isAutoGrowEnabled ? inputHeight >= MAX_INPUT_HEIGHT : true}
            onContentSizeChange={
              isAutoGrowEnabled
                ? (event) => {
                    const nextHeight = Math.max(
                      MIN_INPUT_HEIGHT,
                      Math.min(MAX_INPUT_HEIGHT, Math.ceil(event.nativeEvent.contentSize.height))
                    );
                    setInputHeight((prev) => (Math.abs(prev - nextHeight) > 1 ? nextHeight : prev));
                  }
                : undefined
            }
            style={{
              minHeight: MIN_INPUT_HEIGHT,
              maxHeight: MAX_INPUT_HEIGHT,
              height: isAutoGrowEnabled ? inputHeight : undefined,
            }}
          />

          <TouchableOpacity onPress={onSubmit} disabled={submitting}>
            <Ionicons name="send" size={20} color={submitting ? '#94a3b8' : '#2563eb'} />
          </TouchableOpacity>
        </View>
        <Text
          className={`pt-2 pl-2 text-xs ${commentText.length >= COMMENT_LIMIT ? 'text-red-500' : 'text-slate-500'}`}>
          {commentText.length}/{COMMENT_LIMIT}
        </Text>
      </View>
    </>
  );

  const modalBody =
    Platform.OS === 'ios' ? (
      <KeyboardAvoidingView
        className="flex-1 bg-white px-4"
        behavior="padding"
        keyboardVerticalOffset={0}
        style={{ paddingTop: Math.max(16, insets.top + 8) }}>
        {modalContent}
      </KeyboardAvoidingView>
    ) : (
      <KeyboardAvoidingView
        className="flex-1 bg-white px-4"
        behavior={undefined}
        style={{
          paddingTop: Math.max(16, insets.top + 8),
          paddingBottom: androidKeyboardHeight > 0 ? androidKeyboardHeight : Math.max(8, insets.bottom + 4),
        }}>
        {modalContent}
      </KeyboardAvoidingView>
    );

  if (Platform.OS === 'web') {
    return (
      <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
        <View style={{ flex: 1, backgroundColor: '#e5e7eb' }}>
          <View style={{ width: '100%', maxWidth: 430, alignSelf: 'center', flex: 1 }}>
            {modalBody}
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent={Platform.OS === 'android'}>
      {modalBody}
    </Modal>
  );
};

export default CommentsModal;
