import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'

// 正确引入 Tailwind（你已有的文件）
import './style.css'

import { useCartStore } from './store/cart'

const app = createApp(App)

// 初始化 Pinia
const pinia = createPinia()
app.use(pinia)

// 购物车每次运行自动清空
const cart = useCartStore()
cart.init()

// 挂载路由
app.use(router)

// 挂载应用
app.mount('#app')
