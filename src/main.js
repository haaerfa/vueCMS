import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import axios from 'axios'
import TreeTable from 'vue-table-with-tree-grid'

Vue.component('tree-table', TreeTable)

Vue.config.productionTip = false

//配置axios
axios.defaults.baseURL = 'http://timemeetyou.com:8889/api/private/v1/'
//设置axios请求拦截,验证token
axios.interceptors.request.use(config => {
  //为头对象添加token的验证的Authorization
  config.headers.Authorization = sessionStorage.getItem('token')
  //一定要写return oconfig
  return config
})
Vue.prototype.$http = axios
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')