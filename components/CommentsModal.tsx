import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Comment } from '../types/feed';
import Avatar from './Avatar';
import UserName from './UserName';
import ExpandableText from './ExpandableText';

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

        {loading ? (
          <View className="mt-4 items-center">
            <ActivityIndicator color="#2563eb" />
          </View>
        ) : comments.length === 0 ? (
          <View className="mt-6 flex-1 items-center justify-center">
            <Text className="text-sm text-slate-500">No comments yet.</Text>
          </View>
        ) : (
          <FlatList
            style={{ flex: 1 }}
            data={comments}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <View className="mt-4 flex-row gap-3">
                <Avatar uri={item.user?.photo} size={32} />
                <View className="flex-1">
                  <View className="flex-row items-center justify-between">
                    <UserName
                      name={item.user?.name}
                      role={(item.user as any)?.user_type}
                      nameClassName="text-sm font-semibold text-slate-800"
                      roleClassName="text-[10px] text-slate-500"
                    />

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

        {isEditing ? (
          <View className="mt-4 flex-row items-center justify-between rounded-xl bg-slate-100 px-3 py-2">
            <Text className="text-xs text-slate-600">Editing your comment</Text>
            <TouchableOpacity onPress={onCancelEdit}>
              <Text className="text-xs font-semibold text-blue-600">Cancel</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        <View className="mt-4 mb-12">
          <View className="flex-row items-center gap-2 border-t border-slate-100 pt-3">
            <TextInput
              className="flex-1 rounded-xl border border-slate-300 px-3 py-2"
              placeholder={isEditing ? 'Edit your comment...' : 'Write a comment...'}
              value={commentText}
              onChangeText={setCommentText}
              maxLength={COMMENT_LIMIT}
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
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default CommentsModal;
