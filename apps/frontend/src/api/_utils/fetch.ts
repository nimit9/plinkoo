import { BASE_API_URL } from '@/const/routes';
import axios, { AxiosRequestConfig } from 'axios';

export const fetchGet = async (
  url: string,
  config?: AxiosRequestConfig<any>,
) => {
  const response = await axios.get(BASE_API_URL + url, config);
  return response.data;
};

export const fetchPost = (
  url: string,
  data: any,
  config?: AxiosRequestConfig<any>,
) => {
  return axios.post(BASE_API_URL + url, data, config);
};
