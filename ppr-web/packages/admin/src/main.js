import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import './style.css'; // 引入全局样式
import App from './App.vue';
import { router } from './router';
import { pinia } from './store';
createApp(App).use(pinia).use(router).use(ElementPlus).mount('#app');
//# sourceMappingURL=main.js.map