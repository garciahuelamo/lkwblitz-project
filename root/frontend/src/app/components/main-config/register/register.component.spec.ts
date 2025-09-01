import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { AuthService } from '../../../services/service.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['register']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    spyOn(window.localStorage, 'setItem');
    await TestBed.configureTestingModule({
      imports: [RegisterComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debe registrar usuario y navegar al dashboard', () => {
    const mockResponse = { token: 'token123', user: { id: 1, name: 'Test', email: 'test@mail.com', role: 'user' } };
    authServiceSpy.register.and.returnValue(of(mockResponse));
    component.name = 'Test';
    component.email = 'test@mail.com';
    component.password = '123';
    component.onSubmit();
    expect(authServiceSpy.register).toHaveBeenCalledWith({ name: 'Test', email: 'test@mail.com', password: '123' });
    expect(window.localStorage.setItem).toHaveBeenCalledWith('token', 'token123');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
    expect(component.loading).toBeFalse();
  });

  it('debe manejar error en el registro', () => {
    authServiceSpy.register.and.returnValue(throwError(() => ({ error: { message: 'Error en el registro' } })));
    component.name = 'Test';
    component.email = 'test@mail.com';
    component.password = '123';
    component.onSubmit();
    expect(component.errorMessage).toBe('Error en el registro');
    expect(component.loading).toBeFalse();
  });
});
