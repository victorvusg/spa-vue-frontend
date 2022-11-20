import { getSavedUser } from '@/helpers/auth.service';

export function unauthorized({ next, router }) {
  if (localStorage.getItem('token')) {
    return router.push({ name: 'Intake' });
  }
  return next();
}

export function auth({ next, router }) {
  if (!localStorage.getItem('token')) {
    return router.push({ name: 'Login' });
  }

  return next();
}

export function employeePermission({ next }) {
  const permission = ['admin','cashier', 'ktv'];
  const { role } = getSavedUser();
  if (!role || !permission.includes(role)) {
    next({ name: 'Error' });
    return;
  }
  return next();
}
// Creates a `nextMiddleware()` function which not only
// runs the default `next()` callback but also triggers
// the subsequent Middleware function.
export const nextFactory = (context, middleware, index) => {
  const subsequentMiddleware = middleware[index];
  // If no subsequent Middleware exists,
  // the default `next()` callback is returned.
  if (!subsequentMiddleware) return context.next;

  return (...parameters) => {
    // Run the default Vue Router `next()` callback first.
    context.next(...parameters);
    // Then run the subsequent Middleware with a new
    // `nextMiddleware()` callback.
    const nextMiddleware = nextFactory(context, middleware, index + 1);
    subsequentMiddleware({ ...context, next: nextMiddleware });
  };
};
