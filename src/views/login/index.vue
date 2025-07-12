<template>
  <div class="login-container">
    <el-form :model="form" label-width="120px">
      <el-form-item label="用户名">
        <el-input v-model="form.username" />
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="form.password" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="login">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from "@/store/user";
import { ref } from "vue";

const form = ref({
  username: "",
  password: "",
});

const userStore = useUserStore();

const login = async () => {
  await userStore.storeUserLogin(form.value);
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
</style>
