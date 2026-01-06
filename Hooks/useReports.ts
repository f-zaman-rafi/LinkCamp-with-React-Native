import { useState } from 'react';
import { Alert } from 'react-native';
import useAxiosSecure from './useAxiosSecure';

const useReports = () => {
  const axiosSecure = useAxiosSecure();

  const [postReportOpen, setPostReportOpen] = useState(false);
  const [postReportReason, setPostReportReason] = useState('');

  const openPostReport = (postId: string) => {
    setPostReportReason('');
    setPostReportOpen(true);
  };

  const closePostReport = () => {
    setPostReportOpen(false);
    setPostReportReason('');
  };

  const quickPostReport = async (postId: string) => {
    try {
      await axiosSecure.post('/reports', { postId });
      Alert.alert('Reported', 'Thanks for your report.');
    } catch {
      Alert.alert('Report Error', 'Unable to submit report.');
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
    openPostReport,
    closePostReport,
    quickPostReport,
    quickCommentReport,
  };
};

export default useReports;
