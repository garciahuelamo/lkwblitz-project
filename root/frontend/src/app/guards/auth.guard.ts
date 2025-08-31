import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  if (typeof window === 'undefined') {
    // No hay ventana (ej. SSR), bloqueamos acceso o permitimos según lógica
    return router.createUrlTree(['/login']);
  }

  const token = localStorage.getItem('token');
  if (!token) {
    return router.createUrlTree(['/login']);
  }

  // Si quieres puedes validar el token aquí, pero para simplicidad solo checamos que exista
  return true;
};
