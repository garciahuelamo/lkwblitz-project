import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminHomeComponent } from './admin-home.component';
import { AuthService } from '../../../services/service.service';
import { Router, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('AdminHomeComponent', () => {
  let component: AdminHomeComponent;
  let fixture: ComponentFixture<AdminHomeComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getCurrentUser', 'logout']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    await TestBed.configureTestingModule({
      imports: [AdminHomeComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminHomeComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debe inicializar el usuario y avatar en ngOnInit', () => {
    const mockUser = { id: 1, name: 'Admin', email: 'admin@mail.com', role: 'admin', avatar: 'avatar.png' };
    authServiceSpy.getCurrentUser.and.returnValue(mockUser);
    component.ngOnInit();
    expect(component.userName).toBe('Admin');
    expect(component.userAvatar).toBe('assets/avatar.png');
  });

    it('debe usar avatar por defecto si el usuario no tiene avatar', () => {
      const mockUser = { id: 1, name: 'Admin', email: 'admin@mail.com', role: 'admin' };
      authServiceSpy.getCurrentUser.and.returnValue(mockUser);
      component.ngOnInit();
      expect(component.userAvatar).toBe('assets/default.png');
    });

    it('debe manejar usuario nulo en ngOnInit', () => {
      authServiceSpy.getCurrentUser.and.returnValue(null);
      component.ngOnInit();
      expect(component.userName).toBe('');
      expect(component.userAvatar).toBe('assets/default.png');
    });

  it('debe alternar el menú de usuario', () => {
    expect(component.userMenuOpen).toBeFalse();
    component.toggleUserMenu();
    expect(component.userMenuOpen).toBeTrue();
    component.toggleUserMenu();
    expect(component.userMenuOpen).toBeFalse();
  });

  it('debe navegar a la ruta relativa', () => {
  component.goTo('users');
  expect(routerSpy.navigate).toHaveBeenCalledWith(['users'], { relativeTo: jasmine.any(Object) });
  });

    it('no navega si la ruta es vacía', () => {
      component.goTo('');
      expect(routerSpy.navigate).not.toHaveBeenCalled();
    });

    it('no navega si la ruta es nula', () => {
      component.goTo(null as any);
      expect(routerSpy.navigate).not.toHaveBeenCalled();
    });

  it('debe llamar logout y navegar a /login', () => {
    component.logout();
    expect(authServiceSpy.logout).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

    it('debe manejar error en logout', () => {
      authServiceSpy.logout.and.throwError('error');
      expect(() => component.logout()).toThrowError('error');
    });

  it('debe limpiar el timer en ngOnDestroy', () => {
    spyOn(window, 'clearInterval');
    component['timer'] = 123;
    component.ngOnDestroy();
    expect(window.clearInterval).toHaveBeenCalledWith(123);
  });
});
