import Vue from 'vue'
import Router from 'vue-router'
import Todos from '@/components/Todos'
import Schedule from '@/components/Schedule'
import Login from '@/components/Auth/Login'
import Logout from '@/components/Auth/Logout'
import Registration from '@/components/Auth/Registration'
import AuthGuard from './auth-guard'

Vue.use(Router)

export default new Router({
  routes: [{
      path: '',
      name: 'todos',
      component: Todos
    },
    {
      path: '/schedule',
      name: 'schedule',
      component: Schedule,
      beforeEnter: AuthGuard
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/logout',
      name: 'logout',
      component: Logout
    },
    {
      path: '/registration',
      name: 'reg',
      component: Registration
    },
    {
      path: '*',
      redirect: '/'
    }
  ],
  mode: 'history'
})
