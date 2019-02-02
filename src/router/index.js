import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/pages/Home.vue'
import SignUp from '@/pages/SignUp.vue'
import Login from '@/pages/Login.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/sign-up',
      name: 'signup',
      component: SignUp
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    }
  ]
})
