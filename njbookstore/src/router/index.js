import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/shikong',
    name: 'Shikong',
    component: () => import('../views/Shikong.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/shuyuan',
    name: 'Shuyuan',
    component: () => import('../views/Shuyuan.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/manyou',
    name: 'Manyou',
    component: () => import('../views/Manyou.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/shalong',
    name: 'Shalong',
    component: () => import('../views/Shalong.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/shalong/past',
    name: 'ShalongPast',
    component: () => import('../views/ShalongPast.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/shalong/future',
    name: 'ShalongFuture',
    component: () => import('../views/ShalongFuture.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/shalong/wish',
    name: 'ShalongWish',
    component: () => import('../views/ShalongWish.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../views/Profile.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 检查是否需要登录
  if (to.meta.requiresAuth) {
    const user = localStorage.getItem('user')
    if (!user || !JSON.parse(user).isLoggedIn) {
      // 未登录，重定向到登录页
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      // 已登录，允许访问
      next()
    }
  } else {
    // 不需要登录的页面，直接访问
    next()
  }
})

export default router
