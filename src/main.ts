import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import './styles/index.less'
import 'element-plus/dist/index.css'

const app = createApp(App)
app.use(ElementPlus).mount('#app')

console.log('%c 🐇年春节头像定制🌈 | 黎 | https://github.com/xiaoli1999/custom-rabbitImage ', 'color: #f4f4f4;background: #444; padding:5px 0;border-radius:2px;')

