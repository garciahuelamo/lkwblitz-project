import { authGuard } from './auth.guard';
import { Router } from '@angular/router';
import { TestBed } from '@angular/core/testing';

describe('authGuard', () => {
    let routerSpy: jasmine.SpyObj<Router>;
    let createUrlTreeSpy: jasmine.Spy;

    beforeEach(() => {
        routerSpy = jasmine.createSpyObj('Router', ['createUrlTree']);
        const fakeUrlTree = {} as any;
        createUrlTreeSpy = routerSpy.createUrlTree.and.returnValue(fakeUrlTree);
        spyOn(window.localStorage, 'getItem');
        TestBed.configureTestingModule({
            providers: [
                { provide: Router, useValue: routerSpy }
            ]
        });
    });

    // Helper para ejecutar el guard con inyección
    const executeGuard = (route: any, state: any) => TestBed.runInInjectionContext(() => authGuard(route, state));

    it('debe redirigir a /login si no hay token en localStorage', () => {
        (window.localStorage.getItem as jasmine.Spy).and.returnValue(null);
        const result = executeGuard({} as any, {} as any);
        expect(routerSpy.createUrlTree).toHaveBeenCalledWith(['/login']);
        expect(result).toBe(routerSpy.createUrlTree.calls.mostRecent().returnValue);
    });

    it('debe redirigir a /login si el token está vacío', () => {
        (window.localStorage.getItem as jasmine.Spy).and.returnValue('');
        const result = executeGuard({} as any, {} as any);
        expect(routerSpy.createUrlTree).toHaveBeenCalledWith(['/login']);
        expect(result).toBe(routerSpy.createUrlTree.calls.mostRecent().returnValue);
    });

    it('debe permitir acceso si existe token válido en localStorage', () => {
        (window.localStorage.getItem as jasmine.Spy).and.returnValue('token123');
        const result = executeGuard({} as any, {} as any);
        expect(routerSpy.createUrlTree).not.toHaveBeenCalled();
        expect(result).toBeTrue();
    });

    it('debe permitir acceso si existe token (simulación de token inválido, solo existencia)', () => {
        (window.localStorage.getItem as jasmine.Spy).and.returnValue('invalid-token');
        const result = executeGuard({} as any, {} as any);
        expect(routerSpy.createUrlTree).not.toHaveBeenCalled();
        expect(result).toBeTrue();
    });

    // Test omitido: no se puede simular window undefined en este entorno

    it('debe retornar correctamente en todos los escenarios', () => {
        // Sin token
        (window.localStorage.getItem as jasmine.Spy).and.returnValue(null);
        expect(executeGuard({} as any, {} as any)).toBe(routerSpy.createUrlTree.calls.mostRecent().returnValue);

        // Token vacío
        (window.localStorage.getItem as jasmine.Spy).and.returnValue('');
        expect(executeGuard({} as any, {} as any)).toBe(routerSpy.createUrlTree.calls.mostRecent().returnValue);

        // Token válido
        (window.localStorage.getItem as jasmine.Spy).and.returnValue('token123');
        expect(executeGuard({} as any, {} as any)).toBeTrue();
    });
});
