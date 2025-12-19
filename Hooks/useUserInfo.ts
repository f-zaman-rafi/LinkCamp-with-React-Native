import { useQuery, UseQueryResult } from '@tanstack/react-query';
import useAuth from './useAuth';
import useAxiosCommon from './useAxiosCommon';

// Define the shape of your User data
export interface UserData {
  _id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  verify: 'pending' | 'approved';
  image?: string;
}

const useUserInfo = () => {
  const axiosSecure = useAxiosCommon();
  const { user } = useAuth();

  const {
    data: userInfo,
    isLoading,
    refetch,
  }: UseQueryResult<UserData, Error> = useQuery({
    queryKey: ['user', user?.email],
    queryFn: async (): Promise<UserData> => {
      const res = await axiosSecure.get(`/user/${user?.email}`);
      return res.data;
    },
    enabled: !!user?.email,
    staleTime: 1000 * 60 * 5,
  });

  return { userInfo, isLoading, refetch };
};

export default useUserInfo;
