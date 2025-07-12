import { post } from "@/http/request";

export type LoginRequest = {
  username: string;
  password: string;
};

export type reLoginRequest = {
  accessToken: string;
};

export type LoginResponse = {
  username: string;
  roles: string[];
  accessToken: string;
  refreshToken?: string;
};

export const login = async (data?: LoginRequest) => {
  return post<LoginResponse>({}, "/login", data);
};

export const refreshUserInfo = async (data?: reLoginRequest) => {
  return post<LoginResponse>({}, "/getUserInfo", data);
};
