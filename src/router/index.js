import {
  createWebHashHistory, createWebHistory, createRouter
} from 'vue-router';

import SignIn from '../components/pages/Auth/SignIn'
import NotFound from '../components/pages/404'
import Dashboard from '../components/pages/Dashboard'
import Shops from '../components/pages/Shops'
import AddShop from '../components/pages/Shops/add'
import Categories from '../components/pages/Categories'
import AddCategories from '../components/pages/Categories/add'
import AuthLayout from '../components/layouts/AuthLayout'
import IndexLayout from '../components/layouts/IndexLayout'

import middlewarePipeline from './middlewarePipeline'
import guest from './middleware/guest'
import auth from './middleware/auth'
import store from '../store'

const router = createRouter({
  routes: [
    {
      path: '/auth',
      component: AuthLayout,
      name: 'auth',
      redirect: () => {
        return { path: 'auth/sign-in'}
      },
      meta: {
        middleware: [
          guest
        ]
      },
      children: [
        {
          path: '/sign-in',
          name: 'SignIn',
          component: SignIn,
          meta: {
            middleware: [
              guest
            ]
          }
        }
      ]
    },
    {
      path: '',
      component: IndexLayout,
      meta: {
        middleware: [
          auth
        ]
      },
      redirect: e => {
        console.log(e);
        return { path: '/dashboard'}
      },
      children: [
        {
          path: '/dashboard',
          name: 'dashboard',
          component: Dashboard,
          meta: {
            middleware: [
              auth
            ]
          }
        },
        {
          path: '/shops',
          name: 'shops',
          component: Shops,
          meta: {
            middleware: [
              auth
            ]
          }
        },
        {
          path: '/shop/:id',
          name: 'shop_add',
          component: AddShop,
          meta: {
            middleware: [
              auth
            ]
          }
        },
        {
          path: '/categories',
          name: 'categories',
          component: Categories,
          meta: {
            middleware: [
              auth
            ]
          }
        },
        {
          path: '/category/:id',
          name: 'categories_add',
          component: AddCategories,
          meta: {
            middleware: [
              auth
            ]
          }
        },
      ]
    },
    {
      component: NotFound,
      name: 'not-found'
    }
  ],
  scrollBehavior () {
    return { x: 0, y: 0 }
  },
  history: process.env.NODE_ENV === 'production' ? createWebHistory() : createWebHashHistory(),
  linkActiveClass: 'active'
});

router.beforeEach((to, from, next) => {
  if (!to.meta.middleware) {
    return next()
  }
  const middleware = to.meta.middleware

  const context = {
    to,
    from,
    next,
    store
  }
  return middleware[0]({
    ...context,
    next: middlewarePipeline(context, middleware, 1)
  })
})

export default router
