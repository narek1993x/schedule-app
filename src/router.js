import Vue from 'vue'
import Router from 'vue-router'
import Todos from './components/Todos'
import Login from '@/components/Auth/Login'
import Logout from '@/components/Auth/Logout'
import Registration from '@/components/Auth/Registration'

Vue.use(Router)

export default new Router({
  routes: [{
      path: '',
      name: 'todos',
      component: Todos
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
