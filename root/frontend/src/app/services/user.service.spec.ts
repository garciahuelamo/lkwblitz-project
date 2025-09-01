import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { UserService, User } from './user.service';
import { of, throwError } from 'rxjs';

describe('UserService', () => {
  let service: UserService;
  let httpSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    httpSpy = jasmine.createSpyObj('HttpClient', ['get', 'delete', 'put']);
    TestBed.configureTestingModule({
      providers: [
        UserService,
        { provide: HttpClient, useValue: httpSpy }
      ]
    });
    service = TestBed.inject(UserService);
    spyOn(window.localStorage, 'getItem').and.returnValue('fake-token');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getUsers debe retornar usuarios', (done) => {
    const mockUsers: User[] = [
      { id: 1, name: 'Test', email: 'test@mail.com', role: 'admin' }
    ];
    httpSpy.get.and.returnValue(of(mockUsers));
    service.getUsers().subscribe(users => {
      expect(users).toEqual(mockUsers);
      expect(httpSpy.get).toHaveBeenCalled();
      done();
    });
  });

  it('deleteUser debe llamar a HttpClient.delete', (done) => {
    httpSpy.delete.and.returnValue(of(void 0));
    service.deleteUser(1).subscribe(result => {
      expect(httpSpy.delete).toHaveBeenCalledWith(jasmine.stringMatching('/delete-user/1'), jasmine.any(Object));
      done();
    });
  });

  it('updateUser debe llamar a HttpClient.put y retornar el usuario actualizado', (done) => {
    const user: User = { id: 1, name: 'Test', email: 'test@mail.com', role: 'admin' };
    httpSpy.put.and.returnValue(of(user));
    service.updateUser(user).subscribe(result => {
      expect(httpSpy.put).toHaveBeenCalledWith(jasmine.stringMatching('/update-user/1'), user, jasmine.any(Object));
      expect(result).toEqual(user);
      done();
    });
  });

  it('getAuthHeaders lanza error si no hay token', () => {
    (window.localStorage.getItem as jasmine.Spy).and.returnValue(null);
    expect(() => service['getAuthHeaders']()).toThrowError('No se encontró token de autenticación');
  });
});
