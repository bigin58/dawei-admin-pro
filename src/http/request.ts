import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { ElMessage } from "element-plus";
import { getMessageInfo } from "./status";
import { BaseResponse } from "@/utils/type";

const duration = 5 * 1000;

// 创建axios实例
const service = axios.create({
  baseURL: import.meta.env.VITE_APP_API_BASEURL,
  timeout: 15000,
});

// 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response.status === 200) {
      return response.data;
    }
    ElMessage({
      message: getMessageInfo(response.status),
      type: "error",
      duration,
    });
    return response.data;
  },
  (error: any) => {
    // 请求错误处理
    const { response } = error;
    if (response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      ElMessage({
        message: getMessageInfo(response.status),
        type: "error",
        duration,
      });
      return Promise.reject(response.data);
    } else {
      ElMessage({
        message: "连接到服务器失败",
        type: "error",
        duration,
      });
    }
  }
);

const requestInstance = <T = any>(config: AxiosRequestConfig): Promise<T> => {
  const conf = config;
  return new Promise((resolve, reject) => {
    service
      .request<any, AxiosResponse<BaseResponse>>(conf)
      .then((res: AxiosResponse<BaseResponse>) => {
        const { data } = res;
        if (data.code != 0) {
          ElMessage({
            message: data.msg,
            type: "error",
            duration,
          });
          reject(data.msg);
        } else {
          ElMessage({
            message: data.msg,
            type: "success",
            duration,
          });
          resolve(data.data as T);
        }
      });
  });
};

/**
 * 发送 GET 请求
 *
 * @param config Axios 配置对象
 * @param url 请求的 URL
 * @param params 请求参数（可选）
 * @returns 返回 Promise，解析结果为请求结果
 */
export function get<T = any, U = any>(
  config: AxiosRequestConfig,
  url: string,
  params?: U
): Promise<T> {
  return requestInstance<T>({
    ...config,
    url,
    method: "GET",
    params,
  });
}

/**
 * 发送POST请求的函数
 *
 * @param config Axios请求配置对象
 * @param url 请求的URL
 * @param data 发送的数据
 * @returns 返回一个Promise对象，解析后得到请求结果
 *
 * @template T 请求结果的类型，默认为any
 * @template U 发送数据的类型，默认为any
 */
export function post<T = any, U = any>(
  config: AxiosRequestConfig,
  url: string,
  data: U
): Promise<T> {
  return requestInstance<T>({
    ...config,
    url,
    method: "POST",
    data,
  });
}
