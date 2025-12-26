import { useUserContext } from '../providers/UserContext';

const useUser = () => {
  const { userData } = useUserContext(); // Access the user data from global state

  return userData;
};

export default useUser;
