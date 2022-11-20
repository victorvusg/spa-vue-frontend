
import { auth, employeePermission } from './middlewares';

export default [
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () =>
      import(/* webpackChunkName: "Dashboard" */ '@/views/Employee/Dashboard'),
  },
  {
    path: '/createCustomer',
    name: 'CreateNewCustomer',
    component: () =>
      import(
        /* webpackChunkName: "CreateNewCustomer" */ '@/components/customer/CreateNewCustomer'
      ),
  },
  {
    path: '/customer/:id',
    name: 'CustomerProfile',
    component: () =>
      import(
        /* webpackChunkName: "CustomerProfile" */ '@/views/Employee/CustomerProfile'
      ),
  },
  {
    path: '/customer/check-in/:customerId',
    name: 'Check-in',
    component: () =>
      import(/* webpackChunkName: "Checkin" */ '@/views/Employee/Checkin'),
  },
  {
    path: '/order/in-process',
    name: 'InProcessOrders',
    component: () =>
      import(
        /* webpackChunkName: "InProcessOrders" */ '@/views/Employee/InProcessOrders'
      ),
  },
  {
    path: '/intake',
    name: 'IntakeList',
    component: () =>
      import(/* webpackChunkName: "IntakeList" */ '@/views/Employee/IntakeList'),
  },
  {
    path: '/intake/:id',
    name: 'IntakeDetail',
    component: () =>
      import(/* webpackChunkName: "IntakeDetail" */ '@/views/Employee/IntakeDetail'),
  },
  {
    path: '/my-profile',
    name: 'MyProfile',
    component: () =>
      import(/* webpackChunkName: "MyProfile" */ '@/views/Employee/MyProfile'),
  },
  {
    path: '/buy-packs/:customerId',
    name: 'BuyPacks',
    component: () =>
      import(/* webpackChunkName: "BuyPacks" */ '@/views/Employee/BuyPacks'),
  },
  {
    path: '/cash-out',
    name: 'CashOut',
    component: () =>
      import(/* webpackChunkName: "CashOut" */ '@/views/Employee/CashOut'),
  },
]
.map((route) => ({
  ...route,
  meta: {
    middleware: [auth, employeePermission]
  },
}));
