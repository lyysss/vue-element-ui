import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from './components/login.vue'
import Home from './components/home.vue'

Vue.use(VueRouter)

const router = new VueRouter({
    routes: [
        {
            path: '/',
            redirect: '/login'
        }, {
            path: '/login',
            component: Login
        }, {
            path: '/home',
            component: Home
        }
    ]
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
