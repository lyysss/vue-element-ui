import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 导入ele-ui
import './plugins/element.js'
// 导入全局样式表
import './assets/css/global.css'
// 导入axios配置
import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 把axios 挂载到vue全局对象中。随时用http调用
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
