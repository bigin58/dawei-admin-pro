import { defineStore } from "pinia";
import pinia from "@/store";
import { login, refreshUserInfo } from "@/api/user";

export type UserState = {
  username: string;
  accessToken: string;
  refreshToken?: string;
  roles: string[];
};

export type LoginRequest = {
  username: string;
  password: string;
};

export const useUserStoreHook = defineStore("userInfo", {
  state: (): UserState => ({
    username: "",
    accessToken: "",
    refreshToken: "",
    roles: [],
  }),
  getters: {}, // getters 用于计算属性
  actions: {
    storeUserLogin(data: LoginRequest) {
      return login(data).then((res) => {
        this.username = res.username;
        this.accessToken = res.accessToken;
        this.refreshToken = res.refreshToken;
        this.roles = res.roles;
        return res;
      });
    },
    storeRefreshToken() {
      if (this.username === "admin" && this.accessToken) {
        return refreshUserInfo({ accessToken: this.accessToken })
          .then((res) => {
            this.accessToken = res.accessToken;
            this.refreshToken = res.refreshToken;
            this.roles = res.roles;
            return res;
          })
          .catch(() => {
            this.accessToken = "";
          });
      }
    },
  },
  persist: {
    key: "userInfo",
    storage: sessionStorage,
    pick: ["accessToken"], // 指定需要持久化的属性
  },
});

export function useUserStore() {
  return useUserStoreHook(pinia);
}
