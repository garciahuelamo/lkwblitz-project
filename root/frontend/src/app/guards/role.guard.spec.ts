import { TestBed } from '@angular/core/testing';
import { CanActivateFn, Router } from '@angular/router';

import { roleGuard } from './role.guard';

describe('roleGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => roleGuard(...guardParameters));

  let routerSpy: jasmine.SpyObj<any>;
  let fakeUrlTree: any;

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['createUrlTree']);
    fakeUrlTree = {};
    routerSpy.createUrlTree.and.returnValue(fakeUrlTree);
    spyOn(window.localStorage, 'getItem');
    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: routerSpy }
      ]
    });
  });

  it('debe redirigir a /login si no hay usuario en localStorage', () => {
  (window.localStorage.getItem as jasmine.Spy).and.returnValue(null);
  const result = executeGuard({ data: { role: 'admin' } } as any, {} as any);
  expect(routerSpy.createUrlTree).toHaveBeenCalledWith(['/login']);
  expect(result).toBe(fakeUrlTree);
  });

  it('debe redirigir a /login si el usuario no tiene el rol esperado', () => {
  const user = { role: 'user' };
  (window.localStorage.getItem as jasmine.Spy).and.returnValue(JSON.stringify(user));
  const result = executeGuard({ data: { role: 'admin' } } as any, {} as any);
  expect(routerSpy.createUrlTree).toHaveBeenCalledWith(['/login']);
  expect(result).toBe(fakeUrlTree);
  });

  it('debe permitir acceso si el usuario tiene el rol esperado', () => {
  const user = { role: 'admin' };
  (window.localStorage.getItem as jasmine.Spy).and.returnValue(JSON.stringify(user));
  const result = executeGuard({ data: { role: 'admin' } } as any, {} as any);
  expect(result).toBeTrue();
  });

  // Test omitido: no se puede simular window undefined en este entorno
});
