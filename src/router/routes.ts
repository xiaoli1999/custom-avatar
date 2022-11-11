import { RouteRecordRaw } from 'vue-router'

export const routes: Array<RouteRecordRaw> = [
    {
        name: 'home',
        path: '/',
        component: () => import(/* @vite-ignore 首页 */ '../views/Home.vue')
    },
    {
        name: '关于我们',
        path: '/about',
        component: () => import(/* @vite-ignore 关于我们 */ '../views/About.vue')
    }
]
