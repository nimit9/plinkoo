import axios, { AxiosError } from 'axios';

export const setupInterceptors = ({ authErrCb }: { authErrCb: () => void }) => {
  axios.interceptors.request.use((config) => {
    return {
      ...config,
      withCredentials: true,
    };
  });

  axios.interceptors.response.use(
    (response) => {
      return Promise.resolve(response);
    },
    (error: AxiosError) => {
      if (error.response?.status === 401) {
        authErrCb();
      }
      return Promise.reject(error);
    },
  );
};
