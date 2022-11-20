import { auth } from './middlewares';

export default [
  {
    path: '/receipt',
    name: 'Receipt',
    component: () =>
      import(
        /* webpackChunkName: "ReviewerIndexComponent" */ '@/views/Reviewer/Index'
      ),
  },
  {
    path: '/receipt/intake/:id',
    name: 'IntakeReceipt',
    component: () =>
      import(
        /* webpackChunkName: "IntakeReceiptComponent" */ '@/views/Reviewer/IntakeReceipt'
      ),
  },
  {
    path: '/receipt/intake/:id/review',
    name: 'ReviewIntake',
    component: () =>
      import(
        /* webpackChunkName: "ReviewIntakeComponent" */ '@/views/Reviewer/ReviewIntake'
      ),
  },
  {
    path: '/receipt/deposit/:id',
    name: 'DepositReceipt',
    component: () =>
      import(
        /* webpackChunkName: "DepositReceiptComponent" */ '@/views/Reviewer/DepositReceipt'
      ),
  },
].map((route) => ({
  ...route,
  meta: {
    middleware: [auth],
  },
}));
