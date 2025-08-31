import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const roleGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const expectedRole = route.data['role'];

  if (typeof window === 'undefined') {
    // No estamos en navegador, bloqueamos acceso o permitimos según tu lógica
    return router.createUrlTree(['/login']);
  }

  const userData = localStorage.getItem('user');
  if (!userData) {
    return router.createUrlTree(['/login']);
  }

  const user = JSON.parse(userData);
  if (user.role !== expectedRole) {
    return router.createUrlTree(['/login']);
  }

  return true;
};
