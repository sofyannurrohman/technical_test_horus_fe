import { createRouter, createWebHistory } from 'vue-router'

import SigninView from '@/views/Authentication/SigninView.vue'
import SignupView from '@/views/Authentication/SignupView.vue'

import TablesView from '@/views/TablesView.vue'
import VoucherView from '@/views/Voucher/VoucherView.vue'
import VoucherClaimView from '@/views/VoucherClaim/VoucherClaimView.vue'

const routes = [
  {
    path: '/',
    redirect: '/auth/signin'
  },
  {
    path: '/dashboard',
    name: 'Voucher',
    component: VoucherView,
    meta: {
      title: 'Dashboard Dashboard',
      requiresAuth:true
    }
  },
  {
    path: '/voucher-claims',
    name: 'User Voucher Claim',
    component: VoucherClaimView,
    meta: {
      title: 'User Voucher Claim',
      requiresAuth:true
    }
  },
  
  {
    path: '/auth/signin',
    name: 'signin',
    component: SigninView,
    meta: {
      title: 'Signin'
    }
  },
  {
    path: '/auth/signup',
    name: 'signup',
    component: SignupView,
    meta: {
      title: 'Signup'
    }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 }
  }
})

router.beforeEach((to, from, next) => {
  document.title = `Vue.js ${to.meta.title} | Horus`
  const token = localStorage.getItem('token');
  if (to.matched.some((record) => record.meta.requiresAuth) && !token) {
    next('/auth/signin');
  } else {
    next();
  }
})

export default router
