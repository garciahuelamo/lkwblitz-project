import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ForgotPasswordComponent } from './forgot-password.component';
import { HttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';

describe('ForgotPasswordComponent', () => {
  let component: ForgotPasswordComponent;
  let fixture: ComponentFixture<ForgotPasswordComponent>;
  let httpSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(async () => {
    httpSpy = jasmine.createSpyObj('HttpClient', ['post']);
    await TestBed.configureTestingModule({
      imports: [ForgotPasswordComponent],
      providers: [
        { provide: HttpClient, useValue: httpSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ForgotPasswordComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debe enviar email de recuperación correctamente', () => {
    httpSpy.post.and.returnValue(of({ message: 'Email enviado.' }));
    component.email = 'test@mail.com';
    component.sendResetEmail();
    expect(httpSpy.post).toHaveBeenCalledWith('http://localhost:3000/forgot-password', { email: 'test@mail.com' });
    expect(component.message).toBe('Email enviado.');
  });

  it('debe mostrar mensaje de error si falla el envío', () => {
    httpSpy.post.and.returnValue(throwError(() => ({ error: { message: 'Error enviando email.' } })));
    component.email = 'test@mail.com';
    component.sendResetEmail();
    expect(component.message).toBe('Error enviando email.');
  });
});
