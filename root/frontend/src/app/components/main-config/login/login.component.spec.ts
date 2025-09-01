import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../../services/service.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['login', 'register']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    spyOn(window.localStorage, 'setItem');
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debe iniciar sesión y navegar según el rol', () => {
    const mockResponse = { token: 'token123', user: { id: 1, name: 'Test', email: 'test@mail.com', role: 'admin' } };
    authServiceSpy.login.and.returnValue(of(mockResponse));
    component.loginForm.setValue({ email: 'test@mail.com', password: '123456', remember: false });
    component.onLoginSubmit();
    expect(authServiceSpy.login).toHaveBeenCalledWith({ email: 'test@mail.com', password: '123456', rememberMe: false });
    expect(window.localStorage.setItem).toHaveBeenCalledWith('token', 'token123');
    expect(window.localStorage.setItem).toHaveBeenCalledWith('userRole', 'admin');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/admin/home']);
    expect(component.loading).toBeFalse();
  });

  it('debe mostrar alerta si falla el login', () => {
    spyOn(window, 'alert');
    authServiceSpy.login.and.returnValue(throwError(() => ({ error: { message: 'Credenciales incorrectas' } })));
    component.loginForm.setValue({ email: 'test@mail.com', password: '123456', remember: false });
    component.onLoginSubmit();
    expect(window.alert).toHaveBeenCalledWith('Credenciales incorrectas');
    expect(component.loading).toBeFalse();
  });

  it('debe registrar usuario y mostrar alerta', () => {
    spyOn(window, 'alert');
    const mockResponse = { token: 'token123', user: { id: 1, name: 'Test', email: 'test@mail.com', role: 'user' } };
    authServiceSpy.register.and.returnValue(of(mockResponse));
    component.registerForm.setValue({ name: 'Test', email: 'test@mail.com', password: '123456', confirmPassword: '123456' });
    component.onRegisterSubmit();
    expect(authServiceSpy.register).toHaveBeenCalledWith({ name: 'Test', email: 'test@mail.com', password: '123456' });
    expect(window.alert).toHaveBeenCalledWith('Usuario registrado correctamente. Ahora puedes iniciar sesión.');
    expect(component.loading).toBeFalse();
  });

  it('debe mostrar alerta si las contraseñas no coinciden', () => {
    spyOn(window, 'alert');
    component.registerForm.setValue({ name: 'Test', email: 'test@mail.com', password: '123456', confirmPassword: '654321' });
    component.onRegisterSubmit();
    expect(window.alert).toHaveBeenCalledWith('Las contraseñas no coinciden');
  });

  it('debe mostrar alerta si falla el registro', () => {
    spyOn(window, 'alert');
    authServiceSpy.register.and.returnValue(throwError(() => ({ error: { message: 'Error al registrar usuario' } })));
    component.registerForm.setValue({ name: 'Test', email: 'test@mail.com', password: '123456', confirmPassword: '123456' });
    component.onRegisterSubmit();
    expect(window.alert).toHaveBeenCalledWith('Error al registrar usuario');
    expect(component.loading).toBeFalse();
  });
});
