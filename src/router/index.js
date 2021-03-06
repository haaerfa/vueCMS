import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)
import Login from '../views/login/login.vue'
const Home = () => import('../views/home/Home.vue')
const Welcome = () => import('../views/home/Welcome.vue')
const Users = () => import('../views/home/user/Users.vue')
const Rights = () => import('../views/home/rights/Rights.vue')
const Roles = () => import('../views/home/rights/Roles.vue')
const GoodsCate = () => import('../views/category/GoodsCate.vue')
const CateParams = () => import('../views/category/CateParams.vue')
const GoodsList = () => import('../views/category/GoodsList.vue')
const AddGoods = () => import('../views/category/AddGoods.vue')
const Order = () => import('../views/order/Order.vue')
const Reports  = ()=>import('../views/reports/Reports.vue')
const routes = [{
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    children: [{
        path: '',
        redirect: 'welcome'
      },
      {
        path: 'welcome',
        component: Welcome
      },
      {
        path: 'users',
        component: Users
      },
      {
        path: 'rights',
        component: Rights
      },
      {
        path: 'roles',
        component: Roles
      },
      {
        path: 'categories',
        component: GoodsCate
      },
      {
        path: 'params',
        component: CateParams
      },
      {
        path: 'goods',
        component: GoodsList,
      },
      {
        path: 'goods/add',
        component: AddGoods
      },
      {
        path: 'orders',
        component: Order
      },
      {
        path:'reports',
        component:Reports
      }
    ]
  }

]

const router = new VueRouter({
  routes,
  mode: 'history'
})
//设置导航守卫 没有登陆不能访问其他页面
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const token = sessionStorage.getItem('token')
  if (!token) return next('/login')
  next()
})
export default router