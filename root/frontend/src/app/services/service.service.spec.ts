import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { AuthService, User } from './service.service';
import { of } from 'rxjs';

describe('AuthService', () => {
  let service: AuthService;
  let httpSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    httpSpy = jasmine.createSpyObj('HttpClient', ['post', 'put']);
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: HttpClient, useValue: httpSpy }
      ]
    });
    service = TestBed.inject(AuthService);
    spyOn(window.localStorage, 'getItem').and.callFake((key: string) => {
      if (key === 'token') return 'fake-token';
      if (key === 'user') return JSON.stringify({ id: 1, name: 'Test', email: 'test@mail.com', role: 'admin' });
      return null;
    });
    spyOn(window.localStorage, 'setItem');
    spyOn(window.localStorage, 'removeItem');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('register debe guardar token y usuario en localStorage', (done) => {
    const mockResponse = { token: 'token123', user: { id: 1, name: 'Test', email: 'test@mail.com', role: 'admin' } };
    httpSpy.post.and.returnValue(of(mockResponse));
    service.register({ name: 'Test', email: 'test@mail.com', password: '123' }).subscribe(res => {
      expect(window.localStorage.setItem).toHaveBeenCalledWith('token', mockResponse.token);
      expect(window.localStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify(mockResponse.user));
      expect(res).toEqual(mockResponse);
      done();
    });
  });

  it('login debe guardar token y usuario en localStorage', (done) => {
    const mockResponse = { token: 'token123', user: { id: 1, name: 'Test', email: 'test@mail.com', role: 'admin' } };
    httpSpy.post.and.returnValue(of(mockResponse));
    service.login({ email: 'test@mail.com', password: '123' }).subscribe(res => {
      expect(window.localStorage.setItem).toHaveBeenCalledWith('token', mockResponse.token);
      expect(window.localStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify(mockResponse.user));
      expect(res).toEqual(mockResponse);
      done();
    });
  });

  it('getCurrentUser debe retornar el usuario almacenado', () => {
    const user = service.getCurrentUser();
    expect(user).toEqual({ id: 1, name: 'Test', email: 'test@mail.com', role: 'admin' });
  });

  it('updateUser debe actualizar el usuario en localStorage', (done) => {
    const updatedUser: User = { id: 1, name: 'Nuevo', email: 'nuevo@mail.com', role: 'admin' };
    httpSpy.put.and.returnValue(of(updatedUser));
    service.updateUser({ name: 'Nuevo' }).subscribe(user => {
      expect(window.localStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify(updatedUser));
      expect(user).toEqual(updatedUser);
      done();
    });
  });

  it('logout debe limpiar token y usuario en localStorage', () => {
    service.logout();
    expect(window.localStorage.removeItem).toHaveBeenCalledWith('token');
    expect(window.localStorage.removeItem).toHaveBeenCalledWith('user');
  });
});
