import { useCallback, useEffect, useState } from 'react';
import useAxiosSecure from './useAxiosSecure';

export type ReportItem = any;

const useAdminReports = (type: 'posts' | 'comments', page = 1, limit = 20) => {
  const axiosSecure = useAxiosSecure();
  const [items, setItems] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    const url = type === 'posts' ? '/admin/reported-posts' : '/admin/reported-comments';
    const res = await axiosSecure.get(url, { params: { page, limit } });
    setItems(res.data?.items || []);
    setLoading(false);
  }, [axiosSecure, type, page, limit]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  return { items, loading, refresh: fetchReports };
};

export default useAdminReports;
