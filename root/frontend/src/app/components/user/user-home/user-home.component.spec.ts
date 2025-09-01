import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserHomeComponent } from './user-home.component';
import { AuthService } from '../../../services/service.service';
import { Router } from '@angular/router';

describe('UserHomeComponent', () => {
  let component: UserHomeComponent;
  let fixture: ComponentFixture<UserHomeComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getCurrentUser', 'logout']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    await TestBed.configureTestingModule({
      imports: [UserHomeComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserHomeComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debe inicializar el usuario y avatar en ngOnInit', () => {
  const mockUser = { id: 1, name: 'Test', email: 'test@mail.com', role: 'admin', avatar: 'avatar.png' };
  authServiceSpy.getCurrentUser.and.returnValue(mockUser);
  component.ngOnInit();
  expect(component.userName).toBe('Test');
  expect(component.userAvatar).toBe('/assets/avatar.png');
  });

  it('debe alternar el menú de usuario', () => {
    expect(component.userMenuOpen).toBeFalse();
    component.toggleUserMenu();
    expect(component.userMenuOpen).toBeTrue();
    component.toggleUserMenu();
    expect(component.userMenuOpen).toBeFalse();
  });

  it('debe llamar logout y navegar a /login', () => {
    component.logout();
    expect(authServiceSpy.logout).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('debe navegar a la ruta de usuario', () => {
    component.goTo('orders');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/user/orders']);
  });

  it('debe limpiar el timer en ngOnDestroy', () => {
    spyOn(window, 'clearInterval');
    component['timer'] = 123;
    component.ngOnDestroy();
    expect(window.clearInterval).toHaveBeenCalledWith(123);
  });
});
