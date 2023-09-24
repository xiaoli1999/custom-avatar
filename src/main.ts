import { createApp } from 'vue'
import App from './App.vue'
import './styles/index.less'
/* 单独引入message css */
import 'element-plus/es/components/message/style/css'

const app = createApp(App)
app.mount('#app')

console.log('%c 定制头像🌈 | 黎 | https://github.com/xiaoli1999/custom-avatar', 'color: #f4f4f4;background: #444; padding:5px 0;border-radius:2px;')

