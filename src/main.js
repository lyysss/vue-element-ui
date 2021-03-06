import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 导入ele-ui
import './plugins/element.js'
// 导入全局样式表
import './assets/css/global.css'

// 导入table-with-tree-grid 额外组件表单折叠
import TreeTable from 'vue-table-with-tree-grid'
// 导入axios配置
import axios from 'axios'

// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

Vue.prototype.serviceImg = 'http://dk5800.com/'

axios.defaults.baseURL = 'http://111.229.5.86:6600/'
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
// 挂载到vue全局对象中。加载一个拦截器。因为API调用需要请求头中包含token值，才证明有权限，修改里面的数据
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
// 把axios 挂载到vue全局对象中。随时用http调用
Vue.prototype.$http = axios

Vue.config.productionTip = false
Vue.use(VueQuillEditor)

// 注册table-with-tree-grid表单折叠
Vue.component('tree-table', TreeTable)

// 定义时间过滤器 用竖线调用
Vue.filter('dateFormat', function (time) {
  const dt = new Date(time)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDay() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
