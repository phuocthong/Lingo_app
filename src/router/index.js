import { defineRouter } from '#q-app/wrappers'
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from 'vue-router'
import routes from './routes'
import { auth } from '../utils/auth'

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default defineRouter(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
  })

  // Add navigation guards
  Router.beforeEach((to, from, next) => {
    const isAuthenticated = auth.isLoggedIn()
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

    if (requiresAuth && !isAuthenticated) {
      // Redirect to login page if authentication is required but user is not logged in
      next('/login')
    } else if ((to.path === '/login' || to.path === '/register') && isAuthenticated) {
      // Redirect to dashboard if user is already logged in and trying to access auth pages
      next('/dashboard')
    } else {
      next()
    }
  })

  return Router
})
