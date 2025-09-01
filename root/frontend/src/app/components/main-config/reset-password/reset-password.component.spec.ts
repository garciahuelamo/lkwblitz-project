import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResetPasswordComponent } from './reset-password.component';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';

describe('ResetPasswordComponent', () => {
  let component: ResetPasswordComponent;
  let fixture: ComponentFixture<ResetPasswordComponent>;
  let routeSpy: any;
  let httpSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(async () => {
    routeSpy = { snapshot: { paramMap: { get: (key: string) => key === 'token' ? 'abc123' : null } } };
    httpSpy = jasmine.createSpyObj('HttpClient', ['post']);
    await TestBed.configureTestingModule({
      imports: [ResetPasswordComponent],
      providers: [
        { provide: ActivatedRoute, useValue: routeSpy },
        { provide: HttpClient, useValue: httpSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ResetPasswordComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debe obtener el token desde la ruta', () => {
    expect(component.token).toBe('abc123');
  });

  it('debe actualizar la contraseña correctamente', () => {
    httpSpy.post.and.returnValue(of({ message: 'Contraseña actualizada.' }));
    component.password = 'nuevaClave';
    component.resetPassword();
    expect(httpSpy.post).toHaveBeenCalledWith('http://localhost:3000/reset-password', { token: 'abc123', newPassword: 'nuevaClave' });
    expect(component.message).toBe('Contraseña actualizada.');
  });

  it('debe mostrar mensaje de error si falla el reset', () => {
    httpSpy.post.and.returnValue(throwError(() => ({ error: { message: 'Error actualizando contraseña.' } })));
    component.password = 'nuevaClave';
    component.resetPassword();
    expect(component.message).toBe('Error actualizando contraseña.');
  });
});
