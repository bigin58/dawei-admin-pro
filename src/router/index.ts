import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

export const aboutRouter = {
  path: "/about",
  name: "about",
  component: () => import("@/views/about/index.vue"),
} as RouteRecordRaw;

// 配置路由  RouteRecordRaw 路由记录
// import.meta.glob 为 vite 提供的特殊导入方式
// 它可以将模块中全部内容导入并返回一个Record对象
// 默认为懒加载模式 加入配置项 eager 取消懒加载
const routes: Array<RouteRecordRaw> = [];
const modules: Record<string, any> = import.meta.glob("./modules/*.ts", {
  eager: true,
});
Object.keys(modules).forEach((key) => {
  const module = modules[key];
  const route = module.default;
  routes.push(route);
});

routes.push(aboutRouter);

// 创建路由
const router = createRouter({
  history: createWebHashHistory(), // 路由模式 hash
  routes,
});

// 路由守卫
router.beforeEach(async (_to, _from, next) => {
  NProgress.start(); // 开始加载进度条
  next(); // 继续执行
});

router.afterEach((_to) => {
  NProgress.done(); // 结束加载进度条
});

export default router;
