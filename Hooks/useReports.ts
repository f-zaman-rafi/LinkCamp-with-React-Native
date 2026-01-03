import { useState } from 'react';
import { Alert } from 'react-native';
import useAxiosSecure from './useAxiosSecure';

const useReports = () => {
  const axiosSecure = useAxiosSecure();

  const [postReportOpen, setPostReportOpen] = useState(false);
  const [postReportId, setPostReportId] = useState<string | null>(null);
  const [postReportReason, setPostReportReason] = useState('');
  const [postReportLoading, setPostReportLoading] = useState(false);

  const [commentReportOpen, setCommentReportOpen] = useState(false);
  const [commentReportId, setCommentReportId] = useState<string | null>(null);
  const [commentReportReason, setCommentReportReason] = useState('');
  const [commentReportLoading, setCommentReportLoading] = useState(false);

  const openPostReport = (postId: string) => {
    setPostReportId(postId);
    setPostReportReason('');
    setPostReportOpen(true);
  };

  const closePostReport = () => {
    setPostReportOpen(false);
    setPostReportId(null);
    setPostReportReason('');
  };

  const submitPostReport = async () => {
    if (!postReportId) return;
    setPostReportLoading(true);
    try {
      await axiosSecure.post('/reports', {
        postId: postReportId,
        reason: postReportReason.trim() || undefined,
      });
      Alert.alert('Reported', 'Thanks for your report.');
      closePostReport();
    } catch {
      Alert.alert('Report Error', 'Unable to submit report.');
    } finally {
      setPostReportLoading(false);
    }
  };

  const quickPostReport = async (postId: string) => {
    try {
      await axiosSecure.post('/reports', { postId });
      Alert.alert('Reported', 'Thanks for your report.');
    } catch {
      Alert.alert('Report Error', 'Unable to submit report.');
    }
  };

  const openCommentReport = (commentId: string) => {
    setCommentReportId(commentId);
    setCommentReportReason('');
    setCommentReportOpen(true);
  };

  const closeCommentReport = () => {
    setCommentReportOpen(false);
    setCommentReportId(null);
    setCommentReportReason('');
  };

  const submitCommentReport = async () => {
    if (!commentReportId) return;
    setCommentReportLoading(true);
    try {
      await axiosSecure.post('/comment-reports', {
        commentId: commentReportId,
        reason: commentReportReason.trim() || undefined,
      });
      Alert.alert('Reported', 'Thanks for your report.');
      closeCommentReport();
    } catch {
      Alert.alert('Report Error', 'Unable to submit report.');
    } finally {
      setCommentReportLoading(false);
    }
  };

  const quickCommentReport = async (commentId: string) => {
    try {
      await axiosSecure.post('/comment-reports', { commentId });
      Alert.alert('Reported', 'Thanks for your report.');
    } catch {
      Alert.alert('Report Error', 'Unable to submit report.');
    }
  };

  return {
    postReportOpen,
    postReportReason,
    setPostReportReason,
    postReportLoading,
    openPostReport,
    closePostReport,
    submitPostReport,
    quickPostReport,
    commentReportOpen,
    commentReportReason,
    setCommentReportReason,
    commentReportLoading,
    openCommentReport,
    closeCommentReport,
    submitCommentReport,
    quickCommentReport,
  };
};

export default useReports;
