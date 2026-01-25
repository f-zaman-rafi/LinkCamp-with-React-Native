import { useCallback, useEffect, useState } from 'react';
import useAxiosSecure from './useAxiosSecure';

export type AdminUser = {
  _id: string;
  name?: string;
  email?: string;
  userType?: string;
  verify?: string;
  photo?: string;
  department?: string;
  user_id?: string;
  session?: string;
};

type Params = {
  role?: string;
  verify?: string;
  page?: number;
  limit?: number;
  sort?: 'name_asc' | 'name_desc';
};

const useAdminUsers = (params: Params = {}) => {
  const axiosSecure = useAxiosSecure();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState<number | null>(null);

  const { role, verify, page = 1, limit = 20, sort = 'name_asc' } = params;

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const res = await axiosSecure.get('/admin/users', {
      params: { role, verify, page, limit, sort },
    });

    const data = res.data;
    const items = Array.isArray(data) ? data : data?.items || [];
    const totalCount = Array.isArray(data) ? null : (data?.total ?? null);

    setUsers(items);
    setTotal(totalCount);
    setLoading(false);
  }, [axiosSecure, role, verify, page, limit, sort]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const hasNext = users.length === limit;
  const hasPrev = page > 1;

  return {
    users,
    loading,
    total,
    hasNext,
    hasPrev,
    refresh: fetchUsers,
  };
};

export default useAdminUsers;
