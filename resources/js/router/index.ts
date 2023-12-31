import {createWebHistory, createRouter} from 'vue-router'
import {RouteRecordRaw} from 'vue-router'

import BaseLayout from '../layouts/BaseLayout.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Главная',
    component: () => BaseLayout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Статистика',
        component: () => import('../pages/Dashboard.vue'),
      },
      {
        path: 'bots',
        name: 'Телеграм боты',
        component: () => import('../layouts/PageLayout.vue'),
        children: [
          {
            path: '',
            component: () => import('../pages/TelegramBots.vue')
          },
          {
            path: ':botId',
            name: 'Рассылки',
            component: () => import('../pages/TelegramMailings.vue'),
          },
        ]
      },
      {
        path: 'settings',
        name: 'Настройки',
        component: () => import('../pages/Settings.vue'),
      },
      {
        path: 'logs',
        name: 'Логи',
        component: () => import('../pages/Logs.vue'),
      },
      {
        path: 'block/chats',
        name: 'Заблокированные чаты',
        component: () => import('../pages/BlockChats.vue'),
      }
    ]
  },
  {
    path: '/login',
    name: 'Авторизация',
    component: () =>
      import('../pages/Login.vue'),
  },
  {
    path: '/404',
    name: 'Страница не найдена',
    component: () =>
      import('../pages/Page404.vue'),
  },
  {
    path: '/:catchAll(.*)',
    redirect: '/404',
  }
]

const router = createRouter({
  history: createWebHistory('/admin'),
  routes,
  scrollBehavior() {
    return {top: 0}
  }
})

router.beforeEach((to, from, next) => {
  const authUser = localStorage.getItem('tokens')
  const publicPages = ['/login', '/404']
  const authRequired = !publicPages.includes(to.path)

  if (authRequired && !authUser) {
    next('/login')
  }
  if (to.path === '/login' && authUser) {
    return next('/')
  }
  next()
})

export default router
