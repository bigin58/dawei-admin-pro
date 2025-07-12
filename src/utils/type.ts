export type BaseResponse<T = any> = {
  code: number;
  msg: string;
  data: T;
};