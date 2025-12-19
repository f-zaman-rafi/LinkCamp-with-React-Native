import axios, { AxiosInstance } from 'axios';

// Create instance using the prefixed env variable
const axiosCommon: AxiosInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
});

const useAxiosCommon = (): AxiosInstance => {
  return axiosCommon;
};

export default useAxiosCommon;
