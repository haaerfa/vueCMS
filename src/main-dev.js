import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import axios from 'axios'
import TreeTable from 'vue-table-with-tree-grid'
import QuillEditor from 'vue-quill-editor'

import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

Vue.component('tree-table', TreeTable)
Vue.use(QuillEditor)
Vue.config.productionTip = false

//配置axios
axios.defaults.baseURL = 'http://47.115.124.102:8888/api/private/v1/'
//设置axios请求拦截,验证token
axios.interceptors.request.use(config => {
  //为头对象添加token的验证的Authorization
  NProgress.start()
  config.headers.Authorization = sessionStorage.getItem('token')
  //一定要写return oconfig
  return config
})
//响应拦截
axios.interceptors.response.use(config=>{
  NProgress.done()
  return config
})

Vue.prototype.$http = axios
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')