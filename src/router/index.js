import Vue from 'vue';
import VueRouter from 'vue-router';
import { nextFactory, unauthorized } from './middlewares';
import MainComponent from '@/views/Main';
import LoginComponent from '@/views/Login';
import ErrorComponent from '@/views/Error';
import employeeRoutes from '@/router/employeeRoutes';
import reviewerRoutes from '@/router/reviewerRoutes';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    component: MainComponent,
    children: [
      {
        path: '/',
        name: 'Home',
        component: () =>
          import(/* webpackChunkName: "Dashboard" */ '@/views/Home'),
      },
      ...employeeRoutes,
      ...reviewerRoutes
    ],
  },
   {
    path: '/login',
    name: 'Login',
    component: LoginComponent,
    meta: {
      middleware: [unauthorized]
    },
  },
  {
    path: '/error',
    name: 'Error',
    component: ErrorComponent,
  },
  {
    path: '*',
    redirect: '/error',
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
});

router.beforeEach((to, from, next) => {
  if (to.meta.middleware) {
    const middleware = Array.isArray(to.meta.middleware)
      ? to.meta.middleware
      : [to.meta.middleware];

    const context = {
      from,
      next,
      router,
      to,
    };
    const nextMiddleware = nextFactory(context, middleware, 1);

    return middleware[0]({ ...context, next: nextMiddleware });
  }

  return next();
});

export default router;
