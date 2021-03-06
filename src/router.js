import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from './components/Login.vue'
import Home from './components/home.vue'
import Welcome from './components/Welcome.vue'
import Users from './components/user/users.vue'
import Rights from './components/power/Rights.vue'
import Roles from './components/power/Roles.vue'
import Cate from './components/goods/Cate.vue'
import City from './components/goods/City.vue'
import GoodsList from './components/goods/List.vue'
import Add from './components/goods/Add.vue'
import Order from './components/order/Order.vue'
import Report from './components/report/report.vue'
import lunbotu from './components/goods/lunbotu.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [{
    path: '/',
    redirect: '/login'
  }, {
    path: '/login',
    component: Login
  }, {
    path: '/Home',
    component: Home,
    redirect: '/welcome',
    children: [{
      path: '/welcome',
      component: Welcome
    }, {
      path: '/users',
      component: Users
    }, {
      path: '/Rights',
      component: Rights
    }, {
      path: '/Roles',
      component: Roles
    }, {
      path: '/goods/Cate',
      component: Cate
    }, {
      path: '/goods/City',
      component: City
    }, {
      path: '/goods/list',
      component: GoodsList
    }, {
      path: '/goods/add',
      component: Add
    }, {
      path: '/orders',
      component: Order
    }, {
      path: '/reports',
      component: Report
    }, {
      path: '/goods/lunbotu',
      component: lunbotu
    }]
  }]
})

// 导航守卫。判断是否有登录权限。从而允许与否进入权限页面
router.beforeEach((to, from, next) => {
  // 判断当前页面是否是login页面。是的话直接放行。
  if (to.path === '/login') return next()
  // 不是的话 就要获取token 判断是否登录与否，然而决定有没有权限进入登录后的页面
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
